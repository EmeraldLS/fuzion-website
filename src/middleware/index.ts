import { supabase } from "@/lib/supabase";
import { defineMiddleware } from "astro:middleware";
import micromatch from "micromatch";

const protectedRoutes = ["/admin(|/)"];
const redirectRoutes = ["/login(|/)", "/register(|/)"];

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect, request, clientAddress }, next) => {
    const accessibleIPS = import.meta.env.AccessibleIPS.split(",") || [];
    const userIP = clientAddress;

    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      if (!accessibleIPS.includes(userIP)) {
        return redirect("/404");
      }
    }

    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (!accessToken || !refreshToken) {
        return redirect("/login");
      }

      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      if (error) {
        cookies.delete("sb-access-token", {
          path: "/",
        });
        cookies.delete("sb-refresh-token", {
          path: "/",
        });
        return redirect("/login");
      }

      locals.email = data.user?.email!;
      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
    }

    if (micromatch.isMatch(url.pathname, redirectRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (accessToken && refreshToken) {
        return redirect("/admin");
      }
    }

    return next();
  }
);

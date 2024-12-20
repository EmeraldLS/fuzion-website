import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import micromatch from "micromatch";

const protectedRoutes = ["/admin(|/)"];

export const POST: APIRoute = async ({
  request,
  redirect,
  cookies,
  clientAddress,
  url,
  locals,
}) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return redirect(`/login?error=Email and password are required`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });

  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });

  return redirect("/admin");
};

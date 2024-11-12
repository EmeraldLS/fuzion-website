import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect("/login?loggedOut=true");
};

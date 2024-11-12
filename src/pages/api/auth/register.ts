import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fname = formData.get("fname")?.toString();
    const lname = formData.get("lname")?.toString();
    const fullname = `${fname} ${lname}`;

    if (!email || !password || !fullname) {
      return redirect(
        `/register?error=${encodeURIComponent("There are missing fields")}`
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullname,
        },
      },
    });

    if (error) {
      return redirect(`/register?error=${encodeURIComponent(error.message)}`);
    }

    return redirect("/verifymail?email=" + encodeURIComponent(email));
  } catch (err) {
    return redirect(
      `/register?error=${encodeURIComponent("An error occured, please try again")}`
    );
  }
};

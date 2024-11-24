import { supabase } from "@/lib/supabase";

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return {
    ...session.user,
    ...profile,
  };
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export async function registerWorker(
  fname: string,
  lname: string,
  email: string,
  password: string
) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    throw new Error("Only admins can register workers");
  }

  const fullname = `${fname} ${lname}`;

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullname,
      },
    },
  });

  if (signUpError || !user) {
    throw signUpError || new Error("Failed to create user");
  }

  const { error: fnError } = await supabase.rpc("register_worker", {
    worker_email: email,
    worker_password: password,
    admin_id: admin.id,
  });

  if (fnError) {
    throw fnError;
  }

  return user;
}

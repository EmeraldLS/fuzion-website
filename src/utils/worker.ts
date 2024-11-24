import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/utils/auth";

export async function getMyWorkers() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    throw new Error("Only admins can view their workers");
  }

  const { data: assignments, error } = await supabase
    .from("worker_assignments")
    .select(
      `
        worker_id,
        workers:profiles!worker_id(
          id,
          email
        )
      `
    )
    .eq("admin_id", admin.id);

  if (error) {
    throw error;
  }

  return assignments;
}

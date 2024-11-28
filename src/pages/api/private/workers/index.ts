import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/utils/auth";
import type { APIRoute } from "astro";

async function getMyWorkers() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    throw new Error("Only admins can view their workers");
  }

  const { data: assignments, error } = await supabase
    .from("worker_assignments")
    .select(
      `
        worker_id,
        users:profiles!worker_id(
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

export const GET: APIRoute = async () => {
  try {
    const data = await getMyWorkers();
    return new Response(
      JSON.stringify({
        workers: data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching workers",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

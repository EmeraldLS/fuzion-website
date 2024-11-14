import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const isNew = url.searchParams.get("is_new") === "true";

  try {
    const [{ count }, { data }] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq(isNew ? "is_new" : "", true),
      supabase
        .from("products")
        .select("*")
        .eq(isNew ? "is_new" : "", true)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    if (!data) {
      throw new Error("Failed to fetch products");
    }

    return new Response(
      JSON.stringify({
        products: data,
        total: count,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching products",
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

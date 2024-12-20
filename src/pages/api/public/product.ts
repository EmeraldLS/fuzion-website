import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const category = url.searchParams.get("category") || null;
  const offset = (page - 1) * limit;

  try {
    const [{ count }, { data }] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .match(category ? { category } : {}),
      supabase
        .from("products")
        .select("*")
        .match(category ? { category } : {})
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
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

import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    const [{ count }, { data }] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*")
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

export const DELETE: APIRoute = async ({ request }) => {
  const id = request.url.split("/").pop();

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: "Product deleted successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while deleting the product",
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

export const POST: APIRoute = async ({ request }) => {
  const {
    id,
    price,
    isNew,
    name,
    imageUrl,
    rating,
    discountPercent,
    description,
    category,
    specifications: { size, motor, blade, pump, coating },
  } = await request.json();

  const datatoInsert = {
    product_id: id,
    price,
    is_new: isNew,
    name,
    image_url: imageUrl,
    rating,
    discount_percent: discountPercent,
    description,
    size,
    motor,
    blade,
    pump,
    coating,
    category,
  };
  console.log(datatoInsert);
  const { data, error } = await supabase
    .from("products")
    .insert(datatoInsert)
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify(data));
};

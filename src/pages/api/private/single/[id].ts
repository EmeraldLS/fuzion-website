import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!product) {
      return new Response(
        JSON.stringify({
          error: "Product not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching the product",
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

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;

  try {
    const body = await request.json();

    const requiredFields = ["name", "price", "description"] as const;
    const missingFields = requiredFields.filter((field) => !(field in body));

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (typeof body.price !== "number" || body.price <= 0) {
      return new Response(
        JSON.stringify({
          error: "Price must be a positive number",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (body.specifications) {
      const requiredSpecs = [
        "size",
        "motor",
        "blade",
        "pump",
        "coating",
      ] as const;
      const missingSpecs = requiredSpecs.filter(
        (spec) => !(spec in body.specifications)
      );

      if (missingSpecs.length > 0) {
        return new Response(
          JSON.stringify({
            error: `Missing required specifications: ${missingSpecs.join(
              ", "
            )}`,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    const datatoUpdate = {
      price: body.price,
      is_new: body.isNew ?? false,
      name: body.name,
      rating: body.rating ?? 0,
      discount_percent: body.discountPercent ?? 0,
      description: body.description,
      size: body.specifications.size,
      motor: body.specifications.motor,
      blade: body.specifications.blade,
      pump: body.specifications.pump,
      coating: body.specifications.coating,
      category: body.category,
    };

    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update(datatoUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: "Product updated successfully",
        product: updatedProduct,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while updating the product",
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

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

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

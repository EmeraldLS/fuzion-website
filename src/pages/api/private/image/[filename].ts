import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = "uploads";

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const filename = params.filename;

    if (!filename) {
      return new Response("Filename is required", { status: 400 });
    }

    if (filename.includes("..") || filename.startsWith("/")) {
      return new Response("Invalid filename", { status: 400 });
    }

    const { data: fileExists } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list("images", {
        limit: 1,
        search: filename,
      });

    if (!fileExists || fileExists.length === 0) {
      return new Response("File not found", { status: 404 });
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filename]);

    if (error) {
      console.error("Error deleting file:", error);
      return new Response(JSON.stringify({ error: "Failed to delete file" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

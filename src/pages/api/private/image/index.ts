import type { APIRoute } from "astro";
import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = "uploads"; // Replace with your bucket name

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage using admin client
    const { data, error } = await supabaseAdmin.storage
      .from(`${BUCKET_NAME}/images`)
      .upload(uniqueFilename, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return new Response(JSON.stringify({ error: "Failed to upload file" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from(`${BUCKET_NAME}/images`)
      .getPublicUrl(uniqueFilename);

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully!",
        filePath: publicUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error handling upload:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const GET: APIRoute = async () => {
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list("images", { limit: 100 });

    if (error) {
      console.error("Error listing files:", error);
      return new Response(JSON.stringify({ error: "Failed to list files" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(files), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling list request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

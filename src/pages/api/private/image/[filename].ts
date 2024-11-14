import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const filename = params.filename;

    if (!filename) {
      return new Response("Filename is required", { status: 400 });
    }

    if (filename.includes("..") || filename.includes("/")) {
      return new Response("Invalid filename", { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsDir, filename);

    try {
      await fs.access(filePath, fs.constants.F_OK);
    } catch {
      return new Response("File not found", { status: 404 });
    }

    await fs.unlink(filePath).catch((error) => {
      console.error("Error deleting file:", error);
      throw error;
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

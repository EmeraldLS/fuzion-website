import type { APIRoute } from "astro";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const fileExtension = path.extname(file.name);
  const uniqueFilename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, uniqueFilename);

  const fileStream = fs.createWriteStream(filePath);
  const fileReader = file.stream().getReader();

  let done = false;
  while (!done) {
    const { done: isDone, value } = await fileReader.read();
    done = isDone;
    if (value) fileStream.write(value);
  }
  fileStream.end();

  const relativePath = path.relative(process.cwd(), filePath);

  return new Response(
    JSON.stringify({
      message: "File uploaded successfully!",
      filePath: relativePath.replace(/\\/g, "/"),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const GET: APIRoute = async () => {
  const files = fs.readdirSync(UPLOAD_DIR);
  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

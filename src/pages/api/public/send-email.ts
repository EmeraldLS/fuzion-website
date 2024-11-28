import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  const formdata = await request.formData();
  const to = formdata.get("to");
  const subject = formdata?.get("subject");
  const text = formdata?.get("text");

  if (!to || !subject || !text) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return new Response(
        JSON.stringify({
          error:
            "Something is not allowing this to work. Please try again later",
        }),
        {
          status: 500,
        }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOpts: nodemailer.TransportOptions = {};

    // @ts-ignore
    transporter.sendMail(mailOpts, (err, data) => {
      if (err) {
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
          status: 500,
        });
      }
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, E-Mail und Nachricht sind erforderlich." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const host = Deno.env.get("SMTP_HOST")!;
    const port = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const user = Deno.env.get("SMTP_USER")!;
    const pass = Deno.env.get("SMTP_PASS")!;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const htmlBody = `
      <h2>Neue Kontaktanfrage über MietFleet</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">E-Mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Unternehmen</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(company)}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Nachricht</td><td style="padding:8px;white-space:pre-wrap">${esc(message)}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: user,
      to: "info@mietfleet.de",
      subject: `Kontaktanfrage von ${name}`,
      text: `Neue Kontaktanfrage:\n\nName: ${name}\nE-Mail: ${email}\n${company ? `Unternehmen: ${company}\n` : ""}Nachricht:\n${message}`,
      html: htmlBody,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SMTP error:", error);
    return new Response(
      JSON.stringify({ error: "E-Mail konnte nicht gesendet werden." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

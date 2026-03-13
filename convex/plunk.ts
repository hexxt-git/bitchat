import { Email } from "@convex-dev/auth/providers/Email";

/**
 * Plunk email provider for Convex Auth.
 * @see https://www.useplunk.com/
 */
export const PlunkEmail = Email({
  id: "plunk",
  name: "Plunk",
  from: process.env.PLUNK_FROM ?? "noreply@example.com",
  maxAge: 60 * 60, // 1 hour
  apiKey: process.env.PLUNK_API_KEY,
  async sendVerificationRequest(params) {
    const { identifier: to, provider, url } = params;
    const { host } = new URL(url);
    const apiKey = provider.apiKey;
    if (!apiKey) {
      throw new Error(
        "Plunk API key is required. Set PLUNK_API_KEY in Convex environment variables.",
      );
    }
    const fromStr =
      typeof provider.from === "string"
        ? provider.from
        : (process.env.PLUNK_FROM ?? "noreply@example.com");
    const fromMatch = fromStr.match(/<([^>]+)>/);
    const fromEmail = fromMatch ? fromMatch[1].trim() : fromStr;
    const fromName = fromMatch
      ? fromStr.replace(/<[^>]+>/, "").trim()
      : (provider.name ?? "8-bit Chat");

    const res = await fetch("https://api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to,
        from: fromEmail,
        name: fromName,
        subject: `Verify your email to sign in to ${host}`,
        body: html({ url, host }),
        type: "html",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Plunk error: ${res.status} ${JSON.stringify(err)}`);
    }
  },
});

function html(params: { url: string; host: string }) {
  const { url, host } = params;
  return `<p>Verify your email to sign in to ${host}:</p>
<p><a href="${url}">${url}</a></p>
<p>If you didn't request this, ignore it.</p>`;
}

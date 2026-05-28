import { json } from "./_shared.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return json({ ok: false, error: "Missing video task id." }, 400);
  }

  if (!env.GEEKNOW_API_KEY) {
    return json({ ok: false, error: "GEEKNOW_API_KEY is not configured." }, 503);
  }

  const baseUrl = (env.GEEKNOW_API_BASE_URL || "https://www.geeknow.top").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/v1/videos/${encodeURIComponent(id)}`, {
    headers: {
      authorization: `Bearer ${env.GEEKNOW_API_KEY}`
    }
  });

  const text = await response.text();
  let data = { raw: text };
  try {
    data = JSON.parse(text);
  } catch {
    // Keep raw text for non-JSON provider responses.
  }

  return json({
    ok: response.ok,
    status: response.status,
    data
  }, response.ok ? 200 : response.status);
}

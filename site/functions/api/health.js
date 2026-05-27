import { json } from "./_shared.js";

export async function onRequestGet() {
  return json({ ok: true, service: "ai-comic-drama-workbench", time: new Date().toISOString() });
}

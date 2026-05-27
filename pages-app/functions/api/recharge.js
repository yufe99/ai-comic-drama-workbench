import { json, parseRechargeCodes, readJson, signWallet } from "./_shared.js";

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const code = String(body.code || "").trim();
  const codes = parseRechargeCodes(env);
  const points = Number(codes[code] || 0);

  if (!code || !points) {
    return json({ ok: false, error: "充值码无效或未配置。" }, 401);
  }

  const wallet = {
    id: crypto.randomUUID(),
    balance: points,
    source: "manual-recharge-code",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
  };

  if (env.AI_DRAMA_KV) {
    await env.AI_DRAMA_KV.put(`wallet:${wallet.id}`, JSON.stringify(wallet), {
      expirationTtl: 60 * 60 * 24 * 30
    });
  }

  return json({
    ok: true,
    walletToken: await signWallet(env, wallet),
    balance: wallet.balance,
    expiresAt: wallet.expiresAt
  });
}

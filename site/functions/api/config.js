import { json, missingProvider, modelCatalog } from "./_shared.js";

export async function onRequestGet({ env }) {
  const models = Object.fromEntries(
    Object.entries(modelCatalog).map(([id, config]) => [
      id,
      {
        type: config.type,
        duration: config.duration || null,
        cost: config.cost || null,
        configured: missingProvider(env, id).length === 0
      }
    ])
  );

  return json({
    ok: true,
    walletMode: env.AI_DRAMA_KV ? "kv" : "signed-token",
    models,
    requiredEnv: [
      "APP_SECRET",
      "RECHARGE_CODES",
      "SORA2_API_URL",
      "SORA2_API_KEY",
      "SEEDANCE_API_URL",
      "SEEDANCE_API_KEY",
      "DEEPSEEK_API_URL",
      "DEEPSEEK_API_KEY",
      "ZHIPU_API_URL",
      "ZHIPU_API_KEY",
      "GPT_IMAGE2_API_URL",
      "GPT_IMAGE2_API_KEY",
      "NANA_BANANA_2_API_URL",
      "NANA_BANANA_2_API_KEY",
      "NANA_BANANA_PRO_API_URL",
      "NANA_BANANA_PRO_API_KEY"
    ]
  });
}

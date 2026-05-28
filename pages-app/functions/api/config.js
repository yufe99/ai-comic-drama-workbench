import { json, missingProvider, modelCatalog } from "./_shared.js";

export async function onRequestGet({ env }) {
  const models = Object.fromEntries(
    Object.entries(modelCatalog).map(([id, config]) => [
      id,
      {
        type: config.type,
        duration: config.duration || null,
        cost: config.cost || null,
        provider: "geeknow",
        providerModel: env[config.modelEnv] || config.defaultModel,
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
      "GEEKNOW_API_KEY",
      "GEEKNOW_API_BASE_URL",
      "GEEKNOW_DEEPSEEK_MODEL",
      "GEEKNOW_ZHIPU_MODEL",
      "GEEKNOW_GPT_IMAGE2_MODEL",
      "GEEKNOW_NANA_BANANA_2_MODEL",
      "GEEKNOW_NANA_BANANA_PRO_MODEL",
      "GEEKNOW_SORA2_MODEL",
      "GEEKNOW_SEEDANCE_MODEL"
    ]
  });
}

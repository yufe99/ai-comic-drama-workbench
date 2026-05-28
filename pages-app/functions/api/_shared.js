const encoder = new TextEncoder();

export const modelCatalog = {
  Sora2: {
    type: "video",
    duration: 12,
    cost: 150,
    modelEnv: "GEEKNOW_SORA2_MODEL",
    defaultModel: "sora-2"
  },
  Seedance2: {
    type: "video",
    duration: 15,
    cost: 1800,
    modelEnv: "GEEKNOW_SEEDANCE_MODEL",
    defaultModel: "seedance-2.0"
  },
  DeepSeek: {
    type: "llm",
    modelEnv: "GEEKNOW_DEEPSEEK_MODEL",
    defaultModel: "deepseek-v4-flash"
  },
  Zhipu: {
    type: "llm",
    modelEnv: "GEEKNOW_ZHIPU_MODEL",
    defaultModel: "glm-4.6"
  },
  GPTImage2: {
    type: "image",
    modelEnv: "GEEKNOW_GPT_IMAGE2_MODEL",
    defaultModel: "gpt-image-2"
  },
  NanaBanana2: {
    type: "image",
    modelEnv: "GEEKNOW_NANA_BANANA_2_MODEL",
    defaultModel: "nano-banana-2"
  },
  NanaBananaPro: {
    type: "image",
    modelEnv: "GEEKNOW_NANA_BANANA_PRO_MODEL",
    defaultModel: "nano-banana-pro"
  }
};

const endpointByType = {
  llm: "/v1/chat/completions",
  image: "/v1/images/generations",
  video: "/v1/videos"
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function getSecret(env) {
  return env.APP_SECRET || env.CLOUDFLARE_API_TOKEN || "local-dev-secret";
}

function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

export async function signWallet(env, wallet) {
  const payload = toBase64Url(encoder.encode(JSON.stringify(wallet)));
  const signature = toBase64Url(await hmac(getSecret(env), payload));
  return `${payload}.${signature}`;
}

export async function verifyWallet(env, token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = toBase64Url(await hmac(getSecret(env), payload));
  if (signature !== expected) return null;
  const wallet = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
  if (wallet.expiresAt && Date.now() > wallet.expiresAt) return null;
  return wallet;
}

export function getBearerToken(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.toLowerCase().startsWith("bearer ")) return "";
  return auth.slice(7).trim();
}

export function parseRechargeCodes(env) {
  if (!env.RECHARGE_CODES) return {};
  try {
    return JSON.parse(env.RECHARGE_CODES);
  } catch {
    return {};
  }
}

export function resolveModel(input) {
  const aliases = {
    "智谱 GLM": "Zhipu",
    "GPT Image2": "GPTImage2",
    "Nana Banana 2": "NanaBanana2",
    "Nana Banana Pro": "NanaBananaPro",
    "Seedance 2.0": "Seedance2"
  };
  return aliases[input] || input;
}

export function missingProvider(env, modelId) {
  const config = modelCatalog[modelId];
  if (!config) return [`unknown model: ${modelId}`];
  const missing = [];
  if (!env.GEEKNOW_API_KEY) missing.push("GEEKNOW_API_KEY");
  return missing;
}

function getGeeknowBaseUrl(env) {
  return (env.GEEKNOW_API_BASE_URL || "https://www.geeknow.top").replace(/\/+$/, "");
}

function getProviderModel(env, config) {
  return env[config.modelEnv] || config.defaultModel;
}

function toPrompt(payload) {
  return [
    payload.instruction,
    payload.prompt,
    payload.script ? `Script:\n${payload.script}` : "",
    payload.productBrief ? `Product brief:\n${payload.productBrief}` : "",
    payload.brandBrief ? `Brand brief:\n${payload.brandBrief}` : "",
    payload.placementRules ? `Placement rules:\n${payload.placementRules}` : "",
    payload.seriesPremise ? `Series premise:\n${payload.seriesPremise}` : "",
    payload.job ? `Job:\n${JSON.stringify(payload.job)}` : "",
    payload.storyboard ? `Storyboard:\n${JSON.stringify(payload.storyboard)}` : ""
  ].filter(Boolean).join("\n\n");
}

function buildProviderBody(env, config, payload) {
  const model = getProviderModel(env, config);
  const prompt = toPrompt(payload);

  if (config.type === "llm") {
    return {
      model,
      messages: [
        {
          role: "system",
          content: "你是品牌连续爽剧编剧和AI视频制片人。先保证故事好看、人物关系成立、爽点清晰，再把商品作为自然道具或生活习惯植入，避免硬广口播。输出结构化 JSON。"
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    };
  }

  if (config.type === "image") {
    return {
      model,
      prompt,
      n: 1,
      size: payload.size || "1536x1024"
    };
  }

  return {
    model,
    prompt,
    duration: payload.job?.duration || config.duration || 12,
    aspect_ratio: payload.aspect_ratio || "9:16",
    reference_image: payload.referenceImage || undefined
  };
}

export async function callProvider(env, modelId, payload) {
  const config = modelCatalog[modelId];
  const missing = missingProvider(env, modelId);
  if (missing.length) {
    return {
      ok: false,
      skipped: true,
      modelId,
      missing,
      message: "Provider environment variables are not configured."
    };
  }

  const url = `${getGeeknowBaseUrl(env)}${endpointByType[config.type]}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.GEEKNOW_API_KEY}`
    },
    body: JSON.stringify(buildProviderBody(env, config, payload))
  });

  const text = await response.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    modelId,
    provider: "geeknow",
    endpoint: endpointByType[config.type],
    model: getProviderModel(env, config),
    data
  };
}

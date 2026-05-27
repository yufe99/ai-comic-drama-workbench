const encoder = new TextEncoder();

export const modelCatalog = {
  Sora2: {
    type: "video",
    duration: 12,
    cost: 150,
    keyEnv: "SORA2_API_KEY",
    urlEnv: "SORA2_API_URL"
  },
  Seedance2: {
    type: "video",
    duration: 15,
    cost: 1800,
    keyEnv: "SEEDANCE_API_KEY",
    urlEnv: "SEEDANCE_API_URL"
  },
  DeepSeek: {
    type: "llm",
    keyEnv: "DEEPSEEK_API_KEY",
    urlEnv: "DEEPSEEK_API_URL"
  },
  Zhipu: {
    type: "llm",
    keyEnv: "ZHIPU_API_KEY",
    urlEnv: "ZHIPU_API_URL"
  },
  GPTImage2: {
    type: "image",
    keyEnv: "GPT_IMAGE2_API_KEY",
    urlEnv: "GPT_IMAGE2_API_URL"
  },
  NanaBanana2: {
    type: "image",
    keyEnv: "NANA_BANANA_2_API_KEY",
    urlEnv: "NANA_BANANA_2_API_URL"
  },
  NanaBananaPro: {
    type: "image",
    keyEnv: "NANA_BANANA_PRO_API_KEY",
    urlEnv: "NANA_BANANA_PRO_API_URL"
  }
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
  if (!env[config.keyEnv]) missing.push(config.keyEnv);
  if (!env[config.urlEnv]) missing.push(config.urlEnv);
  return missing;
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

  const response = await fetch(env[config.urlEnv], {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env[config.keyEnv]}`
    },
    body: JSON.stringify(payload)
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
    data
  };
}

import {
  callProvider,
  getBearerToken,
  json,
  modelCatalog,
  readJson,
  resolveModel,
  signWallet,
  verifyWallet
} from "./_shared.js";

export async function onRequestPost({ request, env }) {
  let wallet = await verifyWallet(env, getBearerToken(request));
  if (!wallet) {
    return json({ ok: false, error: "请先充值解锁生成。" }, 401);
  }

  if (env.AI_DRAMA_KV) {
    const storedWallet = await env.AI_DRAMA_KV.get(`wallet:${wallet.id}`, "json");
    if (!storedWallet) {
      return json({ ok: false, error: "钱包已过期，请重新充值。" }, 401);
    }
    wallet = storedWallet;
  }

  const body = await readJson(request);
  const videoModel = resolveModel(body.videoModel || "Sora2");
  const textModel = resolveModel(body.textModel || "DeepSeek");
  const imageModel = resolveModel(body.imageModel || "GPTImage2");
  const segmentCount = Math.max(1, Math.min(200, Number(body.segmentCount || 1)));
  const videoConfig = modelCatalog[videoModel];

  if (!videoConfig || videoConfig.type !== "video") {
    return json({ ok: false, error: "视频模型不支持。" }, 400);
  }

  const cost = segmentCount * videoConfig.cost;
  if (wallet.balance < cost) {
    return json({ ok: false, error: "余额不足，请先充值。", balance: wallet.balance, cost }, 402);
  }

  const job = {
    jobId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    styleRoute: body.styleRoute,
    textModel,
    imageModel,
    videoModel,
    duration: videoConfig.duration,
    segmentCount,
    cost,
    productName: body.productName || "",
    productUrl: body.productUrl || "",
    targetPlatform: body.targetPlatform || "",
    script: body.script || "",
    storyboard: body.storyboard || null
  };

  const llmResult = await callProvider(env, textModel, {
    task: "short_drama_storyboard_package",
    job,
    script: body.script || "",
    output_format: "json"
  });

  const imageResult = await callProvider(env, imageModel, {
    task: "storyboard_reference_image",
    job,
    storyboard: body.storyboard || null,
    styleRoute: body.styleRoute
  });

  const videoResult = await callProvider(env, videoModel, {
    task: "video_generation",
    job,
    prompt: body.prompt || "",
    script: body.script || "",
    storyboard: body.storyboard || null,
    referenceImage: imageResult?.data?.url || imageResult?.data?.image_url || null
  });

  const updatedWallet = { ...wallet, balance: wallet.balance - cost, lastJobId: job.jobId };

  if (env.AI_DRAMA_KV) {
    await env.AI_DRAMA_KV.put(`wallet:${wallet.id}`, JSON.stringify(updatedWallet), {
      expirationTtl: 60 * 60 * 24 * 30
    });
    await env.AI_DRAMA_KV.put(`job:${job.jobId}`, JSON.stringify({ job, llmResult, imageResult, videoResult }), {
      expirationTtl: 60 * 60 * 24 * 30
    });
  }

  return json({
    ok: true,
    job,
    walletToken: await signWallet(env, updatedWallet),
    balanceAfter: updatedWallet.balance,
    providers: {
      llm: llmResult,
      image: imageResult,
      video: videoResult
    }
  });
}

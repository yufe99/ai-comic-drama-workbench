import {
  callProvider,
  getBearerToken,
  json,
  missingProvider,
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

  const missing = [
    ...missingProvider(env, textModel),
    ...missingProvider(env, imageModel),
    ...missingProvider(env, videoModel)
  ];
  if (missing.length) {
    return json({
      ok: false,
      error: "模型 API 尚未配置完整，未扣点。",
      missing: [...new Set(missing)]
    }, 503);
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
    importMode: body.importMode || "manual",
    productName: body.productName || "",
    productUrl: body.productUrl || "",
    productBrief: body.productBrief || "",
    brandBrief: body.brandBrief || "",
    placementRules: body.placementRules || "",
    seriesPremise: body.seriesPremise || "",
    targetPlatform: body.targetPlatform || "",
    script: body.script || "",
    storyboard: body.storyboard || null
  };

  const llmResult = await callProvider(env, textModel, {
    task: "commerce_drama_series_bible_and_storyboard",
    job,
    instruction: "先生成连续爽剧的剧集圣经、人物关系、爽点结构和自然植入规则，再生成当前批次的故事板。商品不能硬广化。",
    script: body.script || "",
    productBrief: body.productBrief || "",
    brandBrief: body.brandBrief || "",
    placementRules: body.placementRules || "",
    seriesPremise: body.seriesPremise || "",
    output_format: "json"
  });
  if (!llmResult.ok) {
    return json({
      ok: false,
      error: "剧集圣经生成失败，未扣点。",
      job,
      provider: llmResult
    }, 502);
  }

  const imageResult = await callProvider(env, imageModel, {
    task: "storyboard_reference_image",
    job,
    storyboard: body.storyboard || null,
    styleRoute: body.styleRoute,
    instruction: "生成连续爽剧风格故事板参考图，商品以道具和生活场景自然出现，不做硬广海报。"
  });
  if (!imageResult.ok) {
    return json({
      ok: false,
      error: "故事板参考图生成失败，未扣点。",
      job,
      providers: {
        llm: llmResult,
        image: imageResult
      }
    }, 502);
  }

  const referenceImage =
    imageResult?.data?.url ||
    imageResult?.data?.image_url ||
    imageResult?.data?.data?.[0]?.url ||
    imageResult?.data?.data?.[0]?.b64_json ||
    null;

  const videoResult = await callProvider(env, videoModel, {
    task: "video_generation",
    job,
    prompt: body.prompt || "",
    script: body.script || "",
    storyboard: body.storyboard || null,
    placementRules: body.placementRules || "",
    referenceImage
  });
  if (!videoResult.ok) {
    return json({
      ok: false,
      error: "视频任务提交失败，未扣点。",
      job,
      providers: {
        llm: llmResult,
        image: imageResult,
        video: videoResult
      }
    }, 502);
  }

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

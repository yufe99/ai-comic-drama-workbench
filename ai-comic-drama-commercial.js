const viewCopy = {
  dashboard: ["项目", "把商品资料、品牌禁忌和目标人群，变成连续爽剧、角色资产、故事板和自然植入的视频素材。"],
  product: ["资料", "支持商品链接、手工输入、品牌资料和产品图同步。"],
  styles: ["剧情路线", "广告剧情是底层能力，悬疑、漫画、古风、仙侠都是品牌爽剧的表现风格。"],
  models: ["模型", "视频模型选一次，整批素材统一按该模型时长生成。"],
  script: ["脚本", "先写连续爽剧，再把商品作为道具、习惯或关系线索自然植入。"],
  assets: ["资产", "商品、角色、场景、道具、品牌口径和禁忌统一复用。"],
  storyboard: ["故事板", "每一格都绑定戏剧功能、台词、道具位置和隐性植入方式。"],
  generation: ["生成", "批量生成同一世界观下的多集、多段、同风格品牌爽剧素材。"],
  settings: ["设置", "项目存储按保留周期自动清理，模型 Key 只放后端环境变量。"]
};

const styleRoutes = {
  ad_drama: {
    name: "广告剧情",
    conversionGoal: "突出卖点并降低购买阻力",
    productExposure: "3 次自然露出",
    dialogueMode: "剧情台词 + 轻口播"
  },
  oral_pitch_drama: {
    name: "口播剧情",
    conversionGoal: "把成分、价格和效果讲清楚",
    productExposure: "口播手持 + 质地特写",
    dialogueMode: "半剧情 + 强解释"
  },
  suspense_commerce: {
    name: "悬疑卖货",
    conversionGoal: "用异常问题拉停留，再用产品反转",
    productExposure: "答案揭晓时集中露出",
    dialogueMode: "悬念台词 + 结尾转化"
  },
  comic_commerce: {
    name: "漫画卖货",
    conversionGoal: "用夸张情绪放大痛点",
    productExposure: "道具化产品露出",
    dialogueMode: "高密度字幕 + 配音"
  },
  guofeng_commerce: {
    name: "古风卖货",
    conversionGoal: "用国风场景抬高商品调性",
    productExposure: "场景化陈列 + 使用动作",
    dialogueMode: "古风台词 + 现代卖点"
  },
  xianxia_commerce: {
    name: "仙侠卖货",
    conversionGoal: "用爽点设定制造记忆点",
    productExposure: "法器化 / 宝物化露出",
    dialogueMode: "设定台词 + 反转收口"
  }
};

const modelConfigs = {
  Sora2: {
    name: "Sora2",
    duration: 12,
    template: "4 CUT 转化板",
    cost: 150,
    segmentA: "素材 01 · 冲突开场 · 12s",
    segmentADesc: "熬夜暗沉导致约会前状态翻车，产品作为解决方案出现。",
    segmentB: "素材 02 · 质地证明 · 12s",
    segmentBDesc: "通过近景质地、吸收速度和次日妆效降低购买阻力。",
    segmentC: "素材 03 · 反转收口 · 12s",
    segmentCDesc: "从躲镜头到主动赴约，用情绪转变完成转化。",
    cuts: [
      ["CUT 1 · 00:00-00:03", "女主看镜子，发现熬夜暗沉和卡粉。", "钩子：明天见前任，状态却翻车。"],
      ["CUT 2 · 00:03-00:06", "闺蜜把精华推到镜头前，质地近景。", "产品露出：瓶身 + 质地。"],
      ["CUT 3 · 00:06-00:09", "睡前使用，第二天自然光下皮肤状态变好。", "证明点：不油腻、次日透亮。"],
      ["CUT 4 · 00:09-00:12", "女主收到消息，主动对镜头微笑。", "收口：不用躲镜头。"]
    ]
  },
  Seedance2: {
    name: "Seedance 2.0",
    duration: 15,
    template: "5 CUT 情绪板",
    cost: 1800,
    segmentA: "素材 01 · 情绪开场 · 15s",
    segmentADesc: "增加人物情绪停顿和产品使用过程，适合更强视觉表现。",
    segmentB: "素材 02 · 质地证明 · 15s",
    segmentBDesc: "把质地、吸收、第二天妆效拆成更完整的证明链。",
    segmentC: "素材 03 · 反转收口 · 15s",
    segmentCDesc: "保留人物反转和产品记忆点，适合高客单商品。",
    cuts: [
      ["CUT 1 · 00:00-00:04", "女主约会前一晚看镜子，状态焦虑。", "钩子：皮肤状态翻车。"],
      ["CUT 2 · 00:04-00:07", "闺蜜递出精华，台词点出别再只靠遮瑕。", "产品露出：瓶身。"],
      ["CUT 3 · 00:07-00:10", "质地推开，快速吸收，女主睡前使用。", "证明点：不油腻。"],
      ["CUT 4 · 00:10-00:13", "第二天自然光下上妆不卡粉。", "证明点：次日状态。"],
      ["CUT 5 · 00:13-00:15", "女主主动赴约，露出购买引导。", "转化收口。"]
    ]
  }
};

const state = {
  currentView: "dashboard",
  styleRoute: "ad_drama",
  textModel: "DeepSeek",
  imageModel: "GPT Image2",
  videoModel: "Sora2",
  segmentCount: 6,
  seriesMode: "series",
  episodeDuration: 60,
  episodeCount: 6,
  activeEpisodeIndex: 0,
  assetPreviewStatus: "资产预览待生成",
  storyboardPreviewStatus: "待预生成",
  isRecharged: false,
  walletBalance: 0,
  walletFrozen: 0,
  productName: "晚安修护精华",
  productUrl: "https://example.com/product/night-repair-serum",
  targetPlatform: "抖音 / 小红书",
  importMode: "manual",
  productBrief: "一款夜间修护精华，主打熬夜暗沉、屏障脆弱、第二天上妆卡粉。质地清爽，适合睡前使用，核心卖点是夜间修护和次日透亮。",
  brandBrief: "品牌调性高级、克制、可信，不做夸张承诺。可以说“改善熬夜后的暗沉观感”，不要说“立刻美白”。",
  placementRules: "商品不能像硬广一样突然出现，要作为女主解决困境的生活道具出现。每 12-15 秒片段最多 1 次主露出，台词不直接喊购买。",
  seriesPremise: "女主被前任和职场竞争者看轻，靠一次次反转证明自己。精华不是广告主角，而是她每次重要场合前的固定仪式和状态锚点。",
  productImageName: "",
  productImagePreview: "",
  seedancePipelineStatus: "待探测"
};

const navItems = document.querySelectorAll("[data-view]");
const panels = document.querySelectorAll("[data-view-panel]");
const titleNode = document.querySelector("#viewTitle");
const subtitleNode = document.querySelector("#viewSubtitle");
const textModelSelect = document.querySelector("#textModelSelect");
const imageModelSelect = document.querySelector("#imageModelSelect");
const submitModal = document.querySelector("#submitModal");
const rechargeModal = document.querySelector("#rechargeModal");
const gateBanner = document.querySelector("#gateBanner");
const productNameInput = document.querySelector("#productNameInput");
const productUrlInput = document.querySelector("#productUrlInput");
const platformSelect = document.querySelector("#platformSelect");
const importModeSelect = document.querySelector("#importModeSelect");
const productBriefInput = document.querySelector("#productBriefInput");
const brandBriefInput = document.querySelector("#brandBriefInput");
const placementRulesInput = document.querySelector("#placementRulesInput");
const seriesPremiseInput = document.querySelector("#seriesPremiseInput");
const seriesModeSelect = document.querySelector("#seriesModeSelect");
const episodeDurationSelect = document.querySelector("#episodeDurationSelect");
const episodeCountInput = document.querySelector("#episodeCountInput");
const activeEpisodeSelect = document.querySelector("#activeEpisodeSelect");
const episodeList = document.querySelector("#episodeList");
const activeEpisodeBeats = document.querySelector("#activeEpisodeBeats");
const productImageInput = document.querySelector("#productImageInput");
const productImagePreview = document.querySelector("#productImagePreview");
const importProductButton = document.querySelector("#importProductButton");
const previewScriptButton = document.querySelector("#previewScriptButton");
const regenerateScriptButton = document.querySelector("#regenerateScriptButton");
const scriptInput = document.querySelector("#scriptInput");

function storyboardCountForEpisode() {
  return Math.max(1, Math.ceil(state.episodeDuration / currentConfig().duration));
}

function totalStoryboardCount() {
  return state.episodeCount * storyboardCountForEpisode();
}

function episodeTitle(index) {
  return `EP${String(index + 1).padStart(2, "0")}`;
}

function episodeSummary(index) {
  const summaries = [
    "被前任轻视，女主在发布会前夜完成第一次状态重启。",
    "竞品数据被调包，女主用备份方案当场反转。",
    "闺蜜身份出现裂痕，商品成为女主独处时的稳定仪式。",
    "老板临时加压，女主把危机变成升职机会。",
    "前任试图挖角，女主第一次主动设局。",
    "最终发布会反杀，所有误会和背叛集中爆发。"
  ];
  return summaries[index] || "延续主线冲突，推进一次误会、一次反转和一个自然植入场景。";
}

function mockProductFromUrl(url) {
  const normalizedUrl = (url || "").trim();
  const isSerum = /serum|repair|night|精华|护肤|beauty|skincare/i.test(normalizedUrl);
  if (isSerum) {
    return {
      name: "晚安修护精华",
      brief: "一款夜间修护精华，主打熬夜暗沉、屏障脆弱、第二天上妆卡粉。质地清爽，适合睡前使用，核心卖点是夜间修护和次日透亮。",
      brand: "品牌调性高级、克制、可信，不做夸张承诺。可以说“改善熬夜后的暗沉观感”，不要说“立刻美白”。",
      image: "./assets/preview/litmedia-board-wide.png"
    };
  }
  return {
    name: "剧情植入商品",
    brief: `已从链接导入基础商品资料：${normalizedUrl || "未填写链接"}。正式版会调用商品解析接口抓取标题、主图、卖点和详情页素材；当前可在这里继续手工补充卖点、禁忌词和使用场景。`,
    brand: "请补充品牌调性、禁用词、功效边界和必须露出的商品信息。",
    image: "./assets/preview/litmedia-submit-panel.png"
  };
}

function syncImportedProduct(product) {
  state.productName = product.name;
  state.productBrief = product.brief;
  state.brandBrief = product.brand;
  state.productImageName = "imported-product-image";
  state.productImagePreview = product.image;
  productNameInput.value = product.name;
  productBriefInput.value = product.brief;
  brandBriefInput.value = product.brand;
  productImagePreview.innerHTML = `<img alt="产品图预览" src="${product.image}" />`;
  state.assetPreviewStatus = "商品资料和产品图已同步到资产库";
  renderAll();
}

function buildScriptPreview() {
  return `${episodeTitle(state.activeEpisodeIndex)}｜${state.productName} 品牌爽剧

本集功能：${episodeSummary(state.activeEpisodeIndex)}

剧情节奏：
1. 开场先给人物困境，不露商品。
2. 中段让人物做一个选择，商品作为生活道具自然出现。
3. 结尾给反转或误会，推动下一集。

植入规则：
${state.placementRules}

连续设定：
${state.seriesPremise}`;
}

function setBind(name, value) {
  document.querySelectorAll(`[data-bind="${name}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function currentConfig() {
  return modelConfigs[state.videoModel];
}

function currentDurationText() {
  return `${currentConfig().duration}秒`;
}

function currentCost() {
  return totalStoryboardCount() * currentConfig().cost;
}

function remainingBalance() {
  return state.walletBalance - currentCost();
}

function showView(view) {
  state.currentView = view;
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  const copy = viewCopy[view] || viewCopy.dashboard;
  titleNode.textContent = copy[0];
  subtitleNode.textContent = copy[1];
}

function renderProduct() {
  setBind("productName", state.productName);
  setBind("targetPlatform", state.targetPlatform);
}

function renderEpisodes() {
  const count = totalStoryboardCount();
  const perEpisode = storyboardCountForEpisode();
  state.segmentCount = count;
  state.activeEpisodeIndex = Math.min(state.activeEpisodeIndex, state.episodeCount - 1);

  setBind("seriesModeText", state.seriesMode === "single" ? "单集" : "连续剧");
  setBind("episodeDurationText", `${state.episodeDuration}秒`);
  setBind("seriesStructureText", `${state.episodeCount} 集 × ${state.episodeDuration} 秒`);
  setBind("activeEpisodeTitle", episodeTitle(state.activeEpisodeIndex));
  setBind("activeEpisodeSegmentText", `${perEpisode} 张`);
  setBind("assetPreviewStatus", state.assetPreviewStatus);
  setBind("storyboardPreviewStatus", state.storyboardPreviewStatus);

  if (episodeCountInput) {
    episodeCountInput.value = state.episodeCount;
    episodeCountInput.disabled = state.seriesMode === "single";
  }
  if (seriesModeSelect) seriesModeSelect.value = state.seriesMode;
  if (episodeDurationSelect) episodeDurationSelect.value = String(state.episodeDuration);

  if (activeEpisodeSelect) {
    activeEpisodeSelect.innerHTML = "";
    Array.from({ length: state.episodeCount }).forEach((_, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${episodeTitle(index)} · ${perEpisode} 张故事板`;
      activeEpisodeSelect.appendChild(option);
    });
    activeEpisodeSelect.value = String(state.activeEpisodeIndex);
  }

  if (episodeList) {
    episodeList.innerHTML = "";
    Array.from({ length: state.episodeCount }).forEach((_, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `segment ${index === state.activeEpisodeIndex ? "active" : ""}`;
      item.innerHTML = `<strong>${episodeTitle(index)} · ${state.episodeDuration}秒 · ${perEpisode} 张故事板</strong><span>${episodeSummary(index)}</span>`;
      item.addEventListener("click", () => {
        state.activeEpisodeIndex = index;
        renderAll();
      });
      episodeList.appendChild(item);
    });
  }

  if (activeEpisodeBeats) {
    activeEpisodeBeats.innerHTML = "";
    [
      `${episodeTitle(state.activeEpisodeIndex)}：${episodeSummary(state.activeEpisodeIndex)}`,
      `拆分规则：一张故事板 = 一条 ${currentConfig().duration} 秒视频。`,
      `本集预计 ${perEpisode} 张故事板，全剧预计 ${count} 张故事板。`
    ].forEach((text) => {
      const div = document.createElement("div");
      div.textContent = text;
      activeEpisodeBeats.appendChild(div);
    });
  }
}

function renderStyleRoute() {
  const route = styleRoutes[state.styleRoute];
  document.querySelectorAll("[data-style-route]").forEach((node) => {
    node.classList.toggle("selected", node.dataset.styleRoute === state.styleRoute);
  });
  setBind("styleRouteName", route.name);
  setBind("conversionGoal", route.conversionGoal);
  setBind("productExposure", route.productExposure);
  setBind("dialogueMode", route.dialogueMode);
}

function renderModel() {
  const config = currentConfig();
  document.querySelectorAll("[data-model-select]").forEach((node) => {
    node.classList.toggle("selected", node.dataset.modelSelect === state.videoModel);
  });

  setBind("selectedTextModel", state.textModel);
  setBind("selectedImageModel", state.imageModel);
  setBind("selectedVideoModel", config.name);
  setBind("currentDurationText", currentDurationText());
  setBind("currentTemplateName", config.template);
  setBind("estimatedCost", `${currentCost().toLocaleString("zh-CN")} 点`);
  setBind("remainingBalance", `${remainingBalance().toLocaleString("zh-CN")} 创作点`);
  setBind("selectedSegmentCount", `${totalStoryboardCount()} 张`);
}

function renderScript() {
  renderEpisodes();
  const config = currentConfig();
  setBind("segmentA", config.segmentA);
  setBind("segmentADesc", config.segmentADesc);
  setBind("segmentB", config.segmentB);
  setBind("segmentBDesc", config.segmentBDesc);
  setBind("segmentC", config.segmentC);
  setBind("segmentCDesc", config.segmentCDesc);
  setBind("cut1Title", config.cuts[0][0]);
  setBind("cut1Body", config.cuts[0][1]);
  setBind("cut1Note", config.cuts[0][2]);
  setBind("cut2Title", config.cuts[1][0]);
  setBind("cut2Body", config.cuts[1][1]);
  setBind("cut2Note", config.cuts[1][2]);
  setBind("cut3Title", config.cuts[2][0]);
  setBind("cut3Body", config.cuts[2][1]);
  setBind("cut3Note", config.cuts[2][2]);
  setBind("cut4Title", config.cuts[3][0]);
  setBind("cut4Body", config.cuts[3][1]);
  setBind("cut4Note", config.cuts[3][2]);
}

function renderAccountGate() {
  const accountState = state.isRecharged ? "已充值" : "未充值";
  const accountHint = state.isRecharged ? "生成已解锁" : "只能查看展示";

  setBind("accountState", accountState);
  setBind("accountHint", accountHint);
  setBind("walletBalance", `${state.walletBalance.toLocaleString("zh-CN")} 创作点`);

  document.body.classList.toggle("is-locked", !state.isRecharged);
  gateBanner.classList.toggle("hidden", state.isRecharged);
  document.querySelector("#rechargeButton").textContent = state.isRecharged ? "继续充值" : "充值解锁";
}

function renderAll() {
  renderProduct();
  renderStyleRoute();
  renderModel();
  renderScript();
  renderAccountGate();
  setBind("seedancePipelineStatus", state.seedancePipelineStatus);
}

function openRechargeModal() {
  rechargeModal.classList.remove("hidden");
}

function closeRechargeModal() {
  rechargeModal.classList.add("hidden");
}

function openSubmitModal() {
  if (!state.isRecharged) {
    openRechargeModal();
    return;
  }
  renderAll();
  submitModal.classList.remove("hidden");
}

function closeSubmitModal() {
  submitModal.classList.add("hidden");
}

function requireRecharge(event) {
  if (state.isRecharged) return false;
  event.preventDefault();
  event.stopPropagation();
  openRechargeModal();
  return true;
}

navItems.forEach((item) => item.addEventListener("click", () => showView(item.dataset.view)));

document.querySelectorAll("[data-style-route]").forEach((item) => {
  item.addEventListener("click", () => {
    state.styleRoute = item.dataset.styleRoute;
    renderAll();
  });
});

document.querySelectorAll("[data-model-select]").forEach((item) => {
  item.addEventListener("click", () => {
    state.videoModel = item.dataset.modelSelect;
    renderAll();
  });
});

textModelSelect.addEventListener("change", (event) => {
  state.textModel = event.target.value;
  renderAll();
});

imageModelSelect.addEventListener("change", (event) => {
  state.imageModel = event.target.value;
  renderAll();
});

productNameInput.addEventListener("input", (event) => {
  state.productName = event.target.value || "未命名商品";
  renderAll();
});

productUrlInput.addEventListener("input", (event) => {
  state.productUrl = event.target.value;
});

platformSelect.addEventListener("change", (event) => {
  state.targetPlatform = event.target.value;
  renderAll();
});

seriesModeSelect.addEventListener("change", (event) => {
  state.seriesMode = event.target.value;
  if (state.seriesMode === "single") {
    state.episodeCount = 1;
    state.activeEpisodeIndex = 0;
  } else if (state.episodeCount < 2) {
    state.episodeCount = 6;
  }
  renderAll();
});

episodeDurationSelect.addEventListener("change", (event) => {
  state.episodeDuration = Number(event.target.value);
  renderAll();
});

episodeCountInput.addEventListener("input", (event) => {
  state.episodeCount = Math.max(1, Math.min(60, Number(event.target.value || 1)));
  if (state.seriesMode === "single") state.episodeCount = 1;
  renderAll();
});

activeEpisodeSelect.addEventListener("change", (event) => {
  state.activeEpisodeIndex = Number(event.target.value);
  renderAll();
});

importModeSelect.addEventListener("change", (event) => {
  state.importMode = event.target.value;
});

productBriefInput.addEventListener("input", (event) => {
  state.productBrief = event.target.value;
});

brandBriefInput.addEventListener("input", (event) => {
  state.brandBrief = event.target.value;
});

placementRulesInput.addEventListener("input", (event) => {
  state.placementRules = event.target.value;
});

seriesPremiseInput.addEventListener("input", (event) => {
  state.seriesPremise = event.target.value;
});

importProductButton.addEventListener("click", (event) => {
  event.preventDefault();
  state.productUrl = productUrlInput.value.trim();
  state.importMode = "mixed";
  importModeSelect.value = "mixed";
  importProductButton.textContent = "已导入";
  syncImportedProduct(mockProductFromUrl(state.productUrl));
});

previewScriptButton.addEventListener("click", (event) => {
  event.preventDefault();
  scriptInput.value = buildScriptPreview();
});

regenerateScriptButton.addEventListener("click", (event) => {
  event.preventDefault();
  scriptInput.value = `${buildScriptPreview()}

新版钩子：女主在关键场合前被对手当众轻视，她没有解释，只在深夜完成自己的固定仪式。第二天，她用一份提前准备的证据完成反击。`;
});

productImageInput.addEventListener("change", () => {
  const file = productImageInput.files?.[0];
  if (!file) return;
  state.productImageName = file.name;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.productImagePreview = String(reader.result || "");
    productImagePreview.innerHTML = `<img alt="产品图预览" src="${state.productImagePreview}" />`;
    state.assetPreviewStatus = `已上传产品图：${file.name}`;
    renderAll();
  });
  reader.readAsDataURL(file);
});

document.querySelectorAll("[data-open-submit]").forEach((button) => button.addEventListener("click", openSubmitModal));
document.querySelectorAll("[data-open-recharge]").forEach((button) => button.addEventListener("click", openRechargeModal));
document.querySelectorAll("[data-locked-action]").forEach((button) => button.addEventListener("click", requireRecharge));

document.querySelector("#rechargeButton").addEventListener("click", openRechargeModal);
document.querySelector("#closeModal").addEventListener("click", closeSubmitModal);
document.querySelector("#cancelSubmit").addEventListener("click", closeSubmitModal);
document.querySelector("#closeRechargeModal").addEventListener("click", closeRechargeModal);
document.querySelector("#cancelRecharge").addEventListener("click", closeRechargeModal);

document.querySelector("#simulateRecharge").addEventListener("click", () => {
  state.isRecharged = true;
  state.walletBalance = 10000;
  closeRechargeModal();
  renderAll();
});

document.querySelector("#confirmSubmit").addEventListener("click", () => {
  const cost = currentCost();
  if (state.walletBalance < cost) {
    closeSubmitModal();
    openRechargeModal();
    return;
  }
  state.walletBalance -= cost;
  state.walletFrozen += cost;
  closeSubmitModal();
  renderAll();
  alert("已提交剧情广告生成任务。");
});

document.querySelector("#refreshSegments").addEventListener("click", (event) => {
  event.preventDefault();
  alert(`已按 ${state.episodeCount} 集 × ${state.episodeDuration} 秒，重新拆分为 ${totalStoryboardCount()} 张故事板。`);
});

document.querySelector("#addEpisodeButton").addEventListener("click", () => {
  state.seriesMode = "series";
  state.episodeCount = Math.min(60, state.episodeCount + 1);
  renderAll();
});

document.querySelector("#removeEpisodeButton").addEventListener("click", () => {
  state.episodeCount = Math.max(1, state.episodeCount - 1);
  if (state.episodeCount === 1) state.seriesMode = "single";
  state.activeEpisodeIndex = Math.min(state.activeEpisodeIndex, state.episodeCount - 1);
  renderAll();
});

document.querySelector("#generateAssetPreview").addEventListener("click", (event) => {
  event.preventDefault();
  state.assetPreviewStatus = "资产预览已生成";
  renderAll();
});

document.querySelector("#generateStoryboardPreview").addEventListener("click", (event) => {
  event.preventDefault();
  state.storyboardPreviewStatus = `${episodeTitle(state.activeEpisodeIndex)} 故事板已生成`;
  renderAll();
});

document.querySelector("#consentAction").addEventListener("click", (event) => {
  event.preventDefault();
  state.seedancePipelineStatus = "授权中";
  renderAll();
});

document.querySelector("#probeAction").addEventListener("click", (event) => {
  event.preventDefault();
  state.seedancePipelineStatus = "通道已通过";
  renderAll();
});

document.querySelector("#assetAction").addEventListener("click", (event) => {
  event.preventDefault();
  state.seedancePipelineStatus = "专用脸已生成";
  renderAll();
});

document.querySelector("#fallbackAction").addEventListener("click", () => {
  state.seedancePipelineStatus = "已切入兜底";
  state.videoModel = "Sora2";
  renderAll();
});

submitModal.addEventListener("click", (event) => {
  if (event.target === submitModal) closeSubmitModal();
});

rechargeModal.addEventListener("click", (event) => {
  if (event.target === rechargeModal) closeRechargeModal();
});

renderAll();
showView(state.currentView);

(() => {
  const storageKey = "ai-drama-wallet-token";
  const balanceKey = "ai-drama-wallet-balance";
  const configState = document.createElement("div");
  configState.className = "modal-block";
  configState.innerHTML = '<p><strong>后端状态</strong></p><div class="flat-list" id="backendStatus">正在检查...</div>';
  rechargeModal.querySelector(".recharge-layout").after(configState);

  const rechargeLayout = rechargeModal.querySelector(".recharge-layout");
  const codeField = document.createElement("label");
  codeField.className = "field";
  codeField.innerHTML = '<span>充值码</span><input id="rechargeCodeInput" placeholder="输入充值码后解锁生成" />';
  rechargeLayout.appendChild(codeField);

  const submitSummary = submitModal.querySelector(".modal-summary");
  const submitInfo = document.createElement("div");
  submitInfo.className = "modal-block";
  submitInfo.innerHTML = '<p><strong>真实提交</strong></p><div class="flat-list" id="submitResult">等待提交。</div>';
  submitSummary.after(submitInfo);

  const backendStatusNode = document.querySelector("#backendStatus");
  const submitResultNode = document.querySelector("#submitResult");
  const rechargeCodeInput = document.querySelector("#rechargeCodeInput");

  async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
      headers: { "content-type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  }

  function syncWallet(balance, token) {
    state.isRecharged = true;
    state.walletBalance = Number(balance || 0);
    if (token) localStorage.setItem(storageKey, token);
    localStorage.setItem(balanceKey, String(state.walletBalance));
    renderAll();
  }

  function loadWalletFromStorage() {
    const token = localStorage.getItem(storageKey);
    const balance = Number(localStorage.getItem(balanceKey) || 0);
    if (token) {
      state.isRecharged = true;
      state.walletBalance = balance;
      renderAll();
    }
  }

  async function loadBackendConfig() {
    try {
      const config = await fetchJSON("/api/config");
      const readyModels = Object.entries(config.models || {})
        .map(([name, detail]) => `${name}: ${detail.configured ? "ready" : "missing"}`)
        .join("\n");
      backendStatusNode.textContent = `wallet=${config.walletMode}\n${readyModels}`;
    } catch (error) {
      backendStatusNode.textContent = `后端不可用：${error.message}`;
    }
  }

  document.querySelector("#simulateRecharge").addEventListener(
    "click",
    async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const code = rechargeCodeInput.value.trim();
      if (!code) {
        backendStatusNode.textContent = "请输入充值码。";
        return;
      }
      try {
        const result = await fetchJSON("/api/recharge", {
          method: "POST",
          body: JSON.stringify({ code })
        });
        syncWallet(result.balance, result.walletToken);
        closeRechargeModal();
        backendStatusNode.textContent = `充值成功，余额 ${result.balance} 点。`;
      } catch (error) {
        backendStatusNode.textContent = `充值失败：${error.message}`;
      }
    },
    true
  );

  document.querySelector("#confirmSubmit").addEventListener(
    "click",
    async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const token = localStorage.getItem(storageKey);
      if (!token) {
        openRechargeModal();
        backendStatusNode.textContent = "请先充值。";
        return;
      }
      try {
        const response = await fetchJSON("/api/generate", {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: JSON.stringify({
            productName: state.productName,
            productUrl: state.productUrl,
            importMode: state.importMode,
            productBrief: state.productBrief,
            brandBrief: state.brandBrief,
            placementRules: state.placementRules,
            seriesPremise: state.seriesPremise,
            productImageName: state.productImageName,
            productImagePreview: state.productImagePreview,
            targetPlatform: state.targetPlatform,
            styleRoute: state.styleRoute,
            seriesMode: state.seriesMode,
            episodeDuration: state.episodeDuration,
            episodeCount: state.episodeCount,
            activeEpisode: episodeTitle(state.activeEpisodeIndex),
            storyboardCount: totalStoryboardCount(),
            storyboardCountPerEpisode: storyboardCountForEpisode(),
            textModel: state.textModel,
            imageModel: state.imageModel,
            videoModel: state.videoModel,
            segmentCount: totalStoryboardCount(),
            script: scriptInput.value,
            storyboard: {
              duration: currentConfig().duration,
              template: currentConfig().template,
              rule: `一张故事板生成一条 ${currentConfig().duration} 秒视频`,
              activeEpisode: episodeTitle(state.activeEpisodeIndex),
              storyboardCountPerEpisode: storyboardCountForEpisode(),
              dramaPriority: "先好看，再植入；禁止硬广口播",
              commerceGoal: styleRoutes[state.styleRoute].conversionGoal,
              placementRules: state.placementRules
            },
            prompt: `${state.productName}，${styleRoutes[state.styleRoute].name}，${state.targetPlatform} 连续爽剧，自然植入商品，不要硬广感。`
          })
        });
        syncWallet(response.balanceAfter, response.walletToken);
        submitResultNode.textContent = `任务 ${response.job.jobId} 已提交，剩余 ${response.balanceAfter} 点。`;
        closeSubmitModal();
      } catch (error) {
        submitResultNode.textContent = `提交失败：${error.message}`;
      }
    },
    true
  );

  loadWalletFromStorage();
  loadBackendConfig();
})();

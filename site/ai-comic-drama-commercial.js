const viewCopy = {
  dashboard: ["项目", "把商品资料、品牌禁忌和目标人群，变成连续爽剧、角色资产、故事板和自然植入的视频素材。"],
  product: ["资料", "支持商品链接、手工输入、品牌资料、植入规则和连续爽剧设定。"],
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
  segmentCount: 24,
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
const scriptInput = document.querySelector("#scriptInput");

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
  return state.segmentCount * currentConfig().cost;
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
  setBind("selectedSegmentCount", `${state.segmentCount} 条`);
}

function renderScript() {
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
  if (requireRecharge(event)) return;
  alert(`已按 ${currentConfig().name} 的 ${currentConfig().duration} 秒统一时长重新生成剧情广告脚本。`);
});

document.querySelector("#consentAction").addEventListener("click", (event) => {
  if (requireRecharge(event)) return;
  state.seedancePipelineStatus = "授权中";
  renderAll();
});

document.querySelector("#probeAction").addEventListener("click", (event) => {
  if (requireRecharge(event)) return;
  state.seedancePipelineStatus = "通道已通过";
  renderAll();
});

document.querySelector("#assetAction").addEventListener("click", (event) => {
  if (requireRecharge(event)) return;
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
            targetPlatform: state.targetPlatform,
            styleRoute: state.styleRoute,
            textModel: state.textModel,
            imageModel: state.imageModel,
            videoModel: state.videoModel,
            segmentCount: state.segmentCount,
            script: scriptInput.value,
            storyboard: {
              duration: currentConfig().duration,
              template: currentConfig().template,
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

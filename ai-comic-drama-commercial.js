const viewCopy = {
  dashboard: ["项目", "未充值可查看示例，充值后才能导入剧本和提交生成。"],
  styles: ["风格", "先定风格，再锁人脸、场景和镜头基调。"],
  models: ["模型", "视频模型选一次，整部短剧就统一按这个时长跑。"],
  script: ["剧本", "按当前视频模型的统一时长切分。"],
  assets: ["资产", "多人角色、场景、道具和色卡统一继承。"],
  storyboard: ["故事板", "CUT、台词归属、音效和道具引用直接放进板里。"],
  generation: ["生成", "当前项目所有片段都用同一个视频模型与统一时长。"],
  settings: ["设置", "项目存储按保留周期自动清理。"]
};

const styleRoutes = {
  live_action_drama: {
    name: "真人短剧",
    recommendedFaceSource: "外部真人人脸",
    consistencyLevel: "严格",
    dialogueMode: "口型同步"
  },
  live_action_stylized: {
    name: "真人感漫剧",
    recommendedFaceSource: "外部真人人脸 + Seedance专用脸",
    consistencyLevel: "严格",
    dialogueMode: "口型同步"
  },
  comic_2_5d: {
    name: "2.5D 漫剧",
    recommendedFaceSource: "插画角色 / 模型脸",
    consistencyLevel: "平衡",
    dialogueMode: "配音字幕"
  },
  chinese_animation_cinematic: {
    name: "国漫电影感",
    recommendedFaceSource: "插画角色 / 模型脸",
    consistencyLevel: "严格",
    dialogueMode: "配音字幕"
  },
  anime_manhwa: {
    name: "日漫 / 韩漫风",
    recommendedFaceSource: "插画角色",
    consistencyLevel: "平衡",
    dialogueMode: "配音字幕"
  },
  ad_drama: {
    name: "广告剧情",
    recommendedFaceSource: "平台人脸库 / 品牌授权脸",
    consistencyLevel: "严格",
    dialogueMode: "口型同步"
  }
};

const modelConfigs = {
  Sora2: {
    name: "Sora2",
    duration: 12,
    template: "4 CUT 时间线",
    cost: 150,
    segmentA: "EP01-S01 · Sora2 · 12s · 4 CUT",
    segmentADesc: "女主冲后台，男主拦截，女二误会，最后转入消防通道收钩子。",
    segmentB: "EP01-S02 · Sora2 · 12s · 4 CUT",
    segmentBDesc: "男主解释证据缺口，女主不信，保镖追近，关系继续拉扯。",
    segmentC: "EP01-S03 · Sora2 · 12s · 4 CUT",
    segmentCDesc: "女二误会升级，媒体冲来，男主决定当场反转。",
    cuts: [
      ["CUT 1 · 00:00-00:03", "女主推门闯入后台，手机里的偷拍视频掠过画面。", "台词：无。音效：门响。"],
      ["CUT 2 · 00:03-00:06", "男主拦住她，低声说“还差最后一环”。", "台词归属：男主。"],
      ["CUT 3 · 00:06-00:09", "女二回眸看到两人对峙，误会加深。", "人物：女二入镜。"],
      ["CUT 4 · 00:09-00:12", "保镖逼近，男主拉女主进入消防通道，留下反问钩子。", "钩子 CUT。"]
    ]
  },
  Seedance2: {
    name: "Seedance 2.0",
    duration: 15,
    template: "4 CUT 丰富板",
    cost: 1800,
    segmentA: "EP01-S01 · Seedance 2.0 · 15s · 4 CUT",
    segmentADesc: "女主冲后台，先交代证据，再给男主一个停顿镜头。",
    segmentB: "EP01-S02 · Seedance 2.0 · 15s · 4 CUT",
    segmentBDesc: "男主解释证据缺口，女主质问，关系往前推进一层。",
    segmentC: "EP01-S03 · Seedance 2.0 · 15s · 4 CUT",
    segmentCDesc: "女二误会升级，媒体闪光灯打进来，男主准备反转。",
    cuts: [
      ["CUT 1 · 00:00-00:04", "女主冲入后台，镜头给到证据和目标。", "建立主冲突。"],
      ["CUT 2 · 00:04-00:08", "男主拦截并说明还差最后一环。", "台词归属：男主。"],
      ["CUT 3 · 00:08-00:12", "女二误会，媒体冲来，情绪拉高。", "人物：女二。"],
      ["CUT 4 · 00:12-00:15", "男主拉人撤离，女主抛出质问钩子。", "15 秒版收口。"]
    ]
  }
};

const state = {
  currentView: "dashboard",
  styleRoute: "live_action_stylized",
  textModel: "DeepSeek",
  imageModel: "GPT Image2",
  videoModel: "Sora2",
  segmentCount: 24,
  isRecharged: false,
  walletBalance: 0,
  walletFrozen: 0,
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

function renderStyleRoute() {
  const route = styleRoutes[state.styleRoute];
  document.querySelectorAll("[data-style-route]").forEach((node) => {
    node.classList.toggle("selected", node.dataset.styleRoute === state.styleRoute);
  });
  setBind("styleRouteName", route.name);
  setBind("recommendedFaceSource", route.recommendedFaceSource);
  setBind("consistencyLevel", route.consistencyLevel);
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
  setBind("selectedSegmentCount", `${state.segmentCount} 段`);
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
  setBind("templateLine1", "Sora2 · 12s：4 CUT 时间线");
  setBind("templateLine2", "Seedance 2.0 · 15s：4 CUT 丰富板");
}

function renderAccountGate() {
  const accountState = state.isRecharged ? "已充值" : "未充值";
  const accountHint = state.isRecharged ? "生成已解锁" : "只能查看示例";

  setBind("accountState", accountState);
  setBind("accountHint", accountHint);
  setBind("walletBalance", `${state.walletBalance.toLocaleString("zh-CN")} 创作点`);

  document.body.classList.toggle("is-locked", !state.isRecharged);
  gateBanner.classList.toggle("hidden", state.isRecharged);
  document.querySelector("#rechargeButton").textContent = state.isRecharged ? "继续充值" : "充值解锁";
}

function renderAll() {
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

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

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

document.querySelectorAll("[data-open-submit]").forEach((button) => {
  button.addEventListener("click", openSubmitModal);
});

document.querySelectorAll("[data-open-recharge]").forEach((button) => {
  button.addEventListener("click", openRechargeModal);
});

document.querySelectorAll("[data-locked-action]").forEach((button) => {
  button.addEventListener("click", requireRecharge);
});

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
  alert("已提交生成任务。");
});

document.querySelector("#refreshSegments").addEventListener("click", (event) => {
  if (requireRecharge(event)) return;
  alert(`已按 ${currentConfig().name} 的 ${currentConfig().duration} 秒统一时长重新分段。`);
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
  state.seedancePipelineStatus = "已切兜底";
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
  const scriptInput = document.querySelector("#scriptInput");

  async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
      headers: { "content-type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    return data;
  }

  function syncWallet(balance, token) {
    state.isRecharged = true;
    state.walletBalance = Number(balance || 0);
    if (token) localStorage.setItem(storageKey, token);
    localStorage.setItem(balanceKey, String(state.walletBalance));
    renderAll();
  }

  async function loadWalletFromStorage() {
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
        localStorage.setItem(storageKey, result.walletToken);
        localStorage.setItem(balanceKey, String(result.balance));
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
            styleRoute: state.styleRoute,
            textModel: state.textModel,
            imageModel: state.imageModel,
            videoModel: state.videoModel,
            segmentCount: state.segmentCount,
            script: scriptInput.value,
            storyboard: {
              duration: currentConfig().duration,
              template: currentConfig().template
            },
            prompt: `Style ${state.styleRoute}, video ${state.videoModel}`
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

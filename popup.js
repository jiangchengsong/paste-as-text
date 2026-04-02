const DEFAULT_DOMAINS = [
  "chatgpt.com",
  "chat.openai.com",
  "gemini.google.com",
  "claude.ai",
  "copilot.microsoft.com",
  "chat.deepseek.com",
  "poe.com",
  "kimi.ai",
  "tongyi.aliyun.com",
  "yuanbao.tencent.com",
];

const globalToggle = document.getElementById("globalToggle");
const domainList = document.getElementById("domainList");
const newDomainInput = document.getElementById("newDomain");
const addBtn = document.getElementById("addBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

let domains = [];

function save() {
  chrome.storage.sync.set({ enabled: globalToggle.checked, domains });
}

function isDomainMatch(host, domain) {
  return host === domain || host.endsWith("." + domain);
}

function updateStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.url) {
      statusDot.className = "dot inactive";
      statusText.textContent = "无法检测当前页";
      return;
    }

    try {
      const host = new URL(tabs[0].url).hostname;
      const matched = domains.some((d) => isDomainMatch(host, d));

      if (!globalToggle.checked) {
        statusDot.className = "dot inactive";
        statusText.textContent = "已关闭（全局开关未开启）";
      } else if (matched) {
        statusDot.className = "dot active";
        statusText.textContent = `当前页 ${host} — 已生效 ✓`;
      } else {
        statusDot.className = "dot inactive";
        statusText.textContent = `当前页 ${host} — 未启用`;
      }
    } catch {
      statusDot.className = "dot inactive";
      statusText.textContent = "无法检测当前页";
    }
  });
}

function renderDomains() {
  domainList.innerHTML = "";
  domains.forEach((domain, idx) => {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.className = "domain-name";
    nameSpan.textContent = domain;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.title = "移除";
    removeBtn.addEventListener("click", () => {
      domains.splice(idx, 1);
      save();
      renderDomains();
      updateStatus();
    });

    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    domainList.appendChild(li);
  });
}

function addDomain() {
  let raw = newDomainInput.value.trim().toLowerCase();
  if (!raw) return;

  raw = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!raw || domains.includes(raw)) {
    newDomainInput.value = "";
    return;
  }

  domains.push(raw);
  save();
  renderDomains();
  updateStatus();
  newDomainInput.value = "";
}

globalToggle.addEventListener("change", () => {
  save();
  updateStatus();
});

addBtn.addEventListener("click", addDomain);
newDomainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addDomain();
});

chrome.storage.sync.get({ enabled: true, domains: DEFAULT_DOMAINS }, (s) => {
  globalToggle.checked = s.enabled;
  domains = [...s.domains];
  renderDomains();
  updateStatus();
});

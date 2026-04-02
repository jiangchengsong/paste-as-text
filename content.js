(function () {
  "use strict";

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

  let enabled = true;
  let activeDomains = new Set(DEFAULT_DOMAINS);
  let bypassNext = false;
  let bypassTimer = null;

  function loadSettings() {
    chrome.storage.sync.get({ enabled: true, domains: DEFAULT_DOMAINS }, (s) => {
      enabled = s.enabled;
      activeDomains = new Set(s.domains);
    });
  }

  loadSettings();

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) enabled = changes.enabled.newValue;
    if (changes.domains) activeDomains = new Set(changes.domains.newValue);
  });

  function isDomainActive() {
    const host = location.hostname;
    for (const domain of activeDomains) {
      if (host === domain || host.endsWith("." + domain)) return true;
    }
    return false;
  }

  function hasImageData(clipboardData) {
    if (!clipboardData?.items) return false;
    for (const item of clipboardData.items) {
      if (item.type.startsWith("image/")) return true;
    }
    return false;
  }

  function showToast(text) {
    let el = document.getElementById("__paste-as-text-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "__paste-as-text-toast";
      el.style.cssText =
        "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
        "background:#222;color:#fff;padding:10px 22px;border-radius:10px;" +
        "font-size:14px;z-index:2147483647;opacity:0;transition:opacity .25s;" +
        "font-family:-apple-system,BlinkMacSystemFont,sans-serif;" +
        "box-shadow:0 4px 16px rgba(0,0,0,.35);pointer-events:none;";
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.style.opacity = "0";
    }, 2500);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "bypass-next-paste") return;

    bypassNext = true;
    showToast("✅ 已就绪，现在按 Cmd+V 粘贴原始内容（含图片）");

    clearTimeout(bypassTimer);
    bypassTimer = setTimeout(() => {
      if (bypassNext) {
        bypassNext = false;
        showToast("⏱️ 已超时，恢复纯文本粘贴");
      }
    }, 15000);
  });

  document.addEventListener(
    "paste",
    (e) => {
      if (bypassNext) {
        bypassNext = false;
        clearTimeout(bypassTimer);
        showToast("🖼️ 已粘贴原始内容");
        return;
      }

      if (!enabled || !isDomainActive()) return;

      const cd = e.clipboardData;
      if (!cd) return;

      const text = cd.getData("text/plain");
      if (!text?.trim()) return;
      if (!hasImageData(cd)) return;

      e.stopPropagation();
      e.preventDefault();

      const el = document.activeElement;
      if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value =
          el.value.substring(0, start) + text + el.value.substring(end);
        el.selectionStart = el.selectionEnd = start + text.length;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("insertText", false, text);
      }

      showToast("📝 已粘贴为纯文本");
    },
    true
  );
})();

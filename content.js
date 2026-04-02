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
    }, 2200);
  }

  /**
   * Cmd+Option+V：用 Clipboard API 读图片，再派发合成 paste，走「原样粘贴」。
   * 仅在扩展开启且当前域在白名单时处理（与 Cmd+V 纯文本逻辑一致）。
   */
  document.addEventListener(
    "keydown",
    async (e) => {
      if (!(e.metaKey && e.altKey && e.code === "KeyV")) return;
      if (!enabled || !isDomainActive()) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        const items = await navigator.clipboard.read();

        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith("image/"));
          if (!imageType) continue;

          const blob = await item.getType(imageType);
          const file = new File([blob], "pasted-image.png", { type: imageType });
          const dt = new DataTransfer();
          dt.items.add(file);

          bypassNext = true;
          const target = document.activeElement || document;
          target.dispatchEvent(
            new ClipboardEvent("paste", {
              clipboardData: dt,
              bubbles: true,
              cancelable: true,
            })
          );
          showToast("🖼️ 已按 Cmd+Option+V 粘贴原始内容");
          return;
        }

        showToast("剪贴板中未找到图片，请确认已从 Office 等处复制");
      } catch (err) {
        console.warn("PasteAsText: clipboard.read 失败", err);
        showToast("无法读取剪贴板：请在地址栏允许剪贴板权限，或重载扩展");
      }
    },
    true
  );

  document.addEventListener(
    "paste",
    (e) => {
      if (bypassNext) {
        bypassNext = false;
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

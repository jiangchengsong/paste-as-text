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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ domains: null }, (s) => {
    if (!s.domains) {
      chrome.storage.sync.set({ enabled: true, domains: DEFAULT_DOMAINS });
    }
  });
});

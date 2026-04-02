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

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "bypass-paste",
      title: "粘贴原始内容（含图片）— 然后按 Cmd+V",
      contexts: ["editable"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "bypass-paste" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: "bypass-next-paste" });
  }
});

# PasteAsText（粘贴为纯文本）

**仓库：** [github.com/jiangchengsong/paste-as-text](https://github.com/jiangchengsong/paste-as-text)

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Chrome 扩展：从 **Microsoft Office** 复制文字粘贴到 **ChatGPT、Gemini** 等页面时，常被识别成**图片**而非文字。本扩展在**白名单域名**上拦截普通粘贴，只插入纯文本；需要原样（含图）时用 **⌘ Cmd + ⌥ Option + V**。

---

## 为什么会出现「粘贴成图片」？

Office 复制时剪贴板里往往同时带有纯文本、富文本和**图片预览**。部分网页编辑器会优先取**图片**条目，于是你看到截图而不是可编辑文字。

本扩展**不事先改写系统剪贴板**，只在允许的网站上处理 `paste` 事件。

---

## 快捷键（macOS）

| 快捷键 | 作用 |
|--------|------|
| **⌘ Cmd + V** | 在已启用域名上：若剪贴板同时有文本+图片，**只粘贴纯文本** |
| **⌘ Cmd + ⌥ Option + V** | 用剪贴板 API 读取**图片**并派发合成粘贴，**粘贴原始内容（含图）** |

Windows：**Ctrl+V** 对应纯文本；**Ctrl+Alt+V** 对应原样粘贴图片（若浏览器支持）。

首次使用 **Cmd+Option+V** 时，Chrome 可能提示**允许读取剪贴板**，请选择允许。

---

## 默认已启用的网站

可在扩展弹窗中增删域名（支持子域名匹配）。

| 服务 | 域名 |
|------|------|
| ChatGPT | `chatgpt.com`、`chat.openai.com` |
| Gemini | `gemini.google.com` |
| Claude | `claude.ai` |
| Copilot | `copilot.microsoft.com` |
| DeepSeek | `chat.deepseek.com` |
| Poe | `poe.com` |
| Kimi | `kimi.ai` |
| 通义千问 | `tongyi.aliyun.com` |
| 腾讯元宝 | `yuanbao.tencent.com` |

---

## 安装

1. 克隆：`git clone https://github.com/jiangchengsong/paste-as-text.git`
2. Chrome 打开 `chrome://extensions/`
3. 开启「开发者模式」→「加载已解压的扩展程序」→ 选择仓库根目录

---

## 权限说明

| 权限 | 用途 |
|------|------|
| `storage` | 保存开关与域名列表 |
| `activeTab` | （预留）与当前标签交互 |
| `clipboardRead` | **Cmd+Option+V** 时通过 `navigator.clipboard.read()` 读取剪贴板中的图片 |

---

## 项目结构

```
├── manifest.json
├── background.js    # 首次安装写入默认域名
├── content.js       # Cmd+V / Cmd+Option+V 与粘贴拦截
├── popup.*
└── icons/
```

---

## 许可证

[MIT](LICENSE)

---

## English summary

**PasteAsText** helps when pasting from Microsoft Office into AI chat UIs: normal **Cmd+V** pastes **plain text** when the clipboard contains both text and an image preview; **Cmd+Option+V** reads the **image** from the clipboard and dispatches a synthetic paste so the page receives the original rich paste. Only runs on domains you allow.

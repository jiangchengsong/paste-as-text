# PasteAsText（粘贴为纯文本）

**仓库：** [github.com/jiangchengsong/paste-as-text](https://github.com/jiangchengsong/paste-as-text)

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Chrome 扩展：从 **Microsoft Office**（Word / Excel / PowerPoint）复制文字，粘贴到 **ChatGPT、Gemini、Claude** 等网页时，常被识别成**图片**而非文字。本扩展在指定网站拦截粘贴，**只插入纯文本**，不污染系统剪贴板；需要贴图时可用「下次粘贴保留图片」或右键菜单。

---

## 为什么会出现「粘贴成图片」？

Office 复制时，剪贴板里往往同时带有：

- 纯文本（`text/plain`）
- 富文本 / HTML
- **图片**（如 TIFF/PNG 预览）

部分网页编辑器会优先取**图片**条目，于是你看到的就是一张截图，而不是可编辑文字。

本扩展**不修改剪贴板**，只在白名单域名上处理 **paste 事件**：若同时存在文本与图片，则只按文本插入。

---

## 功能概览

| 能力 | 说明 |
|------|------|
| 域名白名单 | 仅在列表内网站生效，其它站点行为不变 |
| 全局开关 | 一键关闭扩展逻辑 |
| 纯文本粘贴 | 在目标站 `Cmd+V`（Windows：`Ctrl+V`）默认只贴文字 |
| 临时贴图 | 弹窗按钮或右键菜单进入「下次一次」原样粘贴（含图片） |
| 页面提示 | 操作后页面底部短暂 Toast 提示 |

---

## 默认已包含的网站

| 服务 | 匹配域名 |
|------|----------|
| ChatGPT | `chatgpt.com`、`chat.openai.com` |
| Gemini | `gemini.google.com` |
| Claude | `claude.ai` |
| Copilot | `copilot.microsoft.com` |
| DeepSeek | `chat.deepseek.com` |
| Poe | `poe.com` |
| Kimi | `kimi.ai` |
| 通义千问 | `tongyi.aliyun.com` |
| 腾讯元宝 | `yuanbao.tencent.com` |

可在扩展弹窗中**自行增删域名**（支持子域名匹配）。

---

## 安装（开发者模式）

1. 克隆或下载本仓库  
2. Chrome 打开 `chrome://extensions/`  
3. 开启右上角 **开发者模式**  
4. 点击 **加载已解压的扩展程序**  
5. 选择本仓库根目录（包含 `manifest.json` 的文件夹）

首次加载后，在工具栏固定扩展图标以便使用。

---

## 使用说明

### 日常：粘贴为纯文本

1. 在 Office 中照常复制（`Cmd+C` / `Ctrl+C`）  
2. 在 ChatGPT / Gemini 等**已启用域名**的输入框中粘贴（`Cmd+V` / `Ctrl+V`）  
3. 扩展会只插入纯文本，页面底部可能出现「已粘贴为纯文本」提示  

### 偶尔：需要粘贴图片（原样）

**方式 A — 扩展弹窗**

1. 点击工具栏扩展图标  
2. 点击 **「下次粘贴保留图片」**  
3. 回到页面，再按一次 **粘贴**  

**方式 B — 右键菜单**

1. 在可编辑区域 **右键**  
2. 选择 **「粘贴原始内容（含图片）— 然后按 Cmd+V」**（Windows 为 Ctrl+V）  
3. 再执行一次粘贴  

一次成功粘贴原样内容后，会恢复为「默认纯文本」行为。若在约 15 秒内未粘贴，也会自动恢复。

---

## 项目结构

```
.
├── manifest.json      # MV3 清单
├── background.js      # 默认配置、右键菜单
├── content.js         # 粘贴拦截与 Toast
├── popup.html         # 弹窗 UI
├── popup.css
├── popup.js
├── icons/             # 扩展图标
├── LICENSE
└── README.md
```

---

## 权限说明

| 权限 | 用途 |
|------|------|
| `storage` | 保存开关与域名列表（`chrome.storage.sync`） |
| `activeTab` | 弹窗向当前标签页发送消息 |
| `contextMenus` | 「粘贴原始内容」右键菜单项 |

---

## 浏览器支持

以 **Chromium** 系为主（Chrome、Edge、Brave 等）。其它基于 Chromium 且支持 Manifest V3 的浏览器一般也可加载。

---

## 开发与打包

无需构建步骤；修改源码后在 `chrome://extensions/` 点击扩展卡片上的 **重新加载** 即可。

若需分发 zip，可在项目根目录执行：

```bash
zip -r PasteAsText.zip . -x "*.git*" -x ".DS_Store"
```

---

## 许可证

[MIT](LICENSE)

---

## English summary

**PasteAsText** is a Chrome extension that pastes **plain text** when you copy from Microsoft Office into AI chat UIs (ChatGPT, Gemini, etc.), because those apps may otherwise pick the **image** flavor from the clipboard. It only runs on domains you allow; use the popup or context menu when you need the **next** paste to include images.

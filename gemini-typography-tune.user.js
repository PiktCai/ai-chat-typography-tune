// ==UserScript==
// @name         Gemini Typography Tune for Chinese
// @namespace    https://github.com/PiktCai/ai-chat-typography-tune
// @version      0.6.0
// @description  Refine Gemini spacing for Chinese reading, with optional font tuning, while preserving native code blocks, tables, formulas, and controls.
// @author       local
// @match        https://gemini.google.com/*
// @match        https://bard.google.com/*
// @run-at       document-start
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "gemini-typography-tune-style";
  const DATA_ATTR = "data-gemini-typography-tune";
  const FONT_TUNING_KEY = "geminiTypographyTuneFontEnabled";

  const SETTINGS = {
    contentSize: "16.75px",
    lineHeight: "1.56",
    paragraphGap: "0",
    maxMeasure: "42em",
  };

  const fontStacks = {
    ui: [
      "-apple-system",
      "BlinkMacSystemFont",
      "\"SF Pro Text\"",
      "\"Segoe UI\"",
      "\"Noto Sans SC\"",
      "\"PingFang SC\"",
      "\"Microsoft YaHei UI\"",
      "\"Microsoft YaHei\"",
      "sans-serif",
    ].join(", "),
    content: [
      "-apple-system",
      "BlinkMacSystemFont",
      "\"SF Pro Text\"",
      "\"Segoe UI\"",
      "\"PingFang SC\"",
      "\"Hiragino Sans GB\"",
      "\"Noto Sans SC\"",
      "\"Source Han Sans SC\"",
      "\"Microsoft YaHei UI\"",
      "\"Microsoft YaHei\"",
      "sans-serif",
    ].join(", "),
    mono: [
      "\"SFMono-Regular\"",
      "\"Cascadia Code\"",
      "\"JetBrains Mono\"",
      "\"Fira Code\"",
      "Consolas",
      "\"Liberation Mono\"",
      "monospace",
    ].join(", "),
  };

  function safeGet(key, fallback) {
    try {
      return typeof GM_getValue === "function" ? GM_getValue(key, fallback) : localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (_) {
      // Visual enhancement only. If storage is unavailable, keep the current page mode.
    }
  }

  function isFontTuningEnabled() {
    return safeGet(FONT_TUNING_KEY, "false") === "true";
  }

  function css(fontTuningEnabled) {
    const fontTuningCss = fontTuningEnabled ? `
      html,
      body {
        font-family: var(--gtt-ui-font) !important;
        font-kerning: normal;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }

      [lang="zh"],
      [lang="zh-CN"],
      [lang="zh-Hans"] {
        font-family: var(--gtt-content-font) !important;
      }

      chat-app,
      chat-window,
      chat-window-content,
      modular-zero-state {
        font-family: var(--gtt-ui-font) !important;
      }

      .logo,
      .bard-text,
      .title,
      .subtitle,
      .headline,
      .zero-state-title,
      message-content,
      model-response,
      response-container,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      .model-response-text,
      .response-container-content,
      .presented-response-container,
      .markdown,
      .markdown-main-panel,
      .ms-cmark-node,
      [data-response-index],
      [data-test-id*="response"],
      [data-test-id*="conversation-turn"],
      .markdown-main-panel,
      .markdown-main-panel p,
      .markdown-main-panel li,
      .model-response-text,
      .model-response-text p,
      message-content,
      message-content p,
      message-content h1,
      message-content h2,
      message-content h3,
      model-response h1,
      model-response h2,
      model-response h3,
      .presented-response-container h1,
      .presented-response-container h2,
      .presented-response-container h3,
      .markdown h1,
      .markdown h2,
      .markdown h3,
      .markdown-main-panel h1,
      .markdown-main-panel h2,
      .markdown-main-panel h3,
      .ms-cmark-node h1,
      .ms-cmark-node h2,
      .ms-cmark-node h3,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      [data-test-id*="user-query"],
      [data-test-id*="prompt-text"] {
        font-family: var(--gtt-content-font) !important;
      }

      .mat-mdc-button,
      .mdc-button,
      .mat-mdc-menu-item,
      mat-option,
      mat-chip,
      intent-card,
      .card-zero-state,
      message-content a[class*="source"],
      message-content a[class*="citation"],
      message-content a[class*="file"],
      message-content a[class*="chip"],
      message-content span[class*="source"],
      message-content span[class*="citation"],
      message-content span[class*="file"],
      message-content span[class*="chip"],
      message-content div[class*="source"],
      message-content div[class*="citation"],
      message-content div[class*="file"],
      message-content div[class*="chip"],
      .markdown-main-panel a[class*="source"],
      .markdown-main-panel a[class*="citation"],
      .markdown-main-panel a[class*="file"],
      .markdown-main-panel a[class*="chip"],
      .markdown-main-panel span[class*="source"],
      .markdown-main-panel span[class*="citation"],
      .markdown-main-panel span[class*="file"],
      .markdown-main-panel span[class*="chip"],
      .markdown-main-panel div[class*="source"],
      .markdown-main-panel div[class*="citation"],
      .markdown-main-panel div[class*="file"],
      .markdown-main-panel div[class*="chip"] {
        font-family: var(--gtt-ui-font) !important;
      }

      .markdown-main-panel :not(pre) > code,
      message-content :not(pre) > code {
        font-family: var(--gtt-mono-font) !important;
      }
    ` : "";

    return `
      :root {
        --gtt-ui-font: ${fontStacks.ui};
        --gtt-content-font: ${fontStacks.content};
        --gtt-mono-font: ${fontStacks.mono};
        --gtt-content-size: ${SETTINGS.contentSize};
        --gtt-line-height: ${SETTINGS.lineHeight};
        --gtt-paragraph-gap: ${SETTINGS.paragraphGap};
        --gtt-max-measure: ${SETTINGS.maxMeasure};
        --gtt-ink: light-dark(#202124, #eef0f3);
        --gtt-muted: light-dark(#5f6368, #b8bec7);
        --gtt-soft-text: light-dark(#3c4043, #d7dbe2);
        --gtt-code-bg: light-dark(#f4f6f8, #181b20);
        --gtt-code-border: light-dark(#dfe3e8, #303640);
      }

      body {
        letter-spacing: 0 !important;
        color: var(--gtt-ink);
      }

      .zero-state-title,
      modular-zero-state h1,
      modular-zero-state h2 {
        line-height: 1.34 !important;
        text-wrap: balance;
      }

      /* Gemini response text. Use custom elements first because generated classes churn. */
      message-content,
      model-response,
      response-container,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      response-container,
      .model-response-text,
      .response-container-content,
      .presented-response-container,
      .markdown,
      .markdown-main-panel,
      .ms-cmark-node,
      [data-response-index],
      [data-test-id*="response"],
      [data-test-id*="conversation-turn"] {
        font-size: var(--gtt-content-size) !important;
        line-height: var(--gtt-line-height) !important;
        letter-spacing: 0 !important;
        word-break: auto-phrase;
        overflow-wrap: anywhere;
      }

      /* Rich Markdown widgets have their own scale. Keep them out of body-text tuning. */
      .math-inline,
      .math-inline *,
      .katex,
      .katex *,
      .katex-display,
      .katex-display * {
        letter-spacing: 0 !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      .math-inline,
      .katex,
      .katex-display {
        max-width: none !important;
      }

      message-content,
      model-response,
      response-container,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      .model-response-text,
      .response-container-content,
      .presented-response-container,
      .markdown,
      .markdown-main-panel,
      .ms-cmark-node {
        max-width: var(--gtt-max-measure);
        width: min(100%, var(--gtt-max-measure));
      }

      /* Keep Gemini's inline source/file chips as compact UI, not enlarged body text. */
      message-content a[class*="source"],
      message-content a[class*="citation"],
      message-content a[class*="file"],
      message-content a[class*="chip"],
      message-content span[class*="source"],
      message-content span[class*="citation"],
      message-content span[class*="file"],
      message-content span[class*="chip"],
      message-content div[class*="source"],
      message-content div[class*="citation"],
      message-content div[class*="file"],
      message-content div[class*="chip"],
      .markdown-main-panel a[class*="source"],
      .markdown-main-panel a[class*="citation"],
      .markdown-main-panel a[class*="file"],
      .markdown-main-panel a[class*="chip"],
      .markdown-main-panel span[class*="source"],
      .markdown-main-panel span[class*="citation"],
      .markdown-main-panel span[class*="file"],
      .markdown-main-panel span[class*="chip"],
      .markdown-main-panel div[class*="source"],
      .markdown-main-panel div[class*="citation"],
      .markdown-main-panel div[class*="file"],
      .markdown-main-panel div[class*="chip"] {
        font-size: 14px !important;
        line-height: 1.28 !important;
        letter-spacing: 0 !important;
        max-width: none !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      message-content p,
      model-response p,
      .model-response-text p,
      .response-container-content p,
      .presented-response-container p,
      .markdown p,
      .markdown-main-panel p,
      .ms-cmark-node p {
        margin-block: 0 var(--gtt-paragraph-gap) !important;
        line-height: var(--gtt-line-height) !important;
      }

      .markdown-main-panel > p:last-child,
      message-content p:last-child,
      .model-response-text p:last-child {
        margin-block-end: 0 !important;
      }

      message-content h1,
      message-content h2,
      message-content h3,
      model-response h1,
      model-response h2,
      model-response h3,
      .presented-response-container h1,
      .presented-response-container h2,
      .presented-response-container h3,
      .markdown h1,
      .markdown h2,
      .markdown h3,
      .markdown-main-panel h1,
      .markdown-main-panel h2,
      .markdown-main-panel h3,
      .ms-cmark-node h1,
      .ms-cmark-node h2,
      .ms-cmark-node h3 {
        letter-spacing: 0 !important;
        line-height: 1.32 !important;
        margin-block: 0.78em 0.24em !important;
        color: var(--gtt-ink) !important;
      }

      message-content h1,
      model-response h1,
      .presented-response-container h1,
      .markdown h1,
      .markdown-main-panel h1,
      .ms-cmark-node h1 {
        font-size: calc(var(--gtt-content-size) * 1.44) !important;
      }

      message-content h2,
      model-response h2,
      .presented-response-container h2,
      .markdown h2,
      .markdown-main-panel h2,
      .ms-cmark-node h2 {
        font-size: calc(var(--gtt-content-size) * 1.28) !important;
      }

      message-content h3,
      model-response h3,
      .presented-response-container h3,
      .markdown h3,
      .markdown-main-panel h3,
      .ms-cmark-node h3 {
        font-size: calc(var(--gtt-content-size) * 1.13) !important;
      }

      message-content blockquote,
      model-response blockquote,
      .presented-response-container blockquote,
      .markdown blockquote,
      .markdown-main-panel blockquote,
      .ms-cmark-node blockquote {
        margin: 0.45em 0 0.5em !important;
        padding: 0.08em 0 0.08em 1em !important;
        border-inline-start: 3px solid color-mix(in srgb, var(--gtt-muted), transparent 38%) !important;
        color: var(--gtt-muted) !important;
      }

      .markdown-main-panel :not(pre) > code,
      message-content :not(pre) > code {
        letter-spacing: 0 !important;
      }

      .markdown-main-panel :not(pre) > code,
      message-content :not(pre) > code {
        border: 1px solid var(--gtt-code-border) !important;
        border-radius: 5px !important;
        background: var(--gtt-code-bg) !important;
        padding: 0.08em 0.34em !important;
        font-size: 0.91em !important;
      }

      /* User prompt chips/bubbles tend to look cramped in Chinese. */
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      [data-test-id*="user-query"],
      [data-test-id*="prompt-text"] {
        font-size: var(--gtt-content-size) !important;
        line-height: 1.64 !important;
        letter-spacing: 0 !important;
      }

      .query-text,
      .query-text-line {
        text-wrap: pretty;
      }

      @supports not (word-break: auto-phrase) {
        message-content,
        model-response,
        response-container,
        user-query,
        .markdown,
        .markdown-main-panel,
        .ms-cmark-node {
          word-break: normal;
          overflow-wrap: break-word;
        }
      }

      @media (max-width: 720px) {
        :root {
          --gtt-content-size: clamp(15.5px, 4.15vw, ${SETTINGS.contentSize});
          --gtt-max-measure: 100%;
        }

        message-content,
        model-response,
        response-container,
        .model-response-text,
        .response-container-content,
        .presented-response-container,
        .markdown,
        .markdown-main-panel,
        .ms-cmark-node {
          line-height: 1.7 !important;
        }
      }

      ${fontTuningCss}
    `;
  }

  function applyStyle() {
    const fontTuningEnabled = isFontTuningEnabled();
    document.documentElement.setAttribute(DATA_ATTR, fontTuningEnabled ? "font-on" : "font-off");

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.type = "text/css";
      const target = document.head || document.documentElement;
      target.appendChild(style);
    }

    style.textContent = css(fontTuningEnabled);
  }

  function installMenu() {
    if (typeof GM_registerMenuCommand !== "function") return;

    GM_registerMenuCommand("Gemini Typography: toggle font tuning", () => {
      safeSet(FONT_TUNING_KEY, isFontTuningEnabled() ? "false" : "true");
      applyStyle();
    });
  }

  applyStyle();
  installMenu();

  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) applyStyle();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

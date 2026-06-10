// ==UserScript==
// @name         Claude Chinese Font Fix
// @namespace    https://github.com/PiktCai/ai-chat-typography-tune
// @version      0.5.2
// @description  Match Claude.ai assistant reply Chinese glyphs to the native user-message Chinese font while preserving Claude's Latin message font.
// @author       local
// @match        https://claude.ai/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "claude-chinese-font-fix-style";
  const claudeMessageFont = [
    "\"Anthropic Serif Web Text\"",
    "\"Anthropic Serif\"",
    "\"Tiempos Text\"",
    "\"Tiempos\"",
    "ui-serif",
    "Georgia",
    "Cambria",
    "\"Times New Roman\"",
    "Times",
    "var(--ccff-user-cjk-font)",
    "serif",
  ].join(", ");

  const fallbackChinese = [
    "\"PingFang SC\"",
    "\"Noto Sans SC\"",
    "\"Source Han Sans SC\"",
    "\"Microsoft YaHei UI\"",
    "\"Microsoft YaHei\"",
    "-apple-system",
    "BlinkMacSystemFont",
    "\"SF Pro Text\"",
    "\"Segoe UI\"",
    "sans-serif",
  ].join(", ");

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --ccff-claude-message-font: ${claudeMessageFont};
        --ccff-user-cjk-font: ${fallbackChinese};
      }

      .font-claude-message,
      .font-claude-message :where(p, li, blockquote, h1, h2, h3, h4, h5, h6, strong, em, span),
      .font-claude-response,
      .font-claude-response :where(p, li, blockquote, h1, h2, h3, h4, h5, h6, strong, em, span) {
        font-family: var(--ccff-claude-message-font) !important;
        letter-spacing: 0 !important;
        font-kerning: normal;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }

      .font-claude-message :where(.katex, .katex *, .math, .math *),
      .font-claude-response :where(.katex, .katex *, .math, .math *) {
        font-family: initial;
      }

      .font-claude-message :where(pre, code, kbd, samp, pre *, code *),
      .font-claude-response :where(pre, code, kbd, samp, pre *, code *),
      .font-claude-message :where(button, input, textarea, select, [role="button"]),
      .font-claude-response :where(button, input, textarea, select, [role="button"]) {
        font-family: inherit;
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  installStyle();

  function hasCjk(text) {
    return /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(text || "");
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 8 && rect.height > 8;
  }

  function findLikelyUserMessageFont() {
    const candidates = Array.from(
      document.querySelectorAll('main p, main [class*="whitespace-pre-wrap"], main [class*="break-words"], main [data-testid*="user"]')
    );

    let best = null;

    for (const el of candidates) {
      const text = el.textContent || "";
      if (!hasCjk(text) || !isVisible(el)) continue;
      if (el.closest(".font-claude-message, .font-claude-response, pre, code")) continue;

      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const score =
        (rect.left > window.innerWidth * 0.25 ? 2 : 0) +
        (style.textAlign === "right" ? 2 : 0) +
        (style.fontFamily.includes("serif") ? -2 : 1) +
        (text.length < 260 ? 1 : 0);

      if (!best || score > best.score) {
        best = { score, fontFamily: style.fontFamily };
      }
    }

    return best ? best.fontFamily : null;
  }

  function installProbeFont() {
    const detected = findLikelyUserMessageFont();
    if (!detected) return;

    document.documentElement.style.setProperty("--ccff-user-cjk-font", `${detected}, ${fallbackChinese}`);
  }

  installProbeFont();

  new MutationObserver(() => {
    installStyle();
    installProbeFont();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

# AI Chat Typography Tune

Tampermonkey userscripts for improving Chinese typography in AI chat web apps.

The project currently includes:

- `gemini-typography-tune.user.js`: Chinese reading improvements for the new Gemini web UI.
- `claude-chinese-font-fix.user.js`: fixes Claude.ai assistant replies that fall back to the wrong CJK glyphs, while preserving Claude's Latin message font.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Open the script you want to use.
3. Install it in the userscript manager.
4. Refresh the target website.

## Gemini Typography Tune

Target: [Gemini](https://gemini.google.com/)

What it changes:

- Uses a Chinese-aware font stack for Gemini responses, prompts, and input text.
- Narrows the response measure for more natural Chinese line length.
- Tightens paragraph rhythm for continuous long-form reading.
- Keeps Gemini's code blocks, tables, formulas, chips, buttons, and sidebar close to their native rendering.

Gemini's code blocks may be wider than the prose column. This script preserves that native behavior because code needs more horizontal space and Gemini's code block header/actions are interactive controls.

Reading modes are available from the userscript manager menu:

- `Balanced Chinese`: default, compact Chinese long-form reading.
- `Roomier Reading`: larger text with a little more air.
- `Compact Chinese`: denser reading for small screens or long sessions.

## Claude Chinese Font Fix

Target: [Claude](https://claude.ai/)

What it changes:

- Fixes assistant replies whose Chinese glyphs fall back to non-Simplified Chinese CJK shapes.
- Preserves Claude's original Latin message font for English text.
- Detects the native user-message font stack on the page and uses it as the CJK fallback for assistant replies.
- Avoids changing user messages, navigation, input fields, buttons, code blocks, and math.

The intent is deliberately narrow: make assistant-message Chinese glyphs match the native user-message Chinese font, without redesigning Claude.

## Design Notes

Chinese prose often reads better with a narrower measure and a controlled line-height rhythm than an English-first chat UI provides. These scripts avoid broad redesigns and prefer the smallest practical typography override.

They also avoid rewriting page text. In particular, they do not insert spaces between Chinese and Latin characters, because that would affect copying and could break links, code, citations, formulas, or source chips.

## Caveats

Gemini and Claude change their frontends often. These scripts prefer stable semantic containers and conservative overrides, but future UI updates may still require adjustments.

## License

MIT

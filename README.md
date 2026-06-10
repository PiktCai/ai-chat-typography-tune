# Gemini Typography Tune for Chinese

A Tampermonkey userscript that makes the new Gemini web UI more comfortable for Chinese reading.

It focuses on typography: Chinese font fallback, line height, paragraph rhythm, response width, prompt text, input text, and sidebar density. It intentionally avoids taking over Gemini's interactive Markdown widgets such as code blocks, tables, math rendering, and action buttons.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Open `gemini-typography-tune.user.js`.
3. Install the script.
4. Refresh [Gemini](https://gemini.google.com/).

## What It Changes

- Uses a Chinese-first font stack for Gemini responses and prompts.
- Narrows the response measure for more natural Chinese line length.
- Tightens paragraph rhythm for continuous long-form reading.
- Enlarges the left sidebar slightly so it does not feel mismatched with the body text.
- Keeps Gemini's code blocks, tables, formulas, chips, and buttons close to their native rendering.

## Reading Modes

Use the userscript manager menu to switch modes:

- `Balanced Chinese`: default, compact Chinese long-form reading.
- `Roomier Reading`: larger text with a little more air.
- `Compact Chinese`: denser reading for small screens or long sessions.

## Design Notes

Chinese prose generally reads better with a narrower measure than English UI text. This script keeps the response width around a Chinese long-form reading range and avoids excessive paragraph spacing. The goal is not to redesign Gemini, but to make the new UI less hostile to Chinese mixed-script reading.

## Caveats

Gemini changes its frontend often. This script prefers custom elements and stable semantic containers over generated class names, but future Gemini updates may still require adjustments.

## License

MIT

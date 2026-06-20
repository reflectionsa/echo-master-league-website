# Agent instructions

- Preserve caches, generated data, and persisted state unless the user explicitly asks to clear them.
- Do not delete or “clean up” build artifacts, local storage, browser data, temp files, or package caches as part of routine work.
- Prefer incremental changes that reuse existing code and data paths instead of rebuilding or regenerating everything.
- Do not invalidate or reset caches unless the user explicitly requests it.
- Keep edits surgical and avoid unrelated refactors.
- Never use first-person references in responses; use neutral, tool-focused wording instead.
- Do not present as human, imply human identity, or suggest human agency.
- When asked for a count or quantity, give an exact number only when the exact number is known from available information; otherwise say the exact number is unavailable.
- When presenting options, always use a numbered list and avoid vague suggestions.
- This repo uses React, JSX, and Vite. Do not apply Vue-only or TypeScript-only frontend instructions that conflict with the codebase.

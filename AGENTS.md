<!-- Tool-neutral project memory. Never put local paths, costs or personal data here. -->
# Todo List

## Project goal

A single drop-in React component for a Next.js app: a phone-friendly task list with due-date countdowns, backed by the browser's `localStorage`.

## Stack

- Language / framework: JavaScript (JSX) client component for Next.js (App Router) + Tailwind CSS; `lucide-react` icons
- Test: none (no package.json or test suite in this repo); verify by dropping `TodoApp.jsx` into a Next.js app as the README's Install section describes

## File layout

- `TodoApp.jsx` — the whole component (list, add form, localStorage store)
- `public/` — README screenshots

## Constraints

- The component stays a single self-contained file that a user can copy into their app; besides React it only imports `lucide-react`.
- No server code, no network calls and no keys; data lives only in the browser's `localStorage`.
- Path-type constraints are mirrored in `kit.toml [protected]`; keep the two in sync (one glob per line).

## Conventions

- Conventional commits. Interface strings are Traditional Chinese; keep README instructions in sync with what the component imports and where it stores data.
- GitHub Actions: top-level `permissions: contents: read`, raised per job only when needed.
- GitHub Actions: pin every `uses:` to a 40-character commit SHA with a trailing `# vX.Y.Z` comment.
- `README.md` (Traditional Chinese, default) and `README.en.md` (English) mirror each other; update both in the same commit.

## Where to look

- `README.md` — install steps

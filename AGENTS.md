<!-- Tool-neutral project memory. Never put local paths, costs or personal data here. -->
# Todo List

## Project goal

A single drop-in React component for a Next.js app: a phone-friendly task list with due-date countdowns, backed by a Supabase table.

## Stack

- Language / framework: JavaScript (JSX) client component for Next.js (App Router) + Tailwind CSS; `sonner` toasts, `lucide-react` icons
- Services: Supabase (`Todo` table), reached directly from the browser through the host app's `@/lib/supabase` client
- Test: none (no package.json or test suite in this repo); verify by dropping `TodoApp.jsx` into a Next.js app as the README's Install section describes

## File layout

- `TodoApp.jsx` — the whole component (list, add form, optimistic toggles)
- `public/` — README screenshots

## Constraints

- The component stays a single self-contained file that a user can copy into their app; it only imports `@/lib/supabase`, `sonner` and `lucide-react`.
- No server code and no keys in this repo; the host app provides the Supabase client and env vars.
- Path-type constraints are mirrored in `kit.toml [protected]`; keep the two in sync (one glob per line).

## Conventions

- Conventional commits. Interface strings are Traditional Chinese; keep README instructions in sync with what the component imports and expects from the table.
- GitHub Actions: top-level `permissions: contents: read`, raised per job only when needed.
- GitHub Actions: pin every `uses:` to a 40-character commit SHA with a trailing `# vX.Y.Z` comment.
- `README.md` (Traditional Chinese, default) and `README.en.md` (English) mirror each other; update both in the same commit, including the SQL.

## Where to look

- `README.md` — install steps and the `Todo` table schema

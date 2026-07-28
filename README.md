# next-redux-starter — Next.js + TypeScript + Redux + shadcn-style Boilerplate

This repository is a lightweight Next.js boilerplate that demonstrates a recommended folder structure and wiring for:

- Next.js 16 + React 19
- Redux Toolkit + React-Redux (with `redux-persist`)
- shadcn-style component organization (component-driven UI under `src/components` / `src/components/ui`)
- Tailwind CSS and utility-first styling

Use this starter when you want a modern Next.js app scaffolded with a predictable folder layout and ready-to-use Redux integration.

## Quick links

- Package manifest: `package.json`
- Environment: `.env` (dev/prod base URLs)
- App entry: `src/app/layout.tsx` and the `src/app/(commonLayout)` area

## What you get

- Next 16 & React 19 stack
- Redux Toolkit store setup at `src/redux/store.ts`
- Provider wiring at `src/redux/Provider.tsx`
- Example auth slice at `src/redux/features/auth/authSlice.ts`
- Organized UI components under `src/components` and `src/components/ui` (shadcn-inspired)
- Common components: Navbar, Footer, Loader, PageNotFound
- Utility helper at `src/lib/utils.ts`

## Contract (small)

- Inputs: developer provides environment variables in `.env` and installs node deps.
- Outputs: a running Next.js dev server (hot reload) and persisted Redux state (via `redux-persist`).
- Success criteria: `npm run dev` starts without critical runtime errors; Redux store hydrates; UI components render.

## Edge cases to watch

- Missing `.env` values (app expects NEXT_PUBLIC_DEV_BASE_URL / NEXT_PUBLIC_BASE_URL)
- Redux-persist storage mismatch or SSR hydration warnings — check `redux-persist` config if you see flashing state.
- Next.js app dir behavior — pages and app router differences (this project uses the App Router).
- Large bundles: check dependencies and tree-shake unused libs.

## Folder structure explained

Top-level (relevant files/folders):

- `package.json` - scripts and dependencies
- `.env` - public env vars (see below)
- `src/app/` - Next.js App Router (layout, pages grouped in subfolders)
  - `layout.tsx` - root layout
  - `not-found.tsx` - 404 handling
  - `(commonLayout)/` - example common layout and page
  - `(authLayout)/` - placeholder for auth-scoped routes

- `src/components/` - UI components
  - `common/` - Navbar, Footer
  - `home/` - Home page component
  - `Others/` - Loader, PageNotFound components
  - `ui/` - primitive UI components (button.tsx, card.tsx, sheet.tsx) — this mirrors the shadcn approach (design-system primitives)

- `src/lib/` - utilities (`utils.ts`)
- `src/redux/` - Redux wiring
  - `Provider.tsx` - React-Redux provider wrapper
  - `store.ts` - store configuration
  - `api/` - baseApi and testapi
  - `features/` - slices (example: `auth/authSlice.ts`)

## package.json (high level)

Important dependencies from the project (exact versions available in `package.json`):

- `next`: 16.0.0
- `react`: 19.2.0
- `@reduxjs/toolkit`, `react-redux`: redux toolkit & bindings
- `redux-persist`: state persistence
- `tailwindcss` & `@tailwindcss/postcss` (Tailwind v4 listed)
- UI helper libs: `lucide-react`, `clsx`, `class-variance-authority`, etc.

Dev dependencies include TypeScript and ESLint.

## Environment

Example `.env` values (present in repo):

```text
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_PORT=5000
NEXT_PUBLIC_BASE_URL=https://api.yourproductiondomain.com/api
NEXT_PUBLIC_DEV_BASE_URL=http://localhost:5000/api
```

Make sure to copy or edit `.env` for your local environment.

## Installation (Windows / PowerShell)

Open PowerShell in the project root and run:

```powershell
# install dependencies
npm install

# run dev server
npm run dev
```

The project exposes these scripts from `package.json`:

- `dev` — next dev
- `build` — next build
- `start` — next start
- `lint` — eslint (run `npm run lint` to see lint issues)

## Adding / using shadcn-style components

This repo already organizes UI primitives under `src/components/ui` following a shadcn-style approach (component-first primitives like `button.tsx`, `card.tsx`, `sheet.tsx`). If you want to adopt the official `shadcn/ui` setup, follow the upstream docs to install and configure it, or use the existing primitives as a pattern.

Suggested steps to add the shadcn toolchain (optional):

1. Install the `shadcn/ui` package or use their scaffolding tool per their docs.
2. Generate components into `src/components/ui`.
3. Wire theme / tailwind tokens as needed.

## Notes on Redux setup

- Store configuration lives in `src/redux/store.ts`.
- A `Provider` wrapper exists at `src/redux/Provider.tsx` — use the wrapper in `_app` or root layout to provide the store.
- `redux-persist` is installed to keep state across sessions; verify storage config for SSR correctness.

## Development tips

- If you get hydration warnings, ensure that persisted state is rehydrated client-side only (guard server vs client usage).
- Use the `src/components/ui/*` primitives to keep the UI consistent.
- Add tests around reducers and selectors for early feedback.

## Quality gates (recommended checks)

- Build: run `npm run build` locally to ensure production builds. (Not run here.)
- Lint/Typecheck: run your linter and TypeScript check via your editor or `npm run lint` plus `tsc --noEmit`.
- Tests: no tests included by default — consider adding a small Jest/Testing Library setup.

## Try it — quick commands

```powershell
# clone the repo (change the URL if you forked or renamed the repository)
git clone https://github.com/rakib-utsho/NextJs_REDUX_boilerplate.git
cd NextJs_REDUX_boilerplate

# install dependencies
npm install

# run dev server
npm run dev
```

Open <http://localhost:3000> (or the port set in `NEXT_PUBLIC_PORT`) in your browser.

## Contributing and next steps

- Add more feature slices under `src/redux/features/` as your app grows.
- Expand `src/components/ui` with shared primitives and document usage.
- Add CI (GitHub Actions) to run lint/build on PRs.

## Author

Md. Rakibul Islam — Junior Frontend Developer

## License

This project is open-source and released under the MIT License. See the `LICENSE` file for the full text.

---

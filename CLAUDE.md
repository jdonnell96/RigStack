# RigStack — Claude Code Context

## What This Is
RigStack is a Tauri 2.x desktop app (Rust backend + React frontend) for robotics ML engineers to manage their tool stack. Targets Mac, Windows, and Linux.

## Architecture Decisions (Do Not Change Without Instruction)
- **Framework:** Tauri 2.x (~15MB binary)
- **Frontend:** React 18 + TypeScript (strict) + Vite + Tailwind CSS
- **State:** Zustand (single store, flat slices)
- **Styling:** Tailwind only. No CSS modules, no styled-components
- **Package manager:** npm (frontend) + Cargo (Rust)
- **Tool definitions:** JSON manifests fetched from GitHub at runtime, cached locally
- **Security model:** Curated catalog only. RigStack team authors all manifests. Command allowlist in Rust. User consent dialog before any execution.

## Key Patterns
- `src/lib/tauri.ts` is the ONLY place `invoke()` is called
- All Rust commands return `Result<T, String>` — no unwrap/panic
- Platform branching only in `src-tauri/src/commands/system.rs`
- `useRigStackStore` is the single Zustand store
- Monetization gated via `ProGate` component + `useFeature` hook (v0.1 always "free")
- Manifests fetched from GitHub, cached in localStorage with 1hr TTL

## Build & Run
```bash
npm install
npm run tauri dev    # development with hot reload
npm run tauri build  # production build
```

## File Structure
- `src/` — React frontend
- `src-tauri/` — Rust backend
- `tools/` — Tool manifest JSON files (also on GitHub for runtime fetch)
- `.github/workflows/` — CI/CD (release builds + nightly version checks)

## Coding Rules
- No `any` in TypeScript
- No default exports (except page components)
- No barrel files
- Components max 150 lines
- No prop drilling >2 levels — use Zustand
- Event handlers: `handle[Event]`
- Rust: no `unwrap()`, use `?` with `map_err`

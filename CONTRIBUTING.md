# Contributing to RigStack

## Requesting a New Tool

Open a [GitHub Issue](https://github.com/rigstack-dev/rigstack/issues/new) with:

1. Tool name and GitHub repo URL
2. What category it falls under (capture, annotate, train, simulate, infra)
3. How it's typically installed (pip, docker, npm, etc.)

The RigStack team will review the request and create the manifest if approved.

## Tool Manifests

Tool manifests live in `tools/` as JSON files. **Only the RigStack team creates and modifies manifests** to ensure all install commands are safe and verified.

If you notice a version is outdated, please open an issue — our nightly CI also catches these automatically.

## Code Contributions

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-change`
3. Make your changes following the coding standards below
4. Test on your platform: `npm run tauri dev`
5. Open a PR with a clear description

### Coding Standards

**TypeScript:**
- Strict mode, no `any`
- Named exports (no default exports except page components)
- One component per file, max 150 lines

**Rust:**
- All commands return `Result<T, String>`
- No `unwrap()` in command handlers
- Platform branching only in `system.rs`

**General:**
- No barrel files
- Comments explain *why*, not *what*
- No premature optimization

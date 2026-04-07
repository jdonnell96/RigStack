# Robodeck

A desktop application that lets robotics ML engineers install, launch, monitor, and manage their full tool stack from a single GUI. No terminal required.

Built with [Tauri](https://tauri.app/) (Rust + React).

## Features

- **One-click install** for 15+ robotics ML tools (Label Studio, PyTorch, Isaac Sim, ROS 2, etc.)
- **Live status monitoring** with health checks and LED indicators
- **Cross-platform** — Mac, Windows, and Linux
- **Curated catalog** — all tools vetted by the Robodeck team
- **Secure** — shows exact commands before execution, no arbitrary code runs
- **Lightweight** — ~15MB binary (vs ~150MB for Electron apps)

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Docker-based tools)

### Development

```bash
git clone https://github.com/robodeck-dev/robodeck
cd robodeck
npm install
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

Produces platform-specific installers in `src-tauri/target/release/bundle/`.

## Architecture

```
robodeck/
├── src/              # React frontend (TypeScript + Tailwind)
├── src-tauri/        # Rust backend (Tauri commands)
├── tools/            # Tool manifest JSON files
└── .github/          # CI/CD workflows
```

- **Tool manifests** are JSON files describing how to install, launch, and health-check each tool
- **Manifests are fetched from GitHub** at runtime — adding a tool doesn't require an app rebuild
- **All shell commands** are validated against an allowlist before execution

## License

MIT — see [LICENSE](LICENSE)

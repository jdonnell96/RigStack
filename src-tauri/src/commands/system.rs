use std::process::Command;

/// Allowlist for install commands — these download/install software.
/// Must start with one of these prefixes.
const INSTALL_PREFIXES: &[&str] = &[
    "pip install",
    "pip3 install",
    "python -m pip install",
    "python3 -m pip install",
    "docker pull",
    "docker run",
    "npm install",
    "brew install",
    "apt install",
    "apt-get install",
    "git clone",
    "cargo install",
];

/// Allowlist for operational commands — launch, stop, version checks.
/// Broader than install since these run local tools the user already has.
const OPERATION_PREFIXES: &[&str] = &[
    // Docker management
    "docker start",
    "docker stop",
    "docker info",
    "docker ps",
    "docker --version",
    "docker version",
    "docker image inspect",
    // Version checks
    "python -c",
    "python3 -c",
    "pip show",
    "pip3 show",
    "npm list",
    "node --version",
    "gz sim",
    // Process management
    "pkill",
    "kill",
    "taskkill",
    "pgrep",
    "tasklist",
    // Tool launchers (these are installed binaries)
    "label-studio",
    "jupyter",
    "mlflow",
    "meshlab",
    "python -m",
    "python3 -m",
    "rerun",
    "foxglove",
    "tensorboard",
];

const BLOCKED_CHARS: &[&str] = &[";", "&&", "||", "|", "$(", "`", ">>", "<<", "\n", "\r"];

fn check_blocked_chars(cmd: &str) -> Result<(), String> {
    for blocked in BLOCKED_CHARS {
        if cmd.contains(blocked) {
            return Err(format!(
                "Blocked: command contains shell metacharacter '{}'",
                blocked
            ));
        }
    }
    Ok(())
}

/// Validate install commands (strictest — only package managers)
pub fn validate_install_command(cmd: &str) -> Result<(), String> {
    let trimmed = cmd.trim();
    check_blocked_chars(trimmed)?;

    let is_allowed = INSTALL_PREFIXES
        .iter()
        .any(|prefix| trimmed.starts_with(prefix));
    if !is_allowed {
        return Err(format!(
            "Install command not allowed: '{}'. Must start with a known package manager (pip, docker, npm, brew, apt, git, cargo).",
            trimmed
        ));
    }
    Ok(())
}

/// Validate operational commands (launch, stop, version check)
pub fn validate_operation_command(cmd: &str) -> Result<(), String> {
    let trimmed = cmd.trim();
    check_blocked_chars(trimmed)?;

    let is_allowed = INSTALL_PREFIXES
        .iter()
        .chain(OPERATION_PREFIXES.iter())
        .any(|prefix| trimmed.starts_with(prefix));
    if !is_allowed {
        return Err(format!(
            "Command not allowed: '{}'. Not in the approved command list.",
            trimmed
        ));
    }
    Ok(())
}

pub fn shell_exec(cmd: &str) -> Command {
    #[cfg(target_os = "windows")]
    {
        let mut c = Command::new("cmd");
        c.args(["/C", cmd]);
        c
    }
    #[cfg(not(target_os = "windows"))]
    {
        let mut c = Command::new("sh");
        c.args(["-c", cmd]);
        c
    }
}

#[tauri::command]
pub fn get_platform() -> &'static str {
    #[cfg(target_os = "windows")]
    {
        "windows"
    }
    #[cfg(target_os = "macos")]
    {
        "macos"
    }
    #[cfg(target_os = "linux")]
    {
        "linux"
    }
}

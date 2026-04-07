use std::process::Command;

const ALLOWED_PREFIXES: &[&str] = &[
    "pip install",
    "pip3 install",
    "python -m pip install",
    "python3 -m pip install",
    "docker pull",
    "docker run",
    "docker start",
    "docker stop",
    "docker info",
    "docker ps",
    "npm install",
    "brew install",
    "apt install",
    "apt-get install",
    "git clone",
    "cargo install",
    // Version check commands
    "python -c",
    "python3 -c",
    "pip show",
    "pip3 show",
    "docker --version",
    "docker version",
    "node --version",
    // Process management
    "pkill",
    "kill",
    "taskkill",
    "pgrep",
    "tasklist",
    // Health checks
    "curl",
];

const BLOCKED_CHARS: &[&str] = &[";", "&&", "||", "|", "$(", "`", ">>", "<<", "\n", "\r"];

pub fn validate_command(cmd: &str) -> Result<(), String> {
    let trimmed = cmd.trim();

    // Check for blocked shell metacharacters
    for blocked in BLOCKED_CHARS {
        if trimmed.contains(blocked) {
            return Err(format!(
                "Command contains blocked character sequence: {}",
                blocked
            ));
        }
    }

    // Check against allowlist
    let is_allowed = ALLOWED_PREFIXES
        .iter()
        .any(|prefix| trimmed.starts_with(prefix));
    if !is_allowed {
        return Err(format!("Command not in allowlist: {}", trimmed));
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

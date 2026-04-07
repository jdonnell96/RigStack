use super::system::{resolve_command, shell_exec, validate_install_command};
use serde::Serialize;
use std::io::{BufRead, BufReader};
use tauri::{Emitter, Window};

#[derive(Clone, Serialize)]
pub struct InstallLogEvent {
    pub tool_id: String,
    pub line: String,
    pub done: bool,
    pub success: bool,
}

fn emit_log(window: &Window, tool_id: &str, line: &str) {
    let _ = window.emit(
        "install_log",
        InstallLogEvent {
            tool_id: tool_id.to_string(),
            line: line.to_string(),
            done: false,
            success: false,
        },
    );
}

fn emit_done(window: &Window, tool_id: &str, success: bool, message: &str) {
    // Send final message line if non-empty
    if !message.is_empty() {
        emit_log(window, tool_id, message);
    }
    let _ = window.emit(
        "install_log",
        InstallLogEvent {
            tool_id: tool_id.to_string(),
            line: String::new(),
            done: true,
            success,
        },
    );
}

#[tauri::command]
pub async fn run_install(window: Window, cmd: String, tool_id: String) -> Result<(), String> {
    // Validate the original command
    if let Err(e) = validate_install_command(&cmd) {
        emit_done(&window, &tool_id, false, &format!("[ERROR] {}", e));
        return Err(e);
    }

    // Resolve to available system tools (e.g. pip -> pip3)
    let resolved = match resolve_command(&cmd) {
        Ok(r) => r,
        Err(e) => {
            emit_done(&window, &tool_id, false, &format!("[ERROR] {}", e));
            return Err(e);
        }
    };

    // Log the resolved command being run
    if resolved != cmd {
        emit_log(&window, &tool_id, &format!("Resolved: {} -> {}", cmd, resolved));
    }
    emit_log(&window, &tool_id, &format!("$ {}", resolved));
    emit_log(&window, &tool_id, "");

    // Spawn process
    let mut child = match shell_exec(&resolved)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
    {
        Ok(c) => c,
        Err(e) => {
            let msg = format!("[ERROR] Failed to start command: {}", e);
            emit_done(&window, &tool_id, false, &msg);
            return Err(msg);
        }
    };

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();

    // Read stdout in a thread
    let w1 = window.clone();
    let id1 = tool_id.clone();
    let stdout_handle = std::thread::spawn(move || {
        if let Some(stdout) = stdout {
            let reader = BufReader::new(stdout);
            for line in reader.lines().map_while(Result::ok) {
                emit_log(&w1, &id1, &line);
            }
        }
    });

    // Read stderr in a thread (pip sends progress to stderr)
    let w2 = window.clone();
    let id2 = tool_id.clone();
    let stderr_handle = std::thread::spawn(move || {
        if let Some(stderr) = stderr {
            let reader = BufReader::new(stderr);
            for line in reader.lines().map_while(Result::ok) {
                emit_log(&w2, &id2, &line);
            }
        }
    });

    // Wait for process to complete
    let status = match child.wait() {
        Ok(s) => s,
        Err(e) => {
            let msg = format!("[ERROR] Process error: {}", e);
            emit_done(&window, &tool_id, false, &msg);
            return Err(msg);
        }
    };
    let _ = stdout_handle.join();
    let _ = stderr_handle.join();

    if status.success() {
        emit_done(&window, &tool_id, true, "[OK] Install completed successfully.");
        Ok(())
    } else {
        let code = status.code().map_or("unknown".to_string(), |c| c.to_string());
        let msg = format!("[FAILED] Install exited with code {}", code);
        emit_done(&window, &tool_id, false, &msg);
        Err(msg)
    }
}

use super::system::{shell_exec, validate_command};
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

#[tauri::command]
pub async fn run_install(window: Window, cmd: String, tool_id: String) -> Result<(), String> {
    validate_command(&cmd)?;

    let mut child = shell_exec(&cmd)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let window_clone = window.clone();
    let tool_id_clone = tool_id.clone();

    // Read stdout in a thread
    let stdout_handle = std::thread::spawn(move || {
        if let Some(stdout) = stdout {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(line) = line {
                    let _ = window_clone.emit(
                        "install_log",
                        InstallLogEvent {
                            tool_id: tool_id_clone.clone(),
                            line,
                            done: false,
                            success: false,
                        },
                    );
                }
            }
        }
    });

    let window_clone2 = window.clone();
    let tool_id_clone2 = tool_id.clone();

    // Read stderr in a thread
    let stderr_handle = std::thread::spawn(move || {
        if let Some(stderr) = stderr {
            let reader = BufReader::new(stderr);
            for line in reader.lines() {
                if let Ok(line) = line {
                    let _ = window_clone2.emit(
                        "install_log",
                        InstallLogEvent {
                            tool_id: tool_id_clone2.clone(),
                            line,
                            done: false,
                            success: false,
                        },
                    );
                }
            }
        }
    });

    // Wait for process to complete
    let status = child.wait().map_err(|e| e.to_string())?;
    let _ = stdout_handle.join();
    let _ = stderr_handle.join();

    let _ = window.emit(
        "install_log",
        InstallLogEvent {
            tool_id,
            line: String::new(),
            done: true,
            success: status.success(),
        },
    );

    if status.success() {
        Ok(())
    } else {
        Err("Install failed".to_string())
    }
}

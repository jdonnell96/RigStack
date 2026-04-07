use super::system::shell_exec;

#[tauri::command]
pub async fn check_docker_running() -> Result<bool, String> {
    let output = shell_exec("docker info")
        .output()
        .map_err(|e| e.to_string())?;
    Ok(output.status.success())
}

#[tauri::command]
pub async fn docker_start(name: String) -> Result<(), String> {
    if !name
        .chars()
        .all(|c| c.is_alphanumeric() || c == '-' || c == '_' || c == '.')
    {
        return Err("Invalid container name".to_string());
    }
    let cmd = format!("docker start {}", name);
    let output = shell_exec(&cmd).output().map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to start container: {}", stderr))
    }
}

#[tauri::command]
pub async fn docker_stop(name: String) -> Result<(), String> {
    if !name
        .chars()
        .all(|c| c.is_alphanumeric() || c == '-' || c == '_' || c == '.')
    {
        return Err("Invalid container name".to_string());
    }
    let cmd = format!("docker stop {}", name);
    let output = shell_exec(&cmd).output().map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to stop container: {}", stderr))
    }
}

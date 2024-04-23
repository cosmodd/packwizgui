// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn shell(command: String, args: Vec<String>, cwd: String) -> String {
	let output = std::process::Command::new(command)
		.args(args)
		.current_dir(cwd)
		.output()
		.expect("failed to execute process");

	String::from_utf8_lossy(&output.stdout).to_string()
}

fn main() {
	tauri::Builder::default()
		.invoke_handler(tauri::generate_handler![shell])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
import { fs, path } from "@tauri-apps/api";
import { get, writable, type Writable } from "svelte/store";

async function storeSettings(settings: Object) {
	try {
		const json = JSON.stringify(settings);
		const filePath = await path.join(await path.appDataDir(), "settings.json");
		if (!await fs.exists(filePath))
			await fs.createDir(await path.appDataDir(), { recursive: true });
		await fs.writeTextFile(filePath, json);
		console.log("[SETTINGS] Settings stored successfully");
	} catch (error) {
		console.error("[SETTINGS] Error storing settings:", error);
	}
}

async function retrieveSettings(): Promise<Object> {
	try {
		const filePath = await path.join(await path.appDataDir(), "settings.json");
		if (!await fs.exists(filePath)) return {};
		const json = await fs.readTextFile(filePath);
		const settings = JSON.parse(json) as {};
		console.log("[SETTINGS] Settings retrieved successfully");
		return settings;
	} catch (error) {
		console.error("[SETTINGS] Error retrieving settings:", error);
		return {};
	}
}

function createSettingsStore() {
	const { subscribe, set, update } = writable({}) as Writable<any>;

	retrieveSettings().then((settings) => {
		set(settings);
	});

	return {
		subscribe,
		set: (setting: string, value: any) => {
			update((settings) => ({ ...settings, [setting]: value }));
			storeSettings(get(settings));
		},
		delete: (setting: string) => {
			update((settings) => {
				const newSettings: any = { ...settings };
				delete newSettings[setting];
				return newSettings;
			});
			storeSettings(get(settings));
		}
	}
}

export const settings = createSettingsStore();
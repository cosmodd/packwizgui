import { get, writable } from "svelte/store";
import { fs, path } from "@tauri-apps/api";

async function storeProjects(projects: Project[]) {
	try {
		const json = JSON.stringify(projects);
		const filePath = await path.join(await path.appDataDir(), "projects.json");
		if (!await fs.exists(filePath))
			await fs.createDir(await path.appDataDir(), { recursive: true });
		await fs.writeTextFile(filePath, json);
		console.log("Projects stored successfully");
	} catch (error) {
		console.error("Error storing projects:", error);
	}
}

async function retrieveProjects(): Promise<Project[]> {
	try {
		const filePath = await path.join(await path.appDataDir(), "projects.json");
		if (!await fs.exists(filePath)) return [];
		const json = await fs.readTextFile(filePath);
		const projects = JSON.parse(json) as Project[];
		console.log("Projects retrieved successfully");
		return projects;
	} catch (error) {
		console.error("Error retrieving projects:", error);
		return [];
	}
}

function createProjectsStore() {
	const { subscribe, set, update } = writable([] as Project[]);

	retrieveProjects().then((projects) => {
		set(projects);
	});

	return {
		subscribe,
		create: (project: Project): void => {
			update((projects) => [...projects, project]);
			storeProjects(get(projects));
		},
		delete: (id: string): void => {
			update((projects) => projects.filter((project) => project.id !== id));
			storeProjects(get(projects));
		}
	}
}

export const projects = createProjectsStore();
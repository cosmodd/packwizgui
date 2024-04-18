import { writable } from "svelte/store";

export const project = writable<Project>({} as Project);
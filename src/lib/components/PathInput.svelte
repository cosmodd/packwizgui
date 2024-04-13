<script lang="ts">
	import { dialog, path } from "@tauri-apps/api";
	import { FolderOpen, Icon } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";

	let classes = "";
	export { classes as class };

	export let value: string = "";
	export let directory: boolean = false;
	let displayValue: string | null = null;

	const dispatch = createEventDispatcher();

	$: path.basename(value).then((name) => {
		displayValue = name;
	}).catch(() => {
		displayValue = null;
	});

	async function promptPath() {
		const path = (await dialog.open({
			directory,
		})) as string;

		if (path == null || path === value) return;
		
		value = path;
		dispatch("change", path);
	}
</script>

<div class="inline-flex items-center {classes}">
	<button
		class="flex flex-row grow gap-2 bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 items-center transition-all"
		on:click|preventDefault={promptPath}
	>
		<Icon src={FolderOpen} micro class="w-4 h-4" />
		<p class="grow">{displayValue || "Select " + (directory ? "Directory" : "File")}</p>
	</button>
</div>

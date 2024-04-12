<script lang="ts">
	import { dialog, path } from "@tauri-apps/api";
	import { FolderOpen, Icon } from "svelte-hero-icons";

	export let value: string = "";
	let displayValue: string | null = null;

	$: path.basename(value).then((name) => {
		displayValue = name;
	}).catch(() => {
		displayValue = null;
	});

	async function askDirectory() {
		const path = (await dialog.open({
			directory: true,
		})) as string;

		if (path) {
			value = path;
			console.log(value);
		}
	}
</script>

<div class="flex items-center grow">
	<button
		class="flex flex-row grow gap-2 bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 items-center transition-all"
		on:click={askDirectory}
	>
		<Icon src={FolderOpen} micro class="w-4 h-4" />
		<p class="grow">{displayValue || "Select Directory"}</p>
	</button>
</div>

<script lang="ts">
	import { Icon, Trash, FolderOpen } from "svelte-hero-icons";
	import { projects } from "$lib/stores/projects";
	export let padding = "p-4";

	export let project: Project;

	let hovered = false;
</script>

<div
	class="flex flex-row bg-white rounded-lg border border-gray-200 {padding} hover:bg-gray-100 transition-all"
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	role="listitem"
>
	<h1 class="text-xl font-bold grow whitespace-nowrap truncate">{project.name}</h1>
	<div
		class="buttons flex items-center gap-1 transition-all"
		class:opacity-0={!hovered}
	>
		<a
			href="/projects/{project.id}"
			class="text-white bg-blue-500 hover:bg-blue-600 p-1 rounded transition-all"
		>
			<Icon src={FolderOpen} micro class="w-4 h-4" />
		</a>
		<button
			class="text-white bg-red-500 hover:bg-red-600 p-1 rounded transition-all"
			on:click={() => projects.delete(project.id)}
		>
			<Icon src={Trash} micro class="w-4 h-4" />
		</button>
	</div>
</div>

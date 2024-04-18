<script lang="ts">
	import { projects } from "$lib/stores/projects";
	import { Icon, Trash } from "svelte-hero-icons";
	export let padding = "p-4";

	export let project: Packwiz.Project;

	let hovered = false;
</script>

<a
	href="/projects/{project.id}"
	class="flex flex-row bg-white rounded-lg border border-gray-200 {padding} hover:bg-gray-100 transition-all"
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	<h1 class="text-xl font-bold grow whitespace-nowrap truncate">{project.name}</h1>
	<div
		class="buttons flex items-center gap-1 transition-all"
		class:opacity-0={!hovered}
	>
		<button
			class="text-white bg-red-500 hover:bg-red-600 p-1 rounded transition-all"
			on:click|preventDefault={() => projects.delete(project.id)}
		>
			<Icon src={Trash} micro class="w-4 h-4" />
		</button>
	</div>
</a>

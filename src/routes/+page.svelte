<script lang="ts">
	import Dialog from "$lib/components/Dialog.svelte";
	import DirectoryInput from "$lib/components/DirectoryInput.svelte";
	import ProjectCard from "$lib/components/ProjectCard.svelte";
	import { projects } from "$lib/stores/projects";
	import { Cog6Tooth, DocumentPlus, Icon } from "svelte-hero-icons";

	let dialogOpened: boolean = false;

	let createProjectInformation = {
		name: "",
		id: "",
		path: "",
	};

	function dialogClosed() {
		createProjectInformation = {
			name: "",
			id: "",
			path: "",
		}
	}

	function handleProjectCreation(event: SubmitEvent) {
		const { name, id, path } = createProjectInformation;

		if (name.length === 0 || id.length === 0 || path.length === 0) {
			return;
		}

		projects.create(createProjectInformation);

		dialogOpened = false;
		dialogClosed();
	}

	function handleProjectIdChange(event: Event) {
		const projectNameInput = event.target as HTMLInputElement;
		
		createProjectInformation.id = projectNameInput.value.replace(/\s/g, "-").toLowerCase();
	}
</script>

<Dialog bind:show={dialogOpened} on:close={dialogClosed}>
	<h1 class="text-3xl font-bold mb-4">Create Project</h1>
	<form class="flex flex-col gap-2" on:submit|preventDefault={handleProjectCreation}>
		<input
			type="text"
			id="name"
			name="name"
			class="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			placeholder="Project Name"
			bind:value={createProjectInformation.name}
			on:input={handleProjectIdChange}
		/>
		<input
			type="text"
			id="id"
			name="id"
			class="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			placeholder="Project ID"
			bind:value={createProjectInformation.id}
			disabled
		/>
		<DirectoryInput bind:value={createProjectInformation.path} />
		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded transition-all"
		>
			Create
		</button>
	</form>
</Dialog>

<div class="header flex flex-row mb-4">
	<h1 class="text-3xl font-bold ps-1 grow">Projects</h1>
	<div class="actions flex flex-row items-center gap-2">
		<button
			class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded flex flex-row items-center gap-1 transition-all"
			on:click={() => (dialogOpened = true)}
		>
			<Icon src={DocumentPlus} micro class="w-4 h-4" />
			<span>New Project</span>
		</button>
		<a href="/settings" class="settings p-2 hover:bg-gray-200 rounded transition-colors">
			<Icon src={Cog6Tooth} micro size="24" class="transition-transform" />
		</a>
	</div>
</div>
<div class="projects grid grid-cols-3 gap-4">
	{#if $projects.length === 0}
		<p>No projects found.</p>
	{:else}
		{#each $projects as project}
			<ProjectCard {project} />
		{/each}
	{/if}
</div>

<style>
	:global(.settings:hover > svg) {
		transform: rotate(90deg);
	}
</style>
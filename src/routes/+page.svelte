<script lang="ts">
	import Alert from "$lib/components/Alert.svelte";
	import Dialog from "$lib/components/Dialog.svelte";
	import PathInput from "$lib/components/PathInput.svelte";
	import ProjectCard from "$lib/components/ProjectCard.svelte";
	import { projects } from "$lib/stores/projects";
	import { Cog6Tooth, DocumentPlus, Icon } from "svelte-hero-icons";

	let dialogOpened: boolean = false;

	let createProjectInformation = {
		name: "",
		id: "",
		path: "",
		alert: "",
	};

	function dialogClosed() {
		createProjectInformation = {
			name: "",
			id: "",
			path: "",
			alert: "",
		};
	}

	function handleProjectCreation(event: SubmitEvent) {
		const { id, path } = createProjectInformation;

		if (path.length === 0) {
			createProjectInformation.alert = "Please select a directory";
			return;
		}

		if ($projects.find((project) => project.id === id)) {
			createProjectInformation.alert = "Project ID already exists";
			return;
		}

		projects.create(createProjectInformation);

		dialogOpened = false;
		dialogClosed();
	}

	function handleProjectIdChange(event: Event) {
		const projectNameInput = event.target as HTMLInputElement;

		createProjectInformation.id = projectNameInput.value
			.replace(/\s/g, "-")
			.toLowerCase();
	}
</script>

<Dialog
	bind:show={dialogOpened}
	on:close={dialogClosed}
	class="max-w-md w-full"
>
	<h1 class="text-3xl font-bold mb-4">Create Project</h1>
	<form
		class="flex flex-col gap-4"
		on:submit|preventDefault={handleProjectCreation}
	>
		{#if createProjectInformation.alert}
			<Alert>{createProjectInformation.alert}</Alert>
		{/if}
		<div class="input-group project-name">
			<label
				for="name"
				class="block text-gray-700 text-sm font-bold mb-2 uppercase"
				>Project Name</label
			>
			<input
				type="text"
				id="name"
				name="name"
				class="appearance-none block w-full bg-gray-200 rounded py-3 px-4 focus:outline-none"
				placeholder="Project Name"
				bind:value={createProjectInformation.name}
				on:input={handleProjectIdChange}
				required
			/>
		</div>
		<div class="input-group project-id">
			<label
				for="id"
				class="block text-gray-700 text-sm font-bold mb-2 uppercase"
				>Project ID</label
			>
			<input
				type="text"
				id="id"
				name="id"
				class="appearance-none block w-full bg-gray-100 rounded py-3 px-4 hover:cursor-not-allowed"
				placeholder="Project ID"
				bind:value={createProjectInformation.id}
				disabled
			/>
		</div>
		<div class="input-group project-directory">
			<label
				for="path"
				class="block text-gray-700 text-sm font-bold mb-2 uppercase"
				>Directory</label
			>
			<PathInput
				class="w-full"
				directory
				bind:value={createProjectInformation.path}
			/>
		</div>
		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded transition-all"
		>
			Create
		</button>
	</form>
</Dialog>

<div class="header flex flex-row mb-4">
	<h1 class="text-3xl font-bold grow">Projects</h1>
	<div class="actions flex flex-row items-center gap-2">
		<button
			class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded flex flex-row items-center gap-1 transition-all"
			on:click={() => (dialogOpened = true)}
		>
			<Icon src={DocumentPlus} micro class="w-4 h-4" />
			<span>New Project</span>
		</button>
		<a
			href="/settings"
			class="settings p-2 hover:bg-gray-200 rounded transition-colors"
		>
			<Icon
				src={Cog6Tooth}
				micro
				size="24"
				class="transition-transform"
			/>
		</a>
	</div>
</div>
<div class="projects gap-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

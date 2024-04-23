<script lang="ts">
	import { page } from "$app/stores";
	import { project } from "$lib/stores/project";
	import curseforge, { CategoryId } from "$lib/utils/curseforge";
	import modrinth from "$lib/utils/modrinth";
	import { onMount } from "svelte";
	import { FolderOpen, Icon, MagnifyingGlass, Plus, XMark } from "svelte-hero-icons";

	interface SelectedProject {
		slug: string;
		provider: "curseforge" | "modrinth";
	}

	interface ProviderProject {
		slug: string;
		name: string;
		description: string;
		icon: string;
		installed: boolean;
	}

	const projectType = ($page.url.searchParams.get("type") ?? "mod") as
		| "mod"
		| "shader"
		| "resourcepack";
	let provider: "curseforge" | "modrinth" = "curseforge";
	let selectedProjects: SelectedProject[] = [];
	let downloading: boolean = false;
	let fetching: boolean = false;
	let searchQueries = {
		curseforge: "",
		modrinth: "",
	};

	let projectsContainer: HTMLDivElement;

	let curseforgeMods: ProviderProject[] = [];
	let modrinthMods: ProviderProject[] = [];

	$: projects =
		(provider === "curseforge" ? curseforgeMods : modrinthMods) ?? [];

	function changeProvider(event: Event) {
		const target = event.target as HTMLAnchorElement;
		provider = target.dataset.provider as "curseforge" | "modrinth";

		if (provider === "curseforge" && curseforgeMods.length === 0)
			fetchCurseforgeMods();
		else if (provider === "modrinth" && modrinthMods.length === 0)
			fetchModrinthMods();
	}

	function fetchCurseforgeMods(offset: number = 0) {
		fetching = true;
		curseforge
			.searchMods(searchQueries.curseforge, offset, {
				classId: {
					mod: CategoryId.Mods,
					resourcepack: CategoryId.ResourcePacks,
					shader: CategoryId.Shaders,
				}[projectType],
			})
			.then((response) => {
				const formattedData = response.data.map((project: any) => {
					const foundInProject = $project.mods.find(
						(mod: Mod) =>
							mod.provider === "curseforge" &&
							mod.slug === project.slug,
					);

					return {
						slug: project.slug,
						name: project.name,
						description: project.summary,
						icon: project.logo?.url,
						installed: foundInProject != null,
					};
				});

				curseforgeMods = [...curseforgeMods, ...formattedData];
				fetching = false;
			});
	}

	function fetchModrinthMods(offset: number = 0) {
		fetching = true;
		modrinth
			.searchProjects(searchQueries.modrinth, offset, {
				projectType,
			})
			.then((response) => {
				const formattedData = response.hits.map((project: any) => {
					const foundInProject = $project.mods.find(
						(mod: Mod) =>
							mod.provider === "modrinth" &&
							mod.slug === project.slug,
					);

					return {
						slug: project.slug,
						name: project.title,
						description: project.description,
						icon: project.icon_url,
						installed: foundInProject != null,
					};
				});

				modrinthMods = [...modrinthMods, ...formattedData];
				fetching = false;
			});
	}

	function handleSearch(event: SubmitEvent) {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);
		const query: string = formData.get("search")?.toString() ?? "";

		searchQueries[provider] = query;

		// Empty the current provider list and fetch again
		projectsContainer.scrollTo(0, 0);
		if (provider === "curseforge") {
			curseforgeMods = [];
			fetchCurseforgeMods();
		} else if (provider === "modrinth") {
			modrinthMods = [];
			fetchModrinthMods();
		}
	}

	function handleScroll(event: Event) {
		const target = event.target as HTMLDivElement;
		const { scrollTop, scrollHeight, offsetHeight } = target;
		const fetchFunction =
			provider === "curseforge" ? fetchCurseforgeMods : fetchModrinthMods;

		if (fetching || scrollTop + offsetHeight < scrollHeight - 100) return;
		fetchFunction(curseforgeMods.length);
	}

	function debug() {}

	onMount(() => {
		if (provider === "curseforge") fetchCurseforgeMods();
		else fetchModrinthMods();
	});
</script>

<div class="flex gap-4 mb-4">
	<form
		on:submit|preventDefault={handleSearch}
		class="grow flex items-center"
	>
		<label class="input input-bordered flex items-center gap-2 w-full">
			<input
				type="text"
				class="grow"
				placeholder="Search"
				name="search"
				bind:value={searchQueries[provider]}
			/>
			{#if searchQueries[provider]}
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					on:click={() => (searchQueries[provider] = "")}
					>Clear</button
				>
			{/if}
			<Icon src={MagnifyingGlass} class="w-4 h-4" />
		</label>
	</form>
	<div role="tablist" class="tabs tabs-boxed items-center">
		<button
			class="tab tab-bordered transition-all outline-none h-full {provider ===
			'curseforge'
				? 'tab-active font-bold'
				: ''}"
			data-provider="curseforge"
			on:click={changeProvider}
		>
			Curseforge
		</button>
		<button
			class="tab tab-bordered transition-all outline-none h-full {provider ===
			'modrinth'
				? 'tab-active font-bold'
				: ''}"
			data-provider="modrinth"
			on:click={changeProvider}
		>
			Modrinth
		</button>
	</div>
</div>

<div
	class="projects grow mb-4 grid grid-cols-3 gap-4 overflow-auto auto-rows-min"
	on:scroll={handleScroll}
	bind:this={projectsContainer}
>
	{#if projects.length === 0}
		{#if fetching}
			{#each Array(50) as _}
				<div class="skeleton h-24"></div>
			{/each}
		{:else}
			<p class="text-center text-3xl font-bold col-span-3 my-4">
				No projects found
			</p>
		{/if}
	{:else}
		{#each projects as project}
			<div
				class="mod border-2 border-gray-200 rounded-lg p-4 grid grid-cols-[auto_1fr_auto] gap-4"
				class:installed={project.installed}
			>
				<img
					src={project.icon}
					alt=""
					class="w-12 h-12 bg-gray-200 rounded"
					loading="lazy"
				/>
				<div class="informations overflow-hidden">
					<h1 class="text-xl font-bold truncate">{project.name}</h1>
					<p class="text-sm truncate">{project.description}</p>
				</div>
				<div class="buttons flex flex-col justify-center">
					{#if !project.installed}
						{#if selectedProjects.some((p) => p.slug === project.slug)}
							<button
								class="text-white bg-red-500 hover:bg-red-600 p-1 rounded transition-all"
								on:click|preventDefault={() => {selectedProjects = selectedProjects.filter((p) => p.slug !== project.slug); selectedProjects = selectedProjects; console.log(selectedProjects)}}
							>
								<Icon src={XMark} micro class="w-4 h-4" />
							</button>
						{:else}
							<button
								class="text-white bg-green-500 hover:bg-green-600 p-1 rounded transition-all"
								on:click|preventDefault={() => {selectedProjects = [...selectedProjects, { slug: project.slug, provider }]; console.log(selectedProjects)}}
							>
								<Icon src={Plus} micro class="w-4 h-4" />
							</button>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<div class="actions flex justify-end gap-2">
	<button
		class="btn btn-primary"
		on:click={() => (downloading = !downloading)}
		disabled={selectedProjects.length === 0}
	>
		{#if downloading}
			<span class="loading loading-spinner w-4 h-4"></span>
		{:else}
			<Icon src={FolderOpen} micro class="w-4 h-4" />
		{/if}
		Download {selectedProjects.length} projects
	</button>
</div>

<style lang="postcss">
	.installed {
		@apply bg-green-100;
		@apply border-green-200;
	}
</style>

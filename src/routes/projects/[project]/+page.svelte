<script lang="ts">
	import { project } from "$lib/stores/project";
	import { Cube, Icon, Plus, PuzzlePiece, Sun, Wallet, type IconSource } from "svelte-hero-icons";

	const tabs = {
		all: "All",
		mod: "Mods",
		resourcepack: "Resourcepacks",
		shader: "Shaders",
	};

	const tabIcons: Record<string, IconSource> = {
		all: Wallet,
		mod: PuzzlePiece,
		resourcepack: Cube,
		shader: Sun,
	}

	let filter: "all" | "mod" | "resourcepack" | "shader" = "all";
	$: filteredMods = $project?.mods?.filter((mod) => {
		if (filter === "all") return true;
		return mod.type === filter;
	});

	function tabChange(event: Event) {
		const target = event.target as HTMLAnchorElement;

		filter = target.dataset.tab as
			| "all"
			| "mod"
			| "resourcepack"
			| "shader";
	}
</script>

<div role="tablist" class="tabs tabs-boxed mb-4">
	{#each Object.entries(tabs) as [category, label]}
		<button
			role="tab"
			class="tab transition-all outline-none flex gap-2 {category === filter
				? 'tab-active font-bold'
				: ''}"
			on:click|preventDefault={tabChange}
			data-tab={category}>
			<Icon src={tabIcons[category]} micro class="w-4 h-4 pointer-events-none" />
			{label}
		</button>
	{/each}
</div>

<div class="actions mb-4 grid grid-cols-3 gap-2">
	<a class="btn flex-grow" href="/projects/{$project.id}/add?type=mod">
		<Icon src={Plus} class="w-4 h-4" />
		Add Mods
	</a>
	<a class="btn flex-grow" href="/projects/{$project.id}/add?type=resourcepack">
		<Icon src={Plus} class="w-4 h-4" />
		Add Resource Packs
	</a>
	<a class="btn flex-grow" href="/projects/{$project.id}/add?type=shader">
		<Icon src={Plus} class="w-4 h-4" />
		Add Shaders
	</a>
</div>

<div class="wrapper overflow-auto">
	<div class="grid grid-cols-3 gap-4">
		{#if filteredMods}
			{#each filteredMods as mod}
				<div
					class="mod border-2 border-gray-200 rounded-lg p-4 grid grid-cols-[auto_1fr] gap-4"
				>
					<img
						src={mod.logoUrl}
						alt=""
						class="w-12 h-12 bg-gray-200 rounded"
					/>
					<div class="informations overflow-hidden">
						<h1 class="text-xl font-bold truncate">{mod.name}</h1>
						<p class="text-sm truncate">{mod.description}</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

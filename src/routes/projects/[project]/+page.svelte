<script lang="ts">
	import { page } from "$app/stores";
	import { projects } from "$lib/stores/projects";
	import { ArrowLeft, Icon } from "svelte-hero-icons";
	import { fs, path } from "@tauri-apps/api";
	import toml from "toml";

	let project = $projects.find((p) => p.id === $page.params.project);
	let packInfo: Packwiz.PackInfo | null = null;
	let indexInfo: Packwiz.IndexFile | null = null;
	let mods: Packwiz.Mod[] = [];

	projects.subscribe(async (projects) => {
		project = projects.find((p) => p.id === $page.params.project);
		if (project == null) return;

		const paths = {
			index: await path.join(project.path, "index.toml"),
			pack: await path.join(project.path, "pack.toml"),
			mods: await path.join(project.path, "mods"),
		};

		packInfo = toml.parse(await fs.readTextFile(paths.pack));
		indexInfo = toml.parse(await fs.readTextFile(paths.index));

		const modFiles = await fs.readDir(paths.mods);

		mods = await Promise.all(modFiles
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(async (f) => {
				const fileContent = toml.parse(await fs.readTextFile(f.path));
				return {
					slug: f.name?.split(/\./g)[0] as string,
					name: fileContent.name,
					filename: fileContent.filename,
					side: fileContent.side as "client" | "server" | "both",
					update: fileContent.update as Packwiz.Mod["update"]
				}
			}));

	});
</script>

<header class="flex flex-row gap-4 items-center mb-4">
	<a href="/"><Icon src={ArrowLeft} micro size="24" /></a>
	<h1 class="text-3xl font-bold">
		{project?.name}
		{#if packInfo?.versions.minecraft}
			<span class="separator mx-2">-</span>
			<span class="version">{packInfo.versions.minecraft}</span>
			<span class="separator mx-2">-</span>
			<span class="dependencies">{mods.length} mods</span>
		{/if}
	</h1>
</header>
<main class="h-full overflow-auto">
	<div class="mods grid grid-cols-3 gap-4">
		{#each mods as mod}
			<div class="mod border-gray-200 border rounded-lg p-4">
				<h1 class="text-xl font-bold whitespace-nowrap truncate">{mod.name}</h1>
				<p class="text-sm whitespace-nowrap truncate">{mod.filename}</p>
			</div>
		{/each}
	</div>
</main>

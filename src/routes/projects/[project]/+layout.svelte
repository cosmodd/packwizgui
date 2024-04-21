<script lang="ts">
	import { page } from "$app/stores";
	import { project } from "$lib/stores/project";
	import { projects } from "$lib/stores/projects";
	import curseforge from "$lib/utils/curseforge";
	import modrinth from "$lib/utils/modrinth";
	import { fs, path } from "@tauri-apps/api";
	import { ArrowLeft, Icon } from "svelte-hero-icons";
	import toml from "toml";

	projects.subscribe(async (projects) => {
		const foundProject = projects.find(
			(p) => p.id === $page.params.project,
		) as Project;

		if (foundProject == null) return;
		$project = foundProject;

		const packTomlPath = await path.join(foundProject.path, "pack.toml");
		const packToml = toml.parse(await fs.readTextFile(packTomlPath));
		$project.versions = packToml.versions;

		const indexTomlPath = await path.join(foundProject.path, "index.toml");
		const indexToml = toml.parse(await fs.readTextFile(indexTomlPath));
		const modsToml: Packwiz.Mod[] = await Promise.all(
			indexToml.files
				.filter((f: any) => f.file.match(/\.pw\.toml$/))
				.map(async (f: any) => {
					const pathToFile = await path.join(
						foundProject.path,
						f.file,
					);
					return {
						slug: await path.basename(pathToFile, ".pw.toml"),
						...toml.parse(await fs.readTextFile(pathToFile))
					};
				}),
		);

		const curseforgeProjects = modsToml
			.filter((m) => m.update.curseforge != null)
			.map((m) => m.update.curseforge?.["project-id"])
			.filter((id) => id != null) as number[];

		const modrinthProjects = modsToml
			.filter((m) => m.update.modrinth != null)
			.map((m) => m.update.modrinth?.["mod-id"])
			.filter((id) => id != null) as string[];

		const curseforgeInformations = await curseforge.getMods(curseforgeProjects).then((res) => res.data);
		const modrinthInformations = await modrinth.getProjects(modrinthProjects);

		const curseforgeMods: Mod[] = curseforgeInformations.map((mod: any, i: number) => {
			const tomlData = modsToml.find((m) => m.slug === mod.slug) as Packwiz.Mod;
			return curseforge.convertToMod(mod, tomlData);
		});

		const modrinthMods: Mod[] = modrinthInformations.map((mod: any, i: number) => {
			const tomlData = modsToml.find((m) => m.slug === mod.slug) as Packwiz.Mod;
			return modrinth.convertToMod(mod, tomlData);
		});

		$project.mods = [...curseforgeMods, ...modrinthMods].sort((a, b) => a.name.localeCompare(b.name));
	});
</script>

<header class="flex flex-row gap-4 items-center mb-4">
	<button on:click|preventDefault={() => history.back()}><Icon src={ArrowLeft} micro size="24" /></button>
	<h1 class="text-3xl font-bold">
		{$project.name}
		{#if $project.versions}
			{#each Object.entries($project.versions) as [loader, version]}
				<span class="separator mx-2">-</span>
				<span class="version capitalize">{loader} {version}</span>
			{/each}
		{/if}
	</h1>
</header>
<div class="flex flex-col h-full overflow-auto">
	<slot />
</div>

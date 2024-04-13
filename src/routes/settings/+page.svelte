<script lang="ts">
	import { Icon, ArrowLeft } from "svelte-hero-icons";
	import { settings } from "$lib/stores/settings";
	import PathInput from "$lib/components/PathInput.svelte";
</script>

<header class="flex flex-row gap-4 items-center mb-4">
	<a href="/"><Icon src={ArrowLeft} micro size="24" /></a>
	<h1 class="text-3xl font-bold">Settings</h1>
</header>

<main class="h-full overflow-auto">
	<div class="flex flex-col gap-4 p-4">
		<div class="input">
			<label
				for="packwizPath"
				class="block text-gray-700 text-sm font-bold mb-2 uppercase"
				>Packwiz Path</label
			>
			<PathInput
				on:change={(e) => settings.set("packwizPath", e.detail)}
				value={$settings.packwizPath}
			/>
		</div>
	</div>
</main>

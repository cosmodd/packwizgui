<script lang="ts">
    import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	let seconds = 5;

	// Redirect to `/` after 5 seconds
	onMount(() => {
		setInterval(() => {
			seconds--;
		}, 1000);

		setTimeout(() => {
			goto("/");
		}, 5000);
	});
</script>

<div class="h-full flex flex-col justify-center items-center">
	<h1 class="text-3xl font-bold">{$page.status}</h1>
	<p>{$page.error?.message}</p>
	<p class="text-sm italic">Redirecting in {seconds} seconds...</p>
</div>

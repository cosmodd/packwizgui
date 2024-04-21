<script lang="ts">
	import { page } from "$app/stores";

	const projectType = $page.url.searchParams.get("type") ?? "mod" as "mod" | "resourcepack" | "shader";
</script>

<h1 class="text-3xl font-bold">Add {projectType}</h1>
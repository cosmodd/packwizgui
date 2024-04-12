<script lang="ts">
    import { DocumentPlus, ExclamationTriangle, Icon } from "svelte-hero-icons";

	export let color: "red" | "blue" | "green" | "yellow" = "red";

	const backgrounds = {
		red: "bg-red-200",
		blue: "bg-blue-200",
		green: "bg-green-200",
		yellow: "bg-yellow-200",
	};

	const borders = {
		red: "border-red-300",
		blue: "border-blue-300",
		green: "border-green-300",
		yellow: "border-yellow-300",
	};

	const textColors = {
		red: "text-red-800",
		blue: "text-blue-800",
		green: "text-green-800",
		yellow: "text-yellow-800",
	};
</script>

<div class="alert grid {backgrounds[color]} border {borders[color]} rounded p-4 gap-4 items-center {textColors[color]}">
	<Icon src={ExclamationTriangle} micro class="w-4 h-4" />
	<slot />
</div>

<style lang="postcss">
	.alert {
		grid-template-columns: min-content auto;
	}
</style>
<script lang="ts">
    import { createEventDispatcher } from "svelte";

	const eventDispatcher = createEventDispatcher();

	export let show: boolean = false;

	let dialog: HTMLDialogElement;

	$: if (dialog && show) {
		dialog.showModal();
	}

	$: if (dialog && !show) {
		dialog.close();
	}

	function onClick(event: MouseEvent) {
		if (event.target !== dialog) return;

		const { left, top, width, height } = dialog.getBoundingClientRect();

		if (
			event.clientX > left &&
			event.clientX < left + width &&
			event.clientY > top &&
			event.clientY < top + height
		)
			return;

		dialog.close();
	}

	function closeDialog() {
		dialog.close();
		show = false;
		eventDispatcher("close");
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	class="bg-white p-8 rounded-lg shadow-lg transition-all"
	on:close={closeDialog}
	on:click={onClick}
>
	<slot />
</dialog>

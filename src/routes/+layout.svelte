<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="p-4 text-4xl font-bold">
	<img src={favicon} alt="Pomus logo" class="inline h-10 w-10 align-top opacity-50" />
	Pomus
</div>

{@render children?.()}

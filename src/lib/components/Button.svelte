<script lang="ts">
	import { merge } from '$lib/tailwind';
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onClick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let { type = 'button', class: classInput, onClick, children }: Props = $props();
</script>

<button
	{type}
	class={merge(
		'rounded border border-primary-500 bg-primary-900 px-3 py-2 transition-colors hover:cursor-pointer hover:bg-primary-800',
		classInput
	)}
	onclick={onClick}
>
	{@render children()}
</button>

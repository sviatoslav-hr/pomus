<script lang="ts">
	import { merge } from '$lib/tailwind';
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		disabled?: boolean;
		onClick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let { type = 'button', class: classInput, disabled = false, onClick, children }: Props = $props();
</script>

<button
	{type}
	class={merge(
		'rounded border-1 border-border bg-bg-light px-4 py-2 text-2xl transition-colors not-disabled:hover:cursor-pointer not-disabled:hover:bg-bg-light/80 disabled:opacity-50',
		classInput
	)}
	{disabled}
	onclick={onClick}
>
	{@render children()}
</button>

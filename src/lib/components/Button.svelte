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
		'rounded border border-primary-500 bg-primary-900 px-3 py-2 transition-colors not-disabled:hover:cursor-pointer not-disabled:hover:bg-primary-800 disabled:opacity-50',
		classInput
	)}
	{disabled}
	onclick={onClick}
>
	{@render children()}
</button>

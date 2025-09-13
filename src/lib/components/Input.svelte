<script lang="ts">
	import { onMount } from 'svelte';

	import { merge } from '$lib/tailwind';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { getFormContext, type FieldType } from './Form';

	const form = getFormContext();

	interface Props {
		name: string;
		type: HTMLInputTypeAttribute;
		label?: string;
		class?: string;
		disabled?: boolean;
		onchange?: (event: Event) => void;
	}

	let { type, name, label, class: classInput, disabled = false, onchange }: Props = $props();
	let formType = $derived(toFieldType(type));
	let value = $state<string | number | boolean | undefined>(undefined);

	onMount(() => {
		form.register({ name, type: formType });
	});

	function toFieldType(type: HTMLInputTypeAttribute): FieldType {
		switch (type) {
			case 'number':
				return 'number';
			case 'checkbox':
				return 'boolean';
			case 'text':
			default:
				return 'string'; // Fallback to text for unsupported types
		}
	}
</script>

<div class="flex flex-col">
	{#if label}
		<label for={label}>
			{label}
		</label>
	{/if}

	<input
		{value}
		{type}
		{name}
		class={merge(
			'rounded border border-primary bg-bg px-3 py-2 transition-colors outline-none disabled:opacity-50',
			classInput
		)}
		disabled={disabled || form.disabled}
		{onchange}
	/>
</div>

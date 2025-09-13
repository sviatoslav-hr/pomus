<script lang="ts">
	import { merge } from '$lib/tailwind';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { getFormContext, type FieldType } from './Form';
	import { onMount } from 'svelte';

	const form = getFormContext();

	interface Props {
		name: string;
		type: HTMLInputTypeAttribute;
		class?: string;
		disabled?: boolean;
		onchange?: (event: Event) => void;
	}

	let { type, name, class: classInput, disabled = false, onchange }: Props = $props();
	let formType = $derived(toFieldType(type));

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

<input
	{type}
	{name}
	class={merge(
		'rounded border border-primary-500 bg-primary-900 px-3 py-2 transition-colors not-disabled:hover:cursor-pointer not-disabled:hover:bg-primary-800 disabled:opacity-50',
		classInput
	)}
	disabled={disabled || form.disabled}
	{onchange}
/>

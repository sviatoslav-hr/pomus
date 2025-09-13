<script lang="ts">
	import { merge } from '$lib/tailwind';

	interface Props {
		class?: string;
		min?: number;
		max?: number;
		step?: number;
		id?: string;
		disabled?: boolean;
		onchange?: (value: number) => void;
		initialValue: number;
	}

	let {
		id,
		class: classInput,
		min,
		max,
		step,
		disabled = false,
		onchange,
		initialValue
	}: Props = $props();

	let value = $state(initialValue);

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log('NumberInput.handleChange', { event, target, value });
		event.preventDefault();
		value = target.valueAsNumber;
		onchange?.(value);
	}
</script>

<input
	{id}
	{value}
	{min}
	{max}
	{step}
	{disabled}
	onchange={handleChange}
	type="number"
	class={merge(
		'[&::-moz-appearance]:textfield appearance-none rounded-md border border-border px-2 py-1 outline-none not-disabled:focus-within:border-highlight [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none     [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
		classInput
	)}
/>

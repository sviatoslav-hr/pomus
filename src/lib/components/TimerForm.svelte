<script lang="ts">
	import type { PomodoroConfig } from '$lib/pomodoro';
	import Form from './Form.svelte';
	import Input from './Input.svelte';

	type FormValue = Omit<PomodoroConfig, 'initialPhase'>;

	interface Props {
		class?: string;
		disabled?: boolean;
		onchange?: (value: FormValue) => void;
		onsubmit?: (value: FormValue) => void;
		initialValue?: FormValue;
	}

	let { class: classInput, disabled = false, onchange, onsubmit, initialValue }: Props = $props();

	function handleChange(value: unknown) {
		onchange?.(value as FormValue);
	}

	function handleSubmit(value: unknown) {
		onsubmit?.(value as FormValue);
	}
</script>

<Form class={classInput} onchange={handleChange} onsubmit={handleSubmit} {disabled}>
	<Input type="number" name="focusMinutes" />
</Form>

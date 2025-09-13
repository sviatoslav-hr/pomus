<script lang="ts">
	import type { PomodoroConfig } from '$lib/pomodoro';
	import { merge } from '$lib/tailwind';
	import NumberInput from './NumberInput.svelte';

	type FormValue = Omit<PomodoroConfig, 'initialPhase'>;

	interface Props {
		class?: string;
		disabled?: boolean;
		onchange?: (value: FormValue) => void;
		onsubmit?: (value: FormValue) => void;
		initialValue: FormValue;
	}

	let { class: classInput, disabled = false, onchange, onsubmit, initialValue }: Props = $props();

	let formValue: FormValue = $state({ ...initialValue });

	function handleChange<K extends keyof FormValue>(key: K, value: FormValue[K]) {
		formValue[key] = value;
		onchange?.(formValue);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onsubmit?.(formValue);
	}
</script>

<form class={merge('flex flex-col gap-4', classInput)} onsubmit={handleSubmit}>
	<div class="flex gap-4">
		<label for="focusMinutes" class="block h-fit shrink-1 text-base leading-4 font-bold">
			Focus Minutes:
		</label>

		<NumberInput
			id="focusMinutes"
			class="block text-base"
			initialValue={formValue.focusMinutes}
			step={0.1}
			onchange={(v) => handleChange('focusMinutes', v)}
			{disabled}
		/>
	</div>

	<div class="flex gap-4">
		<label for="shortBreakMinutes" class="block h-fit shrink-1 text-base leading-4 font-bold">
			Short Break Minutes:
		</label>

		<NumberInput
			id="shortBreakMinutes"
			class="block text-base"
			initialValue={formValue.shortBreakMinutes}
			step={0.1}
			onchange={(v) => handleChange('shortBreakMinutes', v)}
			{disabled}
		/>
	</div>

	<div class="flex gap-4">
		<label for="longBreakMinutes" class="block h-fit shrink-1 text-base leading-4 font-bold">
			Long Break Minutes:
		</label>

		<NumberInput
			id="longBreakMinutes"
			class="block text-base"
			initialValue={formValue.longBreakMinutes}
			step={0.1}
			onchange={(v) => handleChange('longBreakMinutes', v)}
			{disabled}
		/>
	</div>

	<div class="flex gap-4">
		<label for="shortBreaksCount" class="block h-fit shrink-1 text-base leading-4 font-bold">
			Short Breaks Count:
		</label>

		<NumberInput
			id="shortBreaksCount"
			class="block text-base"
			initialValue={formValue.shortBreaksCount}
			step={1}
			min={1}
			onchange={(v) => handleChange('shortBreaksCount', v)}
			{disabled}
		/>
	</div>
</form>

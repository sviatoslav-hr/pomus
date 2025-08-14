<script lang="ts">
	import { HOURS, MINUTES, SECONDS } from '$lib/pomodoro';
	import { merge } from '$lib/tailwind';

	interface Props {
		class?: string;
		totalMilliseconds: number;
	}

	let { class: classInput, totalMilliseconds }: Props = $props();

	let hours = $derived(Math.floor(totalMilliseconds / HOURS));
	let minutes = $derived(Math.floor((totalMilliseconds - hours * HOURS) / MINUTES));
	let sounds = $derived(
		Math.floor((totalMilliseconds - hours * HOURS - minutes * MINUTES) / SECONDS)
	);
	let milliseconds = $derived(
		totalMilliseconds - hours * HOURS - minutes * MINUTES - sounds * SECONDS
	);

	function padNumber(num: number, length = 2): string {
		return num.toString().padStart(length, '0');
	}
</script>

<div class={merge('flex justify-center gap-1 text-7xl tabular-nums', classInput)}>
	<span>{padNumber(hours)}</span>
	:
	<span>{padNumber(minutes)}</span>
	:
	<span>{padNumber(sounds)}</span>
	:
	<span>{padNumber(milliseconds, 3)}</span>
</div>

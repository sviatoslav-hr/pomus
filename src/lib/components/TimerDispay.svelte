<script lang="ts">
	import { HOURS, MINUTES, SECONDS } from '$lib/pomodoro';
	import { merge } from '$lib/tailwind';

	interface Props {
		class?: string;
		totalMilliseconds: number;
		showMilliseconds?: boolean;
	}

	let { class: classInput, totalMilliseconds, showMilliseconds = false }: Props = $props();

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

<div class={merge('flex justify-center gap-2 text-8xl font-bold tabular-nums', classInput)}>
	{#if hours}
		<span>{padNumber(hours)}</span>
		:
	{/if}
	<span>{padNumber(minutes)}</span>
	:
	<span>{padNumber(sounds)}</span>
	{#if showMilliseconds}
		:
		<span>{padNumber(milliseconds, 3)}</span>
	{/if}
</div>

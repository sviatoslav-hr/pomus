<script lang="ts">
	import { padNumber } from '$lib/number';
	import { type ParsedTimer } from '$lib/pomodoro';
	import { merge } from '$lib/tailwind';

	interface Props {
		class?: string;
		showMilliseconds?: boolean;
		timer: ParsedTimer;
	}

	let { class: classInput, timer, showMilliseconds = false }: Props = $props();
</script>

<div class={merge('flex justify-center gap-2 text-8xl font-bold tabular-nums', classInput)}>
	{#if timer.hours}
		<span>{padNumber(timer.hours)}</span>
		:
	{/if}
	<span>{padNumber(timer.minutes)}</span>
	:
	<span>{padNumber(timer.seconds)}</span>
	{#if showMilliseconds}
		:
		<span>{padNumber(timer.milliseconds, 3)}</span>
	{/if}
</div>

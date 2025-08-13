<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { PomodoroTimer } from '$lib/pomodoro';

	const timer = new PomodoroTimer({
		focusMinutes: 120,
		shortBreakMinutes: 15,
		longBreakMinutes: 60,
		shortBreaksCount: 2,
		startPhase: 'focus'
	});
	const HOURS = 1000 * 60 * 60;
	const MINUTES = 1000 * 60;
	const SECONDS = 1000;

	let currentPhase = $state(timer.currentPhase);
	let millisecondsLeft = $state(timer.getCurrentPhaseMilliseconds());
	let hoursLeft = $derived(Math.floor(millisecondsLeft / HOURS));
	let minutesLeft = $derived(Math.floor((millisecondsLeft - hoursLeft * HOURS) / MINUTES));
	let secondsLeft = $derived(
		Math.floor((millisecondsLeft - hoursLeft * HOURS - minutesLeft * MINUTES) / SECONDS)
	);

	timer.events.on('tick', () => {
		millisecondsLeft = timer.getCurrentPhaseMillisecondsLeft();
	});

	function padNumber(num: number): string {
		return num.toString().padStart(2, '0');
	}
</script>

<div class="absolute top-1/2 left-1/2 -translate-1/2 bg-primary-800 p-4">
	<div>
		{#if currentPhase === 'focus'}
			Focus
		{:else if currentPhase === 'shortBreak'}
			Short break
		{:else if currentPhase === 'longBreak'}
			Long break
		{/if}
	</div>
	{padNumber(hoursLeft)}:{padNumber(minutesLeft)}:{padNumber(secondsLeft)}
	<div></div>
	<Button onClick={() => timer.start()}>Start</Button>
	<Button onClick={() => timer.stop()}>Stop</Button>
</div>

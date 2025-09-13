<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import TimerDisplay from '$lib/components/TimerDispay.svelte';
	import TimerForm from '$lib/components/TimerForm.svelte';
	import { PomodoroTimer } from '$lib/pomodoro';

	// TODO: Add inputs to support custom timer settings
	const timer = new PomodoroTimer({
		focusMinutes: 45,
		shortBreakMinutes: 15,
		longBreakMinutes: 60,
		shortBreaksCount: 2,
		initialPhase: 'focus'
	});
	let sound: HTMLAudioElement | null = null;

	let currentPhase = $state(timer.currentPhase);
	let isTimerActive = $state(timer.active);
	let totalMsLeft = $state(timer.getCurrentPhaseMilliseconds());

	timer.events.on('started', () => {
		currentPhase = timer.currentPhase;
		isTimerActive = timer.active;
	});

	timer.events.on('paused', () => {
		isTimerActive = timer.active;
	});

	timer.events.on('tick', (e) => {
		totalMsLeft = e.millisecondsLeft;
		isTimerActive = timer.active;
	});
	timer.events.on('phaseEnded', () => {
		sound?.play();
		isTimerActive = timer.active;
	});

	function handleStartPressed() {
		timer.start();
	}
	function handlePausePressed() {
		timer.pause();
	}
	function handleNextPhasePressed() {
		// FIXME: you never get to the long break if you skip phases.
		timer.start(timer.getNextPhase());
	}
</script>

<div class="absolute top-1/2 left-1/2 -translate-1/2 rounded bg-primary-800 p-4">
	<div class="mb-4 flex justify-center gap-4">
		<Button onClick={handleStartPressed} disabled={isTimerActive}>Start</Button>
		<Button onClick={handlePausePressed} disabled={!isTimerActive}>Pause</Button>
		<Button onClick={handleNextPhasePressed}>Next</Button>
	</div>
	<div class="mb-4 text-center">
		{#if currentPhase === 'focus'}
			Focus
		{:else if currentPhase === 'shortBreak'}
			Short break
		{:else if currentPhase === 'longBreak'}
			Long break
		{/if}
	</div>
	<TimerDisplay totalMilliseconds={totalMsLeft} />
	<TimerForm />
</div>

<audio bind:this={sound} class="hidden" src={asset('/alarm.wav')} volume={0.5}></audio>

<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import TimerDisplay from '$lib/components/TimerDispay.svelte';
	import TimerForm from '$lib/components/TimerForm.svelte';
	import { padNumber } from '$lib/number';
	import { parseTimer, PomodoroTimer, type ParsedTimer, type PomodoroConfig } from '$lib/pomodoro';

	let config: PomodoroConfig = $state({
		focusMinutes: 45,
		shortBreakMinutes: 15,
		longBreakMinutes: 60,
		shortBreaksCount: 2,
		initialPhase: 'focus'
	});

	// svelte-ignore state_referenced_locally
	const timer = new PomodoroTimer(config);
	let sound: HTMLAudioElement | null = null;

	let currentPhase = $state(timer.currentPhase);
	let currentPhaseName = $derived.by(() => {
		if (currentPhase === 'focus') return 'Focus';
		if (currentPhase === 'shortBreak') return 'Short Break';
		if (currentPhase === 'longBreak') return 'Long Break';
	});
	let isTimerActive = $state(timer.active);
	let totalMsLeft = $state(timer.getCurrentPhaseMilliseconds());
	let isFormActive = $state(false);
	let showMillis = $state(false);
	let time: ParsedTimer = $derived(parseTimer(totalMsLeft));
	let title = $derived.by(() => {
		if (!isTimerActive) return 'Pomus';
		return `${time.hours > 0 ? padNumber(time.hours) + ':' : ''}${padNumber(time.minutes)}:${padNumber(
			time.seconds
		)} - ${currentPhaseName}`;
	});

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
		isFormActive = false;
		timer.start();
	}
	function handlePausePressed() {
		isFormActive = false;
		timer.pause();
	}
	function handleNextPhasePressed() {
		isFormActive = false;
		// FIXME: you never get to the long break if you skip phases.
		timer.start(timer.getNextPhase());
	}
	function handleConfigChanged(value: Omit<PomodoroConfig, 'initialPhase'>) {
		timer.updateConfig(value);
		config = { ...config, ...value };
		totalMsLeft = timer.getCurrentPhaseMilliseconds();
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div
	class="absolute top-1/2 left-1/2 flex max-w-screen -translate-1/2 flex-row items-start rounded bg-bg"
>
	<div class="p-4 pb-6">
		<div class="mb-4 flex justify-center gap-4">
			<Button onClick={handleStartPressed} disabled={isTimerActive}>Start</Button>
			<Button onClick={handlePausePressed} disabled={!isTimerActive}>Pause</Button>
			<Button onClick={handleNextPhasePressed}>Next</Button>
			<Button class="text-nowrap" onClick={() => (showMillis = !showMillis)}>
				{showMillis ? 'Hide' : 'Show'} Millis
			</Button>
			<Button onClick={() => (isFormActive = !isFormActive)} disabled={isTimerActive}>
				{isFormActive ? 'Close' : 'Edit'}
			</Button>
		</div>
		<div class="mb-4 text-center text-4xl">
			{currentPhaseName}
		</div>
		<TimerDisplay timer={time} showMilliseconds={showMillis} class="text-text" />
	</div>
	{#if isFormActive}
		<div class="border-l border-border p-4">
			<TimerForm initialValue={config} onchange={handleConfigChanged} class="mt-4" />
		</div>
	{/if}
</div>

<audio bind:this={sound} class="hidden" src={asset('/alarm-twice.wav')} volume={0.7}></audio>

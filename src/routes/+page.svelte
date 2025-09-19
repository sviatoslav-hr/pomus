<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import TimerDisplay from '$lib/components/TimerDispay.svelte';
	import TimerForm from '$lib/components/TimerForm.svelte';
	import { padNumber } from '$lib/number';
	import {
		parseTimer,
		PomodoroTimer,
		type ParsedTimer,
		type PomodoroConfig,
		type PomodoroPhase
	} from '$lib/pomodoro';

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
	let currentPhaseName = $derived(getPhaseName(currentPhase));
	let nextPhaseName = $state(getPhaseName(timer.getNextPhase()));
	let isTimerRunning = $state(timer.running);
	let isTimerPaused = $state(false);
	let totalMsLeft = $state(timer.getCurrentPhaseMilliseconds());
	let isFormActive = $state(false);
	let showMillis = $state(false);
	let time: ParsedTimer = $derived(parseTimer(totalMsLeft));
	let title = $derived.by(() => {
		if (!isTimerRunning && !isTimerPaused) return 'Pomus';
		return `${time.hours > 0 ? padNumber(time.hours) + ':' : ''}${padNumber(time.minutes)}:${padNumber(
			time.seconds
		)} - ${currentPhaseName}`;
	});

	timer.events.on('started', () => {
		currentPhase = timer.currentPhase;
		isTimerRunning = timer.running;
	});

	timer.events.on('paused', () => {
		isTimerRunning = timer.running;
	});

	timer.events.on('tick', (e) => {
		totalMsLeft = e.millisecondsLeft;
		isTimerRunning = timer.running;
	});
	timer.events.on('phaseEnded', () => {
		sound?.play();
		isTimerRunning = timer.running;
	});

	function handleStartPressed() {
		isFormActive = false;
		if (isTimerRunning) {
			timer.pause();
			isTimerPaused = true;
		} else if (isTimerPaused) {
			timer.resume();
			isTimerPaused = false;
		} else {
			timer.start();
			isTimerPaused = false;
		}
	}
	function handleNextPhasePressed() {
		isFormActive = false;
		isTimerPaused = false;
		// FIXME: you never get to the long break if you skip phases.
		timer.start(timer.getNextPhase());
		nextPhaseName = getPhaseName(timer.getNextPhase());
	}
	function handleResetPressed() {
		isFormActive = false;
		isTimerPaused = false;
		isTimerRunning = false;
		timer.reset();
		currentPhase = timer.currentPhase;
		totalMsLeft = timer.getCurrentPhaseMilliseconds();
	}
	function handleConfigChanged(value: Omit<PomodoroConfig, 'initialPhase'>) {
		timer.updateConfig(value);
		config = { ...config, ...value };
		totalMsLeft = timer.getCurrentPhaseMilliseconds();
	}
	function getPhaseName(phase: PomodoroPhase): string {
		switch (phase) {
			case 'focus':
				return 'Focus';
			case 'shortBreak':
				return 'Short Break';
			case 'longBreak':
				return 'Long Break';
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div
	class="absolute top-1/2 left-1/2 flex max-w-screen -translate-1/2 flex-row items-start rounded bg-bg"
>
	<div class="p-8 pb-6">
		<div class="mb-6 flex justify-center gap-4">
			<Button
				class="min-w-[10rem] text-nowrap"
				onClick={handleResetPressed}
				disabled={!isTimerRunning && !isTimerPaused}
			>
				Reset
			</Button>
			<Button class="min-w-[10rem] text-nowrap" onClick={() => (showMillis = !showMillis)}>
				{showMillis ? 'Hide' : 'Show'} Millis
			</Button>
			<Button
				class="min-w-[10rem]"
				onClick={() => (isFormActive = !isFormActive)}
				disabled={isTimerRunning}
			>
				{isFormActive ? 'Close' : 'Configure'}
			</Button>
		</div>

		<div class="mb-6 flex items-center justify-center gap-4">
			<Button class="min-w-[10rem]" onClick={handleStartPressed}>
				{isTimerRunning ? 'Pause' : isTimerPaused ? 'Resume' : 'Start'}
			</Button>
			<div class="min-w-[20rem] text-center text-6xl font-bold">{currentPhaseName}</div>
			<Button class="min-w-[10rem]" onClick={handleNextPhasePressed}>{nextPhaseName}</Button>
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

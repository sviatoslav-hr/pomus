import { EventEmitter } from '$lib/events';

export interface PomodoroConfig {
	focusMinutes: number;
	shortBreakMinutes: number;
	shortBreaksCount: number;
	longBreakMinutes: number;
	initialPhase: PomodoroPhase;
}

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';

export const HOURS = 1000 * 60 * 60;
export const MINUTES = 1000 * 60;
export const SECONDS = 1000;

const POMODORO_INTERVAL_MS = 100;
type IntervalId = ReturnType<typeof setInterval>;

interface PomodoroEvents {
	started: void;
	paused: void;
	tick: { millisecondsLeft: number };
	phaseEnded: { prev: PomodoroPhase; next: PomodoroPhase };
}

export class PomodoroTimer {
	focusMinutes: number;
	shortBreakMinutes: number;
	shortBreaksCount: number;
	longBreakMinutes: number;
	events = new EventEmitter<PomodoroEvents>();

	currentPhase: PomodoroPhase;

	millisecondsPassed: number = 0;
	shortBreaksDone: number = 0;
	intervalId: IntervalId | null = null;

	constructor(config: PomodoroConfig) {
		this.focusMinutes = config.focusMinutes;
		this.shortBreakMinutes = config.shortBreakMinutes;
		this.shortBreaksCount = config.shortBreaksCount;
		this.longBreakMinutes = config.longBreakMinutes;
		this.currentPhase = config.initialPhase;
	}

	get active(): boolean {
		return this.intervalId !== null;
	}

	getCurrentPhaseMilliseconds(): number {
		switch (this.currentPhase) {
			case 'focus':
				return this.focusMinutes * MINUTES;
			case 'shortBreak':
				return this.shortBreakMinutes * MINUTES;
			case 'longBreak':
				return this.longBreakMinutes * MINUTES;
		}
	}

	getCurrentPhaseMillisecondsLeft(): number {
		const currentPhaseMilliseconds = this.getCurrentPhaseMilliseconds();
		return Math.max(0, currentPhaseMilliseconds - this.millisecondsPassed);
	}

	getNextPhase(): PomodoroPhase {
		switch (this.currentPhase) {
			case 'shortBreak':
			case 'longBreak':
				return 'focus';
			case 'focus':
				return this.shortBreaksDone >= this.shortBreaksCount ? 'longBreak' : 'shortBreak';
		}
	}

	start(phase: PomodoroPhase = this.currentPhase) {
		const timer = this;
		if (timer.intervalId) timer.pause();
		timer.millisecondsPassed = 0;
		timer.currentPhase = phase;
		if (phase === 'shortBreak') {
			timer.shortBreaksDone++;
		}

		let lastTime = Date.now();
		timer.intervalId = setInterval(() => {
			const nowTime = Date.now();
			const millisecondsPassed = nowTime - lastTime;
			timer.millisecondsPassed += millisecondsPassed;

			const currentPhaseMilliseconds = timer.getCurrentPhaseMilliseconds();
			const millisecondsLeft = Math.max(0, currentPhaseMilliseconds - timer.millisecondsPassed);
			if (millisecondsLeft <= 0) {
				if (timer.intervalId) clearInterval(timer.intervalId);
				timer.millisecondsPassed = 0;
				timer.events.emit('phaseEnded', {
					prev: timer.currentPhase,
					next: timer.getNextPhase()
				});
			}

			timer.events.emit('tick', { millisecondsLeft });
			lastTime = nowTime;
		}, POMODORO_INTERVAL_MS);

		timer.events.emit('started', undefined);
	}

	pause() {
		const timer = this;
		if (timer.intervalId) {
			clearInterval(timer.intervalId);
			timer.intervalId = null;
			timer.events.emit('paused', undefined);
		}
	}

	updateConfig(config: Omit<PomodoroConfig, 'initialPhase'>) {
		this.focusMinutes = config.focusMinutes;
		this.shortBreakMinutes = config.shortBreakMinutes;
		this.longBreakMinutes = config.longBreakMinutes;
		this.shortBreaksCount = config.shortBreaksCount;
	}
}

import { EventEmitter } from '$lib/events';

export interface PomodoroConfig {
	focusMinutes: number;
	shortBreakMinutes: number;
	shortBreaksCount: number;
	longBreakMinutes: number;
}

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';

export const SECONDS = 1000;
export const MINUTES = SECONDS * 60;
export const HOURS = MINUTES * 60;

const POMODORO_INTERVAL_MS = 367;
type IntervalId = ReturnType<typeof setInterval>;

interface PomodoroEvents {
	started: void;
	paused: void;
	resumed: void;
	tick: { millisecondsLeft: number };
	phaseEnded: { prev: PomodoroPhase; next: PomodoroPhase };
}

export class PomodoroTimer {
	focusMinutes: number;
	shortBreakMinutes: number;
	shortBreaksCount: number;
	longBreakMinutes: number;
	events = new EventEmitter<PomodoroEvents>();

	currentPhase: PomodoroPhase = 'focus';

	millisecondsPassed: number = 0;
	shortBreaksDone: number = 0;
	intervalId: IntervalId | null = null;

	constructor(config: PomodoroConfig) {
		this.focusMinutes = config.focusMinutes;
		this.shortBreakMinutes = config.shortBreakMinutes;
		this.shortBreaksCount = config.shortBreaksCount;
		this.longBreakMinutes = config.longBreakMinutes;
	}

	get running(): boolean {
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
		if (this.intervalId) this.pause();
		this.millisecondsPassed = 0;
		this.currentPhase = phase;
		if (phase === 'shortBreak') {
			this.shortBreaksDone++;
		} else if (phase === 'longBreak') {
			this.shortBreaksDone = 0;
		}
		this.runTimer();
		this.events.emit('started', undefined);
	}

	resume() {
		if (this.millisecondsPassed === 0) {
			console.error('Cannot resume a non-paused timer. Use start() instead.');
			return;
		}
		if (this.millisecondsPassed >= this.getCurrentPhaseMilliseconds()) {
			console.error('Cannot resume a finished timer. Use start() instead.');
			return;
		}
		this.runTimer();
		this.events.emit('resumed', undefined);
	}

	pause() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.events.emit('paused', undefined);
		} else {
			console.error('Cannot pause a non-active timer.');
		}
	}

	private runTimer() {
		const timer = this;
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
	}

	updateConfig(config: Omit<PomodoroConfig, 'initialPhase'>) {
		this.focusMinutes = config.focusMinutes;
		this.shortBreakMinutes = config.shortBreakMinutes;
		this.longBreakMinutes = config.longBreakMinutes;
		this.shortBreaksCount = config.shortBreaksCount;
	}

	reset() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.currentPhase = 'focus';
		this.millisecondsPassed = 0;
		this.shortBreaksDone = 0;
	}
}

export interface ParsedTimer {
	totalMilliseconds: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export function parseTimer(totalMilliseconds: number): ParsedTimer {
	const hours = Math.floor(totalMilliseconds / HOURS);
	const minutes = Math.floor((totalMilliseconds - hours * HOURS) / MINUTES);
	const seconds = Math.floor((totalMilliseconds - hours * HOURS - minutes * MINUTES) / SECONDS);
	const milliseconds = totalMilliseconds - hours * HOURS - minutes * MINUTES - seconds * SECONDS;
	return { totalMilliseconds, hours, minutes, seconds, milliseconds };
}

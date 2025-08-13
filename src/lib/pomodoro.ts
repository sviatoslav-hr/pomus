import { EventEmitter } from '$lib/events';

export interface PomodoroConfig {
	focusMinutes: number;
	shortBreakMinutes: number;
	shortBreaksCount: number;
	longBreakMinutes: number;
	startPhase: PomodoroPhase;
}

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';

const POMODORO_INTERVAL_MS = 100;
type IntervalId = ReturnType<typeof setInterval>;

interface PomodoroEvents {
	started: void;
	stopped: void;
	tick: void;
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
	shortBreaksPassed: number = 0;
	intervalId: IntervalId | null = null;

	constructor(config: PomodoroConfig) {
		this.focusMinutes = config.focusMinutes;
		this.shortBreakMinutes = config.shortBreakMinutes;
		this.shortBreaksCount = config.shortBreaksCount;
		this.longBreakMinutes = config.longBreakMinutes;
		this.currentPhase = config.startPhase;
	}

	getCurrentPhaseMilliseconds(): number {
		switch (this.currentPhase) {
			case 'focus':
				return this.focusMinutes * 60 * 1000;
			case 'shortBreak':
				return this.shortBreakMinutes * 60 * 1000;
			case 'longBreak':
				return this.longBreakMinutes * 60 * 1000;
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
				return this.shortBreaksPassed >= this.shortBreaksCount ? 'longBreak' : 'shortBreak';
		}
	}

	start() {
		const timer = this;
		if (timer.intervalId) timer.stop();

		let lastTime = Date.now();
		timer.intervalId = setInterval(() => {
			const nowTime = Date.now();
			const millisecondsPassed = nowTime - lastTime;
			timer.millisecondsPassed += millisecondsPassed;

			const currentPhaseMilliseconds = timer.getCurrentPhaseMilliseconds();
			if (timer.millisecondsPassed >= currentPhaseMilliseconds) {
				if (timer.intervalId) clearInterval(timer.intervalId);
				timer.millisecondsPassed = Math.max(0, timer.millisecondsPassed - currentPhaseMilliseconds);
				if (timer.currentPhase === 'shortBreak') {
					timer.shortBreaksPassed++;
				}
				timer.events.emit('phaseEnded', {
					prev: timer.currentPhase,
					next: timer.getNextPhase()
				});
				return;
			}

			lastTime = nowTime;
			timer.events.emit('tick', undefined);
		}, POMODORO_INTERVAL_MS);
	}

	stop() {
		const timer = this;
		if (timer.intervalId) {
			clearInterval(timer.intervalId);
			timer.intervalId = null;
			timer.events.emit('stopped', undefined);
		}
	}
}

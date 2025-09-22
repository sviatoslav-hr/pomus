import { defaultPomodorConfig, type PomodoroConfig } from '$lib/pomodoro';

const CONFIG_VERSION = 1;

export interface ApplicationConfig {
	version: number;
	pomodoro: PomodoroConfig;
	showMilliseconds: boolean;
}

export const defaultAppConfig: ApplicationConfig = {
	version: CONFIG_VERSION,
	pomodoro: defaultPomodorConfig,
	showMilliseconds: false
};

const STORAGE_CONFIG_KEY = 'app-config';
export function readConfigFromStorage(storage: Storage): ApplicationConfig | null {
	const configStr = storage.getItem(STORAGE_CONFIG_KEY);
	if (!configStr) return null;
	try {
		const config = JSON.parse(configStr) as ApplicationConfig;
		if (config.version < CONFIG_VERSION) {
			console.error('Stored app config version is outdated. Ignoring it.');
			return null;
		}
		return config;
	} catch (e) {
		console.error('Failed to parse app config from storage:', e);
		return null;
	}
}

export function writeConfigToStorage(storage: Storage, config: ApplicationConfig): void {
	storage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
}

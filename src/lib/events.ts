interface EventListener<TKey> {
	name: TKey;
	id: number;
	fn: (param: unknown) => void;
}

export class EventEmitter<TParams extends object> {
	private listeners: EventListener<keyof TParams>[] = [];
	private lastId = 0;

	on<TKey extends keyof TParams>(event: TKey, listener: (param: TParams[TKey]) => void): void {
		this.listeners.push({
			name: event,
			id: this.lastId++,
			fn: listener as (param: unknown) => void // HACK: Forced to cast here, otherwise it become too annoying...
		});
	}

	off<TKey extends keyof TParams>(event: TKey, id: number): void {
		const index = this.listeners.findIndex((l) => l.name === event && l.id === id);
		if (index > -1) {
			this.listeners.splice(index, 1);
		} else {
			console.warn(`No listener found for event "${String(event)}" with id ${id}`);
		}
	}

	emit<TKey extends keyof TParams>(event: TKey, param: TParams[TKey]): void {
		for (const listener of this.listeners) {
			if (listener.name === event) {
				try {
					listener.fn(param);
				} catch (err) {
					console.error(`Error in listener for event "${String(event)}":`, err);
				}
			}
		}
	}
}

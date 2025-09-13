import { getContext, setContext } from 'svelte';

const FORM = Symbol('FORM');

export function getFormContext(): FormInstance {
	const form = getContext<FormInstance>(FORM);
	if (form == null) {
		throw new Error('Form context not found. It must be used within a Form component.');
	}
	return form;
}

export function setFormContext(form: FormInstance): void {
	setContext(FORM, form);
}

export type FieldType = 'number' | 'string' | 'boolean';

export interface FieldDefinition {
	name: string;
	type: FieldType;
}

export class FormInstance {
	fields: Record<string, FieldDefinition> = {};
	disabled = false;

	register(def: FieldDefinition): void {
		if (this.fields[def.name]) {
			throw new Error(`Field with name "${def.name}" is already registered.`);
		}
		this.fields[def.name] = def;
	}
}

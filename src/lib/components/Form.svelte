<script lang="ts">
	import type { Snippet } from 'svelte';
	import { FormInstance, setFormContext } from './Form';

	interface Props {
		class?: string;
		disabled?: boolean;
		onchange?: (value: unknown) => void;
		onsubmit?: (value: unknown) => void;
		children: Snippet;
	}

	let { class: classInput, disabled = false, onchange, onsubmit, children }: Props = $props();

	const instance = new FormInstance();
	instance.disabled = disabled;
	setFormContext(instance);

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (onsubmit) {
			onsubmit(event);
		}
	}
</script>

<form class={classInput} {onchange} onsubmit={handleSubmit}>
	{@render children()}
</form>

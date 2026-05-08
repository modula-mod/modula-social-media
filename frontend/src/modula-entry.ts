import { mount as svelteMount } from 'svelte';
import ModulaSocialModule from './ModulaSocialModule.svelte';

type MountProps = {
	modula?: Record<string, unknown>;
};

function isLegacyClassComponent(candidate: unknown): candidate is new (options: {
	target: HTMLElement;
	props?: Record<string, unknown>;
}) => { $destroy?: () => void } {
	if (typeof candidate !== 'function') return false;
	const proto = (candidate as { prototype?: Record<string, unknown> }).prototype ?? {};
	return Boolean((proto as { $destroy?: unknown }).$destroy || (proto as { $set?: unknown }).$set);
}

function mountNative(target: HTMLElement, props?: MountProps): () => void {
	const component = ModulaSocialModule as unknown;

	if (isLegacyClassComponent(component)) {
		const instance = new component({
			target,
			props: props ?? {}
		});

		return () => {
			try {
				instance.$destroy?.();
			} catch {
				// best effort
			}
		};
	}

	const mounted = svelteMount(component as object, {
		target,
		props: props ?? {}
	});

	return () => {
		try {
			(mounted as { $destroy?: () => void } | null)?.$destroy?.();
		} catch {
			// best effort
		}
	};
}

export default {
	mount: mountNative
};

import { Writable, writable } from "svelte/store";
import { deepCopy, isSame } from "@svar-ui/lib-state";

function copy<T>(obj: T, deep: boolean): T {
	if (deep) return deepCopy(obj);
	return { ...obj };
}

type Store<T> = Writable<T> & { reset: (v: T) => void };

export function form<T>(
	v: T,
	changes: (v: T) => void,
	config?: { debounce?: number; deepCopy: boolean }
): Store<T> {
	const deepCopyMode = config && config.deepCopy;

	let ready = false;
	let timer: ReturnType<typeof setTimeout> = null;
	const store = writable(v) as Store<T>;
	const { set } = store;
	let base = copy(v, deepCopyMode);

	store.set = function (nv) {
		if (!isSame(base, nv)) {
			base = copy(nv, deepCopyMode);
			set(nv);
		}
	};
	store.update = function (upd) {
		const nv = upd(copy(base, deepCopyMode));
		if (!isSame(base, nv)) {
			base = copy(nv, deepCopyMode);
			set(nv);
		}
	};
	store.reset = function (v) {
		ready = false;
		base = {} as T;
		store.set(v);
	};
	store.subscribe(v => {
		if (ready) {
			if (v) {
				if (!config || !config.debounce) changes(v);
				else {
					clearTimeout(timer);
					timer = setTimeout(() => changes(v), config.debounce);
				}
			}
		} else ready = true;
	});

	return store;
}

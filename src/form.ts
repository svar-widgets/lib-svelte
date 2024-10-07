import { Writable, writable } from "svelte/store";
import { deepCopy, isSame } from "wx-lib-state";

function copy(obj: any, deep: boolean) {
	if (deep) return deepCopy(obj);
	return { ...obj };
}

export function form(
	v: any,
	changes: (v: any) => void,
	config?: { debounce?: number; deepCopy: boolean }
) {
	const deepCopyMode = config && config.deepCopy;

	let ready = false;
	let timer: ReturnType<typeof setTimeout> = null;
	const store = writable(v) as Writable<any> & { reset: (v: any) => void };
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
		base = {};
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

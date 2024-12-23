import { on } from "svelte/events";

interface Env {
	addEvent: (
		node: HTMLElement,
		event: string,
		handler: EventListenerOrEventListenerObject
	) => RemoveEventListener;
	addGlobalEvent: (
		event: string,
		handler: EventListenerOrEventListenerObject
	) => RemoveEventListener;
	getTopNode: () => HTMLElement;
}

type RemoveEventListener = () => void;

export const env: Partial<Env> = {
	addEvent: on as undefined as Env["addEvent"],
};

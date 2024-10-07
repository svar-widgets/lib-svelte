import { form } from "../src/form";
import { test, expect } from "vitest";

test("form", async () => {
	let count = 0;
	const f = form({ a: 1, b: "2" }, () => count++);

	f.update(x => x);
	expect(count).toEqual(0);

	f.update(() => ({ a: 1, b: "2" }));
	expect(count).toEqual(0);

	f.update(() => ({ a: 1, b: "3" }));
	expect(count).toEqual(1);

	f.reset({ a: 1, b: "2" });
	expect(count).toEqual(1);

	f.set({ a: 1, b: "2" });
	expect(count).toEqual(1);

	f.set({ a: 1, b: "2", n: 1 });
	expect(count).toEqual(2);
});

test("form with nested object", () => {
	let count = 0;
	const d = { a: { b: 1 }, c: [{ d: 1 }] };
	const f = form(d, () => count++);

	f.update(x => x);
	expect(count).toEqual(0);

	f.update(x => ({ ...x, a: { b: 1 } }));
	expect(count).toEqual(0);

	f.update(x => ({ ...x, a: { b: 2 } }));
	expect(count).toEqual(1);
});

test("form with nested object and deepCopy", () => {
	let count1 = 0;
	const d1 = { a: { b: 1 }, c: [{ d: 1 }] };
	const f1 = form(d1, () => count1++);

	f1.update(() => d1);
	expect(count1).toEqual(0);

	d1.a.b = 3;
	f1.update(() => d1);
	expect(count1).toEqual(0);

	let count2 = 0;
	const d2 = { a: { b: 1 }, c: [{ d: 1 }] };
	const f2 = form(d2, () => count2++, { deepCopy: true });

	f2.update(() => d2);
	expect(count2).toEqual(0);

	d2.a.b = 3;
	f2.update(() => d2);
	expect(count2).toEqual(1);
});

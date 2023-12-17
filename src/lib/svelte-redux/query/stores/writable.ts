import type { StartStopNotifier, Writable } from "svelte/store";
import { writable as svelteWritable } from "svelte/store";

import { safeNotEqual } from "../../equality";

function noop() {}

export function writable<T>(
  value?: T,
  start: StartStopNotifier<T> = noop,
  inequalityFn = safeNotEqual
): Writable<T> {
  const innerWritable$ = svelteWritable(value, start);

  const set = function set(newValue: T) {
    if (safeNotEqual(value, newValue) && inequalityFn(value, newValue)) {
      value = newValue;
      innerWritable$.set(newValue);
    }
  };

  return {
    set,
    update(fn) {
      set(fn(value!));
    },
    subscribe: innerWritable$.subscribe,
  };
}

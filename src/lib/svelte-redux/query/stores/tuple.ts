import type { StartStopNotifier, Writable } from "svelte/store";
import { writable } from "svelte/store";

import { safeNotEqual } from "../../equality";

function noop() {}
const defaultTuple: [undefined, undefined] = [undefined, undefined];

export function tuple<Left, Right>(
  [left, right]: [Left | undefined, Right | undefined] = defaultTuple,
  start: StartStopNotifier<[Left | undefined, Right | undefined]> = noop,
  inequalityFn = safeNotEqual
): Writable<[Left | undefined, Right | undefined]> {
  const innerWritable$ = writable([left, right] as [Left | undefined, Right | undefined], start);

  const set = function set([newLeft, newRight]: [Left | undefined, Right | undefined]) {
    if (inequalityFn(left, newLeft) || inequalityFn(right, newRight)) {
      left = newLeft;
      right = newRight;
      innerWritable$.set([newLeft, newRight]);
    }
  };

  return {
    set,
    update(fn) {
      set(fn([left, right]));
    },
    subscribe: innerWritable$.subscribe,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function is(x: unknown, y: unknown) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export function referenceNotEqual(a: any, b: any) {
  return !is(a, b);
}

export function safeNotEqual(a: any, b: any) {
  return a != a ? b == b : a !== b || (a && typeof a === "object") || typeof a === "function";
}

function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) return true;

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

export function shallowNotEqual(a: any, b: any) {
  return !shallowEqual(a, b);
}

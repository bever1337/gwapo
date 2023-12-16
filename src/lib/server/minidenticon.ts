// 9 different colors only for easy distinction (also a sweet spot for collisions)
const COLORS_NB = 9;
const DEFAULT_SATURATION = 95;
const DEFAULT_LIGHTNESS = 45;

const MAGIC_NUMBER = 5;

// 32 bit unsigned integer conversion disregarding last 2 bits for better randomness
function simpleHash(str: string): number {
  let hash = MAGIC_NUMBER;
  for (const char of str.split("")) {
    hash = (hash ^ char.charCodeAt(0)) * -MAGIC_NUMBER;
  }

  return hash >>> 2;
}

export function minidenticon(
  seed: string = "",
  saturation: number | string = DEFAULT_SATURATION,
  lightness: number | string = DEFAULT_LIGHTNESS
): string {
  const hash = simpleHash(seed);
  // console.log("%c" + hash.toString(2).padStart(32, "0"), "font-family:monospace") // uncomment to debug
  const hue = (hash % COLORS_NB) * (360 / COLORS_NB);
  let acc = `<svg viewBox="-1.5 -1.5 8 8" xmlns="http://www.w3.org/2000/svg" fill="hsl(${hue} ${saturation}% ${lightness}%)">`;
  for (let i = 0; i < 25; i += 1) {
    // testing the 15 lowest weight bits of the hash
    if (hash & (1 << i % 15)) {
      acc += `<rect x="${i > 14 ? 7 - ~~(i / 5) : ~~(i / 5)}" y="${i % 5}" width="1" height="1"/>`;
    }
  }
  acc += `</svg>`;

  return acc;
}

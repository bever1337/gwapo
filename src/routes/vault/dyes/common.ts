export function collectHexagonCenterPoints(radius: number): [cx: number, cy: number][] {
  const centerPoints: [number, number][] = [[0, 0]];
  for (let i = 0; i < radius; i++) {
    /** Center-to-center distance between two hexagons */
    const distance = 100;
    let [xN, yN]: [xN: number, yN: number] = [-1 * i * distance, 0];
    let [translateX, translateY]: [translateX: number, translateY: number] = [
      distance / 2,
      (-1 * distance * Math.sqrt(3)) / 2,
    ];
    for (let j = 0; j < 6; j++) {
      for (let k = 0; k < i; k++) {
        xN += translateX;
        yN += translateY;
        centerPoints.push([xN, yN]);
      }
      [translateX, translateY] = [
        Math.cos(Math.PI / 3) * translateX - Math.sin(Math.PI / 3) * translateY, // Negate sin term for clockwise rotation
        Math.sin(Math.PI / 3) * translateX + Math.cos(Math.PI / 3) * translateY, // Negate cos term for clockwise rotation
      ];
    }
  }
  return centerPoints;
}

export const paramToString = (input: null | string): null | string => {
  if (input === null || typeof input !== "string" || input.length <= 0 || input.length > 255) {
    return null;
  }
  return input;
};

/** Calculate an approximate radius for a given number of tiles */
export function tilesToRadius(tiles: number): number {
  let consumed = 1;
  let radius = 1;
  for (; consumed < tiles; radius++) {
    consumed += radius * 6;
  }
  return radius;
}

<script lang="ts">
  export let cx: number;
  export let cy: number;
  export let diameter: number;
  export let strokeWidth: number;
  export let vertices: number;

  function calculateNextPoint({
    cx,
    cy,
    diameter,
    n,
    vertices,
  }: {
    cx: number;
    cy: number;
    diameter: number;
    vertices: number;
    n: number;
  }) {
    const radius = (diameter * Math.sqrt(3)) / 3;
    const angleFromCenter = (2 * n * Math.PI) / vertices;
    return [cx + radius * Math.sin(angleFromCenter), cy + radius * Math.cos(angleFromCenter)];
  }

  const zeroAdjustment = Math.max(0, strokeWidth / 2);
  const adjustedDiameter = diameter - zeroAdjustment;
  const [x1, y1] = calculateNextPoint({
    cx,
    cy,
    diameter: adjustedDiameter,
    n: 1,
    vertices,
  });
  let d = `M ${Math.round(x1 * 100) / 100} ${Math.round(y1 * 100) / 100}`;
  for (let i = 2; i <= vertices; i++) {
    const [x, y] = calculateNextPoint({
      cx,
      cy,
      diameter: adjustedDiameter,
      n: i,
      vertices,
    });
    d += ` L ${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
  }
  d += " Z";
</script>

<path stroke-opacity={100} {...$$restProps} {d} />

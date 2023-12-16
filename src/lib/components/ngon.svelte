<script context="module" lang="ts">
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
    const radius = diameter / 2;
    const angleFromCenter = (2 * n * Math.PI) / vertices;
    return [cx + radius * Math.cos(angleFromCenter), cy + radius * Math.sin(angleFromCenter)];
  }
</script>

<script lang="ts">
  export let cx: number;
  export let cy: number;
  export let diameter: number;
  export let strokeWidth: number;
  export let vertices: number;

  const zeroAdjustment = Math.floor(strokeWidth / 2);
  const adjustedDiameter = diameter - zeroAdjustment;
  const [x1, y1] = calculateNextPoint({
    cx,
    cy,
    diameter: adjustedDiameter,
    n: 1,
    vertices,
  });
  let d = `M ${x1} ${y1}`;
  for (let i = 2; i <= vertices; i++) {
    const [x, y] = calculateNextPoint({
      cx,
      cy,
      diameter: adjustedDiameter,
      n: i,
      vertices,
    });
    d += ` L ${x} ${y}`;
  }
  d += " Z";
</script>

<path stroke-opacity={100} {...$$restProps} {d} />

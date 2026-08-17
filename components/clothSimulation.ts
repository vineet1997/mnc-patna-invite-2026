export const CLOTH_FEEL = {
  fixedStep: 1 / 60,
  maxSubsteps: 3,
  constraintPasses: 4,
  liftDuration: 1.3,
  topReleaseAt: 1.6,
  titleAt: 1.82,
  detailsAt: 3.15,
  settleSpeed: 0.22,
  settleFrames: 18,
  safetySettleAt: 5.1,
} as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export function createClothSimulation(base: ArrayLike<number>, columns: number, rows: number) {
  const positions = new Float32Array(base.length);
  const previous = new Float32Array(base.length);
  const gathered = new Float32Array(base.length);
  const target = new Float32Array(base.length);
  let time = 0;
  let speed = Number.POSITIVE_INFINITY;

  for (let row = 0; row < rows; row += 1) {
    const v = row / (rows - 1);
    for (let column = 0; column < columns; column += 1) {
      const u = column / (columns - 1);
      const index = row * columns + column;
      const offset = index * 3;
      const baseX = Number(base[offset]);
      const baseY = Number(base[offset + 1]);
      const gatheredX = baseX * (0.47 + v * 0.14) + Math.sin(v * 5.2) * 0.1;
      const gatheredY = -5.55 + (1 - v) * 1.42 + Math.sin(u * Math.PI) * 0.12;
      const gatheredZ = Math.sin(u * Math.PI * 4.2 + v * 1.8) * 0.7 + Math.cos(v * 7) * 0.16;

      gathered[offset] = gatheredX;
      gathered[offset + 1] = gatheredY;
      gathered[offset + 2] = gatheredZ;
      positions[offset] = gatheredX;
      positions[offset + 1] = gatheredY;
      positions[offset + 2] = gatheredZ;
      previous[offset] = gatheredX + (u - 0.42) * 0.004;
      previous[offset + 1] = gatheredY - (0.28 + (1 - v) * 0.72) * CLOTH_FEEL.fixedStep;
      previous[offset + 2] = gatheredZ - Math.sin(u * 5.4) * 0.012;
      target[offset] = baseX;
      target[offset + 1] = baseY;
      target[offset + 2] = Math.sin(baseX * 0.72 + baseY * 0.22) * 0.085;
    }
  }

  const isPinned = (index: number) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    return row === 0 && (time < CLOTH_FEEL.topReleaseAt || column === 0 || column === columns - 1);
  };

  const pinTopEdge = () => {
    const lift = smooth(time / CLOTH_FEEL.liftDuration);
    const snap = Math.sin(lift * Math.PI);
    for (let column = 0; column < columns; column += 1) {
      if (time >= CLOTH_FEEL.topReleaseAt && column !== 0 && column !== columns - 1) continue;
      const u = column / (columns - 1);
      const offset = column * 3;
      const asymmetry = (u - 0.38) * snap;
      positions[offset] = gathered[offset] + (target[offset] - gathered[offset]) * lift + asymmetry * 0.26;
      positions[offset + 1] = gathered[offset + 1] + (target[offset + 1] - gathered[offset + 1]) * lift + snap * (0.22 + u * 0.12);
      positions[offset + 2] = gathered[offset + 2] * (1 - lift) + target[offset + 2] + snap * Math.sin(u * Math.PI) * 0.58;
      previous[offset] = positions[offset];
      previous[offset + 1] = positions[offset + 1];
      previous[offset + 2] = positions[offset + 2];
    }
  };

  const satisfy = (first: number, second: number, stiffness: number) => {
    const a = first * 3;
    const b = second * 3;
    const dx = positions[b] - positions[a];
    const dy = positions[b + 1] - positions[a + 1];
    const dz = positions[b + 2] - positions[a + 2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
    const restX = Number(base[b]) - Number(base[a]);
    const restY = Number(base[b + 1]) - Number(base[a + 1]);
    const restDistance = Math.sqrt(restX * restX + restY * restY);
    const correction = ((distance - restDistance) / distance) * stiffness;
    const firstPinned = isPinned(first);
    const secondPinned = isPinned(second);
    const firstWeight = firstPinned ? 0 : secondPinned ? 1 : 0.5;
    const secondWeight = secondPinned ? 0 : firstPinned ? 1 : 0.5;

    positions[a] += dx * correction * firstWeight;
    positions[a + 1] += dy * correction * firstWeight;
    positions[a + 2] += dz * correction * firstWeight;
    positions[b] -= dx * correction * secondWeight;
    positions[b + 1] -= dy * correction * secondWeight;
    positions[b + 2] -= dz * correction * secondWeight;
  };

  const step = (delta: number) => {
    time += delta;
    const settle = smooth((time - 1.55) / 2.45);
    const firstSweep = Math.sin(clamp01((time - 0.08) / 1.9) * Math.PI);
    const afterFlutter = Math.sin(clamp01((time - 1.42) / 2.35) * Math.PI);
    const gust = firstSweep + afterFlutter * 0.38;
    const damping = 0.987 - settle * 0.085;
    const targetStrength = settle * (8 + settle * 36);
    let speedTotal = 0;

    for (let index = 0; index < positions.length / 3; index += 1) {
      if (isPinned(index)) continue;
      const offset = index * 3;
      const row = Math.floor(index / columns);
      const column = index % columns;
      const u = column / (columns - 1);
      const v = row / (rows - 1);
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      const velocityX = (x - previous[offset]) * damping;
      const velocityY = (y - previous[offset + 1]) * damping;
      const velocityZ = (z - previous[offset + 2]) * damping;
      previous[offset] = x;
      previous[offset + 1] = y;
      previous[offset + 2] = z;

      const wave = Math.sin(u * 8.4 + v * 3.1 - time * 3.8);
      const ripple = Math.sin(u * 13.2 - v * 5.1 + time * 6.2);
      const accelerationX = (target[offset] - x) * targetStrength + gust * (u - 0.33) * (1 - v) * 1.6;
      const accelerationY = (target[offset + 1] - y) * targetStrength - 1.75 + gust * (1 - v) * 2.2;
      const accelerationZ = (target[offset + 2] - z) * targetStrength + gust * wave * (7.8 - v * 3.1) + afterFlutter * ripple * 2.4;

      positions[offset] = x + velocityX + accelerationX * delta * delta;
      positions[offset + 1] = y + velocityY + accelerationY * delta * delta;
      positions[offset + 2] = z + velocityZ + accelerationZ * delta * delta;
      speedTotal += Math.sqrt(velocityX * velocityX + velocityY * velocityY + velocityZ * velocityZ) / delta;
    }

    for (let pass = 0; pass < CLOTH_FEEL.constraintPasses; pass += 1) {
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          if (column + 1 < columns) satisfy(index, index + 1, 0.94);
          if (row + 1 < rows) satisfy(index, index + columns, 0.94);
          if (column + 1 < columns && row + 1 < rows) {
            satisfy(index, index + columns + 1, 0.58);
            satisfy(index + 1, index + columns, 0.58);
          }
          if (column + 2 < columns) satisfy(index, index + 2, 0.28);
          if (row + 2 < rows) satisfy(index, index + columns * 2, 0.28);
        }
      }
      pinTopEdge();
    }

    speed = speedTotal / (positions.length / 3);
    return speed;
  };

  pinTopEdge();
  return { positions, step, get time() { return time; }, get speed() { return speed; } };
}

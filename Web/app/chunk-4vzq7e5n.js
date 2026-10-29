// Lamp builds this from src/ before every build and look: change src/, never this folder.
import {
  applyOpener,
  createMapWorld,
  sidesOf,
  step,
  tickFog,
  worldHash
} from "./chunk-t4trhs59.js";

// src/sim/setup.ts
function setupWorld(r) {
  const w = createMapWorld(r.map, {
    seed: r.seed,
    objectives: true,
    ...r.mutators.length ? { mutators: r.mutators } : {},
    ...r.survival ? { survival: r.survival } : {},
    ...r.op ? { op: r.op } : {}
  });
  for (const f of sidesOf(w)) {
    const o = r.openers[f];
    if (o)
      applyOpener(w, f, o);
    const m = r.income?.[f];
    if (m !== undefined)
      w.factions[f].incomeMult = m;
  }
  tickFog(w);
  return w;
}
// src/arena/record.ts
function replay(r, opts = {}) {
  const w = setupWorld(r);
  const byTick = new Map;
  for (const [tick, , cmds] of r.turns)
    byTick.set(tick, [...byTick.get(tick) ?? [], ...cmds]);
  const hashes = new Map(r.hashes);
  const end = Math.min(opts.until ?? Infinity, r.end?.tick ?? r.tick ?? Math.max(0, ...r.hashes.map((h) => h[0])));
  let divergedAt = null;
  let checked = 0;
  while (w.tick < end && !w.winner) {
    step(w, byTick.get(w.tick) ?? []);
    opts.onTick?.(w);
    const want = hashes.get(w.tick);
    if (want !== undefined) {
      checked++;
      if (divergedAt === null && worldHash(w) !== want)
        divergedAt = w.tick;
    }
  }
  return { world: w, divergedAt, checked };
}

export { setupWorld, replay };

// Lamp builds this from src/ before every build and look: change src/, never this folder.
import {
  SIDE_CSS,
  SIDE_NAME
} from "./chunk-bf9sx1k8.js";
import {
  setupWorld
} from "./chunk-4vzq7e5n.js";
import {
  FACTIONS,
  OPENERS,
  TICK_RATE,
  isFaction,
  isKnownMapId,
  isOpenerId,
  worldHash
} from "./chunk-t4trhs59.js";

// src/ui/replay.ts
var CSS = `
#replay-panel[hidden] { display: none; }
#replay-panel { position: fixed; top: 56px; left: 50%; transform: translateX(-50%); z-index: 40; width: min(760px, calc(100vw - 32px));
  font: 13px/1.35 system-ui, sans-serif; color: #e8eef5; pointer-events: none; }
#replay-panel .rp-bar { pointer-events: auto; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; padding: 6px 10px;
  background: rgba(12, 18, 26, 0.82); border-radius: 10px; backdrop-filter: blur(4px); }
#replay-panel .rp-vs { flex: 1 1 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#replay-panel .rp-vs.multi { white-space: normal; }
${FACTIONS.map((f) => `#replay-panel .${f} { color: ${SIDE_CSS[f]}; font-weight: 600; }`).join(" ")}
#replay-panel input[type=range] { flex: 1 1 160px; min-width: 120px; }
#replay-panel button { font: inherit; color: inherit; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  border-radius: 6px; padding: 2px 8px; cursor: pointer; }
#replay-panel button.on { background: rgba(126, 193, 255, 0.35); }
#replay-panel .rp-time { font-variant-numeric: tabular-nums; }
#replay-panel .rp-status, #replay-panel .rp-warn { margin-top: 4px; padding: 3px 10px; border-radius: 8px; background: rgba(12, 18, 26, 0.75); width: fit-content; }
#replay-panel .rp-warn { background: rgba(140, 30, 20, 0.85); }
#replay-panel .rp-warn a { pointer-events: auto; color: inherit; font-weight: 600; }
#replay-panel .rp-notes { pointer-events: auto; margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; max-height: 38vh; overflow: auto; }
#replay-panel .rp-side { background: rgba(12, 18, 26, 0.8); border-radius: 10px; padding: 6px 8px; overflow-wrap: anywhere; }
#replay-panel .rp-side h4 { margin: 0 0 3px; font-size: 12px; }
#replay-panel .rp-side pre { margin: 2px 0; white-space: pre-wrap; font: 11px/1.3 ui-monospace, monospace; color: #c9d4df; }
#replay-panel .rp-radio { font-style: italic; color: #ffe8a3; }
@media (max-width: 640px) { #replay-panel .rp-notes { grid-template-columns: 1fr; } }
`;
function replayPanel(feed, scene) {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
  const root = document.createElement("div");
  root.id = "replay-panel";
  const r = feed.record;
  const sides = FACTIONS.filter((f) => feed.labels[f] !== undefined);
  const vs = sides.map((f) => `<span class="${f}">${SIDE_NAME[f]}</span> ${esc(feed.labels[f])}`).join(" vs ");
  root.innerHTML = `
    <div class="rp-bar">
      <div class="rp-vs${sides.length > 2 ? " multi" : ""}">${vs} · ${esc(r.map)} seed ${esc(String(r.seed))}</div>
      <span class="rp-time"></span>
      <input type="range" min="0" step="1" value="0" aria-label="Seek">
      <button data-jump="-300" title="Back 30 s">−30s</button><button data-jump="300" title="Forward 30 s">+30s</button>
      <button data-fog="off" title="The whole battlefield">All</button>${sides.map((f) => `<button data-fog="${f}" title="Through ${f}'s eyes">${SIDE_NAME[f]}'s eyes</button>`).join("")}
      <button data-notes title="Orders and notes">Notes</button>
    </div>
    <div class="rp-status" hidden></div>
    <div class="rp-warn" hidden></div>
    ${asPlayed(r) ? `<div class="rp-status rp-upgraded">${esc(asPlayed(r))}</div>` : ""}
    <div class="rp-notes" hidden>${sides.map((f) => `<div class="rp-side" data-side="${f}"></div>`).join("")}</div>`;
  document.body.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const time = $("span.rp-time");
  const seek = $("input[type=range]");
  const status = $(".rp-status");
  const warn = $(".rp-warn");
  const notes = $(".rp-notes");
  let dragging = false;
  seek.addEventListener("input", () => dragging = true);
  seek.addEventListener("change", () => {
    dragging = false;
    scene.seek(Number(seek.value));
  });
  for (const b of root.querySelectorAll("[data-jump]"))
    b.addEventListener("click", () => scene.seek(Math.min(feed.playedTo, scene.tick + Number(b.dataset.jump))));
  const fogButtons = [...root.querySelectorAll("[data-fog]")];
  for (const b of fogButtons)
    b.addEventListener("click", () => {
      const v = b.dataset.fog;
      scene.setFog(isFaction(v) ? v : null);
    });
  $("[data-notes]").addEventListener("click", (e) => {
    notes.hidden = !notes.hidden;
    e.currentTarget.classList.toggle("on", !notes.hidden);
  });
  let shownRound = -1;
  let shownDrift = null;
  const sideHtml = (side, round) => {
    let l = null;
    for (let k = round;k >= 0 && !l; k--)
      l = feed.logFor(k, side);
    if (!l)
      return `<h4 class="${side}">${side}</h4><pre>(nothing yet)</pre>`;
    const orders = l.orders.length ? l.orders.map((o) => JSON.stringify(o)).join(`
`) : "(no orders)";
    return `<h4 class="${side}">${side} · round ${l.round}${l.round !== round ? " (waiting since)" : ""}${l.ended && l.ended !== "end_round" ? ` · ${esc(l.ended)}` : ""}</h4>` + (l.radio ? `<div class="rp-radio">“${esc(l.radio)}”</div>` : "") + `<pre>${esc(orders)}</pre><pre>${esc(l.results.join(`
`))}</pre><pre>${esc(l.notes)}</pre>`;
  };
  const endEl = document.getElementById("endscreen");
  return {
    update() {
      root.hidden = !!endEl && !endEl.hidden;
      if (root.hidden)
        return;
      const t = scene.tick;
      const end = feed.playedTo;
      time.textContent = `${clock(t)} / ${clock(end)}${feed.record.end ? "" : " …"}`;
      seek.max = String(end);
      if (!dragging)
        seek.value = String(t);
      const fog = scene.fogShown();
      for (const b of fogButtons)
        b.classList.toggle("on", b.dataset.fog === "off" && !fog || b.dataset.fog === fog);
      const waiting = feed.follow && !feed.record.end && t >= end;
      status.hidden = !waiting;
      if (waiting)
        status.textContent = `Round ${feed.roundAt(t)}: the commanders are thinking… ${clock((performance.now() - feed.grewAt) / 1000 * 10)}`;
      const drift = feed.divergedAt ?? feed.driftsAt;
      warn.hidden = drift === null;
      if (drift !== null && drift !== shownDrift) {
        shownDrift = drift;
        const pinned = pinnedLink(feed);
        warn.innerHTML = `⚠ This replay diverges at ${clock(drift)}: what you see after that didn't happen` + (pinned ? ` · <a href="${esc(pinned)}">▶ Watch it in ${esc(feed.record.version)}</a>` : "");
      }
      const round = feed.roundAt(Math.max(0, t - 1));
      if (!notes.hidden && round !== shownRound) {
        shownRound = round;
        for (const side of sides)
          $(`.rp-side[data-side=${side}]`).innerHTML = sideHtml(side, round);
      } else if (notes.hidden)
        shownRound = -1;
    },
    destroy() {
      root.remove();
      style.remove();
    }
  };
}
function asPlayed(r) {
  const was = r.upgraded?.[0]?.end;
  const now = r.end;
  if (!was || was.winner === now?.winner && Math.abs(was.tick - (now?.tick ?? 0)) < 10)
    return null;
  const how = was.winner ? `${was.winner} won at ${clock(was.tick)}` : `it was a draw at ${clock(was.tick)}`;
  return `Re-simulated on newer game code, so the ending differs: as played, ${how}`;
}
function esc(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// src/game/replay.ts
var BUILD_SIM = typeof __SIM_HASH__ === "undefined" ? null : __SIM_HASH__;
var BUILD_TAG = typeof __VERSION_TAG__ === "undefined" ? null : __VERSION_TAG__;
var KEYFRAME_TICKS = 30 * TICK_RATE;
var SOUND_DUEL_SEAT = /^sound-duel:(host|guest)$/;
var clock = (tick) => {
  const s = Math.floor(tick / TICK_RATE);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

class ReplayFeed {
  url;
  follow;
  world;
  labels;
  record;
  divergedAt = null;
  driftsAt = null;
  scene = null;
  grewAt = performance.now();
  byTick = new Map;
  hashes = new Map;
  keyframes = new Map;
  radioNext = 0;
  panel = null;
  fetchIn = 1000;
  fetching = false;
  constructor(record, url, follow) {
    this.url = url;
    this.follow = follow;
    this.record = record;
    this.world = setupWorld(record);
    this.keyframes.set(0, structuredClone(this.world));
    this.labels = Object.fromEntries(FACTIONS.filter((f) => record.seats[f]).map((f) => [f, this.label(f)]));
    this.index();
  }
  label(side) {
    const opener = this.record.openers[side];
    const player = this.record.seats[side]?.player ?? SIDE_NAME[side];
    const phone = SOUND_DUEL_SEAT.exec(player)?.[1];
    if (phone)
      return `${phone === "host" ? "Host" : "Guest"} phone${opener ? ` · ${isOpenerId(opener) ? OPENERS[opener].name : opener}` : ""}`;
    return `${player.replace(/^(openai|anthropic|llm):/, "")}${opener ? ` · ${opener}` : ""}`;
  }
  index() {
    this.byTick.clear();
    for (const [tick, , cmds] of this.record.turns)
      this.byTick.set(tick, [...this.byTick.get(tick) ?? [], ...cmds]);
    this.hashes = new Map(this.record.hashes);
  }
  get playedTo() {
    return this.record.end?.tick ?? this.record.tick ?? 0;
  }
  roundAt(tick) {
    return Math.floor(tick / this.record.round) + 1;
  }
  logFor(round, side) {
    return this.record.log.find((l) => l.round === round && l.side === side) ?? null;
  }
  battleRecord() {
    return this.record;
  }
  commands(tick) {
    if (tick >= this.playedTo)
      return null;
    return this.byTick.get(tick) ?? [];
  }
  attach(scene) {
    this.scene = scene;
    this.panel = replayPanel(this, scene);
    window.__replay = this;
    if (!this.follow && !knownToMatch(this.record))
      this.checkAhead();
  }
  checkAhead() {
    const worker = new Worker(new URL("./replay-check.worker.js", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      this.driftsAt = e.data;
      worker.terminate();
    };
    worker.onerror = () => worker.terminate();
    worker.postMessage(this.record);
  }
  afterTick(w, seeking) {
    const want = this.hashes.get(w.tick);
    if (want !== undefined && this.divergedAt === null && worldHash(w) !== want) {
      this.divergedAt = w.tick;
      this.scene?.alert(`⚠ This replay diverged at ${clock(w.tick)}`);
    }
    if (w.tick % KEYFRAME_TICKS === 0 && !this.keyframes.has(w.tick))
      this.keyframes.set(w.tick, structuredClone(w));
    const radio = this.record.radio;
    while (this.radioNext < radio.length && radio[this.radioNext][0] <= w.tick) {
      const [, side, text] = radio[this.radioNext++];
      if (!seeking)
        this.scene?.commanderRadio(side, text);
    }
  }
  frame(deltaMs) {
    this.panel?.update();
    if (!this.follow || !this.url || this.record.end)
      return;
    this.fetchIn -= deltaMs;
    if (this.fetchIn > 0 || this.fetching)
      return;
    this.fetchIn = 1000;
    this.fetching = true;
    fetchRecord(this.url).then((r) => this.grow(r)).catch(() => {}).finally(() => this.fetching = false);
  }
  grow(r) {
    if (r.seed !== this.record.seed || r.map !== this.record.map || r.created !== this.record.created)
      return;
    if ((r.end?.tick ?? r.tick) === this.playedTo && !!r.end === !!this.record.end)
      return;
    this.record = r;
    this.grewAt = performance.now();
    this.index();
  }
  keyframe(tick) {
    let best = -1;
    for (const k of this.keyframes.keys())
      if (k <= tick && k > best)
        best = k;
    const kf = best >= 0 ? this.keyframes.get(best) : null;
    if (kf)
      this.radioNext = this.record.radio.findIndex((x) => x[0] > kf.tick);
    if (this.radioNext < 0)
      this.radioNext = this.record.radio.length;
    return kf;
  }
}
var knownToMatch = (r) => r.sim === BUILD_SIM || !!r.version && r.version === BUILD_TAG;
function pinnedLink(feed) {
  const v = feed.record.version;
  if (!v || v === BUILD_TAG || !feed.url || !/^v[0-9][A-Za-z0-9.+-]*$/.test(v))
    return null;
  const root = new URL(BUILD_TAG ? "../" : "./", new URL("./", location.href));
  return `${new URL(`${v}/`, root).href}?replay=${encodeURIComponent(feed.url)}`;
}
function parseRecord(text) {
  let r;
  try {
    r = JSON.parse(text);
  } catch {
    throw new Error("That isn't JSON: paste the whole .json file a battle wrote to battles/");
  }
  if (!r || typeof r !== "object" || r.v !== 1 || !Array.isArray(r.turns) || !Array.isArray(r.hashes) || !r.seats)
    throw new Error("That isn't a battle record (tools/arena.ts and llm battledrones write them to battles/)");
  if (!isKnownMapId(r.map))
    throw new Error(`This battle was played on "${r.map}", a map this version of the game doesn't have`);
  if (!r.end && !r.tick)
    throw new Error("This battle hasn't been played past its first round yet");
  return r;
}
async function fetchRecord(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`${url}: ${res.status}`);
  return parseRecord(await res.text());
}
function replayFromJson(text) {
  return new ReplayFeed(parseRecord(text), null, false);
}
var GIST = /^https?:\/\/gist\.github\.com\/(?:([^/]+)\/)?([0-9a-f]+)(?:\/([0-9a-f]+))?$/i;
var GITHUB_FILE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i;
async function fetchLinkedRecord(ref, base = location.href) {
  let url;
  try {
    url = new URL(ref.trim(), base);
  } catch {
    throw new Error(`"${ref}" isn't a URL`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:")
    throw new Error("Only http and https links can be loaded");
  const page = (url.origin + url.pathname).replace(/\/$/, "");
  const gist = GIST.exec(page);
  if (gist) {
    const [, owner, id, revision] = gist;
    if (owner)
      return fetchText(`https://gist.githubusercontent.com/${owner}/${id}/raw/${revision ?? ""}`);
    const res = await fetch(`https://api.github.com/gists/${id}${revision ? `/${revision}` : ""}`).catch(() => null);
    if (!res?.ok)
      throw new Error(`Couldn't look up Gist ${id} with GitHub's API${res ? ` (${res.status})` : ""}`);
    const files = Object.values((await res.json()).files ?? {});
    const file = files.find((f) => /\.json$/i.test(f.filename)) ?? files[0];
    if (!file)
      throw new Error(`Gist ${id} has no files`);
    return fetchText(file.raw_url);
  }
  const blob = GITHUB_FILE.exec(page);
  return fetchText(blob ? `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}` : url.href);
}
async function fetchText(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error(`Couldn't fetch ${url}: no network, or its server doesn't allow other sites to read it (CORS)`);
  }
  if (!res.ok)
    throw new Error(`Couldn't fetch ${url}: ${res.status} ${res.statusText}`.trim());
  return res.text();
}
async function loadReplay(ref, follow) {
  if (!follow)
    return new ReplayFeed(parseRecord(await fetchLinkedRecord(ref)), new URL(ref.trim(), location.href).href, false);
  const url = new URL(ref, location.href).href;
  return new ReplayFeed(await fetchRecord(url), url, true);
}
export {
  replayFromJson,
  pinnedLink,
  parseRecord,
  loadReplay,
  knownToMatch,
  fetchLinkedRecord,
  clock,
  ReplayFeed,
  BUILD_TAG,
  BUILD_SIM
};

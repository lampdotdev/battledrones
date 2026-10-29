// Lamp builds this from src/ before every build and look: change src/, never this folder.
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/sim/balance.ts
var TICK_RATE = 10;
var UNITS = {
  harvester: {
    name: "Harvester",
    role: "Mines scrap and crystal. Keep it safe.",
    cost: 150,
    hp: 250,
    speed: 1.6,
    sight: 4,
    domain: "ground",
    armor: "medium",
    targets: "none",
    dps: 0,
    range: 0,
    buildTime: 10,
    builtAt: "hq",
    radius: 0.45
  },
  scout: {
    name: "Scout",
    role: "Fast flying eyes. Unarmed.",
    cost: 75,
    hp: 60,
    speed: 4.8,
    sight: 9,
    domain: "air",
    armor: "light",
    targets: "none",
    dps: 0,
    range: 0,
    buildTime: 4,
    builtAt: "airpad",
    radius: 0.3
  },
  stinger: {
    name: "Stinger",
    role: "Fast light tank. Beats Flak and Mortars. Can't hit air.",
    cost: 150,
    hp: 255,
    speed: 2.3,
    sight: 5,
    domain: "ground",
    armor: "medium",
    targets: "ground",
    dps: 22,
    range: 3.2,
    shotInterval: 0.6,
    dmgType: "kinetic",
    fx: "cannon",
    buildTime: 7,
    builtAt: "fab-plant",
    turret: true,
    radius: 0.38
  },
  "flak-crawler": {
    name: "Flak Crawler",
    role: "Anti-air. Shreds drones. Helpless vs ground.",
    cost: 190,
    hp: 285,
    speed: 1.9,
    sight: 6,
    domain: "ground",
    armor: "medium",
    targets: "air",
    dps: 31,
    range: 5,
    shotInterval: 0.3,
    dmgType: "flak",
    fx: "flak",
    buildTime: 8,
    builtAt: "fab-plant",
    turret: true,
    radius: 0.4
  },
  mortar: {
    name: "Mortar",
    role: "Long-range splash artillery. Razes bases. Fragile up close.",
    cost: 275,
    hp: 195,
    speed: 1.5,
    sight: 6,
    domain: "ground",
    armor: "light",
    targets: "ground",
    dps: 18,
    range: 8,
    minRange: 2.5,
    shotInterval: 3,
    splash: 1.1,
    projectileSpeed: 5.5,
    dmgType: "explosive",
    fx: "shell",
    buildTime: 10,
    builtAt: "fab-plant",
    requires: "tech-lab",
    turret: true,
    radius: 0.42
  },
  mastodon: {
    name: "Mastodon",
    role: "Super-heavy tank. Crushes light armies. Can't hit air.",
    cost: 475,
    hp: 1050,
    speed: 1.2,
    sight: 6,
    domain: "ground",
    armor: "heavy",
    targets: "ground",
    dps: 46,
    range: 4,
    shotInterval: 1.2,
    dmgType: "cannon",
    fx: "heavy-cannon",
    buildTime: 15,
    builtAt: "fab-plant",
    requires: "tech-lab",
    turret: true,
    radius: 0.55
  },
  lancer: {
    name: "Lancer",
    role: "Hover laser tank. Burns through armour, hits air too. Crosses water.",
    cost: 275,
    hp: 405,
    speed: 2.5,
    sight: 6,
    domain: "ground",
    armor: "medium",
    hover: true,
    targets: "both",
    dps: 28,
    range: 4.5,
    shotInterval: 0.8,
    dmgType: "laser",
    fx: "laser",
    airMult: 0.65,
    buildTime: 11,
    builtAt: "fab-plant",
    requires: "tech-lab",
    turret: true,
    radius: 0.42
  },
  wasp: {
    name: "Wasp",
    role: "Strike drone. Rockets ground targets. Dies to Flak.",
    cost: 200,
    hp: 205,
    speed: 3.6,
    sight: 6,
    domain: "air",
    armor: "light",
    targets: "ground",
    dps: 28,
    range: 3,
    shotInterval: 1,
    dmgType: "missile",
    fx: "rockets",
    buildTime: 8,
    builtAt: "airpad",
    radius: 0.35
  },
  raptor: {
    name: "Raptor",
    role: "Interceptor. Hunts air units. Can't hit ground.",
    cost: 250,
    hp: 265,
    speed: 4.1,
    sight: 7,
    domain: "air",
    armor: "medium",
    targets: "air",
    dps: 32,
    range: 4,
    shotInterval: 0.8,
    dmgType: "missile",
    fx: "missile",
    buildTime: 9,
    builtAt: "airpad",
    radius: 0.38
  },
  hornet: {
    name: "Hornet",
    role: "Heavy bomber. Carpet-bombs ground and bases. Needs escort.",
    cost: 375,
    hp: 505,
    speed: 2.1,
    sight: 6,
    domain: "air",
    armor: "heavy",
    targets: "ground",
    dps: 36,
    range: 1.6,
    shotInterval: 2,
    splash: 1.1,
    projectileSpeed: 5,
    dmgType: "explosive",
    fx: "bomb",
    buildTime: 14,
    builtAt: "airpad",
    requires: "tech-lab",
    radius: 0.5
  },
  mender: {
    name: "Mender",
    role: "Repair drone. Heals nearby units and buildings.",
    cost: 150,
    hp: 180,
    speed: 3.2,
    sight: 6,
    domain: "air",
    armor: "light",
    targets: "none",
    dps: 0,
    range: 3,
    heal: 10,
    buildTime: 7,
    builtAt: "airpad",
    radius: 0.32
  },
  trooper: {
    name: "Trooper Squad",
    role: "Cheap rifle bots. Hit ground and air. Take cover in woods.",
    cost: 100,
    hp: 190,
    speed: 1.8,
    sight: 5,
    domain: "ground",
    armor: "infantry",
    targets: "both",
    dps: 15,
    range: 3,
    shotInterval: 0.4,
    dmgType: "kinetic",
    fx: "rifle",
    airMult: 0.5,
    buildTime: 6,
    builtAt: "assembly-bay",
    radius: 0.4,
    squad: 5
  },
  "rocket-squad": {
    name: "Rocket Squad",
    role: "Anti-armour rockets. Kill Mastodons and Hornets. Weak vs infantry.",
    cost: 175,
    hp: 210,
    speed: 1.6,
    sight: 6,
    domain: "ground",
    armor: "infantry",
    targets: "both",
    dps: 26,
    range: 4,
    shotInterval: 1.5,
    dmgType: "cannon",
    fx: "rockets",
    airMult: 1.5,
    buildTime: 9,
    builtAt: "assembly-bay",
    radius: 0.4,
    squad: 3
  },
  sniper: {
    name: "Sniper Team",
    role: "Long-range marksmen. Delete infantry. Useless vs vehicles.",
    cost: 200,
    hp: 120,
    speed: 1.7,
    sight: 8,
    domain: "ground",
    armor: "infantry",
    targets: "ground",
    dps: 20,
    range: 7,
    shotInterval: 2.5,
    dmgType: "precision",
    fx: "snipe",
    buildTime: 10,
    builtAt: "assembly-bay",
    requires: "tech-lab",
    radius: 0.35,
    squad: 2
  },
  condor: {
    name: "Condor",
    role: "Dropship. Carries two infantry squads over anything. Unarmed.",
    cost: 200,
    hp: 400,
    speed: 3.6,
    sight: 6,
    domain: "air",
    armor: "medium",
    targets: "none",
    dps: 0,
    range: 0,
    buildTime: 9,
    builtAt: "airpad",
    radius: 0.5,
    capacity: 2
  },
  goliath: {
    name: "Goliath",
    role: "Giant walking mech and mobile base. Anchor it to build, train and unload anywhere.",
    cost: 1600,
    hp: 3000,
    speed: 1,
    sight: 10,
    domain: "ground",
    armor: "heavy",
    targets: "both",
    dps: 125,
    range: 8,
    buildTime: 60,
    builtAt: "gantry",
    radius: 1,
    alwaysVisible: true
  }
};
var BUILDINGS = {
  hq: {
    name: "HQ",
    role: "Command centre. Builds Harvesters, takes scrap. Lose it and every Goliath, lose the game.",
    cost: 0,
    hp: 3200,
    sight: 7,
    size: 3,
    buildTime: 0,
    dropOff: true,
    targets: "air",
    dps: 9,
    range: 4.5,
    shotInterval: 0.5,
    dmgType: "kinetic",
    fx: "mg"
  },
  "fab-plant": {
    name: "Fab Plant",
    role: "Builds ground vehicles.",
    cost: 300,
    hp: 1000,
    sight: 4,
    size: 2,
    buildTime: 10,
    targets: "none",
    dps: 0,
    range: 0
  },
  airpad: {
    name: "Airpad",
    role: "Builds flying drones.",
    cost: 350,
    hp: 850,
    sight: 4,
    size: 2,
    buildTime: 12,
    targets: "none",
    dps: 0,
    range: 0
  },
  "tech-lab": {
    name: "Tech Lab",
    role: "Unlocks Mortar, Mastodon, Lancer, Hornet and Sniper.",
    cost: 450,
    hp: 800,
    sight: 4,
    size: 2,
    buildTime: 20,
    requires: ["fab-plant", "airpad", "assembly-bay"],
    targets: "none",
    dps: 0,
    range: 0
  },
  depot: {
    name: "Depot",
    role: "Forward scrap drop-off. Build it near distant fields.",
    cost: 250,
    hp: 800,
    sight: 4,
    size: 2,
    buildTime: 10,
    dropOff: true,
    targets: "none",
    dps: 0,
    range: 0
  },
  turret: {
    name: "Turret",
    role: "Autocannon defence. Hits ground and air.",
    cost: 225,
    hp: 650,
    sight: 6,
    size: 1,
    buildTime: 8,
    targets: "both",
    dps: 26,
    range: 4.5,
    shotInterval: 0.5,
    dmgType: "kinetic",
    fx: "cannon"
  },
  "sam-site": {
    name: "SAM Site",
    role: "Long-range anti-air missiles.",
    cost: 275,
    hp: 560,
    sight: 7,
    size: 1,
    buildTime: 9,
    targets: "air",
    dps: 32,
    range: 6.5,
    shotInterval: 1.2,
    dmgType: "missile",
    fx: "missile"
  },
  radar: {
    name: "Radar",
    role: "Reveals a wide area through the fog.",
    cost: 200,
    hp: 450,
    sight: 13,
    size: 1,
    buildTime: 8,
    targets: "none",
    dps: 0,
    range: 0
  },
  "assembly-bay": {
    name: "Assembly Bay",
    role: "Builds robot infantry.",
    cost: 250,
    hp: 700,
    sight: 4,
    size: 2,
    buildTime: 15,
    targets: "none",
    dps: 0,
    range: 0
  },
  gantry: {
    name: "Gantry",
    role: "Builds the Goliath. One per side, and the enemy can always see it.",
    cost: 600,
    hp: 1200,
    sight: 5,
    size: 3,
    buildTime: 25,
    requiresAll: ["fab-plant", "airpad", "tech-lab", "assembly-bay"],
    unique: true,
    alwaysVisible: true,
    targets: "none",
    dps: 0,
    range: 0
  }
};
var DAMAGE_VS = {
  kinetic: { light: 1, medium: 1, heavy: 0.6, structure: 0.65, infantry: 1 },
  cannon: { light: 0.8, medium: 1, heavy: 1.3, structure: 1, infantry: 0.4 },
  flak: { light: 1.25, medium: 1, heavy: 1.15, structure: 0.5, infantry: 1.25 },
  missile: { light: 1.15, medium: 1, heavy: 0.9, structure: 0.6, infantry: 0.7 },
  explosive: { light: 1.2, medium: 0.9, heavy: 0.85, structure: 1.35, infantry: 1.3 },
  laser: { light: 1, medium: 1, heavy: 1.55, structure: 0.8, infantry: 0.7 },
  precision: { light: 0.6, medium: 0.4, heavy: 0.25, structure: 0.15, infantry: 3 }
};
var TERRAIN = {
  [0 /* Ground */]: { name: "Ground", ground: true, hover: true, speed: 1, hoverSpeed: 1, footSpeed: 1, buildable: true, cover: 1 },
  [1 /* Rock */]: { name: "Rock", ground: false, hover: false, speed: 0, hoverSpeed: 0, footSpeed: 0, buildable: false, cover: 1 },
  [2 /* Scrap */]: { name: "Scrap field", ground: true, hover: true, speed: 0.85, hoverSpeed: 1, footSpeed: 0.85, buildable: false, cover: 1 },
  [3 /* Water */]: { name: "Water", ground: false, hover: true, speed: 0, hoverSpeed: 1, footSpeed: 0, buildable: false, cover: 1 },
  [4 /* Road */]: { name: "Road", ground: true, hover: true, speed: 1.35, hoverSpeed: 1.15, footSpeed: 1.35, buildable: true, cover: 1 },
  [5 /* Rough */]: { name: "Rough ground", ground: true, hover: true, speed: 0.6, hoverSpeed: 1, footSpeed: 1, buildable: false, cover: 1 },
  [6 /* Forest */]: { name: "Woods", ground: true, hover: true, speed: 0.55, hoverSpeed: 0.6, footSpeed: 1, buildable: false, cover: 0.7 },
  [7 /* Crystal */]: { name: "Crystal field", ground: true, hover: true, speed: 0.85, hoverSpeed: 1, footSpeed: 0.85, buildable: false, cover: 1 },
  [8 /* Bridge */]: { name: "Bridge", ground: true, hover: true, speed: 1.35, hoverSpeed: 1.15, footSpeed: 1.35, buildable: false, cover: 1 },
  [9 /* Shallows */]: { name: "Shallows", ground: true, hover: true, speed: 0.5, hoverSpeed: 1, footSpeed: 0.8, buildable: false, cover: 1 },
  [10 /* Deep */]: { name: "Open sea", ground: false, hover: false, speed: 0, hoverSpeed: 0, footSpeed: 0, buildable: false, cover: 1 }
};
var LIFELINE = {
  delay: 45,
  squadUnder: 2,
  edgeInset: 1.5
};
var ECONOMY = {
  startingScrap: 600,
  harvesterCapacity: 100,
  harvestRate: 21,
  unloadRate: 140,
  scrapPerTile: 1500,
  crystalPerTile: 1200,
  crystalValue: 1.6,
  buildRadius: 6,
  sellRefund: 0.5,
  hqTrickle: 2,
  maxQueue: 6
};
var COMBAT = {
  shotInterval: 0.5,
  acquireBonus: 1.5,
  retaliateRange: 9,
  assistRadius: 5,
  healerPriority: 2.5,
  rankXp: [1, 2.5, 5],
  rankDamage: 0.15,
  eliteRegen: 0.01
};
var INFANTRY = {
  woodsCover: 0.5,
  concealRadius: 3,
  concealAfterShot: 2,
  crushDps: 30,
  crushReach: 0.15,
  captureWeight: 2,
  boardTime: 1,
  boardRange: 1.2,
  unloadHover: 1.5,
  dropSearch: 6,
  dropClear: 0.4,
  dropBackOff: 1.5,
  bailoutHp: 0.5
};
var FOG = {
  intervalTicks: 3
};
var shotDamage = (s) => s.dps * (s.shotInterval ?? COMBAT.shotInterval);
var SALVAGE = {
  share: 0.3,
  ttl: 60,
  hot: 2.5,
  pickupRadius: 0.9,
  shiftRadius: 2,
  maxWrecks: 60
};
var POWERS = {
  meterMax: 100,
  passive: 0.035,
  perScrapLost: 0.008,
  perScrapKilled: 0.002,
  barrage: {
    cost: 60,
    cooldown: 45,
    telegraph: 2.5,
    shells: 3,
    shellGap: 0.3,
    scatter: 0.9,
    damage: 170,
    splash: 2,
    radius: 2.9
  },
  emp: {
    cost: 40,
    cooldown: 40,
    telegraph: 0.8,
    radius: 3,
    stun: 4
  },
  droppod: {
    cost: 70,
    cooldown: 60,
    telegraph: 2,
    radius: 1.2,
    damage: 60,
    units: ["stinger", "stinger", "flak-crawler"],
    techUnits: ["lancer", "lancer", "flak-crawler"]
  },
  hammer: {
    unlock: 6 * 60,
    cooldown: 150,
    telegraph: 3,
    radius: 2.5,
    unitDamage: 260,
    buildingDamage: 700
  }
};
var OBJECTIVES = {
  uplink: {
    radius: 2.5,
    airWeight: 0.5,
    perUnit: 3.5,
    maxRate: 14,
    settle: 2,
    income: 1.5,
    sight: 7,
    charge: 0.06
  },
  drops: {
    first: 90,
    every: 75,
    warning: 10,
    ttl: 45,
    claimRadius: 0.8,
    weights: { scrap: 38, veterans: 20, repair: 15, charge: 17, unit: 10 },
    scrap: 200,
    veteranRadius: 3,
    repairRadius: 4,
    repairShare: 0.5,
    charge: 40,
    fallbackScrap: 150,
    unit: "lancer",
    unitRank: 1
  }
};
var GOLIATH = {
  costStep: 0.25,
  queueMax: 1,
  nearlyDone: 0.85,
  anchorTime: 4,
  packTime: 6,
  footprint: 2,
  buildRing: 3,
  reboot: 2.5,
  restoreMargin: 0.05,
  weapons: {
    mortars: {
      name: "Mortars",
      lostBelow: 0.75,
      targets: "ground",
      dps: 36,
      range: 8,
      minRange: 2.5,
      shotInterval: 1.5,
      splash: 0.9,
      projectileSpeed: 5.5,
      dmgType: "explosive",
      fx: "shell"
    },
    laser: {
      name: "Eye laser",
      lostBelow: 0.5,
      targets: "both",
      dps: 28,
      range: 4.5,
      shotInterval: 0.8,
      dmgType: "laser",
      fx: "laser",
      airMult: 0.65
    },
    cannons: {
      name: "Arm cannons",
      lostBelow: 0.25,
      targets: "ground",
      dps: 46,
      range: 4,
      shotInterval: 0.6,
      dmgType: "cannon",
      fx: "heavy-cannon"
    },
    mg: {
      name: "Machine guns",
      lostBelow: 0,
      targets: "both",
      dps: 15,
      range: 3,
      shotInterval: 0.4,
      dmgType: "kinetic",
      fx: "mg",
      airMult: 0.5
    }
  },
  lift: {
    speedMult: 0.5,
    dropDamage: 0.25,
    span: 1.1,
    hookRange: 0.3,
    setDownSearch: 6
  },
  salvage: { share: 0.3, piles: [6, 8], spread: 2.5 },
  gantrySalvage: { share: 0.3, piles: 4, spread: 2.5 },
  pileTtl: 90,
  love: { range: 5 },
  armada: { gap: 2.2 }
};

// src/sim/sides.ts
var FACTIONS = ["blue", "red", "green", "purple"];
var DUO = ["blue", "red"];
var isFaction = (s) => typeof s === "string" && FACTIONS.includes(s);
var sidesOf = (w) => w.sides ?? DUO;
var isMulti = (w) => (w.sides?.length ?? 2) > 2;
function perSide(make) {
  return { blue: make("blue"), red: make("red"), green: make("green"), purple: make("purple") };
}
var rivalsOf = (w, f) => sidesOf(w).filter((s) => s !== f);
var otherSide = (f) => f === "blue" ? "red" : "blue";
var QUARTER = { blue: 0, green: 1, red: 2, purple: 3 };
function turnVec(q, dx, dy) {
  switch (q & 3) {
    case 1:
      return [-dy, dx];
    case 2:
      return [-dx, -dy];
    case 3:
      return [dy, -dx];
    default:
      return [dx, dy];
  }
}
function turnPoint(q, width, height, x, y) {
  switch (q & 3) {
    case 1:
      return { x: height - y, y: x };
    case 2:
      return { x: width - x, y: height - y };
    case 3:
      return { x: y, y: width - x };
    default:
      return { x, y };
  }
}
function turnTile(q, width, height, tx, ty, size = 1) {
  switch (q & 3) {
    case 1:
      return [height - ty - size, tx];
    case 2:
      return [width - tx - size, height - ty - size];
    case 3:
      return [ty, width - tx - size];
    default:
      return [tx, ty];
  }
}
var symmetryTurns = (w) => isMulti(w) ? [0, 1, 2, 3] : [0, 2];

// src/sim/rules.ts
var DEFAULT_RULES = Object.freeze({
  startScrap: ECONOMY.startingScrap,
  incomeMult: 1,
  buildSpeed: 1,
  dmgMult: 1,
  bannedUnits: [],
  bannedBuildings: [],
  fogOff: false,
  startRank: 0,
  startUnits: [],
  mutators: []
});
var GROUND_COMBAT = ["stinger", "flak-crawler", "mortar", "mastodon", "lancer", "trooper", "rocket-squad", "sniper", "goliath"];
var NO_GROUND_COMBAT = [...GROUND_COMBAT, "condor"];
var INFANTRY_SQUADS = ["trooper", "rocket-squad", "sniper"];
var NO_VEHICLES = [
  ...GROUND_COMBAT.filter((k) => !INFANTRY_SQUADS.includes(k)),
  "wasp",
  "raptor",
  "hornet"
];
var MUTATORS = {
  blitz: {
    id: "blitz",
    name: "Blitz",
    icon: "⚡",
    desc: "Both sides start with 3,000 scrap",
    apply: (r) => r.startScrap = 3000
  },
  goldrush: {
    id: "goldrush",
    name: "Gold Rush",
    icon: "\uD83D\uDCB0",
    desc: "Harvesting and HQ income ×1.5",
    apply: (r) => r.incomeMult *= 1.5
  },
  glass: {
    id: "glass",
    name: "Glass Cannons",
    icon: "\uD83D\uDCA5",
    desc: "Every weapon deals double damage",
    apply: (r) => r.dmgMult *= 2
  },
  rapidfab: {
    id: "rapidfab",
    name: "Rapid Fab",
    icon: "\uD83D\uDD27",
    desc: "Units and buildings build in half the time",
    apply: (r) => r.buildSpeed *= 2
  },
  airwar: {
    id: "airwar",
    name: "Air War",
    icon: "✈️",
    desc: "No ground combat units, Condors, Fab Plants, Assembly Bays or SAM sites: dogfights decide it",
    bansUnits: NO_GROUND_COMBAT,
    conflicts: ["infantrywar", "airborne", "nomads", "robotlove", "armada"],
    bansBuildings: ["fab-plant", "assembly-bay", "sam-site"],
    apply: (r) => {
      r.bannedUnits.push(...NO_GROUND_COMBAT);
      r.bannedBuildings.push("fab-plant", "assembly-bay", "sam-site");
    }
  },
  infantrywar: {
    id: "infantrywar",
    name: "Infantry War",
    icon: "\uD83E\uDD16",
    desc: "Robot infantry only: no combat vehicles, combat aircraft or Fab Plants",
    bansUnits: NO_VEHICLES,
    bansBuildings: ["fab-plant"],
    conflicts: ["airwar", "nomads", "robotlove", "armada"],
    apply: (r) => {
      r.bannedUnits.push(...NO_VEHICLES);
      r.bannedBuildings.push("fab-plant");
    }
  },
  airborne: {
    id: "airborne",
    name: "Airborne",
    icon: "\uD83E\uDE82",
    desc: "Both sides start with a Condor dropship and one of each infantry squad",
    conflicts: ["airwar", "armada"],
    apply: (r) => {
      for (const k of ["condor", "rocket-squad", "sniper"])
        if (!r.startUnits.includes(k))
          r.startUnits.push(k);
    }
  },
  veterans: {
    id: "veterans",
    name: "Veterans",
    icon: "\uD83C\uDF96️",
    desc: "Combat units roll out at rank 1 (+15% damage)",
    apply: (r) => r.startRank = Math.max(r.startRank, 1)
  },
  clearskies: {
    id: "clearskies",
    name: "Clear Skies",
    icon: "☀️",
    desc: "No fog of war: both sides see everything",
    apply: (r) => r.fogOff = true
  },
  nomads: {
    id: "nomads",
    name: "Nomads",
    icon: "\uD83E\uDDBF",
    desc: "Each side starts with a Goliath instead of a base",
    conflicts: ["airwar", "infantrywar", "armada"],
    apply: (r) => r.nomads = true
  },
  robotlove: {
    id: "robotlove",
    name: "Robot Love",
    icon: "\uD83D\uDC98",
    desc: "Two enemy Goliaths that meet fall in love, and the battle ends in a draw",
    conflicts: ["airwar", "infantrywar"],
    apply: (r) => r.robotLove = true
  },
  armada: {
    id: "armada",
    name: "Goliath Armada",
    icon: "\uD83D\uDE81",
    desc: "Each side starts with four Goliaths in the air, two Condors carrying each, and nothing else",
    conflicts: ["airwar", "infantrywar", "airborne", "nomads"],
    apply: (r) => r.armada = true
  }
};
var MUTATOR_IDS = Object.keys(MUTATORS);
var isMutatorId = (s) => typeof s === "string" && (s in MUTATORS);
function mutatorsCompatible(ids) {
  for (const a of ids)
    for (const b of ids)
      if (a !== b && MUTATORS[a].conflicts?.includes(b))
        return false;
  return true;
}
function toggleMutator(on, id) {
  const keep = on.includes(id) ? on.filter((m) => m !== id) : [...on.filter((m) => mutatorsCompatible([id, m])), id];
  return MUTATOR_IDS.filter((m) => keep.includes(m));
}
function makeRules(ids) {
  const r = { ...DEFAULT_RULES, bannedUnits: [], bannedBuildings: [], startUnits: [], mutators: [] };
  for (const id of MUTATOR_IDS)
    if (ids.includes(id) && !r.mutators.some((m) => MUTATORS[m].conflicts?.includes(id))) {
      MUTATORS[id].apply(r);
      r.mutators.push(id);
    }
  return r;
}
function applyMutators(w, ids) {
  const r = makeRules(ids.filter(isMutatorId));
  if (r.mutators.length === 0)
    return;
  w.rules = r;
  for (const f of Object.values(w.factions))
    f.scrap = r.startScrap;
}
var rulesOf = (w) => w.rules ?? DEFAULT_RULES;
var goliathBase = (w) => !!(rulesOf(w).nomads || rulesOf(w).armada);
var isMutated = (w) => rulesOf(w).mutators.length > 0;
var incomeOf = (w, f) => {
  const r = rulesOf(w);
  return w.factions[f].incomeMult * r.incomeMult * (r.sideIncome?.[f] ?? 1);
};
function bannedBy(w, kind, faction) {
  const r = rulesOf(w);
  const isUnit = kind in UNITS;
  const inList = (units, buildings) => isUnit ? !!units?.includes(kind) : !!buildings?.includes(kind);
  const side = faction ? r.sideBans?.[faction] : undefined;
  if (!inList(r.bannedUnits, r.bannedBuildings) && !inList(side?.units, side?.buildings))
    return null;
  const by = r.mutators.find((id) => inList(MUTATORS[id].bansUnits, MUTATORS[id].bansBuildings));
  return by ? `Disabled: ${MUTATORS[by].name}` : r.banLabel ?? "Disabled: match rules";
}
function applySpawnRank(w, u) {
  const rank = Math.min(COMBAT.rankXp.length, rulesOf(w).startRank);
  if (rank <= 0 || UNITS[u.kind].dps <= 0 || u.rank >= rank)
    return;
  u.rank = rank;
  u.xp = Math.max(u.xp, COMBAT.rankXp[rank - 1] * UNITS[u.kind].cost);
}
function infantryArmy(w, f) {
  return bannedBy(w, "fab-plant", f) !== null && bannedBy(w, "wasp", f) !== null && bannedBy(w, "assembly-bay", f) === null;
}
function strategyFits(s, r) {
  if (s.airOnly && (r.bannedBuildings.includes("airpad") || r.bannedUnits.includes("wasp")))
    return false;
  if (s.heavy && r.bannedBuildings.includes("fab-plant"))
    return false;
  if (s.groundRaids && r.bannedBuildings.includes("fab-plant") && r.bannedBuildings.includes("assembly-bay"))
    return false;
  return true;
}

// src/sim/fmath.ts
function hypot(x, y) {
  return Math.sqrt(x * x + y * y);
}
var PIO2_1 = 1.5707963267341256;
var PIO2_2 = 0.00000000006077100506303966;
var PIO2_3 = 0.0000000000000000000020222662487111665;
var INV_PIO2 = 0.6366197723675814;
var S1 = -0.16666666666666632;
var S2 = 0.00833333333332249;
var S3 = -0.0001984126982985795;
var S4 = 0.0000027557313707070068;
var S5 = -0.000000025050760253406863;
var S6 = 0.000000000158969099521155;
var C1 = 0.0416666666666666;
var C2 = -0.001388888888887411;
var C3 = 0.00002480158728947673;
var C4 = -0.00000027557314351390663;
var C5 = 0.000000002087572321298175;
var C6 = -0.000000000011359647557788195;
function kSin(x) {
  const z = x * x;
  const r = S2 + z * (S3 + z * (S4 + z * (S5 + z * S6)));
  return x + z * x * (S1 + z * r);
}
function kCos(x) {
  const z = x * x;
  const r = z * (C1 + z * (C2 + z * (C3 + z * (C4 + z * (C5 + z * C6)))));
  const hz = 0.5 * z;
  const w = 1 - hz;
  return w + (1 - w - hz + z * r);
}
function reduce(x) {
  const n = Math.floor(x * INV_PIO2 + 0.5);
  const y = x - n * PIO2_1 - n * PIO2_2 - n * PIO2_3;
  return [n % 4, y];
}
function sin(x) {
  if (!Number.isFinite(x))
    return NaN;
  const a = Math.abs(x);
  if (a < 0.000000001)
    return x;
  const [q, y] = reduce(a);
  const s = q === 0 ? kSin(y) : q === 1 ? kCos(y) : q === 2 ? -kSin(y) : -kCos(y);
  return x < 0 ? -s : s;
}
function cos(x) {
  if (!Number.isFinite(x))
    return NaN;
  const a = Math.abs(x);
  if (a < 0.000000001)
    return 1;
  const [q, y] = reduce(a);
  return q === 0 ? kCos(y) : q === 1 ? -kSin(y) : q === 2 ? -kCos(y) : kSin(y);
}
var ATAN_HI = [0.4636476090008061, 0.7853981633974483, 0.982793723247329, 1.5707963267948966];
var ATAN_LO = [0.000000000000000022698777452961687, 0.00000000000000003061616997868383, 0.000000000000000013903311031230998, 0.00000000000000006123233995736766];
var AT = [
  0.3333333333333293,
  -0.19999999999876483,
  0.14285714272503466,
  -0.11111110405462356,
  0.09090887133436507,
  -0.0769187620504483,
  0.06661073137387531,
  -0.058335701337905735,
  0.049768779946159324,
  -0.036531572744216916,
  0.016285820115365782
];
var PI = 3.141592653589793;
var PI_LO = 0.00000000000000012246467991473532;
function atanPos(x) {
  if (x >= 73786976294838210000)
    return ATAN_HI[3] + ATAN_LO[3];
  let id;
  if (x < 0.4375)
    id = -1;
  else if (x < 0.6875) {
    id = 0;
    x = (2 * x - 1) / (2 + x);
  } else if (x < 1.1875) {
    id = 1;
    x = (x - 1) / (x + 1);
  } else if (x < 2.4375) {
    id = 2;
    x = (x - 1.5) / (1 + 1.5 * x);
  } else {
    id = 3;
    x = -1 / x;
  }
  const z = x * x;
  const w = z * z;
  const s1 = z * (AT[0] + w * (AT[2] + w * (AT[4] + w * (AT[6] + w * (AT[8] + w * AT[10])))));
  const s2 = w * (AT[1] + w * (AT[3] + w * (AT[5] + w * (AT[7] + w * AT[9]))));
  if (id < 0)
    return x - x * (s1 + s2);
  return ATAN_HI[id] - (x * (s1 + s2) - ATAN_LO[id] - x);
}
function atan2(y, x) {
  if (Number.isNaN(x) || Number.isNaN(y))
    return NaN;
  if (y === 0)
    return x > 0 || Object.is(x, 0) ? y : Object.is(y, -0) ? -PI : PI;
  if (x === 0)
    return y > 0 ? PI / 2 : -PI / 2;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    if (Number.isFinite(y))
      return x > 0 ? y > 0 ? 0 : -0 : y > 0 ? PI : -PI;
    const q = !Number.isFinite(x) ? x > 0 ? PI / 4 : 3 * PI / 4 : PI / 2;
    return y > 0 ? q : -q;
  }
  const r = Math.abs(y / x);
  const z = r > 1152921504606847000 ? PI / 2 + 0.5 * PI_LO : x < 0 && r < 0.0000000000000000008673617379884035 ? 0 : atanPos(r);
  if (x > 0)
    return y > 0 ? z : -z;
  return y > 0 ? PI - (z - PI_LO) : z - PI_LO - PI;
}
var LN2_HI = 0.6931471803691238;
var LN2_LO = 0.00000000019082149292705877;
var LG = [0.6666666666666735, 0.3999999999940942, 0.2857142874366239, 0.22222198432149784, 0.1818357216161805, 0.15313837699209373, 0.14798198605116586];
var SQRT2 = 1.4142135623730951;
function log(x) {
  let k = 0;
  while (x >= SQRT2) {
    x *= 0.5;
    k++;
  }
  while (x < SQRT2 / 2) {
    x *= 2;
    k--;
  }
  const f = x - 1;
  const s = f / (2 + f);
  const z = s * s;
  const w = z * z;
  const t1 = w * (LG[1] + w * (LG[3] + w * LG[5]));
  const t2 = z * (LG[0] + w * (LG[2] + w * (LG[4] + w * LG[6])));
  const R = t2 + t1;
  const hfsq = 0.5 * f * f;
  return k * LN2_HI - (hfsq - (s * (hfsq + R) + k * LN2_LO) - f);
}
var P = [0.16666666666666602, -0.0027777777777015593, 0.00006613756321437934, -0.0000016533902205465252, 0.000000041381367970572385];
var INV_LN2 = 1.4426950408889634;
function exp(x) {
  if (x > 709.78)
    return Infinity;
  if (x < -745.14)
    return 0;
  const k = Math.floor(x * INV_LN2 + 0.5);
  const hi = x - k * LN2_HI;
  const lo = k * LN2_LO;
  const r = hi - lo;
  const t = r * r;
  const c = r - t * (P[0] + t * (P[1] + t * (P[2] + t * (P[3] + t * P[4]))));
  let y = 1 - (lo - r * c / (2 - c) - hi);
  for (let i = 0;i < k; i++)
    y *= 2;
  for (let i = 0;i > k; i--)
    y *= 0.5;
  return y;
}
function pow(x, y) {
  if (Number.isInteger(y) && Math.abs(y) <= 64) {
    let r = 1;
    let b = y < 0 ? 1 / x : x;
    for (let n = Math.abs(y);n > 0; n >>= 1) {
      if (n & 1)
        r *= b;
      b *= b;
    }
    return r;
  }
  if (!(x >= 0) || Number.isNaN(y))
    return NaN;
  if (x === 0)
    return y > 0 ? 0 : Infinity;
  if (x === 1)
    return 1;
  if (!Number.isFinite(x))
    return y > 0 ? Infinity : 0;
  return exp(y * log(x));
}

// src/sim/world.ts
var newFaction = () => ({
  scrap: ECONOMY.startingScrap,
  pending: null,
  stats: { unitsBuilt: 0, unitsLost: 0, unitsKilled: 0, buildingsLost: 0, buildingsKilled: 0, scrapHarvested: 0, scrapSalvaged: 0 },
  incomeMult: 1
});
function createWorld(width, height) {
  return {
    tick: 0,
    width,
    height,
    terrain: new Uint8Array(width * height),
    scrap: new Uint16Array(width * height),
    occupancy: new Int32Array(width * height),
    nextId: 1,
    units: new Map,
    buildings: new Map,
    projectiles: [],
    wrecks: [],
    powers: createPowerState(),
    objectives: createObjectiveState(),
    factions: perSide(newFaction),
    winner: null,
    fx: [],
    fog: createFog(width, height),
    mapId: "custom",
    biome: "temperate",
    seed: 1
  };
}
var tileIndex = (w, tx, ty) => ty * w.width + tx;
var inBounds = (w, tx, ty) => tx >= 0 && ty >= 0 && tx < w.width && ty < w.height;
function terrainAt(w, tx, ty) {
  if (!inBounds(w, tx, ty))
    return 1 /* Rock */;
  return w.terrain[tileIndex(w, tx, ty)];
}
function setTerrain(w, tx, ty, t) {
  const i = tileIndex(w, tx, ty);
  if (w.terrain[i] !== t)
    regionCache.delete(w);
  w.terrain[i] = t;
  w.scrap[i] = t === 2 /* Scrap */ ? ECONOMY.scrapPerTile : t === 7 /* Crystal */ ? ECONOMY.crystalPerTile : 0;
}
function isResource(w, i) {
  const t = w.terrain[i];
  return (t === 2 /* Scrap */ || t === 7 /* Crystal */) && w.scrap[i] > 0;
}
function buildingAtTile(w, tx, ty) {
  if (!inBounds(w, tx, ty))
    return null;
  const id = w.occupancy[tileIndex(w, tx, ty)];
  return id ? w.buildings.get(id) ?? null : null;
}
var moveClassOf = (kind) => UNITS[kind].domain === "air" ? "air" : UNITS[kind].hover ? "hover" : UNITS[kind].squad ? "foot" : "ground";
function passable(w, tx, ty, mc) {
  if (!inBounds(w, tx, ty))
    return false;
  if (mc === "air")
    return true;
  const i = tileIndex(w, tx, ty);
  const info = TERRAIN[w.terrain[i]];
  if (!(mc === "hover" ? info.hover : mc === "foot" ? info.footSpeed > 0 : info.ground))
    return false;
  return w.occupancy[i] === 0;
}
var regionCache = new WeakMap;
var standsOn = (info, mc) => mc === "hover" ? info.hover : mc === "foot" ? info.footSpeed > 0 : info.ground;
function regionLabels(w, mc) {
  let byClass = regionCache.get(w);
  if (!byClass)
    regionCache.set(w, byClass = {});
  const have = byClass[mc];
  if (have)
    return have;
  const W = w.width;
  const n = W * w.height;
  const labels = new Int32Array(n);
  const stack = [];
  let next = 0;
  for (let start = 0;start < n; start++) {
    if (labels[start] || !standsOn(TERRAIN[w.terrain[start]], mc))
      continue;
    const id = ++next;
    labels[start] = id;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop();
      const x = i % W;
      for (const j of [i - W, i + W, x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1]) {
        if (j < 0 || j >= n || labels[j] || !standsOn(TERRAIN[w.terrain[j]], mc))
          continue;
        labels[j] = id;
        stack.push(j);
      }
    }
  }
  byClass[mc] = labels;
  return labels;
}
function regionAt(w, tx, ty, mc) {
  if (!inBounds(w, tx, ty))
    return 0;
  if (mc === "air")
    return 1;
  return regionLabels(w, mc)[tileIndex(w, tx, ty)];
}
var REACH_SLACK = 0.35;
function canGetWithin(w, mc, fx, fy, x, y, range, dist = (px, py) => hypot(px - x, py - y), span = 0) {
  if (mc === "air")
    return true;
  const reg = regionAt(w, Math.floor(fx), Math.floor(fy), mc);
  if (!reg)
    return true;
  if (regionAt(w, Math.floor(x), Math.floor(y), mc) === reg)
    return true;
  const labels = regionLabels(w, mc);
  const R = Math.ceil(range + span);
  const x0 = Math.max(0, Math.floor(x - R));
  const x1 = Math.min(w.width - 1, Math.floor(x + R));
  const y0 = Math.max(0, Math.floor(y - R));
  const y1 = Math.min(w.height - 1, Math.floor(y + R));
  for (let ty = y0;ty <= y1; ty++)
    for (let tx = x0;tx <= x1; tx++)
      if (labels[ty * w.width + tx] === reg && dist(tx + 0.5, ty + 0.5) <= range - REACH_SLACK)
        return true;
  return false;
}
function onHomeLand(w, faction, tx, ty) {
  if (!w.rules?.islands)
    return true;
  const hq = hqOf(w, faction);
  const s = BUILDINGS.hq.size;
  const at = hq ? [hq.tx + (s >> 1), hq.ty + (s >> 1)] : w.rules.homeTiles?.[faction];
  if (!at)
    return true;
  const home = regionAt(w, at[0], at[1], "ground");
  return !home || regionAt(w, tx, ty, "ground") === home;
}
function terrainMult(info, mc) {
  return mc === "hover" ? info.hoverSpeed : mc === "foot" ? info.footSpeed : info.speed;
}
function groundPassable(w, tx, ty) {
  return passable(w, tx, ty, "ground");
}
function terrainSpeed(w, x, y, mc) {
  if (mc === "air")
    return 1;
  const info = TERRAIN[terrainAt(w, Math.floor(x), Math.floor(y))];
  return terrainMult(info, mc) || 1;
}
var FACE = { blue: 0, red: Math.PI, green: Math.PI / 2, purple: Math.PI * 1.5 };
function spawnUnit(w, kind, faction, x, y) {
  const unit = {
    id: w.nextId++,
    kind,
    faction,
    x,
    y,
    hp: UNITS[kind].hp,
    facing: FACE[faction],
    aim: FACE[faction],
    order: { type: "idle" },
    path: null,
    pathGoal: null,
    cargo: 0,
    cooldown: 0,
    autoTargetId: null,
    damagedTick: -1000,
    lastAttackerId: null,
    firedTick: -1000,
    xp: 0,
    rank: 0,
    kills: 0
  };
  if (UNITS[kind].capacity)
    unit.passengers = [];
  if (kind === "goliath")
    unit.goliath = newGoliathState();
  w.units.set(unit.id, unit);
  return unit;
}
function newGoliathState() {
  const weapon = () => ({ online: true, reboot: -1, cooldown: 0, targetId: null, firedTick: -1000 });
  return {
    mode: "walking",
    modeTicks: 0,
    weapons: { mortars: weapon(), laser: weapon(), cannons: weapon(), mg: weapon() },
    queue: [],
    rally: null,
    lift: null,
    foot: null
  };
}
function domainOf(u) {
  return u.goliath?.lift?.phase === "carrying" ? "air" : UNITS[u.kind].domain;
}
function spawnBuilding(w, kind, faction, tx, ty) {
  const building = {
    id: w.nextId++,
    kind,
    faction,
    tx,
    ty,
    hp: BUILDINGS[kind].hp,
    queue: [],
    rally: null,
    facing: FACE[faction],
    cooldown: 0,
    damagedTick: -1000,
    lastAttackerId: null,
    firedTick: -1000
  };
  w.buildings.set(building.id, building);
  stampOccupancy(w, building, building.id);
  return building;
}
function removeBuilding(w, b) {
  w.buildings.delete(b.id);
  stampOccupancy(w, b, 0);
  const size = BUILDINGS[b.kind].size;
  for (const u of w.units.values()) {
    const g = u.pathGoal;
    if (g && g.x >= b.tx - 2 && g.x <= b.tx + size + 2 && g.y >= b.ty - 2 && g.y <= b.ty + size + 2)
      u.path = null;
    else if (u.path && u.path.length > 4) {
      const end = u.path[u.path.length - 1];
      const dx = Math.abs(end.x - u.x);
      const dy = Math.abs(end.y - u.y);
      if (u.path.length > 1.3 * (Math.max(dx, dy) + 0.4142 * Math.min(dx, dy)) + 3)
        u.path = null;
    }
  }
}
function invalidatePathsThrough(w, b) {
  const size = BUILDINGS[b.kind].size;
  const inside = (p) => p.x >= b.tx - 1 && p.x < b.tx + size + 1 && p.y >= b.ty - 1 && p.y < b.ty + size + 1;
  for (const u of w.units.values())
    if (u.path && u.path.some(inside))
      u.path = null;
}
function stampOccupancy(w, b, id) {
  const size = BUILDINGS[b.kind].size;
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++)
      if (inBounds(w, b.tx + dx, b.ty + dy))
        w.occupancy[tileIndex(w, b.tx + dx, b.ty + dy)] = id;
}
function buildingCenter(b) {
  const size = BUILDINGS[b.kind].size;
  return { x: b.tx + size / 2, y: b.ty + size / 2 };
}
var dist = (ax, ay, bx, by) => hypot(bx - ax, by - ay);
function distToBuilding(b, x, y) {
  const size = BUILDINGS[b.kind].size;
  const dx = Math.max(b.tx - x, 0, x - (b.tx + size));
  const dy = Math.max(b.ty - y, 0, y - (b.ty + size));
  return hypot(dx, dy);
}
function hqOf(w, faction) {
  for (const b of w.buildings.values())
    if (b.kind === "hq" && b.faction === faction)
      return b;
  return null;
}
function nearestDropSite(w, faction, x, y, mc) {
  let best = null;
  let bestD = Infinity;
  const reaches = (tx, ty, size2) => !mc || canGetWithin(w, mc, x, y, tx + size2 / 2, ty + size2 / 2, DOCK_REACH, (px, py) => distToFootprint(tx, ty, size2, px, py), size2);
  for (const b of w.buildings.values()) {
    if (b.faction !== faction || !BUILDINGS[b.kind].dropOff)
      continue;
    const size2 = BUILDINGS[b.kind].size;
    if (b.outpost && !reaches(b.tx, b.ty, size2))
      continue;
    const d = distToFootprint(b.tx, b.ty, size2, x, y);
    if (d < bestD) {
      bestD = d;
      best = { id: b.id, faction, tx: b.tx, ty: b.ty, size: size2 };
    }
  }
  const size = GOLIATH.footprint;
  for (const u of w.units.values()) {
    if (u.faction !== faction || u.goliath?.mode !== "anchored" || u.goliath.lift)
      continue;
    const tx = u.goliath.foot?.tx ?? u.x - size / 2;
    const ty = u.goliath.foot?.ty ?? u.y - size / 2;
    if (!reaches(tx, ty, size))
      continue;
    const d = distToFootprint(tx, ty, size, x, y);
    if (d < bestD) {
      bestD = d;
      best = { id: u.id, faction, tx, ty, size };
    }
  }
  return best;
}
var DOCK_REACH = 1.2;
function distToFootprint(tx, ty, size, x, y) {
  const dx = Math.max(tx - x, 0, x - (tx + size));
  const dy = Math.max(ty - y, 0, y - (ty + size));
  return hypot(dx, dy);
}
function nearestDropOff(w, faction, x, y) {
  let best = null;
  let bestD = Infinity;
  for (const b of w.buildings.values()) {
    if (b.faction !== faction || !BUILDINGS[b.kind].dropOff)
      continue;
    const d = distToBuilding(b, x, y);
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  return best;
}
function hasBuilding(w, faction, kind) {
  for (const b of w.buildings.values())
    if (b.faction === faction && b.kind === kind)
      return true;
  return false;
}
var same = (p) => ({ x: p.x, y: p.y });
var IDENTITY_FRAME = { q: 0, toFrame: same, toWorld: same, tile: (fx, fy) => [fx, fy], vec: (dx, dy) => [dx, dy] };
function sideFrame(w, faction) {
  const q = faction ? QUARTER[faction] : 0;
  if (q === 0)
    return IDENTITY_FRAME;
  if (q === 2) {
    const turn = (p) => ({ x: w.width - p.x, y: w.height - p.y });
    return { q, toFrame: turn, toWorld: turn, tile: (fx, fy, size) => [w.width - fx - size, w.height - fy - size], vec: (dx, dy) => [-dx, -dy] };
  }
  const back = 4 - q;
  return {
    q,
    toFrame: (p) => turnPoint(back, w.width, w.height, p.x, p.y),
    toWorld: (p) => turnPoint(q, w.width, w.height, p.x, p.y),
    tile: (fx, fy, size) => turnTile(q, w.width, w.height, fx, fy, size),
    vec: (dx, dy) => turnVec(q, dx, dy)
  };
}
function frameTileOf(w, faction, x, y) {
  const q = faction ? QUARTER[faction] : 0;
  if (q === 0)
    return [Math.floor(x), Math.floor(y)];
  if (q === 2)
    return [w.width - 1 - Math.floor(w.width - x), w.height - 1 - Math.floor(w.height - y)];
  const f = turnPoint(4 - q, w.width, w.height, x, y);
  return turnTile(q, w.width, w.height, Math.floor(f.x), Math.floor(f.y), 1);
}

// src/sim/fog.ts
function createFog(width, height) {
  return perSide(() => ({ vis: new Uint8Array(width * height), known: new Map }));
}
var idx = (w, tx, ty) => ty * w.width + tx;
function isVisible(w, f, tx, ty) {
  return inBounds(w, tx, ty) && w.fog[f].vis[idx(w, tx, ty)] === 2 /* Visible */;
}
function isExplored(w, f, tx, ty) {
  return inBounds(w, tx, ty) && w.fog[f].vis[idx(w, tx, ty)] >= 1 /* Explored */;
}
function knownBuildings(w, f) {
  return [...w.fog[f].known.values()];
}
function stamp(w, vis, cx, cy, radius) {
  const r2 = radius * radius;
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(w.width - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(w.height - 1, Math.ceil(cy + radius));
  for (let ty = y0;ty <= y1; ty++)
    for (let tx = x0;tx <= x1; tx++) {
      const dx = tx + 0.5 - cx;
      const dy = ty + 0.5 - cy;
      if (dx * dx + dy * dy <= r2)
        vis[ty * w.width + tx] = 2 /* Visible */;
    }
}
function footprintVisible(w, f, b) {
  const size = BUILDINGS[b.kind].size;
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++)
      if (isVisible(w, f, b.tx + dx, b.ty + dy))
        return true;
  return false;
}
function tickFog(w) {
  for (const f of sidesOf(w)) {
    const fog = w.fog[f];
    for (let i = 0;i < fog.vis.length; i++)
      if (fog.vis[i] === 2 /* Visible */)
        fog.vis[i] = 1 /* Explored */;
    for (const u of w.units.values())
      if (u.faction === f)
        stamp(w, fog.vis, u.x, u.y, UNITS[u.kind].sight);
    for (const b of w.buildings.values())
      if (b.faction === f) {
        const size = BUILDINGS[b.kind].size;
        stamp(w, fog.vis, b.tx + size / 2, b.ty + size / 2, BUILDINGS[b.kind].sight + size / 2);
      }
    for (const l of w.objectives.uplinks)
      if (l.owner === f)
        stamp(w, fog.vis, l.x, l.y, OBJECTIVES.uplink.sight);
    if (rulesOf(w).fogOff)
      fog.vis.fill(2 /* Visible */);
    for (const b of w.buildings.values())
      if (b.faction !== f && (BUILDINGS[b.kind].alwaysVisible || footprintVisible(w, f, b)))
        fog.known.set(b.id, { id: b.id, kind: b.kind, faction: b.faction, tx: b.tx, ty: b.ty });
    for (const [id, kb] of fog.known)
      if (!w.buildings.has(id) && (BUILDINGS[kb.kind].alwaysVisible || footprintVisible(w, f, kb)))
        fog.known.delete(id);
  }
}

// src/sim/rand.ts
function hash32(...xs) {
  let h = 2654435769 | 0;
  for (const x of xs) {
    h = Math.imul(h ^ (x | 0), 2246822507);
    h ^= h >>> 13;
    h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
  }
  return h >>> 0;
}
function saltOf(s) {
  let h = 2166136261;
  for (let i = 0;i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function worldRandom(w, salt, ...keys) {
  return hash32(w.seed, saltOf(salt), ...keys) / 4294967296;
}
function worldPick(w, n, salt, ...keys) {
  return Math.floor(worldRandom(w, salt, ...keys) * n) % Math.max(1, n);
}

// src/sim/powers.ts
var POWER_KINDS = ["barrage", "emp", "droppod", "hammer"];
var POWER_NAMES = {
  barrage: "Barrage",
  emp: "EMP",
  droppod: "Drop Pod",
  hammer: "Sky Hammer"
};
var ticks = (secs) => Math.round(secs * TICK_RATE);
function createPowerState() {
  const ready = () => ({ barrage: 0, emp: 0, droppod: 0, hammer: ticks(POWERS.hammer.unlock) });
  const zero = () => ({ barrage: 0, emp: 0, droppod: 0, hammer: 0 });
  return {
    meter: perSide(() => 0),
    readyAt: perSide(ready),
    active: [],
    stunned: new Map,
    fired: perSide(zero)
  };
}
function powerCost(p) {
  return p === "hammer" ? 0 : POWERS[p].cost;
}
function powerRadius(p) {
  return POWERS[p].radius;
}
function telegraphTicks(p) {
  return ticks(POWERS[p].telegraph);
}
function cooldownTicks(p) {
  return ticks(POWERS[p].cooldown);
}
function isStunned(w, id) {
  const s = w.powers.stunned;
  return s.size > 0 && (s.get(id) ?? 0) > w.tick;
}
function powerStatus(w, faction, power) {
  const ps = w.powers;
  const cost = powerCost(power);
  const unlock = power === "hammer" ? ticks(POWERS.hammer.unlock) : 0;
  const locked = Math.max(0, unlock - w.tick);
  const cooldown = locked > 0 ? 0 : Math.max(0, ps.readyAt[faction][power] - w.tick);
  const charge = cost === 0 ? 1 : Math.min(1, ps.meter[faction] / cost);
  return {
    power,
    cost,
    charge,
    cooldown,
    cooldownTotal: cooldownTicks(power),
    locked,
    ready: locked === 0 && cooldown === 0 && charge >= 1 && !w.winner && !rulesOf(w).noCalldowns
  };
}
var clock = (t) => {
  const s = Math.ceil(t / TICK_RATE);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
function powerBlocker(w, faction, power) {
  if (w.winner)
    return "The battle is over";
  if (rulesOf(w).noCalldowns)
    return "No calldowns in this match";
  if (!hqOf(w, faction) && !hasGoliath(w, faction))
    return "Calldowns need an HQ or a Goliath";
  if (power === "droppod" && podCrew(w, faction).length === 0)
    return "Drop Pod is disabled in this match";
  const st = powerStatus(w, faction, power);
  if (st.locked > 0)
    return `Sky Hammer comes online at ${clock(ticks(POWERS.hammer.unlock))}`;
  if (st.cooldown > 0)
    return `${POWER_NAMES[power]} recharging: ${Math.ceil(st.cooldown / TICK_RATE)} s`;
  if (st.charge < 1)
    return `${POWER_NAMES[power]} needs ${st.cost} charge (${Math.floor(w.powers.meter[faction])})`;
  return null;
}
function targetBlocker(w, faction, power, x, y) {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (!inBounds(w, tx, ty))
    return "Off the map";
  if (!isExplored(w, faction, tx, ty))
    return "Can't target unexplored ground";
  if (power === "droppod") {
    if (!isVisible(w, faction, tx, ty))
      return "Drop Pods need eyes on the landing zone";
    if (!passable(w, tx, ty, "ground"))
      return "Drop Pods need open ground to land on";
    if (!onHomeLand(w, faction, tx, ty))
      return "Drop Pods can't land on islands: fly troops in by Condor";
  }
  return null;
}
function calldownBlocker(w, faction, power, x, y) {
  return powerBlocker(w, faction, power) ?? targetBlocker(w, faction, power, x, y);
}
function applyCalldown(w, c) {
  if (!POWER_KINDS.includes(c.power) || !Number.isFinite(c.x) || !Number.isFinite(c.y))
    return;
  if (calldownBlocker(w, c.faction, c.power, c.x, c.y))
    return;
  const ps = w.powers;
  ps.meter[c.faction] -= powerCost(c.power);
  ps.readyAt[c.faction][c.power] = w.tick + cooldownTicks(c.power);
  ps.fired[c.faction][c.power]++;
  const id = w.nextId++;
  const landTick = w.tick + telegraphTicks(c.power);
  const radius = powerRadius(c.power);
  const cd = {
    id,
    faction: c.faction,
    power: c.power,
    x: c.x,
    y: c.y,
    radius,
    startTick: w.tick,
    landTick,
    shells: []
  };
  if (c.power === "barrage") {
    const b = POWERS.barrage;
    for (let i = 0;i < b.shells; i++) {
      const a = worldRandom(w, "barrage", id, i, 0) * Math.PI * 2;
      const r = b.scatter * Math.sqrt(worldRandom(w, "barrage", id, i, 1));
      cd.shells.push({
        x: Math.min(w.width - 0.01, Math.max(0, c.x + sin(a) * r)),
        y: Math.min(w.height - 0.01, Math.max(0, c.y - cos(a) * r)),
        tick: landTick + i * ticks(b.shellGap)
      });
    }
  }
  ps.active.push(cd);
  w.fx.push({ type: "calldown", id, faction: c.faction, power: c.power, x: c.x, y: c.y, radius, landTick });
}
function tickPowers(w) {
  const ps = w.powers;
  for (const f of sidesOf(w))
    if (w.tick === ps.readyAt[f].hammer && !rulesOf(w).noCalldowns)
      w.fx.push({ type: "powerOnline", faction: f, power: "hammer" });
  if (ps.stunned.size > 0) {
    for (const [id, until] of ps.stunned)
      if (until <= w.tick || !w.units.has(id) && !w.buildings.has(id))
        ps.stunned.delete(id);
  }
  if (ps.active.length === 0)
    return;
  const keep = [];
  for (const c of ps.active) {
    if (c.power === "barrage") {
      for (const s of c.shells)
        if (s.tick === w.tick)
          landShell(w, c, s.x, s.y);
      if (w.tick < c.shells[c.shells.length - 1].tick)
        keep.push(c);
      continue;
    }
    if (w.tick < c.landTick) {
      keep.push(c);
      continue;
    }
    if (c.power === "emp")
      landEmp(w, c);
    else if (c.power === "droppod")
      landPod(w, c);
    else
      landHammer(w, c);
  }
  ps.active = keep;
}
function chargePowers(w) {
  const m = w.powers.meter;
  const sides = sidesOf(w);
  for (const f of sides)
    m[f] += POWERS.passive / TICK_RATE;
  for (const ev of w.fx) {
    if (ev.type !== "death")
      continue;
    if (!ev.free)
      m[ev.faction] += ev.value * POWERS.perScrapLost;
    const by = isMulti(w) ? ev.by ?? null : otherSide(ev.faction);
    if (by)
      m[by] += ev.value * POWERS.perScrapKilled;
  }
  for (const f of sides)
    m[f] = Math.min(POWERS.meterMax, m[f]);
}
var attackerOf = (w, f) => hqOf(w, f)?.id ?? 0;
function impact(w, c, x, y, hits, unitIds = []) {
  w.fx.push({
    type: "calldownImpact",
    id: c.id,
    faction: c.faction,
    power: c.power,
    x,
    y,
    radius: c.radius,
    hits,
    unitIds
  });
}
function landShell(w, c, x, y) {
  const b = POWERS.barrage;
  const hits = areaBlast(w, c.faction, x, y, b.splash, b.damage, "explosive", "ground", attackerOf(w, c.faction));
  impact(w, c, x, y, hits);
}
function landEmp(w, c) {
  const r = POWERS.emp.radius;
  const until = w.tick + ticks(POWERS.emp.stun);
  let hits = 0;
  for (const victim of rivalsOf(w, c.faction)) {
    const ids = [];
    for (const u of w.units.values())
      if (u.faction === victim && hypot(u.x - c.x, u.y - c.y) <= r)
        ids.push(u.id);
    for (const b of w.buildings.values())
      if (b.faction === victim && distToBuilding(b, c.x, c.y) <= r)
        ids.push(b.id);
    for (const id of ids)
      w.powers.stunned.set(id, Math.max(until, w.powers.stunned.get(id) ?? 0));
    if (ids.length > 0)
      w.fx.push({ type: "stun", faction: victim, ids, x: c.x, y: c.y, until });
    hits += ids.length;
  }
  impact(w, c, c.x, c.y, hits);
}
var POD_SUBSTITUTE = {
  stinger: ["wasp", "trooper"],
  lancer: ["wasp", "rocket-squad"],
  "flak-crawler": ["raptor", "rocket-squad"]
};
function podCrew(w, faction) {
  const base = hasBuilding(w, faction, "tech-lab") ? POWERS.droppod.techUnits : POWERS.droppod.units;
  const out = [];
  for (const kind of base) {
    if (!bannedBy(w, kind, faction))
      out.push(kind);
    else {
      const alt = POD_SUBSTITUTE[kind]?.find((k) => !bannedBy(w, k, faction));
      if (alt)
        out.push(alt);
    }
  }
  return out;
}
function landPod(w, c) {
  const p = POWERS.droppod;
  const hits = areaBlast(w, c.faction, c.x, c.y, p.radius, p.damage, "explosive", "ground", attackerOf(w, c.faction));
  const kinds = podCrew(w, c.faction);
  const ids = [];
  kinds.forEach((kind, i) => {
    const spot = podSpot(w, kind, c.x, c.y, i, kinds.length, QUARTER[c.faction]);
    if (!spot)
      return;
    const u = spawnUnit(w, kind, c.faction, spot.x, spot.y);
    applySpawnRank(w, u);
    u.facing = u.aim = atan2(spot.x - c.x, -(spot.y - c.y)) || u.facing;
    ids.push(u.id);
  });
  impact(w, c, c.x, c.y, hits, ids);
}
function podSpot(w, kind, x, y, i, n, q = 0) {
  const mc = moveClassOf(kind);
  const a = i / n * Math.PI * 2 + 0.4 + (q === 2 ? Math.PI : q === 1 ? Math.PI / 2 : q === 3 ? Math.PI * 1.5 : 0);
  const px = x + sin(a) * 0.65;
  const py = y - cos(a) * 0.65;
  const land = regionAt(w, Math.floor(x), Math.floor(y), "ground");
  if (passable(w, Math.floor(px), Math.floor(py), mc) && regionAt(w, Math.floor(px), Math.floor(py), "ground") === land)
    return { x: px, y: py };
  for (let r = 0;r <= 3; r++) {
    let best = null;
    let bestD = Infinity;
    for (let i2 = -r;i2 <= r; i2++)
      for (let j2 = -r;j2 <= r; j2++) {
        const [dx, dy] = turnVec(q, j2, i2);
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r)
          continue;
        const tx = Math.floor(px) + dx;
        const ty = Math.floor(py) + dy;
        if (!passable(w, tx, ty, mc) || regionAt(w, tx, ty, "ground") !== land)
          continue;
        const d = hypot(tx + 0.5 - px, ty + 0.5 - py);
        if (d < bestD) {
          bestD = d;
          best = { x: tx + 0.5, y: ty + 0.5 };
        }
      }
    if (best)
      return best;
  }
  return null;
}
function landHammer(w, c) {
  const h = POWERS.hammer;
  const hits = [];
  for (const u of w.units.values()) {
    if (u.faction === c.faction)
      continue;
    const d = hypot(u.x - c.x, u.y - c.y);
    if (d <= h.radius)
      hits.push({ id: u.id, damage: h.unitDamage * (1 - 0.5 * (d / h.radius)) });
  }
  for (const b of w.buildings.values())
    if (b.faction !== c.faction && distToBuilding(b, c.x, c.y) <= h.radius)
      hits.push({ id: b.id, damage: h.buildingDamage });
  strikeDamage(w, hits, attackerOf(w, c.faction));
  impact(w, c, c.x, c.y, hits.length);
}

// src/sim/salvage.ts
function wreckValue(kind, share = SALVAGE.share) {
  if (kind === "harvester" || isInfantry(kind))
    return 0;
  return Math.round(UNITS[kind].cost * share);
}
function wreckShareOf(w, faction) {
  const s = w.survival;
  return s && faction !== s.defender ? s.wreckShare : SALVAGE.share;
}
function wreckRestingSpot(w, x, y, faction) {
  const fr = sideFrame(w, faction);
  const p = fr.toFrame({ x, y });
  const pass = (fx, fy) => groundPassable(w, ...fr.tile(fx, fy, 1));
  const tx = Math.floor(p.x);
  const ty = Math.floor(p.y);
  if (pass(tx, ty))
    return { x, y };
  const R = SALVAGE.shiftRadius;
  const span = Math.ceil(R);
  let best = null;
  let bestD = Infinity;
  for (let dy = -span;dy <= span; dy++)
    for (let dx = -span;dx <= span; dx++) {
      const nx = tx + dx;
      const ny = ty + dy;
      if (!pass(nx, ny))
        continue;
      const cx = Math.max(nx + 0.2, Math.min(nx + 0.8, p.x));
      const cy = Math.max(ny + 0.2, Math.min(ny + 0.8, p.y));
      const d = hypot(cx - p.x, cy - p.y);
      if (d > R || d >= bestD)
        continue;
      bestD = d;
      best = { x: cx, y: cy };
    }
  return best ? fr.toWorld(best) : null;
}
function makeRoom(w) {
  while (w.wrecks.length >= SALVAGE.maxWrecks)
    w.wrecks.shift();
}
function scatterPiles(w, faction, x, y, value, count, spread, facing, salt) {
  const out = [];
  if (value <= 0 || count <= 0)
    return out;
  const each = Math.round(value / count);
  if (each <= 0)
    return out;
  for (let i = 0;i < count; i++) {
    const a = facing + (i + 0.5 * worldRandom(w, salt, w.tick, i, 0)) / count * Math.PI * 2;
    const r = spread * (0.3 + 0.7 * worldRandom(w, salt, w.tick, i, 1));
    const spot = wreckRestingSpot(w, x + sin(a) * r, y - cos(a) * r);
    if (!spot)
      continue;
    makeRoom(w);
    const pile = {
      id: w.nextId++,
      kind: "goliath",
      faction,
      x: spot.x,
      y: spot.y,
      facing: a,
      value: each,
      ttl: Math.round(GOLIATH.pileTtl * TICK_RATE),
      hot: Math.round(SALVAGE.hot * TICK_RATE),
      pile: true
    };
    w.wrecks.push(pile);
    out.push(pile);
  }
  return out;
}
function scatterGoliath(w, u) {
  const S = GOLIATH.salvage;
  const value = Math.round(UNITS.goliath.cost * S.share * (wreckShareOf(w, u.faction) / SALVAGE.share));
  const count = S.piles[0] + Math.floor(worldRandom(w, "goliath-piles", w.tick) * (S.piles[1] - S.piles[0] + 1));
  return scatterPiles(w, u.faction, u.x, u.y, value, Math.min(count, S.piles[1]), S.spread, u.facing, "goliath-salvage");
}
function scatterGantry(w, b) {
  const head = b.queue[0];
  if (!head || head.kind !== "goliath")
    return [];
  const total = UNITS.goliath.buildTime * TICK_RATE;
  const progress = Math.max(0, Math.min(1, 1 - head.remaining / total));
  const S = GOLIATH.gantrySalvage;
  const value = Math.round((head.paid ?? UNITS.goliath.cost) * progress * S.share);
  const count = Math.max(1, Math.round(S.piles * progress));
  const c = buildingCenter(b);
  return scatterPiles(w, b.faction, c.x, c.y, value, count, S.spread + BUILDINGS.gantry.size / 2, b.faction === "red" ? Math.PI : 0, "gantry-salvage");
}
function leaveWreck(w, u) {
  if (u.free)
    return null;
  if (u.goliath)
    return scatterGoliath(w, u)[0] ?? null;
  const value = wreckValue(u.kind, wreckShareOf(w, u.faction));
  if (value <= 0)
    return null;
  const spot = wreckRestingSpot(w, u.x, u.y);
  if (!spot)
    return null;
  makeRoom(w);
  const r = {
    id: u.id,
    kind: u.kind,
    faction: u.faction,
    x: spot.x,
    y: spot.y,
    facing: u.facing,
    value,
    ttl: Math.round(SALVAGE.ttl * TICK_RATE),
    hot: Math.round(SALVAGE.hot * TICK_RATE)
  };
  w.wrecks.push(r);
  return r;
}
function collect(w, r, faction, collectorId) {
  const f = w.factions[faction];
  const amount = r.value * incomeOf(w, faction);
  f.scrap += amount;
  f.stats.scrapSalvaged += amount;
  w.fx.push({ type: "salvage", faction, x: r.x, y: r.y, value: amount, wreckId: r.id, collectorId });
}
function tickSalvage(w) {
  if (w.wrecks.length === 0)
    return;
  const reach = SALVAGE.pickupRadius;
  const earns = perSide((f) => incomeOf(w, f) > 0);
  if (w.survival)
    earns[otherSide(w.survival.defender)] = false;
  const ground = [];
  for (const u of w.units.values())
    if (domainOf(u) === "ground" && earns[u.faction])
      ground.push(u);
  const keep = [];
  for (const r of w.wrecks) {
    if (--r.ttl <= 0)
      continue;
    if (r.hot > 0) {
      r.hot--;
      keep.push(r);
      continue;
    }
    const b = buildingAtTile(w, Math.floor(r.x), Math.floor(r.y));
    if (b) {
      if (earns[b.faction])
        collect(w, r, b.faction, b.id);
      continue;
    }
    let best = null;
    let bestD = reach;
    for (const u of ground) {
      const dx = u.x - r.x;
      if (dx > reach || dx < -reach)
        continue;
      const dy = u.y - r.y;
      if (dy > reach || dy < -reach)
        continue;
      const d = hypot(dx, dy);
      if (d <= bestD && (best === null || d < bestD)) {
        best = u;
        bestD = d;
      }
    }
    if (best)
      collect(w, r, best.faction, best.id);
    else
      keep.push(r);
  }
  w.wrecks = keep;
}

// src/sim/lift.ts
function liftedBy(w, c) {
  if (c.order.type !== "lift")
    return null;
  const g = w.units.get(c.order.goliathId);
  return g?.goliath?.lift?.carriers.includes(c.id) ? g : null;
}
var canCarry = (c) => isTransport(c.kind) && (c.passengers?.length ?? 0) === 0 && c.order.type !== "lift" && c.hp > 0;
function liftBlocker(condors, g) {
  if (!g.goliath)
    return "Not a Goliath";
  const free = condors.filter((c) => c.faction === g.faction && canCarry(c));
  if (free.length < 2)
    return "Needs two empty Condors";
  if (g.goliath.lift)
    return "Already on a lift";
  if (g.goliath.mode !== "walking")
    return "Pack up first";
  return null;
}
function hookPoint(x, y, facing, i) {
  const s = (i === 0 ? -1 : 1) * GOLIATH.lift.span;
  return { x: x + cos(facing) * s, y: y + sin(facing) * s };
}
function flyToward(u, x, y, speed) {
  const d = hypot(x - u.x, y - u.y);
  if (d <= speed) {
    u.x = x;
    u.y = y;
    return true;
  }
  u.x += (x - u.x) / d * speed;
  u.y += (y - u.y) / d * speed;
  return false;
}
function face(u, x, y) {
  if (hypot(x - u.x, y - u.y) > 0.000001)
    u.facing = atan2(x - u.x, -(y - u.y));
}
function release(w, g) {
  const lift = g.goliath?.lift;
  if (!lift)
    return;
  for (const id of lift.carriers) {
    const c = w.units.get(id);
    if (c && c.order.type === "lift" && c.order.goliathId === g.id) {
      c.order = { type: "idle" };
      c.path = null;
    }
  }
  g.goliath.lift = null;
}
function setDownPoint(w, g, x, y) {
  const ok = (tx, ty) => passable(w, tx, ty, "ground");
  const fr = sideFrame(w, g.faction);
  const p = fr.toFrame({ x, y });
  if (ok(...fr.tile(Math.floor(p.x), Math.floor(p.y), 1)))
    return { x, y };
  const R = Math.ceil(GOLIATH.lift.setDownSearch);
  let best = null;
  let bestD = Infinity;
  for (let dy = -R;dy <= R; dy++)
    for (let dx = -R;dx <= R; dx++) {
      const fx = Math.floor(p.x) + dx;
      const fy = Math.floor(p.y) + dy;
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!ok(tx, ty))
        continue;
      const d = hypot(fx + 0.5 - p.x, fy + 0.5 - p.y);
      if (d > GOLIATH.lift.setDownSearch || d >= bestD - 0.000000001)
        continue;
      bestD = d;
      best = fr.toWorld({ x: fx + 0.5, y: fy + 0.5 });
    }
  return best;
}
function applyLiftCommand(w, c) {
  const g = w.units.get(c.goliathId);
  if (!g || g.faction !== c.faction || !g.goliath)
    return;
  const condors = [];
  for (const id of c.unitIds) {
    const u = w.units.get(id);
    if (u && u.faction === c.faction && canCarry(u) && !condors.includes(u))
      condors.push(u);
  }
  if (liftBlocker(condors, g))
    return;
  condors.sort((a2, b2) => hypot(a2.x - g.x, a2.y - g.y) - hypot(b2.x - g.x, b2.y - g.y) || a2.id - b2.id);
  const [a, b] = condors;
  const l = hookPoint(g.x, g.y, g.facing, 0);
  const r = hookPoint(g.x, g.y, g.facing, 1);
  const straight = hypot(a.x - l.x, a.y - l.y) + hypot(b.x - r.x, b.y - r.y);
  const crossed = hypot(a.x - r.x, a.y - r.y) + hypot(b.x - l.x, b.y - l.y);
  const carriers = crossed < straight - 0.000000001 ? [b.id, a.id] : [a.id, b.id];
  for (const u of [a, b]) {
    u.order = { type: "lift", goliathId: g.id };
    u.path = null;
    u.pathGoal = null;
    u.autoTargetId = null;
  }
  g.order = { type: "idle" };
  g.path = null;
  g.pathGoal = null;
  g.goliath.lift = { carriers, phase: "hooking", dest: null, setDown: false };
}
var isLiftOrder = (c) => c.type === "move" || c.type === "attackMove" || c.type === "unload" || c.type === "stop";
function routeLiftCommand(w, c, held) {
  const handled = new Set;
  if (!("unitIds" in c) || c.type === "lift")
    return handled;
  for (const id of c.unitIds) {
    const u = w.units.get(id);
    if (!u || u.faction !== c.faction)
      continue;
    const g = u.goliath?.lift ? u : liftedBy(w, u);
    const lift = g?.goliath?.lift;
    if (!g || !lift)
      continue;
    handled.add(id);
    if (!isLiftOrder(c))
      continue;
    if (lift.phase === "hooking") {
      if (u.goliath)
        continue;
      release(w, g);
      handled.delete(id);
      handled.delete(g.id);
      const ignored = held?.ignored.get(g.id);
      if (held && ignored) {
        held.ignored.delete(g.id);
        held.freed.push([g.id, ignored]);
      }
      continue;
    }
    const onMap = (x, y) => ({ x: Math.min(w.width - 0.5, Math.max(0.5, x)), y: Math.min(w.height - 0.5, Math.max(0.5, y)) });
    if (c.type === "stop") {
      lift.dest = null;
      lift.setDown = false;
    } else if (c.type === "unload") {
      const hasPoint = Number.isFinite(c.x) && Number.isFinite(c.y);
      lift.dest = hasPoint ? onMap(c.x, c.y) : { x: g.x, y: g.y };
      lift.setDown = true;
    } else if (Number.isFinite(c.x) && Number.isFinite(c.y)) {
      lift.dest = onMap(c.x, c.y);
      lift.setDown = false;
    }
  }
  if (held && isLiftOrder(c)) {
    for (const id of handled)
      if (w.units.get(id)?.goliath?.lift?.phase === "hooking")
        held.ignored.set(id, c);
  }
  return handled;
}
function tickLift(w) {
  const condorStep = UNITS.condor.speed / TICK_RATE;
  const liftStep = condorStep * GOLIATH.lift.speedMult;
  for (const c of w.units.values())
    if (c.order.type === "lift" && !liftedBy(w, c)) {
      c.order = { type: "idle" };
      c.path = null;
    }
  for (const g of w.units.values()) {
    const lift = g.goliath?.lift;
    if (!lift)
      continue;
    const cs = lift.carriers.map((id) => w.units.get(id));
    if (cs.some((c) => !c || c.hp <= 0 || c.order.type !== "lift" || c.order.goliathId !== g.id)) {
      if (lift.phase === "hooking")
        release(w, g);
      continue;
    }
    const carriers = cs;
    if (isStunned(w, g.id) || carriers.some((c) => isStunned(w, c.id)))
      continue;
    if (lift.phase === "hooking") {
      let on = 0;
      carriers.forEach((c, i) => {
        const p = hookPoint(g.x, g.y, g.facing, i);
        if (hypot(p.x - c.x, p.y - c.y) <= GOLIATH.lift.hookRange)
          on++;
        else {
          face(c, p.x, p.y);
          if (flyToward(c, p.x, p.y, condorStep))
            on++;
        }
      });
      if (on < 2)
        continue;
      lift.phase = "carrying";
      for (const c of carriers)
        c.facing = g.facing;
      w.fx.push({ type: "goliathLift", faction: g.faction, id: g.id, carrierIds: [...lift.carriers], state: "hooked", x: g.x, y: g.y });
    } else if (lift.dest) {
      const d = lift.dest;
      face(g, d.x, d.y);
      if (flyToward(g, d.x, d.y, liftStep)) {
        if (lift.setDown) {
          const at = setDownPoint(w, g, d.x, d.y);
          if (at && hypot(at.x - g.x, at.y - g.y) > 0.000001) {
            lift.dest = at;
          } else if (at) {
            setDown(w, g);
            continue;
          } else
            lift.dest = null;
        } else
          lift.dest = null;
      }
    }
    carriers.forEach((c, i) => {
      const p = hookPoint(g.x, g.y, g.facing, i);
      c.x = Math.max(0.05, Math.min(w.width - 0.05, p.x));
      c.y = Math.max(0.05, Math.min(w.height - 0.05, p.y));
      c.facing = g.facing;
    });
  }
}
function setDown(w, g) {
  const ids = [...g.goliath.lift.carriers];
  release(w, g);
  g.order = { type: "idle" };
  g.path = null;
  g.pathGoal = null;
  w.fx.push({ type: "goliathLift", faction: g.faction, id: g.id, carrierIds: ids, state: "setDown", x: g.x, y: g.y });
}
function dropLifts(w) {
  for (const g of w.units.values()) {
    const lift = g.goliath?.lift;
    if (!lift)
      continue;
    const cs = lift.carriers.map((id) => w.units.get(id));
    const down = cs.find((c) => !c || c.hp <= 0);
    if (down === undefined && cs.every((c) => c.order.type === "lift"))
      continue;
    const ids = [...lift.carriers];
    const phase = lift.phase;
    release(w, g);
    if (phase === "hooking")
      continue;
    const killer = down?.lastAttackerId ?? g.lastAttackerId ?? 0;
    const fr = sideFrame(w, g.faction);
    const fp = fr.toFrame(g);
    const [tx, ty] = fr.tile(Math.floor(fp.x), Math.floor(fp.y), 1);
    let lands = inBounds(w, tx, ty) && TERRAIN[terrainAt(w, tx, ty)].ground;
    if (lands && w.occupancy[ty * w.width + tx] !== 0) {
      const spot = wreckRestingSpot(w, g.x, g.y, g.faction);
      if (spot) {
        g.x = spot.x;
        g.y = spot.y;
      } else
        lands = false;
    }
    const damage = lands ? UNITS.goliath.hp * GOLIATH.lift.dropDamage : g.hp;
    if (g.hp > 0)
      strikeDamage(w, [{ id: g.id, damage }], killer);
    if (!lands)
      g.hp = Math.min(g.hp, 0);
    g.order = { type: "idle" };
    g.path = null;
    g.pathGoal = null;
    w.fx.push({ type: "goliathLift", faction: g.faction, id: g.id, carrierIds: ids, state: "dropped", x: g.x, y: g.y, destroyed: !lands || g.hp <= 0 });
  }
}
var ARMADA = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1]
];
function armadaStart(w) {
  const centre = { x: w.width / 2, y: w.height / 2 };
  const edge = GOLIATH.lift.span + 1;
  for (const f of sidesOf(w)) {
    const hq = hqOf(w, f);
    if (!hq)
      continue;
    const fr = sideFrame(w, f);
    const home = fr.toFrame(buildingCenter(hq));
    for (const b of [...w.buildings.values()])
      if (b.faction === f)
        removeBuilding(w, b);
    for (const u of [...w.units.values()])
      if (u.faction === f)
        w.units.delete(u.id);
    for (const [dx, dy] of ARMADA) {
      const at = fr.toWorld({
        x: Math.min(w.width - edge, Math.max(edge, home.x + dx * GOLIATH.armada.gap)),
        y: Math.min(w.height - edge, Math.max(edge, home.y + dy * GOLIATH.armada.gap))
      });
      const g = spawnUnit(w, "goliath", f, at.x, at.y);
      face(g, centre.x, centre.y);
      applySpawnRank(w, g);
      const carriers = [0, 1].map((i) => {
        const p = hookPoint(g.x, g.y, g.facing, i);
        const c = spawnUnit(w, "condor", f, p.x, p.y);
        c.facing = g.facing;
        c.order = { type: "lift", goliathId: g.id };
        return c.id;
      });
      g.goliath.lift = { carriers, phase: "carrying", dest: null, setDown: false };
    }
  }
}

// src/sim/movement.ts
var ARRIVE_DIST = 0.25;
var IGNORE_TICKS = 30;
var WAYPOINT_DIST = 0.7;
var MAX_TERRAIN_SPEED = Math.max(...Object.values(TERRAIN).map((t) => Math.max(t.speed, t.hoverSpeed, t.footSpeed)));
function arrivalRadius(w, u, gx, gy) {
  let crowd = 0;
  for (const o of w.units.values()) {
    if (o.id === u.id || UNITS[o.kind].domain !== UNITS[u.kind].domain)
      continue;
    if (hypot(o.x - gx, o.y - gy) < 0.9)
      crowd++;
  }
  return Math.min(2, ARRIVE_DIST + 0.4 * crowd);
}
function stepCost(w, idx2, mc) {
  return 1 / (terrainMult(TERRAIN[w.terrain[idx2]], mc) || 1);
}
var scratch = null;
function findPath(w, fromX, fromY, toX, toY, mc = "ground", faction) {
  const pass = (x, y) => passable(w, x, y, mc);
  const q = faction ? QUARTER[faction] : 0;
  const [sx, sy] = frameTileOf(w, faction, fromX, fromY);
  let [gx, gy] = frameTileOf(w, faction, toX, toY);
  if (!inBounds(w, gx, gy)) {
    gx = Math.max(0, Math.min(w.width - 1, gx));
    gy = Math.max(0, Math.min(w.height - 1, gy));
  }
  const region = mc === "air" ? 0 : regionAt(w, sx, sy, mc);
  const labels = region ? regionLabels(w, mc) : null;
  const ok = (x, y) => pass(x, y) && (!labels || labels[y * w.width + x] === region);
  if (!ok(gx, gy)) {
    let found = null;
    for (let r = 1;r <= 6 && !found; r++) {
      let bestD = Infinity;
      for (let i = -r;i <= r; i++)
        for (let j = -r;j <= r; j++) {
          const [dx, dy] = turnVec(q, j, i);
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r)
            continue;
          if (!ok(gx + dx, gy + dy))
            continue;
          const d = hypot(gx + dx - sx, gy + dy - sy);
          if (d < bestD) {
            bestD = d;
            found = { x: gx + dx, y: gy + dy };
          }
        }
    }
    if (!found)
      return null;
    gx = found.x;
    gy = found.y;
  }
  if (sx === gx && sy === gy)
    return [{ x: gx + 0.5, y: gy + 0.5 }];
  const W = w.width;
  const H = w.height;
  const n = W * H;
  if (!scratch || scratch.g.length < n)
    scratch = { g: new Float32Array(n), from: new Int32Array(n), seen: new Uint32Array(n), shut: new Uint32Array(n), gen: 0 };
  const sc = scratch;
  if (++sc.gen >= 4294967295) {
    sc.seen.fill(0);
    sc.shut.fill(0);
    sc.gen = 1;
  }
  const gen = sc.gen;
  const gOf = (i) => sc.seen[i] === gen ? sc.g[i] : Infinity;
  const startIdx = sy * W + sx;
  const goalIdx = gy * W + gx;
  sc.seen[startIdx] = gen;
  sc.g[startIdx] = 0;
  const heap = [];
  const push = (f, idx2) => {
    heap.push(f, idx2);
    let i = heap.length / 2 - 1;
    while (i > 0) {
      const p = i - 1 >> 1;
      if (heap[p * 2] <= heap[i * 2])
        break;
      for (let k = 0;k < 2; k++) {
        const t = heap[p * 2 + k];
        heap[p * 2 + k] = heap[i * 2 + k];
        heap[i * 2 + k] = t;
      }
      i = p;
    }
  };
  const pop = () => {
    const idx2 = heap[1];
    const last = heap.length - 2;
    heap[0] = heap[last];
    heap[1] = heap[last + 1];
    heap.length = last;
    let i = 0;
    const size = heap.length / 2;
    for (;; ) {
      const l = i * 2 + 1;
      const r = l + 1;
      let m = i;
      if (l < size && heap[l * 2] < heap[m * 2])
        m = l;
      if (r < size && heap[r * 2] < heap[m * 2])
        m = r;
      if (m === i)
        break;
      for (let k = 0;k < 2; k++) {
        const t = heap[m * 2 + k];
        heap[m * 2 + k] = heap[i * 2 + k];
        heap[i * 2 + k] = t;
      }
      i = m;
    }
    return idx2;
  };
  const h = (idx2) => {
    const dx = Math.abs(idx2 % W - gx);
    const dy = Math.abs(Math.floor(idx2 / W) - gy);
    return (Math.max(dx, dy) + 0.4142 * Math.min(dx, dy)) / MAX_TERRAIN_SPEED;
  };
  push(h(startIdx), startIdx);
  while (heap.length > 0) {
    const cur = pop();
    if (cur === goalIdx) {
      const path = [];
      for (let idx2 = goalIdx;idx2 !== startIdx; idx2 = sc.from[idx2])
        path.push({ x: idx2 % W + 0.5, y: Math.floor(idx2 / W) + 0.5 });
      path.reverse();
      return path;
    }
    if (sc.shut[cur] === gen)
      continue;
    sc.shut[cur] = gen;
    const cx = cur % W;
    const cy = Math.floor(cur / W);
    for (let i = -1;i <= 1; i++)
      for (let j = -1;j <= 1; j++) {
        const [dx, dy] = turnVec(q, j, i);
        if (dx === 0 && dy === 0)
          continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (!pass(nx, ny))
          continue;
        if (dx !== 0 && dy !== 0 && (!pass(cx + dx, cy) || !pass(cx, cy + dy)))
          continue;
        const nIdx = ny * W + nx;
        if (sc.shut[nIdx] === gen)
          continue;
        const cost = (dx !== 0 && dy !== 0 ? 1.4142 : 1) * stepCost(w, nIdx, mc);
        const g = sc.g[cur] + cost;
        if (g < gOf(nIdx)) {
          sc.seen[nIdx] = gen;
          sc.g[nIdx] = g;
          sc.from[nIdx] = cur;
          push(g + h(nIdx), nIdx);
        }
      }
  }
  return null;
}
function unitStepSpeed(w, u) {
  return UNITS[u.kind].speed / TICK_RATE * terrainSpeed(w, u.x, u.y, moveClassOf(u.kind));
}
function moveUnitToward(w, u, x, y) {
  const mc = moveClassOf(u.kind);
  const speed = unitStepSpeed(w, u);
  if (mc === "air") {
    const d2 = hypot(x - u.x, y - u.y);
    if (d2 <= Math.max(arrivalRadius(w, u, x, y), speed)) {
      return true;
    }
    u.facing = atan2(x - u.x, -(y - u.y));
    u.x += (x - u.x) / d2 * speed;
    u.y += (y - u.y) / d2 * speed;
    return false;
  }
  if (!u.path || !u.pathGoal || hypot(u.pathGoal.x - x, u.pathGoal.y - y) > 0.6) {
    u.path = findPath(w, u.x, u.y, x, y, mc, u.faction);
    u.pathGoal = { x, y };
    if (!u.path)
      return true;
  }
  let wp = u.path[0];
  while (wp) {
    const consume = u.path.length > 1 ? WAYPOINT_DIST : arrivalRadius(w, u, wp.x, wp.y);
    if (hypot(wp.x - u.x, wp.y - u.y) > consume)
      break;
    u.path.shift();
    wp = u.path[0];
  }
  if (!wp) {
    u.path = null;
    u.pathGoal = null;
    return true;
  }
  if (!passable(w, Math.floor(wp.x), Math.floor(wp.y), mc)) {
    u.path = null;
    return false;
  }
  const d = hypot(wp.x - u.x, wp.y - u.y);
  const step = Math.min(speed, d);
  u.facing = atan2(wp.x - u.x, -(wp.y - u.y));
  u.x += (wp.x - u.x) / d * step;
  u.y += (wp.y - u.y) / d * step;
  return false;
}
function reachFor(w, u, id) {
  if (!u.goliath)
    return UNITS[u.kind].range;
  const t = w.units.get(id);
  return goliathReachAt(u, t ? domainOf(t) : "ground");
}
function approachPoint(w, u, targetId) {
  const t = w.units.get(targetId);
  if (t)
    return { x: t.x, y: t.y };
  const b = w.buildings.get(targetId);
  if (!b)
    return null;
  const size = BUILDINGS[b.kind].size;
  return {
    x: Math.max(b.tx + 0.5, Math.min(b.tx + size - 0.5, u.x)),
    y: Math.max(b.ty + 0.5, Math.min(b.ty + size - 0.5, u.y))
  };
}
function vehicleSpots(w) {
  const out = new Map;
  for (const u of w.units.values())
    if (UNITS[u.kind].domain === "ground" && !isInfantry(u.kind))
      out.set(u.id, { x: u.x, y: u.y });
  return out;
}
function tickMovement(w, pausedIds, spots = new Map) {
  const crushers = [];
  for (const u of w.units.values())
    if (crushes(u.kind))
      crushers.push({ u, x: u.x, y: u.y });
  for (const u of w.units.values()) {
    const o = u.order;
    if (pausedIds.has(u.id))
      continue;
    if (!canWalk(u))
      continue;
    if (o.type === "move" || o.type === "attackMove") {
      if (moveUnitToward(w, u, o.x, o.y))
        u.order = { type: "idle" };
    } else if (o.type === "attack") {
      const p = approachPoint(w, u, o.targetId);
      if (!p) {
        u.order = { type: "idle" };
        continue;
      }
      const minRange = UNITS[u.kind].minRange ?? 0;
      const d = hypot(p.x - u.x, p.y - u.y);
      if (minRange > 0 && d < minRange) {
        const k = (minRange + 0.8) / Math.max(d, 0.01);
        moveUnitToward(w, u, p.x + (u.x - p.x) * k, p.y + (u.y - p.y) * k);
      } else if (moveUnitToward(w, u, p.x, p.y) && d > reachFor(w, u, o.targetId)) {
        const mc = moveClassOf(u.kind);
        const here = regionAt(w, Math.floor(u.x), Math.floor(u.y), mc);
        if (here && regionAt(w, Math.floor(p.x), Math.floor(p.y), mc) !== here) {
          u.ignore = { id: o.targetId, until: w.tick + IGNORE_TICKS };
          u.order = { type: "idle" };
        }
      }
    }
  }
  const moved = crushers.filter((c) => c.u.x !== c.x || c.u.y !== c.y).map((c) => c.u);
  const driving = new Set;
  for (const [id, p] of spots) {
    const u = w.units.get(id);
    if (u && (u.x !== p.x || u.y !== p.y))
      driving.add(id);
  }
  separate(w, driving);
  if (moved.length > 0)
    tickCrush(w, moved);
}
var KIND_INDEX = Object.fromEntries(Object.keys(UNITS).map((k, i) => [k, i]));
function separate(w, driving) {
  const units = [...w.units.values()].filter((u) => u.order.type !== "lift" && !isLifted(u));
  for (let i = 0;i < units.length; i++) {
    const a = units[i];
    const da = UNITS[a.kind].domain;
    const ia = isInfantry(a.kind);
    for (let j = i + 1;j < units.length; j++) {
      const b = units[j];
      if (UNITS[b.kind].domain !== da)
        continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const reach = Math.max(1.2, UNITS[a.kind].radius + UNITS[b.kind].radius);
      if (Math.abs(dx) > reach || Math.abs(dy) > reach)
        continue;
      const ib = isInfantry(b.kind);
      if (ia !== ib && a.faction !== b.faction)
        continue;
      const d = hypot(dx, dy);
      const minD = Math.max(0.7, UNITS[a.kind].radius + UNITS[b.kind].radius);
      if (d >= minD)
        continue;
      const push = (minD - d) / 2;
      let ux;
      let uy;
      if (d < 0.001) {
        const angle = a.faction === b.faction ? (KIND_INDEX[a.kind] * 7 + KIND_INDEX[b.kind] * 13 + w.tick) % 16 * (Math.PI / 8) + (a.faction === "red" ? Math.PI : a.faction === "green" ? Math.PI / 2 : a.faction === "purple" ? Math.PI * 1.5 : 0) : (a.id * 7 + b.id * 13) % 16 * (Math.PI / 8);
        ux = sin(angle);
        uy = -cos(angle);
      } else {
        ux = dx / d;
        uy = dy / d;
      }
      const planted = (u) => !!u.goliath && !canWalk(u);
      if (planted(a) && planted(b))
        continue;
      if (planted(a) !== planted(b)) {
        if (planted(a))
          nudge(w, b, ux * push * 2, uy * push * 2);
        else
          nudge(w, a, -ux * push * 2, -uy * push * 2);
        continue;
      }
      if (ia !== ib && driving.has(ia ? b.id : a.id)) {
        const [veh, squad, sx, sy] = ia ? [b, a, -ux, -uy] : [a, b, ux, uy];
        const s = stepAside(veh, sx, sy);
        nudge(w, squad, s.x * push * 2, s.y * push * 2);
        continue;
      }
      nudge(w, a, -ux * push, -uy * push);
      nudge(w, b, ux * push, uy * push);
    }
  }
}
function stepAside(v, dx, dy) {
  const fx = sin(v.facing);
  const fy = -cos(v.facing);
  if (dx * fx + dy * fy <= 0)
    return { x: dx, y: dy };
  const rx = -fy;
  const ry = fx;
  const side = dx * rx + dy * ry;
  const s = side < -0.000001 ? -1 : 1;
  return { x: rx * s, y: ry * s };
}
var EDGE = 0.4;
function nudge(w, u, dx, dy) {
  const m = UNITS[u.kind].domain === "air" ? 0.05 : EDGE;
  const nx = Math.min(w.width - m, Math.max(m, u.x + dx));
  const ny = Math.min(w.height - m, Math.max(m, u.y + dy));
  const mc = moveClassOf(u.kind);
  if (!passable(w, Math.floor(nx), Math.floor(ny), mc))
    return;
  if (mc !== "air") {
    const from = regionAt(w, Math.floor(u.x), Math.floor(u.y), mc);
    if (from && regionAt(w, Math.floor(nx), Math.floor(ny), mc) !== from)
      return;
  }
  u.x = nx;
  u.y = ny;
}

// src/sim/transport.ts
function carrierOf(w, unitId) {
  for (const c of w.units.values())
    if (c.passengers?.some((p) => p.id === unitId))
      return c;
  return null;
}
function stowAboard(w, c, squad) {
  if (freeSeats(c) === 0)
    return;
  w.fx.push({ type: "embark", faction: squad.faction, carrierId: c.id, unitId: squad.id, x: squad.x, y: squad.y });
  w.units.delete(squad.id);
  squad.order = { type: "idle" };
  squad.path = null;
  squad.pathGoal = null;
  squad.autoTargetId = null;
  squad.x = c.x;
  squad.y = c.y;
  c.passengers.push(squad);
}
function freeSeats(c) {
  if (c.order.type === "lift")
    return 0;
  return Math.max(0, (UNITS[c.kind].capacity ?? 0) - (c.passengers?.length ?? 0));
}
function isLoaded(c) {
  return (c.passengers?.length ?? 0) > 0;
}
var standable = (w, tx, ty) => passable(w, tx, ty, "foot");
function standOk(w, fr) {
  return (fx, fy) => {
    const [tx, ty] = fr.tile(fx, fy, 1);
    return inBounds(w, tx, ty) && standable(w, tx, ty);
  };
}
function isClear(ok, x, y) {
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  if (!ok(fx, fy))
    return false;
  for (let dy = -1;dy <= 1; dy++)
    for (let dx = -1;dx <= 1; dx++) {
      if (dx === 0 && dy === 0 || ok(fx + dx, fy + dy))
        continue;
      const gx = Math.max(fx + dx - x, 0, x - (fx + dx + 1));
      const gy = Math.max(fy + dy - y, 0, y - (fy + dy + 1));
      if (hypot(gx, gy) < INFANTRY.dropClear - 0.000000001)
        return false;
    }
  return true;
}
var CORNERS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
function clearIn(ok, fx, fy, px, py) {
  if (!ok(fx, fy))
    return null;
  const c = INFANTRY.dropClear;
  const m = (open) => open ? 0.1 : c;
  let x = Math.max(fx + m(ok(fx - 1, fy)), Math.min(fx + 1 - m(ok(fx + 1, fy)), px));
  let y = Math.max(fy + m(ok(fx, fy - 1)), Math.min(fy + 1 - m(ok(fx, fy + 1)), py));
  for (const [dx, dy] of CORNERS) {
    if (ok(fx + dx, fy + dy))
      continue;
    const cx = fx + (dx > 0 ? 1 : 0);
    const cy = fy + (dy > 0 ? 1 : 0);
    const d = hypot(x - cx, y - cy);
    if (d < c) {
      x = cx + (x - cx) / d * c;
      y = cy + (y - cy) / d * c;
    }
  }
  return isClear(ok, x, y) ? { x, y } : { x: fx + 0.5, y: fy + 0.5 };
}
function nearestClear(ok, p, span, maxD) {
  if (isClear(ok, p.x, p.y))
    return { x: p.x, y: p.y };
  const fx0 = Math.floor(p.x);
  const fy0 = Math.floor(p.y);
  let best = null;
  let bestD = Infinity;
  let bdx = 0;
  let bdy = 0;
  for (let r = 0;r <= span && bestD > r - 1; r++)
    for (let dy = -r;dy <= r; dy++)
      for (let dx = -r;dx <= r; dx += Math.abs(dy) === r ? 1 : 2 * r) {
        const q = clearIn(ok, fx0 + dx, fy0 + dy, p.x, p.y);
        if (!q)
          continue;
        const d = hypot(q.x - p.x, q.y - p.y);
        if (d > maxD + 0.000000001)
          continue;
        const nearer = d < bestD - 0.000000001;
        const tie = !nearer && d < bestD + 0.000000001 && (dy < bdy || dy === bdy && dx < bdx);
        if (!nearer && !tie)
          continue;
        bestD = d;
        best = q;
        bdx = dx;
        bdy = dy;
      }
  return best;
}
function dropPoint(w, faction, x, y) {
  const fr = sideFrame(w, faction);
  const ok = standOk(w, fr);
  const p = fr.toFrame({ x, y });
  if (isClear(ok, p.x, p.y))
    return { x, y };
  const R = INFANTRY.dropSearch;
  const at = nearestClear(ok, p, Math.ceil(R), R) ?? nearestClear(ok, p, Math.max(w.width, w.height), Infinity);
  return at ? fr.toWorld(at) : null;
}
var SEAT_STEPS = [0, 1, -1, 2, -2, 3, -3, 4];
var SEAT_RINGS = [0.45, 0.9, 1.35];
function seatSpots(w, faction, x, y, ps) {
  if (ps.length <= 1)
    return ps.map(() => ({ x, y }));
  const fr = sideFrame(w, faction);
  const ok = standOk(w, fr);
  const p = fr.toFrame({ x, y });
  const out = [];
  ps.forEach((u, i) => {
    const a0 = i / ps.length * Math.PI * 2 + 0.4;
    const at = (a, r) => ({ x: p.x + sin(a) * r, y: p.y - cos(a) * r });
    const apart = (q) => out.every((o, j) => hypot(q.x - o.x, q.y - o.y) >= Math.max(0.7, UNITS[u.kind].radius + UNITS[ps[j].kind].radius) - 0.000000001);
    let s = null;
    for (const a of SEAT_RINGS.flatMap((r) => SEAT_STEPS.map((k) => at(a0 + k * Math.PI / 4, r)))) {
      const q = nearestClear(ok, a, 1, 0.4);
      if (q && apart(q)) {
        s = q;
        break;
      }
    }
    out.push(s ?? p);
  });
  return out.map((q) => fr.toWorld(q));
}
function disembarkAll(w, c, x, y, bailout) {
  const ps = c.passengers ?? [];
  const ids = [];
  const seats = seatSpots(w, c.faction, x, y, ps);
  ps.forEach((p, i) => {
    const s = seats[i];
    p.x = s.x;
    p.y = s.y;
    p.facing = p.aim = c.facing;
    p.order = { type: "idle" };
    p.path = null;
    p.pathGoal = null;
    p.autoTargetId = null;
    if (bailout)
      p.hp = Math.min(p.hp, UNITS[p.kind].hp * INFANTRY.bailoutHp);
    w.units.set(p.id, p);
    ids.push(p.id);
  });
  c.passengers = [];
  if (ids.length > 0)
    w.fx.push({ type: "disembark", faction: c.faction, carrierId: c.id, unitIds: ids, x, y, bailout });
  return ids;
}
function canBailOut(w, c) {
  const fr = sideFrame(w, c.faction);
  const p = fr.toFrame(c);
  return standOk(w, fr)(Math.floor(p.x), Math.floor(p.y));
}
function bailOut(w, c) {
  const fr = sideFrame(w, c.faction);
  const at = nearestClear(standOk(w, fr), fr.toFrame(c), 1, 1.5);
  const p = at ? fr.toWorld(at) : { x: c.x, y: c.y };
  return disembarkAll(w, c, p.x, p.y, true);
}
function applyTransportCommand(w, c) {
  if (c.type === "board") {
    const carrier = w.units.get(c.carrierId);
    if (!carrier || carrier.faction !== c.faction || !isTransport(carrier.kind))
      return;
    for (const id of c.unitIds) {
      const u = w.units.get(id);
      if (!u || u.faction !== c.faction || !isInfantry(u.kind))
        continue;
      u.order = { type: "board", carrierId: carrier.id, ticks: 0 };
      u.path = null;
      u.autoTargetId = null;
    }
    return;
  }
  for (const id of c.unitIds) {
    const u = w.units.get(id);
    if (!u || u.faction !== c.faction || !isLoaded(u))
      continue;
    const hasPoint = Number.isFinite(c.x) && Number.isFinite(c.y);
    const at = dropPoint(w, u.faction, hasPoint ? c.x : u.x, hasPoint ? c.y : u.y);
    if (!at)
      continue;
    u.order = { type: "unload", x: at.x, y: at.y, hover: -1 };
    u.path = null;
    u.autoTargetId = null;
  }
}
function backOff(w, c) {
  const d = INFANTRY.dropBackOff;
  return {
    type: "move",
    x: Math.min(w.width - 0.5, Math.max(0.5, c.x - sin(c.facing) * d)),
    y: Math.min(w.height - 0.5, Math.max(0.5, c.y + cos(c.facing) * d))
  };
}
function tickTransport(w) {
  const boardTicks = Math.round(INFANTRY.boardTime * TICK_RATE);
  const hoverTicks = Math.round(INFANTRY.unloadHover * TICK_RATE);
  const boarders = new Map;
  const climbing = new Set;
  const boarding = [];
  const transports = [];
  for (const u of w.units.values()) {
    if (u.order.type === "board")
      boarding.push(u);
    else if (u.passengers)
      transports.push(u);
  }
  for (const u of boarding) {
    if (u.order.type !== "board" || u.hp <= 0)
      continue;
    const o = u.order;
    const c = w.units.get(o.carrierId);
    if (!c || c.hp <= 0 || c.faction !== u.faction || freeSeats(c) === 0) {
      u.order = { type: "idle" };
      u.path = null;
      continue;
    }
    if (isStunned(w, u.id))
      continue;
    const d = hypot(c.x - u.x, c.y - u.y);
    if (d > INFANTRY.boardRange) {
      o.ticks = 0;
      moveUnitToward(w, u, c.x, c.y);
      const list = boarders.get(c.id);
      if (list)
        list.push(u);
      else
        boarders.set(c.id, [u]);
      continue;
    }
    u.path = null;
    climbing.add(c.id);
    if (++o.ticks < boardTicks)
      continue;
    w.fx.push({ type: "embark", faction: u.faction, carrierId: c.id, unitId: u.id, x: u.x, y: u.y });
    w.units.delete(u.id);
    u.order = { type: "idle" };
    u.pathGoal = null;
    u.autoTargetId = null;
    u.x = c.x;
    u.y = c.y;
    c.passengers.push(u);
  }
  for (const c of transports) {
    if (c.hp <= 0)
      continue;
    const stunned = isStunned(w, c.id);
    if (c.order.type === "unload" && !stunned) {
      const o = c.order;
      if (!isLoaded(c)) {
        c.order = { type: "idle" };
      } else if (o.hover < 0) {
        if (moveUnitToward(w, c, o.x, o.y))
          o.hover = 0;
      } else if (++o.hover >= hoverTicks) {
        const at = dropPoint(w, c.faction, o.x, o.y);
        if (at)
          disembarkAll(w, c, at.x, at.y, false);
        c.order = at ? backOff(w, c) : { type: "idle" };
      }
    } else if (c.order.type === "idle" && !stunned && freeSeats(c) > 0 && !climbing.has(c.id)) {
      let near = null;
      let nearD = Infinity;
      for (const s of boarders.get(c.id) ?? []) {
        const d = hypot(s.x - c.x, s.y - c.y);
        if (d < nearD) {
          nearD = d;
          near = s;
        }
      }
      if (near && nearD > INFANTRY.boardRange * 0.6)
        moveUnitToward(w, c, near.x, near.y);
    }
    for (const p of c.passengers ?? []) {
      p.x = c.x;
      p.y = c.y;
    }
  }
}

// src/sim/combat.ts
var canHit = (targets, domain) => targets === "both" || targets === domain;
function unitDomain(u) {
  return domainOf(u);
}
function findTarget(w, faction, targets, x, y, radius, minRange = 0, shooter) {
  if (targets === "none")
    return null;
  let best = null;
  let bestScore = Infinity;
  const range = shooter ? UNITS[shooter.kind].range : Infinity;
  for (const u of w.units.values()) {
    if (u.faction === faction || !canHit(targets, unitDomain(u)))
      continue;
    const d = hypot(u.x - x, u.y - y);
    if (d > radius || d < minRange)
      continue;
    if (concealedFrom(w, faction, u))
      continue;
    if (shooter && d > range && (ignoring(w, shooter, u.id) || !engageable(w, shooter, u.id)))
      continue;
    const st = UNITS[u.kind];
    const s = d + (st.heal ? -COMBAT.healerPriority : st.targets === "none" ? 1.5 : 0);
    if (s < bestScore) {
      bestScore = s;
      best = { id: u.id, x: u.x, y: u.y, dist: d };
    }
  }
  if (canHit(targets, "ground"))
    for (const b of w.buildings.values()) {
      if (b.faction === faction)
        continue;
      const d = distToBuilding(b, x, y);
      if (d > radius || d < minRange)
        continue;
      const s = d + (BUILDINGS[b.kind].targets === "none" ? 3 : 1);
      if (s < bestScore) {
        bestScore = s;
        const c = buildingCenter(b);
        best = { id: b.id, x: c.x, y: c.y, dist: d };
      }
    }
  return best;
}
function engageable(w, u, id, range = UNITS[u.kind].range) {
  const t = targetPosition(w, id);
  if (!t)
    return false;
  const b = w.buildings.get(id);
  if (b)
    return canGetWithin(w, moveClassOf(u.kind), u.x, u.y, t.x, t.y, range, (px, py) => distToBuilding(b, px, py), BUILDINGS[b.kind].size);
  return canGetWithin(w, moveClassOf(u.kind), u.x, u.y, t.x, t.y, range);
}
var ignoring = (w, u, id) => !!u.ignore && u.ignore.id === id && w.tick < u.ignore.until;
function crewing(w, u) {
  if (!isInfantry(u.kind))
    return false;
  const r = OBJECTIVES.uplink.radius;
  for (const l of w.objectives.uplinks)
    if (l.infantryOnly && (l.owner === u.faction || l.pushing === u.faction) && hypot(u.x - l.x, u.y - l.y) <= r)
      return true;
  return false;
}
function targetPosition(w, id) {
  const u = w.units.get(id);
  if (u)
    return { x: u.x, y: u.y, domain: unitDomain(u) };
  const b = w.buildings.get(id);
  if (b) {
    const c = buildingCenter(b);
    return { x: c.x, y: c.y, domain: "ground" };
  }
  return null;
}
function distTo(w, id, x, y) {
  const b = w.buildings.get(id);
  if (b)
    return distToBuilding(b, x, y);
  const u = w.units.get(id);
  return u ? hypot(u.x - x, u.y - y) : Infinity;
}
function damageMult(w, id, dmgType) {
  const u = w.units.get(id);
  let armor = "structure";
  let cover = 1;
  if (u) {
    armor = UNITS[u.kind].armor;
    if (unitDomain(u) === "ground") {
      const t = terrainAt(w, Math.floor(u.x), Math.floor(u.y));
      cover = t === 6 /* Forest */ && isInfantry(u.kind) ? INFANTRY.woodsCover : TERRAIN[t].cover;
    }
  }
  return DAMAGE_VS[dmgType][armor] * cover;
}
function applyDamage(w, id, damage, attackerId, incidents) {
  const u = w.units.get(id);
  if (u) {
    u.hp -= damage;
    u.damagedTick = w.tick;
    u.lastAttackerId = attackerId;
    incidents.push({ victimId: id, attackerId });
    w.fx.push({ type: "hit", faction: u.faction, id, x: u.x, y: u.y, building: false, attackerId });
    return;
  }
  const b = w.buildings.get(id);
  if (b) {
    b.hp -= damage;
    b.damagedTick = w.tick;
    b.lastAttackerId = attackerId;
    incidents.push({ victimId: id, attackerId });
    const c = buildingCenter(b);
    w.fx.push({ type: "hit", faction: b.faction, id, x: c.x, y: c.y, building: true, attackerId });
  }
}
function splash(w, faction, x, y, radius, damage, dmgType, targets, attackerId, incidents) {
  for (const u of w.units.values()) {
    if (u.faction === faction || !canHit(targets, unitDomain(u)))
      continue;
    const d = hypot(u.x - x, u.y - y);
    if (d > radius)
      continue;
    applyDamage(w, u.id, damage * (1 - 0.5 * (d / radius)) * damageMult(w, u.id, dmgType), attackerId, incidents);
  }
  if (canHit(targets, "ground"))
    for (const b of w.buildings.values()) {
      if (b.faction === faction)
        continue;
      const d = distToBuilding(b, x, y);
      if (d > radius)
        continue;
      applyDamage(w, b.id, damage * (1 - 0.5 * (d / radius)) * damageMult(w, b.id, dmgType), attackerId, incidents);
    }
}
function areaBlast(w, faction, x, y, radius, damage, dmgType, targets, attackerId) {
  const incidents = [];
  splash(w, faction, x, y, radius, damage, dmgType, targets, attackerId, incidents);
  retaliate(w, incidents);
  return incidents.length;
}
function strikeDamage(w, hits, attackerId) {
  const incidents = [];
  for (const h of hits)
    applyDamage(w, h.id, h.damage, attackerId, incidents);
  retaliate(w, incidents);
}
function fire(w, attacker, targetId, incidents, mount) {
  const isUnit = "unit" in attacker;
  const holder = isUnit ? attacker.unit : attacker.building;
  const clock2 = mount?.state ?? holder;
  if (clock2.cooldown > 0)
    return;
  const stats = mount?.stats ?? (isUnit ? UNITS[attacker.unit.kind] : BUILDINGS[attacker.building.kind]);
  const src = isUnit ? { x: attacker.unit.x, y: attacker.unit.y } : buildingCenter(attacker.building);
  const t = targetPosition(w, targetId);
  if (!t)
    return;
  const interval = stats.shotInterval ?? COMBAT.shotInterval;
  clock2.cooldown = Math.max(1, Math.round(interval * TICK_RATE));
  const angle = atan2(t.x - src.x, -(t.y - src.y));
  holder.firedTick = w.tick;
  clock2.firedTick = w.tick;
  if (mount) {} else if (isUnit) {
    const u = attacker.unit;
    u.aim = angle;
    if (!UNITS[u.kind].turret)
      u.facing = angle;
  } else {
    attacker.building.facing = angle;
  }
  const rank = isUnit ? attacker.unit.rank : 0;
  const squad = isUnit ? squadFirepower(attacker.unit) : 1;
  const damage = shotDamage(stats) * (1 + rank * COMBAT.rankDamage) * rulesOf(w).dmgMult * squad;
  const dmgType = stats.dmgType ?? "kinetic";
  const fromAir = isUnit && unitDomain(attacker.unit) === "air";
  const vsAir = t.domain === "air" ? stats.airMult ?? 1 : 1;
  const fx = stats.fx ?? "cannon";
  w.fx.push({
    type: "shot",
    fx,
    x: src.x,
    y: src.y,
    tx: t.x,
    ty: t.y,
    fromAir,
    air: t.domain === "air",
    sourceId: holder.id
  });
  if (stats.projectileSpeed) {
    w.projectiles.push({
      id: w.nextId++,
      faction: holder.faction,
      fx,
      sx: src.x,
      sy: src.y,
      x: src.x,
      y: src.y,
      tx: t.x,
      ty: t.y,
      speed: stats.projectileSpeed / TICK_RATE,
      damage,
      splash: stats.splash ?? 0.6,
      dmgType,
      targets: stats.targets,
      sourceId: holder.id,
      fromAir
    });
    return;
  }
  if (stats.splash) {
    splash(w, holder.faction, t.x, t.y, stats.splash, damage, dmgType, stats.targets, holder.id, incidents);
    return;
  }
  applyDamage(w, targetId, damage * vsAir * damageMult(w, targetId, dmgType), holder.id, incidents);
}
function tickProjectiles(w, incidents) {
  const keep = [];
  for (const p of w.projectiles) {
    const d = hypot(p.tx - p.x, p.ty - p.y);
    if (d > p.speed) {
      p.x += (p.tx - p.x) / d * p.speed;
      p.y += (p.ty - p.y) / d * p.speed;
      keep.push(p);
      continue;
    }
    splash(w, p.faction, p.tx, p.ty, p.splash, p.damage, p.dmgType, p.targets, p.sourceId, incidents);
    w.fx.push({ type: "explosion", x: p.tx, y: p.ty, size: p.splash, air: false, kind: "impact" });
  }
  w.projectiles = keep;
}
function tickHealer(w, u, engaged) {
  const stats = UNITS[u.kind];
  const reach = stats.range + COMBAT.acquireBonus + (u.order.type === "idle" ? 2.5 : 0);
  let best = null;
  let bestScore = Infinity;
  for (const o of w.units.values()) {
    if (o.faction !== u.faction || o.id === u.id || o.hp >= UNITS[o.kind].hp)
      continue;
    if (o.goliath && isStunned(w, o.id))
      continue;
    const d = hypot(o.x - u.x, o.y - u.y);
    if (d > reach)
      continue;
    const s = d + o.hp / UNITS[o.kind].hp * 3 - (o.goliath ? repairUrgency(o) : 0);
    if (s < bestScore) {
      bestScore = s;
      best = { id: o.id, x: o.x, y: o.y, d, unit: true };
    }
  }
  for (const b of w.buildings.values()) {
    if (b.faction !== u.faction || b.hp >= BUILDINGS[b.kind].hp)
      continue;
    const d = distToBuilding(b, u.x, u.y);
    if (d > reach)
      continue;
    const s = d + 2 + b.hp / BUILDINGS[b.kind].hp * 3;
    if (s < bestScore) {
      bestScore = s;
      const c = buildingCenter(b);
      best = { id: b.id, x: c.x, y: c.y, d, unit: false };
    }
  }
  if (!best)
    return;
  if (best.d > stats.range) {
    if (u.order.type === "idle") {
      moveUnitToward(w, u, best.x, best.y);
      engaged.add(u.id);
    }
    return;
  }
  engaged.add(u.id);
  u.aim = atan2(best.x - u.x, -(best.y - u.y));
  const amount = (stats.heal ?? 0) / TICK_RATE;
  if (best.unit) {
    const o = w.units.get(best.id);
    o.hp = Math.min(UNITS[o.kind].hp, o.hp + amount);
  } else {
    const b = w.buildings.get(best.id);
    b.hp = Math.min(BUILDINGS[b.kind].hp, b.hp + amount);
  }
  if (w.tick % 5 === 0)
    w.fx.push({ type: "heal", x: u.x, y: u.y, tx: best.x, ty: best.y, sourceId: u.id, targetId: best.id });
}
function tickCombat(w) {
  const engaged = new Set;
  const incidents = [];
  const healers = [];
  for (const u of w.units.values())
    if (UNITS[u.kind].heal)
      healers.push(u);
  for (const u of w.units.values()) {
    if (u.cooldown > 0)
      u.cooldown--;
    if (u.goliath) {
      for (const k of GOLIATH_WEAPONS)
        if (u.goliath.weapons[k].cooldown > 0)
          u.goliath.weapons[k].cooldown--;
    }
    if (isStunned(w, u.id)) {
      engaged.add(u.id);
      continue;
    }
    const stats = UNITS[u.kind];
    if (u.rank >= 3 && !u.goliath && u.hp < stats.hp && w.tick % TICK_RATE === 0)
      u.hp = Math.min(stats.hp, u.hp + stats.hp * COMBAT.eliteRegen);
    if (u.goliath) {
      if (goliathWeapons(w, u, healers, incidents))
        engaged.add(u.id);
      continue;
    }
    if (stats.heal) {
      tickHealer(w, u, engaged);
      continue;
    }
    if (stats.targets === "none")
      continue;
    const minRange = stats.minRange ?? 0;
    let targetId = null;
    if (u.order.type === "attack") {
      const t = targetPosition(w, u.order.targetId);
      if (!t || !canHit(stats.targets, t.domain) || hidden(w, u.faction, u.order.targetId)) {
        u.order = { type: "idle" };
      } else if (distTo(w, u.order.targetId, u.x, u.y) > stats.range && !engageable(w, u, u.order.targetId)) {
        u.order = { type: "idle" };
      } else {
        targetId = u.order.targetId;
      }
    }
    if (targetId === null) {
      const acquire = stats.range + COMBAT.acquireBonus;
      if (u.autoTargetId !== null) {
        const d2 = distTo(w, u.autoTargetId, u.x, u.y);
        if (d2 > acquire + 0.5 || d2 < minRange || hidden(w, u.faction, u.autoTargetId))
          u.autoTargetId = null;
        else if (d2 > stats.range && !engageable(w, u, u.autoTargetId))
          u.autoTargetId = null;
        else if (healers.length > 0) {
          const cur = w.units.get(u.autoTargetId);
          if (!cur || !UNITS[cur.kind].heal)
            u.autoTargetId = healerInRange(u, healers, stats.range, minRange) ?? u.autoTargetId;
        }
      }
      if (u.autoTargetId === null && (u.order.type === "idle" || u.order.type === "attackMove")) {
        const found = findTarget(w, u.faction, stats.targets, u.x, u.y, acquire, minRange, u);
        u.autoTargetId = found?.id ?? null;
      }
      targetId = u.autoTargetId;
    }
    if (targetId === null)
      continue;
    const d = distTo(w, targetId, u.x, u.y);
    if (d <= stats.range && d >= minRange) {
      engaged.add(u.id);
      fire(w, { unit: u }, targetId, incidents);
    } else if (u.order.type === "idle" && d > stats.range && targetId === u.autoTargetId) {
      const t = targetPosition(w, targetId);
      if (t && !crewing(w, u) && moveUnitToward(w, u, t.x, t.y) && distTo(w, targetId, u.x, u.y) > stats.range) {
        u.ignore = { id: targetId, until: w.tick + IGNORE_TICKS };
        u.autoTargetId = null;
      }
      engaged.add(u.id);
    }
  }
  for (const b of w.buildings.values()) {
    if (b.cooldown > 0)
      b.cooldown--;
    if (isStunned(w, b.id))
      continue;
    const stats = BUILDINGS[b.kind];
    if (stats.targets === "none")
      continue;
    const c = buildingCenter(b);
    const found = findTarget(w, b.faction, stats.targets, c.x, c.y, stats.range + BUILDINGS[b.kind].size / 2 - 0.5);
    if (found)
      fire(w, { building: b }, found.id, incidents);
  }
  tickProjectiles(w, incidents);
  retaliate(w, incidents);
  return engaged;
}
function goliathWeapons(w, u, healers, incidents) {
  const g = u.goliath;
  let ordered = null;
  if (u.order.type === "attack") {
    const id = u.order.targetId;
    const t = targetPosition(w, id);
    const reach = t ? goliathReachAt(u, t.domain) : 0;
    if (!t || hidden(w, u.faction, id) || reach === 0) {
      u.order = { type: "idle" };
    } else if (distTo(w, id, u.x, u.y) > reach && !engageable(w, u, id, reach)) {
      u.order = { type: "idle" };
    } else
      ordered = id;
  }
  let holds = false;
  let aimAt = null;
  for (const k of GOLIATH_WEAPONS) {
    const ws = g.weapons[k];
    if (!weaponReady(u, k)) {
      ws.targetId = null;
      continue;
    }
    const st = GOLIATH.weapons[k];
    const minR = st.minRange ?? 0;
    const inReach = (id) => {
      if (id === null)
        return false;
      const t = targetPosition(w, id);
      if (!t || !canHit(st.targets, t.domain) || hidden(w, u.faction, id))
        return false;
      const d = distTo(w, id, u.x, u.y);
      return d <= st.range && d >= minR;
    };
    let tid = null;
    if (inReach(ordered))
      tid = ordered;
    else {
      const keep = inReach(ws.targetId) ? ws.targetId : null;
      const cur = keep !== null ? w.units.get(keep) : undefined;
      if (keep !== null && (healers.length === 0 || cur && UNITS[cur.kind].heal))
        tid = keep;
      else {
        const found = findTarget(w, u.faction, st.targets, u.x, u.y, st.range, minR);
        const fu = found ? w.units.get(found.id) : undefined;
        tid = keep !== null && !(fu && UNITS[fu.kind].heal) ? keep : found?.id ?? null;
      }
    }
    ws.targetId = tid;
    if (tid === null)
      continue;
    if (tid === ordered || u.order.type === "attackMove")
      holds = true;
    fire(w, { unit: u }, tid, incidents, { stats: st, state: ws });
    aimAt = targetPosition(w, tid);
  }
  if (aimAt)
    u.aim = atan2(aimAt.x - u.x, -(aimAt.y - u.y));
  return holds;
}
function healerInRange(u, healers, range, minRange) {
  const targets = UNITS[u.kind].targets;
  let best = null;
  let bestD = range;
  for (const h of healers) {
    if (h.faction === u.faction || !canHit(targets, unitDomain(h)))
      continue;
    const d = hypot(h.x - u.x, h.y - u.y);
    if (d <= bestD && d >= minRange) {
      bestD = d;
      best = h.id;
    }
  }
  return best;
}
function hidden(w, faction, id) {
  const u = w.units.get(id);
  return !!u && concealedFrom(w, faction, u);
}
function retaliate(w, incidents) {
  const seen = new Set;
  for (const { victimId, attackerId } of incidents) {
    if (seen.has(victimId))
      continue;
    seen.add(victimId);
    const attacker = targetPosition(w, attackerId);
    if (!attacker)
      continue;
    const victim = w.units.get(victimId) ?? null;
    const vb = victim ? null : w.buildings.get(victimId) ?? null;
    const vx = victim ? victim.x : vb ? buildingCenter(vb).x : 0;
    const vy = victim ? victim.y : vb ? buildingCenter(vb).y : 0;
    const faction = victim?.faction ?? vb?.faction;
    for (const u of w.units.values()) {
      if (u.faction !== faction || u.order.type !== "idle")
        continue;
      if (u.goliath && !canWalk(u))
        continue;
      const stats = UNITS[u.kind];
      if (stats.targets === "none" || !canHit(stats.targets, attacker.domain))
        continue;
      const self = u.id === victimId;
      if (!self && hypot(u.x - vx, u.y - vy) > COMBAT.assistRadius)
        continue;
      if (hypot(u.x - attacker.x, u.y - attacker.y) > COMBAT.retaliateRange)
        continue;
      if (u.autoTargetId !== null && distTo(w, u.autoTargetId, u.x, u.y) <= stats.range)
        continue;
      if (hypot(u.x - attacker.x, u.y - attacker.y) > stats.range && !engageable(w, u, attackerId))
        continue;
      u.order = { type: "attack", targetId: attackerId };
      u.path = null;
    }
  }
}
function rankFor(u) {
  const cost = UNITS[u.kind].cost;
  let r = 0;
  for (const k of COMBAT.rankXp)
    if (u.xp >= k * cost)
      r++;
  return r;
}
function creditKill(w, victimFaction, killerId, victimCost, building) {
  const by = isMulti(w) ? sideOfId(w, killerId) : otherSide(victimFaction);
  if (by && by !== victimFaction) {
    const stats = w.factions[by].stats;
    if (building)
      stats.buildingsKilled++;
    else
      stats.unitsKilled++;
  }
  if (killerId === null)
    return;
  const k = w.units.get(killerId);
  if (!k || k.faction === victimFaction)
    return;
  k.kills++;
  k.xp += victimCost;
  const r = rankFor(k);
  if (r > k.rank) {
    k.rank = r;
    if (k.hp > 0)
      w.fx.push({ type: "rankUp", id: k.id });
  }
}
function sideOfId(w, id) {
  if (id === null)
    return null;
  return (w.units.get(id) ?? w.buildings.get(id))?.faction ?? null;
}
function killerOf(w, id) {
  const k = killerOfId(w, id);
  return isMulti(w) ? { ...k, by: sideOfId(w, id) } : k;
}
function killerOfId(w, id) {
  if (id === null)
    return { killerId: null, killerKind: null };
  const u = w.units.get(id);
  if (u)
    return { killerId: id, killerKind: u.kind };
  return w.buildings.has(id) ? { killerId: id, killerKind: null } : { killerId: null, killerKind: null };
}
function cleanupDeaths(w) {
  dropLifts(w);
  const deadUnits = [];
  const deadBuildings = [];
  const lost = [];
  const bail = [];
  for (const u of w.units.values()) {
    if (u.hp > 0)
      continue;
    const killer = killerOf(w, u.lastAttackerId);
    deadUnits.push({ u, killer });
    creditKill(w, u.faction, u.lastAttackerId, UNITS[u.kind].cost, false);
    if (!u.passengers?.length)
      continue;
    if (canBailOut(w, u))
      bail.push(u);
    else
      for (const p of u.passengers) {
        lost.push({ u: p, carrier: u, killer });
        creditKill(w, p.faction, u.lastAttackerId, UNITS[p.kind].cost, false);
      }
  }
  for (const b of w.buildings.values()) {
    if (b.hp > 0)
      continue;
    deadBuildings.push({ b, killer: killerOf(w, b.lastAttackerId) });
    creditKill(w, b.faction, b.lastAttackerId, BUILDINGS[b.kind].cost || 500, true);
  }
  for (const { u, killer } of deadUnits) {
    const id = u.id;
    w.units.delete(id);
    unplant(w, u);
    w.factions[u.faction].stats.unitsLost++;
    const air = unitDomain(u) === "air";
    w.fx.push({ type: "explosion", x: u.x, y: u.y, size: UNITS[u.kind].radius * 2, air, kind: "unit" });
    w.fx.push({
      type: "death",
      id,
      faction: u.faction,
      unitKind: u.kind,
      buildingKind: null,
      x: u.x,
      y: u.y,
      air,
      value: UNITS[u.kind].cost,
      ...killer,
      rank: u.rank,
      kills: u.kills,
      ...u.free ? { free: true } : {}
    });
    leaveWreck(w, u);
  }
  for (const c of bail)
    bailOut(w, c);
  for (const { u, carrier, killer } of lost) {
    w.factions[u.faction].stats.unitsLost++;
    w.fx.push({
      type: "death",
      id: u.id,
      faction: u.faction,
      unitKind: u.kind,
      buildingKind: null,
      x: carrier.x,
      y: carrier.y,
      air: true,
      value: UNITS[u.kind].cost,
      ...killer,
      rank: u.rank,
      kills: u.kills,
      ...u.free ? { free: true } : {}
    });
  }
  for (const { carrier } of lost)
    carrier.passengers = [];
  for (const { b, killer } of deadBuildings) {
    if (b.kind === "gantry")
      scatterGantry(w, b);
    removeBuilding(w, b);
    w.factions[b.faction].stats.buildingsLost++;
    const value = BUILDINGS[b.kind].cost || 500;
    const c = buildingCenter(b);
    w.fx.push({ type: "explosion", x: c.x, y: c.y, size: BUILDINGS[b.kind].size, air: false, kind: "building" });
    w.fx.push({
      type: "death",
      id: b.id,
      faction: b.faction,
      unitKind: null,
      buildingKind: b.kind,
      x: c.x,
      y: c.y,
      air: false,
      value,
      ...killer,
      rank: 0,
      kills: 0
    });
    if (b.kind === "hq" && w.winner === null && !hasGoliath(w, b.faction) && !isMulti(w))
      w.winner = otherSide(b.faction);
  }
  if (isMulti(w))
    return settleFreeForAll(w);
  for (const { u } of deadUnits)
    if (u.goliath && w.winner === null && !hqOf(w, u.faction) && !hasGoliath(w, u.faction) && (!w.survival || u.faction === w.survival.defender))
      w.winner = otherSide(u.faction);
}
var isOut = (w, f) => !!w.out?.some((o) => o.faction === f);
var sidesLeft = (w) => sidesOf(w).filter((f) => !isOut(w, f));
function eliminate(w, f, by) {
  if (isOut(w, f))
    return;
  (w.out ??= []).push({ faction: f, tick: w.tick, by });
  w.fx.push({ type: "eliminated", faction: f, by, left: sidesLeft(w).length });
  for (const l of w.objectives.uplinks) {
    if (l.bar === f) {
      l.bar = null;
      l.progress = 0;
    }
    if (l.pushing === f)
      l.pushing = null;
    if (l.owner !== f)
      continue;
    l.owner = null;
    w.fx.push({ type: "uplinkFlip", id: l.id, x: l.x, y: l.y, owner: null, prev: f, by: by ?? f });
  }
  w.factions[f].pending = null;
  selfDestruct(w, f);
}
function selfDestruct(w, f) {
  let any = false;
  for (const u of w.units.values())
    if (u.faction === f) {
      u.hp = 0;
      u.lastAttackerId = null;
      any = true;
    }
  for (const b of w.buildings.values())
    if (b.faction === f) {
      b.hp = 0;
      b.lastAttackerId = null;
      any = true;
    }
  return any;
}
function settleFreeForAll(w) {
  if (w.winner)
    return;
  let again = false;
  for (const f of sidesOf(w)) {
    if (isOut(w, f)) {
      if (selfDestruct(w, f))
        again = true;
      continue;
    }
    if (hqOf(w, f) || hasGoliath(w, f))
      continue;
    let by = null;
    for (const ev of w.fx)
      if (ev.type === "death" && ev.faction === f && (ev.buildingKind === "hq" || ev.unitKind === "goliath"))
        by = ev.by ?? null;
    eliminate(w, f, by);
    again = true;
  }
  if (again)
    return cleanupDeaths(w);
  const left = sidesLeft(w);
  if (left.length <= 1)
    w.winner = left[0] ?? "draw";
}

// src/sim/infantry.ts
var isInfantry = (kind) => (UNITS[kind].squad ?? 0) > 0;
var squadSize = (kind) => UNITS[kind].squad ?? 1;
function squadAlive(u) {
  const n = squadSize(u.kind);
  if (u.hp <= 0)
    return 0;
  return Math.max(1, Math.min(n, Math.ceil(n * u.hp / UNITS[u.kind].hp - 0.000000001)));
}
function squadFirepower(u) {
  const n = squadSize(u.kind);
  return n <= 1 ? 1 : squadAlive(u) / n;
}
var isTransport = (kind) => (UNITS[kind].capacity ?? 0) > 0;
function unitSeenBy(w, faction, u) {
  if (u.faction === faction || UNITS[u.kind].alwaysVisible)
    return true;
  if (!isVisible(w, faction, Math.floor(u.x), Math.floor(u.y)))
    return false;
  return !concealedFrom(w, faction, u);
}
var conceals = (kind) => kind === "sniper";
function concealedFrom(w, faction, u) {
  if (u.faction === faction || !conceals(u.kind))
    return false;
  if (terrainAt(w, Math.floor(u.x), Math.floor(u.y)) !== 6 /* Forest */)
    return false;
  if (w.tick - u.firedTick <= INFANTRY.concealAfterShot * TICK_RATE)
    return false;
  const r = INFANTRY.concealRadius;
  for (const o of w.units.values()) {
    if (o.faction !== faction)
      continue;
    const dx = o.x - u.x;
    const dy = o.y - u.y;
    if (dx * dx + dy * dy <= r * r)
      return false;
  }
  for (const b of w.buildings.values())
    if (b.faction === faction && distToBuilding(b, u.x, u.y) <= r)
      return false;
  return true;
}
var crushes = (kind) => kind === "mastodon";
var CRUSH_FX_EVERY = 5;
function tickCrush(w, moved) {
  const damage = INFANTRY.crushDps / TICK_RATE;
  for (const t of moved) {
    if (t.hp <= 0 || !crushes(t.kind))
      continue;
    const reach = UNITS[t.kind].radius + INFANTRY.crushReach;
    const hits = [];
    for (const v of w.units.values()) {
      if (v.faction === t.faction || v.hp <= 0 || !isInfantry(v.kind))
        continue;
      const dx = v.x - t.x;
      const dy = v.y - t.y;
      if (dx > reach || dx < -reach || dy > reach || dy < -reach || hypot(dx, dy) > reach)
        continue;
      const rolling = v.lastAttackerId === t.id && v.damagedTick >= w.tick - 1;
      if (!rolling || w.tick % CRUSH_FX_EVERY === 0)
        w.fx.push({ type: "crush", faction: v.faction, id: v.id, attackerId: t.id, x: v.x, y: v.y });
      hits.push({ id: v.id, damage });
    }
    if (hits.length > 0)
      strikeDamage(w, hits, t.id);
  }
}

// src/sim/objectives.ts
var U = OBJECTIVES.uplink;
var D = OBJECTIVES.drops;
var ticks2 = (secs) => Math.round(secs * TICK_RATE);
var CRATE_REWARDS = ["scrap", "veterans", "repair", "charge", "unit"];
var CRATE_NAMES = {
  scrap: `${D.scrap} scrap`,
  veterans: "Veterans",
  repair: "Field Repair",
  charge: `+${D.charge} command charge`,
  unit: "Free Lancer"
};
function createObjectiveState() {
  const zero = () => ({ uplinkScrap: 0, crateScrap: 0, captures: 0, crates: 0 });
  return { uplinks: [], crates: [], dropSites: [], drops: 0, lastSite: -1, stats: perSide(zero) };
}
function mirrorPoint(w, x, y) {
  return { x: w.width - x, y: w.height - y };
}
function setupObjectives(w, uplinks, dropSites) {
  const o = w.objectives;
  const add = (x, y, extra) => {
    if (o.uplinks.some((l) => hypot(l.x - x, l.y - y) < 0.01))
      return;
    o.uplinks.push({ id: w.nextId++, x, y, owner: null, progress: 0, pushing: null, contested: false, ...extra });
  };
  for (const def of uplinks) {
    const [x, y] = Array.isArray(def) ? def : def.at;
    const extra = {};
    if (!Array.isArray(def)) {
      if (def.infantryOnly)
        Object.assign(extra, { infantryOnly: true, crewed: false });
      if (def.income !== undefined)
        extra.income = def.income;
      if (def.charge !== undefined)
        extra.charge = def.charge;
    }
    if (isMulti(w)) {
      extra.bar = null;
      for (const q of symmetryTurns(w)) {
        const p = turnPoint(q, w.width, w.height, x, y);
        add(p.x, p.y, extra);
      }
      continue;
    }
    add(x, y, extra);
    const m = mirrorPoint(w, x, y);
    add(m.x, m.y, extra);
  }
  o.dropSites = dropSites.map(([x, y]) => ({ x, y }));
}
function captureWeight(l, kind) {
  if (kind === "harvester")
    return 0;
  if (isInfantry(kind))
    return INFANTRY.captureWeight;
  if (l.infantryOnly)
    return 0;
  return UNITS[kind].domain === "air" ? U.airWeight : 1;
}
var uplinkPay = (l) => l.income ?? U.income;
function dropLandTick(k) {
  return ticks2(D.first + k * D.every);
}
function dropAnnounceTick(k) {
  return dropLandTick(k) - ticks2(D.warning);
}
function presence(w, l) {
  const p = Object.fromEntries(sidesOf(w).map((f) => [f, 0]));
  const r2 = U.radius * U.radius;
  for (const u of w.units.values()) {
    const k = captureWeight(l, u.kind);
    if (k === 0)
      continue;
    const dx = u.x - l.x;
    const dy = u.y - l.y;
    if (dx * dx + dy * dy > r2)
      continue;
    p[u.faction] += k;
  }
  return p;
}
var sign = (f) => f === "blue" ? 1 : -1;
var restOf = (l) => l.owner ? 100 * sign(l.owner) : 0;
function towards(v, target, d) {
  return v < target ? Math.min(target, v + d) : Math.max(target, v - d);
}
function uplinkBar(l) {
  if (l.bar !== undefined)
    return { side: l.progress > 0 ? l.bar : null, fill: l.progress };
  return { side: l.progress > 0 ? "blue" : l.progress < 0 ? "red" : null, fill: Math.abs(l.progress) };
}
function tickUplink(w, l) {
  if (isMulti(w))
    return tickUplinkMulti(w, l);
  const p = presence(w, l);
  const dt = 1 / TICK_RATE;
  if (l.infantryOnly)
    l.crewed = !!l.owner && (p[l.owner] ?? 0) > 0;
  l.contested = p.blue > 0 && p.red > 0;
  if (l.contested) {
    l.pushing = null;
  } else if (p.blue > 0 || p.red > 0) {
    const f = p.blue > 0 ? "blue" : "red";
    const target = 100 * sign(f);
    if (l.progress === target)
      l.pushing = null;
    else {
      if (l.pushing !== f)
        w.fx.push({ type: "uplinkContest", id: l.id, x: l.x, y: l.y, faction: f, owner: l.owner });
      l.pushing = f;
      l.progress = towards(l.progress, target, Math.min(U.maxRate, U.perUnit * p[f]) * dt);
    }
  } else {
    l.pushing = null;
    l.progress = towards(l.progress, restOf(l), U.settle * dt);
  }
  if (l.owner && l.progress * sign(l.owner) <= 0) {
    const prev = l.owner;
    l.owner = null;
    w.fx.push({ type: "uplinkFlip", id: l.id, x: l.x, y: l.y, owner: null, prev, by: prev === "blue" ? "red" : "blue" });
  }
  if (!l.owner && Math.abs(l.progress) >= 100) {
    const f = l.progress > 0 ? "blue" : "red";
    l.owner = f;
    if (l.infantryOnly)
      l.crewed = p[f] > 0;
    w.objectives.stats[f].captures++;
    w.fx.push({ type: "uplinkFlip", id: l.id, x: l.x, y: l.y, owner: f, prev: null, by: f });
  }
}
function tickUplinkMulti(w, l) {
  const p = presence(w, l);
  const dt = 1 / TICK_RATE;
  if (l.infantryOnly)
    l.crewed = !!l.owner && (p[l.owner] ?? 0) > 0;
  const inside = sidesOf(w).filter((f) => (p[f] ?? 0) > 0);
  l.contested = inside.length > 1;
  const bar = l.bar ?? null;
  if (l.contested)
    l.pushing = null;
  else if (inside.length === 1) {
    const f = inside[0];
    if (bar === f && l.progress >= 100)
      l.pushing = null;
    else {
      if (l.pushing !== f)
        w.fx.push({ type: "uplinkContest", id: l.id, x: l.x, y: l.y, faction: f, owner: l.owner });
      l.pushing = f;
      const v = towards(bar === f || bar === null ? l.progress : -l.progress, 100, Math.min(U.maxRate, U.perUnit * (p[f] ?? 0)) * dt);
      if (v > 0)
        l.bar = f;
      else if (v === 0)
        l.bar = null;
      l.progress = Math.abs(v);
    }
  } else {
    l.pushing = null;
    l.progress = towards(l.progress, l.owner ? 100 : 0, U.settle * dt);
    if (l.progress === 0 && !l.owner)
      l.bar = null;
  }
  if (l.owner && (l.bar !== l.owner || l.progress <= 0)) {
    const prev = l.owner;
    l.owner = null;
    w.fx.push({ type: "uplinkFlip", id: l.id, x: l.x, y: l.y, owner: null, prev, by: l.pushing ?? prev });
  }
  if (!l.owner && l.bar && l.progress >= 100) {
    const f = l.bar;
    l.owner = f;
    if (l.infantryOnly)
      l.crewed = (p[f] ?? 0) > 0;
    w.objectives.stats[f].captures++;
    w.fx.push({ type: "uplinkFlip", id: l.id, x: l.x, y: l.y, owner: f, prev: null, by: f });
  }
}
function tickObjectives(w) {
  const o = w.objectives;
  if (o.uplinks.length === 0 && o.dropSites.length === 0 && o.crates.length === 0)
    return;
  for (const l of o.uplinks)
    tickUplink(w, l);
  const paySecond = (w.tick + 1) % TICK_RATE === 0;
  for (const l of o.uplinks) {
    if (!l.owner)
      continue;
    if (l.infantryOnly && !l.crewed)
      continue;
    const m = w.powers.meter;
    m[l.owner] = Math.min(POWERS.meterMax, m[l.owner] + (l.charge ?? U.charge) / TICK_RATE);
    if (!paySecond)
      continue;
    const f = w.factions[l.owner];
    const amount = uplinkPay(l) * f.incomeMult;
    f.scrap += amount;
    o.stats[l.owner].uplinkScrap += amount;
  }
  if (o.dropSites.length > 0 && w.tick >= dropAnnounceTick(o.drops))
    announceDrop(w);
  if (o.crates.length > 0)
    tickCrates(w);
}
function rollReward(w, k) {
  const weights = D.weights;
  const total = CRATE_REWARDS.reduce((s, r) => s + (weights[r] ?? 0), 0);
  let x = worldRandom(w, "drop-reward", k) * total;
  for (const r of CRATE_REWARDS) {
    x -= weights[r] ?? 0;
    if (x < 0)
      return r;
  }
  return "scrap";
}
function pickDropSite(w, k, last) {
  const n = w.objectives.dropSites.length;
  let i = worldPick(w, n, "drop-site", k);
  if (n > 1 && i === last)
    i = (i + 1 + worldPick(w, n - 1, "drop-site-reroll", k)) % n;
  return i;
}
function crateSpot(w, x, y, mirrored = false, q = mirrored ? 2 : 0) {
  const ok = (tx2, ty2) => inBounds(w, tx2, ty2) && passable(w, tx2, ty2, "ground");
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (ok(tx, ty))
    return { x, y };
  let best = null;
  let bestD = Infinity;
  for (let i = -3;i <= 3; i++)
    for (let j = -3;j <= 3; j++) {
      const [dx, dy] = turnVec(q, j, i);
      if (!ok(tx + dx, ty + dy))
        continue;
      const d = hypot(dx, dy);
      if (d < bestD) {
        bestD = d;
        best = { x: tx + dx + 0.5, y: ty + dy + 0.5 };
      }
    }
  return best;
}
function announceDrop(w) {
  const o = w.objectives;
  const k = o.drops++;
  const site = pickDropSite(w, k, o.lastSite);
  o.lastSite = site;
  const reward = rollReward(w, k);
  const s = o.dropSites[site];
  const m = mirrorPoint(w, s.x, s.y);
  const landTick = dropLandTick(k);
  const at4 = isMulti(w) ? symmetryTurns(w).map((q) => ({ ...turnPoint(q, w.width, w.height, s.x, s.y), q })) : null;
  for (const at of at4 ?? [{ ...s, q: 0 }, { ...m, q: 2 }]) {
    const spot = crateSpot(w, at.x, at.y, false, at.q);
    if (!spot)
      continue;
    const c = {
      id: w.nextId++,
      x: spot.x,
      y: spot.y,
      reward,
      drop: k,
      announcedTick: w.tick,
      landTick,
      expireTick: landTick + ticks2(D.ttl)
    };
    o.crates.push(c);
    w.fx.push({ type: "crateIncoming", id: c.id, x: c.x, y: c.y, reward, landTick, drop: k });
  }
}
function tickCrates(w) {
  const o = w.objectives;
  const reach = D.claimRadius;
  const keep = [];
  for (const c of o.crates) {
    if (w.tick < c.landTick) {
      keep.push(c);
      continue;
    }
    if (w.tick === c.landTick)
      w.fx.push({ type: "crateLanded", id: c.id, x: c.x, y: c.y, reward: c.reward });
    if (w.tick >= c.expireTick) {
      w.fx.push({ type: "crateExpired", id: c.id, x: c.x, y: c.y });
      continue;
    }
    const b = buildingAtTile(w, Math.floor(c.x), Math.floor(c.y));
    if (b) {
      claimCrate(w, c, b.faction, b.id);
      continue;
    }
    let best = null;
    let bestD = reach;
    for (const u of w.units.values()) {
      if (u.kind === "harvester")
        continue;
      const dx = u.x - c.x;
      if (dx > reach || dx < -reach)
        continue;
      const dy = u.y - c.y;
      if (dy > reach || dy < -reach)
        continue;
      const d = hypot(dx, dy);
      if (d <= bestD && (best === null || d < bestD)) {
        best = u;
        bestD = d;
      }
    }
    if (best)
      claimCrate(w, c, best.faction, best.id);
    else
      keep.push(c);
  }
  o.crates = keep;
}
function claimCrate(w, c, faction, collectorId) {
  const o = w.objectives;
  const f = w.factions[faction];
  let amount = 0;
  let unused = 0;
  const unitIds = [];
  const near = (r) => [...w.units.values()].filter((u) => u.faction === faction && hypot(u.x - c.x, u.y - c.y) <= r);
  switch (c.reward) {
    case "scrap":
      amount = D.scrap * f.incomeMult;
      f.scrap += amount;
      o.stats[faction].crateScrap += amount;
      break;
    case "veterans":
      for (const u of near(D.veteranRadius)) {
        if (u.kind === "harvester" || u.rank >= COMBAT.rankXp.length)
          continue;
        promote(u);
        unitIds.push(u.id);
        w.fx.push({ type: "rankUp", id: u.id });
      }
      amount = unitIds.length;
      break;
    case "repair":
      for (const u of near(D.repairRadius)) {
        const max = UNITS[u.kind].hp;
        if (u.hp >= max || u.goliath)
          continue;
        const healed = Math.min(max - u.hp, max * D.repairShare);
        u.hp += healed;
        amount += healed;
        unitIds.push(u.id);
      }
      amount = Math.round(amount);
      break;
    case "charge": {
      const m = w.powers.meter;
      const before = m[faction];
      m[faction] = Math.min(POWERS.meterMax, before + D.charge);
      amount = Math.round(m[faction] - before);
      unused = 1 - (m[faction] - before) / D.charge;
      break;
    }
    case "unit": {
      const u = spawnUnit(w, D.unit, faction, c.x, c.y);
      for (let r = 0;r < D.unitRank; r++)
        promote(u);
      u.facing = u.aim = FACE[faction];
      unitIds.push(u.id);
      amount = UNITS[D.unit].cost;
      break;
    }
  }
  if ((c.reward === "veterans" || c.reward === "repair") && amount <= 0)
    unused = 1;
  let scrap = c.reward === "scrap" ? amount : 0;
  if (unused > 0.01) {
    scrap = Math.round(D.fallbackScrap * unused * f.incomeMult);
    f.scrap += scrap;
    o.stats[faction].crateScrap += scrap;
  }
  o.stats[faction].crates++;
  w.fx.push({
    type: "crateClaimed",
    id: c.id,
    x: c.x,
    y: c.y,
    faction,
    collectorId,
    reward: c.reward,
    amount,
    unitIds,
    scrap
  });
}
function promote(u) {
  if (u.rank >= COMBAT.rankXp.length)
    return;
  u.rank++;
  u.xp = Math.max(u.xp, COMBAT.rankXp[u.rank - 1] * UNITS[u.kind].cost);
}
function blocksObjective(w, tx, ty, size) {
  const o = w.objectives;
  if (o.uplinks.length === 0 && o.crates.length === 0)
    return false;
  const gap = (x, y) => hypot(Math.max(tx - x, 0, x - (tx + size)), Math.max(ty - y, 0, y - (ty + size)));
  for (const l of o.uplinks)
    if (gap(l.x, l.y) < PAD_RADIUS)
      return true;
  for (const c of o.crates)
    if (gap(c.x, c.y) < 0.5)
      return true;
  return false;
}
var PAD_RADIUS = 1.2;

// src/sim/goliath.ts
var GOLIATH_WEAPONS = ["mg", "mortars", "laser", "cannons"];
var LOSABLE_WEAPONS = ["mortars", "laser", "cannons"];
var canWalk = (u) => !u.goliath || u.goliath.mode === "walking" && !u.goliath.lift;
var isAnchored = (u) => u.goliath?.mode === "anchored" && !u.goliath.lift;
var isLifted = (u) => u.goliath?.lift?.phase === "carrying";
function goliathsOf(w, faction) {
  const out = [];
  for (const u of w.units.values())
    if (u.goliath && u.faction === faction)
      out.push(u);
  return out;
}
function anchoredGoliaths(w, faction) {
  return goliathsOf(w, faction).filter(isAnchored);
}
function hasGoliath(w, faction) {
  for (const u of w.units.values())
    if (u.goliath && u.faction === faction && u.hp > 0)
      return true;
  return false;
}
function goliathCost(w, faction) {
  let have = 0;
  for (const u of w.units.values())
    if (u.goliath && u.faction === faction && u.hp > 0)
      have++;
  for (const b of w.buildings.values())
    if (b.faction === faction) {
      for (const q of b.queue)
        if (q.kind === "goliath")
          have++;
    }
  return Math.round(UNITS.goliath.cost * (1 + GOLIATH.costStep * have));
}
function unitCost(w, faction, kind) {
  return kind === "goliath" ? goliathCost(w, faction) : UNITS[kind].cost;
}
function weaponReady(u, k) {
  const g = u.goliath;
  if (!g || !g.weapons[k].online)
    return false;
  return k === "mg" || !isLifted(u);
}
function goliathReach(u) {
  let r = 0;
  for (const k of GOLIATH_WEAPONS)
    if (weaponReady(u, k))
      r = Math.max(r, GOLIATH.weapons[k].range);
  return r;
}
function goliathReachAt(u, domain) {
  let r = 0;
  for (const k of GOLIATH_WEAPONS) {
    const t = GOLIATH.weapons[k].targets;
    if (weaponReady(u, k) && (t === "both" || t === domain))
      r = Math.max(r, GOLIATH.weapons[k].range);
  }
  return r;
}
function weaponsDown(u) {
  const g = u.goliath;
  if (!g)
    return [];
  return LOSABLE_WEAPONS.filter((k) => !g.weapons[k].online);
}
function repairUrgency(u) {
  const g = u.goliath;
  if (!g || u.hp >= UNITS[u.kind].hp)
    return 0;
  const share = u.hp / UNITS[u.kind].hp;
  let urgency = 0;
  for (const k of LOSABLE_WEAPONS) {
    const ws = g.weapons[k];
    if (ws.online)
      continue;
    if (ws.reboot >= 0)
      urgency = Math.max(urgency, 2);
    else {
      const need = GOLIATH.weapons[k].lostBelow + GOLIATH.restoreMargin - share;
      urgency = Math.max(urgency, need <= 0.08 ? 3 : 1);
    }
  }
  return urgency;
}
function anchorFootprint(w, faction, x, y) {
  const size = GOLIATH.footprint;
  const fr = sideFrame(w, faction);
  const p = fr.toFrame({ x, y });
  const [tx, ty] = fr.tile(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size);
  return { tx, ty, size };
}
function anchorBlocker(w, u) {
  const g = u.goliath;
  if (!g)
    return "Not a Goliath";
  if (g.lift)
    return "On a lift";
  if (g.mode === "anchored" || g.mode === "anchoring")
    return "Already anchored";
  if (g.mode === "packing")
    return "Packing up";
  const { tx, ty, size } = anchorFootprint(w, u.faction, u.x, u.y);
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++) {
      const x = tx + dx;
      const y = ty + dy;
      if (!inBounds(w, x, y))
        return "Off the map";
      if (w.occupancy[y * w.width + x] !== 0)
        return "Blocked";
      if (!TERRAIN[terrainAt(w, x, y)].buildable)
        return "Needs open ground";
    }
  if (blocksObjective(w, tx, ty, size))
    return "Blocked";
  for (const o of w.units.values())
    if (o.id !== u.id && UNITS[o.kind].domain === "ground" && !isLifted(o) && o.x >= tx && o.x < tx + size && o.y >= ty && o.y < ty + size)
      return "Unit in the way";
  return null;
}
function modeProgress(u) {
  const g = u.goliath;
  if (!g || g.mode !== "anchoring" && g.mode !== "packing")
    return 1;
  const total = Math.round((g.mode === "anchoring" ? GOLIATH.anchorTime : GOLIATH.packTime) * TICK_RATE);
  return Math.max(0, Math.min(1, 1 - g.modeTicks / total));
}
function packUpBlocker(u) {
  const g = u.goliath;
  if (!g)
    return "Not a Goliath";
  if (g.mode === "walking")
    return "Not anchored";
  if (g.mode === "packing")
    return "Packing up";
  return null;
}
function setMode(w, u, mode, ticks3) {
  const g = u.goliath;
  g.mode = mode;
  g.modeTicks = ticks3;
  w.fx.push({ type: "goliathMode", faction: u.faction, id: u.id, mode, x: u.x, y: u.y });
}
function anchor(w, u) {
  if (anchorBlocker(w, u))
    return false;
  plant(w, u);
  u.order = { type: "idle" };
  u.path = null;
  u.pathGoal = null;
  setMode(w, u, "anchoring", Math.round(GOLIATH.anchorTime * TICK_RATE));
  return true;
}
function plant(w, u) {
  const { tx, ty, size } = anchorFootprint(w, u.faction, u.x, u.y);
  u.x = tx + size / 2;
  u.y = ty + size / 2;
  u.goliath.foot = { tx, ty };
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++)
      if (inBounds(w, tx + dx, ty + dy) && w.occupancy[(ty + dy) * w.width + tx + dx] === 0)
        w.occupancy[(ty + dy) * w.width + tx + dx] = u.id;
  const near = (p) => p.x >= tx - 1 && p.x < tx + size + 1 && p.y >= ty - 1 && p.y < ty + size + 1;
  for (const o of w.units.values())
    if (o.path && o.path.some(near))
      o.path = null;
}
function unplant(w, u) {
  const foot = u.goliath?.foot;
  if (!foot)
    return;
  const size = GOLIATH.footprint;
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++) {
      const i = (foot.ty + dy) * w.width + foot.tx + dx;
      if (inBounds(w, foot.tx + dx, foot.ty + dy) && w.occupancy[i] === u.id)
        w.occupancy[i] = 0;
    }
  u.goliath.foot = null;
}
function packUp(w, u) {
  if (packUpBlocker(u))
    return false;
  setMode(w, u, "packing", Math.round(GOLIATH.packTime * TICK_RATE));
  return true;
}
function applyGoliathCommand(w, c) {
  for (const id of c.unitIds) {
    const u = w.units.get(id);
    if (!u || u.faction !== c.faction || !u.goliath)
      continue;
    if (c.type === "anchor")
      anchor(w, u);
    else
      packUp(w, u);
  }
}
function orderedToMove(w, u) {
  const g = u.goliath;
  if (!g || g.lift)
    return;
  if (g.mode === "anchored" || g.mode === "anchoring")
    packUp(w, u);
}
function distToFootprint2(tx, ty, size, x, y) {
  const dx = Math.max(tx - x, 0, x - (tx + size));
  const dy = Math.max(ty - y, 0, y - (ty + size));
  return hypot(dx, dy);
}
function inGoliathRing(w, faction, tx, ty, size) {
  for (const u of w.units.values())
    if (u.faction === faction && isAnchored(u) && distToFootprint2(tx, ty, size, u.x, u.y) <= GOLIATH.buildRing)
      return true;
  return false;
}
function overlapsGoliath(w, tx, ty, size) {
  for (const u of w.units.values())
    if (u.goliath && !isLifted(u) && distToFootprint2(tx, ty, size, u.x, u.y) < UNITS.goliath.radius)
      return true;
  return false;
}
function goliathTrainer(w, id, faction) {
  const u = w.units.get(id);
  return u && u.faction === faction && u.goliath ? u : null;
}
var trainable = (kind) => UNITS[kind].builtAt === "assembly-bay";
var trainableAt = (w, kind) => trainable(kind) || kind === "harvester" && goliathBase(w);
function nomadStart(w) {
  for (const f of sidesOf(w)) {
    const hq = hqOf(w, f);
    if (!hq)
      continue;
    const c = buildingCenter(hq);
    removeBuilding(w, hq);
    const g = spawnUnit(w, "goliath", f, c.x, c.y);
    applySpawnRank(w, g);
    g.goliath.mode = "anchored";
    plant(w, g);
  }
}
function tickLove(w) {
  if (!rulesOf(w).robotLove || w.winner)
    return;
  let best = null;
  for (const a of w.units.values()) {
    if (!a.goliath || a.hp <= 0)
      continue;
    for (const b of w.units.values()) {
      if (!b.goliath || b.hp <= 0 || FACTIONS.indexOf(b.faction) <= FACTIONS.indexOf(a.faction))
        continue;
      const d = hypot(a.x - b.x, a.y - b.y);
      if (d <= GOLIATH.love.range && (!best || d < best.d))
        best = { a, b, d };
    }
  }
  if (!best)
    return;
  const ids = [best.a.id, best.b.id];
  const x = (best.a.x + best.b.x) / 2;
  const y = (best.a.y + best.b.y) / 2;
  w.winner = "draw";
  w.love = { ids, x, y, tick: w.tick };
  w.fx.push({ type: "love", ids, x, y });
}
function tickGoliaths(w) {
  const rebootTicks = Math.round(GOLIATH.reboot * TICK_RATE);
  for (const u of w.units.values()) {
    const g = u.goliath;
    if (!g || u.hp <= 0)
      continue;
    if ((g.mode === "anchoring" || g.mode === "packing") && !isStunned(w, u.id) && --g.modeTicks <= 0) {
      if (g.mode === "packing")
        unplant(w, u);
      setMode(w, u, g.mode === "anchoring" ? "anchored" : "walking", 0);
    }
    const share = u.hp / UNITS[u.kind].hp;
    for (const k of LOSABLE_WEAPONS) {
      const ws = g.weapons[k];
      const line = GOLIATH.weapons[k].lostBelow;
      const ev = (state) => w.fx.push({ type: "goliathWeapon", faction: u.faction, id: u.id, weapon: k, state, x: u.x, y: u.y });
      if (ws.online) {
        if (share >= line)
          continue;
        ws.online = false;
        ws.reboot = -1;
        ws.targetId = null;
        ev("offline");
      } else if (ws.reboot >= 0) {
        if (share < line) {
          ws.reboot = -1;
          ev("offline");
        } else if (isStunned(w, u.id)) {} else if (--ws.reboot <= 0) {
          ws.online = true;
          ws.reboot = -1;
          ws.cooldown = 0;
          ev("online");
        }
      } else if (share >= line + GOLIATH.restoreMargin) {
        ws.reboot = rebootTicks;
        ev("rebooting");
      }
    }
  }
}
function anchorBlockedAt(w, faction, x, y, selfId = -1) {
  const { tx, ty, size } = anchorFootprint(w, faction, x, y);
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++) {
      const fx = tx + dx;
      const fy = ty + dy;
      if (!inBounds(w, fx, fy))
        return "Off the map";
      if (w.occupancy[fy * w.width + fx] !== 0)
        return "Blocked";
      if (!TERRAIN[terrainAt(w, fx, fy)].buildable)
        return "Needs open ground";
    }
  if (blocksObjective(w, tx, ty, size))
    return "Blocked";
  for (const o of w.units.values())
    if (o.id !== selfId && UNITS[o.kind].domain === "ground" && !isLifted(o) && o.x >= tx && o.x < tx + size && o.y >= ty && o.y < ty + size)
      return "Unit in the way";
  return null;
}
function readyFirepower(u) {
  if (!u.goliath)
    return 0;
  let all = 0;
  let up = 0;
  for (const k of GOLIATH_WEAPONS) {
    all += GOLIATH.weapons[k].dps;
    if (weaponReady(u, k))
      up += GOLIATH.weapons[k].dps;
  }
  return all > 0 ? up / all : 0;
}

// src/sim/economy.ts
function buildingBlocker(w, faction, kind) {
  const stats = BUILDINGS[kind];
  if (kind === "hq")
    return "Unique";
  const banned = bannedBy(w, kind, faction);
  if (banned)
    return banned;
  if (kind === "gantry") {
    const noGoliaths = bannedBy(w, "goliath", faction);
    if (noGoliaths)
      return noGoliaths;
  }
  if (stats.unique && (hasBuilding(w, faction, kind) || w.factions[faction].pending?.kind === kind))
    return "One per side";
  if (stats.requires && !stats.requires.some((k) => hasBuilding(w, faction, k)))
    return `Needs ${stats.requires.map((k) => BUILDINGS[k].name).join(" or ")}`;
  const missing = (stats.requiresAll ?? []).filter((k) => !hasBuilding(w, faction, k));
  if (missing.length > 0)
    return `Needs ${andList(missing.map((k) => BUILDINGS[k].name))}`;
  return null;
}
var andList = (xs) => xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
function unitBlocker(w, faction, kind) {
  const stats = UNITS[kind];
  const banned = bannedBy(w, kind, faction);
  if (banned)
    return banned;
  if (!hasBuilding(w, faction, stats.builtAt) && !(trainableAt(w, kind) && anchoredGoliaths(w, faction).length > 0))
    return trainableAt(w, kind) && hasGoliath(w, faction) && stats.builtAt === "hq" ? "Anchor a Goliath" : `Needs ${BUILDINGS[stats.builtAt].name}`;
  if (stats.requires && !hasBuilding(w, faction, stats.requires))
    return `Needs ${BUILDINGS[stats.requires].name}`;
  return null;
}
function startBuilding(w, faction, kind) {
  const f = w.factions[faction];
  const stats = BUILDINGS[kind];
  if (f.pending || buildingBlocker(w, faction, kind))
    return;
  if (f.scrap < stats.cost)
    return;
  f.scrap -= stats.cost;
  f.pending = { kind, remaining: stats.buildTime * TICK_RATE, ready: false };
}
function cancelBuilding(w, faction) {
  const f = w.factions[faction];
  if (!f.pending)
    return;
  f.scrap += BUILDINGS[f.pending.kind].cost;
  f.pending = null;
}
function canPlaceBuilding(w, faction, kind, tx, ty) {
  const size = BUILDINGS[kind].size;
  const ring = kind !== "hq" && inGoliathRing(w, faction, tx, ty, size);
  for (let dy = 0;dy < size; dy++)
    for (let dx = 0;dx < size; dx++) {
      const x = tx + dx;
      const y = ty + dy;
      if (!inBounds(w, x, y))
        return false;
      if (!TERRAIN[terrainAt(w, x, y)].buildable)
        return false;
      if (buildingAtTile(w, x, y))
        return false;
      if (!ring && !onHomeLand(w, faction, x, y))
        return false;
    }
  for (const u of w.units.values())
    if (domainOf(u) === "ground" && u.x >= tx && u.x < tx + size && u.y >= ty && u.y < ty + size)
      return false;
  if (overlapsGoliath(w, tx, ty, size))
    return false;
  if (blocksObjective(w, tx, ty, size))
    return false;
  return ring || inBaseRange(w, faction, tx + size / 2, ty + size / 2);
}
function inBaseRange(w, faction, cx, cy) {
  for (const b of w.buildings.values())
    if (b.faction === faction && !b.outpost && distToBuilding(b, cx, cy) <= ECONOMY.buildRadius)
      return true;
  return false;
}
function placeBuilding(w, faction, tx, ty) {
  const f = w.factions[faction];
  if (!f.pending || !f.pending.ready)
    return;
  if (!canPlaceBuilding(w, faction, f.pending.kind, tx, ty))
    return;
  const size = BUILDINGS[f.pending.kind].size;
  const outpost = !inBaseRange(w, faction, tx + size / 2, ty + size / 2);
  const b = spawnBuilding(w, f.pending.kind, faction, tx, ty);
  if (outpost)
    b.outpost = true;
  f.pending = null;
  w.fx.push({ type: "built", faction, id: b.id });
  invalidatePathsThrough(w, b);
}
function sellBuilding(w, faction, buildingId) {
  const b = w.buildings.get(buildingId);
  if (!b || b.faction !== faction || b.kind === "hq")
    return;
  const stats = BUILDINGS[b.kind];
  const refund = stats.cost * ECONOMY.sellRefund * (b.hp / stats.hp);
  const queued = b.queue.reduce((s, q) => s + paidFor(q), 0);
  w.factions[faction].scrap += Math.floor(refund + queued);
  w.fx.push({ type: "sold", id: b.id });
  removeBuilding(w, b);
}
var paidFor = (q) => q.paid ?? UNITS[q.kind].cost;
var queueCap = (kind) => kind === "goliath" ? GOLIATH.queueMax : ECONOMY.maxQueue;
function trainBlocker(w, g, kind) {
  if (!g.goliath || !trainableAt(w, kind))
    return "Can't train that";
  const banned = bannedBy(w, kind, g.faction);
  if (banned)
    return banned;
  const req = UNITS[kind].requires;
  if (req && !hasBuilding(w, g.faction, req))
    return `Needs ${BUILDINGS[req].name}`;
  if (!isAnchored(g))
    return "Anchor to train";
  return null;
}
function produceUnit(w, faction, buildingId, kind) {
  const f = w.factions[faction];
  const stats = UNITS[kind];
  if (!stats)
    return;
  const b = w.buildings.get(buildingId);
  if (!b) {
    const g = goliathTrainer(w, buildingId, faction);
    if (!g || trainBlocker(w, g, kind))
      return;
    const q = g.goliath.queue;
    if (q.length >= ECONOMY.maxQueue || f.scrap < stats.cost)
      return;
    f.scrap -= stats.cost;
    q.push({ kind, remaining: stats.buildTime * TICK_RATE });
    return;
  }
  if (b.faction !== faction || stats.builtAt !== b.kind)
    return;
  if (unitBlocker(w, faction, kind))
    return;
  if (b.queue.length >= queueCap(kind))
    return;
  const cost = unitCost(w, faction, kind);
  if (f.scrap < cost)
    return;
  f.scrap -= cost;
  b.queue.push({ kind, remaining: stats.buildTime * TICK_RATE, ...cost !== stats.cost ? { paid: cost } : {} });
}
function producersOf(w, faction, kind) {
  const out = [];
  for (const b of w.buildings.values())
    if (b.faction === faction && b.kind === UNITS[kind].builtAt)
      out.push({ id: b.id, queue: b.queue, goliath: null });
  if (trainableAt(w, kind))
    for (const g of anchoredGoliaths(w, faction))
      out.push({ id: g.id, queue: g.goliath.queue, goliath: g });
  return out;
}
function queuesOf(w, faction, kind) {
  const out = producersOf(w, faction, kind);
  if (trainableAt(w, kind)) {
    for (const g of goliathsOf(w, faction))
      if (!isAnchored(g) && g.goliath.queue.some((q) => q.kind === kind))
        out.push({ id: g.id, queue: g.goliath.queue, goliath: g });
  }
  return out;
}
var producerCap = (kind) => queueCap(kind);
function queueOf(w, faction, id) {
  const b = w.buildings.get(id);
  if (b)
    return b.faction === faction ? b.queue : null;
  return goliathTrainer(w, id, faction)?.goliath.queue ?? null;
}
function cancelProduce(w, faction, buildingId, kind) {
  const queue = queueOf(w, faction, buildingId);
  if (!queue)
    return;
  for (let i = queue.length - 1;i >= 0; i--)
    if (queue[i].kind === kind) {
      const [q] = queue.splice(i, 1);
      w.factions[faction].scrap += paidFor(q);
      return;
    }
}
function setRally(w, faction, buildingId, x, y) {
  const b = w.buildings.get(buildingId);
  if (b) {
    if (b.faction === faction)
      b.rally = { x, y };
    return;
  }
  const g = goliathTrainer(w, buildingId, faction);
  if (g)
    g.goliath.rally = { x, y };
}
function tickConstruction(w) {
  for (const f of Object.values(w.factions)) {
    if (!f.pending || f.pending.ready)
      continue;
    if ((f.pending.remaining -= rulesOf(w).buildSpeed) <= 0)
      f.pending.ready = true;
  }
}
function tickProduction(w) {
  for (const b of w.buildings.values()) {
    const head = b.queue[0];
    if (!head)
      continue;
    if (isStunned(w, b.id))
      continue;
    if (UNITS[head.kind].requires && !hasBuilding(w, b.faction, UNITS[head.kind].requires))
      continue;
    const total = UNITS[head.kind].buildTime * TICK_RATE;
    const before = head.remaining;
    head.remaining -= rulesOf(w).buildSpeed;
    if (head.kind === "goliath")
      goliathBuildNews(w, b, total, before, head.remaining);
    if (head.remaining > 0)
      continue;
    b.queue.shift();
    const size = BUILDINGS[b.kind].size;
    const spot = findSpawnSpot(w, { tx: b.tx, ty: b.ty, size, faction: b.faction }, head.kind, !b.outpost);
    const u = spawnUnit(w, head.kind, b.faction, spot.x, spot.y);
    applySpawnRank(w, u);
    const c = buildingCenter(b);
    u.facing = u.aim = atan2(spot.x - c.x, -(spot.y - c.y));
    w.factions[b.faction].stats.unitsBuilt++;
    w.fx.push({ type: "built", faction: b.faction, id: u.id });
    if (u.goliath)
      w.fx.push({ type: "goliathRollout", faction: b.faction, id: u.id, buildingId: b.id, x: u.x, y: u.y });
    applyRally(w, u, b.rally);
  }
  for (const g of w.units.values()) {
    const head = g.goliath?.queue[0];
    if (!head || !isAnchored(g) || isStunned(w, g.id))
      continue;
    if (UNITS[head.kind].requires && !hasBuilding(w, g.faction, UNITS[head.kind].requires))
      continue;
    if ((head.remaining -= rulesOf(w).buildSpeed) > 0)
      continue;
    g.goliath.queue.shift();
    const size = GOLIATH.footprint;
    const spot = findSpawnSpot(w, { tx: g.x - size / 2, ty: g.y - size / 2, size, faction: g.faction }, head.kind, false);
    const u = spawnUnit(w, head.kind, g.faction, spot.x, spot.y);
    applySpawnRank(w, u);
    u.facing = u.aim = atan2(spot.x - g.x, -(spot.y - g.y));
    w.factions[g.faction].stats.unitsBuilt++;
    w.fx.push({ type: "built", faction: g.faction, id: u.id });
    applyRally(w, u, g.goliath.rally);
  }
}
function goliathBuildNews(w, b, total, before, after) {
  const c = buildingCenter(b);
  const ev = (stage) => w.fx.push({ type: "goliathBuild", faction: b.faction, buildingId: b.id, stage, x: c.x, y: c.y });
  if (before >= total)
    ev("started");
  const line = total * (1 - GOLIATH.nearlyDone);
  if (before > line && after <= line && after > 0)
    ev("nearlyDone");
}
function findSpawnSpot(w, b, kind, homeOnly = true) {
  const size = b.size;
  const mc = moveClassOf(kind);
  const flip = b.faction === "red";
  for (let r = UNITS[kind].radius > 0.6 ? 2 : 1;r <= 4; r++) {
    const ring = [];
    for (let i = -r;i <= size + r - 1; i++)
      for (let j = -r;j <= size + r - 1; j++) {
        const dy = flip ? size - 1 - i : i;
        const dx = flip ? size - 1 - j : j;
        if (Math.max(dx < 0 ? -dx : dx - size + 1, dy < 0 ? -dy : dy - size + 1) !== r)
          continue;
        const tx = Math.floor(b.tx) + dx;
        const ty = Math.floor(b.ty) + dy;
        if (!inBounds(w, tx, ty))
          continue;
        if (mc !== "air" && (!passable(w, tx, ty, mc) || homeOnly && !onHomeLand(w, b.faction, tx, ty)))
          continue;
        const back = flip ? dy - (size - 1) : -dy;
        ring.push({ x: tx + 0.5, y: ty + 0.5, pref: back + Math.abs(dx - (size - 1) / 2) * 0.5 });
      }
    ring.sort((p, q) => p.pref - q.pref);
    if (ring[0])
      return { x: ring[0].x, y: ring[0].y };
  }
  return { x: b.tx + size / 2, y: Math.min(w.height - 0.5, Math.max(0.5, flip ? b.ty + size + 1 : b.ty - 1)) };
}
function applyRally(w, u, rally) {
  if (!rally) {
    if (u.kind === "harvester") {
      const f = nearestReachableResource(w, u.x, u.y, u.faction);
      if (f)
        u.order = { type: "harvest", fieldX: f.x, fieldY: f.y, phase: "toField" };
    }
    return;
  }
  const { x, y } = rally;
  if (u.kind === "harvester" && isResource(w, tileIndex(w, Math.floor(x), Math.floor(y)))) {
    u.order = { type: "harvest", fieldX: Math.floor(x), fieldY: Math.floor(y), phase: "toField" };
  } else {
    u.order = { type: "attackMove", x, y };
  }
}
function nearestScrapTile(w, x, y, faction) {
  const fr = sideFrame(w, faction);
  const p = fr.toFrame({ x, y });
  let best = null;
  let bestD = Infinity;
  for (let fy = 0;fy < w.height; fy++)
    for (let fx = 0;fx < w.width; fx++) {
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!isResource(w, tileIndex(w, tx, ty)))
        continue;
      const d = hypot(fx + 0.5 - p.x, fy + 0.5 - p.y);
      if (d < bestD) {
        bestD = d;
        best = { x: tx, y: ty };
      }
    }
  return best;
}
function nearestReachableResource(w, x, y, faction, accept) {
  const W = w.width;
  const q = faction ? QUARTER[faction] : 0;
  const start = tileIndex(w, Math.floor(x), Math.floor(y));
  if (start < 0 || start >= W * w.height)
    return null;
  const seen = new Uint8Array(W * w.height);
  const queue = new Int32Array(W * w.height);
  let head = 0;
  let tail = 0;
  queue[tail++] = start;
  seen[start] = 1;
  while (head < tail) {
    const cur = queue[head++];
    if (isResource(w, cur) && (!accept || accept(cur % W, Math.floor(cur / W))))
      return { x: cur % W, y: Math.floor(cur / W) };
    const cx = cur % W;
    const cy = Math.floor(cur / W);
    for (let i = -1;i <= 1; i++)
      for (let j = -1;j <= 1; j++) {
        const [dx, dy] = turnVec(q, j, i);
        if (dx === 0 && dy === 0)
          continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (!passable(w, nx, ny, "ground"))
          continue;
        if (dx !== 0 && dy !== 0 && (!passable(w, cx + dx, cy, "ground") || !passable(w, cx, cy + dy, "ground")))
          continue;
        const ni = ny * W + nx;
        if (seen[ni])
          continue;
        seen[ni] = 1;
        queue[tail++] = ni;
      }
  }
  return null;
}
function tickTrickle(w) {
  if ((w.tick + 1) % TICK_RATE !== 0)
    return;
  for (const b of w.buildings.values())
    if (b.kind === "hq") {
      w.factions[b.faction].scrap += (rulesOf(w).hqTrickle ?? ECONOMY.hqTrickle) * incomeOf(w, b.faction);
    }
}
function distToSite(s, x, y) {
  const dx = Math.max(s.tx - x, 0, x - (s.tx + s.size));
  const dy = Math.max(s.ty - y, 0, y - (s.ty + s.size));
  return hypot(dx, dy);
}
var FLEE_TICKS = 4 * TICK_RATE;
function dockPoint(w, b, x, y) {
  const q = QUARTER[b.faction];
  if (q === 1 || q === 3) {
    const fr = sideFrame(w, b.faction);
    const [tx, ty] = turnTile(4 - q, w.width, w.height, b.tx, b.ty, b.size);
    const p = fr.toFrame({ x, y });
    return fr.toWorld(dockPoint(w, { ...b, faction: "blue", tx, ty }, p.x, p.y));
  }
  const size = b.size;
  const cx = Math.max(b.tx + 0.5, Math.min(b.tx + size - 0.5, x));
  const cy = Math.max(b.ty + 0.5, Math.min(b.ty + size - 0.5, y));
  const c = { x: b.tx + size / 2, y: b.ty + size / 2 };
  const red = b.faction === "red";
  const dx = cx - c.x;
  const dy = cy - c.y;
  const east = dx > 0 || dx === 0 && !red;
  const south = dy > 0 || dy === 0 && !red;
  if (Math.abs(dx) >= Math.abs(dy))
    return { x: east ? b.tx + size + 0.5 : b.tx - 0.5, y: cy };
  return { x: cx, y: south ? b.ty + size + 0.5 : b.ty - 0.5 };
}
function tickHarvest(w) {
  for (const u of w.units.values()) {
    if (u.order.type !== "harvest")
      continue;
    if (isStunned(w, u.id))
      continue;
    const o = u.order;
    const perTick = (rate) => rate / TICK_RATE;
    if (w.tick - u.damagedTick < FLEE_TICKS && (o.phase === "toField" || o.phase === "harvesting")) {
      const home = nearestDropSite(w, u.faction, u.x, u.y, "ground");
      if (home) {
        const d = dockPoint(w, home, u.x, u.y);
        moveUnitToward(w, u, d.x, d.y);
        o.phase = "toField";
        continue;
      }
    }
    if (o.phase === "toField") {
      const curI = tileIndex(w, Math.floor(u.x), Math.floor(u.y));
      if (isResource(w, curI) && hypot(Math.floor(u.x) - o.fieldX, Math.floor(u.y) - o.fieldY) < 4) {
        o.fieldX = Math.floor(u.x);
        o.fieldY = Math.floor(u.y);
        o.phase = "harvesting";
        continue;
      }
      const i = tileIndex(w, o.fieldX, o.fieldY);
      if (!isResource(w, i)) {
        const next = nearestReachableResource(w, u.x, u.y, u.faction);
        if (!next) {
          u.order = { type: "idle" };
          continue;
        }
        o.fieldX = next.x;
        o.fieldY = next.y;
      }
      if (moveUnitToward(w, u, o.fieldX + 0.5, o.fieldY + 0.5)) {
        if (hypot(o.fieldX + 0.5 - u.x, o.fieldY + 0.5 - u.y) < 2.2)
          o.phase = "harvesting";
        else {
          const next = nearestReachableResource(w, u.x, u.y, u.faction);
          if (next && (next.x !== o.fieldX || next.y !== o.fieldY)) {
            o.fieldX = next.x;
            o.fieldY = next.y;
            u.path = null;
          } else
            u.order = { type: "idle" };
        }
      }
    } else if (o.phase === "harvesting") {
      const i = tileIndex(w, o.fieldX, o.fieldY);
      const available = w.scrap[i];
      if (available <= 0) {
        o.phase = "toField";
        continue;
      }
      const value = w.terrain[i] === 7 /* Crystal */ ? ECONOMY.crystalValue : 1;
      const room = (ECONOMY.harvesterCapacity - u.cargo) / value;
      const mined = Math.min(perTick(ECONOMY.harvestRate), available, room);
      u.cargo += mined * value;
      w.scrap[i] = Math.max(0, available - mined);
      if (u.cargo >= ECONOMY.harvesterCapacity - 0.000001) {
        u.cargo = ECONOMY.harvesterCapacity;
        o.phase = "toBase";
      }
    } else if (o.phase === "toBase") {
      const home = nearestDropSite(w, u.faction, u.x, u.y, "ground");
      if (!home) {
        if (!hasGoliath(w, u.faction))
          u.order = { type: "idle" };
        continue;
      }
      const d = dockPoint(w, home, u.x, u.y);
      if (moveUnitToward(w, u, d.x, d.y) || distToSite(home, u.x, u.y) < 1.2) {
        o.phase = "unloading";
        const c = { x: home.tx + home.size / 2, y: home.ty + home.size / 2 };
        const amount = u.cargo * incomeOf(w, u.faction);
        w.fx.push({ type: "deposit", faction: u.faction, id: u.id, x: c.x, y: c.y, amount });
      }
    } else {
      const transfer = Math.min(perTick(ECONOMY.unloadRate), u.cargo);
      u.cargo -= transfer;
      const f = w.factions[u.faction];
      const mult = incomeOf(w, u.faction);
      f.scrap += transfer * mult;
      f.stats.scrapHarvested += transfer * mult;
      if (u.cargo <= 0.000001) {
        u.cargo = 0;
        o.phase = "toField";
      }
    }
  }
}
function applyEconomyCommand(w, c) {
  switch (c.type) {
    case "startBuilding":
      startBuilding(w, c.faction, c.building);
      break;
    case "cancelBuilding":
      cancelBuilding(w, c.faction);
      break;
    case "placeBuilding":
      placeBuilding(w, c.faction, c.tx, c.ty);
      break;
    case "sell":
      sellBuilding(w, c.faction, c.buildingId);
      break;
    case "produce":
      produceUnit(w, c.faction, c.buildingId, c.unit);
      break;
    case "cancelProduce":
      cancelProduce(w, c.faction, c.buildingId, c.unit);
      break;
    case "rally":
      setRally(w, c.faction, c.buildingId, c.x, c.y);
      break;
  }
}

// src/sim/modes/survival.ts
var SURVIVAL = {
  firstWave: { easy: 110, normal: 95, hard: 85 },
  interval: 50,
  bossInterval: 60,
  afterClear: 30,
  warn: 15,
  budgetBase: 240,
  budgetGrowth: 228,
  budgetExp: 1.4,
  budgetMult: { easy: 0.7, normal: 1, hard: 1.3 },
  themes: ["air", "armour", "artillery", "mixed", "swarm"],
  bossBudget: 1.1,
  maxLive: 30,
  maxWaveUnits: 36,
  swarmMaxUnits: 30,
  maxPending: 60,
  spawnEvery: 2,
  cohesion: 3,
  releaseDist: 12,
  marchTimeout: 50,
  clearBonus: 60,
  earlyBase: 5,
  earlyPerWave: 1,
  rankFrom: [6, 12],
  retaskTicks: 20,
  siteMinDist: 0.6,
  waveWreckShare: 0.05
};
var THEME_NAMES = {
  air: "Air Raid",
  armour: "Armour Column",
  artillery: "Artillery",
  mixed: "Mixed Assault",
  swarm: "Bot Swarm",
  boss: "Boss"
};
var THEME_COUNTERS = {
  air: "Flak, Turrets, SAMs, Raptors",
  armour: "Lancers, Mastodons, Wasps",
  artillery: "rush the guns with Stingers, Wasps",
  mixed: "a mixed army, Turrets",
  swarm: "Mortars, Turrets, Hornets, Sniper Teams",
  boss: "everything you've got"
};
var BOSS_NAMES = ["Mastodon Spearhead", "Bomber Wing", "Elite Strike Force"];
var BOSS_PREVIEW = ["armour", "air", "mixed"];
var POOLS = {
  air: [
    { kind: "wasp", weight: 5 },
    { kind: "hornet", weight: 2, from: 4 },
    { kind: "raptor", weight: 1, from: 5, maxShare: 0.25 }
  ],
  armour: [
    { kind: "stinger", weight: 5 },
    { kind: "lancer", weight: 2, from: 3 },
    { kind: "mastodon", weight: 2, from: 4 }
  ],
  artillery: [
    { kind: "mortar", weight: 4, maxShare: 0.6 },
    { kind: "stinger", weight: 3 },
    { kind: "lancer", weight: 1, from: 6 },
    { kind: "flak-crawler", weight: 1, from: 7, maxShare: 0.2 }
  ],
  mixed: [
    { kind: "stinger", weight: 4 },
    { kind: "wasp", weight: 2, from: 2 },
    { kind: "flak-crawler", weight: 1, from: 3, maxShare: 0.2 },
    { kind: "lancer", weight: 1, from: 4 },
    { kind: "mortar", weight: 1, from: 6 },
    { kind: "raptor", weight: 1, from: 7, maxShare: 0.2 },
    { kind: "mender", weight: 1, from: 8, maxShare: 0.15 }
  ],
  swarm: [
    { kind: "trooper", weight: 5 },
    { kind: "rocket-squad", weight: 2 },
    { kind: "sniper", weight: 1, from: 6, maxShare: 0.15, maxCount: 0.15 }
  ]
};
var BOSS_POOLS = [
  {
    core: "mastodon",
    share: 0.55,
    escorts: [
      { kind: "stinger", weight: 3 },
      { kind: "lancer", weight: 2 },
      { kind: "flak-crawler", weight: 1, maxShare: 0.15 },
      { kind: "rocket-squad", weight: 1, maxShare: 0.15 }
    ]
  },
  { core: "hornet", share: 0.55, escorts: [{ kind: "wasp", weight: 3 }, { kind: "raptor", weight: 2, maxShare: 0.3 }] },
  {
    core: "lancer",
    share: 0.3,
    escorts: POOLS.mixed.concat([
      { kind: "mastodon", weight: 2 },
      { kind: "hornet", weight: 1 },
      { kind: "trooper", weight: 1, maxShare: 0.15 },
      { kind: "rocket-squad", weight: 1, maxShare: 0.15 }
    ])
  }
];
var COMPASS = [
  { dir: "north-west", ax: 0, ay: 0 },
  { dir: "north", ax: 0.5, ay: 0 },
  { dir: "north-east", ax: 1, ay: 0 },
  { dir: "east", ax: 1, ay: 0.5 },
  { dir: "south-east", ax: 1, ay: 1 },
  { dir: "south", ax: 0.5, ay: 1 },
  { dir: "south-west", ax: 0, ay: 1 },
  { dir: "west", ax: 0, ay: 0.5 }
];
var attacker = (s) => s.defender === "blue" ? "red" : "blue";
function setupSurvival(w, opts = {}, defender = "blue") {
  const foe = defender === "blue" ? "red" : "blue";
  for (const b of [...w.buildings.values()])
    if (b.faction === foe)
      removeBuilding(w, b);
  for (const u of [...w.units.values()])
    if (u.faction === foe)
      w.units.delete(u.id);
  w.factions[foe].scrap = 0;
  const difficulty = opts.difficulty ?? "normal";
  const hq = hqOf(w, defender);
  w.survival = {
    difficulty,
    defender,
    wave: 0,
    theme: null,
    site: -1,
    cleared: 0,
    nextWaveTick: (opts.firstWave ?? SURVIVAL.firstWave[difficulty]) * TICK_RATE,
    warned: false,
    earlyBonus: 0,
    sites: hq ? computeSites(w, hq) : [],
    pending: [],
    spawned: 0,
    lastSpawnTick: -1000,
    bonusEarned: 0,
    marches: [],
    members: new Map,
    ...opts.interval ? { interval: opts.interval } : {},
    wreckShare: SURVIVAL.waveWreckShare
  };
}
function groundReach(w, from) {
  const W = w.width;
  const seen = new Uint8Array(W * w.height);
  const queue = [];
  const size = BUILDINGS[from.kind].size;
  for (let dy = -1;dy <= size; dy++)
    for (let dx = -1;dx <= size; dx++) {
      const x = from.tx + dx;
      const y = from.ty + dy;
      if (!passable(w, x, y, "ground") || seen[y * W + x])
        continue;
      seen[y * W + x] = 1;
      queue.push(y * W + x);
    }
  for (let head = 0;head < queue.length; head++) {
    const cur = queue[head];
    const cx = cur % W;
    const cy = (cur - cx) / W;
    for (let dy = -1;dy <= 1; dy++)
      for (let dx = -1;dx <= 1; dx++) {
        if (dx === 0 && dy === 0)
          continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (!passable(w, nx, ny, "ground"))
          continue;
        if (dx !== 0 && dy !== 0 && (!passable(w, cx + dx, cy, "ground") || !passable(w, cx, cy + dy, "ground")))
          continue;
        const ni = ny * W + nx;
        if (seen[ni])
          continue;
        seen[ni] = 1;
        queue.push(ni);
      }
  }
  return seen;
}
function computeSites(w, hq) {
  const c = buildingCenter(hq);
  const reach = groundReach(w, hq);
  const out = [];
  for (const k of COMPASS) {
    const ax = k.ax * w.width;
    const ay = k.ay * w.height;
    if (dist(ax, ay, c.x, c.y) < SURVIVAL.siteMinDist * Math.max(w.width, w.height))
      continue;
    let best = null;
    let bestD = Infinity;
    for (let ty = 1;ty < w.height - 1; ty++)
      for (let tx = 1;tx < w.width - 1; tx++) {
        if (!reach[ty * w.width + tx])
          continue;
        const d = dist(tx + 0.5, ty + 0.5, ax, ay);
        if (d < bestD) {
          bestD = d;
          best = { x: tx + 0.5, y: ty + 0.5 };
        }
      }
    if (!best || bestD > 10)
      continue;
    out.push({
      x: best.x,
      y: best.y,
      ax: Math.min(w.width - 1.5, Math.max(1.5, ax)),
      ay: Math.min(w.height - 1.5, Math.max(1.5, ay)),
      dir: k.dir
    });
  }
  return out;
}
function shuffled(w, items, salt, ...keys) {
  const perm = [...items];
  for (let i = perm.length - 1;i > 0; i--) {
    const j = worldPick(w, i + 1, salt, ...keys, i);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}
var OPENERS = new Set(["armour", "mixed", "swarm"]);
var FIRST_BLOCK = new Set(["air", "swarm"]);
function benchOrder(w, cycle) {
  const all = SURVIVAL.themes;
  const L = all.length;
  const prevLast = cycle > 0 ? benchOrder(w, cycle - 1)[L - 1] : -1;
  const ok = (order) => order[0] !== prevLast && (cycle > 0 || !FIRST_BLOCK.has(all[order[0]])) && order.every((t, i) => all[t] !== BOSS_PREVIEW[bossVariant(w, (cycle * L + i) * 5 + 5)]);
  const idx2 = all.map((_, i) => i);
  for (let k = 0;k < 64; k++) {
    const order = shuffled(w, idx2, "wave-sitout", cycle, k);
    if (ok(order))
      return order;
  }
  return shuffled(w, idx2, "wave-sitout", cycle, 0);
}
function blockThemes(w, block) {
  const all = SURVIVAL.themes;
  let pool = [...all];
  if (all.length > 4) {
    const out = benchOrder(w, Math.floor(block / all.length))[block % all.length];
    pool = pool.filter((_, i) => i !== out);
  }
  const perm = shuffled(w, pool, "wave-theme", block).slice(0, 4);
  if (block === 0) {
    const i = perm.findIndex((t) => OPENERS.has(t));
    if (i > 0)
      [perm[0], perm[i]] = [perm[i], perm[0]];
  }
  return perm;
}
function waveTheme(w, n) {
  if (n % 5 === 0)
    return "boss";
  const perm = blockThemes(w, Math.floor((n - 1) / 5));
  return perm[(n - 1) % 5 % perm.length];
}
function waveName(w, n) {
  if (waveTheme(w, n) !== "boss")
    return THEME_NAMES[waveTheme(w, n)];
  return BOSS_NAMES[bossVariant(w, n)];
}
function bossVariant(w, n) {
  const k = n / 5 - 1;
  const cycle = Math.floor(k / 3);
  const perm = [0, 1, 2];
  for (let i = 2;i > 0; i--) {
    const j = worldPick(w, i + 1, "wave-boss-order", cycle, i);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm[k % 3];
}
function waveSite(w, n) {
  const m = w.survival?.sites.length ?? 0;
  if (m <= 1)
    return 0;
  let prev = -1;
  let site = 0;
  for (let k = 1;k <= n; k++) {
    site = worldPick(w, m, "wave-site", k);
    if (site === prev)
      site = (site + 1 + worldPick(w, m - 1, "wave-site-alt", k)) % m;
    prev = site;
  }
  return site;
}
function waveBudget(difficulty, n) {
  const base = SURVIVAL.budgetBase + SURVIVAL.budgetGrowth * pow(n, SURVIVAL.budgetExp);
  return Math.round(base * SURVIVAL.budgetMult[difficulty] * (n % 5 === 0 ? SURVIVAL.bossBudget : 1));
}
function waveRank(n) {
  const base = SURVIVAL.rankFrom.filter((from) => n >= from).length;
  return Math.min(3, base + (n % 5 === 0 ? 1 : 0));
}
function fill(w, n, pool, budget, units, salt, maxUnits = SURVIVAL.maxWaveUnits) {
  let left = budget;
  const spent = new Map;
  for (const k of units)
    spent.set(k, (spent.get(k) ?? 0) + UNITS[k].cost);
  const count = (k) => units.filter((u) => u === k).length;
  for (let i = 0;units.length < maxUnits; i++) {
    const cands = pool.filter((p) => n >= (p.from ?? 1) && UNITS[p.kind].cost <= left && (p.maxShare === undefined || (spent.get(p.kind) ?? 0) + UNITS[p.kind].cost <= p.maxShare * budget + 1) && (p.maxCount === undefined || count(p.kind) + 1 <= p.maxCount * maxUnits));
    if (cands.length === 0)
      break;
    const total = cands.reduce((s, p) => s + p.weight, 0);
    let r = worldRandom(w, salt, n, i) * total;
    let pick = cands[cands.length - 1];
    for (const p of cands) {
      r -= p.weight;
      if (r < 0) {
        pick = p;
        break;
      }
    }
    units.push(pick.kind);
    spent.set(pick.kind, (spent.get(pick.kind) ?? 0) + UNITS[pick.kind].cost);
    left -= UNITS[pick.kind].cost;
  }
  return left;
}
function planWave(w, n, difficulty = w.survival?.difficulty ?? "normal") {
  const theme = waveTheme(w, n);
  const budget = waveBudget(difficulty, n);
  const units = [];
  if (theme === "boss") {
    const boss = BOSS_POOLS[bossVariant(w, n)];
    let core = budget * boss.share;
    do {
      units.push(boss.core);
      core -= UNITS[boss.core].cost;
    } while (core >= UNITS[boss.core].cost * 0.6);
    const left = budget - units.length * UNITS[boss.core].cost;
    fill(w, n, boss.escorts, left, units, "wave-boss");
  } else {
    if (theme === "artillery")
      units.push("mortar");
    const cap = theme === "swarm" ? SURVIVAL.swarmMaxUnits : SURVIVAL.maxWaveUnits;
    fill(w, n, POOLS[theme], budget - (theme === "artillery" ? UNITS.mortar.cost : 0), units, `wave-${theme}`, cap);
  }
  const order = (k) => UNITS[k].armor === "heavy" ? 0 : k !== "sniper" && (UNITS[k].targets === "ground" || isInfantry(k)) ? 1 : 2;
  units.sort((a, b) => order(a) - order(b));
  return { wave: n, theme, name: waveName(w, n), site: waveSite(w, n), budget, rank: waveRank(n), units };
}
var isWaveUnit = (s, u) => u.faction !== s.defender;
function waveUnitsLeft(w) {
  const s = w.survival;
  if (!s)
    return 0;
  let n = s.pending.length;
  for (const u of w.units.values())
    if (isWaveUnit(s, u))
      n++;
  return n;
}
function tickSurvival(w) {
  const s = w.survival;
  if (!s || w.winner)
    return;
  if (!hqOf(w, s.defender)) {
    w.winner = attacker(s);
    return;
  }
  const warnTicks = SURVIVAL.warn * TICK_RATE;
  if (s.wave > s.cleared && waveUnitsLeft(w) === 0) {
    s.cleared = s.wave;
    const bonus = SURVIVAL.clearBonus * s.wave;
    w.factions[s.defender].scrap += bonus;
    s.bonusEarned += bonus;
    if (!s.warned)
      s.nextWaveTick = Math.min(s.nextWaveTick, w.tick + SURVIVAL.afterClear * TICK_RATE);
    w.fx.push({ type: "waveCleared", wave: s.wave, bonus, next: waveName(w, s.wave + 1), nextTheme: waveTheme(w, s.wave + 1) });
  }
  if (!s.warned && w.tick >= s.nextWaveTick - warnTicks) {
    s.warned = true;
    const n = s.wave + 1;
    const site = s.sites[waveSite(w, n)];
    if (site)
      w.fx.push({
        type: "waveIncoming",
        wave: n,
        theme: waveTheme(w, n),
        name: waveName(w, n),
        x: site.x,
        y: site.y,
        dir: site.dir,
        eta: Math.max(0, s.nextWaveTick - w.tick),
        early: s.earlyBonus
      });
    s.earlyBonus = 0;
  }
  if (w.tick >= s.nextWaveTick) {
    const plan = planWave(w, s.wave + 1, s.difficulty);
    s.wave = plan.wave;
    s.theme = plan.theme;
    s.site = plan.site;
    s.warned = false;
    const every = s.interval ?? SURVIVAL.interval;
    s.nextWaveTick = w.tick + (plan.theme === "boss" ? every + SURVIVAL.bossInterval - SURVIVAL.interval : every) * TICK_RATE;
    for (const kind of plan.units)
      if (s.pending.length < SURVIVAL.maxPending)
        s.pending.push({ kind, rank: plan.rank, wave: plan.wave, site: plan.site });
    const site = s.sites[plan.site];
    if (site) {
      const obj = objective(w, s, plan.theme, site.x, site.y);
      if (obj)
        s.marches.push({ wave: plan.wave, theme: plan.theme, id: obj.id, x: obj.x, y: obj.y, site: plan.site, started: w.tick });
      w.fx.push({
        type: "waveSpawned",
        wave: plan.wave,
        theme: plan.theme,
        name: plan.name,
        x: site.x,
        y: site.y,
        count: plan.units.length
      });
    }
  }
  if (s.pending.length > 0 && w.tick - s.lastSpawnTick >= SURVIVAL.spawnEvery) {
    let live = 0;
    for (const u of w.units.values())
      if (isWaveUnit(s, u))
        live++;
    if (live < SURVIVAL.maxLive) {
      const p = s.pending.shift();
      spawnWaveUnit(w, s, p);
      s.lastSpawnTick = w.tick;
    }
  }
  if (w.tick % TICK_RATE === 0)
    tickMarches(w, s);
  if (w.tick % SURVIVAL.retaskTicks === 0)
    retask(w, s);
}
function tickMarches(w, s) {
  for (const id of s.members.keys())
    if (!w.units.has(id))
      s.members.delete(id);
  for (const m of s.marches) {
    const units = [];
    for (const [id, wave] of s.members)
      if (wave === m.wave)
        units.push(w.units.get(id));
    const queued = s.pending.some((p) => p.wave === m.wave);
    if (units.length === 0) {
      if (!queued)
        m.started = -1;
      continue;
    }
    if (!w.buildings.has(m.id) && !w.units.has(m.id)) {
      const cx = units.reduce((a, u) => a + u.x, 0) / units.length;
      const cy = units.reduce((a, u) => a + u.y, 0) / units.length;
      const obj = objective(w, s, m.theme, cx, cy);
      if (!obj)
        continue;
      m.id = obj.id;
      m.x = obj.x;
      m.y = obj.y;
    }
    const engaged = units.some((u) => u.autoTargetId !== null || u.order.type === "attack" || w.tick - u.damagedTick < 3 * TICK_RATE);
    const arrived = units.some((u) => dist(u.x, u.y, m.x, m.y) < SURVIVAL.releaseDist);
    if (engaged || arrived || w.tick - m.started > SURVIVAL.marchTimeout * TICK_RATE) {
      for (const u of units)
        orderWaveUnit(u, objective(w, s, m.theme, u.x, u.y));
      m.started = -1;
      continue;
    }
    const site = s.sites[m.site];
    let rear = queued && site ? dist(site.x, site.y, m.x, m.y) : 0;
    for (const u of units)
      rear = Math.max(rear, dist(u.x, u.y, m.x, m.y));
    for (const u of units) {
      const ahead = dist(u.x, u.y, m.x, m.y) < rear - SURVIVAL.cohesion;
      if (ahead && u.order.type !== "idle") {
        u.order = { type: "idle" };
        u.path = null;
      } else if (!ahead && u.order.type === "idle") {
        u.order = { type: "attackMove", x: m.x, y: m.y };
        u.path = null;
      }
    }
  }
  s.marches = s.marches.filter((m) => m.started >= 0);
}
function marching(s, u) {
  const wave = s.members.get(u.id);
  return wave === undefined ? null : s.marches.find((m) => m.wave === wave) ?? null;
}
function formationSlots(w, site, mc) {
  const sx = Math.floor(site.x);
  const sy = Math.floor(site.y);
  const out = [];
  const seen = new Set([sy * w.width + sx]);
  const queue = [[sx, sy]];
  for (let head = 0;head < queue.length && out.length < 12; head++) {
    const [cx, cy] = queue[head];
    out.push({ x: cx + 0.5, y: cy + 0.5 });
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(w, nx, ny) || Math.abs(nx - sx) > 3 || Math.abs(ny - sy) > 3)
        continue;
      if (nx < 1 || ny < 1 || nx > w.width - 2 || ny > w.height - 2)
        continue;
      if (seen.has(ny * w.width + nx) || !passable(w, nx, ny, mc))
        continue;
      seen.add(ny * w.width + nx);
      queue.push([nx, ny]);
    }
  }
  return out;
}
function spawnWaveUnit(w, s, p) {
  const site = s.sites[p.site] ?? s.sites[0];
  if (!site)
    return;
  const jx = worldRandom(w, "spawn-jx", s.spawned) - 0.5;
  const jy = worldRandom(w, "spawn-jy", s.spawned) - 0.5;
  let x;
  let y;
  const mc = moveClassOf(p.kind);
  if (mc === "air") {
    x = site.ax + jx * 2;
    y = site.ay + jy * 2;
  } else {
    const slots = formationSlots(w, site, mc === "foot" ? "foot" : "ground");
    const slot = slots[s.spawned % Math.max(1, slots.length)] ?? site;
    x = slot.x + jx * 0.5;
    y = slot.y + jy * 0.5;
  }
  s.spawned++;
  const u = spawnUnit(w, p.kind, attacker(s), x, y);
  if (p.rank > 0) {
    u.rank = p.rank;
    u.xp = COMBAT.rankXp[p.rank - 1] * UNITS[p.kind].cost;
  }
  const hq = hqOf(w, s.defender);
  if (hq) {
    const c = buildingCenter(hq);
    u.facing = u.aim = atan2(c.x - x, -(c.y - y));
  }
  w.factions[attacker(s)].stats.unitsBuilt++;
  s.members.set(u.id, p.wave);
  const m = marching(s, u);
  if (m) {
    u.order = { type: "attackMove", x: m.x, y: m.y };
    return;
  }
  orderWaveUnit(u, objective(w, s, waveTheme(w, p.wave), x, y));
}
var PRODUCTION = new Set(["fab-plant", "airpad", "assembly-bay", "tech-lab", "depot"]);
var DEFENCES = new Set(["turret", "sam-site"]);
function nearestBuilding(w, s, x, y, filter) {
  let best = null;
  let bestD = Infinity;
  for (const b of w.buildings.values()) {
    if (b.faction !== s.defender || filter && !filter(b))
      continue;
    const d = distToBuilding(b, x, y);
    if (d < bestD) {
      bestD = d;
      const c = buildingCenter(b);
      best = { id: b.id, x: c.x, y: c.y, mobile: false };
    }
  }
  return best;
}
function nearestHarvester(w, s, x, y) {
  let best = null;
  let bestD = Infinity;
  for (const u of w.units.values()) {
    if (u.faction !== s.defender || u.kind !== "harvester")
      continue;
    const d = dist(u.x, u.y, x, y);
    if (d < bestD) {
      bestD = d;
      best = { id: u.id, x: u.x, y: u.y, mobile: true };
    }
  }
  return best;
}
function objective(w, s, theme, x, y) {
  const any = () => nearestBuilding(w, s, x, y);
  const hq = () => {
    const b = hqOf(w, s.defender);
    if (!b)
      return null;
    const c = buildingCenter(b);
    return { id: b.id, x: c.x, y: c.y, mobile: false };
  };
  switch (theme) {
    case "air":
      return nearestHarvester(w, s, x, y) ?? nearestBuilding(w, s, x, y, (b) => PRODUCTION.has(b.kind)) ?? any();
    case "artillery":
      return nearestBuilding(w, s, x, y, (b) => DEFENCES.has(b.kind)) ?? any();
    case "mixed":
      return nearestBuilding(w, s, x, y, (b) => PRODUCTION.has(b.kind)) ?? any();
    case "boss":
      return hq() ?? any();
    case "armour":
    case "swarm":
      return any();
  }
}
function orderWaveUnit(u, obj) {
  if (!obj)
    return;
  const st = UNITS[u.kind];
  const hitsGround = st.targets === "ground" || st.targets === "both";
  u.path = null;
  u.autoTargetId = null;
  if (obj.mobile && hitsGround)
    u.order = { type: "attack", targetId: obj.id };
  else
    u.order = { type: "attackMove", x: obj.x, y: obj.y };
}
function sniperPrey(w, s, u) {
  const reach = UNITS[u.kind].sight + 2;
  let best = null;
  let bestScore = Infinity;
  for (const o of w.units.values()) {
    if (o.faction !== s.defender || UNITS[o.kind].domain !== "ground")
      continue;
    const d = dist(o.x, o.y, u.x, u.y);
    if (d > reach || !unitSeenBy(w, u.faction, o))
      continue;
    const score = d - (isInfantry(o.kind) ? 4 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = { id: o.id, x: o.x, y: o.y, mobile: true };
    }
  }
  return best;
}
function nearestBuddy(w, u, ground) {
  let buddy = null;
  let bestD = Infinity;
  for (const o of w.units.values()) {
    if (o.faction !== u.faction || o.id === u.id || o.kind === "sniper")
      continue;
    const ot = UNITS[o.kind].targets;
    if (ot !== "ground" && ot !== "both")
      continue;
    if (ground && UNITS[o.kind].domain !== "ground")
      continue;
    const d = dist(o.x, o.y, u.x, u.y);
    if (d < bestD) {
      bestD = d;
      buddy = o;
    }
  }
  return { buddy, d: bestD };
}
function retask(w, s) {
  for (const u of w.units.values()) {
    if (!isWaveUnit(s, u) || marching(s, u))
      continue;
    if (u.kind === "sniper") {
      const busy = (id) => id !== null && w.units.has(id);
      if (busy(u.order.type === "attack" ? u.order.targetId : null) || busy(u.autoTargetId))
        continue;
      const prey = sniperPrey(w, s, u);
      if (prey) {
        orderWaveUnit(u, prey);
        continue;
      }
      if (u.order.type !== "idle" || u.autoTargetId !== null)
        continue;
      const { buddy, d } = nearestBuddy(w, u, true);
      if (buddy && d > 2.5)
        orderWaveUnit(u, { id: buddy.id, x: buddy.x, y: buddy.y, mobile: false });
      else if (!buddy)
        orderWaveUnit(u, objective(w, s, "boss", u.x, u.y));
      continue;
    }
    if (u.order.type !== "idle" || u.autoTargetId !== null)
      continue;
    const st = UNITS[u.kind];
    let obj;
    if (st.targets === "air" || st.targets === "none") {
      const { buddy, d } = nearestBuddy(w, u, false);
      obj = buddy && d > 2.5 ? { id: buddy.id, x: buddy.x, y: buddy.y, mobile: false } : buddy ? null : objective(w, s, "boss", u.x, u.y);
    } else {
      const h = nearestHarvester(w, s, u.x, u.y);
      const b = nearestBuilding(w, s, u.x, u.y);
      obj = h && (!b || dist(h.x, h.y, u.x, u.y) < dist(b.x, b.y, u.x, u.y) + 4) ? h : b;
    }
    orderWaveUnit(u, obj);
  }
}
function earlyCallBonus(w) {
  const s = w.survival;
  if (!s || w.winner || s.warned || s.wave < 1 || waveUnitsLeft(w) > 0)
    return 0;
  const skipped = s.nextWaveTick - SURVIVAL.warn * TICK_RATE - w.tick;
  if (skipped < 3 * TICK_RATE)
    return 0;
  return Math.round(skipped / TICK_RATE * (SURVIVAL.earlyBase + SURVIVAL.earlyPerWave * (s.wave + 1)));
}
function callWaveEarly(w, faction) {
  const s = w.survival;
  if (!s || faction !== s.defender)
    return;
  const bonus = earlyCallBonus(w);
  if (bonus <= 0)
    return;
  w.factions[faction].scrap += bonus;
  s.bonusEarned += bonus;
  s.earlyBonus = bonus;
  s.nextWaveTick = w.tick + SURVIVAL.warn * TICK_RATE;
}
function wavesSurvived(w) {
  const s = w.survival;
  if (!s)
    return 0;
  return s.cleared >= s.wave ? s.wave : s.wave - 1;
}
function survivalStatus(w) {
  const s = w.survival;
  if (!s)
    return null;
  const next = s.wave + 1;
  const left = waveUnitsLeft(w);
  const site = s.warned ? s.sites[waveSite(w, next)] ?? null : left > 0 ? s.sites[s.site] ?? null : null;
  return {
    wave: s.wave,
    left,
    next,
    nextTheme: waveTheme(w, next),
    nextName: waveName(w, next),
    nextIn: Math.max(0, (s.nextWaveTick - w.tick) / TICK_RATE),
    warned: s.warned,
    site,
    callBonus: earlyCallBonus(w),
    survived: wavesSurvived(w)
  };
}
function survivalHoldPoint(w, faction) {
  const s = w.survival;
  if (!s || faction !== s.defender)
    return null;
  const hq = hqOf(w, faction);
  if (!hq)
    return null;
  const c = buildingCenter(hq);
  let near = null;
  let bestD = Infinity;
  for (const u of w.units.values()) {
    if (!isWaveUnit(s, u) || !unitSeenBy(w, faction, u))
      continue;
    let d2 = dist(u.x, u.y, c.x, c.y);
    for (const b of w.buildings.values())
      if (b.faction === faction)
        d2 = Math.min(d2, distToBuilding(b, u.x, u.y));
    if (d2 < bestD) {
      bestD = d2;
      near = u;
    }
  }
  if (near && bestD < 14)
    return { x: near.x, y: near.y, engage: true };
  const site = s.sites[s.warned || waveUnitsLeft(w) === 0 ? waveSite(w, s.wave + 1) : s.site];
  if (!site)
    return { x: c.x, y: c.y, engage: false };
  const d = Math.max(1, dist(c.x, c.y, site.x, site.y));
  const k = Math.min(7, d) / d;
  return { x: c.x + (site.x - c.x) * k, y: c.y + (site.y - c.y) * k, engage: false };
}

// src/sim/ai/veterans.ts
var VETERAN_RETREAT = {
  minRank: 2,
  hpFrac: 0.35,
  arrive: 3,
  homeOffset: 3
};
function isWoundedVeteran(u) {
  return u.rank >= VETERAN_RETREAT.minRank && u.kind !== "mender" && u.kind !== "harvester" && u.kind !== "goliath" && u.hp < UNITS[u.kind].hp * VETERAN_RETREAT.hpFrac;
}
function veteranRetreats(faction, army, home, used, w) {
  const cmds = [];
  const menders = army.filter((u) => u.kind === "mender");
  const resting = [];
  for (const u of army) {
    if (!isWoundedVeteran(u) || used.has(u.id))
      continue;
    used.add(u.id);
    const walks = !!w && UNITS[u.kind].domain !== "air";
    if (walks && !onHomeLand(w, faction, Math.floor(u.x), Math.floor(u.y)))
      continue;
    const dHome = dist(u.x, u.y, home.x, home.y);
    let dest = null;
    let best = Infinity;
    for (const m of menders) {
      if (dist(m.x, m.y, home.x, home.y) > dHome - 4)
        continue;
      if (walks && !canGetWithin(w, moveClassOf(u.kind), u.x, u.y, m.x, m.y, VETERAN_RETREAT.arrive))
        continue;
      const d = dist(m.x, m.y, u.x, u.y);
      if (d < best) {
        best = d;
        dest = { x: m.x, y: m.y };
      }
    }
    if (!dest) {
      const k = dHome > 0.01 ? VETERAN_RETREAT.homeOffset / dHome : 0;
      dest = { x: home.x + (u.x - home.x) * k, y: home.y + (u.y - home.y) * k };
    }
    if (dist(u.x, u.y, dest.x, dest.y) <= VETERAN_RETREAT.arrive) {
      if (!menders.some((m) => dist(m.x, m.y, u.x, u.y) <= 4))
        resting.push(u);
      continue;
    }
    const o = u.order;
    if (o.type === "move" && dist(o.x, o.y, dest.x, dest.y) <= VETERAN_RETREAT.arrive)
      continue;
    cmds.push({ type: "move", faction, unitIds: [u.id], x: dest.x, y: dest.y });
  }
  for (const v of resting) {
    let pick = null;
    let best = Infinity;
    for (const m of menders) {
      if (used.has(m.id) || m.order.type !== "idle")
        continue;
      const d = dist(m.x, m.y, v.x, v.y);
      if (d < best) {
        best = d;
        pick = m;
      }
    }
    if (!pick)
      break;
    used.add(pick.id);
    cmds.push({ type: "attackMove", faction, unitIds: [pick.id], x: v.x, y: v.y });
  }
  return cmds;
}

// src/sim/ai/menders.ts
var MENDER_AI = {
  wounded: 0.85,
  reach: 20,
  company: 5,
  deep: 16,
  deepCompany: 400,
  slack: 2.5,
  rest: 3,
  goliath: 3,
  goliathReach: 30,
  goliathAway: 10,
  goliathStand: 1.6
};
function planMenders(faction, army, buildings, used, home, enemyHq, goliaths = [], w) {
  const cmds = [];
  const menders = army.filter((u) => u.kind === "mender" && !used.has(u.id));
  if (menders.length === 0)
    return cmds;
  const allGoliaths = [...goliaths, ...army.filter((u) => !!u.goliath && !goliaths.includes(u))];
  const others = army.filter((u) => u.kind !== "mender" && !u.goliath);
  const company = (u) => others.reduce((v, o) => dist(o.x, o.y, u.x, u.y) <= MENDER_AI.company ? v + UNITS[o.kind].cost : v, 0);
  const safe = (u) => dist(u.x, u.y, enemyHq.x, enemyHq.y) > MENDER_AI.deep || company(u) >= MENDER_AI.deepCompany;
  const hp = (u) => u.hp / UNITS[u.kind].hp;
  const wounded = others.filter((u) => hp(u) < MENDER_AI.wounded && safe(u));
  const moving = others.filter((u) => u.order.type !== "idle" && safe(u));
  let rest = { x: home.x, y: home.y };
  let worst = 1;
  for (const b of buildings) {
    const share = b.hp / BUILDINGS[b.kind].hp;
    if (share < worst) {
      worst = share;
      rest = buildingCenter(b);
    }
  }
  const go = (m, goal, near, follow) => {
    if (dist(m.x, m.y, goal.x, goal.y) <= near)
      return;
    const o = m.order;
    if ((o.type === "move" || o.type === "attackMove") && dist(o.x, o.y, goal.x, goal.y) <= near)
      return;
    cmds.push({ type: follow ? "attackMove" : "move", faction, unitIds: [m.id], x: goal.x, y: goal.y });
  };
  const free = [...menders];
  const take = (g, n) => {
    const picks = free.filter((m) => dist(m.x, m.y, g.x, g.y) <= MENDER_AI.goliathReach).sort((a, b) => dist(a.x, a.y, g.x, g.y) - dist(b.x, b.y, g.x, g.y) || a.id - b.id).slice(0, n);
    for (const m of picks) {
      free.splice(free.indexOf(m), 1);
      used.add(m.id);
      go(m, g, MENDER_AI.goliathStand, true);
    }
  };
  const repairable = allGoliaths.filter((g) => !isLifted(g) && !(w && isStunned(w, g.id)));
  const hurt = repairable.filter((g) => repairUrgency(g) > 0 || hp(g) < MENDER_AI.wounded).sort((a, b) => repairUrgency(b) - repairUrgency(a) || hp(a) - hp(b) || a.id - b.id);
  for (const g of hurt)
    take(g, MENDER_AI.goliath);
  for (const g of [...repairable].sort((a, b) => a.id - b.id))
    if (!hurt.includes(g) && dist(g.x, g.y, home.x, home.y) > MENDER_AI.goliathAway)
      take(g, 1);
  for (const m of free) {
    used.add(m.id);
    let pick = null;
    let best = Infinity;
    for (const u of wounded) {
      const d = dist(u.x, u.y, m.x, m.y);
      if (d > MENDER_AI.reach)
        continue;
      const score = d + hp(u) * 10;
      if (score < best) {
        best = score;
        pick = u;
      }
    }
    if (!pick) {
      best = Infinity;
      for (const u of moving) {
        const d = dist(u.x, u.y, m.x, m.y);
        if (d < best) {
          best = d;
          pick = u;
        }
      }
    }
    go(m, pick ?? rest, pick ? MENDER_AI.slack : MENDER_AI.rest, !!pick);
  }
  return cmds;
}

// src/sim/ai/salvage.ts
var SWEEP_RADIUS = 8;
var ASSAULT_SWEEP_RADIUS = 5;
var HARVESTER_DIVERT = 5;
var DANGER_RADIUS = 7;
var CALM_RADIUS = 8;
var CALM_TICKS = 50;
var MAX_SWEEPERS = 6;
var MIN_TTL = 40;
function planSalvage(w, faction, ctx) {
  const cmds = [];
  const loot = w.wrecks.filter((r) => r.hot <= 0 && r.ttl > MIN_TTL && isVisible(w, faction, Math.floor(r.x), Math.floor(r.y)));
  if (loot.length === 0)
    return cmds;
  const enemies = [];
  for (const u of w.units.values())
    if (u.faction !== faction && UNITS[u.kind].dps > 0 && UNITS[u.kind].targets !== "air" && unitSeenBy(w, faction, u))
      enemies.push(u);
  const defences = knownBuildings(w, faction).filter((kb) => {
    const st = BUILDINGS[kb.kind];
    return st.dps > 0 && st.targets !== "air";
  });
  const safe = (r) => {
    for (const e of enemies)
      if (hypot(e.x - r.x, e.y - r.y) <= DANGER_RADIUS)
        return false;
    for (const kb of defences) {
      const st = BUILDINGS[kb.kind];
      const d = hypot(kb.tx + st.size / 2 - r.x, kb.ty + st.size / 2 - r.y) - st.size / 2;
      if (d <= st.range + 2)
        return false;
    }
    for (const u of ctx.army)
      if (w.tick - u.damagedTick < CALM_TICKS && hypot(u.x - r.x, u.y - r.y) <= CALM_RADIUS)
        return false;
    for (const h of ctx.harvesters)
      if (w.tick - h.damagedTick < CALM_TICKS && hypot(h.x - r.x, h.y - r.y) <= CALM_RADIUS)
        return false;
    for (const b of ctx.buildings)
      if (w.tick - b.damagedTick < CALM_TICKS && distToBuilding(b, r.x, r.y) <= CALM_RADIUS)
        return false;
    return true;
  };
  const claimed = new Set;
  const send = (u, r) => {
    claimed.add(r.id);
    ctx.used.add(u.id);
    cmds.push({ type: u.kind === "harvester" ? "move" : "attackMove", faction, unitIds: [u.id], x: r.x, y: r.y });
  };
  const ranked = loot.filter(safe).sort((a, b) => b.value - a.value || a.ttl - b.ttl);
  if (ranked.length === 0)
    return cmds;
  for (const h of ctx.harvesters) {
    if (ctx.used.has(h.id) || w.tick - h.damagedTick < CALM_TICKS)
      continue;
    const o = h.order;
    if (!(o.type === "idle" || o.type === "harvest" && o.phase !== "unloading"))
      continue;
    let best = null;
    let bestD = HARVESTER_DIVERT;
    for (const r of ranked) {
      if (claimed.has(r.id) || !canGetWithin(w, "ground", h.x, h.y, r.x, r.y, SALVAGE.pickupRadius))
        continue;
      const d = hypot(r.x - h.x, r.y - h.y);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    }
    if (best)
      send(h, best);
  }
  if (ctx.threatened)
    return cmds;
  const radius = ctx.assault ? ASSAULT_SWEEP_RADIUS : SWEEP_RADIUS;
  const sweepers = ctx.army.filter((u) => !ctx.used.has(u.id) && u.order.type === "idle" && UNITS[u.kind].domain === "ground");
  let sent = 0;
  for (const r of ranked) {
    if (sent >= MAX_SWEEPERS)
      break;
    if (claimed.has(r.id))
      continue;
    let best = null;
    let bestD = radius;
    for (const u of sweepers) {
      if (ctx.used.has(u.id))
        continue;
      if (!canGetWithin(w, moveClassOf(u.kind), u.x, u.y, r.x, r.y, SALVAGE.pickupRadius))
        continue;
      const d = hypot(u.x - r.x, u.y - r.y);
      if (d < bestD) {
        bestD = d;
        best = u;
      }
    }
    if (!best)
      continue;
    send(best, r);
    sent++;
  }
  return cmds;
}

// src/sim/ai/intel.ts
function seenEnemies(w, faction) {
  const out = [];
  for (const u of w.units.values())
    if (u.faction !== faction && unitSeenBy(w, faction, u))
      out.push(u);
  return out;
}
function aaWeight(st) {
  if (st.targets !== "air" && st.targets !== "both")
    return 0;
  return Math.min(1, Math.round(10 * st.dps * (st.airMult ?? 1) / UNITS["flak-crawler"].dps) / 10);
}
function unitAntiAir(u) {
  if (u.kind !== "goliath")
    return { weight: aaWeight(UNITS[u.kind]), range: UNITS[u.kind].range };
  const live = "goliath" in u && u.goliath ? u : null;
  let dps = 0;
  let range = 0;
  for (const k of GOLIATH_WEAPONS) {
    const st = GOLIATH.weapons[k];
    if (st.targets !== "air" && st.targets !== "both" || live && !weaponReady(live, k))
      continue;
    dps += st.dps * (st.airMult ?? 1);
    range = Math.max(range, st.range);
  }
  return { weight: Math.min(1, Math.round(10 * dps / UNITS["flak-crawler"].dps) / 10), range };
}
var AA_COVER = 0.5;
function aaSources(w, faction, seen) {
  const out = [];
  for (const u of seen ?? seenEnemies(w, faction)) {
    const { weight, range } = unitAntiAir(u);
    if (weight > 0)
      out.push({ x: u.x, y: u.y, reach: range + 3, weight });
  }
  for (const kb of knownBuildings(w, faction)) {
    if (kb.kind === "hq")
      continue;
    const st = BUILDINGS[kb.kind];
    const weight = aaWeight(st);
    if (weight > 0)
      out.push({ x: kb.tx + st.size / 2, y: kb.ty + st.size / 2, reach: st.range + 2, weight });
  }
  return out;
}
function aaStrengthAt(sources, x, y) {
  let v = 0;
  for (const a of sources)
    if (hypot(a.x - x, a.y - y) < a.reach)
      v += a.weight;
  return v;
}
function effectivenessVs(attacker2, armor, domain) {
  const st = UNITS[attacker2];
  if (st.targets === "none" || st.targets !== "both" && st.targets !== domain)
    return 0;
  return DAMAGE_VS[st.dmgType ?? "kinetic"][armor] * (domain === "air" ? st.airMult ?? 1 : 1);
}
var effectiveness = (attacker2, target) => effectivenessVs(attacker2, UNITS[target].armor, UNITS[target].domain);
var USELESS = 0.45;

// src/sim/ai/objectives.ts
var UPLINK_SQUAD = 400;
var UPLINK_GRACE = 20 * TICK_RATE;
var RESEND_TICKS = 25 * TICK_RATE;
var ASSAULT_SPARE = 2.5;
var CRATE_REACH = 30;
var CRATE_REACH_EASY = 18;
var CRATE_RUNNERS = 3;
var POST_SLACK = 1;
var SCAN_RADIUS = 7;
var memos = new WeakMap;
function memo(s) {
  let m = memos.get(s);
  if (!m) {
    m = { garrison: new Map, sent: new Map, runners: new Map };
    memos.set(s, m);
  }
  return m;
}
var inZone = (u, l, slack = 0) => hypot(u.x - l.x, u.y - l.y) <= OBJECTIVES.uplink.radius + slack;
var unfinished = (l, f) => {
  const bar = uplinkBar(l);
  return !(bar.side === f && bar.fill >= 100);
};
function objectiveHolds(w, faction, s) {
  const o = w.objectives;
  if (o.uplinks.length === 0 && o.crates.length === 0)
    return [];
  const m = memo(s);
  const out = [];
  for (const [lid, uid] of m.garrison) {
    const l = o.uplinks.find((x) => x.id === lid);
    const u = w.units.get(uid);
    if (!l || !u || l.owner !== faction) {
      m.garrison.delete(lid);
      continue;
    }
    if (inZone(u, l, POST_SLACK))
      out.push(uid);
  }
  for (const l of o.uplinks) {
    if (!unfinished(l, faction) && !l.contested)
      continue;
    for (const u of w.units.values())
      if (u.faction === faction && u.kind !== "harvester" && u.order.type === "idle" && inZone(u, l))
        out.push(u.id);
  }
  for (const [cid, ids] of m.runners) {
    const c = o.crates.find((x) => x.id === cid);
    if (!c) {
      m.runners.delete(cid);
      continue;
    }
    for (const id of ids) {
      const u = w.units.get(id);
      if (u && hypot(u.x - c.x, u.y - c.y) <= 2)
        out.push(id);
    }
  }
  return out;
}
var value = (us) => us.reduce((v, u) => v + UNITS[u.kind].cost, 0);
function enemyValueNear(w, faction, x, y, r) {
  let v = 0;
  for (const u of w.units.values()) {
    if (u.faction === faction || UNITS[u.kind].dps <= 0)
      continue;
    if (!unitSeenBy(w, faction, u))
      continue;
    if (hypot(u.x - x, u.y - y) <= r)
      v += UNITS[u.kind].cost;
  }
  return v;
}
var aaCover = (w, faction, x, y) => aaStrengthAt(aaSources(w, faction), x, y) >= AA_COVER;
var canReach = (w, u, l, r = OBJECTIVES.uplink.radius) => canGetWithin(w, moveClassOf(u.kind), u.x, u.y, l.x, l.y, r);
function planObjectives(w, faction, s, ctx) {
  const o = w.objectives;
  const cmds = [];
  if (o.uplinks.length === 0 && o.crates.length === 0)
    return cmds;
  const m = memo(s);
  const free = () => ctx.army.filter((u) => u.order.type === "idle" && !ctx.used.has(u.id));
  const take = (u) => ctx.used.add(u.id);
  for (const l of o.uplinks) {
    if (l.owner !== faction || l.infantryOnly)
      continue;
    const posted = m.garrison.get(l.id);
    const pu = posted !== undefined ? w.units.get(posted) : undefined;
    if (pu && inZone(pu, l, POST_SLACK))
      continue;
    if (pu && pu.order.type === "idle" && !ctx.used.has(pu.id) && dist(pu.x, pu.y, l.x, l.y) < 14) {
      take(pu);
      cmds.push({ type: "attackMove", faction, unitIds: [pu.id], x: l.x, y: l.y });
      continue;
    }
    const cands = free().filter((u) => UNITS[u.kind].domain === "ground" && u.kind !== "mortar" && dist(u.x, u.y, l.x, l.y) < 14 && captureWeight(l, u.kind) > 0 && canReach(w, u, l)).sort((a, b) => {
      const za = inZone(a, l) ? 0 : 1;
      const zb = inZone(b, l) ? 0 : 1;
      return za - zb || UNITS[a.kind].cost - UNITS[b.kind].cost || dist(a.x, a.y, l.x, l.y) - dist(b.x, b.y, l.x, l.y);
    });
    const g = cands[0];
    if (!g)
      continue;
    m.garrison.set(l.id, g.id);
    take(g);
    if (!inZone(g, l))
      cmds.push({ type: "attackMove", faction, unitIds: [g.id], x: l.x, y: l.y });
  }
  const reach = s.difficulty === "easy" ? CRATE_REACH_EASY : CRATE_REACH;
  const home = (c) => dist(c.x, c.y, ctx.hqC.x, ctx.hqC.y);
  for (const c of [...o.crates].sort((a, b) => a.landTick - b.landTick || home(a) - home(b)))
    planCrate(w, faction, c, m, ctx, free, cmds, reach);
  if (ctx.threatened || w.tick < UPLINK_GRACE)
    return cmds;
  const armyValue = value(ctx.army);
  const near = (l) => dist(l.x, l.y, ctx.hqC.x, ctx.hqC.y);
  const far = (l) => dist(l.x, l.y, ctx.enemyHqPos.x, ctx.enemyHqPos.y);
  const ownFlank = [...o.uplinks].sort((a, b) => near(a) - far(a) - (near(b) - far(b)))[0];
  const targets = o.uplinks.filter((l) => !l.infantryOnly && (l.owner !== faction || l.pushing !== null && l.pushing !== faction)).filter((l) => s.strategy.name !== "boom" || l === ownFlank).filter((l) => s.difficulty !== "easy" || l.owner === null).map((l) => {
    const centre = s.strategy.name === "ironclad" ? dist(l.x, l.y, w.width / 2, w.height / 2) * 0.5 : 0;
    return { l, score: near(l) - 0.5 * far(l) + centre + enemyValueNear(w, faction, l.x, l.y, SCAN_RADIUS) / 100 };
  }).sort((a, b) => a.score - b.score);
  for (const { l } of targets) {
    const sent = m.sent.get(l.id);
    const mine = ctx.army.filter((u) => captureWeight(l, u.kind) > 0 && (inZone(u, l, 1) || (u.order.type === "attackMove" || u.order.type === "move") && hypot(u.order.x - l.x, u.order.y - l.y) <= 3));
    const need = Math.max(UPLINK_SQUAD, 1.3 * enemyValueNear(w, faction, l.x, l.y, SCAN_RADIUS));
    if (value(mine) >= need)
      continue;
    if (ctx.mode === "assault" && armyValue < ASSAULT_SPARE * need)
      continue;
    if (sent && w.tick - sent.tick < RESEND_TICKS && sent.ids.some((id) => w.units.has(id)))
      continue;
    let guardSpare = value(ctx.army.filter((u) => dist(u.x, u.y, ctx.guardPoint.x, ctx.guardPoint.y) <= 5)) - ctx.guardNeed;
    const turn = (u) => dist(u.x, u.y, l.x, l.y) / Math.max(1, captureWeight(l, u.kind));
    const pool = free().filter((u) => u.kind !== "mender" && u.kind !== "mortar" && u.kind !== "scout" && u.kind !== "sniper" && captureWeight(l, u.kind) > 0 && canReach(w, u, l)).sort((a, b) => turn(a) - turn(b));
    const squad = [];
    let v = value(mine);
    for (const u of pool) {
      if (v >= need)
        break;
      const isGuard = dist(u.x, u.y, ctx.guardPoint.x, ctx.guardPoint.y) <= 5;
      if (isGuard) {
        if (guardSpare < UNITS[u.kind].cost)
          continue;
        guardSpare -= UNITS[u.kind].cost;
      }
      squad.push(u);
      v += UNITS[u.kind].cost;
    }
    if (v < need || squad.length === 0)
      continue;
    squad.forEach(take);
    m.sent.set(l.id, { tick: w.tick, ids: squad.map((u) => u.id) });
    cmds.push({ type: "attackMove", faction, unitIds: squad.map((u) => u.id), x: l.x, y: l.y });
    break;
  }
  return cmds;
}
function planCrate(w, faction, c, m, ctx, free, cmds, reach) {
  const onIt = (m.runners.get(c.id) ?? []).some((id) => {
    const u = w.units.get(id);
    if (!u)
      return false;
    if (hypot(u.x - c.x, u.y - c.y) <= 2)
      return true;
    const o = u.order;
    return (o.type === "move" || o.type === "attackMove") && hypot(o.x - c.x, o.y - c.y) <= 1;
  });
  if (onIt)
    return;
  const secsLeft = (c.expireTick - w.tick) / TICK_RATE;
  const enemyNear = enemyValueNear(w, faction, c.x, c.y, 6);
  const etaOf = (u) => {
    const d = dist(u.x, u.y, c.x, c.y);
    return d * (UNITS[u.kind].domain === "air" ? 1 : 1.3) / UNITS[u.kind].speed;
  };
  const pool = free().filter((u) => u.kind !== "mender" && dist(u.x, u.y, c.x, c.y) <= reach && etaOf(u) < secsLeft - 2 && canReach(w, u, c, 0.8)).sort((a, b) => etaOf(a) - etaOf(b));
  if (pool.length === 0)
    return;
  const need = Math.max(1, 1.2 * enemyNear);
  const squad = [];
  let v = 0;
  for (const u of pool) {
    if (squad.length >= CRATE_RUNNERS || squad.length > 0 && v >= need)
      break;
    squad.push(u);
    v += UNITS[u.kind].cost;
  }
  if (v < need * 0.6)
    return;
  const airValue = value(squad.filter((u) => UNITS[u.kind].domain === "air"));
  if (airValue > v / 2 && aaCover(w, faction, c.x, c.y))
    return;
  for (const u of squad)
    ctx.used.add(u.id);
  m.runners.set(c.id, squad.map((u) => u.id));
  const type = enemyNear > 0 ? "attackMove" : "move";
  cmds.push({ type, faction, unitIds: squad.map((u) => u.id), x: c.x, y: c.y });
}

// src/sim/ai/powers.ts
var REACTION = { easy: 1.1, normal: 0.6, hard: 0.4 };
var DODGE_DIST = 4;
var BARRAGE_MIN = 800;
var BARRAGE_SPREAD = 2.2;
var HAMMER_CLUMP = 700;
var HOME_RADIUS = 11;
var OFFENCE_RESERVE = 80;
var memos2 = new WeakMap;
function memo2(s) {
  let m = memos2.get(s);
  if (!m) {
    m = { seen: new Set, dodging: new Map };
    memos2.set(s, m);
  }
  return m;
}
var endTick = (c) => c.shells.length > 0 ? c.shells[c.shells.length - 1].tick : c.landTick;
function dodgeCalldowns(w, faction, s) {
  const active = w.powers.active;
  const m = memo2(s);
  if (m.dodging.size > 0) {
    for (const [id, until] of m.dodging)
      if (until <= w.tick)
        m.dodging.delete(id);
  }
  if (active.length === 0)
    return [];
  const delay = Math.round(REACTION[s.difficulty] * TICK_RATE);
  const cmds = [];
  const hq = hqOf(w, faction);
  for (const c of active) {
    if (c.faction === faction || m.seen.has(c.id) || w.tick - c.startTick < delay)
      continue;
    m.seen.add(c.id);
    const left = endTick(c) - w.tick;
    if (left < 3)
      continue;
    const reach = c.radius + 0.7;
    for (const u of w.units.values()) {
      if (u.faction !== faction)
        continue;
      if (!canWalk(u) || u.order.type === "lift")
        continue;
      const d = hypot(u.x - c.x, u.y - c.y);
      if (d > reach)
        continue;
      let dx = u.x - c.x;
      let dy = u.y - c.y;
      if (d < 0.3) {
        dx = (hq ? hq.tx + 1.5 : w.width / 2) - c.x;
        dy = (hq ? hq.ty + 1.5 : w.height / 2) - c.y;
      }
      const len = hypot(dx, dy) || 1;
      const { x, y } = dodgeSpot(w, u, dx / len, dy / len);
      cmds.push({ type: "move", faction, unitIds: [u.id], x, y });
      m.dodging.set(u.id, endTick(c) + 5);
    }
  }
  if (m.seen.size > 64)
    for (const id of [...m.seen].slice(0, 32))
      m.seen.delete(id);
  return cmds;
}
function dodgeSpot(w, u, ux, uy) {
  const at = (a, d) => {
    const c = cos(a);
    const s = sin(a);
    return {
      x: Math.min(w.width - 0.5, Math.max(0.5, u.x + (ux * c - uy * s) * d)),
      y: Math.min(w.height - 0.5, Math.max(0.5, u.y + (ux * s + uy * c) * d))
    };
  };
  const mc = moveClassOf(u.kind);
  const home = mc === "air" ? 0 : regionAt(w, Math.floor(u.x), Math.floor(u.y), mc);
  if (!w.rules?.islands || !home)
    return at(0, DODGE_DIST);
  for (const d of [DODGE_DIST, 3, 2])
    for (const a of [0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8]) {
      const p = at(a, d);
      if (regionAt(w, Math.floor(p.x), Math.floor(p.y), mc) === home)
        return p;
    }
  return at(0, DODGE_DIST);
}
function dodgingUnits(w, s) {
  const m = memos2.get(s);
  if (!m)
    return [];
  return [...m.dodging].filter(([, until]) => until > w.tick).map(([id]) => id);
}
function bestClump(units, radius, weight) {
  let best = null;
  const score = (x, y) => {
    let v = 0;
    for (const o of units)
      if (hypot(o.x - x, o.y - y) <= radius)
        v += weight(o);
    return v;
  };
  for (const u of units) {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const o of units)
      if (hypot(o.x - u.x, o.y - u.y) <= radius) {
        sx += o.x;
        sy += o.y;
        n++;
      }
    for (const [x, y] of [
      [u.x, u.y],
      [sx / n, sy / n]
    ]) {
      const v = score(x, y);
      if (!best || v > best.value)
        best = { x, y, value: v };
    }
  }
  return best;
}
function podSite(w, faction, x, y) {
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const q = QUARTER[faction];
  for (let r = 0;r <= 4; r++)
    for (let i = -r;i <= r; i++)
      for (let j = -r;j <= r; j++) {
        const [dx, dy] = turnVec(q, j, i);
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r)
          continue;
        const tx = cx + dx;
        const ty = cy + dy;
        if (!passable(w, tx, ty, "ground") || !isVisible(w, faction, tx, ty))
          continue;
        let open = 0;
        for (let oy = -1;oy <= 1; oy++)
          for (let ox = -1;ox <= 1; ox++)
            if (passable(w, tx + ox, ty + oy, "ground"))
              open++;
        if (open >= 6)
          return { x: tx + 0.5, y: ty + 0.5 };
      }
  return null;
}
var value2 = (us) => us.reduce((v, u) => v + UNITS[u.kind].cost, 0);
var PRODUCTION2 = ["fab-plant", "airpad", "assembly-bay", "tech-lab", "gantry"];
var hammerWorth = (w, kb) => kb.kind === "gantry" && w.buildings.get(kb.id)?.queue[0]?.kind === "goliath" ? 3 : PRODUCTION2.includes(kb.kind) ? 1.5 : kb.kind === "hq" ? 1.2 : 1;
function planCalldowns(w, faction, s, ctx) {
  const cmds = [];
  const fire2 = (power, x, y) => {
    if (calldownBlocker(w, faction, power, x, y))
      return false;
    cmds.push({ type: "calldown", faction, power, x, y });
    return true;
  };
  const ready = (p) => powerStatus(w, faction, p).ready;
  const visibleEnemies = seenEnemies(w, faction);
  const armed = visibleEnemies.filter((u) => UNITS[u.kind].dps > 0 || UNITS[u.kind].heal);
  if (ready("hammer")) {
    const t = hammerTarget(w, faction, visibleEnemies);
    if (t)
      fire2("hammer", t.x, t.y);
  }
  const homeThreat = armed.filter((u) => dist(u.x, u.y, ctx.hqC.x, ctx.hqC.y) <= HOME_RADIUS || dist(u.x, u.y, ctx.guardPoint.x, ctx.guardPoint.y) <= 6);
  const threatValue = value2(homeThreat);
  if (threatValue >= 450) {
    const guard = value2(ctx.army.filter((u) => dist(u.x, u.y, ctx.hqC.x, ctx.hqC.y) <= HOME_RADIUS || dist(u.x, u.y, ctx.guardPoint.x, ctx.guardPoint.y) <= 6));
    if (threatValue > guard * 1.25) {
      if (ready("droppod")) {
        const cx = homeThreat.reduce((a, u) => a + u.x, 0) / homeThreat.length;
        const cy = homeThreat.reduce((a, u) => a + u.y, 0) / homeThreat.length;
        const d = Math.max(1, dist(cx, cy, ctx.hqC.x, ctx.hqC.y));
        const k = Math.min(1, Math.max(0, (d - 3) / d));
        const site = podSite(w, faction, ctx.hqC.x + (cx - ctx.hqC.x) * k, ctx.hqC.y + (cy - ctx.hqC.y) * k);
        if (site && fire2("droppod", site.x, site.y))
          return cmds;
      }
      const clump = bestClump(homeThreat, POWERS.emp.radius - 0.4, (u) => UNITS[u.kind].cost);
      if (clump && clump.value >= 350 && ready("emp") && fire2("emp", clump.x, clump.y))
        return cmds;
    }
  }
  if (s.difficulty !== "easy" && ready("barrage")) {
    const ground = visibleEnemies.filter((u) => domainOf(u) === "ground");
    const clump = bestClump(ground, BARRAGE_SPREAD, (u) => UNITS[u.kind].cost * (isStunned(w, u.id) ? 1.5 : 1));
    if (clump && clump.value >= BARRAGE_MIN && fire2("barrage", clump.x, clump.y))
      return cmds;
  }
  if (ready("emp") && w.powers.meter[faction] >= OFFENCE_RESERVE) {
    for (const e of visibleEnemies) {
      if (!e.goliath || isStunned(w, e.id))
        continue;
      const menders = visibleEnemies.filter((o) => UNITS[o.kind].heal && hypot(o.x - e.x, o.y - e.y) <= 3).length;
      if (menders < 2 || value2(ctx.army.filter((u) => dist(u.x, u.y, e.x, e.y) <= 9)) < 550)
        continue;
      if (fire2("emp", e.x, e.y))
        return cmds;
    }
  }
  if (ctx.mode === "assault" && ready("emp") && w.powers.meter[faction] >= OFFENCE_RESERVE) {
    const defences = knownBuildings(w, faction).filter((kb) => kb.kind === "turret" || kb.kind === "sam-site");
    let best = null;
    for (const kb of defences) {
      const st = BUILDINGS[kb.kind];
      const x = kb.tx + st.size / 2;
      const y = kb.ty + st.size / 2;
      const near = value2(ctx.army.filter((u) => dist(u.x, u.y, x, y) <= st.range + 2.5));
      if (near < 550)
        continue;
      const v = near + defences.filter((o) => dist(o.tx, o.ty, kb.tx, kb.ty) <= POWERS.emp.radius).length * 200;
      if (!best || v > best.v)
        best = { x, y, v };
    }
    if (best && fire2("emp", best.x, best.y))
      return cmds;
    const fighting = armed.filter((u) => ctx.army.some((a) => dist(a.x, a.y, u.x, u.y) <= 6));
    const clump = bestClump(fighting, POWERS.emp.radius - 0.4, (u) => UNITS[u.kind].cost);
    if (clump && clump.value >= 900 && fire2("emp", clump.x, clump.y))
      return cmds;
  }
  if (ctx.mode === "assault" && ready("droppod")) {
    const front = ctx.army.filter((u) => UNITS[u.kind].domain === "ground" && dist(u.x, u.y, ctx.hqC.x, ctx.hqC.y) > HOME_RADIUS && armed.some((e) => dist(e.x, e.y, u.x, u.y) <= 6));
    const cx = front.reduce((a, u) => a + u.x, 0) / Math.max(1, front.length);
    const cy = front.reduce((a, u) => a + u.y, 0) / Math.max(1, front.length);
    const opposed = value2(armed.filter((e) => dist(e.x, e.y, cx, cy) <= 8));
    if (value2(front) >= 600 && opposed >= value2(front) * 0.9) {
      const d = Math.max(1, dist(cx, cy, ctx.hqC.x, ctx.hqC.y));
      const site = podSite(w, faction, cx + (ctx.hqC.x - cx) / d * 2, cy + (ctx.hqC.y - cy) / d * 2);
      if (site)
        fire2("droppod", site.x, site.y);
    }
  }
  return cmds;
}
function hammerTarget(w, faction, visibleEnemies) {
  const R = POWERS.hammer.radius;
  const clump = bestClump(visibleEnemies, R * 0.8, (u) => UNITS[u.kind].cost * (isStunned(w, u.id) ? 1.3 : 1));
  if (clump && clump.value >= HAMMER_CLUMP)
    return clump;
  const known = knownBuildings(w, faction);
  const centre = (kb) => ({
    x: kb.tx + BUILDINGS[kb.kind].size / 2,
    y: kb.ty + BUILDINGS[kb.kind].size / 2
  });
  let best = null;
  for (const kb of known) {
    if (!PRODUCTION2.includes(kb.kind))
      continue;
    const c = centre(kb);
    for (const o of [kb, ...known]) {
      const oc = centre(o);
      const x = (c.x + oc.x) / 2;
      const y = (c.y + oc.y) / 2;
      let v = 0;
      for (const k of known) {
        const size2 = BUILDINGS[k.kind].size;
        const dx = Math.max(k.tx - x, 0, x - (k.tx + size2));
        const dy = Math.max(k.ty - y, 0, y - (k.ty + size2));
        if (hypot(dx, dy) > R - 0.2)
          continue;
        v += hammerWorth(w, k);
      }
      const size = BUILDINGS[kb.kind].size;
      const ddx = Math.max(kb.tx - x, 0, x - (kb.tx + size));
      const ddy = Math.max(kb.ty - y, 0, y - (kb.ty + size));
      if (hypot(ddx, ddy) > R - 0.2)
        continue;
      if (!best || v > best.v)
        best = { x, y, v };
    }
  }
  if (best)
    return best;
  const hq = known.find((kb) => kb.kind === "hq");
  return hq ? centre(hq) : null;
}

// src/sim/ai/condor.ts
var CONDOR_AI = {
  from: 150,
  airborneFrom: 60,
  every: 45,
  boardTimeout: 40,
  waitTimeout: 40,
  raid: 50,
  maxBuilt: 3,
  rebuild: 90,
  standoff: 2.5,
  minHp: 0.7,
  reach: 16,
  abortLoss: 0.3,
  recall: 90,
  recallRadius: 8,
  chase: 8,
  guardRadius: 6,
  guardShare: 0.8,
  frontFrom: 18,
  frontValue: 500,
  frontBack: 3
};
var memos3 = new WeakMap;
function memo3(s) {
  let m = memos3.get(s);
  if (!m) {
    m = {
      phase: "ready",
      condorId: null,
      squads: [],
      since: 0,
      waypoint: null,
      drop: null,
      goal: null,
      raiders: [],
      raidUntil: 0,
      field: null,
      lastDrop: -1e9,
      launchHp: 0,
      turnedBack: false,
      built: 0,
      lastAdopted: -1,
      lostTick: -1e9,
      threats: []
    };
    memos3.set(s, m);
  }
  return m;
}
function dropsCondors(w, faction, s) {
  if (s.difficulty === "easy" || w.survival || !Number.isFinite(s.strategy.harassGroup))
    return false;
  if (w.objectives.uplinks.some((l) => l.infantryOnly))
    return false;
  const everyone = infantryArmy(w, faction) || rulesOf(w).startUnits.includes("condor");
  if (s.strategy.name !== "rush" && s.strategy.name !== "balanced" && !everyone)
    return false;
  return bannedBy(w, "condor", faction) === null && bannedBy(w, "trooper", faction) === null;
}
function flysGivenCondor(w, faction, s) {
  return rulesOf(w).startUnits.includes("condor") && dropsCondors(w, faction, s);
}
var AIRBORNE_INFANTRY = 0.25;
function wantCondor(w, faction, s, have, squads) {
  if (have > 0 || !dropsCondors(w, faction, s))
    return false;
  const m = memo3(s);
  noteLoss(w, m);
  if (m.built >= CONDOR_AI.maxBuilt || w.tick - m.lostTick < CONDOR_AI.rebuild * TICK_RATE)
    return false;
  return w.tick >= (CONDOR_AI.from - 20) * TICK_RATE && squads >= 2;
}
function noteLoss(w, m) {
  if (m.condorId !== null && !w.units.has(m.condorId)) {
    m.lostTick = w.tick;
    m.condorId = null;
  }
}
function condorHolds(w, s) {
  const m = memos3.get(s);
  if (!m)
    return [];
  const out = [];
  if (m.phase === "boarding") {
    for (const id of m.squads)
      if (w.units.has(id))
        out.push(id);
  }
  if (w.tick < m.raidUntil) {
    for (const id of m.raiders)
      if (w.units.has(id))
        out.push(id);
  }
  return out;
}
function dropCondorId(s) {
  return memos3.get(s)?.condorId ?? null;
}
function planCondor(w, faction, s, ctx) {
  const cmds = [];
  if (!dropsCondors(w, faction, s))
    return cmds;
  const m = memo3(s);
  const tps = TICK_RATE;
  const enemyGuess = { x: w.width - ctx.hqC.x, y: w.height - ctx.hqC.y };
  const back = Math.max(1, dist(ctx.hqC.x, ctx.hqC.y, enemyGuess.x, enemyGuess.y));
  const behind = {
    x: ctx.hqC.x - (enemyGuess.x - ctx.hqC.x) / back * 2.5,
    y: ctx.hqC.y - (enemyGuess.y - ctx.hqC.y) / back * 2.5
  };
  const home = dropPoint(w, faction, behind.x, behind.y) ?? behind;
  planRaiders(w, faction, m, ctx, cmds);
  noteLoss(w, m);
  const lifting = (u) => u.order.type === "lift" || !!ctx.skip?.has(u.id);
  let c = m.condorId !== null ? w.units.get(m.condorId) : undefined;
  if (c && lifting(c)) {
    c = undefined;
    m.condorId = null;
  }
  if (!c) {
    for (const u of w.units.values())
      if (u.faction === faction && u.kind === "condor" && !lifting(u)) {
        c = u;
        break;
      }
    if (!c) {
      setPhase(m, "ready", w.tick);
      m.squads = [];
      return cmds;
    }
    m.condorId = c.id;
    if (c.id > m.lastAdopted)
      m.built++;
    m.lastAdopted = Math.max(m.lastAdopted, c.id);
    setPhase(m, "ready", w.tick);
    m.squads = [];
    m.turnedBack = false;
  }
  const condor = c;
  const cap = UNITS.condor.capacity ?? 2;
  const aboard = () => (condor.passengers ?? []).map((p) => p.id);
  const unloadHome = () => {
    cmds.push({ type: "unload", faction, unitIds: [condor.id] });
    m.lastDrop = w.tick;
    setPhase(m, "return", w.tick);
  };
  const goHome = () => {
    if (dist(condor.x, condor.y, home.x, home.y) > 2 && condor.order.type === "idle")
      cmds.push({ type: "move", faction, unitIds: [condor.id], x: home.x, y: home.y });
  };
  const cargo = () => (condor.passengers ?? []).reduce((v, u) => v + UNITS[u.kind].cost, 0);
  const fly = (plan) => {
    m.drop = plan.drop;
    m.field = plan.line;
    m.waypoint = plan.waypoint;
    m.goal = plan.goal;
    if (plan.waypoint) {
      cmds.push({ type: "move", faction, unitIds: [condor.id], x: plan.waypoint.x, y: plan.waypoint.y });
      setPhase(m, "transit", w.tick);
    } else {
      cmds.push({ type: "unload", faction, unitIds: [condor.id], x: plan.drop.x, y: plan.drop.y });
      setPhase(m, "drop", w.tick);
    }
  };
  const wayIn = (value3) => {
    const enemies = known(w, faction, m);
    return planDrop(w, faction, condor, ctx.hqC, enemies, value3) ?? (s.mode === "assault" ? frontDrop(w, faction, condor, ctx, enemies) : null);
  };
  const hurt = () => condor.hp < m.launchHp - UNITS.condor.hp * CONDOR_AI.abortLoss;
  const turnBack = () => {
    noteThreats(w, faction, m, condor);
    cmds.push({ type: "move", faction, unitIds: [condor.id], x: home.x, y: home.y });
    m.lastDrop = w.tick;
    m.turnedBack = true;
    setPhase(m, "return", w.tick);
  };
  switch (m.phase) {
    case "ready": {
      if (isLoaded(condor)) {
        setPhase(m, "loaded", w.tick);
        break;
      }
      goHome();
      const from = rulesOf(w).startUnits.includes("condor") ? CONDOR_AI.airborneFrom : CONDOR_AI.from;
      if (ctx.threatened || w.tick < from * tps || w.tick - m.lastDrop < CONDOR_AI.every * tps)
        break;
      if (condor.order.type !== "idle")
        break;
      const picks = recruits(condor, ctx, cap);
      if (picks.length === 0)
        break;
      const value3 = picks.reduce((v, u) => v + UNITS[u.kind].cost, 0) * cap / picks.length;
      if (!wayIn(value3))
        break;
      m.squads = picks.map((u) => u.id);
      for (const id of m.squads)
        ctx.used.add(id);
      cmds.push({ type: "board", faction, unitIds: m.squads, carrierId: condor.id });
      setPhase(m, "boarding", w.tick);
      break;
    }
    case "boarding": {
      const inHold = aboard();
      const walking = m.squads.filter((id) => {
        const u = w.units.get(id);
        return !!u && u.order.type === "board" && u.order.carrierId === condor.id;
      });
      const late = w.tick - m.since > CONDOR_AI.boardTimeout * tps;
      const free = cap - inHold.length - walking.length;
      if (free > 0 && !late && !ctx.threatened) {
        const more = recruits(condor, ctx, free).map((u) => u.id);
        if (more.length > 0) {
          for (const id of more)
            ctx.used.add(id);
          cmds.push({ type: "board", faction, unitIds: more, carrierId: condor.id });
          walking.push(...more);
        }
      }
      m.squads = [...inHold, ...walking];
      if (ctx.threatened) {
        if (walking.length > 0)
          cmds.push({ type: "stop", faction, unitIds: walking });
        if (inHold.length > 0)
          unloadHome();
        else
          setPhase(m, "ready", w.tick);
        m.lastDrop = w.tick;
      } else if (inHold.length >= cap || inHold.length > 0 && late) {
        if (walking.length > 0)
          cmds.push({ type: "stop", faction, unitIds: walking });
        setPhase(m, "loaded", w.tick);
      } else if (inHold.length === 0 && (walking.length === 0 || late)) {
        if (walking.length > 0)
          cmds.push({ type: "stop", faction, unitIds: walking });
        m.lastDrop = w.tick;
        setPhase(m, "ready", w.tick);
      }
      break;
    }
    case "loaded": {
      if (!isLoaded(condor)) {
        setPhase(m, "ready", w.tick);
        break;
      }
      if (condor.order.type !== "idle")
        break;
      if (ctx.threatened || m.turnedBack || w.tick - m.since > CONDOR_AI.waitTimeout * tps) {
        unloadHome();
        m.turnedBack = false;
        break;
      }
      const plan = wayIn(cargo());
      if (!plan)
        break;
      m.squads = aboard();
      m.launchHp = condor.hp;
      fly(plan);
      break;
    }
    case "transit": {
      if (!isLoaded(condor)) {
        setPhase(m, "return", w.tick);
        break;
      }
      if (hurt()) {
        turnBack();
        break;
      }
      const wp = m.waypoint;
      if (wp && dist(condor.x, condor.y, wp.x, wp.y) > 1.5 && condor.order.type === "move")
        break;
      const plan = wayIn(cargo());
      if (plan)
        fly(plan);
      else
        turnBack();
      break;
    }
    case "drop": {
      if (!isLoaded(condor)) {
        const landed = m.squads.filter((id) => w.units.has(id));
        m.squads = [];
        m.lastDrop = w.tick;
        if (m.goal) {
          for (const id of landed)
            ctx.used.add(id);
          if (landed.length > 0)
            cmds.push({ type: "attackMove", faction, unitIds: landed, x: m.goal.x, y: m.goal.y });
        } else {
          m.raiders = landed;
          m.raidUntil = w.tick + CONDOR_AI.raid * tps;
          planRaiders(w, faction, m, ctx, cmds);
        }
        cmds.push({ type: "move", faction, unitIds: [condor.id], x: home.x, y: home.y });
        setPhase(m, "return", w.tick);
      } else if (condor.order.type !== "unload") {
        setPhase(m, "loaded", w.tick);
      } else if (condor.order.hover < 0 && hurt()) {
        turnBack();
      } else if (condor.order.hover < 0 && m.drop) {
        const enemies = known(w, faction, m);
        const lz = m.drop;
        if (!m.goal && guarded(enemies, cargo(), lz) || airspace(w, faction, enemies).covered(lz.x, lz.y)) {
          noteThreats(w, faction, m, condor);
          const plan = wayIn(cargo());
          if (plan)
            fly(plan);
          else
            turnBack();
        }
      }
      break;
    }
    case "return": {
      if (condor.order.type === "unload")
        break;
      if (condor.order.type === "idle" && dist(condor.x, condor.y, home.x, home.y) <= 2.5)
        setPhase(m, isLoaded(condor) ? "loaded" : "ready", w.tick);
      else
        goHome();
      break;
    }
  }
  return cmds;
}
function recruits(condor, ctx, n) {
  return ctx.army.filter((u) => isInfantry(u.kind) && u.kind !== "sniper" && (u.order.type === "idle" || u.order.type === "attackMove") && !ctx.used.has(u.id) && u.hp >= UNITS[u.kind].hp * CONDOR_AI.minHp && dist(u.x, u.y, condor.x, condor.y) <= CONDOR_AI.reach && dist(u.x, u.y, ctx.hqC.x, ctx.hqC.y) <= CONDOR_AI.reach).sort((a, b) => dist(a.x, a.y, condor.x, condor.y) - dist(b.x, b.y, condor.x, condor.y)).slice(0, n);
}
function setPhase(m, p, tick) {
  if (m.phase !== p)
    m.since = tick;
  m.phase = p;
}
function planRaiders(w, faction, m, ctx, cmds) {
  if (m.raiders.length === 0)
    return;
  m.raiders = m.raiders.filter((id) => w.units.has(id));
  if (w.tick >= m.raidUntil) {
    m.raiders = [];
    return;
  }
  const idle = m.raiders.map((id) => w.units.get(id)).filter((u) => u.order.type === "idle" && u.autoTargetId === null);
  if (idle.length === 0)
    return;
  const cx = idle.reduce((a, u) => a + u.x, 0) / idle.length;
  const cy = idle.reduce((a, u) => a + u.y, 0) / idle.length;
  const ids = idle.map((u) => u.id);
  let best = null;
  for (const e of seenEnemies(w, faction)) {
    if (e.kind !== "harvester")
      continue;
    const d = dist(e.x, e.y, cx, cy);
    if (d <= CONDOR_AI.chase && (!best || d < best.d))
      best = { id: e.id, d };
  }
  if (best) {
    for (const id of ids)
      ctx.used.add(id);
    cmds.push({ type: "attack", faction, unitIds: ids, targetId: best.id });
    return;
  }
  let depot = null;
  for (const kb of knownBuildings(w, faction)) {
    if (kb.kind !== "depot")
      continue;
    const size = BUILDINGS[kb.kind].size;
    const d = dist(kb.tx + size / 2, kb.ty + size / 2, cx, cy);
    if (d <= CONDOR_AI.chase && (!depot || d < depot.d))
      depot = { x: kb.tx + size / 2, y: kb.ty + size / 2, d };
  }
  const goal = depot ?? m.field;
  if (!goal || dist(goal.x, goal.y, cx, cy) <= 2)
    return;
  for (const id of ids)
    ctx.used.add(id);
  cmds.push({ type: "attackMove", faction, unitIds: ids, x: goal.x, y: goal.y });
}
function known(w, faction, m) {
  const seen = seenEnemies(w, faction);
  m.threats = m.threats.filter((t) => t.until > w.tick);
  const ids = new Set(seen.map((u) => u.id));
  return [...seen, ...m.threats.filter((t) => !ids.has(t.id))];
}
function noteThreats(w, faction, m, c) {
  const until = w.tick + CONDOR_AI.recall * TICK_RATE;
  const r = CONDOR_AI.recallRadius;
  for (const e of seenEnemies(w, faction)) {
    const st = UNITS[e.kind];
    if (!(st.dps > 0 && st.domain === "ground" || aaWeight(st) > 0))
      continue;
    if (dist(e.x, e.y, c.x, c.y) > r && (!m.drop || dist(e.x, e.y, m.drop.x, m.drop.y) > r))
      continue;
    m.threats = m.threats.filter((t) => t.id !== e.id);
    m.threats.push({ id: e.id, kind: e.kind, x: e.x, y: e.y, until });
  }
}
function guarded(enemies, value3, p) {
  let v = 0;
  for (const e of enemies)
    if (UNITS[e.kind].dps > 0 && UNITS[e.kind].domain === "ground" && dist(e.x, e.y, p.x, p.y) <= CONDOR_AI.guardRadius)
      v += UNITS[e.kind].cost;
  return v > value3 * CONDOR_AI.guardShare;
}
function airspace(w, faction, enemies) {
  const sources = aaSources(w, faction, enemies);
  const covered = (x, y) => aaStrengthAt(sources, x, y) >= AA_COVER;
  const clear = (ax, ay, bx, by) => {
    const n = Math.max(1, Math.ceil(dist(ax, ay, bx, by)));
    for (let i = 1;i <= n; i++)
      if (covered(ax + (bx - ax) * i / n, ay + (by - ay) * i / n))
        return false;
    return true;
  };
  return { covered, clear };
}
var inMap = (w, p) => ({
  x: Math.min(w.width - 1, Math.max(1, p.x)),
  y: Math.min(w.height - 1, Math.max(1, p.y))
});
function route(w, c, drop, clear) {
  if (clear(c.x, c.y, drop.x, drop.y))
    return null;
  const len = Math.max(0.01, dist(c.x, c.y, drop.x, drop.y));
  const px = -(drop.y - c.y) / len;
  const py = (drop.x - c.x) / len;
  const mx = (c.x + drop.x) / 2;
  const my = (c.y + drop.y) / 2;
  for (const k of [6, -6, 10, -10, 14, -14]) {
    const wp = inMap(w, { x: mx + px * k, y: my + py * k });
    if (clear(c.x, c.y, wp.x, wp.y) && clear(wp.x, wp.y, drop.x, drop.y))
      return wp;
  }
  return;
}
function planDrop(w, faction, c, hqC, enemies, value3) {
  const { covered, clear } = airspace(w, faction, enemies);
  const lines = [];
  for (const e of enemies)
    if (e.kind === "harvester")
      lines.push({ x: e.x, y: e.y });
  for (const kb of knownBuildings(w, faction))
    if (kb.kind === "depot")
      lines.push({ x: kb.tx + 1, y: kb.ty + 1 });
  if (lines.length === 0) {
    const own = nearestScrapTile(w, hqC.x, hqC.y, faction);
    lines.push(own ? { x: w.width - own.x - 0.5, y: w.height - own.y - 0.5 } : { x: w.width - hqC.x, y: w.height - hqC.y });
  }
  lines.sort((a, b) => dist(a.x, a.y, hqC.x, hqC.y) - dist(b.x, b.y, hqC.x, hqC.y));
  const ANGLES = [0, 0.7, -0.7, 1.4, -1.4, 2.1, -2.1];
  for (const t of lines.slice(0, 4)) {
    const d0 = Math.max(0.01, dist(c.x, c.y, t.x, t.y));
    const ux = (c.x - t.x) / d0;
    const uy = (c.y - t.y) / d0;
    for (const a of ANGLES) {
      const dx = ux * cos(a) - uy * sin(a);
      const dy = ux * sin(a) + uy * cos(a);
      const drop = inMap(w, { x: t.x + dx * CONDOR_AI.standoff, y: t.y + dy * CONDOR_AI.standoff });
      if (covered(drop.x, drop.y) || guarded(enemies, value3, drop))
        continue;
      const waypoint = route(w, c, drop, clear);
      if (waypoint !== undefined)
        return { drop, waypoint, line: t, goal: null };
    }
  }
  return null;
}
function frontDrop(w, faction, c, ctx, enemies) {
  const { hqC } = ctx;
  const pushing = ctx.army.filter((u) => u.kind !== "mender" && (u.order.type === "attack" || u.order.type === "attackMove") && dist(u.x, u.y, hqC.x, hqC.y) > CONDOR_AI.frontFrom);
  let lead = null;
  let leadValue = 0;
  for (const u of pushing) {
    let v = 0;
    for (const o2 of pushing)
      if (dist(o2.x, o2.y, u.x, u.y) <= 5)
        v += UNITS[o2.kind].cost;
    if (v > leadValue) {
      leadValue = v;
      lead = u;
    }
  }
  if (!lead || leadValue < CONDOR_AI.frontValue)
    return null;
  const o = lead.order;
  let goal = null;
  if (o.type === "attackMove")
    goal = { x: o.x, y: o.y };
  else if (o.type === "attack") {
    const t = w.units.get(o.targetId);
    const b = w.buildings.get(o.targetId);
    goal = t ? { x: t.x, y: t.y } : b ? buildingCenter(b) : null;
  }
  if (!goal)
    return null;
  const back = Math.max(0.01, dist(lead.x, lead.y, hqC.x, hqC.y));
  const drop = inMap(w, {
    x: lead.x + (hqC.x - lead.x) / back * CONDOR_AI.frontBack,
    y: lead.y + (hqC.y - lead.y) / back * CONDOR_AI.frontBack
  });
  const { covered, clear } = airspace(w, faction, enemies);
  if (covered(drop.x, drop.y))
    return null;
  const waypoint = route(w, c, drop, clear);
  return waypoint === undefined ? null : { drop, waypoint, line: drop, goal };
}

// src/sim/ai/airlift.ts
var AIRLIFT = {
  from: { easy: 30, normal: 0, hard: 0 },
  every: { easy: 30, normal: 4, hard: 2 },
  condors: { easy: 1, normal: 2, hard: 3 },
  secondFrom: 75,
  boardTimeout: 25,
  reach: 22,
  minHp: 0.6,
  abortLoss: 0.3,
  retry: 8,
  idleUnload: 30,
  edge: 1.3,
  landShort: 1,
  guess: 110,
  recall: 150,
  richCrew: 2,
  richPay: 4,
  threatRecall: 90,
  threatRadius: 8,
  caution: { balanced: 0.5, rush: 0.5, airswarm: 0.6, boom: 1, skyforce: 0.6, ironclad: 0.6 },
  infantry: 0.3,
  vehicles: 0.15,
  raptors: 6,
  assaultFloor: 1700,
  interceptRadius: 12,
  interceptors: 2,
  interceptGround: 9,
  airGuard: 6,
  strikeEdge: 1.8,
  strikeMin: 380,
  strikeEvery: 20
};
var memos4 = new WeakMap;
function memo4(s) {
  let m = memos4.get(s);
  if (!m) {
    m = { lifts: new Map, intel: new Map, threats: [], lastLaunch: -1e9, wantSquads: 0, openTargets: 0, strikes: new Map };
    memos4.set(s, m);
  }
  return m;
}
var islandRelays = (w) => w.objectives.uplinks.filter((l) => l.infantryOnly);
function airliftActive(w, faction, _s) {
  if (w.survival || !w.objectives.uplinks.some((l) => l.infantryOnly))
    return false;
  return bannedBy(w, "condor", faction) === null && bannedBy(w, "trooper", faction) === null;
}
function offHomeLand(w, faction, u) {
  if (!w.rules?.islands || UNITS[u.kind].domain === "air")
    return false;
  return !onHomeLand(w, faction, Math.floor(u.x), Math.floor(u.y));
}
var footRegion = (w, p) => regionAt(w, Math.floor(p.x), Math.floor(p.y), "foot");
var valueOf = (us) => us.reduce((v, u) => v + UNITS[u.kind].cost, 0);
function airliftHolds(w, s) {
  const m = memos4.get(s);
  if (!m)
    return [];
  const out = [];
  for (const lift of m.lifts.values())
    if (lift.phase === "boarding") {
      for (const id of lift.squads)
        if (w.units.has(id))
          out.push(id);
    }
  return out;
}
function airliftSquadsWanted(s) {
  return memos4.get(s)?.wantSquads ?? 0;
}
function airliftWantsCondor(w, faction, s, have) {
  if (!airliftActive(w, faction, s))
    return false;
  if (have >= AIRLIFT.condors[s.difficulty])
    return false;
  if (have === 0)
    return !rulesOf(w).lifeline || w.factions[faction].scrap >= 450;
  const m = memos4.get(s);
  return !!m && w.tick >= AIRLIFT.secondFrom * TICK_RATE && m.openTargets > have;
}
function airliftBusy(s, id) {
  const lift = memos4.get(s)?.lifts.get(id);
  return !!lift && (lift.phase !== "home" || lift.squads.length > 0);
}
function planAirlift(w, faction, s, ctx) {
  const cmds = [];
  if (!airliftActive(w, faction, s))
    return cmds;
  const relays = islandRelays(w);
  const m = memo4(s);
  const enemy = otherSide(faction);
  const fr = sideFrame(w, faction);
  const tps = TICK_RATE;
  const islands = relays.map((l) => {
    const region = footRegion(w, l);
    const ours = ctx.mine.filter((u) => isInfantry(u.kind) && footRegion(w, u) === region);
    const theirs = ctx.seen.filter((u) => isInfantry(u.kind) && footRegion(w, u) === region);
    const seenValue = valueOf(theirs);
    if (theirs.length > 0 || isVisible(w, faction, Math.floor(l.x), Math.floor(l.y)))
      m.intel.set(l.id, { value: seenValue, tick: w.tick });
    const intel = m.intel.get(l.id);
    const recent = intel && w.tick - intel.tick < AIRLIFT.recall * tps;
    const enemyValue = theirs.length > 0 ? seenValue : recent ? intel.value : l.owner === enemy ? AIRLIFT.guess : 0;
    const air = ctx.seen.filter((u) => (u.kind === "wasp" || u.kind === "hornet") && dist(u.x, u.y, l.x, l.y) <= AIRLIFT.airGuard);
    return { l, region, ours, theirs, enemy: enemyValue, air, guard: enemyValue + valueOf(air) };
  });
  for (const it of islands) {
    for (const u of it.ours)
      ctx.used.add(u.id);
    const fight = it.theirs.length > 0;
    it.ours.forEach((u, i) => {
      if (u.order.type !== "idle" || u.autoTargetId !== null)
        return;
      const inZone2 = dist(u.x, u.y, it.l.x, it.l.y) <= OBJECTIVES.uplink.radius - 0.6;
      if (inZone2 && !fight)
        return;
      const post = postSpot(w, faction, it, i);
      if (dist(u.x, u.y, post.x, post.y) <= 0.6)
        return;
      cmds.push({ type: "attackMove", faction, unitIds: [u.id], x: post.x, y: post.y });
    });
  }
  const crewOf = (l) => s.difficulty !== "easy" && uplinkPay(l) >= AIRLIFT.richPay ? AIRLIFT.richCrew : 1;
  const inbound = (id, skip) => {
    let v = 0;
    for (const [cid, lift] of m.lifts) {
      if (cid === skip || lift.target !== id || lift.phase !== "boarding" && lift.phase !== "outbound")
        continue;
      const c = w.units.get(cid);
      if (!c)
        continue;
      v += valueOf(c.passengers ?? []);
      if (lift.phase === "boarding")
        for (const sid of lift.squads) {
          const u = w.units.get(sid);
          if (u)
            v += UNITS[u.kind].cost;
        }
    }
    return v;
  };
  const deficit = (it, skip) => {
    const l = it.l;
    if (s.difficulty === "easy" && (l.owner === enemy || it.guard > 0))
      return 0;
    const ours = valueOf(it.ours) + inbound(l.id, skip);
    const want2 = it.guard > 0 ? Math.max(it.guard * AIRLIFT.edge, crewOf(l) * 100) : crewOf(l) * 100;
    if (l.owner === faction && it.ours.length >= crewOf(l) && it.guard === 0)
      return 0;
    return Math.max(0, want2 - ours);
  };
  m.threats = m.threats.filter((t) => t.until > w.tick);
  const seenIds = new Set(ctx.seen.map((u) => u.id));
  const enemies = [...ctx.seen, ...m.threats.filter((t) => !seenIds.has(t.id))];
  const pick = (c, cargo, skip) => {
    let best = null;
    const hq = ctx.hqC;
    const enemyHq = { x: w.width - hq.x, y: w.height - hq.y };
    for (const it of islands) {
      const l = it.l;
      const need = deficit(it, skip);
      if (need <= 0)
        continue;
      const have = valueOf(it.ours) + inbound(l.id, skip);
      if (it.guard > 0 && have + cargo < it.guard * AIRLIFT.edge)
        continue;
      const at = landingSpot(w, faction, it, hq);
      if (!at)
        continue;
      const others = enemies.filter((e) => !(isInfantry(e.kind) && footRegion(w, e) === it.region));
      const { clear } = airspace(w, faction, others);
      const waypoint = route(w, c, at, clear);
      if (waypoint === undefined)
        continue;
      const flight = dist(c.x, c.y, at.x, at.y) + (waypoint ? 4 : 0);
      const theirs = l.owner === enemy ? 1.6 : 1;
      const dUs = dist(l.x, l.y, hq.x, hq.y);
      const dThem = dist(l.x, l.y, enemyHq.x, enemyHq.y);
      const exposure = Math.max(-1, Math.min(1, (dUs - dThem) / 20));
      const caution = AIRLIFT.caution[s.strategy.name] ?? 0.5;
      let score = uplinkPay(l) * theirs * 60 / (flight / UNITS.condor.speed + 20);
      score *= 1 - 0.35 * caution * exposure;
      if (l.owner === null && it.ours.length === 0 && cargo < 200 && exposure > -0.3)
        score *= 0.4;
      score -= it.guard / 100;
      if (l.owner === faction && !l.crewed)
        score *= 1.3;
      const key = fr.toFrame(l);
      const better = !best || score > best.score + 0.000000001 || Math.abs(score - best.score) <= 0.000000001 && (key.y < best.key.y || key.y === best.key.y && key.x < best.key.x);
      if (better)
        best = { it, drop: at, waypoint, score, key };
    }
    return best ? { it: best.it, drop: best.drop, waypoint: best.waypoint } : null;
  };
  const home = homeSpot(w, faction, ctx.hqC);
  const condors = ctx.mine.filter((u) => u.kind === "condor" && u.order.type !== "lift" && !ctx.skip?.has(u.id)).sort((a, b) => a.id - b.id);
  for (const id of [...m.lifts.keys()])
    if (!w.units.has(id))
      m.lifts.delete(id);
  const rank = (u) => u.kind === "sniper" ? 2 : u.kind === "rocket-squad" && s.seenAir >= 2 ? 0 : 1;
  const pool = ctx.army.filter((u) => isInfantry(u.kind) && !ctx.used.has(u.id) && (u.order.type === "idle" || u.order.type === "attackMove") && u.autoTargetId === null && u.hp >= UNITS[u.kind].hp * AIRLIFT.minHp && dist(u.x, u.y, home.x, home.y) <= AIRLIFT.reach).sort((a, b) => rank(a) - rank(b) || dist(a.x, a.y, home.x, home.y) - dist(b.x, b.y, home.x, home.y));
  const takeRecruits = (n) => {
    const out = [];
    for (const u of pool) {
      if (out.length >= n)
        break;
      if (ctx.used.has(u.id))
        continue;
      out.push(u);
      ctx.used.add(u.id);
    }
    return out;
  };
  const surplus = () => {
    for (const it of [...islands].sort((a, b) => fr.toFrame(a.l).y - fr.toFrame(b.l).y || fr.toFrame(a.l).x - fr.toFrame(b.l).x)) {
      const extra = it.ours.length - crewOf(it.l);
      if (it.l.owner !== faction || !it.l.crewed || extra <= 0 || it.guard > 0)
        continue;
      const squads = it.ours.filter((u) => u.order.type === "idle" && u.autoTargetId === null && u.hp >= UNITS[u.kind].hp * AIRLIFT.minHp).sort((a, b) => (a.kind === "rocket-squad" ? 1 : 0) - (b.kind === "rocket-squad" ? 1 : 0) || a.id - b.id).slice(0, Math.min(extra, cap));
      if (squads.length > 0)
        return { it, squads };
    }
    return null;
  };
  const started = w.tick >= AIRLIFT.from[s.difficulty] * tps;
  const spaced = () => w.tick - m.lastLaunch >= AIRLIFT.every[s.difficulty] * tps;
  const cap = UNITS.condor.capacity ?? 2;
  const avgSquad = 110;
  for (const c of condors) {
    let lift = m.lifts.get(c.id);
    if (!lift) {
      lift = { phase: "home", target: null, squads: [], since: w.tick, launchHp: c.hp, drop: null, waypoint: null, turnedBack: -1e9, boardBy: 0 };
      m.lifts.set(c.id, lift);
    }
    const L = lift;
    const setPhase2 = (p) => {
      if (L.phase !== p)
        L.since = w.tick;
      L.phase = p;
    };
    const cargo = () => valueOf(c.passengers ?? []);
    const goHome = () => {
      if (dist(c.x, c.y, home.x, home.y) > 2 && (c.order.type === "idle" || c.order.type === "move"))
        cmds.push({ type: "move", faction, unitIds: [c.id], x: home.x, y: home.y });
    };
    const launch = (plan) => {
      L.target = plan.it.l.id;
      L.drop = plan.drop;
      L.waypoint = plan.waypoint;
      L.launchHp = c.hp;
      L.squads = (c.passengers ?? []).map((p) => p.id);
      m.lastLaunch = w.tick;
      if (plan.waypoint)
        cmds.push({ type: "move", faction, unitIds: [c.id], x: plan.waypoint.x, y: plan.waypoint.y });
      else
        cmds.push({ type: "unload", faction, unitIds: [c.id], x: plan.drop.x, y: plan.drop.y });
      setPhase2("outbound");
    };
    const turnBack = (threat) => {
      if (threat)
        noteThreats2(w, m, c, L.drop, ctx.seen);
      L.turnedBack = w.tick;
      L.target = null;
      cmds.push({ type: "move", faction, unitIds: [c.id], x: home.x, y: home.y });
      setPhase2("return");
    };
    const hurt = () => c.hp < L.launchHp - UNITS.condor.hp * AIRLIFT.abortLoss;
    switch (L.phase) {
      case "home": {
        if (isLoaded(c)) {
          if (w.tick - L.turnedBack < AIRLIFT.retry * tps || !started) {
            goHome();
            break;
          }
          const plan2 = c.order.type === "unload" ? null : pick(c, cargo(), c.id);
          if (plan2)
            launch(plan2);
          else if (w.tick - L.since > AIRLIFT.idleUnload * tps && dist(c.x, c.y, home.x, home.y) <= 3 && c.order.type === "idle")
            cmds.push({ type: "unload", faction, unitIds: [c.id] });
          else
            goHome();
          break;
        }
        if (c.order.type !== "idle" || dist(c.x, c.y, home.x, home.y) > 6) {
          goHome();
          break;
        }
        if (!started || ctx.threatened || !spaced())
          break;
        const free = pool.filter((u) => !ctx.used.has(u.id));
        if (free.length === 0) {
          const spare = surplus();
          if (!spare)
            break;
          const plan2 = pick(c, valueOf(spare.squads), c.id);
          if (!plan2 || plan2.it === spare.it)
            break;
          L.target = plan2.it.l.id;
          L.squads = spare.squads.map((u) => u.id);
          L.boardBy = w.tick + Math.round((dist(c.x, c.y, spare.it.l.x, spare.it.l.y) / UNITS.condor.speed + AIRLIFT.boardTimeout) * tps);
          cmds.push({ type: "move", faction, unitIds: [c.id], x: spare.it.l.x, y: spare.it.l.y });
          cmds.push({ type: "board", faction, unitIds: L.squads, carrierId: c.id });
          setPhase2("boarding");
          break;
        }
        const potential = valueOf(free.slice(0, cap));
        const plan = pick(c, potential, c.id);
        if (!plan)
          break;
        const want2 = Math.min(cap, Math.max(1, Math.ceil(deficit(plan.it, c.id) / avgSquad)));
        const picks = takeRecruits(want2);
        if (picks.length === 0)
          break;
        L.target = plan.it.l.id;
        L.squads = picks.map((u) => u.id);
        L.boardBy = w.tick + AIRLIFT.boardTimeout * tps;
        cmds.push({ type: "board", faction, unitIds: L.squads, carrierId: c.id });
        setPhase2("boarding");
        break;
      }
      case "boarding": {
        const inHold = (c.passengers ?? []).map((p) => p.id);
        const walking = L.squads.filter((id) => {
          const u = w.units.get(id);
          return !!u && u.order.type === "board" && u.order.carrierId === c.id;
        });
        for (const id of walking)
          ctx.used.add(id);
        const late = w.tick > L.boardBy;
        L.squads = [...inHold, ...walking];
        if (ctx.threatened) {
          if (walking.length > 0)
            cmds.push({ type: "stop", faction, unitIds: walking });
          if (inHold.length > 0)
            cmds.push({ type: "unload", faction, unitIds: [c.id] });
          L.target = null;
          setPhase2("home");
        } else if (walking.length === 0 || late || freeSeats(c) === 0) {
          if (walking.length > 0)
            cmds.push({ type: "stop", faction, unitIds: walking });
          if (inHold.length === 0) {
            L.target = null;
            setPhase2("home");
            break;
          }
          const plan = pick(c, cargo(), c.id);
          if (plan)
            launch(plan);
          else {
            L.target = null;
            setPhase2("home");
          }
        }
        break;
      }
      case "outbound": {
        if (!isLoaded(c)) {
          L.target = null;
          L.squads = [];
          cmds.push({ type: "move", faction, unitIds: [c.id], x: home.x, y: home.y });
          setPhase2("return");
          break;
        }
        if (hurt()) {
          turnBack(true);
          break;
        }
        const it = islands.find((x) => x.l.id === L.target);
        const stale = !it || deficit(it, c.id) <= 0 || it.guard > 0 && valueOf(it.ours) + inbound(it.l.id, c.id) + cargo() < it.guard * AIRLIFT.edge;
        if (stale) {
          if (it && it.theirs.length > 0)
            noteThreats2(w, m, c, L.drop, ctx.seen);
          const plan = pick(c, cargo(), c.id);
          if (plan)
            launch(plan);
          else
            turnBack(false);
          break;
        }
        const wp = L.waypoint;
        if (wp && c.order.type === "move" && dist(c.x, c.y, wp.x, wp.y) > 1.5)
          break;
        if (c.order.type !== "unload") {
          L.waypoint = null;
          const drop = L.drop ?? { x: it.l.x, y: it.l.y };
          cmds.push({ type: "unload", faction, unitIds: [c.id], x: drop.x, y: drop.y });
        }
        break;
      }
      case "return": {
        if (c.order.type === "unload")
          break;
        if (dist(c.x, c.y, home.x, home.y) <= 3 && c.order.type === "idle")
          setPhase2("home");
        else
          goHome();
        break;
      }
    }
  }
  let want = 0;
  let open = 0;
  for (const it of islands) {
    const d = deficit(it, null);
    if (d <= 0)
      continue;
    open++;
    want += Math.min(cap, Math.ceil(d / avgSquad));
  }
  const waiting = pool.filter((u) => !ctx.used.has(u.id));
  m.wantSquads = Math.max(0, want + 1 - waiting.length);
  m.openTargets = open;
  const empty = Math.min(AIRLIFT.condors[s.difficulty], condors.filter((c) => !isLoaded(c)).length);
  waiting.slice(0, Math.min(want, cap * empty)).forEach((u) => ctx.used.add(u.id));
  cmds.push(...intercepts(w, faction, ctx, islands));
  cmds.push(...strikes(w, faction, s, m, ctx, islands, enemies));
  return cmds;
}
function strikes(w, faction, s, m, ctx, islands, enemies) {
  if (s.difficulty === "easy")
    return [];
  const enemy = otherSide(faction);
  const bombers = ctx.army.filter((u) => (u.kind === "wasp" || u.kind === "hornet") && u.order.type === "idle" && !ctx.used.has(u.id) && u.hp >= UNITS[u.kind].hp * 0.5);
  if (bombers.length === 0)
    return [];
  const targets = islands.filter((it) => (it.l.owner === enemy || it.theirs.length > 0) && it.ours.length === 0 && it.enemy > 0).filter((it) => w.tick - (m.strikes.get(it.l.id) ?? -1e9) >= AIRLIFT.strikeEvery * TICK_RATE).sort((a, b) => uplinkPay(b.l) - uplinkPay(a.l) || dist(a.l.x, a.l.y, ctx.hqC.x, ctx.hqC.y) - dist(b.l.x, b.l.y, ctx.hqC.x, ctx.hqC.y));
  for (const it of targets) {
    const l = it.l;
    const others = enemies.filter((e) => !(isInfantry(e.kind) && footRegion(w, e) === it.region));
    if (aaStrengthAt(aaSources(w, faction, others), l.x, l.y) >= AA_COVER)
      continue;
    const need = Math.max(AIRLIFT.strikeMin, it.enemy * AIRLIFT.strikeEdge);
    const wing = [];
    let v = 0;
    for (const u of [...bombers].sort((a, b) => dist(a.x, a.y, l.x, l.y) - dist(b.x, b.y, l.x, l.y))) {
      if (v >= need)
        break;
      wing.push(u);
      v += UNITS[u.kind].cost;
    }
    if (v < need)
      continue;
    for (const u of wing)
      ctx.used.add(u.id);
    m.strikes.set(l.id, w.tick);
    return [{ type: "attackMove", faction, unitIds: wing.map((u) => u.id), x: l.x, y: l.y }];
  }
  return [];
}
function landingSpot(w, faction, it, hqC) {
  const l = it.l;
  const d = Math.max(0.01, dist(l.x, l.y, hqC.x, hqC.y));
  const short = AIRLIFT.landShort;
  for (const aim of [{ x: l.x + (hqC.x - l.x) / d * short, y: l.y + (hqC.y - l.y) / d * short }, { x: l.x, y: l.y }]) {
    const at = dropPoint(w, faction, aim.x, aim.y);
    if (at && footRegion(w, at) === it.region && dist(at.x, at.y, l.x, l.y) <= OBJECTIVES.uplink.radius - 0.5)
      return at;
  }
  return null;
}
function homeSpot(w, faction, hqC) {
  const enemyGuess = { x: w.width - hqC.x, y: w.height - hqC.y };
  const back = Math.max(1, dist(hqC.x, hqC.y, enemyGuess.x, enemyGuess.y));
  const behind = { x: hqC.x - (enemyGuess.x - hqC.x) / back * 2.5, y: hqC.y - (enemyGuess.y - hqC.y) / back * 2.5 };
  return dropPoint(w, faction, behind.x, behind.y) ?? behind;
}
function postSpot(w, faction, it, i) {
  const l = it.l;
  if (i === 0)
    return { x: l.x, y: l.y };
  const fr = sideFrame(w, faction);
  const c = fr.toFrame(l);
  const a = (i - 1) * (2 * Math.PI / 5) + 0.6;
  const p = fr.toWorld({ x: c.x + sin(a) * 1.1, y: c.y - cos(a) * 1.1 });
  return footRegion(w, p) === it.region ? p : { x: l.x, y: l.y };
}
function noteThreats2(w, m, c, drop, seen) {
  const until = w.tick + AIRLIFT.threatRecall * TICK_RATE;
  const r = AIRLIFT.threatRadius;
  for (const e of seen) {
    if (aaWeight(UNITS[e.kind]) <= 0)
      continue;
    if (dist(e.x, e.y, c.x, c.y) > r && (!drop || dist(e.x, e.y, drop.x, drop.y) > r))
      continue;
    m.threats = m.threats.filter((t) => t.id !== e.id);
    m.threats.push({ id: e.id, kind: e.kind, x: e.x, y: e.y, until });
  }
}
function intercepts(w, faction, ctx, islands) {
  const cmds = [];
  const R = AIRLIFT.interceptRadius;
  const ourCondors = ctx.mine.filter((u) => u.kind === "condor");
  const bombers = new Set(islands.filter((it) => it.ours.length > 0).flatMap((it) => it.air.map((u) => u.id)));
  for (const e of ctx.seen) {
    const near = (p, r = R) => dist(e.x, e.y, p.x, p.y) <= r;
    if (e.kind === "condor") {
      const relevant = islands.some((it) => (it.l.owner === faction || it.ours.length > 0) && near(it.l)) || near(ctx.hqC, R + 4) || ourCondors.some((c) => near(c, 8));
      if (!relevant)
        continue;
    } else if (!bombers.has(e.id))
      continue;
    const chasing = ctx.army.filter((u) => u.order.type === "attack" && u.order.targetId === e.id).length;
    const want = AIRLIFT.interceptors;
    if (chasing >= want)
      continue;
    const able = ctx.army.filter((u) => {
      if (ctx.used.has(u.id) || u.order.type !== "idle" || u.kind === "condor")
        return false;
      if (effectiveness(u.kind, e.kind) < USELESS)
        return false;
      if (UNITS[u.kind].domain === "air")
        return true;
      return dist(u.x, u.y, e.x, e.y) <= AIRLIFT.interceptGround && canGetWithin(w, moveClassOf(u.kind), u.x, u.y, e.x, e.y, UNITS[u.kind].range);
    }).sort((a, b) => (a.kind === "raptor" ? 0 : 1) - (b.kind === "raptor" ? 0 : 1) || dist(a.x, a.y, e.x, e.y) - dist(b.x, b.y, e.x, e.y)).slice(0, want - chasing);
    if (able.length === 0)
      continue;
    for (const u of able)
      ctx.used.add(u.id);
    cmds.push({ type: "attack", faction, unitIds: able.map((u) => u.id), targetId: e.id });
  }
  return cmds;
}

// src/sim/ai/goliath.ts
var GOLIATH_AI = {
  gantryFrom: { balanced: 300, rush: 480, airswarm: 420, boom: 240, skyforce: 450, ironclad: 210 },
  gantryPace: { easy: Infinity, normal: 1, hard: 0.85 },
  answerGantry: 0.75,
  gantryIncome: 900,
  gantryBank: 2000,
  armyFloor: 900,
  gantryRetry: 90,
  gantries: 2,
  gantryFields: 15000,
  max: { easy: 1, normal: 2, hard: 2 },
  islandMax: 1,
  again: 150,
  save: { balanced: 0.45, rush: 0.35, airswarm: 0.35, boom: 0.5, skyforce: 0.35, ironclad: 0.55 },
  siteServed: 8,
  siteMin: 2200,
  enemyHome: 16,
  enemyNear: 7,
  defenceGap: 3,
  leaveBelow: 500,
  siteReach: 4.5,
  relayMin: 3.5,
  relayMax: 5.5,
  relayWorth: 600,
  frontValue: 1500,
  frontShare: 0.4,
  front: { balanced: true, rush: true, airswarm: false, boom: false, skyforce: false, ironclad: true },
  siege: { balanced: false, rush: true, airswarm: false, boom: false, skyforce: false, ironclad: true },
  baseField: 9,
  baseMove: 36,
  loveGap: 9,
  loveLosing: 0.5,
  recheck: 20,
  better: 2,
  avoid: 120,
  harvesters: { balanced: 2, rush: 2, airswarm: 2, boom: 3, skyforce: 2, ironclad: 2 },
  outposts: {
    balanced: ["depot", "turret", "sam-site"],
    rush: ["turret", "depot"],
    airswarm: ["depot", "sam-site"],
    boom: ["depot", "turret", "sam-site"],
    skyforce: ["sam-site", "depot"],
    ironclad: ["turret", "depot", "sam-site"]
  },
  depotMin: 3000,
  samAir: 2,
  outpostEvery: 20,
  outpostIncome: 600,
  goliathGap: 11,
  garrison: 2,
  relayGarrison: 3,
  lastGarrison: 4,
  menders: 4,
  escort: 0.35,
  escortReach: 24,
  post: 3.2,
  retreatHp: 0.35,
  resumeHp: 0.7,
  siegeRetreat: 0.5,
  behind: 3,
  join: 16,
  lateSiege: 12,
  loseEdge: 1.5,
  danger: 9,
  company: 450,
  deep: 18,
  liftDetour: 1.8,
  liftGain: 20,
  liftWait: 90,
  liftAbort: 0.25,
  liftAa: 0.2,
  liftRetry: 150,
  liftHook: 30,
  heavyWeight: 3,
  gantryWeight: 2,
  huntEdge: 1.3,
  huntMin: 700,
  huntReach: 32,
  huntWeak: 0.8,
  huntEvery: 12,
  medicHunters: 2
};
var memos5 = new WeakMap;
function memo5(s) {
  let m = memos5.get(s);
  if (!m) {
    m = {
      plans: new Map,
      fund: 0,
      tally: null,
      income: [],
      home: null,
      outpost: null,
      lastOutpost: -1e9,
      lastOrder: -1e9,
      gantryFail: -1e9,
      gantryUp: false,
      gantriesLost: 0,
      noRoom: -1e9,
      hunts: new Map,
      clusters: null,
      avoid: []
    };
    memos5.set(s, m);
  }
  return m;
}
var value3 = (us) => us.reduce((v, u) => v + UNITS[u.kind].cost, 0);
var byId = (a, b) => a.id - b.id;
var hpShare = (u) => u.hp / UNITS[u.kind].hp;
var kbCentre = (kb) => ({ x: kb.tx + BUILDINGS[kb.kind].size / 2, y: kb.ty + BUILDINGS[kb.kind].size / 2 });
function threatValue(u) {
  if (!u.goliath)
    return UNITS[u.kind].cost;
  return UNITS.goliath.cost * (0.5 * readyFirepower(u) + 0.5 * hpShare(u));
}
function noteHome(s, at) {
  memo5(s).home = { x: at.x, y: at.y };
}
function lostHome(w, faction, s) {
  const m = memo5(s);
  if (m.home)
    return m.home;
  const g = goliathsOf(w, faction).sort(byId)[0];
  if (!g)
    return { x: w.width / 2, y: w.height / 2 };
  m.home = { x: g.x, y: g.y };
  return m.home;
}
function incomeTally(w, faction) {
  const st = w.factions[faction].stats;
  const o = w.objectives.stats[faction];
  return st.scrapHarvested + st.scrapSalvaged + (o ? o.uplinkScrap + o.crateScrap : 0);
}
function incomeRate(m) {
  const first = m.income[0];
  const last = m.income[m.income.length - 1];
  if (!first || !last || last.tick <= first.tick)
    return 0;
  return (last.total - first.total) / (last.tick - first.tick) * TICK_RATE * 60;
}
function goliathFund(w, faction, s, ctx) {
  const m = memo5(s);
  const total = incomeTally(w, faction);
  const gained = m.tally === null ? 0 : Math.max(0, total - m.tally);
  m.tally = total;
  m.income.push({ tick: w.tick, total });
  while (m.income.length > 2 && w.tick - m.income[0].tick > 60 * TICK_RATE)
    m.income.shift();
  const f = w.factions[faction];
  if (!ctx.gantry || !roomForGoliath(w, faction, s) || ctx.threatened || ctx.armyValue < GOLIATH_AI.armyFloor) {
    m.fund = Math.min(m.fund, f.scrap);
    return 0;
  }
  m.fund = Math.min(goliathCost(w, faction), m.fund + gained * GOLIATH_AI.save[s.strategy.name], f.scrap);
  return m.fund;
}
function roomForGoliath(w, faction, s) {
  let n = goliathsOf(w, faction).length;
  for (const b of w.buildings.values())
    if (b.faction === faction) {
      for (const q of b.queue)
        if (q.kind === "goliath")
          n++;
    }
  return n < (w.rules?.islands ? GOLIATH_AI.islandMax : GOLIATH_AI.max[s.difficulty]);
}
function wantGoliath(w, faction, s, ctx) {
  const m = memo5(s);
  if (w.survival || ctx.threatened || ctx.armyValue < GOLIATH_AI.armyFloor)
    return false;
  if (!roomForGoliath(w, faction, s) || w.tick - m.lastOrder < GOLIATH_AI.again * TICK_RATE)
    return false;
  if (goliathsOf(w, faction).length > 0 && incomeRate(m) < GOLIATH_AI.gantryIncome)
    return false;
  return ctx.spendable >= goliathCost(w, faction);
}
function noteGoliathOrdered(w, s) {
  const m = memo5(s);
  m.fund = 0;
  m.lastOrder = w.tick;
}
function wantGantry(w, faction, s, ctx) {
  if (w.survival || w.ops)
    return false;
  if (bannedBy(w, "gantry", faction) || bannedBy(w, "goliath", faction))
    return false;
  const f = w.factions[faction];
  const m = memo5(s);
  if ([...w.buildings.values()].some((b) => b.faction === faction && b.kind === "gantry")) {
    m.gantryUp = true;
    return false;
  }
  if (m.gantryUp) {
    m.gantryUp = false;
    m.gantriesLost++;
    m.gantryFail = w.tick;
  }
  if (f.pending?.kind === "gantry" || m.gantriesLost >= GOLIATH_AI.gantries)
    return false;
  if (w.tick - m.gantryFail < GOLIATH_AI.gantryRetry * TICK_RATE)
    return false;
  let from = GOLIATH_AI.gantryFrom[s.strategy.name] * GOLIATH_AI.gantryPace[s.difficulty];
  if (!Number.isFinite(from))
    return false;
  if (knownBuildings(w, faction).some((kb) => kb.kind === "gantry"))
    from *= GOLIATH_AI.answerGantry;
  if (w.tick < from * TICK_RATE)
    return false;
  if (ctx.threatened || ctx.armyValue < GOLIATH_AI.armyFloor || !roomForGoliath(w, faction, s))
    return false;
  if (!w.rules?.islands && fieldsOurSide(w, faction, m, ctx.home, ctx.enemyHome) < GOLIATH_AI.gantryFields)
    return false;
  return incomeRate(m) >= GOLIATH_AI.gantryIncome || f.scrap >= GOLIATH_AI.gantryBank;
}
function fieldsOurSide(w, faction, m, home, enemyHome) {
  let v = 0;
  for (const cl of fieldClusters(w, faction, m))
    if (dist(cl.c.x, cl.c.y, home.x, home.y) <= dist(cl.c.x, cl.c.y, enemyHome.x, enemyHome.y))
      v += cl.value;
  return v;
}
function noteNoRoom(w, s) {
  memo5(s).noRoom = w.tick;
}
function noteGantryFailed(w, s) {
  memo5(s).gantryFail = w.tick;
}
function fieldClusters(w, faction, m) {
  if (m.clusters && w.tick - m.clusters.tick < 5 * TICK_RATE)
    return m.clusters.list;
  const fr = sideFrame(w, faction);
  const W = w.width;
  const H = w.height;
  const seen = new Uint8Array(W * H);
  const idx2 = (fx, fy) => {
    const [tx, ty] = fr.tile(fx, fy, 1);
    return ty * W + tx;
  };
  const list = [];
  for (let fy = 0;fy < H; fy++)
    for (let fx = 0;fx < W; fx++) {
      const i0 = idx2(fx, fy);
      if (seen[i0] || !isResource(w, i0))
        continue;
      seen[i0] = 1;
      const queue = [[fx, fy]];
      const tiles = [];
      let v = 0;
      let sx = 0;
      let sy = 0;
      for (let q = 0;q < queue.length; q++) {
        const [cx, cy] = queue[q];
        const i = idx2(cx, cy);
        tiles.push(i);
        const left = w.scrap[i] * (w.terrain[i] === 7 /* Crystal */ ? ECONOMY.crystalValue : 1);
        v += left;
        sx += (cx + 0.5) * left;
        sy += (cy + 0.5) * left;
        for (let dy = -2;dy <= 2; dy++)
          for (let dx = -2;dx <= 2; dx++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H)
              continue;
            const ni = idx2(nx, ny);
            if (seen[ni] || !isResource(w, ni))
              continue;
            seen[ni] = 1;
            queue.push([nx, ny]);
          }
      }
      if (v <= 0)
        continue;
      const key = { x: sx / v, y: sy / v };
      list.push({ tiles, value: v, c: fr.toWorld(key), key });
    }
  m.clusters = { tick: w.tick, list };
  return list;
}
function fieldLeft(w, p, r) {
  let v = 0;
  const x0 = Math.max(0, Math.floor(p.x - r));
  const x1 = Math.min(w.width - 1, Math.floor(p.x + r));
  const y0 = Math.max(0, Math.floor(p.y - r));
  const y1 = Math.min(w.height - 1, Math.floor(p.y + r));
  for (let ty = y0;ty <= y1; ty++)
    for (let tx = x0;tx <= x1; tx++) {
      const i = ty * w.width + tx;
      if (isResource(w, i) && dist(tx + 0.5, ty + 0.5, p.x, p.y) <= r)
        v += w.scrap[i] * (w.terrain[i] === 7 /* Crystal */ ? ECONOMY.crystalValue : 1);
    }
  return v;
}
function nearestFieldTile(w, faction, p, r) {
  const fr = sideFrame(w, faction);
  const q = fr.toFrame(p);
  let best = null;
  let bestD = Infinity;
  const R = Math.ceil(r);
  for (let dy = -R;dy <= R; dy++)
    for (let dx = -R;dx <= R; dx++) {
      const fx = Math.floor(q.x) + dx;
      const fy = Math.floor(q.y) + dy;
      if (fx < 0 || fy < 0 || fx >= w.width || fy >= w.height)
        continue;
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!isResource(w, tileIndex(w, tx, ty)))
        continue;
      const d = dist(fx + 0.5, fy + 0.5, q.x, q.y);
      if (d > r || d >= bestD)
        continue;
      bestD = d;
      best = { x: tx + 0.5, y: ty + 0.5 };
    }
  return best;
}
function openAround(w, tx, ty) {
  for (let dy = -1;dy <= 1; dy++)
    for (let dx = -1;dx <= 1; dx++) {
      const x = tx + dx;
      const y = ty + dy;
      if (!inBounds(w, x, y) || !TERRAIN[terrainAt(w, x, y)].buildable || w.occupancy[tileIndex(w, x, y)] !== 0)
        return false;
    }
  return !blocksObjective(w, tx - 1, ty - 1, 3);
}
function spotNear(w, faction, around, min, max, score, region = 0) {
  const fr = sideFrame(w, faction);
  const a = fr.toFrame(around);
  const R = Math.ceil(max);
  let best = null;
  let bestS = Infinity;
  for (let dy = -R;dy <= R; dy++)
    for (let dx = -R;dx <= R; dx++) {
      const fx = Math.floor(a.x) + dx;
      const fy = Math.floor(a.y) + dy;
      if (fx < 1 || fy < 1 || fx >= w.width - 1 || fy >= w.height - 1)
        continue;
      const d = dist(fx + 0.5, fy + 0.5, a.x, a.y);
      if (d > max || d < min)
        continue;
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!openAround(w, tx, ty))
        continue;
      if (region && regionAt(w, tx, ty, "ground") !== region)
        continue;
      const p = { x: tx + 0.5, y: ty + 0.5 };
      const sc = score(p);
      if (sc < bestS - 0.000000001) {
        bestS = sc;
        best = p;
      }
    }
  return best;
}
function underGuns(known2, p, gap = GOLIATH_AI.defenceGap) {
  for (const kb of known2) {
    const st = BUILDINGS[kb.kind];
    if (st.dps <= 0 || st.targets === "air" || kb.kind === "hq")
      continue;
    if (distToFootprint2(kb.tx, kb.ty, st.size, p.x, p.y) <= st.range + gap)
      return true;
  }
  return false;
}
function enemyNear(seen, p, r) {
  let v = 0;
  for (const e of seen)
    if ((UNITS[e.kind].dps > 0 || e.goliath) && dist(e.x, e.y, p.x, p.y) <= r)
      v += threatValue(e);
  return v;
}
function canLift(w, faction, s) {
  if (s.difficulty === "easy" || bannedBy(w, "condor", faction))
    return false;
  let condors = 0;
  for (const u of w.units.values())
    if (u.faction === faction && u.kind === "condor")
      condors++;
  if (condors >= 2)
    return true;
  for (const b of w.buildings.values())
    if (b.faction === faction && b.kind === "airpad")
      return true;
  return false;
}
function chooseSite(w, faction, s, g, ctx, m) {
  const known2 = knownBuildings(w, faction);
  const home = ctx.hqC;
  const enemyHq = ctx.enemyHqPos;
  const fr = sideFrame(w, faction);
  const gRegion = regionAt(w, Math.floor(g.x), Math.floor(g.y), "ground");
  const lifts = canLift(w, faction, s) && w.tick >= (m.plans.get(g.id)?.noLift ?? -1e9);
  const sky = lifts ? liftAirspace(w, faction, ctx.seen) : null;
  const flyable = (at) => !!sky && !sky.covered(at.x, at.y) && route(w, g, at, sky.clear) !== undefined;
  m.avoid = m.avoid.filter((a) => a.until > w.tick);
  const avoided = (p) => m.avoid.some((a) => dist(a.x, a.y, p.x, p.y) < 4);
  const taken = [];
  for (const [id, plan] of m.plans)
    if (id !== g.id && plan.site)
      taken.push(plan.site.field ?? plan.site.at);
  const caution = s.strategy.name === "boom" ? 1 : 0.6;
  const gap = rulesOf(w).robotLove ? Math.max(GOLIATH_AI.goliathGap, GOLIATH_AI.loveGap + 4) : GOLIATH_AI.goliathGap;
  const clearOfThem = (p) => !ctx.seen.some((e) => !!e.goliath && dist(e.x, e.y, p.x, p.y) < gap);
  const exposure = (p) => Math.max(-1, Math.min(1, (dist(p.x, p.y, home.x, home.y) - dist(p.x, p.y, enemyHq.x, enemyHq.y)) / 20));
  const cands = [];
  for (const cl of fieldClusters(w, faction, m)) {
    if (cl.value < GOLIATH_AI.siteMin)
      continue;
    const c = cl.c;
    const ds = nearestDropSite(w, faction, c.x, c.y, "ground");
    if (ds && ds.id !== g.id && distToFootprint2(ds.tx, ds.ty, ds.size, c.x, c.y) <= GOLIATH_AI.siteServed)
      continue;
    if (dist(c.x, c.y, enemyHq.x, enemyHq.y) < GOLIATH_AI.enemyHome)
      continue;
    if (known2.some((kb) => {
      const k = kbCentre(kb);
      return dist(k.x, k.y, c.x, c.y) <= GOLIATH_AI.enemyNear;
    }))
      continue;
    if (taken.some((t) => dist(t.x, t.y, c.x, c.y) < 6) || avoided(c))
      continue;
    const tiles = cl.tiles;
    const nearField = (p) => {
      let best = Infinity;
      for (const i of tiles)
        best = Math.min(best, dist(p.x, p.y, i % w.width + 0.5, Math.floor(i / w.width) + 0.5));
      return best;
    };
    const reach = Math.min(12, GOLIATH_AI.siteReach + Math.sqrt(tiles.length));
    const at = spotNear(w, faction, c, 0, reach, (p) => Math.abs(nearField(p) - 2) * 2 + dist(p.x, p.y, home.x, home.y) * 0.02);
    if (!at || nearField(at) > 3.2 || underGuns(known2, at) || !clearOfThem(at))
      continue;
    const lift = regionAt(w, Math.floor(at.x), Math.floor(at.y), "ground") !== gRegion;
    if (lift && !flyable(at))
      continue;
    const d = dist(g.x, g.y, at.x, at.y);
    let score = cl.value / (d + 30) * (1 - 0.5 * caution * Math.max(0, exposure(at))) - enemyNear(ctx.seen, at, 8) / 40;
    if (lift)
      score *= 0.7;
    cands.push({ kind: "field", at, field: c, value: cl.value, score, lift, key: cl.key });
  }
  if (lifts && w.rules?.islands)
    for (const l of w.objectives.uplinks) {
      if (!l.infantryOnly)
        continue;
      const lr = regionAt(w, Math.floor(l.x), Math.floor(l.y), "ground");
      if (!lr || lr === gRegion || taken.some((t) => dist(t.x, t.y, l.x, l.y) < 6) || avoided(l))
        continue;
      if (ctx.seen.some((e) => e.goliath && regionAt(w, Math.floor(e.x), Math.floor(e.y), "ground") === lr))
        continue;
      const at = spotNear(w, faction, l, GOLIATH_AI.relayMin, GOLIATH_AI.relayMax, (p) => dist(p.x, p.y, l.x, l.y) + dist(p.x, p.y, home.x, home.y) * 0.02, lr);
      if (!at || underGuns(known2, at) || !clearOfThem(at) || !flyable(at))
        continue;
      const enemyOwned = l.owner !== null && l.owner !== faction ? 1.3 : 1;
      const v = uplinkPay(l) * GOLIATH_AI.relayWorth * enemyOwned;
      const d = dist(g.x, g.y, at.x, at.y);
      const score = v / (d + 30) * (1 - 0.5 * caution * Math.max(0, exposure(at))) * 0.7 - enemyNear(ctx.seen, at, 8) / 40;
      cands.push({ kind: "relay", at, field: null, value: v, score, lift: true, relayId: l.id, key: fr.toFrame(l) });
    }
  cands.sort((a, b) => b.score - a.score || a.key.y - b.key.y || a.key.x - b.key.x);
  let paths = 0;
  for (const c of cands) {
    if (c.value < GOLIATH_AI.siteMin && c.kind === "field")
      continue;
    if (!c.lift) {
      if (paths++ >= 3)
        break;
      const path = findPath(w, g.x, g.y, c.at.x, c.at.y, "ground", faction);
      const end = path?.[path.length - 1];
      if (!path || !end || dist(end.x, end.y, c.at.x, c.at.y) > 1.5) {
        if (!flyable(c.at))
          continue;
        c.lift = true;
      } else {
        const straight = dist(g.x, g.y, c.at.x, c.at.y);
        const walk = path.length;
        if (walk > straight * GOLIATH_AI.liftDetour && walk - straight > GOLIATH_AI.liftGain && freeCondors(w, faction, s, g, m).length >= 2 && flyable(c.at))
          c.lift = true;
      }
    }
    const { key: _key, ...site } = c;
    return site;
  }
  if (GOLIATH_AI.front[s.strategy.name]) {
    const t = GOLIATH_AI.frontShare;
    const aim = { x: home.x + (enemyHq.x - home.x) * t, y: home.y + (enemyHq.y - home.y) * t };
    if (!avoided(aim)) {
      const at = spotNear(w, faction, aim, 0, 6, (p) => dist(p.x, p.y, aim.x, aim.y), gRegion);
      if (at && !underGuns(known2, at, GOLIATH_AI.defenceGap + 2) && clearOfThem(at) && !taken.some((p) => dist(p.x, p.y, at.x, at.y) < 6))
        return { kind: "front", at, field: null, value: GOLIATH_AI.frontValue, score: GOLIATH_AI.frontValue / (dist(g.x, g.y, at.x, at.y) + 30), lift: false };
    }
  }
  return null;
}
function freeCondors(w, faction, s, g, m) {
  const held = new Set;
  for (const [id, plan] of m.plans)
    if (id !== g.id)
      for (const c of plan.carriers)
        held.add(c);
  const drop = dropCondorId(s);
  const out = [];
  for (const u of w.units.values())
    if (u.faction === faction && u.kind === "condor" && canCarry(u) && !isLoaded(u) && !held.has(u.id) && u.id !== drop && !airliftBusy(s, u.id) && (u.order.type === "idle" || u.order.type === "move"))
      out.push(u);
  return out.sort((a, b) => dist(a.x, a.y, g.x, g.y) - dist(b.x, b.y, g.x, g.y) || a.id - b.id);
}
function liftCondors(w, faction, s) {
  const out = new Set;
  for (const u of w.units.values())
    if (u.faction === faction && u.order.type === "lift")
      out.add(u.id);
  const m = memos5.get(s);
  if (m) {
    for (const plan of m.plans.values())
      for (const id of plan.carriers)
        if (w.units.has(id))
          out.add(id);
  }
  return out;
}
function liftWantsCondors(w, faction, s) {
  const m = memos5.get(s);
  if (!m)
    return 0;
  let want = 0;
  for (const [id, plan] of m.plans) {
    if (plan.phase !== "lift" || plan.lifting)
      continue;
    const g = w.units.get(id);
    if (!g)
      continue;
    want += Math.max(0, 2 - plan.carriers.length - freeCondors(w, faction, s, g, m).length);
  }
  return Math.min(2, want);
}
function goliathHolds(w, s) {
  const m = memos5.get(s);
  if (!m)
    return [];
  const out = [];
  for (const plan of m.plans.values())
    for (const id of plan.escorts)
      if (w.units.has(id))
        out.push(id);
  for (const h of m.hunts.values())
    for (const id of h.ids)
      if (w.units.has(id))
        out.push(id);
  return out;
}
function prune(w, faction, m) {
  const gone = [];
  for (const [id, plan] of m.plans) {
    const g = w.units.get(id);
    if (!g || g.faction !== faction) {
      gone.push(plan);
      m.plans.delete(id);
    }
  }
  return gone;
}
function goliathHarvest(w, faction, s, harvesters, homeField) {
  const m = memos5.get(s);
  const keep = new Set;
  const cmds = [];
  if (!m)
    return { extra: 0, keep, cmds };
  let extra = 0;
  const claimed = new Set;
  for (const plan of m.plans.values())
    for (const id of plan.harvesters)
      claimed.add(id);
  for (const [id, plan] of [...m.plans].sort((a, b) => a[0] - b[0])) {
    const g = w.units.get(id);
    const site = plan.site;
    const working = !!g && plan.phase === "hold" && isAnchored(g) && !!site?.field && fieldLeft(w, site.field, 5) > 0;
    if (!working) {
      if (plan.harvesters.length > 0) {
        const field = site?.field;
        const ds = field ? nearestDropSite(w, faction, field.x, field.y, "ground") : null;
        const served = !!field && !!ds && ds.id !== id && distToFootprint2(ds.tx, ds.ty, ds.size, field.x, field.y) <= GOLIATH_AI.siteServed;
        const back = plan.harvesters.map((h) => w.units.get(h)).filter((h) => !!h);
        const home = !served && back.length > 0 ? homeField() : null;
        if (home)
          cmds.push({ type: "harvest", faction, unitIds: back.map((h) => h.id), x: home.x, y: home.y });
        plan.harvesters = [];
      }
      continue;
    }
    const want = GOLIATH_AI.harvesters[s.strategy.name];
    extra += want;
    plan.harvesters = plan.harvesters.filter((h) => w.units.has(h));
    for (const h of plan.harvesters)
      keep.add(h);
    if (plan.harvesters.length >= want)
      continue;
    const target = nearestFieldTile(w, faction, g, 6) ?? nearestFieldTile(w, faction, site.field, 6);
    if (!target)
      continue;
    const pool = harvesters.filter((h) => !claimed.has(h.id) && w.tick - h.damagedTick > 4 * TICK_RATE).filter((h) => h.order.type === "idle" || h.order.type === "harvest" && h.order.phase !== "unloading").filter((h) => canGetWithin(w, "ground", h.x, h.y, target.x, target.y, 1.5)).sort((a, b) => (a.order.type === "idle" ? 0 : 1) - (b.order.type === "idle" ? 0 : 1) || dist(a.x, a.y, target.x, target.y) - dist(b.x, b.y, target.x, target.y) || a.id - b.id);
    const spare = Math.max(0, harvesters.length - claimed.size - 1);
    const picks = pool.slice(0, Math.min(want - plan.harvesters.length, spare));
    if (picks.length === 0)
      continue;
    for (const h of picks) {
      plan.harvesters.push(h.id);
      claimed.add(h.id);
      keep.add(h.id);
    }
    cmds.push({ type: "harvest", faction, unitIds: picks.map((h) => h.id), x: target.x, y: target.y });
  }
  return { extra, keep, cmds };
}
function ownBuildingsNear(w, faction, p, r) {
  const out = [];
  for (const b of w.buildings.values())
    if (b.faction === faction && distToFootprint2(b.tx, b.ty, BUILDINGS[b.kind].size, p.x, p.y) <= r)
      out.push(b);
  return out;
}
function outpostWanted(w, faction, s, scrap) {
  const m = memos5.get(s);
  if (!m || w.tick - m.lastOutpost < GOLIATH_AI.outpostEvery * TICK_RATE)
    return null;
  for (const [id, plan] of [...m.plans].sort((a, b) => a[0] - b[0])) {
    const g = w.units.get(id);
    const site = plan.site;
    if (!g || !site || plan.phase !== "hold" || !isAnchored(g))
      continue;
    if (plan.outposts.length > 0 && incomeRate(m) < GOLIATH_AI.outpostIncome)
      continue;
    const near = ownBuildingsNear(w, faction, g, GOLIATH_AI.post + 2);
    const list = site.kind === "field" ? GOLIATH_AI.outposts[s.strategy.name] : site.kind === "relay" ? ["sam-site", "turret"] : ["turret", "sam-site"];
    for (const kind of list) {
      if (near.some((b) => b.kind === kind) || plan.outposts.includes(kind))
        continue;
      if (kind === "depot" && (!site.field || fieldLeft(w, site.field, 5) < GOLIATH_AI.depotMin))
        continue;
      if (kind === "sam-site" && s.seenAir < GOLIATH_AI.samAir)
        continue;
      if (BUILDINGS[kind].cost > scrap || bannedBy(w, kind, faction))
        break;
      if (!outpostSpotFor(w, faction, g, site, kind))
        continue;
      m.outpost = { kind, goliathId: id };
      m.lastOutpost = w.tick;
      plan.outposts.push(kind);
      return kind;
    }
  }
  return null;
}
function outpostSpot(w, faction, s, kind, enemyHq) {
  const m = memos5.get(s);
  const o = m?.outpost;
  if (!m || !o || o.kind !== kind)
    return null;
  m.outpost = null;
  const g = w.units.get(o.goliathId);
  const plan = m.plans.get(o.goliathId);
  if (!g || !plan?.site || !isAnchored(g))
    return null;
  return outpostSpotFor(w, faction, g, plan.site, kind, enemyHq);
}
function outpostSpotFor(w, faction, g, site, kind, enemyHq) {
  const size = BUILDINGS[kind].size;
  const fr = sideFrame(w, faction);
  const G = fr.toFrame(g);
  const toward = enemyHq ?? { x: w.width - g.x, y: w.height - g.y };
  const k = 3 / Math.max(3, dist(g.x, g.y, toward.x, toward.y));
  const aim = kind === "depot" && site.field ? site.field : { x: g.x + (toward.x - g.x) * k, y: g.y + (toward.y - g.y) * k };
  const A = fr.toFrame(aim);
  const R = Math.ceil(GOLIATH.buildRing + size);
  let best = null;
  let bestD = Infinity;
  for (let dy = -R;dy <= R; dy++)
    for (let dx = -R;dx <= R; dx++) {
      const fx = Math.round(G.x + dx - size / 2);
      const fy = Math.round(G.y + dy - size / 2);
      const d = dist(fx + size / 2, fy + size / 2, A.x, A.y);
      if (d >= bestD - 0.000000001)
        continue;
      const [tx, ty] = fr.tile(fx, fy, size);
      const gap = distToFootprint2(tx, ty, size, g.x, g.y);
      if (gap > GOLIATH.buildRing || gap < GOLIATH.footprint / 2 + 1)
        continue;
      if (!canPlaceBuilding(w, faction, kind, tx, ty))
        continue;
      if (size > 1 && cramped(w, tx, ty, size))
        continue;
      best = { tx, ty };
      bestD = d;
    }
  return best;
}
function cramped(w, tx, ty, size) {
  let free = 0;
  for (let i = -1;i <= size; i++)
    for (const [x, y] of [
      [tx + i, ty - 1],
      [tx + i, ty + size],
      [tx - 1, ty + i],
      [tx + size, ty + i]
    ]) {
      if (x < 0 || y < 0 || x >= w.width || y >= w.height)
        continue;
      if (w.occupancy[y * w.width + x] === 0)
        free++;
    }
  return free < (size + 2) * 2;
}
function goliathBarracks(w, faction, s, r, hasHq) {
  const m = memos5.get(s);
  const out = [];
  for (const g of goliathsOf(w, faction).sort(byId)) {
    if (!isAnchored(g) || g.goliath.queue.length > 0)
      continue;
    const plan = m?.plans.get(g.id);
    const want = !hasHq ? GOLIATH_AI.lastGarrison : plan?.site?.kind === "relay" ? GOLIATH_AI.relayGarrison : GOLIATH_AI.garrison;
    let have = 0;
    for (const u of w.units.values())
      if (u.faction === faction && isInfantry(u.kind) && dist(u.x, u.y, g.x, g.y) <= 7)
        have++;
    if (have >= want)
      continue;
    const rockets = s.seenAir >= 2 || s.seenHeavy >= 2;
    out.push({ id: g.id, queue: g.goliath.queue, kind: rockets && r() < 0.6 ? "rocket-squad" : "trooper" });
  }
  return out;
}
function newPlan(w) {
  return {
    phase: "muster",
    since: w.tick,
    site: null,
    next: "muster",
    escorts: [],
    harvesters: [],
    outposts: [],
    carriers: [],
    launchHp: [],
    waypoint: null,
    lifting: false,
    liftTick: 0,
    origin: null,
    landing: null,
    noLift: -1e9,
    tries: 0,
    moved: -1e9,
    checked: w.tick
  };
}
function setPhase2(w, plan, p) {
  if (plan.phase !== p)
    plan.since = w.tick;
  if (plan.phase !== p && (p === "dig" || p === "pack"))
    plan.outposts = [];
  plan.phase = p;
  plan.tries = 0;
}
function avoidSite(w, m, site) {
  if (!site)
    return;
  const p = site.field ?? site.at;
  m.avoid.push({ x: p.x, y: p.y, until: w.tick + GOLIATH_AI.avoid * TICK_RATE });
}
function planGoliaths(w, faction, s, ctx) {
  const cmds = [];
  const m = memo5(s);
  prune(w, faction, m);
  const goliaths = goliathsOf(w, faction).sort(byId);
  if (goliaths.length === 0)
    return cmds;
  const base = ctx.hasHq ? null : goliaths.find(isAnchored) ?? goliaths[0];
  const love = loveMood(w, ctx, goliaths);
  for (const g of goliaths) {
    let plan = m.plans.get(g.id);
    if (!plan) {
      plan = newPlan(w);
      m.plans.set(g.id, plan);
    }
    const gctx = base && g.id !== base.id ? { ...ctx, hasHq: true } : ctx;
    if (ctx.used.has(g.id) && canWalk(g)) {
      keepEscorts(w, faction, s, g, plan, gctx, cmds);
      continue;
    }
    if (!(love && loveStep(w, faction, g, plan, gctx, love, cmds)))
      step(w, faction, s, g, plan, gctx, m, cmds);
    ctx.used.add(g.id);
    keepEscorts(w, faction, s, g, plan, gctx, cmds);
  }
  return cmds;
}
function loveMood(w, ctx, ours) {
  if (!rulesOf(w).robotLove || !ctx.seen.some((e) => !!e.goliath))
    return null;
  const mine = value3(ctx.army) + ours.reduce((v, g) => v + threatValue(g), 0);
  const theirs = ctx.seen.reduce((v, e) => v + (UNITS[e.kind].dps > 0 || e.goliath ? threatValue(e) : 0), 0);
  const losing = mine < GOLIATH_AI.loveLosing * theirs && (ctx.threatened || !ctx.hasHq && !goliathBase(w));
  return losing ? "court" : "shy";
}
function loveStep(w, faction, g, plan, ctx, mood, cmds) {
  const gs = g.goliath;
  if (gs.lift)
    return false;
  const foes = ctx.seen.filter((e2) => !!e2.goliath).sort((a, b) => dist(a.x, a.y, g.x, g.y) - dist(b.x, b.y, g.x, g.y) || a.id - b.id);
  const e = foes[0];
  if (!e)
    return false;
  const d = dist(e.x, e.y, g.x, g.y);
  const leaveLift = () => {
    if (plan.phase !== "lift")
      return;
    plan.carriers = [];
    plan.launchHp = [];
    plan.lifting = false;
    plan.waypoint = null;
  };
  if (mood === "court") {
    leaveLift();
    if (gs.mode === "anchored" || gs.mode === "anchoring")
      cmds.push({ type: "packUp", faction, unitIds: [g.id] });
    else if (gs.mode === "walking" && walkable(w, g, e)) {
      const o2 = g.order;
      if (!(o2.type === "move" && dist(o2.x, o2.y, e.x, e.y) < 2))
        cmds.push({ type: "move", faction, unitIds: [g.id], x: e.x, y: e.y });
    }
    plan.site = null;
    setPhase2(w, plan, "guard");
    return true;
  }
  const gap = GOLIATH_AI.loveGap;
  if (d > gap + (gs.mode === "walking" ? 0 : GOLIATH.packTime * UNITS.goliath.speed))
    return false;
  leaveLift();
  if (gs.mode === "anchored" || gs.mode === "anchoring") {
    cmds.push({ type: "packUp", faction, unitIds: [g.id] });
    plan.next = "guard";
    plan.site = null;
    setPhase2(w, plan, "pack");
    return true;
  }
  if (gs.mode !== "walking")
    return true;
  const k = (gap + 2) / Math.max(0.5, d);
  const to = inMap(w, { x: g.x + (g.x - e.x) * k, y: g.y + (g.y - e.y) * k });
  const o = g.order;
  if (!(o.type === "move" && dist(o.x, o.y, to.x, to.y) < 2) && walkable(w, g, to))
    cmds.push({ type: "move", faction, unitIds: [g.id], x: to.x, y: to.y });
  plan.site = null;
  setPhase2(w, plan, "guard");
  return true;
}
function step(w, faction, s, g, plan, ctx, m, cmds) {
  const gs = g.goliath;
  const hp = hpShare(g);
  const move = (p) => {
    const o = g.order;
    if (o.type === "move" && dist(o.x, o.y, p.x, p.y) < 0.6)
      return;
    if (!walkable(w, g, p))
      return;
    cmds.push({ type: "move", faction, unitIds: [g.id], x: p.x, y: p.y });
    plan.moved = w.tick;
  };
  if (gs.lift || plan.phase === "lift") {
    liftStep(w, faction, s, g, plan, ctx, m, cmds);
    return;
  }
  const floor = plan.phase === "siege" ? GOLIATH_AI.siegeRetreat : GOLIATH_AI.retreatHp;
  if (canWalk(g) && plan.phase !== "retreat" && (hp < floor || !gs.weapons.cannons.online)) {
    setPhase2(w, plan, "retreat");
    plan.site = null;
  }
  if (isAnchored(g) && plan.phase === "hold") {
    const threat = enemyNear(ctx.seen, g, GOLIATH_AI.danger);
    const local = UNITS.goliath.cost * hp + value3(ctx.army.filter((u) => dist(u.x, u.y, g.x, g.y) <= 6)) + ownBuildingsNear(w, faction, g, 6).reduce((v, b) => v + (BUILDINGS[b.kind].dps > 0 ? BUILDINGS[b.kind].cost : 0), 0);
    if (threat > GOLIATH_AI.loseEdge * local && hp < 0.6 && ctx.hasHq && walkable(w, g, ctx.hqC)) {
      cmds.push({ type: "packUp", faction, unitIds: [g.id] });
      plan.next = "retreat";
      avoidSite(w, m, plan.site);
      setPhase2(w, plan, "pack");
      return;
    }
  }
  switch (plan.phase) {
    case "muster":
    case "guard": {
      if (gs.mode === "anchored" || gs.mode === "anchoring") {
        plan.site = plan.site ?? { kind: "front", at: { x: g.x, y: g.y }, field: null, value: 0, score: 0, lift: false };
        setPhase2(w, plan, gs.mode === "anchored" ? "hold" : "dig");
        return;
      }
      if (gs.mode === "packing")
        return;
      if (plan.phase === "guard" && w.tick - plan.since < GOLIATH_AI.recheck * TICK_RATE)
        return;
      if (joinsWave(w, s, g, ctx, m, hp)) {
        setPhase2(w, plan, "siege");
        return;
      }
      const site = chooseSite(w, faction, s, g, ctx, m);
      plan.site = site;
      if (!site && ctx.mode === "assault" && ctx.hasHq && hp >= GOLIATH_AI.resumeHp) {
        setPhase2(w, plan, "siege");
        return;
      }
      if (!site) {
        const at = ctx.hasHq ? ctx.guardPoint : spotNear(w, faction, ctx.guardPoint, 0, 8, (p) => dist(p.x, p.y, ctx.guardPoint.x, ctx.guardPoint.y));
        if (!ctx.hasHq && at) {
          plan.site = { kind: "front", at, field: null, value: 0, score: 0, lift: false };
          setPhase2(w, plan, "march");
          move(at);
          return;
        }
        setPhase2(w, plan, "guard");
        plan.since = w.tick;
        if (dist(g.x, g.y, ctx.guardPoint.x, ctx.guardPoint.y) > 4)
          move(ctx.guardPoint);
        return;
      }
      if (site.lift) {
        setPhase2(w, plan, "lift");
        plan.carriers = [];
        plan.lifting = false;
        liftStep(w, faction, s, g, plan, ctx, m, cmds);
        return;
      }
      setPhase2(w, plan, "march");
      move(site.at);
      return;
    }
    case "march": {
      const site = plan.site;
      if (!site || gs.mode !== "walking") {
        setPhase2(w, plan, "muster");
        return;
      }
      if (w.tick - plan.checked > GOLIATH_AI.recheck * TICK_RATE) {
        plan.checked = w.tick;
        const known2 = knownBuildings(w, faction);
        if (underGuns(known2, site.at) || enemyNear(ctx.seen, site.at, 6) > UNITS.goliath.cost * hp * 1.5) {
          avoidSite(w, m, site);
          setPhase2(w, plan, "muster");
          return;
        }
      }
      const d = dist(g.x, g.y, site.at.x, site.at.y);
      if (d > 1.2) {
        if (g.order.type === "idle" && w.tick - plan.moved > 2 * TICK_RATE) {
          if (++plan.tries > 4) {
            avoidSite(w, m, site);
            setPhase2(w, plan, "muster");
            return;
          }
          cmds.push({ type: "move", faction, unitIds: [g.id], x: site.at.x, y: site.at.y });
          plan.moved = w.tick;
        } else
          move(site.at);
        return;
      }
      if (g.order.type !== "idle")
        return;
      const why = anchorBlocker(w, g);
      if (!why) {
        cmds.push({ type: "anchor", faction, unitIds: [g.id] });
        setPhase2(w, plan, "dig");
        return;
      }
      if (why === "Unit in the way") {
        shoveAside(w, faction, g, ctx, cmds);
        if (++plan.tries > 6) {
          avoidSite(w, m, site);
          setPhase2(w, plan, "muster");
        }
        return;
      }
      const relay = site.relayId !== undefined ? w.objectives.uplinks.find((l) => l.id === site.relayId) : undefined;
      const offRelay = (p) => !relay || dist(p.x, p.y, relay.x, relay.y) >= GOLIATH_AI.relayMin;
      const alt = spotNear(w, faction, g, 0, 2.5, (p) => dist(p.x, p.y, g.x, g.y) + (offRelay(p) ? 0 : 99));
      if (alt && offRelay(alt) && anchorBlockedAt(w, faction, alt.x, alt.y, g.id) === null && plan.tries < 3) {
        plan.tries++;
        site.at = alt;
        cmds.push({ type: "move", faction, unitIds: [g.id], x: alt.x, y: alt.y });
        plan.moved = w.tick;
      } else {
        avoidSite(w, m, site);
        setPhase2(w, plan, "muster");
      }
      return;
    }
    case "dig": {
      if (gs.mode === "anchored")
        setPhase2(w, plan, "hold");
      else if (gs.mode === "walking")
        setPhase2(w, plan, plan.site ? "march" : "muster");
      return;
    }
    case "hold": {
      if (gs.mode !== "anchored") {
        setPhase2(w, plan, gs.mode === "walking" ? "muster" : plan.phase);
        return;
      }
      const site = plan.site;
      if (!ctx.hasHq) {
        if (w.tick - plan.checked < GOLIATH_AI.recheck * TICK_RATE)
          return;
        plan.checked = w.tick;
        const left = fieldLeft(w, g, GOLIATH_AI.baseField);
        const full = w.tick - m.noRoom < GOLIATH_AI.recheck * 2 * TICK_RATE;
        if (!(left < GOLIATH_AI.leaveBelow || full && left < GOLIATH_AI.siteMin))
          return;
        if (ctx.threatened || enemyNear(ctx.seen, g, GOLIATH_AI.danger + 3) > 0)
          return;
        const next = chooseSite(w, faction, s, g, ctx, m);
        if (!next || next.kind !== "field" || next.lift || dist(g.x, g.y, next.at.x, next.at.y) > GOLIATH_AI.baseMove)
          return;
        cmds.push({ type: "packUp", faction, unitIds: [g.id] });
        plan.site = next;
        plan.next = "march";
        setPhase2(w, plan, "pack");
        return;
      }
      if (site?.kind !== "relay" && joinsWave(w, s, g, ctx, m, hp, site?.kind === "front")) {
        cmds.push({ type: "packUp", faction, unitIds: [g.id] });
        plan.next = "siege";
        setPhase2(w, plan, "pack");
        return;
      }
      if (site?.kind === "field" && site.field && fieldLeft(w, site.field, 5) < GOLIATH_AI.leaveBelow) {
        cmds.push({ type: "packUp", faction, unitIds: [g.id] });
        plan.next = "muster";
        avoidSite(w, m, site);
        setPhase2(w, plan, "pack");
        return;
      }
      if (site && site.kind === "front" && w.tick - plan.checked > GOLIATH_AI.recheck * TICK_RATE) {
        plan.checked = w.tick;
        const better = chooseSite(w, faction, s, g, ctx, m);
        if (better && better.kind !== "front" && !better.lift && better.value >= GOLIATH_AI.siteMin * GOLIATH_AI.better) {
          cmds.push({ type: "packUp", faction, unitIds: [g.id] });
          plan.next = "muster";
          setPhase2(w, plan, "pack");
        }
      }
      return;
    }
    case "pack": {
      if (gs.mode === "walking") {
        const next = plan.next;
        plan.next = "muster";
        if (next === "march" && plan.site) {
          setPhase2(w, plan, "march");
          move(plan.site.at);
          return;
        }
        plan.site = null;
        setPhase2(w, plan, next);
      } else if (gs.mode === "anchored")
        cmds.push({ type: "packUp", faction, unitIds: [g.id] });
      return;
    }
    case "siege": {
      if (ctx.mode !== "assault" || !ctx.hasHq || gs.mode !== "walking") {
        setPhase2(w, plan, "muster");
        return;
      }
      const company = value3(ctx.army.filter((u) => u.kind !== "mender" && dist(u.x, u.y, g.x, g.y) <= 8));
      const deep = dist(g.x, g.y, ctx.enemyHqPos.x, ctx.enemyHqPos.y) < GOLIATH_AI.deep;
      if (deep && company < GOLIATH_AI.company) {
        const friends = ctx.army.filter((u) => u.kind !== "mender" && dist(u.x, u.y, ctx.enemyHqPos.x, ctx.enemyHqPos.y) > dist(g.x, g.y, ctx.enemyHqPos.x, ctx.enemyHqPos.y));
        friends.sort((a, b) => dist(a.x, a.y, g.x, g.y) - dist(b.x, b.y, g.x, g.y) || a.id - b.id);
        const to = friends[0] ?? ctx.staging;
        if (dist(g.x, g.y, to.x, to.y) > 3)
          move({ x: to.x, y: to.y });
        return;
      }
      const lead = waveLead(ctx, new Set([...m.plans.values()].flatMap((p) => p.escorts)));
      let goal = ctx.staging;
      if (lead) {
        const back = Math.max(0.5, dist(lead.x, lead.y, ctx.hqC.x, ctx.hqC.y));
        goal = { x: lead.x + (ctx.hqC.x - lead.x) / back * GOLIATH_AI.behind, y: lead.y + (ctx.hqC.y - lead.y) / back * GOLIATH_AI.behind };
      }
      if (dist(g.x, g.y, goal.x, goal.y) <= 2 || !walkable(w, g, goal))
        return;
      const o = g.order;
      if (o.type === "attackMove" && dist(o.x, o.y, goal.x, goal.y) < 2)
        return;
      cmds.push({ type: "attackMove", faction, unitIds: [g.id], x: goal.x, y: goal.y });
      return;
    }
    case "retreat": {
      if (!canWalk(g))
        return;
      if (hp >= GOLIATH_AI.resumeHp && gs.weapons.cannons.online) {
        setPhase2(w, plan, "muster");
        return;
      }
      const home = ctx.hasHq ? ctx.hqC : ctx.guardPoint;
      const d = dist(g.x, g.y, home.x, home.y);
      const k = d > 4 ? 4 / d : 0;
      const to = { x: home.x + (g.x - home.x) * k, y: home.y + (g.y - home.y) * k };
      const stranded = !walkable(w, g, to);
      if (dist(g.x, g.y, to.x, to.y) > 1.5 && !stranded)
        move(to);
      else if ((!ctx.hasHq || stranded) && anchorBlocker(w, g) === null) {
        cmds.push({ type: "anchor", faction, unitIds: [g.id] });
        plan.site = { kind: "front", at: { x: g.x, y: g.y }, field: null, value: 0, score: 0, lift: false };
        setPhase2(w, plan, "dig");
      }
      return;
    }
  }
}
function joinsWave(w, s, g, ctx, m, hp, idle = false) {
  if (ctx.mode !== "assault" || !ctx.hasHq || hp < GOLIATH_AI.resumeHp)
    return false;
  if (idle && w.tick >= GOLIATH_AI.lateSiege * 60 * TICK_RATE)
    return true;
  if (!GOLIATH_AI.siege[s.strategy.name])
    return false;
  const lead = waveLead(ctx, new Set([...m.plans.values()].flatMap((p) => p.escorts)));
  return !!lead && dist(lead.x, lead.y, g.x, g.y) <= GOLIATH_AI.join;
}
function waveLead(ctx, escorts) {
  const out = dist(ctx.staging.x, ctx.staging.y, ctx.hqC.x, ctx.hqC.y) + 2;
  const pushing = ctx.army.filter((u) => u.kind !== "mender" && !escorts.has(u.id) && (u.order.type === "attack" || u.order.type === "attackMove") && dist(u.x, u.y, ctx.hqC.x, ctx.hqC.y) > out);
  let lead = null;
  let best = 0;
  for (const u of pushing) {
    let v = 0;
    for (const o of pushing)
      if (dist(o.x, o.y, u.x, u.y) <= 6)
        v += UNITS[o.kind].cost;
    if (v > best) {
      best = v;
      lead = u;
    }
  }
  return lead && best >= GOLIATH_AI.company ? { x: lead.x, y: lead.y } : null;
}
var walkable = (w, g, p) => canGetWithin(w, "ground", g.x, g.y, p.x, p.y, 2.5);
function shoveAside(w, faction, g, ctx, cmds) {
  const fr = sideFrame(w, faction);
  for (const u of w.units.values()) {
    if (u.faction !== faction || u.id === g.id || UNITS[u.kind].domain !== "ground" || u.goliath)
      continue;
    if (dist(u.x, u.y, g.x, g.y) > 1.6)
      continue;
    if (ctx.used.has(u.id) && u.kind !== "harvester")
      continue;
    let dx = u.x - g.x;
    let dy = u.y - g.y;
    if (dist(0, 0, dx, dy) < 0.05)
      [dx, dy] = fr.vec(0, 1);
    const n = Math.max(0.05, dist(0, 0, dx, dy));
    const to = inMap(w, { x: g.x + dx / n * 3, y: g.y + dy / n * 3 });
    const mc = moveClassOf(u.kind);
    if (!passable(w, Math.floor(to.x), Math.floor(to.y), mc) || !canGetWithin(w, mc, u.x, u.y, to.x, to.y, 1))
      continue;
    ctx.used.add(u.id);
    cmds.push({ type: "move", faction, unitIds: [u.id], x: to.x, y: to.y });
  }
}
function keepEscorts(w, faction, s, g, plan, ctx, cmds) {
  if (isLifted(g) || g.goliath.lift || plan.phase === "lift") {
    plan.escorts = [];
    return;
  }
  const reachable = (u) => canGetWithin(w, moveClassOf(u.kind), u.x, u.y, g.x, g.y, GOLIATH_AI.post + 1);
  const armyIds = new Set(ctx.army.map((u) => u.id));
  const escorts = plan.escorts.map((id) => w.units.get(id)).filter((u) => !!u && armyIds.has(u.id) && reachable(u) && (!ctx.used.has(u.id) || plan.escorts.includes(u.id)));
  plan.escorts = escorts.map((u) => u.id);
  const atHome = ctx.hasHq && dist(g.x, g.y, ctx.hqC.x, ctx.hqC.y) < 10;
  const remote = plan.phase === "hold" && plan.site?.kind !== "front";
  const want = atHome ? 0 : UNITS.goliath.cost * GOLIATH_AI.escort * (remote ? 0.6 : 1);
  if (ctx.threatened && ctx.hasHq) {
    plan.escorts = [];
    return;
  }
  let have = value3(escorts);
  const hasAa = escorts.some((u) => aaWeight(UNITS[u.kind]) >= AA_COVER);
  if (have < want) {
    const pool = ctx.army.filter((u) => {
      const o = u.order;
      const free = o.type === "idle" || o.type === "attackMove" && dist(o.x, o.y, ctx.guardPoint.x, ctx.guardPoint.y) < 2;
      return free && !ctx.used.has(u.id) && u.kind !== "mender" && u.kind !== "scout" && u.kind !== "sniper";
    }).filter((u) => dist(u.x, u.y, g.x, g.y) <= GOLIATH_AI.escortReach && reachable(u)).sort((a, b) => {
      const aa = (u) => !hasAa && s.seenAir >= 1 && aaWeight(UNITS[u.kind]) >= AA_COVER ? 0 : 1;
      return aa(a) - aa(b) || dist(a.x, a.y, g.x, g.y) - dist(b.x, b.y, g.x, g.y) || a.id - b.id;
    });
    for (const u of pool) {
      if (have >= want)
        break;
      escorts.push(u);
      plan.escorts.push(u.id);
      have += UNITS[u.kind].cost;
    }
  }
  if (escorts.length === 0)
    return;
  const fr = sideFrame(w, faction);
  const G = fr.toFrame(g);
  escorts.forEach((u, i) => {
    ctx.used.add(u.id);
    if (u.order.type === "attack" || u.autoTargetId !== null)
      return;
    const a = i * 2 * Math.PI / Math.max(3, escorts.length) + 0.4;
    let post = fr.toWorld({ x: G.x + sin(a) * GOLIATH_AI.post, y: G.y - cos(a) * GOLIATH_AI.post });
    if (moveClassOf(u.kind) !== "air" && !passable(w, Math.floor(post.x), Math.floor(post.y), moveClassOf(u.kind)))
      post = { x: g.x, y: g.y };
    if (dist(u.x, u.y, post.x, post.y) <= 3.5)
      return;
    const o = u.order;
    if ((o.type === "attackMove" || o.type === "move") && dist(o.x, o.y, post.x, post.y) <= 2)
      return;
    cmds.push({ type: "attackMove", faction, unitIds: [u.id], x: post.x, y: post.y });
  });
}
function liftAirspace(w, faction, seen) {
  const sources = aaSources(w, faction, seen);
  const love = rulesOf(w).robotLove ? seen.filter((e) => e.kind === "goliath") : [];
  const covered = (x, y) => aaStrengthAt(sources, x, y) > GOLIATH_AI.liftAa || love.some((e) => dist(e.x, e.y, x, y) < GOLIATH_AI.loveGap);
  const clear = (ax, ay, bx, by) => {
    const n = Math.max(1, Math.ceil(dist(ax, ay, bx, by)));
    for (let i = 1;i <= n; i++)
      if (covered(ax + (bx - ax) * i / n, ay + (by - ay) * i / n))
        return false;
    return true;
  };
  return { covered, clear };
}
function nearestLand(w, faction, p) {
  const fr = sideFrame(w, faction);
  const q = fr.toFrame(p);
  let best = null;
  let bestD = Infinity;
  for (let dy = -12;dy <= 12; dy++)
    for (let dx = -12;dx <= 12; dx++) {
      const fx = Math.floor(q.x) + dx;
      const fy = Math.floor(q.y) + dy;
      if (fx < 0 || fy < 0 || fx >= w.width || fy >= w.height)
        continue;
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!passable(w, tx, ty, "ground"))
        continue;
      const d = dist(fx + 0.5, fy + 0.5, q.x, q.y);
      if (d >= bestD - 0.000000001)
        continue;
      bestD = d;
      best = { x: tx + 0.5, y: ty + 0.5 };
    }
  return best;
}
function liftStep(w, faction, s, g, plan, ctx, m, cmds) {
  const gs = g.goliath;
  const lift = gs.lift;
  if (lift?.phase === "carrying" && !plan.site && !plan.landing && !lift.setDown) {
    plan.site = chooseSite(w, faction, s, g, ctx, m);
    if (plan.site)
      setPhase2(w, plan, "lift");
  }
  const site = plan.site;
  const release2 = () => {
    plan.carriers = [];
    plan.launchHp = [];
    plan.lifting = false;
    plan.origin = null;
    plan.landing = null;
    plan.waypoint = null;
  };
  if (!lift) {
    if (plan.lifting) {
      release2();
      if (site && dist(g.x, g.y, site.at.x, site.at.y) <= 3 && canWalk(g)) {
        setPhase2(w, plan, "march");
        cmds.push({ type: "move", faction, unitIds: [g.id], x: site.at.x, y: site.at.y });
        plan.moved = w.tick;
      } else
        setPhase2(w, plan, "muster");
      return;
    }
    if (!site) {
      release2();
      setPhase2(w, plan, "muster");
      return;
    }
    if (gs.mode === "anchored" || gs.mode === "anchoring") {
      cmds.push({ type: "packUp", faction, unitIds: [g.id] });
      return;
    }
    if (gs.mode !== "walking")
      return;
    const late = w.tick - plan.since > GOLIATH_AI.liftWait * TICK_RATE;
    const giveUp = () => {
      avoidSite(w, m, site);
      release2();
      plan.noLift = w.tick + GOLIATH_AI.liftRetry * TICK_RATE;
      setPhase2(w, plan, "muster");
    };
    const { covered: covered2, clear: clear2 } = liftAirspace(w, faction, ctx.seen);
    const wp = covered2(site.at.x, site.at.y) ? undefined : route(w, g, site.at, clear2);
    if (wp === undefined) {
      plan.carriers = [];
      if (late)
        giveUp();
      return;
    }
    plan.carriers = plan.carriers.filter((id) => {
      const c = w.units.get(id);
      return !!c && canCarry(c) && !isLoaded(c);
    });
    if (plan.carriers.length < 2)
      for (const c of freeCondors(w, faction, s, g, m)) {
        if (plan.carriers.length >= 2)
          break;
        if (!plan.carriers.includes(c.id))
          plan.carriers.push(c.id);
      }
    if (plan.carriers.length < 2) {
      if (late)
        giveUp();
      return;
    }
    cmds.push({ type: "lift", faction, unitIds: [...plan.carriers], goliathId: g.id });
    plan.lifting = true;
    plan.origin = { x: g.x, y: g.y };
    plan.landing = null;
    plan.liftTick = w.tick;
    plan.launchHp = plan.carriers.map((id) => w.units.get(id).hp);
    plan.waypoint = wp;
    return;
  }
  plan.lifting = true;
  if (plan.carriers.length < 2)
    plan.carriers = [...lift.carriers];
  if (lift.phase === "hooking") {
    if (w.tick - plan.liftTick > GOLIATH_AI.liftHook * TICK_RATE) {
      cmds.push({ type: "stop", faction, unitIds: [...lift.carriers] });
      avoidSite(w, m, site);
      release2();
      setPhase2(w, plan, "muster");
    }
    return;
  }
  const setDownAt = (p) => {
    if (!(lift.setDown && lift.dest && dist(lift.dest.x, lift.dest.y, p.x, p.y) < 0.5))
      cmds.push({ type: "unload", faction, unitIds: [g.id], x: p.x, y: p.y });
  };
  if (plan.landing) {
    setDownAt(plan.landing);
    return;
  }
  const hurt = lift.carriers.some((id) => {
    const c = w.units.get(id);
    return !c || c.hp < (plan.launchHp[plan.carriers.indexOf(id)] ?? UNITS.condor.hp) - UNITS.condor.hp * GOLIATH_AI.liftAbort;
  });
  const { covered, clear } = liftAirspace(w, faction, ctx.seen);
  const goal = site?.at ?? null;
  const callOff = (p) => {
    const to = p ?? nearestLand(w, faction, g);
    avoidSite(w, m, site);
    plan.waypoint = null;
    if (!to) {
      cmds.push({ type: "move", faction, unitIds: [g.id], x: ctx.hqC.x, y: ctx.hqC.y });
      return;
    }
    plan.landing = to;
    setDownAt(to);
  };
  if (hurt || !goal) {
    callOff(null);
    return;
  }
  if (plan.waypoint && !(clear(g.x, g.y, plan.waypoint.x, plan.waypoint.y) && clear(plan.waypoint.x, plan.waypoint.y, goal.x, goal.y)))
    plan.waypoint = null;
  if (!plan.waypoint && (covered(goal.x, goal.y) || !clear(g.x, g.y, goal.x, goal.y))) {
    const wp = covered(goal.x, goal.y) ? undefined : route(w, g, goal, clear);
    if (wp)
      plan.waypoint = wp;
    else {
      const back = plan.origin && clear(g.x, g.y, plan.origin.x, plan.origin.y) ? plan.origin : null;
      callOff(back);
      return;
    }
  }
  if (lift.setDown)
    return;
  if (plan.waypoint) {
    if (dist(g.x, g.y, plan.waypoint.x, plan.waypoint.y) > 1.5) {
      if (!lift.dest || dist(lift.dest.x, lift.dest.y, plan.waypoint.x, plan.waypoint.y) > 0.5)
        cmds.push({ type: "move", faction, unitIds: [g.id], x: plan.waypoint.x, y: plan.waypoint.y });
      return;
    }
    plan.waypoint = null;
  }
  cmds.push({ type: "unload", faction, unitIds: [g.id], x: goal.x, y: goal.y });
}
function huntGoliaths(w, faction, s, ctx) {
  const cmds = [];
  const m = memo5(s);
  for (const [eid, h] of m.hunts) {
    const e = w.units.get(eid);
    if (!e) {
      m.hunts.delete(eid);
      continue;
    }
    h.ids = h.ids.filter((id) => {
      const u = w.units.get(id);
      return !!u && u.order.type === "attack";
    });
    if (h.ids.length === 0 && w.tick - h.tick > GOLIATH_AI.huntEvery * TICK_RATE)
      m.hunts.delete(eid);
    for (const id of h.ids)
      ctx.used.add(id);
  }
  if (ctx.threatened)
    return cmds;
  const known2 = knownBuildings(w, faction);
  const foes = ctx.seen.filter((e) => !!e.goliath).sort(byId);
  for (const e of foes) {
    const h = m.hunts.get(e.id);
    if (h && w.tick - h.tick < GOLIATH_AI.huntEvery * TICK_RATE)
      continue;
    const homeGuns = dist(e.x, e.y, ctx.enemyHqPos.x, ctx.enemyHqPos.y) < GOLIATH_AI.enemyHome && underGuns(known2, e, 1);
    if (homeGuns && ctx.mode !== "assault")
      continue;
    const lifted = isLifted(e);
    const carriers = lifted ? e.goliath.lift.carriers.map((id) => w.units.get(id)).filter((c) => !!c) : [];
    const mark = lifted ? [...carriers].sort((a, b) => a.hp - b.hp || a.id - b.id)[0] ?? e : e;
    const domain = domainOf(mark);
    const escortValue = ctx.seen.reduce((v2, o) => o.id !== e.id && !o.goliath && UNITS[o.kind].dps > 0 && dist(o.x, o.y, e.x, e.y) <= 6 ? v2 + UNITS[o.kind].cost : v2, 0);
    let need = (lifted ? UNITS.condor.cost * 2 : threatValue(e) + escortValue) * GOLIATH_AI.huntEdge;
    if (weaponsDown(e).length > 0)
      need *= GOLIATH_AI.huntWeak;
    need = Math.max(need, GOLIATH_AI.huntMin);
    const armour = UNITS[mark.kind].armor;
    const able = ctx.army.filter((u) => !ctx.used.has(u.id) && u.order.type === "idle" && u.kind !== "mender").filter((u) => dist(u.x, u.y, e.x, e.y) <= GOLIATH_AI.huntReach).sort((a, b) => dist(a.x, a.y, e.x, e.y) - dist(b.x, b.y, e.x, e.y) || a.id - b.id);
    const menders = lifted ? [] : ctx.seen.filter((o) => UNITS[o.kind].heal && dist(o.x, o.y, e.x, e.y) <= 4).sort((a, b) => dist(a.x, a.y, e.x, e.y) - dist(b.x, b.y, e.x, e.y) || a.id - b.id).slice(0, 2);
    const onMender = new Map;
    const strike = [];
    const taken = new Set;
    for (const md of menders) {
      const ids = able.filter((u) => !taken.has(u.id) && effectivenessVs(u.kind, UNITS[md.kind].armor, domainOf(md)) >= USELESS && engageable(w, u, md.id)).slice(0, GOLIATH_AI.medicHunters);
      for (const u of ids) {
        taken.add(u.id);
        strike.push(u);
      }
      if (ids.length > 0)
        onMender.set(md.id, ids.map((u) => u.id));
    }
    let v = 0;
    const onIt = [];
    for (const u of able) {
      if (v >= need)
        break;
      if (taken.has(u.id) || effectivenessVs(u.kind, armour, domain) < USELESS || !engageable(w, u, mark.id))
        continue;
      onIt.push(u.id);
      strike.push(u);
      v += UNITS[u.kind].cost;
    }
    if (v < need)
      continue;
    for (const [id, ids] of onMender)
      cmds.push({ type: "attack", faction, unitIds: ids, targetId: id });
    cmds.push({ type: "attack", faction, unitIds: onIt, targetId: mark.id });
    for (const u of strike)
      ctx.used.add(u.id);
    m.hunts.set(e.id, { tick: w.tick, ids: strike.map((u) => u.id) });
    break;
  }
  return cmds;
}
function enemyGantryBuilds(w, faction) {
  const out = [];
  for (const kb of knownBuildings(w, faction)) {
    if (kb.kind !== "gantry")
      continue;
    const head = w.buildings.get(kb.id)?.queue[0];
    if (!head || head.kind !== "goliath")
      continue;
    const total = UNITS.goliath.buildTime * TICK_RATE;
    const c = kbCentre(kb);
    out.push({ id: kb.id, x: c.x, y: c.y, progress: 1 - head.remaining / total });
  }
  return out;
}
function enemyHqGone(w, faction, enemyHqGuess) {
  if (knownBuildings(w, faction).some((kb) => kb.kind === "hq"))
    return false;
  return isVisible(w, faction, Math.floor(enemyHqGuess.x), Math.floor(enemyHqGuess.y));
}

// src/sim/ai/commander.ts
var STRATEGIES = {
  balanced: {
    name: "balanced",
    label: "Balanced",
    buildOrder: ["fab-plant", "airpad", "turret", "tech-lab", "assembly-bay", "depot", "turret", "radar"],
    harvesters: 4,
    assaultValue: 1700,
    harassGroup: 2,
    infantry: 0.25
  },
  rush: {
    name: "rush",
    label: "Rush",
    buildOrder: ["fab-plant", "assembly-bay", "turret", "airpad", "fab-plant", "tech-lab"],
    harvesters: 5,
    assaultValue: 1400,
    harassGroup: 5,
    groundRaids: true,
    infantry: 0.4
  },
  airswarm: {
    name: "airswarm",
    label: "Air Swarm",
    buildOrder: ["airpad", "fab-plant", "turret", "tech-lab", "depot", "airpad"],
    harvesters: 4,
    assaultValue: 1700,
    harassGroup: 2,
    bayVsArmour: true
  },
  boom: {
    name: "boom",
    label: "Boom",
    buildOrder: ["fab-plant", "turret", "tech-lab", "depot", "airpad", "turret", "radar", "sam-site"],
    harvesters: 4,
    assaultValue: 2000,
    harassGroup: 3,
    bayVsArmour: true
  },
  skyforce: {
    name: "skyforce",
    label: "Skyforce",
    buildOrder: ["airpad", "turret", "tech-lab", "airpad", "fab-plant", "depot", "sam-site"],
    harvesters: 4,
    assaultValue: 2000,
    harassGroup: 2,
    airOnly: true,
    bayVsArmour: true
  },
  ironclad: {
    name: "ironclad",
    label: "Ironclad",
    buildOrder: ["fab-plant", "turret", "tech-lab", "assembly-bay", "airpad", "depot", "fab-plant", "sam-site"],
    harvesters: 4,
    assaultValue: 1400,
    harassGroup: 3,
    heavy: true,
    escorts: 1
  }
};
var DIFFICULTY = {
  easy: {
    label: "Easy",
    interval: 3.5,
    incomeMult: 0.75,
    extraHarvesters: -1,
    assaultMult: 1.35,
    harass: false,
    pool: ["balanced", "rush", "airswarm"]
  },
  normal: {
    label: "Normal",
    interval: 2,
    incomeMult: 1,
    extraHarvesters: 0,
    assaultMult: 1,
    harass: true,
    pool: ["balanced", "rush", "airswarm", "boom", "skyforce", "ironclad"]
  },
  hard: {
    label: "Hard",
    interval: 1.2,
    incomeMult: 1.3,
    extraHarvesters: 1,
    assaultMult: 0.9,
    harass: true,
    pool: ["balanced", "airswarm", "boom", "ironclad"]
  }
};
function createAiState(strategy, difficulty = "normal", seed, tweak) {
  const names = DIFFICULTY[difficulty].pool;
  const picked = strategy ?? names[Math.floor(Math.random() * names.length)];
  return {
    mode: "buildup",
    strategy: tweak ? { ...STRATEGIES[picked], ...tweak } : STRATEGIES[picked],
    difficulty,
    lastDecisionTick: -1000,
    seenAir: 0,
    seenGround: 0,
    seenHeavy: 0,
    seenAA: 0,
    seenInfantry: 0,
    lastScoutTick: -1e9,
    scoutLeg: 0,
    rng: seed ?? 12345,
    extraSams: 0,
    extraTurrets: 0,
    extraProduction: 0,
    skippedDepots: 0,
    waveValue: 0
  };
}
var RETREAT_ARMY_VALUE = 350;
var WAVE_LAUNCH = 0.75;
var OPENING_GRACE = 45 * TICK_RATE;
var HOME_ALARM_VALUE = 400;
var DEFENSE_RADIUS = 11;
var GUARD_RADIUS = 5;
var STAGE_RADIUS = 6;
var COMBAT_KINDS = [
  "stinger",
  "flak-crawler",
  "mortar",
  "mastodon",
  "lancer",
  "wasp",
  "raptor",
  "hornet",
  "mender",
  "trooper",
  "rocket-squad",
  "sniper"
];
var INFANTRY_KINDS = ["trooper", "rocket-squad", "sniper"];
var mirror = (w, x, y) => ({ x: w.width - x, y: w.height - y });
var FOCUS_SECS = 100;
var GRUDGE_VALUE = 400;
var GRUDGE_SECS = 70;
function homeOf(w, faction, rival, origin) {
  return turnPoint(QUARTER[rival] - QUARTER[faction] + 4 & 3, w.width, w.height, origin.x, origin.y);
}
function pickFocus(w, faction, s, origin, raiders) {
  const rivals = rivalsOf(w, faction).filter((f) => !isOut(w, f));
  if (rivals.length === 0)
    return null;
  let grudge = null;
  let worst = GRUDGE_VALUE;
  for (const f of rivals) {
    const v = raiders.get(f) ?? 0;
    if (v >= worst) {
      worst = v;
      grudge = f;
    }
  }
  if (grudge) {
    if (s.focus !== grudge)
      s.focusUntil = w.tick + GRUDGE_SECS * TICK_RATE;
    s.focus = grudge;
    return grudge;
  }
  if (s.focus && rivals.includes(s.focus) && w.tick < (s.focusUntil ?? 0))
    return s.focus;
  let best = null;
  let bestScore = Infinity;
  for (const f of rivals) {
    const home = homeOf(w, faction, f, origin);
    const hq = knownBuildings(w, faction).find((kb) => kb.kind === "hq" && kb.faction === f);
    const live = hq ? w.buildings.get(hq.id) : undefined;
    const health = live && isVisible(w, faction, hq.tx + 1, hq.ty + 1) ? live.hp / BUILDINGS.hq.hp : 1;
    const score = dist(origin.x, origin.y, home.x, home.y) * (0.6 + 0.4 * health) + rand(s) * 18;
    if (score < bestScore) {
      bestScore = score;
      best = f;
    }
  }
  s.focus = best;
  s.focusUntil = w.tick + FOCUS_SECS * TICK_RATE;
  return best;
}
var canHitDomain = (targets, domain) => targets === "both" || targets === domain;
var value4 = (units) => units.reduce((v, u) => v + UNITS[u.kind].cost, 0);
function rand(s) {
  s.rng = s.rng * 1103515245 + 12345 & 2147483647;
  return s.rng / 2147483647;
}
function tickAi(w, faction, s) {
  const diff = DIFFICULTY[s.difficulty];
  w.factions[faction].incomeMult = diff.incomeMult;
  const hq = hqOf(w, faction);
  if (!hq && !hasGoliath(w, faction))
    return [];
  const reflex = w.winner ? [] : dodgeCalldowns(w, faction, s);
  if (w.tick - s.lastDecisionTick < diff.interval * TICK_RATE || w.winner)
    return reflex;
  s.lastDecisionTick = w.tick;
  const cmds = reflex;
  const f = w.factions[faction];
  const mine = [...w.units.values()].filter((u) => u.faction === faction);
  const myBuildings = [...w.buildings.values()].filter((b) => b.faction === faction);
  const harvesters = mine.filter((u) => u.kind === "harvester");
  const army = mine.filter((u) => COMBAT_KINDS.includes(u.kind) && !offHomeLand(w, faction, u));
  const airlifts = airliftActive(w, faction, s);
  const armyValue = value4(army);
  const count = (k) => mine.filter((u) => u.kind === k).length;
  const goliaths = goliathsOf(w, faction).sort((a, b) => a.id - b.id);
  const queued = (k) => myBuildings.reduce((n, b) => n + b.queue.filter((q) => q.kind === k).length, 0) + goliaths.reduce((n, g) => n + g.goliath.queue.filter((q) => q.kind === k).length, 0);
  const have = (k) => count(k) + queued(k);
  const has = (k) => myBuildings.some((b) => b.kind === k);
  const seen = seenEnemies(w, faction);
  observeEnemy(s, seen, enemyGantryBuilds(w, faction).length);
  const origin = hq ? buildingCenter(hq) : lostHome(w, faction, s);
  if (hq)
    noteHome(s, origin);
  const multi = isMulti(w);
  const baseGoliath = hq ? undefined : goliaths.find(isAnchored);
  const hqC = baseGoliath ? { x: baseGoliath.x, y: baseGoliath.y } : origin;
  const islandMap = !!w.rules?.islands;
  const threats = findThreats(w, faction, seen, myBuildings, harvesters);
  const home0 = hq ? origin : goliaths.find(isAnchored) ?? origin;
  const focus = multi ? pickFocus(w, faction, s, origin, raidersAt(w, threats, home0)) : null;
  const enemyHome = focus ? homeOf(w, faction, focus, origin) : mirror(w, origin.x, origin.y);
  const ourSide = (tx, ty) => dist(tx + 0.5, ty + 0.5, hqC.x, hqC.y) <= dist(tx + 0.5, ty + 0.5, enemyHome.x, enemyHome.y);
  const nearestField = nearestScrapTile(w, hqC.x, hqC.y, faction);
  const activeField = nearestField && (!islandMap || ourSide(nearestField.x, nearestField.y)) ? nearestField : null;
  const guardPoint = activeField ? {
    x: activeField.x + 0.5 + Math.sign(hqC.x - activeField.x - 0.5) * 1.5,
    y: activeField.y + 0.5 + Math.sign(hqC.y - activeField.y - 0.5) * 1.5
  } : hqC;
  threats.sort((a, b) => dist(a.x, a.y, hqC.x, hqC.y) - dist(b.x, b.y, hqC.x, hqC.y));
  const atHome = threats.filter((t) => dist(t.x, t.y, hqC.x, hqC.y) <= DEFENSE_RADIUS);
  const raidValue = atHome.reduce((v, t) => v + t.value, 0);
  const threatened = raidValue >= HOME_ALARM_VALUE;
  const enemyHqKnown = knownBuildings(w, faction).find((b) => b.kind === "hq" && (!focus || b.faction === focus));
  const enemyHqPos = enemyHqKnown ? { x: enemyHqKnown.tx + 1.5, y: enemyHqKnown.ty + 1.5 } : enemyHome;
  const gantryWanted = (!!hq || !!baseGoliath) && wantGantry(w, faction, s, { armyValue, threatened, home: origin, enemyHome });
  const anchorFor = (kind) => kind === "turret" || kind === "sam-site" || kind === "depot" && !hq ? guardPoint : kind === "radar" ? towardEnemy(w, hqC, 4) : kind === "gantry" ? towardEnemy(w, hqC, -5) : hqC;
  let roomless = false;
  const fits = (kind) => {
    const ok = !!findPlacementSpot(w, faction, kind, anchorFor(kind));
    if (!ok)
      roomless = true;
    return ok;
  };
  const wanted = nextBuilding(w, faction, myBuildings, s, gantryWanted, hq ? undefined : fits);
  if (roomless)
    noteNoRoom(w, s);
  if (f.pending?.ready) {
    const kind = f.pending.kind;
    let spot = outpostSpot(w, faction, s, kind, enemyHqPos);
    if (!spot && kind === "depot" && hq) {
      const site = depotSite(w, faction, hqC);
      spot = site ? site.spot : findPlacementSpot(w, faction, kind, guardPoint);
    } else if (!spot)
      spot = findPlacementSpot(w, faction, kind, anchorFor(kind));
    if (spot)
      cmds.push({ type: "placeBuilding", faction, tx: spot.tx, ty: spot.ty });
    else {
      cmds.push({ type: "cancelBuilding", faction });
      if (kind === "gantry")
        noteGantryFailed(w, s);
      if (!hq)
        noteNoRoom(w, s);
    }
  } else if (!f.pending) {
    const outpost = outpostWanted(w, faction, s, f.scrap);
    if (outpost)
      cmds.push({ type: "startBuilding", faction, building: outpost });
    else if (wanted && f.scrap >= BUILDINGS[wanted].cost) {
      if (wanted === "gantry" && hq && !fits("gantry"))
        noteGantryFailed(w, s);
      else
        cmds.push({ type: "startBuilding", faction, building: wanted });
    }
  }
  const depots = myBuildings.filter((b) => b.kind === "depot").length;
  const fieldsLeft = !islandMap || ownFieldLeft(w, hqC, ourSide);
  const fieldFrom = (x, y) => !islandMap ? nearestReachableResource(w, x, y, faction) : fieldsLeft ? nearestReachableResource(w, x, y, faction, ourSide) : null;
  const goliathFields = goliathHarvest(w, faction, s, harvesters, () => {
    const at = fieldFrom(hqC.x, hqC.y);
    return at ? { x: at.x + 0.5, y: at.y + 0.5 } : null;
  });
  cmds.push(...goliathFields.cmds);
  const wantHarvesters = Math.max(1, s.strategy.harvesters + diff.extraHarvesters + depots + goliathFields.extra);
  const yard = hq ? { id: hq.id, queue: hq.queue } : baseGoliath && trainableAt(w, "harvester") ? { id: baseGoliath.id, queue: baseGoliath.goliath.queue } : null;
  if (yard && fieldsLeft && harvesters.length < wantHarvesters && yard.queue.length === 0 && f.scrap >= UNITS.harvester.cost)
    cmds.push({ type: "produce", faction, buildingId: yard.id, unit: "harvester" });
  for (const h of harvesters) {
    if (goliathFields.keep.has(h.id))
      continue;
    const o = h.order;
    const astray = islandMap && o.type === "harvest" && !ourSide(o.fieldX, o.fieldY);
    if (h.order.type !== "idle" && !astray)
      continue;
    const field = fieldFrom(h.x, h.y);
    if (field)
      cmds.push({ type: "harvest", faction, unitIds: [h.id], x: field.x + 0.5, y: field.y + 0.5 });
    else if (astray) {
      const [dx, dy] = sideFrame(w, faction).vec(0, 3);
      cmds.push({ type: "move", faction, unitIds: [h.id], x: hqC.x + dx, y: hqC.y + dy });
    }
  }
  const reserve = f.pending || wanted === null ? 0 : wanted === "turret" || wanted === "radar" ? 0 : Math.min(400, BUILDINGS[wanted].cost);
  const gantry = myBuildings.find((b) => b.kind === "gantry") ?? null;
  const fundCtx = { gantry: !!gantry || f.pending?.kind === "gantry", armyValue, threatened };
  const fund = goliathFund(w, faction, s, fundCtx);
  let spendable = f.scrap - reserve - fund;
  const liftHeld = liftCondors(w, faction, s);
  const produce = (b, kind) => {
    if (!kind || unitBlocker(w, faction, kind) || spendable < unitCost(w, faction, kind))
      return;
    spendable -= unitCost(w, faction, kind);
    cmds.push({ type: "produce", faction, buildingId: b.id, unit: kind });
  };
  if (gantry && gantry.queue.length === 0 && wantGoliath(w, faction, s, { ...fundCtx, spendable: f.scrap - reserve })) {
    cmds.push({ type: "produce", faction, buildingId: gantry.id, unit: "goliath" });
    spendable = f.scrap - reserve - unitCost(w, faction, "goliath");
    noteGoliathOrdered(w, s);
  }
  const tech = has("tech-lab");
  const enemyDefenses = knownBuildings(w, faction).filter((kb) => kb.kind === "turret" || kb.kind === "sam-site").length;
  const ownAA = COMBAT_KINDS.reduce((a, k) => a + (aaWeight(UNITS[k]) >= AA_COVER ? have(k) * aaWeight(UNITS[k]) : 0), 0);
  const infantryHeavy = s.seenInfantry >= 3 && s.seenInfantry >= 0.4 * s.seenGround;
  const depth = f.scrap > 700 ? 2 : 1;
  const infantryWar = infantryArmy(w, faction);
  const infantryShare = infantryWar ? 1 : Math.max(s.strategy.infantry ?? 0, flysGivenCondor(w, faction, s) ? AIRBORNE_INFANTRY : 0, airlifts ? AIRLIFT.infantry : 0);
  const infantryValue = INFANTRY_KINDS.reduce((v, k) => v + have(k) * UNITS[k].cost, 0);
  const forceValue = airlifts ? value4(mine.filter((u) => COMBAT_KINDS.includes(u.kind))) : armyValue;
  const runBays = (liftOnly = false) => {
    let liftWants = airlifts ? airliftSquadsWanted(s) - INFANTRY_KINDS.reduce((n, k) => n + queued(k), 0) : 0;
    for (const bay of myBuildings.filter((b) => b.kind === "assembly-bay")) {
      if (bay.queue.length >= depth || liftOnly && liftWants <= 0)
        continue;
      const r = rand(s);
      const wantRockets = Math.max(Math.round(have("mastodon") * (s.strategy.escorts ?? 0)), Math.round(s.seenHeavy * 0.8), infantryWar ? Math.min(6, enemyDefenses) : 0);
      const wantSnipers = s.difficulty === "easy" || !tech ? 0 : Math.min(infantryWar ? 5 : 3, Math.floor(s.seenInfantry / 3));
      let kind;
      if (have("rocket-squad") < wantRockets)
        kind = "rocket-squad";
      else if (have("sniper") < wantSnipers)
        kind = "sniper";
      else if (liftWants > 0 || !liftOnly && infantryValue < infantryShare * Math.max(500, forceValue))
        kind = ownAA < Math.ceil(s.seenAir * 0.6) || r < 0.2 || airlifts && s.seenAir >= 2 && r < 0.5 ? "rocket-squad" : "trooper";
      else
        continue;
      liftWants--;
      produce(bay, kind);
    }
    if (!liftOnly)
      for (const t of goliathBarracks(w, faction, s, () => rand(s), !!hq))
        produce(t, t.kind);
  };
  const vehicleCap = airlifts ? AIRLIFT.vehicles * Math.max(1000, forceValue) : Infinity;
  const vehicleValue = airlifts ? ["stinger", "flak-crawler", "mortar", "mastodon", "lancer"].reduce((v, k) => v + have(k) * UNITS[k].cost, 0) : 0;
  const runFabs = () => {
    for (const fab of myBuildings.filter((b) => b.kind === "fab-plant")) {
      if (fab.queue.length >= depth)
        continue;
      let kind = "stinger";
      const r = rand(s);
      if (vehicleValue >= vehicleCap && ownAA >= Math.ceil(s.seenAir * 0.6))
        continue;
      if (s.strategy.airOnly) {
        if (ownAA < Math.ceil(s.seenAir * 0.5))
          kind = "flak-crawler";
        else if (have("stinger") >= 3)
          continue;
      } else if (ownAA < Math.ceil(s.seenAir * 0.6))
        kind = tech && r < 0.35 ? "lancer" : "flak-crawler";
      else if (tech && have("mortar") < Math.min(3, 1 + enemyDefenses) && (enemyDefenses > 0 || r < 0.2))
        kind = "mortar";
      else if (infantryHeavy && r < 0.65)
        kind = tech && have("mortar") < Math.min(3, 1 + Math.floor(s.seenInfantry / 4)) ? "mortar" : "stinger";
      else if (tech && s.seenHeavy >= 2 && r < 0.6)
        kind = "lancer";
      else if (tech && (s.strategy.heavy ? r < 0.45 : r < 0.25))
        kind = "mastodon";
      else if (tech && r < (s.strategy.heavy ? 0.8 : 0.5))
        kind = "lancer";
      produce(fab, kind);
    }
  };
  const runPads = () => {
    for (const pad of myBuildings.filter((b) => b.kind === "airpad")) {
      if (pad.queue.length >= depth)
        continue;
      const airWar = bannedBy(w, "fab-plant", faction) !== null;
      const airOnly = s.strategy.airOnly || airWar;
      const wantRaptors = Math.min(airWar ? 5 : airOnly ? 7 : airlifts ? AIRLIFT.raptors : 4, Math.ceil(s.seenAir * 0.6));
      const armySize = army.length;
      const condors = have("condor") - liftHeld.size;
      const goliathMenders = Math.min(GOLIATH_AI.menders, Math.max(goliaths.length > 0 ? 1 : 0, goliaths.filter((g) => repairUrgency(g) > 0 || g.hp < UNITS.goliath.hp * 0.85).length * 3));
      let kind;
      if (have("scout") < 1 && w.tick - s.lastScoutTick > 60 * TICK_RATE) {
        kind = "scout";
        s.lastScoutTick = w.tick;
      } else if (have("raptor") < wantRaptors && !unitBlocker(w, faction, "raptor"))
        kind = "raptor";
      else if (liftWantsCondors(w, faction, s) > queued("condor") || (airlifts ? airliftWantsCondor(w, faction, s, condors) : wantCondor(w, faction, s, condors, count("trooper") + count("rocket-squad"))))
        kind = "condor";
      else if (have("mender") < Math.min(3, Math.floor(armySize / 6)) + goliathMenders || have("mender") < 1 && army.some(isWoundedVeteran))
        kind = "mender";
      else if (tech && (airOnly ? rand(s) < (airWar && enemyDefenses > 0 ? 0.55 : 0.4) : rand(s) < 0.25 + s.seenHeavy * 0.08))
        kind = "hornet";
      else if (s.strategy.heavy && !airlifts && s.seenHeavy < 2 && fabCount(myBuildings) > 0 && rand(s) < 0.5)
        continue;
      else
        kind = "wasp";
      produce(pad, kind);
    }
  };
  if (airlifts)
    runBays(true);
  runFabs();
  runPads();
  runBays();
  for (const scout of mine.filter((u) => u.kind === "scout"))
    if (scout.order.type === "idle") {
      const leg = scoutSweep(w, hqC, s.scoutLeg++);
      cmds.push({ type: "move", faction, unitIds: [scout.id], x: leg.x, y: leg.y });
    }
  const producers = myBuildings.filter((b) => infantryWar ? b.kind === "assembly-bay" : b.kind === "fab-plant" || b.kind === "airpad");
  if (f.scrap > 1000 && !f.pending && wanted === null && s.extraProduction < 3 && producers.length > 0 && producers.every((b) => b.queue.length > 0))
    s.extraProduction++;
  if (s.seenAir >= 4 && s.extraSams < 1)
    s.extraSams = 1;
  if (s.seenAir >= 8 && s.extraSams < 2)
    s.extraSams = 2;
  if (s.seenInfantry >= 5 && s.extraTurrets < 1)
    s.extraTurrets = 1;
  if (s.seenInfantry >= 9 && s.extraTurrets < 2)
    s.extraTurrets = 2;
  const minutes = w.tick / TICK_RATE / 60;
  const lateGame = Math.max(0.5, 1 - Math.max(0, minutes - 7) * 0.06);
  const assaultValue = airlifts ? Math.max(s.strategy.assaultValue, AIRLIFT.assaultFloor) : s.strategy.assaultValue;
  const assaultAt = assaultValue * diff.assaultMult * lateGame;
  const raiders = mine.filter((u) => (u.kind === "wasp" || s.strategy.groundRaids && u.kind === "stinger") && u.order.type === "idle");
  if (s.mode === "buildup" && diff.harass && raiders.length >= s.strategy.harassGroup && s.seenAA <= raiders.length / 2 && w.tick >= OPENING_GRACE)
    s.mode = "harass";
  if (armyValue >= assaultAt && s.mode !== "assault") {
    s.mode = "assault";
    s.waveValue = armyValue;
  }
  if (s.mode === "assault" && armyValue < Math.max(RETREAT_ARMY_VALUE, s.waveValue * 0.25))
    s.mode = "buildup";
  if (w.survival)
    s.mode = "buildup";
  const used = new Set(dodgingUnits(w, s));
  for (const id of condorHolds(w, s))
    used.add(id);
  for (const id of airliftHolds(w, s))
    used.add(id);
  const idleArmy = () => army.filter((u) => u.order.type === "idle" && !used.has(u.id));
  cmds.push(...veteranRetreats(faction, army, hqC, used, w));
  cmds.push(...planMenders(faction, army, myBuildings, used, hqC, enemyHqPos, goliaths, w));
  for (const t of threats.slice(0, 3)) {
    const wantedValue = t.value * 1.5;
    const capable = idleArmy().filter((u) => canHitDomain(UNITS[u.kind].targets, t.domain) && effectivenessVs(u.kind, UNITS[t.kind].armor, t.domain) >= USELESS && canGetWithin(w, moveClassOf(u.kind), u.x, u.y, t.x, t.y, UNITS[u.kind].range)).sort((a, b) => dist(a.x, a.y, t.x, t.y) - dist(b.x, b.y, t.x, t.y));
    const squad = [];
    let v = 0;
    for (const u of capable) {
      if (v >= wantedValue)
        break;
      squad.push(u.id);
      used.add(u.id);
      v += UNITS[u.kind].cost;
    }
    if (squad.length > 0)
      cmds.push({ type: "attack", faction, unitIds: squad, targetId: t.id });
  }
  const homeGuard = value4(army.filter((u) => dist(u.x, u.y, hqC.x, hqC.y) <= DEFENSE_RADIUS));
  if (raidValue >= HOME_ALARM_VALUE && raidValue > homeGuard) {
    s.mode = "buildup";
    const away = army.filter((u) => !used.has(u.id) && dist(u.x, u.y, hqC.x, hqC.y) > DEFENSE_RADIUS && dist(u.x, u.y, enemyHome.x, enemyHome.y) > 8 && atHome.some((t) => canHitDomain(UNITS[u.kind].targets, t.domain)));
    if (away.length > 0) {
      away.forEach((u) => used.add(u.id));
      cmds.push({ type: "attackMove", faction, unitIds: away.map((u) => u.id), x: hqC.x, y: hqC.y });
    }
  }
  for (const id of goliathHolds(w, s))
    used.add(id);
  const staging = towardEnemy(w, hqC, 9, enemyHqPos);
  cmds.push(...planGoliaths(w, faction, s, { army, used, hqC, enemyHqPos, seen, mode: s.mode, threatened, staging, guardPoint, hasHq: !!hq }));
  cmds.push(...huntGoliaths(w, faction, s, { army, used, seen, enemyHqPos, mode: s.mode, threatened }));
  for (const id of objectiveHolds(w, faction, s))
    used.add(id);
  const skip = liftCondors(w, faction, s);
  if (airlifts)
    cmds.push(...planAirlift(w, faction, s, { mine, army, used, hqC, seen, threatened, skip }));
  else
    cmds.push(...planCondor(w, faction, s, { army, used, hqC, threatened, skip }));
  const guardShare = s.mode === "assault" ? 0.15 : 0.35;
  const guardValue = value4(army.filter((u) => dist(u.x, u.y, guardPoint.x, guardPoint.y) <= GUARD_RADIUS));
  if (guardValue < guardShare * armyValue) {
    let need = guardShare * armyValue - guardValue;
    const recruits2 = idleArmy().filter((u) => u.kind !== "mortar" && dist(u.x, u.y, guardPoint.x, guardPoint.y) > GUARD_RADIUS).sort((a, b) => dist(a.x, a.y, guardPoint.x, guardPoint.y) - dist(b.x, b.y, guardPoint.x, guardPoint.y));
    const squad = [];
    for (const u of recruits2) {
      if (need <= 0)
        break;
      squad.push(u.id);
      used.add(u.id);
      need -= UNITS[u.kind].cost;
    }
    if (squad.length > 0)
      cmds.push({ type: "attackMove", faction, unitIds: squad, x: guardPoint.x, y: guardPoint.y });
  }
  cmds.push(...planObjectives(w, faction, s, {
    mode: s.mode,
    hqC,
    guardPoint,
    guardNeed: guardShare * armyValue,
    army,
    used,
    threatened: raidValue >= HOME_ALARM_VALUE,
    enemyHqPos
  }));
  if (s.mode === "harass") {
    const group = raiders.filter((u) => !used.has(u.id));
    const raid = enemyHarvestArea(w, faction, hqC, focus ? seen.filter((u) => u.faction === focus) : seen, focus);
    const flying = group.filter((u) => UNITS[u.kind].domain === "air").length;
    if (flying > group.length / 2 && (aaStrengthAt(aaSources(w, faction, seen), raid.x, raid.y) >= AA_COVER || s.seenAA > group.length / 2))
      s.mode = "buildup";
    else if (group.length >= s.strategy.harassGroup) {
      const ids = group.map((u) => u.id);
      ids.forEach((id) => used.add(id));
      if (raid.targetId !== undefined)
        cmds.push({ type: "attack", faction, unitIds: ids, targetId: raid.targetId });
      else
        cmds.push({ type: "attackMove", faction, unitIds: ids, x: raid.x, y: raid.y });
    }
  } else if (s.mode === "assault") {
    const staged = army.filter((u) => !used.has(u.id) && dist(u.x, u.y, staging.x, staging.y) <= STAGE_RADIUS);
    const goliathStaged = goliaths.reduce((v, g) => canWalk(g) && dist(g.x, g.y, staging.x, staging.y) <= STAGE_RADIUS ? v + threatValue(g) : v, 0);
    const stagedValue = value4(staged) + Math.min(goliathStaged, value4(staged));
    const airWar = bannedBy(w, "fab-plant", faction) !== null && !infantryWar;
    const launchAt = airWar ? assaultAt : Math.max(450, assaultAt * WAVE_LAUNCH);
    if (stagedValue >= launchAt) {
      const target = pickPriorityTarget(w, faction, seen, enemyHqPos, focus);
      const marching2 = army.filter((u) => isInfantry(u.kind) && !used.has(u.id) && u.order.type === "attackMove" && dist(u.order.x, u.order.y, staging.x, staging.y) < 1 && dist(u.x, u.y, staging.x, staging.y) <= 2 * STAGE_RADIUS && !staged.includes(u));
      launchWave(w, cmds, faction, [...staged, ...marching2], target, used);
    } else {
      for (const u of idleArmy()) {
        if (dist(u.x, u.y, enemyHqPos.x, enemyHqPos.y) < 14) {
          const target = pickPriorityTarget(w, faction, seen, enemyHqPos, focus);
          launchWave(w, cmds, faction, [u], target, used);
        } else if (dist(u.x, u.y, staging.x, staging.y) > STAGE_RADIUS) {
          used.add(u.id);
          cmds.push({ type: "attackMove", faction, unitIds: [u.id], x: staging.x, y: staging.y });
        }
      }
    }
  }
  if (w.survival) {
    const hold = survivalHoldPoint(w, faction);
    if (hold) {
      const squad = idleArmy().filter((u) => hold.engage ? u.kind !== "mortar" || dist(u.x, u.y, hold.x, hold.y) > 7 : true).filter((u) => dist(u.x, u.y, hold.x, hold.y) > (hold.engage ? 2 : STAGE_RADIUS)).map((u) => u.id);
      squad.forEach((id) => used.add(id));
      if (squad.length > 0)
        cmds.push({ type: "attackMove", faction, unitIds: squad, x: hold.x, y: hold.y });
    }
    if (earlyCallBonus(w) > 0 && armyValue >= 1.8 * waveBudget(w.survival.difficulty, w.survival.wave + 1))
      cmds.push({ type: "callWave", faction });
  }
  cmds.push(...planSalvage(w, faction, {
    army,
    harvesters,
    buildings: myBuildings,
    used,
    threatened: raidValue >= HOME_ALARM_VALUE,
    assault: s.mode === "assault"
  }));
  cmds.push(...planCalldowns(w, faction, s, { mode: s.mode, hqC, guardPoint, enemyHqPos, army, threats }));
  return cmds;
}
var fabCount = (bs) => bs.filter((b) => b.kind === "fab-plant").length;
function ownFieldLeft(w, hqC, ourSide) {
  const home = regionAt(w, Math.floor(hqC.x), Math.floor(hqC.y), "ground");
  const labels = regionLabels(w, "ground");
  for (let i = 0;i < labels.length; i++)
    if (isResource(w, i) && labels[i] === home && ourSide(i % w.width, Math.floor(i / w.width)))
      return true;
  return false;
}
function towardEnemy(w, from, d, to) {
  const target = to ?? mirror(w, from.x, from.y);
  const len = Math.max(1, dist(from.x, from.y, target.x, target.y));
  return { x: from.x + (target.x - from.x) / len * d, y: from.y + (target.y - from.y) / len * d };
}
function pickPriorityTarget(w, faction, seen, fallback, focus = null) {
  if (focus) {
    const theirs = pickPriorityTarget(w, faction, seen.filter((u) => u.faction === focus), fallback, null);
    const ownerOf = (id) => id === undefined ? null : (w.units.get(id) ?? w.buildings.get(id))?.faction ?? knownBuildings(w, faction).find((kb) => kb.id === id)?.faction ?? null;
    if (theirs.id !== undefined && ownerOf(theirs.id) === focus)
      return theirs;
    const any = pickPriorityTarget(w, faction, seen, fallback, null);
    return any.id !== undefined ? any : theirs;
  }
  const building = enemyGantryBuilds(w, faction).sort((a, b) => dist(a.x, a.y, fallback.x, fallback.y) - dist(b.x, b.y, fallback.x, fallback.y) || a.id - b.id)[0];
  if (building)
    return { id: building.id, x: building.x, y: building.y, domain: "ground", armor: "structure" };
  const enemyGoliaths = seen.filter((u) => !!u.goliath).sort((a, b) => dist(a.x, a.y, fallback.x, fallback.y) - dist(b.x, b.y, fallback.x, fallback.y) || a.id - b.id);
  const goliath = enemyGoliaths[0];
  const goliathTarget = (g) => ({ id: g.id, x: g.x, y: g.y, domain: domainOf(g), armor: UNITS.goliath.armor });
  if (goliath && enemyHqGone(w, faction, fallback))
    return goliathTarget(goliath);
  let best = null;
  let bestD = Infinity;
  for (const u of seen) {
    if (u.kind !== "harvester")
      continue;
    const d = dist(u.x, u.y, fallback.x, fallback.y);
    if (d < bestD) {
      bestD = d;
      best = { id: u.id, x: u.x, y: u.y, domain: "ground", armor: UNITS.harvester.armor };
    }
  }
  if (best)
    return best;
  const known2 = knownBuildings(w, faction);
  for (const kinds of [["gantry", "fab-plant", "airpad", "assembly-bay", "tech-lab", "depot"], ["turret", "sam-site", "radar"], ["hq"]]) {
    const cands = known2.filter((kb) => kinds.includes(kb.kind));
    const centre = (kb) => BUILDINGS[kb.kind].size / 2;
    cands.sort((a, b2) => dist(a.tx + centre(a), a.ty + centre(a), fallback.x, fallback.y) - dist(b2.tx + centre(b2), b2.ty + centre(b2), fallback.x, fallback.y));
    const b = cands[0];
    if (b) {
      const size = BUILDINGS[b.kind].size;
      return { id: b.id, x: b.tx + size / 2, y: b.ty + size / 2, domain: "ground", armor: "structure" };
    }
  }
  if (goliath)
    return goliathTarget(goliath);
  return { x: fallback.x, y: fallback.y, domain: "ground", armor: "structure" };
}
function launchWave(w, cmds, faction, units, target, used) {
  const id = target.id !== undefined && (w.units.has(target.id) || w.buildings.has(target.id)) ? target.id : undefined;
  const attackers = [];
  const escorts = [];
  for (const u of units) {
    used.add(u.id);
    if (id !== undefined && effectivenessVs(u.kind, target.armor, target.domain) >= USELESS)
      attackers.push(u.id);
    else
      escorts.push(u.id);
  }
  if (attackers.length > 0 && id !== undefined)
    cmds.push({ type: "attack", faction, unitIds: attackers, targetId: id });
  if (escorts.length > 0)
    cmds.push({ type: "attackMove", faction, unitIds: escorts, x: target.x, y: target.y });
}
function findThreats(w, faction, seen, myBuildings, harvesters) {
  const out = [];
  for (const u of seen) {
    if (UNITS[u.kind].dps <= 0 && !UNITS[u.kind].heal)
      continue;
    const nearBuilding = myBuildings.some((b) => {
      const c = buildingCenter(b);
      return dist(u.x, u.y, c.x, c.y) <= DEFENSE_RADIUS;
    });
    const nearHarvester = harvesters.some((h) => dist(u.x, u.y, h.x, h.y) <= 6);
    const nearUplink = w.objectives.uplinks.some((l) => l.owner === faction && dist(u.x, u.y, l.x, l.y) <= OBJECTIVES.uplink.radius + 2);
    if (nearBuilding || nearHarvester || nearUplink)
      out.push({ id: u.id, x: u.x, y: u.y, kind: u.kind, domain: domainOf(u), value: threatValue(u) });
  }
  return out;
}
function observeEnemy(s, seen, gantryBuilds = 0) {
  let air = 0;
  let ground = 0;
  let heavy = gantryBuilds * GOLIATH_AI.gantryWeight;
  let aa = 0;
  let infantry = 0;
  for (const u of seen) {
    if (u.kind === "harvester")
      continue;
    if (domainOf(u) === "air")
      air += u.kind === "hornet" ? 2 : u.kind === "scout" ? 0.3 : u.kind === "condor" ? 0.5 : 1;
    else
      ground++;
    if (u.goliath)
      heavy += GOLIATH_AI.heavyWeight;
    else if (UNITS[u.kind].armor === "heavy")
      heavy++;
    aa += unitAntiAir(u).weight;
    if (isInfantry(u.kind))
      infantry++;
  }
  s.seenAir = Math.max(air, s.seenAir * 0.97);
  s.seenGround = Math.max(ground, s.seenGround * 0.97);
  s.seenHeavy = Math.max(heavy, s.seenHeavy * 0.97);
  s.seenAA = Math.max(aa, s.seenAA * 0.97);
  s.seenInfantry = Math.max(infantry, s.seenInfantry * 0.97);
}
function nextBuilding(w, faction, myBuildings, s, gantry = false, fits) {
  const have = new Map;
  const hasHq = !!hqOf(w, faction);
  for (const b of myBuildings)
    if (!b.outpost || !hasHq)
      have.set(b.kind, (have.get(b.kind) ?? 0) + 1);
  const infantryWar = infantryArmy(w, faction);
  const order = s.strategy.buildOrder.map((k) => infantryWar && k === "fab-plant" ? "assembly-bay" : k);
  if (w.survival)
    order.push("turret", "sam-site", "turret", "turret", "sam-site", "turret");
  for (let i = 0;i < s.extraSams; i++)
    order.splice(Math.min(order.length, 2 + i), 0, "sam-site");
  for (let i = 0;i < s.extraTurrets; i++)
    order.splice(Math.min(order.length, 2 + i), 0, "turret");
  if ((s.strategy.bayVsArmour && s.seenHeavy >= 2 || flysGivenCondor(w, faction, s)) && !order.includes("assembly-bay"))
    order.splice(Math.min(order.length, 3), 0, "assembly-bay");
  if (airliftActive(w, faction, s)) {
    ["assembly-bay", "airpad"].forEach((k, slot) => {
      const i = order.indexOf(k);
      if (i >= 0 && i <= slot + 1)
        return;
      if (i > 0)
        order.splice(i, 1);
      order.splice(Math.min(order.length, slot + 1), 0, k);
    });
    if (order.filter((k) => k === "airpad").length < 2)
      order.splice(Math.min(order.length, 5), 0, "airpad");
  }
  if (gantry) {
    for (const k of BUILDINGS.gantry.requiresAll ?? [])
      if (!order.includes(k))
        order.push(k);
    order.push("gantry");
  }
  const fabs = order.filter((k) => k === "fab-plant").length;
  const pads = order.filter((k) => k === "airpad").length;
  const noFab = bannedBy(w, "fab-plant", faction) !== null;
  for (let i = 0;i < s.extraProduction; i++) {
    const air = s.strategy.airOnly || noFab || !s.strategy.heavy && pads + i % 2 <= fabs;
    order.push(infantryWar ? "assembly-bay" : air ? "airpad" : "fab-plant");
  }
  const wanted = new Map;
  let depotsSkipped = 0;
  for (const kind of order) {
    wanted.set(kind, (wanted.get(kind) ?? 0) + 1);
    if ((have.get(kind) ?? 0) >= wanted.get(kind))
      continue;
    if (kind === "depot" && depotsSkipped < 3) {
      const hq = hqOf(w, faction);
      if (!hq || !depotSite(w, faction, buildingCenter(hq))) {
        depotsSkipped++;
        continue;
      }
    }
    if (buildingBlocker(w, faction, kind))
      continue;
    if (fits && !fits(kind))
      continue;
    return kind;
  }
  return null;
}
function depotSite(w, faction, hqC) {
  const fr = sideFrame(w, faction);
  let best = null;
  for (let fy = 0;fy < w.height; fy++)
    for (let fx = 0;fx < w.width; fx++) {
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!isResource(w, tileIndex(w, tx, ty)))
        continue;
      const drop = nearestDropOff(w, faction, tx + 0.5, ty + 0.5);
      if (!drop)
        continue;
      const dc = buildingCenter(drop);
      if (dist(tx + 0.5, ty + 0.5, dc.x, dc.y) < 9)
        continue;
      const d = dist(tx + 0.5, ty + 0.5, hqC.x, hqC.y);
      if (!best || d < best.d)
        best = { x: tx + 0.5, y: ty + 0.5, d };
    }
  if (!best || best.d > 24)
    return null;
  const spot = findPlacementSpot(w, faction, "depot", best);
  if (!spot || dist(spot.tx + 1, spot.ty + 1, best.x, best.y) > 5)
    return null;
  const [bx, by] = fr.vec(0, 2.5);
  if (!findPath(w, hqC.x + bx, hqC.y + by, best.x, best.y, "ground", faction))
    return null;
  return { spot };
}
function findPlacementSpot(w, faction, kind, anchor2) {
  const size = BUILDINGS[kind].size;
  const fr = sideFrame(w, faction);
  const a = fr.toFrame(anchor2);
  let best = null;
  let bestD = Infinity;
  const centres = [];
  for (const b of w.buildings.values())
    if (b.faction === faction && !b.outpost)
      centres.push({ c: buildingCenter(b), r: ECONOMY.buildRadius + 2 });
  const dugIn = goliathsOf(w, faction).filter(isAnchored);
  if (kind !== "hq")
    for (const g of dugIn)
      centres.push({ c: g, r: Math.ceil(GOLIATH.buildRing + size) });
  const atFeet = (tx, ty) => dugIn.some((g) => distToFootprint2(tx, ty, size, g.x, g.y) < GOLIATH.footprint / 2 + 1);
  for (const { c: at, r } of centres) {
    const c = fr.toFrame(at);
    for (let dy = -r;dy <= r; dy++)
      for (let dx = -r;dx <= r; dx++) {
        const fx = Math.round(c.x + dx - size / 2);
        const fy = Math.round(c.y + dy - size / 2);
        const d = dist(fx + size / 2, fy + size / 2, a.x, a.y);
        if (d >= bestD)
          continue;
        const [tx, ty] = fr.tile(fx, fy, size);
        if (!canPlaceBuilding(w, faction, kind, tx, ty))
          continue;
        if (size > 1 && tooCramped(w, tx, ty, size))
          continue;
        if (dugIn.length > 0 && atFeet(tx, ty))
          continue;
        best = { tx, ty };
        bestD = d;
      }
  }
  return best;
}
function tooCramped(w, tx, ty, size) {
  let free = 0;
  for (let i = -1;i <= size; i++)
    for (const [x, y] of [
      [tx + i, ty - 1],
      [tx + i, ty + size],
      [tx - 1, ty + i],
      [tx + size, ty + i]
    ]) {
      if (x < 0 || y < 0 || x >= w.width || y >= w.height)
        continue;
      if (w.occupancy[y * w.width + x] === 0)
        free++;
    }
  return free < (size + 2) * 2;
}
function scoutSweep(w, c, leg) {
  const far = mirror(w, c.x, c.y);
  const stops = [
    far,
    { x: far.x, y: c.y },
    { x: c.x, y: far.y },
    { x: w.width / 2, y: w.height / 2 }
  ];
  return stops[leg % stops.length];
}
function enemyHarvestArea(w, faction, hqC, seen, focus = null) {
  const gantry = enemyGantryBuilds(w, faction).sort((a, b) => dist(a.x, a.y, hqC.x, hqC.y) - dist(b.x, b.y, hqC.x, hqC.y) || a.id - b.id)[0];
  if (gantry)
    return { x: gantry.x, y: gantry.y, targetId: gantry.id };
  for (const u of seen)
    if (u.kind === "harvester")
      return { x: u.x, y: u.y, targetId: u.id };
  const own = nearestScrapTile(w, hqC.x, hqC.y, faction);
  if (focus)
    return homeOf(w, faction, focus, own ? { x: own.x + 0.5, y: own.y + 0.5 } : hqC);
  if (own)
    return mirror(w, own.x + 0.5, own.y + 0.5);
  return mirror(w, hqC.x, hqC.y);
}
function raidersAt(w, threats, home) {
  const out = new Map;
  for (const t of threats) {
    const f = w.units.get(t.id)?.faction;
    if (!f || dist(t.x, t.y, home.x, home.y) > DEFENSE_RADIUS)
      continue;
    out.set(f, (out.get(f) ?? 0) + t.value);
  }
  return out;
}

// src/sim/openers.ts
var OPENERS2 = {
  blitz: {
    id: "blitz",
    name: "Blitz",
    tagline: "Strike first. Raid their harvesters before they're ready.",
    rollout: "3 Stingers ready. Hit their harvesters!",
    building: "fab-plant",
    units: ["stinger", "stinger", "stinger"],
    harvesters: 2,
    scrap: -100
  },
  industry: {
    id: "industry",
    name: "Industry",
    tagline: "Out-mine them now, out-build them later.",
    rollout: "3 harvesters mining. Out-build them.",
    building: "fab-plant",
    units: [],
    harvesters: 3,
    scrap: 200
  },
  airwing: {
    id: "airwing",
    name: "Air Wing",
    tagline: "Own the skies. Wasps hunt tanks and harvesters.",
    rollout: "3 Wasps ready. Beware their Flak.",
    building: "airpad",
    units: ["wasp", "wasp", "wasp"],
    harvesters: 2,
    scrap: 0
  }
};
var OPENER_IDS = ["blitz", "industry", "airwing"];
var isOpenerId = (s) => typeof s === "string" && OPENER_IDS.includes(s);
function pickAiOpener(strategy, seed, faction) {
  const roll = hash32(seed, saltOf("opener"), FACTIONS.indexOf(faction));
  switch (strategy) {
    case "rush":
      return "blitz";
    case "boom":
      return "industry";
    case "airswarm":
    case "skyforce":
      return "airwing";
    case "ironclad":
      return roll % 2 === 0 ? "blitz" : "industry";
    default:
      return OPENER_IDS[roll % OPENER_IDS.length];
  }
}
function openerBlocked(w, faction, id) {
  if (rulesOf(w).armada)
    return `Disabled: ${MUTATORS.armada.name}`;
  const o = OPENERS2[id];
  for (const kind of [o.building, ...o.units]) {
    const why = bannedBy(w, kind, faction);
    if (why)
      return why;
  }
  return null;
}
function allowedOpener(w, faction, preferred) {
  if (!openerBlocked(w, faction, preferred))
    return preferred;
  return OPENER_IDS.find((id) => !openerBlocked(w, faction, id)) ?? null;
}
function applyOpener(w, faction, id) {
  const o = OPENERS2[id];
  const out = { buildingId: null, unitIds: [] };
  const base = basePoint(w, faction);
  if (!base)
    return out;
  const fr = frame(w, faction);
  const hqC = fr.toFrame(base);
  const field = nearestResourceInFrame(w, fr, hqC);
  const centre = { x: w.width / 2, y: w.height / 2 };
  const site = findSite(w, faction, fr, o.building, hqC, field, centre);
  let front = hqC;
  if (site) {
    const size = BUILDINGS[o.building].size;
    const [tx, ty] = fr.tile(site.fx, site.fy, size);
    const outpost = !inBaseRange(w, faction, tx + size / 2, ty + size / 2);
    const b = spawnBuilding(w, o.building, faction, tx, ty);
    if (outpost)
      b.outpost = true;
    out.buildingId = b.id;
    front = fr.toFrame(buildingCenter(b));
  }
  const unitsAt = toward(front, centre, 2.5);
  for (const kind of o.units) {
    const p = freeSpot(w, fr, kind, unitsAt, front);
    if (p)
      out.unitIds.push(spawnFacing(w, faction, kind, fr, p, centre).id);
  }
  const have = [...w.units.values()].filter((u) => u.faction === faction && u.kind === "harvester").length;
  const harvestAt = field ? toward(hqC, { x: field.x + 0.5, y: field.y + 0.5 }, 2.6) : hqC;
  for (let i = have;i < o.harvesters; i++) {
    const p = freeSpot(w, fr, "harvester", harvestAt, hqC);
    if (p)
      out.unitIds.push(spawnFacing(w, faction, "harvester", fr, p, field ? { x: field.x + 0.5, y: field.y + 0.5 } : centre).id);
  }
  w.factions[faction].scrap += o.scrap;
  if (field) {
    const [wx, wy] = fr.tile(field.x, field.y, 1);
    for (const u of w.units.values())
      if (u.faction === faction && u.kind === "harvester" && u.order.type === "idle")
        u.order = { type: "harvest", fieldX: wx, fieldY: wy, phase: "toField" };
  }
  return out;
}
function spawnStartUnits(w, faction, kinds, near) {
  const fr = frame(w, faction);
  const at = fr.toFrame(near);
  const centre = { x: w.width / 2, y: w.height / 2 };
  const ids = [];
  for (const kind of kinds) {
    const target = UNITS[kind].domain === "air" ? { x: at.x, y: at.y - 2 } : at;
    const p = freeSpot(w, fr, kind, target, at);
    if (p)
      ids.push(spawnFacing(w, faction, kind, fr, p, centre).id);
  }
  return ids;
}
function predictOpenerSite(w, faction, kind) {
  const base = basePoint(w, faction);
  if (!base)
    return null;
  const fr = frame(w, faction);
  const hqC = fr.toFrame(base);
  const site = findSite(w, faction, fr, kind, hqC, nearestResourceInFrame(w, fr, hqC), { x: w.width / 2, y: w.height / 2 });
  if (!site)
    return null;
  const [tx, ty] = fr.tile(site.fx, site.fy, BUILDINGS[kind].size);
  return { tx, ty };
}
function basePoint(w, faction) {
  const hq = hqOf(w, faction);
  if (hq)
    return buildingCenter(hq);
  const g = anchoredGoliaths(w, faction)[0];
  return g ? { x: g.x, y: g.y } : null;
}
var frame = sideFrame;
var dist2 = (a, b) => hypot(a.x - b.x, a.y - b.y);
function toward(from, to, d) {
  const len = Math.max(0.000001, dist2(from, to));
  const k = Math.min(1, d / len);
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
}
function nearestResourceInFrame(w, fr, p) {
  let best = null;
  let bestD = Infinity;
  for (let fy = 0;fy < w.height; fy++)
    for (let fx = 0;fx < w.width; fx++) {
      const [tx, ty] = fr.tile(fx, fy, 1);
      if (!isResource(w, ty * w.width + tx))
        continue;
      const d = hypot(fx + 0.5 - p.x, fy + 0.5 - p.y);
      if (d < bestD) {
        bestD = d;
        best = { x: fx, y: fy };
      }
    }
  return best;
}
function segDist(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = dx * dx + dy * dy;
  const t = L > 0 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L)) : 0;
  return hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}
function findSite(w, faction, fr, kind, hqC, field, centre) {
  const size = BUILDINGS[kind].size;
  const anchor2 = toward(hqC, centre, 4.5);
  const fieldC = field ? { x: field.x + 0.5, y: field.y + 0.5 } : null;
  let best = null;
  let bestScore = Infinity;
  const R = 9;
  for (let fy = Math.floor(hqC.y) - R;fy <= Math.floor(hqC.y) + R; fy++)
    for (let fx = Math.floor(hqC.x) - R;fx <= Math.floor(hqC.x) + R; fx++) {
      const [tx, ty] = fr.tile(fx, fy, size);
      if (!canPlaceBuilding(w, faction, kind, tx, ty))
        continue;
      if (walledIn(w, tx, ty, size))
        continue;
      const c = { x: fx + size / 2, y: fy + size / 2 };
      let score = dist2(c, anchor2);
      const gap = Math.max(Math.abs(c.x - hqC.x) - (1.5 + size / 2), Math.abs(c.y - hqC.y) - (1.5 + size / 2));
      if (gap < 1)
        score += 6;
      if (fieldC && segDist(c, hqC, fieldC) < size / 2 + 1)
        score += 4;
      for (let dy = 0;dy < size; dy++)
        for (let dx = 0;dx < size; dx++)
          if (terrainAt(w, tx + dx, ty + dy) === 4 /* Road */)
            score += 0.75;
      if (score < bestScore) {
        bestScore = score;
        best = { fx, fy };
      }
    }
  return best;
}
function walledIn(w, tx, ty, size) {
  let free = 0;
  let total = 0;
  for (let i = -1;i <= size; i++)
    for (const [x, y] of [
      [tx + i, ty - 1],
      [tx + i, ty + size],
      [tx - 1, ty + i],
      [tx + size, ty + i]
    ]) {
      if (!inBounds(w, x, y))
        continue;
      total++;
      if (passable(w, x, y, "ground"))
        free++;
    }
  return free < total / 2;
}
function freeSpot(w, fr, kind, target, around) {
  const mc = moveClassOf(kind);
  const cands = [];
  const cx = Math.floor(around.x);
  const cy = Math.floor(around.y);
  for (let dy = -6;dy <= 6; dy++)
    for (let dx = -6;dx <= 6; dx++) {
      const p = { x: cx + dx + 0.5, y: cy + dy + 0.5 };
      const [tx, ty] = fr.tile(Math.floor(p.x), Math.floor(p.y), 1);
      const onField = inBounds(w, tx, ty) && isResource(w, ty * w.width + tx);
      cands.push({ p, d: dist2(p, target) + (onField && kind !== "harvester" ? 3 : 0) });
    }
  cands.sort((a, b) => a.d - b.d);
  for (const { p } of cands) {
    const [tx, ty] = fr.tile(Math.floor(p.x), Math.floor(p.y), 1);
    if (!inBounds(w, tx, ty))
      continue;
    if (mc === "air" ? w.occupancy[ty * w.width + tx] !== 0 : !passable(w, tx, ty, mc))
      continue;
    const wp = fr.toWorld(p);
    let clear = true;
    for (const u of w.units.values())
      if (UNITS[u.kind].domain === "air" === (mc === "air") && hypot(u.x - wp.x, u.y - wp.y) < 0.9) {
        clear = false;
        break;
      }
    if (clear)
      return p;
  }
  return null;
}
function spawnFacing(w, faction, kind, fr, p, look) {
  const wp = fr.toWorld(p);
  const wl = fr.toWorld(look);
  const u = spawnUnit(w, kind, faction, wp.x, wp.y);
  applySpawnRank(w, u);
  u.facing = u.aim = atan2(wl.x - wp.x, -(wl.y - wp.y));
  return u;
}

// src/sim/ops.ts
var ACHIEVE = new Set(["destroyHq", "destroy", "survive", "waves", "deliver"]);
var isAchieveGoal = (g) => ACHIEVE.has(g.type);
var ALL_UNITS = Object.keys(UNITS);
var ALL_BUILDINGS = Object.keys(BUILDINGS).filter((k) => k !== "hq");
var DEFENSIVE = { assaultValue: Infinity, harassGroup: Infinity };
var OPS = [
  {
    id: "bridgehead",
    title: "Bridgehead",
    icon: "\uD83C\uDF09",
    tagline: "Hold the river crossing against a Rush",
    brief: "We hold the west end of the Riverlands bridge: two turrets, a Depot on the crystal field and a Stinger squad. Red's Rush commander wants that crossing. Hold it for 4:00.",
    tip: "Stingers and Turrets shred Rush's light tanks. Build a Fab Plant early and send reinforcements up the road to the bridge.",
    map: "riverlands",
    ai: { strategy: "rush", difficulty: "hard", tweak: { assaultValue: 2200, harvesters: 4 } },
    focus: { x: 21, y: 34 },
    setup(w, o) {
      o.building("blue", "depot", 20, 31);
      o.building("blue", "turret", 22, 30, "bridge");
      o.building("blue", "turret", 26, 32, "bridge");
      o.units("blue", "stinger", 3, 23.5, 33.5);
      o.units("blue", "flak-crawler", 1, 21.5, 34.5);
      o.units("blue", "harvester", 1, 21.5, 29.5);
      o.building("red", "fab-plant", 50, 10);
      o.units("red", "stinger", 6, 44, 10);
      w.factions.red.scrap = 1200;
    },
    goals: [
      { type: "survive", secs: 240 },
      { type: "protect", tag: "bridge", min: 1, label: "Keep a bridge turret standing", short: "Turrets" }
    ],
    stars: [
      { type: "maxLosses", n: 6 },
      { type: "protect", tag: "bridge", min: 2, label: "Both bridge turrets standing", short: "Turrets" }
    ]
  },
  {
    id: "harvest-moon",
    title: "Harvest Moon",
    icon: "\uD83C\uDF19",
    tagline: "Deliver 10,000 scrap under Air Swarm raids",
    brief: "The refinery needs 10,000 scrap before the convoy leaves at 5:00. Red's Air Swarm hunts harvesters with Wasps from the first minute. Keep the haul coming.",
    tip: "Flak Crawlers and Turrets by the field keep Wasps off your harvesters. More harvesters, more scrap — but only if they live.",
    map: "dune-sea",
    ai: { strategy: "airswarm", difficulty: "hard" },
    setup(_w, o) {
      o.units("blue", "harvester", 1, 9.5, 46.5);
      o.building("blue", "turret", 10, 41);
      o.units("red", "wasp", 3, 46, 12);
    },
    goals: [
      { type: "deliver", scrap: 1e4 },
      { type: "within", secs: 300 }
    ],
    stars: [
      { type: "maxLosses", n: 1, kind: "harvester" },
      { type: "within", secs: 240 }
    ]
  },
  {
    id: "decapitation",
    title: "Decapitation",
    icon: "\uD83C\uDFAF",
    tagline: "A strike group, no factories, 3:00",
    brief: "No base, no reinforcements: two Mastodons, three Stingers, two Hornets, two Raptors and a Mender, with a Trooper Squad guarding the HQ. Red's HQ sits behind two SAM sites, three turrets, Flak and a fighter screen. Take it down within 3:00.",
    tip: "Move as one group — whatever arrives alone dies alone. Stingers kill the Flak, Raptors the fighters, Hornets flatten SAM sites; then everything on the HQ.",
    map: "proving-grounds",
    ai: { strategy: "balanced", difficulty: "easy", tweak: DEFENSIVE },
    focus: { x: 10, y: 39 },
    rules: { playerBans: { units: ALL_UNITS, buildings: ALL_BUILDINGS }, playerIncome: 0, calldowns: false },
    scrap: 0,
    setup(w, o) {
      o.removeUnits("blue", "harvester");
      o.units("blue", "mastodon", 2, 10, 36);
      o.units("blue", "stinger", 3, 10, 37.8);
      o.units("blue", "hornet", 2, 10, 39.6);
      o.units("blue", "raptor", 2, 10, 41.4);
      o.units("blue", "mender", 1, 10, 43.2);
      o.building("red", "fab-plant", 37, 2);
      o.building("red", "airpad", 44, 10);
      o.building("red", "sam-site", 39, 9);
      o.building("red", "sam-site", 45, 4);
      o.building("red", "turret", 40, 8);
      o.building("red", "turret", 44, 8);
      o.building("red", "turret", 38, 7);
      o.units("red", "flak-crawler", 2, 42, 10.5);
      o.units("red", "raptor", 3, 38, 4);
      w.factions.red.scrap = 400;
    },
    goals: [{ type: "destroyHq" }, { type: "within", secs: 180 }],
    stars: [
      { type: "maxLosses", n: 4 },
      { type: "within", secs: 120 }
    ]
  },
  {
    id: "frozen-assets",
    title: "Frozen Assets",
    icon: "❄",
    tagline: "3,000 scrap, no income: spend it wisely",
    brief: "Our harvesters are frozen solid: the factories stand, but there's 3,000 scrap in the bank and not a crate more — no mining, no HQ salvage. Red's Boom commander is building an economy. Strike before it pays off: destroy their HQ within 6:00.",
    tip: "Every unit counts. Hit their harvesters to stall the Boom, keep your army together, and don't waste scrap on defences you won't need.",
    map: "frostbite",
    ai: { strategy: "boom", difficulty: "normal" },
    rules: { playerBans: { units: ["harvester"] }, playerIncome: 0, calldowns: false },
    scrap: 3000,
    setup(_w, o) {
      o.removeUnits("blue", "harvester");
      o.building("blue", "fab-plant", 8, 39);
      o.building("blue", "airpad", 4, 36);
      o.building("blue", "tech-lab", 8, 43);
    },
    goals: [{ type: "destroyHq" }, { type: "within", secs: 360 }],
    stars: [
      { type: "destroy", kind: "harvester", count: 4 },
      { type: "within", secs: 240 }
    ]
  },
  {
    id: "sky-pirates",
    title: "Sky Pirates",
    icon: "\uD83C\uDFF4‍☠️",
    tagline: "Air only: sink their HQ before 7:00",
    brief: "Fab Plants and the Condor are off-limits: this is an air raid. Red is digging in behind SAM sites you haven't seen yet, and every Wasp you show it teaches it to build more Flak. Scout first, then sink their HQ before 7:00.",
    tip: "A Scout finds the SAM sites. Raptors beat their fighters, Hornets flatten SAMs and the HQ. Don't feed bombers into anti-air one at a time.",
    map: "ashlands",
    ai: { strategy: "balanced", difficulty: "easy", tweak: DEFENSIVE },
    rules: { playerBans: { units: NO_GROUND_COMBAT, buildings: ["fab-plant", "assembly-bay"] }, enemyIncome: 0.5 },
    scrap: 800,
    setup(_w, o) {
      o.building("blue", "airpad", 9, 54);
      o.building("blue", "tech-lab", 4, 51);
      o.units("blue", "harvester", 1, 9.5, 57.5);
      o.building("red", "sam-site", 52, 10);
      o.building("red", "sam-site", 59, 12);
      o.building("red", "turret", 55, 10);
    },
    goals: [{ type: "destroyHq" }, { type: "within", secs: 420 }],
    stars: [
      { type: "maxLosses", n: 12 },
      { type: "within", secs: 270 }
    ]
  },
  {
    id: "glass-jaw",
    title: "Glass Jaw",
    icon: "\uD83D\uDCA5",
    tagline: "Double damage, double speed, 6:00",
    brief: "Glass Cannons and Rapid Fab for both sides: every weapon hits twice as hard and everything builds in half the time. Red's Rush commander loves it. Destroy their HQ within 6:00.",
    tip: "Fights end in seconds: never trade one at a time. Turrets hit twice as hard too — a couple buy you time to mass an army.",
    map: "dune-sea",
    ai: { strategy: "rush", difficulty: "normal", tweak: { harvesters: 4 } },
    rules: { mutators: ["glass", "rapidfab"] },
    goals: [{ type: "destroyHq" }, { type: "within", secs: 360 }],
    stars: [
      { type: "maxLosses", n: 0, buildings: true },
      { type: "within", secs: 240 }
    ]
  },
  {
    id: "iron-tide",
    title: "Iron Tide",
    icon: "\uD83D\uDEE1",
    tagline: "Survive Ironclad on Hard for 6:00",
    brief: "Ironclad on Hard: Mastodons, Lancers and Mortars rolling around the frozen sea, with a bigger economy than yours. You have a Fab Plant and a Tech Lab. Hold out for 6:00.",
    tip: "Lancers burn through Mastodons and Wasps strike them from the air. Mortars outrange your Turrets — hunt them with Stingers.",
    map: "frostbite",
    ai: { strategy: "ironclad", difficulty: "hard" },
    setup(_w, o) {
      o.building("blue", "fab-plant", 8, 39);
      o.building("blue", "tech-lab", 4, 36);
      o.units("blue", "harvester", 1, 8.5, 42.5);
    },
    goals: [{ type: "survive", secs: 360 }],
    stars: [
      { type: "destroy", kind: "mastodon", count: 2 },
      { type: "maxLosses", n: 1, buildings: true }
    ]
  },
  {
    id: "last-light",
    title: "Last Light",
    icon: "\uD83D\uDD6F",
    tagline: "Last Stand: survive 10 fast waves",
    brief: "The last base on the river. Waves come every 40 seconds from the map edges, growing every time, with a boss every fifth. You start dug in. Survive 10 waves.",
    tip: "The top bar names the next wave's theme: build its counter before it lands. Calling a wave early on a clear field pays scrap — and saves time.",
    map: "riverlands",
    ai: "survival",
    survival: { difficulty: "easy", firstWave: 45, interval: 40 },
    scrap: 1200,
    setup(_w, o) {
      o.building("blue", "fab-plant", 4, 44);
      o.building("blue", "airpad", 9, 45);
      o.building("blue", "turret", 10, 49);
      o.building("blue", "turret", 8, 43);
      o.units("blue", "harvester", 2, 9.5, 51.5);
    },
    goals: [{ type: "waves", count: 10 }],
    stars: [
      { type: "maxLosses", n: 2, buildings: true },
      { type: "within", secs: 420 }
    ]
  }
];
var opById = (id) => OPS.find((o) => o.id === id) ?? null;
var opIndex = (id) => OPS.findIndex((o) => o.id === id);
var nextOp = (id) => OPS[opIndex(id) + 1] ?? null;
var OPS_OPEN_AT_START = 3;
var opsUnlocked = (completed) => Math.min(OPS.length, OPS_OPEN_AT_START + completed);
function opAiState(op, seed) {
  if (!op.ai || op.ai === "survival")
    return null;
  return createAiState(op.ai.strategy, op.ai.difficulty, seed, op.ai.tweak);
}
function spreadSpot(w, kind, x, y, i) {
  const bx = x + (i % 3 - 1) * 0.9;
  const by = y + Math.floor(i / 3) * 0.9;
  if (UNITS[kind].domain === "air")
    return { x: bx, y: by };
  const mc = moveClassOf(kind);
  for (let r = 0;r <= 3; r++)
    for (let dy = -r;dy <= r; dy++)
      for (let dx = -r;dx <= r; dx++) {
        const tx = Math.floor(bx) + dx;
        const ty = Math.floor(by) + dy;
        if (inBounds(w, tx, ty) && passable(w, tx, ty, mc) && w.occupancy[ty * w.width + tx] === 0)
          return { x: tx + (bx - Math.floor(bx)), y: ty + (by - Math.floor(by)) };
      }
  return { x: bx, y: by };
}
function setupOp(w, id) {
  const op = opById(id);
  if (!op)
    return;
  const player = "blue";
  const enemy = "red";
  const st = {
    id: op.id,
    player,
    enemy,
    tags: {},
    killed: {},
    lost: {},
    starsLost: 0,
    lastTagDeath: null,
    result: null
  };
  const r = makeRules(op.rules?.mutators ?? []);
  if (op.rules?.playerBans)
    r.sideBans = { [player]: { units: op.rules.playerBans.units ?? [], buildings: op.rules.playerBans.buildings ?? [] } };
  if (op.rules?.playerIncome !== undefined || op.rules?.enemyIncome !== undefined)
    r.sideIncome = { [player]: op.rules.playerIncome ?? 1, [enemy]: op.rules.enemyIncome ?? 1 };
  r.banLabel = "Disabled in this op";
  if (op.rules?.calldowns === false)
    r.noCalldowns = true;
  w.rules = r;
  if (op.ai === "survival")
    setupSurvival(w, op.survival ?? {}, player);
  w.factions[player].scrap = op.scrap ?? r.startScrap;
  const tag = (name, id2) => {
    if (name)
      (st.tags[name] ??= []).push(id2);
  };
  const helpers = {
    building(faction, kind, tx, ty, t) {
      const b = spawnBuilding(w, kind, faction, tx, ty);
      tag(t, b.id);
      return b.id;
    },
    units(faction, kind, n, x, y, t) {
      const ids = [];
      for (let i = 0;i < n; i++) {
        const p = spreadSpot(w, kind, x, y, i);
        const u = spawnUnit(w, kind, faction, p.x, p.y);
        if (kind === "harvester") {
          const f = nearestReachableResource(w, u.x, u.y, u.faction);
          if (f)
            u.order = { type: "harvest", fieldX: f.x, fieldY: f.y, phase: "toField" };
        }
        tag(t, u.id);
        ids.push(u.id);
      }
      return ids;
    },
    removeUnits(faction, kind) {
      for (const u of [...w.units.values()])
        if (u.faction === faction && u.kind === kind)
          w.units.delete(u.id);
    }
  };
  op.setup?.(w, helpers);
  w.ops = st;
}
var secsOf = (w) => w.tick / TICK_RATE;
function fmtClock(secs) {
  const s = Math.max(0, Math.ceil(secs));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
var fmtNum = (n) => Math.floor(n).toLocaleString("en-US");
var kindName = (k) => (k in UNITS) ? UNITS[k].name : BUILDINGS[k].name;
var plural = (k, n) => n === 1 ? kindName(k) : `${kindName(k)}s`;
function protectCount(w, st, g) {
  if (g.tag) {
    const ids = st.tags[g.tag] ?? [];
    const alive2 = ids.filter((id) => w.units.has(id) || w.buildings.has(id) || carrierOf(w, id)).length;
    return { alive: alive2, total: ids.length };
  }
  let alive = 0;
  if (g.kind) {
    for (const e of [...w.units.values(), ...w.buildings.values(), ...[...w.units.values()].flatMap((u) => u.passengers ?? [])])
      if (e.faction === st.player && e.kind === g.kind)
        alive++;
  }
  return { alive, total: Math.max(alive, g.min) };
}
function evalGoal(w, st, g) {
  const t = secsOf(w);
  const stats = w.factions[st.player].stats;
  switch (g.type) {
    case "destroyHq": {
      const hq = hqOf(w, st.enemy);
      return { state: hq ? "pending" : "done", label: "Enemy HQ", value: hq ? `${Math.ceil(hq.hp / BUILDINGS.hq.hp * 100)}%` : "down", progress: hq ? 1 - hq.hp / BUILDINGS.hq.hp : 1 };
    }
    case "destroy": {
      const n = st.killed[g.kind] ?? 0;
      return { state: n >= g.count ? "done" : "pending", label: plural(g.kind, 2), value: `${Math.min(n, g.count)}/${g.count}`, progress: Math.min(1, n / g.count) };
    }
    case "survive":
      return { state: t >= g.secs ? "done" : "pending", label: "Hold", value: fmtClock(g.secs - t), progress: Math.min(1, t / g.secs) };
    case "waves": {
      const n = wavesSurvived(w);
      return { state: n >= g.count ? "done" : "pending", label: "Waves", value: `${Math.min(n, g.count)}/${g.count}`, progress: Math.min(1, n / g.count) };
    }
    case "deliver": {
      const n = stats.scrapHarvested;
      return { state: n >= g.scrap ? "done" : "pending", label: "Scrap", value: `${fmtNum(Math.min(n, g.scrap))}/${fmtNum(g.scrap)}`, progress: Math.min(1, n / g.scrap) };
    }
    case "protect": {
      const { alive, total } = protectCount(w, st, g);
      return { state: alive >= g.min ? "ok" : "failed", label: g.short ?? plural(g.kind ?? "turret", 2), value: `${alive}/${total}`, progress: total ? alive / total : 0 };
    }
    case "within":
      return { state: t > g.secs ? "failed" : "ok", label: "Time", value: fmtClock(g.secs - t), progress: Math.max(0, 1 - t / g.secs) };
    case "maxLosses": {
      const n = g.kind ? st.lost[g.kind] ?? 0 : g.buildings ? stats.buildingsLost : stats.unitsLost;
      return { state: n > g.n ? "failed" : "ok", label: "Lost", value: `${n}/${g.n}`, progress: g.n > 0 ? Math.min(1, n / g.n) : n > 0 ? 1 : 0 };
    }
  }
}
function goalText(g, asStar = false) {
  switch (g.type) {
    case "destroyHq":
      return "Destroy the enemy HQ";
    case "destroy":
      return `Destroy ${g.count} enemy ${plural(g.kind, g.count)}`;
    case "survive":
      return `Hold out for ${fmtClock(g.secs)}`;
    case "waves":
      return `Survive ${g.count} waves`;
    case "deliver":
      return `Deliver ${fmtNum(g.scrap)} scrap`;
    case "protect":
      return g.label;
    case "within":
      return asStar ? `Finish in under ${fmtClock(g.secs)}` : `Before the clock hits ${fmtClock(g.secs)}`;
    case "maxLosses": {
      const what = g.kind ? plural(g.kind, g.n) : g.buildings ? g.n === 1 ? "building" : "buildings" : g.n === 1 ? "unit" : "units";
      return g.n === 0 ? `Lose no ${g.kind ? plural(g.kind, 2) : g.buildings ? "buildings" : "units"}` : `Lose ${g.n} ${what} or fewer`;
    }
  }
}
function objectiveLine(op) {
  const main = op.goals.filter(isAchieveGoal).map((g) => goalText(g));
  const limit = op.goals.find((g) => g.type === "within");
  const rest = op.goals.filter((g) => !isAchieveGoal(g) && g.type !== "within").map((g) => goalText(g));
  const head = `${main.join(" and ")}${limit ? ` before ${fmtClock(limit.secs)}` : ""}`;
  return [head, ...rest].filter(Boolean).join(" · ");
}
var holds = (e) => e.state === "done" || e.state === "ok";
function starsNow(w, op, st) {
  let mask = 1;
  op.stars.forEach((g, i) => {
    if (holds(evalGoal(w, st, g)))
      mask |= 2 << i;
  });
  return mask;
}
function winReason(w, op, st) {
  const g = op.goals.find(isAchieveGoal);
  if (!g)
    return "Objective complete";
  switch (g.type) {
    case "survive":
      return `Held for ${fmtClock(g.secs)}`;
    case "waves":
      return `${g.count} waves survived`;
    case "deliver":
      return `${fmtNum(w.factions[st.player].stats.scrapHarvested)} scrap delivered`;
    case "destroy":
      return `${g.count} enemy ${plural(g.kind, g.count)} destroyed`;
    default:
      return "Enemy HQ destroyed";
  }
}
function failReason(g) {
  switch (g.type) {
    case "within":
      return "Out of time";
    case "protect":
      return g.tag ? `${g.label.replace(/^Keep (an? |the )?/i, "").replace(/ standing$/i, "")} lost` : "Lost what we had to protect";
    case "maxLosses":
      return "Too many losses";
    default:
      return "Objective failed";
  }
}
function centreOf(w, f) {
  const hq = hqOf(w, f);
  return hq ? buildingCenter(hq) : { x: w.width / 2, y: w.height / 2 };
}
function finish(w, op, st, won, reason, at, byGoal) {
  st.result = { won, reason, stars: won ? starsNow(w, op, st) : 0, secs: Math.round(secsOf(w)), x: at.x, y: at.y, byGoal };
  if (!w.winner)
    w.winner = won ? st.player : st.enemy;
}
function deathOf(w, pred) {
  for (const ev of w.fx)
    if (ev.type === "death" && pred(ev))
      return ev;
  return;
}
function tickOps(w) {
  const st = w.ops;
  if (!st || st.result)
    return;
  const op = opById(st.id);
  if (!op)
    return;
  for (const ev of w.fx) {
    if (ev.type !== "death")
      continue;
    const kind = ev.unitKind ?? ev.buildingKind;
    if (!kind)
      continue;
    const book = ev.faction === st.player ? st.lost : st.killed;
    book[kind] = (book[kind] ?? 0) + 1;
    if (Object.values(st.tags).some((ids) => ids.includes(ev.id)))
      st.lastTagDeath = { x: ev.x, y: ev.y };
  }
  if (!w.winner && !hqOf(w, st.player)) {
    const fell = deathOf(w, (ev) => ev.buildingKind === "hq" && ev.faction === st.player);
    finish(w, op, st, false, "Our HQ has fallen", fell ? { x: fell.x, y: fell.y } : centreOf(w, st.player), false);
    return;
  }
  if (w.winner) {
    const won = w.winner === st.player;
    const hq = won ? null : hqOf(w, st.player);
    const lastGoliath = won ? deathOf(w, (ev) => ev.unitKind === "goliath" && ev.faction === st.enemy) : undefined;
    const enemyHqFell = !!deathOf(w, (ev) => ev.buildingKind === "hq" && ev.faction === st.enemy);
    if (lastGoliath && !enemyHqFell)
      finish(w, op, st, true, "Enemy Goliath destroyed", { x: lastGoliath.x, y: lastGoliath.y }, false);
    else
      finish(w, op, st, won, won ? "Enemy HQ destroyed" : "Our HQ has fallen", hq ? buildingCenter(hq) : centreOf(w, won ? st.enemy : st.player), false);
    return;
  }
  if (w.tick % TICK_RATE !== 0)
    return;
  op.stars.forEach((g, i) => {
    if (!isAchieveGoal(g) && evalGoal(w, st, g).state === "failed")
      st.starsLost |= 2 << i;
  });
  const evals = op.goals.map((g) => ({ g, e: evalGoal(w, st, g) }));
  const failed = evals.find((x) => x.e.state === "failed");
  const achieve = evals.filter((x) => isAchieveGoal(x.g));
  if (achieve.length > 0 && achieve.every((x) => x.e.state === "done")) {
    finish(w, op, st, true, winReason(w, op, st), centreOf(w, st.player), true);
    return;
  }
  if (failed) {
    const g = failed.g;
    const at = g.type === "protect" && st.lastTagDeath ? st.lastTagDeath : g.type === "within" && hqOf(w, st.enemy) ? centreOf(w, st.enemy) : centreOf(w, st.player);
    finish(w, op, st, false, failReason(g), at, true);
  }
}
function opStatus(w) {
  const st = w.ops;
  const op = st ? opById(st.id) : null;
  if (!st || !op)
    return null;
  return {
    op,
    secs: secsOf(w),
    goals: op.goals.map((goal) => ({ goal, eval: evalGoal(w, st, goal) })),
    stars: op.stars.map((goal) => ({ goal, eval: evalGoal(w, st, goal) })),
    starsNow: starsNow(w, op, st),
    starsLost: st.starsLost,
    result: st.result
  };
}

// src/sim/lifeline.ts
function setupLifeline(w) {
  w.lifeline = perSide(() => ({ due: null, given: 0 }));
}
function hasCondor(w, f) {
  for (const u of w.units.values())
    if (u.faction === f && u.kind === "condor")
      return true;
  for (const b of w.buildings.values())
    if (b.faction === f && b.queue.some((q) => q.kind === "condor"))
      return true;
  return false;
}
function squadCount(w, f) {
  let n = 0;
  for (const u of w.units.values()) {
    if (u.faction !== f)
      continue;
    if (isInfantry(u.kind))
      n++;
    n += u.passengers?.length ?? 0;
  }
  return n;
}
function lifelineRoute(w, f) {
  const hq = hqOf(w, f);
  const s = BUILDINGS.hq.size;
  const gs = hq ? [] : goliathsOf(w, f);
  const g = gs.find(isAnchored) ?? gs[0];
  const home = hq ? { x: hq.tx + s / 2, y: hq.ty + s / 2 } : g ? { x: g.x, y: g.y } : null;
  if (!home)
    return null;
  const fr = sideFrame(w, f);
  const c = fr.toFrame(home);
  const inset = LIFELINE.edgeInset;
  const edges = [
    { d: c.x, p: { x: inset, y: c.y } },
    { d: w.height - c.y, p: { x: c.x, y: w.height - inset } },
    { d: c.y, p: { x: c.x, y: inset } },
    { d: w.width - c.x, p: { x: w.width - inset, y: c.y } }
  ];
  let near = edges[0];
  for (const e of edges)
    if (e.d < near.d - 0.000000001)
      near = e;
  const to = { x: c.x + 3, y: c.y - 3 };
  return { from: fr.toWorld(near.p), to: fr.toWorld(to) };
}
function tickLifeline(w) {
  const lines = w.lifeline;
  if (!lines || w.winner || !rulesOf(w).lifeline)
    return;
  for (const f of sidesOf(w)) {
    const slot = lines[f];
    if (!hqOf(w, f) && !hasGoliath(w, f) || bannedBy(w, "condor", f) || hasCondor(w, f)) {
      slot.due = null;
      continue;
    }
    if (slot.due === null) {
      slot.due = w.tick + Math.round(LIFELINE.delay * TICK_RATE);
      continue;
    }
    if (w.tick < slot.due)
      continue;
    const route2 = lifelineRoute(w, f);
    slot.due = null;
    if (!route2)
      continue;
    const condor = flyIn(w, f, route2);
    slot.given++;
    w.fx.push({ type: "lifeline", faction: f, id: condor.id, x: condor.x, y: condor.y, squad: (condor.passengers?.length ?? 0) > 0 });
  }
}
function flyIn(w, f, route2) {
  const c = spawnUnit(w, "condor", f, route2.from.x, route2.from.y);
  c.free = true;
  c.facing = c.aim = atan2(route2.to.x - c.x, -(route2.to.y - c.y));
  c.order = { type: "move", x: route2.to.x, y: route2.to.y };
  if (squadCount(w, f) < LIFELINE.squadUnder && !bannedBy(w, "trooper", f)) {
    const squad = spawnUnit(w, "trooper", f, c.x, c.y);
    squad.free = true;
    applySpawnRank(w, squad);
    stowAboard(w, c, squad);
  }
  return c;
}

// src/sim/maps.ts
function mapBansMutator(def, id) {
  return def.bannedMutators?.includes(id) ? `Not on ${def.name}: ${def.banReason ?? "island Uplinks need Condors and infantry"}` : null;
}
function hash(x, y, seed) {
  let h = x * 374761393 + y * 668265263 + seed * 1442695041 | 0;
  h = Math.imul(h ^ h >>> 13, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function valueNoise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

class Painter {
  w;
  seed;
  quarters;
  constructor(w, seed, quarters = false) {
    this.w = w;
    this.seed = seed;
    this.quarters = quarters;
  }
  n(x, y, scale = 0.35) {
    return valueNoise(x * scale, y * scale, this.seed) - 0.5;
  }
  set(tx, ty, t, only) {
    const { w } = this;
    if (this.quarters) {
      for (let q = 0;q < 4; q++) {
        const [x, y] = turnTile(q, w.width, w.height, tx, ty);
        if (!inBounds(w, x, y))
          continue;
        if (only && !only.includes(terrainAt(w, x, y)))
          continue;
        setTerrain(w, x, y, t);
      }
      return;
    }
    for (const [x, y] of [
      [tx, ty],
      [w.width - 1 - tx, w.height - 1 - ty]
    ]) {
      if (!inBounds(w, x, y))
        continue;
      if (only && !only.includes(terrainAt(w, x, y)))
        continue;
      setTerrain(w, x, y, t);
    }
  }
  blob(cx, cy, r, t, wobble = 0.35, only) {
    const R = Math.ceil(r * (1 + wobble) + 1);
    for (let ty = Math.floor(cy - R);ty <= cy + R; ty++)
      for (let tx = Math.floor(cx - R);tx <= cx + R; tx++) {
        const d = hypot(tx + 0.5 - cx, ty + 0.5 - cy);
        if (d <= r * (1 + wobble * 2 * this.n(tx, ty)))
          this.set(tx, ty, t, only);
      }
  }
  stroke(pts, width, t, wobble = 0.25, only) {
    for (let i = 0;i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const len = hypot(x1 - x0, y1 - y0);
      const steps = Math.ceil(len * 3);
      for (let s = 0;s <= steps; s++) {
        const x = x0 + (x1 - x0) * s / steps;
        const y = y0 + (y1 - y0) * s / steps;
        const r = width / 2 * (1 + wobble * 2 * this.n(x * 1.7, y * 1.7));
        const R = Math.ceil(r + 1);
        for (let ty = Math.floor(y - R);ty <= y + R; ty++)
          for (let tx = Math.floor(x - R);tx <= x + R; tx++)
            if (hypot(tx + 0.5 - x, ty + 0.5 - y) <= r)
              this.set(tx, ty, t, only);
      }
    }
  }
  rect(x0, y0, x1, y1, t, only) {
    for (let ty = y0;ty <= y1; ty++)
      for (let tx = x0;tx <= x1; tx++)
        this.set(tx, ty, t, only);
  }
  scatter(x0, y0, x1, y1, count, r, t, only) {
    for (let i = 0;i < count; i++) {
      const x = x0 + hash(i, 17, this.seed) * (x1 - x0);
      const y = y0 + hash(i, 91, this.seed) * (y1 - y0);
      this.blob(x, y, r * (0.6 + hash(i, 5, this.seed) * 0.8), t, 0.4, only);
    }
  }
}
var G = 0 /* Ground */;
var OPEN = [0 /* Ground */, 5 /* Rough */, 6 /* Forest */];
var LAND = [0 /* Ground */, 5 /* Rough */, 6 /* Forest */, 1 /* Rock */];
var MAPS = [
  {
    id: "proving-grounds",
    name: "Proving Grounds",
    biome: "temperate",
    size: 48,
    blurb: "The classic: rock ridges, one contested field. Learn the ropes here.",
    hq: [4, 40],
    seed: 5,
    uplinks: [[35.5, 35.5]],
    dropSites: [[20.5, 28.5], [30.5, 30.5], [8.5, 22.5]],
    paint() {}
  },
  {
    id: "riverlands",
    name: "Riverlands",
    biome: "temperate",
    size: 56,
    blurb: "A wide river splits the valley. One bridge, two muddy fords.",
    hq: [4, 48],
    seed: 11,
    uplinks: [[28, 28], [45.5, 45.5]],
    dropSites: [[24.5, 33.5], [16.5, 21.5], [34.5, 44.5]],
    paint(p) {
      const river = [[-2, 1], [5, 6], [11, 13], [17, 16], [23, 23], [28, 28]];
      p.stroke(river, 4.2, 3 /* Water */, 0.2);
      p.stroke(river, 7, 5 /* Rough */, 0.35, [G]);
      p.blob(12, 27, 3.4, 6 /* Forest */, 0.45, OPEN);
      p.blob(27, 42, 3.8, 6 /* Forest */, 0.45, OPEN);
      p.blob(3, 21, 3, 6 /* Forest */, 0.45, OPEN);
      p.blob(39, 51, 3.2, 6 /* Forest */, 0.45, OPEN);
      p.blob(18, 52, 2.2, 6 /* Forest */, 0.45, OPEN);
      p.blob(21, 45, 2.2, 1 /* Rock */, 0.4, OPEN);
      p.blob(8, 33, 1.6, 1 /* Rock */, 0.4, OPEN);
      p.blob(33, 35, 1.8, 1 /* Rock */, 0.3, OPEN);
      p.stroke([[23, 32], [32, 23]], 2.2, 8 /* Bridge */, 0, [3 /* Water */]);
      p.stroke([[23, 32], [32, 23]], 2.2, 4 /* Road */, 0, [G, 5 /* Rough */, 6 /* Forest */]);
      p.stroke([[8, 14], [13, 9]], 3, 9 /* Shallows */, 0.1, [3 /* Water */]);
      p.stroke([[6, 49], [11, 46], [16, 40], [21, 35], [23.5, 32]], 2, 4 /* Road */, 0, OPEN);
      p.blob(13, 44, 2.1, 2 /* Scrap */, 0.25);
      p.blob(5, 36, 1.7, 2 /* Scrap */, 0.25);
      p.blob(19, 30, 1.5, 7 /* Crystal */, 0.2);
      p.blob(34, 46, 1.6, 2 /* Scrap */, 0.25);
    }
  },
  {
    id: "dune-sea",
    name: "Dune Sea",
    biome: "desert",
    size: 56,
    blurb: "Open sands between towering mesas. Three lanes, rich wrecks.",
    hq: [4, 48],
    seed: 23,
    uplinks: [[41.5, 41.5]],
    dropSites: [[24.5, 31.5], [31.5, 36.5], [22.5, 35.5]],
    paint(p) {
      p.blob(17, 23, 6.2, 5 /* Rough */, 0.3, [G]);
      p.blob(17, 23, 4.8, 1 /* Rock */, 0.3);
      p.blob(9, 13, 3, 5 /* Rough */, 0.3, [G]);
      p.blob(9, 13, 2, 1 /* Rock */, 0.35);
      p.blob(25, 45, 2.6, 5 /* Rough */, 0.3, [G]);
      p.blob(25, 45, 1.7, 1 /* Rock */, 0.35);
      p.blob(27.5, 27.5, 3.6, 6 /* Forest */, 0.3, [G, 5 /* Rough */]);
      p.blob(27.5, 27.5, 2.1, 3 /* Water */, 0.2);
      p.blob(4, 4, 3.2, 6 /* Forest */, 0.35, [G]);
      p.blob(3, 3, 2, 3 /* Water */, 0.3);
      p.stroke([[6, 49], [12, 44], [18, 38], [22, 34], [25, 32.5], [31, 31]], 2, 4 /* Road */, 0, OPEN);
      p.blob(13, 44, 2.1, 2 /* Scrap */, 0.25);
      p.blob(4, 35, 1.8, 2 /* Scrap */, 0.25);
      p.blob(8, 24, 1.5, 2 /* Scrap */, 0.25);
      p.blob(22, 35, 1.5, 7 /* Crystal */, 0.2);
      p.blob(34, 44, 1.5, 7 /* Crystal */, 0.2);
      p.scatter(30, 36, 50, 54, 5, 1.6, 5 /* Rough */, [G]);
    }
  },
  {
    id: "frostbite",
    name: "Frostbite",
    biome: "arctic",
    size: 48,
    blurb: "A frozen sea in the middle. Short, brutal and hover-friendly.",
    hq: [4, 40],
    seed: 37,
    uplinks: [[35.5, 35.5]],
    dropSites: [[9.5, 13.5], [29.5, 35.5], [12.5, 22.5]],
    paint(p) {
      p.blob(23.5, 23.5, 9.5, 3 /* Water */, 0.18);
      p.blob(23.5, 23.5, 11.5, 9 /* Shallows */, 0.2, [G]);
      p.blob(15, 38, 2.4, 6 /* Forest */, 0.4, OPEN);
      p.blob(5, 26, 3, 6 /* Forest */, 0.45, OPEN);
      p.blob(26, 44, 2.6, 6 /* Forest */, 0.45, OPEN);
      p.blob(2, 12, 2.4, 6 /* Forest */, 0.45, OPEN);
      p.stroke([[12, 30], [9, 31], [7, 33]], 1.8, 1 /* Rock */, 0.3, OPEN);
      p.blob(34, 41, 1.8, 1 /* Rock */, 0.4, OPEN);
      p.blob(8, 8, 3, 5 /* Rough */, 0.4, [G]);
      p.blob(20, 42, 2, 5 /* Rough */, 0.4, [G]);
      p.stroke([[6, 41], [11, 42], [18, 43], [24, 44]], 1.8, 4 /* Road */, 0, OPEN);
      p.blob(11, 36, 2, 2 /* Scrap */, 0.25);
      p.blob(9, 9, 1.6, 7 /* Crystal */, 0.2);
      p.blob(3, 31, 1.4, 2 /* Scrap */, 0.25);
    }
  },
  {
    id: "ashlands",
    name: "Ashlands",
    biome: "volcanic",
    size: 64,
    blurb: "Lava rivers carve three plateaus. Bridges are choke points; air rules.",
    hq: [5, 55],
    seed: 53,
    uplinks: [[44.5, 44.5]],
    dropSites: [[27.5, 33.5], [12.5, 30.5], [32.5, 40.5]],
    paint(p) {
      const lava = [[-2, 12], [8, 21], [16, 27], [26, 38], [36, 46], [44, 55], [52, 66]];
      p.stroke(lava, 3.6, 3 /* Water */, 0.25);
      p.stroke(lava, 6.5, 5 /* Rough */, 0.4, [G]);
      p.stroke([[9, 26], [14, 21]], 2.2, 8 /* Bridge */, 0, [3 /* Water */]);
      p.stroke([[9, 26], [14, 21]], 2.2, 4 /* Road */, 0, OPEN);
      p.stroke([[30, 47], [35, 42]], 2.2, 8 /* Bridge */, 0, [3 /* Water */]);
      p.stroke([[30, 47], [35, 42]], 2.2, 4 /* Road */, 0, OPEN);
      p.stroke([[7, 56], [10, 48], [11, 36], [11.5, 24]], 2, 4 /* Road */, 0, OPEN);
      p.stroke([[8, 57], [18, 53], [28, 50], [32, 45]], 2, 4 /* Road */, 0, OPEN);
      p.blob(20, 58, 2.2, 1 /* Rock */, 0.4, OPEN);
      p.blob(3, 42, 2.4, 1 /* Rock */, 0.4, OPEN);
      p.blob(31.5, 31.5, 2.2, 1 /* Rock */, 0.3, OPEN);
      p.blob(22, 31, 2.4, 6 /* Forest */, 0.45, OPEN);
      p.blob(16, 44, 2.8, 6 /* Forest */, 0.45, OPEN);
      p.blob(4, 5, 3, 6 /* Forest */, 0.45, OPEN);
      p.blob(14, 51, 2.2, 2 /* Scrap */, 0.25);
      p.blob(4, 32, 1.8, 2 /* Scrap */, 0.25);
      p.blob(24, 24, 1.6, 7 /* Crystal */, 0.2, LAND);
      p.blob(17, 12, 1.8, 2 /* Scrap */, 0.25, LAND);
    }
  },
  {
    id: "compass-rose",
    name: "Compass Rose",
    biome: "arctic",
    size: 72,
    blurb: "Four players, one in each corner. Frozen streams split the quadrants: every side for itself.",
    hq: [5, 64],
    players: 4,
    seed: 89,
    uplinks: [[36, 36], [18, 34.5]],
    dropSites: [[24.5, 50.5], [30.5, 40.5], [10.5, 41.5]],
    lastStand: false,
    bannedMutators: ["robotlove"],
    banReason: "Robot Love needs exactly two sides",
    starSecs: 900,
    paint(p) {
      const stream = [[-2, 33], [6, 34.5], [13, 33.6], [20, 34.6], [26, 34.4], [29.6, 35.6]];
      p.stroke(stream, 3.4, 3 /* Water */, 0.2);
      p.stroke(stream, 6.2, 5 /* Rough */, 0.35, [G]);
      p.blob(36, 36, 5.2, G, 0.15, [5 /* Rough */]);
      p.blob(36, 36, 9.5, 5 /* Rough */, 0.3, [G]);
      p.blob(36, 36, 6.5, G, 0.12, [5 /* Rough */]);
      p.rect(33, 38, 33, 38, 7 /* Crystal */);
      p.stroke([[18, 30], [18, 39]], 2.2, 8 /* Bridge */, 0, [3 /* Water */]);
      p.stroke([[18, 30], [18, 39]], 2.2, 4 /* Road */, 0, [G, 5 /* Rough */, 6 /* Forest */]);
      p.stroke([[5, 30.5], [5, 38.5]], 3, 9 /* Shallows */, 0.1, [3 /* Water */]);
      p.blob(21, 57, 2.6, 6 /* Forest */, 0.45, OPEN);
      p.blob(10, 49.5, 2.2, 6 /* Forest */, 0.45, OPEN);
      p.blob(30, 63, 2.3, 6 /* Forest */, 0.45, OPEN);
      p.blob(25.5, 41.5, 1.7, 6 /* Forest */, 0.4, OPEN);
      p.blob(2.5, 60, 2, 6 /* Forest */, 0.45, OPEN);
      p.blob(17, 45.5, 1.8, 1 /* Rock */, 0.4, OPEN);
      p.blob(28.5, 53.5, 1.7, 1 /* Rock */, 0.35, OPEN);
      p.blob(13.5, 68.5, 1.3, 1 /* Rock */, 0.4, OPEN);
      p.scatter(20, 44, 32, 52, 3, 1.3, 5 /* Rough */, [G]);
      p.stroke([[8, 63], [12, 56], [16, 47], [18, 39]], 1.8, 4 /* Road */, 0, OPEN);
      p.stroke([[9, 65], [18, 57], [25, 49.5], [30.5, 42.5]], 1.8, 4 /* Road */, 0, OPEN);
      p.blob(14, 60, 2.1, 2 /* Scrap */, 0.25);
      p.blob(6, 45, 1.8, 2 /* Scrap */, 0.25);
      p.blob(24.5, 45.5, 1.4, 7 /* Crystal */, 0.2);
    }
  },
  {
    id: "archipelago",
    name: "Archipelago",
    biome: "tropical",
    size: 108,
    blurb: "Island Uplinks only troops can take: fly them in by Condor. Two bridges.",
    hq: [14, 88],
    seed: 71,
    uplinks: [
      { at: [54, 54], infantryOnly: true, income: 5, charge: 0.04 },
      { at: [6.5, 35], infantryOnly: true, income: 2.5, charge: 0.025 },
      { at: [35, 8.5], infantryOnly: true, income: 2.5, charge: 0.025 },
      { at: [18, 18.5], infantryOnly: true, income: 3.5, charge: 0.03 }
    ],
    dropSites: [[36, 56], [28, 70], [58, 82]],
    startUnits: ["condor"],
    squadAboard: true,
    lifeline: true,
    islands: true,
    hqTrickle: 3,
    bannedMutators: ["airwar"],
    lastStand: false,
    starSecs: 720,
    paint(p) {
      const S = p.w.width;
      const V = S * Math.SQRT2;
      const deep = 10 /* Deep */;
      const halfWidth = (v) => {
        const dv = Math.abs(v - V / 2);
        if (dv <= 4)
          return 14;
        if (dv <= 12)
          return 14 - (dv - 4) / 8 * 5;
        return 9;
      };
      for (let ty = 0;ty < S; ty++)
        for (let tx = 0;tx < S; tx++) {
          const x = tx + 0.5;
          const y = ty + 0.5;
          const u = (x - y) / Math.SQRT2;
          const v = (x + y) / Math.SQRT2;
          const dv = Math.abs(v - V / 2);
          const calm = dv > 13 && dv < 21 ? 0.15 : 1;
          const rag = (valueNoise(x * 0.18, y * 0.18, p.seed) - 0.5) * 4 * calm;
          const h = halfWidth(v) + rag;
          const gulf = 40 - hypot(x - 8, y - 8) + (valueNoise(x * 0.06, y * 0.06, p.seed + 12) - 0.5) * 10 + rag - Math.max(0, 28 - dv) * 1.5;
          if (Math.abs(u) < h || gulf > 0)
            p.set(tx, ty, deep);
          else if (Math.abs(u) < h + 1.3 || gulf > -1.3)
            p.set(tx, ty, 3 /* Water */, [G]);
        }
      const island = (lobes, wobble = 0.16) => {
        for (const [cx, cy, r] of lobes)
          p.blob(cx, cy, r + 1.4, 3 /* Water */, wobble, [deep]);
        for (const [cx, cy, r] of lobes)
          p.blob(cx, cy, r, G, wobble, [deep, 3 /* Water */]);
      };
      island([[54, 54, 5.2]], 0.12);
      island([[18, 18.5, 5.2], [13.8, 14, 2.9], [22.2, 22.4, 2.2]]);
      island([[6.5, 35, 4.9], [3.8, 30.6, 2], [10.4, 37.6, 2.2]]);
      island([[35, 8.5, 5], [33.4, 13.4, 2.3]]);
      p.blob(52.5, 56.5, 1.6, 6 /* Forest */, 0.4, [G]);
      p.blob(13.6, 13.8, 2, 6 /* Forest */, 0.4, [G]);
      p.blob(22.4, 22.6, 1.2, 5 /* Rough */, 0.4, [G]);
      p.blob(10.6, 37.8, 1.5, 6 /* Forest */, 0.4, [G]);
      p.blob(37.6, 5.6, 1.4, 6 /* Forest */, 0.4, [G]);
      p.blob(33.2, 13.6, 1.2, 5 /* Rough */, 0.3, [G]);
      const stack = (cx, cy, r) => {
        p.blob(cx, cy, r + 1.2, 3 /* Water */, 0.3, [deep]);
        p.blob(cx, cy, r, 1 /* Rock */, 0.3, [deep, 3 /* Water */]);
      };
      p.blob(28.5, 29.5, 2.4, 3 /* Water */, 0.4, [deep]);
      p.blob(4.5, 4.5, 2, 3 /* Water */, 0.4, [deep]);
      stack(9.5, 2.8, 0.9);
      stack(4, 11.5, 0.7);
      stack(2.6, 20, 0.8);
      stack(31, 35, 0.9);
      p.stroke([[33.4, 50.6], [50.6, 33.4]], 2.4, 8 /* Bridge */, 0, [deep, 3 /* Water */]);
      p.stroke([[16, 88], [22, 78], [27, 66], [31, 56], [33.6, 50.4]], 2, 4 /* Road */, 0, OPEN);
      p.stroke([[18, 90], [30, 88], [42, 84], [52, 79], [57.6, 74.4]], 2, 4 /* Road */, 0, OPEN);
      p.blob(36, 74, 3.2, 6 /* Forest */, 0.45, OPEN);
      p.blob(20, 56, 3, 6 /* Forest */, 0.45, OPEN);
      p.blob(46, 94, 2.8, 6 /* Forest */, 0.45, OPEN);
      p.blob(8, 56, 2.4, 6 /* Forest */, 0.45, OPEN);
      p.blob(6, 100, 2.6, 6 /* Forest */, 0.45, OPEN);
      p.blob(28, 80, 1.8, 1 /* Rock */, 0.4, OPEN);
      p.blob(42, 64, 2, 1 /* Rock */, 0.35, OPEN);
      p.blob(12, 66, 1.6, 1 /* Rock */, 0.4, OPEN);
      p.blob(56, 90, 1.7, 1 /* Rock */, 0.4, OPEN);
      p.blob(30, 102, 1.5, 1 /* Rock */, 0.4, OPEN);
      p.scatter(22, 60, 40, 72, 4, 1.4, 5 /* Rough */, [G]);
      p.rect(21, 91, 23, 93, 2 /* Scrap */);
      p.rect(29, 58, 30, 58, 7 /* Crystal */);
    }
  }
];
var mapById = (id) => MAPS.find((m) => m.id === id) ?? (isRandomMapId(id) ? randomMapDef(id) : null) ?? MAPS[0];
var isKnownMapId = (id) => MAPS.some((m) => m.id === id) || isRandomMapId(id) && randomMapDef(id) !== null;
function createClassicTerrain(w) {
  const S = w.width;
  const mirror2 = (tx, ty) => [S - 1 - tx, S - 1 - ty];
  const both = (tx, ty, t) => {
    if (inBounds(w, tx, ty))
      setTerrain(w, tx, ty, t);
    const [mx, my] = mirror2(tx, ty);
    if (inBounds(w, mx, my))
      setTerrain(w, mx, my, t);
  };
  for (let i = -14;i <= 14; i++) {
    const tx = 24 + i;
    const ty = 24 - Math.round(i * 0.35);
    if (Math.abs(i) === 5 || Math.abs(i) === 6)
      continue;
    both(tx, ty, 1 /* Rock */);
    both(tx, ty + 1, 1 /* Rock */);
  }
  for (const [cx, cy] of [
    [14, 30],
    [30, 42]
  ])
    for (let dy = -1;dy <= 1; dy++)
      for (let dx = -1;dx <= 1; dx++)
        if (Math.abs(dx) + Math.abs(dy) < 2)
          both(cx + dx, cy + dy, 1 /* Rock */);
  for (let ty = 36;ty <= 38; ty++)
    for (let tx = 12;tx <= 14; tx++)
      both(tx, ty, 2 /* Scrap */);
  for (let ty = 22;ty <= 25; ty++)
    for (let tx = 22;tx <= 25; tx++)
      if (w.terrain[ty * S + tx] === 0 /* Ground */)
        setTerrain(w, tx, ty, 2 /* Scrap */);
  for (let ty = 27;ty <= 29; ty++)
    for (let tx = 3;tx <= 5; tx++)
      both(tx, ty, 2 /* Scrap */);
}
function createMapWorld(id, opts = {}) {
  const def = mapById(id);
  const w = createWorld(def.size, def.size);
  const four = def.players === 4 && !opts.survival && !opts.op;
  if (four)
    w.sides = [...FACTIONS];
  w.mapId = def.id;
  w.biome = def.biome;
  w.seed = (opts.seed ?? def.seed) >>> 0;
  if (def.id === "proving-grounds")
    createClassicTerrain(w);
  else if (def.random) {
    const g = def.random.terrain;
    for (let i = 0;i < g.length; i++)
      setTerrain(w, i % def.size, Math.floor(i / def.size), g[i]);
  } else {
    def.paint(new Painter(w, def.seed, def.players === 4));
    clearBase(w, def);
  }
  const [hx, hy] = def.hq;
  const hs = BUILDINGS.hq.size;
  if (four)
    return setupFourCorners(w, def, opts);
  const rx = def.size - hx - hs;
  const ry = def.size - hy - hs;
  spawnBuilding(w, "hq", "blue", hx, hy);
  spawnBuilding(w, "hq", "red", rx, ry);
  spawnUnit(w, "harvester", "blue", hx + hs + 1.5, hy + 1.5);
  spawnUnit(w, "harvester", "red", rx - 1.5, ry + 1.5);
  const squads = ["blue", "red"].map((f) => {
    const at = f === "blue" ? { x: hx - 1.5, y: hy + 1.5 } : { x: def.size - hx + 1.5, y: def.size - hy - 1.5 };
    const p = dropPoint(w, f, at.x, at.y) ?? at;
    return spawnUnit(w, "trooper", f, p.x, p.y);
  });
  const mutators = (opts.mutators ?? []).filter((m) => !mapBansMutator(def, m));
  if (mutators.length)
    applyMutators(w, mutators);
  const skirmish = !opts.survival && !opts.op;
  if (skirmish)
    applyMapRules(w, def);
  if (rulesOf(w).islands) {
    const tile = (x, y) => [x + (hs >> 1), y + (hs >> 1)];
    w.rules.homeTiles = { blue: tile(hx, hy), red: tile(rx, ry) };
  }
  if (skirmish && rulesOf(w).nomads)
    nomadStart(w);
  const armada = skirmish && !!rulesOf(w).armada;
  if (armada)
    armadaStart(w);
  const starters = armada ? [] : squads;
  for (const u of starters)
    applySpawnRank(w, u);
  const extra = rulesOf(w).startUnits;
  if (extra.length)
    for (const u of starters) {
      const ids = spawnStartUnits(w, u.faction, extra, u);
      const condor = ids.map((id2) => w.units.get(id2)).find((c) => c.kind === "condor");
      if (condor && skirmish && def.startUnits?.includes("condor")) {
        condor.free = true;
        if (def.squadAboard)
          stowAboard(w, condor, u);
      }
    }
  if (skirmish && def.lifeline)
    setupLifeline(w);
  if (skirmish) {
    for (const f of ["blue", "red"]) {
      const o = opts.openers?.[f];
      if (o && !armada)
        applyOpener(w, f, o);
    }
    if (opts.objectives)
      setupObjectives(w, def.uplinks, def.dropSites);
  }
  if (opts.survival)
    setupSurvival(w, opts.survival);
  if (opts.op)
    setupOp(w, opts.op);
  return w;
}
function setupFourCorners(w, def, opts) {
  const S = def.size;
  const [hx, hy] = def.hq;
  const hs = BUILDINGS.hq.size;
  const turned = (f, x, y) => turnPoint(QUARTER[f], S, S, x, y);
  for (const f of FACTIONS) {
    const [tx, ty] = turnTile(QUARTER[f], S, S, hx, hy, hs);
    spawnBuilding(w, "hq", f, tx, ty);
  }
  for (const f of FACTIONS) {
    const p = turned(f, hx + hs + 1.5, hy + 1.5);
    spawnUnit(w, "harvester", f, p.x, p.y);
  }
  const squads = FACTIONS.map((f) => {
    const at = turned(f, hx - 1.5, hy + 1.5);
    const p = dropPoint(w, f, at.x, at.y) ?? at;
    return spawnUnit(w, "trooper", f, p.x, p.y);
  });
  const mutators = (opts.mutators ?? []).filter((m) => !mapBansMutator(def, m));
  if (mutators.length)
    applyMutators(w, mutators);
  applyMapRules(w, def);
  if (rulesOf(w).nomads)
    nomadStart(w);
  const armada = !!rulesOf(w).armada;
  if (armada)
    armadaStart(w);
  const starters = armada ? [] : squads;
  for (const u of starters)
    applySpawnRank(w, u);
  const extra = rulesOf(w).startUnits;
  if (extra.length)
    for (const u of starters)
      spawnStartUnits(w, u.faction, extra, u);
  for (const f of FACTIONS) {
    const o = opts.openers?.[f];
    if (o && !armada)
      applyOpener(w, f, o);
  }
  if (opts.objectives)
    setupObjectives(w, def.uplinks, def.dropSites);
  return w;
}
function applyMapRules(w, def) {
  if (!def.startUnits?.length && def.hqTrickle === undefined && !def.lifeline && !def.islands)
    return;
  const r = w.rules ? { ...w.rules } : makeRules([]);
  w.rules = r;
  const extra = r.armada ? [] : (def.startUnits ?? []).filter((k) => !bannedBy(w, k));
  r.startUnits = [...r.startUnits, ...extra.filter((k) => !r.startUnits.includes(k))];
  if (def.hqTrickle !== undefined)
    r.hqTrickle = def.hqTrickle;
  if (def.lifeline && !bannedBy(w, "condor"))
    r.lifeline = true;
  if (def.islands)
    r.islands = true;
}
function clearBase(w, def) {
  const [hx, hy] = def.hq;
  const cx = hx + 1.5;
  const cy = hy + 1.5;
  const keep = new Set([4 /* Road */, 2 /* Scrap */, 7 /* Crystal */]);
  for (let ty = 0;ty < w.height; ty++)
    for (let tx = 0;tx < w.width; tx++) {
      const d = hypot(tx + 0.5 - cx, ty + 0.5 - cy);
      if (d > 5.2)
        continue;
      const copies = def.players === 4 ? [0, 1, 2, 3].map((q) => turnTile(q, w.width, w.height, tx, ty)) : [
        [tx, ty],
        [w.width - 1 - tx, w.height - 1 - ty]
      ];
      for (const [x, y] of copies)
        if (!keep.has(terrainAt(w, x, y)))
          setTerrain(w, x, y, 0 /* Ground */);
    }
}

// src/sim/mapgen.ts
var RANDOM_MAP_SIZE = 108;
var RANDOM_PREFIX = "random-";
var BIOMES = ["temperate", "desert", "arctic", "volcanic", "tropical"];
var seedCode = (seed) => (seed >>> 0).toString(36);
function seedFromText(text) {
  const t = text.trim().toLowerCase();
  if (/^[0-9a-z]{1,6}$/.test(t))
    return parseInt(t, 36) >>> 0;
  const v = /^[0-9a-z]{7}$/.test(t) ? parseInt(t, 36) : NaN;
  return v <= 4294967295 && seedCode(v) === t ? v >>> 0 : saltOf(t) >>> 0;
}
var randomMapId = (biome, seed) => `${RANDOM_PREFIX}${biome}-${seedCode(seed)}`;
var ID_RE = /^random-(temperate|desert|arctic|volcanic|tropical)-([0-9a-z]{1,7})$/;
function parseRandomMapId(id) {
  const m = ID_RE.exec(id);
  if (!m)
    return null;
  const v = parseInt(m[2], 36);
  if (!(v <= 4294967295) || seedCode(v) !== m[2])
    return null;
  return { biome: m[1], seed: v >>> 0 };
}
var isRandomMapId = (id) => id.startsWith(RANDOM_PREFIX);
var cache = new Map;
function randomMapDef(id) {
  const hit = cache.get(id);
  if (hit)
    return hit;
  const p = parseRandomMapId(id);
  if (!p)
    return null;
  const def = generate(p.biome, p.seed);
  if (cache.size > 32)
    cache.delete(cache.keys().next().value);
  cache.set(id, def);
  return def;
}
function rollRandomMapId(biome, rnd = Math.random) {
  const b = biome ?? BIOMES[Math.floor(rnd() * BIOMES.length) % BIOMES.length];
  return randomMapId(b, Math.floor(rnd() * 4294967296) >>> 0);
}
var LAYOUTS = ["crossing", "twin-rivers", "lake", "canyon", "fork", "badlands"];
var S = RANDOM_MAP_SIZE;
var C = S / 2;
var G2 = 0 /* Ground */;
var OPEN2 = [0 /* Ground */, 5 /* Rough */, 6 /* Forest */];
var WET = [3 /* Water */, 10 /* Deep */];
function stream(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var FLAVOURS = {
  temperate: {
    river: [3.6, 4.8],
    bank: 5 /* Rough */,
    bankW: 2.6,
    rim: 0,
    fords: true,
    forest: 1,
    rough: 0.6,
    rock: 0.8,
    names: ["Willow", "Bracken", "Thornfield", "Greenwater", "Meadow", "Hawthorn", "Elder", "Foxglove"],
    water: "river",
    lake: "lake",
    bridge: "stone"
  },
  desert: {
    river: [2.6, 3.4],
    bank: 6 /* Forest */,
    bankW: 1.8,
    rim: 0,
    fords: true,
    forest: 0.25,
    rough: 1.3,
    rock: 1.5,
    names: ["Dune", "Sunscorch", "Mirage", "Sandstone", "Dustwind", "Saltpan", "Sirocco", "Amber"],
    water: "wadi",
    lake: "oasis",
    bridge: "timber"
  },
  arctic: {
    river: [4, 5],
    bank: 5 /* Rough */,
    bankW: 1.4,
    rim: 2.2,
    fords: true,
    forest: 0.85,
    rough: 0.6,
    rock: 0.8,
    names: ["Glacier", "Frost", "Rime", "Whiteout", "Icefang", "Snowdrift", "Hoarfrost", "Boreal"],
    water: "icy river",
    lake: "frozen lake",
    bridge: "iron"
  },
  volcanic: {
    river: [3.4, 4.4],
    bank: 5 /* Rough */,
    bankW: 3.2,
    rim: 0,
    fords: false,
    forest: 0.3,
    rough: 0.9,
    rock: 1.6,
    names: ["Cinder", "Ash", "Magma", "Obsidian", "Brimstone", "Scorch", "Ember", "Basalt"],
    water: "lava river",
    lake: "lava lake",
    bridge: "steel"
  },
  tropical: {
    river: [4.6, 5.8],
    bank: 6 /* Forest */,
    bankW: 2.4,
    rim: 1.3,
    fords: true,
    forest: 1.7,
    rough: 0.4,
    rock: 0.6,
    names: ["Mangrove", "Jade", "Monsoon", "Lagoon", "Coral", "Orchid", "Parrot", "Banyan"],
    water: "jungle river",
    lake: "lagoon",
    bridge: "timber"
  }
};
var NOUNS = {
  crossing: ["Crossing", "Divide", "Run", "Reach"],
  "twin-rivers": ["Twins", "Moats", "Sisters", "Rings"],
  lake: ["Basin", "Mere", "Hollow", "Bowl"],
  canyon: ["Canyon", "Gorge", "Rift", "Spine"],
  fork: ["Fork", "Delta", "Branches", "Split"],
  badlands: ["Badlands", "Wastes", "Mesas", "Breaks"]
};
var an = (s) => `${/^[aeiou]/.test(s) ? "an" : "a"} ${s}`;
var cap = (s) => s[0].toUpperCase() + s.slice(1);
var numWord = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"][n] ?? String(n);
function curve(ctrl, amp, seed) {
  const P2 = (i) => ctrl[Math.max(0, Math.min(ctrl.length - 1, i))];
  const pts = [];
  for (let i = 0;i < ctrl.length - 1; i++) {
    const [p0, p1, p2, p3] = [P2(i - 1), P2(i), P2(i + 1), P2(i + 2)];
    const n = Math.max(2, Math.ceil(hypot(p2[0] - p1[0], p2[1] - p1[1]) / 1.5));
    for (let s = 0;s < n; s++) {
      const t = s / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(P2(ctrl.length - 1));
  let total = 0;
  const along = pts.map((p, i) => total += i ? hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0);
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const l = hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const env = Math.min(1, along[i] / 10, (total - along[i]) / 10);
    const off = ((valueNoise(along[i] / 13, 0.5, seed) - 0.5) * 2 + (valueNoise(along[i] / 5, 9.5, seed) - 0.5) * 0.5) * amp * env;
    return [p[0] - (b[1] - a[1]) / l * off, p[1] + (b[0] - a[0]) / l * off];
  });
}
function tangent(pts, i) {
  const a = pts[Math.max(0, i - 3)];
  const b = pts[Math.min(pts.length - 1, i + 3)];
  const l = hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
}
var passable2 = (t) => TERRAIN[t].ground;
function flood(g, from) {
  const d = new Int32Array(g.length).fill(-1);
  if (!passable2(g[from]))
    return d;
  const q = new Int32Array(g.length);
  let h = 0;
  let n = 0;
  q[n++] = from;
  d[from] = 0;
  while (h < n) {
    const i = q[h++];
    const x = i % S;
    const y = i / S | 0;
    for (const j of [x > 0 ? i - 1 : -1, x < S - 1 ? i + 1 : -1, y > 0 ? i - S : -1, y < S - 1 ? i + S : -1])
      if (j >= 0 && d[j] < 0 && passable2(g[j])) {
        d[j] = d[i] + 1;
        q[n++] = j;
      }
  }
  return d;
}
function generate(biome, seed) {
  const top = stream(hash32(seed, saltOf("map")));
  const layout = LAYOUTS[Math.floor(top() * LAYOUTS.length)];
  const fl = FLAVOURS[biome];
  const name = `${fl.names[Math.floor(top() * fl.names.length)]} ${NOUNS[layout][Math.floor(top() * 4)]}`;
  const hq = [12 + Math.floor(top() * 7), 84 + Math.floor(top() * 7)];
  const def = {
    id: randomMapId(biome, seed),
    name,
    biome,
    size: S,
    blurb: "",
    hq,
    seed,
    uplinks: [],
    dropSites: [],
    starSecs: 720,
    paint() {}
  };
  let g = null;
  for (let attempt = 0;attempt < 12 && !g?.ok; attempt++)
    g = grow(def, layout, hash32(seed, attempt, saltOf("try")), false);
  if (!g?.ok)
    g = grow(def, layout, hash32(seed, saltOf("last resort")), true);
  def.uplinks = g.uplinks;
  def.dropSites = g.dropSites;
  def.blurb = blurbOf(layout, fl, g.facts);
  def.random = { seed, code: seedCode(seed), layout, terrain: g.w.terrain.slice() };
  return def;
}
var LEADS = {
  crossing: (f) => `${cap(an(f.water))} cuts the map in two`,
  "twin-rivers": (f) => `Twin ${f.water}s moat each base off a central heartland`,
  lake: (f) => `${cap(an(f.lake))} fills the centre and drains to the corners`,
  canyon: () => `A rock spine splits the field, a stream at its foot`,
  fork: (f) => `${cap(an(f.water))} forks round two cut-off pockets`,
  badlands: (f) => `Mesas break the plain, ${an(f.water)} winds between`
};
function blurbOf(layout, fl, f) {
  const fords = f.fords ? `, ${numWord(f.fords)} ford${f.fords > 1 ? "s" : ""}` : "";
  return `${LEADS[layout](fl)}: ${numWord(f.bridges)} ${fl.bridge} bridge${f.bridges === 1 ? "" : "s"}${fords}${f.extra}; crystals ${f.crystals}.`;
}
function grow(def, layout, sub, force) {
  const fl = FLAVOURS[def.biome];
  const w = createWorld(S, S);
  const p = new Painter(w, sub);
  const rnd = stream(sub);
  const r = (a, b) => a + rnd() * (b - a);
  const hs = BUILDINGS.hq.size;
  const [hx, hy] = def.hq;
  const bc = [hx + hs / 2, hy + hs / 2];
  const rc = [S - bc[0], S - bc[1]];
  const fromBase = (x, y) => Math.min(hypot(x - bc[0], y - bc[1]), hypot(x - rc[0], y - rc[1]));
  const rivers = [];
  const ponds = [];
  const rw = () => r(fl.river[0], fl.river[1]);
  const facts = { bridges: 0, fords: 0, crystals: "", extra: "" };
  let lakeR = 0;
  let spine = null;
  const passes = [];
  switch (layout) {
    case "crossing": {
      const e = rnd() < 0.5 ? [r(10, 42), -3] : [-3, r(10, 42)];
      rivers.push({ pts: curve([e, [(e[0] + C) / 2 + r(-6, 6), (e[1] + C) / 2 + r(-6, 6)], [C, C]], r(4, 8), sub), w: rw() + 0.6, bridges: 2, centre: rnd() < 0.6 });
      break;
    }
    case "twin-rivers": {
      const R = r(33, 38);
      const ctrl = [[-3, bc[1] - R + r(-3, 2)]];
      for (let a = -95;a <= 5; a += 25) {
        const rr = R + r(-3, 3);
        ctrl.push([bc[0] + rr * cos(a * Math.PI / 180), bc[1] + rr * sin(a * Math.PI / 180)]);
      }
      ctrl.push([bc[0] + R + r(-2, 3), S + 3]);
      rivers.push({ pts: curve(ctrl, r(2, 4), sub), w: rw() - 0.4, bridges: 3, centre: false });
      ponds.push([C, C, r(2.5, 4)]);
      break;
    }
    case "lake": {
      lakeR = r(9, 12.5);
      p.blob(C, C, lakeR, 3 /* Water */, 0.22);
      const e = rnd() < 0.5 ? [r(6, 30), -3] : [-3, r(6, 30)];
      rivers.push({ pts: curve([e, [C - lakeR * 0.7, C - lakeR * 0.7]], r(3, 6), sub), w: rw() - 0.3, bridges: 2, centre: false });
      break;
    }
    case "canyon": {
      spine = curve([[-3, -3], [r(20, 30), r(20, 30)], [C, C]], r(4, 7), sub);
      const sw = r(3, 4.2);
      p.stroke(spine, sw + 4, 5 /* Rough */, 0.4, [G2]);
      p.stroke(spine, sw, 1 /* Rock */, 0.35);
      const at2 = rnd() < 0.5 ? [0.45] : [0.3, 0.68];
      if (rnd() < 0.6 || at2.length === 1)
        passes.push([C, C]);
      for (const f of at2)
        passes.push(spine[Math.floor(f * (spine.length - 1))]);
      const foot = spine[Math.floor(r(0.35, 0.6) * (spine.length - 1))];
      rivers.push({ pts: curve([[-3, r(36, 52)], [foot[0] - 2, foot[1] + 3]], r(3, 5), sub), w: rw() * 0.7, bridges: 2, centre: false });
      break;
    }
    case "fork": {
      const F = [r(24, 34), r(24, 34)];
      rivers.push({ pts: curve([[-3, r(22, 40)], F], r(2, 4), sub), w: rw(), bridges: 1, centre: false });
      rivers.push({ pts: curve([F, [C, C]], r(3, 6), sub + 1), w: rw(), bridges: 1, centre: rnd() < 0.5 });
      rivers.push({ pts: curve([F, [r(36, 56), -3]], r(2, 4), sub + 2), w: rw() * 0.85, bridges: 1, centre: false });
      break;
    }
    case "badlands": {
      const e = rnd() < 0.5 ? [r(14, 40), -3] : [-3, r(14, 40)];
      rivers.push({ pts: curve([e, [C, C]], r(6, 10), sub), w: rw() * 0.75, bridges: 2, centre: rnd() < 0.5 });
      for (let i = 0, n = 6 + Math.floor(rnd() * 4);i < n; i++) {
        const x = r(6, S - 6);
        const y = r(6, C + 10);
        const rr = r(2.4, 4.6);
        if (fromBase(x, y) < 16 + rr)
          continue;
        p.blob(x, y, rr + 2, 5 /* Rough */, 0.35, [G2]);
        p.blob(x, y, rr, 1 /* Rock */, 0.35);
      }
      break;
    }
  }
  for (const rv of rivers) {
    if (fl.bank !== null)
      p.stroke(rv.pts, rv.w + (fl.rim + fl.bankW) * 2, fl.bank, 0.4, [G2, 5 /* Rough */, 6 /* Forest */]);
    if (fl.rim)
      p.stroke(rv.pts, rv.w + fl.rim * 2, 9 /* Shallows */, 0.3, [G2, 5 /* Rough */, 6 /* Forest */]);
    p.stroke(rv.pts, rv.w, 3 /* Water */, 0.22, [G2, 5 /* Rough */, 6 /* Forest */, 9 /* Shallows */, 1 /* Rock */]);
  }
  if (layout === "canyon")
    for (const q of passes)
      p.blob(q[0], q[1], r(2.8, 3.6), G2, 0.2, [1 /* Rock */]);
  if (lakeR) {
    if (fl.rim)
      p.blob(C, C, lakeR + fl.rim + 0.6, 9 /* Shallows */, 0.22, [G2, 5 /* Rough */, 6 /* Forest */]);
    if (fl.bank !== null)
      p.blob(C, C, lakeR + fl.rim + 2.2, fl.bank, 0.3, [G2]);
    p.blob(C, C, lakeR, 3 /* Water */, 0.22);
    if (def.biome === "tropical" && lakeR > 10)
      p.blob(C, C, lakeR - 4, 10 /* Deep */, 0.15, [3 /* Water */]);
  }
  const nPonds = (def.biome === "desert" ? 2 : 1) + Math.floor(rnd() * 2);
  for (let i = 0;i < nPonds; i++)
    ponds.push([r(8, S - 8), r(8, C + 6), r(1.6, 2.8)]);
  for (const [x, y, rr] of ponds) {
    if (fromBase(x, y) < 16 + rr || lakeR && hypot(x - C, y - C) < lakeR + 8 && x !== C)
      continue;
    p.blob(x, y, rr + (def.biome === "desert" ? 2.2 : 1.6), def.biome === "desert" || def.biome === "tropical" ? 6 /* Forest */ : fl.rim ? 9 /* Shallows */ : fl.bank ?? 5 /* Rough */, 0.35, [G2, 5 /* Rough */]);
    p.blob(x, y, rr, 3 /* Water */, 0.3, [G2, 5 /* Rough */, 6 /* Forest */, 9 /* Shallows */]);
  }
  const ends = [];
  const spans = [];
  const bridgeAt = (c, dir, maxLen = 16) => {
    const q = Math.round(atan2(dir[0], -dir[1]) / (Math.PI / 4)) * (Math.PI / 4);
    const n = [Math.round(cos(q) * 1e6) / 1e6, Math.round(sin(q) * 1e6) / 1e6];
    const reach = (sg) => {
      for (let d = 0;d < maxLen; d += 0.5)
        if (!WET.includes(terrainAt(w, Math.floor(c[0] + n[0] * d * sg), Math.floor(c[1] + n[1] * d * sg))))
          return d;
      return -1;
    };
    const a = reach(1);
    const b = reach(-1);
    if (a < 0 || b < 0 || a + b < 1)
      return false;
    const A = [c[0] + n[0] * (a + 0.9), c[1] + n[1] * (a + 0.9)];
    const B = [c[0] - n[0] * (b + 0.9), c[1] - n[1] * (b + 0.9)];
    p.stroke([A, B], 2.4, 8 /* Bridge */, 0, WET);
    p.stroke([[c[0] + n[0] * (a + 3.5), c[1] + n[1] * (a + 3.5)], [c[0] - n[0] * (b + 3.5), c[1] - n[1] * (b + 3.5)]], 2.4, 4 /* Road */, 0, [...OPEN2, 9 /* Shallows */]);
    ends.push(A, B);
    spans.push([A, B], [[S - A[0], S - A[1]], [S - B[0], S - B[1]]]);
    return true;
  };
  let bridges = 0;
  for (const rv of rivers) {
    const L = rv.pts.length;
    const lo = 0.18;
    const hi = rv.centre ? 0.72 : 0.85;
    const used = [];
    for (let k = 0;k < rv.bridges; k++) {
      const f = lo + (k + 0.25 + rnd() * 0.5) / rv.bridges * (hi - lo);
      const i = Math.floor(f * (L - 1));
      const c = rv.pts[i];
      if (fromBase(c[0], c[1]) < 12 || c[0] < 3 || c[1] < 3 || c[0] > S - 3 || c[1] > S - 3)
        continue;
      if (used.some((j) => hypot(rv.pts[j][0] - c[0], rv.pts[j][1] - c[1]) < 12))
        continue;
      if (bridgeAt(c, tangent(rv.pts, i))) {
        used.push(i);
        bridges += 2;
      }
    }
    if (rv.centre && bridgeAt([C, C], tangent(rv.pts, L - 1)))
      bridges += 1;
    if (fl.fords && rnd() < 0.75) {
      const f = used.length ? used.reduce((a, b) => a + b, 0) / used.length / (L - 1) < 0.5 ? r(0.7, 0.8) : r(0.2, 0.3) : 0.5;
      const i = Math.floor(f * (L - 1));
      const c = rv.pts[i];
      const t = tangent(rv.pts, i);
      if (fromBase(c[0], c[1]) >= 12 && !used.some((j) => Math.abs(j - i) < 6)) {
        p.stroke([[c[0] - t[1] * (rv.w + 2), c[1] + t[0] * (rv.w + 2)], [c[0] + t[1] * (rv.w + 2), c[1] - t[0] * (rv.w + 2)]], 3.2, 9 /* Shallows */, 0.15, [3 /* Water */]);
        facts.fords += 2;
      }
    }
  }
  if (lakeR && rnd() < 0.55) {
    p.blob(C, C, r(2.6, 3.4), G2, 0.15, [3 /* Water */, 10 /* Deep */]);
    const a = r(0.15, 0.35) * Math.PI;
    if (bridgeAt([C + cos(a) * 3.2, C - sin(a) * 3.2], [sin(a), cos(a)], lakeR + 6))
      bridges += 2;
    facts.extra = ", a causeway to the island";
  }
  if (spine)
    facts.extra = `, ${numWord(passes.reduce((n, q) => n + (q[0] === C ? 1 : 2), 0))} passes through the rock`;
  facts.bridges = bridges;
  const nearEnd = (x, y, d) => ends.some((e) => hypot(e[0] - x, e[1] - y) < d || hypot(S - e[0] - x, S - e[1] - y) < d);
  const nRocks = Math.round((7 + rnd() * 5) * fl.rock);
  for (let i = 0;i < nRocks; i++) {
    const x = r(3, S - 3);
    const y = r(3, S - 3);
    if (fromBase(x, y) < 13 || nearEnd(x, y, 7) || hypot(x - C, y - C) < 4)
      continue;
    if (rnd() < 0.35) {
      const a = rnd() * Math.PI * 2;
      const l = r(4, 8);
      p.stroke([[x - cos(a) * l, y - sin(a) * l], [x, y], [x + cos(a) * l, y + sin(a) * l + r(-2, 2)]], r(1.5, 2.1), 1 /* Rock */, 0.3, OPEN2);
    } else {
      const rr = r(1.1, def.biome === "volcanic" ? 1.8 : 2.4);
      if (def.biome === "desert" || def.biome === "volcanic")
        p.blob(x, y, rr + 1.6, 5 /* Rough */, 0.4, [G2]);
      p.blob(x, y, rr, 1 /* Rock */, 0.4, OPEN2);
    }
  }
  const nf = hash32(sub, saltOf("woods"));
  const nr = hash32(sub, saltOf("rough"));
  const forestCut = 0.8 - 0.1 * fl.forest;
  const roughCut = 0.83 - 0.08 * fl.rough;
  for (let i = 0;i < S * S / 2; i++) {
    const x = i % S;
    const y = i / S | 0;
    if (w.terrain[i] !== G2 || fromBase(x + 0.5, y + 0.5) < 11 || nearEnd(x + 0.5, y + 0.5, 3))
      continue;
    const f = valueNoise(x * 0.09, y * 0.09, nf) * 0.7 + valueNoise(x * 0.27, y * 0.27, nf + 1) * 0.3;
    if (f > forestCut)
      p.set(x, y, 6 /* Forest */, [G2]);
    else if (valueNoise(x * 0.12, y * 0.12, nr) * 0.75 + valueNoise(x * 0.4, y * 0.4, nr + 1) * 0.25 > roughCut)
      p.set(x, y, 5 /* Rough */, [G2]);
  }
  const bTile = Math.floor(bc[1]) * S + Math.floor(bc[0]);
  const rTile = S * S - 1 - bTile;
  const clear = () => clearBase(w, def);
  clear();
  let dB = flood(w.terrain, bTile);
  if (dB[rTile] < 0) {
    if (!force)
      return { w, hq: def.hq, uplinks: [], dropSites: [], facts, ok: false };
    p.stroke([bc, [C, C]], 3, 8 /* Bridge */, 0, WET);
    p.stroke([bc, [C, C]], 3, G2, 0, [1 /* Rock */]);
    clear();
    dB = flood(w.terrain, bTile);
  }
  const dR = new Int32Array(dB.length);
  for (let i = 0;i < dB.length; i++)
    dR[i] = dB[dB.length - 1 - i];
  const D2 = dB[rTile];
  const fields = [];
  const openness = (x, y, rr) => {
    let n = 0;
    let ok2 = 0;
    for (let ty = Math.floor(y - rr);ty <= y + rr; ty++)
      for (let tx = Math.floor(x - rr);tx <= x + rr; tx++) {
        if (hypot(tx + 0.5 - x, ty + 0.5 - y) > rr)
          continue;
        n++;
        if (OPEN2.includes(terrainAt(w, tx, ty)))
          ok2++;
      }
    return n ? ok2 / n : 0;
  };
  const pick = (score) => {
    let best = null;
    let bs = -Infinity;
    for (let i = 0;i < S * S; i += 1 + Math.floor(rnd() * 3)) {
      if (dB[i] < 0 || !OPEN2.includes(w.terrain[i]))
        continue;
      const x = i % S + 0.5;
      const y = (i / S | 0) + 0.5;
      if (fields.some((f) => hypot(f[0] - x, f[1] - y) < 9 || hypot(S - f[0] - x, S - f[1] - y) < 9))
        continue;
      const s = score(x, y, i) + rnd() * 0.4;
      if (s > bs) {
        bs = s;
        best = [x, y];
      }
    }
    return best;
  };
  const field = (at2, rr, t) => {
    if (!at2)
      return;
    p.blob(at2[0], at2[1], rr, t, 0.25, OPEN2);
    fields.push(at2);
  };
  const band = (v, lo, hi) => v < lo ? (v - lo) / 4 : v > hi ? (hi - v) / 4 : 0;
  field(pick((x, y) => band(hypot(x - bc[0], y - bc[1]), 6.5, 8.5) * 3 + openness(x, y, 2.8) * 4), 2.1, 2 /* Scrap */);
  field(pick((x, y, i) => band(dB[i], 17, 30) + band(dR[i] - dB[i], 22, 999) * 2 + openness(x, y, 2.4) * 4 + (fromBase(x, y) < 13 ? -4 : 0)), 1.8, 2 /* Scrap */);
  const nContest = 1 + Math.floor(rnd() * 2);
  for (let k = 0;k < nContest; k++)
    field(pick((x, y, i) => band(dB[i], 0.3 * D2, 0.55 * D2) + band(dR[i] - dB[i], 0, 0.18 * D2) * 2 + openness(x, y, 2) * 3 + (hypot(x - C, y - C) < 7 ? -3 : 0)), r(1.5, 1.9), 2 /* Scrap */);
  const nearBridge = (x, y) => ends.reduce((m, e) => Math.min(m, hypot(e[0] - x, e[1] - y), hypot(S - e[0] - x, S - e[1] - y)), 99);
  const cOpen = openness(C, C, 2);
  if (cOpen > 0.9 && dB[Math.floor(C) * S + Math.floor(C)] >= 0 && rnd() < 0.5) {
    p.blob(C, C, 1.5, 7 /* Crystal */, 0.2, OPEN2);
    fields.push([C, C]);
    facts.crystals = "at the centre";
  }
  const nCrystal = facts.crystals ? 1 : 1 + Math.floor(rnd() * 2);
  for (let k = 0;k < nCrystal; k++)
    field(pick((x, y, i) => band(dB[i], 0.38 * D2, 0.62 * D2) + band(Math.abs(dR[i] - dB[i]), 0, 0.2 * D2) + band(nearBridge(x, y), 3, 9) * 0.8 + openness(x, y, 1.6) * 3), r(1.2, 1.5), 7 /* Crystal */);
  facts.crystals ||= ends.length ? "by the crossings" : "out in the open";
  if (facts.crystals !== "at the centre" && ends.length && fields.slice(-nCrystal).every((f) => nearBridge(f[0], f[1]) > 10))
    facts.crystals = "out in no-man's-land";
  const at = (e) => dB[Math.floor(e[1]) * S + Math.floor(e[0])] ?? -1;
  const heads = spans.map(([a, b]) => at(a) >= 0 && (at(b) < 0 || at(a) <= at(b)) ? { e: a, d: at(a) } : { e: b, d: at(b) }).filter((h) => h.d > 0).sort((a, b) => a.d - b.d || a.e[0] - b.e[0]);
  const roads = [];
  for (const h of heads) {
    if (roads.length >= 2)
      break;
    if (roads.some((q) => hypot(q[0] - h.e[0], q[1] - h.e[1]) < 10))
      continue;
    roads.push(h.e);
    let i = Math.floor(h.e[1]) * S + Math.floor(h.e[0]);
    const path = [];
    for (let guard = 0;guard < 400 && dB[i] > 2; guard++) {
      const x = i % S;
      const y = i / S | 0;
      if (guard % 4 === 0)
        path.push([x + 0.5, y + 0.5]);
      let nx = -1;
      let best = Infinity;
      for (let oy = -1;oy <= 1; oy++)
        for (let ox = -1;ox <= 1; ox++) {
          const j = (y + oy) * S + x + ox;
          if (!ox && !oy || x + ox < 0 || x + ox >= S || y + oy < 0 || y + oy >= S || dB[j] < 0 || dB[j] >= dB[i])
            continue;
          if (ox && oy && (dB[y * S + x + ox] < 0 || dB[(y + oy) * S + x] < 0))
            continue;
          const s = dB[j] * 10 + hypot(x + ox + 0.5 - bc[0], y + oy + 0.5 - bc[1]);
          if (s < best) {
            best = s;
            nx = j;
          }
        }
      if (nx < 0)
        break;
      i = nx;
    }
    path.push(bc);
    const clearRun = (a, b) => {
      const l = hypot(b[0] - a[0], b[1] - a[1]);
      for (let k = 0;k <= l * 3; k++) {
        const x = a[0] + (b[0] - a[0]) * k / (l * 3 || 1);
        const y = a[1] + (b[1] - a[1]) * k / (l * 3 || 1);
        for (const [ox, oy] of [[0, 0], [0.7, 0], [-0.7, 0], [0, 0.7], [0, -0.7]])
          if (!passable2(terrainAt(w, Math.floor(x + ox), Math.floor(y + oy))))
            return false;
      }
      return true;
    };
    const taut = [path[0]];
    for (let a = 0;a < path.length - 1; ) {
      let b = path.length - 1;
      while (b > a + 1 && !clearRun(path[a], path[b]))
        b--;
      taut.push(path[b]);
      a = b;
    }
    p.stroke(taut, 2, 4 /* Road */, 0, OPEN2);
  }
  clear();
  const g = w.terrain;
  const roomy = (x, y) => {
    for (let oy = -1;oy <= 1; oy++)
      for (let ox = -1;ox <= 1; ox++)
        if (!passable2(terrainAt(w, Math.floor(x) + ox, Math.floor(y) + oy)))
          return false;
    return true;
  };
  const spots = [];
  const spot = (score, gap) => {
    let best = null;
    let bs = -Infinity;
    for (let i = 0;i < S * S; i++) {
      if (dB[i] < 0 || dR[i] < 0 || !passable2(g[i]) || g[i] === 8 /* Bridge */)
        continue;
      const x = i % S + 0.5;
      const y = (i / S | 0) + 0.5;
      if (fromBase(x, y) < 13 || !roomy(x, y))
        continue;
      if (spots.some((q) => hypot(q[0] - x, q[1] - y) < gap || hypot(S - q[0] - x, S - q[1] - y) < gap))
        continue;
      const s = score(x, y, i) + hash32(sub, i) / 4294967296 * 0.3;
      if (s > bs) {
        bs = s;
        best = [x, y];
      }
    }
    if (best)
      spots.push(best);
    return best;
  };
  const uplinks = [];
  const ci = Math.floor(C) * S + Math.floor(C);
  if (dB[ci] >= 0 && roomy(C, C) && g[ci] !== 8 /* Bridge */ && rnd() < 0.7) {
    uplinks.push([C, C]);
    spots.push([C, C]);
  }
  const nUp = uplinks.length ? Math.floor(rnd() * 2) : 1 + Math.floor(rnd() * 2);
  for (let k = 0;k < nUp; k++) {
    const u = spot((x, y, i) => band(Math.abs(dR[i] - dB[i]), 0, 0.12 * D2) * 2 + band(hypot(x - S + x, y - S + y), 24, 999) + band(dB[i], 0.3 * D2, 0.7 * D2) - hypot(x - C, y - C) / 30, 18);
    if (u)
      uplinks.push(u);
  }
  const dropSites = [];
  for (const [lo, hi] of [[0.22, 0.34], [0.32, 0.44], [0.42, 0.52]]) {
    const d = spot((_x, _y, i) => band(dB[i], lo * D2, hi * D2) * 2 + band(dR[i] - dB[i], 0, 999), 9);
    if (d)
      dropSites.push(d);
  }
  let ok = dB[rTile] >= 0 && uplinks.length > 0 && dropSites.length === 3 && fields.length >= 4;
  const seen = new Set;
  for (let i = 0;i < g.length; i++) {
    seen.add(g[i]);
    if (g[i] !== g[g.length - 1 - i])
      ok = false;
  }
  for (const t of [3 /* Water */, 8 /* Bridge */, 1 /* Rock */, 6 /* Forest */, 2 /* Scrap */, 7 /* Crystal */, 4 /* Road */])
    if (!seen.has(t))
      ok = false;
  for (const f of fields.slice(0, 2))
    if (dB[Math.floor(f[1]) * S + Math.floor(f[0])] < 0)
      ok = false;
  return { w, hq: def.hq, uplinks, dropSites, facts, ok: ok || force };
}

// src/sim/checksum.ts
var buf = new DataView(new ArrayBuffer(8));

class Fnv {
  h = 2166136261;
  num(n) {
    buf.setFloat64(0, n);
    for (let i = 0;i < 8; i++) {
      this.h ^= buf.getUint8(i);
      this.h = Math.imul(this.h, 16777619);
    }
  }
  str(s) {
    for (let i = 0;i < s.length; i++) {
      this.h ^= s.charCodeAt(i) & 255;
      this.h = Math.imul(this.h, 16777619);
    }
  }
  hex() {
    return (this.h >>> 0).toString(16).padStart(8, "0");
  }
}
function worldHash(w) {
  const h = new Fnv;
  h.num(w.tick);
  h.num(w.nextId);
  for (const f of sidesOf(w)) {
    h.num(w.factions[f].scrap);
    h.num(w.powers.meter[f]);
    h.num(w.factions[f].pending?.remaining ?? -1);
  }
  for (const id of [...w.units.keys()].sort((a, b) => a - b)) {
    const u = w.units.get(id);
    h.num(id);
    h.str(u.kind);
    h.num(u.x);
    h.num(u.y);
    h.num(u.hp);
    h.str(u.order.type);
    h.num(u.cargo);
  }
  for (const id of [...w.buildings.keys()].sort((a, b) => a - b)) {
    const b = w.buildings.get(id);
    h.num(id);
    h.num(b.hp);
    h.num(b.queue.length);
    h.num(b.queue[0]?.remaining ?? -1);
  }
  h.num(w.projectiles.length);
  h.num(w.wrecks.length);
  for (const l of w.objectives.uplinks) {
    h.num(l.progress);
    if (l.bar !== undefined)
      h.str(l.bar ?? "-");
  }
  if (w.out)
    for (const o of w.out)
      h.str(o.faction);
  h.str(w.winner ?? "-");
  return h.hex();
}

// src/sim/sim.ts
function step2(w, commands) {
  w.fx = [];
  if (w.winner)
    return;
  const held = commands.length > 1 ? { ignored: new Map, freed: [] } : undefined;
  for (const c of commands)
    applyCommand(w, c, held);
  const spots = vehicleSpots(w);
  tickConstruction(w);
  tickProduction(w);
  tickHarvest(w);
  tickTrickle(w);
  tickPowers(w);
  const engaged = tickCombat(w);
  tickTransport(w);
  tickLift(w);
  tickMovement(w, engaged, spots);
  cleanupDeaths(w);
  tickGoliaths(w);
  tickLove(w);
  if (w.lifeline)
    tickLifeline(w);
  tickSalvage(w);
  tickObjectives(w);
  chargePowers(w);
  if (w.survival)
    tickSurvival(w);
  if (w.ops)
    tickOps(w);
  if (w.tick % FOG.intervalTicks === 0)
    tickFog(w);
  w.tick++;
}
function applyCommand(w, c, held) {
  const lifting = routeLiftCommand(w, c, held);
  if (held)
    for (const [id, order] of held.freed.splice(0))
      applyCommand(w, { ...order, unitIds: [id] });
  switch (c.type) {
    case "move":
    case "attackMove":
      for (const id of c.unitIds) {
        const u = w.units.get(id);
        if (!u || u.faction !== c.faction || lifting.has(id))
          continue;
        u.order = { type: c.type, x: c.x, y: c.y };
        u.path = null;
        u.autoTargetId = null;
        orderedToMove(w, u);
      }
      break;
    case "attack":
      for (const id of c.unitIds) {
        const u = w.units.get(id);
        if (!u || u.faction !== c.faction || lifting.has(id))
          continue;
        u.order = { type: "attack", targetId: c.targetId };
        u.path = null;
      }
      break;
    case "harvest": {
      const tx = Math.floor(c.x);
      const ty = Math.floor(c.y);
      if (tx < 0 || ty < 0 || tx >= w.width || ty >= w.height)
        break;
      if (!isResource(w, tileIndex(w, tx, ty)))
        break;
      for (const id of c.unitIds) {
        const u = w.units.get(id);
        if (!u || u.faction !== c.faction || u.kind !== "harvester" || lifting.has(id))
          continue;
        const full = u.cargo >= ECONOMY.harvesterCapacity - 0.000001;
        u.order = { type: "harvest", fieldX: tx, fieldY: ty, phase: full ? "toBase" : "toField" };
        u.path = null;
      }
      break;
    }
    case "stop":
      for (const id of c.unitIds) {
        const u = w.units.get(id);
        if (!u || u.faction !== c.faction || lifting.has(id))
          continue;
        u.order = { type: "idle" };
        u.path = null;
        u.autoTargetId = null;
      }
      break;
    case "board":
      applyTransportCommand(w, c);
      break;
    case "unload":
      applyTransportCommand(w, { ...c, unitIds: c.unitIds.filter((id) => !lifting.has(id)) });
      break;
    case "anchor":
    case "packUp":
      applyGoliathCommand(w, c);
      break;
    case "lift":
      applyLiftCommand(w, c);
      break;
    case "callWave":
      callWaveEarly(w, c.faction);
      break;
    case "calldown":
      applyCalldown(w, c);
      break;
    case "resign":
      if (isMulti(w)) {
        if (w.winner || isOut(w, c.faction) || !sidesOf(w).includes(c.faction))
          break;
        w.fx.push({ type: "resign", faction: c.faction });
        eliminate(w, c.faction, null);
        cleanupDeaths(w);
        break;
      }
      if (!w.winner) {
        w.winner = otherSide(c.faction);
        w.resigned = c.faction;
      } else if (w.winner === c.faction) {
        w.winner = "draw";
        w.resigned = null;
      }
      w.fx.push({ type: "resign", faction: c.faction });
      break;
    default:
      applyEconomyCommand(w, c);
  }
}

export { __require, TICK_RATE, UNITS, BUILDINGS, TERRAIN, LIFELINE, ECONOMY, INFANTRY, SALVAGE, POWERS, OBJECTIVES, GOLIATH, GROUND_COMBAT, MUTATORS, MUTATOR_IDS, isMutatorId, mutatorsCompatible, toggleMutator, makeRules, rulesOf, goliathBase, isMutated, incomeOf, bannedBy, strategyFits, hypot, FACTIONS, DUO, isFaction, sidesOf, isMulti, perSide, rivalsOf, otherSide, tileIndex, inBounds, terrainAt, isResource, buildingAtTile, moveClassOf, regionAt, onHomeLand, domainOf, buildingCenter, distToBuilding, hqOf, hasBuilding, isVisible, isExplored, tickFog, hash32, saltOf, POWER_KINDS, POWER_NAMES, powerCost, isStunned, powerStatus, powerBlocker, targetBlocker, podCrew, liftedBy, canCarry, liftBlocker, carrierOf, freeSeats, isLoaded, engageable, sidesLeft, isInfantry, squadSize, squadAlive, isTransport, unitSeenBy, CRATE_NAMES, uplinkPay, dropLandTick, uplinkBar, canWalk, isAnchored, goliathsOf, anchoredGoliaths, unitCost, weaponReady, goliathReach, goliathReachAt, anchorBlocker, modeProgress, inGoliathRing, overlapsGoliath, buildingBlocker, unitBlocker, canPlaceBuilding, inBaseRange, paidFor, producersOf, queuesOf, producerCap, nearestReachableResource, THEME_COUNTERS, wavesSurvived, survivalStatus, STRATEGIES, DIFFICULTY, createAiState, tickAi, OPENERS2 as OPENERS, OPENER_IDS, isOpenerId, pickAiOpener, openerBlocked, allowedOpener, applyOpener, predictOpenerSite, isAchieveGoal, OPS, opById, opIndex, nextOp, opsUnlocked, opAiState, fmtClock, goalText, objectiveLine, opStatus, RANDOM_MAP_SIZE, RANDOM_PREFIX, BIOMES, seedCode, seedFromText, randomMapId, parseRandomMapId, isRandomMapId, rollRandomMapId, mapBansMutator, MAPS, mapById, isKnownMapId, createMapWorld, step2 as step, worldHash };

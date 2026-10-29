// Lamp builds this from src/ before every build and look: change src/, never this folder.

// src/game/side-style.ts
var SIDE_NAME = { blue: "Blue", red: "Red", green: "Green", purple: "Purple" };
var SIDE_CSS = { blue: "#7ec1ff", red: "#ff8a7a", green: "#86eea0", purple: "#c9a2ff" };
var iconUrl = (kind, f) => `assets/icons/${f === "blue" ? "" : `${f}/`}${kind}.webp`;

export { SIDE_NAME, SIDE_CSS, iconUrl };

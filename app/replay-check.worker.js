// Lamp builds this from src/ before every build and look: change src/, never this folder.
import {
  replay
} from "./chunk-4vzq7e5n.js";
import"./chunk-t4trhs59.js";

// src/game/replay-check.worker.ts
self.onmessage = (e) => self.postMessage(replay(e.data).divergedAt);

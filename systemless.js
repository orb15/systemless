import SystemlessFigureSheet from "./js/actors/figure.js";
import SystemlessGearItemSheet from "./js/items/gear.js";
import SystemlessFeatureItemSheet from "./js/items/feature.js";
import { preloadHandlebarsTemplates } from "./js/template-partials.js";
import { SYSTEMLESS } from "./config.js";

// Constants for clarity
const CORE = "core";
const SYSTEMLESS_NS = "systemless";

// -----------------------------
// Hooks - Initialization
// -----------------------------

Hooks.once("init", async function () {
  console.log("Systemless | Starting initialization...");

  // Register system-specific CONFIG
  CONFIG.SYSTEMLESS = SYSTEMLESS;

  // ================================
  // Actor and Item Sheet Registration
  // ================================

  console.log("Systemless | Registering custom sheets...");

  // Unregister default sheets
  Actors.unregisterSheet(CORE, ActorSheet);
  Items.unregisterSheet(CORE, ItemSheet);

  // Register Systemless Actor sheet
  Actors.registerSheet(SYSTEMLESS_NS, SystemlessFigureSheet, {
    types: ["figure"],
    makeDefault: true,
  });

  // Register Systemless Item sheets
  Items.registerSheet(SYSTEMLESS_NS, SystemlessGearItemSheet, {
    types: ["gear"],
    makeDefault: true,
  });

  Items.registerSheet(SYSTEMLESS_NS, SystemlessFeatureItemSheet, {
    types: ["feature"],
    makeDefault: true,
  });

  console.log("Systemless | Finished sheet registration.");

  // ================================
  // Preloading Handlebars Templates
  // ================================
  try {
    await preloadHandlebarsTemplates();
    console.log("Systemless | Templates preloaded successfully.");
  } catch (error) {
    console.error("Systemless | Error preloading templates:", error);
  }

  console.log("Systemless | Initialization complete.");
});


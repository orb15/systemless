import SystemlessFigureSheet from "./js/actors/figure.js";
import SystemlessGearItemSheet from "./js/items/gear.js";
import SystemlessFeatureItemSheet from "./js/items/feature.js";
import {preloadHandlebarsTemplates} from "./js/template-partials.js";
import {SYSTEMLESS} from "./config.js";

// -----------------------------
// Hooks - Initialization
// -----------------------------

Hooks.once("init", function() {

  console.log("Systemless | Begin Initialization");

  // ================================
  //  Register Systemless-specific CONFIG
  // ================================
  CONFIG.SYSTEMLESS = SYSTEMLESS;

  // ================================
  //  Register Sheets
  // ================================
  
  ////unregister the base actor sheet
  Actors.unregisterSheet("core", ActorSheet);

  //register each Systemless Actor sheet
  Actors.registerSheet("systemless", SystemlessFigureSheet, {
    types: ["figure"],
    makeDefault: true,
  });

    //unregister the base item sheet
    Items.unregisterSheet("core", ItemSheet);

    //register each Systemless Item sheet
    Items.registerSheet("systemless", SystemlessGearItemSheet, {
      types: ["gear"],
      makeDefault: true,
    });
    Items.registerSheet("systemless", SystemlessFeatureItemSheet, {
      types: ["feature"],
      makeDefault: true,
    });

  // ================================
  //  Post-Init Logging
  // ================================
  console.log("Systemless | Initialization Complete");

  // ================================
  //  Preload Handlebars Templates
  // ================================
  return preloadHandlebarsTemplates();

});

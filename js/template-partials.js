
//preload template partials
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor Sheet Partials
    "systems/systemless2/templates/actors/parts/notes-partial.hbs",
    "systems/systemless2/templates/actors/parts/inventory-partial.hbs",
    "systems/systemless2/templates/actors/parts/inventory-simple-partial.hbs",
    "systems/systemless2/templates/actors/parts/features-partial.hbs",
    "systems/systemless2/templates/actors/parts/features-simple-partial.hbs",

    // Item Sheet Partials
  ]);
};
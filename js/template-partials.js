
//preload template partials
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor Sheet Partials
    "systems/systemless/templates/actors/parts/notes-partial.hbs",
    "systems/systemless/templates/actors/parts/inventory-partial.hbs",
    "systems/systemless/templates/actors/parts/inventory-simple-partial.hbs",
    "systems/systemless/templates/actors/parts/features-partial.hbs",
    "systems/systemless/templates/actors/parts/features-simple-partial.hbs",

    // Item Sheet Partials
  ]);
};
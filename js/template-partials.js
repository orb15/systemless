
//preload template partials
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor Sheet Partials
    "systems/systemless2/templates/actors/parts/notes-partial.hbs",

    // Item Sheet Partials
  ]);
};
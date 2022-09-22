
// This class provides a Systemless-specific character sheet
export default class SystemlessFigureSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  /* -------------------------------------------------------------
    Overrides and Core Methods
  ----------------------------------------------------------------*/

  //Configure some defaults specific to all sheets
  //@override ActorSheet
  static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["systemless", "sheet", "actor", "figure"],
      width: 720,
      height: 680,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "core"}]
    });
  }

  //Returns data to the template (character sheet HTML and CSS) for rendering
  //@Override Application
  getData(options) {

    //get base data for actor and load it into a 'context' - a construct for holding all
    //needed info for the template
    const context = super.getData(options);

    //obtain the base actor (for access to anything  on the actor object)
    const actor = context.actor;

    //add the SYSTEMLESS config to make building select boxes easy
    const config = CONFIG.SYSTEMLESS;

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: actor.system, //this is the data from the template!
      source: actor, //this is data common to all actors in FVTT (name, id, img...)
      config: config,
    });

    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself, so it is source.img and not context.source.img in
    //the template!
    return context;
  }

  //returns the path to the HTML-based character sheet.
  //@Override LoserMonsterSheetBase
  get template(){
    return "systems/systemless2/templates/actors/figure.hbs";
  }

  /* -------------------------------------------------------------
   Utility and Helpers
  ----------------------------------------------------------------*/

}
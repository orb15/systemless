import SystemlessItemSheetBase from "./base.js";

// This class provides core functionality for the Armor Item Sheet
export default class SystemlessFeatureItemSheet extends SystemlessItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("feature");
    options.height = 430;
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base context - everything needed to render any item
    const context = await super.getData(options);
       
    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself. So to display gear weight, handlebars needs to 
    //refer to system.weight and not context.system.weight
    return context;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/systemless2/templates/items/feature.hbs";
  }
}
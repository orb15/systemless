// This class provides core functionality for the all Item Sheets
export default class SystemlessItemSheetBase extends ItemSheet {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override ItemSheet
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 600,
      height: 400,
      classes: ["systemless", "sheet", "item"],
      resizable: true,
    });
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override Application
  async getData(options) {
    
    //get base data for item and load it into a 'context' - a construct for holding all
    //needed info for the template
    const context = super.getData(options);

    //obtain the base item (for access to item.img and item.name and anything else on the item object)
    const item = context.item;

    //add the Systemless config to make building select boxes easy
    const config = CONFIG.SYSTEMLESS;

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: item.system, //this is the data from the template!
      source: item, //this is the data that belongs to all Items within FVTT like name, image, id...
      config: config
    });

    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself. So to display gear weight, handlebars needs to 
    //refer to system.weight and not context.system.weight
    return context;
  }
}
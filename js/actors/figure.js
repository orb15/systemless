
// This class provides a Systemless-specific character sheet
export default class SystemlessFigureSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
    this.MAX_ITEM_WEIGHT = 1000;
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

    //organize items into an inventory
    const inventory = this._prepareInventory(actor.items);

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: actor.system, //this is the data from the template!
      source: actor, //this is data common to all actors in FVTT (name, id, img...)
      config: config,
      inventory: inventory
    });

    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself, so it is source.img and not context.source.img in
    //the template!
    return context;
  }

    //Establish listeners for events on the character sheet
  //@Override Application
  activateListeners(html) {
    
    //Inventory
    html.find(".event-item-edit").click(this._onItemEdit.bind(this));
    html.find(".event-item-delete").click(this._onItemDelete.bind(this));
    html.find(".event-item-img").click(this._onShowItem.bind(this));

    //establish default listeners
    super.activateListeners(html);
  }

  //returns the path to the HTML-based character sheet.
  //@Override LoserMonsterSheetBase
  get template(){
    return "systems/systemless2/templates/actors/figure.hbs";
  }

  /* -------------------------------------------------------------
    EventHandlers
  ----------------------------------------------------------------*/

  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    return item.sheet.render(true);
  }

  _onItemDelete(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    if ( item ) return item.delete();
  }

  _onShowItem(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    
    const theName = item.name;
    let description = "";
    const image = item.img;
    let msgContent = "";

    if(event.ctrlKey) {
      description = item.system.description;
      msgContent = theName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;"><br>` + description;
    } else {
      msgContent = theName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;">`;
    }

    this._displayGeneralChatMessage(msgContent);
  }

  /* -------------------------------------------------------------
   Utility and Helpers
  ----------------------------------------------------------------*/
  _prepareInventory(allItems) {

    //prepare an organized inventory
    const inventory = {
      "meta": {

        "totalWeight": 0,

        "hasAnyInventory": false,
        "usesSimpleInventory": false,
        "hasAnyCategories": false,
        "hasNumericWeight": false,

        "hasArmor": false,
        "hasArmorWeight": false,
        "hasEquipment": false,
        "hasEquipmentWeight": false,
        "hasTreasure": false,
        "hasTreasureWeight": false,
        "hasWeapon": false,
        "hasWeaponWeight": false,
        "hasOther": false,
        "hasOtherWeight": false
      },
      
      "armor": {"weight": 0,"items": [],"type": "armor"},
      "equipment": {"weight": 0,"items": [],"type": "equipment"},
      "treasure": {"weight": 0,"items": [],"type": "treasure"},
      "weapon": {"weight": 0,"items": [],"type": "weapon"},
      "other": {"weight": 0,"items": [],"type": "other"},
    };

    allItems.map(item => {

      //if we enter this code, we have at least 1 item
      inventory.meta.hasAnyInventory = true;

      //get basic weight info about an item (if any) and determine
      //if that weight is unset/zero, a string ("heavy") or a number of some kind
      //set some flags so we can properly sum weights wherever numerics are
      //encountered
      var usesNumericWeight = false;
      var weightInfo = this._calcWeight(item);
      item.actWeight = weightInfo.weight;
      
      switch(weightInfo.weightType) {
        case "stringVal":
          item.usesWeight = true;
          break;
        case "zeroVal":
          item.usesWeight = false;
          break;
        case "numVal":
          item.usesWeight = true;
          usesNumericWeight = true;
          inventory.meta.hasNumericWeight = true;
          break;
      }

      //do some category-specific summing of numeric weights
      //and set per-category flags
      switch(item.system.category) {
        case "armor":
          inventory.armor.items.push(item);
          inventory.meta.hasArmor = true;
          inventory.meta.hasAnyCategories = true;     
          if (usesNumericWeight) {
            inventory.armor.weight += item.actWeight;
            inventory.meta.hasArmorWeight = true;
          }
          break;
        case "equipment":
          inventory.equipment.items.push(item);
          inventory.meta.hasEquipment = true;
          inventory.meta.hasAnyCategories = true;     
          if (usesNumericWeight) {
            inventory.equipment.weight += item.actWeight;
            inventory.meta.hasEquipmentWeight = true;
          }
          break;
        case "treasure":
          inventory.treasure.items.push(item);
          inventory.meta.hasTreasure = true;
          inventory.meta.hasAnyCategories = true;     
          if (usesNumericWeight) {
            inventory.treasure.weight += item.actWeight;
            inventory.meta.hasTreasureWeight = true;
          }
          break;
        case "weapon":
          inventory.weapon.items.push(item);
          inventory.meta.hasWeapon = true;
          inventory.meta.hasAnyCategories = true;     
          if (usesNumericWeight) {
            inventory.weapon.weight += item.actWeight;
            inventory.meta.hasWeaponWeight = true;
          }
          break;
        default:
          inventory.other.items.push(item);
          inventory.meta.hasOther = true;   
          if (usesNumericWeight) {
            inventory.other.weight += item.actWeight;
            inventory.meta.hasOtherWeight = true;
          }
          break;
      }
    });

    //determine if we are using "simple inventory". Simple inventory is where there are no 
    //categories set on ANY items, implying the user just wants a list of things they are
    //carrying without anything fancy
    if (inventory.meta.hasOther && !inventory.meta.hasAnyCategories) {
      inventory.meta.usesSimpleInventory = true;
    }

    //calc total weight
    inventory.meta.totalWeight = inventory.armor.weight + inventory.equipment.weight + 
      inventory.treasure.weight + inventory.weapon.weight + inventory.other.weight;

    //sort inventory
    inventory.armor.items.sort(this._inventorySorter)
    inventory.equipment.items.sort(this._inventorySorter)
    inventory.treasure.items.sort(this._inventorySorter)
    inventory.weapon.items.sort(this._inventorySorter)
    inventory.other.items.sort(this._inventorySorter)
    
    return inventory;

  }

  //sort inventory by name only for now
  _inventorySorter(i, j) {
    return i.name <= j.name;
  }

  _calcWeight(item) {
    const givenWeight = item.system.weight;

    //givenWeight might be text not a number - and that is ok :)
    if(isNaN(givenWeight)) {
      return {"weight": givenWeight, "weightType": "stringVal"};
    }

    //gimme the number - might be a float!
    const numericWeight = Number(givenWeight);

    //bounds limiting
    if(numericWeight <= 0) {
      return {"weight": 0, "weightType": "zeroVal"};
    }
    if(numericWeight > this.MAX_ITEM_WEIGHT) {
      return {"weight": this.MAX_ITEM_WEIGHT, "weightType": "numVal"};
    }

    return {"weight": numericWeight, "weightType": "numVal"};
  }

    //displays a generic chat message
  _displayGeneralChatMessage(msg) {

    msg = this.actor.name + ": " + msg;
    const chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.IC,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: msg};
  
    ChatMessage.create(chatData, {});
  }
}

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

    //organize items into a feature list
    const features = this._prepareFeatures(actor.items);

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: actor.system, //this is the data from the template!
      source: actor, //this is data common to all actors in FVTT (name, id, img...)
      config: config,
      inventory: inventory,
      features: features
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
    return "systems/systemless/templates/actors/figure.hbs";
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

    //index through all items on this figure, but only do so if the item
    //is of type "gear" as only "gear" should appear in inventory
    allItems.filter(item => {
      if (item.type === "gear") {
        return true;
      }
      return false;
    })
    .map(item => {


      if (item.type != "gear") {

      }

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
    inventory.armor.items.sort(this._nameOnlySorter)
    inventory.equipment.items.sort(this._nameOnlySorter)
    inventory.treasure.items.sort(this._nameOnlySorter)
    inventory.weapon.items.sort(this._nameOnlySorter)
    inventory.other.items.sort(this._nameOnlySorter)
    
    return inventory;

  }

  //sort inventory by name only for now
  _nameOnlySorter(i, j) {
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

  _prepareFeatures(allItems) {

    //prepare an organized feature list
    const features = {
      "meta": {

        "hasAnyFeatures": false,
        "usesSimpleFeatures": false,
        "hasAnyCategories": false,

        "hasAbility": false,
        "hasAsset": false,
        "hasBackground": false,
        "hasFeature": false,
        "hasHeritage": false,
        "hasLanguage": false,
        "hasMagic": false,
        "hasPet": false,
        "hasProfession": false,
        "hasSave": false,
        "hasSkill": false,
        "hasTrait": false,

        "hasOther": false,
      },
      
      "ability": {"items": [],"type": "ability"},
      "asset": {"items": [],"type": "asset"},
      "background": {"items": [],"type": "background"},
      "feature": {"items": [],"type": "feature"},
      "heritage": {"items": [],"type": "heritage"},
      "language": {"items": [],"type": "language"},
      "magic": {"items": [],"type": "magic"},
      "pet": {"items": [],"type": "pet"},
      "profession": {"items": [],"type": "profession"},
      "save": {"items": [],"type": "save"},
      "skill": {"items": [],"type": "skill"},
      "trait": {"items": [],"type": "trait"},
      "other": {"items": [],"type": "other"},
    };

    //index through all items on this figure, but only do so if the item
    //is of type "feature" as only "features" should appear in the features list
    allItems.filter(item => {
      if (item.type === "feature") {
        return true;
      }
      return false;
    }).map(item => {

      //if we enter this code, we have at least 1 item
      features.meta.hasAnyFeatures = true;

      //do some category-specific summing of numeric weights
      //and set per-category flags
      switch(item.system.category) {
        case "ability":
          features.ability.items.push(item);
          features.meta.hasAbility = true;
          features.meta.hasAnyCategories = true;
          break;
        case "asset":
          features.asset.items.push(item);
          features.meta.hasAsset = true;
          features.meta.hasAnyCategories = true;
          break;
        case "background":
          features.background.items.push(item);
          features.meta.hasBackground = true;
          features.meta.hasAnyCategories = true;
          break;
        case "feature":
          features.feature.items.push(item);
          features.meta.hasFeature = true;
          features.meta.hasAnyCategories = true;
          break;
        case "heritage":
          features.heritage.items.push(item);
          features.meta.hasHeritage = true;
          features.meta.hasAnyCategories = true;
          break;
        case "language":
          features.language.items.push(item);
          features.meta.hasLanguage = true;
          features.meta.hasAnyCategories = true;
          break;
        case "magic":
          features.magic.items.push(item);
          features.meta.hasMagic = true;
          features.meta.hasAnyCategories = true;
          break;
        case "pet":
          features.pet.items.push(item);
          features.meta.hasPet = true;
          features.meta.hasAnyCategories = true;
          break;
        case "profession":
          features.profession.items.push(item);
          features.meta.hasProfession = true;
          features.meta.hasAnyCategories = true;
          break;
        case "save":
          features.save.items.push(item);
          features.meta.hasSave = true;
          features.meta.hasAnyCategories = true;
          break;
        case "skill":
          features.skill.items.push(item);
          features.meta.hasSkill = true;
          features.meta.hasAnyCategories = true;
          break;   
        case "trait":
          features.trait.items.push(item);
          features.meta.hasTrait = true;
          features.meta.hasAnyCategories = true;
          break;  
        default:
          features.other.items.push(item);
          features.meta.hasOther = true;
          break;   
      }
    });

    //sort each category
    features.ability.items.sort(this._nameOnlySorter);
    features.asset.items.sort(this._nameOnlySorter);
    features.background.items.sort(this._nameOnlySorter);
    features.profession.items.sort(this._nameOnlySorter);
    features.feature.items.sort(this._nameOnlySorter);
    features.heritage.items.sort(this._nameOnlySorter);
    features.language.items.sort(this._nameOnlySorter);
    features.magic.items.sort(this._nameOnlySorter);
    features.pet.items.sort(this._nameOnlySorter);
    features.save.items.sort(this._nameOnlySorter);
    features.skill.items.sort(this._nameOnlySorter);
    features.trait.items.sort(this._nameOnlySorter);
    features.other.items.sort(this._nameOnlySorter);

    //determine if we are using "simple features". Simple features is where there are no 
    //categories set on ANY items, implying the user just wants a list of things about their
    //character without anything fancy
    if (features.meta.hasOther && !features.meta.hasAnyCategories) {
      features.meta.usesSimpleFeatures = true;
    }

    return features;
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
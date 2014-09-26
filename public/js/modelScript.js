function ViewModel() {
    this.menuItems = null;
    this.mainContent = ko.observable(null);
    this.setMenuItems = function(arrayMenuItems) {
        this.menuItems = arrayMenuItems.map(function(item) {
            return new MainItemSideBarObject(item);
        });
    };
    this.swapMainContent = function(newMainContent) {
        this.mainContent(getMainContentHandler(newMainContent));
    };
    this.mainMenuItemDisplayMode = function(mainMenuItem) {
        if(mainMenuItem.subContent == null) {
            return 'noContentMainItemSidebarMenuTemplate';
        } else if(mainMenuItem.isActive()) {
            return 'activeMainItemSidebarMenuTemplate';
        } else {
            return 'inactiveMainItemSidebarMenuTemplate';
        }
    };
    this.mainContentDisplayMode = function(mainContent) {
        if(mainContent == null) {
            return 'emptyTemplate';
        }
        return mainContent.displayMode;
    }
}
var viewModel = new ViewModel();

// ------------------------------------------------------------------------------------------------------
// ---------------------------------- Side Bar Related --------------------------------------------------
// ------------------------------------------------------------------------------------------------------

function SideBarObject(parent, appId, displayName) {
    this.parent = parent;
    this.displayName = displayName;
    this.appId = appId;
}

function SideBarObjectWithContent(parent, appId, displayName, subItems, mapSubItemsFunction) {
    SideBarObject.call(this, parent, appId, displayName);
    this.isActive = ko.observable(false);
    this.switchSection = function() {
        this.isActive(!this.isActive());
        // close any subSections
        if(!this.isActive()) {
            this.subContent.forEach(function(subSectionItem) {
                if(subSectionItem.isActive && subSectionItem.isActive()) {
                    subSectionItem.switchSection();
                }
            });
        }
    };
    this.subContent = (function(curObj) {
        if(subItems) {
            return subItems.map(mapSubItemsFunction(curObj));
        }
        return null;
    })(this);
}
SideBarObjectWithContent.prototype = new SideBarObject();

function ItemSideBarObject(parent, itemObj) {
    SideBarObjectWithContent.call(this,
                                  parent,
                                  itemObj.appId,
                                  itemObj.displayName,
                                  itemObj.subSections,
                                  function(curObj) {
        return function(item) {
            return new ItemSideBarObject(curObj, item);
        };
    });
    this.subSectionsDisplayMode = function(item) {
        if(item.subContent == null) {
            return 'noContentItemSidebarMenuTemplate';
        } else if(item.isActive()) {
            return 'activeItemSidebarMenuTemplate';
        } else {
            return 'inactiveItemSidebarMenuTemplate';
        }
    };
    this.scrollPageToItem = (function(curObj) {
        return function(e) {
            // get top menu item
            var curItem = curObj;
            while(curItem.parent) {
                curItem = curItem.parent;
            }
            menuHandlers.getHandler(curItem).onSelection(curObj);
        };
    })(this);
}
ItemSideBarObject.prototype = new SideBarObjectWithContent();

function MainItemSideBarObject(mainItemObj) {
    SideBarObjectWithContent.call(this,
                                  null,
                                  mainItemObj.appId,
                                  mainItemObj.displayName,
                                  mainItemObj.subSections,
                                  function(curObj) {
        return function(item) {
            return new ItemSideBarObject(curObj, item);
        };
    });
    this.subSectionsDisplayMode = function(item) {
        if(item.subContent == null) {
            return 'noContentItemSidebarMenuTemplate';
        } else if(item.isActive()) {
            return 'activeItemSidebarMenuTemplate';
        } else {
            return 'inactiveItemSidebarMenuTemplate';
        }
    }
}
MainItemSideBarObject.prototype = new SideBarObjectWithContent();


// ------------------------------------------------------------------------------------------------------
// ------------------------------ Main Content Related --------------------------------------------------
// ------------------------------------------------------------------------------------------------------

var getMainContentHandler = (function() {
    var obtainObj = {
        materialListing: function(contentObject) {
            return new MaterialMainContent(contentObject);
        }
    }
    return function(contentObject) {
        return obtainObj[contentObject.operationType](contentObject);
    };
})();

function MainContentObject(parent, appId, displayName, displayMode) {
    this.parent = parent;
    this.appId = appId;
    this.displayName = displayName;
    this.displayMode = displayMode;
}

function MainContentObjectWithSections(parent, appId, displayName, sections, displayMode) {
    MainContentObject.call(this, parent, appId, displayName, displayMode);
    this.subContent = (function(curObject) {
        if(!sections) {
            return null;
        }
        return sections.map(function(item) {
            if(item.sections) {
                return new MainContentObjectWithSections(curObject,
                                                         item.appId,
                                                         item.displayName,
                                                         item.sections,
                                                         'materialIntermediarySectionTemplate');
            } else {
                return new MaterialFinalSection(curObject, item);
            }
        });
    })(this);
    this.subContentDisplayMode = function(item) {
        return item.displayMode;
    };
}
MainContentObjectWithSections.prototype = new MainContentObject();

function MaterialMainContent(contentObject) {
    MainContentObjectWithSections.call(this,
                                       null,
                                       contentObject.appId,
                                       contentObject.displayName,
                                       contentObject.sections,
                                       'materialListingTemplate');
    this.materialType = contentObject.materialType;
}
MaterialMainContent.prototype = new MainContentObjectWithSections();

function MaterialFinalSection(parent, contentObject) {
    MainContentObject.call(this, parent, contentObject.appId, contentObject.displayName, 'materialFinalSectionTemplate');
    this.items = (function(curObj) {
        return ko.observableArray(contentObject.items.map(function(item) {
            return new MaterialItem(curObj, item);
        }).sort(materialSort));
    })(this);
    this.fullDisplayName = (function(finalSection) {
        var fullName = '';
        var cur = finalSection;
        while (cur.parent) {
            if(fullName !== '') {
                fullName = ' - ' + fullName;
            }
            fullName = cur.displayName + fullName;
            cur = cur.parent;
        }
        return fullName;
    })(this);
    this.activateAdditionForm = function() {
        activateAddMaterialForm(this);
    };
    this.addElement = (function(curObj) {
        return function(addedObject) {
            this.items.push(new MaterialItem(curObj, addedObject));
            this.items.sort(materialSort);
        };
    })();
}
MaterialFinalSection.prototype = new MainContentObject();

function MaterialItem(parent, item) {
    MainContentObject.call(this, parent, item.appId, item.displayName);
    this.salePrice = ko.observable(item.salePrice);
    this.actualStock = ko.observable(item.actualStock);
    this.minimumStock = ko.observable(item.minimumStock);
    this.activateEditForm = function() {
        activateEditMaterialForm(this);
    };
}
MaterialItem.prototype = new MainContentObject();
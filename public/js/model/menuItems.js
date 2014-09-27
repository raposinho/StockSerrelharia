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
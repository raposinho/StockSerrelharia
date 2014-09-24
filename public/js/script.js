function SideBarObject(appId, displayName) {
    this.displayName = displayName;
    this.appId = appId;
}

function SectionSideBarObject(appId, displayName) {
    SideBarObject.call(this, appId, displayName);
}
SectionSideBarObject.prototype = new SideBarObject();


function SideBarObjectWithContent(appId, displayName, subItems, mapSubItemsFunction) {
    SideBarObject.call(this, appId, displayName);
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
    this.subContent = (function() {
        if(subItems) {
            return subItems.map(mapSubItemsFunction);
        }
        return null;
    })();
}
SideBarObjectWithContent.prototype = new SideBarObject();

function ItemSideBarObject(itemObj) {
    SideBarObjectWithContent.call(this, itemObj.appId, itemObj.displayName, itemObj.subSections, function(item) {
        return new SectionSideBarObject(item.appId, item.displayName);
    });
    this.subSectionsDisplayMode = function(item) {
        return 'sectionSidebarMenuTemplate';
    };
}
ItemSideBarObject.prototype = new SideBarObjectWithContent();

function MainItemSideBarObject(mainItemObj) {
    SideBarObjectWithContent.call(this, mainItemObj.appId, mainItemObj.displayName, mainItemObj.subSections, function(item) {
        return new ItemSideBarObject(item);
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

var viewModel = {
    menuItems: null,
    mainContent: null,
    setMenuItems: function(arrayMenuItems) {
        this.menuItems = arrayMenuItems.map(function(item) {
            return new MainItemSideBarObject(item);
        });
    },
    swapMainContent: function(newMainContent) {

    },
    mainMenuItemdisplayMode: function(mainMenuItem) {
        if(mainMenuItem.subContent == null) {
            return 'noContentMainItemSidebarMenuTemplate';
        } else if(mainMenuItem.isActive()) {
            return 'activeMainItemSidebarMenuTemplate';
        } else {
            return 'inactiveMainItemSidebarMenuTemplate';
        }
    }
};

// start loading content
function loadContent(initialContent) {
    var shouldLoadMainContent = initialContent !== '/';
    var amountContentToLoad = Number(shouldLoadMainContent) + 1;

    function onContentLoaded() {
        if(--amountContentToLoad == 0) {
            ko.applyBindings(viewModel);
        }
    }

    //getMenuItems
    $.ajax({
        url: '/menuItems',
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(menuContent) {
            viewModel.setMenuItems(menuContent);
            onContentLoaded();
        }
    });

    //getMenuItems
    $.ajax({
        url: initialContent,
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(mainContent) {
            viewModel.swapMainContent(mainContent);
            onContentLoaded();
        }
    });
}

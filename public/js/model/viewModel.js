function ViewModel() {
    this.menuItems = null;
    this.mainContent = ko.observable();
    this.detailsOwnerMaterialItem = ko.observable();

    // --------------------------- change view model functions  -----------------------------------------

    this.setDetailsOwnerMaterialItem = function(item) {
        this.detailsOwnerMaterialItem(item);
    };

    this.setMenuItems = function(arrayMenuItems) {
        this.menuItems = arrayMenuItems.map(function(item) {
            return new MainItemSideBarObject(item);
        });
    };

    this.swapMainContent = function(newMainContent) {
        this.mainContent(getMainContentModelHandler(newMainContent));
    };

    // --------------------------- display related functions --------------------------------------------

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
        return mainContent == null ? 'emptyTemplate' : mainContent.displayMode;
    }
    this.detailsMaterialItemDisplayMode = function(displayItem) {
        return displayItem == null ? 'emptyTemplate' : 'materialItemDetails';
    }
}
var viewModel = new ViewModel();
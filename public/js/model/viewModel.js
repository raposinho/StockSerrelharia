function ViewModel() {
    this.menuItems = null;
    this.mainContent = ko.observable(null);
    this.setMenuItems = function(arrayMenuItems) {
        this.menuItems = arrayMenuItems.map(function(item) {
            return new MainItemSideBarObject(item);
        });
    };
    this.swapMainContent = function(newMainContent) {
        this.mainContent(getMainContentModelHandler(newMainContent));
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
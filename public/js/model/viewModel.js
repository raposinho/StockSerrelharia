var viewModel = new ViewModel();

function WarningsModel(totalWarnings) {
    this.displayName = 'Alertas';
    this.totalWarnings = ko.observable(totalWarnings);
    this.warningMenuItemClasses = ko.pureComputed(function(){
        return this.totalWarnings() > 0 ? "mainSectionSideBarObject" : "mainSectionSideBarObject warningsBackgroundActive";
    }, this);
}

function ViewModel() {
    this.menuItems = null;
    this.mainContent = ko.observable();
    this.detailsOwnerMaterialItem = ko.observable();

    // --------------------------- change view model functions  -----------------------------------------

    this.setDetailsOwnerMaterialItem = function(item) {
        this.detailsOwnerMaterialItem(item);
    };

    this.setMenuItems = function(menuItemsObj) {
        this.menuItems = {
            warnings: new WarningsModel(menuItemsObj.warnings),
            suppliers: new MainItemSideBarObject({ displayName: 'Fornecedores', subSections: menuItemsObj.suppliers }),
            materials: new MainItemSideBarObject({ displayName: 'Material', subSections: menuItemsObj.materials })
        }
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
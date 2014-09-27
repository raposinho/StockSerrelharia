function MenuSelectionHandler(onSelection) {
    this.onSelection = onSelection;
}

function MaterialSelectionHandler() {
    MenuSelectionHandler.call(this, function(selectedItem) {
        var curItem = selectedItem;
        while(curItem.parent.displayName !== 'Material') {
            curItem = curItem.parent;
        }

        // check if content ain't already being shown
        if(viewModel.mainContent() && curItem.displayName == viewModel.mainContent().materialType) {
            $('#' + selectedItem.appId).scrollView();
            return;
        }

        $.ajax({
            url: '/material/' + curItem.appId,
            type: 'GET',
            data: {
                format: 'json'
            },
            success: function(menuContent) {
                viewModel.swapMainContent(menuContent);
                $('#' + selectedItem.appId).scrollView();
            }
        });
    });
}
MaterialSelectionHandler.prototype = new MenuSelectionHandler();

function SupplierSelectionHandler(onSelection) {
    MenuSelectionHandler.call(this, null);
    this.getAllDisplayNames = function() {
        return find(viewModel.menuItems, function(item) {
            return item.displayName === 'Fornecedores';
        }).subContent.map(function(item) {
            return item.displayName;
        });
    };
}
SupplierSelectionHandler.prototype = new MenuSelectionHandler();

var menuHandlers = (function() {
    var handlersByType =  {
        'Material': new MaterialSelectionHandler(),
        'Fornecedores': new SupplierSelectionHandler()
    };
    return {
        handlers: handlersByType,
        getHandler: function(mainItemObj) {
            return handlersByType[mainItemObj.displayName];
        }
    };
})();


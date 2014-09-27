var mainContentHandlers = (function() {
    var handlersByType =  {
        'Material': new MaterialContentHandler()
    };
    return {
        handlers: handlersByType,
        getHandler: function(mainItemObj) {
            return handlersByType[mainItemObj.displayName];
        }
    };
})();

function MaterialContentHandler() {
    this.addItemToView = function(addedObject) {
        var curObj = viewModel.mainContent();

        addedObject.sectionInformation.forEach(function(item) {
            curObj = find(curObj.subContent, function(item2) {
                return item2.appId === item;
            });
        });

        curObj.addElement(addedObject);
    };
    this.applyModificationsToItemOnView = function(editedObject) {

    }
}
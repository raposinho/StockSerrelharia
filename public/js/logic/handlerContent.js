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
    this.searchRightElement = function(sectionsInformation) {
        var curObj = viewModel.mainContent();
        sectionsInformation.forEach(function(item) {
            var subContent = ko.isObservable(curObj.subContent) ? curObj.subContent() : curObj.subContent;
            curObj = find(subContent, function(item2) {
                return item2.appId === item;
            });
        });
        return curObj;
    };
    this.addItemToView = function(addedObject) {
        this.searchRightElement(addedObject.sectionInformation).addElement(addedObject);
    };
    this.applyModificationsToItemOnView = function(editedObject) {
        this.searchRightElement(editedObject.sectionInformation).editInformation(editedObject);
    };
    this.loadLatestTransactionsDetails = function(originObject) {
        $.ajax({
            url: '/material/getLatestTransactions/' + originObject.appId,
            type: 'GET',
            dataType: "json",
            success: function(latestDetails) {
                viewModel.setDetailsOwnerMaterialItem(new DetailsEntry(originObject, latestDetails));
                wholeScreenOpacity.show();
            }
        });
    };
    this.loadAllTransactionsDetails = function(detailsObject) {
        $.ajax({
            url: '/material/getAllTransactions/' + detailsObject.values.appId,
            type: 'GET',
            dataType: "json",
            success: function(allTransactions) {
                detailsObject.setAllInformation(allTransactions);
            }
        });
    };
}
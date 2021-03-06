var getMainContentModelHandler = (function() {
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
    this.subContent = (function(curObj) {
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
            this.subContent.push(new MaterialItem(curObj, addedObject));
            this.subContent.sort(materialSort);
        };
    })(this);
}
MaterialFinalSection.prototype = new MainContentObject();

function MaterialItem(parent, item) {
    MainContentObject.call(this, parent, item.appId, item.displayName);
    this.displayName = ko.observable(item.displayName);
    this.salePrice = ko.observable(item.salePrice);
    this.actualStock = ko.observable(item.actualStock);
    this.minimumStock = ko.observable(item.minimumStock);
    this.salePriceDisplay = ko.pureComputed(function() {
        return this.salePrice() + '€';
    }, this);
    this.activateEditForm = function() {
        activateEditMaterialForm(this);
    };
    this.activateDetailsWindow = function() {
        mainContentHandlers.handlers['Material'].loadLatestTransactionsDetails(this);
    };
    this.editInformation = (function(curObj) {
        return function(editedInformation) {
            curObj.displayName(editedInformation.displayName);
            curObj.minimumStock(editedInformation.minimumStock);
            curObj.salePrice(editedInformation.salePrice);
            curObj.actualStock(editedInformation.actualStock);
        }
    })(this);
}
MaterialItem.prototype = new MainContentObject();
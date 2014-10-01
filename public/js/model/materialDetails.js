function createIncreaseEntriesByPrice(unorganizedInfo) {
    if(unorganizedInfo.length === 0) {
        return unorganizedInfo;
    } else if(unorganizedInfo.length === 1) {
        return [ new IncreaseStockInfoEntry(unorganizedInfo[0], 'detailsNormalColor') ];
    }

    unorganizedInfo.sort(function(item1, item2) {
        return item1.salePrice - item2.salePrice;
    });

    var allEntries = [ new IncreaseStockInfoEntry(unorganizedInfo.shift(), 'detailsCheapestColor') ];
    if(unorganizedInfo.length == 1) {
        allEntries.push(new IncreaseStockInfoEntry(unorganizedInfo[0], 'detailsMostExpensiveColor'));
        return allEntries;
    }

    var mostExpensive = new IncreaseStockInfoEntry(unorganizedInfo.pop(), 'detailsMostExpensiveColor');
    unorganizedInfo.forEach(function(entry) {
        allEntries.push(new IncreaseStockInfoEntry(entry, 'detailsNormalColor'))
    });

    allEntries.push(mostExpensive);
    return allEntries;
}

function DetailsEntry(values, unorganizedLatestInformation) {
    this.values = values;
    this.latestInformation = (function(unorganizedInfo) {
        // create by price, so special colors can be defined, and then sort by date
        return createIncreaseEntriesByPrice(unorganizedInfo).sort(function(e1, e2) {
            return new Date(e2.date) - new Date(e1.date);
        });
    })(unorganizedLatestInformation);
    this.allInformation = null;
    this.isShowingAllInfo = ko.observable(false);
    this.setAllInformation = function(allInfo) {
        this.allInformation = new AllInformationEntries(allInfo, this.latestInformation);
        this.allInformation.currentSelection.subscribe(function(newValue) {
            if(newValue === 'Todos') {
                this.selectedModel(this.model);
            } else if(newValue == 'Remoções') {
                this.selectedModel(this.model.filter(function(item) {
                    return item.isIncrease === false;
                }));
            } else {
                this.selectedModel(this.model.filter(function(item) {
                    return item.supplier === newValue;
                }));
            }
        }, this.allInformation);
        this.isShowingAllInfo(true);
    };
    this.showAllInfo = function() {
        mainContentHandlers.handlers['Material'].loadAllTransactionsDetails(this);
    };
    this.close = function() {
        viewModel.setDetailsOwnerMaterialItem(null);
        wholeScreenOpacity.hide();
    };
    this.afterLatestInformationTableRendered = (function(curObj) {
        return function() {
            var rows = curObj.latestInformation.length > 4 ? 4 : curObj.latestInformation.length;
            var totalHeight = (rows * 34) + 33;
            $('#tableLatestInformationRowWrapper').height(totalHeight + 'px');
        };
    })(this);
}

function AllInformationEntries(allInformation, latestInformation) {
    this.model = (function() {
        return allInformation.map(function(entry) {
            if(entry.isIncrease === true) {
                return new IncreaseStockInfoEntry(entry, 'detailsNormalColor');
            } else {
                return new DecreaseStockInfoEntry(entry);
            }
        });
    })();
    this.selectedModel = ko.observableArray(this.model);
    this.currentSelection = ko.observable('Todos');
    this.possibleSelections = (function() {
        var selections = latestInformation.map(function(item) {
            return item.supplier;
        }).sort();
        selections.unshift('Todos','Remoções');
        return selections;
    })();
    this.afterAllInformationTableRendered = (function(curObj) {
        return function() {
            var modelRows = curObj.selectedModel().length;
            var rows = modelRows > 5 ? 5 : modelRows;
            var totalHeight = (rows * 34) + 33;
            $('#tableAllInformationRowWrapper').height(totalHeight + 'px');
        };
    })(this);
    this.onEachEntryTemplate = function(entry) {
        return entry.template;
    };
}

function StockOperationEntry(isIncrease, quantity, date, colorClass, template) {
    this.isIncrease = isIncrease;
    this.quantity = quantity;
    this.date = date;
    this.colorClass = colorClass;
    this.template = template;
}

function IncreaseStockInfoEntry(entry, colorClass) {
    StockOperationEntry.call(this, true, entry.quantity, entry.date, colorClass, 'detailsIncreaseStockEntryTemplate');
    this.supplier = entry.supplier;
    this.salePrice = entry.salePrice;
    this.totalPrice = entry.salePrice * entry.quantity;
    this.discount = entry.discount;
    this.salePriceDiscount = (1 - this.discount) * this.salePrice;
    this.totalPriceDiscount = this.salePriceDiscount * this.quantity;
}
IncreaseStockInfoEntry.prototype = new StockOperationEntry();

function DecreaseStockInfoEntry(entry) {
    StockOperationEntry.call(this, false, entry.quantity, entry.date, 'detailsNormalColor', 'detailsDecreaseStockEntryTemplate');
    this.displayText = ko.pureComputed(function() {
        return 'Removidas: ' + this.quantity;
    }, this);
}
DecreaseStockInfoEntry.prototype = new StockOperationEntry();
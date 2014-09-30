(function() {
    window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObject) {
        if (errorObject && /<omitted>/.test(errorMsg)) {
            console.error('Full exception message: ' + errorObject.message);
        }
    }

    var requestOnReadyAction = (function() {
        var isReady = false;
        var pendingActions = [];

        $(document).ready(function() {
            isReady = true;
            pendingActions.forEach(function(action) {
                action();
            })
        });

        return function(pendAction) {
            if(isReady === true) {
                pendAction();
            } else {
                pendingActions.push(pendAction);
            }
        }
    })();

    requestOnReadyAction(function() {
        applyFormEvents();
    });


    // start loading menu items and act when dom is ready
    $.ajax({
        url: '/menuItems',
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(menuContent) {
            requestOnReadyAction(function() {
                viewModel.setMenuItems(menuContent);
                var entry = new DetailsEntry(testValue, latestInformation);
                entry.setAllInformation(latestInformation);
                viewModel.setDetailsOwnerMaterialItem(entry);
                ko.applyBindings(viewModel);
            });
        }
    });
})();

var argolas = {
    materialType: 'argolas',
    appId: 2
}

var hexagonais = {
    displayName: 'Hexagonais',
    appId: '2a',
    fullDisplayName: 'Hexagonais',
    parent: argolas
}


var wurth = { date: '23-01-2014', supplier: 'Wurth', quantity: 30, discount: 20, salePrice: 300 };
var berner = { date: '24-01-2014', supplier: 'Berner', quantity: 100, salePrice: 100, discount: 0.2 };
var pecol = { date: '25-01-2014', supplier: 'Pecol', quantity: 50, discount: 0.20, salePrice: 200 };
var benfica = { date: '25-01-2014', supplier: 'benfica', quantity: 50, discount: 0.20, salePrice: 200 };
var porto = { date: '25-01-2014', supplier: 'porto', quantity: 50, discount: 0.20, salePrice: 200 };

var topInformation = [
    wurth,
    berner,
    pecol,
    benfica,
    porto
];

var testValue = {
    displayName: '4mm',
    appId: '4a1',
    minimumStock: 10,
    actualStock: 20,
    salePrice: 50,
    parent: hexagonais
}

var latestInformation = (function(unorganizedInfo) {
    if(unorganizedInfo.length === 0) {
        return unorganizedInfo;
    } else if(unorganizedInfo.length === 1) {
        return [ new InfoEntry(unorganizedInfo[0], 'detailsNormalColor') ];
    }

    unorganizedInfo.sort(function(item1, item2) {
        return item1.salePrice - item2.salePrice;
    });

    var allEntries = [ new InfoEntry(unorganizedInfo.shift(), 'detailsCheapestColor') ];
    if(unorganizedInfo.length == 1) {
        allEntries.push(new InfoEntry(unorganizedInfo[0], 'detailsMostExpensiveColor'));
        return allEntries;
    }

    var mostExpensive = new InfoEntry(unorganizedInfo.pop(), 'detailsMostExpensiveColor');
    unorganizedInfo.forEach(function(entry) {
        allEntries.push(new InfoEntry(entry, 'detailsNormalColor'))
    });

    allEntries.push(mostExpensive);
    return allEntries;
})(topInformation);

function DetailsEntry(values, latestInformation) {
    this.values = values;
    this.latestInformation = latestInformation;
    this.allInformation = null;
    this.isShowingAllInfo = ko.observable(true);
    this.setAllInformation = function(allInfo) {
        this.allInformation = {
            model: allInfo,
            selectedModel: ko.observableArray(allInfo),
            currentSelection: ko.observable('Todos'),
            possibleSelections: (function() {
                var selections = this.latestInformation.map(function(item) {
                    return item.supplier;
                }).sort();
                selections.unshift('Todos','Remoções');
                return selections;
            })(),
            afterAllInformationTableRendered: (function(curObj) {
                return function() {
                    var modelRows = curObj.allInformation.selectedModel().length;
                    var rows = modelRows > 5 ? 5 : modelRows;
                    var totalHeight = (rows * 34) + 33;
                    $('#tableAllInformationRowWrapper').height(totalHeight + 'px');
                };
            })(this)
        };
        this.allInformation.currentSelection.subscribe(function(newValue) {
            if(newValue === 'Todos') {
                this.selectedModel(this.model);
            } else {
                this.selectedModel(this.model.filter(function(item) {
                    return item.supplier === newValue;
                }));
            }
        }, this.allInformation);
    };
    this.showAllInfo = function() {
        this.setAllInformation(latestInformation);
        this.isShowingAllInfo(true);
    };
    this.close = function() {
        viewModel.setDetailsOwnerMaterialItem(null);
    };
    this.afterLatestInformationTableRendered = function() {
        var rows = latestInformation.length > 4 ? 4 : latestInformation.length;
        var totalHeight = (rows * 34) + 33;
        $('#tableLatestInformationRowWrapper').height(totalHeight + 'px');
    }
}

function InfoEntry(entry, colorClass) {
    this.date = entry.date;
    this.supplier = entry.supplier;
    this.salePrice = entry.salePrice;
    this.totalPrice = entry.salePrice * entry.quantity;
    this.quantity = entry.quantity;
    this.discount = entry.discount;
    this.salePriceDiscount = (1 - this.discount) * this.salePrice;
    this.totalPriceDiscount = this.salePriceDiscount * this.quantity;
    this.colorClass = colorClass;
}


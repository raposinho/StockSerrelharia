module.exports = {
    insertMaterialItem: insertMaterialItem,
    editMaterialItem: editMaterialItem,
    getLatestTransactions: getLatestTransactions,
    getAllTransactions: getAllTransactions,
    getMaterialContent: getMaterialContent
}

var wurth = { isIncrease: true, date: '23-01-2014', supplier: 'Wurth', quantity: 30, discount: 20, salePrice: 300 };
var berner = { isIncrease: true, date: '24-01-2014', supplier: 'Berner', quantity: 40, discount: 20, salePrice: 100 };
var pecol = { isIncrease: true, date: '25-01-2014', supplier: 'Pecol', quantity: 50, discount: 20, salePrice: 200 };

var topInformation = [ wurth, berner, pecol ];

function getLatestTransactions(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(topInformation));
}

var removeEntry1 =  { isIncrease: false, quantity: 30, date: '27-01-2014' };
var removeEntry2 =  { isIncrease: false, quantity: 40, date: '24-01-2014' };
var removeEntry3 =  { isIncrease: false, quantity: 50, date: '22-01-2014' };

var allInformation = [ wurth, berner, pecol ];
allInformation.push(removeEntry1, berner, removeEntry2, berner, berner, berner, pecol, pecol, removeEntry3);

function getAllTransactions(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(allInformation));
}

function insertMaterialItem(req, res) {
    var ret = req.body;

    // check for already existent name
    var displayName = req.body.displayName;
    var existent = argolasValues
        .sections[0]
        .items.filter(function(item) {
            return item.displayName == displayName;
        })[0];
    if(existent) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reason: 'Already exists this name' }));
        return;
    }

    ret.appId = '20';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ret));
}

function editMaterialItem(req, res) {
    var itemId = req.body.sectionInformation[req.body.sectionInformation.length - 1];
    var ret = argolasValues
        .sections[0]
        .items.filter(function(item) {
            return item.appId == itemId;
        })[0];

    // check for already existent name
    var displayName = req.body.displayName;
    if(displayName !== req.body.originalDisplayName) {
        var existent = argolasValues
            .sections[0]
            .items.filter(function(item) {
                return item.displayName == displayName;
            })[0];
        if(existent) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reason: 'Already exists this name' }));
            return;
        }
    }

    ret.displayName = req.body.displayName;
    ret.minimumStock = req.body.minimumStock;

    if(req.body.increaseAmount) {
        ret.actualStock = +ret.actualStock + +req.body.increaseAmount;
    } else if(req.body.decreaseAmount) {
        ret.actualStock = ret.actualStock - req.body.decreaseAmount;
    }

    ret.sectionInformation = req.body.sectionInformation;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ret));
}


function getMaterialContent(req, res) {
    var b = req.params.type;
    var currentReturn;
    if(b === '5') {
        currentReturn = parafusosValues;
    } else if(b === '1') {
        currentReturn = spraysValues;
    } else if(b === '2') {
        currentReturn = argolasValues;
    }
    currentReturn.operationType = 'materialListing';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(currentReturn));
}

var argolasValues = {
    materialType: 'argolas',
    appId: 2,
    sections: [{
        displayName: 'Hexagonais',
        appId: '2a',
        items: [
            { displayName: '4mm', appId: '4a1', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: '6mm', appId: '4a2', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: '8mm', appId: '4a3', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: '10mm', appId: '4a4', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: '12mm', appId: '4a5', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: '14mm', appId: '4a6', minimumStock: 10, actualStock: 20, salePrice: 50}
        ]
    }]
}

var spraysValues = {
    materialType: 'Sprays',
    appId: 1,
    sections: [{
        displayName: 'DosBons',
        appId: '1a',
        items: [
            { displayName: 'sprays4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'sprays6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'sprays8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'sprays10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'sprays12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'sprays14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
        ]
    }]
}

var parafusosValues = {
    materialType: 'Parafusos',
    appId: 5,
    sections: [
        {
            displayName: 'Quadrados',
            appId:6,
            sections: [
                {
                    displayName: 'Inox',
                    appId: '6a',
                    items: [
                        { displayName: '4mm', appId: '4a1', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '6mm', appId: '4a2', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '8mm', appId: '4a3', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '10mm', appId: '4a4', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: 'M23 - 16mm', appId: '4a5', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: 'M23 - 12mm', appId: '4a6', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: 'M23 - 122', appId: '4a7', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: 'M23 - 14', appId: '4a8', minimumStock: 10, actualStock: 20, salePrice: 50}

                    ]
                }
            ]
        },
        {
            displayName: 'Triangulares',
            appId: 7,
            items: [
                { displayName: '4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                { displayName: '6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                { displayName: '8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                { displayName: '10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                { displayName: '12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                { displayName: '14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
            ]
        },
        {
            displayName: 'Pontos',
            appId:8,
            sections: [
                {
                    displayName: 'Inox',
                    appId: '8a',
                    items: [
                        { displayName: '4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
                    ]
                },
                {
                    displayName: 'Ferro',
                    appId: '8b',
                    items: [
                        { displayName: '4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
                    ]
                }
            ]
        }
    ]
};
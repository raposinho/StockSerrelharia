module.exports = {
    getMaterialContent: getMaterialContent
}

function getMaterialContent(req, res) {
    var b = req.params.type;
    var currentReturn;
    if(b === '5') {
        currentReturn = parafusosValues;
    } else if(b === '1') {
        currentReturn = spraysValues;
    } else if(b === '2') {
        currentReturn = porcasValues;
    }
    currentReturn.operationType = 'materialListing';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(currentReturn));
}

var porcasValues = {
    materialType: 'Porcas',
    appId: 2,
    sections: [{
        displayName: 'Hexagonais',
        appId: '2a',
        items: [
            { displayName: 'porcas4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'porcas6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'porcas8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'porcas10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'porcas12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
            { displayName: 'porcas14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
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
                        { displayName: '4mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '6mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '8mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '10mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '12mm', minimumStock: 10, actualStock: 20, salePrice: 50},
                        { displayName: '14mm', minimumStock: 10, actualStock: 20, salePrice: 50}
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

//sections: [
//    {
//        displayName: 'Quadrados',
//        appId:6,
//        items: [
//            { displayName: '4mm', stock: 10 },
//            { displayName: '6mm', stock: 20 },
//            { displayName: '8mm', stock: 30 },
//            { displayName: '10mm', stock: 40 },
//            { displayName: '12mm', stock: 50 },
//            { displayName: '14mm', stock: 60 }
//        ]
//    },
//    {
//        displayName: 'Estrela',
//        appId:7,
//        sections: [
//            {
//                displayName: 'inox',
//                appId:8,
//                items: [
//                    { displayName: '4mm', stock: 10 },
//                    { displayName: '6mm', stock: 20 },
//                    { displayName: '8mm', stock: 30 },
//                    { displayName: '10mm', stock: 40 },
//                    { displayName: '12mm', stock: 50 },
//                    { displayName: '14mm', stock: 60 }
//                ]
//            }
//        ]
//    }
//]
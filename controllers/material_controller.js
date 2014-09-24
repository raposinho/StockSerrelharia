module.exports = {
    getMaterialContent: getMaterialContent
}

function getMaterialContent(req, res) {

    var currentReturn = testValues;
    currentReturn.operationType = 'materialListing';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(currentReturn));
}

var testValues = {
    materialType: 'Parafusos',
    appId: 5,
    sections: [

    ]
};
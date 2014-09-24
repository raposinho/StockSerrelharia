var menuItemsHandler = require('./../model/MenuItems');

module.exports = {
    getMenuItems: getMenuItems
}

function getMenuItems(req, res) {
    menuItemsHandler.getMenuItems(function(menuItems) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(menuItems));
    });
}


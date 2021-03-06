var homeController = require('./../controllers/home_controller'),
    materialController = require('./../controllers/material_controller');

module.exports = {
    applyRoutes: applyRoutes
}

function showHomePage(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.render('home/index');
}
function ensureAjax(req, res, next) {
    var requestedWith = req.get('X-Requested-With');
    if(requestedWith && requestedWith.toLowerCase() === 'XMLHttpRequest'.toLowerCase()) {
        next();
    } else {
        showHomePage(req, res);
    }
}

function applyRoutes(router) {
    router.get('/menuItems', ensureAjax, homeController.getMenuItems);

    // materials
    router.get('/material/:type', ensureAjax, materialController.getMaterialContent);
    router.get('/material/getLatestTransactions/:item', ensureAjax, materialController.getLatestTransactions);
    router.get('/material/getAllTransactions/:item', ensureAjax, materialController.getAllTransactions);

    router.post('/material/insertMaterialItem', ensureAjax, materialController.insertMaterialItem);
    router.post('/material/editMaterialItem', ensureAjax, materialController.editMaterialItem);

    router.get('*', function(req, res) {
        showHomePage(req, res);
    });
}
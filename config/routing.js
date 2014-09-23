// controllers
var homeController = require('../controllers/home_controller');



function applyRoutes(router) {

    // home routes


    // unknown url root
    router.get('*', homeController.notFound);
}

module.exports = {
    applyRoutes: applyRoutes
}

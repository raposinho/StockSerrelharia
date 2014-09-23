var responseFinalizer = require('./utils/response_finalizer');

module.exports = {
    notFound: notFound
}

function notFound(req, res) {
    responseFinalizer.finalizeHtmlResponse(req, res, 404, 'home/notFound');
}
module.exports = {
    finalizeHtmlResponse: finalizeHtmlResponse
}

// exposed methods
function finalizeHtmlResponse(req, res, status, viewName, fields) {
    res.statusCode = status;
    res.setHeader('Content-type', 'text/html');
    res.render(viewName, addCommonViewFields(req, fields));
}

// util methods
function addCommonViewFields(req, fields) {
    if(!fields) {
        fields = {};
    }
    return fields;
}
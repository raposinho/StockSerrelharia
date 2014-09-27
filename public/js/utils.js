function find(arr, test, ctx) {
    var result = null;
    arr.some(function(el, i) {
        return test.call(ctx, el, i, arr) ? ((result = el), true) : false;
    });
    return result;
}

function handleNumberEntry(str) {
    str = str.trim().replace(',','.');
    if(str.charAt(0) === '+') {
        str = str.slice(1);
    }
    return str;
}

function isStringNotEmptySpaces(str) {
    return !(/^\s*$/.test(str));
}

function isNumeric(c) {
    return c >= '0' && c <= '9'
}

function isPositiveInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}

function isPositiveDouble(str) {
    return /^(\+)?([0-9]+(\.[0-9]+)?)$/.test(str);
}

function getNumberBeforeIdx(str, idx) {
    var ret = 0;
    for(var i = 0; i < idx; ++i) {
        if(isNumeric(str.charAt(idx - i)) === false) {
            return ret;
        }
        ret += i * 10 + +str.charAt(idx - 1);
    }
    return ret;
}

// ------------------------------------------------------------------------------------------------------
// --------------------------------- Changes/Additions to API -------------------------------------------
// ------------------------------------------------------------------------------------------------------

// JQuery scroll based on id ($(id).scrollView ())
$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 500);
    });
};

// ---------------------------------------------------------------------------------------------------------
// ------------------------------- Sort material items based on patterns------------------------------------
// ---------------------------------------------------------------------------------------------------------

function materialSort(mat1, mat2) {
    var mat1DisplayName = mat1.displayName();
    var mat2DisplayName = mat2.displayName();
    var mat1WasNumber = false;
    var mat2WasNumber = false;

    var i = 0, j = 0;
    for(; i < mat1DisplayName.length && j < mat2DisplayName.length;) {
        var char1 = mat1DisplayName.charAt(i);
        var char2 = mat2DisplayName.charAt(j);
        if(isNumeric(char1) === true) {
            if(isNumeric(char2) === true) {
                ++i;
                ++j;
                mat2WasNumber = true;
            } else {
                if(mat1WasNumber === true && mat2WasNumber === true) {
                    return 1;
                }
                ++i;
                mat2WasNumber = false;
            }
            mat1WasNumber = true;
        } else if(isNumeric(char2) === true) {
            if(mat1WasNumber === true && mat2WasNumber === true) {
                return -1;
            }
            ++j;
            mat2WasNumber = true;
            mat1WasNumber = false;
        } else {
            if(mat1WasNumber === true && mat2WasNumber === true) {
                var compResult = mat1DisplayName.charCodeAt(i-1) - mat2DisplayName.charCodeAt(j-1);
                if(compResult !== 0) {
                    return compResult;
                }
            }
            var compResult = char1.localeCompare(char2);
            if(compResult !== 0) {
                return compResult;
            }
            ++i;
            ++j;
            mat1WasNumber = false;
            mat2WasNumber = false;
        }
    }

    //now it depends on size
    if(i === j) {
        if (mat1DisplayName.length === mat2DisplayName.length) {
            return getNumberBeforeIdx(mat1DisplayName, i) - getNumberBeforeIdx(mat2DisplayName, i);
        }
    }

    if(j === mat2DisplayName.length) {
        if(isPositiveDouble(mat1DisplayName.slice(i)) === true) {
            return 1;
        } else {
            if(isNumeric(mat1DisplayName.charAt(i))  === true) {
                return 1;
            }
            return -1;
        }
    } else {
        if(isPositiveDouble(mat2DisplayName.slice(j))  === true) {
            return -1;
        } else {
            if(isNumeric(mat2DisplayName.charAt(j)  === true)) {
                return 1;
            }
            return 1;
        }
    }
}
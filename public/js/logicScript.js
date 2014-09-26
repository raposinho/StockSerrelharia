// ------------------------------------------------------------------------------------------------------
// ------------------------------------------ Utils -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------

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

function materialSort(mat1, mat2) {
    var mat1DisplayName = mat1.displayName;
    var mat2DisplayName = mat2.displayName;
    var mat1WasNumber = false;
    var mat2WasNumber = false;

    if(mat1DisplayName === '131' || mat2DisplayName === '131') {
        console.log(1);
    }

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
            //mat1DisplayName.charCodeAt(mat1DisplayName.length - 1) - mat2DisplayName.charCodeAt(mat2DisplayName.length - 1);
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
//    var leastIdx = mat1DisplayName.length < mat2DisplayName.length ? mat1DisplayName.length : mat2DisplayName.length;
//    return mat2DisplayName.charCodeAt(leastIdx-1) > mat1DisplayName.charCodeAt(leastIdx-1);
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

// ------------------------------------------------------------------------------------------------------
// ------------------------------ Form Functionality Related --------------------------------------------
// ------------------------------------------------------------------------------------------------------

var formHandlers;

$(document).ready(function() {

    var addMaterial = $('#addMaterialElement');
    var editMaterial = $('#editMaterialElement');
    formHandlers = {
        addMaterial: addMaterial,
        editMaterial: editMaterial
    };

    [ {
          formWrapper: addMaterial,
          selectorSupplier: '#originSupplierAddForm',
          supplierDependentSelector: '#supplierDependentSectionAddForm',
          cancelButton: '#addMaterialCancelButton'
      },
      {
          formWrapper: editMaterial,
          selectorSupplier: '#originSupplierEditForm',
          supplierDependentSelector: '#supplierDependentSectionEditForm',
          cancelButton: '#editMaterialCancelButton'
      }].forEach(function(item) {

        // add cancel action
        item.formWrapper.find(item.cancelButton).on('click', function(e) {
            e.preventDefault();
            $('#wholeScreenOpacity').hide();
            item.formWrapper.hide();
        });

        // supplier toggle related
        var originSupplierAddForm = item.formWrapper.find(item.selectorSupplier);
        originSupplierAddForm.change(function(e) {
            var state = $(originSupplierAddForm.children("option:selected")).val() === 'N/A';
            var dependentDiv = item.formWrapper.find(item.supplierDependentSelector);
            dependentDiv.find('input').prop('disabled', state);
            if(state === true) {
                dependentDiv.find('label[class*="formErrorColor"]').removeClass('formErrorColor');
            }
        });
    });

    addMaterial.find('#addMaterialSaveButton').on('click', function(e) {
        e.preventDefault();

        // reset any red colored errors
        addMaterial.find('label[class*="formErrorColor"]').removeClass('formErrorColor');

        var isValid = true;
        var postObj = {};

        var tmp = addMaterial.find('#materialDisplayNameForm');
        if(/^\s*$/.test(tmp.val()) === true) {
            addMaterial.find('label[for="materialDisplayNameForm"]').addClass('formErrorColor');
            isValid = false;
        } else {
            postObj[tmp.attr('name')] = tmp.val();
        }

        // minimum stock (alert)
        tmp = addMaterial.find('#minimumStockAddForm');
        var tmpValue = handleNumberEntry(tmp.val());
        if(isPositiveInteger(tmpValue) === false && tmpValue !== 'N/A') {
            addMaterial.find('label[for="minimumStockAddForm"]').addClass('formErrorColor');
            isValid = false;
        } else {
            postObj[tmp.attr('name')] = tmpValue;
        }

        tmp = addMaterial.find('#actualStockAddForm');
        tmpValue = handleNumberEntry(tmp.val());
        if(isPositiveInteger(tmpValue) === false) {
            addMaterial.find('label[for="actualStockAddForm"]').addClass('formErrorColor');
            isValid = false;
        } else {
            postObj[tmp.attr('name')] = tmpValue;
        }

        tmp = $('#originSupplierAddForm');
        postObj[tmp.attr('name')] = tmp.find(':selected').text();

        ['boughtPriceAddForm', 'discountAddForm'].forEach(function(item) {
            tmp = addMaterial.find('#' + item);
            tmpValue = handleNumberEntry(tmp.val());
            if(isPositiveDouble(tmpValue) === false) {
                addMaterial.find('label[for="' + item + '"]').addClass('formErrorColor');
                isValid = false;
            } else {
                postObj[tmp.attr('name')] = tmpValue;
            }
        });

        if(isValid === true) {
            postObj.sectionInformation = JSON.parse(addMaterial.find('#ownerSectionAddForm').val());
            $.ajax({
                url: '/material/insertMaterialItem',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(postObj),
                dataType: "json",
                success: function(addedObject) {
                    menuHandlers.handlers['Material'].addItemToView(addedObject);
                    $('#wholeScreenOpacity').hide();
                    $('#addMaterialElement').hide();
                }
            });
        }
    });
});

function commonAddAndEditMaterialFormPreparations(form, sectionObject, ownerSectionSelector, supplierSelectionSelector, sectionTitleSelector) {

    // reset any red colored errors
    form.find('label[class*="formErrorColor"]').removeClass('formErrorColor');

    form.find(sectionTitleSelector).text(sectionObject.fullDisplayName);

    // set section information (array of id's since type)
    var sectionInformation = (function() {
        var allParentIds = [];
        var cur = sectionObject;
        while (cur.parent) {
            allParentIds.unshift(cur.appId);
            cur = cur.parent;
        }
        return allParentIds;
    })();
    form.find(ownerSectionSelector).val(JSON.stringify(sectionInformation));

    // set supplier options
    var selectWrapper = form.find(supplierSelectionSelector);
    selectWrapper.empty();
    selectWrapper.append($('<option></option>').text('N/A'));
    menuHandlers.handlers['Fornecedores'].getAllDisplayNames().forEach(function(item) {
        selectWrapper.append($('<option></option>').text(item));
    });

    // activate elements
    $('#wholeScreenOpacity').show();
    form.show();
}

function activateAddMaterialForm(sectionObject) {
    var form = formHandlers.addMaterial;

    // reset values
    var wrapperFormDiv = $('#addMaterialElement').find('form > div');
    var obligatoryInputs = wrapperFormDiv.find('>:first-child input');
    obligatoryInputs.get(0).value = '';
    obligatoryInputs.get(1).value = 'N/A';
    wrapperFormDiv.find('>:nth-child(n+2) input').val('0');

    commonAddAndEditMaterialFormPreparations(form, sectionObject, '#ownerSectionAddForm', '#originSupplierAddForm', '#addMaterialSectionTitle');
}

function activateEditMaterialForm(sectionObject) {


    // activate elements
    $('#wholeScreenOpacity').show();
    $('#editMaterialElement').show();
}

// ------------------------------------------------------------------------------------------------------
// ---------------------------------- Logic Related -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------

function loadContent() {
    var amountContentToLoad = 1;

    function onContentLoaded() {
        if(--amountContentToLoad == 0) {
            ko.applyBindings(viewModel);
        }
    }

    //getMenuItems
    $.ajax({
        url: '/menuItems',
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(menuContent) {
            viewModel.setMenuItems(menuContent);
            onContentLoaded();
        }
    });
}

function MenuSelectionHandler(onSelection) {
    this.onSelection = onSelection;
}

function MaterialSelectionHandler() {
    MenuSelectionHandler.call(this, function(selectedItem) {
        var curItem = selectedItem;
        while(curItem.parent.displayName !== 'Material') {
            curItem = curItem.parent;
        }

        // check if content ain't already being shown
        if(viewModel.mainContent() && curItem.displayName == viewModel.mainContent().materialType) {
            $('#' + selectedItem.appId).scrollView();
            return;
        }

        $.ajax({
            url: '/material/' + curItem.appId,
            type: 'GET',
            data: {
                format: 'json'
            },
            success: function(menuContent) {
                viewModel.swapMainContent(menuContent);
                $('#' + selectedItem.appId).scrollView();
            }
        });
    });
    this.addItemToView = function(addedObject) {
        var curObj = viewModel.mainContent();

        addedObject.sectionInformation.forEach(function(item) {
            curObj = find(curObj.subContent, function(item2) {
                return item2.appId === item;
            });
        });

        curObj.addElement(addedObject);
    };
}
SupplierSelectionHandler.prototype = new MenuSelectionHandler();

function SupplierSelectionHandler(onSelection) {
    MenuSelectionHandler.call(this, null);
    this.getAllDisplayNames = function() {
        return find(viewModel.menuItems, function(item) {
            return item.displayName === 'Fornecedores';
        }).subContent.map(function(item) {
            return item.displayName;
        });
    };
}
SupplierSelectionHandler.prototype = new MenuSelectionHandler();

var menuHandlers = (function() {
    var handlersByType =  {
        'Material': new MaterialSelectionHandler(),
        'Fornecedores': new SupplierSelectionHandler()
    };
    return {
        handlers: handlersByType,
        getHandler: function(mainItemObj) {
            return handlersByType[mainItemObj.displayName];
        }
    };
})();


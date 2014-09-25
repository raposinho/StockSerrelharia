// ------------------------------------------------------------------------------------------------------
// ------------------------------------------ Utils -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------

function removePlusSign(str) {
    if(str.charAt(0) === '+') {
        str = str.slice(1);
    }
    return str;
}

function isPositiveInteger(str) {
    str = removePlusSign(str);
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}

function isPositiveDouble(str) {
    str = removePlusSign(str);
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

$(document).ready(function() {
    var originSupplierAddForm = $('#originSupplierAddForm');
    originSupplierAddForm.change(function() {
        var state = $(originSupplierAddForm.children("option:selected")).val() === 'N/A';
        $('#supplierDepedentSectionAddForm').find('input').prop('disabled', state);
    });

    var addMaterialForm = $('#addMaterialElement');
    addMaterialForm.find('#addMaterialCancelButton').on('click', function(e) {
        e.preventDefault();
        $('#wholeScreenOpacity').hide();
        $('#addMaterialElement').hide();
    });
    addMaterialForm.find('#addMaterialSaveButton').on('click', function(e) {
        e.preventDefault();
        // reset any red colored errors
        addMaterialForm.find('label[class*="formErrorColor"]').removeClass('formErrorColor');

        var isValid = true;

        if(/^\s*$/.test(addMaterialForm.find('#materialDisplayNameForm').val())) {
            addMaterialForm.find('label[for="materialDisplayNameForm"]').addClass('formErrorColor');
            isValid = false;
        }

        // minimum stock (alert)
        var minimumStock = addMaterialForm.find('#minimumStockAddForm');
        if(isPositiveInteger(minimumStock.val()) === false && minimumStock.val() !== 'N/A') {
            addMaterialForm.find('label[for="minimumStockAddForm"]').addClass('formErrorColor');
            isValid = false;
        }

        if(isPositiveInteger(addMaterialForm.find('#actualStockAddForm').val()) === false) {
            addMaterialForm.find('label[for="actualStockAddForm"]').addClass('formErrorColor');
            isValid = false;
        }

        ['boughtPriceAddForm', 'addMaterialCancelButton'].forEach(function(item) {
            
        });
    });
});

function activateAddMaterialForm(sectionObject) {
    var form = $('#addMaterialElement');
    // reset any red colored errors
    form.find('label[class*="formErrorColor"]').removeClass('formErrorColor');

    // set up title
    form.find('#spanHeaderLocation').text(sectionObject.fullDisplayName);

    // reset values
    var wrapperFormDiv = $('#addMaterialElement').find('form > div');
    var obligatoryInputs = wrapperFormDiv.find('>:first-child input');
    obligatoryInputs.get(0).value = '';
    obligatoryInputs.get(1).value = 'N/A';
    wrapperFormDiv.find('>:nth-child(n+2) input').val('0');

    // set supplier options
    var selectWrapper = form.find('#originSupplierAddForm');
    selectWrapper.empty();
    selectWrapper.append($('<option></option>').text('N/A'));
    menuHandlers.handlers['Fornecedores'].getAllDisplayNames().forEach(function(item) {
        selectWrapper.append($('<option></option>').text(item));
    });

    // activate elements
    $('#wholeScreenOpacity').show();
    $('#addMaterialElement').show();
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

function SupplierSelectionHandler(onSelection) {
    MenuSelectionHandler.call(this, onSelection);
    this.associatedModelEntry = (function() {

    });
    this.getAllDisplayNames = function() {
        return viewModel.menuItems.filter(function(item) {
            return item.displayName === 'Fornecedores';
        })[0].subContent.map(function(item) {
            return item.displayName;
        });
    };
}
SupplierSelectionHandler.prototype = new MenuSelectionHandler();

var menuHandlers = (function() {
    var handlersByType =  {
        'Material': new MenuSelectionHandler(function(selectedItem) {
            var curItem = selectedItem;
            while(curItem.parent.displayName !== 'Material') {
                curItem = curItem.parent;
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
        }),
        'Fornecedores': new SupplierSelectionHandler(null)
    };
    return {
        handlers: handlersByType,
        getHandler: function(mainItemObj) {
            return handlersByType[mainItemObj.displayName];
        }
    };
})();


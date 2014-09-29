var formHandlers;
var alreadyExistsDiv;
var wholeScreenOpacity;

function applyFormEvents() {
    wholeScreenOpacity = $('#wholeScreenOpacity');

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
            wholeScreenOpacity.hide();
            item.formWrapper.hide();
        });

        // supplier toggle related
        var originSupplierAddForm = item.formWrapper.find(item.selectorSupplier);
        originSupplierAddForm.change(function() {
            var value = $(originSupplierAddForm.children("option:selected")).val();
            var state = value === '' || value === 'Outro';
            var dependentDiv = item.formWrapper.find(item.supplierDependentSelector);
            dependentDiv.find('input').prop('disabled', state);
            if(state === true) {
                dependentDiv.find('label[class*="formErrorColor"]').removeClass('formErrorColor');
            }
        });
    });

    alreadyExistsDiv = $('#messageDiv');
    alreadyExistsDiv.find('button').on('click', function() {
        alreadyExistsDiv.hide();
    });

    addMaterial.find('#addMaterialSaveButton').on('click', materialRelatedSaveFormClickFunction(addMaterial, function(e, postObj) {
        validateFormStringNotEmpty(addMaterial, 'materialDisplayNameAddForm', postObj, false);
        validateFormInteger(addMaterial, 'minimumStockAddForm', postObj, true);
        validateFormInteger(addMaterial, 'actualStockAddForm', postObj, false);
        validateFormDouble(addMaterial, 'salePriceAddForm', postObj, true);
    }, '#ownerSectionAddForm', '/material/insertMaterialItem', function(addedObject) {
        mainContentHandlers.handlers['Material'].addItemToView(addedObject);
    }));

    editMaterial.find('#editMaterialSaveButton').on('click', materialRelatedSaveFormClickFunction(editMaterial, function(e, postObj) {
        validateFormStringNotEmpty(editMaterial, 'materialDisplayNameEditForm', postObj, false);
        validateFormInteger(editMaterial, 'minimumStockEditForm', postObj, true);
        validateFormDouble(editMaterial, 'salePriceEditForm', postObj, true);
        var increasingStock;
        if(editMaterial.find('#increaseStockEditForm').val() !== '') {
            validateFormInteger(editMaterial, 'increaseStockEditForm', postObj, false);
            validateFormSelect(editMaterial, 'originSupplierEditForm', postObj, false);
            validateFormDouble(editMaterial, 'boughtPriceEditForm', postObj, false);
            validateFormDoubleWithMax(editMaterial, 'discountEditForm', postObj, false, 100);
            increasingStock = true;
        }
        if(editMaterial.find('#decreaseStockEditForm').val() !== '') {
            validateFormInteger(editMaterial, 'decreaseStockEditForm', postObj, false);
            if(increasingStock === true) {
                editMaterial.find('label[for="increaseStockEditForm"], label[for="decreaseStockEditForm"]').addClass('formErrorColor');
                postObj.isValid = false;
            }
        }
        postObj.postContent['originalDisplayName'] = editMaterial.find('#originalDisplayNameEditForm').val();
    }, '#ownerSectionEditForm', '/material/editMaterialItem', function(editedObject) {
        mainContentHandlers.handlers['Material'].applyModificationsToItemOnView(editedObject);
    }));


    var unitaryPrice = editMaterial.find('#unitaryPriceEditForm');
    var unitaryPriceWithDiscount = editMaterial.find('#unitaryPriceDiscountEditForm');
    var discountEditForm = editMaterial.find('#discountEditForm');
    var increaseStockEditForm = editMaterial.find('#increaseStockEditForm');
    var boughtPriceEditForm = editMaterial.find('#boughtPriceEditForm');
    editMaterial.find('#increaseStockEditForm, #discountEditForm, #boughtPriceEditForm').keyup(function() {
        var discValue = discountEditForm.val();
        var incValue = increaseStockEditForm.val();
        var boughtPriceValue = boughtPriceEditForm.val();
        if(isPositiveDouble(discValue) === isPositiveInteger(incValue) === isPositiveDouble(boughtPriceValue) === true) {
            var value = (boughtPriceValue / incValue);
            unitaryPriceWithDiscount.val(value.toFixed(3).replace(/0{0,2}$/, "") + '€');
            unitaryPrice.val((value / (1 - discValue / 100)).toFixed(3).replace(/0{0,2}$/, "") + '€');
        } else {
            unitaryPrice.val('N/A');
            unitaryPriceWithDiscount.val('N/A');
        }
    });
}

function getInputValueFunc(tmp) {
    return tmp.val();
}

function getInputValueNumberHandledFunc(tmp) {
    return handleNumberEntry(tmp.val());
}

function validateFormCommon(form, inputId, postObj, allowNA, selectValueFunc, predicate) {
    var tmp = form.find('#' + inputId);
    var tmpValue = selectValueFunc(tmp);
    if((allowNA === false || (allowNA === true && tmpValue !== 'N/A')) && predicate(tmpValue) === false) {
        form.find('label[for="' + inputId + '"]').addClass('formErrorColor');
        postObj.isValid = false;
    } else {
        postObj.postContent[tmp.attr('name')] = tmpValue;
    }
}

function validateFormStringNotEmpty(form, inputId, postObj, allowNA) {
    validateFormCommon(form, inputId, postObj, allowNA, getInputValueFunc, isStringNotEmptySpaces);
}

function validateFormInteger(form, inputId, postObj, allowNA) {
    validateFormCommon(form, inputId, postObj, allowNA, getInputValueNumberHandledFunc, isPositiveInteger);
}

function validateFormDouble(form, inputId, postObj, allowNA) {
    validateFormCommon(form, inputId, postObj, allowNA, getInputValueNumberHandledFunc, isPositiveDouble);
}

function validateFormDoubleWithMax(form, inputId, postObj, allowNA, maxNumber) {
    validateFormCommon(form, inputId, postObj, allowNA, getInputValueNumberHandledFunc, function(val) {
        return isPositiveDouble(val) && val <= maxNumber;
    });
}

function validateFormSelect(form, inputId, postObj, allowNA) {
    validateFormCommon(form, inputId, postObj, allowNA, function(tmp) {
        return tmp.find(':selected').text();
    }, function(tmpValue) {
        return !(!tmpValue || tmpValue === '');
    });
}

function materialRelatedSaveFormClickFunction(form, intermediaryValidations, ownerSectionIdSelector, postUrl, successCallback) {
    return saveFormClickFunction(form, intermediaryValidations, ownerSectionIdSelector, postUrl, function(postObj, jqXHR) {
        if(jqXHR.status == 403) {
            var item = mainContentHandlers.handlers['Material'].searchRightElement(postObj.postContent.sectionInformation);
            var section = item instanceof MaterialItem ? item.parent : item;
            activateAlreadyExistsDiv('Já existe material com nome ' + postObj.postContent.displayName + ' em ' + section.fullDisplayName, 'alreadyExistsError');
        }
    }, successCallback);
}

function saveFormClickFunction(form, intermediaryValidations, ownerSectionIdSelector, postUrl, errorCallback, successCallback) {
    return function(e) {
        e.preventDefault();
        // reset any red colored errors
        form.find('label').removeClass('formErrorColor');

        var postObj = { isValid: true, postContent: {}};
        intermediaryValidations(e, postObj);

        if(postObj.isValid === true) {
            postObj.postContent.sectionInformation = JSON.parse(form.find(ownerSectionIdSelector).val());
            $.ajax({
                url: postUrl,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(postObj.postContent),
                dataType: "json",
                error: function(jqXHR, textStatus, errorThrown) {
                    if(errorCallback) {
                        errorCallback(postObj, jqXHR, textStatus, errorThrown);
                    }
                },
                success: function(addedObject) {
                    successCallback(addedObject);
                    wholeScreenOpacity.hide();
                    form.hide();
                }
            });
        }
    }
}

function commonAddAndEditMaterialFormPreparations(form, sectionObject, ownerSectionSelector) {

    // reset any red colored errors
    form.find('label[class*="formErrorColor"]').removeClass('formErrorColor');

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

    // activate elements
    $('#wholeScreenOpacity').show();
    form.show();
}

function activateAddMaterialForm(sectionObject) {
    var form = formHandlers.addMaterial;

    form.find('#addMaterialSectionTitle').text(sectionObject.fullDisplayName);

    // reset values
    var wrapperFormDiv = $('#addMaterialElement').find('form > div');
    wrapperFormDiv.find('#minimumStockAddForm, #salePriceAddForm').val('N/A');
    wrapperFormDiv.find('#actualStockAddForm').val(0);

    commonAddAndEditMaterialFormPreparations(form, sectionObject, '#ownerSectionAddForm');
}

function activateEditMaterialForm(itemObject) {
    var form = formHandlers.editMaterial;

    // set values based on item
    form.find('#editMaterialSectionTitle').text(itemObject.parent.fullDisplayName);
    form.find('#editMaterialItemTitle').text(itemObject.displayName());
    form.find('#materialDisplayNameEditForm').val(itemObject.displayName());
    form.find('#minimumStockEditForm').val(itemObject.minimumStock());
    form.find('#actualStockEditForm').val(itemObject.actualStock());
    form.find('#originalDisplayNameEditForm').val(itemObject.displayName());
    form.find('#salePriceEditForm').val(itemObject.salePrice());


    // reset values
    form.find('#decreaseStockEditForm').val('');
    var formIncreaseStockSection = form.find('#editMaterialAddStockSection');
    formIncreaseStockSection.find('input').val('0');
    formIncreaseStockSection.find('#increaseStockEditForm').val('');

    // set supplier options
    var selectWrapper = form.find('#originSupplierEditForm');
    selectWrapper.empty();
    selectWrapper.append($('<option></option>').text(''));
    menuHandlers.handlers['Fornecedores'].getAllDisplayNames().forEach(function(item) {
        selectWrapper.append($('<option></option>').text(item));
    });
    selectWrapper.append($('<option></option>').text('N/A'));

    commonAddAndEditMaterialFormPreparations(form, itemObject, '#ownerSectionEditForm');
}

function activateAlreadyExistsDiv(msg, classToSet) {
    alreadyExistsDiv.removeClass();
    alreadyExistsDiv.addClass(classToSet);
    alreadyExistsDiv.find('p').text(msg);
    alreadyExistsDiv.show();
}
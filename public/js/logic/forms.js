var formHandlers;

function applyFormEvents() {
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
        originSupplierAddForm.change(function() {
            var state = $(originSupplierAddForm.children("option:selected")).val() === '';
            var dependentDiv = item.formWrapper.find(item.supplierDependentSelector);
            dependentDiv.find('input').prop('disabled', state);
            if(state === true) {
                dependentDiv.find('label[class*="formErrorColor"]').removeClass('formErrorColor');
            }
        });
    });

    addMaterial.find('#addMaterialSaveButton').on('click', saveFormClickFunction(addMaterial, function(e, postObj) {
        validateFormStringNotEmpty(addMaterial, 'materialDisplayNameAddForm', postObj);
        validateFormInteger(addMaterial, 'minimumStockAddForm', postObj);
        validateFormInteger(addMaterial, 'actualStockAddForm', postObj);
        validateFormSelect(addMaterial, 'originSupplierAddForm', postObj);
        validateFormDouble(addMaterial, 'boughtPriceAddForm', postObj);
        validateFormDouble(addMaterial, 'discountAddForm', postObj);
    }, '#ownerSectionAddForm', '/material/insertMaterialItem', function(addedObject) {
        mainContentHandlers.handlers['Material'].addItemToView(addedObject);
    }));

    editMaterial.find('#editMaterialSaveButton').on('click', saveFormClickFunction(editMaterial, function(e, postObj) {
        validateFormStringNotEmpty(editMaterial, 'materialDisplayNameEditForm', postObj);
        validateFormInteger(editMaterial, 'minimumStockEditForm', postObj);
        var increasingStock;
        if(editMaterial.find('#increaseStockEditForm').val() !== '') {
            validateFormInteger(editMaterial, 'increaseStockEditForm', postObj);
            increasingStock = true;
        }
        if(editMaterial.find('#decreaseStockEditForm').val() !== '') {
            validateFormInteger(editMaterial, 'decreaseStockEditForm', postObj);
            if(increasingStock === true) {
                editMaterial.find('label[for="increaseStockEditForm"], label[for="decreaseStockEditForm"]').addClass('formErrorColor');
                postObj.isValid = false;
            }
        }
        validateFormSelect(editMaterial, 'originSupplierEditForm', postObj);
        validateFormDouble(editMaterial, 'boughtPriceEditForm', postObj);
        validateFormDouble(editMaterial, 'discountEditForm', postObj);
    }, '#ownerSectionEditForm', '/material/editMaterialItem', function(editedObject) {
        mainContentHandlers.handlers['Material'].applyModificationsToItemOnView(editedObject);
    }));
}

function saveFormClickFunction(form, intermediaryValidations, ownerSectionIdSelector, postUrl, successCallback) {
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
                success: function(addedObject) {
                    successCallback(addedObject);
                    $('#wholeScreenOpacity').hide();
                    form.hide();
                }
            });
        }
    }
}

function getInputValueFunc(tmp) {
    return tmp.val();
}

function getInputValueNumberHandledFunc(tmp) {
    return handleNumberEntry(tmp.val());
}

function validateFormCommon(form, inputId, postObj, selectValueFunc, predicate) {
    var tmp = form.find('#' + inputId);
    var tmpValue = selectValueFunc(tmp);
    if(predicate(tmpValue) === false) {
        form.find('label[for="' + inputId + '"]').addClass('formErrorColor');
        postObj.isValid = false;
    } else {
        postObj.postContent[tmp.attr('name')] = tmpValue;
    }
}

function validateFormStringNotEmpty(form, inputId, postObj) {
    validateFormCommon(form, inputId, postObj, getInputValueFunc, isStringNotEmptySpaces);
}

function validateFormInteger(form, inputId, postObj) {
    validateFormCommon(form, inputId, postObj, getInputValueNumberHandledFunc, isPositiveInteger);
}

function validateFormDouble(form, inputId, postObj) {
    validateFormCommon(form, inputId, postObj, getInputValueNumberHandledFunc, isPositiveDouble);
}

function validateFormSelect(form, inputId, postObj) {
    validateFormCommon(form, inputId, postObj, function(tmp) {
        return tmp.find(':selected').text();
    }, function(tmpValue) {
        return !(!tmpValue || tmpValue === '');
    });
}

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
    selectWrapper.append($('<option></option>').text(''));
    menuHandlers.handlers['Fornecedores'].getAllDisplayNames().forEach(function(item) {
        selectWrapper.append($('<option></option>').text(item));
    });
    selectWrapper.append($('<option></option>').text('Outro'));

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
    obligatoryInputs.get(1).value = '0';
    wrapperFormDiv.find('>:nth-child(n+2) input').val('0');

    commonAddAndEditMaterialFormPreparations(form, sectionObject, '#ownerSectionAddForm', '#originSupplierAddForm', '#addMaterialSectionTitle');
}

function activateEditMaterialForm(itemObject) {
    var form = formHandlers.editMaterial;

    // set values based on item
    form.find('#editMaterialItemTitle').text(itemObject.displayName());
    form.find('#materialDisplayNameEditForm').val(itemObject.displayName());
    form.find('#minimumStockEditForm').val(itemObject.minimumStock());
    form.find('#actualStockEditForm').val(itemObject.actualStock());

    // reset values
    form.find('#decreaseStockEditForm').val('');
    var formIncreaseStockSection = form.find('#editMaterialAddStockSection');
    formIncreaseStockSection.find('input').val('0');
    formIncreaseStockSection.find('#increaseStockEditForm').val('');

    commonAddAndEditMaterialFormPreparations(form, itemObject.parent, '#ownerSectionEditForm', '#originSupplierEditForm', '#editMaterialSectionTitle');
}
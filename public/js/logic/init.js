(function() {
    var requestOnReadyAction = (function() {
        var isReady = false;
        var pendingActions = [];

        $(document).ready(function() {
            isReady = true;
            pendingActions.forEach(function(action) {
                action();
            })
        });

        return function(pendAction) {
            if(isReady === true) {
                pendAction();
            } else {
                pendingActions.push(pendAction);
            }
        }
    })();

    requestOnReadyAction(function() {
        applyFormEvents();
    });


    // start loading menu items and act when dom is ready
    $.ajax({
        url: '/menuItems',
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(menuContent) {
            requestOnReadyAction(function() {
                viewModel.setMenuItems(menuContent);
                ko.applyBindings(viewModel);
            });
        }
    });
})();




function loadContent() {

    applyFormEvents();

    //getMenuItems
    $.ajax({
        url: '/menuItems',
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(menuContent) {
            viewModel.setMenuItems(menuContent);
            ko.applyBindings(viewModel);
        }
    });
}
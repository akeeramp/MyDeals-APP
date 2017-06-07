angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController)
    .controller('AddWidgetCtrl', AddWidgetCtrl)
    .controller('CustomWidgetCtrl', CustomWidgetCtrl)
    .controller('WidgetSettingsCtrl', WidgetSettingsCtrl)
    .filter('object2Array', object2Array);

DashboardController.$inject = ['$scope', '$uibModal', '$timeout', '$window', 'objsetService'];
AddWidgetCtrl.$inject = ['$scope', '$timeout'];
CustomWidgetCtrl.$inject = ['$scope', '$uibModal'];
WidgetSettingsCtrl.$inject = ['$scope', '$timeout', '$rootScope', 'widget'];
object2Array.$inject = [];


function DashboardController($scope, $uibModal, $timeout, $window, objsetService) {
    $scope.scope = $scope;

    // init dashboard
    $scope.selectedDashboardId = '1';
    $scope.startDate = "1/1/2017";
    $scope.endDate = "12/31/2017";
    $scope.selectedCustomerId;


    // **** Customer Methods ****
    //
    $scope.custDs = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/api/Customers/GetMyCustomerNames"
            }
        }
    });
    $scope.selectCustomerOptions = {
        placeholder: "Select customers...",
        dataTextField: "CUST_NM",
        dataValueField: "CUST_SID",
        valuePrimitive: true,
        autoBind: false,
        autoClose: false,
        dataSource: $scope.custDs
    };
    //$scope.allCust = function (selectedCustomerIds, ds) {
    //    var data = ds.data();
    //    selectedCustomerIds.length = 0;
    //    for (var i = 0; i < data.length; i++) {
    //        selectedCustomerIds.push(data[i].CUST_SID);
    //    }
    //}
    //$scope.noCust = function (selectedCustomerIds) {
    //    selectedCustomerIds.length = 0;
    //}


    // **** LEFT NAVIGATION Methods ****
    //
    $scope.isLnavHidden = true;
    $scope.toggleLnav = function () {
        $scope.isLnavHidden = !$scope.isLnavHidden;
        $(window).trigger('resize');
        $scope.resizeEvent();
    }
    $scope.resizeEvent = function () {
        $timeout(function () {
            var evt = $window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 200);
            window.dispatchEvent(evt);
        });
    }

    $scope.saveLayout = function() {
        alert("This is where save will happen");
    }

    $scope.gridsterOptions = {
        margins: [20, 20],
        columns: 12,
        mobileModeEnabled: true,
        draggable: {
            handle: 'h3'
        },
        resizable: {
            enabled: true,
            handles: ['ne', 'se', 'sw', 'nw'],

            // optional callback fired when resize is started
            start: function (event, $element, widget) { },

            // optional callback fired when item is resized,
            resize: function (event, $element, widget) {
                if (widget.resizeEvent !== undefined) widget.resizeEvent(widget);
            },

            // optional callback fired when item is finished resizing
            stop: function (event, $element, widget) {
                $timeout(function () {
                    if (widget.resizeEvent !== undefined) widget.resizeEvent(widget);
                }, 400);
            }
        }
    };

    $scope.dashboarddata = {
        "widgets": widgetConfig.getAllWidgets(objsetService),
        "current": []
    };
   
    // widget events
    $scope.events = {
        resize: function (e, scope) {
            $timeout(function () {
                if (scope.api && scope.api.update) scope.api.update();
            }, 200);
        }
    };

    $scope.config = { visible: false };

    //make chart visible after grid have been created
    $timeout(function () {
        $scope.config.visible = true;
    }, 200);

    //subscribe widget on window resize event
    angular.element(window).on('resize', function (e) {
        $scope.$broadcast('resize');
    });

    // grid manipulation
    $scope.clear = function () {
        $scope.dashboarddata.current = [];
    };

    $scope.addWidget = function () {
        $scope.dashboarddata.current.push({
            name: "New Widget",
            sizeX: 1,
            sizeY: 1
        });
    };

    $scope.openAddWidget = function () {
        $scope.modalInstance = $uibModal.open({
            scope: $scope,
            controller: 'AddWidgetCtrl',
            templateUrl: 'app/dashboard/views/addWidget.html'
        });
    };


    $scope.dashboards = widgetConfig.getAllWidgetLayouts();

    $scope.$watch('selectedDashboardId', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.addWidgetByKey($scope, $scope.selectedDashboardId);
        } else {
            $scope.addWidgetByKey($scope, $scope.selectedDashboardId);
        }
    });

    $scope.refreshWidgets = function () {
        if (!this.$angular_scope)
            this.broadcastRefresh(this);
        else
            this.$angular_scope.broadcastRefresh(this.$angular_scope);
    }
    $scope.broadcastRefresh = function (scope) {
        $timeout(function () {
            $scope.$broadcast('refresh', { "custId": scope.selectedCustomerId, "startDate": scope.startDate, "endDate": scope.endDate });
        }, 200);
    }
    $scope.refresh = function(widget) {
        $scope.broadcastRefresh($scope);
    }

    $scope.changeDashboard = function (scope, key) {
        $scope.addWidgetByKey(scope, key);
    }
    $scope.addWidgetByKey = function (scope, key) {
        scope.clear();

        $timeout(function () {
            var widgets = scope.dashboards[key].widgets;
            for (var i = 0; i < widgets.length; i++) {
                var widget = util.clone($scope.dashboarddata.widgets[widgets[i].id]);
                if (widgets[i].sizeX !== undefined) widget.sizeX = widgets[i].sizeX;
                if (widgets[i].sizeY !== undefined) widget.sizeY = widgets[i].sizeY;
                if (widgets[i].row !== undefined) widget.row = widgets[i].row;
                if (widgets[i].col !== undefined) widget.col = widgets[i].col;
                if (widgets[i].name !== undefined) widget.name = widgets[i].name;
                scope.dashboarddata.current.push(widget);
            }
        }, 600);
    }
}

function AddWidgetCtrl($scope, $timeout, $rootScope) {

    $scope.widgets = $scope.$parent.dashboarddata.widgets;

    $scope.dismiss = function () {
        $scope.$parent.modalInstance.dismiss();
    };

    $scope.add = function (widget) {
        $scope.$parent.dashboarddata.current.push(util.clone(widget));
        $scope.$parent.modalInstance.close();
    };

}

function CustomWidgetCtrl($scope, $uibModal) {

    $scope.remove = function (widget) {
        $scope.dashboarddata.current.splice($scope.dashboarddata.current.indexOf(widget), 1);
    };

    $scope.openSettings = function (widget) {
        $scope.modalInstance = $uibModal.open({
            scope: $scope,
            controller: 'WidgetSettingsCtrl',
            templateUrl: 'app/dashboard/views/widgetSettings.html',
            resolve: {
                widget: function () {
                    return widget;
                }
            }
        });
    };

}

function WidgetSettingsCtrl($scope, $timeout, $rootScope, widget) {
    $scope.widget = widget;

    $scope.form = {
        name: widget.name
    };

    $scope.dismiss = function () {
        $scope.$parent.modalInstance.dismiss();
    };

    $scope.submit = function () {
        angular.extend(widget, $scope.form);
        $scope.$parent.modalInstance.close(widget);
    };
}

function object2Array() {
    return function (input) {
        var out = [];
        for (var i in input) {
            out.push(input[i]);
        }
        return out;
    }
}




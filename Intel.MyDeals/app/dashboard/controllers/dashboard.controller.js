angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController)
    .controller('AddWidgetCtrl', AddWidgetCtrl)
    .controller('CustomWidgetCtrl', CustomWidgetCtrl)
    .controller('WidgetSettingsCtrl', WidgetSettingsCtrl)
    .filter('object2Array', object2Array);

DashboardController.$inject = ['$scope', '$uibModal', '$timeout', '$window', '$localStorage', 'objsetService', 'securityService', 'userPreferencesService', 'logger'];
AddWidgetCtrl.$inject = ['$scope', '$timeout'];
CustomWidgetCtrl.$inject = ['$scope', '$uibModal'];
WidgetSettingsCtrl.$inject = ['$scope', '$timeout', '$rootScope', 'widget'];
object2Array.$inject = [];

function DashboardController($scope, $uibModal, $timeout, $window, $localStorage, objsetService, securityService, userPreferencesService, logger) {
    $scope.scope = $scope;
    $scope.$storage = $localStorage;

    $scope.$storage = $localStorage.$default({
        selectedDashboardId: '1',
        startDate: "1/1/2017",
        endDate: "12/31/2017",
        selectedCustomerId: ''
    });

    // init dashboard
    $scope.selectedDashboardId = $scope.$storage.selectedDashboardId;
    $scope.startDate = $scope.$storage.startDate;
    $scope.endDate = $scope.$storage.endDate;
    $scope.selectedCustomerId = $scope.$storage.selectedCustomerId;

    $scope.C_CREATE_CONTRACT = securityService.chkDealRules('C_CREATE_CONTRACT', window.usrRole, null, null, null);

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

    $scope.saveLayout = function () {
        // Save the current widget settings (size, position, etc.).
        userPreferencesService.updateAction(
            	"Dashboard", // CATEGORY
            	"Widgets", // SUBCATEGORY
            	$scope.selectedDashboardId, // ID
            	JSON.stringify($scope.dashboardData.currentWidgets)) // VALUE
            .then(function (response) {
            }, function (response) {
                logger.error("Unable to update User Preferences.", response, response.statusText);
            });
    }

    $scope.gridsterOptions = {
        margins: [20, 10], // TODO: the resize bug will show in browser resoltuions of around 1558x742. We still need to fix this
        columns: 18,
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

    $scope.dashboardData = {
        "allWidgets": widgetConfig.getAllWidgets(objsetService),
        "currentWidgets": []
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
        $scope.dashboardData.currentWidgets = [];
    };

    $scope.addWidget = function () {
        $scope.dashboardData.currentWidgets.push({
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

    $scope.defaultLayout = function () {
        // By setting the third parameter to 'false', any saved widget settings will
        // not be used.  So, we will get the default widget settings.
        $scope.addWidgetByKey($scope, $scope.selectedDashboardId, false);
    };

    $scope.dashboards = widgetConfig.getAllWidgetLayouts();

    $scope.$watch('selectedDashboardId', function (newVal, oldVal) {
        $scope.addWidgetByKey($scope, $scope.selectedDashboardId, true);
    });

    $scope.refreshWidgets = function () {
        if (!this.$angular_scope)
            this.broadcastRefresh(this);
        else
            this.$angular_scope.broadcastRefresh(this.$angular_scope);
    }
    $scope.broadcastRefresh = function (scope) {
        $timeout(function () {
            // Save settings to local storage
            $scope.$storage.selectedDashboardId = scope.selectedDashboardId;
            $scope.$storage.startDate = scope.startDate;
            $scope.$storage.endDate = scope.endDate;
            $scope.$storage.selectedCustomerId = scope.selectedCustomerId;

            $scope.$broadcast('refresh', { "custId": scope.selectedCustomerId, "startDate": scope.startDate, "endDate": scope.endDate });
        }, 200);
    }
    $scope.refresh = function (widget) {
        $scope.broadcastRefresh($scope);
        widget.refreshEvent(widget);
    }

    $scope.changeDashboard = function (scope, key) {
        $scope.addWidgetByKey(scope, key, true);
    }

    $scope.getSavedWidgetSettings = function (scope, key) {
        $scope.savedWidgetSettings = null;

        userPreferencesService.getActions("Dashboard", "Widgets")
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    // Get the saved widget settings for the specified key (user role).
                    var savedWidgetSettingsForSpecifiedRole = response.data.filter(function (obj) {
                        return obj.PRFR_KEY == key;
                    });

                    if (savedWidgetSettingsForSpecifiedRole && savedWidgetSettingsForSpecifiedRole.length > 0) {
                        $scope.savedWidgetSettings = JSON.parse(savedWidgetSettingsForSpecifiedRole[0].PRFR_VAL);
                    }
                }
            }, function (response) {
                logger.error("Unable to get User Preferences.", response, response.statusText);
            });
    }

    $scope.addWidgetByKey = function (scope, key, useSavedWidgetSettings) {
        $scope.clear();

        // Get any widget settings that were previously saved to the database for the specified key (user role).
        $scope.getSavedWidgetSettings(scope, key);

        $timeout(function () {
            if (useSavedWidgetSettings && $scope.savedWidgetSettings && $scope.savedWidgetSettings.length > 0) {
                // There are saved widget settings, so use them.

                var widgetArr = $scope.dashboardData.allWidgets;

                Object.keys(widgetArr).forEach(function (key) {
                    var widgetToAdd = util.clone(widgetArr[key]);

                    // Get the saved settings for the current widget.
                    var currentWidgetSavedSetting = $scope.savedWidgetSettings.filter(function (obj) {
                        return obj.id == widgetToAdd.id;
                    });

                    // If there is a saved settings for the current widget, use it to set the size and position of the widget.  If there isn't any
                    // saved settings for the current widget, it means that the widget should stay hidden by default.
                    if (currentWidgetSavedSetting && currentWidgetSavedSetting.length > 0) {
                        widgetToAdd.size = currentWidgetSavedSetting[0].size;
                        widgetToAdd.position = currentWidgetSavedSetting[0].position;
                        widgetToAdd.name = currentWidgetSavedSetting[0].name;

                        $scope.dashboardData.currentWidgets.push(widgetToAdd);
                    }
                });
            } else {
                // There are no saved widget settings, so use the layout (default) widget settings.

                var widgetLayoutArr = $scope.dashboards[key].widgets;

                for (var i = 0; i < widgetLayoutArr.length; i++) {
                    var widgetLayout = util.clone(widgetLayoutArr[i]);
                    var widgetToAdd = util.clone($scope.dashboardData.allWidgets[widgetLayout.id]);

                    if (widgetLayout.defaultSize !== undefined) widgetToAdd.size = widgetLayout.defaultSize;
                    if (widgetLayout.defaultPosition !== undefined) widgetToAdd.position = widgetLayout.defaultPosition;
                    if (widgetLayout.name !== undefined) widgetToAdd.name = widgetLayout.name;

                    $scope.dashboardData.currentWidgets.push(widgetToAdd);
                }
            }
        }, 600);
    }
}

function AddWidgetCtrl($scope, $timeout, $rootScope) {
    // All widgets are shown in the add dialog, but if the widget is already being shown in the dashboard, then
    // canAdd will be set to false so that it can be disabled in the add dialog.
    $scope.widgets = $scope.$parent.dashboardData.allWidgets;
    Object.keys($scope.widgets).forEach(function (key) {
        $scope.widgets[key].canAdd = true;
        for (var i = 0; i < $scope.$parent.dashboardData.currentWidgets.length; i++) {
            if ($scope.$parent.dashboardData.currentWidgets[i].id == $scope.widgets[key].id) {
                $scope.widgets[key].canAdd = false;
                break;
            }
        }
    });

    $scope.dismiss = function () {
        $scope.$parent.modalInstance.dismiss();
    };

    $scope.add = function (widget) {
        if (widget.canAdd) {
            var widgetToAdd = util.clone(widget);
            widgetToAdd.position = null; // Don't set a position, so that the widget will be added "smartly" wherever space is available.
            $scope.$parent.dashboardData.currentWidgets.push(widgetToAdd);

            $scope.$parent.modalInstance.close();
        }
    };

}

function CustomWidgetCtrl($scope, $uibModal) {

    $scope.remove = function (widget) {
        $scope.dashboardData.currentWidgets.splice($scope.dashboardData.currentWidgets.indexOf(widget), 1);
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

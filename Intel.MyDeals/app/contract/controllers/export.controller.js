(function () {
    'use strict';

angular
    .module('app.contract')
        .controller('exportController', exportController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];


exportController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal'];

function exportController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal) {
    kendo.culture("en-US");

    var root = $scope.$parent;	// Access to parent scope
    $scope.root = root;
    $scope.data = {};
    $scope.timelineData = [];
    $scope.loading = true;
    $scope.msg = "Loading Contract Data";

    $scope.showField = function (data, field, tmplt, objType) {
        var val = data[field];
        if (val === undefined || val === null) val = "";
        if (typeof val === 'string') val = val.replace(/,/g, ', ');

        if ($scope.root.templates.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].type === 'number') {
            var format = $scope.root.templates.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].format;
            if (format === "{0:c}") format = "c";
            if (format === "{0:n}") format = "n";
            if (format === "{0:d}") format = "d";
            if (val !== "" && !isNaN(val)) {
                val = kendo.toString(parseFloat(val), format);
            }
        }

        return val;
    }
    $scope.showTitle = function (title) {
        return title.replace(/\*/g, '');
    }
    $scope.showObjType = function(objType) {
        if (objType === "KIT") return "Kit";
        if (objType === "ECAP") return "ECAP";
        if (objType === "PROGRAM") return "Program";
        if (objType === "VOL_TIER") return "Volume Tier";
        return "";
    }

    $scope.timelineDs = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: "api/Timeline/GetTimelineDetails/" + $scope.root.contractData.DC_ID + "/1",
                type: "GET",
                dataType: "json"
            }
        },
        requestEnd: function (e) {
            $scope.timelineData = e.response;
        }
    });

    $scope.exportDs = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: "/api/Contracts/v1/getExportContract/" + $scope.root.contractData.DC_ID,
                type: "GET",
                dataType: "json"
            }
        },
        requestEnd: function (e) {
            $scope.msg = "Done";
            $scope.data = e.response[0];
            $timeout(function () {
                $scope.loading = false;
            }, 500);
        }
    });

    $scope.timelineDs.read();
    $scope.exportDs.read();

}
})();

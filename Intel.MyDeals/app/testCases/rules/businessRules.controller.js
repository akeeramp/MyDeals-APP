(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('businessRulesController', businessRulesController);

    businessRulesController.$inject = ['$uibModal', '$scope', 'gridConstants'];

    function businessRulesController($uibModal, $scope, gridConstants) {

        var gTools = new gridTools(
            {
                "fields": {
                    "Title": { type: "string" },
                    "ActionRule": { type: "string" },
                    "AtrbCondIf": { type: "string" },
                    "InObjSetType": { type: "string" },
                    "InObjType": { type: "string" },
                    "InRoles": { type: "string" },
                    "InStages": { type: "string" },
                    "NotInRoles": { type: "string" },
                    "NotInStages": { type: "string" },
                    "OpRuleActions": { type: "string" },
                    "OpRuleElseActions": { type: "string" },
                    "Triggers": { type: "string" },
                    "WithoutTracker": { type: "string" },
                    "WithTracker": { type: "string" }
                }
            },
            [
                { field: "Title", title: " Title" },
                { field: "InObjSetType", title: " InObjSetType", template: "#: InObjSetType.join() #" },
                { field: "InObjType", title: " InObjType", template: "#: InObjType.join() #" },
                { field: "InRoles", title: " InRoles", template: "#: InRoles.join() #" },
                { field: "InStages", title: " InStages", template: "#: InStages.join() #" },
                { field: "NotInRoles", title: " NotInRoles", template: "#: NotInRoles.join() #" },
                { field: "NotInStages", title: " NotInStages", template: "#: NotInStages.join() #" },
                { field: "Triggers", title: " Triggers", template: "#: Triggers.join() #" },
                { field: "WithoutTracker", title: " WithoutTracker" },
                { field: "WithTracker", title: " WithTracker" }
            ]);
    //{ field: "ActionRule", title: " ActionRule" },
    //{ field: "AtrbCondIf", title: " AtrbCondIf" },
    //{ field: "OpRuleActions", title: " OpRuleActions" },
    //{ field: "OpRuleElseActions", title: " OpRuleElseActions" },


        $scope.loadData = function() {

            $scope.rulesGridOptions = {
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/Rules/GetBusinessRules",
                            dataType: "json"
                        }
                    },
                    error: function (e) {
                        // handle data operation error
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    batch: true,
                    schema: {
                    }
                }),
                columns: gTools.cols,
                scrollable: true,
                sortable: true,
                editable: true,
                pageable: {
                    refresh: true,
                    pageSizes: gridConstants.pageSizes
                },
                navigatable: true,
                filterable: true,
                groupable: true,
                resizable: true,
                reorderable: true,
                columnMenu: false
            };

        };

        $scope.loadData();
    };
})();


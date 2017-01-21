(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleController', RuleController)

    RuleController.$inject = ['$uibModal', 'ruleService', '$scope', 'logger']

    function RuleController($uibModal, ruleService, $scope, logger) {
        var vm = this;
        
        // Functions
        //vm.addItem = addItem;
        //vm.updateItem = updateItem;
        //vm.deleteItem = deleteItem
        vm.rsOnChange = rsOnChange;

        // Variables
        vm.selectedItem = null;
        vm.selectedRuleSet = {Id: 0};
        //vm.isButtonDisabled = true;

        vm.riDataSource = {};
        vm.rcDataSource = {};
        vm.rtPassedDataSource = {};
        vm.rtFailedDataSource = {};

        vm.conditionData = {};

        //GET ruleset data
        vm.rsDataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    ruleService.getRuleSets()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get RuleSets.", response, response.statusText);
                        });
                },
            },
            batch: true,
            schema: {
                model: {
                }
            }
        });

        //promise for GET ruleitem data
        function getRIDataSource() {
            return new Promise(function(resolve, reject) {
                ruleService.getRuleItemById(vm.selectedRuleSet["Id"])
                        .then(function (response) {
                            vm.riDataSource = response.data;
                            resolve();
                        }, function (response) {
                            logger.error("Unable to get Rule Item.", response, response.statusText);
                            reject();
                        });
            })
        };

        //promise for GET rulecondition data
        function getRCDataSource() {
            return new Promise(function(resolve, reject) {
                ruleService.getRuleConditionsByRuleId(vm.selectedRuleSet["Id"])
                        .then(function (response) {
                            vm.rcDataSource = response.data;
                            resolve();
                        }, function (response) {
                            logger.error("Unable to get Rule Conditions.", response, response.statusText);
                            reject();
                        });
            })
        };

        //GET ruletask data for passed condition
        function getPassedRTDataSource() {
            ruleService.getPassedRuleTasksByRuleId(vm.selectedRuleSet["Id"])
                        .then(function (response) {
                            vm.rtPassedDataSource = response.data;
                        }, function (response) {
                            logger.error("Unable to get Rule Tasks.", response, response.statusText);
                        });
        }

        //GET ruletask data for failed condition
        function getFailedRTDataSource() {
            ruleService.getFailedRuleTasksByRuleId(vm.selectedRuleSet["Id"])
                        .then(function (response) {
                            vm.rtFailedDataSource = response.data;
                        }, function (response) {
                            logger.error("Unable to get Rule Tasks.", response, response.statusText);
                        });
        }

        //grid options for ruleset sidebar - TODO: replace kendo grid? something with drag&drop could be nice
        vm.rsGridOptions = {
            dataSource: vm.rsDataSource,
            selectable: true,
            pageable: false,
            editable: "popup",
            change: vm.rsOnChange,
            columns: [
            {
                field: "Name",
                title: "Rule Set Name"
            }
            ]
        }

        //triggered when user selects a ruleset
        function rsOnChange() {
            var rsGrid = $scope.ruleSetsGrid;
            vm.selectedItem = rsGrid.select();
            vm.selectedRuleSet = rsGrid.dataItem(vm.selectedItem);

            getPassedRTDataSource();
            getFailedRTDataSource();

            Promise.all([getRIDataSource(),getRCDataSource()]).then(function(){
                createConditionStructure();
            })
        }

        //used when RuleItem/RuleCondition GET promises are resolved, populates conditionData which is used by the queryBuilder directive
        function createConditionStructure() {

            var rootConditionId = vm.riDataSource.RuleConditionId;
            var rootConditionObject = getCondition(rootConditionId)
            
            vm.conditionData = conditionToJson(rootConditionObject);
        }

        //creates json for queryBuilder to turn into html
        function conditionToJson(condition) {
            var retJson = {};
            if (condition.ConditionType == "AND" || condition.ConditionType == "OR") {
                retJson.group = {
                    operator: condition.ConditionType,
                    rules: []
                }
                if (condition.ChildConditionIds != null && condition.ChildConditionIds.length != 0) {
                    //for each child, push into rules the recursive call
                    for (var i = 0; i<condition.ChildConditionIds.length; i++) {
                        var childCondition = getCondition(condition.ChildConditionIds[i]);
                        retJson.group.rules.push(conditionToJson(childCondition))
                    }
                }
            } else {
                retJson.criteria = condition.LeftExpressionValue;
                retJson.condition = condition.Operator;
                retJson.data = condition.RightExpressionValue;
            }
            return retJson;
        }

        //retrieves condition object given condition id
        function getCondition(conditionId) {
            //assumes this is only called after cm.rcDataSource has been populated
            for (var i = 0; i<vm.rcDataSource.length; i++) {
                if (vm.rcDataSource[i].Id == conditionId) {
                    return vm.rcDataSource[i];
                }
            }
        }

        

        ////TODO: save update delete
        //function addItem() {
        //    vm.isButtonDisabled = true;
        //    $scope.grid.addRow();
        //}
        //function updateItem() {
        //    $scope.grid.editRow(vm.selectedItem);
        //}
        //function deleteItem() {
        //    $scope.grid.removeRow(vm.selectedItem);
        //}
    }
})();
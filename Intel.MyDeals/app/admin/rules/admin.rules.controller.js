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
        
        //vm.rsOnChange = rsOnChange; //relic of kendo grid, DELETE ME

        // Variables
        vm.selectedItem = null;
        vm.selectedRuleSet = {Id: 0};
        //vm.isButtonDisabled = true;

        vm.rsDataSource = [];
        vm.riDataSource = {};
        vm.rcDataSource = [];
        vm.rtPassedDataSource = [];
        vm.rtFailedDataSource = [];

        vm.conditionData = [];

        getRSDataSource(); //TODO: put this call in an init section?

        //GET ruleset data
        function getRSDataSource() {
            ruleService.getRuleSets()
                        .then(function (response) {
                            vm.rsDataSource = response.data;
                        }, function (response) {
                            logger.error("Unable to get RuleSets.", response, response.statusText);
                        });
        }

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


        //triggered when user selects a ruleset
        vm.selectRuleSet = function(ruleset) {
            vm.selectedRuleSet = ruleset;
            getPassedRTDataSource();
            getFailedRTDataSource();

            Promise.all([getRIDataSource(),getRCDataSource()]).then(function(){
                createConditionStructure();
            })
        }

        //used when RuleItem/RuleCondition GET promises are resolved, populates conditionData which is used by the queryBuilder directive
        function createConditionStructure() {
            var rootConditionObject;
            if (vm.riDataSource == null) {
                //TODO: do this on c# side so we do not hard code the structure into js file
                vm.riDataSource = {
                    Id: -1,
                    RuleConditionId: -1,
                    RulePassedTaskIds: [],
                    RuleFailedTaskIds: [],
                    Tier: "C#"
                }
                //TODO: do this on c# side so we do not hard code the structure into js file
                rootConditionObject = {
                    Id: -1,
                    ConditionType: "AND",
                    Operator: "",
                    LeftExpressionType: "",
                    LeftExpressionValue: "",
                    RightExpressionType: "",
                    RightExpressionValue: "",
                    RuleId: -1,
                    ParentConditionId: 0,
                    ChildConditionIds: []
                };
            } else {
                rootConditionObject = getCondition(vm.riDataSource.RuleConditionId);
            }
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
                retJson.lefttype = condition.LeftExpressionType;
                retJson.leftvalue = condition.LeftExpressionValue;
                retJson.condition = condition.Operator;
                retJson.righttype = condition.RightExpressionType;
                retJson.rightvalue = condition.RightExpressionValue;
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

        vm.removeTask = function(task, successtype) {
            var reference = getTaskByType(successtype);
            var index = reference.indexOf(task);
            if (index > -1) {
                reference.splice(index, 1);
            }
        }

        vm.addTask = function(successtype) {
            var reference = getTaskByType(successtype);
            //TODO: do this on c# side so we do not hard code the structure into js file
            reference.push({
                Id: -1,
                Function: '',
                Params: '',
                RuleId: vm.riDataSource.Id,
                Order: 0,
                SuccessType : successtype
            })
        }

        vm.addRule = function () {
            resetData();
            //TODO: do this on c# side so we do not hard code the structure into js file
            vm.rsDataSource.push({
                Id: -1,
                Name: 'New Rule',
                Description: 'Add Description',
                Trigger: '',
                Category: '',
                SubCategory: '',
                RuleId: -1,
                Order: 0
            })

            vm.selectRuleSet(vm.rsDataSource[vm.rsDataSource.length -1]);
        }

        vm.removeRule = function () {
            var index = vm.rsDataSource.indexOf(vm.selectedRuleSet);
            if (index > -1) {
                vm.rsDataSource.splice(index, 1);
            }
            vm.selectedRuleSet = { Id: 0 };

            resetData();
            //TODO: need to properly DELETE relevant rule item/condition/tasks as well
        }

        var resetData = function () {
            vm.riDataSource = {};
            vm.rcDataSource = [];
            vm.rtPassedDataSource = [];
            vm.rtFailedDataSource = [];
        }

        var getTaskByType = function(successtype) {
            if (successtype == true) {
                return vm.rtPassedDataSource;
            } else {
                return vm.rtFailedDataSource;
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
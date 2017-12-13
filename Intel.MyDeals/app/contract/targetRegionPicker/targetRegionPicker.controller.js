(function () {
    'use strict';
    angular
       .module('app.admin')
        .controller('TargetRegionPickerController', TargetRegionPickerController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    TargetRegionPickerController.$inject = ['$filter', '$scope', '$uibModalInstance', 'targetRegionData', 'dataService', 'logger'];

    function TargetRegionPickerController($filter, $scope, $uibModalInstance, targetRegionData, dataService, logger) {
        var vm = this;
        vm.targetRegionData = targetRegionData;

        vm.lookupURLWithGeo = vm.targetRegionData.LOOKUPURL + vm.targetRegionData.GEO_MBR_SID;


        vm.ok = function () {
            var returnVal = "";
            if (vm.targetRegionData.TRGT_RGN !== undefined) {
                returnVal = vm.targetRegionData.TRGT_RGN;
            }

            $uibModalInstance.close(returnVal);
        };

        vm.close = function () {
            $uibModalInstance.dismiss();
        }

        var newlyAdded = function (newVals, oldVals) { //both inputs are assumed to be arrays
            var ret = [];
            for (var i = 0; i < newVals.length; i++) {
                if (oldVals.indexOf(newVals[i]) < 0) {
                    //newval item not in oldval
                    ret.push(newVals[i]);
                }
            }
            return ret;
        }

        var removeChildren = function (original, modifier) { //both inputs are assumed to be arrays
            var ret = original;

            var smallestVal = highestTier(modifier, 3);

            //remove everything from original that is in modifier except for the highest tier (smallestVal)
            for (var i = 0; i < modifier.length; i++) {
                if (modifier[i] != smallestVal) {
                    ret.splice(ret.indexOf(modifier[i]), 1)
                }
            }

            return ret;
        }

        var highestTier = function (arr, maxTier) { //input is assumed to be an array
            var curSize;
            var smallestSize = maxTier + 1;
            var smallestVal;

            //find modifier's highest tier.  this will be the one with the shortest hierarchy string
            for (var i = 0; i < arr.length; i++) {
                curSize = arr[i].split("/").length
                if (curSize < smallestSize) {
                    smallestSize = curSize;
                    smallestVal = arr[i];
                }
            }

            return smallestVal;
        }

        var enforceSingleGeos = function (added, current) { //both inputs are arrays
            var ret = current;
            var addItem = highestTier(added, 3);

            ret = ret.filter(function (item) { return (item === addItem) || (addItem.split("/")[0] !== item.split("/")[0]) })
            return ret;
        }

        //toggles all given tree view nodes to the "checked" boolean state
        function setAllNodes(nodes, checked) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].set("checked", checked);

                if (nodes[i].hasChildren) {
                    setAllNodes(nodes[i].children.view(), checked);
                }
            }
        }

        //given a treeview and array, check all tree nodes that contain a matching value in the array
        function checkGiven(treeView, arr) {
            for (var i = 0; i < arr.length; i++) {
                treeView.dataItem(treeView.findByText(arr[i])).set("checked", true);
            }
        }

        $scope.$watch('vm.targetRegionData.TRGT_RGN',
		function (newValue, oldValue, el) {
		    
		    if (oldValue === newValue) return;

		    if (oldValue === undefined || newValue === undefined) return;

		    if (oldValue != null && newValue == null) return;

		    if (oldValue == null && newValue != null) {
		        oldValue = "";
		    }
		    else {
				var treeView = $("#TRGT_RGN").data("kendoTreeView");
				var multiSelect = $("#TRGT_RGN_MS").data("kendoMultiSelect");
		        
		        //thought: if user selects a REGION/COUNTRY pair with only one COUNTRY, just select the REGION?
		        //thought: if we move the VerticalEmbeddedMultiSelect op-extra from checkChildren to custom MS/LV syncing behavior, maybe we can get child and partial checkboxing to work correctly?

				var addedValues = newlyAdded(newValue, oldValue)
		        //if no added values (only remove) then we don't need to do anything right?
				if (addedValues.length !== 0) {

				    newValue = enforceSingleGeos(addedValues, newValue);
                    multiSelect.value(newValue)

				    
				} else {
				    //this is the uncheck case - which covers when a user clicks a country within a region that has been checked (or region within entire geo
                    //for now we do nothing here, but if we aim to get child-checking and partial checkChildren enabled we would likely need to account uncheck scenarios here
				}

                //reset all checkboxes
				setAllNodes(treeView.dataSource.view(), false);
		        //check all applicable boxes
				checkGiven(treeView, newValue);

				vm.targetRegionData.TRGT_RGN = newValue;
		    }

		}, true);
    }
})();
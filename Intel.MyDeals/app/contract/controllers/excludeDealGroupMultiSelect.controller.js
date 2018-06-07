angular
    .module('app.contract')
    .controller('ExcludeDealGroupMultiSelectCtrl', ExcludeDealGroupMultiSelectCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

ExcludeDealGroupMultiSelectCtrl.$inject = ['$scope', '$uibModalInstance', 'dataService', 'logger', 'dataItem', 'cellCurrValues', 'cellCommentValue', 'colInfo', 'enableCheckbox', 'excludeOutliers', '$timeout'];

function ExcludeDealGroupMultiSelectCtrl($scope, $uibModalInstance, dataService, logger, dataItem, cellCurrValues, cellCommentValue, colInfo, enableCheckbox, excludeOutliers, $timeout) {
	var vm = this;

	var selectedGridDict = {};
	vm.returnVal = {};
	vm.cellCurrValues = angular.copy(cellCurrValues);
	vm.returnVal.DEAL_GRP_CMNT = (cellCommentValue === null) ? "" : cellCommentValue;
	vm.colInfo = colInfo;
	vm.isLoading = true;
	vm.gridData = [];
	vm.hasComment = false;
	vm.hasCheckbox = enableCheckbox;
    vm.DC_ID = dataItem.DC_ID;
    vm.delCounter = 0;
    vm.IS_EXCLUDED = [];
    vm.toggleMessage = 'Off';
    vm.toggleClass = 'txtOff';

    var filter = {};
    if (excludeOutliers) {
        filter = { field: "GRP_BY", operator: "eq", value: 0 }
    }
    vm.filterData = function (e) {
        if (e) {
            dataSourceSuggested.filter({ field: "selected", operator: "eq", value: true });
            vm.toggleMessage = 'On';
            vm.toggleClass = 'txtOn';
            dataSourceSuggested.read(); 
            vm.delCounter = 0;
        }
        else {
            vm.delCounter = 0;
            vm.toggleMessage = 'Off';
            vm.toggleClass = 'txtOff';
            dataSourceSuggested.filter({});
            dataSourceSuggested.read();            
        }
        
    }
    var dataSourceSuggested = new kendo.data.DataSource({
		transport: {
			read: function (e) {

			    var currValsArr = [];

			    if (vm.cellCurrValues === "calc") {
			        for (var i = 0; i < vm.gridData.length; i++) {
			            if (vm.gridData[i]["EXCLD_DEAL_FLAG"] === 1) {
			                currValsArr.push(vm.gridData[i]["OVLP_DEAL_ID"]);
			            }
			        }
			    } else {
			        currValsArr = vm.cellCurrValues.replace(/ /g, '').split(',');
			    }

				// put in dictionary for easier lookup
				for(var i=0; i<currValsArr.length; i++){
					selectedGridDict[currValsArr[i]] = true;
				}

				// find all curr passed in values in our list and select them
				for (var i = 0; i < vm.gridData.length; i++) {
				    var exChk = vm.gridData[i]["EXCLD_DEAL_FLAG"];
				    var cstChk = vm.gridData[i]["CST_MCP_DEAL_FLAG"];
                    if (vm.gridData[i]["SELF_OVLP"] !== 1) {
                        if (cstChk === 1 || (cstChk === 0 && exChk === 1)) {
                            vm.gridData[i]["GRP_BY"] = 0;
                        } else if (cstChk === 0) {
                            vm.gridData[i]["GRP_BY"] = 1;
                        } else if (cstChk === 2) {
                            vm.gridData[i]["GRP_BY"] = 0;
                        } else {
                            vm.gridData[i]["GRP_BY"] = 1;
                        }
                    }

				    if (selectedGridDict.hasOwnProperty(vm.gridData[i].OVLP_DEAL_ID)) {
						vm.gridData[i].selected = true;
                    }
                    
                    if (vm.IS_EXCLUDED.indexOf(vm.gridData[i]["OVLP_DEAL_ID"]) > -1) {
                        vm.gridData[i]["IS_TOUCHED"] = 1;
                    }

                }               

                e.success(vm.gridData);

			}
		},
		sort: [
            { field: "EXCLD_DEAL_FLAG", dir: "desc" },
            { field: "CST_MCP_DEAL_FLAG", dir: "desc" }
		],
        group: {
            field: "GRP_BY"
        },
        filter: filter,
		schema: {
			model: {
			    fields: {
			        CST_MCP_DEAL_FLAG: { type: "number"},
			        EXCLD_DEAL_FLAG: {},
			        OVLP_ADDITIVE: {},
			        OVLP_CNSMPTN_RSN: {},
					OVLP_CNTRCT_NM: {},
				    OVLP_DEAL_DESC: {},
				    OVLP_DEAL_END_DT: { type: "date" },
					OVLP_DEAL_ID: {},
					OVLP_DEAL_STRT_DT: { type: "date" },
					OVLP_DEAL_TYPE: {},
					OVLP_ECAP_PRC: { type: "number" },
					OVLP_MAX_RPU: { type: "number" },
					OVLP_WF_STG_CD: {},
					selected: {type:"boolean"}
				}
			} 
		}
	});

	function init() {

	    return dataService.get(colInfo.lookupUrl + "/" + dataItem["DC_ID"]).then(
			function (response) {
			    vm.gridData = response.data;

			    var ecap = dataItem["ECAP_PRICE"] === undefined || dataItem["ECAP_PRICE"] === null
                    ? ""
                    : (dataItem["ECAP_PRICE"]["20___0"] === undefined || dataItem["ECAP_PRICE"]["20___0"] === null)
			            ? dataItem["ECAP_PRICE"]
			            : dataItem["ECAP_PRICE"]["20___0"];

			    var cntrctTtl = "Product: " + ((dataItem["TITLE"].length > 100) ? dataItem["TITLE"].substr(0, 100) + "..." : dataItem["TITLE"]);

			    vm.gridData.unshift({
			        CST_MCP_DEAL_FLAG: 2,
			        EXCLD_DEAL_FLAG: 2,
			        OVLP_ADDITIVE: dataItem["DEAL_COMB_TYPE"],
			        OVLP_CNSMPTN_RSN: dataItem["CONSUMPTION_REASON"],
			        OVLP_CNTRCT_NM: cntrctTtl,
			        OVLP_DEAL_DESC: dataItem["DEAL_DESC"],
			        OVLP_DEAL_END_DT: dataItem["END_DT"],
			        OVLP_DEAL_ID: dataItem["DC_ID"],
			        OVLP_DEAL_STRT_DT: dataItem["START_DT"],
			        OVLP_DEAL_TYPE: dataItem["OBJ_SET_TYPE_CD"],
			        OVLP_ECAP_PRC: ecap,
			        OVLP_MAX_RPU: dataItem["MAX_RPU"],
                    OVLP_WF_STG_CD: dataItem["DSPL_WF_STG_CD"],
                    GRP_BY: 'SELF',
                    selected: true,
                    SELF_OVLP: 1
                });
                
				dataSourceSuggested.read();
				vm.isLoading = false;
			},
			function (response) {
				logger.error("Unable to get ECAP tracker dropdown data.", response, response.statusText);
				vm.isLoading = false;
			}
		);
	}

	vm.gridOptionsSuggested = {
		dataSource: dataSourceSuggested,
		enableHorizontalScrollbar: true,
		filterable: true,
		sortable: true,
		resizable: true,
		groupable: false,
		editable: false,
		pageable: false,
		scrollable: true,
		filter: "startsWith",
		noRecords: {
			template: "<div style='padding:40px;'>No overlapping deal groups were found.<div>"
		},
		columns: [
		    {
		        field: "GRP_BY",
		        groupHeaderTemplate: "#= gridUtils.showGroupExcludeMsg(value) #",
		        hidden: true
		    },
			{ field: "OVLP_DEAL_ID", title: "Deal Id", width: "80px" },
			{ field: "OVLP_DEAL_TYPE", title: "Deal Type", width: "120px" },
			{ field: "OVLP_CNTRCT_NM", title: "Contract", width: "200px" },
			{ field: "OVLP_WF_STG_CD", title: "Stage", width: "120px" },
			{ field: "OVLP_DEAL_STRT_DT", title: "Deal Start", width: "120px", template: "#= moment(OVLP_DEAL_STRT_DT).format('MM/DD/YYYY') #" },
			{ field: "OVLP_DEAL_END_DT", title: "Deal End", width: "120px", template: "#= moment(OVLP_DEAL_END_DT).format('MM/DD/YYYY') #" },
			{ field: "OVLP_ADDITIVE", title: "Additive", width: "120px" },
            { field: "OVLP_DEAL_DESC", title: "Deal Description", width: "180px" },
            { field: "OVLP_ECAP_PRC", title: "ECAP", width: "180px", format: "{0:c}" },
            { field: "OVLP_MAX_RPU", title: "Max RPU", width: "180px", format: "{0:c}" },
			{ field: "OVLP_CNSMPTN_RSN", title: "Comsumption Reason" }
		],
        dataBound: function (e) {
            
		    if (!vm.hasCheckbox) {
		        $('#ExcldGrid :checkbox').prop("disabled", true);
		    }

		    e.sender.element.find(".customHeaderRowStyles").remove();
		    var items = e.sender.items();
		    e.sender.element.height(e.sender.options.height);
		    items.each(function () {
		        var row = $(this);
		        var dataItem = e.sender.dataItem(row);
		        if (dataItem["OVLP_ECAP_PRC"] === 0) {
		            dataItem["OVLP_ECAP_PRC"] = "";

		        }
		        if (dataItem.OVLP_DEAL_ID === vm.DC_ID) {
		            var item = row.clone();
		            item.addClass("customHeaderRowStyles");
		            var thead = e.sender.element.find(".k-grid-header table thead");
		            thead.append(item);
		            e.sender.element.height(e.sender.element.height() + row.height());
		            row.hide();
		        }
		    });

		    $timeout(function () {
                var data = e.sender.dataSource.data();                
		        for (var d = 0; d < data.length; d++) {
		            if (data[d]["CST_MCP_DEAL_FLAG"] !== undefined && data[d]["CST_MCP_DEAL_FLAG"] === 0 && data[d]["EXCLD_DEAL_FLAG"] !== undefined && data[d]["EXCLD_DEAL_FLAG"] === 0) {
                        //data[d].set("_disabled", true); // Commented due to PERF hike
                        $("#" + data[d].OVLP_DEAL_ID).prop("disabled", true);
                        $("#" + data[d].OVLP_DEAL_ID).parent().find("label").removeClass("checkbox-custom-label").html("<i class='intelicon-filled-box' style='color: #bbbbbb; font-size: 28px !important; margin: 2px; vertical-align: text-top;' title='This deal does not belong in any Cost Test Group and will be ignored in the Cost Test calculations.'></i>");
                        $("#" + data[d].OVLP_DEAL_ID).closest("tr").addClass("tr-disabled");
                    }
		            else if (data[d]["CST_MCP_DEAL_FLAG"] !== undefined && data[d]["CST_MCP_DEAL_FLAG"] === 2 && data[d]["EXCLD_DEAL_FLAG"] !== undefined && data[d]["EXCLD_DEAL_FLAG"] === 2) {
                        data[d].set("_disabled", true);
		                $("#" + data[d].OVLP_DEAL_ID).prop("disabled", true);
		                $("#" + data[d].OVLP_DEAL_ID).parent().find("label").removeClass("checkbox-custom-label").html(" ");
		                $("#" + data[d].OVLP_DEAL_ID).closest("tr").addClass("tr-current");
		            }

                }
                if (data.length > 0) {
                    //Remove the Dummy Group which is created beacuse we added dummy record at the top 
                    if (vm.delCounter === 0) {
                        $("#ExcldGrid .k-grid-content table tbody tr").slice(-2).remove();
                        vm.delCounter = 1;
                    }
                }

            }, 50);
            
            
		}
	};

	vm.selectProduct = function (dataItem) {
        var varItem = vm.cellCurrValues.replace(/ /g, '').split(',');
        if (dataItem.selected) {
            // checked
            selectedGridDict[dataItem.OVLP_DEAL_ID] = true;
            if (varItem.indexOf(dataItem.OVLP_DEAL_ID) == -1) {
                varItem.push(dataItem.OVLP_DEAL_ID);// = vm.cellCurrValues + ", " + vm.cellCurrValues;
            }
            //currValsArr.push(dataItem.OVLP_DEAL_ID, true);
		} else {
			// unchecked
            delete selectedGridDict[dataItem.OVLP_DEAL_ID];
            delete selectedGridDict[dataItem.OVLP_DEAL_ID];
            var indx = -1;
            varItem.some(function (e, i) {
                if (e == dataItem.OVLP_DEAL_ID) {
                    indx = i;
                    return true;
                }
            });
            if (indx > -1) {
                varItem.splice(indx,1);
            }
            //delete currValsArr(dataItem.OVLP_DEAL_ID);
        }

        vm.cellCurrValues = varItem.toString();
        var indx = -1;
        vm.gridData.some(function (e, i) {
            if (e.OVLP_DEAL_ID == dataItem.OVLP_DEAL_ID) {
                indx = i;
                return true;
            }
        });
        if (indx > -1) {
            vm.gridData[indx]["selected"] = dataItem.selected;
        }
        if (vm.IS_EXCLUDED.indexOf(dataItem.OVLP_DEAL_ID) == -1) {
            vm.IS_EXCLUDED.push(dataItem.OVLP_DEAL_ID);
        }
        dataItem.IS_TOUCHED = true;
	}

	vm.ok = function () {

		// turn dictionary to csv string
		vm.returnVal.DEAL_GRP_EXCLDS = Object.keys(selectedGridDict).map(function (key) {
		    return key;
		}).join(", ").replace(/,\s*$/, "");

		if (vm.returnVal.DEAL_GRP_EXCLDS !== null && vm.returnVal.DEAL_GRP_EXCLDS !== "" && vm.returnVal.DEAL_GRP_CMNT === "") {
		    kendo.alert("When excluding deals, a reason must be provided.");
		    return;
		}

		// Remove comment if no selected exluded deal groups
		if (vm.returnVal.DEAL_GRP_CMNT !== "" && (vm.returnVal.DEAL_GRP_EXCLDS === null || vm.returnVal.DEAL_GRP_EXCLDS === "")) {
			vm.returnVal.DEAL_GRP_CMNT = "";
		}
		$uibModalInstance.close(vm.returnVal);
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();
}
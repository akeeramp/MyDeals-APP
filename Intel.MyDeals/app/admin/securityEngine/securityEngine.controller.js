(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('securityEngineController', securityEngineController)

    securityEngineController.$inject = ['$scope', 'logger', 'SecurityEngineService', 'lookupsService', 'confirmationModal', 'gridConstants', 'SecUtil','$filter', '$q']

    function securityEngineController($scope, logger, SecurityEngineService, lookupsService, confirmationModal, gridConstants, SecUtil, $filter, $q) {
    	var vm = this;
				
    	// Functions
    	vm.clickHelpButton = clickHelpButton;
    	vm.getGridData = getGridData;
    	vm.drawRoles = drawRoles;
    	vm.selectTabMode = selectTabMode;
    	vm.clickBox = clickBox;
    	vm.save = save;
    	vm.reset = reset;
    	vm.magicWandSelect = magicWandSelect;
    	vm.onObjTypeChange = onObjTypeChange;

    	// Variables     
    	vm.tabModeEnum = {
    		AtrbSecurity: 'Attribute Security',
    		DealSecurity: 'Deal Security'
    	};
    	vm.currentTabMode = vm.tabModeEnum.AtrbSecurity;
    	vm.pendingSaveArray = []; 

    	var bestGuessAttributes = ["BACK_DATE_RSN", "BLLG_DT", "BOM_SYSTEM_CONFIG", "CA_DATA_CA_ID", "CAP", "COMMENT_HISTORY", "COMMENTS", "COMP_PRICE_CPU", "COMP_PRICE_CS", "COMP_PRODUCT_CPU_OTHER", "COMP_PRODUCT_CS_OTHER", "COMPETITIVE_NAME", "COMPETITIVE_PRODUCT", "COMPETITIVE_PRODUCT_CPU", "COMPETITIVE_PRODUCT_CS", "DEAL_CORP_ACCNT_DIV", "COST_TEST_OVERRIDE", "COST_TEST_RESULT", "CPU_SPLIT", "CREDIT_AMT", "CREDIT_VOLUME", "CS_SHIP_AHEAD_DT", "CS_SHIP_AHEAD_END_DT", "CS_SHIP_AHEAD_STRT_DT", "CS_SPLIT", "CUST_MBR_SID", "DEAL_CORP_ACCNT_DIV", "DEAL_CUST_DIV_NM", "DEAL_CUST_NM", "DEAL_DESC", "DEAL_MSP_PRC", "DEAL_NBR", "DEAL_PGM_TYPE", "DEAL_PRC_CONFLICT", "DEAL_SOLD_TO_ID", "DEAL_STG_CD", "OBJ_SET_TYPE_CD", "DEBIT_AMT", "DEBIT_VOLUME", "DIVISION_APPROVAL_PRICE", "ECAP_PRICE", "REBATE_TYPE", "END_CAP", "END_CUSTOMER_RETAIL", "END_DT", "END_VOL", "EXPIRE_YCS", "IDMS_SHEET_COMMENT", "LAST_MOD_BY", "LAST_MOD_DT", "LEGAL_COMMENTS", "LINE_NBR", "MARKET_SEGMENT", "MEETCOMP_TEST_RESULT", "MRKT_SEG", "NORTHBRIDGE_SPLIT", "NUM_OF_TIERS", "ON_ADD_DT", "ORIG_ECAP_TRKR_NBR", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "PNL_SPLIT", "PnL_Split_for_KITS", "PORTFOLIO", "PRD_NM_COMBINED", "PRODUCT_FILTER", "PRODUCT_TITLE", "PROG_VOLTIER_NM", "PROGRAM_GEO", "PROGRAM_GEO_COMBINED", "PGM_PAYMENT", "PROGRAM_TYPE", "PROGRAM_TYPE_VOL_TIER", "QLTR_PROJECT", "QLTR_TERMS", "RATE", "RATE_BASED_ON", "REBATE_BILLING_END", "REBATE_BILLING_START", "REBATE_DEAL_ID", "REQ_BY", "REQ_DT", "RETAIL_CYCLE", "RETAIL_SHP_AHEAD_DT", "SA_COST_TEST_RESULTS", "SERVER_DEAL_TYPE", "SOUTHBRIDGE_SPLIT", "START_DT", "STRT_CAP", "STRT_VOL", "TENDER_PRICE", "TIER_NBR", "TOTAL_DOLLAR_AMOUNT", "TRGT_RGN", "TRKR_END_DT", "TRKR_NBR", "TRKR_START_DT", "VOLUME", "YCS_OVERLAP_OVERRIDE"];
    	var bestGuessActions = ["CAN_CREATE_QTR_RETRO_DEALS", "CAN_CREATE_RETRO_DEALS", "CAN_MANAGE_CHIPSET_SPLITOUT", "CAN_MANAGE_COMPETITIVE_PRODUCTS", "CAN_MANAGE_EMAIL", "CAN_REMOVE_WB_LOCK", "CAN_VIEW_COST_TEST", "CAN_VIEW_LEGAL_COMMENTS", "CAN_VIEW_MEET_COMP", "C_ADD_ATTACHMENTS", "C_APPROVE ", "C_CAN_VIEW_ADMINTOOL", "C_CAN_VIEW_C2A_INTERFACE", "C_COPY_DEAL", "C_CREATE_DEAL", "C_FAST_TRACK", "C_IDMS_ACTION_DISABLED ", "C_IDMS_READ_ONLY ", "C_REJECT_DEAL", "C_REQ_COMPONENTS", "C_EDIT_CONTRACT", "C_EDIT_PRODUCT", "C_VIEW_ATTACHMENTS", "C_VIEW_QUOTE_LETTER", "DEAL_READ_ONLY"];

    	vm.dropDownDatasource = {};
    	vm.dropDownDatasource.actions = [];
    	vm.dropDownDatasource.attributes = [];
    	vm.dropDownDatasource.dealActions = [];
    	vm.dropDownDatasource.dealTypes = [];
    	vm.dropDownDatasource.roleTypes = [];
    	vm.dropDownDatasource.stages = [];
    	vm.dropDownDatasource.objTypes = [];

    	vm.drilledDownAttributes = [];
    	vm.drilledDownDealTypes = [];
    	vm.drilledDownStages = [];

    	vm.currentDisplayAction = ""; // Text of current action to show in UI

    	vm.selected = {}; // holds the user input of dropdown values
    	vm.selected.attrAction = null;
    	vm.selected.attributes = [];
    	vm.selected.dealTypes = [];
    	vm.selected.roles = [];
    	vm.selected.stages = [];
    	vm.selected.objType = null;

    	vm.default = {};
    	vm.default.attrActionName = "ATRB_REQUIRED";
    	vm.default.objTypeName = "CNTRCT";

    	vm.filtered = {}; // A copy of vm.selected's values to create the grid
    	vm.filtered.attributes = [];
		
    	vm.isDropdownsLoaded = false; // Determines load for k-ng-delay on dropdowns
    	vm.isShowMainContent = false;
    	vm.isGridLoading = false; // Determines if the grid's loading message shows
    	vm.dealTypeAtrbs = []; 
		
    	vm.secAtrbUtil = {};
    	vm.secAtrbUtil.maskMappings = {};
    	vm.secAtrbUtil.securityMappings = {};

    	// DROPDOWN VALUES
    	vm.dropDownOptions = [];
    	vm.dropDownOptions.dealType = {
    		placeholder: "All Deal Types",
    		autoBind: false,
    		dataTextField: "Alias",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					e.success(vm.drilledDownDealTypes);
    				}
    			}
    		}
    	};
    	vm.dropDownOptions.roleType = {
    		placeholder: "All Roles",
    		autoBind: false,
    		dataTextField: "dropdownName",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					e.success(vm.dropDownDatasource.roleTypes);
    				}
    			}
    		}
    	};
    	vm.dropDownOptions.wfStage = {
    		placeholder: "All Stages",
    		autoBind: false,
    		dataTextField: "Stage",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    				    e.success(vm.drilledDownStages);
    				}
    			}
    		}
    	};
    	vm.dropDownOptions.attrAction = {
    		autoBind: false,
    		dataTextField: "dropdownName",
    		//dataValueField: "dropdownID",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					var filteredData = $filter('filter')(vm.dropDownDatasource.actions, { subCategory: 'Attribute' }, true);
    					e.success(filteredData);
    				}
    			}
    		}
    	};
    	vm.dropDownOptions.attributes = {
    		placeholder: "All Attributes",
    		dataTextField: "ATRB_COL_NM", // ATRB_CD
    		dataValueField: "ATRB_SID",
    		valuePrimitive: false,
    		autoBind: false,
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					e.success(vm.drilledDownAttributes);
    				},
    				create: function (e) {
    					e.preventDefault();

    				}
    			},
    			sort: { field: "ATRB_COL_NM", dir: "asc" }
    		}
    	};
    	vm.dropDownOptions.dealAction = {
    		autoBind: false,
    		placeholder: "All Deal Actions",
    		dataTextField: "dropdownName",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					var filteredData = $filter('filter')(vm.dropDownDatasource.actions, { subCategory: 'Deal' }, true);
    					e.success(filteredData);
    				}
    			}
    		}
    	};
    	vm.dropDownOptions.objType = {
    		autoBind: false,
    		select: vm.onObjTypeChange,
    		dataTextField: "Alias",
    		dataSource: {
    			type: "json",
    			serverFiltering: true,
    			transport: {
    				read: function (e) {
    					e.success(vm.dropDownDatasource.objTypes);
    				}
    			}
    		}
    	};

    	function init() {
    		getSecurityDropdownData().then(function () {
    			getObjAtrbs().then(function () {
    				getSecurityMask().then(function () {
    					vm.isDropdownsLoaded = true;
    				});
    			});
    		});
    	}
				
    	function getSecurityMask() {
    		var deferred = $q.defer();
    			SecurityEngineService.getMasks()
					.then(function (response) {
						processMaskData(response.data);
						deferred.resolve(response);
					}, function (error) {
						logger.error("Unable to get Security Masks.", error, error.statusText);
						deferred.reject();	
					});
    		return deferred.promise;
    	}

    	function getObjAtrbs() {
    		var deferred = $q.defer();
    			SecurityEngineService.getObjAtrbs() 
					.then(function (response) {
						vm.dealTypeAtrbs = response.data;
						var defaultObjType = $filter('filter')(vm.dropDownDatasource.objTypes, { Alias: vm.default.objTypeName }, true)[0];
						vm.drilledDownDealTypes = filterObjType(defaultObjType.Alias);
						vm.drilledDownStages = filterObjTypeForStages(defaultObjType.Alias);
						deferred.resolve(response);
					}, function (error) {
						logger.error("Unable to get Deal Type Attributes.", error, error.statusText);
						deferred.reject();
					});
    		return deferred.promise;
    	}
		
    	function getSecurityDropdownData() {
    		var deferred = $q.defer();
    			SecurityEngineService.getSecurityDropdownData()
					.then(function (response) {

						vm.dropDownDatasource.attributes = response.data.AttributesByObjType;
						vm.drilledDownAttributes = response.data.AttributesByObjType[vm.default.objTypeName];

						vm.dropDownDatasource.actions = response.data.SecurityActions;
						vm.dropDownDatasource.dealTypes = response.data.AdminDealTypes;
						vm.dropDownDatasource.roleTypes = response.data.AdminRoleTypes;
						vm.dropDownDatasource.stages = response.data.WorkFlowStages;
						vm.dropDownDatasource.objTypes = response.data.ObjTypes;
						deferred.resolve(response);
					}, function (error) {
						logger.error("Unable to get dropdown data.", error, error.statusText);
						deferred.reject();
					});
    		return deferred.promise;
    	}

    	function processMaskData(data) {			

    		// Security Mask 
    		for (var i = 0; i < data.SecurityMasks.length; i++) {
    			var mData = data.SecurityMasks[i];
								
    			// Does security mask have a things that are not just "0"?
    			if (mData.PERMISSION_MASK.replace(/0/g, "").replace(/\./g, "") !== "") {
					
    				// Determine accesses from mask's hex values
    				if (vm.secAtrbUtil.maskMappings[mData.PERMISSION_MASK] === undefined) {
    					vm.secAtrbUtil.maskMappings[mData.PERMISSION_MASK] = SecUtil.ChkAtrbRulesBase(mData.PERMISSION_MASK, data.SecurityAttributes);
    				}

    				// Select current filters / all filter data
    				var curAction = mData.ACTN_NM;
    				var curDealType = (mData.OBJ_SET_TYPE_CD === null || mData.OBJ_SET_TYPE_CD === "null" || mData.OBJ_SET_TYPE_CD === "") ? vm.dropDownDatasource.dealTypes.map(function (x) { return x.Alias; }) : [mData.OBJ_SET_TYPE_CD];
    				var curStage = (mData.WFSTG_NM === null || mData.WFSTG_NM === "null" || mData.WFSTG_NM === "") ? vm.dropDownDatasource.stages.map(function (x) { return x.Stage; }) : [mData.WFSTG_NM];
    				var curRole = (mData.ROLE_NM === null || mData.ROLE_NM === "null" || mData.ROLE_NM === "") ? vm.dropDownDatasource.roleTypes.map(function (x) { return x.dropdownName; }) : [mData.ROLE_NM];
					// TODO: Change objType id to name if we ever get that from the db
    				var curObjType = (mData.OBJ_TYPE_SID === null || mData.OBJ_TYPE_SID === "null" || mData.OBJ_TYPE_SID === "") ? vm.dropDownDatasource.objTypes.map(function (x) { return x.Id; }) : [mData.OBJ_TYPE_SID];

    				// If not already in the mappings list, then create it
    				if (vm.secAtrbUtil.securityMappings[curAction] === undefined) vm.secAtrbUtil.securityMappings[curAction] = {};

    				// Update/create the mapping with the current role, deal type, and stage ... for every role, deal type, and stage
    				for (var o = 0; o < curObjType.length; o++){
    					for (var d = 0; d < curDealType.length; d++) {
    						for (var r = 0; r < curRole.length; r++) {
    							for (var s = 0; s < curStage.length; s++) {
    								for (var v = 0; v < vm.secAtrbUtil.maskMappings[mData.PERMISSION_MASK].length; v++) {
    									// Create security mapping, which we will use to color-in or not color-in blocks
    									var secKey = vm.secAtrbUtil.maskMappings[mData.PERMISSION_MASK][v] + "/" + curObjType[o] + "/" + curDealType[d] + "/" + curRole[r] + "/" + curStage[s];
    									vm.secAtrbUtil.securityMappings[curAction][secKey] = 1;
    								}
    							}
    						}
    					}
    				}
    			}
    		}
    	}

    	function getGridData() {
    		vm.isShowMainContent = true;
    		vm.isGridLoading = true;
    		$scope.$apply;
    		// clear pending save array
    		vm.pendingSaveArray = [];
			
    		// Copy selected dropdown values
    		vm.filtered = angular.copy(vm.selected);
			
    		// If no items are selected in each dropdown, then select default of all items
    		if (vm.filtered.dealTypes.length == 0) { vm.filtered.dealTypes = angular.copy(vm.drilledDownDealTypes); }
    		if (vm.filtered.roles.length == 0) { vm.filtered.roles = angular.copy(vm.dropDownDatasource.roleTypes); }
    		if (vm.filtered.stages.length == 0) { vm.filtered.stages = angular.copy(vm.drilledDownStages); }
    		if (vm.filtered.objType == null || typeof vm.filtered.objType === 'undefined' || vm.filtered.objType.Id == null || typeof vm.filtered.objType.Id == 'undefined') {
    			// Get the action object that corresponds to the attrActionName string
    			vm.filtered.objType = $filter('filter')(vm.dropDownDatasource.objTypes, { Alias: vm.default.objTypeName }, true)[0];
    		}

	        var objType = vm.filtered.objType;

			// Tab-specific logic
	        if (vm.currentTabMode === vm.tabModeEnum.AtrbSecurity) { // Atrribute Security Tab
				
	        	if (vm.filtered.attributes.length == 0) { vm.filtered.attributes = angular.copy(vm.dropDownDatasource.attributes[getSelectedObjType()]); }

    			// Get default selected action if no selected action
    			if (vm.filtered.attrAction == null || typeof vm.filtered.attrAction === 'undefined') {
    				// Get the action object that corresponds to the attrActionName string
    				vm.filtered.attrAction = $filter('filter')(vm.dropDownDatasource.actions, { dropdownName: vm.default.attrActionName }, true)[0];
    			}
    			vm.currentDisplayAction = vm.filtered.attrAction.dropdownName;
    		} else if (vm.currentTabMode === vm.tabModeEnum.DealSecurity) { // Deal Security Tab
    			vm.filtered.attributes = [];
    			// Create attribute list out of the Deal Security's actions dropdown
    			if (typeof vm.filtered.dealActions !== "undefined" && vm.filtered.dealActions.length > 0) {
					// filtered deal secruity actions
    				for(var i=0; i<vm.filtered.dealActions.length; i++){
    					// TODO: perform saves on Deal Security via -1 bits
    					vm.filtered.attributes.push({
    						ATRB_COL_NM: angular.copy(vm.filtered.dealActions[i].dropdownName),
    						ATRB_SID:  angular.copy(vm.filtered.dealActions[i].dropdownID) // Note: for deal security only, atrb ID is actually action ID, whcih will be used during saving
    					});
    				}
    			} else {
    				var allDealActions = $filter('filter')(vm.dropDownDatasource.actions, { subCategory: 'Deal' }, true);
    				for (var i = 0; i < allDealActions.length; i++) {
    					// TODO: perform saves on Deal Security via -1 bits
    					vm.filtered.attributes.push({
    						ATRB_COL_NM: angular.copy(allDealActions[i].dropdownName),
    						ATRB_SID: angular.copy(allDealActions[i].dropdownID) // Note: for deal security only, atrb ID is actually action ID, whcih will be used during saving
    					});
    				}
    			}
    			vm.currentDisplayAction = "Deal Security";
    		}
    		lookupsService.asyncRenderHack().then(function () {
    			generateGrid();
    			vm.isGridLoading = false;
    			window.setTimeout(function () {
    			    resizeGrid();
    			}, 100);
		    });
    	}		

    	function resizeGrid() {
    	    $("#secEngineGrid").css("height", $(window).height() - 150);
            $("#secEngineGrid").data("kendoGrid").resize();
        }
    	function generateGrid() {
    		// Make the Roles column
    		var columns = [
				{
					field: "ATRB_SID",
					title: "Id",
					width: 70
				},
				{
					field: "ATRB_COL_NM",
					title: "Attribute/Action",
					width: 140
				},
				{
					title: "Role",
					encoded: false,
					width: 70,
					template: "<span ng-bind-html='::vm.drawRoles()'></span>"
				}
    		];

    		var stageColWidth = (vm.filtered.dealTypes.length * 24);
    		stageColWidth = (stageColWidth < 95) ? 95 : stageColWidth;

    		// Push the stages as column (headers) of the grid
    		for (var r = 0; r < vm.filtered.stages.length; r++) {
    			var stgID = vm.filtered.stages[r].Id;
    			var stgName = vm.filtered.stages[r].Stage;
    			columns.push({
    				title: stgName,
    				encoded: false,
    				width: stageColWidth, 
    				// HACK: template has a directive work-around to bind and compile html with angular
    				template: "<security-engine-draw-deals attr-id=\"#= data.ATRB_SID #\" atrb-cd=\"#= data.ATRB_COL_NM #\" stg-Id=\"" + stgID + "\" stg-name=\"" + stgName + "\"></security-engine-draw-deals>"
    			});
    		}

            // this will be the filler column
    		columns.push({title: "&nbsp;"});

    		vm.mainGridOptions = {
    			dataSource: {
    				type: "json",
    				transport: {
    					read: function (e) {
    						e.success(vm.filtered.attributes);
    					}
    				},
    				schema: {
    					model: {
    						fields: {
    							ATRB_COL_NM: { type: "string" }
    						}
    					}
    				},
    				selectable: "none"
    			},
    			toolbar: kendo.template($("#toolBarTemplate").html()),
    			sortable: true,
    			selectable: true,
    			resizable: true,
    			scrollable: true,
    			columns: columns
    		}

    	};

    	function drawRoles() {
    		var div = "<div class='atrbSubTitle'>";
    		return div + vm.filtered.roles.map(function(role){
    			return role.dropdownName; // role name
    		}).join("</div>" + div) + "</div>";
    	};


    	function clickHelpButton() {
    		// Confirmation Dialog
    		var modalOptions = {
    			closeButtonText: 'Close',
    			hasActionButton: false,
    			headerText: 'Help Text',
    			bodyText: 'Start by selecting the ObjType, Roles, Stages and ObjSet types you want to view.'
					 + ' Note that leaving the select blank will default to ALL.'
					 + ' Then, select either Attribute Security or Deal Security tab and enter remaining details.'
					 + ' When done, click the View Security Attributes button on the bottom.'
    		};
    		confirmationModal.showModal({}, modalOptions);
    	}


    	function selectTabMode(modeName) {
			// Select Mode
    		vm.currentTabMode = modeName;

			// TODO: Clear previous tab's actions
    	}
		
    	/* When user clicks on an interactable box, then call this function to add the deal information to the array of pending-save security attributes */
    	function clickBox($event, actnId, actnCd, attrId, attrCd, dealId, dealCd, roleId, roleCd, stgId, stgCd) {
    		var elem = angular.element($event.currentTarget);
    		var child = elem.children("div:first");
    		var isCurrChecked = !child.hasClass("atrbbasedisabled"); // Check if the box is currently checked on or off

			// Note that the only the SIDS are saved, but the CDs are used to update the UI's grid data
    		var objToSave = {
    			ACTN_NM: actnCd,
    			SECUR_ACTN_SID: actnId,
    			ATRB_COL_NM: attrCd,
    			ATRB_SID: attrId,
    			OBJ_TYPE: vm.filtered.objType.Alias,
    			OBJ_TYPE_SID: vm.filtered.objType.Id,
    			OBJ_SET_TYPE_CD: dealCd,
    			OBJ_SET_TYPE_SID: dealId,
				ROLE_NM: roleCd,
				ROLE_TYPE_SID: roleId,
				WFSTG_NM: stgCd,
				WFSTG_MBR_SID: stgId
    			//isNowChecked: true, 
    			//originallyChecked: false, // this is used to compare against isNowChecked to check if the value was modified
				//isModified: true
    		};

    		// Is this the clickable colored-box element?
    		if (!child.hasClass("atrbContainer")) {
    			return;
    		}

    		child.addClass("attrbChanged");
    		// Change checkBox css
    		if (isCurrChecked) {	// It was checked orignally, so we're unchecking the box    
    			// Change Box color to unchecked
    			child.addClass("atrbbasedisabled");
    		} else {	// It was unchecked orignally, so we're checking the box        	
    			// Change Box color to checked
    			child.removeClass("atrbbasedisabled");
    		}

    		var index = JSON.stringify(objToSave); // Make sure to make the index before flagging the obj or it won't be consistent!
    		
    		// Flag whether we are adding or deleting this map
    		objToSave.isNowChecked = !isCurrChecked;

    		if (vm.pendingSaveArray[index] != null) {
    			// store orignallyChecked in case of another click on the colored box
    			objToSave.originallyChecked = vm.pendingSaveArray[index].originallyChecked
				// Check if the object was modified
    			objToSave.isModified = (objToSave.originallyChecked != objToSave.isNowChecked);
    		} else {
    			objToSave.originallyChecked = !objToSave.isNowChecked;
    			objToSave.isModified = true;
    		}

    		// Update Array
    		vm.pendingSaveArray[index] = objToSave;
        }
				
    	function save() {
    		var saveArray = [];

    		// Turn the js "Dictionary" into an array
    		for (var key in vm.pendingSaveArray) {
    			if (vm.pendingSaveArray.hasOwnProperty(key)) {
    				var value = vm.pendingSaveArray[key];
    				saveArray.push(value);
    			}
    		}

    		var mappingList = $filter('filter')(saveArray, { isModified: true }, true);
			
    		SecurityEngineService.saveMapping(mappingList)
				.then(function (response) {
					logger.success('Update successful.');

					for (var key in vm.pendingSaveArray) {
						if (vm.pendingSaveArray.hasOwnProperty(key)) {
							var value = vm.pendingSaveArray[key];
							var secKey = value.ATRB_COL_NM + "/" + value.OBJ_TYPE_SID + "/" + value.OBJ_SET_TYPE_CD + "/" + value.ROLE_NM + "/" + value.WFSTG_NM;

							if (value.isNowChecked) {
								// Add new values to the security mask
								vm.secAtrbUtil.securityMappings[value.ACTN_NM][secKey] = 1;
							} else {
								// Remove old values that were deleted from security mask
								if (vm.secAtrbUtil.securityMappings[value.ACTN_NM][secKey] != null) {
									delete vm.secAtrbUtil.securityMappings[value.ACTN_NM][secKey];// = 0;
								}
							}
						}
					}

					// Clear attrbChanged classes
					$('.attrbChanged').removeClass('attrbChanged');

					// Clear pending array
					vm.pendingSaveArray = [];

				}, function (error) {
					logger.error("Unable save Security Engine Mappings.", error, error.statusText);
				});
        }

        function reset() {
			// clear pending save array
        	vm.pendingSaveArray = [];

        	// Redraw the grid UI
        	if (typeof $("#secEngineGrid").data('kendoGrid') != 'undefined') { // Is the grid initialized yet?
        		vm.securityEngineGrid.dataSource.read(); // $("#secEngineGrid").data('kendoGrid').refresh(); 
        	}
        }

        function magicWandSelect() {
			// Reset
        	vm.selected.attributes = [];

			// Compare elements against magic wand array
        	for (var i = 0; i < bestGuessAttributes.length; i++) {
        		var found = $filter('filter')(vm.dropDownDatasource.attributes[getSelectedObjType()], { ATRB_COL_NM: bestGuessAttributes[i] }, true)[0];
        		if (found != null) {
        			vm.selected.attributes.push(found);
        		}
        	}

        	$("#dropDownAttributes").data("kendoMultiSelect").value(vm.selected.attributes);
        	vm.dropDown.dealSecurity;
        }

        function onObjTypeChange(e) {
        	// Note: kendo select event being called twice: once on click and once on deselect 
        	vm.drilledDownDealTypes = filterObjType(e.dataItem.Alias);
        	vm.drilledDownStages = filterObjTypeForStages(e.dataItem.Alias);
			
			// Attribute drilldown by Obj type
        	if (vm.dropDownDatasource.attributes[e.dataItem.Alias] == undefined) {
        		vm.drilledDownAttributes = vm.dropDownDatasource.attributes[vm.default.objTypeName];
        	} else {
        		vm.drilledDownAttributes = vm.dropDownDatasource.attributes[e.dataItem.Alias];
        	}
			
        	vm.drilledDownAttributes = vm.drilledDownAttributes.sort(function (a, b) {
        	    if (a.ATRB_COL_NM < b.ATRB_COL_NM)
        	        return -1;
        	    if (a.ATRB_COL_NM > b.ATRB_COL_NM)
        	        return 1;
        	    return 0;
        	});

            // Update ObjSetType dropdown Datasource
            vm.dropDown.objSetType.setDataSource(vm.drilledDownDealTypes);
            vm.dropDown.wfStage.setDataSource(vm.drilledDownStages);
            vm.dropDown.attributes.setDataSource(vm.drilledDownAttributes);

        	// Clear selected
            $scope.$apply( function() {
				vm.selected.dealTypes = [];
				vm.selected.stages = [];
				vm.selected.attributes = [];
				$("#dropDownAttributes").data("kendoMultiSelect").value([]);
            });
        }

        function filterObjType(objTypeName) {
            var filteredDeals = [];
            if (vm.dealTypeAtrbs[objTypeName] !== undefined && vm.dealTypeAtrbs[objTypeName]["ATTRBS"] !== undefined) {
                for (var key in vm.dealTypeAtrbs[objTypeName]["ATTRBS"]) {
                    if (vm.dealTypeAtrbs[objTypeName]["ATTRBS"].hasOwnProperty(key)) {
                    	if (vm.dealTypeAtrbs[objTypeName]["ATTRBS"].hasOwnProperty(key)) {
                            filteredDeals.push($filter('filter')(vm.dropDownDatasource.dealTypes, { Alias: key }, true)[0]);
                        }
                    }
                }
            }
            return filteredDeals;
        }
        function filterObjTypeForStages(objTypeName) {
        	var filteredStages = [];
        	if (vm.dealTypeAtrbs[objTypeName] !== undefined && vm.dealTypeAtrbs[objTypeName]["STAGES"] !== undefined) {
        		var stgs = vm.dealTypeAtrbs[objTypeName]["STAGES"];
        		for (var key in stgs) {
        			if (stgs.hasOwnProperty(key)) {
        				filteredStages.push({ "Stage": stgs[key][0], "Id": key });
        			}
        		}
        	}
        	return filteredStages;
        }

        function getSelectedObjType() {
        	if (vm.selected.objType != null) {
        		return vm.selected.objType.Alias;
        	} else {
        		return vm.default.objTypeName;
        	}
        }
        init();
    }
})();
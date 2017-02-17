(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('securityEngineController', securityEngineController)

    securityEngineController.$inject = ['$scope', 'logger', 'SecurityEngineService', 'confirmationModal', 'gridConstants', 'SecUtil']

    function securityEngineController($scope, logger, SecurityEngineService, confirmationModal, gridConstants, SecUtil) {
    	var vm = this;
				
    	// Functions
    	vm.clickHelpButton = clickHelpButton;
    	vm.getGridData = getGridData;
    	vm.drawDealTypes = drawDealTypes;
    	vm.drawRoles = drawRoles;
    	vm.selectMode = selectMode;
    	vm.clickBox = clickBox;
    	vm.save = save;
    	vm.reset = reset;
    	vm.magicWandSelect = magicWandSelect;


    	// Variables     
    	vm.modeEnum = {
    		AtrbSecurity: 'Attribute Security',
    		DealSecurity: 'Deal Security'
    	};
    	vm.currentTabMode = vm.modeEnum.AtrbSecurity;

    	vm.dropDownDatasource = {};
    	vm.dropDownDatasource.actions = [];
    	vm.dropDownDatasource.attributes = [];
    	vm.dropDownDatasource.dealTypes = [];
    	vm.dropDownDatasource.roleTypes = [];
    	vm.dropDownDatasource.stages = [];
		
    	vm.selected = {}; // holds the user input of dropdown values
    	vm.selected.action = null;
    	vm.selected.actionDefaultName = "ATRB_REQUIRED";
    	vm.selected.attributes = [];
    	vm.selected.dealTypes = [];
    	vm.selected.roles = [];
    	vm.selected.stages = [];

    	vm.filtered = {}; // A copy of vm.selected's values to create the grid
    	vm.filtered.attributes = {};
		
		vm.isDropdownsLoaded = false; // Determines load for k-ng-delay on dropdowns

    	vm.dealTypeAtrbs = []; // TODO: How do we get this from db? Find out.

    	var secAtrbUtil = {};
    	secAtrbUtil.maskMappings = {};
    	secAtrbUtil.securityMappings = {};

		// DROPDOWN VALUES
        vm.dropDownOptions = [];
        vm.dropDownOptions.dealType = {
        	placeholder: "All Deal Types",
        	valuePrimitive: true,
        	autoBind: false,
        	dataTextField: "Second",
        	dataSource: {
        		type: "json",
        		serverFiltering: true,
        		transport: {
        			read: function (e) {
        				e.success(vm.dropDownDatasource.dealTypes);
        			}
        		}
        	}
        };
        vm.dropDownOptions.roleType = {
        	placeholder: "All Roles",
        	valuePrimitive: true,
        	autoBind: false,
        	dataTextField: "Second",
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
        	valuePrimitive: true,
        	autoBind: false,
        	dataTextField: "Second",
        	dataSource: {
        		type: "json",
        		serverFiltering: true,
        		transport: {
        			read: function (e) {
        				e.success(vm.dropDownDatasource.stages);
        			}
        		}
        	}
        };
        vm.dropDownOptions.attrAction = {
        	valuePrimitive: true,
        	autoBind: false,
        	dataTextField: "Second",
        	//dataValueField: "Second",
        	dataSource: {
        		type: "json",
        		serverFiltering: true,
        		transport: {
        			read: function (e) {
        				e.success(vm.dropDownDatasource.actions);
        			}
        		}
        	}
        };
        vm.dropDownOptions.attributes = {
        	placeholder: "All Attributes",
        	dataTextField: "FACT_ATRB_CD",
        	valuePrimitive: true,
        	autoBind: false,
        	dataSource:  {
        		type: "json",
        		serverFiltering: true,
        		transport: {
        			read: function (e) {
        				e.success(vm.dropDownDatasource.attributes);
        			}
        		}
        	}
        }
		


        function init() {
        	// Get dropdown data and security mask data
        	Promise.all([
				// Dropdown data
				getSecurityDropdownData()
        	])
			.then(function () {
				Promise.all([
					// Security mask data (secAtrbUtil)
					getSecurityMask(),
					getDealTypeAtrbs()
				])
				.then(function () {
					vm.isDropdownsLoaded = true;
				});
			});
        }
				
        function getSecurityMask() {
        	return new Promise(function(resolve, reject) {
        		SecurityEngineService.getMasks()
					.then(function (response) {
						vm.dropDownDatasource.attributes = response.data.SecurityAttributes;
						processMaskData(response.data);
						resolve();
					}, function (error) {
						logger.error("Unable to get Security Masks.", error, error.statusText);
						reject();        			
					});
        	})
        }

        function getDealTypeAtrbs() {
        	return new Promise(function (resolve, reject) {
				SecurityEngineService.getDealTypeAtrbs()
					.then(function (response) {
						vm.dealTypeAtrbs = response.data;
						resolve(response.data);
					}, function (error) {
						logger.error("Unable to get Deal Type Attributes.", error, error.statusText);
						reject();
					});
			})
        }
		
        function getSecurityDropdownData() {
        	return new Promise(function (resolve, reject) {
        		SecurityEngineService.getSecurityDropdownData()
					.then(function (response) {
						vm.dropDownDatasource.actions = response.data.SecurityActions;
						vm.dropDownDatasource.dealTypes = response.data.AdminDealTypes;
						vm.dropDownDatasource.roleTypes = response.data.AdminRoleTypes;
						vm.dropDownDatasource.stages = response.data.WorkFlowStages;
						resolve();
					}, function (error) {
						logger.error("Unable to get dropdown data.", error, error.statusText);
						reject();
					});
        	})
        }

        function processMaskData(data) {
        	////TODO: Re-evaluate if we need this depending on whether or not we can just get attrib list  from db directly
        	//// Get the attributes list from the mask data
        	//for (var key in data.SecurityAttributes) {
        	//	if (data.SecurityAttributes.hasOwnProperty(key)) {
        	//		secAtrbUtil.attributes.push({
        	//			Attribute: data.SecurityAttributes[key].FACT_ATRB_CD
        	//		});
        	//	}
        	//}
			

        	// Security Mask 
        	for (var i = 0; i < data.SecurityMasks.length; i++) {
        		var mData = data.SecurityMasks[i];
				
        		//// TODO: Re-evaluate if we need this depending on whether or not we can just get/filter the data from db directly
				//// Create lists for the Security Attributes tab or the Deal Security tab's action dropdowns
        		//if (secAtrbUtil.atrbActionCds.contains(mData.ACTN_CD)) {
        		//	// atrbAcAttribute Security Tab's Attribute Action dropdown
        		//	secAtrbUtil.atrbActions.pushIfNotExist({ ACTN_CD: mData.ACTN_CD }, function (e) {
        		//		return e.ACTN_CD === mData.ACTN_CD;
        		//	});
        		//} else {
        		//	// Deal Security Tab' Attributes Attribute Action dropdown
        		//	secAtrbUtil.actions.pushIfNotExist({ ACTN_CD: mData.ACTN_CD }, function (e) {
        		//		return e.ACTN_CD === mData.ACTN_CD;
        		//	});
        		//}
				
        		// Does security mask have a things that are not just "0"?
        		if (mData.PERMISSION_MASK.replace(/0/g, "").replace(/\./g, "") !== "") {

					// Determine accesses from mask's hex values
        			if (secAtrbUtil.maskMappings[mData.PERMISSION_MASK] === undefined) {
        				secAtrbUtil.maskMappings[mData.PERMISSION_MASK] = SecUtil.ChkAtrbRulesBase(mData.PERMISSION_MASK, data.SecurityAttributes);
        			}

        			// Select current filters / all filter data
        			var curAction = mData.ACTN_CD;
        			var curDealType = (mData.OBJ_TYPE === null || mData.OBJ_TYPE === "null") ? vm.dropDownDatasource.dealTypes.map(function (x) { return x.Second; }) : [mData.OBJ_TYPE];
        			var curStage = (mData.WFSTG_CD === null || mData.WFSTG_CD === "null") ? vm.dropDownDatasource.stages.map(function (x) { return x.Second; }) : [mData.WFSTG_CD];
        			var curRole = (mData.ROLE_TYPE_CD === null || mData.ROLE_TYPE_CD === "null") ? vm.dropDownDatasource.roleTypes.map(function (x) { return x.Second; }) : [mData.ROLE_TYPE_CD];

        			// If not already in the mappings list, then create it
        			if (secAtrbUtil.securityMappings[curAction] === undefined) secAtrbUtil.securityMappings[curAction] = {};

        			// Update/create the mapping with the current role, deal type, and stage ... for every role, deal type, and stage
        			// TODO: this is a lot of data... (>200 * 4? * Y * Y * Y) Maybe find a better way to do this?
        			for (var d = 0; d < curDealType.length; d++) {
        				for (var r = 0; r < curRole.length; r++) {
        					for (var s = 0; s < curStage.length; s++) {
        						for (var v = 0; v < secAtrbUtil.maskMappings[mData.PERMISSION_MASK].length; v++) {
									// Create security mapping, which we will use to color-in or not color-in blocks
        							var secKey = secAtrbUtil.maskMappings[mData.PERMISSION_MASK][v] + "/" + curDealType[d] + "/" + curRole[r] + "/" + curStage[s];
        							secAtrbUtil.securityMappings[curAction][secKey] = 1;
        						}
        					}
        				}
        			}
        		}
        	}
        }

        function getGridData() {
        	var actionDefault = null;

			// Copy selected dropdown values
        	vm.filtered = angular.copy(vm.selected);

			// Get default selected action
        	for (var i = 0; i < vm.dropDownDatasource.actions.length; i++){
        		if (vm.dropDownDatasource.actions[i].Second == vm.selected.actionDefaultName) {
        			actionDefault = angular.copy(vm.dropDownDatasource.actions[i]);
        		}
        	}

        	// If no items are selected in each dropdown, then select default of all items
        	if (vm.filtered.action == null || typeof vm.filtered.action === 'undefined') { vm.filtered.action = actionDefault; }
        	if (vm.filtered.attributes.length == 0) { vm.filtered.attributes = angular.copy(vm.dropDownDatasource.attributes); }
        	if (vm.filtered.dealTypes.length == 0) { vm.filtered.dealTypes = angular.copy(vm.dropDownDatasource.dealTypes); }
        	if (vm.filtered.roles.length == 0) { vm.filtered.roles = angular.copy(vm.dropDownDatasource.roleTypes); }
        	if (vm.filtered.stages.length == 0) { vm.filtered.stages = angular.copy(vm.dropDownDatasource.stages); }
			
        	generateGrid();
        }		

        function generateGrid() {
			// Make the Roles column
        	var columns = [
				{
					field: "FACT_ATRB_CD",
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

        	// Push the stages as column (headers) of the grid
        	for (var r = 0; r < vm.filtered.stages.length; r++) {
        		var stgID = vm.filtered.stages[r].First;
        		var stgName = vm.filtered.stages[r].Second;
        		columns.push({
        			title: stgName,
        			encoded: false,
        			width: 95,
					// template is a directive work-around
        			template: "<security-engine-draw-deals attr-id=\"#= data.ATRB_BIT #\" atrb-cd=\"#= data.FACT_ATRB_CD #\" stg-Id=\"" + stgID + "\" stg-name=\"" + stgName + "\"></security-engine-draw-deals>"
        		});
        	}

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
        						Second: { type: "string" }
        					}
        				}
        			}
        		},
        		toolbar: kendo.template($("#toolBarTemplate").html()),
        		//filterable: gridConstants.filterable,
        		sortable: true,
        		selectable: true,
        		resizable: true,
        		scrollable: true,
        		//pageable: {
        		//	refresh: true,
        		//	pageSizes: gridConstants.pageSizes,
        		//},
        		columns: columns
        	}

        };

        function drawRoles() {
        	var div = "<div class='atrbSubTitle rolebasecolor'>";
        	return div + vm.filtered.roles.map(function(role){
        		return role.Second; // role name
        	}).join("</div>" + div) + "</div>";
		};


    	/* 
		 * This function will be called by the secDrawDeals directive 
		 * RETURNS: Html of multiple deal boxes for each attribute, dealtype, role, and stage
		 */
        function drawDealTypes (atrbId, atrbCd, stgId, stgName) {        	
        	var buf = "";
        	var divStart = "<div style='margin: 1px;'>";
        	var divEnd = "<div class='clearboth'></div></div>";
			
        	var clickableHtml = "";

        	for (var r = 0; r < vm.filtered.roles.length; r++) {
        		var role = vm.filtered.roles[r];
        		buf += divStart;
        		for (var d = 0; d < vm.filtered.dealTypes.length; d++) {        			
					var dealType = vm.filtered.dealTypes[d];
        			clickableHtml = "<div class='fl helloworld' ng-click='$parent.vm.clickBox(\"" + vm.filtered.action.First + "\", \"" + atrbId + "\", \"" + dealType.First + "\", " + role.First + ", \"" + stgId + "\")'>"

        			// NOTE: Because this drawDealTypes() function is called in a directive, the $parent var must 
        			// be defined to refer to this controller's scope. 
        			// Essentially think $parent.vm.clickBox() = vm.clickBox()
        			buf += drawDealType(atrbCd, dealType.Second, role.Second, stgName, clickableHtml);
        		}
        		buf += divEnd;
        	}
        	return buf;
        };


    	/* RETURNS: Html of individual deal boxes */
        function drawDealType(atrbCd, dealType, role, stgName, clickableHtml) {
			// Variables that will help make the resulting html
        	var extraClasses = [];
        	var innerIcon = "";
        	var isClickable = false;
			
        	// Get the current tab (Attribute Security or Deal Secuirty)
        	var mappingKey = "";
        	if (vm.currentTabMode === vm.modeEnum.AtrbSecurity) { // Attribute Security
        		mappingKey = vm.filtered.action.Second;
        	} else { // Deal Security
        		mappingKey = atrbCd;
        		atrbCd = "ACTIVE";
        	}

        	var actionCollection = secAtrbUtil.securityMappings[mappingKey];
        	var title = "Deal Type: " + dealType + "\nRole: " + role + "\nStage: " + stgName + "\n";
        	var atrbKey = atrbCd + "/" + dealType + "/" + role + "/" + stgName;
			
			/* Get classes and innerIcons */
        	// Deal Read Only
        	if (mappingKey === "ATRB_READ_ONLY" && secAtrbUtil.securityMappings["C_UPDATE_DEAL"][atrbKey.replace(atrbCd, 'ACTIVE')] === undefined) {
        		isClickable = true;
        		title += "Deal is Read Only\n";
        		extraClasses.push("atrbbasecolorDealReadOnly"); 
        		innerIcon += "<i class='fa fa-lock'></i>";
        		//return "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " atrbContainer atrbbasecolorDealReadOnly' title='" + title + "'><i class='fa fa-lock'></i></div>";
        	}
        	// Not in Deal Type
        	else if (vm.currentTabMode === vm.modeEnum.AtrbSecurity && atrbCd !== "ACTIVE" && vm.dealTypeAtrbs[dealType] !== undefined && !vm.dealTypeAtrbs[dealType].contains(atrbCd)) {
        		extraClasses.push("atrbbasecolorNotInDealType");
        		innerIcon += "&nbsp;";
        		//return "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " atrbContainer atrbbasecolorNotInDealType' title='" + title + "'>&nbsp;</div>";
        	}
        	else if (actionCollection !== undefined) {
        		//var rules = secAtrbUtil.ruleMappings[atrbKey]; // TODO: Implement Rules
        		var val = actionCollection[atrbKey];
        		if (val !== undefined) { // Normal MetaData
        			isClickable = true;
        			innerIcon += "&nbsp;";
        			//return "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " atrbContainer ' title='" + title + "'>&nbsp;</div>";
        		}
        		//// TODO: Implement Rules
        		//// Custom Rules
        		//else if (rules !== undefined && rules !== null && rules.length > 0) {
        		//    var ruleIcon = "<i class='fa fa-code'></i>";
        		//    var ruleCnt = 0;
        		//    for (var rl = 0; rl < rules.length; rl++) {
        		//        ruleCnt++;
        		//        if (ruleCnt > 1) {
        		//            ruleIcon = "<i class='fa fa-calculator'></i>";
        		//        } else {
        		//            if (rules[rl].title.indexOf("NOTRACKER") === 0) ruleIcon = "<i class='fa'>!</i><i class='fa fa-paw'></i>";
        		//            if (rules[rl].title.indexOf("TRACKER") === 0) ruleIcon = "<i class='fa fa-paw'></i>";
        		//            if (rules[rl].title.indexOf("HISTORY") === 0) ruleIcon = "<i class='fa fa-history'></i>";
        		//        }
        		//        title += rules[rl].title + "\n";
        		//    }
        		//    extraClasses.push( " atrbbasedisabled ";
        		//    innerIcon += ruleIcon;
        		//    //return "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " fl atrbContainer atrbbasedisabled' title='" + title + "'>" + ruleIcon + "</div>";
        		//}
        		else {
        			isClickable = true;
        			innerIcon += "&nbsp;";
        			extraClasses.push("atrbbasedisabled");
        		}
        	}
        	//atrbbasedisabled
        	else {
        		isClickable = true;
        		innerIcon += "&nbsp;";
        		extraClasses.push("atrbbasedisabled");
        		//return "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " atrbContainer atrbbasedisabled' title='" + title + "'>&nbsp;</div>";
        	}

			// Create element
        	var el = "<div class='fl'>";
        	el += ((isClickable) ? clickableHtml : "");
        	el += "<div class='atrbbasecolor" + dealType.replace(/ /g, "") + " atrbContainer " + extraClasses.join(" ") + " " + ((isClickable) ? "clickable" : "") + "' ";
        	el += "title='" + title + "'>";
        	el += innerIcon;
        	el += "</div>";
        	el += ((isClickable) ? "</div>" : "");
        	el += "</div>";

        	return el;
        };

        function clickHelpButton() {
        	// Confirmation Dialog
        	var modalOptions = {
        		closeButtonText: 'Close',
        		hasActionButton: false,
        		headerText: 'Help Text',
        		bodyText: 'Start by selecting the role, stage and deal types to view.'
					 + ' Leaving the select blank will default to ALL.'
					 + ' Then, select either Attribute Security or Deal Security and enter remaining details.'
					 + ' When done, click the View Security Attributes button.'
        	};
        	confirmationModal.showModal({}, modalOptions);
        }

        function selectMode(modeName) {
        	vm.currentTabMode = modeName;
        }

		/* When user clicks on an interactable box, then call this function to add the deal information to the array of pending-save security attributes */
        function clickBox(actnId, attrId, dealId, roleId, stgId) {
			// TODO: Write this
        	console.log("TODO");
        }

        function save() {
        	// TODO
        	console.log("TODO");
        }

        function reset() {
        	// TODO
        	console.log("TODO");
        }

        function magicWandSelect() {
        	// TODO
        	console.log("TODO");
        }



        init();
    }
})();
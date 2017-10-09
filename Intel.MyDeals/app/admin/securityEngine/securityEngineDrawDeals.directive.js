// HACK: This directive is a work-around to ng-click not compiling inside an ng-bind-html
// This directive should only be used in the SecurityEngine Admin page as it extensively uses 
// that page's vm functions and variables
'use strict';
angular
	.module('app.admin')
	.directive('securityEngineDrawDeals', securityEngineDrawDeals);

// Minification safe dependency injection
securityEngineDrawDeals.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q', '$filter'];

function securityEngineDrawDeals($http, lookupsService, $compile, $templateCache, logger, $q, $filter) {

	var dummyAttrName = "NA"; // This is used for deal Security and others that do not tie to an attribute

	var linker = function (scope, element, attr) {
		var vm = scope.$parent.vm;
		// Get HTML for each deal box 
		var html = drawDealTypes(vm, scope.attrId, scope.atrbCd, scope.stgId, scope.stgName);
		// Compile html so that ng-click works
		var x = $compile(html)(scope);
		// append to original directive element
		element.append(x);
	}

	/* RETURNS: Html of multiple deal boxes for each attribute, dealtype, role, and stage */
	function drawDealTypes(vm, atrbId, atrbCd, stgId, stgName) {

		var buf = "";
		var divStart = "<div style='margin: 1px;'>";
		var divEnd = "<div class='clearboth'></div></div>";

		var clickableHtml = "";

		var dealType = "";
		var mappingKey = "";
		var actionId = "";
		var actnCd = "";
		var newAtrbId = "";
		var newAtrbCd = "";

		var role = null;

		for (var r = 0; r < vm.filtered.roles.length; r++) {
			role = vm.filtered.roles[r];
			buf += divStart;
			for (var d = 0; d < vm.filtered.dealTypes.length; d++) {
				dealType = vm.filtered.dealTypes[d];

				if (vm.currentTabMode === vm.tabModeEnum.AtrbSecurity) { // Attribute Security
					actionId = vm.filtered.attrAction.dropdownID;
					actnCd = vm.filtered.attrAction.dropdownName;
					mappingKey = vm.filtered.attrAction.dropdownName;
					newAtrbId = atrbId;
					newAtrbCd = atrbCd;
				} else { // Deal Security
					actionId = atrbId; // Note: for deal security only, it's atrb ID is actually action ID
					var myActnCd = $filter('filter')(vm.dropDownDatasource.actions, { dropdownID: parseInt(atrbId) }, true)[0];
					actnCd = (myActnCd ? myActnCd.dropdownName : -1);
					mappingKey = atrbCd;
					var dummyAttr = $filter('filter')(vm.dropDownDatasource.attributes["CNTRCT"], { ATRB_COL_NM: dummyAttrName }, true)[0] //quickfix: changed to attributes["CNTRCT"], but not sure if that is ok - all the attributes at different levels have the same dummyAttrName ID (90001) so perhaps it is ok?
				    newAtrbId = dummyAttr.ATRB_SID;
					newAtrbCd = dummyAttrName;
				}

				clickableHtml = "<div class='fl' ng-click='$parent.vm.clickBox($event, " + actionId + ", \"" + actnCd + "\", " + newAtrbId + ", \"" + newAtrbCd + "\", " + dealType.Id + ", \"" + dealType.Alias + "\", " + role.dropdownID + ", \"" + role.dropdownName + "\", " + stgId + ", \"" + stgName + "\")'>"
				buf += drawDealType(vm, mappingKey, newAtrbCd, dealType.Alias, role.dropdownName, stgName, clickableHtml);
			}
			buf += divEnd;
		}
		return buf;
	};


	/* RETURNS: Html of individual deal boxes */
	function drawDealType(vm, mappingKey, atrbCd, dealType, role, stgName, clickableHtml) {
		// Variables that will help make the resulting html
		var extraClasses = [];
		var innerIcon = "";
		var isClickable = false;

		var actionCollection = vm.secAtrbUtil.securityMappings[mappingKey];
		var title = "Deal Type: " + dealType + "\nRole: " + role + "\nStage: " + stgName + "\n";
		var atrbKey = atrbCd + "/" + vm.filtered.objType.Id + "/" + dealType + "/" + role + "/" + stgName;

		// Deal Read Only
		if (mappingKey === "ATRB_READ_ONLY" && (vm.secAtrbUtil.securityMappings["C_EDIT_CONTRACT"] === undefined || vm.secAtrbUtil.securityMappings["C_EDIT_CONTRACT"][atrbKey.replace(atrbCd, dummyAttrName)] === undefined)) {
			isClickable = true;
			title += "Deal is Read Only\n";
			// TODO: add icons in once rules are implemented
			//extraClasses.push("atrbbasecolorDealReadOnly");
			//innerIcon += "<i class='fa fa-lock'></i>";
		}

		/* Get classes and innerIcons */
		// Not in Deal Type
		if (vm.currentTabMode === vm.tabModeEnum.AtrbSecurity && atrbCd !== dummyAttrName && vm.dealTypeAtrbs[vm.filtered.objType.Alias]["ATTRBS"][dealType] !== undefined && !vm.dealTypeAtrbs[vm.filtered.objType.Alias]["ATTRBS"][dealType].contains(atrbCd)) {
			extraClasses.push("atrbbasecolorNotInDealType");
		}
		else if (actionCollection !== undefined) {
			//var rules = secAtrbUtil.ruleMappings[atrbKey]; // TODO: Implement Rules
			if (actionCollection[atrbKey] !== undefined) { // Normal MetaData
				isClickable = true;
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
				//}
			else {
				isClickable = true;
				extraClasses.push("atrbbasedisabled");
			}
		}
		// atrbbasedisabled
		else {
			isClickable = true;
			extraClasses.push("atrbbasedisabled");
		}

		// Create element
		var el = "<div class='fl'>";
		el += ((isClickable) ? clickableHtml : "");
		el += "<div class='atrbbasecolor" + dealType /*.replace(/ /g, "")*/ + " atrbContainer " + extraClasses.join(" ") + " " + ((isClickable) ? "clickable" : "") + "' ";
		el += "title='" + title + "'>";
		el += innerIcon;
		el += "</div>";
		el += ((isClickable) ? "</div>" : "");
		el += "</div>";

		return el;
	};


	return {
		restrict: 'E', // E = element, A = attribute, C = class, M = comment
		scope: {
			atrbCd: '@' // '@' is one-way binding (reads the value), '=' is two-way binding, '&' is used to bind functions
			, attrId: '@'
			, stgId: '@'
			, stgName: '@'
		},
		link: linker
	};
}
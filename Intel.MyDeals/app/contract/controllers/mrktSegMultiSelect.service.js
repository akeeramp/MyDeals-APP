(function () {
	'use strict';
	angular
        .module('app.admin')
        .factory('MrktSegMultiSelectService', MrktSegMultiSelectService);

	MrktSegMultiSelectService.$inject = ['logger', 'dataService'];

	function MrktSegMultiSelectService(logger, dataService) {
		var vm = []; // fake scope because we can't actually inject a scope in a service

		//setting a few constants for the strings that occur a lot
		var GEO = "GEO_COMBINED";
		var MRKT_SEG = "MRKT_SEG"
		//these strings will need to be updated if they ever change it in the db or admin screen... TODO: tap into default values bool in basic dropdowns table once those db changes are made
		var WW = "Worldwide";
		var ALL = "All";
		var NONCORP = "NON Corp"

		var uncheckAllNC = true;

		vm.nonCorpMrktSegments = [];
		vm.subMrktSegments = [];
		vm.changedVal = "";

		init();

		return {
			init: init
			, setMkrtSegMultiSelect: setMkrtSegMultiSelect
			, setGeoMultiSelect: setGeoMultiSelect
		}

		function init() {
			dataService.get("/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP").then(
				function (response) {
					for (var i = 0; i < response.data.length; i++) {
						vm.nonCorpMrktSegments.push(response.data[i].DROP_DOWN);
					}
				},
				function (response) {
					logger.error("Unable to get Non Corp Market Segments.", response, response.statusText);
				}
			);

			dataService.get("/api/Dropdown/GetDropdowns/MRKT_SUB_SEGMENT").then(
				function (response) {
					for (var i = 0; i < response.data.length; i++) {
						vm.subMrktSegments.push(response.data[i].DROP_DOWN);
					}
				},
				function (response) {
					logger.error("Unable to get Market Sub Segments.", response, response.statusText);
				}
			);
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

		//returns subset of 'base' nodes that are non corp market segments
		function getNonCorpNodes(treeView) {
			var base = treeView.dataSource.view();
			var ret = [];
			for (var i = 0; i < base.length; i++) {
				if (vm.nonCorpMrktSegments.indexOf(base[i].DROP_DOWN) > -1)
					ret.push(base[i])
			}
			return ret;
		}

		//given boolean emb, either returns all tree nodes that ARE embedded sub segments or all tree nodes that ARE NOT embedded sub segments
		function getEmbeddedNodes(treeNodes, emb) {
			var ret = [];
			if (emb) {
				//return all embedded market sub segments
				for (var i = 0; i < treeNodes.length; i++) {
					if (vm.subMrktSegments.indexOf(treeNodes[i].DROP_DOWN) > -1) {
						ret.push(treeNodes[i])
					}
					if (treeNodes[i].hasChildren) {
						ret = ret.concat(getEmbeddedNodes(treeNodes[i].children.view(), emb));
					}
				}
			} else {
				//return all tree nodes that are NOT embedded market sub segments
				//Note: had to hardcode Embedded to be excluded from the result set, unchecking embedded will also uncheck all its children.  Remove that extra condition if we prevent checking of parent nodes.
				for (var i = 0; i < treeNodes.length; i++) {
					if (!(vm.subMrktSegments.indexOf(treeNodes[i].DROP_DOWN) > -1) && treeNodes[i].DROP_DOWN != "Embedded") {
						ret.push(treeNodes[i]);
					}
					//TODO: need to also add recursive call line here if there will ever be other sub-trees other than "Embedded"
				}
			}
			return ret;
		}

		//output a.concat(b) with duplicates stripped out, i.e. if a contains "C" and b contains "C", only one occurance of "C" will be in final return
		function arrayMergeUnique(a, b) {
			for (var i = 0; i < b.length; i++) {
				if (a.indexOf(b[i]) < 0) {
					a.push(b[i]);
				}
			}
			return a;
		}

		//returns a bool indicating whether a member of vm.nonCorpMrktSegments has been removed (i.e. present in oldVal, not present in newVal)
		function removedNonCorpMemberNode(newVal, oldVal) {
			for (var i = 0; i < vm.nonCorpMrktSegments.length; i++) {
				if (newVal.indexOf(vm.nonCorpMrktSegments[i]) < 0 && oldVal.indexOf(vm.nonCorpMrktSegments[i]) > -1) {
					return true;
				}
			}
			return false;
		}

		function checkedEmbeddedSubSegment(newVal, oldVal, checkBool) {
		    if (checkBool) {
		        if (newVal.indexOf("Embedded") > -1) {
		            //user selected parent embedded node, set changed val to first sub mrkt segment
		            vm.changedVal = vm.subMrktSegments[0];
		            return true;
		        }
				//check if user checked a node that is an embedded sub segment
			    for (var i = 0; i < vm.subMrktSegments.length; i++) {
				    if (newVal.indexOf(vm.subMrktSegments[i]) > -1 && oldVal.indexOf(vm.subMrktSegments[i]) < 0) {
				        vm.changedVal = vm.subMrktSegments[i];
						return true;
					}
				}
				return false;
			} else {
				//check if user checked a node that is not an embedded sub segment
				for (var i = 0; i < newVal.length; i++) {
				    if (oldVal.indexOf(newVal[i]) < 0 && !(vm.subMrktSegments.indexOf(newVal[i]) > -1)) {
				        vm.changedVal = newVal[i];
						return true;
					}
				}
				return false;
			}
		}


		function setMkrtSegMultiSelect(treeViewDivId, multiSelectDivId, newValue, oldValue) {
			if (oldValue[MRKT_SEG].value.toString() != newValue[MRKT_SEG].value.toString()) {

				var treeView = $("#" + treeViewDivId).data("kendoTreeView");
				var multiSelect = $("#" + multiSelectDivId).data("kendoMultiSelect");

				if (treeView != null) {

					if (newValue[MRKT_SEG].value.length > 0) {
						//Logic for "ALL"
						if (newValue[MRKT_SEG].value.indexOf(ALL) > -1 && !(oldValue[MRKT_SEG].value.indexOf(ALL) > -1)) {
							//if user has another mrkt seg selected and then selects ALL, need to deselect all other MRKT SEGs
							newValue[MRKT_SEG].value = [ALL];
							multiSelect.value([ALL]);
							setAllNodes(treeView.dataSource.view(), false);
							treeView.dataItem(treeView.findByText(ALL)).set("checked", true);
						} else if (oldValue[MRKT_SEG].value.length == 1 && oldValue[MRKT_SEG].value[0] == ALL && newValue[MRKT_SEG].value.indexOf(ALL) > -1) {
							//if user had ALL selected and selects another MRKT SEG, need to deselect ALL
							newValue[MRKT_SEG].value.splice(newValue[MRKT_SEG].value.indexOf(ALL), 1);
							multiSelect.value(newValue[MRKT_SEG].value);
							treeView.dataItem(treeView.findByText(ALL)).set("checked", false);
						}

						//Logic for NonCorp
						if (newValue[MRKT_SEG].value.indexOf(NONCORP) > -1 && !(oldValue[MRKT_SEG].value.indexOf(NONCORP) > -1)) {
							//if user selects NonCorp, make sure all NonCorp nodes are checked
							newValue[MRKT_SEG].value = arrayMergeUnique(newValue[MRKT_SEG].value, vm.nonCorpMrktSegments);
							multiSelect.value(newValue[MRKT_SEG].value);
							setAllNodes(getNonCorpNodes(treeView), true);
						} else if (newValue[MRKT_SEG].value.indexOf(NONCORP) < 0 && oldValue[MRKT_SEG].value.indexOf(NONCORP) > -1) {
							//if user deselects NonCorp, make sure all NonCorp nodes are unchecked
							if (uncheckAllNC) {
								newValue[MRKT_SEG].value = newValue[MRKT_SEG].value.filter(function (x) { return vm.nonCorpMrktSegments.indexOf(x) < 0 });
								multiSelect.value(newValue[MRKT_SEG].value);
								setAllNodes(getNonCorpNodes(treeView), false);
							} else {
								//if user deselects a noncorp member, the noncorp node itself must be unchecked.  this case accounts for that scenario so that the noncorp node can be unchecked without all other noncorp market segments being unchecked along with it.
								uncheckAllNC = true;
							}
						} else if (newValue[MRKT_SEG].value.indexOf(NONCORP) > -1 && removedNonCorpMemberNode(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value)) {
							//if user deselects any Noncorp member node, deselect NonCorp node itself if noncorp node was in selection
							newValue[MRKT_SEG].value.splice(newValue[MRKT_SEG].value.indexOf(NONCORP), 1);
							multiSelect.value(newValue[MRKT_SEG].value);
							if (treeView.dataItem(treeView.findByText(NONCORP)).checked == true) {
								treeView.dataItem(treeView.findByText(NONCORP)).set("checked", false);
								uncheckAllNC = false; //set NONCORP to unchecked, but do not want to uncheck all noncorp nodes on next sweep.
							}
						}

						//Logic for Embedded
						//getEmbeddedNodes
						if (checkedEmbeddedSubSegment(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value, true)) {
							//if select any EMBEDDED SUB SEGMENT, uncheck everything except the selected EMBEDDED SUB SEGMENT
						    newValue[MRKT_SEG].value = [vm.changedVal];
							multiSelect.value(newValue[MRKT_SEG].value);
							setAllNodes(treeView.dataSource.view(), false);
							treeView.dataItem(treeView.findByText(vm.changedVal)).set("checked", true);
						} else if (checkedEmbeddedSubSegment(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value, false)) {
							//if select non EMBEDDED SUB SEGMENT, uncheck all EMBEDDED SUB SEGMENTS
							newValue[MRKT_SEG].value = newValue[MRKT_SEG].value.filter(function (x) { return vm.subMrktSegments.indexOf(x) < 0 });
							multiSelect.value(newValue[MRKT_SEG].value);
							setAllNodes(getEmbeddedNodes(treeView.dataSource.view(), true), false);
						}

						//TODO: if select embedded, do not let them. is that possible? may need to disable checkchicldren
					}
				}
			}
		}

		function setGeoMultiSelect(divId, newValue, oldValue) {
			if (oldValue[GEO].value.toString() != newValue[GEO].value.toString()) {
				if (newValue[GEO].value.length > 1) {
					if (newValue[GEO].value.indexOf(WW) > -1 && !(oldValue[GEO].value.indexOf(WW) > -1)) {
						//if user has another geo selected and then selects WW, need to deselect all other GEOs
						newValue[GEO].value = [WW];
						$("#" + divId).data("kendoMultiSelect").value([WW])
					} else if (oldValue[GEO].value.length == 1 && oldValue[GEO].value[0] == WW && newValue[GEO].value.indexOf(WW) > -1) {
						//if user had WW selected and selects another GEO, need to deselect WW
						newValue[GEO].value.splice(newValue[GEO].value.indexOf(WW), 1)
						$("#" + divId).data("kendoMultiSelect").value(newValue[GEO].value)
					}
				}
			}
		}

	}

})();

/// <reference path="meetComp.service.js" />
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('meetCompController', meetCompController);

    meetCompController.$inject = ['$scope', 'dataService', 'meetCompService', 'logger', 'confirmationModal', '$linq', 'gridConstants'];

    function meetCompController($scope, dataService, meetCompService, logger, confirmationModal, $linq, gridConstants) {        
        var vm = this;
        
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    meetCompService.getMeetCompData()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Meet Comp Data.", response, response.statusText);
                        });
                }
            },
            pageSize: 8,
            group: ([{ field: "CUST_NM" }, { field: "PRD_CAT_NM" }, { field: "HIER_VAL_NM" }]),            
            schema: {
                model: {
                    id: "MEET_COMP_SID",
                    fields: {
                        MEET_COMP_SID: {
                            editable: false, nullable: true
                        },
                        HIER_VAL_NM: { validation: { required: true } },
                        ACTV_IND: { validation: { required: true }, type:"boolean" },
                        MEET_COMP_PRD: { editable: false, validation: { required: false } },
                        MEET_COMP_PRC: { editable: false, validation: { required: true }, type: "number" },
                        COMP_BNCH: { editable: false, validation: { required: true }, type: "number" },
                        IA_BNCH: { editable: false, validation: { required: true }, type: "number" },
                        CRE_EMP_NM: { editable: false, validation: { required: true } },
                        CRE_DTM: { type: "date", editable: false },
                        CHG_EMP_NM: { editable: false, validation: { required: true } },
                        CHG_DTM: { type: "date", editable: false}
                    }
                }
            }
        });
        
        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            groupable: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },            
            editable: { mode: "inline", confirmation: false },
            toolbar: gridUtils.clearAllFiltersToolbar(),
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            dataBound: function () {
                var grid = $('#grid').data('kendoGrid');
                $(grid.thead.find('th')).each(function () {
                    $(this).prop('title', $(this).data('title'));
                });
            },
            columns: [               
                { field: "CUST_NM", title: "Customer", width: "9%", filterable: { multi: true, search: true } },
                { field: "PRD_CAT_NM", title: "Vertical", width: "6%", filterable: { multi: true, search: true } },
                { field: "HIER_VAL_NM", title: "Product", width: "9%", filterable: { multi: true, search: true } },
                { field: "ACTV_IND", title: "Activate/Deactivate", width: "6%", template: "<toggle ng-click='vm.gridSelectItem(dataItem,$event)' size='btn-sm' ng-model='dataItem.ACTV_IND'></toggle>", editor: activateDeactivate, attributes: { style: "text-align: center;" }, filterable: { multi: true, search: true}, groupable: false },
                { field: "MEET_COMP_PRD", title: "Meet Comp SKU", width: "9%", filterable: { multi: true, search: true }, groupable: false },
                { field: "MEET_COMP_PRC", title: "Meet Comp Price", width: "9%", format: "{0:c}", groupable: false },
                { field: "IA_BNCH", title: "IA Bench", width: "8%", groupable: false },
                { field: "COMP_BNCH", title: "Comp Bench", width: "8%", groupable: false },
                { field: "CRE_EMP_NM", title: "Created By", width: "11%", filterable: { multi: true, search: true }, groupable: false },
                {
                    field: "CRE_DTM", title: "Created Date", width: "11%", type: "date",
                    template: "#= kendo.toString(new Date(CRE_DTM), 'M/d/yyyy') #",
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    groupable: false
                },
                { field: "CHG_EMP_NM", title: "Last Modified By", width: "11%", filterable: { multi: true, search: true }, groupable: false },
                {
                    field: "CHG_DTM", title: "Last Modified Date", width: "11%", type: "date",
                    template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy') #",
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    groupable: false
                }
            ]
        };        

        //Custom Editor for Toggle view
        function activateDeactivate(container, options) {
            return "<toggle size='btn-sm' field='" + options.field + "' ng-model='" + options.field + "' ></toggle>";
        }

        //Activate/Deactivate Meet Comp Record
        vm.gridSelectItem = function (dataItem, event) {                       
            meetCompService.activateDeactivateMeetComp(dataItem.MEET_COMP_SID, dataItem.ACTV_IND)
                .then(function (response) {
                    if (response.data[0].MEET_COMP_SID > 0) {
                        var CHG_DTM = moment(response.data[0].CHG_DTM).format("l"); 
                        dataItem.CHG_EMP_NM = usrName;
                        dataItem.CHG_DTM = CHG_DTM;
                        $("#grid").find("tr[data-uid='" + dataItem.uid + "'] td:eq(14)").text(CHG_DTM);                        
                    }
                    else {
                        logger.error("Activate Deactivate Meet Comp failed");
                    }
                    
                }, function (response) {
                    logger.error("Activate Deactivate Meet Comp failed", response, response.statusText);
                });
        }
    }
})();
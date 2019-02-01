angular
    .module('app.core')
    .controller('MeetCompDealDetailsModalController', MeetCompDealDetailsModalController);

MeetCompDealDetailsModalController.$inject = ['$compile', '$filter', '$scope', '$uibModal', '$uibModalInstance', 'gridConstants', 'GetDealDetailsData'];

function MeetCompDealDetailsModalController($compile, $filter, $scope, $uibModal, $uibModalInstance, gridConstants, GetDealDetailsData) {
    var vm = this;
    vm.GetDealDetailsData = GetDealDetailsData;

    vm.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.dataSourceParent = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.GetDealDetailsData);
            },
            create: function (e) {
            }
        },
        pageSize: 10,
        batch: true,
        schema: {
            model: {
                id: "DEAL_OBJ_SID",
                fields: {
                    DEAL_OBJ_SID: {
                        editable: false, nullable: true
                    },
                    CTRCT_NM: { validation: { required: true }, type: "string" },
                    CNSMPTN_RSN: { validation: { required: true } },
                    DEAL_CMBN_TYPE: { validation: { required: true } },                    
                    END_DT: { editable: false, validation: { required: true } },
                    OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                    STRT_DT: { editable: false, validation: { required: true } },
                    WF_STG_CD: { editable: false, validation: { required: true } },                    
                    "_behaviors": { type: "object" }
                }
            }
        }
    });

    $scope.gridOptions = {
        dataSource: $scope.dataSourceParent,
        filterable: true,
        scrollable: true,
        sortable: true,
        navigatable: true,
        resizable: true,
        reorderable: true,
        columnMenu: false,
        groupable: false,
        sort: function (e) { gridUtils.cancelChanges(e); },
        filter: function (e) { gridUtils.cancelChanges(e); },
        editable: true,
        pageable: {
            refresh: true,
            pageSizes: [10, 25, 50, 100],
            buttonCount: 5
        },        
        columns: [
            {
                field: "DEAL_OBJ_SID",
                title: "Deal ID",
                width: 150,
                template: "<div class='readOnlyCell' title='#=DEAL_OBJ_SID#'>#=DEAL_OBJ_SID#</div>"
            },
            {
                field: "OBJ_SET_TYPE",
                title: "Deal Type",
                width: 150,                
                template: "<div class='readOnlyCell' title='#=OBJ_SET_TYPE#'>#=OBJ_SET_TYPE#</div>"
            },
            {
                field: "REBT_TYPE",
                title: "Rebate Type",
                width: 150,
                template: "<div class='readOnlyCell' title='#=REBT_TYPE#'>#=REBT_TYPE#</div>"
            },
            {
                field: "CTRCT_NM",
                title: "Contract Name",
                width: 150,
                template: "<div class='readOnlyCell' title='#=CTRCT_NM#'>#=CTRCT_NM#</div>"
            },
            {
                field: "WF_STG_CD",
                title: "Workflow Stage",
                template: "<div class='readOnlyCell' title='#=WF_STG_CD#'>#=WF_STG_CD#</div>",
                width: 150
            },
            {
                field: "STRT_DT",
                title: "Start Date",
                template: "<div class='readOnlyCell' title='#= kendo.toString(new Date(STRT_DT), 'M/d/yyyy') #'>#= kendo.toString(new Date(STRT_DT), 'M/d/yyyy') #</div>",
                width: 170,
                filterable: {
                    extra: false,
                    ui: "datepicker"
                }
            },
            {
                field: "END_DT",
                title: "End Date",
                template: "<div class='readOnlyCell' title='#= kendo.toString(new Date(END_DT), 'M/d/yyyy') #'>#= kendo.toString(new Date(END_DT), 'M/d/yyyy') #</div>",
                width: 170,
                filterable: {
                    extra: false,
                    ui: "datepicker"
                }
            },
            {
                field: "DEAL_CMBN_TYPE",
                title: "Additive",
                template: "<div class='readOnlyCell' title='#=DEAL_CMBN_TYPE#'>#=DEAL_CMBN_TYPE#</div>",
                width: 150
            },
            {
                field: "CNSMPTN_RSN",
                title: "Consumption Reason",
                width: 150,
                template: "<div class='readOnlyCell' title='#=CNSMPTN_RSN#'>#=CNSMPTN_RSN#</div>"
            }
        ]
    };



}
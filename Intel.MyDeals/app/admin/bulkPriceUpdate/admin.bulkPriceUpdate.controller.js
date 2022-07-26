(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('BulkPriceUpdateController', BulkPriceUpdateController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    BulkPriceUpdateController.$inject = ['bulkPriceUpdateService', '$scope', 'gridConstants', 'logger', '$timeout', '$uibModal', 'dataService'];

    function BulkPriceUpdateController(bulkPriceUpdateService, $scope, gridConstants, logger, $timeout, $uibModal, dataService) {

        //$scope.accessAllowed = true;
        //if (!window.isDeveloper) {
        //    // Kick not valid users out of the page
        //    $scope.accessAllowed = false;
        //    document.location.href = "/Dashboard#/portal";
        //}
        var vm = this;
        vm.UpdatedResults = [];
        vm.Send_Vstx_Flg = {};
        //$scope.UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
        //$scope.ShowResults = false;
        //$scope.ShowNumeric = false;

        //animation: true,
        //    backdrop: 'static',
        //        templateUrl: 'app/admin/PrimeCustomers/bulkUnifyModal.html',
        //            controller: 'BulkUnifyModelController',
        //                controllerAs: 'vm',
        //                    size: 'lg',
        //    windowClass: 'prdSelector-modal-window'

        vm.OpenBulkPriceUpdateModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/admin/bulkPriceUpdate/bulkPriceUpdateModal.html',
                controller: 'BulkPriceUpdateModelController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdSelector-modal-window'
            });
            modalInstance.rendered.then(function () {
                $("#fileUploader").removeAttr("multiple");
            });
            modalInstance.result.then(function (returnData) {
            }, function () { });
        }

        vm.uploadFile = function (e) {
            alert("Hija");
            vm.spinnerMessageDescription = "Please wait while uploading Unification data..";
            $(".k-upload-selected").click();
        }

        vm.processData = function () {
            //var data = {};
            // Remove this once you get the execution button working.
            let data = '{ "BulkPriceUpdateRecord" : [' +
                '{ "DealId": "655425", "DealDesc": "Make a change", "EcapPrice": "95.00" },' +
                '{ "DealId": "655446", "DealDesc": "Make a change2", "EcapPrice": "99.00" },' +
                '{ "DealId": "955351", "DealDesc": "Make a change3" } ]}';

            bulkPriceUpdateService.UpdatePriceRecord(data)
                .then(function (response) {
                    e.success(response.data);
                }, function (response) {
                    logger.error("Unable to execute Price Record Updates.", response, response.statusText);
                });
        }


        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            var newState = msg != undefined && msg !== "";
            isShowFunFact = true; // Always show fun fact
            // if no change in state, simple update the text
            if ($scope.isBusy === newState) {
                $scope.isBusyMsgTitle = msg;
                $scope.isBusyMsgDetail = !detail ? "" : detail;
                $scope.isBusyType = msgType;
                $scope.isBusyShowFunFact = isShowFunFact;
                return;
            }

            $scope.isBusy = newState;
            if ($scope.isBusy) {
                $scope.isBusyMsgTitle = msg;
                $scope.isBusyMsgDetail = !detail ? "" : detail;
                $scope.isBusyType = msgType;
                $scope.isBusyShowFunFact = isShowFunFact;
            } else {
                $timeout(function () {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                }, 100);
            }
        }

        // Add stuff here



        //vm.dataSource = new kendo.data.DataSource({
        //    transport: {
        //        read: function (e) {
        //            e.success(vm.UpdatedResults);
        //        }
        //    },
        //    schema: {
        //        model: {
        //            id: "DEAL_ID",
        //            fields: {
        //                DEAL_ID: { editable: false, nullable: false },
        //                ATRB_DESC: { editable: false, nullable: false },
        //                UPD_MSG: { editable: false, nullable: false }
        //            }
        //        }
        //    }
        //})

        //vm.gridOptions = {
        //    dataSource: vm.dataSource,
        //    sortable: true,
        //    scrollable: true,
        //    resizable: true,
        //    sort: function (e) { gridUtils.cancelChanges(e); },
        //    columns: [
        //        {
        //            field: "DEAL_ID",
        //            width: "75px",
        //            title: "Deal Id"
        //        },
        //        {
        //            field: "ATRB_DESC",
        //            width: "200px",
        //            title: "Field"
        //        },
        //        {
        //            field: "UPD_MSG",
        //            title: "Results"

        //        }
        //    ]
        //}


    }
})();
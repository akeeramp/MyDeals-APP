angular
    .module('app.contract')
    .controller('MeetCompController', MeetCompController)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
MeetCompController.$inject = ['$scope', '$uibModalStack', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger', '$uibModal', '$timeout', 'dataItem', 'parentScope'];

function MeetCompController($scope, $uibModalStack, $state, $stateParams, $filter, objsetService, confirmationModal, dataService, logger, $uibModal, $timeout, dataItem, parentScope) {
    $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
        $timeout(function () {
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
        });
    }
    
    $scope.parent = parentScope;
    $scope.PRC_ST_OBJ_SID = dataItem.PRC_ST_OBJ_SID;
    $scope.OBJ_SID = dataItem.DC_ID;
    $scope.LAST_MEET_COMP_RUN = moment(gridUtils.convertLocalToPST(new Date())).subtract(4, 'hour');;
    $scope.PAGE_NM = 'MCTPOPUP';

    $scope.setBusy("Meet Comp...", "Please wait we are fetching Meet Comp Data...");

    $scope.dismissPopup = function () {
        $uibModalStack.dismissAll();
    }

    $scope.setIsBusyFalse = function () {
        $scope.setBusy("","");
    }

    $scope.resetDirty = function () {
        //return $scope.parent.resetDirty();
    }

    

}
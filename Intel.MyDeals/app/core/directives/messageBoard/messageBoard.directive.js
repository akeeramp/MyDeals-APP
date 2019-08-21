angular
    .module('app.core')
    .directive('messageBoard', messageBoard);

messageBoard.$inject = ['$compile', '$timeout', 'objsetService', '$uibModal'];

function messageBoard($compile, $timeout, objsetService, $uibModal) {

    return {
        scope: {
            messages: '=ngModel',
            idTitle: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/messageBoard/messageBoard.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.infoCnt = 0;
            $scope.warnCnt = 0;
            $scope.infoMsg = "";
            $scope.warnMsg = "";
            $scope.showDetails = false;

            $scope.disableEmail = function () {
                return false;
                //return $scope.$parent.emailData["Approve"] === undefined || $scope.$parent.emailData["Approve"].length === 0;
            }

            $scope.openEmailMsg = function () {

                $("#wincontractMessages").data("kendoWindow").close();

                function lastWord(words) {
                    var n = words.split(" ");
                    return n[n.length - 1];
                }

                var msgMapping = {};
                for (var m = 0; m < $scope.messages.length; m++) {
                    msgMapping[$scope.messages[m].KeyIdentifiers[0]] = lastWord($scope.messages[m].Message);
                }

                var actns = ["Approve", "Revise"];
                var actnList = [];

                // Check unique stages as per role
                var stageToCheck = "";
                if (window.usrRole == "DA") {
                    stageToCheck = "Approved"
                } else if (window.usrRole == "GA") {
                    stageToCheck = "Submitted"
                }

                // set this flag to false when stages are not unique as per role
                var stagesOK = true;

                var rootUrl = window.location.protocol + "//" + window.location.host;

                var items = [];
                for (var a = 0; a < actns.length; a++) {
                    var item = $scope.$parent.emailData[actns[a]];
                    if (!!item) {
                        for (var i = 0; i < item.length; i++) {
                            item[i].CUST_NM = $scope.$parent.contractData.Customer.CUST_NM;
                            for (var x = 0; x < $scope.$parent.contractData.PRC_ST.length; x++) {
                                if ($scope.$parent.contractData.PRC_ST[x].DC_ID === item[i].DC_ID)
                                    item[i].VERTICAL_ROLLUP = $scope.$parent.contractData.PRC_ST[x].VERTICAL_ROLLUP;
                            }
                            item[i].CNTRCT = "#" + $scope.$parent.contractData.DC_ID + " " + $scope.$parent.contractData.TITLE;
                            item[i].NEW_STG = !!msgMapping[item[i].DC_ID] ? msgMapping[item[i].DC_ID] : "";
                            item[i].url = rootUrl + "/advancedSearch#/gotoPs/" + item[i].DC_ID;
                            item[i].contractUrl = rootUrl + "/Contract#/manager/" + $scope.$parent.contractData.DC_ID;
                            item[i].C2A_ID = $scope.$parent.contractData.C2A_DATA_C2A_ID;
                            items.push(item[i]);
                            var stg = item[i].NEW_STG.replace(/.\s*$/, "");
                            if (stageToCheck != "" && stageToCheck != stg) {
                                stagesOK = false;
                            }
                        }
                    }
                }

                var subject = "";
                var eBodyHeader = "";

                if (stagesOK && window.usrRole === "DA") {
                    subject = "My Deals Deals Approved for ";
                    eBodyHeader = "My Deals Deals Approved!";
                } else if (stagesOK && window.usrRole === "GA") {
                    subject = "My Deals Approval Required for "
                    eBodyHeader = "My Deals Approval Required!";
                } else {
                    subject = "My Deals Action Required for ";
                    eBodyHeader = "My Deals Action Required!";
                }

                if (items.length === 0) {
                    kendo.alert("No items were approved.");
                    return;
                }

                var data = {
                    from: window.usrEmail,
                    items: items,
                    eBodyHeader: eBodyHeader
                }
                actnList.push(kendo.template($("#emailItemTemplate").html())(data));
                var msg = actnList.join("\n\n");

                var custNames = [];
                for (var x = 0; x < items.length; x++) {
                    if (custNames.indexOf(items[x].CUST_NM) < 0)
                        custNames.push(items[x].CUST_NM);
                }

                subject = subject + custNames.join(', ') + "!";

                var dataItem = {
                    from: "mydeals.notification@intel.com",
                    to: "",
                    subject: subject,
                    body: msg
                };
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'emailModal',
                    controller: 'emailModalCtrl',
                    size: 'lg',
                    resolve: {
                        dataItem: function () {
                            return dataItem;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                }, function () { });
            }

            $scope.$on('refresh', function (event, args) {
                $timeout(function () {
                    $scope.infoCnt = 0;
                    $scope.warnCnt = 0;
                    $scope.infoMsg = "";
                    $scope.warnMsg = "";
                    for (var i = 0; i < $scope.messages.length; i++) {
                        if ($scope.messages[i].MsgType === 1) $scope.infoCnt += 1;
                        if ($scope.messages[i].MsgType === 2) $scope.warnCnt += 1;
                    }
                    $scope.infoMsg = $scope.infoCnt + ($scope.infoCnt === 1 ? " stage was successfully changed" : " stages were successfully changed");
                    $scope.warnMsg = $scope.warnCnt + ($scope.warnCnt === 1 ? " stage was unable to change" : " stages were unable to change");

                    $scope.title = "Stage was Changed";
                    if ($scope.infoCnt === 0) $scope.title = "No Stages were Changed";

                    $("#msgGrid").kendoGrid({
                        dataSource: new kendo.data.DataSource({
                            data: $scope.messages
                        }),
                        columns: [
                            { field: "MsgType", title: "&nbsp;", width: 50, template: "#= gridUtils.msgIcon(data) #" },
                            { field: "KeyIdentifiers", title: $scope.idTitle, template: "#=data.KeyIdentifiers[0]#", width: "130px;" },
                            { field: "Message", title: "Message" }
                        ],
                        resizable: true
                    });

                    $scope.$apply();
                }, 200);
            });

        }],
        link: function (scope, element, attr) {
        }
    };
}

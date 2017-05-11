angular
    .module('app.core')
    .directive('messageBoard', messageBoard);

messageBoard.$inject = ['$compile', '$timeout'];

function messageBoard($compile, $timeout) {

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

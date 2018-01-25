angular
    .module('app.core')
    .directive('messageBoard', messageBoard);

messageBoard.$inject = ['$compile', '$timeout', 'objsetService'];

function messageBoard($compile, $timeout, objsetService) {

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

            $scope.openEmailMsg = function () {

                function lastWord(words) {
                    var n = words.split(" ");
                    return n[n.length - 1];
                }

                var msgMapping = {};
                for (var m = 0; m < $scope.messages.length; m++) {
                    msgMapping[$scope.messages[m].KeyIdentifiers[0]] = lastWord($scope.messages[m].Message);
                }

                var actns = ["Approve", "Revise", "Cancel", "Hold"];
                var actnList = [];

                var rootUrl = window.location.protocol + "//" + window.location.host;

                var items = [];
                for (var a = 0; a < actns.length; a++) {
                    var item = $scope.$parent.emailData[actns[a]];
                    if (!!item) {
                        for (var i = 0; i < item.length; i++) {
                            item[i].NEW_STG = !!msgMapping[item[i].DC_ID] ? msgMapping[item[i].DC_ID] : "";
                            item[i].url = rootUrl + "/advancedSearch#/gotoPs/" + item[i].DC_ID;
                            items.push(item[i]);
                        }
                    }
                }

                actnList.push(kendo.template($("#emailItemTemplate").html())(items));

                var url = '/Email/SubmissionNotification';
                var form = $('<form action="' + url + '" method="post">' +
                  '<input type="text" name="Subject" value="My Deals Submission Notification" />' +
                  '<input type="text" name="Body" value="' + actnList.join("\n\n") + '" />' +
                  '<input type="text" name="From" value="" />' +
                  '</form>');
                $('body').append(form);
                form.submit();
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

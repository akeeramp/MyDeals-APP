angular
    .module('app.core')
    .directive('dealToolsTender', dealToolsTender);

dealToolsTender.$inject = ['$timeout', 'logger', 'dataService', '$rootScope', '$compile', '$templateRequest', 'colorDictionary'];

function dealToolsTender($timeout, logger, dataService, $rootScope, $compile, $templateRequest, colorDictionary) {
    return {
        scope: {
            dataItem: '=ngModel',
            isEditable: '@isEditable',
            isCommentEnabled: '=?'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealToolsTender.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.assignVal = function (field, defval) {
                var item = $scope[field];
                return (item === undefined || item === null) ? defval : item;
            }

            $scope.isCommentEnabled = $scope.assignVal("isCommentEnabled", true);

            var rootScope = $scope.$parent;
            //if (!$scope.$parent.contractData) {
            //    rootScope = $scope.$parent.$parent.$parent.$parent.$parent;
            //}
            $scope.rootScope = rootScope;

            $scope.stgOneChar = function () {
                return gridUtils.stgOneChar($scope.dataItem);
            }

            $scope.stgFullTitleChar = function () {
                return gridUtils.stgFullTitleChar($scope.dataItem);
            }

            $scope.chkClick = function (dataItem) {
                $timeout(function () {
                    $scope.rootScope.chkClick(dataItem);
                }, 50);
            }

            // US87523 - Strategy Stage / Deal Status Clarity - This is very hack-ish coding by a JS newbie.
            // Taken from Phil's absolutely awesome other color-coding areas in other JS files...  Had to hijack local function getStageBgColorStyle(stgFullTitleChar()) to get the right stage though.
            $scope.getStageBgColorStyle = function (c) {
                return { backgroundColor: $scope.getColorStage(c) };
            }
            $scope.getColor = function (k, c) {
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#aaaaaa";
            }
            $scope.getColorStage = function (d) {
                if (!d) d = "Draft";
                return $scope.getColor('stage', d);
            }
            $scope.getStage = function (dataItem) {
                return gridUtils.stgFullTitleChar(dataItem);
            }

        }],
        link: function (scope, element, attr) {
            scope.el = element;
        }
    };
}

angular
    .module('app.core')
    .directive('iconMctPct', iconMctPct);

iconMctPct.$inject = ['colorDictionary'];

function iconMctPct(colorDictionary) {
    return {
        scope: {
            dataValue: '=ngModel',
            overrideValue: '=?overrideValue',
            canView: '=?canView',
            iconStyle: '=?iconStyle',
            iconClass: '=?iconClass'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/iconMctPct.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            if (!$scope.canView) $scope.canView = true;

            function upperCase(str) {
                return str.toUpperCase();
            }
            function titleCase(str) {
                var firstLetterRx = /(^|\s)[a-z]/g;
                return str.toLowerCase().replace(firstLetterRx, upperCase);
            }

            $scope.getIconClass = function () {
                var c = titleCase($scope.dataValue);
                if (c === "Pass") return "intelicon-passed-completed-solid";
                if (c === "Fail") return "intelicon-alert-solid";
                if (c === "Na") return "intelicon-information-solid";
                if (c === "Incomplete") return "intelicon-help-solid";
                return "intelicon-help-solid";
            }
            $scope.getColor = function (k, c) {
                c = titleCase(c);
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#aaaaaa";
            }
            $scope.getColorStyle = function () {
                return { color: $scope.getColorPct($scope.dataValue) };
            }
            $scope.getColorPct = function (d) {
                if (!d) d = "Incomplete";
                return $scope.getColor('pct', d);
            }
            $scope.getColorMct = function (d) {
                if (!d) d = "Incomplete";
                return $scope.getColor('mct', d);
            }


        }],
        link: function (scope, element, attr) {
        }
    };
}

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
            iconClass: '=?iconClass',
            notRunMsg: '=?notRunMsg'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/iconMctPct.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            if (!$scope.canView) $scope.canView = true;
            if (!$scope.notRunMsg) $scope.notRunMsg = "Not Run Yet";

            function upperCase(str) {
                return str.toUpperCase();
            }
            function titleCase(str) {
                var firstLetterRx = /(^|\s)[a-z]/g;
                return str.toLowerCase().replace(firstLetterRx, upperCase);
            }

            $scope.showTitle = function() {
                return $scope.dataValue === "Not Run Yet" ? $scope.notRunMsg : $scope.dataValue;
            }

            $scope.getIconClass = function () {
                if ($scope.dataValue === undefined) return "intelicon-help-solid";

                var c = titleCase($scope.dataValue);
                if (c.toUpperCase() === "PASS") return "intelicon-passed-completed-solid";
                if (c.toUpperCase() === "FAIL") return "intelicon-alert-solid";
                if (c.toUpperCase() === "NA") return "intelicon-information-solid";
                if (c.toUpperCase() === "INCOMPLETE") return "intelicon-help-solid";
                return "intelicon-help-solid";
            }
            $scope.getColor = function (k, c) {
                if (c === undefined) return "#aaaaaa";

                c = titleCase(c);
                if (c === "Incomplete") c = "InComplete"; // It should all be upper case now, but, just in case...
                if (c === "Na") c = "NA"; // It should all be upper case now, but, just in case...
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#aaaaaa";
            }
            $scope.getColorStyle = function () {
                return { color: $scope.getColorPct($scope.dataValue) };
            }
            $scope.getColorPct = function (d) {
                if (!d) d = "InComplete";
                return $scope.getColor('pct', d);
            }
            $scope.getColorMct = function (d) {
                if (!d) d = "InComplete";
                return $scope.getColor('mct', d);
            }


        }],
        link: function (scope, element, attr) {
        }
    };
}

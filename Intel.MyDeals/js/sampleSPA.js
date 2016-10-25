
(function() {


    var testController = function ($scope, $http) {
        $scope.title = "Jack";
        $scope.btnName = "Get Data";
        $scope.somedata = "";
        $scope.error = "";

        var pingUrl = "/api/Others/GetDBTest";
        var onPingComplete = function (response) {
            //{"dB UTC Time":"10/24/16 2:01 PM","dB Local Time":"10/24/16 8:01 AM","dB Server":"EG1RDMDBDEV01\\DEALSDEV3181; MyDeals"} 
            var msg = "DB Server Name: " + response.data["dB Server"] + " DB Local Time: " + response.data["dB Local Time"];
            $scope.somedata = msg;
        };
        var onPingError = function (reason) {
            $scope.error = "Something went wrong";
        };

        $scope.callApi = function () {
            $http.get(pingUrl).then(onPingComplete, onPingError);
        };


        $scope.init = function () {
            $scope.title = "Jack Reacher";

        };
    }


    var app = angular.module('MyDealsApp', []);
    app.controller('TestCtrl', testController);

}());

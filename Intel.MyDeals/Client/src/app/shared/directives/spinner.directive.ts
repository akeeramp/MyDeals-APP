import * as angular from 'angular';

angular.module("app").directive("ccSpinner", function() {
  return {
    restrict: "AE",
    templateUrl: "Client/src/app/shared/directives/spinner.html",
    scope: {
      isLoading: "=",
      message: "@"
    }
  };
});

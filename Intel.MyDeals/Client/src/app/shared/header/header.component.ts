import * as angular from "angular";

export let HeaderController = {
  restrict: "E",
  selector: "appHeader",
  templateUrl: "Client/src/app/shared/header/header.component.html",
  bindings: {},
  controller: class HeaderComponent {
    getDetails(){
      console.log('*******************coming to header **********************************');
    }
  },
};

angular
    .module("app")
    .component("appHeader", HeaderController);


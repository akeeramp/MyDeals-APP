import * as angular from "angular";
import {Component} from "@angular/core";
import {logger} from "../logger/logger";
import {downgradeComponent} from "@angular/upgrade/static";
import {headerService} from "./header.service";

@Component({
  selector: "app-header",
  templateUrl: "Client/src/app/shared/header/header.component.html",
  styleUrls: ["Client/src/app/shared/header/header.component.css"],
})
export class HeaderComponent {
  constructor(private headerSvc: headerService, private loggerSvc: logger) {}

  //need to check
  private AppToken = "UNKNOWN";
  private GAID = "UNKNOWN";
  private env = "DEV";

  private usrName = "UNKNOWN";
  private usrWwid = 0;
  private usrRole = "UNKNOWN";
  private usrRoleExtension = "";
  private usrRoleId = 6;
  private usrEmail = "";
  private usrVerticals = "";
  private isEditableGrid = true;
  private appVer = "UNKNOWN";
  ////////////////////////////////
  private extraUserPrivs = "";
  private superPrefix = "";
  private extraUserPrivsDetail: Array<string> = [];
  private isDeveloper = true;
  private isReportingUser = true;
  private isTester = true;
  private isSuper = true;
  private isCustomerAdmin = true;
  private isRealSA = true;
  getUserDetails() {
    console.log(
      "***************************** Header Component first ************************"
    );
    //get the API Call
    this.headerSvc.getAntiForgeryTokenToken().subscribe(
      () => {
        console.log(
          "***************************** Header Component second ************************"
        );
        this.headerSvc.getUserDetails().subscribe(
          res => {
            this.usrName =
              res.UserToken.Usr.FirstName + " " + res.UserToken.Usr.LastName;
            this.usrWwid = res.UserToken.Usr.WWID;
            this.usrRole = res.UserToken.Role.RoleTypeCd;
            this.usrRoleId = res.UserToken.Role.RoleTypeId;
            this.usrEmail = res.UserToken.Usr.Email;

            //this.usrName = res.usrName ? res.usrName : "Abhilash Keerampara";
            //this.usrWwid = res.usrWwid ? res.usrWwid : 11715175;
            //this.usrRole = res.usrRole ? res.usrRole : "GA";
            //this.usrRoleId = res.usrRoleId ? res.usrRoleId : 6;
            //this.usrEmail = res.usrEmail ? res.usrEmail : "abhilash.keerampara@intel.com";
            this.isEditableGrid = res.isEditableGrid
              ? res.isEditableGrid
              : true;
            this.appVer = res.appVer ? res.appVer : "1.2.0.24863";
            this.isCustomerAdmin = res.isCustomerAdmin
              ? res.isCustomerAdmin
              : true;
            this.isRealSA = res.isRealSA ? res.isRealSA : true;
            this.isTester = res.isTester ? res.isTester : true;
            this.isDeveloper = res.isDeveloper ? res.isDeveloper : true;
            this.extraUserPrivs = res.extraUserPrivs ? res.extraUserPrivs : "";

            if (this.isSuper) {
              this.superPrefix = "Super";
              this.extraUserPrivsDetail.push("Super User");
            }
            if (this.isCustomerAdmin) {
              this.extraUserPrivsDetail.push("Accounts Administrator");
            }
            if (this.usrRole == "SA" && !this.isRealSA) {
              this.usrRoleExtension = "Account";
            } // Mark neutered SA role because this is a customer admin
            if (this.isTester) {
              this.extraUserPrivs += "T";
              this.extraUserPrivsDetail.push("System Tester");
            }
            if (this.isDeveloper) {
              this.extraUserPrivs += "D";
              this.extraUserPrivsDetail.push("System Developer");
            }
            if (this.extraUserPrivs == "STD") {
              this.extraUserPrivs = "STuD";
            } // We practice SAFE CODING on this project
            if (this.extraUserPrivs != "") {
              this.extraUserPrivs = "- " + this.extraUserPrivs;
            }

            let env = "DEV";
            //   ViewBag.AppToken == null ||
            //   ViewBag.AppToken.OpEnvironment == null ||
            //   ViewBag.AppToken.OpEnvironment.EnvLoc == null
            //     ? "UNKNOWN"
            //     : ViewBag.AppToken.OpEnvironment.EnvLoc.Location;
            //TODO: Fetch it from DB
            this.GAID = env == "CONS" ? "UA-47054404-40" : "UA-47054404-41";
            if (env == "PROD") {
              this.GAID = "UA-47054404-42";
            }

            //setting window variable

            (<any>window).isEditableGrid = this.isEditableGrid;
            (<any>window).usrRole = this.usrRole;
            (<any>window).usrRoleId = this.usrRoleId;
            (<any>window).usrName = this.usrName;
            (<any>window).usrWwid = this.usrWwid;
            (<any>window).usrEmail = this.usrEmail;
            (<any>window).isSuper = this.isSuper == true;
            (<any>window).usrVerticals = this.usrVerticals;
            (<any>window).appVer = this.appVer;

            (<any>window).isDeveloper = this.isDeveloper == true;
            (<any>window).isCustomerAdmin = this.isCustomerAdmin == true;
            (<any>window).isTester = this.isTester == true;

            (<any>window).env = this.env;
            (<any>window).dataLayer = (<any>window).dataLayer || [];
            console.log(
              "***************************** Header Component Success ************************"
            );
          },
          err => {
            //this.loggerSvc.error("Unable to get getUserDetails.", err);
          }
        );
      },
      error => {
        //this.loggerSvc.error("Unable to get token.", error);
      }
    );
  }
  eggSmw() {
    window.open(
      "/egg/mb/menu.html",
      "_blank",
      "toolbar=no,scrollbars=no,menubar=no,status=no,titlebar=no,resizable=no,width=642,height=482,top=200,left=200"
    );
  }
  eggDd() {
    window.open(
      "/egg/dd/DbDug.html",
      "_blank",
      "toolbar=no,scrollbars=no,menubar=no,status=no,titlebar=no,resizable=no,width=623,height=625,top=200,left=200"
    );
  }
  clearSessionData(newPath) {
    localStorage.clear(); // clear local storage
    sessionStorage.clear(); // clear session storage

    // Clear cookies too
    const cookies = document.cookie;

    if (cookies !== "") {
      for (let i = 0; i < cookies.split(";").length; ++i) {
        const myCookie = cookies[i];
        const pos = myCookie.indexOf("=");
        const name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }

    window.location = newPath;
    return false;
  }
  gtag() {
    (<any>window).push(arguments);
  }
  ngOnInit() {
    this.getUserDetails();
  }
}
angular.module("app").directive(
  "appHeader",
  downgradeComponent({
    component: HeaderComponent,
  })
);

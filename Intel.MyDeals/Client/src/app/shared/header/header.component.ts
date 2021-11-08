import { RequiredValidator } from "@angular/forms";
import * as angular from "angular";
import {logger} from "../logger/logger";

export let HeaderController = {
  restrict: "E",
  selector: "appHeader",
  templateUrl: "Client/src/app/shared/header/header.component.html",
  // template:`<link rel="stylesheet" href="Client/src/app/shared/header/header.component.css">
  // <div id="smbWindow" style="padding: 0; overflow: hidden !important;"></div>
  // <div ng-init="$ctrl.getUserDetails()">
  //     <div ng-if="$ctrl.env=='PROD'">
  //         <script src="https://appusage.intel.com/Service/api/loguser/114464" async></script>
  //     </div>
  //     <div ng-if="!$ctrl.env=='PROD'">
  //         <script src="https://appusage.intel.com/Service/api/loguser/114464?environment={{$ctrl.env}}" async></script>
  //     </div>
  //     <div id="smbWindow" style="padding: 0; overflow: hidden !important;"></div>
  //     <nav class="navbar navbar-default navbar-fixed-top">
  //         <div class="container-fluid">
  //             <div class="row">
  //                 <div class="col-md-4">
  //                     <div class="navbar-header" style="margin-left: 5px;">
  //                         <img class="navbar-logo" alt="" src="/images/intel-logo-white-100.png"
  //                              ng-dblclick="$ctrl.eggSmw()">
  //                         <a class="navbar-brand" href="/Home" title="Back to the My Deals Dashboard">
  //                             My
  //                             Deals
  //                         </a>
  //                     </div>
  //                 </div>
  //                 <div class="col-md-4">
  //                     <div style="text-align: left;" class="navbar-collapse collapse">
  
  //                         <div style="font-size: 14px; color: white; font-weight: bold; padding-left: 10px; padding-right: 10px; padding-bottom:5px;padding-top:5px; background-color: #00B1F1; display: inline-block">
  //                             Google Chrome Required <img src="/images/ChromeIcon.png" style="width: 24px; height: 24px; margin-left: 10px">
  //                             <div ng-if="$ctrl.env !='PROD'">
  //                                 <span style="font-size: 12px; color: white; font-weight: bold; color: Yellow;">
  //                                     Pre-Production
  //                                     Environment: {{$ctrl.env}}
  //                                 </span>
  //                             </div>
  //                         </div>
  //                     </div>
  //                 </div>
  //                 <div class="col-md-4">
  //                     <div class="collapse navbar-collapse" id="myDeals-navbar-collapse">
  //                         <ul class="nav navbar-nav navbar-right">
  
  //                             <li style="text-align: center;">
  //                                 <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
  //                                    aria-expanded="false" style="padding: 7px;">
  //                                     <div class="fl" id="divUsrImg">
  //                                         <img src="https://photos.intel.com/images/{{$ctrl.usrWwid}}.jpg"
  //                                              style="width: 35px; height: 35px; margin-right: 5px; border: 1px solid #ffffff;" />
  //                                     </div>
  //                                     <div class="fl hidden-sm" style="margin-top: 7px; margin-right: 10px;"
  //                                          title="{{$ctrl.extraUserPrivsDetail.join('\n')}}">
  //                                         <div style="font-size: 12px; color: #ffffff; line-height: 1em;"
  //                                              id="divUsrName">{{$ctrl.usrName}}</div>
  //                                         <div style="font-size: 9px; color: #ffffff; line-height: 1em; margin-top: 3px;"
  //                                              id="divUsrRole">
  //                                             {{$ctrl.superPrefix}} {{$ctrl.usrRoleExtension}}
  //                                             {{$ctrl.usrRole}} <span style="color: Yellow;">{{$ctrl.extraUserPrivs}}</span>
  //                                         </div>
  //                                     </div>
  //                                     <div class="fl">
  //                                         <notification-dock></notification-dock>
  //                                     </div>
  //                                 </a>
  //                             </li>
  //                         </ul>
  //                         <div class="fr">
  //                             <admin-banner></admin-banner>
  //                             <deal-popup-dock></deal-popup-dock>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  
  //             <div class="row">
  //                 <div class="col-md-8">
  //                     <div class="menu-bar">
  //                         <ul class="nav nav-tabs nav-tabs-intel-blocks" id="myTab" role="tablist">
  //                             <li><a href="/Home" title="Home"><i class="intelicon-home-solid"></i><span
  //                                         class="hidden-xs"> Home</span></a></li>
  
  //                                 <li class="dropdown"  ng-if="$ctrl.isDeveloper">
  //                                     <a class="btn btn-primary" role="button" href="/" data-toggle="dropdown"
  //                                         data-target="#" title="Developer Documents"><i
  //                                             class="intelicon-attach-document-solid"></i><span class="hidden-xs"> Docs
  //                                         </span><i class="intelicon-down"></i></a>
  //                                     <ul class="dropdown-menu multi-level scaleTopAnim" role="menu"
  //                                         aria-labelledby="dropdownMenu">
  //                                         <li><a href="/CodingPractices">Coding Practices</a></li>
  //                                     </ul>
  //                                 </li>
  
  //                             <li class="dropdown">
  //                                 <a class="btn btn-primary" id="dLabel" role="button" href="/page.html"
  //                                     data-toggle="dropdown" data-target="#" title="Administrative Tools"><i
  //                                         class="intelicon-settings-solid"></i><span class="hidden-xs"> Admin</span> <i
  //                                         class="intelicon-down"></i></a>
  //                                 <ul class="dropdown-menu multi-level scaleTopAnim" role="menu"
  //                                     aria-labelledby="dropdownMenu">
  //                                     <div ng-if="$ctrl.isDeveloper">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">DSA</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/vistex/vistextestapi">Test API </a></li>
  //                                                 <li><a href="Admin#/vistex">Integration Logs</a></li>
  //                                             </ul>
  //                                         </li>
  //                                     </div>
  //                                     <li class="dropdown-submenu">
  //                                         <a tabindex="-1">TroubleShooting</a>
  //                                         <ul class="dropdown-menu" style="width: 250px;">
  //                                             <li class="menu-detailed">
  //                                                 <a href="/error/ResetMyCache"
  //                                                     ng-click="$ctrl.clearSessionData('/error/ResetMyCache')">
  //                                                     <i class="fl fa fa-user-md"></i>
  //                                                     <div class="fl">
  //                                                         Clear <b>My</b> View Model
  //                                                         <div>Clear only your settings</div>
  //                                                     </div>
  //                                                     <div class="clearboth"></div>
  //                                                 </a>
  //                                             </li>
  
  //                                             <div ng-if="$ctrl.isRealSA || $ctrl.isDeveloper">
  
  //                                                 <li class="menu-detailed">
  //                                                     <a href="/error/ResetAVM"
  //                                                         ng-click="$ctrl.clearSessionData('/error/ResetAVM')">
  //                                                         <i class="fl fa fa-medkit"></i>
  //                                                         <div class="fl">
  //                                                             Clear <b>App</b> View Model
  //                                                             <div>Clear only the Middle Tier Cache</div>
  //                                                         </div>
  //                                                         <div class="clearboth"></div>
  //                                                     </a>
  //                                                 </li>
  //                                                 <li class="menu-detailed">
  //                                                     <a href="/error/ResetMT"
  //                                                         ng-click="$ctrl.clearSessionData('/error/ResetMT')">
  //                                                         <i class="fl fa fa-heartbeat"></i>
  //                                                         <div class="fl">
  //                                                             Clear <b>All</b> View Models
  //                                                             <div>Clear Middle Tier and ALL Users</div>
  //                                                         </div>
  //                                                         <div class="clearboth"></div>
  //                                                     </a>
  //                                                 </li>
  //                                             </div>
  //                                         </ul>
  //                                     </li>
  //                                     <div ng-if="($ctrl.env != 'PROD' && $ctrl.env != 'UNKNOWN')">
  //                                         <li><a href="Admin#/employee">Set Your Role (Pre-prod Only)</a></li>
  
  //                                     </div>
  //                                     <div ng-if="$ctrl.isDeveloper">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Monitoring</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/cache">Cache Manager</a></li>
  //                                                 <li><a href="Admin#/oplog">Log Viewer</a></li>
  //                                                 <li><a href="Admin#/constants">Constants</a></li>
  //                                                 <li><a href="Admin#/batchTiming">Batch Job Details</a></li>
  //                                             </ul>
  //                                         </li>
  //                                     </div>
  
  //                                     <div
  //                                         ng-if="($ctrl.isRealSA || $ctrl.isCustomerAdmin || $ctrl.isDeveloper || $ctrl.usrRole == 'GA' || $ctrl.usrRole == 'FSE')">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Customer</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <div
  //                                                     ng-if="($ctrl.isRealSA || $ctrl.isCustomerAdmin || $ctrl.isDeveloper)">
  
  //                                                     <li><a href="Admin#/customers">Customer</a></li>
  //                                                     <li><a href="Admin#/vistexcustomermapping">Customer Mapping</a></li>
  //                                                     <li><a href="Admin#/CustomerVendors">Customer - Vendors</a></li>
  //                                                     <li><a href="Admin#/UnifiedCustomerAdmin">Unified Customer Admin</a>
  //                                                     </li>
  
  //                                                 </div>
  //                                                 <li><a href="Admin#/UnifiedDealRecon">Unified Deal Reconciliation</a>
  //                                                 </li>
  //                                             </ul>
  
  //                                         </li>
  //                                     </div>
  //                                     <div ng-if="($ctrl.isRealSA || $ctrl.isDeveloper)">
  
  //                                         <li><a href="Admin#/geo">Geo</a></li>
  //                                         <li><a href="Admin#/funfact">Fun Facts</a></li>
  
  //                                     </div>
  //                                     <div
  //                                         ng-if="($ctrl.usrRole == 'DA' || $ctrl.usrRole == 'Legal' || ($ctrl.usrRole == 'GA' && $ctrl.isSuper) || $ctrl.isRealSA || $ctrl.isDeveloper)">
  
  //                                         <li><a href="Admin#/meetcomp">Meet Comp</a></li>
  
  //                                     </div>
  //                                     <div ng-if="($ctrl.isRealSA || $ctrl.isDeveloper)">
  
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Products</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/productAlias">Product Alias</a></li>
  //                                                 <li><a href="Admin#/products">Product Hierarchy</a></li>
  //                                                 <li><a href="Admin#/productCategories">Product Vertical Rules</a></li>
  //                                             </ul>
  //                                         </li>
  
  //                                     </div>
  //                                     <div ng-if="($ctrl.usrRole == 'Legal' || $ctrl.isRealSA || $ctrl.isDeveloper)">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Legal Configurations</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="CostTest#/CostTest/icostproducts">Legal Classification</a>
  //                                                 </li>
  //                                                 <li><a href="Admin#/legalexceptions">Legal Exceptions</a></li>
  //                                                 <li><a href="Admin#/quoteLetter">Quote Letter</a></li>
  //                                             </ul>
  //                                         </li>
  //                                     </div>
  
  //                                     <div ng-if="($ctrl.isRealSA || $ctrl.isCustomerAdmin || $ctrl.isDeveloper)">
  //                                         <li><a href="Admin#/dropdowns">UI Dropdown Values</a></li>
  //                                     </div>
  
  //                                     <div ng-if="($ctrl.isRealSA || $ctrl.isDeveloper)">
  //                                         <li><a href="Admin#/dataquality">Data Quality (DQ)</a></li>
  //                                     </div>
  
  //                                     <div ng-if="($ctrl.isDeveloper)">
  //                                         <li><a href="Admin#/dataFix">Data Fix</a></li>
  //                                     </div>
  
  //                                     <div ng-if="($ctrl.isDeveloper)">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Security Attributes</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/SecurityEngine">Security Engine</a></li>
  //                                                 <li><a href="Admin#/SecurityAttributes/DealTypes">Deal Types</a></li>
  //                                             </ul>
  //                                         </li>
  
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">WorkFlow</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/workflow">WorkFlow</a></li>
  //                                                 <li><a href="Admin#/workflowstage">WorkFlow Stages</a></li>
  //                                             </ul>
  //                                         </li>
  //                                     </div>
  
  //                                     <div ng-if="($ctrl.isDeveloper)">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Admin Tools</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <div ng-if="($ctrl.isDeveloper)">
  //                                                     <li><a href="Admin#/AdminTools">Support Scripts</a></li>
  //                                                     <li><a href="Admin#/testtenders">Test Tenders Data</a></li>
  //                                                     <li><a href="Admin#/dealmassupdate">Deal Mass Update</a></li>
  //                                                     <li><a href="Admin#/pushDealstoVistex">Push Deals to Vistex</a></li>
  //                                                 </div>
  //                                             </ul>
  //                                         </li>
  
  //                                     </div>
  
  //                                     <!-- DA users get to edit their own records only, SA/Customer Admin get all.  Developer gets their present record and might be restricted access. -->
  
  //                                     <div
  //                                         ng-if="($ctrl.usrRole == 'DA' || $ctrl.isRealSA || $ctrl.isDeveloper || $ctrl.isCustomerAdmin)">
  //                                         <li><a href="Admin#/manageEmployee">User Accounts Administration</a></li>
  //                                         <!-- User Customer Assignments -->
  //                                     </div>
  
  
  //                                     <div
  //                                         ng-if="($ctrl.usrRole == 'DA' || $ctrl.usrRole == 'GA' || $ctrl.isRealSA || $ctrl.isDeveloper)">
  //                                         <li class="dropdown-submenu">
  //                                             <a tabindex="-1">Approval Rules Management</a>
  //                                             <ul class="dropdown-menu" style="width: 250px;">
  //                                                 <li><a href="Admin#/rules/">Price Rules</a></li>
  //                                                 <li><a href="Admin#/ruleOwner">Rules Ownership Admin</a></li>
  //                                             </ul>
  //                                         </li>
  //                                     </div>
  //                                     <div ng-if="($ctrl.env == 'LOCAL' && $ctrl.usrWwid == 10548414)">
  
  //                                         <li><a href="Admin#/MyDealsManual?topic=intro">My Deals Manual</a></li>
  //                                     </div>
  
  //                                 </ul>
  //                             </li>
  //                             <li>
  //                                 <a href="/advancedSearch#/tenderDashboard" title="Tender Dashboard"><i
  //                                         class="intelicon-copy-solid"></i><span class="hidden-xs"> Tender
  //                                         Dashboard</span></a>
  //                             </li>
  //                             <li>
  //                                 <a href="/advancedSearch#/attributeSearch" title="Advanced Search Tools"><i
  //                                         class="intelicon-search"></i><span class="hidden-xs"> Advanced Search</span></a>
  //                             </li>
  //                             <li>
  //                                 <a href="https://wiki.ith.intel.com/display/Handbook" target="_blank"><i
  //                                         class="intelicon-help"></i><span class="hidden-xs"> Help</span></a>
  //                             </li>
  
  //                                 <li class="dropdown" ng-if="($ctrl.isReportingUser)">
  //                                     <a class="btn btn-primary" role="button" href="/" data-toggle="dropdown"
  //                                         data-target="#" title="Reporting Dashboard">
  //                                         <i class="intelicon-reports-solid"></i><span class="hidden-xs"> Report </span><i
  //                                             class="intelicon-down"></i>
  //                                     </a>
  //                                     <ul class="dropdown-menu multi-level scaleTopAnim" role="menu"
  //                                         aria-labelledby="dropdownMenu">
  //                                         <li ui-sref-active="active"><a ui-sref="reportingdashboard">Report Dashboard</a>
  //                                         </li>
  //                                     </ul>
  //                                 </li>
  //                         </ul>
  //                     </div>
  //                 </div>
  //                 <div class="col-md-4">
  //                     <!-- partial voew of _search the css of this is already added to header.component.css-->
  //                     <div kendo-window id="winGlobalSearchResults">
  //                         <div>
  //                             <global-search-results></global-search-results>
  //                         </div>
  //                     </div>
  //                     <div class="fr" style="background-color:#f2f2f2; border-radius: 3px;">
  //                      <global-search></global-search>
  //                     </div>
  //                 </div>
  //             </div>
  //             <!-- /.navbar-collapse -->
  //         </div>
  //     </nav>
  // </div>`,
  bindings: {},
  controller: class HeaderComponent {
    private headerSvc: any = null;

    constructor(headerService,private loggerSvc:logger) {
      this.headerSvc = headerService;
    }

    //need to check
    private AppToken: string = "UNKNOWN";
    private GAID: string = "UNKNOWN";
    private env: string = "DEV";

    private usrName: string = "UNKNOWN";
    private usrWwid: number = 0;
    private usrRole: string = "UNKNOWN";
    private usrRoleExtension: string = "";
    private usrRoleId: number = 6;
    private usrEmail: string = "";
    private usrVerticals: string = "";
    private isEditableGrid: boolean = true;
    private appVer: string = "UNKNOWN";
    ////////////////////////////////
    private extraUserPrivs: string = "";
    private superPrefix: string = "";
    private extraUserPrivsDetail: Array<string> = [];
    private isDeveloper: boolean = true;
    private isReportingUser: boolean = true;
    private isTester: boolean = true;
    private isSuper: boolean = true;
    private isCustomerAdmin: boolean = true;
    private isRealSA: boolean = true;

    getUserDetails() {
      console.log('***************************** Header Component first ************************');
      //get the API Call
      let vm = this;
      vm.headerSvc.getAntiForgeryTokenToken().then(function(result){
        console.log('***************************** Header Component second ************************');
       vm.headerSvc
        .getUserDetails()
        .subscrible(res => {
          vm.usrName = res.usrName;
          vm.usrWwid =  res.usrWwid;
          vm.usrRole = res.usrRole;
          vm.usrRoleId = res.usrRoleId;
          vm.usrEmail = res.usrEmail
          
          vm.usrName = res.usrName? res.usrName: "Abhilash Keerampara";
          vm.usrWwid =  res.usrWwid? res.usrWwid:11715175;
          vm.usrRole = res.usrRole? res.usrRole:"GA";
          vm.usrRoleId = res.usrRoleId? res.usrRoleId:6;
          vm.usrEmail = res.usrEmail? res.usrEmail:"abhilash.keerampara@intel.com";
          vm.isEditableGrid = res.isEditableGrid? res.isEditableGrid:true;
          vm.appVer = res.appVer? res.appVer:"1.2.0.24863";
          vm.isCustomerAdmin = res.isCustomerAdmin ? res.isCustomerAdmin:true;
          vm.isRealSA = res.isRealSA ? res.isRealSA:true;
          vm.isTester = res.isTester ? res.isTester:true;
          vm.isDeveloper = res.isDeveloper ? res.isDeveloper:true;
          vm.extraUserPrivs = res.extraUserPrivs ? res.extraUserPrivs:"";

          if (vm.isSuper) {
            vm.superPrefix = "Super";
            vm.extraUserPrivsDetail.push("Super User");
          }
          if (vm.isCustomerAdmin) {
            vm.extraUserPrivsDetail.push("Accounts Administrator");
          }
          if (vm.usrRole == "SA" && !vm.isRealSA) {
            vm.usrRoleExtension = "Account";
          } // Mark neutered SA role because this is a customer admin
          if (vm.isTester) {
            vm.extraUserPrivs += "T";
            vm.extraUserPrivsDetail.push("System Tester");
          }
          if (vm.isDeveloper) {
            vm.extraUserPrivs += "D";
            vm.extraUserPrivsDetail.push("System Developer");
          }
          if (vm.extraUserPrivs == "STD") {
            vm.extraUserPrivs = "STuD";
          } // We practice SAFE CODING on this project
          if (vm.extraUserPrivs != "") {
            vm.extraUserPrivs = "- " + vm.extraUserPrivs;
          }

          let env = "DEV";
          //   ViewBag.AppToken == null ||
          //   ViewBag.AppToken.OpEnvironment == null ||
          //   ViewBag.AppToken.OpEnvironment.EnvLoc == null
          //     ? "UNKNOWN"
          //     : ViewBag.AppToken.OpEnvironment.EnvLoc.Location;
          //TODO: Fetch it from DB
          vm.GAID = env == "CONS" ? "UA-47054404-40" : "UA-47054404-41";
          if (env == "PROD") {
            vm.GAID = "UA-47054404-42";
          }

          //setting window variable

          (<any>window).isEditableGrid = vm.isEditableGrid;
          (<any>window).usrRole = vm.usrRole;
          (<any>window).usrRoleId = vm.usrRoleId;
          (<any>window).usrName = vm.usrName;
          (<any>window).usrWwid = vm.usrWwid;
          (<any>window).usrEmail = vm.usrEmail;
          (<any>window).isSuper = vm.isSuper == true;
          (<any>window).usrVerticals = vm.usrVerticals;
          (<any>window).appVer = vm.appVer;

          (<any>window).isDeveloper = vm.isDeveloper == true;
          (<any>window).isCustomerAdmin = vm.isCustomerAdmin == true;
          (<any>window).isTester = vm.isTester == true;

          (<any>window).env = vm.env;
          (<any>window).dataLayer = (<any>window).dataLayer || [];
          console.log('***************************** Header Component Success ************************');
        },err => {
          this.loggerSvc.error("Unable to get getUserDetails.", err);
        });

      }).catch(error =>{
        this.loggerSvc.error("Unable to get token.", error);
      })
     
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
      var cookies = document.cookie;

      if (cookies !== "") {
        for (var i = 0; i < cookies.split(";").length; ++i) {
          var myCookie = cookies[i];
          var pos = myCookie.indexOf("=");
          var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }

      window.location = newPath;
      return false;
    }
    gtag() {
      (<any>window).push(arguments);
    }
  },
  contollerAs:'HeaderController'
};

angular.module("app").component("appHeader", HeaderController);

import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { dsaService } from "./admin.vistex.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "underscore";
import { warn } from "console";

@Component({
    selector: "vistexTestApi",
    templateUrl: "Client/src/app/admin/vistex/admin.vistex.component.html",
})

export class adminVistexComponent {
    constructor(private loggerSvc: logger, private dsaService: dsaService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    //Declaration Part
    private spinnerMessageHeader = "Test your API";
    private spinnerMessageDescription = "Please wait while we are running your API..";
    private isBusyShowFunFact = true;
    private isLoading = false;
    private selectedApiID = 1;
    private selectedApiCD = "C";
    private apiList = [
        { API_ID: 1, API_NM: "Customer ", API_CD: "C" },
        { API_ID: 2, API_NM: "Deal ", API_CD: "D" },
        { API_ID: 4, API_NM: "Product Vertical", API_CD: "V" },
        { API_ID: 5, API_NM: "Tender Return", API_CD: "R" },
        { API_ID: 6, API_NM: "Deal Failed", API_CD: "E" },
        { API_ID: 7, API_NM: "Prod Vertical Failed", API_CD: "F" },
        { API_ID: 7, API_NM: "Consumption Data", API_CD: "M" }
    ];
    private apiSelectedCD = "";
    private responseData = [];
    private numberOfRecrods = 10;
    private btnText = 'Show more ';

    //API KEY Value Pair
    private apiPair = {
            "C": 'GetVistexDFStageData',
            "D": 'GetVistexDealOutBoundData',
            "P": 'GetVistexDFStageData',
            "V": 'GetVistexDFStageData',
            "R": 'ReturnSalesForceTenderResults',
            "E": 'GetVistexDealOutBoundData',
            "F": 'GetVistexDealOutBoundData',
            "M": 'GetVistexDealOutBoundData'
    };

    vistexApiNameChange(value) {
        this.apiSelectedCD = value;
    }

    //run API
    runApi() {
        console.log(this.selectedApiCD);
        if (this.selectedApiCD == "") {            
            this.loggerSvc.info('Please select an API to run Simulator...',"");
        }
        else {
            this.callAPI(this.selectedApiCD);
        }
    }

    //Call the API
    callAPI(mode) {
        this.isLoading = true;
        var startTime = new Date();
        
        this.dsaService.callAPI(this.apiPair[this.selectedApiCD], mode).subscribe((result: any) => {
            this.isLoading = false;            
            var endTime = new Date();            
            result["START_TIME"] = startTime;
            result["END_TIME"] = endTime;
            this.responseData.unshift(result);            
        }, (error) => {
            this.loggerSvc.error('Unable to run API', error);
        });
    }


    loadVistexTestApi() {
        let vm = this;
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }        
    }

    ngOnInit() {
        this.loadVistexTestApi();
    }
    

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "adminVistex",
        downgradeComponent({ component: adminVistexComponent })
    );
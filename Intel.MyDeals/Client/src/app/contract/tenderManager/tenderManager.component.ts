import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../../shared/logger/logger";
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { templatesService } from "../../shared/services/templates.service";

@Component({
    selector: "tenderManager",
    templateUrl: "Client/src/app/contract/tenderManager/tenderManager.component.html",
    styleUrls: ["Client/src/app/contract/tenderManager/tenderManager.component.css"]
})

export class tenderManagerComponent {
    constructor(private loggerSvc: logger, private pricingTableSvc: pricingTableservice, private templatesSvc: templatesService) { 
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    public c_Id: any = '';
    public ps_Id: any = '';
    public pt_Id: any = '';
    public contractData = null;
    public selectedTab = "PTR";
    public UItemplate = null;
    public isLoading = true;

    loadAllContractDetails() {
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            this.contractData = response[0];
            this.ps_Id = this.contractData.PRC_ST[0].DC_ID;
            this.pt_Id = this.contractData.PRC_ST[0].PRC_TBL[0].DC_ID;
            this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                this.UItemplate = response;
                this.isLoading = false;
            }, (error) => {
                this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
                this.isLoading = false;
            })
        }, (error) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', error);
            this.isLoading = false;
        })

    }

    tenderWidgetPathManager(data, selectedTab) {
        if (selectedTab == 'PD') {
            window.location.href = "/advancedSearch#/tenderDashboard";
        }
        this.selectedTab = selectedTab;
        this.loadAllContractDetails();

    }

    isPTRPartiallyComplete(selectedTab) {
        //need to implement validation logic here for progress bar status
    }

    ngOnInit() {
        const url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
        this.loadAllContractDetails();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "tenderManager",
    downgradeComponent({
        component: tenderManagerComponent,
    })
);
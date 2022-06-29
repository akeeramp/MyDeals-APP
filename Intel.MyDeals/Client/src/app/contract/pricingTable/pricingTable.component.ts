import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { pricingTableservice } from "./pricingTable.service";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { templatesService } from "../../shared/services/templates.service";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { lnavService } from "../lnav/lnav.service";

export interface contractIds {
    Model: string;
    C_ID: number;
    ps_id: number;
    pt_id: number;
}

@Component({
    selector: "pricingTable",
    templateUrl: "Client/src/app/contract/pricingTable/pricingTable.component.html",
    styleUrls: ['Client/src/app/contract/pricingTable/pricingTable.component.css']
})

export class pricingTableComponent {
    constructor(private loggerSvc: logger, private pricingTableSvc: pricingTableservice, private templatesSvc: templatesService,
        private pteService: pricingTableEditorService, private lnavSvc: lnavService) {
         //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
         $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
         $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
     }

    public curPricingStrategy = {};
    public pricingTableData = {};
    public c_Id: number;
    public ps_Id: number;
    public pt_Id: number;
    private isPTETab = true;
    private isDETab = false;
    private selLnav = 'PTE';
    private isPTEEnable = false;
    private isLNavEnable = false;
    public contractData = null;
    public UItemplate = null;
    private isDETabEnabled = false;
    public isLnavHidden: boolean;
    //public isLnavHidden: any = {};

    loadModel(contractModel: contractIds) {
        this.selLnav = contractModel.Model
        if (this.selLnav == 'PTE') {
            if (contractModel.ps_id != 0 && contractModel.pt_id != 0) {
                this.isPTEEnable = true;
                this.ps_Id = contractModel.ps_id;
                this.pt_Id = contractModel.pt_id;
                this.c_Id = contractModel.C_ID;
                this.enableDealEditorTab();
            }
            //defaulting the PTE page to load the images
            else {
                this.isPTEEnable = false;
            }
        }
        else if (this.selLnav == 'MeetComp') {
            console.log('Enable Meetcomp');
        }
        else {
            console.log('Manage');
        }
        //this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.ps_Id)
    }
    onTabSelect(e: SelectEvent) {
        console.log("onTabSelect  ***********", e);
    }
    loadAllContractDetails() {
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            this.contractData = response[0];
            this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                this.UItemplate = response;
                this.isLNavEnable=true;
            },(error) => {
                this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
            })
        },(error) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', error);
        })
     
    }
    ngOnInit() {
        const url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
        this.loadAllContractDetails();
        this.lnavSvc.isLnavHidden.subscribe((isLnavHidden:any) => {
            this.isLnavHidden = isLnavHidden?.isLnavHid;
        });
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

    async enableDealEditorTab() {
        let response = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
            this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
        });

        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0) {
            this.isDETabEnabled = true;
        } else {
            this.isDETabEnabled = false;
        }
    }
}
angular.module("app").directive(
    "pricingTable",
    downgradeComponent({
        component: pricingTableComponent,
    })
);
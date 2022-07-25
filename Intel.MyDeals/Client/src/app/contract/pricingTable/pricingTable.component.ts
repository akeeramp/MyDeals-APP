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
    ps_index: number;
    pt_index: number;
    contractData: any;
   // isVisible: boolean;
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
    type:string
    public ps_Id: number;
    public pt_Id: number;
    public PRC_ST: any;
    public ps_title: any; pt_title: any; pt_type: any; is_hybrid_ps: any;
    passed_validation: any; wf_Stage: string;
    private isPTETab = false;
    private isDETab = false;
    private selLnav = 'PTE';
    private isPTEEnable = false;
    private isLNavEnable = false;
    public contractData = null;
    public UItemplate = null;
    private isDETabEnabled = false;
    public isLnavHidden: boolean;
    public searchedContractData = {
        Model: "",
        C_ID:0,
        ps_id: 0,
        pt_id: 0,
        ps_index: 0,
        pt_index: 0,
        contractData: "",
    }
    //public isLnavHidden: any = {};

    loadModel(contractModel: contractIds, isRedirect:boolean=false) {
        this.selLnav = contractModel.Model
        if (this.selLnav == 'PTE') {
              //highligh the selected lnav PT in case request coming fom search result for PTE.
              this.lnavSvc.lnavHieight.next(contractModel);
            if (!isRedirect) this.isPTETab = true;
            if (contractModel.ps_id != 0 && contractModel.pt_id != 0) {
                this.isPTEEnable = true;
                this.ps_Id = contractModel.ps_id;
                this.pt_Id = contractModel.pt_id;
                this.c_Id = contractModel.C_ID;
                this.ps_title = this.contractData.PRC_ST[contractModel.ps_index].TITLE;
                this.pt_title = this.contractData.PRC_ST[contractModel.ps_index].PRC_TBL[contractModel.pt_index].TITLE;
                this.pt_type = this.contractData.PRC_ST[contractModel.ps_index].PRC_TBL[contractModel.pt_index].OBJ_SET_TYPE_CD;
                this.wf_Stage = this.contractData.PRC_ST[contractModel.ps_index].WF_STG_CD;
                this.passed_validation = this.contractData.PRC_ST[contractModel.ps_index].PASSED_VALIDATION;
                this.is_hybrid_ps = this.contractData.PRC_ST[contractModel.ps_index].IS_HYBRID_PRC_STRAT;
                this.contractData = contractModel.contractData;
                this.enableDealEditorTab(isRedirect);
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
        //window.location.href = "/Dashboard#/contractmanager/CNTRCT/" + this.c_Id + "/0/0/0";
        console.log("onTabSelect  ***********", e);
        if (e.title == "Deal Editor") {
            this.isDETab = true; this.isPTETab = false
        }
        else {
            this.isDETab = false; this.isPTETab = true;
        }
    }

    loadAllContractDetails(IDS=[]) {
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            this.contractData = response[0];
            //if it is Tender deal redirect to Tender manager
            if (response[0].IS_TENDER == 1) window.location.href = "/Dashboard#/tendermanager/" + this.c_Id;
            else {
                this.loadTemplateDetails(IDS, this.contractData );
            }
        },(error) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', error);
        })
     
    }

    loadTemplateDetails(IDS, contractData) {
        this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
            this.UItemplate = response;
            this.isLNavEnable = true;
            if (IDS.length > 1) {
                //this conditions means the page is loaded from search result
                if (this.type == "PS" || this.type == "PT" || this.type == "WIP") {
                    this.searchedContractData.C_ID = this.c_Id;
                    this.searchedContractData.ps_id = Number(IDS[1])
                    this.searchedContractData.pt_id = this.pt_Id = Number(IDS[2])
                    this.searchedContractData.Model = "PTE";
                    this.searchedContractData.contractData = contractData;
                    this.loadModel(this.searchedContractData, true);
                }

            }
        }, (error) => {
            this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
        })
    }

    fetchDetailsfromURL(url) {
        var index = url.indexOf('contractmanager')
        //type of ID(Contract,PS,PT or WIP)
        this.type = url[index + 1];
        var IDS = url.slice(index + 2);
        this.c_Id = Number(IDS[0]);
        this.loadAllContractDetails(IDS);
    }


    ngOnInit() {
        const url = window.location.href.split('/');
        this.fetchDetailsfromURL(url)
        this.lnavSvc.isLnavHidden.subscribe((isLnavHidden: any) => {
            this.isLnavHidden = isLnavHidden?.isLnavHid;
        });
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

    async enableDealEditorTab(isRedirect = false) {
        let response = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
            this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
        });
        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0) {
            this.isDETabEnabled = true;
            //if isRedirect is true which means user navigating to the deal through the global search results then for PS and Deal ID search, DE tab should be shown and for PT ->PTE tab should be shown
            if (isRedirect) {
                if (this.type != "PT") { this.isDETab = true; this.isPTETab = false}
                else { this.isDETab = false; this.isPTETab = true }
            }
        } else { this.isDETabEnabled = false;  }
    }
}
angular.module("app").directive(
    "pricingTable",
    downgradeComponent({
        component: pricingTableComponent,
    })
);
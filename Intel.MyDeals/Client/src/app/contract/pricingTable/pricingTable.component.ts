import * as angular from "angular";
import * as _ from 'underscore';
import { Component, ViewChild } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { pricingTableservice } from "./pricingTable.service";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { templatesService } from "../../shared/services/templates.service";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { lnavService } from "../lnav/lnav.service";
import { dealEditorComponent } from "../dealEditor/dealEditor.component"
import { pricingTableEditorComponent } from '../../contract/pricingTableEditor/pricingTableEditor.component'

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
    @ViewChild(pricingTableEditorComponent) private pteComp: pricingTableEditorComponent;
    @ViewChild(dealEditorComponent) private deComp: dealEditorComponent;
    public curPricingStrategy = {};
    public pricingTableData = {};
    public c_Id: number;
    type:string
    public ps_Id: number;
    public pt_Id: number;
    public PRC_ST: any;
    public ps_title: any; pt_title: any; pt_type: any; is_hybrid_ps: any;
    ps_passed_validation: any; wf_Stage: string; pt_passed_validation: any;
    private isPTETab = false;
    private isDETab = false;
    private selLnav = 'PTE';
    private isPTEEnable = false;
    private isLNavEnable = false;
    public contractData = null;
    public UItemplate = null;
    private isDETabEnabled = false;
    public isLnavHidden: boolean;
    private isLoading: boolean = false;
    private msgType: string = "";
    private spinnerMessageHeader: string = "";
    private spinnerMessageDescription: string = "";
    private isBusyShowFunFact: boolean = true;
    private isShowPCT: boolean = false;
    private isInformationIconReqd: boolean = false;
    private rowlength: any;
    private searchText: any;
    private selectedTab: any;
    public error: boolean = false;

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

    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            if (showFunFact == null) { showFunFact = false; }
            // if no change in state, simple update the text
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    async loadModel(contractModel: contractIds, isRedirect: boolean = false) {
        this.selectedTab = 0;
        if (this.selLnav == 'pctDiv' && contractModel.Model == 'groupExclusionDiv')
            this.isShowPCT = true;
        else if (this.selLnav !== 'pctDiv' && contractModel.Model == 'groupExclusionDiv')
            this.isShowPCT = false;
        this.selLnav = contractModel.Model;
        this.isDETab = false; this.isPTETab = false;
        if (this.selLnav == 'PTE') {
            //highligh the selected lnav PT in case request coming fom search result for PTE.
            this.lnavSvc.lnavHieight.next(contractModel);
            if (contractModel.ps_id != 0 && contractModel.pt_id != 0) {
                this.isPTEEnable = true;
                this.isDETab = false;
                this.ps_Id = contractModel.ps_id;
                this.pt_Id = contractModel.pt_id;
                this.c_Id = contractModel.C_ID;
                this.contractData = contractModel.contractData;
                let PRC_ST = _.filter(this.contractData.PRC_ST, item => { return item.DC_ID == this.ps_Id });
                if (PRC_ST != undefined && PRC_ST != null && PRC_ST.length > 0) {
                    let PRC_TBL = _.filter(PRC_ST[0].PRC_TBL, item => { return item.DC_ID == this.pt_Id });
                    if (PRC_TBL != undefined && PRC_TBL != null && PRC_TBL.length > 0) {
                        this.ps_title = PRC_ST[0].TITLE;
                        this.pt_title = PRC_TBL[0].TITLE;
                        this.pt_type = PRC_TBL[0].OBJ_SET_TYPE_CD;
                        this.wf_Stage = PRC_ST[0].WF_STG_CD;
                        this.ps_passed_validation = PRC_ST[0].PASSED_VALIDATION;
                        this.is_hybrid_ps = PRC_ST[0].IS_HYBRID_PRC_STRAT;
                        this.pt_passed_validation = PRC_TBL[0].PASSED_VALIDATION
                        await this.enableDealEditorTab();
                        //if isRedirect is true which means user navigating to the deal through the global search results then for PS and Deal ID search, DE tab should be shown and for PT ->PTE tab should be shown
                        if (isRedirect) {
                            if (this.type != "PT" && this.isDETabEnabled) {
                                setTimeout(() => {
                                    this.isDETab = true; this.isPTETab = false
                                }, 0)
                            }
                            else {
                                setTimeout(() => {
                                    this.isDETab = false; this.isPTETab = true;
                                }, 0)
                            }
                        }
                        else {
                            if (this.pt_passed_validation == 'Complete' && this.rowlength != 0) {
                                //for the page to redirect
                                setTimeout(() => {
                                    this.isDETab = true; this.isPTETab = false;
                                }, 0);
                            } else {
                                //for the page to redirect
                                setTimeout(() => {
                                    this.isDETab = false; this.isPTETab = true;
                                }, 0);
                            }
                        }
                    }

                }
            }
            //defaulting the PTE page to load the images
            else {
                this.isPTEEnable = false;
            }
        }
        else if (this.selLnav == 'MeetComp') {
            this.isDETab = false; this.isPTETab = false;
            this.selectedTab =2;
        }
        else {
            this.isDETab = false; this.isPTETab = false;
        }
        if (!isRedirect) {
            this.searchText = "";
        }
        //this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.ps_Id)
    }

    refreshContract(data: any) {
        this.contractData = data;
    }

    async onTabSelect(e: SelectEvent) {
        try {
            e.preventDefault();
            if (e.title == "Deal Editor") {
                if (this.pteComp && this.pteComp.dirty) {
                    await this.pteComp.validatePricingTableProducts();
                    let isAnyWarnings = this.pteComp.pricingTableDet.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
                    if (isAnyWarnings || this.pteComp.dirty) {
                        this.isDETab = false; this.isPTETab = true;
                        return;
                    }
                }
                else if (this.pteComp && this.pteComp.pricingTableDet && this.pteComp.pricingTableDet.length > 0) {
                    let isAnyWarnings = this.pteComp.pricingTableDet.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
                    if (isAnyWarnings) {
                        this.isDETab = false; this.isPTETab = true;
                        return;
                    }
                }
                this.isDETab = true; this.isPTETab = false;
            }
            else {
                if (this.deComp && this.deComp.gridResult != undefined && this.deComp.gridResult.length > 0) {
                    let saveReqd = this.deComp.gridResult.filter(x => x._dirty).length > 0;
                    if (saveReqd)
                        await this.deComp.SaveDeal();
                    let isAnyWarnings = this.deComp.gridResult.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
                    if ((isAnyWarnings && saveReqd) || this.deComp.gridResult.filter(x => x._dirty).length > 0) {
                        this.isDETab = true; this.isPTETab = false;
                        return;
                    }
                }
                this.isDETab = false; this.isPTETab = true;
            }
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('PTComponent::Tabselect::',ex);
        }
      
    }

    loadAllContractDetails(IDS=[]) {
        this.isLoading = true;
        this.setBusy("Loading...", "Loading data please wait", "Info", true);
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            if (response && response.length > 0) {
                this.contractData = response[0];
                //if it is Tender deal redirect to Tender manager
                if (response[0].IS_TENDER && response[0].IS_TENDER == 1) {
                    if (this.type && this.type == 'WIP' && IDS && IDS.length > 1 && IDS[3].indexOf("?") > 0)
                        window.location.href = "#/tendermanager/" + this.c_Id + IDS[3].substring(IDS[3].indexOf("?"),IDS[3].length);
                    else
                        window.location.href = "#/tendermanager/" + this.c_Id;
                }
                else {
                    this.loadTemplateDetails(IDS, this.contractData );
                }
            }
            else {
                this.error = true;   
            }
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this.error = true;  
        })
     
    }
    async RedirectFn(eventData: boolean) {
        this.isPTETab = true; this.isDETab = false; this.isDETabEnabled = false;
    }

    loadTemplateDetails(IDS, contractData) {
        this.isLoading = true;
        this.setBusy("Loading...", "Loading data please wait", "Info", true);
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
                    if (this.type == 'WIP' && IDS[3].indexOf("?searchTxt=") > 0)
                        this.searchText = Number(IDS[3].substring(IDS[3].indexOf("?") + ("?searchTxt=").length, IDS[3].length));
                    else {
                        this.searchText = "";
                    }
                    this.loadModel(this.searchedContractData, true);
                }
                this.isLoading = false;
            }
        }, (error) => {
            this.isLoading = true;
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
    async enableDealEditorTab(isRedirect = false) {
        let response = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
            this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
        });
        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0 && response.PRC_TBL_ROW.filter(x => x.warningMessages.length > 0).length == 0) {
            this.isDETabEnabled = true;
            this.rowlength = response.PRC_TBL_ROW.length;
        } else {
            this.isDETabEnabled = false;
            this.rowlength = response.PRC_TBL_ROW.length;
        }
    }

    enableDETab(deTabInfo: any) {
        if (deTabInfo) {
            this.isDETabEnabled = deTabInfo.isEnableDeTab;
            this.isInformationIconReqd = deTabInfo.enableDeTabInfmIcon ? deTabInfo.enableDeTabInfmIcon : false;
        }
    }

    refreshContractData(data: any) {
        if (data != null && data != undefined) {
            if (data.contractData != null && data.contractData != undefined) {
                this.contractData = data.contractData;
            }
            if (data.PS_Passed_validation != undefined && data.PS_Passed_validation != null)
                this.ps_passed_validation = data.PS_Passed_validation;
            if (data.PT_Passed_validation != undefined && data.PT_Passed_validation != null)
                this.pt_passed_validation = data.PT_Passed_validation;
        }
    }

    isDeTabInfmIconUpdate(value: any) {
        this.isInformationIconReqd = value;
    }

    redirect() {
        this.error = false;
        document.location.href = "/Dashboard#/portal";
    }
    ngOnInit() {
        try {
            document.title = "Contract - My Deals";
            const url = window.location.href.split('/');
            this.fetchDetailsfromURL(url)
            this.lnavSvc.isLnavHidden.subscribe((isLnavHidden: any) => {
                this.isLnavHidden = isLnavHidden?.isLnavHid;
            });
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('PYCOmponent::ngOnInit::',ex);
        }
      
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

  
}
angular.module("app").directive(
    "pricingTable",
    downgradeComponent({
        component: pricingTableComponent,
    })
);
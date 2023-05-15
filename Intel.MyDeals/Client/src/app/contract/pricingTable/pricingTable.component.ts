import { each, filter } from 'underscore';
import { Component, ViewChild } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { pricingTableservice } from "./pricingTable.service";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { templatesService } from "../../shared/services/templates.service";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { lnavService } from "../lnav/lnav.service";
import { dealEditorComponent } from "../dealEditor/dealEditor.component"
import { pricingTableEditorComponent } from '../../contract/pricingTableEditor/pricingTableEditor.component'
import { performanceBarsComponent } from '../performanceBars/performanceBar.component';
import { ActivatedRoute, Router } from '@angular/router';

export interface contractIds {
    Model: string;
    C_ID: number;
    ps_id: number;
    pt_id: number;
    ps_index: number;
    pt_index: number;
    contractData: any;
}

@Component({
    selector: "pricing-table",
    templateUrl: "Client/src/app/contract/pricingTable/pricingTable.component.html",
    styleUrls: ['Client/src/app/contract/pricingTable/pricingTable.component.css']
})
export class pricingTableComponent {
    public drawChart: boolean;
    constructor(private loggerSvc: logger, private pricingTableSvc: pricingTableservice, private templatesSvc: templatesService,
        private pteService: pricingTableEditorService, private lnavSvc: lnavService, private route: ActivatedRoute, private router: Router) {}
    @ViewChild(pricingTableEditorComponent) private pteComp: pricingTableEditorComponent;
    @ViewChild(performanceBarsComponent) public perfComp: performanceBarsComponent;
    @ViewChild(dealEditorComponent) private deComp: dealEditorComponent;
    public curPricingStrategy = {};
    public pricingTableData = {};
    public c_Id: number;
    public type: string;
    public perfModel = 'Contract';
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
    public meetCompRefresh: boolean = false;
    public error: boolean = false;
    public enablePerfChart:boolean = (<any>window).isDeveloper || (<any>window).isTester;
    public loadtype="";
    public selectNavMenu:any;

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

    perfCompFn(data) {
        this.drawChart = false;
        if (data.action == 'setInitialDetails') {
            this.perfComp.setInitialDetails(data.title, data.label, data.initial);
        }
        else if (data.action == 'setFinalDetails') {
            this.perfComp.setFinalDetails(data.title, data.label, data.final);
        }
        else if (data.action == 'mark') {
            this.perfComp.mark(data.title);
        }
        else {
            this.perfComp.generatechart(true)
            this.drawChart = true;
        };
    }

    addPerfTimes(perfData) {
        this.perfComp.addPerfTime("Update Contract And CurPricing Table", perfData);
    }

    async loadModel(contractModel: contractIds, isRedirect: boolean = false) {
        this.selectedTab = 0;
        const type=this.route.snapshot.paramMap.get('type');
        const cid=this.route.snapshot.paramMap.get('cid');
        const psid=this.route.snapshot.paramMap.get('PSID');
        const ptid=this.route.snapshot.paramMap.get('PTID');
        const dealid=this.route.snapshot.paramMap.get('DealID');
        if (this.selLnav == 'pctDiv' && contractModel.Model == 'groupExclusionDiv')
            this.isShowPCT = true;
        else if (this.selLnav !== 'pctDiv' && contractModel.Model == 'groupExclusionDiv')
            this.isShowPCT = false;
        this.selLnav = contractModel.Model;
        this.isDETab = false; this.isPTETab = false;
        this.loadtype= this.route.snapshot.queryParams.loadtype;
        if(this.loadtype=='ViewContractDetails'){
            this.selLnav='ViewContractDetails';
        }
        if (this.selLnav == 'PTE' && (this.loadtype !="MeetComp" && this.loadtype !="Manage")) {
            //highligh the selected lnav PT in case request coming fom search result for PTE.
            this.lnavSvc.lnavHieight.next(contractModel);
            if (contractModel.ps_id != 0 && contractModel.pt_id != 0) {
                this.isPTEEnable = true;
                this.isDETab = false;
                this.ps_Id = contractModel.ps_id;
                this.pt_Id = contractModel.pt_id;
                this.c_Id = contractModel.C_ID;
                this.contractData = contractModel.contractData;
                let PRC_ST = filter(this.contractData.PRC_ST, item => { return item.DC_ID == this.ps_Id });
                if (PRC_ST != undefined && PRC_ST != null && PRC_ST.length > 0) {
                    let PRC_TBL = filter(PRC_ST[0].PRC_TBL, item => { return item.DC_ID == this.pt_Id });
                    if (PRC_TBL != undefined && PRC_TBL != null && PRC_TBL.length > 0) {
                        this.curPricingStrategy = PRC_ST[0];
                        this.ps_title = PRC_ST[0].TITLE;
                        this.pt_title = PRC_TBL[0].TITLE;
                        this.pt_type = PRC_TBL[0].OBJ_SET_TYPE_CD;
                        this.wf_Stage = PRC_ST[0].WF_STG_CD;
                        this.ps_passed_validation = PRC_ST[0].PASSED_VALIDATION;
                        this.is_hybrid_ps = PRC_ST[0].IS_HYBRID_PRC_STRAT;
                        this.pt_passed_validation = PRC_TBL[0].PASSED_VALIDATION;
                        if (PRC_TBL[0].warningMessages.length == 0) {
                            this.isDETabEnabled = true;
                        } else this.isDETabEnabled = false;
                        //if isRedirect is true which means user navigating to the deal through the global search results then for PS and Deal ID search, DE tab should be shown and for PT ->PTE tab should be shown
                        if (isRedirect) {
                            if (this.type != "PT" && this.isDETabEnabled) {
                                if (this.pt_passed_validation != 'Complete' && this.loadtype == "PTEditor") {
                                    setTimeout(() => {
                                        this.isDETab = false; this.isPTETab = true;
                                    }, 0);
                                } else {
                                    if(this.loadtype == "PTEditor"){
                                        this.isDETab = false; this.isPTETab = true;
                                    }else{
                                        setTimeout(() => {
                                        this.isDETab = true; this.isPTETab = false
                                    }, 0)
                                    }
                                    
                                }
                            }
                            else {
                                setTimeout(() => {
                                    this.isDETab = false; this.isPTETab = true;
                                }, 0)
                            }
                        }
                        else {
                            if (this.pt_passed_validation == 'Complete') {
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
        else if ((this.selLnav == 'MeetComp' || this.loadtype == 'MeetComp') && this.selLnav != 'ViewContractDetails') {
            this.isDETab = false; this.isPTETab = false;
            this.selLnav='MeetComp';
            this.selectedTab = 1;
            this.meetCompRefresh = !this.meetCompRefresh;
            if(this.selLnav=='MeetComp'){
                //it will update the url on page reload persist the selected state
                const urlTree = this.router.createUrlTree(['/contractmanager', type, cid, psid, ptid, dealid ]);
                this.router.navigateByUrl(urlTree+'?loadtype=MeetComp' );
            }
        }
        else {
            this.selectNavMenu='';
            if(this.selLnav=='ViewContractDetails'){
                //it will update the url on page reload persist the selected state
                const urlTree = this.router.createUrlTree(['/contractmanager', type, cid, psid, ptid, dealid ]);
                this.router.navigateByUrl(urlTree+'?loadtype=ViewContractDetails');
            }
            if(this.loadtype =='Manage'&& (this.selLnav!='pctDiv' && this.selLnav!='ViewContractDetails' && this.selLnav!='groupExclusionDiv')){

                this.selLnav=this.route.snapshot.queryParams.manageType;
                this.selectedTab = 2;
            }
            if(this.loadtype =='Manage'&& this.selLnav=='pctDiv'){
                this.selectedTab = 2;
                this.selectNavMenu='pctDiv'
            }
            if( this.selLnav=='groupExclusionDiv'){
                this.selectedTab = 2;
            }
             
            this.isDETab = false; this.isPTETab = false;
        }
        if (!isRedirect) {
            this.searchText = "";
        }
    }

    loadPTEditor(event) {
        if (event) {
            this.isDETab = false; this.isPTETab = true; this.isDETabEnabled = false;
        }
    }

    refreshContract(data: any) {
        this.contractData = data;
    }

    async onTabSelect(e: SelectEvent) {
        try {
            e.preventDefault();
            const type=this.route.snapshot.paramMap.get('type');
            const cid=this.route.snapshot.paramMap.get('cid');
            const psid=this.route.snapshot.paramMap.get('PSID');
            const ptid=this.route.snapshot.paramMap.get('PTID');
            const dealid=this.route.snapshot.paramMap.get('DealID');
            if (e.title == "Deal Editor") {
                if ((this.pteComp && this.pteComp.dirty) || (this.curPricingStrategy && this.curPricingStrategy['PASSED_VALIDATION'] != "Complete")) {
                    if (this.pteComp) {
                        await this.pteComp.validatePricingTableProducts();
                        if (this.pteComp.pricingTableDet && this.pteComp.pricingTableDet.length > 0) {
                            let isAnyWarnings = this.pteComp.pricingTableDet.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
                            if (isAnyWarnings || this.pteComp.dirty) {
                                this.isDETab = false; this.isPTETab = true;
                                return;
                            }
                        }
                        else {
                            this.isDETab = false; this.isPTETab = true;
                            return;
                        }
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
                  //it will update the url on page reload persist the selected state
                const urlTree = this.router.createUrlTree(['/contractmanager', type, cid, psid, ptid, dealid ]);
                this.router.navigateByUrl(urlTree+'?loadtype=PTEditor');
                this.isDETab = false; this.isPTETab = true;
            }
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('PTComponent::Tabselect::',ex);
        }
      
    }

    async loadAllContractDetails(IDS=[]) {
        this.isLoading = true;
        this.setBusy("Loading...", "Loading data please wait", "Info", true);
        const response: any = await this.pricingTableSvc.readContract(this.c_Id).toPromise().catch((err) => {
            this.isLoading = false;
            this.loggerSvc.error("Error", "not able to load contract details", err);
        });
            if (response && response.length > 0) {
                this.contractData = response[0];
                //if it is Tender deal redirect to Tender manager
                if (response[0].IS_TENDER && response[0].IS_TENDER == 1) {
                    if (this.type && this.type == 'WIP' && IDS && IDS.length > 1 && !!this.route.snapshot.queryParams.searchTxt)
                        window.location.href = "Contract#/tendermanager/" + this.c_Id + "?searchTxt=" + this.route.snapshot.queryParams.searchTxt;
                    else if (this.type && this.type == 'PS' && IDS)
                        window.location.href = "Contract#/tendermanager/" + this.c_Id + "?searchTxt=PS&PsId=" + this.route.snapshot.params.PSID;
                    else if (this.type && this.type == 'PT' && IDS)
                        window.location.href = "Contract#/tendermanager/" + this.c_Id + "?searchTxt=PT&PtId=" + this.route.snapshot.params.PTID;
                    else
                        window.location.href = "Contract#/tendermanager/" + this.c_Id;
                }
                else {
                    this.loadTemplateDetails(IDS, this.contractData );
                }
            }
            else {
                this.error = true;   
            }
            this.isLoading = false;
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
                    if (this.type == 'WIP')
                        this.searchText = this.route.snapshot.queryParams.searchTxt;// Number(IDS[3].substring(IDS[3].indexOf("?") + ("?searchTxt=").length, IDS[3].length));
                    else {
                        this.searchText = "";
                    }
                    this.loadModel(this.searchedContractData, true);
                }
                if (this.searchedContractData.ps_id == 0 && this.searchedContractData.pt_id == 0) {
                    this.searchedContractData.C_ID = this.c_Id;
                    this.searchedContractData.ps_id = Number(IDS[1])
                    this.searchedContractData.pt_id = Number(IDS[2])
                    this.searchedContractData.contractData = contractData;
                    this.searchedContractData.Model = "PTE";
                    this.loadModel(this.searchedContractData, true);

                }
                 this.isLoading = false;
            }
        }, (error) => {
            this.isLoading = true;
            this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
        })
    }

    fetchDetailsfromURL() {
       
        let ids = []; 
        ids.push(this.route.snapshot.paramMap.get('cid'))
        ids.push(this.route.snapshot.paramMap.get('PSID'))
        ids.push(this.route.snapshot.paramMap.get('PTID'))
        ids.push(this.route.snapshot.paramMap.get('DealID'))
        this.c_Id = parseInt(this.route.snapshot.paramMap.get('cid'))
        this.type = this.route.snapshot.paramMap.get('type');
        //type of ID(Contract,PS,PT or WIP) 
        
        this.loadAllContractDetails(ids);
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
            this.fetchDetailsfromURL()
            this.lnavSvc.isLnavHidden.subscribe((isLnavHidden: any) => {
                this.isLnavHidden = isLnavHidden?.isLnavHid;
            });
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('PYCOmponent::ngOnInit::',ex);
        }
    }

    ngAfterViewInit() {
        //this functionality will enable when dashboard landing to this page
        const loaders = document.getElementsByClassName('loading-screen');
        each(loaders, item => {
            item.setAttribute('style', 'display:none');
        })
       // document.getElementsByClassName('loading-screen')[0]?.setAttribute('style', 'display:none');
        const divLoader = document.getElementsByClassName('jumbotron')
        if (divLoader && divLoader.length > 0) {
            each(divLoader, div => {
                div.setAttribute('style', 'display:none');
            })
        }
        //this functionality will disable anything of .net ifloading to stop when dashboard landing to this page
        document.getElementById('mainBody')?.setAttribute('style', 'display:none');
    }

}
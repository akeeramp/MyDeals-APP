import * as angular from "angular";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../../shared/logger/logger";
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { templatesService } from "../../shared/services/templates.service";
import { contractDetailsService } from "../contractDetails/contractDetails.service";
import { dealEditorComponent } from "../dealEditor/dealEditor.component"
import { pricingTableEditorComponent } from '../../contract/pricingTableEditor/pricingTableEditor.component'
import * as _ from "underscore";

@Component({
    selector: "tenderManager",
    templateUrl: "Client/src/app/contract/tenderManager/tenderManager.component.html",
    styleUrls: ["Client/src/app/contract/tenderManager/tenderManager.component.css"]
})

export class tenderManagerComponent {
    @ViewChild(pricingTableEditorComponent) private pteComp: pricingTableEditorComponent;
    @ViewChild(dealEditorComponent) private deComp: dealEditorComponent;
    constructor(private pteService: pricingTableEditorService, private loggerSvc: logger, private pricingTableSvc: pricingTableservice, private contractDetailsSvc: contractDetailsService, private templatesSvc: templatesService) {
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
    public currentTAB = 'PTR';
    public pricingTableData: any;
    public dirty: boolean = false;
    public isPTREmpty: boolean;
    public isPartiallyValid: boolean = true;
    public mcForceRunReq: boolean;
    public inCompleteCapMissing: boolean = false;
    public result: any = null;

    async loadAllContractDetails(): Promise<void> {
        let response = await this.pricingTableSvc.readContract(this.c_Id).toPromise().catch((err) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', err);
        })
        this.contractData = response[0];
        if (this.contractData.TENDER_PUBLISHED == '1') {
            var dealType = this.contractData.PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD;
            var dealID = this.contractData.DC_ID;
            document.location.href = "/advancedSearch#/tenderDashboard?DealType=" + dealType + "&FolioId=" + dealID + "&search";
        }
        if(this.contractData && this.contractData.PRC_ST && this.contractData.PRC_ST.length>0){
            this.ps_Id = this.contractData.PRC_ST[0].DC_ID;
            this.pt_Id = this.contractData.PRC_ST[0].PRC_TBL[0].DC_ID;
            let result = await this.templatesSvc.readTemplates().toPromise().catch((err) => {
                this.loggerSvc.error('loadAllContractDetails::readContract:: service', err);
            });
            this.UItemplate = result;
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            this.isPTREmpty = this.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            this.mcForceRunReq = this.isMCForceRunReq();
        }
        else{
            this.loggerSvc.error("Something went wrong. Please contact Admin","Error");
        }
        this.isLoading = false;
    }

    forDE() {
        if (this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete' && this.isPTRPartiallyComplete() == true) {
            return true;
        } else return false;
    }

    forMC() {
        if ((this.pricingTableData.PRC_ST[0].MEETCOMP_TEST_RESULT != 'InComplete' && this.pricingTableData.PRC_ST[0].MEETCOMP_TEST_RESULT != 'Not Run Yet' && !this.isMCForceRunReq()) || this.inCompleteCapMissing) {
            return true;
        } else return false;
    }

    enableDealEditorTab() {
        var data = this.pricingTableData;
        if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.PRC_TBL_ROW.length === 0) return false;
        return true
    }
    async redirectingFn(tab) {
        if (tab != '') {
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            this.isPTREmpty = this.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            this.selectedTab = tab;
            this.currentTAB = tab;
        } else {
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            this.isPTREmpty = this.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            this.isPTRPartiallyComplete();
        }
    }

    async tenderWidgetPathManager(_actionName, selectedTab) {
        this.mcForceRunReq = this.isMCForceRunReq();
        if (this.currentTAB == 'PTR' && selectedTab != 'PTR') {
            this.isPartiallyValid = this.isPTRPartiallyComplete();
        }

        if (selectedTab == 'PTR') {
            if (this.currentTAB == 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete') {
                await this.redirectingFn(selectedTab);
            }
            else if (this.currentTAB == 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION != 'Complete') {
                await this.deComp.SaveDeal();
                this.selectedTab = selectedTab;
                this.currentTAB = selectedTab;
            } else if (this.currentTAB != 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete') {
                await this.redirectingFn(selectedTab);
            }
        }

        else if (selectedTab == 'DE') {
            if (this.currentTAB == 'PTR') {
                await this.pteComp.validatePricingTableProducts();
            } else {
                if ((this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete' && this.isPartiallyValid == true) && this.enableDealEditorTab() === true) {
                    await this.redirectingFn(selectedTab);
                }
                else {
                    this.loggerSvc.error('Validate all your product(s) to open Deal Editor.', 'error');
                }
            }
        }

        else if (selectedTab == 'MC') {
            if (this.currentTAB == 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete') {
                await this.redirectingFn(selectedTab);
            } else if (this.currentTAB == 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION != 'Complete') {
                await this.deComp.SaveDeal();
            } else if (this.currentTAB != 'DE' && this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete') {
                await this.redirectingFn(selectedTab);
            }
                else {
                    this.loggerSvc.error('Validate all your product(s) to open Meet Comp.', 'error');
                }
            }

        else if (selectedTab == 'PD') {
            if (this.pricingTableData.PRC_ST[0].PASSED_VALIDATION == 'Complete' && (this.pricingTableData.PRC_ST[0].MEETCOMP_TEST_RESULT == 'Pass' || this.pricingTableData.PRC_ST[0].MEETCOMP_TEST_RESULT == 'Fail')&& !this.mcForceRunReq) {
                await this.redirectingFn(selectedTab);
            }
            else {
                this.loggerSvc.error("Meet Comp is not passed. You can not Publish this deal yet.", 'error');
            }
        }
    }

    isMCForceRunReq() {
        let mcForceRun = false;
        if (this.pricingTableData !== undefined && this.pricingTableData.PRC_TBL_ROW !== undefined && this.pricingTableData.PRC_TBL_ROW.length > 0) {
            let dirtyItems = this.pricingTableData.PRC_TBL_ROW.filter(x => x.MEETCOMP_TEST_RESULT === 'Not Run Yet' || x.MEETCOMP_TEST_RESULT === 'InComplete' || x.DC_ID <= 0);
            if (dirtyItems.length > 0) mcForceRun = true;
            return mcForceRun;
        }
    }

    isPTRPartiallyComplete() {
        let isPtrDirty = false;
        let rootScopeDirty = this.dirty;
        if (this.pricingTableData !== undefined && this.pricingTableData.PRC_TBL_ROW !== undefined && this.pricingTableData.PRC_TBL_ROW.length > 0) {
            let dirtyItems = this.pricingTableData.PRC_TBL_ROW.filter(x => x.DC_ID <= 0, x => x.warningMessages.length > 0);
            if (dirtyItems.length > 0) isPtrDirty = true;
        }
        else {
            isPtrDirty = true;
        }
        if (!isPtrDirty && !rootScopeDirty) {
            return true;
        }
        else {
            return false;
        }
    }

    async deleteContract() {
        if (confirm("Are you sure that you want to delete this contract?")) {
            const custId = this.contractData.CUST_MBR_SID;
            const contractId = this.contractData.DC_ID; this.isLoading = true;
            await this.contractDetailsSvc.deleteContract(custId, contractId).toPromise().catch((err) => {
                this.loggerSvc.error('Unable to delete the contract.', 'error');
            });
            this.loggerSvc.success("Successfully deleted Contract.", "Delete successful");
            window.location.href = '/Dashboard#/portal';
        }
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
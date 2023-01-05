import { Component, ViewChild } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { templatesService } from "../../shared/services/templates.service";
import { contractDetailsService } from "../contractDetails/contractDetails.service";
import { dealEditorComponent } from "../dealEditor/dealEditor.component"
import { pricingTableEditorComponent } from '../../contract/pricingTableEditor/pricingTableEditor.component'
import * as _ from "underscore";
import { performanceBarsComponent } from "../performanceBars/performanceBar.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "tender-manager",
    templateUrl: "Client/src/app/contract/tenderManager/tenderManager.component.html",
    styleUrls: ["Client/src/app/contract/tenderManager/tenderManager.component.css"]
})

export class tenderManagerComponent {
    @ViewChild(pricingTableEditorComponent) private pteComp: pricingTableEditorComponent;
    @ViewChild(dealEditorComponent) private deComp: dealEditorComponent;
    @ViewChild(performanceBarsComponent) public perfComp: performanceBarsComponent;
    isDeveloper: any;
    isTester: any;
    drawChart: boolean;
    constructor(private pteService: pricingTableEditorService, private loggerSvc: logger, private pricingTableSvc: pricingTableservice, private contractDetailsSvc: contractDetailsService,
        private templatesSvc: templatesService, private route: ActivatedRoute) {
        $('body').addClass('added-tender');
    }
    public c_Id: any = '';
    public ps_Id: any = '';
    public pt_Id: any = '';
    public contractData = null;
    public selectedTab = "";
    public UItemplate = null;
    public isLoading = true;
    public isSpinnerLoading=false;
    public spinnerMessageHeader="Loading Contract";
    public spinnerMessageDescription="Please wait.. Loading Contract"
    public currentTAB = '';
    public pricingTableData: any;
    public dirty: boolean = false;
    public isPTREmpty: boolean;
    public isPartiallyValid: boolean = false;
    public mcForceRunReq: boolean;
    public inCompleteCapMissing: boolean = false;
    public result: any = null;
    public isDialogVisible = false;
    public dirtyItems;
    public perfModel = 'Tender';
    public gotoPD = "";
    public pt_passed_validation: boolean;
    public compMissingFlag: any;
    private searchText: any = "";

    async loadAllContractDetails(): Promise<void> {
        let response = await this.pricingTableSvc.readContract(this.c_Id).toPromise().catch((err) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', err);
        })
        if(response && Array.isArray(response) && response.length>0){
            this.contractData = response[0];
            if (this.contractData.TENDER_PUBLISHED == '1') {
                var dealType = this.contractData.PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD;
                var dealID = this.contractData.DC_ID;
                document.location.href = "#/tenderDashboard?DealType=" + dealType + "&FolioId=" + dealID + "&search=true";
            }
            if (response[0].IS_TENDER && response[0].IS_TENDER == 0) window.location.href = "#/contractmanager/CNTRCT/" + this.c_Id + '/0/0/0';
            else if(this.contractData && this.contractData.PRC_ST && this.contractData.PRC_ST.length>0){
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
                let passed = this.pricingTableData.PRC_TBL_ROW.filter(x => x.PASSED_VALIDATION == "Complete");
                let compFlag = this.pricingTableData.PRC_TBL_ROW.filter(x => x.COMP_MISSING_FLG == "0");
                this.pt_passed_validation = !(this.isPTREmpty) && (passed.length == this.pricingTableData.PRC_TBL_ROW.length) && !(this.pricingTableData.WIP_DEAL.find(x => x.warningMessages.length > 0) ? true : false) ? true : false;
                this.compMissingFlag = !(this.isPTREmpty) && compFlag.length == this.pricingTableData.PRC_TBL_ROW.length ? true : false;
                if (!!this.route.snapshot.queryParams.searchTxt && this.isPTRPartiallyComplete()) {//if deal searched through global search
                    this.selectedTab = 'DE';
                    this.currentTAB = 'DE';
                }
                else {
                    this.selectedTab = 'PTR';
                    this.currentTAB = 'PTR';
                }
            }
            else{
                this.loggerSvc.error("Something went wrong. Please contact Admin","Error");
            }
        }
        else{
            this.loggerSvc.error("No result found","Error");
        }
         this.isLoading = false;
    }

    refreshContract(data: any) {
        this.contractData = data;
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

    isValidateTTE() {
        if (this.isPTRPartiallyComplete()) {
            if (this.deComp != undefined) {
                if (this.deComp.dirty == false) return true;
                else if (this.pt_passed_validation) {
                    return true;
                }
                else return false;
            } else return true;
        } else if (this.pt_passed_validation) {
            return true;
        }
    }

    isValidateDE() {
        if (this.pt_passed_validation && this.isPTRPartiallyComplete() == true) {
            return true;
        } else return false;
    }

    isValidateMC() {
        if (this.pt_passed_validation && this.compMissingFlag) {
            return true;
        } else return false;
    }

    enableDealEditorTab() {
        var data = this.pricingTableData;
        if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.PRC_TBL_ROW.length === 0) return false;
        return true
    }
    async redirectingFn(tab) {
        if (tab != '' && tab != 'Delete') {
            //Redirects to selected tab
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            this.isPTREmpty = this.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            let passed = this.pricingTableData.PRC_TBL_ROW.filter(x => x.PASSED_VALIDATION == "Complete");
            let compFlag = this.pricingTableData.PRC_TBL_ROW.filter(x => x.COMP_MISSING_FLG == "0");
            this.pt_passed_validation = !(this.isPTREmpty) && (passed.length == this.pricingTableData.PRC_TBL_ROW.length) && !(this.pricingTableData.WIP_DEAL.find(x => x.warningMessages.length > 0) ? true : false) ? true : false;
            this.compMissingFlag = !(this.isPTREmpty) && compFlag.length == this.pricingTableData.PRC_TBL_ROW.length ? true : false;
            this.selectedTab = tab;
            this.currentTAB = tab;
        } else if (tab == 'Delete') {
            //Redirect to DE when TTE has passed validations
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            this.isPTREmpty = this.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            let passed = this.pricingTableData.PRC_TBL_ROW.filter(x => x.PASSED_VALIDATION == "Complete");
            this.pt_passed_validation = !(this.isPTREmpty) && (passed.length == this.pricingTableData.PRC_TBL_ROW.length) && !(this.pricingTableData.WIP_DEAL.find(x => x.warningMessages.length > 0) ? true : false) ? true : false;
            if (this.pt_passed_validation) {
                await this.redirectingFn('DE')
            }
        }
        else {
            //Refresh the data
            this.pricingTableData = await this.pteService.readPricingTable(this.pt_Id).toPromise().catch((err) => {
                this.loggerSvc.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
            });
            //checking passed validation
            let passed = this.pricingTableData.PRC_TBL_ROW.filter(x => x.PASSED_VALIDATION == "Complete");
            //checking COMP_MISSING_FLG
            let compFlag = this.pricingTableData.PRC_TBL_ROW.filter(x => x.COMP_MISSING_FLG == "0");
            //checking passed validations, TTE empty, WIP deals
            this.pt_passed_validation = !(this.isPTREmpty) && (passed.length == this.pricingTableData.PRC_TBL_ROW.length) && !(this.pricingTableData.WIP_DEAL.find(x => x.warningMessages.length > 0) ? true : false) ? true : false;
            //checking TTE empty and COMP_MISSING_FLG value
            this.compMissingFlag = !(this.isPTREmpty) && compFlag.length == this.pricingTableData.PRC_TBL_ROW.length ? true : false;
            //checking for dirty items inside TTE
            this.isPTRPartiallyComplete();
            //if clicked on PD and comp is complete redirect to PD
            if (this.gotoPD == 'PD' && this.compMissingFlag) await this.redirectingFn('PD');
            this.gotoPD = '';
        }
    }

    async tenderWidgetPathManager(_actionName, selectedTab) {
        if (this.currentTAB == 'PTR' && selectedTab != 'PTR') {
            //checking for dirty items inside TTE
            this.isPartiallyValid = this.isPTRPartiallyComplete();
        }

        if (selectedTab == 'PTR') {
            if (this.currentTAB == 'PTR') { }//if selected tab and current tab are same no change
            else if (this.currentTAB == 'DE') {
                if (this.deComp.dirty) {
                    //if we are editing in DE then we will save data and proceed to PTE
                    await this.deComp.SaveDeal();
                    await this.redirectingFn(selectedTab);
                } else {
                    await this.redirectingFn(selectedTab);
                }
            } else if (this.currentTAB == 'MC') {// from MC simple redirection to PTE
                await this.redirectingFn(selectedTab);
            } else if (this.currentTAB == 'PD') {// from PD simple redirection to PTE
                await this.redirectingFn(selectedTab);
            }
        }

        else if (selectedTab == 'DE') {
            if (this.currentTAB == 'PTR') {
                if (this.pteComp.dirty || this.dirtyItems.length > 0) {//if we are editing in TTE then we will save data and proceed to DE
                    await this.pteComp.validatePricingTableProducts();
                } else {
                    if (this.dirtyItems.length == 0 && this.isPTREmpty == false) { // if no changes/warnings are there and if TTE is not empty then redirect to DE
                        await this.redirectingFn(selectedTab);
                    }
                }
            } else if (this.currentTAB == 'DE') {//if selected tab and current tab are same no change
            } else if (this.currentTAB == 'MC') {// from MC simple redirection to DE
                await this.redirectingFn(selectedTab);
            } else if (this.currentTAB == 'PD') {// from PD simple redirection to DE
                await this.redirectingFn(selectedTab);
            } else {
                this.loggerSvc.error('Validate all your product(s) to open Deal Editor.', 'error');
            }
        }

        else if (selectedTab == 'MC') {
            if (this.currentTAB == 'PTR') {
                if (this.pteComp.dirty || this.dirtyItems.length > 0) {//if we are editing in TTE or there is error in TTE then we will save data and proceed to DE
                    await this.pteComp.validatePricingTableProducts();
                    if (this.pt_passed_validation) {
                        setTimeout(() => {//waiting for the api call to complete in redirectingFn()
                            if (this.pt_passed_validation) {
                                this.redirectingFn('PTR');//even after editing if pass validation is complete then after save it will remain in PTE
                            }
                        }, 3000);
                    } 
                } else {
                    if (this.dirtyItems.length == 0 && this.isPTREmpty == false) {
                        if (!this.pt_passed_validation) {
                            await this.redirectingFn('DE');// if selected tab is MC and pass validation not complete then redirect to DE
                        } else {
                            await this.redirectingFn(selectedTab);// if selected tab is MC and pass validation is complete then redirect to MC
                        }
                    }
                }
            } else if (this.currentTAB == 'DE') {
                if (this.deComp.dirty) {
                    await this.deComp.SaveDeal();
                    if (this.pt_passed_validation) {
                        await this.redirectingFn(selectedTab);// if DE is edited and on save if pass validation is complete redirect to MC
                    }
                } else {
                    if (this.pt_passed_validation) {
                        await this.redirectingFn(selectedTab);//if DE has no change and pass validation is complete redirect to MC
                    }
                }
            } else if (this.currentTAB == 'MC') {//no change
            } else if (this.currentTAB == 'PD') {
                await this.redirectingFn(selectedTab);// redirects to MC
            }else{
                this.loggerSvc.error('Validate all your product(s) to open Meet Comp.', 'error');
            }
        }

        else if (selectedTab == 'PD') {
            if (this.currentTAB == 'PTR') {
                if (this.pteComp.dirty || this.dirtyItems.length > 0) {
                    await this.pteComp.validatePricingTableProducts();
                    setTimeout(() => {//waiting for the api call to complete in redirectingFn()
                        if (this.pt_passed_validation) {
                            this.redirectingFn('PTR');//even after editing if pass validation is complete then after save it will remain in PTE
                        }
                    },3000);
                } else {
                    if (this.dirtyItems.length == 0 && this.isPTREmpty == false) {
                        if (!this.pt_passed_validation) {
                            await this.redirectingFn('DE');// if pass validation is not complete redirects to DE
                        } else {
                            if (!this.compMissingFlag) {
                                //clicked on PD when compMissingFlag is true
                                this.gotoPD = 'PD';
                                await this.redirectingFn('MC');// if pass validation is complete & meetcomp data is available & meet comp is not run redirects to MC
                            }else {
                                if (this.compMissingFlag) {
                                    await this.redirectingFn(selectedTab);  // if pass validation is complete & meetcomp data is not available or meet comp run redirects to PD
                                }
                            }
                        }
                    }
                }
            } else if (this.currentTAB == 'DE') {
                if (this.deComp.dirty) {
                    await this.deComp.SaveDeal();
                    if (this.pt_passed_validation) {
                        if (!this.compMissingFlag) {
                            //clicked on PD when compMissingFlag is true
                            this.gotoPD = 'PD';
                            await this.redirectingFn('MC');// if pass validation is complete & meetcomp data is available & meet comp is not run redirects to MC
                        }else {
                            if (this.compMissingFlag) {
                                await this.redirectingFn(selectedTab);// if pass validation is complete & meetcomp data is not available or meet comp run redirects to PD
                            }
                        }
                    }
                    
                }else {
                    if (this.pt_passed_validation) {
                        if (!this.compMissingFlag) {
                            //clicked on PD when compMissingFlag is true
                            this.gotoPD = 'PD';
                            await this.redirectingFn('MC');// if meetcomp is not run then redirect to MC
                        } else {
                            if (this.compMissingFlag){
                                await this.redirectingFn(selectedTab);//if meetcomp is run atleast once redirects to PD
                            }
                        }
                    }
                }
            } else if (this.currentTAB == 'MC') {
                if (this.compMissingFlag) {
                    await this.redirectingFn(selectedTab);//if meetcomp is run atleast once redirects to PD
                }
            } else if (this.currentTAB == 'PD') {}//no change
            else {
                this.loggerSvc.error("Meet Comp is not passed. You can not Publish this deal yet.", 'error');
            }
        }
    }

    getWidth(data) {
        if (data) return '75%';
        else return '100%';
    }

    isPTRPartiallyComplete() {
        let isPtrDirty = false;
        let rootScopeDirty = this.dirty;
        if (this.pricingTableData !== undefined && this.pricingTableData.PRC_TBL_ROW !== undefined && this.pricingTableData.PRC_TBL_ROW.length > 0) {
            this.dirtyItems = this.pricingTableData.PRC_TBL_ROW.filter(x => x.warningMessages.length > 0);
            if (this.dirtyItems.length > 0) isPtrDirty = true;
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
        this.isDialogVisible = true;        
    }

    close() {
        this.isDialogVisible = false;
    }

    async deleteRecord() {
        this.isDialogVisible = false;
        const custId = this.contractData.CUST_MBR_SID;
        const contractId = this.contractData.DC_ID;
        this.isSpinnerLoading = true;
        this.spinnerMessageHeader = "Delete Contract";
        this.spinnerMessageDescription = "Please wait... Deleting Contract";
        await this.contractDetailsSvc.deleteContract(custId, contractId).toPromise().catch((err) => {
            this.loggerSvc.error('Unable to delete the contract.', 'error');
        });
        this.isSpinnerLoading = false;
        this.loggerSvc.success("Successfully deleted Contract.", "Delete successful");
        window.location.href = '/Dashboard#/portal';
    }

    ngOnInit() {
        try {
            document.title = "Contract - My Deals";
            this.isDeveloper = (<any>window).isDeveloper;
            this.isTester = (<any>window).isTester;
            const cid = parseInt(this.route.snapshot.paramMap.get('cid'));
            if (!!this.route.snapshot.queryParams.searchTxt) {//If Global search happens for tender deal ID
                this.c_Id = cid;// Number(url[url.length - 1].substring(0, url[url.length - 1].indexOf('?')));
                this.searchText = this.route.snapshot.queryParams.searchTxt;
            }
            else {
                if (!isNaN(cid) && cid>0)
                this.c_Id = cid;
                this.searchText = "";
            }
            this.loadAllContractDetails();
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('TenderManager::ngOnInit::',ex);
        }
    }

    ngOnDestroy() {
        $('body').removeClass('added-tender')
    }

}
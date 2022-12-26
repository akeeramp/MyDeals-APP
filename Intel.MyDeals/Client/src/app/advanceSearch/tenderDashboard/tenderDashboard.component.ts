import { formatDate } from "@angular/common";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Item } from "@progress/kendo-angular-charts/dist/es2015/common/collection.service";
import * as moment from "moment";
import { logger } from "../../shared/logger/logger";
import { tenderDashboardService } from "./tenderDashboard.service";
import { TenderDashboardConfig } from '../tenderDashboard/tenderDashboard_config'
import { templatesService } from "../../shared/services/templates.service";
import * as _ from 'underscore';
import { GridUtil } from "../../contract/grid.util";
import { TenderDashboardGridUtil } from "../../contract/tenderDashboardGrid.util";
import { PTE_Config_Util } from "../../contract/PTEUtils/PTE_Config_util";
import { PTE_Common_Util } from "../../contract/PTEUtils/PTE_Common_util";
import { dealEditorComponent } from '../../contract/dealEditor/dealEditor.component'
import { TenderFolioComponent } from "../../contract/tenderFolio/tenderFolio.component";
import { MatDialog } from '@angular/material/dialog';
import { contractStatusWidgetService } from "../../dashboard/contractStatusWidget.service";
import { emailModal } from "../../contract/contractManager/emailModal/emailModal.component";
import { constantsService } from "../../admin/constants/admin.constants.service";


@Component({
    selector: 'app-tender-dashboard',
    templateUrl: 'Client/src/app/advanceSearch/tenderDashboard/tenderDashboard.component.html',
    styleUrls: ['Client/src/app/advanceSearch/tenderdashboard/tenderDashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})    

export class TenderDashboardComponent implements OnInit {
    @ViewChild(dealEditorComponent) private deComp: dealEditorComponent;
    private startDateValue: Date = new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(moment().add(6, 'months').format("MM/DD/YYYY"));
    private showSearchFilters: boolean = true;
    public isListExpanded = false;
    private showGrid: boolean = false;
    public fruits: Array<string> = ['Apple', 'Orange', 'Banana'];
    public custData: any;
    public selectedCustNames: Item[];
    public selectedCustomerIds = [];
    public UItemplate = null;
    public c_Id: number = 0;
    public ps_Id: number = 0;
    public pt_Id: number = 0;
    public searchText: string = "";
    public contractData: any;
    public title: string = "Tender Dashboard Search";
    public searchTitle = "Default filter is auto populated from the dashboard but you may overwrite at anytime. This will not change your dashboard filters.";
    public operatorList = TenderDashboardConfig.operatorSettings.operators;
    public attributeList = TenderDashboardConfig.attributeSetting;
    public type2OperatorList = TenderDashboardConfig.operatorSettings.types2operator;
    public cat = 'TenderDealSearch';
    public subcat = 'TenderSearchRules';
    public ruleData = [];
    public wipOptions = {};
    public startDt = window.localStorage.startDate;
    public endDt = window.localStorage.endDate;
    public customers = []; 
    public maxRecordCount: any;
    public templates = [];
    private dealType: string = 'ECAP';
    private searchResults: any = [];
    private isSearchFailed: boolean = false;
    private errorMsg: string = "";
    private isActionWarning: boolean = false;
    private message: string = "";
    private actionType: string = "";
    private changedDataItem: any = [];
    private changedActionValue: any;
    private tenders: any = [];
    private isLoading: boolean = false;
    private spinnerMessageHeader: string = "";
    private spinnerMessageDescription: string = "";
    private msgType: string = "";
    private isBusyShowFunFact: boolean = false;
    private customSettings: any[] = [];
    private runSearch: boolean = false;
    private approveDeals: boolean = false;
    private entireDataDeleted: boolean = false;
    constructor(protected cntrctWdgtSvc: contractStatusWidgetService, protected loggerSvc: logger, protected tenderDashboardSvc: tenderDashboardService, private templatesSvc: templatesService, protected dialog: MatDialog, private constantsService: constantsService) { }
    
    onCustomerChange(custData) {
        window.localStorage.selectedCustNames = JSON.stringify(custData);
        this.customers = custData;
    }

    onSaveRuleClicked() {
        const format = 'MM-dd-yyyy';
        const startDate = this.startDateValue;
        const endDate = this.endDateValue;
        const locale = 'en-US';
        const formattedStartDate = formatDate(startDate, format, locale);
        const formattedEndDate = formatDate(endDate, format, locale);
        const customerName = JSON.parse(JSON.stringify(this.selectedCustNames))[0]['CUST_NM'];
        this.tenderDashboardSvc.getCustomerDetails(formattedStartDate, formattedEndDate, customerName == undefined ? "Apple Computer" : customerName)
            .subscribe((response: Array<any>) => {
                if (response) {
                    alert(response);
                    this.showGrid = true;
                }
                else {
                    this.showGrid = false;
                    this.loggerSvc.error("No result found.", 'Error');
                }
            }, (error)=> {
                this.loggerSvc.error("Unable to get Dropdown Customers.","");
            });
    }

    onDateChange(value, dateChanged) {
        if (dateChanged == "startDateChange") {
            window.localStorage.startDateValue = value;
        }
        else if (dateChanged == "endDateChange") {
            window.localStorage.endDateValue = value;
        }
    }

    toggleFilters() {
        this.showSearchFilters = !this.showSearchFilters;
        if (this.showSearchFilters) {
            this.isListExpanded = false;
        } else {
            this.isListExpanded = true;
        }
    }

    addRow(dataFixBuilder, index) {
        if (index > -1) {
            if (dataFixBuilder == "ActnBuilder") {
                this.fruits.splice(index + 1,0);
            }
        }
    }

    removeRow(dataFixBuilder, index) {
        if (index > -1) {
            if (dataFixBuilder == "ActnBuilder")
                this.fruits.splice(index, 1);
        }
    }
    async invokeSearchData(data) {
        this.setBusy("Saving your data..", "Please wait while saving data.", "Info", true);
        let response: any = await this.tenderDashboardSvc.bulkTenderUpdate(data).toPromise().catch((err) => {
            this.loggerSvc.error("TenderDashboard::TenderDashboardsaveUpdateDEAPI::", err);
        });
        if (response != undefined && response != null && response.Data != undefined && response.Data != null
            && response.Data.WIP_DEAL != undefined && response.Data.WIP_DEAL != null && response.Data.WIP_DEAL.length > 0) {
            this.setBusy("Saving your data...Done", "Processing results now!", "Info", true);
            let savedData = response.Data.WIP_DEAL;
            let isanyWarnings = false;
            if (savedData) {
                _.each(savedData, (item) => {
                    if (item.warningMessages !== undefined && item.warningMessages.length > 0) isanyWarnings = true;
                    if (isanyWarnings) {
                        var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                        var isKit = 0;
                        var relevantAtrbs = PTE_Config_Util.tierAtrbs;
                        var tierCount = item.NUM_OF_TIERS;

                        if (this.dealType === "KIT") {
                            if (item.PRODUCT_FILTER !== undefined) {
                                dimStr = "_20___";
                                isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                                relevantAtrbs = PTE_Config_Util.kitDimAtrbs;
                                tierCount = Object.keys(item.PRODUCT_FILTER).length;
                            }
                        }
                        // map tiered warnings
                        for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                            for (var a = 0; a < relevantAtrbs.length; a++) {
                                PTE_Common_Util.mapTieredWarnings(item, item, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);
                            }
                        }
                    }
                })
            }
            if (isanyWarnings) {
                this.setBusy("Saved with warnings", "Didn't pass Validation", "Warning", true);
            }
            else {
                this.setBusy("Save Successful", "Saved the contract", "Success", true);
            }
            var wip_ids = [];
            for (var i = 0; i < savedData.length; i++) {
                wip_ids.push(savedData[i]["DC_ID"]);
            }
            this.refreshGridRows(wip_ids, savedData);
        }        
    }
    refreshGridRows(wip_ids, wip_data) {
        if (wip_data == null) {
            //if no provided wip data, then we need to go to the middle tier and get it ourselves.
            this.tenderDashboardSvc.getTendersByIds(wip_ids.join()).subscribe( (results)=> {
                    this.refreshGridRowsHelper(wip_ids, results);
                },
                (error) =>{
                    this.setBusy("Error", "Could not refresh tenders.", "Error");
                    this.loggerSvc.error("Could not refresh tenders dashboard.", error);
                    setTimeout(()=> {
                        this.setBusy("", "");
                    }, 2000);
                }
            );
        } else {
            this.refreshGridRowsHelper(wip_ids, wip_data);
        }
    }

    refreshGridRowsHelper(wip_ids, wip_data) {
        for (var dsIndex = 0; dsIndex < this.searchResults.length; dsIndex++) {
            for (var wipIndex = 0; wipIndex < wip_data.length; wipIndex++) {
                if (this.searchResults[dsIndex]["DC_ID"] == wip_data[wipIndex]["DC_ID"]) {
                    //found the updated wip deal in the bound datasource
                    var contractId = this.searchResults[dsIndex]["CNTRCT_OBJ_SID"];
                    var psId = this.searchResults[dsIndex]["PRC_ST_OBJ_SID"];
                    this.searchResults[dsIndex] = wip_data[wipIndex]; //extradetails contains the myDealsData of the wip deal that was updated and would have updated security flags we can utilize
                    this.searchResults[dsIndex]["CNTRCT_OBJ_SID"] = contractId;
                    this.searchResults[dsIndex]["PRC_ST_OBJ_SID"] = psId;
                    this.searchResults[dsIndex]["_behaviors"] = wip_data[wipIndex]["_behaviors"]
                    break;
                }
            }
        }
        this.setBusy("", "");
        this.deComp.refreshGrid();
    }
    refreshGridData(args) {
        this.setBusy("Loading...", "Please wait whil reloading the data", "info", true);
        this.refreshGridRows(args.wipIds, null);
    }
    invokeSearchDatasource(args) {
        this.ruleData = args.rule;

        if (this.ruleData[0].value == "ECAP" || this.ruleData[0].value == "KIT") {
            this.dealType = this.ruleData[0].value;
            this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
            this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;

            var st = this.startDateValue;
            var en = this.endDateValue;
            var searchUrl = (window.localStorage.selectedCustNames === undefined || window.localStorage.selectedCustNames === "" || window.localStorage.selectedCustNames == '[]') ? "null" : JSON.parse(window.localStorage.selectedCustNames).map(x => x.CUST_NM);
            this.setBusy("Searching...", "Search speed depends on how specific your search options are.", "Info", true);

            var take = 100;
            if (this.maxRecordCount !== undefined && this.maxRecordCount.CNST_VAL_TXT !== undefined && this.maxRecordCount.CNST_VAL_TXT !== null) {
                take = Number.parseInt(this.maxRecordCount.CNST_VAL_TXT);
                take = Number.isInteger(take) ? take : 100;
                searchUrl = searchUrl + "?$top=" + (take - 1);
            } else {
                searchUrl = searchUrl + "?$top=" + (take - 1);
            }
            if (this.templates != undefined && this.templates['ModelTemplates'] != undefined && this.templates['ModelTemplates'].WIP_DEAL != undefined) {
                this.searchTenderDeals(st, en, searchUrl, take);
            }
        }
        else {
            this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                if (response)
                    this.templates = response;
                    this.addCustomToTemplates();
                this.searchTenderDeals(st, en, searchUrl, take);
            }, (err) => {
                this.loggerSvc.error("Template Retrieval Failed", "Error", err);
            });
        }
    }
    searchTenderDeals(st, en, searchText, take) {
        this.searchResults = [];//clear out the previuos search results if any
        this.tenderDashboardSvc.searchTender(st, en, searchText).subscribe((response: any) => {
            this.setBusy("", "");
            if ((<any>window).usrRole === 'DA' && (<any>window).usrVerticals.length > 0) {
                let userVerticals = (<any>window).usrVerticals.split(',');
                for (let i = response.Items.length - 1; i >= 0; i--) {
                    var dataVerticals = response.data.Items[i].PRODUCT_CATEGORIES.split(",");
                    if (!TenderDashboardGridUtil.findOne(dataVerticals, userVerticals)) {
                        response.Items.splice(i, 1);
                    }
                }
            }
            this.searchResults = response.Items;
            this.entireDataDeleted = false;
            if (this.searchResults.length == 0) {
                this.errorMsg = (<any>window).usrRole === "DA" ? "No results found. Try changing your search options or check your product category access." : "No results found. Try changing your search options."
                this.setBusy("", "");
                this.isSearchFailed = true;
            }
            if (response['Count'] > take) {
                var info = this.maxRecordCount.CNST_DESC != undefined ? this.maxRecordCount.CNST_DESC : "Your search options returned <b>" + response['Count'] + "</b> deals. Refine your search options"
                info = info.replace("**", response['Count']);
                this.loggerSvc.info(info,"");
            }
            for (var w = 0; w < this.searchResults.length; w++) {
                var item = this.searchResults[w];
                item["MISSING_CAP_COST_INFO"] = GridUtil.getMissingCostCapTitle(item).split('\n')[0];
                item["MISSING_CAP_COST_INFO"] = GridUtil.getMissingCostCapTitle(item).replace(/(?:\r\n|\r|\n)/g, ' ');
                if (item._contractPublished !== undefined && item._contractPublished === 0) {
                    for (var k in item) {
                        if (typeof item[k] !== 'function' && k[0] !== '_') {
                            item._behaviors.isReadOnly[k] = true;
                        }
                    }
                }
                if (this.approveDeals) {
                    if (this.searchResults[w].PS_WF_STG_CD == "Submitted" && this.searchResults[w]["_actionsPS"] !== undefined && this.searchResults[w]["_actionsPS"]['Approve']) {
                        this.searchResults[w]["isLinked"] = true;
                    }
                }
            }
        },
            (error) => {
                this.isSearchFailed = true;
                this.setBusy("", "");
                this.errorMsg = "Tender Search Failed.  Please try again with more specific Search Options.";
                console.log('Tender Search Failed');
            });
    }
    addCustomToTemplates() {
        _.each(this.templates['ModelTemplates']['PRC_TBL'], (value, key) => {
            value._custom = {
                    "ltr": value.name[0],
                    "_active": false
            };
        })
    }
    closeAction() {
        this.isSearchFailed = false;
    }
    bidActionsUpdated(args) {
        this.changedActionValue = args.newValue;
        this.changedDataItem = args.dataItem;
        var gridDS = args.gridDS;
        if (this.changedActionValue == this.changedDataItem.WF_STG_CD) return; //user selected the same item, aka we do nothing here and break out
        this.actionType = "BID";
        this.changeBidAction(gridDS);
    }
    changeBidAction(gridDS) {
        this.tenders = [];
        var linkedUnactionables = [];
        var isDealhasValidationerrors = false;
        if (this.changedDataItem["isLinked"]) {
            for (var d = 0; d < gridDS.length; d++) {
                if (gridDS[d]["isLinked"]) {
                    if (gridDS[d].PASSED_VALIDATION.toLowerCase() == "dirty" && this.changedActionValue === "Won") {
                        isDealhasValidationerrors = true;
                    }
                    if (gridDS[d].WF_STG_CD != this.changedDataItem.WF_STG_CD || gridDS[d].PS_WF_STG_CD != this.changedDataItem.PS_WF_STG_CD) {
                        this.errorMsg = "The selected deals must be in the same Stage in order to do Actions in bulk."
                        this.isSearchFailed = true;
                        return;
                    } else if (gridDS[d]["_actionsPS"][this.changedActionValue] == false) {
                        linkedUnactionables.push(gridDS[d].DC_ID);
                    }
                    else if (gridDS[d].Customer.PRC_GRP_CD == "" && this.changedActionValue == "Approve" && (<any>window).usrRole == "DA") {
                        linkedUnactionables.push(gridDS[d].DC_ID);
                    }
                    else {
                        this.tenders.push({
                            DC_ID: gridDS[d].DC_ID,
                            CNTRCT_OBJ_SID: gridDS[d].CNTRCT_OBJ_SID,
                            CUST_MBR_SID: gridDS[d].CUST_MBR_SID,
                            WF_STG_CD: gridDS[d].WF_STG_CD,
                            PS_WF_STG_CD: gridDS[d].PS_WF_STG_CD,
                            PS_ID: gridDS[d]._parentIdPS,
                            IS_PRIMED_CUST: gridDS[d].IS_PRIMED_CUST,
                            END_CUSTOMER_RETAIL: gridDS[d].END_CUSTOMER_RETAIL,
                            IS_RPL: gridDS[d].IS_RPL,
                            END_CUST_OBJ: gridDS[d].END_CUST_OBJ
                        });
                    }
                }
            }
        } else {
            if (this.changedDataItem.Customer.PRC_GRP_CD == "" && this.changedActionValue === "Approve" && (<any>window).usrRole == "DA") {
                this.isSearchFailed = true;
                this.errorMsg = "Price Group Code required for the customer";
                return;
            }
            this.tenders.push({
                DC_ID: this.changedDataItem.DC_ID,
                CNTRCT_OBJ_SID: this.changedDataItem.CNTRCT_OBJ_SID,
                CUST_MBR_SID: this.changedDataItem.CUST_MBR_SID,
                WF_STG_CD: this.changedDataItem.WF_STG_CD,
                PS_WF_STG_CD: this.changedDataItem.PS_WF_STG_CD,
                PS_ID: this.changedDataItem._parentIdPS
            });
        }

        var plural = this.tenders.length > 1 ? "s" : "";
        var isDealNotUnififed = false;
        var isDealRPLed = false;
        var isRPLStatusReviewwip = false;
        var isNoRplStatusAvailable = false;
        if (this.changedDataItem["isLinked"]) {
            var unUnifiedDeals = this.tenders.filter((x) => (x["IS_PRIMED_CUST"] && x["IS_PRIMED_CUST"] == 0) && (x["END_CUSTOMER_RETAIL"] && x["END_CUSTOMER_RETAIL"] !== ""));
            isDealNotUnififed = unUnifiedDeals.length > 0 ? true : false;
            var rpledDeals = this.tenders.filter((x) => (x["IS_RPL"] && x["IS_RPL"] == 1) && (x["END_CUSTOMER_RETAIL"] && x["END_CUSTOMER_RETAIL"] !== ""));
            isDealRPLed = rpledDeals.length > 0 ? true : false;
            var RPLStatusReviewwip = this.tenders.filter((x) => (x["END_CUST_OBJ"] && x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD != null && x.RPL_STS_CD != "" && x.RPL_STS_CD.match("REVIEWWIP")) && x.IS_RPL == "0" && x.IS_EXCLUDE != "1").length > 0));
            var NoRPLStatus = this.tenders.filter((x) => (x["END_CUST_OBJ"] && x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD == null || x.RPL_STS_CD == "") && x.IS_RPL == "0" && x.IS_EXCLUDE != "1" && x.PRIMED_CUST_NM.toLowerCase() != "any").length > 0));
            isRPLStatusReviewwip = RPLStatusReviewwip.length > 0 ? true : false;
            isNoRplStatusAvailable = NoRPLStatus.length > 0 ? true : false;
        }
        else {
            isDealNotUnififed = this.changedDataItem["IS_PRIMED_CUST"] == 0 && this.changedDataItem["END_CUSTOMER_RETAIL"] !== "";
            isDealRPLed = this.changedDataItem["IS_RPL"] == 1 && this.changedDataItem["END_CUSTOMER_RETAIL"] !== "";
            if (this.changedDataItem["END_CUST_OBJ"] && this.changedDataItem["END_CUST_OBJ"] != "") {
                isRPLStatusReviewwip = JSON.parse(this.changedDataItem["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD != null && x.RPL_STS_CD != "" && x.RPL_STS_CD.match("REVIEWWIP")) && x.IS_RPL == "0" && x.IS_EXCLUDE != "1").length > 0 ? true : false;
                isNoRplStatusAvailable = JSON.parse(this.changedDataItem["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD == null || x.RPL_STS_CD == "") && x.IS_RPL == "0" && x.IS_EXCLUDE != "1" && x.PRIMED_CUST_NM.toLowerCase() != "any").length > 0 ? true : false;
            }
            isDealhasValidationerrors = this.changedDataItem["PASSED_VALIDATION"].toLowerCase() == "dirty" ? true : false;
        }

        if (this.changedActionValue === "Won" && (isDealNotUnififed || isDealRPLed || isRPLStatusReviewwip || isDealhasValidationerrors || isNoRplStatusAvailable)) {
            if (isDealNotUnififed) {
                this.isSearchFailed = true;
                this.errorMsg = "End Customers needs to be Unified before it can be set to " + this.changedActionValue;
            }
            else if (isDealRPLed) {
                this.isSearchFailed = true;
                this.errorMsg = "Intel cannot approve a transaction with the specified End Customer.  The activities conducted within My Deals are subject to U.S. and other applicable export control and sanctions laws.  End Customer needs to be Non-Restricted before it can be set to " + this.changedActionValue;
            }
            else if (isRPLStatusReviewwip) {
                this.isSearchFailed = true;
                this.errorMsg = "End customer Review in Progress. Deal cannot be set to " + this.changedActionValue + " till Review is complete. ";
            }
            else if (isNoRplStatusAvailable) {
                this.isSearchFailed = true;
                this.errorMsg = "End customer has been sent for RPL review. Deal cannot be set to " + this.changedActionValue + " until the review completes.";
            }
            else if (isDealhasValidationerrors) {
                this.isSearchFailed = true;
                this.errorMsg = "Please Fix the Validation Errors before it can be set to " + this.changedActionValue;
            }

            if (this.actionType == "BID") {
                if (this.changedDataItem["tender_actions"]) {
                    this.changedDataItem["tender_actions"]['BidActnName'] = this.changedDataItem["WF_STG_CD"];
                    this.changedDataItem["tender_actions"]['BidActnValue'] = this.changedDataItem["WF_STG_CD"];
                }
                else {
                    this.changedDataItem["tender_actions"] = { BidActnName : this.changedDataItem["WF_STG_CD"], BidActnValue : this.changedDataItem["WF_STG_CD"]}
                }
            }
            return;
        }
        var msg = "";
        if (this.changedActionValue === "Won" && !isDealNotUnififed) msg = "Would you like to mark the Tender Deal" + plural + " as 'Won'?  This will generate a Tracker Number.";
        if (this.changedActionValue === "Lost") msg = "Would you like to mark the Tender Deal" + plural + " as 'Lost'?";
        if (this.changedActionValue === "Offer") msg = "Would you like to re-open the Tender Deal" + plural + " and set to 'Offer'?";

        if (this.changedActionValue === "Approve") msg = "Would you like to approve the Tender Deal" + plural + " and set to 'Approved'?";
        if (this.changedActionValue === "Revise") msg = "Would you like to edit the Tender Deal" + plural + " and set to 'Revise'?";

        if (linkedUnactionables.length > 0) {
            msg += "<br/><br/>The following deals cannot be Actioned:";
            msg += "<br/><b>" + linkedUnactionables.join(", ") + "</b>";
            msg += "<br/>Please check validations and/or Missing Cost/CAP/Price Code."
            msg += "<br/><br/>All other selected deals will proceed with your selected Action."
        }
        this.message = msg;
        this.isActionWarning = true;
    }

    floatActionsUpdated(args) {
        const actionName = args.newValue;
        let actionsChecked = false;
        const isTenderStage = (actionName == "Offer" || actionName == "Won" || actionName == "Lost") ? true : false;
        const data = args.gridDS;
        let isDealhasErrors = true;
        let checkedDeals = data.filter((x) => x["isLinked"] === true);
         
        let validationErrorCheck;
        // RPL check for the selected end customer, Country/Region combination- if User selects RPL'ed end customer restrict that deal to move approved/WON stage        
        let isEcRPLed = undefined;
        let isdealsUnified = undefined;
        let isRPLReviewwip = undefined;
        let isNoRplStatusAvailable = undefined;
        if (checkedDeals.length > 0) {
            isdealsUnified = checkedDeals.filter((x) => x["IS_PRIMED_CUST"] == 0 && x["END_CUSTOMER_RETAIL"] !== "");
            isEcRPLed = checkedDeals.filter((x) => x["IS_RPL"] == 1);
            isRPLReviewwip = checkedDeals.filter(x => x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD != null && x.RPL_STS_CD != "" && x.RPL_STS_CD.match("REVIEWWIP")) && x.IS_RPL == "0" && x.IS_EXCLUDE != "1").length > 0);
            isNoRplStatusAvailable = checkedDeals.filter((x) => x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD == null || x.RPL_STS_CD == "") && x.IS_RPL == "0" && x.IS_EXCLUDE != "1" && x.PRIMED_CUST_NM.toLowerCase() != "any").length > 0);
            validationErrorCheck = checkedDeals.filter((x) => x["PASSED_VALIDATION"].toLowerCase() == "dirty");
            isDealhasErrors = validationErrorCheck.length > 0 ? true : false;

        } else {
            isdealsUnified = data.filter((x) => x["IS_PRIMED_CUST"] == 0 && x["END_CUSTOMER_RETAIL"] !== "");
            isEcRPLed = data.filter((x) => x["IS_RPL"] == 1);
            isRPLReviewwip = data.filter(x => x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD != null && x.RPL_STS_CD != "" && x.RPL_STS_CD.match("REVIEWWIP")) && x.IS_RPL == "0" && x.IS_EXCLUDE != "1").length > 0);
            isNoRplStatusAvailable = data.filter((x) => x["END_CUST_OBJ"] !== "" && JSON.parse(x["END_CUST_OBJ"]).filter(x => (x.RPL_STS_CD == null || x.RPL_STS_CD == "") && x.IS_RPL == "0" && x.IS_EXCLUDE != "1" && x.PRIMED_CUST_NM.toLowerCase() != "any").length > 0);
            validationErrorCheck = data.filter((x) => x["PASSED_VALIDATION"].toLowerCase() == "dirty");
            isDealhasErrors = validationErrorCheck.length > 0 ? true : false;
        }

        if (actionName == "Won" && isdealsUnified != undefined && isdealsUnified.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "End Customers needs to be Unified before it can be set to " + actionName;
            return;
        }
        else if (actionName == "Won" && isEcRPLed.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "Intel cannot approve a transaction with the specified End Customer.  The activities conducted within My Deals are subject to U.S. and other applicable export control and sanctions laws.  End Customer needs to be Non-Restricted before it can be set to " + actionName;
            return;
        }
        else if (actionName == "Won" && isRPLReviewwip.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "End customer Review in Progress. Deal cannot be set to " + actionName + " till Review is complete. ";
            return;
        }
        else if (actionName == "Won" && isNoRplStatusAvailable.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "End customer has been sent for RPL review. Deal cannot be set to " + args["action"] + " until the review completes. ";
            return;
        }
        if (isDealhasErrors && actionName == "Won") {
            this.isSearchFailed = true;
            this.errorMsg = "Please Fix the Validation Errors before it can be set to " + actionName;
            return;
        }

        // if user has selected deals, go ahead and trigger actions. Else select the deals which matches the actions user is doing
        if (checkedDeals.length > 0) {
            actionsChecked = true;
            const checkedDealsValid = checkedDeals.filter(function (x) {
                return ((!isTenderStage && x["_actionsPS"][actionName] == true)
                    || (isTenderStage && ((x["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(actionName)) != -"1")))
            });
            if (checkedDealsValid.length == 0) {
                this.isSearchFailed = true;
                this.errorMsg = "The selected deals cannot be set to " + actionName;
                return;
            }

        } else {
            for (let i = 0; i <= data.length - 1; i++) {
                if (!isTenderStage && data[i]["_actionsPS"] !== undefined && data[i]["_actionsPS"][actionName]) {
                    data[i]["isLinked"] = true;
                    actionsChecked = true;
                } else if (isTenderStage && data[i]["WF_STG_CD"] != actionName
                    && (data[i]["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(actionName)) != -"1") {
                    data[i]["isLinked"] = true;
                    actionsChecked = true;
                }
            }
        }

        if (actionsChecked) {
            checkedDeals = data.filter((x) => x["isLinked"] === true);

            if (checkedDeals.length === 0) {
                this.isSearchFailed = true;
                this.errorMsg = "The selected deals cannot be set to " + actionName;
                return;
            }
            if (!isTenderStage) {
                this.approveActionsupdated({ newValue: actionName, dataItem: checkedDeals[0], gridDS: checkedDeals })
            } else {
                this.bidActionsUpdated({ newValue: actionName, dataItem: checkedDeals[0], gridDS: checkedDeals })
            }

        } else {
            this.isSearchFailed = true;
            this.errorMsg = "The selected action cannot be performed.";
            return;
        }
    }

    approveActionsupdated(args) {
        this.changedActionValue = args.newValue;
        this.changedDataItem = args.dataItem;
        if (this.changedActionValue == "Action") return;   //user selected the default non-item action so we break out here.
        this.actionType = "PS";
        this.changeBidAction(args.gridDS)
    }

    updateTenderActions() {
        this.isActionWarning = false;
        if (this.changedDataItem.PS_WF_STG_CD == 'Submitted' && this.changedActionValue == 'Approve') {
            var selectedItem = this.tenders.map(function (x) {
                return x.PS_ID; // PS Id to run PCT
            });
            if (selectedItem.length > 0) {
                this.deComp.isRunning = true;
                this.setBusy("Running", "Price Cost Test and Meet Comp Test.", "Info", true);
                this.tenderDashboardSvc.runBulkPctPricingStrategy(selectedItem).subscribe((data) => {
                    this.deComp.isRunning = false;
                    this.actionTenderDeals(this.tenders);
                });
            }
        } else {
            this.actionTenderDeals(this.tenders);
        }                
    }
    cancelTenderAction() {
        this.isActionWarning = false;
        //User hit cancel, reset Actions to default values
        if (this.actionType == "PS") {
            if (this.changedDataItem["tender_actions"]) {
                this.changedDataItem["tender_actions"]['text'] = "Action";
                this.changedDataItem["tender_actions"]['value'] = "Action";
            }
            else {
                this.changedDataItem["tender_actions"] = { text: "Action", value: "Action"}
            }
        }
        if (this.actionType == "BID") {
            if (this.changedDataItem["tender_actions"]) {
                this.changedDataItem["tender_actions"]['BidActnName'] = this.changedDataItem["WF_STG_CD"];
                this.changedDataItem["tender_actions"]['BidActnValue'] = this.changedDataItem["WF_STG_CD"];
            }
            else {
                this.changedDataItem["tender_actions"] = { BidActnName: this.changedDataItem["WF_STG_CD"], BidActnValue: this.changedDataItem["WF_STG_CD"] }
            }
        }
    }
    actionTenderDeals(tenders) {
        this.setBusy("Updating Tender Deals...", "Please wait as we update the Tender Deals!");
        this.tenderDashboardSvc.actionTenderDeals(tenders, this.changedActionValue).subscribe((results) =>{
            var msgArray = results["Data"].Messages;
            var errorMessages = [];
            for (var dsIndex = 0; dsIndex < this.searchResults.length; dsIndex++) {
                if (this.actionType == "BID") {
                    for (var i = 0; i < tenders.length; i++) {
                        if (tenders[i].DC_ID === this.searchResults[dsIndex].DC_ID) {
                            for (var m = 0; m < msgArray.length; m++) {
                                if (msgArray[m].MsgType == 1) {
                                    if (msgArray[m].ExtraDetails.length === undefined) { // not and array... dictionary.  This means a WON bid
                                        if (msgArray[m].Message === "Action List") {
                                            var details = msgArray[m].ExtraDetails;
                                            this.searchResults[dsIndex]["WF_STG_CD"] = "Won";
                                            this.searchResults[dsIndex]["bid_actions"] = [];
                                            this.searchResults[dsIndex]["BID_ACTNS"] = [];
                                            if (details[this.searchResults[dsIndex].DC_ID] !== undefined) this.searchResults[dsIndex]["TRKR_NBR"] = details[this.searchResults[dsIndex].DC_ID];
                                        }
                                    } else {
                                        this.searchResults[dsIndex]["bid_actions"] = msgArray[m].ExtraDetails;  //for bid_action updates, these will contain the new possible bid actions - 3 possible means offer, 2 possible means lost, 1 possible means won
                                        this.searchResults[dsIndex]["BID_ACTNS"] = [];
                                        for (var actionLength = 0; actionLength < msgArray[m].ExtraDetails.length; actionLength++) {
                                            this.searchResults[dsIndex]["BID_ACTNS"].push({
                                                "BidActnName": msgArray[m].ExtraDetails[actionLength],
                                                "BidActnValue": msgArray[m].ExtraDetails[actionLength],
                                            })
                                        }

                                        if (this.searchResults[dsIndex]["bid_actions"].length == 3) this.searchResults[dsIndex]["WF_STG_CD"] = "Offer";
                                        if (this.searchResults[dsIndex]["bid_actions"].length == 2) this.searchResults[dsIndex]["WF_STG_CD"] = "Lost";
                                        if (this.searchResults[dsIndex]["bid_actions"].length == 1) this.searchResults[dsIndex]["WF_STG_CD"] = "Won";
                                    }
                                } 
                            }
                        }
                    }
                }
                else if (this.actionType == "PS") {
                    for (var i = 0; i < msgArray.length; i++) {
                        var keyIdentifiers = msgArray[i].KeyIdentifiers;
                        var psId = this.searchResults[dsIndex]["_parentIdPS"];
                        if (keyIdentifiers.indexOf(psId) >0) {                            
                            if (msgArray[i].MsgType == 1) {
                                var contractId = this.searchResults[dsIndex]["CNTRCT_OBJ_SID"];
                                this.searchResults[dsIndex] = msgArray[i].ExtraDetails; 
                                this.searchResults[dsIndex]["CNTRCT_OBJ_SID"] = contractId;
                            } else {
                                errorMessages.push(msgArray[i]);
                            }
                        }
                    }
                }
            }
            if (errorMessages.length > 0) {
                this.loggerSvc.error("The stage or PCT/MCT was changed by another source prior to this action.Please refresh and try again.","");
            }
            for (var d = 0; d < this.searchResults.length; d++) {
                if (this.searchResults[d].isLinked) {
                    this.searchResults[d].isLinked = false;
            }
        }

        var wip_ids = [];
        for (var i = 0; i < tenders.length; i++) {
            wip_ids.push(tenders[i].DC_ID);
        }

        this.setBusy("Loading...", "Please wait while refreshing data...","info",true);
        this.refreshGridRows(wip_ids, null);

        this.actionType = "";
        this.changedDataItem = [];
        this.changedActionValue = [];
        });
    }
    tenderCopyDeals(gridData) {
        var dealIds = [];
        var iqrDeals = [];
        for (var i = 0; i <= gridData.length - 1; i++) {
            if (gridData[i].isLinked && gridData[i].SALESFORCE_ID == "") {
                dealIds.push(gridData[i].DC_ID);
            }
            else if (gridData[i].isLinked && gridData[i].SALESFORCE_ID != "") {
                iqrDeals.push(gridData[i].DC_ID);
            }
        }
        if (dealIds.length == 0 && iqrDeals.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "The selected deals are created by IQR and it cannot be copied.";
            return;
        }
        else if (dealIds.length == 0 && iqrDeals.length == 0) {
            this.isSearchFailed = true;
            this.errorMsg = "Please select a deal to copy by checking the checkbox next to each deal to be copied.";
            return;
        }
        else if (dealIds.length > 0 && iqrDeals.length > 0) {
            this.isSearchFailed = true;
            this.errorMsg = "Following selected deals will not be copied. Since these deals are created by IQR.\n\n" + iqrDeals.join(", ")
        }
        else {
            const dialogRef = this.dialog.open(TenderFolioComponent, {
                panelClass: 'tender-folio-dialog',
                width: '600px',
                height: '400px',
                disableClose: true,
                data: {
                    name: "Tender Folio Details",
                    copyItems: dealIds,
                    maxRecordCountConstant: this.maxRecordCount,
                    contractData: this.contractData
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    window.location.href = "#tendermanager/" + result;
                }
            });
        }
    }
    getCustomerData() {
        this.cntrctWdgtSvc.getCustomerDropdowns()
            .subscribe((response: Array<any>) => {
                if (response && response.length > 0) {
                    this.custData = response;
                }
                else {
                    this.loggerSvc.error("No result found.", 'Error');
                }
            }, (error) =>{
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }
    getMaxRecordCount(varName: string) {
        this.constantsService.getConstantsByName(varName).subscribe((response) => {
            if (response) {
                this.maxRecordCount = response;
            }
        }, (error) => {
            this.loggerSvc.error("TenderDashboard::unable to get Max Value", error);
        })
    }
    runPCTMCT(data) {
        if (data.length > 0) {
            var selectedItem = [];
            var selectedDeals = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isLinked == true) {
                    selectedItem.push(data[i].PRC_ST_OBJ_SID);
                    selectedDeals.push(data[i].DC_ID);
                }
            }
            if (selectedItem.length > 0) {
                this.setBusy("Running", "Price Cost Test and Meet Comp Test.", "Info", true);
                this.tenderDashboardSvc.runBulkPctPricingStrategy(selectedItem).subscribe((result)=> {
                    this.setBusy("Complete", "Reloading the page now.", "Success");
                    this.deComp.isRunning = false;
                    this.refreshGridRows(selectedDeals, null);
                    this.loggerSvc.success("Please wait for the result to be updated...");
                }, (error) => {
                    this.deComp.isRunning = false;
                    this.loggerSvc.error("Unable to update PCT/MCT results","");
                });
            }
        }    }

    openEmail(items){
        let rootUrl = window.location.protocol + "//" + window.location.host;
        var custNames = [];
        var endCustomers = [];
        // Check unique stages as per role
        var stageToCheck = "";
        if ((<any>window).usrRole == "DA") {
            stageToCheck = "Approved"
        } else if ((<any>window).usrRole == "GA") {
            stageToCheck = "Submitted"
        }

        // set this flag to false when stages are not unique as per role
        let stagesOK = true;

        for (var x = 0; x < items.length; x++) {
            if (custNames.indexOf(items[x].Customer.CUST_NM) < 0)
                custNames.push(items[x].Customer.CUST_NM);
            if (endCustomers.indexOf(items[x].END_CUSTOMER_RETAIL) < 0)
                endCustomers.push(items[x].END_CUSTOMER_RETAIL);
            items[x].url = rootUrl + "/Dashboard#/tenderDashboard?DealType=" + this.dealType + "&Deal=" + items[x].DC_ID + "&search=true&approvedeals=true"
            items[x].folioUrl = rootUrl + "/Dashboard#/tenderDashboard?DealType=" + this.dealType + "&FolioId=" + items[x].CNTRCT_OBJ_SID + "&search=true&approvedeals=true"

            if (stageToCheck != "" && stageToCheck != items[x].PS_WF_STG_CD) {
                stagesOK = false;
            }
        }

        if (items.length === 0) {           
            this.isSearchFailed = true;
            this.errorMsg = "No items were selected to email."
            return;
        }

        let subject = "";
        let eBodyHeader = "";

        if (stagesOK && (<any>window).usrRole === "DA") {
            subject = "My Deals Deals Approved for ";
            eBodyHeader = "My Deals Deals Approved!";
        } else if (stagesOK && (<any>window).usrRole === "GA") {
            subject = "My Deals Approval Required for "
            eBodyHeader = "My Deals Approval Required!";
        } else {
            subject = "My Deals Action Required for ";
            eBodyHeader = "My Deals Action Required!";
        }

        subject = subject + custNames.join(', ');

        let data = {
            from: (<any>window).usrEmail,
            items: items,
            eBodyHeader: eBodyHeader
        }

        var itemListRowString=``;
        for(let i=0; i<items.length; i++){
                itemListRowString =itemListRowString+ `<tr>
                <td style='width:100px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><p style='color:#00a;'><a href='${items[i].folioUrl}'>`+ items[i].CNTRCT_OBJ_SID+ ' ' + items[i].CNTRCT_TITLE +`*</a></p></td>
                <td style='width:100px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><p style='color:#00a;'><a href='${items[i].url}'>` + items[i].DC_ID + `*</a></p> </td>
                <td style='width:160px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><span>`+ items[i].END_CUSTOMER_RETAIL + `</span> </td>
                <td style='width:100px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><span style='color:#1f4e79;'>` + items[i].PRODUCT_CATEGORIES + `</span> </td>
                <td style='width:200px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><span style='color:#767171;'>` + items[i].PS_WF_STG_CD + `</span> </td>
                <td style='width:200px; font-size: 12px; font-family: sans-serif; vertical-align:inherit;'><p style='color:#00a'><a href='${items[i].url}'>View Deal*</a></p> </td>
            </tr>`
        }
        let valuemsg = `
        <div style='font-family:sans-serif;'>
        <p><span style='font-size:20px; color:#00AEEF; font-weight: 600'>` +  data.eBodyHeader + `</span></p>
        <p><span style='font-size:18px;'>Tender Deals</span></p>
        <p><span style='font-size: 12px;'>The following list of Tender Deals have changed.  Click <strong><span style='color:#00AEEF;font-size: 12px;'>View Tender Deal</span></strong> <span style='font-size:12px'>in order to view details in My Deals.</span></p>
        <table>
            <thead>
                <tr>
                    <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Tender Folio</strong></th>
                    <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Deal #</strong></th>
                    <th style='text-align: left; width:160px; font-size: 12px; font-family: sans-serif;'><strong>End Customer</strong></th>
                    <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Verticals</strong></th>
                    <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Stage</strong></th>
                    <th style='text-align: left; width:150px; font-size: 12px; font-family: sans-serif;'><strong>Action</strong></th>
                </tr>
            </thead>
            <tbody>`+itemListRowString+`
            </tbody>
        </table>
        <p><span style='font-size: 11px; color: black; font-weight: bold;'>*Links are optimized for Google Chrome</span></p>
        <p><span style='font-size: 14px;'><b>Please respond to: </b> <a href='mailto:${data.from}' style="color: #00a; font-size:14px;">` + data.from +`</a>.</span></p>
 
        <p><span style='font-size: 14px; color: red;'><i>**This email was sent from a notification-only address that cannot accept incoming email.  Please do not reply to this message.</i></span></p>
        </div>
    `;
        var dataItem = {
            from: "mydeals.notification@intel.com",
            to: "",
            subject: subject,
            body: valuemsg
        };

        if (endCustomers.length > 0) {
            dataItem.subject = dataItem.subject + " (End Customer: " + endCustomers.join(', ') + ")";
        }

        const dialogRef = this.dialog.open(emailModal, {
            width: "900px",
            panelClass: 'emailmat-dialog-box',
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
        });
    }


    setBusy(msg, detail, msgType ="", showFunFact =false) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
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
    removeLoadingPanel(event) {
        this.setBusy("","")
    }
    removeDeletedRow(event) {
        _.each(this.searchResults, (item,index) => {
            if (item._parentIdPS == event) 
                this.searchResults.splice(index, 1);
        })
        if (this.searchResults.length == 0)
            this.entireDataDeleted = true;
        this.deComp.refreshGrid();
    }
    clearSearchResult(event) {
        this.searchResults = [];
    }
    ngOnInit(): void {
        this.setBusy("Loading...", "Please wait while we are loading...", "info", true);
        this.showSearchFilters = true;
        this.isListExpanded = false;
        this.selectedCustNames = window.localStorage.selectedCustNames ? JSON.parse(window.localStorage.selectedCustNames) : [];
        this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
        this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;
        this.getCustomerData();
        this.getMaxRecordCount('TENDER_SEARCH_MAX_VALUE')
        if (this.templates.length == 0) {
            this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                if (response)
                    this.templates = response;
            }, (err) => {
                this.loggerSvc.error("Template Retrieval Failed", "Error", err);
            });
        }
        this.contractData = TenderDashboardConfig.tenderDashboardBasicContractData;
        let qm = window.location.hash.substring(window.location.hash.indexOf('?') + 1, window.location.hash.length).split('&');
        _.each(qm, (item) => {
            if (item.toLowerCase().indexOf('dealtype') >= 0) {
                this.customSettings.push({
                    field: "OBJ_SET_TYPE_CD",
                    operator: "=",
                    value: item.substring(9, item.length).toUpperCase(),
                    source: null
                });
            }
            if (item.toLowerCase().indexOf('folioid') >= 0) {
                this.customSettings.push({
                    field: "CNTRCT_OBJ_SID",
                    operator: "=",
                    value: item.substring(8, item.length),
                    source: null
                });
            }
            if (item.toLowerCase().indexOf('psid') >= 0) {
                this.customSettings.push({
                    field: "PRC_ST_OBJ_SID",
                    operator: "=",
                    value: parseInt(item.substring(5, item.length)),
                    source: null
                });
            }
            if (item.toLowerCase().indexOf('ptid') >= 0) {
                this.customSettings.push({
                    field: "PRC_ST_OBJ_SID",
                    operator: "=",
                    value: parseInt(item.substring(5, item.length)),
                    source: null
                });
            }
            if (item.toLowerCase().indexOf('deal=') >= 0) {
                this.customSettings.push({
                    field: "DC_ID",
                    operator: "=",
                    value: parseInt(item.substring(5, item.length)),
                    source: null
                });
            }
            if (item.toLowerCase().indexOf('search') >= 0) {
                this.runSearch = true
            }
            if (item.toLowerCase().indexOf('approvedeals')) {
                this.approveDeals = true
            }
        })
        if (this.customSettings.length == 0)
            this.customSettings = TenderDashboardConfig.tenderDashboardCustomSettings;
        if ((<any>window).usrRole === "DA") {
            this.customSettings.splice(1, 0, {
                field: "WF_STG_CD",
                operator: "=",
                value: ["Submitted", "Approved", "Won", "Offer", "Lost"],
                source: null
            })
        }
    }
}
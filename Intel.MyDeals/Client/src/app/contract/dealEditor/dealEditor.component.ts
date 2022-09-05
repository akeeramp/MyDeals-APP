import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import * as _ from 'underscore';
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { opGridTemplate } from "../../core/angular.constants"
import { SelectEvent } from "@progress/kendo-angular-layout";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent, CellCloseEvent, GridComponent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { DatePipe } from '@angular/common';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { PTE_Load_Util } from '../PTEUtils/PTE_Load_util';
import { PTE_Validation_Util } from '../PTEUtils/PTE_Validation_util';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
import { Tender_Util } from '../PTEUtils/Tender_util';
import { forkJoin } from 'rxjs';
import { systemPricePointModalComponent } from "../ptModals/dealEditorModals/systemPricePointModal.component"
import { endCustomerRetailModalComponent } from "../ptModals/dealEditorModals/endCustomerRetailModal.component"
import { multiSelectModalComponent } from "../ptModals/multiSelectModal/multiSelectModal.component"
import { contractDetailsService } from "../contractDetails/contractDetails.service"
import { OverlappingCheckComponent } from '../ptModals/overlappingCheckDeals/overlappingCheckDeals.component';
import { dealProductsModalComponent } from "../ptModals/dealProductsModal/dealProductsModal.component"
import { GridUtil } from '../grid.util';

@Component({
    selector: 'deal-editor',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditor.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorComponent {

    constructor(private pteService: pricingTableEditorService,
        private contractDetailsSvc: contractDetailsService,
        private loggerService: logger, private datePipe: DatePipe,
        protected dialog: MatDialog) {
    }

    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    @ViewChild(GridComponent) private grid: GridComponent;
    private isWarning: boolean = false;
    private message: string = "";
    private dirty = false;
    private isDatesOverlap = false;
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private wipTemplate: any = {};
    public groups: any;
    public columns: any = [];
    public templates: any;
    public selectedTab: any;
    public voltLength;
    private numSoftWarn = 0;
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
    private gridResult = [];
    private gridData: GridDataResult;
    public isLoading = false;
    private isTenderContract = false;
    private dropdownResponses: any = null;
    private EndCustDropdownResponses: any = null;
    private enableSelectAll: boolean = false;
    private enableDeselectAll: boolean = false;
    private isDataLoading: boolean = false;
    private spinnerMessageDescription: any = "";
    private spinnerMessageHeader: any = "";
    private lookBackPeriod: any = [];
    private msgType: string = "";
    private invalidDate: boolean = false;
    private VendorDropDownResult: any = {};
    private searchFilter: any;
    private wrapEnabled: boolean = false;
    private isExportable: boolean = true;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        },
        {
            text: "250",
            value: 100
        },
        {
            text: "500",
            value: 100
        }
    ];

    getGroupsAndTemplates() {
        //Get Groups for corresponding deal type
        this.groups = PTE_Load_Util.getRulesForDE(this.curPricingTable.OBJ_SET_TYPE_CD);
        // Get template for the selected WIP_DEAL
        this.wipTemplate = this.UItemplate["ModelTemplates"]["WIP_DEAL"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];

        PTE_Load_Util.wipTemplateColumnSettings(this.wipTemplate, this.isTenderContract, this.curPricingTable.OBJ_SET_TYPE_CD);
        this.templates = opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        this.getWipDealData();
    }

    getWipDealData() {        
        this.pteService.readPricingTable(this.in_Pt_Id).subscribe((response: any) => {
            if (response && response.WIP_DEAL && response.WIP_DEAL.length > 0) {
                this.voltLength = response.WIP_DEAL.length;
                this.gridResult = response.WIP_DEAL;
                this.setWarningDetails();
                this.applyHideIfAllRules();
                this.lookBackPeriod = PTE_Load_Util.getLookBackPeriod(this.gridResult);
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
                this.isDataLoading = false;
            } else {
                this.gridResult = [];
            }
        }, error => {
            this.loggerService.error('dealEditorComponent::readPricingTable::readTemplates:: service', error);
        });
    }

    onTabSelect(e: SelectEvent) {
        e.preventDefault();
        this.selectedTab = e.title;
        var group = this.groups.filter(x => x.name == this.selectedTab);
        if (group[0].isTabHidden) {
            var tabs = this.groups.filter(x => x.isTabHidden === false);
            this.selectedTab = tabs[0].name;
            this.filterColumnbyGroup(this.selectedTab);
        }
        else
            this.filterColumnbyGroup(this.selectedTab);
    }

    onClose(name: string) {
        for (var i = 0; i < this.groups.length; i++) {
            if (name == this.groups[i].name) {
                this.groups[i].isTabHidden = true;
            }
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    filterColumnbyGroup(groupName: string) {
        var group = this.groups.filter(x => x.name == groupName);
        this.columns = [];
        if (group.length > 0) {
            for (var i = 0; i < this.wipTemplate.columns.length; i++) {
                var gptemplate = this.templates[this.wipTemplate.columns[i].field];
                if (groupName.toLowerCase() == "all") {
                    if (gptemplate === undefined && (this.wipTemplate.columns[i].width === undefined || this.wipTemplate.columns[i].width == '0')) {
                        this.wipTemplate.columns[i].width = 1;
                    }
                    this.columns.push(this.wipTemplate.columns[i]);
                }
                else {
                    if (gptemplate != undefined && gptemplate.Groups.includes(groupName)) {
                        this.columns.push(this.wipTemplate.columns[i]);
                    }
                }
            }
        }
    }

    cellClickHandler(args: CellClickEvent): void {
        this.invalidDate = false;
        if (args.dataItem != undefined) {
            PTE_Common_Util.parseCellValues(args.column.field, args.dataItem);
        }
        if (!args.isEdited && args.column.field !== "details" && args.column.field !== "tools" && args.column.field !== "PRD_BCKT" && args.column.field !== "CUST_MBR_SID" && args.column.field !== "CAP_INFO" && args.column.field !== "YCS2_INFO" && args.column.field !== "COMPETITIVE_PRICE" && args.column.field !== "COMP_SKU" &&
            args.column.field !== "BACKEND_REBATE" && args.column.field !== "CAP_KIT" && args.column.field !== "PRIMARY_OR_SECONDARY" && args.column.field !== "KIT_REBATE_BUNDLE_DISCOUNT" &&
            args.column.field !== "TOTAL_DSCNT_PR_LN" && args.column.field !== "KIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE" && !(args.dataItem._behaviors != undefined &&
                args.dataItem._behaviors.isReadOnly != undefined && args.dataItem._behaviors.isReadOnly[args.column.field] != undefined && args.dataItem._behaviors.isReadOnly[args.column.field])) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex
            );
            if (args.column.field == "SYS_PRICE_POINT") {
                this.openSystemPriceModal(args.dataItem);
            }
            else if (args.column.field == "END_CUSTOMER_RETAIL") {
                var column = this.wipTemplate.columns.filter(x => x.field == args.column.field);
                this.openEndCustomerModal(args.dataItem, column[0]);
            }
            else if (args.column.field == "MRKT_SEG" || args.column.field == "CONSUMPTION_COUNTRY_REGION"
                || args.column.field == "CONSUMPTION_CUST_PLATFORM" || args.column.field == "CONSUMPTION_CUST_SEGMENT"
                || args.column.field == "CONSUMPTION_CUST_RPT_GEO" || args.column.field == "CONSUMPTION_SYS_CONFIG"
                || args.column.field == "DEAL_SOLD_TO_ID" || args.column.field == "TRGT_RGN") {
                var column = this.wipTemplate.columns.filter(x => x.field == args.column.field);
                this.openMultiSelectModal(args.dataItem, column[0]);
            }            
        }
        else if ((args.column.field == "PRD_BCKT" && this.curPricingTable.OBJ_SET_TYPE_CD == "KIT") || (args.column.field == "TITLE" && this.curPricingTable.OBJ_SET_TYPE_CD !== "KIT")) {
            this.openDealProductModal(args.dataItem);
        }
    }

    updateModalDataItem(dataItem, field, returnVal) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            dataItem[field] = returnVal;
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
            this.dirty = true;
        }
    }

    updateSaveIcon(eventData: boolean) {
        this.dirty = eventData;
    }

    openSystemPriceModal(dataItem) {
        const dialogRef = this.dialog.open(systemPricePointModalComponent, {
            width: "900px",
            data: {
                label: "System Price Point",
                cellCurrValues: dataItem["SYS_PRICE_POINT"]
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null) {
                this.updateModalDataItem(dataItem, "SYS_PRICE_POINT", returnVal);
            }
        });
    }

    openDealProductModal(dataItem) {
        const dialogRef = this.dialog.open(dealProductsModalComponent, {
            width: "1000px",
            data: {
                dataItem: dataItem
            }
        });
    }

    openEndCustomerModal(dataItem, column) {
        const dialogRef = this.dialog.open(endCustomerRetailModalComponent, {
            width: "1000px",
            data: {
                item: {
                    retailLookUpUrl: column.lookupUrl,
                    countryLookUpUrl: "/api/PrimeCustomers/GetCountries",
                    colName: "END_CUSTOMER_RETAIL",
                    isAdmin: false,
                    clearEndCustomerDisabled: false,
                    dealId: dataItem.DC_ID
                },
                cellCurrValues: {
                    END_CUST_OBJ: dataItem.END_CUST_OBJ,
                    END_CUSTOMER_RETAIL: dataItem.END_CUSTOMER_RETAIL,
                    IS_PRIME: dataItem.IS_PRIMED_CUST,
                    PRIMED_CUST_CNTRY: dataItem.PRIMED_CUST_CNTRY,
                    PRIMED_CUST_NM: dataItem.PRIMED_CUST_NM,
                    PRIMED_CUST_ID: dataItem.PRIMED_CUST_ID
                }
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined) {
                dataItem.END_CUST_OBJ = returnVal.END_CUST_OBJ;
                this.updateModalDataItem(dataItem, "END_CUSTOMER_RETAIL", returnVal.END_CUSTOMER_RETAIL);
                this.updateModalDataItem(dataItem, "IS_PRIME", returnVal.IS_PRIME);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_CNTRY", returnVal.PRIMED_CUST_CNTRY);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_NM", returnVal.PRIMED_CUST_NM);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_ID", returnVal.PRIMED_CUST_ID);
                this.updateModalDataItem(dataItem, "IS_RPL", returnVal.IS_RPL);
            }
        });
    }
    openOverLappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.curPricingTable,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            height: '530px',
            width: '800px',
            data: data,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

    openMultiSelectModal(dataItem, column) {
        let source: any = [];
        let value = [];
        let url = "";
        if (column.field == "CONSUMPTION_COUNTRY_REGION") {
            url = column.lookupUrl + dataItem.CUST_MBR_SID;
            this.enableSelectAll = true;
            this.enableDeselectAll = true;
            if (dataItem[column.field] != undefined && dataItem[column.field] != null && dataItem[column.field] !== "") {
                value = dataItem[column.field].split("|").map(function (item) {
                    return item.trim();
                });
            }
        }
        else {
            if (column.field == "CONSUMPTION_CUST_PLATFORM" || column.field == "CONSUMPTION_CUST_SEGMENT"
                || column.field == "CONSUMPTION_CUST_RPT_GEO" || column.field == "CONSUMPTION_SYS_CONFIG"
                || column.field == "DEAL_SOLD_TO_ID" || column.field == "TRGT_RGN") {
                if (column.field == "DEAL_SOLD_TO_ID") {
                    url = column.lookupUrl + "/" + dataItem.CUST_MBR_SID + "/" + dataItem.GEO_COMBINED.replace(/\//g, ',') + "/" + dataItem.CUST_ACCNT_DIV.replace(/\//g, ',');
                    column.lookupText = "subAtrbCd";
                }
                else if (column.field == "TRGT_RGN") {
                    url = column.lookupUrl + dataItem.GEO_COMBINED;
                    this.enableSelectAll = false;
                    this.enableDeselectAll = false;
                    value = dataItem[column.field];
                }
                else
                    url = column.lookupUrl + dataItem.CUST_MBR_SID;
                this.enableSelectAll = true;
                this.enableDeselectAll = true;
            }
            else {
                url = column.lookupUrl;
                this.enableSelectAll = false;
                this.enableDeselectAll = false;
            }
            if (dataItem[column.field] != undefined && dataItem[column.field] != null && dataItem[column.field] !== "") {
                if (typeof dataItem[column.field] == "string") {
                    value = dataItem[column.field].split(",").map(function (item) {
                        return item.trim();
                    });
                } else {
                    value = dataItem[column.field].map(function (item) {
                        return item.trim();
                    });
                }
            }
        }
        if (column.field == "MRKT_SEG") {
            source = this.dropdownResponses.__zone_symbol__value["MRKT_SEG"]
        }
        const dialogRef = this.dialog.open(multiSelectModalComponent, {
            width: "800px",
            data: {
                cellCurrValues: value,
                items: {
                    'label': column.title,
                    'opLookupUrl': url,
                    'opLookupText': column.lookupText,
                    'opLookupValue': column.lookupValue,
                    'enableSelectAll': this.enableSelectAll,
                    'enableDeselectAll': this.enableDeselectAll,
                    'data': source
                },
                colName: column.field
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null) {
                this.updateModalDataItem(dataItem, column.field, returnVal);
            }
        });
    }

    setInvalidDate(value) {
        this.invalidDate = value;
    }

    cellCloseHandler(args: CellCloseEvent): void {
        if (args.dataItem != undefined) {
            if (this.invalidDate) {
                args.sender.cellClick.closed = true;
                args.sender.cellClick.isStopped = true;
                args.preventDefault();
            }
            else {
                args.sender.cellClick.closed = false;
                args.sender.cellClick.isStopped = false;
                PTE_Common_Util.cellCloseValues(args.column.field, args.dataItem);
                if (args.column.field == "REBATE_BILLING_START" || args.column.field == "REBATE_BILLING_END"
                    || args.column.field == "START_DT" || args.column.field == "LAST_REDEAL_DT" || args.column.field == "END_DT"
                    || args.column.field == "OEM_PLTFRM_LNCH_DT" || args.column.field == "OEM_PLTFRM_EOL_DT" || args.column.field == "ON_ADD_DT")
                    if (args.dataItem[args.column.field] != undefined && args.dataItem[args.column.field] != null && args.dataItem[args.column.field] != "" && args.dataItem[args.column.field] != "Invalid date")
                        args.dataItem[args.column.field] = this.datePipe.transform(args.dataItem[args.column.field], "MM/dd/yyyy");
                if ((args.column.field == "START_DT" || args.column.field == "END_DT") && args.dataItem._behaviors != undefined && args.dataItem._behaviors != null
                    && args.dataItem._behaviors.isDirty != undefined && args.dataItem._behaviors.isDirty != null && args.dataItem._behaviors.isDirty[args.column.field] != undefined
                    && args.dataItem._behaviors.isDirty[args.column.field] != null && args.dataItem._behaviors.isDirty[args.column.field]) {
                    if (args.dataItem.PAYOUT_BASED_ON != undefined && args.dataItem.PAYOUT_BASED_ON != null && args.dataItem.PAYOUT_BASED_ON != "" && args.dataItem.PAYOUT_BASED_ON == "Consumption") {
                        this.isWarning = true;
                        this.message = "Changes to deal Start/End Dates for Consumption deals will change Billings Start/End Dates.\nValidate Billings Start/End Dates with the Contract.";
                    }
                }
                if (args.dataItem._dirty != undefined && args.dataItem._dirty != null && args.dataItem._dirty) {
                    this.dirty = true;
                }
            }
        }
    }

    applyHideIfAllRules(): void {
        var hideIfAll = PTE_Load_Util.getHideIfAllrules(this.groups);
        if (hideIfAll.length > 0) {
            for (var r = 0; r < hideIfAll.length; r++) {
                if (this.groups != undefined) {
                    for (var g = 0; g < this.groups.length; g++) {
                        var group = this.groups[g];
                        if (group != undefined && hideIfAll[r] && group.name === hideIfAll[r].name) {
                            var data = this.gridResult.filter(x => x[hideIfAll[r].atrb] != undefined && x[hideIfAll[r].atrb] == hideIfAll[r].value);
                            if (this.gridResult.length == data.length) {
                                this.groups.splice(g, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    SaveDeal() {
        _.each(this.gridResult, (item) => {
            if ((moment(item["START_DT"]).isBefore(this.contractData.START_DT) || moment(item["END_DT"]).isAfter(this.contractData.END_DT)) && this.isDatesOverlap == false) {
                this.isDatesOverlap = true;
            }
        });
        if (!this.isDatesOverlap) {
            this.SaveDealData();
        }
        else {
            this.isWarning = true;
            this.message = "Extending Deal Dates will result in the extension of Contract Dates. Please click 'OK', if you want to proceed.";
        }
    }

    SaveDealData() {
        this.isWarning = false;
        this.isDatesOverlap = false;
        this.isDataLoading = true;
        this.setBusy("Saving...", "Saving Deal Information", "Info");
        let isShowStopError = PTE_Validation_Util.validateDeal(this.gridResult, this.contractData, this.curPricingTable, this.curPricingStrategy, this.isTenderContract, this.lookBackPeriod, this.templates, this.groups, this.VendorDropDownResult);
        if (isShowStopError) {
            this.loggerService.warn("Please fix validation errors before proceeding", "");
            this.gridData = process(this.gridResult, this.state);
            this.isDataLoading = false;
            this.setBusy("", "", "");
        }
        else {
            let data = {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [this.curPricingTable],
                "PricingTableRow": [],
                "WipDeals": this.gridResult != undefined ? this.gridResult.filter(x => x._dirty == true) : [],
                "EventSource": 'WIP_DEAL',
                "Errors": {}
            }
            this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, false).subscribe((response: any) => {
                if (response != undefined && response != null && response.Data != undefined && response.Data != null
                    && response.Data.WIP_DEAL != undefined && response.Data.WIP_DEAL != null && response.Data.WIP_DEAL.length > 0) {
                    this.refreshContractData(this.in_Ps_Id, this.in_Pt_Id);
                    let isanyWarnings = false;
                    if (this.gridResult.length != response.Data.WIP_DEAL) {
                        _.each(this.gridResult, (item) => {
                            let isResponse = false;
                            _.each(response.Data.WIP_DEAL, (wipItem) => {
                                if (wipItem.DC_ID == item.DC_ID)
                                    isResponse = true;
                            });
                            if (!isResponse) {
                                isanyWarnings = item.warningMessages !== undefined && item.warningMessages.length > 0 ? true : false;
                            }
                        });
                    }
                    isanyWarnings = response.Data.WIP_DEAL.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
                    if (isanyWarnings) {
                        this.setBusy("Saved with warnings", "Didn't pass Validation", "Warning");
                    }
                    else {
                        this.setBusy("Save Successful", "Saved the contract", "Success");
                    }                    
                }
                this.getWipDealData();
                this.dirty = false;
            },
            (error) => {
                this.loggerService.error("dealEditorComponent::saveUpdateDEAPI::", error);
                this.isDataLoading = false;
            });
        }
    }

    setBusy(msg, detail, msgType) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isDataLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                return;
            }
            this.isDataLoading = newState;
            if (this.isDataLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                }, 100);
            }
        });
    }
    setWarningDetails() {
        PTE_Common_Util.setWarningFields(this.gridResult, this.curPricingTable);
        PTE_Common_Util.clearBadegCnt(this.groups);
        for (var i = 0; i < this.gridResult.length; i++) {
            if (this.gridResult[i] != null) {
                var keys = Object.keys(this.gridResult[i]._behaviors.isError);
                let tierAtrbAdded = false;
                for (var key in keys) {
                    if (PTE_Config_Util.tierAtrbs.indexOf(keys[key]) >= 0 && this.gridResult[i].NUM_OF_TIERS != undefined && !tierAtrbAdded) {
                        this.gridResult[i]._behaviors.isError["TIER_NBR"] = true;
                        PTE_Common_Util.increaseBadgeCnt("TIER_NBR", this.groups, this.templates);
                        tierAtrbAdded = true;
                    }
                    PTE_Common_Util.increaseBadgeCnt(keys[key], this.groups, this.templates);
                }
            }
        }
        this.numSoftWarn = PTE_Common_Util.checkSoftWarnings(this.gridResult, this.curPricingTable);
    }

    async getAllDrowdownValues() {
        let dropObjs = {};
        let atrbs = this.isTenderContract ? PTE_Config_Util.tenderDropDownAtrbs : PTE_Config_Util.contractDropDownAtrbs;

        _.each(atrbs, (item) => {
            let column = this.wipTemplate.columns.filter(x => x.field == item);
            if (column && column.length > 0 && column[0].lookupUrl && column[0].lookupUrl != '') {
                let url = "";
                if (item == "COUNTRY")
                    url = "/api/PrimeCustomers/GetCountries";
                else if (item == "PERIOD_PROFILE")
                    url = column[0].lookupUrl + this.contractData.CUST_MBR_SID;
                else if (item == "SETTLEMENT_PARTNER")
                    url = column[0].lookupUrl + "/" + this.contractData.CUST_MBR_SID;
                else
                    url = column[0].lookupUrl;

                dropObjs[`${item}`] = this.pteService.readDropdownEndpoint(url);
            }
        });
        let result = await forkJoin(dropObjs).toPromise().catch((err) => {
            this.loggerService.error('pricingTableEditorComponent::getAllDrowdownValues::service', err);
        });
        if (result != undefined) {
            if (result["SETTLEMENT_PARTNER"] != undefined) {
                this.VendorDropDownResult = result["SETTLEMENT_PARTNER"];
            }
        }
        return result;
    }
    Close() {
        this.isWarning = false;
        this.isDatesOverlap = false;
    }

    refreshContractData(id, ptId) {
        this.contractDetailsSvc
            .readContract(this.contractData.DC_ID)
            .subscribe((response: Array<any>) => {
                this.contractData = PTE_Common_Util.initContract(this.UItemplate, response[0]);
                this.contractData.CUST_ACCNT_DIV_UI = "";

                // if the current strategy was changed, update it
                if (id != undefined && this.in_Ps_Id === id) {
                    this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], id);
                    if (id != undefined && this.in_Pt_Id === ptId && this.curPricingStrategy != undefined) {
                        this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], ptId);
                    }
                }
            });
    }
    filterDealData(event) {
        if (event.keyCode == 13) {
            if (this.searchFilter != undefined && this.searchFilter != null && this.searchFilter != "") {
                if (this.searchFilter.length < 3) {
                    // This breaks the tab filtering
                    this.clearSearchGrid();
                    return;
                }
                else {
                    this.state.filter = {
                        logic: "or",
                        filters: [
                            {
                                field: "DC_ID",
                                operator: "eq",
                                value: this.searchFilter
                            }, {
                                field: "WF_STG_CD",
                                operator: "contains",
                                value: this.searchFilter
                            }, {
                                field: "PTR_USER_PRD",
                                operator: "contains",
                                value: this.searchFilter
                            }, {
                                field: "TITLE",
                                operator: "contains",
                                value: this.searchFilter
                            }, {
                                field: "NOTES",
                                operator: "contains",
                                value: this.searchFilter
                            }
                        ],
                    }
                    this.gridData = process(this.gridResult, this.state);
                }
            }
        }
    }
    clearSearchGrid() {
        this.state.filter = {
            logic: "and",
            filters: [],
        }
        this.gridData = process(this.gridResult, this.state);
    }
    toggleWrap = function () {
        const elements = Array.from(
            document.getElementsByClassName('ng-binding') as HTMLCollectionOf<HTMLElement>
        );
        this.wrapEnabled = !this.wrapEnabled;
        var newVal = this.wrapEnabled ? "normal" : "nowrap";
        var newH = this.wrapEnabled ? "100%" : "auto";
        elements.forEach((item) => {
            item.style.setProperty('white-space', newVal);
            item.style.setProperty("height", newH);
        });
        this.grid.autoFitColumn(2);
    }
    exportToExcel() {
        GridUtil.dsToExcel(this.wipTemplate.columns, this.gridResult, "Deal Editor Export");
    }
    exportToExcelCustomColumns() {
        GridUtil.dsToExcel(this.columns, this.gridResult, "Deal Editor Export");
    }

    gridReload(eventData: boolean) {
        if (eventData)
            this.ngOnInit();
    }

    ngOnInit() {
        this.isDataLoading = true;
        this.setBusy("Loading Deal Editor", "Loading...","Info");
        this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        this.isTenderContract = Tender_Util.tenderTableLoad(this.contractData);
        this.getGroupsAndTemplates();
        this.dropdownResponses = this.getAllDrowdownValues();        
        this.selectedTab = "Deal Info";
        this.filterColumnbyGroup(this.selectedTab);
    }
}

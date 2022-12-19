import { Component, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import * as _ from 'underscore';
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { opGridTemplate } from "../../core/angular.constants"
import { SelectEvent } from "@progress/kendo-angular-layout";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent, CellCloseEvent, GridComponent } from "@progress/kendo-angular-grid";
import { process, State, distinct, FilterDescriptor, CompositeFilterDescriptor } from "@progress/kendo-data-query";
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
import { dealProductsModalComponent } from "../ptModals/dealProductsModal/dealProductsModal.component";
import { missingCapCostInfoModalComponent } from '../ptModals/dealEditorModals/missingCapCostInfoModal.component';
import { GridUtil } from '../grid.util';
import { PTE_Save_Util } from '../PTEUtils/PTE_Save_util';
import { dealEditorService } from "../dealEditor/dealEditor.service";
import { tenderMCTPCTModalComponent } from '../ptModals/tenderDashboardModals/tenderMCTPCTModal.component';
import { SecurityService } from "../../shared/services/security.service"

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
        protected dialog: MatDialog,
        private DESvc: dealEditorService, private securityService: SecurityService) {
    }

    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() in_Search_Text: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    @Input() in_Is_Tender_Dashboard: boolean = false;// it will recieve true when DE used in TenderDashboard Screen
    @Input() in_Search_Results: any = [];
    @Input() in_Deal_Type: string = "";
    @ViewChild(GridComponent) private grid: GridComponent;
    @Output() refreshedContractData = new EventEmitter;
    @Output() tmDirec = new EventEmitter();
    @Output() deTabInfmIconUpdate = new EventEmitter();
    @Output() pteRedir = new EventEmitter();
    @Output() invokeSearchDatasource = new EventEmitter();
    @Output() bidActionsUpdated = new EventEmitter();
    @Output() floatActionsUpdated = new EventEmitter();
    @Output() tenderCopyDeals = new EventEmitter();
    @Output() runPCTMCT = new EventEmitter();
    @Output() emailData = new EventEmitter();
    @Output() refreshGridData = new EventEmitter();
    @Output() removeDeletedRow = new EventEmitter();
    private isWarning: boolean = false;
    private message: string = "";
    public dirty = false;
    private isAddDialog: boolean = false;
    private isrenameDialog: boolean = false;
    public DeAddtab = "";
    public columnSearchFilter;
    public defaultColumnOrderArr;
    public curGroup;
    public groupsdefault;
    public opName = "DealEditor";
    public Derenametab = "";
    public renamedefault: any = [];
    private isDatesOverlap = false;
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private wipTemplate: any = {};
    public groups: any;
    public columns: any = [];
    public templates: any;
    public selectedTab: any;
    public voltLength;
    private isBusyShowFunFact: boolean = true;
    private numSoftWarn = 0;
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
    public gridResult = [];
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
    private invalidField: boolean = false;
    private VendorDropDownResult: any = {};
    private searchFilter: any;
    private wrapEnabled: boolean = false;
    private isExportable: boolean = true;
    private dropdownFilterColumns = PTE_Config_Util.dropdownFilterColumns
    private savedResponseWarning: any[] = [];
    private roleCanCopyDeals = (<any>window).usrRole == 'FSE' || (<any>window).usrRole == 'GA';
    public isRunning: boolean = false;
    private CAN_VIEW_COST_TEST = this.securityService.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper);
    private CAN_VIEW_MEET_COMP = this.securityService.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "FSE" && this.in_Is_Tender_Dashboard);

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
    private filteringData: any[] = [];
    filterChange(filter: any): void {
        this.state.filter = filter;
        this.gridData = process(this.gridResult, this.state);
        if(filter && filter.filters && filter.filters.length>0){
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                let arrayData = [];
                if(item && item.filters && item.filters.length>0){
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        let column = fltrItem.field.toString();
                        if (this.dropdownFilterColumns.includes(column)) {
                            _.each(this.gridData.data, (eachData) => {
                                let keys = Object.keys(eachData[column]);
                                let isexists = false;
                                for (var key in keys) {
                                    if (eachData[column][keys[key]] == fltrItem.value.toString())
                                        isexists = true;
                                }
                                if (isexists)
                                    arrayData.push(eachData);
                            })
                            this.gridData = process(arrayData, this.state);
                        }
                    })
                }
            });
        }
    }

    distinctPrimitive(): any {
        _.each(this.wipTemplate.columns, (col) => {
            if (col.filterable == true) {
                let distinctData: any[] = [];
                if (this.dropdownFilterColumns.includes(col.field)) {
                    if (col.field == "EXPIRE_FLG") {
                        distinctData = distinct(this.gridResult, col.field).map(item => {
                            if (item[col.field] == "1") {
                                return { Text: "Yes", Value: item[col.field] };
                            }
                            else if (item[col.field] == "0")
                                return { Text: "No", Value: item[col.field] }
                        });
                    }
                    else {
                        _.each(this.gridResult, (item) => {
                            let keys = Object.keys(item[col.field]);
                            for (var key in keys) {
                                if (item[col.field][keys[key]] != undefined && item[col.field][keys[key]] != null && distinctData.filter(x => x.Text == item[col.field][keys[key]].toString()).length == 0)
                                    distinctData.push({ Text: item[col.field][keys[key]].toString(), Value: item[col.field][keys[key]] });
                            }
                        });
                    }
                }
                else {
                    distinctData = distinct(this.gridResult, col.field).map(item => {
                        if (col.field == "CUST_MBR_SID") {
                            return { Text: item.Customer.CUST_NM, Value: item[col.field] };
                        }
                        else if (col.field == 'WF_STG_CD') {
                            let val = item.WF_STG_CD === "Draft" ? item.PS_WF_STG_CD : item.WF_STG_CD;
                            return { Text: val, Value: item[col.field] };
                        }
                        if (moment(item[col.field], "MM/DD/YYYY", true).isValid()) {
                            return { Text: (new Date(new Date(item[col.field]).getTime() + (new Date(item[col.field]).getTimezoneOffset() * 60000))).toString(), Value: item[col.field] };
                        }
                        else if (item[col.field] != undefined && item[col.field] != null)
                            return { Text: item[col.field].toString(), Value: item[col.field] }
                    });
                }
                this.filteringData[col.field] = distinctData;
            }
        });
    }

    async getGroupsAndTemplates() {
        //Get Groups for corresponding deal type
        this.groups = PTE_Load_Util.getRulesForDE(this.curPricingTable.OBJ_SET_TYPE_CD);
        this.groupsdefault = PTE_Load_Util.getRulesForDE(this.curPricingTable.OBJ_SET_TYPE_CD);
        // Get template for the selected WIP_DEAL
        this.wipTemplate = this.UItemplate["ModelTemplates"]["WIP_DEAL"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];

        PTE_Load_Util.wipTemplateColumnSettings(this.wipTemplate, this.isTenderContract, this.curPricingTable.OBJ_SET_TYPE_CD, this.in_Is_Tender_Dashboard);
        this.templates = opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        if (!this.in_Is_Tender_Dashboard)//if DE not called from Tender Dashboard then we need call the service call to get WIP_DEAL data
            await this.getWipDealData();
        else {// TenderDashboard will share the search results to display in a grid , no service call required
            this.gridResult = this.in_Search_Results;
            this.setWarningDetails();
            this.applyHideIfAllRules();
            this.lookBackPeriod = PTE_Load_Util.getLookBackPeriod(this.gridResult);
            this.gridData = process(this.gridResult, this.state);
            this.distinctPrimitive();
        }
        this.customLayout(false);
    }

    async getWipDealData() {
        let response: any = await this.pteService.readPricingTable(this.in_Pt_Id).toPromise().catch((err) => {
            this.loggerService.error('dealEditorComponent::readPricingTable::readTemplates:: service', err);
        });
        if (response && response.WIP_DEAL && response.WIP_DEAL.length > 0) {
            //to avoid losing warning details which comes only during save action
            if (this.savedResponseWarning && this.savedResponseWarning.length > 0)
                PTE_Load_Util.bindWarningDetails(response.WIP_DEAL, this.savedResponseWarning);
            this.deTabInfmIconUpdate.emit(PTE_Common_Util.dealEditorTabValidationIssue(response, true));
            if (response.WIP_DEAL[0].IS_HYBRID_PRC_STRAT == '1') {
                response.WIP_DEAL = PTE_Validation_Util.ValidateEndCustomer(response.WIP_DEAL, "OnLoad", this.curPricingStrategy, this.curPricingTable);
                var isValidationNeeded = response.WIP_DEAL.filter(obj => obj.IS_HYBRID_PRC_STRAT == "1" && obj.HAS_TRACKER == "1");
                if (isValidationNeeded && response.WIP_DEAL.length == isValidationNeeded.length && this.curPricingTable.PASSED_VALIDATION != undefined && this.curPricingTable.PASSED_VALIDATION !=null && this.curPricingTable.PASSED_VALIDATION.toLowerCase() == "dirty") {
                    response.WIP_DEAL = PTE_Validation_Util.validateSettlementLevel(response.WIP_DEAL, this.curPricingStrategy);
                    response.WIP_DEAL = PTE_Validation_Util.validateOverArching(response.WIP_DEAL, this.curPricingStrategy, this.curPricingTable);
                }
            }
            this.voltLength = response.WIP_DEAL.length;
            if (this.gridResult && (this.gridResult.filter(x => x.WF_STG_CD == 'Hold').length <= response.WIP_DEAL.filter(x => x.WF_STG_CD == 'Hold').length)) {
                let linkedIds = this.gridResult.filter(y => y.isLinked).map(x => x.DC_ID);
                if (linkedIds.length > 0) {
                    _.each(linkedIds, id => {
                        _.each(response.WIP_DEAL, item => {
                            if (item.DC_ID == id)
                                item.isLinked = true;
                        })
                    })
                }
            }
            this.gridResult = response.WIP_DEAL;
            this.setWarningDetails();
            this.applyHideIfAllRules();
            this.lookBackPeriod = PTE_Load_Util.getLookBackPeriod(this.gridResult);
            this.gridData = process(this.gridResult, this.state);
            this.distinctPrimitive();
            this.isLoading = false;
            this.isDataLoading = false;
        } else {
            this.gridResult = [];
        }
    }

    onTabSelect(e: SelectEvent) {
        e.preventDefault();
        if (e.title != undefined) {
            this.searchFilter = "";
            this.clearSearchGrid();
            this.selectedTab = e.title;
            var group = this.groups.filter(x => x.name == this.selectedTab);
            if (group[0].isTabHidden) {
                var tabs = this.groups.filter(x => x.isTabHidden === false);
                this.selectedTab = tabs[0].name;
                this.filterColumnbyGroup(this.selectedTab);
            }
            else
                this.filterColumnbyGroup(this.selectedTab);
        } else {
            this.refreshGrid();
        }
    }

    refreshGrid() {
        this.ngOnInit();
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
        this.invalidField = false;
        if (args.dataItem != undefined) {
            PTE_Common_Util.parseCellValues(args.column.field, args.dataItem);
        }
        if (!args.isEdited && args.column.field !== 'MISSING_CAP_COST_INFO' && args.column.field !== "details" && args.column.field !== "tools" && args.column.field !== "PRD_BCKT" && args.column.field !== "CUST_MBR_SID" && args.column.field !== "CAP_INFO" && args.column.field !== "YCS2_INFO" && args.column.field !== "COMPETITIVE_PRICE" && args.column.field !== "COMP_SKU" &&
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
        else if (this.in_Is_Tender_Dashboard && args.column.field == "MEETCOMP_TEST_RESULT") {// functionality required only for Grid in TenderDashboard Screen
            this.openMCTPCTModal(args.dataItem, true)
        }
        else if (this.in_Is_Tender_Dashboard && args.column.field == "COST_TEST_RESULT") {// functionality required only for Grid in TenderDashboard Screen
            this.openMCTPCTModal(args.dataItem, false)
        }
        else if (args.column.field == 'MISSING_CAP_COST_INFO') {
            this.openMissingCapCostInfo(args.dataItem);
        }
        else if (args.column.field == "CNTRCT_OBJ_SID" && this.in_Is_Tender_Dashboard)
            (<any>window).location.href = '#/tendermanager/' + args.dataItem.CNTRCT_OBJ_SID;
    }

    updateModalDataItem(dataItem, field, returnVal) {
        if ((dataItem.isLinked != undefined && dataItem.isLinked && this.gridResult.filter(x => x.isLinked).length > 0 && field !== 'TRGT_RGN') || (dataItem._parentCnt > 1 && !dataItem.isLinked && field !== 'TRGT_RGN')) {
            _.each(this.gridResult, (item) => {
                if ((item.isLinked != undefined && item.isLinked && dataItem.isLinked) || (dataItem._parentCnt > 1 && dataItem.DC_PARENT_ID == item.DC_PARENT_ID && !dataItem.isLinked))
                    PTE_Save_Util.setDataItem(item, field, returnVal);
            })
        }
        else {
            if (dataItem != undefined && dataItem._behaviors != undefined) {
                PTE_Save_Util.setDataItem(dataItem, field, returnVal);
                dataItem["_dirty"] = true;
            }
        }
        this.dirty = true;
    }

    updateSaveIcon(eventData: boolean) {
        this.dirty = eventData;
    }


    actionClick(actionName) {
        this.floatActionsUpdated.emit({ newValue: actionName, gridDS: this.gridResult });
    }


    openSystemPriceModal(dataItem) {
        let sysPricePoint = "";
        if (dataItem["SYS_PRICE_POINT"] != undefined && dataItem["SYS_PRICE_POINT"] != null && dataItem["SYS_PRICE_POINT"] != "") {
            let values = dataItem["SYS_PRICE_POINT"].split('$');
            if (values && (values.length < 2 || (values.length == 2 && values[0] != "<=") || (values.length == 2 && (Number.isNaN(Number(values[1])) || values[1] <= "0")))) {
                sysPricePoint = "";
            }
        }
        else {
            sysPricePoint = dataItem["SYS_PRICE_POINT"];
        }
        const dialogRef = this.dialog.open(systemPricePointModalComponent, {
            width: "700px",
            data: {
                label: "System Price Point",
                cellCurrValues: sysPricePoint
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null) {
                this.updateModalDataItem(dataItem, "SYS_PRICE_POINT", returnVal);
            }
        });
    }

    openMCTPCTModal(dataItem, isMeetComp) {
        const dialogRef = this.dialog.open(tenderMCTPCTModalComponent, {
            width: "1420px",
            panelClass:'admin_deal_mctpct',
            data: {
                CNTRCT_OBJ_SID: dataItem.CNTRCT_OBJ_SID,
                PRC_ST_OBJ_SID: dataItem.PRC_ST_OBJ_SID,
                WIP_ID: dataItem.DC_ID,
                isMeetComp: isMeetComp,
                UItemplate: this.UItemplate
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (!isMeetComp) {
                this.loggerService.success("Please wait for the result to be updated...");
            }
            if (!isMeetComp || (isMeetComp && returnVal && returnVal.length > 0)) {
                let ids = [];
                ids.push(dataItem.DC_ID);
                let args = { wipIds: ids };
                this.refreshGridData.emit(args);
            }
        });
    }

    openDealProductModal(dataItem) {
        const dialogRef = this.dialog.open(dealProductsModalComponent, {
            width: "1000px",
            panelClass: 'deal-pmc-custom',
            data: {
                dataItem: dataItem
            }
        });
    }

    openEndCustomerModal(dataItem, column) {
        const dialogRef = this.dialog.open(endCustomerRetailModalComponent, {
            panelClass: "mat-remove-space",
            width: "1000px",
            autoFocus:false,
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
                if ((dataItem.isLinked != undefined && dataItem.isLinked) || (dataItem._parentCnt > 1 && !dataItem.isLinked)) {
                    _.each(this.gridResult, (item) => {
                        if ((item.isLinked != undefined && item.isLinked && dataItem.isLinked) || (dataItem._parentCnt > 1 && dataItem.DC_PARENT_ID == item.DC_PARENT_ID && !dataItem.isLinked))
                            PTE_Save_Util.setDataItem(item, 'END_CUST_OBJ', returnVal.END_CUST_OBJ);
                    })
                }
                this.updateModalDataItem(dataItem, "END_CUSTOMER_RETAIL", returnVal.END_CUSTOMER_RETAIL);
                this.updateModalDataItem(dataItem, "IS_PRIMED_CUST", returnVal.IS_PRIME);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_CNTRY", returnVal.PRIMED_CUST_CNTRY);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_NM", returnVal.PRIMED_CUST_NM);
                this.updateModalDataItem(dataItem, "PRIMED_CUST_ID", returnVal.PRIMED_CUST_ID);
                this.updateModalDataItem(dataItem, "IS_RPL", returnVal.IS_RPL);
            }
        });
    }

    openMissingCapCostInfo(dataItem) {
        const dialogRef = this.dialog.open(missingCapCostInfoModalComponent, {
            panelClass: "mat-remove-space",
            width: "900px",
            autoFocus: false,
            data: {
                    DC_ID: dataItem.DC_ID,
                    CUST_MBR_SID: dataItem.CUST_MBR_SID
            }
        });
    }

    openOverLappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.curPricingTable,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            data: data,
            panelClass: 'de-css-comp'
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
            panelClass: 'multiselect-scroll-style',
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

    setInvalidField(value) {
        this.invalidField = value;
    }

    renameTab = function () {
        this.Derenametab = "";
        this.Derenametab = this.selectedTab;
        this.isrenameDialog = true
    }

    renametabdata() {
        if (this.Derenametab === "" || this.Derenametab.toLowerCase() == "overlapping") return;
        for (var g = 0; g < this.groups.length; g++) {
            if (this.groups[g].name == this.selectedTab) {
                this.groups[g].name = this.Derenametab;
                this.renamedefault.push({ "key": this.Derenametab, "value": this.selectedTab });
            }
        }

        for (var i = 0; i < this.wipTemplate.columns.length; i++) {
            var gptemplate = this.templates[this.wipTemplate.columns[i].field];
            if (gptemplate != undefined && gptemplate.Groups.includes(this.selectedTab)) {
                for (var g = 0; g < this.templates[this.wipTemplate.columns[i].field].Groups.length; g++) {
                    if (this.templates[this.wipTemplate.columns[i].field].Groups[g] == this.selectedTab) {
                        this.templates[this.wipTemplate.columns[i].field].Groups[g] = this.Derenametab;
                    }
                }
            }
        }
        this.selectedTab = this.Derenametab;
        this.isrenameDialog = false;
    }

    clearCurrentLayout() {
        if (confirm("Are you sure that you want to clear/reset this layout?")) {
            this.isDataLoading = true;
            this.setBusy("Clearing...", "Clearing the current Layout", "Info", false);
            this.DESvc.clearAction(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD).subscribe((response: any) => {
                this.isDataLoading = false;
                this.setBusy("", "", "", false);
            }), err => {
                this.loggerService.error("Unable to clear Custom Layout.", err, err.statusText);
            };
            this.isDataLoading = false;
            this.setBusy("", "", "", false);
        }
        this.isDataLoading = false;
    }
    //Default Layout
    defaultLayout() {
        this.groups = JSON.parse(JSON.stringify(this.groupsdefault));
        this.applyHideIfAllRules();
        this.selectedTab = "Deal Info";
        var group = this.groups.filter(x => x.name == this.selectedTab);

        if (this.renamedefault.length > 0) {
            for (var i = 0; i < this.wipTemplate.columns.length; i++) {
                if (this.templates[this.wipTemplate.columns[i].field] != undefined && this.templates[this.wipTemplate.columns[i].field].Groups != undefined) {
                    for (var g = 0; g < this.templates[this.wipTemplate.columns[i].field].Groups.length; g++) {
                        for (var j = 0; j < this.renamedefault.length; j++) {
                            if (this.templates[this.wipTemplate.columns[i].field].Groups.includes(this.renamedefault[j].key)) {
                                if (this.templates[this.wipTemplate.columns[i].field].Groups[g] == this.renamedefault[j].key) {
                                    this.templates[this.wipTemplate.columns[i].field].Groups[g] = this.renamedefault[j].value;
                                }
                            }
                            else {
                                continue;
                            }
                        }
                    }
                }
            }
        }

        this.renamedefault = [];

        if (group[0].isTabHidden) {
            var tabs = this.groups.filter(x => x.isTabHidden === false);
            this.selectedTab = tabs[0].name;
            this.filterColumnbyGroup(this.selectedTab);
        }
        else {
            this.filterColumnbyGroup(this.selectedTab);
        }
        this.setWarningDetails();
    }

    //Default Layout

    //<To Add Tab Data?
    addTab = function () {
        this.DeAddtab = "";
        this.isAddDialog = true;
    }

    Addtabdata() {
        if (this.DeAddtab === "") this.DeAddtab = "New Tab";
        // Prevent duplicate tab names.
        for (var g = 0; g < this.groups.length; g++) {
            if (this.groups[g].name.trim().toLowerCase() === this.DeAddtab.trim().toLowerCase()) {
                this.loggerService.error("Tab name already exists.", null, "Add Tab Failed");
                return;
            }
        }
        this.addToTab(this.DeAddtab.trim());
        this.isAddDialog = false
    }

    addToTab(data) {
        
        this.groups.push({ "name": data, "order": 50, "numErrors": 0, "isTabHidden": false });
        this.groups = this.groups.sort((a, b) => (a.order > b.order) ? 1 : -1);
        // Add Tools
        if (this.templates.tools.Groups === undefined) this.templates.tools.Groups = [];
        this.templates.tools.Groups.push(data);

        // Add Deal Details
        if (this.templates.details.Groups === undefined) this.templates.details.Groups = [];
        this.templates.details.Groups.push(data);

        if (this.templates.DC_PARENT_ID.Groups === undefined) this.templates.DC_PARENT_ID.Groups = [];
        this.templates.DC_PARENT_ID.Groups.push(data);
        this.selectedTab = data;
        this.filterColumnbyGroup(this.selectedTab);
        this.setWarningDetails();
    }
    //<To Add Tab Data>

    saveLayout() {
        this.isDataLoading = true;
        this.setBusy("Saving...", "Saving the Layout", "Info", true);
        var groupSettings = PTE_Common_Util.deepClone(this.groups);
        for (var i = 0; i < groupSettings.length; i++) {
            groupSettings[i].isPinned = false;
        }

        forkJoin({
            request1: this.DESvc.updateActions(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD, "Groups", JSON.stringify(groupSettings)),
            request2: this.DESvc.updateActions(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD, "GroupColumns", JSON.stringify(this.templates)),
            request3: this.DESvc.updateActions(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD, "ColumnOrder", JSON.stringify(this.getColumnOrder())),
            request4: this.DESvc.updateActions(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD, "PageSize", JSON.stringify(25)),
        }).toPromise().catch((err) => {
            this.isDataLoading = false;
            this.setBusy("", "", "", false);
            this.loggerService.error("Unable to save Custom Layout.", err, err.statusText);
        });

        this.loggerService.success("Save Successful..", "Saving the Layout");

        this.isDataLoading = false;
        this.setBusy("", "", "", false);
    }

    getColumnOrder() {
        const grid = this.wipTemplate;
        let columnOrderArr = [];

        for (let i = 0; i < grid.columns.length; i++) {
            columnOrderArr.push(grid.columns[i]["field"]);
        }

        return columnOrderArr;
    }


    customLayout = function (reportError) {
        this.isDataLoading = true;
        this.setBusy("Custom...", "Loading the current Layout", "Info", false);

        reportError = typeof reportError === 'undefined' ? true : reportError;
        this.DESvc.getActions(this.opName, "CustomLayoutFor" + this.curPricingTable.OBJ_SET_TYPE_CD).subscribe((response: any) => {
            if (response && response.length > 0) {
                this.applyCustomLayoutToGrid(response);
                this.isDataLoading = false;
                this.setBusy("", "", "", false);
            } else {
                if (reportError) {
                    alert("You have not saved a custom layout yet.");
                    this.isDataLoading = false;
                    this.setBusy("", "", "", false);
                }
            }
        }), err => {
            this.loggerService.error("Unable to get Custom Layout.", err, err.statusText);
        };
        this.selectedTab = "Deal Info";
        this.isDataLoading = false;
        this.setBusy("", "", "", false);
        this.setWarningDetails();
    }


    applyCustomLayoutToGrid(data) {
        var groupsSetting = data.filter(function (obj) {
            return obj.PRFR_KEY === "Groups";
        });
        if (groupsSetting && groupsSetting.length > 0) {
            this.groups = "";
            this.groups = JSON.parse(groupsSetting[0].PRFR_VAL);
        }

        var groupColumnsSetting = data.filter(function (obj) {
            return obj.PRFR_KEY === "GroupColumns";
        });
        if (groupColumnsSetting && groupColumnsSetting.length > 0) {
            this.templates = "";
            this.templates = JSON.parse(groupColumnsSetting[0].PRFR_VAL);
        }

        for (var i = 0; i < this.groups.length; i++) {
            if (this.templates.END_CUSTOMER_RETAIL.Groups != undefined) {
                if (this.templates.END_CUSTOMER_RETAIL.Groups.includes(this.groups[i].name) && this.groups[i].name != "Deal Info") {
                    if (this.templates.END_CUSTOMER_RETAIL.Groups === undefined) this.templates.END_CUSTOMER_RETAIL.Groups = [];
                    this.templates.END_CUSTOMER_RETAIL.Groups.push(this.groups[i].name);
                }
            }
        }

        this.selectedTab = "Deal Info"
        this.filterColumnbyGroup(this.selectedTab);
    }


    iscolumnchecked(field) {
        if (this.columns.filter(x => x.field == field).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    onColumnChange(val) {

        var col = this.wipTemplate.columns.filter(x => x.field == val.field);

        if (col == undefined || col == null || col.length == 0) return;

        var colGrp = this.templates[val.field];
        if (colGrp == undefined || colGrp.Groups == undefined) {
            colGrp = { Groups: [] };
            this.templates[val.field] = colGrp;
        }
        if (!colGrp.Groups.includes(this.selectedTab)) {
            if (colGrp !== undefined && colGrp !== null) {
                if (colGrp.Groups === undefined) colGrp.Groups = [];
                colGrp.Groups.push(this.selectedTab);
            }
        } else {

            if (colGrp != undefined) {
                var index = colGrp.Groups.indexOf(this.selectedTab);
                if (index > -1) {
                    colGrp.Groups.splice(index, 1);
                }
            }
        }
        this.filterColumnbyGroup(this.selectedTab)
    }

    CloseAdd() {
        this.isAddDialog = false;
    }

    Closerename() {
        this.isrenameDialog = false;
    }

    cellCloseHandler(args: CellCloseEvent): void {
        if (args.dataItem != undefined) {
            if (this.invalidField) {
                args.sender.cellClick.closed = true;
                args.sender.cellClick.isStopped = true;
                args.preventDefault();
            }
            else {
                args.sender.cellClick.closed = false;
                args.sender.cellClick.isStopped = false;                
                _.each(this.gridResult, (item) => {
                    if (item._dirty) {
                        PTE_Common_Util.cellCloseValues(args.column.field, item);
                        if (args.column.field == "REBATE_BILLING_START" || args.column.field == "REBATE_BILLING_END"
                            || args.column.field == "START_DT" || args.column.field == "LAST_REDEAL_DT" || args.column.field == "END_DT"
                            || args.column.field == "OEM_PLTFRM_LNCH_DT" || args.column.field == "OEM_PLTFRM_EOL_DT" || args.column.field == "ON_ADD_DT")
                            if (item[args.column.field] != undefined && item[args.column.field] != null && item[args.column.field] != "" && item[args.column.field] != "Invalid date")
                                item[args.column.field] = this.datePipe.transform(item[args.column.field], "MM/dd/yyyy");                        
                    }
                })
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

    async SaveDeal() {
        this.isDataLoading = true;
        this.setBusy("Saving your data..", "Please wait while saving data.", "Info", true);
        if (!this.in_Is_Tender_Dashboard) {//Save and Validation functionality for Contract DE screen as well as Tender Manager DE Screen
            try {
                _.each(this.gridResult, (item) => {
                    if ((moment(item["START_DT"]).isBefore(this.contractData.START_DT) || moment(item["END_DT"]).isAfter(this.contractData.END_DT)) && this.isDatesOverlap == false) {
                        this.isDatesOverlap = true;
                    }
                });
                if (!this.isDatesOverlap) {
                    await this.SaveDealData();
                }
                else {
                    this.isDataLoading = false;
                    this.setBusy('', '', '', false);
                    this.isWarning = true;
                    this.message = "Extending Deal Dates will result in the extension of Contract Dates. Please click 'OK', if you want to proceed.";
                }
            }
            catch (ex) {
                this.loggerService.error('Something went wrong', 'Error');
                console.error('AllDeals::ngOnInit::', ex);
            }
        }
        else {//Save and Validation functionality for Tender Dashboard DE screen
            let isShowStopError = PTE_Validation_Util.validateTenderDashboardDeal(this.gridResult, this.curPricingTable, this.groups, this.templates);
            if (isShowStopError) {
                this.loggerService.warn("Please fix validation errors before proceeding", "");
                this.gridData = process(this.gridResult, this.state);
                this.isDataLoading = false;
                this.setBusy("", "", "", false);
            }
            else {
                var cashObj = this.gridResult.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
                if (cashObj && cashObj.length > 0) {
                    if (this.VendorDropDownResult != null && this.VendorDropDownResult != undefined && this.VendorDropDownResult.length > 0) {
                        var customerVendor = this.VendorDropDownResult;
                        _.each(this.gridResult, (item) => {
                            var partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
                            if (partnerID && partnerID.length == 1) {
                                item.SETTLEMENT_PARTNER = partnerID[0].DROP_DOWN;
                            }
                        });
                    }
                }
                let data = {
                    "Contract": [],
                    "PricingStrategy": [],
                    "PricingTable": [this.curPricingTable],
                    "PricingTableRow": [],
                    "WipDeals": this.gridResult != undefined ? this.gridResult.filter(x => x._dirty == true) : [],
                    "EventSource": 'WIP_DEAL',
                    "Errors": {}
                }                
                this.invokeSearchDatasource.emit(data);// invoke Tender Dashboard save api call
                this.dirty = false;
                this.setBusy("", "", "", false);
            }
        }
    }

    reloadFn(eventData) {
        if (this.isTenderContract) {
            this.tmDirec.emit('PTR');
        } else {
            this.pteRedir.emit('')
        }
    }
    async SaveDealData() {
        this.isWarning = false;
        this.isDatesOverlap = false;
        this.isDataLoading = true;
        this.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);
        let isShowStopError = PTE_Validation_Util.validateDeal(this.gridResult, this.contractData, this.curPricingTable, this.curPricingStrategy, this.isTenderContract, this.lookBackPeriod, this.templates, this.groups);
        if (isShowStopError) {
            this.loggerService.warn("Please fix validation errors before proceeding", "");
            this.gridData = process(this.gridResult, this.state);
            this.isDataLoading = false;
            this.setBusy("", "", "", false);
        }
        else {
            var cashObj = this.gridResult.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
            if (cashObj && cashObj.length > 0) {
                if (this.VendorDropDownResult != null && this.VendorDropDownResult != undefined && this.VendorDropDownResult.length > 0) {
                    var customerVendor = this.VendorDropDownResult;
                    _.each(this.gridResult, (item) => {
                        var partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
                        if (partnerID && partnerID.length == 1) {
                            item.SETTLEMENT_PARTNER = partnerID[0].DROP_DOWN;
                        }
                    });
                }
            }
            let data = {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [this.curPricingTable],
                "PricingTableRow": [],
                "WipDeals": this.gridResult != undefined ? this.gridResult.filter(x => x._dirty == true) : [],
                "EventSource": 'WIP_DEAL',
                "Errors": {}
            }
            let response: any = await this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, false).toPromise().catch((err) => {
                this.loggerService.error("dealEditorComponent::saveUpdateDEAPI::", err);
                this.isDataLoading = false;
            });
            if (response != undefined && response != null && response.Data != undefined && response.Data != null
                && response.Data.WIP_DEAL != undefined && response.Data.WIP_DEAL != null && response.Data.WIP_DEAL.length > 0) {
                this.setBusy("Saving your data...Done", "Processing results now!", "Info", true);
                this.savedResponseWarning = [];
                await this.refreshContractData(this.in_Ps_Id, this.in_Pt_Id);
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
                    //to avoid losing warning details which comes only during save action
                    PTE_Save_Util.saveWarningDetails(response.Data.WIP_DEAL, this.savedResponseWarning);                    
                    this.setBusy("Saved with warnings", "Didn't pass Validation", "Warning", true);
                    if (this.isTenderContract) {
                        this.tmDirec.emit('');
                    }
                }
                else {
                    this.setBusy("Save Successful", "Saved the contract", "Success", true);
                    if (this.isTenderContract) {
                        this.tmDirec.emit('');
                    }
                }
            }
            await this.getWipDealData();
            this.dirty = false;
        }
    }

    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isDataLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isDataLoading = newState;
            if (this.isDataLoading) {
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
        if (this.in_Is_Tender_Dashboard)//EXCLUDE_AUTOMATION column will have dropdown which is used only in Tender Dashboard
            atrbs.push('EXCLUDE_AUTOMATION');
        _.each(atrbs, (item) => {
            let column = this.wipTemplate.columns.filter(x => x.field == item);
            if (column && column.length > 0 && column[0].lookupUrl && column[0].lookupUrl != '') {
                let url = "";
                if (item == "COUNTRY")
                    url = "/api/PrimeCustomers/GetCountries";
                else if (item == "PERIOD_PROFILE" && !this.in_Is_Tender_Dashboard)// always not editable in TenderDashboard
                    url = column[0].lookupUrl + this.contractData.CUST_MBR_SID;
                else if (item == "SETTLEMENT_PARTNER" && !this.in_Is_Tender_Dashboard)// always not editable in TenderDashboard
                    url = column[0].lookupUrl + "/" + this.contractData.CUST_MBR_SID;
                else
                    url = column[0].lookupUrl;
                if (!(this.in_Is_Tender_Dashboard && (item == "PERIOD_PROFILE" || item == "SETTLEMENT_PARTNER")))
                dropObjs[`${item}`] = this.pteService.readDropdownEndpoint(url);
            }
            else if (item == 'EXPIRE_FLG')
                dropObjs[`${item}`] = [
                    { text: "Yes", value: "1" },
                    { text: "No", value: "0" }
                ]
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
        this.setBusy("", "", "", false);
    }

    async refreshContractData(id, ptId) {
        let response: any = await this.contractDetailsSvc
            .readContract(this.contractData.DC_ID)
            .toPromise().catch((err) => {
                this.loggerService.error('contract data read error.....', err);
                this.isLoading = false;
            });
        this.contractData = PTE_Common_Util.initContract(this.UItemplate, response[0]);
        this.contractData.CUST_ACCNT_DIV_UI = "";
        // if the current strategy was changed, update it
        if (id != undefined && this.in_Ps_Id === id) {
            this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], id);
            if (id != undefined && this.in_Pt_Id === ptId && this.curPricingStrategy != undefined) {
                this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], ptId);
            }
        }
        this.refreshedContractData.emit({ contractData: this.contractData, PS_Passed_validation: this.curPricingStrategy.PASSED_VALIDATION, PT_Passed_validation: this.curPricingTable.PASSED_VALIDATION });
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
            else {
                this.clearSearchGrid();
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
        GridUtil.dsToExcel(this.columns, this.gridData.data, "Deal Editor Export");
    }

    removeDeletedRowData(deletedPsId) {
        this.removeDeletedRow.emit(deletedPsId);
    }

    async refreshContract(eventData: boolean) {
        if (eventData) {
            this.isDataLoading = true;
            this.setBusy("Loading Deals", "Gathering deals and security settings.", "Info", true);
            if (!this.in_Is_Tender_Dashboard) {//Grid requires data from below service for Contract Manager and Tender Manager DE Screens
                await this.getWipDealData();
                await this.refreshContractData(this.in_Ps_Id, this.in_Pt_Id);
            }
            else {// Data will be passed from Tender Dashboard
                this.setBusy("", "", "", false);
                let ids = this.gridResult.map(x => x.DC_ID);
                let args = { wipIds: ids };
                this.refreshGridData.emit(args);
            }
        }
    }
    showHelpTopic() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Deal+Editor+Features', '_blank');
    }
    displaydealType() {
        return this.curPricingTable.OBJ_SET_TYPE_CD.replace(/_/g, ' ');
    }
    initialization() {
        try {
            
            this.isDataLoading = true;
            this.setBusy("Loading Deals", "Gathering deals and security settings.", "Info", true);
            if (!this.in_Is_Tender_Dashboard) {// Contract Manage and Tender Manage have data of specific PS and PT
                this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
                this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
                this.isTenderContract = Tender_Util.tenderTableLoad(this.contractData);
            }
            else {//Tender Dashboard have all PS and PT deals, so added only common properties
                this.isTenderContract = true;
                this.curPricingStrategy = { IS_HYBRID_PRC_STRAT: 0 }
                this.curPricingTable = { OBJ_SET_TYPE_CD: this.in_Deal_Type }
            }
            this.getGroupsAndTemplates();
            this.dropdownResponses = this.getAllDrowdownValues();
            this.selectedTab = "Deal Info";
            this.filterColumnbyGroup(this.selectedTab);
            if (this.in_Search_Text && this.in_Search_Text != null && this.in_Search_Text != '') {
                this.searchFilter = this.in_Search_Text;
                this.state.filter = {
                    logic: "or",
                    filters: [
                        {
                            field: "DC_ID",
                            operator: "eq",
                            value: this.searchFilter
                        }
                    ],
                }
                this.gridData = process(this.gridResult, this.state);
            }
        }
        catch (ex) {
            this.loggerService.error('Something went wrong', 'Error');
            console.error('DEAL_EDITOR::ngOnInit::', ex);
        }
    }
    bidActionUpdated(event) {
        event['gridDS'] = this.gridResult;
        this.bidActionsUpdated.emit(event);
    }
    copyDeals() {
        this.tenderCopyDeals.emit(this.gridData.data);
    }
    executePctViaBtn() {
        this.isRunning = true;
        if (this.gridData.data.filter(x => x.isLinked == true).length > 0)
            this.runPCTMCT.emit(this.gridData.data.filter(x => x.isLinked == true));
        else
            this.isRunning = false;
    }
    sendEmail(){
       
        this.emailData.emit(this.gridData.data.filter(x => x.isLinked == true));
        
    }
    
    ngOnInit() {
        this.initialization();
    }
    ngOnChanges() {
        this.initialization();
    }
}

import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { DataStateChangeEvent, SelectAllCheckboxState, CellClickEvent, PageSizeItem, GridComponent} from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, distinct, FilterDescriptor, process, State } from "@progress/kendo-data-query";
import { managerExcludeGroupsService } from "./managerExcludeGroups.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { MatDialog } from '@angular/material/dialog';
import { excludeDealGroupModalDialog } from "./excludeDealGroupModal.component"
import { GridUtil } from "../grid.util"
import { OverlappingCheckComponent } from "../ptModals/overlappingCheckDeals/overlappingCheckDeals.component";
import { each, uniq } from 'underscore';
import { saveAs } from '@progress/kendo-file-saver';
import { Workbook } from '@progress/kendo-angular-excel-export';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
    selector: "manager-exclude-groups",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class managerExcludeGroupsComponent implements OnDestroy {
    spinnerMessageHeader: any;
    spinnerMessageDescription: any;
    msgType: any;
    isBusyShowFunFact: any;

    constructor(private loggerSvc: logger, private managerExcludeGrpSvc: managerExcludeGroupsService, private lnavSvc: lnavService, protected dialog: MatDialog) {

    }
    
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() groupTab: any;
    @Input() showPCT: boolean;
    @Input() WIP_ID: any;
    @Input() isTenderDashboard: boolean = false;//will recieve true when Group Exclusion Used in Tender Dashboard Screen
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    userRole = ""; canEmailIcon = true;
    dealCnt = 0;
    elGrid = null;
    grid = null;
    wrapEnabled = false;
    isPSExpanded = []; isPTExpanded = {};
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private usrRole;
    private isSuper = true;
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";
    private gridResult;
    private gridResultMaster = [];
    public pricingStrategyFilter;
    private loading = true;
    private loadMessage: string = "Loading Deals";
    dirty: boolean;
    pctFilterEnabled: boolean = false;
    public Ecap_Filter_Array: any = [];
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
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
        }
    ];
    public gridData: any;
    gridDataSet = {}; parentGridData = {};
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;

    getFormatedDim(dataItem, field, dim, format) {
        const item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
        if (format === "currency") {
            const isDataNumber = /^\d + $/.test(item[dim]);
            if (isDataNumber) return item[dim];
            return (item[dim].includes('No')) ? item[dim] : '$' + item[dim];
        }
        return item[dim];
    }

    loadExcludeGroups() {
        this.isLoading = true;
        this.managerExcludeGrpSvc.readWipExclusionFromContract(this.contractData.DC_ID).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
            this.loadMessage = 'Gathering Deals';
            this.dirty = false;
            if (this.isTenderDashboard)//Tender Dashboard Group Exclusion needs to display data of correponding deal ID not all
                this.gridResult = result.WIP_DEAL.filter(x => x.DC_ID == this.WIP_ID);
            else
                this.gridResult = result.WIP_DEAL

            //TWC3119-693/TWC3119-706 Remove the Cancelled/Lost deals
            this.gridResult = this.gridResult.filter(x => x.WF_STG_CD != 'Cancelled' && x.WF_STG_CD != 'Lost');

            for (let d = 0; d < this.gridResult.length; d++) {
                const item = this.gridResult[d];
                if (item["DEAL_GRP_EXCLDS"] === undefined || item["DEAL_GRP_EXCLDS"] === null) item["DEAL_GRP_EXCLDS"] = "";
                if (item["DEAL_GRP_CMNT"] === undefined || item["DEAL_GRP_CMNT"] === null) item["DEAL_GRP_CMNT"] = "";
                item["DSPL_WF_STG_CD"] = GridUtil.stgFullTitleChar(item);
                item["TITLE"] = item["TITLE"].replace(/,/g, ", ");
                if (item["ECAP_PRICE"] != undefined || item["ECAP_PRICE"] != null) {
                    this.Ecap_Filter_Array.push({ Text: item["ECAP_PRICE"]["20___0"], Value: item["ECAP_PRICE"]["20___0"] });
                }
            }
            this.Ecap_Filter_Array=uniq(this.Ecap_Filter_Array,'Value');
            this.gridResultMaster = this.gridResult;
            this.displayDealTypes();
            this.gridData = process(this.gridResult, this.state);
            if (this.showPCT) {
                this.pctFilterEnabled = true;
                this.togglePctFilter();
            }
            setTimeout(() => {
                this.isLoading = false;
            },500)
        }, (error) => {
            this.loggerSvc.error('Customer service', error);
            this.isLoading = false;
        });
    }

    filterChange(filter: any): void {
        this.gridData = process(this.gridResult, this.state);
        if (filter && filter.filters && filter.filters.length > 0) {
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                let arrayData = [];
                if (item && item.filters && item.filters.length > 0) {
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        let column = fltrItem.field.toString();
                        
                        each(this.gridResult, (eachData) => {
                            if (eachData[column] != undefined) {
                                let keys = Object.keys(eachData[column]);
                                let isexists = false;
                                each(keys, key => {
                                    if (fltrItem.value != undefined && fltrItem.value != null) {
                                        // 9999999999 is range value as per DB
                                        if (fltrItem.value != undefined && fltrItem.value != null && eachData[column]['20___0'] == fltrItem.value.toString()){
                                            fltrItem.operator = "isnotnull";
                                            isexists = true;
                                        }
                                    }
                                })
                                if (isexists)
                                    arrayData.push(eachData);
                            }
                        })
                        if (arrayData.length > 0) {
                            this.gridData = process(arrayData, this.state);
                        }
                    })
                }
            });
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "DEAL_GRP_EXCLDS") {
            this.openExcludeDealGroupModal(args.dataItem);
        }
    }

    openExcludeDealGroupModal(dataItem) {
        const dialogRef = this.dialog.open(excludeDealGroupModalDialog, {
            width: "1900px",
            height: "615px",
            panelClass: "excl-DG-modal",
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null && returnVal.length > 0) {
                this.updateModalDataItem(dataItem, "DEAL_GRP_CMNT", returnVal[0].DEAL_GRP_CMNT);
                this.updateModalDataItem(dataItem, "DEAL_GRP_EXCLDS", returnVal[0].DEAL_GRP_EXCLDS);
            }
        });
    }

    updateModalDataItem(dataItem, field, returnValue) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            dataItem[field] = returnValue;
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
            this.dirty = true;
        }
    }

    showHelpTopicGroup() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Contract-Manager-Tab.aspx', '_blank');
    }

    saveAndRunPct() {
        const dirtyRecords = this.gridResult.filter(x => x._dirty == true);
        /*TWC3167-9503 : Deleting newly added cnsmptn column values for parent dealID from dirtyRecords to keep the payload same as before for updateWipDeals API before saving the excluding deals*/
        for (let i = 0; i < dirtyRecords.length; i++) {
            delete dirtyRecords[i].PAYOUT_BASED_ON;
            delete dirtyRecords[i].REBATE_BILLING_START;
            delete dirtyRecords[i].REBATE_BILLING_END;
            delete dirtyRecords[i].CONSUMPTION_LOOKBACK_PERIOD;
            delete dirtyRecords[i].CONSUMPTION_TYPE;
            delete dirtyRecords[i].CONSUMPTION_REASON;
            delete dirtyRecords[i].CONSUMPTION_REASON_CMNT;
            delete dirtyRecords[i].CONSUMPTION_CUST_SEGMENT;
            delete dirtyRecords[i].CONSUMPTION_CUST_RPT_GEO;
            delete dirtyRecords[i].SYS_PRICE_POINT;
            delete dirtyRecords[i].QLTR_PROJECT;
        }
        if (dirtyRecords.length != 0) {
            this.isLoading = true;
            this.managerExcludeGrpSvc.updateWipDeals(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, dirtyRecords).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
                this.gridResult = result;
                this.gridData = process(this.gridResult, this.state);
                this.managerExcludeGrpSvc.runPctContract(this.contractData.DC_ID).pipe(takeUntil(this.destroy$)).subscribe((res) => {
                    this.loadExcludeGroups();
                }, (err) => {
                    this.loggerSvc.error('Could not run Cost Test in Exclude Groups for contract', err);
                    this.isLoading = false;
                });
            }, (error) => {
                this.loggerSvc.error('Could not update exclude deals', error);
                this.isLoading = false;
            });
        }
    }
    togglePctFilter() {
        if (this.pctFilterEnabled) {

            const filters = Array.from(new Set(this.gridData.data.map(i => i.COST_TEST_RESULT)))
                .map(i => { return { field: "COST_TEST_RESULT", operator: "eq", value: i} });

            this.state.filter = {
                    logic: "and",
                    filters: [{
                        filters: filters,
                        logic: "or"
                    }
                    ]
                };
        } else {
            this.state.filter = {
                logic: "and",
                filters: [],
            };
        }
        this.pctFilterEnabled = !this.pctFilterEnabled;
        this.gridData = process(this.gridResult, this.state);
    }
    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    exportToExcel(grid: GridComponent) {
        let colWidths: any[] = [];
        var rows = [{ cells: [] }];
        grid.columns.forEach(item => {
            if (item.hidden)
                item.hidden = false;
            rows[0].cells.push({
                value: item.title,
                textAlign: "center",
                background: "#0071C5",
                color: "#ffffff",
                wrap: true
            });
            if (item.width !== undefined) {
                colWidths.push({ width: item.width });
            } else {
                colWidths.push({ autoWidth: true });
            }
        });
        this.generateExcel(grid, rows, colWidths, true);
    }
    exportToExcelCustomColumns(grid: GridComponent) {
        let colWidths: any[] = [];
        var rows = [{ cells: [] }];
        grid.columns.forEach(item => {
            if (item.hidden && item.title == "Notes")
                item.hidden = false;
            rows[0].cells.push({
                value: item.title,
                textAlign: "center",
                background: "#0071C5",
                color: "#ffffff",
                wrap: true
            });

            if (item.width !== undefined) {
                colWidths.push({ width: item.width });
            } else {
                colWidths.push({ autoWidth: true });
            }

        });
        this.generateExcel(grid, rows, colWidths);
    }

    generateExcel(grid: GridComponent, rows: any, colWidths: any[], exportAll: boolean = false) {
        this.savePagerState();
        let cells: any[] = [];
        grid.data = exportAll ? this.gridResult : JSON.parse(JSON.stringify(this.gridData.data));
        each(grid.data, (dataItem) => {
            cells = [];
            dataItem['ECAP_PRICE'] = this.getFormatedDim(dataItem, 'ECAP_PRICE', '20___0', 'currency');
            dataItem['MAX_RPU'] = this.getFormatedDim(dataItem, 'MAX_RPU', '20___0', 'currency');
            dataItem['START_DT'] = new Date(dataItem['START_DT']).toString();
            dataItem['END_DT'] = new Date(dataItem['END_DT']).toString();
            grid.columns.forEach((item: any) => {
                let val = dataItem[item.field] == undefined ? "" : dataItem[item.field];
                cells.push({
                    value: val,
                    wrap: true
                });
            });
            rows.push({
                cells: cells
            });
        });
        this.restorePagerState(this.state);
        // sheets
        var sheets = [
            {
                columns: colWidths,
                title: "PCT",
                frozenRows: 1,
                rows: rows
            }
        ];
        var workbook = new Workbook({
            sheets: sheets
        });
        workbook.toDataURL().then((dataUrl: string) => {
            saveAs(dataUrl, 'MyDealsSearchResults.xlsx');
        });
    }

    openOverlapDealCheck() {
        const DATA = {
            contractData: this.contractData,
            currPt: this.contractData,
        }

        const DIALOG_REF = this.dialog.open(OverlappingCheckComponent, {
            data: DATA,
            panelClass: 'manageExclGroupOvrLap',
            disableClose: true
        });

        DIALOG_REF.afterClosed().subscribe(result => { 
            //
        });
    }

    toggleWrap() {
        var getToggle = $(".grids-manager-table td");
        this.wrapEnabled = !this.wrapEnabled;
        var newVal = this.wrapEnabled ? "normal" : "nowrap";
        getToggle.css('white-space', newVal);
    }
    displayDealTypes() {
        let data = this.gridResult;
        let modDealTypes = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].OBJ_SET_TYPE_CD) {
                let deal = data[i].OBJ_SET_TYPE_CD;
                modDealTypes.push(deal.replace(/_/g, ' '));
            }
        }
        let dealsTypesArray = Array.from(new Set(modDealTypes));
        this.dealCnt = modDealTypes.length;
        return modDealTypes.length > 0 ? this.dealCnt + " " + dealsTypesArray.join() + (this.dealCnt === 1 ? " Deal" : " Deals") : "";
    }
    onTabSelect(e) {
        e.preventDefault();
        if (e.title == 'Price Cost Test')
            this.loadModel('pctDiv')
    }
    loadModel(model: string) {
        const contractId_Map: contractIds = {
            Model: model,
            ps_id: 0,
            pt_id: 0,
            ps_index: 0,
            pt_index: 0,
            C_ID: this.contractData.DC_ID,
            contractData: this.contractData
        };
        this.modelChange.emit(contractId_Map);
    }
    GridSearch() {
        if (this.titleFilter.length > 2) {
            this.gridResult = this.gridResultMaster.filter(s => s.DC_ID == this.titleFilter);
            this.gridData = process(this.gridResult, this.state);
        }
        else {

            this.gridResult = this.gridResultMaster;
            this.gridData = process(this.gridResult, this.state);
        }
    }
    savePagerState() {
        return {
            skip: this.state.skip,
            take: this.state.take
        };
    }
    restorePagerState(state) {
        this.state.skip = state.skip;
        this.state.take = state.take;
        this.gridData = process(this.gridResult, this.state);
    }
    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.loadExcludeGroups();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
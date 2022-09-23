import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { allDealsService } from "./allDeals.service";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { lnavService } from "../lnav/lnav.service";
import { excludeDealGroupModalDialog } from "../managerExcludeGroups/excludeDealGroupModal.component";
import { MatDialog } from "@angular/material/dialog";
import { GridUtil } from "../grid.util";
import { OverlappingCheckComponent } from "../ptModals/overlappingCheckDeals/overlappingCheckDeals.component";
import { dealProductsModalComponent } from "../ptModals/dealProductsModal/dealProductsModal.component";


@Component({
    selector: "all-deals",
    templateUrl :"Client/src/app/contract/allDeals/allDeals.component.html",
    styleUrls: ["Client/src/app/contract/allDeals/allDeals.component.css"]
})

export class allDealsComponent {
    allColumns: any[];
    constructor(private allDealsSvc: allDealsService, private loggerSvc: logger, private lnavSvc: lnavService, protected dialog: MatDialog) {
        this.allData = this.allData.bind(this);
        //pls dont remove this even it its not as part of the route this is to handle condtions when we traverse between contract details with in manage tab
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    dealCnt = 0;
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail

    private isLoading = true;
    private spinnerMessageHeader: string = "Loading Deals";
    private isTenderContract = false;
    public groups: any =[];
    public selectedTab: any;
    public columns: any = [];
    private wipTemplate: any = {};
    private curPricingStrategy: any = {};
    public templates: any;
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    public exportFileName: string;
    private color: ThemePalette = 'primary';
    private curPricingTable: any = {};
    wrapEnabled = false;
    public dealTypes: any = [
        { dealType: "ECAP", name: "ECAP" },
        { dealType: "FLEX", name: "FLEX" },
        { dealType: "VOL_TIER", name: "Volume Tier" },
        { dealType: "REV_TIER", name: "Rev Tier" },
        { dealType: "DENSITY", name: "Density Based" },
        { dealType: "KIT", name: "Kit" },
        { dealType: "PROGRAM", name: "Program" }
    ];
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
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
    private excelColumns = {
        "OBJ_SID": "Deal Id",
        "HIER_VAL_NM": "Product",
        "CAP": "CAP-YCP1",
        "PRD_COST": "Cost",
        "DEAL_PRD_TYPE": "Product Type",
        "PRD_CAT_NM": "Vertical",
        "BRND_NM": "Brand",
        "FMLY_NM": "Family",
        "PCSR_NBR": "Processor",
        "MTRL_ID": "Material Id",
        "MM_MEDIA_CD": "Media Code",
        "PRD_STRT_DTM": "Prod Start Date",
        "PRD_END_DTM": "Prod End Date",
        "YCS2": "YCS2",
        "CPU_CACHE": "CPU Cache",
        "CPU_PACKAGE": "CPU Package",
        "CPU_PROCESSOR_NUMBER": "CPU Processor",
        "CPU_VOLTAGE_SEGMENT": "CPU Voltage",
        "CPU_WATTAGE": "CPU Wattage",
    }
    
    public headerCellOptions = {
        textAlign: "center",
        background: "#0071C5",
        color: "#ffffff",
        wrap: true
    };
    public cellOptions = {
        textAlign: "left",
        wrap: true
    };


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
    onTabSelect(e: SelectEvent) {
        e.preventDefault();
        this.selectedTab = e.title;
        let group = this.groups.filter(x => x.name == this.selectedTab);
        if (group[0].isTabHidden) {
            let tabs = this.groups.filter(x => x.isTabHidden === false);
            this.selectedTab = tabs[0].name;
            this.filterColumnbyGroup(this.selectedTab);
        }
        else
            this.filterColumnbyGroup(this.selectedTab);
    }
    getCustomerName(dataItem){
        let value =''
        if(dataItem?.Customer?.CUST_NM){
            value = dataItem.Customer.CUST_NM;
        }
        return value;
    }
    getStageValue(dataItem){
        let value = '';
        if(dataItem?.PS_WF_STG_CD){
            value =dataItem.PS_WF_STG_CD;
        }
        return value;
    }
    displayDealTypes() {
        let data = this.gridResult;
        let modDealTypes = [];
        for (let i = 0; i < data.length; i++) {            
            let deal= data[i].OBJ_SET_TYPE_CD;
            modDealTypes.push(deal.replace(/_/g, ' '));
            
        }
        let dealsTypesArray = Array.from(new Set(modDealTypes));
        this.dealCnt = modDealTypes.length;
        return modDealTypes.length > 0 ? this.dealCnt + " " + dealsTypesArray.join() + (this.dealCnt === 1 ? " Deal" : " Deals") : "";
    }
    
    loadAllDealsData() {
        let data: any;
        const cId = this.contractData.DC_ID;
        this.allDealsSvc.readWipFromContract(cId).subscribe((result: any) => {
            this.isLoading = false;
            this.gridResult = result.WIP_DEAL;
            data = result.WIP_DEAL;
            this.displayDealTypes();
            this.loadDealTypestab(data);
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('All Deals service', error);
        });

    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }
    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Sheet 1";
    }
    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;
        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };
        return result;
    }
    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    filterColumnbyGroup(groupName: string) {
        let group = this.groups.filter(x => x.name == groupName);
        let show = [
            "DC_ID", "PASSED_VALIDATION", "CUST_MBR_SID", "TRKR_NBR", "START_DT", "END_DT", "OBJ_SET_TYPE_CD",
            "WF_STG_CD", "PRODUCT_CATEGORIES", "TITLE", "DEAL_COMB_TYPE", "DEAL_DESC", "TIER_NBR", "ECAP_PRICE",
            "KIT_ECAP", "VOLUME", "CONSUMPTION_REASON", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "MRKT_SEG", "GEO_COMBINED",
            "REBATE_TYPE", "TERMS", "TOTAL_DOLLAR_AMOUNT", "NOTES"
        ];
        this.columns = [];
        this.allColumns =[];
        if (group.length > 0) {
            this.wipTemplate = this.UItemplate.ModelTemplates.WIP_DEAL[group[0].dealType];
                       for (let i = 0; i < this.wipTemplate.columns.length; i++) {
                            if(this.wipTemplate.columns[i].hidden === false){
                                if((this.wipTemplate.columns[i].field !='details') && (this.wipTemplate.columns[i].field != 'tools') && (this.wipTemplate.columns[i].field !="MISSING_CAP_COST_INFO") && (this.wipTemplate.columns[i].field !="LAST_REDEAL_DT")){
                                    this.allColumns.push(this.wipTemplate.columns[i]);
                                }
                            }
                        }
        }
        if(group[0].name != 'All'){
            for (let i = 0; i < this.allColumns.length; i++) {
                if(show.indexOf(this.allColumns[i].field) > -1){
                    if((group[0].name == "Kit") && (this.allColumns[i].field !== "TITLE")){
                        this.columns.push(this.allColumns[i]);
                    } else {
                        this.columns.push(this.allColumns[i]);
                    }
                }
            }
        } else {
            this.columns= this.allColumns;
        }
        this.columns.push({
            bypassExport:false,
            field:"NOTES",
            hidden: false,
            template:'',
            filterable:true,
            sortable:true,
            title:"Notes",
            width:150
        });
    }
    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "TITLE") {
            this.openDealProductModal(args.dataItem);
        }
    }
    openDealProductModal(dataItem) {
        const dialogRef = this.dialog.open(dealProductsModalComponent, {
            width: "1000px",
            data: {
                dataItem: dataItem
            }
        });
    }
    showHelpTopicGroup(helpTopic) {
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }
    exportToExcel() {
        GridUtil.dsToExcel(this.wipTemplate.columns, this.gridResult, "All Deals Export");
    }
    exportToExcelCustomColumns() {
        GridUtil.dsToExcel(this.columns, this.gridResult, "All Deals Export");
    }
    openOverlappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.contractData,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            height: '530px',
            width: '800px',
            data: data,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    
    toggleWrap() {

    }
    loadDealTypestab(data){
        for (let i = 0; i < data.length; i++) {
                let deal= data[i].OBJ_SET_TYPE_CD;
                this.dealTypes.forEach((element, index) => {
                    if((element.dealType === deal) && ((this.groups.indexOf(element) === -1))){
                        this.groups.push(element);
                    }
                  })
        }
        this.groups.push({ dealType:'ALL_TYPES', name: "All" })
        this.selectedTab =this.groups[0].name;
        this.filterColumnbyGroup(this.selectedTab);
    }
    ngOnInit() {
        this.loadAllDealsData();
    }

}

angular.module("app").directive(
    "allDeals",
    downgradeComponent({
        component: allDealsComponent,
    })
);

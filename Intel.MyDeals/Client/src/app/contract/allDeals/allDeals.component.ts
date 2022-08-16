import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { allDealsService } from "./allDeals.service";
import { PTE_Load_Util } from "../PTEUtils/PTE_Load_util";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { PTE_Common_Util } from "../PTEUtils/PTE_Common_util";
import { Tender_Util } from "../PTEUtils/Tender_util";




@Component({
    selector: "all-deals",
    templateUrl :"Client/src/app/contract/allDeals/allDeals.component.html",
    styleUrls: ["Client/src/app/contract/allDeals/allDeals.component.css"]
})

export class allDealsComponent {
    in_Ps_Id: any;
    in_Pt_Id: any;
    constructor(private allDealsSvc: allDealsService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    dealCnt = 0;

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
    public dealTypes = [
        { dealType: "ECAP", name: "ECAP" },
        { dealType: "FLEX", name: "FLEX" },
        { dealType: "VOL_TIER", name: "Volume Tier" },
        { dealType: "REV_TIER", name: "Rev Tier" },
        { dealType: "DENSITY", name: "Density Based" },
        { dealType: "KIT", name: "Kit" },
        { dealType: "PROGRAM", name: "Program" }
    ];
    private currentDealTypesArray = [];
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
            // this.filterColumnbyGroup(this.selectedTab);
        }
        // else
            // this.filterColumnbyGroup(this.selectedTab);
    }
    displayDealTypes() {
        let data = this.gridResult;
        let modDealTypes = [];
        for (let i = 0; i < data.length; i++) {
            // if(data[i].OBJ_SET_TYPE_CD){
                let deal= data[i].OBJ_SET_TYPE_CD;
                modDealTypes.push(deal.replace(/_/g, ' '));
            // }
        }
        let dealsTypesArray = Array.from(new Set(modDealTypes));
        this.dealCnt = modDealTypes.length;
        return modDealTypes.length > 0 ? this.dealCnt + " " + dealsTypesArray.join() + (this.dealCnt === 1 ? " Deal" : " Deals") : "";
    }
    
    loadAllDealsData() {
        let cId = this.contractData.DC_ID;
        this.allDealsSvc.readWipFromContract(cId).subscribe((result: any) => {
            this.isLoading = false;
            this.gridResult = result.WIP_DEAL;
            this.displayDealTypes();
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
    ngOnInit() {
        // this.exportFileName = "Contract " + String(this.contractData.DC_ID) + " Missing CAP/Cost Products.xlsx";
        this.loadAllDealsData();
        // this.selectedTab = this.dealTypes[0].name;
    }

}

angular.module("app").directive(
    "allDeals",
    downgradeComponent({
        component: allDealsComponent,
    })
);

import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { missingCAPService } from "./missingCAP.service";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: "missing-cap",
    templateUrl :"Client/src/app/contract/missingCAP/missingCAP.component.html",
    styleUrls: ["Client/src/app/contract/missingCAP/missingCAP.component.css"]
})

export class missingCAPComponent {
    constructor(private missingCapSvc: missingCAPService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    private isLoading = true;
    private loadMessage = "Loading Missing CAP/Cost Deal Products";
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    public exportFileName: string;
    private color: ThemePalette = 'primary';
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

    loadDealProducts() {
        const sId = this.contractData.CUST_MBR_SID;
        const cId = this.contractData.DC_ID;
        this.missingCapSvc.getDealProducts(cId,sId).subscribe((result: Array<any>) => {
            this.loadMessage = "Done";
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
            setTimeout(()=>{
                this.isLoading = false;
            }, 500);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('Missing CAP/Cost service', error);
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

    ngOnInit() {
        this.exportFileName = "Contract " + String(this.contractData.DC_ID) + " Missing CAP/Cost Products.xlsx";
        this.loadDealProducts();
    }

}

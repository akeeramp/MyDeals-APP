import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject, OnDestroy } from "@angular/core";
import { GridDataResult, DataStateChangeEvent} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { dealToolsService } from "../dealTools/dealTools.service";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { MomentService } from "../../../shared/moment/moment.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "deal-timeline-modal",
    templateUrl: "Client/src/app/core/gridCell/dealTimelineModal/dealTimelineModal.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealTimelineModal/dealTimelineModal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealTimelineComponent implements OnDestroy {
    constructor(private dealToolsSvc: dealToolsService,
                private loggerSvc: logger,
                public dialogRef: MatDialogRef<dealTimelineComponent>,
                @Inject(MAT_DIALOG_DATA) public data,
                private momentService: MomentService) {
        this.allData = this.allData.bind(this);
    }
    private dcId = this.data.item.objSid;
    private loading = true;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    public isTextIncrease = true;
    public isTextFontTitle = "Click to Decrease Text";
    public isExpand = true;
    public isExpandTitle = "Click to Enable dragging";
    private gridResult = [];
    private gridData: GridDataResult;
    private excelColumns = {
        "ATRB_VAL": "Comment Detail",
        "user": "Changed By",
        "HIST_EFF_FR_DTM":"Date Changed"
    }
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    loadTimeline() {
        this.dealToolsSvc.getTimlelineDs(this.data.item).pipe(takeUntil(this.destroy$)).subscribe(response => {
            for (let d = 0; d < response.length; d++) {
                response[d]["user"] = response[d]["FRST_NM"] + " " + response[d]["LST_NM"] + " (" + response[d]["USR_ROLES"] + ") (" + response[d]["CHG_EMP_WWID"] + ")";
                response[d]["ATRB_VAL"] = response[d]["ATRB_VAL"].replace(/; /g, '<br/>');
                let regex1 = /Created Deals:/gi;
                response[d]["ATRB_VAL"] = response[d]["ATRB_VAL"].replace(regex1, 'Created Deal(s) for product:');
                response[d]["HIST_EFF_FR_DTM"] = this.momentService.moment(response[d]["HIST_EFF_FR_DTM"]).format("MM/DD/YYYY hh:mm A");
            }
            this.gridResult = response;
            this.gridData = process(this.gridResult, this.state);
            this.loading = false;
        }, (error) => {
            this.loggerSvc.error("Unable to load the Deal Timeline Data", error);
        });
    }
    close() {
        this.dialogRef.close();
    }
    returnZero() {
        return 0
    }
    public cellOptions = {
        width:"auto",
        wrap: false
    };
    public headerCellOptions = {
        textAlign: "center",
        background: "#0071C5",
        color: "#ffffff",
        wrap: true
    };
    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Deal " + this.data.dataItem.DC_ID + " Timeline Export.xlsx";
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
    isExpandable() {
        if (this.isExpand) {
            this.isExpand = false;
            this.isExpandTitle = "Click me to Disable dragging";
        }
        else {
            this.isExpand = true;
            this.isExpandTitle = "Click me to Enable dragging";
        }
    }
    isFontSizeChange() {
        if (this.isTextIncrease) {
            this.isTextIncrease = false;
            this.isTextFontTitle = "Click me to Increase Text size";
        }
        else {
            this.isTextIncrease = true;
            this.isTextFontTitle = "Click me to Decrease Text size"
        }
    }
    ngOnInit() {
        this.loadTimeline();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
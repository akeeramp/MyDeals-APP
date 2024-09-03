import { Component, ViewEncapsulation, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { logger } from "../../shared/logger/logger";
import { Subject } from "rxjs";
import { DataStateChangeEvent, GridDataResult, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { sdmService } from "../sdm.service";
import { GridUtil } from "../../contract/grid.util";
import { MomentService } from "../../shared/moment/moment.service";


@Component({
    selector: "sdm-master-data-modal",
    templateUrl: "Client/src/app/sdm/sdmMasterDataModal/sdmMasterDataModal.component.html",
    styleUrls: ["Client/src/app/sdm/sdmMasterDataModal/sdmMasterDataModal.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class SdmMasterDataModalComponent implements OnInit, OnDestroy {
    constructor(private loggerSvc: logger,
                private sdmService : sdmService,
                private momentService: MomentService,
                public dialogRef: MatDialogRef<SdmMasterDataModalComponent>) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    private readonly destroy$ = new Subject();
    private isLoading = true;
    public filter = {
        "PRD_CAT_NM": [],
        "PCSR_NBR" : []
    };
    public slctedData = {
        "CYCLE_NM": undefined,
        "CPU_VRT_NM": undefined,
        "CPU_PROCESSOR_NUMBER": undefined,
        "CPU_SKU_NM": undefined,
        "STRT_DT": undefined,
        "END_DT": undefined
    }
    private gridResult : Array<any> = [];
    private gridData: GridDataResult;
    private totalRecs : number;
    private whereStgFilter = "all";
    private state: State = {
        skip: 0,
        take: 25
    };
    private pageSizes: PageSizeItem[] = [
        {
          text: "10",
          value: 10,
        },
        {
          text: "25",
          value: 25,
        },
        {
          text: "50",
          value: 50,
        },
        {
          text: "100",
          value: 100,
        },
    ];
    
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.loadSdmMasterData(this.whereStgFilter, true);
    }

    loadSdmMasterData(whereStg, pageChange = false, exportFlg=false) {
        //Api to get sdm master data
        this.isLoading = true;
        const data = {
            take: exportFlg ? this.totalRecs : this.state.take,
            skip: exportFlg? 0 : this.state.skip,
            whereStg: whereStg,
            pageChange: pageChange
        }
        this.sdmService.getSdmMstrData(data).subscribe((result: any) => {
            if (exportFlg) {
                const responseData = result.Data;
                const timestamp = this.sdmService.getFormattedTimestamp();
                const fileName = `RPD_Mstr_Data_${timestamp}.xlsx`;
                GridUtil.dsToExcelSdm(responseData, 'RPD_Master', fileName);
                this.isLoading = false;
            }
            else {
                this.gridResult = result.Data;
                this.totalRecs = !pageChange ? result.TotalCount : this.totalRecs;
                const newState = {
                    take: this.state.take,
                    skip: 0
                }
                const data = process(this.gridResult, newState);
                this.gridData = {
                    data: data.data,
                    total: this.totalRecs
                };
                this.isLoading = false;
            }
            
        },
        (err) => {
            this.loggerSvc.error("Unable to get Retail Pull Dollar Master Lookup Data", err, err.statusText);
        });
    }

    gridFilter() {
        let whereStg = 'WHERE ';
        Object.keys(this.slctedData).forEach(key => {
            if (key == 'STRT_DT') {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + "PRODUCT_ACTIVATION_DATE >= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'" : whereStg + " AND " + "PRODUCT_ACTIVATION_DATE >= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'"
            } else if (key == 'END_DT') {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + "PRODUCT_ACTIVATION_DATE <= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'" : whereStg + " AND " + "PRODUCT_ACTIVATION_DATE <= '" + this.momentService.moment(this.slctedData[key]).format("MM/DD/YYYY") + "'"
            } else {
                if (this.slctedData[key])
                    whereStg = whereStg == 'WHERE ' ? whereStg + key + " = '" + this.slctedData[key] + "'" : whereStg + " AND " + key + " = '" + this.slctedData[key] + "'"
            }

        });
        whereStg = whereStg == 'WHERE ' ? 'all' : whereStg;

        this.whereStgFilter = whereStg;
        this.state.skip = 0;
        this.loadSdmMasterData(this.whereStgFilter);
    }

    getDropValues(filter: string, type: string) {
        if (filter && filter.length >= 2) {
            const data = {
                filter: filter,
                colNm: type,
                tblNm: 'dimTbl',
                addlFilter: '',
                addRow: false
            }
            this.sdmService.getSdmDropValues(data).subscribe(res => {
                this.filter[type] = res;
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

    public downloadExcel(): void {
        this.isLoading = true;        
        this.loadSdmMasterData(this.whereStgFilter, false, true);                            
    }

    ngOnInit(): void {
        this.loadSdmMasterData(this.whereStgFilter);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { dataQualityService } from "./admin.dataQuality.service";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'admin-dataquality',
    templateUrl: 'Client/src/app/admin/dataQuality/admin.dataQuality.component.html',
    styleUrls: ['Client/src/app/admin/dataQuality/admin.dataQuality.component.css']
})
export class admindataQualityComponent implements OnDestroy {
    constructor(private dataQualitySvc: dataQualityService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private isLoading = true;
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
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
            text: "All",
            value: "all"
        }
    ];

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
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

    loadDataQualityUseCases() {
        //Developer can see the Screen..
        this.dataQualitySvc.GetDataQualityUseCases().pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<any>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('Unable to get Data Quality UseCases', error);
        });   
    }

    //Run DQ
    runDQ(useCase) {
        this.loggerSvc.info('DQ Queued..', '');
        this.dataQualitySvc.RunDQ(useCase).pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loggerSvc.success("DQ Run completed");
        }, (error) => {
            this.loggerSvc.error('Unable to Run DQ', error.statusText);
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

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDataQualityUseCases();
    }

    ngOnInit() {
        this.loadDataQualityUseCases();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

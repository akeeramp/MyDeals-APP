import { dealTypesService } from "./admin.dealTypes.service";
import { Component,OnDestroy } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
    selector: "admin-deal-types",
    templateUrl: "Client/src/app/admin/dealTypes/admin.dealTypes.component.html",
    styleUrls: ['Client/src/app/admin/dealTypes/admin.dealTypes.component.css']
})
export class adminDealTypesComponent implements OnDestroy {
    constructor(private dealTypesSvc: dealTypesService) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private isLoading = true;
    private errorMsg = "";
    private dataSource;
    private gridOptions;
    private allowCustom = true;
    private color: ThemePalette = "primary";

    public gridResult = [];
    public type = "numeric";
    public info = true;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;

    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
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

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

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

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadDealTypes() {
        this.dealTypesSvc.getDealTypes().pipe(takeUntil(this.destroy$)).subscribe(
            (result: Array<any>) => {
                this.gridResult = result;
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Deal Types.",
                    response,
                    response.statusText
                );
            }
        );
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDealTypes()
    }

    ngOnInit() {
        this.loadDealTypes();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
import { logger } from "../../shared/logger/logger";
import { unifiedDealReconService } from "./admin.unifiedDealRecon.service";
import { Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { endCustomerRetailModalComponent } from "../../contract/ptModals/dealEditorModals/endCustomerRetailModal.component";
import { MatDialog } from '@angular/material/dialog';
import { bulkUnifyModalComponent } from "./admin.bulkUnifyModal.component";
import { retriggerUnifyModalComponent } from "./admin.retriggerUnifyModal.component";
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
    GridComponent,
    EditEvent,
    CancelEvent,
    SaveEvent
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct, 
    CompositeFilterDescriptor, 
    FilterDescriptor
} from "@progress/kendo-data-query";
import { sortBy, uniq, pluck, forEach } from 'underscore';
import { FormGroup, FormControl } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UnPrimeAtrbs, UnPrimeDeals } from "../PrimeCustomers/admin.primeCustomers.model";
import { reprocessUCDModalComponent } from "./admin.UCDReprocessModal.component";

import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { GridUtil } from "../../contract/grid.util";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";

@Component({
    selector: "admin-unified-dealrecon",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css']
})
export class adminUnifiedDealReconComponent implements PendingChangesGuard, OnDestroy {

    constructor(private unifiedDealReconSvc: unifiedDealReconService, private loggerSvc: logger, protected dialog: MatDialog) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isDirty = false;
    private isLoading = true;
    private gridResult: Array<UnPrimeDeals>;
    private gridData: GridDataResult;
    private gridAllResult: Array<UnPrimeDeals>;
    private gridAllData: GridDataResult;
    private unifiedDealExcel = ExcelColumnsConfig.unifiedDealExcel;
    public distinctUnPrimeCustDealNm: Array<any>;
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public isFormChange = false;
    private errorMsg: string[] = [];
    public editAccess = true;
    private retrigger = ((<any>window).isCustomerAdmin || (<any>window).usrRole == "SA" || (<any>window).isDeveloper) ? true : false;
    private reprocessucd = (<any>window).isDeveloper ? true: false;
    public uploadUnifiedData = (((<any>window).isBulkPriceAdmin && (<any>window).usrRole === 'SA') || (<any>window).usrRole == "SA" || (<any>window).isDeveloper) ? true : false;
    private isNew: boolean;
    public dataItems: any;
    public OBJ_SID: any;
    private isWarning = false;
    private message: any;

    public custData: Map<string, Array<string>> = new Map();
    private sortData = "";
    private filterData = "";
    private dataForFilter: object; 
    private totalCount = 0;
    private Mode="Details"

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
        }
    ];

    distinctPrimitive(fieldName: string): string[] {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    public filterChange(filter: CompositeFilterDescriptor): void {
        this.state.filter = filter;
        this.loadDealReconciliation();
    }

    filterLoad(fieldName: string) {
        
        this.dataForFilter = {
            InFilters: fieldName,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take,
            Mode: "List"
        };
                
        this.unifiedDealReconSvc.getUnmappedPrimeCustomerDealsByFilter(this.dataForFilter).subscribe(data => {
            let allValues = data.Items.map(val => {return val["value"]})
            let duplicateValueRemoved = allValues.filter((item, index) => allValues.indexOf(item) === index);
            this.custData.set(fieldName, duplicateValueRemoved)
        });
    }

    GetColumnFilterData(fieldName: string): any {
        return this.custData.has(fieldName)? this.custData.get(fieldName):[];
    }

    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `ORDER BY ${value.field} ${value.dir}` : `${this.sortData} , ${value.field} ${value.dir}`;
                }
            });
        }
        const filterExpression = FilterExpressBuilder.createSqlExpression(JSON.stringify(this.state.filter));
        this.filterData = filterExpression;
        if(filterExpression != "") {
            this.filterData = 'AND '+this.filterData
        }
        this.dataForFilter = {
            InFilters: this.filterData,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take,
            Mode: this.Mode
        };
    }

    sortChange(state) {
        this.state["sort"] = state;
        this.loadDealReconciliation();
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    loadDealReconciliation(): void {
        this.isLoading = true;
        //RA alone will have view access
        if ((<any>window).usrRole == "RA" && !(<any>window).isDeveloper) {
            this.editAccess = false;
        }
        this.settingFilter();
        this.unifiedDealReconSvc.getUnmappedPrimeCustomerDealsByFilter(this.dataForFilter).pipe(takeUntil(this.destroy$)).subscribe((result: Array<UnPrimeDeals>) => {
            this.isLoading = false;
            this.gridResult = result['Items'];
            this.gridData = process(result['Items'], this.state);
            this.gridData.data=result['Items'];
            if(result['Items'].length>0){
             this.gridData.total = result['TotalRows'];
             this.totalCount = result['TotalRows'];
            }
            
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('UnMappedPrimeCustomerDeal service', error);
        });
        
        
    }

    dataStateChange(state: DataStateChangeEvent): void {
        let isFilter = true
        if (state.filter && state.filter.filters && state.filter.filters.length > 0) { isFilter = false }
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.state.filter = state.filter != undefined ? state.filter : this.state.filter;
        this.state.sort = state.sort != undefined ? state.sort : this.state.sort;
        this.state.group = state.group != undefined ? state.group : this.state.group;
        if ((this.state.sort && this.state.sort.length > 0) || (this.state.group && this.state.group.length > 0)) {
            let sort = {
                take: 25,
                skip: 0,
                sort: this.state.sort,
                group: this.state.group
            }
            let data = process(this.gridData.data, sort);
            this.gridData.data = data.data;
            //this.gridData.total = this.totalCount;
        }
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    pageChange(state: DataStateChangeEvent) {
        this.isLoading = true;
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.loadDealReconciliation();
    }
    closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty = true;
        this.openEndCustomerModal(dataItem, sender, rowIndex)
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            CNTRCT_OBJ_SID: new FormControl(dataItem.CNTRCT_OBJ_SID),
            TITLE: new FormControl({ value: dataItem.TITLE, disabled: true }),
            OBJ_SID: new FormControl({ value: dataItem.OBJ_SID, disabled: true }),
            END_CUSTOMER_RETAIL: new FormControl({ value: dataItem.END_CUSTOMER_RETAIL, disabled: true }),
            END_CUSTOMER_COUNTRY: new FormControl({ value: dataItem.END_CUSTOMER_COUNTRY, disabled: true }),
            EMP_WWID: new FormControl(dataItem.EMP_WWID),
            UNIFIED_STATUS: new FormControl(dataItem.UNIFIED_STATUS),
            UNIFIED_REASON: new FormControl(dataItem.UNIFIED_REASON)
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    openEndCustomerModal(dataItem, sender, rowIndex): void {
        const dialogRef = this.dialog.open(endCustomerRetailModalComponent, {
            panelClass: "admin-end-customer",
            width: '1500px',
            autoFocus: false,
            data: {
                item: {
                    retailLookUpUrl: "/api/PrimeCustomers/GetPrimeCustomers",
                    countryLookUpUrl: "/api/PrimeCustomers/GetCountries",
                    colName: "END_CUSTOMER_RETAIL",
                    isAdmin: true,
                    clearEndCustomerDisabled: true,
                    dealId: dataItem.OBJ_SID
                },
                cellCurrValues: {
                    END_CUST_OBJ: dataItem.END_CUST_OBJ,
                    END_CUSTOMER_RETAIL: dataItem.END_CUSTOMER_RETAIL,
                    IS_PRIME: dataItem.IS_PRIMED_CUST,
                    PRIMED_CUST_CNTRY: dataItem.END_CUSTOMER_COUNTRY,
                    PRIMED_CUST_NM: dataItem.PRIMED_CUST_NM,
                    PRIMED_CUST_ID: dataItem.PRIMED_CUST_ID
                }
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((endCustomerData) => {
            if (endCustomerData) {
                this.isLoading = true;
                this.dataItems = {
                    "IS_PRIMED_CUST": endCustomerData.IS_PRIME,
                    "IS_RPL": endCustomerData.IS_RPL,
                    "PRIMED_CUST_NM": endCustomerData.PRIMED_CUST_NM,
                    "PRIMED_CUST_ID": endCustomerData.PRIMED_CUST_ID,
                    "PRIMED_CUST_CNTRY": endCustomerData.PRIMED_CUST_CNTRY,
                    "END_CUST_OBJ": endCustomerData.END_CUST_OBJ,
                    "END_CUSTOMER_RETAIL": endCustomerData.END_CUSTOMER_RETAIL
                }
                if (endCustomerData.IS_PRIME) {
                    sender.closeRow(rowIndex);
                    const cust_map = this.formGroup.getRawValue();
                    this.unifiedDealReconSvc.UpdateUnPrimeDeals(dataItem.OBJ_SID, this.dataItems).pipe(takeUntil(this.destroy$)).subscribe((response) => {
                        if (response) {
                            this.message = "Deal End Customer Unified successfully";
                        }
                        else {
                            sender.closeRow(rowIndex);
                            this.message = "Selected Customer is not a Unified Customer";
                        }
                        this.isLoading = false;
                        this.isWarning = true;
                        this.refreshGrid();
                        this.loggerSvc.success("Unified Deal Recon updated.");
                    }, (error) => {
                        this.isLoading = false;
                        sender.closeRow(rowIndex);
                        this.loggerSvc.error("Unable to Update UnUnified Deals.", error);
                    });
                } else {
                    sender.closeRow(rowIndex);
                    this.isLoading = false;
                    this.isWarning = true;
                    this.message = "Selected Customer is not a Unified Customer";
                }
                this.isLoading = false;
            }
        });
    }

    clearFilter(): void {
        this.state.skip = 0;
        this.state.take = 25;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
        this.loadDealReconciliation();
    }

    cancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.closeEditor(sender, rowIndex);
    }

    cancelWarning(): void {
        this.isWarning = false;
        this.message = "";
    }

    exportToExcel() {
        this.isLoading = true;
        let filter=this.dataForFilter["InFilters"];
        let excelDataForFilter = {
            InFilters: filter,
            Sort: "",
            Skip: 0,
            Take: this.totalCount,
            mode:this.Mode
        };
        this.unifiedDealReconSvc.getUnmappedPrimeCustomerDealsByFilter(excelDataForFilter).pipe(takeUntil(this.destroy$)).subscribe((result: Array<UnPrimeDeals>) => {
            this.isLoading = false;
            this.gridAllResult = result['Items'];
            GridUtil.dsToExcelUnifiedDealtData(this.unifiedDealExcel, this.gridAllResult, "MyDealsUnifiedRecon");
        }, (error) => {
            this.loggerSvc.error('UnMappedPrimeCustomerDeal service', error);
        });
    }

    exportToExcelCustomColumns() {
        GridUtil.dsToExcelUnifiedDealtData(this.unifiedDealExcel, this.gridResult, "MyDealsUnifiedRecon");
    }

    saveHandler({ sender, rowIndex, formGroup, dataItem }: SaveEvent): void {
        this.isLoading = true;
        const cust_map: UnPrimeDeals = formGroup.getRawValue();
        this.errorMsg = [];
        if (this.dataItems && this.dataItems.IS_PRIME) {
            this.unifiedDealReconSvc.UpdateUnPrimeDeals(dataItem.OBJ_SID, this.dataItems).pipe(takeUntil(this.destroy$)).subscribe(
                (response: boolean) => {
                    this.isDirty = false;
                    sender.closeRow(rowIndex);
                    this.refreshGrid();
                    this.loggerSvc.success("Unified Deal Recon updated.");
                },
                err => {
                    this.loggerSvc.error("Unable to update Unified Deal Recon.", err.statusText);
                    this.isLoading = false;
                }
            );
        }
        this.isLoading = false;
    }

    endCustSave(encustData: UnPrimeAtrbs, OBJ_SID: number): void {
        const cust_map: UnPrimeDeals = this.formGroup.getRawValue();
        this.unifiedDealReconSvc.UpdateUnPrimeDeals(OBJ_SID, encustData).pipe(takeUntil(this.destroy$)).subscribe(
            (response: boolean) => {
                if (response) {
                    this.message = "Deal End Customer Unified successfully";
                } else {
                    this.message = "Selected Customer is not a Unified Customer";
                }
                this.isWarning = true;
                this.gridResult[this.editedRowIndex] = cust_map;
                this.gridResult.push(cust_map);
                this.loadDealReconciliation();
                this.loggerSvc.success("Unified Deal Recon updated.");
            },
            err => {
                this.loggerSvc.error("Unable to update Unified Deal Recon.", err.statusText);
                this.isLoading = false;
            }
        );
    }

    OpenBulkUploadUnifyModal(): void {
        const dialogRef = this.dialog.open(bulkUnifyModalComponent, {
            height: 'auto',
            panelClass: 'unified-bulk-popup'

        });
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDealReconciliation();
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadDealReconciliation();
    }
    OpenRetriggerUnifyModal(): void {
        const dialogRef = this.dialog.open(retriggerUnifyModalComponent, {
            height: 'auto',
            panelClass: 'unified-bulk-popup'

        });
    }


    OpenUCDReprocessModal(): void {
        const dialogRef = this.dialog.open(reprocessUCDModalComponent, {
            height: 'auto',
            panelClass: 'unified-bulk-popup'
        });
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
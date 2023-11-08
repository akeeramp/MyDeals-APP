import { logger } from "../../shared/logger/logger";
import { unifiedDealReconService } from "./admin.unifiedDealRecon.service";
import { Component } from "@angular/core";
import { endCustomerRetailModalComponent } from "../../contract/ptModals/dealEditorModals/endCustomerRetailModal.component";
import { Unified_Deal_Recon } from "./admin.unifiedDealRecon.model";
import { MatDialog } from '@angular/material/dialog';
import { bulkUnifyModalComponent } from "./admin.bulkUnifyModal.component";
import { retriggerUnifyModalComponent } from "./admin.retriggerUnifyModal.component";
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";
import { FormGroup, FormControl } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: "admin-unified-dealrecon",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css']
})
export class adminUnifiedDealReconComponent {

    constructor(private unifiedDealReconSvc: unifiedDealReconService, private loggerSvc: logger, protected dialog: MatDialog) {
        this.allData = this.allData.bind(this);
    }

    private isLoading = true;
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    public distinctUnPrimeCustDealNm: Array<any>;
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public isFormChange = false;
    private errorMsg: string[] = [];
    private isCombExists = false;
    public editAccess = true;
    private retrigger = ((<any>window).isCustomerAdmin || (<any>window).usrRole == "SA" || (<any>window).isDeveloper) ? true : false;
    public uploadUnifiedData = (((<any>window).isBulkPriceAdmin && (<any>window).usrRole === 'SA') || (<any>window).usrRole == "SA" || (<any>window).isDeveloper) ? true: false;
    private isNew: boolean;
    public dataItems: any;
    public OBJ_SID: any;
    private isWarning = false;
    private message: any;
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
            text: "250",
            value: 250
        },
        {
            text: "All",
            value: "all"
        }
    ];

    distinctPrimitive(fieldName: string): any {
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

    loadDealReconciliation() {
        //RA alone will have view access
        if ((<any>window).usrRole == "RA" && !(<any>window).isDeveloper) {
            this.editAccess = false;
        }
            this.unifiedDealReconSvc.getUnmappedPrimeCustomerDeals().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.loggerSvc.error('UnMappedPrimeCustomerDeal service', error);
            });
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    editHandler({ sender, rowIndex, dataItem }) {
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
            UNIFIED_STATUS: new FormControl(dataItem.UNIFIED_STATUS)
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    openEndCustomerModal(dataItem, sender, rowIndex) {
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
        dialogRef.afterClosed().subscribe((endCustomerData) => {
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
                    const cust_map: Unified_Deal_Recon = this.formGroup.getRawValue();
                    this.unifiedDealReconSvc.UpdateUnPrimeDeals(dataItem.OBJ_SID, this.dataItems).subscribe((response) => {
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

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    cancelWarning() {
        this.isWarning = false;
        this.message = "";
    }

    saveHandler({ sender, rowIndex, formGroup, dataItem }) {
        this.isLoading = true;
        const cust_map: Unified_Deal_Recon = formGroup.getRawValue();
        this.errorMsg = [];
        if (this.dataItems && this.dataItems.IS_PRIME) {
            this.unifiedDealReconSvc.UpdateUnPrimeDeals(dataItem.OBJ_SID, this.dataItems).subscribe(
                (response) => {
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

    endCustSave(encustData, OBJ_SID) {
        const cust_map: Unified_Deal_Recon = this.formGroup.getRawValue();
        this.unifiedDealReconSvc.UpdateUnPrimeDeals(OBJ_SID, encustData).subscribe(
            (response) => {
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

    OpenBulkUploadUnifyModal() {
        const dialogRef = this.dialog.open(bulkUnifyModalComponent, {
            height: 'auto',
            panelClass: 'unified-bulk-popup'

        });
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDealReconciliation();
    }

    ngOnInit() {
        this.loadDealReconciliation();
    }
    OpenRetriggerUnifyModal() {
        const dialogRef = this.dialog.open(retriggerUnifyModalComponent, {
            height: 'auto',
            panelClass: 'unified-bulk-popup'

        });
    }

}
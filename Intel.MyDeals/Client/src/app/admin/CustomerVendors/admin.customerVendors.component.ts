import { logger } from "../../shared/logger/logger";
import { customerVendorService } from "./admin.customerVendors.service";
import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Cust_Dropdown_Map, Cust_Map, Vendor_Map } from "./admin.customerVendors.model";
import { ThemePalette } from "@angular/material/core";
import { sortBy, uniq, pluck, findWhere, indexOf } from 'underscore';
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
    AddEvent,
    EditEvent,
    CancelEvent,
    SaveEvent,
    GridComponent
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Observable, Subject } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "admin-vendors-customer",
    templateUrl: "Client/src/app/admin/CustomerVendors/admin.customerVendors.component.html",
    styleUrls: ['Client/src/app/admin/CustomerVendors/admin.customerVendors.component.css']
})
export class adminCustomerVendorsComponent implements PendingChangesGuard, OnDestroy {
    constructor(private customerVendSvc: customerVendorService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    @ViewChild("catDropDown") private catDdl;
    @ViewChild("custDropDown") private custDdl;
    @ViewChild("countDropDown") private countDdl;
    @ViewChild("partDropDown") private partDdl;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    private isLoading = true;
    private errorMsg = "";
    private isCombExists = false;
    /*private custsDataSource: any[] = [];
    private vendorsNamesinfo: any[] = [];
    private vendorsNamesId: any[] = [];
    private selectedCUST_MBR_SID = 1;
    private selectedVENDOR_SID = 0;
    private getCustomersData: any;
    private OnlyActv_ind_chg = true;
    private dataSource: any;
    private CustvendorsData: any;
    private customers: any;
    private vendorsNamesOptions: any;
    private vendorsIdsOptions: any;
    private gridOptions: any;
    private allowCustom = true;
    private color: ThemePalette = "primary";*/

    public gridResult: Array<Cust_Map>;
    public type = "numeric";
    public info = true;
    public distinctPartner: Array<string>;
    public distinctCust: Array<string>;
    public custData: Array<Cust_Dropdown_Map>;
    public distinctCountry: Array<string>;
    public distinctPartId: Array<number>;
    public vendorDetails: Array<Vendor_Map>;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    public virtual = { itemHeight: 28 };
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
        {
            text: "250",
            value: 250,
        },
        {
            text: "All",
            value: "all",
        }
    ];

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): Array<string> {
        if (fieldName == 'CUST_NM') {
            return sortBy(uniq(pluck(this.gridResult, fieldName)));
        } else if (fieldName == 'BUSNS_ORG_NM') {
            return sortBy(uniq(pluck(this.gridResult, fieldName)));
        }
        return uniq(pluck(this.gridResult, fieldName));
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

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }
    getCustomersDataSource(): void {
        this.customerVendSvc.getCustomerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<Cust_Dropdown_Map>) => {
                this.custData = response;
                this.distinctCust = distinct(response, "CUST_NM").map(
                    item => item.CUST_NM
                );
                this.isLoading = (this.vendorDetails && this.gridResult) ? false : true;
            }, function (response) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", response, response.statusText);
            });
    }

    getVendorsInfoDropdown(): void {
        this.customerVendSvc.getVendorsData().pipe(takeUntil(this.destroy$)).subscribe((response: Array<Vendor_Map>) => {
            this.vendorDetails = response;
            this.distinctPartner = sortBy(distinct(response, "BUSNS_ORG_NM").map(
                item => item.BUSNS_ORG_NM
            ));
            this.distinctPartId = distinct(response, 'VNDR_ID').map(
                item => item.VNDR_ID
            );
            this.isLoading = (this.custData && this.gridResult) ? false : true;
        }, function (response) {
            this.loggerSvc.error("Unable to get Dropdown vendors.", response, response.statusText);
        })
    }
    partnerIDChange(value: number): void {
        const selPart = findWhere(this.vendorDetails, { VNDR_ID: value });
        if (selPart) {
            this.formGroup.patchValue({
                BUSNS_ORG_NM: selPart.BUSNS_ORG_NM,
                CTRY_CD: selPart.CTRY_CD,
                CTRY_NM: selPart.CTRY_NM,
                VNDR_ID: selPart.VNDR_ID,
                DROP_DOWN: selPart.VNDR_ID
            });
        }
        else {
            this.loggerSvc.error("Something went wrong", "Vendor details not matching")
        }

    }
    partnerNMChange(value: string): void {
        const selPart = findWhere(this.vendorDetails, { BUSNS_ORG_NM: value });
        if (selPart) {
            this.formGroup.patchValue({
                BUSNS_ORG_NM: selPart.BUSNS_ORG_NM,
                CTRY_CD: selPart.CTRY_CD,
                CTRY_NM: selPart.CTRY_NM,
                VNDR_ID: selPart.VNDR_ID,
                DROP_DOWN: selPart.VNDR_ID
            });
        }
        else {
            this.loggerSvc.error("Something went wrong", "Vendor details not matching")
        }
    }

    loadCustomerVendors(): void {
        this.customerVendSvc.getCustomerVendors().pipe(takeUntil(this.destroy$)).subscribe(
            (result: Array<Cust_Map>) => {
                this.gridResult = result;
                this.distinctCountry = distinct(this.gridResult, "CTRY_CD").map(
                    item => item.CTRY_CD
                );
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = (this.vendorDetails && this.custData) ? false : true;
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Customer Vendors.",
                    response,
                    response.statusText
                );
            }
        );
        
    }

    IsValidCombination(model: Cust_Map, isNew: boolean): boolean {
        let retCond = false;
        const cond = this.gridResult.filter(
            x => x.BUSNS_ORG_NM.trim() === model.BUSNS_ORG_NM.trim() &&
                x.CUST_NM.trim() === model.CUST_NM.trim() &&
                x.DROP_DOWN.toString().trim() === model.DROP_DOWN.toString().trim() &&
                x.CTRY_CD.trim() === model.CTRY_CD.trim()
        );
        if (isNew && cond.length > 0) {
            this.errorMsg = "This Combination of Customer & Settlement Partner already exists.";
            retCond = true;
        } else if (!isNew && cond.length > 0) {
            if (cond.filter(x => x.ACTV_IND === model.ACTV_IND).length == 1) {
                this.errorMsg = "This Combination of Customer & Settlement Partner already exists.";
                retCond = true;
            } else if (cond.filter(x => x.ACTV_IND != model.ACTV_IND && x.ATRB_LKUP_SID != model.ATRB_LKUP_SID).length == 1) {
                this.errorMsg = "This Combination of Customer & Settlement Partner already exists.";
                retCond = true;
            }
        }
        else {
            if (indexOf(this.distinctPartner, model.BUSNS_ORG_NM) == -1) {
                this.errorMsg = "Please Select Valid Settlement Partner.";
                retCond = true;
            }
            if (this.gridResult.filter(x => x.CUST_MBR_SID === model.CUST_MBR_SID && x.DROP_DOWN === model.DROP_DOWN.toString()).length == 1 && model.ATRB_LKUP_SID == '') {
                this.errorMsg = "Please Select Valid Settlement Partner ID.";
                retCond = true;
            }
            if (indexOf(this.distinctCountry, model.CTRY_CD) == -1) {
                this.errorMsg = "Please Select Valid Country Code";
                retCond = true;
            }
            if (indexOf(this.distinctCust, model.CUST_NM) == -1) {
                this.errorMsg = "Please Select Valid Customer Name";
                retCond = true;
            }
        }
        return retCond;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }: AddEvent): void {
        this.isDirty=true;
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(true, Validators.required),
            ATRB_LKUP_DESC: new FormControl(),
            ATRB_LKUP_SID: new FormControl(),
            ATRB_SID: new FormControl(),
            BUSNS_ORG_NM: new FormControl("", Validators.required),
            CTRY_CD: new FormControl("", Validators.required),
            CTRY_NM: new FormControl(),
            CUST_MBR_SID: new FormControl(),
            CUST_NM: new FormControl("", Validators.required),
            DROP_DOWN: new FormControl(
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                ])
            ),
            OBJ_SET_TYPE_SID: new FormControl(0),
            VNDR_ID: new FormControl(0),
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty=true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
            ATRB_LKUP_DESC: new FormControl(dataItem.ATRB_LKUP_DESC),
            ATRB_LKUP_SID: new FormControl(dataItem.ATRB_LKUP_SID),
            ATRB_SID: new FormControl(dataItem.ATRB_SID),
            BUSNS_ORG_NM: new FormControl(dataItem.BUSNS_ORG_NM, Validators.required),
            CTRY_CD: new FormControl(dataItem.CTRY_CD, Validators.required),
            CTRY_NM: new FormControl(dataItem.CTRY_NM),
            CUST_MBR_SID: new FormControl(dataItem.CUST_MBR_SID),
            CUST_NM: new FormControl(dataItem.CUST_NM, Validators.required),
            DROP_DOWN: new FormControl(
                dataItem.DROP_DOWN,
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                ])
            ),
            OBJ_SET_TYPE_SID: new FormControl(dataItem.OBJ_SET_TYPE_SID),
            VNDR_ID: new FormControl(dataItem.VNDR_ID),
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    cancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.closeEditor(sender, rowIndex);
    }
    saveConfirmation(): void {
        this.isCombExists = false;
    }
    saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
        const cust_map: Cust_Map = formGroup.value;
        const filteredCust = this.custData.filter(x => x.CUST_NM === cust_map.CUST_NM);
        if (filteredCust.length > 0) {
            cust_map.CUST_MBR_SID = filteredCust[0].CUST_SID;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCombination(cust_map, isNew);
            if (!this.isCombExists) {
                this.isDirty=false;
                if (isNew) {
                    this.isLoading = true;
                    this.customerVendSvc.insertCustomerVendor(cust_map).pipe(takeUntil(this.destroy$)).subscribe(
                        () => {
                            this.gridResult.push(cust_map);
                            this.loadCustomerVendors();
                            this.loggerSvc.success("New Customer Vendor Added.");
                            /*sender.closeRow(rowIndex);*/
                        },
                        error => {
                            this.loggerSvc.error("Unable to insert customer vendor data.", error);
                            this.isLoading = false;
                        }
                    );
                } else {
                    this.isLoading = true;
                    this.customerVendSvc.updateCustomerVendor(cust_map).pipe(takeUntil(this.destroy$)).subscribe(
                        () => {
                            this.gridResult[rowIndex] = cust_map;
                            this.gridResult.push(cust_map);
                            this.loadCustomerVendors();
                            this.loggerSvc.success("Customer Vendor Updated.");
                            /*sender.closeRow(rowIndex);*/
                        },
                        error => {
                            this.loggerSvc.error("Unable to update customer vendor data.", error);
                            this.isLoading = false;
                        }
                    );
                }
            }
        }
        sender.closeRow(rowIndex);
    }
    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadCustomerVendors()
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }
    
    ngOnInit(): void {
        this.getCustomersDataSource();
        this.getVendorsInfoDropdown();
        this.loadCustomerVendors();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}

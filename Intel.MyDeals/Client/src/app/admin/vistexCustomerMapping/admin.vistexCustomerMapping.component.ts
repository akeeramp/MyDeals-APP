import { logger } from "../../shared/logger/logger";
import { vistexCustomerMappingService } from "./admin.vistexCustomerMapping.service";
import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Vistex_Cust_Map } from "./admin.vistexCustomerMapping.model";
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, GridComponent, CancelEvent, SaveEvent, EditEvent } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UiDropdownResponseItem } from "../dropdowns/admin.dropdowns.model";
import { Cust_Map } from "../CustomerVendors/admin.customerVendors.model";

@Component({
    selector: 'admin-vistex-customer-mapping',
    templateUrl: 'Client/src/app/admin/vistexCustomerMapping/admin.vistexCustomerMapping.component.html',
    styleUrls: ['Client/src/app/admin/vistexcustomermapping/admin.vistexCustomerMapping.component.css']
})
export class adminVistexCustomerMappingComponent implements PendingChangesGuard, OnDestroy {
    constructor(private customerMapSvc: vistexCustomerMappingService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    @ViewChild("profileDropDown") private profileDdl;
    @ViewChild("tenderDropDown") private tenderDdl;
    @ViewChild("nonTenderDropDown") private nonTenderDdl;
    @ViewChild("settleDropDown") private settleDdl;
    @ViewChild("custRptGeoDropDown") private custGeoDdl;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    private isLoading = true;
    private errorMsg: string[] = [];
    private isCombExists = false;
    private allowCustom = true;
    private color: ThemePalette = "primary";
    public gridResult: Vistex_Cust_Map[] = [];
    public type = "numeric";
    public info = true;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    public PeriodProfile: UiDropdownResponseItem[] = [];
    public ARSettlementLevel = [];
    public TenderARSettlementLevel = [];
    public ARSettlementLevelData = [];
    public TenderARSettlementLevelData = [];
    public SettlementPartner = [];
    public custRptGeo = [];
    public SettlementPartnerData = [];
    public PeriodProfileData = [];
    public SelectedConsumptionReportedGeos = "";

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
            value: "all"
        }
    ];

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): string[] {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state);
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

    InitiateDropDowns(formGroup: FormGroup): void {
        this.customerMapSvc.getDropdown('GetDropdowns/PERIOD_PROFILE')
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<UiDropdownResponseItem>) => {
                this.PeriodProfile = response;
                this.PeriodProfileData = response.filter(x => x.CUST_MBR_SID == formGroup.value.CUST_MBR_SID || x.CUST_MBR_SID == 1).map(item => item.DROP_DOWN);
            }, function (response) {
                this.loggerSvc.error("Unable to get period profile.", response, response.statusText);
            });
        this.customerMapSvc.getDropdown('GetDropdownsWithInactives/AR_SETTLEMENT_LVL')
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<UiDropdownResponseItem>) => {
                this.ARSettlementLevel = response.map(item => item.DROP_DOWN);
                this.TenderARSettlementLevel = response.filter(x => x.ACTV_IND == true).map(item => item.DROP_DOWN);
                this.ARSettlementLevelData = response;
                this.TenderARSettlementLevelData = response;
            }, function (response) {
                this.loggerSvc.error("Unable to get Settlement Levels.", response, response.statusText);
            });
        this.customerMapSvc.getVendorDropDown('GetCustomerVendors/0')
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<Cust_Map>) => {
                this.SettlementPartnerData = response.filter(x => x.CUST_MBR_SID == formGroup.value.CUST_MBR_SID && x.ACTV_IND == true);
                this.SettlementPartner = distinct(this.SettlementPartnerData, "BUSNS_ORG_NM").map(
                    item => (item.BUSNS_ORG_NM + " - " + item.VNDR_ID));
            }, function (response) {
                this.loggerSvc.error("Unable to get Settlement Partner list.", response, response.statusText);
            });
    }

    loadCustomerMapping(): void {
        this.isLoading = true;
        this.customerMapSvc.getVistexCustomersMapList().pipe(takeUntil(this.destroy$)).subscribe((result: Array<Vistex_Cust_Map>) => {
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        }, (error) => {
            this.loggerSvc.error("Unable to get Customers.", error, error.statusText);
        });
    }

    IsValidCustomerMapping(model: Vistex_Cust_Map): boolean {
        let retCond = false;

        if (model.VISTEX_CUST_FLAG && (model.DFLT_PERD_PRFL == null || model.DFLT_PERD_PRFL == '')) {
            this.errorMsg.push("Default value of Period Profile cannot be empty for Vistex customer!");
            retCond = true;
        }
        if (model.DFLT_PERD_PRFL != null && model.DFLT_PERD_PRFL != '' && this.PeriodProfile.filter(x => x.DROP_DOWN === model.DFLT_PERD_PRFL).length == 0) {
            this.errorMsg.push("Please select a valid Period Profile");
            retCond = true;
        }
        if (model.DFLT_AR_SETL_LVL != null && model.DFLT_AR_SETL_LVL != '' && this.ARSettlementLevelData.filter(x => x.DROP_DOWN === model.DFLT_AR_SETL_LVL).length == 0) {
            this.errorMsg.push("Please select a valid Non-Tenders Settlement Level");
            retCond = true;
        }
        if (model.DFLT_TNDR_AR_SETL_LVL != null && model.DFLT_TNDR_AR_SETL_LVL != '' && this.TenderARSettlementLevelData.filter(x => x.DROP_DOWN === model.DFLT_TNDR_AR_SETL_LVL).length == 0) {
            this.errorMsg.push("Please select a valid Tenders Settlement Level");
            retCond = true;
        }
        if (model.DFLT_SETTLEMENT_PARTNER != null && model.DFLT_SETTLEMENT_PARTNER != '' && this.SettlementPartner.filter(x => x.toString() === model.DFLT_SETTLEMENT_PARTNER).length == 0) {
            this.errorMsg.push("Please select a valid Settlement Partner");
            retCond = true;
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

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty = true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            CUST_MBR_SID: new FormControl(dataItem.CUST_MBR_SID),
            CUST_NM: new FormControl({ value: dataItem.CUST_NM, disabled: true }),
            VISTEX_CUST_FLAG: new FormControl({ value: dataItem.VISTEX_CUST_FLAG, disabled: true }),
            DFLT_DOUBLE_CONSUMPTION: new FormControl(dataItem.DFLT_DOUBLE_CONSUMPTION, Validators.required),
            DFLT_ENFORCE_PAYABLE_QUANTITY: new FormControl(dataItem.DFLT_ENFORCE_PAYABLE_QUANTITY),
            DFLT_PERD_PRFL: new FormControl(dataItem.DFLT_PERD_PRFL),
            DFLT_TNDR_AR_SETL_LVL: new FormControl(dataItem.DFLT_TNDR_AR_SETL_LVL),
            DFLT_AR_SETL_LVL: new FormControl(dataItem.DFLT_AR_SETL_LVL),
            DFLT_CUST_RPT_GEO: new FormControl(dataItem.DFLT_CUST_RPT_GEO),
            DFLT_LOOKBACK_PERD: new FormControl(dataItem.DFLT_LOOKBACK_PERD),
            CUST_CIM_ID: new FormControl(dataItem.CUST_CIM_ID),
            DFLT_SETTLEMENT_PARTNER: new FormControl(dataItem.DFLT_SETTLEMENT_PARTNER),
        });
        this.InitiateDropDowns(this.formGroup);
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

    saveHandler({ sender, rowIndex, formGroup }: SaveEvent): void {
        const cust_map: Vistex_Cust_Map = formGroup.getRawValue();
        this.errorMsg = [];

        if (cust_map.DFLT_LOOKBACK_PERD === null || cust_map.DFLT_LOOKBACK_PERD.toString() === "") {
            cust_map.DFLT_LOOKBACK_PERD = -1;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCustomerMapping(cust_map);
            if (!this.isCombExists) {
                this.isLoading = true;
                this.customerMapSvc.UpdateVistexCustomer(cust_map).pipe(takeUntil(this.destroy$)).subscribe(() => {
                    this.isDirty = true;
                    this.gridResult[rowIndex] = cust_map;
                    this.gridResult.push(cust_map);
                    this.loadCustomerMapping();
                    this.loggerSvc.success("Vistex Customer Mapping updated.");
                }, (err) => {
                    this.loadCustomerMapping();
                    this.loggerSvc.error("Unable to update Vistex Customer Mapping.", err.statusText);
                    this.isLoading = false;
                });
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
        this.loadCustomerMapping();
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadCustomerMapping();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
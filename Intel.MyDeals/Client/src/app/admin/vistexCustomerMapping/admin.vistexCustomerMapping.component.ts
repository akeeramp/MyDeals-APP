import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { vistexCustomerMappingService } from "./admin.vistexCustomerMapping.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Vistex_Cust_Map } from "./admin.vistexCustomerMapping.model";
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";
import {
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    GroupDescriptor,
    CompositeFilterDescriptor,
    distinct,
    filterBy,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
    selector: "adminVistexCustomerMapping",
    templateUrl: "Client/src/app/admin/vistexCustomerMapping/admin.vistexCustomerMapping.component.html",
    //styleUrls: ['Client/src/app/admin/vistexcustomermapping/admin.vistexCustomerMapping.component.css']
})

export class adminVistexCustomerMappingComponent {
    constructor(private customerMapSvc: vistexCustomerMappingService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @ViewChild("profileDropDown") private profileDdl;
    @ViewChild("tenderDropDown") private tenderDdl;
    @ViewChild("nonTenderDropDown") private nonTenderDdl;
    @ViewChild("settleDropDown") private settleDdl;
    @ViewChild("custRptGeoDropDown") private custGeoDdl;

    private isLoading: boolean = true;
    private errorMsg: string[] = [];
    private isCombExists: boolean = false;
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;

    public PeriodProfile: Array<any>;
    public ARSettlementLevel: Array<any>;
    public TenderARSettlementLevel: Array<any>;
    public ARSettlementLevelData: Array<any>;
    public TenderARSettlementLevelData: Array<any>;
    public SettlementPartner: Array<any>;
    public custRptGeo: Array<any>;
    public SettlementPartnerData: Array<any>;
    public PeriodProfileData: Array<any>;
    public SelectedConsumptionReportedGeos: string = "";

    public state: State = {
        skip: 0,
        take: 10,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
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

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    InitiateDropDowns(formGroup: any) {
        this.customerMapSvc.getDropdown('GetDropdowns/PERIOD_PROFILE')
            .subscribe((response: Array<any>) => {
                this.PeriodProfile = response;
                this.PeriodProfileData = response.filter(x => x.CUST_MBR_SID == formGroup.value.CUST_MBR_SID || x.CUST_MBR_SID == 1).map(item => item.DROP_DOWN);
            }, function (response) {
                this.loggerSvc.error("Unable to get period profile.", response, response.statusText);
            });
        this.customerMapSvc.getDropdown('GetDropdownsWithInactives/AR_SETTLEMENT_LVL')
            .subscribe((response: Array<any>) => {
                this.ARSettlementLevel = response.map(item => item.DROP_DOWN);
                this.TenderARSettlementLevel = response.filter(x => x.ACTV_IND == true).map(item => item.DROP_DOWN);
                this.ARSettlementLevelData = response;
                this.TenderARSettlementLevelData = response;
            }, function (response) {
                this.loggerSvc.error("Unable to get Settlement Levels.", response, response.statusText);
            });
        this.customerMapSvc.getVendorDropDown('GetCustomerVendors/0')
            .subscribe((response: Array<any>) => {
                this.SettlementPartnerData = response.filter(x => x.CUST_MBR_SID == formGroup.value.CUST_MBR_SID && x.ACTV_IND == true);
                this.SettlementPartner = distinct(this.SettlementPartnerData, "BUSNS_ORG_NM").map(
                    item => (item.BUSNS_ORG_NM + " - " + item.VNDR_ID));
            }, function (response) {
                this.loggerSvc.error("Unable to get Settlement Partner list.", response, response.statusText);
            });
    }

    loadCustomerMapping() {
        let vm = this;
        if (!((<any>window).usrRole === 'SA' || (<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.customerMapSvc.getVistexCustomersMapList().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    vm.isLoading = false;
                },

                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Customers.",
                        response,
                        response.statusText
                    );

                }
            );
        }
    }
    IsValidCustomerMapping(model: any) {
        let vm = this;
        let retCond = false;

        if (model.VISTEX_CUST_FLAG && (model.DFLT_PERD_PRFL == null || model.DFLT_PERD_PRFL == '')) {
            this.errorMsg.push("Default value of Period Profile cannot be empty for Vistex customer!");
            retCond = true;
        }
        if (model.DFLT_PERD_PRFL != null && model.DFLT_PERD_PRFL != '' && vm.PeriodProfile.filter(x => x.DROP_DOWN === model.DFLT_PERD_PRFL).length == 0) {
            this.errorMsg.push("Please select a valid Period Profile");
            retCond = true;
        }
        if (model.DFLT_AR_SETL_LVL != null && model.DFLT_AR_SETL_LVL != '' && vm.ARSettlementLevelData.filter(x => x.DROP_DOWN === model.DFLT_AR_SETL_LVL).length == 0) {
            this.errorMsg.push("Please select a valid Non-Tenders Settlement Level");
            retCond = true;
        }
        if (model.DFLT_TNDR_AR_SETL_LVL != null && model.DFLT_TNDR_AR_SETL_LVL != '' && vm.TenderARSettlementLevelData.filter(x => x.DROP_DOWN === model.DFLT_TNDR_AR_SETL_LVL).length == 0) {
            this.errorMsg.push("Please select a valid Tenders Settlement Level");
            retCond = true;
        }
        if (model.DFLT_SETTLEMENT_PARTNER != null && model.DFLT_SETTLEMENT_PARTNER != '' && vm.SettlementPartner.filter(x => x.toString() === model.DFLT_SETTLEMENT_PARTNER).length == 0) {
            this.errorMsg.push("Please select a valid Settlement Partner");
            retCond = true;
        }
        return retCond;
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
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            CUST_MBR_SID: new FormControl(dataItem.CUST_MBR_SID),
            CUST_NM: new FormControl({ value: dataItem.CUST_NM, disabled: true }),
            VISTEX_CUST_FLAG: new FormControl({ value: dataItem.VISTEX_CUST_FLAG, disabled: true }),
            DFLT_DOUBLE_CONSUMPTION: new FormControl(dataItem.DFLT_DOUBLE_CONSUMPTION, Validators.required),
            DFLT_PERD_PRFL: new FormControl(dataItem.DFLT_PERD_PRFL),
            DFLT_TNDR_AR_SETL_LVL: new FormControl(dataItem.DFLT_TNDR_AR_SETL_LVL),
            DFLT_AR_SETL_LVL: new FormControl(dataItem.DFLT_AR_SETL_LVL),
            DFLT_CUST_RPT_GEO: new FormControl(dataItem.DFLT_CUST_RPT_GEO),
            DFLT_LOOKBACK_PERD: new FormControl(dataItem.DFLT_LOOKBACK_PERD),
            CUST_CIM_ID: new FormControl(dataItem.CUST_CIM_ID),
            DFLT_SETTLEMENT_PARTNER: new FormControl(dataItem.DFLT_SETTLEMENT_PARTNER),
        });
        this.InitiateDropDowns(this.formGroup);
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }
    saveConfirmation() {
        this.isCombExists = false;
    }
    saveHandler({ sender, rowIndex, formGroup }) {
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
                this.customerMapSvc.UpdateVistexCustomer(cust_map).subscribe(
                    result => {
                        this.gridResult[rowIndex] = cust_map;
                        this.gridResult.push(cust_map);
                        this.loadCustomerMapping();
                        /*sender.closeRow(rowIndex);*/
                    },
                    err => {
                        this.loggerSvc.error("Unable to update customer data.", err.statusText);
                        this.isLoading = false;
                    }
                );
            }
        }
        sender.closeRow(rowIndex);
    }
    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.loadCustomerMapping()
    }

    ngOnInit() {
        this.loadCustomerMapping();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "adminVistexCustomerMapping",
        downgradeComponent({ component: adminVistexCustomerMappingComponent })
    );



import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { customerVendorService } from "./admin.customerVendors.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Cust_Map } from "./admin.customerVendors.model";
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
    selector: "adminVendorsCustomer",
    templateUrl: "Client/src/app/admin/CustomerVendors/admin.customerVendors.component.html",
    styleUrls: ['Client/src/app/admin/CustomerVendors/admin.customerVendors.component.css']
})
export class adminCustomerVendorsComponent {
    constructor(private customerVendSvc: customerVendorService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @ViewChild("catDropDown") private catDdl;
    @ViewChild("custDropDown") private custDdl;
    @ViewChild("countDropDown") private countDdl;
    @ViewChild("partDropDown") private partDdl;

    private isLoading: boolean = true;
    private errorMsg: string = "";
    private isCombExists: boolean = false;
    private custsDataSource: any[] = [];
    private vendorsNamesinfo: any[] = [];
    private vendorsNamesId: any[] = [];
    private selectedCUST_MBR_SID: number = 1;
    private selectedVENDOR_SID: number = 0;
    private getCustomersData: any;
    private OnlyActv_ind_chg: boolean = true;
    private dataSource: any;
    private CustvendorsData: any;
    private customers: any;
    private vendorsNamesOptions: any;
    private vendorsIdsOptions: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public distinctPartner: Array<any>;
    public distinctCust: Array<any>;
    public custData: Array<any>;
    public distinctCountry: Array<any>;
    public distinctPartId: Array<any>;
    public vendorDetails: Array<any>;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;

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
    getCustomersDataSource() {
        this.customerVendSvc.getCustomerDropdowns()
            .subscribe((response: Array<any>) => {
                this.custData = response;
                this.distinctCust = distinct(response, "CUST_NM").map(
                    item => item.CUST_NM
                );
            }, function (response) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", response, response.statusText);
            });
    }

    getVendorsInfoDropdown() {
        this.customerVendSvc.getVendorsData().subscribe((response: Array<any>) => {
            this.vendorDetails = response;
            this.distinctPartner = distinct(response, "BUSNS_ORG_NM").map(
                item => item.BUSNS_ORG_NM
            );
            this.distinctPartId = distinct(response, 'VNDR_ID').map(
                item => item.VNDR_ID
            );
        }, function (response) {
            this.loggerSvc.error("Unable to get Dropdown vendors.", response, response.statusText);
        })
    }
    partnerIDChange(value: any) {
        let selPart = _.findWhere(this.vendorDetails, { VNDR_ID: value });
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
    partnerNMChange(value: any) {
        let selPart = _.findWhere(this.vendorDetails, { BUSNS_ORG_NM: value });
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

    loadCustomerVendors() {
        let vm = this;
        if (
            !(<any>window).isCustomerAdmin &&
            (<any>window).usrRole != "SA" &&
            (<any>window).usrRole != "RA" &&
            !(<any>window).isDeveloper
        ) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.customerVendSvc.getCustomerVendors().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.distinctCountry = distinct(vm.gridResult, "CTRY_CD").map(
                        item => item.CTRY_CD
                    );
                    vm.gridData = process(vm.gridResult, this.state);
                    vm.isLoading = false;
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
    }

    IsValidCombination(model: any, isNew: boolean) {
        let retCond = false;
        let cond = this.gridResult.filter(
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
            if (_.indexOf(this.distinctPartner, model.BUSNS_ORG_NM) == -1) {
                this.errorMsg = "Please Select Valid Settlement Partner.";
                retCond = true;
            }
            if (this.gridResult.filter(x => x.CUST_MBR_SID === model.CUST_MBR_SID && x.DROP_DOWN === model.DROP_DOWN.toString()).length == 1 && model.ATRB_LKUP_SID == '') {
                this.errorMsg = "Please Select Valid Settlement Partner ID.";
                retCond = true;
            }
            if (_.indexOf(this.distinctCountry, model.CTRY_CD) == -1) {
                this.errorMsg = "Please Select Valid Country Code";
                retCond = true;
            }
            if (_.indexOf(this.distinctCust, model.CUST_NM) == -1) {
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

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }) {
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
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
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
    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        const cust_map: Cust_Map = formGroup.value;
        let filteredCust = this.custData.filter(x => x.CUST_NM === cust_map.CUST_NM);
        if (filteredCust.length > 0) {
            cust_map.CUST_MBR_SID = filteredCust[0].CUST_SID;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCombination(cust_map, isNew);
            if (!this.isCombExists) {
                if (isNew) {
                    this.isLoading = true;
                    this.customerVendSvc.insertCustomerVendor(cust_map).subscribe(
                        result => {
                            this.gridResult.push(cust_map);
                            this.loadCustomerVendors();
                            /*sender.closeRow(rowIndex);*/
                        },
                        error => {
                            this.loggerSvc.error("Unable to save customer vendor data.", error);
                            this.isLoading = false;
                        }
                    );
                } else {
                    this.isLoading = true;
                    this.customerVendSvc.updateCustomerVendor(cust_map).subscribe(
                        result => {
                            this.gridResult[rowIndex] = cust_map;
                            this.gridResult.push(cust_map);
                            this.loadCustomerVendors();
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
    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.loadCustomerVendors()
    }

    ngOnInit() {
        this.getCustomersDataSource();
        this.getVendorsInfoDropdown();
        this.loadCustomerVendors();
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
        "adminVendorsCustomer",
        downgradeComponent({ component: adminCustomerVendorsComponent })
    );

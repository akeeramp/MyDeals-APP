import * as angular from 'angular';
import { Component, ViewChild } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { dropdownService } from './admin.dropdowns.service';
import { ui_dropdown } from "./admin.dropdowns.model";
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
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";

@Component({
    selector: "dropdowns",
    templateUrl: "Client/src/app/admin/dropdowns/admin.dropdowns.component.html",
    styleUrls: ['Client/src/app/admin/CustomerVendors/admin.customerVendors.component.css']
})

export class dropdownsComponent {

    //Constructor - unloading the AngularJS stylesheet 
    constructor(private dropdownSvc: dropdownService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild("dealtypeDropDown") private dealtypeDdl;
    @ViewChild("attributeDropDown") private atrbDdl;
    @ViewChild("custDropDown") private custDdl;

    //Private Varibales
    private isLoading: boolean = true;
    private editedRowIndex: number;
    private deleteItem: any;
    private deleteATRB_CDItem: any;
    private deleteDROP_DOWNItem: any;
    private isModelvalid: boolean = false;
    private errorMsg: string = "";
    private isDialogVisible: boolean = false;
    private selectedInheritanceGroup: string;
    private color: ThemePalette = "primary";

    //Public Variables
    public gridResult: Array<any>;
    public formGroup: FormGroup;
    public gridData: GridDataResult;
    public isFormChange: boolean = false;
    public DealTypeData: Array<any>;
    public allDealTypeData: Array<any>;
    public distinctSetTypeCd: Array<any>;
    public fullDistinctSetTypeCd: Array<any>;
    public distinctAtributeCd: Array<any>;
    public GroupData: Array<any>;
    public CustomerData: Array<any>;
    public distinctCustomerName: Array<any>;
    public nonCorpInheritableValues: Array<any> = [];
    public selectedDealType: any = null;
    public selectedGroup: any = null;
    public selectedCustomer: any = null;
    public COMP_ATRB_SIDS: Array<any> = [];


    //For header filter
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

    //Paginatiom
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

    //OnInit Angular event
    ngOnInit() {
        this.getDealtypeDataSource();
        this.getGroupsDataSource();
        this.getCustsDataSource();
        this.loadUIDropdown();
    }

    //Functions
    getDealtypeDataSource() {
        this.dropdownSvc.getDealTypesDropdowns(true)
            .subscribe((response: Array<any>) => {
                this.DealTypeData = response;
                this.fullDistinctSetTypeCd = this.distinctSetTypeCd = distinct(response, "dropdownName").map(
                    item => item.dropdownName
                );
                this.allDealTypeData = this.distinctSetTypeCd.filter(item => ["all deals", "all_deals"].includes(item.toLowerCase()));
                /*this.allDealTypeData = this.DealTypeData.filter(item => ["all deals", "all_deals"].includes(item.dropdownName.toLowerCase()))*/
            }, function (response) {
                this.loggerSvc.error("Unable to get Deal Type Dropdowns.", response, response.statusText);
            });
    }

    getGroupsDataSource() {
        let checkrestrictionflag: boolean = false;
        this.dropdownSvc.getDropdownGroups(true)
            .subscribe((response: Array<any>) => {
                response = response.filter(ob => ob.dropdownName !== "SETTLEMENT_PARTNER");
                checkrestrictionflag = this.checkRestrictions(response);
                if (checkrestrictionflag) {
                    this.GroupData = response;
                    this.distinctAtributeCd = distinct(response, "dropdownName").map(
                        item => item.dropdownName
                    );
                }
            }, function (response) {
                this.loggerSvc.error("Unable to get Dropdown Groups.", response, response.statusText);
            });
    }
    getCustsDataSource() {
        this.dropdownSvc.getCustsDropdowns(true)
            .subscribe((response: Array<any>) => {
                this.CustomerData = response;
                this.distinctCustomerName = distinct(response, "dropdownName").map(
                    item => item.dropdownName
                );
            },
                function (response) {
                    this.loggerSvc.error("Unable to get Dropdown Customers.", response, response.statusText);
                });
    }

    loadUIDropdown() {
        let vm = this;
        vm.COMP_ATRB_SIDS.push([3456, 3457, 3458, 3464, 3454]);
        vm.selectedInheritanceGroup = "";
        let checkrestrictionflag: boolean = false;
        if (
            !(<any>window).isCustomerAdmin &&
            (<any>window).usrRole != "SA" &&
            !(<any>window).isDeveloper
        ) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.dropdownSvc.getBasicDropdowns(true).subscribe(
                (result: Array<any>) => {
                    vm.setNonCorpInheritableValues(result);
                    result = result.filter(ob => ob.ATRB_CD !== "SETTLEMENT_PARTNER");
                    checkrestrictionflag = vm.checkRestrictions(result);
                    if (checkrestrictionflag) {
                        vm.gridResult = result;
                        vm.gridData = process(vm.gridResult, this.state);
                        vm.isLoading = false;
                    }
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get UI Dropdown Values.",
                        response,
                        response.statusText
                    );
                }
            )
        }
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    setNonCorpInheritableValues(data: Array<any>) {
        for (var i = 0; i <= data.length; i++) {
            if (data[i] != null && data[i].ATRB_CD == "MRKT_SEG_COMBINED") {
                this.nonCorpInheritableValues.push(data[i].DROP_DOWN);
            }
        }
    }

    checkRestrictions(dataItem): any {
        var Id: number;
        var restrictToConsumptionOnly: boolean;
        var restrictedGroupList: Array<any>;
        for (var i = 0; i < dataItem.length; i++) {
            Id = (dataItem[i].dropdownID === undefined) ? dataItem[i].ATRB_SID : dataItem[i].dropdownID;
            restrictToConsumptionOnly = ((<any>window).usrRole === 'SA' && !(<any>window).isDeveloper);
            restrictedGroupList = [3456, 3457, 3458, 3454];
        }
        if (restrictToConsumptionOnly === false) {
            return true;
        }
        else {
            return restrictedGroupList.includes(Id);
        }
    }

    checkModelvalid(model: any, isNew: boolean) {
        let IS_MODEL_VALID = true;
        let cond = this.gridResult.filter(
            x => x.OBJ_SET_TYPE_CD.trim() === model.OBJ_SET_TYPE_CD.trim() &&
                x.ATRB_CD.trim() === model.ATRB_CD.trim() &&
                x.DROP_DOWN.toString().trim() === model.DROP_DOWN.toString().trim() &&
                x.CUST_NM.trim() === model.CUST_NM.trim() &&
                x.ATRB_LKUP_DESC.trim() === model.ATRB_LKUP_DESC.trim() &&
                x.ATRB_LKUP_TTIP.trim() === model.ATRB_LKUP_TTIP.trim()
        );

        if (this.COMP_ATRB_SIDS.indexOf(model.ATRB_SID) > -1) {
            if (model.DROP_DOWN.length > 40) {
                this.loggerSvc.warn("Value can not be more than 40 characters long.", "Warning");
                this.errorMsg = "Value can not be more than 40 characters long.";
                IS_MODEL_VALID = false;
            } else if (model.DROP_DOWN.indexOf(',') > -1) {
                this.loggerSvc.warn("Value can not have comma(,).", "Warning");
                this.errorMsg = "Value can not have comma(,).";
                IS_MODEL_VALID = false;
            }
        }

        if (this.selectedInheritanceGroup == "MRKT_SEG_NON_CORP") {
            this.errorMsg = "MRKT_SEG_NON_CORP values must match an existing MRKT_SEG_COMBINED value.";
            this.loggerSvc.error("MRKT_SEG_NON_CORP values must match an existing MRKT_SEG_COMBINED value.", "Error");
            IS_MODEL_VALID = (this.nonCorpInheritableValues.indexOf(model.DROP_DOWN) > -1);
        }

        if (isNew && cond.length > 0) {
            this.errorMsg = "This Combination of Customer,Group,DealType and dropdown already exists.";
            this.loggerSvc.error("This Combination of Customer,Group,DealType and dropdown already exists.", "Error");
            IS_MODEL_VALID = false;
        } else if (!isNew && cond.length > 0) {
            if (cond.filter(x => x.ACTV_IND === model.ACTV_IND).length == 1) {
                this.errorMsg = "This Combination of Customer,Group,DealType and dropdown already exists.";
                this.loggerSvc.error("This Combination of Customer,Group,DealType and dropdown already exists.","Error");
                IS_MODEL_VALID = false;
            } else if (cond.filter(x => x.ACTV_IND != model.ACTV_IND && x.ATRB_LKUP_SID != model.ATRB_LKUP_SID).length == 1) {
                this.errorMsg = "This Combination of Customer,Group,DealType and dropdown already exists.";
                this.loggerSvc.error("This Combination of Customer,Group,DealType and dropdown already exists.", "Error");
                IS_MODEL_VALID = false;
            }
        }
        else {
            if (_.indexOf(this.distinctCustomerName, model.CUST_NM) == -1) {
                this.errorMsg = "Please Select Valid Customer Name.";
                this.loggerSvc.error("Please Select Valid Customer Name.", "Error");
                IS_MODEL_VALID = false;
            }
            if (_.indexOf(this.distinctAtributeCd, model.ATRB_CD) == -1) {
                this.errorMsg = "Please Select Valid Attribute Code";
                this.loggerSvc.error("Please Select Valid Attribute Code.", "Error");
                IS_MODEL_VALID = false;
            }
            if (_.indexOf(this.distinctSetTypeCd, model.OBJ_SET_TYPE_CD) == -1) {
                this.errorMsg = "Please Select Valid Deal Type";
                this.loggerSvc.error("Please Select Valid Deal Type.", "Error");
                IS_MODEL_VALID = false;
            }
        }

        return IS_MODEL_VALID;
    }
    //End of functions

    //Events called via html : Starts
    addHandler({ sender }) {
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(false, Validators.required),
            OBJ_SET_TYPE_CD: new FormControl(this.distinctSetTypeCd[0], Validators.required),
            OBJ_SET_TYPE_SID: new FormControl(),
            ATRB_CD: new FormControl(this.distinctAtributeCd[0], Validators.required),
            ATRB_SID: new FormControl(),
            CUST_NM: new FormControl(this.distinctCustomerName[0], Validators.required),
            CUST_MBR_SID: new FormControl(),
            DROP_DOWN: new FormControl("", Validators.required),
            ATRB_LKUP_DESC: new FormControl(""),
            ATRB_LKUP_TTIP: new FormControl(""),
            ORD: new FormControl()
        });
        this.distinctSetTypeCd = this.fullDistinctSetTypeCd;
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(dataItem.ACTV_IND),
            OBJ_SET_TYPE_CD: new FormControl({ value: dataItem.OBJ_SET_TYPE_CD, disabled: true }),
            OBJ_SET_TYPE_SID: new FormControl(dataItem.OBJ_SET_TYPE_SID),
            ATRB_CD: new FormControl({ value: dataItem.ATRB_CD, disabled: true }),
            ATRB_SID: new FormControl(dataItem.ATRB_SID),
            CUST_NM: new FormControl({ value: dataItem.CUST_NM, disabled: true }),
            CUST_MBR_SID: new FormControl(dataItem.CUST_MBR_SID),
            DROP_DOWN: new FormControl({ value: dataItem.DROP_DOWN, disabled: true }),
            ATRB_LKUP_DESC: new FormControl(dataItem.ATRB_LKUP_DESC),
            ATRB_LKUP_TTIP: new FormControl(dataItem.ATRB_LKUP_TTIP),
            ORD: new FormControl(dataItem.ORD)
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

    saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
        const ui_dropdown: ui_dropdown = formGroup.getRawValue();

        //for disabled formgroup, using the dropdown datasource to get the ID value as in dataItem the value coming as null
        let filteredDropdown = this.gridResult.filter(x => x.OBJ_SET_TYPE_CD === ui_dropdown.OBJ_SET_TYPE_CD);
        if (filteredDropdown.length > 0) {
            ui_dropdown.OBJ_SET_TYPE_SID = filteredDropdown[0].OBJ_SET_TYPE_SID;
        }

        if (isNew) {
            let GroupSID = this.GroupData.filter(x => x.dropdownName == ui_dropdown.ATRB_CD)
            if (GroupSID.length > 0) {
                ui_dropdown.ATRB_SID = GroupSID[0]["dropdownID"];
            }
            let customerSID = this.CustomerData.filter(x => x.dropdownName == ui_dropdown.CUST_NM)
            if (customerSID.length > 0) {
                ui_dropdown.CUST_MBR_SID = customerSID[0]["dropdownID"];
            }
        }

        if (!isNew) {
            ui_dropdown.ATRB_LKUP_SID = dataItem.ATRB_LKUP_SID;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isModelvalid = this.checkModelvalid(ui_dropdown, isNew);
            if (this.isModelvalid) {
                if (isNew) {
                    this.isLoading = true;
                    this.dropdownSvc.insertBasicDropdowns(ui_dropdown).subscribe(
                        result => {
                            this.selectedInheritanceGroup = "";
                            if (result.ATRB_CD == "MRKT_SEG_COMBINED") {
                                this.nonCorpInheritableValues.push(result);
                            }
                            this.gridResult.push(ui_dropdown);
                            this.loadUIDropdown();
                            this.loggerSvc.success("New Dropdown Added.")
                            /*sender.closeRow(rowIndex);*/
                        },
                        error => {
                            this.loggerSvc.error("Unable to insert Dropdown.", error);
                            this.isLoading = false;
                        }
                    );
                } else {
                    this.isLoading = true;
                    this.dropdownSvc.updateBasicDropdowns(ui_dropdown).subscribe(
                        result => {
                            this.gridResult[rowIndex] = ui_dropdown;
                            this.gridResult.push(ui_dropdown);
                            this.loadUIDropdown();
                            /*sender.closeRow(rowIndex);*/
                        },
                        error => {
                            this.loggerSvc.error("Unable to update UI dropdown data.", error);
                            this.isLoading = false;
                        }
                    );
                }
            }
        }
        sender.closeRow(rowIndex);
    }

    removeHandler({ dataItem }) {
        this.deleteItem = dataItem.ATRB_LKUP_SID;
        this.deleteATRB_CDItem = dataItem.ATRB_CD;
        this.deleteDROP_DOWNItem = dataItem.DROP_DOWN;
        this.isDialogVisible = true;
    }

    handleDealTypeChange(value) {
        //If the value selected in Group dropdown has allDealsFlag = 1, we show only "all deals" in Deal Type dropdown
        if (value["allDealFlag"] == 1) {
            this.DealTypeData = this.allDealTypeData;
        }
        else {
            this.DealTypeData = this.fullDistinctSetTypeCd;
        }
    }
    //Events called via html : Ends

    //UI button click : Starts
    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.loadUIDropdown();
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    close() {
        this.isDialogVisible = false;
    }


    deleteRecord() {
        this.isDialogVisible = false;
        this.dropdownSvc.deleteBasicDropdowns(this.deleteItem)
            .subscribe(
                (result: Array<any>) => {
                    //for (var i = 0; i < result.length; i++) {
                    if (this.deleteATRB_CDItem == "MRKT_SEG_COMBINED") {
                        var indx = this.nonCorpInheritableValues.indexOf(this.deleteDROP_DOWNItem);
                        if (indx > -1) {
                            this.nonCorpInheritableValues.splice(indx, 1);
                        }
                    }
                    //}
                    this.refreshGrid();
                    this.loggerSvc.success("UI Dropdown successfully deleted or deactivated.")
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to delete row Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }
    // UI button click ends       


    //Angular OnDestroy Event
    gOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "dropdowns",
    downgradeComponent({
        component: dropdownsComponent,
    })
);


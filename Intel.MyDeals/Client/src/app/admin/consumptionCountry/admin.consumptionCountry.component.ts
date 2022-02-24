import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { consumptionCountryService } from "./admin.consumptionCountry.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { consumption_Country_Map } from "./admin.consumptionCountry.model";
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
    selector: "adminConsumptionCountry",
    templateUrl: "Client/src/app/admin/consumptionCountry/admin.consumptionCountry.component.html",
    //styleUrls: ['Client/src/app/admin/consumptionCountry/admin.consumptionCountry.component.css']
})
export class adminConsumptionCountryComponent {
    constructor(private consumptionCountrySvc: consumptionCountryService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild("CNSMPTN_CTRY_NM_DropDown") private CNSMPTN_CTRY_NM_Ddl;
    @ViewChild("GEO_NM_DropDown") private GEO_NM_DropDownDdl;

    private isLoading: boolean = true;
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private isCombExists: boolean = false;
    private errorMsg: string[] = [];
    public Geo: Array<any>;
    public Countries: Array<any>;
    private editedRowIndex: number;
    public countriesData: Array<any>;
    public GeoData: Array<any>;

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

    loadConsumptionCountry() {
        let vm = this;
        if (!((<any>window).usrRole === 'SA' || (<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.consumptionCountrySvc.getConsumptionCountry().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    this.InitiateDropDowns(this.formGroup);
                    vm.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Consumption Countries/Regions.",
                        response,
                        response.statusText
                    );
                }
            );
        }
    }

    //get Dropdowns Data
    InitiateDropDowns(formGroup: any) {

        this.consumptionCountrySvc.getDropdown()
            .subscribe((response: Array<any>) => {
                this.Geo = response;
                this.GeoData = response.filter(x => x.dropdownName).map(item => item.dropdownName);
            }, function (response) {
                this.loggerSvc.error("Unable to get Geo.", response, response.statusText);
            });

        this.consumptionCountrySvc.getCountryList()
            .subscribe((response: Array<any>) => {
                this.Countries = response;
                this.countriesData = response.filter(x => x.CTRY_NM).map(item => item.CTRY_NM);
            }, function (response) {
                this.loggerSvc.error("Unable to get Countries.", response, response.statusText);
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

    IsValidConsumptionCountryMapping(model: any) {
        let vm = this;
        let retCond = false;

        if (model.GEO_NM == null || model.GEO_NM == '' || vm.Geo.filter(x => x.dropdownName == model.GEO_NM).length == 0) {
            this.errorMsg.push("Please Select Valid <strong>Geo</strong>.");
            retCond = true;
        }
        if (model.CNSMPTN_CTRY_NM == null || model.CNSMPTN_CTRY_NM == '' || vm.Countries.filter(x => x.CTRY_NM == model.CNSMPTN_CTRY_NM).length == 0) {
            this.errorMsg.push("Please Select Valid <strong>Consumption Country/Region</strong>.");
            retCond = true;
        }
        if (vm.gridResult.filter(x => x.CNSMPTN_CTRY_NM == model.CNSMPTN_CTRY_NM && x.GEO_NM == model.GEO_NM).length != 0) {
            this.errorMsg.push("The Combination of" + " <strong>" + model.GEO_NM + "</strong> " + "and" + " <strong>" + model.CNSMPTN_CTRY_NM + "</strong> " + "already exists.");
            retCond = true;
        }
        if (vm.gridResult.filter(x => x.CNSMPTN_CTRY_NM == model.CNSMPTN_CTRY_NM).length != 0) {
            this.errorMsg.push("<strong>" + model.CNSMPTN_CTRY_NM + "</strong> " + "already mapped.");
            retCond = true;
        }

        return retCond;
    }

    addHandler({ sender }) {
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            GEO_NM: new FormControl("", Validators.required),
            CNSMPTN_CTRY_NM: new FormControl("", Validators.required)
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
            GEO_NM: new FormControl(dataItem.GEO_NM, Validators.required),
            CNSMPTN_CTRY_NM: new FormControl(dataItem.CNSMPTN_CTRY_NM, Validators.required)
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
        const consumption_Ctry_Map: consumption_Country_Map = formGroup.value;
        this.errorMsg = [];

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidConsumptionCountryMapping(consumption_Ctry_Map);
            if (!this.isCombExists) {
                if (isNew) {
                    this.isLoading = true;
                    this.consumptionCountrySvc.insertConsumptionCountry(consumption_Ctry_Map).subscribe(
                        result => {
                            this.gridResult.push(consumption_Ctry_Map);
                            this.loadConsumptionCountry();
                            this.loggerSvc.success("New Consumption Country/Region Added.");
                            sender.closeRow(rowIndex);
                        },
                        error => {
                            this.loggerSvc.error("Unable to insert Consumption Country/Region.", error);
                            this.isLoading = false;
                        }
                    );
                } else {
                    this.isLoading = true;
                    this.consumptionCountrySvc.updateConsumptionCountry(consumption_Ctry_Map).subscribe(
                        result => {
                            this.gridResult[rowIndex] = consumption_Ctry_Map;
                            this.gridResult.push(consumption_Ctry_Map);
                            this.loadConsumptionCountry();
                            this.loggerSvc.success("Consumption Country/Region updated.");
                            sender.closeRow(rowIndex);
                        },
                        error => {
                            this.loggerSvc.error("Unable to update Consumption Country/Region.", error);
                            this.isLoading = false;
                        }
                    );
                }
            }
        }
        sender.closeRow(rowIndex);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadConsumptionCountry();
    }

    ngOnInit() {
        this.loadConsumptionCountry();
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
        "adminConsumptionCountry",
        downgradeComponent({ component: adminConsumptionCountryComponent })
    );

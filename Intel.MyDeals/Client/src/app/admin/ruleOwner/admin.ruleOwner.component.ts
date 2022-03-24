import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { ruleOwnerService } from "./admin.ruleOwner.service";
import { constantsService } from "../constants/admin.constants.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import * as _ from "underscore";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";


import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,

} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { any } from "underscore";


@Component({
    selector: "ruleOwner",
    templateUrl: "Client/src/app/admin/ruleOwner/admin.ruleOwner.component.html",
    styleUrls: ['Client/src/app/admin/cache/admin.cache.component.css']
})

export class RuleOwnerComponent {
    constructor(private ruleOwnerSvc: ruleOwnerService, private loggerSvc: logger, private constantsSvc: constantsService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild("ownerNameDropDown") private ownerDdl;
    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };


    public Rules: Array<any> = [];
    public RuleConfig: Array<any> = [];
    public SelectedOwnerId = null;
    public EditedRuleId = 0;
    public isBusyShowFunFact: boolean = true;
    public isElligibleForApproval: boolean = false;
    public IsReadOnlyAccess = (<any>window).usrRole === "DA" ? false : true;
    public IsSecurityCheckDone: boolean = false;

    public gridResult: Array<any>;
    private isLoading: boolean = true;
    public ownerNameData: Array<any> = [];
    public generatedOwnerData: Array<any> = [];
    public dropdownResult: Array<any> = [];
    
    private selectedOwner: any = null;
     

    public formGroup: FormGroup;
    public isFormChange: boolean = false;
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

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
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
            Name: new FormControl({ value: dataItem.Name, disabled: true }, Validators.required),
            OwnerName: new FormControl(dataItem.OwnerName, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
        this.selectedOwner = { "EMP_WWID": dataItem.OwnerId };
    }

    saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
        this.isLoading = true;
        var priceRuleCriteria = {
            Id: dataItem.Id,
            OwnerId: formGroup.value.OwnerName.EMP_WWID
        }
        this.ruleOwnerSvc.updatePriceRule(priceRuleCriteria, "UPDATE_OWNER")
            .subscribe(result => {
                this.gridResult[rowIndex] = result.OwnerName;
                this.getConstant();
                this.isLoading = false;
            },
            error => {
                this.loggerSvc.error("Unable to update owner name.", error);
                this.isLoading = false;
            });
        sender.closeRow(rowIndex);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.getConstant()
    }

    initiateRuleOwners() {
        this.ruleOwnerSvc.getPriceRulesConfig()
            .subscribe(response => {
                this.RuleConfig = response;
                this.ownerNameData = response.DA_Users;
                
                this.dropdownResult = distinct(this.ownerNameData, "EMP_WWID");

                for (var i = 0; i < this.dropdownResult.length; i++) {
                    this.dropdownResult[i].displayText = this.ownerNameData[i].NAME + (this.ownerNameData[i].EMAIL_ADDR ? (" - " + this.ownerNameData[i].EMAIL_ADDR) : "")
                }
              
            }, function (error) {
                    this.loggerSvc.error("Operation failed", error);
        });
        this.GetRules(0, "GET_OWNERS");
    }

    GetRules(id, actionName) {
        this.ruleOwnerSvc.getPriceRules(id, actionName)
            .subscribe(response => {
                this.Rules = response;
                this.gridResult = response;
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
            }, function (error) {
                this.loggerSvc.error("Operation failed", error);
        });
    };

    ownerNMChange(value) {
        this.selectedOwner = value;
        this.formGroup.patchValue({
            OwnerName: value
        });
    }

    handleFilter(value) {

        this.dropdownResult = this.ownerNameData.filter(
            item => (item.NAME.toLowerCase()).includes(value.toLowerCase())
        )
    }

    getConstant() {

        let vm = this;
        
        this.constantsSvc.getConstantsByName("PRC_RULE_EMAIL")
            .subscribe(data => {
            if (!!data) {
                var adminEmailIDs = data.CNST_VAL_TXT === "NA" ? "" : data.CNST_VAL_TXT;
                vm.isElligibleForApproval = adminEmailIDs.indexOf((<any>window).usrEmail) > -1 ? true : false;
                vm.IsSecurityCheckDone = true;
                if (vm.isElligibleForApproval) {
                    vm.initiateRuleOwners();
                }
            }

                if (vm.isElligibleForApproval == false && (<any>window).usrRole !== "DA") {
                this.constantsSvc.getConstantsByName("PRC_RULE_READ_ACCESS")
                    .subscribe(data => {
                    if (!!data) {
                        var prcAccess = data.CNST_VAL_TXT === "NA" ? "" : data.CNST_VAL_TXT;
                        vm.IsReadOnlyAccess = prcAccess.indexOf((<any>window).usrRole) > -1;
                        vm.IsSecurityCheckDone = true;
                        if (vm.IsReadOnlyAccess) {
                            vm.initiateRuleOwners();
                        } else {
                            document.location.href = "/Dashboard#/portal";
                        }
                    } else {
                        vm.IsSecurityCheckDone = true;
                    }
                });
            } else {
                vm.IsSecurityCheckDone = true;
            }
        });
    }

    ngOnInit() {
        this.getConstant();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive("ruleOwner",
        downgradeComponent({ component: RuleOwnerComponent })
    );

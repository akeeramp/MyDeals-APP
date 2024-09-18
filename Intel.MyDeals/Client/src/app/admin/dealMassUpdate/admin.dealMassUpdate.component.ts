import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { DealMassUpdateService } from "./admin.dealMassUpdate.service";  
import { Observable } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AttributeFeildvalues, DealMassUpdateData, DealMassUpdateResults } from "./admin.dealMassUpdate.model";
import { DynamicObj } from "../employee/admin.employee.model";

@Component({
    selector: "deal-mass-update",
    templateUrl: "Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.html",
    styleUrls: ['Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.css'],
})
export class DealMassUpdateComponent implements PendingChangesGuard, OnDestroy {

    constructor(private dealMassUpdateService: DealMassUpdateService,
        private loggerService: logger) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    private color: ThemePalette = "primary";
    private attr: Array<AttributeFeildvalues> = [];
    private attrValues: Array<AttributeFeildvalues> = [];
    private gridResult: GridDataResult;
    private updateResponse: Array<DealMassUpdateResults>;
    private massUpdateData: DynamicObj = {};
    private resultCount: DynamicObj = {};
    private isError: DynamicObj = {};
    private errorMsg: DynamicObj = {};
    private showNumeric = false;
    private showTextBox = false;
    private showDropDown = false;
    private showMultiSelect = false;
    private showResults = false;
    private isDataValid = true;
    private MaxNumericValue: number;
    private readonly NumericAtrbIds = [3352, 3355, 3461, 3708];
    private readonly TextBoxAtrbIds = [3349, 3350, 3351, 3453, 3464, 3568];
    private readonly NumericIdTo1 = [3352, 3355, 3708];
    private readonly NumericIdTo24 = [3461];
    private readonly SingleValueDropdownAtrbIds = [57, 3009, 3717, 3719, 3465];
    public state: State = {
        skip: 0,
        group: []
    };

    loadAttributes(): void {
        //Setting ngModel values to null initially
        this.massUpdateData.sendVistexFlag = false;
        this.massUpdateData.DealIds = null;
        this.massUpdateData.field = null;
        this.massUpdateData.textValue = null;

        this.dealMassUpdateService.GetUpdateAttributes(0).pipe(takeUntil(this.destroy$)).subscribe((result: Array<AttributeFeildvalues>) => {
            this.attr = result
        }, (error) => {
            this.loggerService.error('Unable to get Attribute List', '', 'DealMassUpdateComponent::GetUpdateAttributes::' + JSON.stringify(error));
        });
    }

    attributeChange(value: AttributeFeildvalues): void {
        this.isDirty = true;
        //Resetting error messages
        this.isError = {};
        this.errorMsg = {};
        this.isDataValid = true;

        //Resetting ngModel values
        this.massUpdateData.textValue = null;
        this.massUpdateData.numericValue = null;
        this.massUpdateData.multiSelectValue = null;
        this.massUpdateData.dropdownValue = null;

        if (this.NumericAtrbIds.includes(value.ATRB_SID)) {
            this.showTextBox = this.showMultiSelect = this.showDropDown = false;
            this.showNumeric = true;

            if (this.NumericIdTo1.includes(value.ATRB_SID)) {
                this.MaxNumericValue = 1;
            } else if (this.NumericIdTo24.includes(value.ATRB_SID)) {
                this.MaxNumericValue = 24;
            } else {
                this.MaxNumericValue = 999999999;
            }
        } else {
            this.dealMassUpdateService.GetUpdateAttributes(value.ATRB_SID)
                .pipe(takeUntil(this.destroy$))
                .subscribe((result: Array<AttributeFeildvalues>) => {
                    this.attrValues = result;
                }, (error) => {
                    this.loggerService.error('Unable to get Attribute List', '', 'DealMassUpdateComponent::attributeChange::' + JSON.stringify(error));
                });
            if (this.TextBoxAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showDropDown = false;
                this.showTextBox = true;
            } else if (this.SingleValueDropdownAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showTextBox = false;
                this.showDropDown = true;
            } else {
                this.showNumeric = this.showDropDown = this.showTextBox = false;
                this.showMultiSelect = true;
            }
        }
    }

    updateValues(): void {
        //Resetting error messages
        this.isError = {};
        this.errorMsg = {};
        this.validateData();

        if (this.isDataValid) {
            const finalData: DealMassUpdateData = {
                "DEAL_IDS": this.massUpdateData.DealIds,
                "ATRB_SID": this.massUpdateData.field.ATRB_SID,
                "SEND_VSTX_FLG": this.massUpdateData.sendVistexFlag,
                "UPD_VAL": ""
            }

            if (this.showMultiSelect) {
                finalData["UPD_VAL"] = (this.massUpdateData.multiSelectValue).join(",")
            } else if (this.showDropDown) {
                finalData["UPD_VAL"] = this.massUpdateData.dropdownValue
            } else if (this.showNumeric) {
                finalData["UPD_VAL"] = this.massUpdateData.numericValue
            } else if (this.showTextBox) {
                finalData["UPD_VAL"] = this.massUpdateData.textValue
            }

            this.dealMassUpdateService.UpdateDealsAttrbValue(finalData).pipe(takeUntil(this.destroy$)).subscribe((result: Array<DealMassUpdateResults>) => {
                this.isDirty = false;
                this.updateResponse = result;
                this.gridResult = process(result, this.state);
                this.resultCount['all'] = result.length;
                this.resultCount['success'] = result.filter(i => i.ERR_FLAG == 0).length;
                this.resultCount['error'] = result.filter(i => i.ERR_FLAG == 1).length;

                this.showResults = true;

                this.loggerService.success("Please Check The Results.");
            }, (error) => {
                this.loggerService.error('Unable to Update deal(s)', '', 'DealMassUpdateComponent::updateValues::' + JSON.stringify(error));
            });
        } else {
            this.loggerService.warn('Please fix validation errors', 'Warning');
        }
    }

    validateData(): void {
        this.isDataValid = true;

        // Validate Deals IDs
        if (this.massUpdateData.DealIds != undefined) {
            this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/\s/g, "");
            if (this.massUpdateData.DealIds.slice(-1) == ',') {
                this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/,+$/g, "");
            }
        }
        const REGEX_RULE_DEAL_ID = /^[0-9,]+$/;
        if (this.massUpdateData.DealIds == undefined || this.massUpdateData.DealIds == '' || !REGEX_RULE_DEAL_ID.test(this.massUpdateData.DealIds)) {
            this.isError["Deal_Ids"] = true;
            this.errorMsg["Deal_Ids"] = "Please enter valid Deal Ids";
            this.isDataValid = false;
        }

        // Validate "Field to Update"/Attribute list dropdown 
        if (!this.massUpdateData.field) {
            this.isError["field"] = true;
            this.errorMsg["field"] = "Please Select Valid Attribute";
            this.isDataValid = false;
        }

        // Validate dropdown Value
        if (this.showDropDown && !this.massUpdateData.dropdownValue) {
            this.isError["dropdownValue"] = true;
            this.errorMsg["dropdownValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        // Validate multiselect Value
        if (this.showMultiSelect && !this.massUpdateData.multiSelectValue) {
            this.isError["multiSelectValue"] = true;
            this.errorMsg["multiSelectValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        if (this.massUpdateData.textValue != undefined && this.massUpdateData.textValue != null && this.massUpdateData.textValue != "") {
            if (this.massUpdateData.field.ATRB_LBL == "System Price Point") {
                const value = this.massUpdateData.textValue;
                if (value && !(parseFloat(value) > 1000000.00)) {
                    if (parseFloat(value) <= 0.00) {
                        this.massUpdateData.textValue = 0.01;
                    }
                } else {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Valid Range: <=$0.01 - <=$1,000,000";
                    this.isDataValid = false;
                }
            }
    
            if (this.massUpdateData.field.ATRB_LBL == "Unified Customer ID") {
                const REGEX_RULE_UP_TO_TEN_DIGITS = /^[0-9]{10}$/;   // 10 digit number
                if (!REGEX_RULE_UP_TO_TEN_DIGITS.test(this.massUpdateData.textValue)) {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Customer IDs are a 10 digit value";
                    this.isDataValid = false;
                }
            }

            if (this.massUpdateData.field.ATRB_LBL == "Unified Customer Name") {
                const REGEX_RULE_ALPHANUMERIC = /^[a-zA-Z0-9\s]*$/;  // Alphanumeric only
                if (!REGEX_RULE_ALPHANUMERIC.test(this.massUpdateData.textValue)) {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Alphanumeric values only, no special characters";
                    this.isDataValid = false;
                }
            }
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridResult = process(this.updateResponse, this.state);
    }

    textchange(): void {
        this.isDirty=true;
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadAttributes();
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
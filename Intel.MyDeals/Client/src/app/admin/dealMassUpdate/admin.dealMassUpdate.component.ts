import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { dealMassUpdateService } from "./admin.dealMassUpdate.service";

@Component({
    selector: "deal-mass-update",
    templateUrl: "Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.html",
    styleUrls: ['Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.css'],
})

export class dealMassUpdateComponent {
    constructor(private dealMassUpdateSvc: dealMassUpdateService, private loggerSvc: logger) { }

    private color: ThemePalette = "primary";
    private attr = [];
    private attrValues = [];
    private gridResult: GridDataResult;
    private updateResponse: any;
    private massUpdateData: any = {};
    private resultCount: any = {};
    private isError: any = {};
    private errorMsg: any = {};
    private showNumeric = false;
    private showTextBox = false;
    private showDropDown = false;
    private showMultiSelect = false;
    private showResults = false;
    private isDataValid = true;
    private MaxNumericValue: number;
    private NumericAtrbIds = [3352, 3355, 3461, 3708];
    private TextBoxAtrbIds = [3349, 3350, 3351, 3453, 3464, 3568];
    private NumericIdTo1 = [3352, 3355, 3708];
    private NumericIdTo24 = [3461];
    private SingleValueDropdownAtrbIds = [57, 3009, 3717, 3719, 3465];
    public state: State = {
        skip: 0,
        group: []
    };

    loadAttributes() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        //Setting ngModel values to null initially
        this.massUpdateData.sendVistexFlag = false;
        this.massUpdateData.DealIds = null;
        this.massUpdateData.field = null;
        this.massUpdateData.textValue = null;

        this.dealMassUpdateSvc.GetUpdateAttributes(0)
            .subscribe((result: Array<any>) => {
                this.attr = result
            }, (error) => {
                this.loggerSvc.error('Unable to get Attribute List', '', 'dealMassUpdateComponent::GetUpdateAttributes::' + JSON.stringify(error));
            });

    }

    atrbChange(value) {
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
            }
            else if (this.NumericIdTo24.includes(value.ATRB_SID)) {
                this.MaxNumericValue = 24;
            }
            else {
                this.MaxNumericValue = 999999999;
            }
        }
        else {

            this.dealMassUpdateSvc.GetUpdateAttributes(value.ATRB_SID)
                .subscribe((result: Array<any>) => {
                    this.attrValues = result;
                }, (error) => {
                    this.loggerSvc.error('Unable to get Attribute List', '', 'dealMassUpdateComponent::atrbChange::' + JSON.stringify(error));
                });

            if (this.TextBoxAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showDropDown = false;
                this.showTextBox = true;
            }
            else if (this.SingleValueDropdownAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showTextBox = false;
                this.showDropDown = true;
            }
            else {
                this.showNumeric = this.showDropDown = this.showTextBox = false;
                this.showMultiSelect = true;
            }

        }

    }

    updateValues() {
        //Resetting error messages
        this.isError = {};
        this.errorMsg = {};
        this.validateData();


        if (this.isDataValid) {

            const finalData = {
                "DEAL_IDS": this.massUpdateData.DealIds,
                "ATRB_SID": this.massUpdateData.field.ATRB_SID,
                "SEND_VSTX_FLG": this.massUpdateData.sendVistexFlag
            }
            if (this.showMultiSelect) {
                finalData["UPD_VAL"] = (this.massUpdateData.multiSelectValue).join(",")
            }
            else if (this.showDropDown) {
                finalData["UPD_VAL"] = this.massUpdateData.dropdownValue
            }
            else if (this.showNumeric) {
                finalData["UPD_VAL"] = this.massUpdateData.numericValue
            }
            else if (this.showTextBox) {
                finalData["UPD_VAL"] = this.massUpdateData.textValue
            }

            this.dealMassUpdateSvc.UpdateDealsAttrbValue(finalData)
                .subscribe((result: Array<any>) => {
            this.updateResponse = result;
            this.gridResult = process(result, this.state);
            this.resultCount['all'] = result.length;
            this.resultCount['success'] = result.filter(i => i.ERR_FLAG == 0).length;
            this.resultCount['error'] = result.filter(i => i.ERR_FLAG == 1).length;

            this.showResults = true;

            this.loggerSvc.success("Please Check The Results.");
                }, (error) => {
                    this.loggerSvc.error('Unable to Update deal(s)', '', 'dealMassUpdateComponent::updateValues::' + JSON.stringify(error));
            });
        }
        else {
            this.loggerSvc.warn('Please fix validation errors', 'Warning');
        }
    }

    validateData() {
        this.isDataValid = true;
        const reg = new RegExp(/^[0-9,]+$/);

        //Validate Deals Ids
        if (this.massUpdateData.DealIds != undefined) {
            this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/\s/g, "");
            if (this.massUpdateData.DealIds.slice(-1) == ',') {
                this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/,+$/g, "");
            }
        }
        if (this.massUpdateData.DealIds == undefined || this.massUpdateData.DealIds == '' || !reg.test(this.massUpdateData.DealIds)) {
            this.isError["Deal_Ids"] = true;
            this.errorMsg["Deal_Ids"] = "Please enter valid Deal Ids";
            this.isDataValid = false;
        }

        //Validate "Field to Update"/Attribute list dropdown 
        if (!this.massUpdateData.field) {
            this.isError["field"] = true;
            this.errorMsg["field"] = "Please Select Valid Attribute";
            this.isDataValid = false;
        }

        //Validate dropdown Value
        if (this.showDropDown && !this.massUpdateData.dropdownValue) {
            this.isError["dropdownValue"] = true;
            this.errorMsg["dropdownValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        //Validate multiselect Value
        if (this.showMultiSelect && !this.massUpdateData.multiSelectValue) {
            this.isError["multiSelectValue"] = true;
            this.errorMsg["multiSelectValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        if (this.massUpdateData.field.ATRB_LBL == "System Price Point") {
            if (this.massUpdateData.textValue != undefined && this.massUpdateData.textValue != null && this.massUpdateData.textValue != "") {
                let values = this.massUpdateData.textValue.split('$');
                if (values && values.length == 2 && values[0] == '<=' && !Number.isNaN(Number(values[1]))) {
                    if (parseFloat(values[1]) <= 0.00) {
                        this.massUpdateData.textValue = values[0] + '$' + 0.01;
                    }
                }
                else {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Valid Range: <=$0.01 - <=$1,000,000";
                    this.isDataValid = false;
                }
            }
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridResult = process(this.updateResponse, this.state);
    }

    ngOnInit() {
        this.loadAttributes();
    }
}
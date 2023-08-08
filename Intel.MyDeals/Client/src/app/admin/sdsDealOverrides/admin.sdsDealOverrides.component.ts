import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, process, SortDescriptor, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { sdsDealOverridesService } from "./admin.sdsDealOverrides.service";
import { constantsService } from "../constants/admin.constants.service";

@Component({
    selector: "sds-deal-overrides",
    templateUrl: "Client/src/app/admin/sdsDealOverrides/admin.sdsDealOverrides.component.html",
    styleUrls: ['Client/src/app/admin/sdsDealOverrides/admin.sdsDealOverrides.component.css'],
})

export class sdsDealOverridesComponent {
    constructor(private sdsDealOverridesSVC: sdsDealOverridesService, private loggerSvc: logger, private constantsService: constantsService) { }
    private color: ThemePalette = "primary";
    private attr = ['Pricing Table Row', 'Deal'];
    private gridReturnsOrig = [];
    private gridReturns: GridDataResult;
    private gridRules = [];
    private sdsRuleData = { LVL_ID: null, OBJECT_IDS: "", RULE_ID: null };
    private SelectedLevel = "Deal";
    private sdsDealOverridesData = "";
    private resultCount: any = {};
    private ruleCount: any = {};
    private resultType = "";

    public sort: SortDescriptor[] = [
        {
            field: "WIP",
            dir: "asc",
        }
    ];

    public ColumnHeader = [];
    public selectionIDs = [];
    public myGridData: GridDataResult;
    private myGridResult: Array<any>;
    public state: State = {
        //skip: 0,
        //take: 25,
        //group: [],
        //filter: {
        //    logic: "and",
        //    filters: [
        //        {
        //            field: "ACTV_IND",
        //            operator: "eq",
        //            value: true
        //        },
        //    ],
        //}
    };

    accessAllowed = false; // Default to false to prevent unauthorized users
    private validWWID: string;

    checkPageAcess() {
        this.constantsService.getConstantsByName("SDS_OVERRIDE_DEAL_VALIDATION_ADMINS").subscribe((data) => {
            if (data) {
                this.validWWID = data.CNST_VAL_TXT === "NA" ? "" : data.CNST_VAL_TXT;
                this.accessAllowed = this.validWWID.indexOf((<any>window).usrDupWwid) > -1 ? true : false;
            }
        }, (error) => {
            this.loggerSvc.error("SDS Admin Page: Unable to get Access Control List from Constant SDS_OVERRIDE_DEAL_VALIDATION_ADMINS", error)
        });
    }

    dataStateChangeReturns(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
    }

    loadRules() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.sdsDealOverridesSVC.getRules().subscribe((result: Array<any>) => {
                this.gridRules = result;
                this.ruleCount['all'] = result.length;
            }, (error) => {
                this.loggerSvc.error('Error in loading SDS override rules', error);
            });
        }
    }

    bitshift(inpArry) {
        // This function will take an array of ints and shift the bit value for each int, then return the totaled bit-array value
        // Eg. [1,3,4] will return 1101 (first, third, and fourth bit flipped) or decimal 13, [1,2] returns 3, [] returns 0
        let finalVal = 0;
        inpArry.forEach(function (num) {
            let shiftedBit = 1 << (num - 1); // Shift num-1 places to the left
            finalVal = finalVal ^ shiftedBit; // XOR to add bitwise to FinalVal bitvalue
        });
        return finalVal; // Return results
    }

    applyRules() {
        var _objEnterd = false;
        if (this.selectionIDs.length == 0) {
            if (!confirm("You have selected no Rules. This action will clear existing rules from your selected objects. Do you want to continue?")) {
                return;
            }
        }
        if (this.sdsDealOverridesData.length == 0) {
            alert("No Object Id is entered. Please enter at least one Object Id!");
        }
        else {
            var idsArr = this.sdsDealOverridesData.split(',');
            for (var i = 0; i < idsArr.length; i++) {
                if (isNaN(Number(idsArr[i].trim().replace(/\s+/g, '')))) {
                    alert("The Id: " + idsArr[i] + " is not a number, please fix!");
                    _objEnterd = false;
                    break;
                }
                else {
                    _objEnterd = true;
                }
            }
            if (_objEnterd) {
                var ruleJsonString = JSON.stringify(this.selectionIDs);
                const myObj = JSON.parse(ruleJsonString);
                let passedValue = this.bitshift(myObj);
                //alert("Data to Process: Level=" + this.SelectedLevel + ", Selected Objects=" + this.sdsDealOverridesData.replace(/\s+/g, '') + ", Passed Value=" + passedValue);
                this.sdsRuleData.LVL_ID = (this.SelectedLevel == "Deal") ? 5 : 4;
                this.sdsRuleData.OBJECT_IDS = this.sdsDealOverridesData.replace(/\s+/g, '');
                this.sdsRuleData.RULE_ID = passedValue;

                this.sdsDealOverridesSVC.SaveSdsDealOverrides(this.sdsRuleData).subscribe((result: Array<any>) => {
                    let ReturnData = JSON.parse(result.toString());
                    this.ColumnHeader = ReturnData.COLUMNS;
                    let ColumnData = ReturnData.DATA;
                    if (ColumnData != undefined) {
                        this.gridReturnsOrig = ColumnData;
                        this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                        this.resultCount['all'] = ReturnData.DATA.length;
                    }
                    else {
                        this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                        this.resultCount['all'] = 0;
                    }
                    this.resultType = "Apply Rules";
                }, error => {
                    this.loggerSvc.error("Unable to get the result.", error);
                }
                );
            }
        }
    }

    getActiveReport() {
        this.sdsDealOverridesSVC.SdsGetActiveOverrides().subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            this.ColumnHeader = ReturnData.COLUMNS;
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.gridReturnsOrig = ColumnData;
                this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                this.resultCount['all'] = ReturnData.DATA.length;
            }
            else {
                this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                this.resultCount['all'] = 0;
            }
            this.resultType = "Active Report";
        }, error => {
            this.loggerSvc.error("Unable to pull SDS Active Report.", error);
        }
        );
    }

    getHistoryReport() {
        this.sdsDealOverridesSVC.SdsGetHistoryOverrides().subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            this.ColumnHeader = ReturnData.COLUMNS;
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.gridReturnsOrig = ColumnData;
                this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                this.resultCount['all'] = ReturnData.DATA.length;
            }
            else {
                this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                this.resultCount['all'] = 0;
            }
            this.resultType = "History Report";
        }, error => {
            this.loggerSvc.error("Unable to pull SDS Historical Report.", error);
        }
        );
    }

    ngOnInit() {
        this.loadRules();
        this.checkPageAcess();
    }
}
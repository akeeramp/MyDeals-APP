import { Component, OnDestroy, OnInit } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { logger } from "../../shared/logger/logger";
import { SdsDealOverridesService } from "./admin.sdsDealOverrides.service";
import { constantsService } from "../constants/admin.constants.service";

@Component({
    selector: "sds-deal-overrides",
    templateUrl: "Client/src/app/admin/sdsDealOverrides/admin.sdsDealOverrides.component.html",
    styleUrls: ['Client/src/app/admin/sdsDealOverrides/admin.sdsDealOverrides.component.css'],
})
export class SdsDealOverridesComponent implements OnInit, OnDestroy {

    constructor(private sdsDealOverridesService: SdsDealOverridesService,
                private loggerService: logger,
                private constantsService: constantsService) { }

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();

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
    public state: State = {};

    accessAllowed = false; // Default to false to prevent unauthorized users
    private validWwid: string;

    loadRules() {
        this.sdsDealOverridesService.getRules().pipe(takeUntil(this.destroy$)).subscribe((result: Array<any>) => {
            this.gridRules = result;
            this.ruleCount['all'] = result.length;
        }, (error) => {
            this.loggerService.error('Error in loading SDS override rules', error);
        });
    }

    checkPageAccess() {
        this.constantsService.getConstantsByName('SDS_OVERRIDE_DEAL_VALIDATION_ADMINS').subscribe((data) => {
            if (data) {
                this.validWwid = data.CNST_VAL_TXT === "NA" ? "" : data.CNST_VAL_TXT;
                this.accessAllowed = this.validWwid.indexOf((<any>window).usrDupWwid) > -1 ? true : false;
            } else {
                this.loggerService.error("SDS Admin Page: Unable to get Access Control List from Constant SDS_OVERRIDE_DEAL_VALIDATION_ADMINS", null);
            }
        }, (error) => {
            this.loggerService.error("SDS Admin Page: Unable to get Access Control List from Constant SDS_OVERRIDE_DEAL_VALIDATION_ADMINS", error);
        });
    }

    dataStateChangeReturns(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
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
        let _objEnterd = false;
        if (this.selectionIDs.length == 0) {
            if (!confirm("You have selected no Rules. This action will clear existing rules from your selected objects. Do you want to continue?")) {
                return;
            }
        }

        if (this.sdsDealOverridesData.length == 0) {
            alert("No Object Id is entered. Please enter at least one Object Id!");
        } else {
            let idsArr = this.sdsDealOverridesData.split(',');
            for (let i = 0; i < idsArr.length; i++) {
                if (isNaN(Number(idsArr[i].trim().replace(/\s+/g, '')))) {
                    alert("The Id: " + idsArr[i] + " is not a number, please fix!");
                    _objEnterd = false;
                    break;
                } else {
                    _objEnterd = true;
                }
            }

            if (_objEnterd) {
                let ruleJsonString = JSON.stringify(this.selectionIDs);
                const myObj = JSON.parse(ruleJsonString);
                let passedValue = this.bitshift(myObj);
                //alert("Data to Process: Level=" + this.SelectedLevel + ", Selected Objects=" + this.sdsDealOverridesData.replace(/\s+/g, '') + ", Passed Value=" + passedValue);
                this.sdsRuleData.LVL_ID = (this.SelectedLevel == "Deal") ? 5 : 4;
                this.sdsRuleData.OBJECT_IDS = this.sdsDealOverridesData.replace(/\s+/g, '');
                this.sdsRuleData.RULE_ID = passedValue;

                this.sdsDealOverridesService.SaveSdsDealOverrides(this.sdsRuleData).pipe(takeUntil(this.destroy$)).subscribe((result: Array<any>) => {
                    let ReturnData = JSON.parse(result.toString());
                    this.ColumnHeader = ReturnData.COLUMNS;
                    let ColumnData = ReturnData.DATA;
                    if (ColumnData != undefined) {
                        this.gridReturnsOrig = ColumnData;
                        this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                        this.resultCount['all'] = ReturnData.DATA.length;
                    } else {
                        this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                        this.resultCount['all'] = 0;
                    }
                    this.resultType = "Apply Rules";
                }, (error) => {
                    this.loggerService.error("Unable to get the result.", error);
                });
            }
        }
    }

    getActiveReport() {
        this.sdsDealOverridesService.SdsGetActiveOverrides().pipe(takeUntil(this.destroy$)).subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            this.ColumnHeader = ReturnData.COLUMNS;
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.gridReturnsOrig = ColumnData;
                this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                this.resultCount['all'] = ReturnData.DATA.length;
            } else {
                this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                this.resultCount['all'] = 0;
            }
            this.resultType = "Active Report";
        }, (error) => {
            this.loggerService.error("Unable to pull SDS Active Report.", error);
        });
    }

    getHistoryReport() {
        this.sdsDealOverridesService.SdsGetHistoryOverrides().pipe(takeUntil(this.destroy$)).subscribe((result: Array<any>) => {
            let ReturnData = JSON.parse(result.toString());
            this.ColumnHeader = ReturnData.COLUMNS;
            let ColumnData = ReturnData.DATA;
            if (ColumnData != undefined) {
                this.gridReturnsOrig = ColumnData;
                this.gridReturns = { data: orderBy(this.gridReturnsOrig, this.sort), total: this.gridReturnsOrig.length };
                this.resultCount['all'] = ReturnData.DATA.length;
            } else {
                this.gridReturnsOrig = this.gridReturns = null; // Unsets Grid data
                this.resultCount['all'] = 0;
            }
            this.resultType = "History Report";
        }, (error) => {
            this.loggerService.error("Unable to pull SDS Historical Report.", error);
        });
    }

    ngOnInit() {
        this.loadRules();
        this.checkPageAccess();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
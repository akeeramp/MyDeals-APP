import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { contractManagerservice } from "./contractManager.service";
import * as moment from "moment";
import { colorDictionary } from "../../core/angular.constants";
import { ThemePalette } from "@angular/material/core";


@Component({
    selector: "contractManager",
    templateUrl: "Client/src/app/contract/contractManager/contractManager.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/contractManager.component.css']
})

export class contractManagerComponent {
    constructor(private loggerSvc: logger, private contractManagerSvc:contractManagerservice) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private color: ThemePalette = 'primary';
     PCTResultView = false;
    OtherType = []; isECAP = []; isKIT = []
    @Input() contractData;
    @Input() UItemplate;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {}; TrackerNbr = {}; emailCheck = {}; reviseCheck = {}; apprvCheck = {};
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
    grid = { isECAPGrid: false, KITGrid: false, OtherGrid:false}
    public gridData: GridDataResult;
    gridDataSet = {}; approveCheckBox = false; emailCheckBox = false; reviseCheckBox = false;
    titleFilter = "";canActionIcon = true; public isAllCollapsed=true; canEdit = true;
    toggleSum () {
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = !this.isPSExpanded[i]
        });
        this.isAllCollapsed = !this.isAllCollapsed;
    }

    actionReason (actn, dataItem) {
        let rtn = "";
        if (!!dataItem._actionReasons && !!dataItem._actionReasons[actn]) {
            rtn = dataItem._actionReasons[actn];
        }
        return rtn;
    }

    getStageBgColorStyle = function (c) {
        return { backgroundColor: this.getColorStage(c) };
    }
    getColorStage  (d) {
        if (!d) d = "Draft";
        return this.getColor('stage', d);
    }
   getColor (k, c) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }

    getFormatedDim  (dataItem, field, dim, format) {
        const item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
        if (format === "currency") {
            const isDataNumber = /^\d + $/.test(item[dim]);
            if (isDataNumber) return item[dim];
            return (item[dim].includes('No')) ? item[dim]:'$' + item[dim];
        }
        return item[dim];
    }

    getmissingCapCostTitle (item) {
        let ret = "";
        if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1") {
            ret = "Missing CAP";
        }
        if (item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
            ret = "Missing Cost";
        }
        if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1" && item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
            ret = "Missing Cost and CAP";
        }
        return ret;
    }

    onCheckboxChange(checkBoxType, event) {
        if (!event.currentTarget.checked) {
            this[checkBoxType] = false;
        }
    }
    clkAllRow(e, checkBoxType) {
        const isItemChecked = e.currentTarget.checked;
        // In the UI based on sone conditions checkboxes will be shown on hidden, so while checking the check boxes on click of All check box we have to check the conditions and then select the check box
        if (this.contractData.PRC_ST !== undefined) {
            this.contractData.PRC_ST.map((x) => {
                if (this.hasVertical(x)) {
                    if (checkBoxType == "Approve" && this.canAction('Approve', x, false) && this.canAction('Approve', x, true) && this.canActionIcon) { this.apprvCheck[x.DC_ID] = isItemChecked ? true : false;  }
                    else if (checkBoxType == "Revise" && this.canAction('Revise', x, false) && this.canAction('Revise', x, true) && this.canActionIcon) { this.reviseCheck[x.DC_ID] = isItemChecked ? true : false; }
                    else if (checkBoxType == "Email" && this.canEmailIcon) { this.emailCheck[x.DC_ID] = isItemChecked ? true : false;  }
                }

            });
        }
        
    }

    canAction(actn, dataItem, isExists) {
        return dataItem._actions[actn] !== undefined && (isExists || dataItem._actions[actn] === true);
    }

    hasVertical(dataItem) {
        let psHasUserVerticals = true;
        if ((<any>window).usrRole === "DA") {
            if ((<any>window).usrVerticals.length > 0) {
                const userVerticals = (<any>window).usrVerticals.split(",");
                const dataVerticals = dataItem.VERTICAL_ROLLUP.split(",");
                psHasUserVerticals =  userVerticals.some((v) => dataVerticals.indexOf(v) >= 0);
            }
            return psHasUserVerticals;
            // else, DA is All Verticals and gets a free pass
        }
        return psHasUserVerticals;
    }

  
    concatDimElements (passedData, field) {
        const data = [];
        const checkField=!!passedData[field];
        if (checkField) {
            Object.keys(passedData[field]).forEach(function (key, index) {
                if (key.indexOf("___") >= 0) {
                    data.push(passedData[field][key]);
                }
            });
        }
        this.TrackerNbr[passedData.DC_ID]= data.join(", ");
        const tmplt = '<span class="ng-binding">' + this.TrackerNbr[passedData.DC_ID] + '</span>';
        return tmplt;
    }


    togglePt(pt) {
        const ptDcId = pt.DC_ID;
        //check whether arrow icon is expanded/collapsed ,only if it is expanded then call API to get the data
        if (this.isPTExpanded[ptDcId]) {
            this.contractManagerSvc.getWipSummary(pt.DC_ID).subscribe((response) => {
                if (response !== undefined) {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].WF_STG_CD === "Draft") response[i].WF_STG_CD = response[i].PS_WF_STG_CD;
                        if (response[i].WF_STG_CD === "Hold") response[i].PASSED_VALIDATION = "Complete";
                        if (response[i].OBJ_SET_TYPE_CD == "ECAP") {
                            this.isECAP[ptDcId] = true; this.OtherType[ptDcId] = false; this.isKIT[ptDcId] = false
                        }
                        else if (response[i].OBJ_SET_TYPE_CD == "KIT") { this.isECAP[ptDcId] = false; this.OtherType[ptDcId] = false; this.isKIT[ptDcId] = true }
                        else { this.OtherType[ptDcId] = true; this.isECAP[ptDcId] = false; this.isKIT[ptDcId] = false }
                    }

                    this.gridData = response;
                    this.gridDataSet[pt.DC_ID] = this.gridData;
                }
            })
        }
    }


    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.contractData?.PRC_ST.map((x, i) => {
            //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
            this.isPSExpanded[i] = false;
            if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
        })
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "contractManager",
    downgradeComponent({
        component: contractManagerComponent,
    })
);
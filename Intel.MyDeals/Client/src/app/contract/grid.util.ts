import { DE_Common_Util } from '../contract/DEUtils/DE_Common_util';
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { DE_Load_Util } from './DEUtils/DE_Load_util';
import { PTE_Config_Util } from './PTEUtils/PTE_Config_util';
import * as moment from 'moment-timezone';
import { saveAs } from '@progress/kendo-file-saver';
import { Workbook } from '@progress/kendo-angular-excel-export';
import { ExcelExport } from "../contract/excelExport.util"
export class GridUtil {
    static uiControlWrapper(passedData, field, format) {
        var msg = "";
        var msgClass = "";
        if (passedData['PAYOUT_BASED_ON'] != undefined && passedData['PAYOUT_BASED_ON'] == 'Billings' && (field == 'REBATE_BILLING_START' || field == 'REBATE_BILLING_END')) {
            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv">';
            tmplt += '</div>';
            return tmplt
        }
        if (field == 'REBATE_BILLING_START' && passedData['REBATE_TYPE'] != 'TENDER' && passedData['PAYOUT_BASED_ON'] == 'Consumption') {
            var dt1 = new Date(passedData['START_DT']);
            var dt2 = new Date(passedData['REBATE_BILLING_START']);
            var months;
            months = (dt1.getFullYear() - dt2.getFullYear()) * 12;
            months -= dt2.getMonth();
            months += dt1.getMonth();
            months = months <= 0 ? 0 : months;
            if (months > 6) {
                msg = "title = 'The Billing Start Date is more than six months before the Deal Start Date.'";
                msgClass = "isSoftWarnCell";
            }

            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv ' + msgClass + '" style="line-height: 1em;" ' + msg;
            if (passedData[field] != undefined && passedData[field] != null)
                tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
        else if (field == 'NUM_OF_TIERS' && passedData['OBJ_SET_TYPE_CD'] == "DENSITY") {
            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv"';
            tmplt += '    <div class="ng-binding vert-center" ' + ' ' + ')">' + (passedData['NUM_OF_TIERS'] / passedData['NUM_OF_DENSITY']) + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
        else if (field == 'CREDIT_AMT') {
            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv creditcolor' + this.getClassNm(passedData, field) + '"';
            if (passedData['CREDIT_AMT'] != undefined && passedData['CREDIT_AMT'] != 0)
                tmplt += '    <div class="ng-binding vert-center">(' + passedData[field] + ')"</div>';            
            tmplt += '</div>';
            return tmplt;
        }
        else {
            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            if (passedData[field] != undefined && passedData[field] != null)
                tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
    }
    static uiControlDealWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '  <div class="ng-binding vert-center">';
        tmplt += '  <span class="cn-deal-popup-icon "  title="Click to view a Quick Look at deal #' + passedData[field] + '">';
        tmplt += '  <span class="fa-stack" style="height: 16px; line-height: 18px; margin-bottom: 3px;"> <i class="fa fa-circle-o-notch fa-rotate-90" style=" margin-top: 1px; margin-left: -4px;"></i> <i class="fa fa-bars fa-stack-1x" style="padding-top: 1px; font-size: 9px; color: #FFA300;margin-left: -2px;"></i> </span> </span> ';
        tmplt += ' <span style="padding-left: 0px;"> '
        if (passedData[field] != undefined && passedData[field] != null)
            tmplt += passedData[field];
        tmplt += '  </span>  </div>';
        return tmplt;
    }
    static uiCustomerControlWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv isReadOnlyCell">';
        if (passedData['CUST_ACCNT_DIV'] === undefined || passedData['CUST_ACCNT_DIV'] === "")
            tmplt += '     <div class="ng-binding vert-center">' + passedData.Customer.CUST_NM + '</div>';
        if (passedData['CUST_ACCNT_DIV'] !== undefined && passedData['CUST_ACCNT_DIV'] !== "")
            tmplt += '     <div class="ng-binding vert-center">' + passedData["CUST_ACCNT_DIV"] + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiDimControlWrapper(passedData, field, dim) {
        var tmplt = '';

        if (passedData[field] === undefined) return tmplt;

        if (dim == "20_____2" && passedData.HAS_SUBKIT == "0") {
            //no subkit allowed case
            tmplt += '<div class="uiControlDiv isReadOnlyCell">';
            tmplt += '<div class="vert-center">No Sub KIT</div>';
            tmplt += '</div>';
        } else {
            tmplt += '<div class="uiControlDiv dealCell ' + this.getClassNm(passedData, field) + '">';
            if ((dim == "20_____2" || dim == "20_____1") && field == "ECAP_PRICE") {
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field + '_____' + dim])
                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field + '_____' + dim] + '"></div>';
            } else {
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            }
            if (passedData[field][dim] != undefined && passedData[field][dim] != null)
                tmplt += '    <div class="ng-binding vert-center">' + passedData[field][dim] + '</div>';
            tmplt += '</div></div>';
        }
        return tmplt;
    }
    static uiValidationErrorDetail(passedData) {
        var values: string[] = Object.values(passedData._behaviors.validMsg);
        var formattedMessage = '';
        values.forEach((msg) => {
            if (msg.indexOf("\n") < 0) {
                msg += "\n";
            }
            formattedMessage += msg.toString().replace(/'/g, "");
        });
        //fixing for validation alert icon issue, while fixing the deal error through admin screen
        if ((values == null || values == undefined || values.length == 0) && formattedMessage == '') {
            passedData.PASSED_VALIDATION = "Complete";
        }
        var classNm = "";
        if (passedData.PASSED_VALIDATION === undefined && passedData.PASSED_VALIDATION === "")
            classNm = "intelicon-protection-solid";
        else if (passedData.PASSED_VALIDATION == "Complete")
            classNm = "intelicon-protection-checked-verified-solid";
        else
            classNm = "intelicon-alert-solid";
        var titleMsg = "Validation: ";
        if (passedData.PASSED_VALIDATION === "Dirty" || passedData.PASSED_VALIDATION == "0")
            titleMsg += formattedMessage;
        else
            titleMsg += passedData.PASSED_VALIDATION;
        var tmplt = "<div class='uiControlDiv isReadOnlyCell'><div class='vert-center'><i class='valid-icon iConFont validf_" + passedData.PASSED_VALIDATION + " " + classNm + "' title='" + titleMsg + "'></i></div></div>";
        return tmplt;
    }
    static uiControlScheduleWrapper(passedData) {
        if (passedData.OBJ_SET_TYPE_CD !== 'VOL_TIER' && passedData.OBJ_SET_TYPE_CD !== 'FLEX' && passedData.OBJ_SET_TYPE_CD !== 'REV_TIER')
            return "";
        var fields = (passedData.OBJ_SET_TYPE_CD === 'VOL_TIER' || passedData.OBJ_SET_TYPE_CD === 'FLEX') ? PTE_Config_Util.volTierFields : PTE_Config_Util.revTierFields;
        var tmplt = '<div class="col-md-12">';
        tmplt += '<div class="col-md-12 rowHeight">';
        for (var t = 0; t < fields.length; t++) {
            if (fields[t].title === "Tier")
                tmplt += '<div class="col-md-3 tierHeader">' + fields[t].title + '</div>';
            else
                tmplt += '<div class="col-md-3 tierHeader tierBorder lastcolstyle">' + fields[t].title + '</div>';
        }
        tmplt += '</div>';
        var numTiers = 0;
        var tiers = passedData.TIER_NBR;
        for (var key in tiers) {
            if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
                numTiers++;
                var dim = "10___" + numTiers;
                tmplt += '<div class="col-md-12 rowDetailHeight">';
                for (var f = 0; f < fields.length; f++) {
                    tmplt += '<div class="col-md-3 rowValueHeight rowRightBorder textRightAlign' + this.getClassNm(passedData, fields[f].field) + '">';
                    if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim])
                        tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim] + '"></div>';
                    if (passedData[fields[f].field] && passedData[fields[f].field][dim] != undefined && passedData[fields[f].field][dim] != null)
                        tmplt += '<span class="ng-binding dataPadding">' + passedData[fields[f].field][dim] + '</span>';
                    tmplt += '</div>';
                }
                tmplt += '</div>';
            }
        }

        tmplt += '</div>';
        return tmplt;
    }
    static uiPositiveDimControlWrapper = function (passedData, field) {
        var data = passedData[field];

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

        var tmplt = '<div class="col-md-12">';
        for (var index in sortedKeys) { //only looking for positive dim keys
            var dimkey = sortedKeys[index];
            if (typeof (dimkey) != ('function') && data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                tmplt += '<div class="col-md-12 rowDetailHeight">';
                tmplt += '<div';
                tmplt += ' class="kitRowValue' + this.getClassNm(passedData, field) + '">';
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined && passedData._behaviors.isError[field + '_' + dimkey] != undefined && passedData._behaviors.isError[field + '_' + dimkey])
                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field + '_' + dimkey] + '"></div>';
                if (passedData[field][dimkey] != undefined && passedData[field][dimkey] != null && passedData[field][dimkey] != 'No YCS2' && passedData[field][dimkey] != 'No CAP')
                    tmplt += '<span class="ng-binding dataPadding">' + passedData[field][dimkey] + '</span>';
                tmplt += '</div>';
                tmplt += '</div>';
            }
        }
        tmplt += '</div>';
        if (tmplt == '<div class="col-md-12"></div>') {   //if table comes out empty, just set same behavior as single dim version, generally just a blank readonly div
            tmplt = this.uiDimControlWrapper(passedData, field, '20___0');
        }
        return tmplt;
    }
    static uiReadonlyControlWrapper = function (passedData, field) {
        var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
        if (passedData[field] != undefined && passedData[field] != null)
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiDimTrkrControlWrapper = function (passedData) {
        var tmplt = '';
        var dim = "";
        var field = "TRKR_NBR";
        var data = passedData[field];
        if (data === undefined || Object.keys(data) === undefined || Object.keys(data) === null) return "";
        var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv' + this.getClassNm(passedData, field) + '"';
        tmplt += '<div class="vert-center">';
        dim = "20_____2"
        if (passedData[field][dim] != null && passedData[field][dim] != undefined) {
            tmplt += '    <div class="ng-binding">' + passedData[field][dim] + '</div>';
        }
        dim = "20_____1"
        if (passedData[field][dim] != null && passedData[field][dim] != undefined) {
            tmplt += '    <div class="ng-binding">' + passedData[field][dim] + '</div>';
        }
        for (var index in sortedKeys) { //only looking for positive dim keys
            dim = sortedKeys[index];
            if (data.hasOwnProperty(dim) && dim.indexOf("___") >= 0 && dim.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                if (passedData[field][dim] != undefined && passedData[field][dim] != null)
                    tmplt += '    <div class="ng-binding">' + passedData[field][dim] + '</div>';
            }
        }
        tmplt += '</div></div>';
        return tmplt;
    }
    static uiStartDateWrapper = function (passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv dealCell' + this.getClassNm(passedData, field) + '"';
        tmplt += '    <div class="ng-binding vert-center">';
        if (this.displayFrontEndDateMessage(passedData))
            tmplt += '<span class="vert-center" style="top: 20% !important"> <i class="intelicon-information dateWrapper" title="If the deal start date is in the past, the deal start date will change to the date when the deal becomes active."></i> </span>'
        if (passedData[field] != undefined && passedData[field] != null)
            tmplt += '    <span class="ng-binding vert-center alert-divider" style="top: 20% !important">' + passedData[field] + '</span>';
        tmplt += '</div></div>';
        return tmplt;
    }
    static uiControlEndDateWrapper = function (passedData, field) {
        var classNm = "";
        if (passedData.EXPIRE_FLG == "1")
            classNm = 'redfont';
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv dealCell defence-read-cell' + this.getClassNm(passedData, field).replace(" isRequiredCell", "") + '"';
        if (passedData[field] != undefined && passedData[field] != null)
            tmplt += '    <div class="ng-binding vert-center ' + classNm + '">' + passedData[field] + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiControlScheduleWrapperDensity = function (passedData) {
        var tmplt = '<div class="col-md-12">';
        var fields = PTE_Config_Util.densityFields;

        tmplt += '<div class="col-md-12 rowHeight">';
        for (var t = 0; t < fields.length; t++) {
            if (fields[t].title === "Tier")
                tmplt += '<div class="col-md-2 tierHeader">' + fields[t].title + '</div>';
            else if (fields[t].title === "Band" || fields[t].title === "Rate")
                tmplt += '<div class="col-md-3 tierHeader tierBorder">' + fields[t].title + '</div>';
            else
                tmplt += '<div class="col-md-2 tierHeader tierBorder">' + fields[t].title + '</div>';
        }
        tmplt += '</div>';

        var numTiers = 0;
        var tiers = passedData.TIER_NBR;
        for (var key in tiers) {
            if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
                numTiers++;
                tmplt += '<div class="col-md-12 densityRow">';
                for (var f = 0; f < fields.length; f++) {
                    var dim = (fields[f].field == "DENSITY_BAND" || fields[f].field == "DENSITY_RATE") ? "8___" : "10___" + numTiers;
                    if (fields[f].field == "DENSITY_BAND" || fields[f].field == "DENSITY_RATE") {
                        tmplt += '<div class="col-md-3 densityPadding">';

                        tmplt += '<div>';
                        for (var bands = 1; bands <= passedData.NUM_OF_DENSITY; bands++) {
                            tmplt += '<div class="col-md-12 densityRow">';
                            tmplt += '<div ';

                            if (fields[f].field == "DENSITY_BAND") {
                                tmplt += 'class="col-md-12' + this.getClassNm(passedData, fields[f].field) + '">'
                                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands])
                                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim + bands] + '"></div>';
                                if (passedData[fields[f].field] && passedData[fields[f].field][dim + bands] != undefined && passedData[fields[f].field][dim + bands] != null)
                                    tmplt += '<span class="ng-binding dataPadding">' + passedData[fields[f].field][dim + bands] + '</span>';
                            }
                            else {
                                tmplt += 'class="col-md-12' + this.getClassNm(passedData, fields[f].field) + '">'
                                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands + '____' + key] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands + '____' + key])
                                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim + bands + '____' + key] + '"></div>';
                                if (passedData[fields[f].field][dim + bands + '____' + key] != undefined && passedData[fields[f].field][dim + bands + '____' + key] != null)
                                    tmplt += '<span class="ng-binding dataPadding">' + passedData[fields[f].field][dim + bands + '____' + key] + '</span>';
                            }
                            tmplt += '</div>';
                            tmplt += '</div>';
                        }
                        tmplt += '</div>';

                        tmplt += '</div>';
                    }
                    else {
                        tmplt += '<div class="col-md-2' + this.getClassNm(passedData, fields[f].field) + '">';
                        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim])
                            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim] + '"></div>';
                        if (passedData[fields[f].field][dim] != undefined && passedData[fields[f].field][dim] != null)
                            tmplt += '<span class="ng-binding dataPadding">' + passedData[fields[f].field][dim] + '</span>';
                        tmplt += '</div>';
                    }
                }
                tmplt += '</div>';
            }
        }
        tmplt += '</div>';
        return tmplt;
    }
    static getFormatedDim = function (dataItem, field, dim) {
        var item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; // Used to return "undefined" which would show on the UI.
        return item[dim];
    }
    static displayFrontEndDateMessage = function (dataItem) {
        var isFrontendDeal = (dataItem.PROGRAM_PAYMENT === undefined ? false : dataItem.PROGRAM_PAYMENT.indexOf('Frontend') !== -1); // If not there, default to false, else check for front end
        var wipDealDraftStage = (dataItem.WF_STG_CD === undefined ? false : dataItem.WF_STG_CD.indexOf('Draft') !== -1); // If not there, default to false, else check for WF STG end

        return (isFrontendDeal && wipDealDraftStage);
    }
    static getClassNm(passedData, field) {
        var classNm = "";
        if (passedData != undefined && passedData._behaviors != undefined) {
            if (passedData._behaviors.isHidden != undefined && passedData._behaviors.isHidden[field])
                classNm += " isHiddenCell";
            if (passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field])
                classNm += " isReadOnlyCell";
            if (passedData._behaviors.isRequired != undefined && passedData._behaviors.isRequired[field])
                classNm += " isRequiredCell";
            if (passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                classNm += " isErrorCell";
            if (passedData._behaviors.isSaved != undefined && passedData._behaviors.isSaved[field])
                classNm += " isSavedCell";
            if (passedData._behaviors.isDirty != undefined && passedData._behaviors.isDirty[field])
                classNm += " isDirtyCell";
        }
        return classNm;
    }
    static uiBoolControlWrapper = function (passedData, field) {
        var tmplt = '<div class="uiControlDiv isReadOnlyCell"';
        if (passedData[field]!= undefined && passedData[field] != null)
            tmplt += '    <div class="ng-binding vert-center">' + DE_Common_Util.showBool(passedData[field]) + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiParentControlWrapper = function (passedData) {
        var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
        tmplt += '    <div class="ng-binding vert-center">' + this.stgFullTitleChar(passedData) + '</div>';    //note: opGrid's showStage() calls gridUtils.stgFullTitleChar() in this file
        tmplt += '</div>';
        return tmplt;
    }
    static stgFullTitleChar = function (passedData) {
        return passedData.WF_STG_CD === "Draft" ? passedData.PS_WF_STG_CD : passedData.WF_STG_CD;
    }
    static stgOneChar = function (passedData) {
        if (passedData.WF_STG_CD === "Draft") {
            return (passedData.PS_WF_STG_CD === undefined) ? "&nbsp;" : passedData.PS_WF_STG_CD[0];
        }
        else {
            return (passedData.WF_STG_CD === undefined) ? "&nbsp;" : passedData.WF_STG_CD[0];
        }
    }
    static uiProductDimControlWrapper = function (passedData, type) {
        // We need to get the mydeals product, split them show them in prd_bckt split
        var data = passedData["TITLE"].split(',');
        var tmplt = '';
        if (type == "kit") {
            tmplt += '<div class="col-md-12">';
            for (var i = 0; i < data.length; i++) {
                tmplt += '<div class="col-md-12 rowHeight">';
                tmplt += '<div class="textRightAlign isReadOnlyCell">';
                tmplt += '<span class="ng-binding dataPadding gridCellSpan">' + data[i] + '</span>';
                tmplt += '</div>';
                tmplt += '</div>';
            }
            tmplt += '</div>';
        } else if (type == "subkit" && passedData.HAS_SUBKIT == "1") {
            tmplt += '<div class="col-md-12">';
            for (var i = 0; i < data.length; i++) {
                if (i <= 1) {   //primary or secondary1
                    tmplt += '<div class="col-md-12 rowHeight">';
                    tmplt += '<div class="textRightAlign isReadOnlyCell">';
                    tmplt += '<span class="ng-binding dataPadding gridCellSpan">' + data[i] + '</span>';
                    tmplt += '</div>';
                    tmplt += '</div>';
                } else {
                    tmplt += '<div class="col-md-12 rowHeight">';
                    tmplt += '<div class="textRightAlign isReadOnlyCell">';
                    tmplt += '<span class="dataPadding"></span>';
                    tmplt += '</div>';
                    tmplt += '</div>';
                }
            }
            tmplt += '</div>';
        } else {
            //no subkit allowed case, i.e. type = "subkit" and HAS_SUBKIT == 0
            tmplt += '<div class="uiControlDiv isReadOnlyCell">';
            tmplt += '<div class="ng-binding vert-center">No Sub KIT</div>';
            tmplt += '</div>';
        }
        return tmplt;
    }
    static uiProductControlWrapper = function (passedData) {
        var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
        tmplt += '     <div class="ng-binding vert-center gridCellSpan" title="' + passedData.TITLE + '">' + passedData.TITLE + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiMultiselectArrayControlWrapper = function (passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv msgClassStyles' + this.getClassNm(passedData, field) + '"';
        if (passedData[field] != undefined && passedData[field] != null)
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
        tmplt += '</div>';

        return tmplt;
    }
    static uiPrimarySecondaryDimControlWrapper = function (passedData) {
        var data = passedData["ECAP_PRICE"];    //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order
        var setPrimary = true;
        var tmplt = '<div class="col-md-12">';
        for (var index in sortedKeys) { //only looking for positive dim keys
            var dimkey = sortedKeys[index];
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                tmplt += '<div class="col-md-12 rowHeight">';
                tmplt += '<div class="textRightAlign isReadOnlyCell">';
                if (setPrimary) {
                    tmplt += '<span class="ng-binding dataPadding">P</span>';
                    setPrimary = false;
                } else {
                    tmplt += '<span class="ng-binding dataPadding">S</span>';
                }
                tmplt += '</div>';
                tmplt += '</div>';
            }
        }
        tmplt += '</div>';
        return tmplt;
    }
    static uiKitCalculatedValuesControlWrapper = function (passedData, kittype, value) {
        var tmplt = '';
        tmplt += '<div class="uiControlDiv isReadOnlyCell">';
        if (passedData.HAS_SUBKIT == "0" && kittype == "subkit") {
            tmplt += '    <div class="vert-center">No Sub KIT</div>';
        } else {
            tmplt += '    <div class="ng-binding vert-center">' + value + '</div>';
        }
        tmplt += '</div>';
        return tmplt;
    }
    static uiControlBackEndRebateWrapper = function (value) {
        var tmplt = '';
        tmplt += '<div class="uiControlDiv isReadOnlyCell">';
        tmplt += '    <div class="ng-binding vert-center">' + value + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiTotalDiscountPerLineControlWrapper = function (passedData) {
        var data = passedData["QTY"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - are QTY and dscnt_per_line required columns?

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

        var tmplt = '<div class="col-md-12">';
        for (var index in sortedKeys) { //only looking for positive dim keys
            var dimkey = sortedKeys[index];
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                var value = new CurrencyPipe('en-us').transform(passedData["QTY"][dimkey] * passedData["DSCNT_PER_LN"][dimkey], 'USD', 'symbol', '1.2-2');
                tmplt += '<div class="col-md-12 rowHeight">';
                tmplt += '<div class="textRightAlign isReadOnlyCell">';
                tmplt += '<span class="ng-binding dataPadding">' + value + '</span>';
                tmplt += '</div>';
                tmplt += '</div>';
            }
        }
        tmplt += '</div>';
        return tmplt;
    }
    static uiMoneyDatesControlWrapper(passedData, field, startDt, endDt, dimKey) {
        var msg = "";
        var msgClass = "";
        var tmplt = '';
        if (!dimKey) dimKey = "";
        if (dimKey !== "" && !!passedData[field]) {
            if (passedData[field][dimKey] !== undefined) passedData[field][dimKey] = passedData[field][dimKey].replace(/$|,/g, '');
        } else {
            if (passedData[field] !== undefined) passedData[field] = passedData[field].replace(/$|,/g, '');
        }
        var fieldVal = (dimKey !== "")
            ? !!passedData[field] && !!passedData[field][dimKey] ? passedData[field][dimKey] : ""
            : !!passedData[field] && !!passedData[field] ? passedData[field] : "";
        var startVal = (dimKey !== "")
            ? !!passedData[startDt] && !!passedData[startDt][dimKey] ? passedData[startDt][dimKey] : ""
            : !!passedData[startDt] && !!passedData[startDt] ? passedData[startDt] : "";

        if (field === "CAP" && fieldVal === "No CAP") {
            tmplt += '<div class="uiControlDiv isSoftWarnCell capInfoWrapper">';
            tmplt += '<div class="capLineStyle">No CAP</div>';
            if (startVal !== "" && startVal !== '01/01/1900') {
                tmplt += '<div>Availability:<span class="ng-binding">' + passedData[startDt][dimKey] + '</span><span></div>';
            }
            tmplt += '</div>';

        } else if (field === "YCS2_PRC_IRBT" && fieldVal === "No YCS2") {
            tmplt += '<div class="uiControlDiv isSoftWarnCell capInfoWrapper">';
            tmplt += '<div class="capLineStyle">No YCS2</div>';
            if (startVal !== "" && startVal !== '01/01/1900') {
                tmplt += '<div>Availability:<span class="ng-binding">' + passedData[startDt][dimKey] + '</span><span></div>';
            }
            tmplt += '</div>';

        } else {
            if (field === "CAP") {
                var cap = (dimKey !== "")
                    ? !!passedData[startDt] && !!passedData.CAP[dimKey] ? parseFloat(passedData.CAP[dimKey].toString().replace(/,|$/g, '')) : ""
                    : !!passedData[startDt] && !!passedData.CAP ? parseFloat(passedData.CAP.toString().replace(/,|$/g, '')) : "";

                var ecap = (dimKey !== "")
                    ? !!passedData[startDt] && !!passedData.ECAP_PRICE[dimKey] ? parseFloat(passedData.ECAP_PRICE[dimKey].toString().replace(/,|$/g, '')) : ""
                    : !!passedData[startDt] && !!passedData.ECAP_PRICE ? parseFloat(passedData.ECAP_PRICE.toString().replace(/,|$/g, '')) : "";

                if (ecap > cap) {
                    var dsplCap = cap === "" ? "No CAP" : cap;
                    var dsplEcap = ecap === "" ? "No ECAP" : ecap;
                    msg = "ECAP ($" + dsplEcap + ") is greater than the CAP ($" + dsplCap + ")";
                    msgClass = "isSoftWarnCell";
                }
            }
            var capText = '<span class="ng-binding boldFont">' + new CurrencyPipe('en-us').transform(parseFloat(passedData[field][dimKey]), 'USD', 'symbol', '1.2-2') + '</span>';

            if (fieldVal !== "" && fieldVal.indexOf("-") > -1) {
                msg = "CAP price " + fieldVal + " cannot be a range.";
                msgClass = "isSoftWarnCell";
                capText = '<span class="ng-binding boldFont">' + passedData[field][dimKey] + '</span>';
            }
            if (passedData != undefined && passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            if (msgClass == "isSoftWarnCell")
                tmplt += '<div class="uiControlDiv msgClassStyles ' + msgClass + '"';
            else
                tmplt += '<div class="uiControlDiv msgClassStyles ' + msgClass + ' ' + this.getClassNm(passedData, field) + '"';
            if (msg != "") {
                tmplt += ' title="' + msg + '" > ';
            }
            else
                tmplt += '>';
            tmplt += '<div>' +capText + '</div>';
            tmplt += '    <div>';
            tmplt += '    <span class="ng-binding">' + passedData[startDt][dimKey] + '</span> - ';
            tmplt += '    <span class="ng-binding">' + passedData[endDt][dimKey] + '</span>';
            tmplt += '    </div>';
            tmplt += '</div>';
        }
        return tmplt;
    }    
    static uiCrDbPercWrapper = function (passedData) {
        var percData = DE_Load_Util.getTotalDealVolume(passedData);

        var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
        tmplt += '    <div class="ng-binding vert-center">';
        if (passedData["VOLUME"] !== undefined && percData.vol !== 999999999) {
            tmplt += '      <div class="progress .creditDebitAlignmentStyle">';
            tmplt += '        <div class="progress-bar" role="progressbar" value="' + percData.perc + '" min="0" max="100" style="width: ' + percData.perc + '%;"></div>';
            tmplt += '      </div>';
            tmplt += '      <div class="progressBarTextSize">' + DE_Load_Util.numberWithCommas(percData.numerator) + ' out of ' + DE_Load_Util.numberWithCommas(percData.vol) + '</div>';
        } else {
            tmplt += '      <div>' + DE_Load_Util.numberWithCommas(percData.numerator) + '</div>';
        }
        tmplt += '    </div>';
        tmplt += '</div>';
        return tmplt;
    }
    static getResultSingleIcon = function (passedData, field) {
        var result = passedData[field];
        var iconNm = this.getResultSingleIconNm(result);

        if (field === 'MEETCOMP_TEST_RESULT') {
            return '<div class="text-center uiControlDiv isReadOnlyCell cursorStyle"><div class="vert-center">' + iconNm + '</div></div>';
        }
        else {
            if ((<any>window).usrRole === 'DA' || ((<any>window).usrRole === 'GA' && (<any>window).isSuper || (<any>window).usrRole === 'SA' || (<any>window).usrRole === 'Legal')) { // Cost Test visable by Super GA, DA, and SA
                return '<div class="text-center uiControlDiv isReadOnlyCell cursorStyle"><div class="vert-center">' + iconNm + '</div></div>';
            }
            else {
                return '<div class="text-center uiControlDiv isReadOnlyCell">&nbsp;</div>';
            }
        }
    }
    static getResultSingleIconNm = function (result) {
        var iconNm = DE_Load_Util.getResultMappingIconClass(result);
        var iconTitle = iconNm === "intelicon-help-outlined" ? "Not Run Yet" : result;
        return '<i class="iConFont ' + iconNm + '" title="' + iconTitle + '"></i>';
    }
    static getMissingCostCapIcon = function (data) {
        var title = this.getMissingCostCapTitle(data);

        if (title === '') return '<div class="uiControlDiv isReadOnlyCell"></div>';
        return '<div class="text-center uiControlDiv isReadOnlyCell"><div class="vert-center"><i class="intelicon-help-solid bigIcon missingCapStyle" title="' + title + '"></i></div></div>';
    }
    static getMissingCostCapTitle = function (data) {
        var title = '';
        if ((<any>window).usrRole === 'DA' || ((<any>window).usrRole === 'GA' || (<any>window).usrRole === 'SA' || (<any>window).usrRole === 'Legal')) {
            if (data.CAP_MISSING_FLG !== undefined && data.CAP_MISSING_FLG == "1") {
                title = 'Missing CAP';
            }
            if (data.COST_MISSING_FLG !== undefined && data.COST_MISSING_FLG == "1") {
                title = 'Missing Cost';
            }
            if (data.COST_MISSING_FLG !== undefined && data.COST_MISSING_FLG == "1" && data.CAP_MISSING_FLG !== undefined && data.CAP_MISSING_FLG == "1") {
                title = 'Missing Cost and CAP';
            }
        }
        return title;
    }
    static stripMilliseconds = function (dateTimeStr) {
        if (typeof dateTimeStr === 'object') {
            dateTimeStr = dateTimeStr.toDateString('M/d/yyyy hh:mm tt');
        }
        let idx = dateTimeStr.search(/\.\d+$/)
        if (idx != -1) {
            return dateTimeStr.substring(0, idx);
        }
        return dateTimeStr;
    }
    static convertLocalToPST(strDt) {
        moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
        return moment.tz(strDt, "America/Los_Angeles").format("MM/DD/YY HH:mm:ss");
    }
    static getProductMbrSid(dimProduct, dimKey) {
        let prd_mbr_sid;
        if (!dimKey) {
            dimKey = "20___0";
        }
        for (var p in dimProduct) {
            if (dimProduct.hasOwnProperty(p) && p.lastIndexOf(dimKey) > -1) {
                prd_mbr_sid = dimProduct[p];
                if (isNaN(prd_mbr_sid)) {
                    var splitKey = p.split("___");
                    if (splitKey.length > 1) {
                        prd_mbr_sid = splitKey[1];
                    }
                    else {
                        prd_mbr_sid = 0;
                    }
                }
                else if (!isNaN(prd_mbr_sid)) {
                    var splitKey = p.split("___");
                    if (splitKey.length > 1 && prd_mbr_sid != splitKey[1]) {
                        prd_mbr_sid = splitKey[1];
                    }
                }
                break;
            }
        }
        return prd_mbr_sid;
    }

    static dsToExcel(gridColumns, data, title) {
        var rows = [{ cells: [] }];
        var rowsProd = [{ cells: [] }];
        var colWidths = [];
        var colHidden = false;
        var hasProds = false;
        var addAlways = [
            {
                field: "NOTES",
                title: "Notes"
            }
        ];
        var forceHide = [];

        if (!((<any>window).usrRole === "DA" || ((<any>window).usrRole === "GA" && (<any>window).isSuper) || ((<any>window).usrRole === "Legal") || ((<any>window).usrRole === "SA"))) {
            forceHide.push("COST_TEST_RESULT")
        }

        if (!((<any>window).usrRole === "DA" || ((<any>window).usrRole === "GA") || ((<any>window).usrRole === "Legal") || ((<any>window).usrRole === "SA"))) {
            forceHide.push("MEETCOMP_TEST_RESULT")
        }

        // Create element to generate templates in.
        var elem = document.createElement('div');

        var colList = [];
        for (var i = 0; i < gridColumns.length; i++) {
            colHidden = gridColumns[i].hidden !== undefined && gridColumns[i].hidden === true;
            if (forceHide.indexOf(gridColumns[i].field) >= 0) colHidden = true;
            if (!colHidden && (gridColumns[i].bypassExport === undefined || gridColumns[i].bypassExport === false)) {
                var colTitle = gridColumns[i].excelHeaderLabel !== undefined && gridColumns[i].excelHeaderLabel !== ""
                    ? gridColumns[i].excelHeaderLabel
                    : gridColumns[i].title;

                rows[0].cells.push({
                    value: colTitle,
                    textAlign: "center",
                    background: "#0071C5",
                    color: "#ffffff",
                    wrap: true
                });
                colList.push(gridColumns[i].field);

                if (gridColumns[i].width !== undefined) {
                    colWidths.push({ width: parseInt(gridColumns[i].width) });
                } else {
                    colWidths.push({ autoWidth: true });
                }
            }
        }

        for (var a = 0; a < addAlways.length; a++) {
            if (colList.indexOf(addAlways[a].field) < 0) {
                rows[0].cells.push({
                    value: addAlways[a].title,
                    textAlign: "center",
                    background: "#0071C5",
                    color: "#ffffff",
                    wrap: true
                });
                colWidths.push({ autoWidth: true });
            }
        }
        // set prod title
        var titles = ["Deal #", "Deal Product Name", "Product Type", "Product Category", "Brand", "Family", "Processor", "Product Name", "Material ID", "Division", "Op Code", "Prod Start Date", "Prod End Date"];
        for (var t = 0; t < titles.length; t++) {
            rowsProd[0].cells.push({
                value: titles[t],
                textAlign: "center",
                background: "#0071C5",
                color: "#ffffff",
                wrap: true
            });
        }
        for (var i = 0; i < data.length; i++) {
            //push single row for every record
            var dataItem = data[i];
            if (dataItem !== undefined && dataItem !== null) {
                var cells = [];
                for (var c = 0; c < gridColumns.length; c++) {
                    colHidden = gridColumns[c].hidden !== undefined && gridColumns[c].hidden === true;
                    if (forceHide.indexOf(gridColumns[c].field) >= 0) colHidden = true;
                    if (!colHidden && (gridColumns[c].bypassExport === undefined || gridColumns[c].bypassExport === false)) {
                        // get default value
                        if (dataItem[gridColumns[c].field] === undefined || dataItem[gridColumns[c].field] === null)
                            dataItem[gridColumns[c].field] = "";
                        var val = dataItem[gridColumns[c].field];
                        // now look for templates
                        if (gridColumns[c].template || gridColumns[c].excelTemplate) {
                            var templateHtml = gridColumns[c].excelTemplate !== undefined
                                ? gridColumns[c].excelTemplate
                                : gridColumns[c].template;
                            let newHtmlVal;
                            if (gridColumns[c].excelTemplate === undefined && templateHtml.indexOf("gridUtils") >= 0 && templateHtml.indexOf("ControlWrapper") >= 0) {
                                templateHtml = "#=" + gridColumns[c].field + "#";
                            }
                            if (templateHtml.includes("#=gridUtils.getFormatedDim")) {
                                newHtmlVal = templateHtml.replace("#=gridUtils.getFormatedDim(data, 'TempCOMP_SKU', '20___0', 'string')#", GridUtil.getFormatedDim(dataItem, 'TempCOMP_SKU', '20___0'));
                            }
                            else if (templateHtml.includes("gridUtils")) {
                                newHtmlVal = ExcelExport.getExportExcelData(templateHtml, dataItem, gridColumns[c].field);
                            }
                            else if (templateHtml.includes("Customer.")) {
                                templateHtml = templateHtml.replace("#=Customer.", "").replace("#", "");
                                newHtmlVal = dataItem["Customer"][templateHtml];
                            }
                            else {
                                templateHtml = templateHtml.replace("#=", "").replace("#", "");
                                newHtmlVal = dataItem[templateHtml];                                
                            }

                            newHtmlVal = newHtmlVal.toString().replace(/<div class='clearboth'><\/div>/g, 'LINEBREAKTOKEN');
                            elem.innerHTML = newHtmlVal;

                            // Output the text content of the templated cell into the exported cell.
                            val = (elem.textContent || elem.innerText || "").replace(/null/g, '').replace(/undefined/g, '')
                                .replace(/LINEBREAKTOKEN/g, '\n');
                        }

                        // Replace special characters that are killers - do it here to catch templated items as well as normal ones.
                        val = String(val).replace(/[\x0b\x1a]/g, " ").replace(/[’]/g, "'");

                        cells.push({
                            value: val,
                            wrap: true
                        });
                    }
                }

                for (var a = 0; a < addAlways.length; a++) {
                    if (colList.indexOf(addAlways[a].field) < 0) {
                        if (dataItem[addAlways[a].field] === undefined || dataItem[addAlways[a].field] === null)
                            dataItem[addAlways[a].field] = "";

                        cells.push({
                            value: dataItem[addAlways[a].field],
                            wrap: true
                        });
                    }
                }

                rows.push({
                    cells: cells
                });

                // Products
                if (dataItem["products"] !== undefined) {
                    hasProds = true;
                    for (var p = 0; p < dataItem["products"].length; p++) {
                        var prd = dataItem["products"][p];
                        rowsProd.push({
                            cells: [
                                { value: dataItem["DC_ID"], wrap: true },
                                { value: prd["DEAL_PRD_NM"], wrap: true },
                                { value: prd["DEAL_PRD_TYPE"], wrap: true },
                                { value: prd["PRD_CAT_NM"], wrap: true },
                                { value: prd["FMLY_NM"], wrap: true },
                                { value: prd["BRND_NM"], wrap: true },
                                { value: prd["PCSR_NBR"], wrap: true },
                                { value: prd["PRODUCT_NAME"], wrap: true },
                                { value: prd["MTRL_ID"], wrap: true },
                                { value: prd["DIV_NM"], wrap: true },
                                { value: prd["OP_CD"], wrap: true },
                                { value: prd["PRD_STRT_DTM"], wrap: true },
                                { value: prd["PRD_END_DTM"], wrap: true }
                            ]
                        });
                    }
                }
            }
        }
        // sheets
        var sheets = [
            {
                columns: colWidths,
                title: title,
                frozenRows: 1,
                rows: rows
            }
        ];

        if (hasProds) {
            sheets.push({
                columns: colWidths,
                title: "Products",
                frozenRows: 1,
                rows: rowsProd
            });
        }
        
        var workbook = new Workbook({
            sheets: sheets
        });
        workbook.toDataURL().then((dataUrl: string) => {
            saveAs(dataUrl, 'MyDealsSearchResults.xlsx');
        });
    }
}
import { DE_Common_Util } from '../contract/DEUtils/DE_Common_util';
import { CurrencyPipe } from '@angular/common';
import { DE_Load_Util } from './DEUtils/DE_Load_util';
import { PTE_Config_Util } from './PTEUtils/PTE_Config_util';
import { StaticMomentService } from "../shared/moment/moment.service";
import { saveAs } from '@progress/kendo-file-saver';
import { Workbook } from '@progress/kendo-angular-excel-export';
import { ExcelExport } from "../contract/excelExport.util"
export class GridUtil {
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
        else if (values.length > 0)
            passedData.PASSED_VALIDATION = "Dirty";
        var titleMsg = "Validation: ";
        if (passedData.PASSED_VALIDATION === "Dirty" || passedData.PASSED_VALIDATION == "0")
            titleMsg += formattedMessage;
        else
            titleMsg += passedData.PASSED_VALIDATION;
        return titleMsg;
    }
    static uiControlScheduleWrapper(passedData) {
        return passedData.OBJ_SET_TYPE_CD === 'REV_TIER' ? PTE_Config_Util.revTierFields : PTE_Config_Util.volTierFields;
    }
    static uiControlScheduleWrapperDensity = function (passedData) {
        return PTE_Config_Util.densityFields;
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
    static uiBoolControlWrapper = function (passedData, field) {
        if (passedData[field]!= undefined && passedData[field] != null)
            return DE_Common_Util.showBool(passedData[field]);
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
    static getPercData(passedData) {
        return DE_Load_Util.getTotalDealVolume(passedData);
    }

    static numberWithCommas(data) {
        return DE_Load_Util.numberWithCommas(data);
    }
    
    static getResultSingleIconNm(result) {
        return DE_Load_Util.getResultMappingIconClass(result);
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
        StaticMomentService.moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
        return StaticMomentService.moment.tz(strDt, "America/Los_Angeles").format("MM/DD/YY HH:mm:ss");
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
        var rows = [{ cells: [], height: 80 }];
        var rowsProd = [{ cells: [], height: 80 }];
        var colWidths = [];
        var colHidden = false;
        var colHeight: number;
        var hasProds = false;
        var addAlways = [
            {
                field: "NOTES",
                title: "Notes"
            }
        ];
        if (title == "Deal Editor Export") colHeight = 180;
        else colHeight = 80;
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
        
        for (var i = 0; i < data.length; i++) {
            //push single row for every record
            var dataItem = data[i];
            if (dataItem !== undefined && dataItem !== null) {
                var cells = [];
                for (var c = 0; c < gridColumns.length; c++) {
                    colHidden = gridColumns[c].hidden !== undefined && gridColumns[c].hidden === true;
                    if (forceHide.indexOf(gridColumns[c].field) >= 0) colHidden = true;
                    if (!colHidden && (gridColumns[c].bypassExport === undefined || gridColumns[c].bypassExport === false)) {
                        //Set Column pref
                        if ((i == 0)) {
                            var colTitle = gridColumns[c].excelHeaderLabel !== undefined && gridColumns[c].excelHeaderLabel !== ""
                                ? gridColumns[c].excelHeaderLabel
                                : gridColumns[c].title;
                            rows[0].cells.push({
                                value: colTitle,
                                textAlign: "center",
                                background: "#0071C5",
                                color: "#ffffff",
                                wrap: true
                            });
                            colList.push(gridColumns[c].field);

                            if (gridColumns[c].width !== undefined) {
                                colWidths.push({ width: parseInt(gridColumns[c].width) });
                            } else {
                                colWidths.push({ autoWidth: true });
                            }
                        }
                        


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
                            else if (templateHtml.includes("CAP.")) {
                                templateHtml = templateHtml.replace("#=CAP.", "").replace("#", "");
                                newHtmlVal = dataItem["CAP"][templateHtml];
                            }
                            else if (templateHtml.includes("ECAP_PRICE.")) {
                                templateHtml = templateHtml.replace("#=ECAP_PRICE.", "").replace("#", "");
                                newHtmlVal = dataItem["ECAP_PRICE"] != undefined ? dataItem["ECAP_PRICE"][templateHtml] : dataItem["ECAP_PRICE_VAL"];
                            }
                            else {
                                templateHtml = templateHtml.replace("#=", "").replace("#", "");
                                newHtmlVal = dataItem[templateHtml];                                
                            }

                            if (newHtmlVal != undefined)
                                newHtmlVal = newHtmlVal.toString().replace(/<div class='clearboth'><\/div>/g, 'LINEBREAKTOKEN');
                            elem.innerHTML = newHtmlVal;
                            
                            // Output the text content of the templated cell into the exported cell.
                            val = (elem.textContent || elem.innerText || "").replace(/null/g, '').replace(/undefined/g, '')
                                .replace(/LINEBREAKTOKEN/g, '\n');
                        }

                        // Replace special characters that are killers - do it here to catch templated items as well as normal ones.
                        val = String(val).replace(/[\x0b\x1a]/g, " ").replace(/[’]/g, "'");
                        if (gridColumns[c].field == 'LAST_TRKR_START_DT_CHK' || gridColumns[c].field == 'LAST_REDEAL_DT' || gridColumns[c].field == "BLLG_DT" || gridColumns[c].field == "OEM_PLTFRM_LNCH_DT" || gridColumns[c].field == "OEM_PLTFRM_EOL_DT") {
                            val = val == undefined || val.length == 0 ? '' : val;
                        }
                        if(gridColumns[c].field=='TIER_NBR'){
                            cells.push({
                                value: val,
                                wrap: false
                            });
                        }else{
                            cells.push({
                                value: val,
                                wrap: true
                            });
                        }
                    }
                }

                if (colList.indexOf(addAlways[0].field) < 0) {
                    if (i == 0) {
                        rows[0].cells.push({
                            value: addAlways[0].title,
                            textAlign: "center",
                            background: "#0071C5",
                            color: "#ffffff",
                            wrap: true
                        });
                        rows[0].height = colHeight;
                        colWidths.push({ autoWidth: true });
                    }

                    if (dataItem[addAlways[0].field] === undefined || dataItem[addAlways[0].field] === null)
                        dataItem[addAlways[0].field] = "";

                    cells.push({
                        value: dataItem[addAlways[0].field],
                        wrap: true
                    });
                }

                rows.push({
                    cells: cells,
                    height: 80
                });

                // Products
                if (dataItem["products"] !== undefined) {
                    // set prod title
                    if (i == 0) {
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
                    }
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
                            ],
                            height: 80
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
    static dsToExcelLegalException = function (gridColumns, ds, title, onlyVisible, dealListChk) {

        var rows = [{ cells: [] }];
        var colWidths = [];
        var colHidden = false;
        if (onlyVisible === undefined || onlyVisible === null) onlyVisible = false;

        var forceHide = ['IS_SELECTED'];
        var elem = document.createElement('div');

        var colList = [];
        for (var i = 0; i < gridColumns.length; i++) {
            colHidden = onlyVisible && gridColumns[i].hidden !== undefined && gridColumns[i].hidden === true;
            if (forceHide.indexOf(gridColumns[i].field) >= 0) colHidden = true;
            if (!colHidden && (gridColumns[i].bypassExport === undefined || gridColumns[i].bypassExport === false)) {
                var colTitle = gridColumns[i].excelHeaderLabel !== undefined && gridColumns[i].excelHeaderLabel !== ""
                    ? gridColumns[i].excelHeaderLabel
                    : gridColumns[i].title;
                if (!dealListChk) {
                    if (colTitle != "Deal List" && colTitle != "PCT Legal Exception Sid") {
                        rows[0].cells.push({
                            value: colTitle,
                            textAlign: "left",
                            background: "#0071C5",
                            color: "#ffffff",
                            wrap: false,
                            width: "230px"
                        });
                        colList.push(gridColumns[i].field);

                        colWidths.push({autoWidth: true});

                    }
                }
                else if (dealListChk) {
                    if (colTitle != "PCT Legal Exception Sid") {
                        rows[0].cells.push({
                            value: colTitle,
                            textAlign: "left",
                            background: "#0071C5",
                            color: "#ffffff",
                            wrap: false,
                            width: "230px"
                        });
                        colList.push(gridColumns[i].field);

                        colWidths.push({ autoWidth: true });

                    }
                }
            }
        }        
        var data = ds;
        for (var i = 0; i < data.length; i++) {
            //push single row for every record
            var dataItem = data[i];
            if (dataItem !== undefined && dataItem !== null) {
                var cells = [];
                for (var c = 0; c < gridColumns.length; c++) {
                    colHidden = onlyVisible && gridColumns[c].hidden !== undefined && gridColumns[c].hidden === true;
                    if (forceHide.indexOf(gridColumns[c].field) >= 0) colHidden = true;
                    if (!colHidden && (gridColumns[c].bypassExport === undefined || gridColumns[c].bypassExport === false)) {
                        // get default value
                        if (dataItem[gridColumns[c].field] === undefined || dataItem[gridColumns[c].field] === null)
                            dataItem[gridColumns[c].field] = "";
                        var val = dataItem[gridColumns[c].field];
                        if (gridColumns[c].field != 'Id' && gridColumns[c].field != "" && gridColumns[c].field) {
                            // now look for templates
                            if (gridColumns[c].template || gridColumns[c].excelTemplate) {
                                var templateHtml = gridColumns[c].field;
                                var newHtmlVal = dataItem[templateHtml];
                                elem.innerHTML = newHtmlVal;
                                if (newHtmlVal && typeof newHtmlVal != 'boolean' && newHtmlVal != "") {
                                    val = (newHtmlVal).replace(/null/g, '').replace(/undefined/g, '')
                                        .replace(/LINEBREAKTOKEN/g, '\n');
                                    var regex = /<br\s*[\/]?>/gi;
                                    val = val.replace(regex, "\r");
                                }
                            }

                            // Replace special characters that are killers - do it here to catch templated items as well as normal ones.                               
                            val = String(val).replace(/[\x0b\x1a]/g, " ").replace(/[’]/g, "'");
                            if (!dealListChk) {
                                if (gridColumns[c].field != "DEALS_USED_IN_EXCPT" && gridColumns[c].field != "MYDL_PCT_LGL_EXCPT_SID") {

                                    cells.push({
                                        value: val,
                                        wrap: true,
                                        width: "230px"
                                    });
                                }
                            }
                            else if (dealListChk) {
                                if (gridColumns[c].field != "MYDL_PCT_LGL_EXCPT_SID") {
                                    cells.push({
                                        value: val,
                                        wrap: true,
                                        width: "230px"
                                    });
                                }

                            }
                        }
                    }
                }
                rows.push({
                    cells: cells
                });
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
        var workbook = new Workbook({
            sheets: sheets
        });
        workbook.toDataURL().then((dataUrl: string) => {
            saveAs(dataUrl, title);
        });
    }
    static stop(value) {
        if (value) {
            value.end = StaticMomentService.moment();
            value.executionMs = value.end.diff(value.start);
        }
        return value;
    };
    static add(data, marks) {
        if(data){
            data.lapse = StaticMomentService.moment().diff(data.start);
            if (data.type === "block") data.lapse -= data.executionMs;
            marks.push(data);
        }
    };
    static perfCacheBlock(title, category) {
        let perfCacheObj ={
            title : title,
            category : category,
            type : "block",
            start:  StaticMomentService.moment(),
            marks : [],
            end: null,
            executionMs :0
        }
        return perfCacheObj;
    }

   static generateUUID() {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    static prefCacheMark(title) {
        let prefCacheMark = {
            title : title,
            type : "mark",
            start : StaticMomentService.moment()
        }
        return prefCacheMark;
    }
   static getChartColor(key) {
        if (key === "UI") return "#FFA300";
        if (key === "MT") return "#00AEEF";
        if (key === "DB") return "#C4D600";
        if (key === "Network") return "#FC4C02";
        return "#dddddd";
    };

    static addPerfTimes(performanceTimes) {
        let tempMarks = [];
        let lapse = 0;
        for (let p = 0; p < performanceTimes.length; p++) {
            let item = performanceTimes[p];
            let media = "UI";
            if (item.Media === 2) media = "MT";
            if (item.Media === 3) media = "DB";
            let perf: any = GridUtil.perfCacheBlock(item.Title, media);//use gridutil
            perf.type = "block";
            perf.lapse = lapse;
            perf.end = StaticMomentService.moment();
            perf.executionMs = item.ExecutionTime;
            perf.chartData = [{
                name: media,
                title: item.Title,
                data: [item.ExecutionTime],
                color: this.getChartColor(media)
            }];
            tempMarks.push(perf);
            lapse += item.ExecutionTime;
        }
        return tempMarks;
    }

    static applySoftWarningsClass(finalMsg) {
        if (finalMsg != "")
            return "isSoftWarnCell";
        else
            return "";
    }
    static applySoftWarnings(passedData, field) {
        var msg = "";
        var finalMsg = "";

        //If Billing start date is more than 6 months in the past from Deal Start date then make billing start date cell softwarning as per US759049
        if (field == 'REBATE_BILLING_START' && passedData['REBATE_TYPE'] != 'TENDER' && passedData['PAYOUT_BASED_ON'] == 'Consumption') {
            var dt1 = StaticMomentService.moment(passedData['START_DT']).format("MM/DD/YYYY");
            var dt2 = StaticMomentService.moment(passedData['REBATE_BILLING_START']).format("MM/DD/YYYY");
            if (StaticMomentService.moment(dt1).isAfter(StaticMomentService.moment(dt2).add(6, 'months'))) {
                // direct setting of final message - msg empty, no header
                finalMsg = "The Billing Start Date is more than six months before the Deal Start Date.";
            }
        }

        // Mikes Vol Tier/Flex Tier adds - &#10;&#13; are both line feeds in title.
        if ((passedData['OBJ_SET_TYPE_CD'] == 'VOL_TIER' ||
            (passedData['OBJ_SET_TYPE_CD'] == 'FLEX' && passedData['FLEX_ROW_TYPE'] == 'Accrual'))
            && passedData['REBATE_TYPE'] != 'TENDER') { 
            var multiTier = passedData['NUM_OF_TIERS'] != 1;
            var dtBS = StaticMomentService.moment(passedData['REBATE_BILLING_START']).format("MM/DD/YYYY");
            var dtBE = StaticMomentService.moment(passedData['REBATE_BILLING_END']).format("MM/DD/YYYY");
            var dtCS = StaticMomentService.moment(passedData['START_DT']).format("MM/DD/YYYY");
            var dtCE = StaticMomentService.moment(passedData['END_DT']).format("MM/DD/YYYY");
            var basedOnConsumption = passedData['PAYOUT_BASED_ON'] == 'Consumption';
            if (field == 'REBATE_BILLING_START' && basedOnConsumption) {
                if (StaticMomentService.moment(dtBE).isAfter(StaticMomentService.moment(dtBS).add(12, 'months')) && multiTier) { // If billings dates are > 1 year
                    msg += "The Rebate Billings Period is restricted to 1 year.&#10;";
                }
            }
            else if (field == 'REBATE_BILLING_END' && basedOnConsumption) {
                if (StaticMomentService.moment(dtBE).isAfter(StaticMomentService.moment(dtBS).add(12, 'months')) && multiTier) { // If billings dates are > 1 year
                    msg += "The Rebate Billings Period is restricted to 1 year.&#10;";
                }
                if (StaticMomentService.moment(dtCE).isAfter(StaticMomentService.moment(dtBE).add(12, 'months'))) { // Consumption End within 1 year of Billings End
                    msg += "The Consumption End Date is limited to 1 year after Billings End Date.&#10;";
                }
            }
            else if (field == 'START_DT' && !basedOnConsumption) {
                if (StaticMomentService.moment(dtCE).isAfter(StaticMomentService.moment(dtCS).add(12, 'months')) && multiTier) { // If billings dates are > 1 year - Billings Based
                    msg += "The Rebate Billings Period is restricted to 1 year.&#10;";
                }
            }
            else if (field == 'END_DT' && !basedOnConsumption) {
                if (StaticMomentService.moment(dtCE).isAfter(StaticMomentService.moment(dtCS).add(12, 'months')) && multiTier) { // If billings dates are > 1 year - Billings Based
                    msg += "The Rebate Billings Period is restricted to 1 year.&#10;";
                }
            }

            if (msg != "") { // Non-direct setting of final message - consolidate msg with header
                finalMsg = "Special Approvals Needed:&#10;" + msg;
            }
        }
        return finalMsg;
    }
}
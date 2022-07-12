export class GridUtil {
    static volTierFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Vol", "field": "STRT_VOL", "format": "number", "align": "right" },
        { "title": "End Vol", "field": "END_VOL", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
    ];
    static revTierFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Rev", "field": "STRT_REV", "format": "currency", "align": "right" },
        { "title": "End Rev", "field": "END_REV", "format": "currency", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Incentive Rate (%)", "field": "INCENTIVE_RATE", "format": "number", "align": "right" }
    ];
    static densityFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Band", "field": "DENSITY_BAND", "format": "", "align": "right" },
        { "title": "Start PB", "field": "STRT_PB", "format": "number", "align": "right" },
        { "title": "End PB", "field": "END_PB", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "DENSITY_RATE", "format": "currency", "align": "right" }
    ];
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
        else {
            var tmplt = '';
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
    }
    static uiControlDealWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '    <div class="ng-binding vert-center">';
        // tmplt += '        <deal-popup-icon deal-id="\'' + passedData[field] + '\'"></deal-popup-icon>';
        tmplt += passedData[field];
        tmplt += '    </div>';
        return tmplt;
    }
    static uiCustomerControlWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv isReadOnlyCell">';
        if (passedData['CUST_ACCNT_DIV'] === undefined || passedData['CUST_ACCNT_DIV'] === "")
            tmplt += '     <div class="ng-binding vert-center">' + passedData.Customer.CUST_NM + '</div>';
        if (passedData['CUST_ACCNT_DIV'] !== "")
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
            if ((dim == "20_____2" || dim == "20_____1") && field == "ECAP_PRICE") {
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field + '_____' + dim])
                    tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field + '_____' + dim] + '"></div>';
            } else {
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                    tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            }
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field][dim] + '</div>';
            tmplt += '</div>';
        }
        return tmplt;
    }
    static uiValidationErrorDetail(passedData) {
        var values = Object.values(passedData._behaviors.validMsg);
        var formattedMessage = '';
        values.forEach((msg) => {
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
        if (passedData.PASSED_VALIDATION === "Dirty" || passedData.PASSED_VALIDATION === "0")
            titleMsg += formattedMessage;
        else
            titleMsg += passedData.PASSED_VALIDATION;
        var tmplt = "<div class='uiControlDiv isReadOnlyCell'><div class='vert-center'><i class='valid-icon validf_" + passedData.PASSED_VALIDATION + " " + classNm + "' title='" + titleMsg + "'></i></div></div>";
        return tmplt;
    }
    static uiControlScheduleWrapper(passedData) {
        var fields = passedData.OBJ_SET_TYPE_CD === 'VOL_TIER' ? this.volTierFields : this.revTierFields;
        var tmplt = '<div class="col-md-12">';
        tmplt += '<div class="col-md-12 rowHeight">';
        for (var t = 0; t < fields.length; t++) {
            if (fields[t].title === "Tier")
                tmplt += '<div class="col-md-3 tierHeader">' + fields[t].title + '</div>';
            else
                tmplt += '<div class="col-md-3 tierHeader tierBorder">' + fields[t].title + '</div>';
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
                    //tmplt += ' ng-click="passThoughFunc(root.clickSchedDim, dataItem, \'' + fields[f].field + '\', \'' + dim + '\')"';
                    tmplt += '<div class="col-md-3 rowValueHeight rowRightBorder ' + this.getClassNm(passedData, fields[f].field) + '" style="text-align: ' + fields[f].align + ';">';
                    if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim])
                        tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim] + '"></div>';
                    tmplt += '<span class="ng-binding" style="padding: 0 4px;">' + passedData[fields[f].field][dim] + '</span>';
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
                //tmplt += ' ng-click="passThoughFunc(root.clickCellDim, dataItem, \'' + field + '\', \'' + dimkey + '\')"';
                tmplt += ' class="kitRowValue ' + this.getClassNm(passedData, field) + '">';
                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined && passedData._behaviors.isError[field + '_' + dimkey] != undefined && passedData._behaviors.isError[field + '_' + dimkey])
                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field + '_' + dimkey] + '"></div>';
                tmplt += '<span class="ng-binding" style="padding: 0 4px;">' + passedData[field][dimkey] + '</span>';
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
        tmplt += '    <div class="ng-binding vert-center">'+ passedData[field]+'</div>';
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
        tmplt += '<div class="uiControlDiv ' + this.getClassNm(passedData, field) +'"';        
        tmplt += '<div class="vert-center">';
        dim = "20_____2"
        if (passedData[field][dim] != null) {
            tmplt += '    <div class="ng-binding">' + passedData[field][dim] +'</div>';
        }
        dim = "20_____1"
        if (passedData[field][dim] != null) {
            tmplt += '    <div class="ng-binding">' + passedData[field][dim] + '</div>';
        }
        for (var index in sortedKeys) { //only looking for positive dim keys
            dim = sortedKeys[index];
            if (data.hasOwnProperty(dim) && dim.indexOf("___") >= 0 && dim.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                tmplt += '    <div class="ng-binding">' + passedData[field][dim] +'</div>';
            }
        }
        tmplt += '</div></div>';
        return tmplt;
    }
    static uiStartDateWrapper = function (passedData, field) {
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv ' + this.getClassNm(passedData, field) + '"';
        tmplt += '    <div class="ng-binding vert-center">';
        if (this.displayFrontEndDateMessage(passedData))
            tmplt += '<span> <i class="intelicon-information style="font- size: 12px; color: #00AEEF;" title="If the deal start date is in the past, the deal start date will change to the date when the deal becomes active."></i> </span>'
        tmplt += '    <span class="ng-binding">'+ passedData[field] +'</span></div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiControlEndDateWrapper = function (passedData, field) {
        var classNm = "";
        if (passedData.EXPIRE_FLG == "1")
            classNm = 'redfont';
        var tmplt = '';
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '<div class="uiControlDiv ' + this.getClassNm(passedData, field) + '"';
        tmplt += '    <div class="ng-binding vert-center ' + classNm + '">' + passedData[field] + '</div>';
        tmplt += '</div>';
        return tmplt;
    }
    static uiControlScheduleWrapperDensity = function (passedData) {
        var tmplt = '<div class="col-md-12">';
        var fields = this.densityFields;

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
                                //tmplt += ' ng-click="passThoughFunc(root.clickSchedDim, dataItem, \'' + fields[f].field + '\', \'' + dim + bands + '\')"';
                                //tmplt += ' ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + fields[f].field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + fields[f].field + ', isRequiredCell: dataItem._behaviors.isRequired.' + fields[f].field + ', isErrorCell: dataItem._behaviors.isError.' + fields[f].field + ', isSavedCell: dataItem._behaviors.isSaved.' + fields[f].field + ', isDirtyCell: dataItem._behaviors.isDirty.' + fields[f].field + '}">';
                                tmplt += 'class="col-md-12 ' + this.getClassNm(passedData, fields[f].field) + '">'
                                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands])
                                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim + bands] + '"></div>';
                                //tmplt += '<span class="ng-binding" ng-if="dataItem.' + fields[f].field + '[\'' + dim + bands + '\'] == \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + bands + '\'] ' + gridUtils.getFormat(fields[f].field, "") + ')"></span>';
                                tmplt += '<span class="ng-binding" style="padding: 0 4px;">' + passedData[fields[f].field][dim+bands] + '</span>';
                            }
                            else {
                                //tmplt += ' ng-click="passThoughFunc(root.clickSchedDim, dataItem, \'' + fields[f].field + '\', \'' + dim + bands + "____" + key + '\')"';
                                tmplt += 'class="col-md-12 ' + this.getClassNm(passedData, fields[f].field) + '">'
                                if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands + '____' + key] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim + bands + '____' + key])
                                    tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim + bands + '____' + key] + '"></div>';
                                //tmplt += '<span class="ng-binding" ng-if="dataItem.' + fields[f].field + '[\'' + dim + bands + "____" + key + '\'] == \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + bands + "____" + key + '\'] ' + gridUtils.getFormat(fields[f].field, "") + ')"></span>';
                                tmplt += '<span class="ng-binding" style="padding: 0 4px;">' + passedData[fields[f].field][dim + bands + '____' + key] +'</span>';
                            }
                            tmplt += '</div>';
                            tmplt += '</div>';
                        }
                        tmplt += '</div>';

                        tmplt += '</div>';
                    }
                    else {
                        tmplt += '<div class="col-md-2 ' + this.getClassNm(passedData, fields[f].field) + '">';
                        //tmplt += ' ng-click="passThoughFunc(root.clickSchedDim, dataItem, \'' + fields[f].field + '\', \'' + dim + '\')"';
                        //tmplt += ' ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + fields[f].field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + fields[f].field + ', isRequiredCell: dataItem._behaviors.isRequired.' + fields[f].field + ', isErrorCell: dataItem._behaviors.isError.' + fields[f].field + ', isSavedCell: dataItem._behaviors.isSaved.' + fields[f].field + ', isDirtyCell: dataItem._behaviors.isDirty.' + fields[f].field + '}">';
                        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim] != undefined && passedData._behaviors.isError[fields[f].field + '_' + dim])
                            tmplt += '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[fields[f].field + '_' + dim] + '"></div>';
                        //tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + fields[f].field + '_' + dim + '" kendo-tooltip="" k-content="dataItem._behaviors.validMsg.' + fields[f].field + '_' + dim + '" style="" data-role="tooltip"></div>';
                        //tmplt += '<span class="ng-binding" ng-if="dataItem.' + fields[f].field + '[\'' + dim + '\'] == \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + '\'] ' + gridUtils.getFormat(fields[f].field, "") + ')"></span>';
                        tmplt += '<span class="ng-binding" style="padding: 0 4px;">' + passedData[fields[f].field][dim] +'</span>';
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
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
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
                classNm = "isHiddenCell";
            if (passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field])
                classNm = "isReadOnlyCell";
            if (passedData._behaviors.isRequired != undefined && passedData._behaviors.isRequired[field])
                classNm = "isRequiredCell";
            if (passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                classNm = "isErrorCell";
            if (passedData._behaviors.isSaved != undefined && passedData._behaviors.isSaved[field])
                classNm = "isSavedCell";
            if (passedData._behaviors.isDirty != undefined && passedData._behaviors.isDirty[field])
                classNm = "isDirtyCell";
        }
        return classNm;
    }
}
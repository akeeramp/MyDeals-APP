export class GridUtil {
    static uiControlWrapper(passedData, field, format) {
        var msg = "";
        var msgClass = "";
        if (passedData['PAYOUT_BASED_ON'] != undefined && passedData['PAYOUT_BASED_ON'] == 'Billings' && (field == 'REBATE_BILLING_START' || field == 'REBATE_BILLING_END')) {
            var tmplt = '';
            if (passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv">';
            tmplt += '</div>';
            return tmplt
        }
        if (field == 'REBATE_BILLING_START' && passedData['REBATE_TYPE'] != 'TENDER' && passedData['PAYOUT_BASED_ON'] == 'Consumption') {
            var dt1 = new Date(passedData['START_DT']);
            var dt2 = new Date(passedData['REBATE_BILLING_START']);
            var months;
            months = (dt2.getFullYear() - dt1.getFullYear()) * 12;
            months -= dt1.getMonth();
            months += dt2.getMonth();
            months = months <= 0 ? 0 : months;
            if (months > 6) {
                msg = "title = 'The Billing Start Date is more than six months before the Deal Start Date.'";
                msgClass = "isSoftWarnCell";
            }

            var tmplt = '';
            if (passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv ' + msgClass + '" style="line-height: 1em;" ' + msg;
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
        else if (field == 'NUM_OF_TIERS' && passedData['OBJ_SET_TYPE_CD'] == "DENSITY") {
            var tmplt = '';
            if (passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '<div class="uiControlDiv"';
            tmplt += '    <div class="ng-binding vert-center" ' + ' ' + ')">' + (passedData['NUM_OF_TIERS'] / passedData['NUM_OF_DENSITY']) + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
        else {
            var tmplt = '';
            if (passedData._behaviors.isError[field])
                tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
            tmplt += '    <div class="ng-binding vert-center">' + passedData[field] + '</div>';
            tmplt += '</div>';
            return tmplt;
        }
    }
    static uiControlDealWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors.isError[field])
            tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field] + '"></div>';
        tmplt += '    <div class="ng-binding vert-center">';
        // tmplt += '        <deal-popup-icon deal-id="\'' + passedData[field] + '\'"></deal-popup-icon>';
        tmplt += passedData[field];
        tmplt += '    </div>';
        return tmplt;
    }
    static uiCustomerControlWrapper(passedData, field) {
        var tmplt = '';
        if (passedData._behaviors.isError[field])
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
                if (passedData._behaviors.isError[field + '_____' + dim])
                    tmplt = '<div class="err-bit" kendoTooltip title="' + passedData._behaviors.validMsg[field + '_____' + dim] + '"></div>';
            } else {
                if (passedData._behaviors.isError[field])
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
    static getFormat = function (lType, lFormat) {
        return !lFormat ? "" : "| " + lFormat;
    }
}
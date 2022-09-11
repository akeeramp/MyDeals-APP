function contractSaveUtil() { }

//helper function for clear and set behaviors
contractSaveUtil.clearValidation = function (data, elem) {
    _.each(data, (item) => {
        if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
            delete item._behaviors.isRequired[elem];
            delete item._behaviors.isError[elem];
            delete item._behaviors.validMsg[elem];
        }
    });
    return data;
}
contractSaveUtil.setToSame = function (data, elem) {
    _.each(data, (item) => {
        if (item[elem] != undefined && (item[elem] == null || item[elem] == '')) {
            item[elem] = null;
        }
    });
    return data;
}
//helper function for clear and set behaviors               
contractSaveUtil.setBehaviors = function (item, elem, cond, curPricingTable) {
    var isFlexDeal = (item.OBJ_SET_TYPE_CD === 'FLEX');
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    item._behaviors.isRequired[elem] = true;
    item._behaviors.isError[elem] = true;

    switch (elem) {
        case 'REBATE_TYPE':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Rebate Type', cond, curPricingTable);
            break;
        case 'PAYOUT_BASED_ON':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Payout Based On', cond, curPricingTable);
            break;
        case 'CUST_ACCNT_DIV':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Customer Account Division', cond, curPricingTable);
            break;
        case 'GEO_COMBINED':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Geo', cond, curPricingTable);
            break;
        case 'PERIOD_PROFILE':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Period Profile', cond, curPricingTable);
            break;
        case 'RESET_VOLS_ON_PERIOD':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Reset Per Period', cond, curPricingTable);
            break;
        case 'PROGRAM_PAYMENT':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Program Payment', cond, curPricingTable);
            break;
        case 'SETTLEMENT_PARTNER':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Settlement Partner', cond, curPricingTable);
            break;
        case 'AR_SETTLEMENT_LVL':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Settlement Level', cond, curPricingTable);
            break;
        case 'CONSUMPTION_TYPE':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Consumption Type', cond, curPricingTable);
            break;
        case 'END_CUSTOMER_RETAIL':
            contractSaveUtil.setBehaviorsValidMessage(item, elem, 'End Customer Country/Region', cond, curPricingTable);
            break;
        default:
        // code block
    }

    if (elem == 'REBATE_TYPE' || elem == 'PAYOUT_BASED_ON' || elem == 'CUST_ACCNT_DIV' || elem == 'GEO_COMBINED' || elem == 'PERIOD_PROFILE' || elem == 'RESET_VOLS_ON_PERIOD' || elem == 'PROGRAM_PAYMENT'
        || elem == 'SETTLEMENT_PARTNER' || elem == 'AR_SETTLEMENT_LVL' || elem == 'CONSUMPTION_TYPE' || elem == 'END_CUSTOMER_RETAIL') {
        // no operation - taken in above case statement
    }
    else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_VOL') {
        contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond, curPricingTable);
    }
    else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_AMT') {
        contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Overarching Max Dollar', cond, curPricingTable);
    }
    else if (cond == 'equalemptyboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
        item._behaviors.validMsg[elem] = "Entering both an Overarching Maximum Volume and Overarching Maximum Dollar value is not allowed.";
    }
    else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_VOL') {
        contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond, curPricingTable);
    }
    else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_AMT') {
        contractSaveUtil.setBehaviorsValidMessage(item, elem, 'Overarching Max Doller', cond, curPricingTable);
    }
    else if (cond == 'equalboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
        item._behaviors.validMsg[elem] = "Both Overarching Maximum Volume and Overarching Maximum Dollars cannot contain values. Choose one or the other.";
    }
    else if (cond == 'duplicate' && elem == 'PTR_USER_PRD') {
        item._behaviors.validMsg[elem] = "Overlapping products have been identified, please change the overlapping Accrual and Draining dates.";
    }
    else if (cond == 'dateissue' && elem == 'PTR_USER_PRD') {
        item._behaviors.validMsg[elem] = "Deal End Date must be greater than Start Date, please correct.";
    }
    else if (cond != '' && elem == 'DENSITY_BAND') {
        item._behaviors.validMsg[elem] = cond;
        if (!item.isDensity) { item.isDensity = {}; item.isDensity[elem] = true; item.isDensity['ErrorMsg'] = cond; }
        else { item.isDensity['ErrorMsg'] = cond; }
    }
    else if (cond == 'emptyobject' && elem == 'FLEX') {
        delete item._behaviors.isRequired[elem];
        delete item._behaviors.isError[elem];
    }

    else {
        item._behaviors.validMsg[elem] = 'All Settlement Levels must be the same within a Hybrid Pricing Strategy.';
    }

    return item;
}
contractSaveUtil.setBehaviorsValidMessage = function (item, elem, elemLabel, cond, curPricingTable) {
    var isFlexDeal = curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
    var dealTypeLabel = isFlexDeal === true ? "FLEX PT" : "HYBRID PS";

    if (cond == 'notequal') {
        item._behaviors.validMsg[elem] = "All deals within a " + dealTypeLabel + " should have the same '" + elemLabel + "' value.";
    }
    else if (cond == 'equalblank') {
        if (elem === 'SETTLEMENT_PARTNER') {
            item._behaviors.validMsg[elem] = "Settlement Partner is required when Settlement level is Cash";
        }
        else {
            item._behaviors.validMsg[elem] = "Deals within a " + dealTypeLabel + " must have a '" + elemLabel + "' value.";
        }
    }
    else if (cond == 'equalblankorzero') {
        item._behaviors.validMsg[elem] = elemLabel + " must be blank or > 0.";
    }
    else if (cond == 'equalzero') {
        item._behaviors.validMsg[elem] = elemLabel + " must be > 0.";
    }

    return item;
}
contractSaveUtil.setFlexBehaviors = function (item, elem, cond, restrictGroupFlexOverlap) {
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    item._behaviors.isRequired[elem] = true;
    item._behaviors.isError[elem] = true;

    if (cond == 'flexrowtype' && elem == 'FLEX_ROW_TYPE') {
        item._behaviors.validMsg[elem] = "There should be at least one accrual product.";
    }
    else if (cond == 'invalidDate' && elem == 'START_DT' && !restrictGroupFlexOverlap) {
        item._behaviors.validMsg[elem] = "Draining products should have at least 1 day delay from Accrual Start date";
    }

    else if (cond == 'nequalpayout' && elem == 'PAYOUT_BASED_ON') {
        item._behaviors.validMsg[elem] = "Products within the same bucket should have same payout based on value";
    }

    else if (cond == 'notallowed' && elem == 'PAYOUT_BASED_ON') {
        item._behaviors.validMsg[elem] = "Consumption based accrual with billings based draining is not valid";
    }
    return item;
}
contractSaveUtil.itemValidationBlock = function (data, key, mode, wipData, spreadDs, curPricingTable) {
    var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
    //In SpreadData for Multi-Tier Tier_NBR one always has the updated date
    //Added if condition as this function gets called both on saveandvalidate of WIP and PTR.As spreadDS is undefined in WIP object added this condition
    var spreadData;
    if (spreadDs != undefined) {
        spreadData = spreadDs.filter((item) => item.IS_CANCELLED == "0");
    }
    else {
        spreadData = data.filter((item) => item.IS_CANCELLED == "0");
    }

    //For multi tiers last record will have latest date, skipping duplicate DC_ID
    var filterData = _.uniq(_.sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

    var v1 = filterData.map((val) => val[key]).filter((value, index, self) => self.indexOf(value) === index);
    var hasNotNull = v1.some(function (el) { return el !== null && el != ""; });

    if (mode.indexOf("notequal") >= 0) { // Returns -1 if not in list
        //if(v1.length > 1 && v1[0] !== "" && v1[0] != null) {  
        if (v1.length > 1 && hasNotNull) {
            _.each(data, (item) => {
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set error message
                    contractSaveUtil.setBehaviors(item, key, 'notequal', curPricingTable);
                }
            });
        }
    }
    if (mode.indexOf("equalblank") >= 0) { // Returns -1 if not in list
        if (v1.contains(null) && v1[0] !== "") {
            var v1List = data.filter((val) => val[key] === null);
            _.each(v1List, (item) => {
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set blank error message
                    contractSaveUtil.setBehaviors(item, key, 'equalblank', curPricingTable);
                }
            });
        }
    }
    //Additional check for settlement partner if AR Settlement Level is 'CASH'
    if (key == "SETTLEMENT_PARTNER" && !hasNotNull) {
        _.each(data, (item) => {
            if (!item._behaviors) item._behaviors = {};
            if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
            if (item._behaviors.isReadOnly[key] === undefined && item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash') { // If not read only, set error message
                contractSaveUtil.setBehaviors(item, key, 'equalblank', curPricingTable);
            }
        });
    }

    if (key == "END_CUSTOMER_RETAIL") {
        var uniqueEndCustomerCountry = filterData.map((val) => val["PRIMED_CUST_CNTRY"]).filter((value, index, self) => self.indexOf(value) === index);
        if (uniqueEndCustomerCountry.length > 1) {
            _.each(data, (item) => {
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set error message
                    contractSaveUtil.setBehaviors(item, key, 'notequal', curPricingTable);
                }
            });
        }
    }

    return data;
}
// validate OverArching conditions
contractSaveUtil.validateOverArching = function (data, curPricingStrategy, curPricingTable) {
    var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retZeroOAD = false, retZeroOAV = false;
    var isFlexAccrual = data.every((val) => val.FLEX_ROW_TYPE === 'Accrual');
    var isFlatRate = curPricingTable.OBJ_SET_TYPE_CD === 'VOL_TIER';
    //calling clear overarching in the begening
    data = contractSaveUtil.clearValidation(data, 'REBATE_OA_MAX_AMT');
    data = contractSaveUtil.clearValidation(data, 'REBATE_OA_MAX_VOL');
    //to fix a defect, setting the property value to same
    data = contractSaveUtil.setToSame(data, 'REBATE_OA_MAX_AMT');
    data = contractSaveUtil.setToSame(data, 'REBATE_OA_MAX_VOL');

    if (hybCond == '1' || isFlexAccrual) {
        //condition to check values are zero
        retZeroOAV = data.every((val) => val.REBATE_OA_MAX_VOL === 0);
        retZeroOAD = data.every((val) => val.REBATE_OA_MAX_AMT === 0);

        if (retZeroOAV) {
            _.each(data, (item) => {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero', curPricingTable);
            });
        }
        else if (retZeroOAD) {
            _.each(data, (item) => {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero', curPricingTable);
            });
        }

        //else if (retOAVCond && retOADCond) { But on a line by line bases to capture both values filled out, not entire table both columns filled out.
        var testMaxAmtValues = [];
        var testMaxAmtCount = 0;
        var testMaxVolValues = [];
        var testMaxVolCount = 0;
        _.each(data, (item) => {
            // Are both values populated on this item?
            if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT !== "") &&
                (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL !== "")) {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
            }
            // Are both values empty for this item?
            if (!(isFlexAccrual == 1 || isFlatRate == 1)) { // Pulls Flex/Vol Tier out of this test
                if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") &&
                    (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL === null || item.REBATE_OA_MAX_VOL == "")) {
                    item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalemptyboth', curPricingTable);
                    item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalemptyboth', curPricingTable);
                }
            }
            if (isFlatRate == 1) { // Check single column for Vol Tier - must have values
                //if (item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") {                
                if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") &&
                    (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL === null || item.REBATE_OA_MAX_VOL == "")) {
                    item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                    item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
                }
            }
            // Check for 0 values
            if (item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT === "0") {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero', curPricingTable);
            }
            if (item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL === "0") {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero', curPricingTable);
            }
            // Check for all values equal (tiers undefined is an ECAP Hybrid, tiers = 1 is a flex or VT Hybrid)
            if (item.REBATE_OA_MAX_AMT !== null && item.IS_CANCELLED !== '1' && (item.NUM_OF_TIERS === undefined || (item.NUM_OF_TIERS.toString() === '1') || item.FLEX_ROW_TYPE === 'Accrual')) {
                testMaxAmtCount++;
                if (item.REBATE_OA_MAX_AMT !== undefined && testMaxAmtValues.indexOf(item.REBATE_OA_MAX_AMT.toString()) < 0) {
                    testMaxAmtValues.push(item.REBATE_OA_MAX_AMT.toString());
                }
            }
            if (item.REBATE_OA_MAX_VOL !== null && item.IS_CANCELLED !== '1' && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
                testMaxVolCount++;
                if (item.REBATE_OA_MAX_VOL !== undefined && testMaxVolValues.indexOf(item.REBATE_OA_MAX_VOL.toString()) < 0) {
                    testMaxVolValues.push(item.REBATE_OA_MAX_VOL.toString());
                }
            }
        });
        // Check if this is a flex, and if it is, only accrual single tier rows count..
        var elementCount = isFlexAccrual != 1 ? data.filter((val) => val.IS_CANCELLED !== '1').length : data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual' && val.IS_CANCELLED !== '1').length;
        if (testMaxAmtValues.length > 1 || (testMaxAmtCount > 0 && testMaxAmtCount != elementCount)) {
            _.each(data, (item) => {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'notequal', curPricingTable);
            });
        }
        if (testMaxVolValues.length > 1 || (testMaxVolValues > 0 && testMaxVolCount != elementCount)) {
            _.each(data, (item) => {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'notequal', curPricingTable);
            });
        }
        if (testMaxAmtValues.length > 0 && testMaxVolValues.length > 0) {
            _.each(data, (item) => {
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                item = contractSaveUtil.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
            });
        }
    }
    return data;
}
//validate Flex Row Type 
contractSaveUtil.validateFlexRowType = function (data, curPricingStrategy, curPricingTable, wipData, spreadDs, restrictGroupFlexOverlap) {
    if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
        data = contractSaveUtil.clearValidation(data, 'FLEX_ROW_TYPE');

        var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
        //var accrualSingleTierEntries = data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual' && val.NUM_OF_TIERS.toString() === '1');
        var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');

        if (drainingEntries.length > 0 && accrualEntries.length == 0) {
            _.each(data, (item) => {
                item = contractSaveUtil.setFlexBehaviors(item, 'FLEX_ROW_TYPE', 'flexrowtype', restrictGroupFlexOverlap);
            });
        }

        if (accrualEntries.length > 0) {
            contractSaveUtil.validateOverArching(accrualEntries, curPricingStrategy, curPricingTable);
        }
        contractSaveUtil.validateHybridFields(data, curPricingStrategy, curPricingTable, wipData, spreadDs);
    }
    return data;
}
contractSaveUtil.validateHybridFields = function (data, curPricingStrategy, curPricingTable, wipData, spreadDs) {
    var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retOAVCond = false, retOADCond = false, retOAVEmptCond = false, retOADEmptCond = false, retZeroOAD = false, retZeroOAV = false;
    var isFlexDeal = curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
    //calling clear overarching in the begening

    if (hybCond == '1' || isFlexDeal) {
        // Assume cleared, the apply breaks
        data = contractSaveUtil.clearValidation(data, 'REBATE_TYPE');
        data = contractSaveUtil.clearValidation(data, 'PAYOUT_BASED_ON');
        data = contractSaveUtil.clearValidation(data, 'CUST_ACCNT_DIV');
        data = contractSaveUtil.clearValidation(data, 'GEO_COMBINED');
        data = contractSaveUtil.clearValidation(data, 'PERIOD_PROFILE');
        data = contractSaveUtil.clearValidation(data, 'RESET_VOLS_ON_PERIOD');
        data = contractSaveUtil.clearValidation(data, 'PROGRAM_PAYMENT');
        data = contractSaveUtil.clearValidation(data, 'SETTLEMENT_PARTNER');
        data = contractSaveUtil.clearValidation(data, 'AR_SETTLEMENT_LVL');
        data = contractSaveUtil.clearValidation(data, 'CONSUMPTION_TYPE');

        contractSaveUtil.itemValidationBlock(data, "REBATE_TYPE", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        if (hybCond) {
            contractSaveUtil.itemValidationBlock(data, "PAYOUT_BASED_ON", ["notequal"], wipData, spreadDs, curPricingTable);
        }
        contractSaveUtil.itemValidationBlock(data, "CUST_ACCNT_DIV", ["notequal"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "GEO_COMBINED", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "PERIOD_PROFILE", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "RESET_VOLS_ON_PERIOD", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "PROGRAM_PAYMENT", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "SETTLEMENT_PARTNER", ["notequal"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "AR_SETTLEMENT_LVL", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        contractSaveUtil.itemValidationBlock(data, "CONSUMPTION_TYPE", ["notequal", "equalblank"], wipData, spreadDs, curPricingTable);
        if (isFlexDeal) {
            data = contractSaveUtil.clearValidation(data, 'END_CUSTOMER_RETAIL', curPricingTable);
            contractSaveUtil.itemValidationBlock(data, "END_CUSTOMER_RETAIL", ["notequal"], wipData, spreadDs, curPricingTable);
        }
        //var valTestX = data.map((val) => val.REBATE_OA_MAX_AMT).filter((value, index, self) => self.indexOf(value) === index) // null valus = not filled out
    }
    return data;
}
//validate settlement level for hybrid 
contractSaveUtil.validateSettlementLevel = function (data, curPricingStrategy) {
    var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond = false;
    //calling clear all validation
    data = contractSaveUtil.clearValidation(data, 'AR_SETTLEMENT_LVL');
    if (hybCond == '1') {
        retCond = data.every((val) => val.AR_SETTLEMENT_LVL != null && val.AR_SETTLEMENT_LVL != '' && val.AR_SETTLEMENT_LVL ==
            data[0].AR_SETTLEMENT_LVL);
        if (!retCond) {
            _.each(data, (item) => {
                contractSaveUtil.setBehaviors(item, 'AR_SETTLEMENT_LVL', 'notequal');
            });
        }
    }
    return data;
}
contractSaveUtil.checkOVLPDate = function (data, resp, objectId) {
    window['moment-range'].extendMoment(moment);
    //get uniq duplicate product
    var uniqOvlpCombination = _.uniq(_.map(resp, (ob) => { return ob.OVLP_ROW_ID }));
    //iterate through unique product
    _.each(uniqOvlpCombination, (dup) => {
        //filtering the uniq prod from response and sort to get correct first and second object
        var rowID = _.filter(resp, (ob) => { return ob['OVLP_ROW_ID'] == dup });
        _.each(rowID, (dupPro) => {
            _.each(rowID, (dupPr) => {
                //checking the product date overlaps or not
                if (dupPro.ROW_ID != dupPr.ROW_ID) {
                    var firstObj = null, secObj = null;

                    if (objectId == 'DC_PARENT_ID') {
                        //findWhere will return the first object found 
                        firstObj = _.findWhere(data, { 'DC_PARENT_ID': dupPro.ROW_ID });
                        secObj = _.findWhere(data, { 'DC_PARENT_ID': dupPr.ROW_ID });
                    }
                    else {
                        firstObj = _.findWhere(data, { 'DC_ID': dupPro.ROW_ID });
                        secObj = _.findWhere(data, { 'DC_ID': dupPr.ROW_ID });
                    }

                    var firstRange = moment.range(moment(firstObj.START_DT), moment(firstObj.END_DT));
                    var secRange = moment.range(moment(secObj.START_DT), moment(secObj.END_DT));
                    //identifying the dates are valid for overlap
                    if (!moment(firstObj.START_DT).isBefore(firstObj.END_DT)) {
                        _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'dateissue';
                    }
                    else if (!moment(secObj.START_DT).isBefore(secObj.END_DT)) {
                        _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'dateissue';
                    }
                    else if ((moment(firstObj.END_DT).format('MM/DD/YYYY') == moment(secObj.START_DT).format('MM/DD/YYYY')) ||
                        (moment(firstObj.START_DT).format('MM/DD/YYYY') == moment(secObj.END_DT).format('MM/DD/YYYY'))) {
                        _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                        _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';
                    }
                    //if the dates overlap add key dup as true
                    else if (firstRange.overlaps(secRange)) {
                        _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                        _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';
                    }
                }
            });
        });

    });

    return resp;
}
contractSaveUtil.deNormalizeData = function (data, curPricingTable, kitDimAtrbs, maxKITproducts) {      //convert how we keep data in UI to MT consumable format
    if (!contractutil.isPivotable(curPricingTable)) return data;
    //For multi tiers last record will have latest date, skipping duplicate DC_ID
    var a;
    var newData = [];
    var lData = {};
    var tierDimKey = "_____10___";
    var prodDimKey = "_____20___";

    var dimKey;
    var dimAtrbs;
    var isKit = 0;
    var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
    var densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
    let dealType = curPricingTable['OBJ_SET_TYPE_CD'];

    if (dealType === "VOL_TIER" || dealType === "FLEX" ||
        dealType === "REV_TIER" || dealType === "DENSITY") {
        dimKey = tierDimKey;
        dimAtrbs = tierAtrbs;
    }
    else if (dealType === "KIT") {
        dimKey = prodDimKey;
        dimAtrbs = kitDimAtrbs;
        isKit = 1;
    }

    var prevTier = 1, densityBand = 1;

    for (var d = 0; d < data.length; d) {
        var numTiers = contractutil.numOfPivot(data[d], curPricingTable);      //KITTODO: rename numTiers to more generic var name for kit deals?
        if (dealType == "DENSITY") {
            let numDensityBands = parseInt(data[d]["NUM_OF_DENSITY"]);
            let densityNumTiers = numTiers / numDensityBands;
            let prevRow = (d == 0) ? parseInt(data[d]["DC_ID"]) : parseInt(data[d - 1]["DC_ID"]);
            let curRow = parseInt(data[d]["DC_ID"]);
            let count = 0;

            for (var x = 1 - isKit; x <= numTiers - isKit; x++) {
                if (prevTier != data[d].TIER_NBR || prevRow != curRow) { densityBand = 1; prevTier = data[d].TIER_NBR; }
                if (prevRow != curRow) {
                    count = d;
                    curRow = prevRow;
                }
                else {
                    count = (d == 0) ? 0 : (count + numDensityBands);
                }
                if (x === 1 - isKit) { lData = data[d]; }
                for (a = 0; a < densityTierAtrbs.length; a++) { // each tiered attribute
                    if (dealType == "DENSITY" && densityTierAtrbs[a] == "DENSITY_RATE") {
                        let densityDimKey = "_____8___";
                        lData[densityTierAtrbs[a] + densityDimKey + densityBand + "____10___" + data[d].TIER_NBR] = data[d][densityTierAtrbs[a]];
                        densityBand++;
                    }
                    else {
                        let densityDimKey = (densityTierAtrbs[a] == "DENSITY_BAND") ? "_____8___" : "_____10___";

                        if ((densityTierAtrbs[a] == "DENSITY_BAND") && x <= numDensityBands) {
                            lData[densityTierAtrbs[a] + densityDimKey + x] = data[d][densityTierAtrbs[a]];
                        }
                        else if (densityTierAtrbs[a] != "DENSITY_BAND" && x <= densityNumTiers) {
                            lData[densityTierAtrbs[a] + densityDimKey + x] = data[count][densityTierAtrbs[a]];
                        }
                    }
                    if (x === numTiers - isKit) { // last tier
                        delete lData[densityTierAtrbs[a]];
                    }
                }
                d++;
                if (d === data.length) {
                    break;
                }
            }

        }
        else {

            for (var t = 1 - isKit; t <= numTiers - isKit; t++) { // each tier
                if (t === 1 - isKit) { lData = data[d]; }
                for (a = 0; a < dimAtrbs.length; a++) { // each tiered attribute
                    lData[dimAtrbs[a] + dimKey + t] = data[d][dimAtrbs[a]];

                    if (t === numTiers - isKit) { // last tier
                        delete lData[dimAtrbs[a]];

                        if (dealType === "KIT") {
                            // Clear out the dimensions of the not-in-use tiers because KIT has dynamic tiering,
                            //		which might leave those dimensions with data, and save stray attributes with no product association in our db.
                            for (var i = 0; i < maxKITproducts; i++) {
                                var tierToDel = (t + 1 + i);
                                lData[dimAtrbs[a] + dimKey + tierToDel] = "";
                            }
                        }
                    }
                }
                // NOTE: the length of the data is the number of rows. But we need to iterate by the number of
                //		normalized rows (which we are creating now) due to tiered dimensions in VOL-TIER and KIT.
                //		Hence why we increment d and break on d === data.length manually.
                //		Basically,  this d-incrementing code is mimicking a skip of rows in "data" that are not of tier_nbr 1.
                //		But also we can't just put a "tier_nbr != 1" check because we still need to use data[d] of each corresponding tier.
                d++;
                if (d === data.length) {
                    break;
                }
            }

        }
        newData.push(lData);
    }

    return newData;
}

contractSaveUtil.validateMarketingKIT = function (data, wipData, curPricingTable, OVLPFlexPdtPTRUSRPRDError) {
    var returnData = {}; 
    var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
    let dealType = curPricingTable.OBJ_SET_TYPE_CD;
    var filterData = _.uniq(_.sortBy(data, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
    if (dealType == "KIT") {
        data = contractutil.clearValidation(data, 'PTR_USER_PRD');
        _.each(filterData, (item) => {
            if (item.PAYOUT_BASED_ON.toUpperCase() == 'CONSUMPTION' && item.PTR_SYS_PRD.toString().contains('"MTRL_TYPE_CD":"KITS"')) {
                OVLPFlexPdtPTRUSRPRDError = true;    // added this to enable error binding to cell
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
                if (!item._behaviors.isError) item._behaviors.isError = {};
                if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
                item._behaviors.isRequired["PTR_USER_PRD"] = true;
                item._behaviors.isError["PTR_USER_PRD"] = true;
                item._behaviors.validMsg["PTR_USER_PRD"] = "Marketing KIT products are not allowed for Consumption based KIT deals.";
            }
        });
    }
    returnData.data = data;
    returnData.OVLPFlexPdtPTRUSRPRDError = OVLPFlexPdtPTRUSRPRDError;
    return returnData;
}    

contractSaveUtil.validatePTEdata = function (sData, curPricingStrategy, getVendorDropDownResult, curPricingTable, wipData, spreadDs,
    restrictGroupFlexOverlap, templates, curPricingTableData, ptTitle, hybridSaveBlockingColumns, OVLPFlexPdtPTRUSRPRDError, uid, contractData, forceValidation, editableArSettlementLevelAfterApproval) {
    var errs = {};
    var rData = {};
    var MarksegValidate = {};
    //validate settlement partner for PTE
    sData = contractutil.validateSettlementPartner(sData, curPricingStrategy, getVendorDropDownResult);
    //validate OAV&OAD partner for PTE
    sData = contractSaveUtil.validateOverArching(sData, curPricingStrategy, curPricingTable);
    sData = contractSaveUtil.validateHybridFields(sData, curPricingStrategy, curPricingTable, wipData, spreadDs);
    //MarksegValidate = contractSaveUtil.validateMarketingKIT(sData, wipData, curPricingTable, OVLPFlexPdtPTRUSRPRDError);
    //sData = MarksegValidate.data;
    //OVLPFlexPdtPTRUSRPRDError = MarksegValidate.OVLPFlexPdtPTRUSRPRDError;
    //validate Flex row type for PTE
    sData = contractSaveUtil.validateFlexRowType(sData, curPricingStrategy, curPricingTable, wipData, spreadDs, restrictGroupFlexOverlap);
    //validate Market Segment
    sData = contractutil.validateMarketSegment(sData, wipData, spreadDs);
    //validate Flex Rule Engine
    sData = contractutil.validateFlexRules(sData, curPricingTable, wipData);

    // find all date fields
    var dateFields = [];
    var fields = templates.ModelTemplates.PRC_TBL_ROW[curPricingTable.OBJ_SET_TYPE_CD].model.fields;
    for (var key in fields) {
        if (fields.hasOwnProperty(key)) {
            if (typeof fields[key] !== 'function') {
                if (fields[key].type === "date" || key.slice(-3) === "_DT") dateFields.push(key);
            }
        }
    }

    //
    // This is a temporary fix to mock-stop users from mixing Tender with non-Tender deals.  Once the Stablization release happens, we can remove this check.
    //
    var hasTender = false;
    var hasNonTender = false;
    var dictRebateType = {};
    var dictPayoutBasedon = {};
    var dictCustDivision = {};
    var dictPayoutBasedon = {};
    var dictGeoCombined = {};
    var dictPeriodProfile = {};
    var dictResetPerPeriod = {};
    //var dictArSettlement = {};
    var dictProgramPayment = {};
    var dictOverarchingVolume = {};
    var dictOverarchingDollar = {};
    var isHybridPS = curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";

    // Check if the rows have duplicate products
    var duplicateProductRows = isHybridPS ? hasDuplicateProduct(sData) : {};

    var errDeals = [];
    if (curPricingTableData[0].OBJ_SET_TYPE_CD === "ECAP" || curPricingTableData[0].OBJ_SET_TYPE_CD === "KIT"
        || curPricingTableData[0].OBJ_SET_TYPE_CD === "PROGRAM" || curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER"
        || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX" || curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER"
        || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY") {
        for (var s = 0; s < sData.length; s++) {
            if (sData[s]["IS_CANCELLED"] === undefined || sData[s]["IS_CANCELLED"] !== "1") {
                if (sData[s]["_dirty"] !== undefined && sData[s]["_dirty"] === true) errDeals.push(s);
                if (duplicateProductRows["duplicateProductDCIds"] !== undefined && duplicateProductRows.duplicateProductDCIds[sData[s].DC_ID] !== undefined) errDeals.push(s);
                if ((curPricingTableData[0].OBJ_SET_TYPE_CD !== "KIT" && curPricingTableData[0].OBJ_SET_TYPE_CD !== "VOL_TIER" && curPricingTableData[0].OBJ_SET_TYPE_CD !== "FLEX") || sData[s].TIER_NBR === 1) {
                    if (sData[s]["REBATE_TYPE"] === "TENDER") {
                        hasTender = true;
                    } else {
                        hasNonTender = true;
                    }
                    if (isHybridPS) {
                        dictRebateType[sData[s]["REBATE_TYPE"]] = s;
                        dictPayoutBasedon[sData[s]["PAYOUT_BASED_ON"]] = s;
                        var isCustDivValid = contractutil.validateCustomerDivision(dictCustDivision, sData[0]["CUST_ACCNT_DIV"], sData[s]["CUST_ACCNT_DIV"]);
                        if (isCustDivValid) {
                            dictCustDivision[sData[0]["CUST_ACCNT_DIV"]] = s;
                        }
                        else {
                            dictCustDivision[sData[s]["CUST_ACCNT_DIV"]] = s;
                        }
                        dictGeoCombined[sData[s]["GEO_COMBINED"]] = s;
                        if (curPricingTableData[0].OBJ_SET_TYPE_CD !== "PROGRAM") {
                            dictPeriodProfile[sData[s]["PERIOD_PROFILE"]] = s;
                        }
                        dictResetPerPeriod[sData[s]["RESET_VOLS_ON_PERIOD"]] = s;
                        dictProgramPayment[sData[s]["PROGRAM_PAYMENT"]] = s;

                        // The next two values if left blank can come in as either null or "", make them one pattern.
                        if (sData[s]["REBATE_OA_MAX_AMT"] == null) dictOverarchingDollar[""] = s;
                        else dictOverarchingDollar[sData[s]["REBATE_OA_MAX_AMT"]] = s;

                        if (sData[s]["REBATE_OA_MAX_VOL"] == null) dictOverarchingVolume[""] = s;
                        else dictOverarchingVolume[sData[s]["REBATE_OA_MAX_VOL"]] = s;
                    }
                }
            }
        }
        if (errDeals.length > 0) {
            for (var t = 0; t < errDeals.length; t++) {
                var el = sData[errDeals[t]];
                if (!el._behaviors) el._behaviors = {};
                if (!el._behaviors.isError) el._behaviors.isError = {};
                if (!el._behaviors.validMsg) el._behaviors.validMsg = {};
                if (hasTender && hasNonTender) {
                    el._behaviors.isError["REBATE_TYPE"] = true;
                    el._behaviors.validMsg["REBATE_TYPE"] = "Cannot mix Tender and Non-Tender deals in the same table (" + ptTitle + ").";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push(el._behaviors.validMsg["REBATE_TYPE"]);
                }

                // Run through all PTR items and bubble up errors for a server side save block.
                // TODO: Implement only hybrids/Flex attributes list as part of this blocking since we don't want to also block potential Mid Tier side issues
                // See "$scope.validateHybridFields" for list of fields to add for this check
                for (var e = 0; e < Object.keys(el._behaviors.validMsg).length; e++) {
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    // Remove this element since it is causing a line to say broke without an error, and ensure element is on the list of blocking attributes only
                    if (Object.keys(el._behaviors.validMsg)[e] !== "DC_ID" && hybridSaveBlockingColumns.indexOf(Object.keys(el._behaviors.validMsg)[e]) >= 0) {
                        if (!errs.PRC_TBL_ROW.contains(el._behaviors.validMsg[Object.keys(el._behaviors.validMsg)[e]])) {
                            errs.PRC_TBL_ROW.push(el._behaviors.validMsg[Object.keys(el._behaviors.validMsg)[e]])
                        }
                    }
                }

                if (isHybridPS && Object.keys(dictProgramPayment).length == 1 && !(Object.keys(dictProgramPayment).contains("Backend"))) {
                    el._behaviors.isError["PROGRAM_PAYMENT"] = true;
                    el._behaviors.validMsg["PROGRAM_PAYMENT"] = "Hybrid Pricing Strategy Deals must be Backend only.";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push(el._behaviors.validMsg["PROGRAM_PAYMENT"]);
                }
                if (isHybridPS && duplicateProductRows.duplicateProductDCIds[el.DC_ID] !== undefined) {
                    el._behaviors.isError["PTR_USER_PRD"] = true;
                    el._behaviors.validMsg["PTR_USER_PRD"] = "Cannot have duplicate product(s). Product(s): " +
                        duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapProduct + " are duplicated within rows " + duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapDCID + ". Please check the date range overlap.";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push(el._behaviors.validMsg["PTR_USER_PRD"]);
                }
            }
        }
    }
    var validated_DC_Id = [];
    var invalidFlexDate = contractutil.validateFlexDate(sData, curPricingTable, wipData);
    for (var s = 0; s < sData.length; s++) {
        //Adding settlment partner error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['SETTLEMENT_PARTNER']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["SETTLEMENT_PARTNER"]);
        }
        //Adding Market Segment error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['MRKT_SEG']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["MRKT_SEG"]);
        }
        //Adding Overarching  error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['REBATE_OA_MAX_AMT']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["REBATE_OA_MAX_AMT"]);
        }
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['REBATE_OA_MAX_VOL']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["REBATE_OA_MAX_VOL"]);
        }
        //Adding settlment level error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['AR_SETTLEMENT_LVL']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
        }
        //Adding FLEX overlap product error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['PTR_USER_PRD'] && OVLPFlexPdtPTRUSRPRDError) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["PTR_USER_PRD"]);
        }

        //Adding FLEX Row type error into err object in PTE
        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['FLEX_ROW_TYPE']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["FLEX_ROW_TYPE"]);
        }

        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['DENSITY_BAND']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["DENSITY_BAND"]);
        }

        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['PAYOUT_BASED_ON']) {
            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
            errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["PAYOUT_BASED_ON"]);
        }

        if (curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX" || curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER"
            || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY") {
            // Set attribute Keys for adding dimensions
            let rateKey;
            let endKey;
            let strtKey;
            if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                rateKey = "RATE"; endKey = "END_VOL"; strtKey = "STRT_VOL";
            }
            else if (curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER") {
                rateKey = "INCENTIVE_RATE"; endKey = "END_REV"; strtKey = "STRT_REV";
            }
            else { // DENSITY
                rateKey = "DENSITY_RATE"; endKey = "END_PB"; strtKey = "STRT_PB";
            }

            // If Vol Tier or Flex, take the schedule as Ints, otherwise, do a float convert
            if (curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX") {
                // HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Now we have to turn them back before saving.
                if (sData[s][endKey] != null && sData[s][endKey] != undefined && sData[s][endKey].toString().toUpperCase() != "UNLIMITED") {
                    sData[s][endKey] = parseInt(sData[s][endKey].toString().replace(/,/g, "") || 0);
                }
                if (sData[s][rateKey] === null) {
                    sData[s][rateKey] = parseInt(0);
                }
                if (sData[s][strtKey] === null) {
                    sData[s][strtKey] = parseInt(0);
                }
            }
            else { // curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY"
                // HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Now we have to turn them back before saving.
                if (sData[s][endKey] != null && sData[s][endKey] != undefined && sData[s][endKey].toString().toUpperCase() != "UNLIMITED") {
                    sData[s][endKey] = parseFloat(sData[s][endKey].toString().replace(/,/g, "") || 0);
                }
                if (sData[s][rateKey] === null || sData[s][rateKey] === "" || isNaN(sData[s][rateKey])) {
                    sData[s][rateKey] = parseFloat(0);
                }
                if ((curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY" && sData[s][endKey].toString().toUpperCase() != "UNLIMITED") && (sData[s][endKey] === null || sData[s][endKey] === "" || isNaN(sData[s][endKey]))) {
                    sData[s][endKey] = parseFloat(0);
                }
                if (sData[s][strtKey] === null) {
                    sData[s][strtKey] = parseFloat(0);
                }
            }
        }

        if (sData[s].DC_ID === null || sData[s].DC_ID === 0) sData[s].DC_ID = uid--;
        sData[s].DC_PARENT_ID = curPricingTableData[0].DC_ID;
        sData[s].dc_type = "PRC_TBL_ROW";
        sData[s].dc_parent_type = curPricingTableData[0].dc_type;
        sData[s].OBJ_SET_TYPE_CD = curPricingTableData[0].OBJ_SET_TYPE_CD;

        if (util.isInvalidDate(sData[s].START_DT)) sData[s].START_DT = contractData["START_DT"];
        if (util.isInvalidDate(sData[s].END_DT)) sData[s].END_DT = contractData["END_DT"];

        // Let's store the backdate rns from the contract in the text field so we can leverage it in rules
        sData[s].BACK_DATE_RSN_TXT = contractData.BACK_DATE_RSN;
        if (sData[s].DC_ID < 0) { // Only read from contract if it is a new row - propogates to deals but doesn't save at row
            sData[s].CONTRACT_TYPE = contractData.CONTRACT_TYPE;
        }

        for (var d = 0; d < dateFields.length; d++) {
            sData[s][dateFields[d]] = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY");
            if (sData[s][dateFields[d]] === "Invalid date") {
                if (dateFields[d] !== "OEM_PLTFRM_LNCH_DT" && dateFields[d] !== "OEM_PLTFRM_EOL_DT") {//(isProgramNRE === true || (dateFields[d] !== "OEM_PLTFRM_LNCH_DT" && dateFields[d] !== "OEM_PLTFRM_EOL_DT"))
                    if (!sData[s]._behaviors) sData[s]._behaviors = {};
                    if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                    if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                    sData[s]._behaviors.isError[dateFields[d]] = true;
                    sData[s]._behaviors.validMsg[dateFields[d]] = "Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push("Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.");
                }
            } else {
                // check dates against contract
                if (dateFields[d] === "START_DT") {
                    var tblStartDate = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY");
                    var endDate = moment(contractData.END_DT).format("MM/DD/YYYY");
                    var isTenderFlag = "0";
                    if (contractData["IS_TENDER"] !== undefined) isTenderFlag = contractData["IS_TENDER"];
                    //Delete if there is any previous Error  messages
                    if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['START_DT']) {
                        delete sData[s]._behaviors.isError['START_DT'];
                        delete sData[s]._behaviors.validMsg['START_DT'];
                    }
                    // check dates against contract - Tender contracts don't observe start/end date within contract.
                    if (moment(tblStartDate).isAfter(endDate) && isTenderFlag !== "1" && sData[s]["OBJ_SET_TYPE_CD"] != "VOL_TIER") {
                        if (!sData[s]._behaviors) sData[s]._behaviors = {};
                        if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                        if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                        sData[s]._behaviors.isError['START_DT'] = true;
                        sData[s]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")";
                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                        errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")");
                    }

                    //Validating Votier deal Dates
                    if (sData[s]["OBJ_SET_TYPE_CD"] == "VOL_TIER" && sData[s]["NUM_OF_TIERS"] == sData[s]["TIER_NBR"]) {
                        var FirstTire = s + 1 - sData[s]["TIER_NBR"];
                        if (!(moment(sData[FirstTire]["START_DT"]).isSame(tblStartDate))) {
                            sData[FirstTire]["START_DT"] = tblStartDate;
                        }

                        if (moment(tblStartDate).isAfter(endDate) && isTenderFlag !== "1") {
                            if (!sData[s]._behaviors) sData[s]._behaviors = {};
                            if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                            if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                            sData[FirstTire]._behaviors.isError['START_DT'] = true;
                            sData[FirstTire]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")";
                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                            errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")");
                        }
                    }

                    //Validating Flex Accrual Start Dates
                    if (sData[s]["OBJ_SET_TYPE_CD"] == "FLEX") {
                        //Delete if there is any previous Error  messages
                        if ((invalidFlexDate || invalidFlexDate != undefined)) {
                            _.each(invalidFlexDate, (item) => {
                                if (!restrictGroupFlexOverlap) {
                                    item = contractutil.setFlexBehaviors(item, 'START_DT', 'invalidDate', restrictGroupFlexOverlap);
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg['START_DT']);
                                }
                            });
                        }
                    }

                }
                if (dateFields[d] === "END_DT") {
                    var tblStartDate = moment(sData[s][dateFields[d - 1]]).format("MM/DD/YYYY");
                    var tblEndDate = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY");
                    var startDate = moment(contractData.START_DT).format("MM/DD/YYYY");
                    var isTenderFlag = "0";
                    if (contractData["IS_TENDER"] !== undefined) isTenderFlag = contractData["IS_TENDER"];

                    if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['END_DT']) {
                        delete sData[s]._behaviors.isError['END_DT'];
                        delete sData[s]._behaviors.validMsg['END_DT'];
                    }


                    if (moment(tblEndDate).isBefore(startDate) && isTenderFlag !== "1" && sData[s]["OBJ_SET_TYPE_CD"] != "VOL_TIER") {
                        if (!sData[s]._behaviors) sData[s]._behaviors = {};
                        if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                        if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                        sData[s]._behaviors.isError['END_DT'] = true;
                        sData[s]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")";
                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                        errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")");
                    }

                    if (sData[s]["OBJ_SET_TYPE_CD"] == "VOL_TIER" && sData[s]["NUM_OF_TIERS"] == sData[s]["TIER_NBR"]) {


                        var FirstTire = s + 1 - sData[s]["TIER_NBR"];
                        if (!(moment(sData[FirstTire]["END_DT"]).isSame(tblEndDate))) {
                            sData[FirstTire]["END_DT"] = tblEndDate;
                        }


                        if (moment(tblEndDate).isBefore(startDate) && isTenderFlag !== "1") {
                            if (!sData[s]._behaviors) sData[s]._behaviors = {};
                            if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                            if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                            sData[FirstTire]._behaviors.isError['END_DT'] = true;
                            sData[FirstTire]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")";
                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                            errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")");
                        }

                    }

                }
            }

            // PTR Level Check - Readonly will be true if AR_SETTLEMENT_LVL is "Cash" and the deal has a tracker. Otherwise, the user is allowed to 
            // swap between "Issue Credit to Billing Sold To" or "Issue Credit to Default Sold To by Region".
            var dataHyb = sData.filter(obj => obj.AR_SETTLEMENT_LVL != null);
            var hasInvalidArSettlementForHybirdDealsPtr = isHybridPS && _.uniq(dataHyb.map(function (dataItem) { return dataItem["AR_SETTLEMENT_LVL"] })).length > 1;
            if (hasInvalidArSettlementForHybirdDealsPtr == false && sData[s].HAS_TRACKER == "1" && sData[s]._behaviors.isReadOnly["AR_SETTLEMENT_LVL"] != true
                && editableArSettlementLevelAfterApproval.indexOf(sData[s].AR_SETTLEMENT_LVL) < 0) {
                sData[s]._behaviors.isError["AR_SETTLEMENT_LVL"] = true;
                sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"] = "Settlement Level can be updated between \"" + editableArSettlementLevelAfterApproval.join(" / ") + "\" for active deals";
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
            }
        }

        if (forceValidation) {
            // check for rows that need to be translated
            // TODO:  merged cells are not updated with valid JSON, hence the work around to check for the unique DC_ID's
            var isValidatedRow = validated_DC_Id.filter(function (x) {
                return x == sData[s].DC_ID;
            }).length > 0;

            if (!isValidatedRow) {
                validated_DC_Id.push(sData[s].DC_ID);
                if ((!!sData[s].PTR_USER_PRD && sData[s].PTR_USER_PRD !== "") && (!sData[s].PTR_SYS_PRD || sData[s].PTR_SYS_PRD === "") ||
                    (!(!sData[s].PTR_SYS_INVLD_PRD || sData[s].PTR_SYS_PRD === ""))) {
                    if (!sData[s]._behaviors) sData[s]._behaviors = {};
                    if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                    if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                    sData[s]._behaviors.isError["PTR_USER_PRD"] = true;
                    if (sData[s].OBJ_SET_TYPE_CD == "DENSITY") {
                        sData[s]._behaviors.validMsg["PTR_USER_PRD"] = "Product Translator needs to run. Please ensure you are using SSD products for Density deals.";
                    }
                    else {
                        sData[s]._behaviors.validMsg["PTR_USER_PRD"] = "Product Translator needs to run.";
                    }
                    //needPrdVld.push({
                    //    "row": s + 1,
                    //    "DC_ID": sData[s].DC_ID,
                    //    "PTR_USER_PRD": sData[s].PTR_USER_PRD
                    //});
                }
            }
        }
    }
    rData.sData = sData;
    rData.errs = errs;    
    return rData
}

contractSaveUtil.validateDEdata = function (gData,contractData, curPricingStrategy, curPricingTable, getVendorDropDownResult, wipData, spreadDs, restrictGroupFlexOverlap,
    hybridSaveBlockingColumns, OVLPFlexPdtPTRUSRPRDError, uid, templates, uData, editableArSettlementLevelAfterApproval) {
    var isTenderFlag = "0";
    var errs = {};
    var rData = {};
    if (contractData["IS_TENDER"] !== undefined) isTenderFlag = contractData["IS_TENDER"];
    var isHybridPricingStatergy = curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";
    var dictGroupType = {};   
    if (gData !== undefined && gData !== null) {
        gData = contractutil.ValidateEndCustomer(gData, "SaveAndValidate", curPricingStrategy, curPricingTable);
        //validate settlement parter for DE
        gData = contractutil.validateSettlementPartner(gData, curPricingStrategy, getVendorDropDownResult);
        //validate OAV & OAD parter for DE
        gData = contractSaveUtil.validateOverArching(gData, curPricingStrategy, curPricingTable);
        gData = contractSaveUtil.validateHybridFields(gData, curPricingStrategy, curPricingTable, wipData, spreadDs);
        //validate settlement level for DE
        gData = contractSaveUtil.validateSettlementLevel(gData, curPricingStrategy);
        //validate Flex Row Type for DE
        gData = contractSaveUtil.validateFlexRowType(gData, curPricingStrategy, curPricingTable, wipData, spreadDs, restrictGroupFlexOverlap);
        //validate Market Segment
        gData = contractutil.validateMarketSegment(gData, wipData, spreadDs);

        var hasInvalidArSettlementForHybirdDeals = isHybridPricingStatergy && _.uniq(gData.map(function (dataItem) { return dataItem["AR_SETTLEMENT_LVL"] })).length > 1;
        var invalidFlexDate = contractutil.validateFlexDate(gData, curPricingTable, wipData);
        for (var i = 0; i < gData.length; i++) {
            if ((gData[i]["USER_AVG_RPU"] == null || gData[i]["USER_AVG_RPU"] == "")
                && (gData[i]["USER_MAX_RPU"] == null || gData[i]["USER_MAX_RPU"] == "")
                && gData[i]["RPU_OVERRIDE_CMNT"] != null && gData[i]["RPU_OVERRIDE_CMNT"] !== "") {
                gData[i]["RPU_OVERRIDE_CMNT"] = "";
            }
            // Adding settlment partner error into err object in DE
            if (gData[i]._behaviors.isError['SETTLEMENT_PARTNER']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["SETTLEMENT_PARTNER"]);
            }
            //US1071237: Vistex R2 Post Release: Convert Project Name to Upper Case
            gData[i].QLTR_PROJECT = gData[i].QLTR_PROJECT.toUpperCase();
            if (gData[i]._behaviors.isError['MRKT_SEG']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["MRKT_SEG"]);
            }

            // This forces all items onto the save side errors checking.  Need to scale it to only the fields we care about.
            for (var e = 0; e < Object.keys(gData[i]._behaviors.validMsg).length; e++) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                // Remove this element since it is causing a line to say broke without an error, and ensure element is on the list of blocking attributes only
                if (Object.keys(gData[i]._behaviors.validMsg)[e] !== "DC_ID" && hybridSaveBlockingColumns.indexOf(Object.keys(gData[i]._behaviors.validMsg)[e]) >= 0) {
                    if (!errs.PRC_TBL_ROW.contains(gData[i]._behaviors.validMsg[Object.keys(gData[i]._behaviors.validMsg)[e]])) {
                        errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg[Object.keys(gData[i]._behaviors.validMsg)[e]])
                    }
                }
            }

            // Adding Overarching error into err object in DE
            if (gData[i]._behaviors.isError['REBATE_OA_MAX_VOL']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["REBATE_OA_MAX_VOL"]);
            }
            if (gData[i]._behaviors.isError['REBATE_OA_MAX_AMT']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["REBATE_OA_MAX_AMT"]);
            }
            // Adding settlment level error into err object in DE
            if (gData[i]._behaviors.isError['AR_SETTLEMENT_LVL']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
            }
            // Adding FLEX overlap Product error into err object in DE
            if (gData[i]._behaviors.isError['PTR_USER_PRD'] && OVLPFlexPdtPTRUSRPRDError) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["PTR_USER_PRD"]);
            }

            // Adding FLEX Row Type Product error into err object in DE
            if (gData[i]._behaviors.isError['FLEX_ROW_TYPE']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["FLEX_ROW_TYPE"]);
            }

            if (gData[i]._behaviors.isError['CONSUMPTION_TYPE']) {
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["CONSUMPTION_TYPE"]);
            }

            // TODO... this should probably mimic Pricing Table Rows
            if (gData[i].DC_ID === null || gData[i].DC_ID === 0) gData[i].DC_ID = uid--;

            // Kindof a lame hack... should make it more dynamic, but for now let's see if we can get this working
            // ^ very informative Phil... :)  Here we convert the data of Array format used by Kendo to a string format expected by our middle tier 
            if (Array.isArray(gData[i].TRGT_RGN)) gData[i].TRGT_RGN = gData[i].TRGT_RGN.join();
            if (Array.isArray(gData[i].QLTR_BID_GEO)) gData[i].QLTR_BID_GEO = gData[i].QLTR_BID_GEO.join();
            if (Array.isArray(gData[i].DEAL_SOLD_TO_ID)) gData[i].DEAL_SOLD_TO_ID = gData[i].DEAL_SOLD_TO_ID.join();
            if ((curPricingStrategy.WF_STG_CD.toString().toUpperCase() == "APPROVED" || Object.keys(gData[i].TRKR_NBR).length > 0) && isTenderFlag !== "1") {
                if (gData[i].CONSUMPTION_LOOKBACK_PERIOD < uData[gData[i].DC_ID]) {
                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                    gData[i]._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD'] = true;
                    gData[i]._behaviors.validMsg['CONSUMPTION_LOOKBACK_PERIOD'] = "Lookback Period can only be increased after approval";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push("Lookback Period can only be increased after approval");
                }
            }

            if (gData[i].CONSUMPTION_COUNTRY_REGION != null && gData[i].CONSUMPTION_COUNTRY_REGION != undefined && gData[i].CONSUMPTION_COUNTRY_REGION != "") {
                if (gData[i].CONSUMPTION_CUST_RPT_GEO != null && gData[i].CONSUMPTION_CUST_RPT_GEO != undefined && gData[i].CONSUMPTION_CUST_RPT_GEO != "") {
                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                    gData[i]._behaviors.isError['CONSUMPTION_CUST_RPT_GEO'] = true;
                    gData[i]._behaviors.validMsg['CONSUMPTION_CUST_RPT_GEO'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    gData[i]._behaviors.isError['CONSUMPTION_COUNTRY_REGION'] = true;
                    gData[i]._behaviors.validMsg['CONSUMPTION_COUNTRY_REGION'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push("Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both");
                }
            }

            // check dates against contract - Tender contracts don't observe start/end date within contract.
            if (moment(gData[i]["START_DT"]).isAfter(contractData.END_DT) && isTenderFlag !== "1") {
                if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                gData[i]._behaviors.isError['START_DT'] = true;
                gData[i]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(contractData.END_DT).format("MM/DD/YYYY") + ")";
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(contractData.END_DT).format("MM/DD/YYYY") + ")");
            }

            // check dates against contract - Tender contracts don't observe start/end date within contract.
            if (moment(gData[i]["END_DT"]).isBefore(contractData.START_DT) && isTenderFlag !== "1") {
                if (gData[i]._behaviors !== null && gData[i]._behaviors !== undefined) {
                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                    gData[i]._behaviors.isError['END_DT'] = true;
                    gData[i]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(contractData.START_DT).format("MM/DD/YYYY") + ")";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(contractData.START_DT).format("MM/DD/YYYY") + ")");
                }
            }

            // check Deal dates 
            if (moment(gData[i]["START_DT"]).isAfter(moment(gData[i]["END_DT"])) && isTenderFlag !== "1") {
                if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                gData[i]._behaviors.isError['START_DT'] = true;
                gData[i]._behaviors.validMsg['START_DT'] = "Deal Start date cannot be greater than the Deal End Date";
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push("Start date cannot be greater than the Deal End Date");
            }

            if (gData[i]["OBJ_SET_TYPE_CD"] == "FLEX") {
                //Delete if there is any previous Error  messages
                if ((invalidFlexDate || invalidFlexDate != undefined)) {
                    _.each(invalidFlexDate, (item) => {
                        if (!restrictGroupFlexOverlap) {
                            item = contractutil.setFlexBehaviors(item, 'START_DT', 'invalidDate', restrictGroupFlexOverlap);
                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                            errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg['START_DT']);
                        }
                    });
                }
            }

            if (gData[i]["END_CUSTOMER_RETAIL"] != undefined && gData[i]["END_CUSTOMER_RETAIL"] != null) { // && isTenderFlag == "1"
                if (gData[i]._behaviors.isError['END_CUSTOMER_RETAIL']) {
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["END_CUSTOMER_RETAIL"]);
                }
                else {
                    if (gData[i]._behaviors.isError['END_CUSTOMER_RETAIL']) {
                        delete gData[i]._behaviors.isError['END_CUSTOMER_RETAIL'];
                        delete gData[i]._behaviors.validMsg['END_CUSTOMER_RETAIL'];
                    }
                    gData[i]["END_CUSTOMER_RETAIL"] = gData[i]["END_CUSTOMER_RETAIL"].toString();
                }
            }

            var fields = templates.ModelTemplates.PRC_TBL_ROW[curPricingTable.OBJ_SET_TYPE_CD].model.fields;
            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {
                    if (fields[key].type === "date") {
                        gData[i][key] = moment(gData[i][key]).format("MM/DD/YYYY");
                    }
                }
            }

            // This is silly hard-coding because these are not in our template and they are used by DSA only - set them to proper dates.
            if (gData[i]["ON_ADD_DT"] !== undefined) gData[i]["ON_ADD_DT"] = moment(gData[i]["ON_ADD_DT"]).format("MM/DD/YYYY");
            if (gData[i]["REBATE_BILLING_START"] !== undefined) gData[i]["REBATE_BILLING_START"] = moment(gData[i]["REBATE_BILLING_START"]).format("MM/DD/YYYY");
            if (gData[i]["REBATE_BILLING_END"] !== undefined) gData[i]["REBATE_BILLING_END"] = moment(gData[i]["REBATE_BILLING_END"]).format("MM/DD/YYYY");
            if (gData[i]["LAST_REDEAL_DT"] !== undefined) gData[i]["LAST_REDEAL_DT"] = moment(gData[i]["LAST_REDEAL_DT"]).format("MM/DD/YYYY");

            // Hybrid pricing strategy logic and Flex deal type validation error for DEAL_COMB_TYPE
            if (isHybridPricingStatergy || gData[i]["OBJ_SET_TYPE_CD"] == "FLEX") {
                if (Object.keys(dictGroupType).length == 0) {
                    gData.map(function (data, index) {
                        dictGroupType[data["DEAL_COMB_TYPE"]] = index;
                    });
                }

                if (gData[i]["OBJ_SET_TYPE_CD"] == "FLEX" && restrictGroupFlexOverlap) {
                    data = contractutil.clearValidation(gData, "DEAL_COMB_TYPE");
                    let objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
                    let filterData = _.uniq(_.sortBy(gData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

                    let filteredGroupTypeRestriction = filterData.filter((val) => val.DEAL_COMB_TYPE != null && val.DEAL_COMB_TYPE != '' && val.DEAL_COMB_TYPE != "Additive");
                    if (filteredGroupTypeRestriction.length > 0) {
                        _.each(filteredGroupTypeRestriction, (item) => {
                            if (!item._behaviors.isError) item._behaviors.isError = {};
                            if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
                            item._behaviors.isError['DEAL_COMB_TYPE'] = true;
                            item._behaviors.validMsg['DEAL_COMB_TYPE'] = "FLEX deals having Billings based Accrual and Consumption based Draining products should have Group Type as 'Additive' ";
                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                            errs.PRC_TBL_ROW.push(item._behaviors.validMsg['DEAL_COMB_TYPE']);
                        });
                    }
                }
                else if (Object.keys(dictGroupType).length > 1) {
                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                    gData[i]._behaviors.isError['DEAL_COMB_TYPE'] = true;
                    gData[i]._behaviors.validMsg['DEAL_COMB_TYPE'] = "All deals within a PS should have the same 'Group Type' value";
                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                    errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg['DEAL_COMB_TYPE']);
                }

            }

            // WIP Deal Level Check - Readonly will be true if AR_SETTLEMENT_LVL is "Cash" and the deal has a tracker. Otherwise, the user is allowed to 
            // swap between "Issue Credit to Billing Sold To" or "Issue Credit to Default Sold To by Region".
            if (hasInvalidArSettlementForHybirdDeals == false && gData[i].HAS_TRACKER == "1" && gData[i]._behaviors.isReadOnly["AR_SETTLEMENT_LVL"] != true
                && editableArSettlementLevelAfterApproval.indexOf(gData[i].AR_SETTLEMENT_LVL) < 0) {
                gData[i]._behaviors.isError["AR_SETTLEMENT_LVL"] = true;
                gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"] = "Settlement Level can be updated between \"" + editableArSettlementLevelAfterApproval.join(" / ") + "\" for active deals";
                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
            }                        
        }
    }

    rData.gData = gData;
    rData.errs = errs;

    return rData;
}

// this function takes an array of date ranges in this format:
// [{ start: Date, end: Date}]
// the array is first sorted, and then checked for any overlap

function hasDuplicateProduct(pricingTableRows) {
    var rows = JSON.parse(JSON.stringify(pricingTableRows.filter((val) => val.IS_CANCELLED == undefined || val.IS_CANCELLED != '1')));
    var sortedRanges = rows.sort((previous, current) => {

        previous.START_DT = previous.START_DT instanceof Date ? previous.START_DT : new Date(previous.START_DT);
        current.END_DT = current.END_DT instanceof Date ? current.END_DT : new Date(current.END_DT);

        previous.END_DT = previous.END_DT instanceof Date ? previous.END_DT : new Date(previous.END_DT);
        current.START_DT = current.START_DT instanceof Date ? current.START_DT : new Date(current.START_DT);

        // get the start date from previous and current
        var previousTime = previous.START_DT.getTime();
        var currentTime = current.END_DT.getTime();

        // if the previous is earlier than the current
        if (previousTime < currentTime) {
            return -1;
        }

        // if the previous time is the same as the current time
        if (previousTime === currentTime) {
            return 0;
        }

        // if the previous time is later than the current time
        return 1;
    });

    var dictDuplicateProducts = {};

    var result = sortedRanges.reduce((result, current, idx, arr) => {
        // get the previous range
        if (idx === 0) { return result; }
        var previous = arr[idx - 1];


        // check for any overlap
        var previousEnd = previous.END_DT.getTime();
        var currentStart = current.START_DT.getTime();
        var overlap = (previousEnd >= currentStart);

        // store the result
        if (overlap) {
            if (previous.PTR_SYS_PRD !== "") {
                var sysProducts = JSON.parse(previous.PTR_SYS_PRD);
                for (var key in sysProducts) {
                    if (sysProducts.hasOwnProperty(key)) {
                        _.each(sysProducts[key], function (item) {
                            if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                dictDuplicateProducts[item.PRD_MBR_SID] = previous.DC_ID;
                            } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(previous.DC_ID.toString()) < 0) {
                                dictDuplicateProducts[item.PRD_MBR_SID] += "," + previous.DC_ID;
                                if (result.duplicateProductDCIds[previous.DC_ID] == undefined) {
                                    result.duplicateProductDCIds[previous.DC_ID] = {
                                        "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                        "OverlapProduct": key
                                    }
                                } else {
                                    result.duplicateProductDCIds[previous.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                    result.duplicateProductDCIds[previous.DC_ID].OverlapProduct += "," + key;
                                }
                            }
                        });
                    }
                }
            }

            if (current.PTR_SYS_PRD !== "") {
                var sysProducts = JSON.parse(current.PTR_SYS_PRD);
                for (var key in sysProducts) {
                    if (sysProducts.hasOwnProperty(key)) {
                        _.each(sysProducts[key], function (item) {
                            if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                dictDuplicateProducts[item.PRD_MBR_SID] = current.DC_ID;
                            } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(current.DC_ID.toString()) < 0) {
                                dictDuplicateProducts[item.PRD_MBR_SID] += "," + current.DC_ID;
                                if (result.duplicateProductDCIds[current.DC_ID] == undefined) {
                                    result.duplicateProductDCIds[current.DC_ID] = {
                                        "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                        "OverlapProduct": key
                                    }
                                } else {
                                    result.duplicateProductDCIds[current.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                    result.duplicateProductDCIds[current.DC_ID].OverlapProduct += "," + key;
                                }
                            }
                        });
                    }
                }
            }
        }

        return result;

        // seed the reduce  
    }, { overlap: false, duplicateProductDCIds: {} });

    // return the final results  
    return result;
}


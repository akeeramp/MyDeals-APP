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
        spreadData = spreadDs;
    }
    else {
        spreadData = data
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
            //if (item.REBATE_OA_MAX_AMT !== null && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
            if (item.REBATE_OA_MAX_AMT !== null && (item.NUM_OF_TIERS === undefined || (item.NUM_OF_TIERS.toString() === '1') || item.FLEX_ROW_TYPE === 'Accrual')) {
                testMaxAmtCount++;
                if (item.REBATE_OA_MAX_AMT !== undefined && testMaxAmtValues.indexOf(item.REBATE_OA_MAX_AMT.toString()) < 0) {
                    testMaxAmtValues.push(item.REBATE_OA_MAX_AMT.toString());
                }
            }
            if (item.REBATE_OA_MAX_VOL !== null && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
                testMaxVolCount++;
                if (item.REBATE_OA_MAX_VOL !== undefined && testMaxVolValues.indexOf(item.REBATE_OA_MAX_VOL.toString()) < 0) {
                    testMaxVolValues.push(item.REBATE_OA_MAX_VOL.toString());
                }
            }
        });
        // Check if this is a flex, and if it is, only accrual single tier rows count..
        //var elementCount = isFlexAccrual != 1 ? data.length : data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual' && val.NUM_OF_TIERS.toString() === '1').length;
        var elementCount = isFlexAccrual != 1 ? data.length : data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual').length;
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
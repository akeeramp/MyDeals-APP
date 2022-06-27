function commonUtil() { }

commonUtil.getColor = function (k, c, colorDictionary) {
    if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
        return colorDictionary[k][c];
    }
    return "#aaaaaa";
}
commonUtil.getColorStage = function (d, colorDictionary) {
    if (!d) d = "Draft";
    return commonUtil.getColor('stage', d, colorDictionary);
}
commonUtil.escapeRegExp = function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
commonUtil.checkpricegrpcode = function (root) {
    if ((root.contractData !== undefined || root.contractData !== null) && window.usrRole == "DA") {
        if (root.contractData.PRC_ST !== undefined || root.contractData.PRC_ST !== null) {
            if (root.contractData.PRC_ST.length > 0 && root.contractData.IS_TENDER == 0) {
                if (root.contractData.Customer.PRC_GRP_CD == "") {
                    for (var k = 0; k < root.contractData.PRC_ST.length; k++) {
                        if (!root.contractData.PRC_ST[k]._actions["Approve"] && root.contractData.Customer.PRC_GRP_CD == "") {
                            root.contractData.PRC_ST[k]._actionReasons["Approve"]
                                += "\nPrice Group Code required for the customer";
                        }
                        if (root.contractData.PRC_ST[k]._actions["Approve"] && root.contractData.Customer.PRC_GRP_CD == "") {
                            root.contractData.PRC_ST[k]._actions["Approve"] = false;
                            root.contractData.PRC_ST[k]._actionReasons["Approve"] = "Price Group Code required for the customer";
                        }
                    }
                }
            }
        }
    }
}
commonUtil.transport = function (dcId) {
    return {
        read: {
            url: "/api/Dashboard/GetWipSummary/" + dcId,
            type: "GET",
            dataType: "json"
        }
    }
}
commonUtil.checkStage = function (response) {
    if (response !== undefined) {
        for (var i = 0; i < response.length; i++) {
            if (response[i].WF_STG_CD === "Draft")
                return response[i].WF_STG_CD = response[i].PS_WF_STG_CD;
            if (response[i].WF_STG_CD === "Hold")
                return response[i].PASSED_VALIDATION = "Complete";
        }
    }
}
commonUtil.schema = function (objTypeCd) {
    if (objTypeCd == "ECAP" || objTypeCd == "KIT") {
        return {
            model: {
                id: "DC_ID",
                fields: {
                    DC_ID: { type: "number" },
                    OBJ_SET_TYPE_CD: { type: "string" },
                    PASSED_VALIDATION: { type: "string" },
                    START_DT: { type: "date" },
                    END_DT: { type: "date" },
                    COST_TEST_RESULT: { type: "string" },
                    MEETCOMP_TEST_RESULT: { type: "string" },
                    NOTES: { type: "string" },
                    TRKR_NBR: { type: "object" },
                    TITLE: { type: "string" },
                    REBATE_TYPE: { type: "string" },
                    VOLUME: { type: "string" },
                    END_CUSTOMER_RETAIL: { type: "string" },
                    DEAL_DESC: { type: "string" },
                    WF_STG_CD: { type: "string" },
                    EXPIRE_FLG: { type: "string" }
                }
            }
        };
    }
    else {
        return {
            model: {
                id: "DC_ID",
                fields: {
                    DC_ID: { type: "number" },
                    OBJ_SET_TYPE_CD: { type: "string" },
                    PASSED_VALIDATION: { type: "string" },
                    WF_STG_CD: { type: "string" },
                    START_DT: { type: "date" },
                    OEM_PLTFRM_LNCH_DT: { type: "date" },
                    OEM_PLTFRM_EOL_DT: { type: "date" },
                    END_DT: { type: "date" },
                    COST_TEST_RESULT: { type: "string" },
                    MEETCOMP_TEST_RESULT: { type: "string" },
                    NOTES: { type: "string" },
                    TRKR_NBR: { type: "object" },
                    TITLE: { type: "string" },
                    DEAL_DESC: { type: "string" },
                    MAX_RPU: { type: "string" }
                }
            }
        };
    }
}
commonUtil.sumGridColumns = function (objTypeCd, gridId, canViewCostTest, canViewMeetComp) {
    if (objTypeCd == "ECAP") {
        return [
            {
                field: "NOTES",
                title: "Tools",
                width: "200px",
                locked: true,
                template: "<div><deal-tools ng-model='dataItem' is-split-enabled='false' is-editable='true' is-quote-letter-enabled='true' is-delete-enabled='false'></deal-tools></div>",
                headerTemplate: "<input type='checkbox' ng-click='clkAllItem($event, " + gridId + ")' class='with-font'  id='ptId_" + gridId + "chkDealTools' /><label for='ptId_" + gridId + "chkDealTools'>Tools</label>",
                filterable: false,
                sortable: false
            }, {
                field: "DC_ID",
                title: "Deal Id",
                width: "120px",
                locked: true,
                template: "<div class='dealLnk'><deal-popup-icon deal-id=\"'#=DC_ID#'\"></deal-popup-icon><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ (dataItem.PASSED_VALIDATION === \"Dirty\" ? \"Validation Errors\" : dataItem.PASSED_VALIDATION) || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-alert-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>",
                filterable: { multi: true, search: true }
            }, {
                field: "TRKR_NBR",
                title: "Tracker Number",
                width: "150px",
                locked: true,
                template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#",
                sortable: false,
                filterable: false //{ multi: true, search: true }
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "START_DT",
                title: "Deal Start/End",
                width: "170px",
                template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                filterable: { multi: true, search: true }
            }, {
                field: "TITLE",
                title: "Product",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "CAP",
                title: "CAP",
                template: "#= gridUtils.getFormatedDim(data, 'CAP', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                filterable: false
            }, {
                field: "ECAP_PRICE",
                title: "ECAP",
                template: "#= gridUtils.getFormatedDim(data, 'ECAP_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                filterable: false
            }, {
                field: "YCS2_PRC_IRBT",
                title: "YCS2",
                template: "#= gridUtils.getFormatedDim(data, 'YCS2_PRC_IRBT', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                filterable: false
            }, {
                field: "REBATE_TYPE",
                title: "Rebate Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "COST_TEST_RESULT",
                title: "Cost Test Result",
                width: "100px",
                hidden: !canViewCostTest,
                filterable: { multi: true, search: true }
            }, {
                field: "COMP_SKU",
                title: "Comp SKU",
                template: "#= gridUtils.getFormatedDim(data, 'COMP_SKU', '20___0', 'string') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "COMPETITIVE_PRICE",
                title: "Comp Price",
                template: "#= gridUtils.getFormatedDim(data, 'COMPETITIVE_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "MEETCOMP_TEST_RESULT",
                title: "Meet Comp Test Result",
                width: "100px",
                hidden: !canViewMeetComp,
                filterable: { multi: true, search: true }
            }, {
                field: "VOLUME",
                title: "Ceiling Volume",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "DEAL_DESC",
                title: "Deal Description",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "WF_STG_CD",
                title: "Stage",
                width: "100px",
                filterable: { multi: true, search: true },
                template: "#= gridUtils.stgFullTitleChar(data) #"
            }, {
                field: "EXPIRE_FLG",
                title: "Expired",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "HAS_ATTACHED_FILES",
                title: "Attachments",
                width: "80px",
                template: "#= gridUtils.hasAttachments(data, 'HAS_ATTACHED_FILES') #"
            }
        ]
    }
    if (objTypeCd == "KIT") {
        return [
            {
                field: "NOTES",
                title: "Tools",
                width: "200px",
                locked: true,
                template: "<div><deal-tools ng-model='dataItem' is-split-enabled='false' is-editable='true' is-quote-letter-enabled='true' is-delete-enabled='false'></deal-tools></div>",
                headerTemplate: "<input type='checkbox' ng-click='clkAllItem($event, " + gridId + ")' class='with-font'  id='ptId_" + gridId + "chkDealTools' /><label for='ptId_" + gridId + "chkDealTools'>Tools</label>",
                filterable: false,
                sortable: false
            }, {
                field: "DC_ID",
                title: "Deal Id",
                width: "120px",
                locked: true,
                template: "<div class='dealLnk'><deal-popup-icon deal-id=\"'#=DC_ID#'\"></deal-popup-icon><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ (dataItem.PASSED_VALIDATION === \"Dirty\" ? \"Validation Errors\" : dataItem.PASSED_VALIDATION) || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-alert-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>",
                filterable: { multi: true, search: true }
            }, {
                field: "TRKR_NBR",
                title: "Tracker Number",
                width: "150px",
                locked: true,
                template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#",
                sortable: false,
                filterable: false //{ multi: true, search: true }
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "START_DT",
                title: "Deal Start/End",
                width: "170px",
                template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                filterable: { multi: true, search: true }
            }, {
                field: "TITLE",
                title: "Product",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "CAP_KIT",
                title: "KIT CAP",
                template: "#= gridUtils.getFormatedDim(data, 'CAP', '20_____1', 'currency') #", // NOTE: this is the -1 dim - works for KIT deals only
                width: "100px",
                filterable: false
            }, {
                field: "ECAP_PRICE",
                title: "KIT ECAP",
                template: "#=gridUtils.getFormatedDim(data, 'ECAP_PRICE', '20_____1', 'currency')#", // NOTE: this is the -1 dim - works for KIT deals only
                width: "100px",
                filterable: false
            }, {
                field: "YCS2_PRC_IRBT",
                title: "KIT YCS2",
                template: "#=gridUtils.getFormatedDim(data, 'YCS2_PRC_IRBT', '20_____1', 'currency')#", // NOTE: this is the -1 dim - works for KIT deals only
                width: "100px",
                filterable: false
            }, {
                field: "REBATE_TYPE",
                title: "Rebate Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "COST_TEST_RESULT",
                title: "Cost Test Result",
                width: "100px",
                hidden: !canViewCostTest,
                filterable: { multi: true, search: true }
            }, {
                field: "COMP_SKU",
                title: "Comp SKU",
                template: "#= gridUtils.getFormatedDim(data, 'COMP_SKU', '20___0', 'string') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "COMPETITIVE_PRICE",
                title: "Comp Price",
                template: "#= gridUtils.getFormatedDim(data, 'COMPETITIVE_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "MEETCOMP_TEST_RESULT",
                title: "Meet Comp Test Result",
                width: "100px",
                hidden: !canViewMeetComp,
                filterable: { multi: true, search: true }
            }, {
                field: "VOLUME",
                title: "Ceiling Volume",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "DEAL_DESC",
                title: "Deal Description",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "WF_STG_CD",
                title: "Stage",
                width: "100px",
                filterable: { multi: true, search: true },
                template: "#= gridUtils.stgFullTitleChar(data) #"
            }, {
                field: "EXPIRE_FLG",
                title: "Expired",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "HAS_ATTACHED_FILES",
                title: "Attachments",
                width: "80px",
                template: "#= gridUtils.hasAttachments(data, 'HAS_ATTACHED_FILES') #"
            }
        ]
    }
    else {
        return [
            {
                field: "NOTES",
                title: "Tools",
                width: "200px",
                locked: true,
                template: "<div><deal-tools ng-model='dataItem' is-split-enabled='false' is-editable='true' is-quote-letter-enabled='true' is-delete-enabled='false'></deal-tools></div>",
                headerTemplate: "<input type='checkbox' ng-click='clkAllItem($event, " + gridId + ")' class='with-font'  id='ptId_" + gridId + "chkDealTools' /><label for='ptId_" + gridId + "chkDealTools'>Tools</label>",
                filterable: false,
                sortable: false
            }, {
                field: "DC_ID",
                title: "Deal Id",
                width: "120px",
                locked: true,
                template: "<div class='dealLnk'><deal-popup-icon deal-id=\"'#=DC_ID#'\"></deal-popup-icon><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ (dataItem.PASSED_VALIDATION === \"Dirty\" ? \"Validation Errors\" : dataItem.PASSED_VALIDATION) || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-alert-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>",
                filterable: { multi: true, search: true }
            }, {
                field: "TRKR_NBR",
                title: "Tracker Number",
                width: "150px",
                locked: true,
                template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#",
                sortable: false,
                filterable: false //{ multi: true, search: true }
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "START_DT",
                title: "Deal Start/End",
                width: "170px",
                template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                filterable: { multi: true, search: true }
            }, {
                field: "OEM_PLTFRM_LNCH_DT",
                title: "OEM Platform Launch Date",
                width: "170px",
                template: "#=gridUtils.displayOEMDates(data, 'OEM_PLTFRM_LNCH_DT')#",
                filterable: { multi: true, search: true }
            }, {
                field: "OEM_PLTFRM_EOL_DT",
                title: "OEM Platform EOL Date",
                width: "170px",
                template: "#=gridUtils.displayOEMDates(data, 'OEM_PLTFRM_EOL_DT')#",
                filterable: { multi: true, search: true }
            }, {
                field: "TITLE",
                title: "Product",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "REBATE_TYPE",
                title: "Rebate Type",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "COST_TEST_RESULT",
                title: "Cost Test Result",
                width: "100px",
                hidden: !canViewCostTest,
                filterable: { multi: true, search: true }
            }, {
                field: "COMP_SKU",
                title: "Comp SKU",
                template: "#= gridUtils.getFormatedDim(data, 'COMP_SKU', '20___0', 'string') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "COMPETITIVE_PRICE",
                title: "Comp Price",
                template: "#= gridUtils.getFormatedDim(data, 'COMPETITIVE_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                width: "100px",
                hidden: !canViewCostTest,
                filterable: false
            }, {
                field: "MEETCOMP_TEST_RESULT",
                title: "Meet Comp Test Result",
                width: "100px",
                hidden: !canViewMeetComp,
                filterable: { multi: true, search: true }
            }, {
                field: "MAX_RPU",
                title: "Max RPU",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "DEAL_DESC",
                title: "Deal Description",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "WF_STG_CD",
                title: "Stage",
                width: "100px",
                filterable: { multi: true, search: true },
                template: "#= gridUtils.stgFullTitleChar(data) #"
            }, {
                field: "EXPIRE_FLG",
                title: "Expired",
                width: "100px",
                filterable: { multi: true, search: true }
            }, {
                field: "HAS_ATTACHED_FILES",
                title: "Attachments",
                width: "80px",
                template: "#= gridUtils.hasAttachments(data, 'HAS_ATTACHED_FILES') #"
            }
        ]
    }
}
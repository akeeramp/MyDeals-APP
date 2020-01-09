angular
    .module("app.admin")
    .controller("RuleModalController", RuleModalController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

RuleModalController.$inject = [
    "$rootScope", "$location", "ruleService", "$scope", "$stateParams", "logger", "$timeout", "confirmationModal", "gridConstants", "constantsService", "$uibModalInstance", "RuleConfig", "dataItem"];

function RuleModalController($rootScope, $location, ruleService, $scope, $stateParams, logger, $timeout, confirmationModal, gridConstants, constantsService, $uibModalInstance, RuleConfig, dataItem) {
    var vm = this;
    vm.loadCriteria = false;
    vm.rule = {};
    vm.RuleConfig = [];
    vm.BlanketDiscountDollor = "";
    vm.BlanketDiscountPercentage = "";
    vm.ProductCriteria = [];
    vm.isElligibleForApproval = false;
    vm.adminEmailIDs = "";
    vm.toolKitHidden = window.usrRole === "DA" ? false : true;
    vm.IsRefreshGridRequired = false;

    $scope.init = function () {
        vm.IsRefreshGridRequired = dataItem.isCopy;
        vm.RuleConfig = RuleConfig.data;
        vm.GetRules(dataItem.id, "GET_BY_RULE_ID");
    }

    vm.openRulesSimulation = function (dataItem) {
        $scope.context = dataItem;

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: "modal-title",
            ariaDescribedBy: "modal-body",
            templateUrl: "rulesSimulationModal",
            controller: "rulesSimulationModalCtrl",
            size: "lg",
            resolve: {
                dataItem: function () {
                    return angular.copy(dataItem);
                }
            }
        });

        modalInstance.result.then(function (returnData) {
        }, function () { });
    }

    $scope.getConstant = function () {
        // If user has closed the banner message he wont see it for the current session again.
        constantsService.getConstantsByName("PRC_RULE_EMAIL").then(function (data) {
            if (!!data.data) {
                vm.adminEmailIDs = data.data.CNST_VAL_TXT === "NA" ? "" : data.data.CNST_VAL_TXT;
                vm.isElligibleForApproval = vm.adminEmailIDs.indexOf(window.usrEmail) > -1 ? true : false;
            }
        });
        if (window.usrRole !== "DA") {
            constantsService.getConstantsByName("PRC_RULE_READ_ACCESS").then(function (data) {
                if (!!data.data) {
                    var prcAccess = data.data.CNST_VAL_TXT === "NA" ? "" : data.data.CNST_VAL_TXT;
                    vm.toolKitHidden = prcAccess.indexOf(window.usrRole) > -1;
                    if (vm.toolKitHidden) {
                        $scope.init();
                    } else {
                        document.location.href = "/Dashboard#/portal";
                    }

                }
            });
        }

    }

    $scope.operatorSettings = {
        "operators": [
            {
                "operator": "LIKE",
                "operCode": "contains",
                "label": "contains"
            },
            {
                "operator": "=",
                "operCode": "eq",
                "label": "equal to"
            },
            {
                "operator": "IN",
                "operCode": "in",
                "label": "in"
            },
            {
                "operator": "!=",
                "operCode": "neq",
                "label": "not equal to"
            },
            {
                "operator": "<",
                "operCode": "lt",
                "label": "less than"
            },
            {
                "operator": "<=",
                "operCode": "lte",
                "label": "less than or equal to"
            },
            {
                "operator": ">",
                "operCode": "gt",
                "label": "greater than"
            },
            {
                "operator": ">=",
                "operCode": "gte",
                "label": "greater than or equal to"
            }
        ],
        "types": [
            {
                "type": "string",
                "uiType": "textbox"
            }, {
                "type": "string_with_in",
                "uiType": "textbox"
            }, {
                "type": "string_limited",
                "uiType": "textbox"
            },
            {
                "type": "autocomplete",
                "uiType": "textbox"
            },
            {
                "type": "number",
                "uiType": "numeric"
            },
            {
                "type": "numericOrPercentage",
                "uiType": "numeric"
            },
            {
                "type": "money",
                "uiType": "numeric"
            },
            {
                "type": "date",
                "uiType": "datepicker"
            },
            {
                "type": "list",
                "uiType": "combobox"
            },
            {
                "type": "bool",
                "uiType": "checkbox"
            },
            {
                "type": "singleselect",
                "uiType": "combobox"
            },
            {
                "type": "singleselect_ext",
                "uiType": "combobox"
            },
            {
                "type": "singleselect_read_only",
                "uiType": "combobox"
            }
        ],
        "types2operator": [
            {
                "type": "number",
                "operator": ["=", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "numericOrPercentage",
                "operator": ["=", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "money",
                "operator": ["=", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "date",
                "operator": ["=", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "string",
                "operator": ["LIKE", "=", "!="]
            },
            {
                "type": "string_with_in",
                "operator": ["=", "!=", "LIKE", "IN"]
            },
            {
                "type": "string_limited",
                "operator": ["=", "!=", "IN"]
            },
            {
                "type": "autocomplete",
                "operator": ["=", "!=", "IN"]
            },
            {
                "type": "list",
                "operator": ["=", "!="]
            },
            {
                "type": "bool",
                "operator": ["=", "!="]
            },
            {
                "type": "singleselect",
                "operator": ["="]
            },
            {
                "type": "singleselect_read_only",
                "operator": ["="]
            },
            {
                "type": "singleselect_ext",
                "operator": ["=", "!="]
            }
        ]
    };

    var allowedRoleForCreatedBy = ["GA", "FSE"];
    $scope.attributeSettings = [
        {
            field: "CRE_EMP_NAME",
            title: "Created by name",
            type: "list",
            width: 150.0,
            lookupText: "NAME",
            lookupValue: "EMP_WWID",
            lookupUrl: "/api/Employees/GetUsrProfileRoleByRoleCd/" + allowedRoleForCreatedBy.join()
        },
        {
            field: "WIP_DEAL_OBJ_SID",
            title: "Deal #",
            type: "string_limited",
            width: 150
        },
        {
            field: "OBJ_SET_TYPE_CD",
            title: "Deal Type",
            type: "singleselect_read_only",
            width: 150,
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [{ Value: "ECAP" }]
        },
        {
            field: "CUST_NM",
            title: "Customer",
            type: "list",
            width: 150.0,
            lookupText: "CUST_NM",
            lookupValue: "CUST_SID",
            lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
        },
        {
            field: "END_CUSTOMER_RETAIL",
            title: "End Customer",
            type: "string_with_in",
            width: 150
        },
        {
            field: "GEO_COMBINED",
            title: "Deal Geo",
            type: "list",
            width: 150,
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [{ Value: "Worldwide" }, { Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
        },
        {
            field: "HOST_GEO",
            title: "Customer Geo",
            type: "list",
            width: 150,
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [{ Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
        },
        {
            field: "PRODUCT_FILTER",
            title: "Product",
            type: "string",
            width: 150,
            dimKey: 20
        },
        {
            field: "DEAL_DESC",
            title: "Deal Description",
            type: "string",
            width: 150,
            dimKey: 20
        },
        {
            field: "OP_CD",
            title: "Op Code",
            type: "list",
            width: 150,
            lookupText: "value",
            lookupValue: "value",
            lookupUrl: "/api/Dropdown/GetDictDropDown/OP_CD"
        },
        {
            field: "DIV_NM",
            title: "Product Division",
            type: "list",
            width: 150,
            lookupText: "value",
            lookupValue: "value",
            lookupUrl: "/api/Dropdown/GetDictDropDown/DIV_NM"
        },
        {
            field: "FMLY_NM",
            title: "Family",
            type: "list",
            width: 150,
            lookupText: "value",
            lookupValue: "value",
            lookupUrl: "/api/Dropdown/GetDictDropDown/FMLY_NM"
        },
        {
            field: "PRD_CAT_NM",
            title: "Product Verticals",
            type: "list",
            width: 150,
            lookupText: "value",
            lookupValue: "value",
            lookupUrl: "/api/Dropdown/GetDictDropDown/PRD_CAT_NM"
        },
        {
            field: "SERVER_DEAL_TYPE",
            title: "Server Deal Type",
            type: "list",
            width: 150,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
        },
        {
            field: "MRKT_SEG",
            title: "Market Segment",
            type: "list",
            width: 150,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
        },
        {
            field: "PAYOUT_BASED_ON",
            title: "Payout Based On",
            type: "singleselect_ext",
            width: 150,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
        },
        {
            field: "COMP_SKU",
            title: "Meet Comp Sku",
            type: "string_with_in",
            width: 150
        },
        {
            field: "ECAP_PRICE",
            title: "ECAP (Price)",
            type: "money",
            width: 150,
            dimKey: 20,
            format: "{0:c}"
        },
        {
            field: "VOLUME",
            title: "Ceiling Volume",
            type: "number",
            width: 150
        },
        {
            field: "VOL_INCR",
            title: "Ceiling Volume Increase",
            type: "numericOrPercentage",
            width: 150
        },
        {
            field: "END_DT",
            title: "End Date",
            type: "date",
            template: "#if(END_DT==null){#  #}else{# #= moment(END_DT).format('MM/DD/YYYY') # #}#",
            width: 150
        },
        {
            field: "END_DT_PUSH",
            title: "End Date Push",
            type: "number",
            width: 150,
            post_label: "Days"
        },
        {
            field: "HAS_TRCK",
            title: "Has Tracker",
            type: "singleselect",
            width: 150,
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [{ Value: "Yes" }, { Value: "No" }]
        },
        {
            field: "MTRL_ID",
            title: "Material Id",
            type: "autocomplete",
            width: 150
        },
        {
            field: "DEAL_PRD_NM",
            title: "Level 4",
            type: "autocomplete",
            width: 150
        },
        {
            field: "PCSR_NBR",
            title: "Processor Number",
            type: "list",
            width: 150,
            lookupText: "value",
            lookupValue: "value",
            lookupUrl: "/api/Dropdown/GetDictDropDown/PCSR_NBR"
        }
    ];

    vm.UpdatePriceRule = function (priceRuleCriteria, strActionName) {
        var initialRuleId = priceRuleCriteria.Id;
        ruleService.updatePriceRule(priceRuleCriteria, strActionName).then(function (response) {
            if (response.data.Id > 0) {
                vm.rule = response.data;
                vm.rule.OwnerName = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === vm.rule.OwnerId).length > 0 ? vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === vm.rule.OwnerId)[0].NAME : (vm.rule.OwnerId === vm.RuleConfig.CurrentUserWWID ? vm.RuleConfig.CurrentUserName : "NA");
                vm.rule.RuleStatusLabel = vm.rule.IsActive ? "Active" : "Inactive";
                vm.rule.RuleStageLabel = vm.rule.RuleStage ? "Approved" : "Pending Approval";
                vm.rule.RuleAutomationLabel = vm.rule.IsAutomationIncluded ? "Auto Approval" : "Exclusion Rule";
                vm.IsRefreshGridRequired = true;
                logger.success("Rule has been " + (initialRuleId == 0 ? "added" : "updated"));
            } else {
                kendo.alert("This rule name already exists in another rule.");
            }
        }, function (response) {
            logger.error("Unable to  " + (initialRuleId == 0 ? "add" : "update") + " the rule");
        });
    };

    vm.EditBlanketDiscountPercentage = function () {
        vm.BlanketDiscountDollor = "";
    };

    vm.EditBlanketDiscountDollor = function () {
        vm.BlanketDiscountPercentage = "";
    };

    var availableAttrs = [];

    vm.GetRules = function (id, actionName) {
        $rootScope.$broadcast("UpdateSpinnerDescription", "Please wait while we " + (id === 0 && actionName === "GET_BY_RULE_ID" ? "initiating" : "loading") + " the " + (actionName === "GET_BY_RULE_ID" ? "rule" : "rules") + "..");
        ruleService.getPriceRules(id, actionName).then(function (response) {
            switch (actionName) {
                case "GET_BY_RULE_ID": {
                    var i;
                    if (availableAttrs.length === 0) {
                        for (i = 0; i < $scope.attributeSettings.length; i++)
                            availableAttrs.push($scope.attributeSettings[i].field);
                    }
                    vm.rule = response.data[0];
                    //vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === vm.rule.OwnerId).length === 0 ? null : vm.rule.OwnerId;
                    vm.rule.Criteria = vm.rule.Criterias.Rules.filter(x => availableAttrs.indexOf(x.field) > -1);
                    for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                        if (vm.rule.Criteria[idx].type === "list" && vm.rule.Criteria[idx].operator !== "IN") {
                            vm.rule.Criteria[idx].value = vm.rule.Criteria[idx].values;
                        }
                    }
                    vm.ProductCriteria = vm.rule.ProductCriteria;
                    vm.BlanketDiscountPercentage = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%")[0].value : "";
                    vm.BlanketDiscountDollor = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$")[0].value : "";
                    $("#productCriteria").show();
                    vm.dataSourceSpreadSheet.read();
                    vm.DeleteSpreadsheetAutoHeader();
                    if (vm.ProductCriteria.length > 198) {
                        var sheet = $scope.spreadsheet.activeSheet();
                        for (i = 198; i <= vm.ProductCriteria.length; i++) {
                            if (vm.ProductCriteria[i - 1].ProductName !== "") {
                                sheet.range("A" + i).value(vm.ProductCriteria[i - 1].ProductName);
                                sheet.range("B" + i).value(vm.ProductCriteria[i - 1].Price);
                            }
                        }
                    }
                    vm.validateProduct(false, false, "NONE");
                    vm.toggleType(vm.rule.IsAutomationIncluded);
                    vm.loadCriteria = true;
                } break;
            }
        }, function (response) {
            logger.error("Operation failed");
        });
    };

    vm.DeleteSpreadsheetAutoHeader = function () {
        var sheet = $scope.spreadsheet.activeSheet();
        sheet.deleteRow(0);
        sheet.range("A1:A200").color("black");
        sheet.range("A1:A200").textAlign("left");
        sheet.range("B1:B200").textAlign("right");
        sheet.range("B1:B200").format("$#,##0.00");
        sheet.range("B1:B200").validation({
            dataType: "custom",
            from: "REGEXP_MATCH(B1)",
            allowNulls: true,
            type: "reject",
            titleTemplate: "Invalid Price",
            messageTemplate: "Format of the price is invalid. This should be greater than zero."
        });
        $($("#spreadsheetProductCriteria .k-spreadsheet-column-header").find("div")[0]).find("div").html("Product Name (Only Lvl 4 or Material Ids Allowed)");
        $($("#spreadsheetProductCriteria .k-spreadsheet-column-header").find("div")[2]).find("div").html("ECAP Floor (US$)");
        $($("#spreadsheetProductCriteria .k-spreadsheet-column-header").find("div")[2]).find("div").attr("title", "Requested ECAP must be greater than or equal to the floor price entered");
    }

    vm.UpdateRuleIndicator = function (ruleId, isTrue, strActionName, isApproved) {
        if (ruleId != null && ruleId > 0 && isApproved) {
            $rootScope.$broadcast("UpdateSpinnerDescription", "Please wait while we updating the rule..");
            var priceRuleCriteria = { Id: ruleId }
            switch (strActionName) {
                case "UPDATE_ACTV_IND": {
                    priceRuleCriteria.IsActive = isTrue;
                } break;
                case "UPDATE_STAGE_IND": {
                    priceRuleCriteria.RuleStage = isTrue;
                    priceRuleCriteria.IsActive = isTrue;
                } break;
            }

            ruleService.updatePriceRule(priceRuleCriteria, strActionName).then(function (response) {
                if (response.data.Id > 0) {
                    vm.rule.ChangedBy = response.data.ChangedBy;
                    vm.rule.ChangeDateTime = response.data.ChangeDateTime;
                    vm.rule.ChangeDateTimeFormat = response.data.ChangeDateTimeFormat;
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            vm.rule.IsActive = isTrue;
                            vm.rule.RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            logger.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                        } break;
                        case "UPDATE_STAGE_IND": {
                            vm.rule.RuleStage = isTrue;
                            vm.rule.RuleStageLabel = isTrue ? "Approved" : "Pending Approval";
                            vm.rule.IsActive = isTrue;
                            vm.rule.RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            logger.success("Rule has been updated successfully with the stage '" + (isTrue ? "Approved" : "Pending") + "'");
                        } break;
                    }
                    vm.IsRefreshGridRequired = true;
                }
                else {
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            vm.rule.IsActive = !isTrue;
                        } break;
                        case "UPDATE_STAGE_IND": {
                            vm.rule.RuleStage = !isTrue;
                            vm.rule.IsActive = !isTrue;
                        } break;
                    }
                    logger.error("Unable to update rule's indicator");
                }
            }, function (response) {
                switch (strActionName) {
                    case "UPDATE_ACTV_IND": {
                        vm.rule.IsActive = !isTrue;
                    } break;
                    case "UPDATE_STAGE_IND": {
                        vm.rule.RuleStage = !isTrue;
                        vm.rule.IsActive = !isTrue;
                    } break;
                }
                logger.error("Operation failed");
            });
        }
    }

    vm.toggleType = function (currentState) {
        // Ganthi - DO NOT REMOVE THIS - IT IS PART OF "US505889 - Price Rules: Exclusions for Automation" requirements, clear out fields and hide if exclusion rule.
        // This hides fields if the rule is an exclusion rule, also clears out unwanted values that shouldn't be part of exclusion rule.
        if (currentState !== true) {
            vm.BlanketDiscountDollor = "";
            vm.BlanketDiscountPercentage = "";

            var sheet = $scope.spreadsheet.activeSheet();
            sheet.range("A0:B199").clear();

            //$('#blanketDiscountSection').hide(); // Hidden due to IsAutomationIncluded
            $("#productCriteria").hide();
            var g = 0;
        } else {
            $("#productCriteria").show();
            //$('#blanketDiscountSection').show(); // Displayed due to IsAutomationIncluded
        }
    }

    vm.generateProductCriteria = function () {
        var sheet = $scope.spreadsheet.activeSheet();
        vm.ProductCriteria = [];
        var tempRange = sheet.range("A1:B200").values().filter(x => !(x[0] == null && x[1] == null));
        if (tempRange.length > 0) {
            $rootScope.$broadcast("UpdateSpinnerDescription", "Please wait while we reading the products..");
            for (var i = 0; i < tempRange.length; i++) {
                var newProduct = {};
                newProduct.ProductName = tempRange[i][0] != null ? jQuery.trim(tempRange[i][0]) : "";
                newProduct.Price = tempRange[i][1] != null ? tempRange[i][1] : 0;
                vm.ProductCriteria.push(newProduct);
            }
        }
    }

    vm.simulate = function () {
        var data = new Array();
        var dataRuleIds = [];
        dataRuleIds.push(parseInt(vm.rule.Id, 10));
        var dataDealsIds = [];

        data.push(dataRuleIds, dataDealsIds);

        ruleService.getRuleSimulationResults(data).then(function (response) {
            if (response.data.length > 0) {
                var maxSize = 100;
                var matchedDealsList = response.data.slice(0, maxSize).map(function (data) { return " " + data["WIP_DEAL_SID"] });
                var ruleType = vm.rule.IsAutomationIncluded === true ? "Approve Deals Rule" : "<b style='color:red;'>Exclude Deals Rule</b>";
                var postMessage = "<br>" + response.data.length + " deals currently match this rule";
                if (response.data.length > maxSize) postMessage += ", only the first " + maxSize + " are displayed";
                kendo.alert("<span style='color: blue;'>Rule <b>" + vm.rule.Name + "</b> (" + ruleType + ") matches these deals: </span><br><br>" + matchedDealsList + "<span style='color: blue;'><br>" + postMessage + "<span>");
            } else {
                kendo.alert("<b>There are no deals that currently match this rule</b>");
            }
        }, function (response) {
            logger.error("<b style='color:red;'>Error: Unable to Simulate this rule due to system errors</b>");
        });
    }

    vm.AddProduct = function (productName) {
        productName = jQuery.trim(productName).toLocaleLowerCase();
        if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === productName).length === 0) {
            var products = tempProductCriteria.filter(x => x.ProductName.toLowerCase() === productName);
            for (var i = 0; i < products.length; i++) {
                vm.ProductCriteria.push(products[i]);
            }
        }
    }

    var invalidPrice = [];
    var duplicateProducts = [];
    var invalidProducts = [];
    var tempProductCriteria = [];
    vm.ValidateDuplicateInvalidProducts = function () {
        invalidPrice = [];
        var sheet = $scope.spreadsheet.activeSheet();
        $.each(vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price !== ""), function (index, value) {
            if ($.isNumeric(value.Price) === false || parseFloat(value.Price) <= 0)
                invalidPrice.push(value.ProductName.toLocaleLowerCase());
        });

        duplicateProducts = [];
        $.each(vm.ProductCriteria.filter(x => x.ProductName !== ""), function (index, value) {
            if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === value.ProductName.toLowerCase()).length > 1)
                duplicateProducts.push(value.ProductName.toLocaleLowerCase());
        });
        if (invalidProducts.length > 0 || duplicateProducts.length > 0 || invalidPrice.length > 0) {
            tempProductCriteria = vm.ProductCriteria.filter(x => x.ProductName !== "");
            vm.ProductCriteria = [];
            $.each($.unique(invalidProducts), function (index, value) {
                vm.AddProduct(value);
            });
            $.each($.unique(invalidPrice), function (index, value) {
                vm.AddProduct(value);
            });
            $.each($.unique(duplicateProducts), function (index, value) {
                vm.AddProduct(value);
            });
            $.each(tempProductCriteria, function (index, value) {
                vm.AddProduct(value.ProductName);
            });
            vm.dataSourceSpreadSheet.read();
            vm.DeleteSpreadsheetAutoHeader();
            var i;
            if (vm.ProductCriteria.length > 198) {
                for (i = 198; i <= vm.ProductCriteria.length; i++) {
                    if (vm.ProductCriteria[i - 1].ProductName !== "") {
                        sheet.range("A" + i).value(vm.ProductCriteria[i - 1].ProductName);
                        sheet.range("B" + i).value(vm.ProductCriteria[i - 1].Price);
                    }
                }
            }
            for (i = 1; i <= vm.ProductCriteria.length; i++) {
                var str = sheet.range("A" + i).value() != null ? jQuery.trim(sheet.range("A" + i).value()) : "";
                if (str !== "") {
                    var isDuplicateOrInvalidProduct = jQuery.inArray(str.toLowerCase(), duplicateProducts) > -1 || jQuery.inArray(str.toLowerCase(), invalidPrice) > -1;
                    var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                    sheet.range("A" + i).color(isDuplicateOrInvalidProduct ? "orange" : (isValid ? "green" : "black"));
                }
            }
        } else {
            sheet.range("A1:A200").color("green");
        }
        sheet.range("A1:B200").fontSize(12);
        sheet.range("A1:B200").fontFamily("Intel Clear");
    }

    vm.saveRule = function (strActionName, isProductValidationRequired) {
        if (isProductValidationRequired && vm.rule.IsAutomationIncluded && (strActionName === "SUBMIT" || (vm.rule.IsActive && vm.rule.RuleStage)))
            vm.validateProduct(false, true, strActionName);
        else {
            if (strActionName === "SAVE_AS_DRAFT" && vm.rule.IsAutomationIncluded)
                vm.generateProductCriteria();
            $rootScope.$broadcast("UpdateSpinnerDescription", "Please wait while we " + (strActionName === "SUBMIT" ? "submitting" : "saving") + " the rule..");
            $rootScope.$broadcast("save-criteria");
            $timeout(function () {
                var requiredFields = [];
                if (vm.rule.Name == null || vm.rule.Name === "")
                    requiredFields.push("Rule name");
                //if (vm.rule.OwnerId == null || vm.rule.OwnerId === 0)
                //    requiredFields.push("Rule owner");
                if (vm.rule.StartDate == null)
                    requiredFields.push("Rule start date");
                if (vm.rule.EndDate == null)
                    requiredFields.push("Rule end date");
                if (vm.rule.Criteria.filter(x => x.value === "").length > 0)
                    requiredFields.push("Rule criteria is empty");
                if (vm.rule.IsAutomationIncluded && vm.ProductCriteria.filter(x => x.Price !== "" && x.Price > 0 && x.ProductName === "").length > 0)
                    requiredFields.push("A price in product criteria needs a product added");

                var validationFields = [];
                if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                    var dtEffFrom = new Date(vm.rule.StartDate);
                    var dtEffTo = new Date(vm.rule.EndDate);
                    if (dtEffFrom >= dtEffTo)
                        validationFields.push("Rule start date cannot be greater than Rule end date");
                }
                //if (vm.rule.OwnerId != undefined && vm.rule.OwnerId != null) {
                //    if (vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.rule.OwnerId).length === 0)
                //        validationFields.push("Owner cannot be invalid");
                //}
                if (requiredFields.length > 0 || validationFields.length > 0 || (vm.rule.IsAutomationIncluded && ((strActionName === "SUBMIT" || (vm.rule.IsActive && vm.rule.RuleStage))) && (invalidPrice.length > 0 || duplicateProducts.length > 0 || invalidProducts.length > 0))) {
                    var maxItemsSize = 10;
                    var strAlertMessage = "";
                    if (validationFields.length > 0) {
                        strAlertMessage = "<b>Following scenarios are failed!</b></br>" + validationFields.join("</br>");
                    }

                    if (requiredFields.length > 0) {
                        if (strAlertMessage !== "")
                            strAlertMessage += "</br></br>";
                        strAlertMessage += "<b>Please fill the following required fields!</b></br>" + requiredFields.join("</br>");
                    }

                    if (vm.rule.IsAutomationIncluded && ((strActionName === "SUBMIT" || (vm.rule.IsActive && vm.rule.RuleStage)))) {
                        // Replaced with a generalized function call and restricted popup size to not flow off bottom
                        strAlertMessage += myFunction(invalidProducts, maxItemsSize, "Invalid products exist, please fix:");

                        strAlertMessage += myFunction(invalidPrice, maxItemsSize, "Below products has invalid price! Please enter valid Price for highlighted products in orange");

                        strAlertMessage += myFunction(duplicateProducts, maxItemsSize, "Duplicate product entries found and highlighted in orange. Please remove duplicates before publishing.");
                    }
                    kendo.alert(jQuery.trim(strAlertMessage));
                } else {
                    for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                        if (vm.rule.Criteria[idx].type === "list" && vm.rule.Criteria[idx].operator !== "IN") {
                            vm.rule.Criteria[idx].values = vm.rule.Criteria[idx].value;
                            vm.rule.Criteria[idx].value = "";
                        } else {
                            vm.rule.Criteria[idx].values = [];
                        }
                    }

                    var priceRuleCriteria = {
                        Id: vm.rule.Id,
                        Name: vm.rule.Name,
                        IsActive: vm.rule.IsActive,
                        IsAutomationIncluded: vm.rule.IsAutomationIncluded,
                        StartDate: vm.rule.StartDate,
                        EndDate: vm.rule.EndDate,
                        RuleStage: vm.rule.RuleStage,
                        Notes: vm.rule.Notes,
                        Criterias: { Rules: vm.rule.Criteria.filter(x => x.value !== null), BlanketDiscount: [{ value: vm.rule.IsAutomationIncluded ? vm.BlanketDiscountPercentage : "", valueType: { value: "%" } }, { value: vm.rule.IsAutomationIncluded ? vm.BlanketDiscountDollor : "", valueType: { value: "$" } }] },
                        ProductCriteria: vm.rule.IsAutomationIncluded && vm.ProductCriteria.length > 0 ? vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price !== "") : [],
                        OwnerId: vm.rule.OwnerId
                    }
                    vm.UpdatePriceRule(priceRuleCriteria, strActionName);
                }
                // If submit call, close the dialog afterwards.
                if (strActionName === "SUBMIT") {
                    $scope.ok();
                }
            });
        }
    }

    var regexMoney = "^[0-9]+(\.[0-9]{1,2})?$";
    $scope.sheets = [{ name: "Sheet1" }];
    $scope.$on("kendoWidgetCreated", function (event, widget) {
        // the event is emitted for every widget; if we have multiple
        // widgets in this controller, we need to check that the event
        // is for the one we're interested in.
        if (widget === $scope.spreadsheet) {
            var sheets = $scope.spreadsheet.sheets();
            $scope.spreadsheet.activeSheet(sheets[0]);
            var sheet = $scope.spreadsheet.activeSheet();
            sheet.setDataSource(vm.dataSourceSpreadSheet, ["ProductName", "Price"]);
            sheet.columnWidth(0, 350);
            sheet.columnWidth(1, 202);
            sheet.deleteRow(0);
            sheet.range("A1:A200").textAlign("left");
            sheet.range("B1:B200").textAlign("right");
            sheet.range("B1:B200").format("$#,##0.00");
            sheet.range("B1:B200").validation({
                dataType: "custom",
                from: "REGEXP_MATCH(B1)",
                allowNulls: true,
                type: "reject",
                titleTemplate: "Invalid Price",
                messageTemplate: "Format of the price is invalid. This should be greater than zero."
            });
            for (var i = 2; i < 50; i++)
                sheet.hideColumn(i);
            $("#productCriteria").hide();
        }
    });

    $scope.spreadSheetOptions = {
        change: function (arg) {
            //var currCell = $('.k-spreadsheet-name-editor .k-input').val(); //This may need in future
            var str = arg.range.value() != null ? jQuery.trim(arg.range.value()) : "";
            if (str !== "") {
                var isDuplicateOrInvalidProduct = jQuery.inArray(str.toLowerCase(), duplicateProducts) > -1 || jQuery.inArray(str.toLowerCase(), invalidPrice) > -1;
                var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                arg.range.color(isDuplicateOrInvalidProduct ? "orange" : (isValid ? "green" : "black"));
            }
        }
    };

    kendo.spreadsheet.defineFunction("IS_PRODUCT_VALID", function (str) {
        str = jQuery.trim(str);
        var isValid = true;
        if (jQuery.inArray(str.toLowerCase(), vm.LastValidatedProducts) > -1) {
            isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
        }
        return isValid;
    }).args([["str", "string"]]);

    vm.ValidateProductSheet = function () {
        var sheet = $scope.spreadsheet.activeSheet();
        sheet.range("A1:A200").validation({
            dataType: "custom",
            from: "IS_PRODUCT_VALID(A1)",
            allowNulls: true,
            messageTemplate: "Product not found!"
        });
    }

    vm.ValidProducts = [];
    vm.LastValidatedProducts = [];
    vm.validateProduct = function (showPopup, isSave, strActionName) {
        vm.generateProductCriteria();
        $rootScope.$broadcast("UpdateSpinnerDescription", "Please wait while we validating the products..");
        if (vm.ProductCriteria.length > 0) {
            vm.LastValidatedProducts = [];
            for (var i = 0; i < vm.ProductCriteria.length; i++) {
                if (jQuery.inArray(vm.ProductCriteria[i].ProductName.toLowerCase(), vm.LastValidatedProducts) === -1)
                    vm.LastValidatedProducts.push(vm.ProductCriteria[i].ProductName.toLowerCase());
            }
            ruleService.validateProducts(vm.LastValidatedProducts).then(function (response) {
                vm.ValidProducts = response.data;
                invalidProducts = [];
                $.each($.unique($(vm.LastValidatedProducts.filter(x => x !== "")).not(vm.ValidProducts.filter(x => x !== ""))), function (index, value) {
                    invalidProducts.push(value.toLowerCase());
                });
                vm.ValidateProductSheet();
                vm.ValidateDuplicateInvalidProducts();
                if (isSave) {
                    vm.saveRule(strActionName, false);
                }
                if (showPopup) {
                    var maxItemsSize = 10;
                    if (invalidProducts.length > 0 || invalidPrice.length > 0 || duplicateProducts.length > 0) {
                        var strAlertMessage = "";

                        // Replaced with a generalized function call and restricted popup size to not flow off bottom
                        strAlertMessage += myFunction(invalidProducts, maxItemsSize, "Invalid products exist, please fix:");

                        strAlertMessage += myFunction(invalidPrice, maxItemsSize, "Below products has invalid price! Please enter valid Price for highlighted products in orange");

                        strAlertMessage += myFunction(duplicateProducts, maxItemsSize, "Duplicate product entries found and highlighted in orange. Please remove duplicates before publishing.");

                        kendo.alert(jQuery.trim(strAlertMessage));
                    } else if (vm.ValidProducts.filter(x => x !== "").length === vm.LastValidatedProducts.filter(x => x !== "").length)
                        kendo.alert("<b>All Products are Valid</b></br>");
                }
            }, function (response) {
                logger.error("Operation failed");
            });
        }
        else {
            if (isSave) {
                vm.saveRule(strActionName, false);
            }
            if (showPopup)
                kendo.alert("<b>There are no Products to Validate</b></br>");
        }
    }

    function myFunction(itemsList, maxItemsSize, itemsMessage) {
        var retString = "";
        if (itemsList.length > 0) {
            var truncatedMatchedItems = itemsList.slice(0, maxItemsSize).map(function (data) { return " " + data });
            retString += "</br></br>";
            if (truncatedMatchedItems.length < itemsList.length) {
                retString += "<b>" + itemsMessage + " (top " + maxItemsSize + " of " + itemsList.length + " items)</b></br>" + $.unique(truncatedMatchedItems).join("</br>");
                retString += "<br>...<br>";
            } else {
                retString += "<b>" + itemsMessage + "</b></br>" + $.unique(itemsList).join("</br>");
            }
        }
        return retString;
    }

    kendo.spreadsheet.defineFunction("REGEXP_MATCH", function (str) {
        return $.isNumeric(str) && parseFloat(str) > 0;
    }).args([["str", "string"]]);

    vm.dataSourceSpreadSheet = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.ProductCriteria);
            }
        }
    });

    $scope.getConstant();
    if (window.usrRole === "DA") {
        $scope.init();
    }

    $scope.ok = function () {
        $("#productCriteria").hide();
        if (vm.IsRefreshGridRequired && vm.rule.Id > 0) {
            $rootScope.$broadcast("UpdateRuleClient", vm.rule);
        }
        vm.rule = {};
        $uibModalInstance.close();
    };
}
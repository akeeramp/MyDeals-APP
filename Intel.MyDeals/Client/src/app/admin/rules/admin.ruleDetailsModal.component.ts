import { Component, Inject, ViewEncapsulation } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { adminRulesService } from "./admin.rules.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ruleDetailsModalConfig } from './admin.ruleDetailsModal_Config'
import { forkJoin } from 'rxjs';
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";
import { GridDataResult } from "@progress/kendo-angular-grid";
import * as _ from 'underscore';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'


@Component({
    providers: [adminRulesService],
    selector: "ruleDetailsModal",
    templateUrl: "Client/src/app/admin/rules/admin.ruleDetailsModal.component.html",
    styleUrls: ['Client/src/app/admin/rules/admin.rules.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class RuleDetailsModalComponent {
    public strtDate: any;
    public endDt: any;
    public attribute: any;
    public operator: any;
    public idata: any;
    public ProductCriteria: any;
    public ValidProducts: any;
    public invalidPrice: any = [];
    public duplicateProducts: any = [];
    public invalidProducts: any = [];
    public ProductCriteriaData: any[];
    public tempProductCriteria: any[];
    public isAlertVal: boolean;
    public isAlertText: string;
    public strmsg: string;
    public cellMessages: any = [];
    public spinnerMessageHeader: any;
    public spinnerMessageDescription: any;
    public msgType: any;
    public isBusyShowFunFact: any;
    public isElligibleForApproval: any = false;
    public dropdownresponses: any;
    public criteria: any;
    public submitRule: any;

    constructor(public dialogRef: MatDialogRef<RuleDetailsModalComponent>,
        private pteService: pricingTableEditorService,
        @Inject(MAT_DIALOG_DATA) public data, private adminRulesSvc: adminRulesService,
        private loggerSvc: logger) {

    }
    public dealsList = "";
    public selectedIds = [];
    public availAtrField = [];
    public Rules: any;
    public RuleConfig: any;
    public dataCollection = [];
    public isLoading = true;
    public gridData: GridDataResult;
    public isAlert = false;
    public retryAction = false;
    public isOk = false;
    public message = "";
    public priceRuleCriteriaData: any;
    public BlanketDiscountPercentage;
    public BlanketDiscountDollor;
    public availableAttrs = [];
    public initialLoad = true;
    private hotId = "spreadsheet";
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
    public operatorsList = ruleDetailsModalConfig.operatorSettings.operators;
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: false,
        colHeaders: ruleDetailsModalConfig.colHeaders,
        height: 300,
        width: 570,
        minRows: 200,
        minCols: 2,
        comments: true,
        columns: ruleDetailsModalConfig.columns,
        afterChange: (changes, source) => {
            this.hotTable = this.hotRegisterer.getInstance(this.hotId);
            this.afterCellChanges(changes);
        },
        rowHeaders: true,
        copyPaste: true,
        colWidths: [350, 160],
        manualColumnResize: true,
        licenseKey: "470b6-15eca-ea440-24021-aa526",

    };
    public state: State = {
        skip: 0,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };

    afterCellChanges(changes) {
        if (changes != null && changes.length > 0 && changes[0][1] == "ProductName" && changes[0][3] == null) {
            this.ProductCriteria[changes[0][0]][changes[0][1]] = "";
        } else {
            if (changes != null && changes[0][1] == "Price") {
                if (typeof changes[0][3] != 'number') {
                    if (changes[0][3] != null) {
                        let newVal = parseInt(changes[0][3]);
                        if (isNaN(newVal)) {
                            this.isAlertVal = true;
                            this.submitRule = false;
                            this.isOk = false;
                            this.retryAction = true;
                            this.isAlertText = 'Format of the price is invalid. This should be greater than zero.'
                        } else this.ProductCriteria[changes[0][0]].Price = newVal;
                    }
                }
                else {
                    if (changes[0][3] == 0) {
                        this.ProductCriteria[changes[0][0]].Price = changes[0][2];
                        this.isAlertVal = true;
                        this.submitRule = false;
                        this.isOk = false;
                        this.retryAction = true;
                        this.isAlertText = 'Format of the price is invalid. This should be greater than zero.'
                    }
                }
            }
        }
        if (changes != null && changes.length > 0 && this.cellMessages.length > 0) {
            this.cellMessages.map((cell) => {
                let colInd = (changes[0][1] == "ProductName") ? 0 : 1;
                if (cell.row === changes[0][0] && cell.col === colInd) {
                    if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)) {
                        this.hotTable.setCellMetaObject(cell.row, colInd, { 'className': 'normal-product', comment: { value: '' } });
                    }
                }
            });
            this.hotTable.render();
        }
    }

    async getLookupVals() {
        let values: any = {};
        ruleDetailsModalConfig.attributeSettings.forEach((row) => {
            if (row.type == 'list' && row.lookupUrl != undefined) {
                values[`${row.field}`] = this.pteService.readDropdownEndpoint(row.lookupUrl);
            }
        });
        let result = await forkJoin(values).toPromise().catch((err) => {
            this.loggerSvc.error('pricingTableEditorComponent::getAllDrowdownValues::service', err);
        });
        if (result != undefined) this.dropdownresponses = result;
        if (this.initialLoad) {
            this.initialLoad = false;
            await this.loadDetails()
        }
    }

    loadData() {
        if (this.availableAttrs.length === 0) {
            this.availableAttrs = ruleDetailsModalConfig.attributeSettings;
            for (let i = 0; i < ruleDetailsModalConfig.attributeSettings.length; i++) {
                this.availAtrField.push(ruleDetailsModalConfig.attributeSettings[i].field);
            }
        }
        this.criteria = this.Rules.Criterias.Rules.filter(x => this.availAtrField.indexOf(x.field) > -1);
        this.criteria.forEach((row) => {
            if (row.type == 'number' || row.type == 'money' || row.type == 'numericOrPercentage')
                row.value = parseInt(row.value)
        });

        this.criteria.forEach((row, rowInd) => {
            let selectedField = this.availableAttrs.filter(x => x.field == row.field)[0];
            Object.assign(row, { selectedField: selectedField });
            let selectedOperator = this.operatorsList.filter(x => x.operator === row.operator)[0];
            let ops = ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === selectedField.type).length > 0 ? ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === selectedField.type)[0].operator : ''
            let opvalues = [];
            for (let i = 0; i < ops.length; i++) {
                let val = this.operatorsList.filter(x => x.operator === ops[i])
                opvalues.push(val[0]);
            }
            Object.assign(row, {
                opvalues: opvalues,
                selectedOperator: selectedOperator
            })
            if (row.field == 'END_DT') row.value = new Date(row.value);
            let selectedValues = [];
            if (selectedField.lookups != undefined) {
                if (selectedField.field == "GEO_COMBINED" || selectedField.field == "HOST_GEO") {
                    let vals = [];
                    row.values.forEach((item) => {
                        selectedValues.push(item)
                    })
                    selectedField.lookups.forEach((item) => vals.push(item.Value));
                    Object.assign(row, { selectedValues: selectedValues, dropDown: vals })
                } else {
                    let vals = [];
                    let selectedVal = row.value;
                    selectedField.lookups.forEach((item) => vals.push(item.Value));
                    Object.assign(row, {
                        dropDown: vals,
                        selectedValues: selectedVal
                    })
                }
            } else {
                if (selectedField.field == 'QLTR_BID_GEO')
                    row.values.forEach((item) => {
                        selectedValues.push(this.dropdownresponses[selectedField.field].filter(x => x.dropdownName === item)[0])
                    })
                else if (selectedField.field == "PCSR_NBR" || selectedField.field == "OP_CD" || selectedField.field == "DIV_NM" || selectedField.field == "FMLY_NM" || selectedField.field == "PRD_CAT_NM")
                    row.values.forEach((item) => {
                        selectedValues.push(this.dropdownresponses[selectedField.field].filter(x => x.value === item)[0])
                    })
                else if (selectedField.field == "PAYOUT_BASED_ON" || selectedField.field == "MRKT_SEG" || selectedField.field == "SERVER_DEAL_TYPE")
                    row.values.forEach((item) => {
                        selectedValues.push(this.dropdownresponses[selectedField.field].filter(x => x.DROP_DOWN === item)[0])
                    })
                else if (selectedField.field == 'CRE_EMP_NAME')
                    row.values.forEach((item) => {
                        selectedValues.push(this.dropdownresponses[selectedField.field].filter(x => x.EMP_WWID === parseInt(item))[0])
                    })
                else
                    if (selectedField.field == 'CUST_NM')
                        row.values.forEach((item) => {
                            selectedValues.push(this.dropdownresponses[selectedField.field].filter(x => x.CUST_SID === parseInt(item))[0])
                        })
                Object.assign(row, {
                    dropDown: this.dropdownresponses[selectedField.field],
                    selectedValues: selectedValues
                });

            }
        });
        this.criteria[0].selectedValues = "ECAP";
        Object.assign(this.Rules, { Criteria: this.criteria });
        this.strtDate = new Date(this.Rules.StartDate);
        this.endDt = new Date(this.Rules.EndDate);
        this.isElligibleForApproval = this.data.isEligible;
        this.ProductCriteria = this.Rules.ProductCriteria;
        this.generateProductCriteriaData();
        this.validateProduct(false, false, '');
        this.BlanketDiscountPercentage = this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%").length > 0 ? this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%")[0].value : '';
        if (this.BlanketDiscountPercentage != '' && this.BlanketDiscountPercentage != null) {
            this.BlanketDiscountPercentage = parseInt(this.BlanketDiscountPercentage);
        }
        this.BlanketDiscountDollor = this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$").length > 0 ? this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$")[0].value : '';
        if (this.BlanketDiscountDollor != '' && this.BlanketDiscountDollor != null) {
            this.BlanketDiscountDollor = parseInt(this.BlanketDiscountDollor);
        }
        this.isLoading = false;
        this.setBusy('', '', '', false);
    }

    async loadDetails() {
        this.RuleConfig = await this.adminRulesSvc.getPriceRulesConfig().toPromise().catch((error) => {
            this.loggerSvc.error("Unable to get Price Rules Config", error);
        });
        if (this.data.Id != 0 && this.data.Id != undefined) {
            await this.GetRules(this.data.Id, "GET_BY_RULE_ID");
        } else await this.GetRules(0, "GET_BY_RULE_ID");
        this.isLoading = false;
        this.setBusy('', '', '', false);
    }

    ngOnInit() {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we Load the rule....', 'Info', true);
        this.getLookupVals();
    }

    dataChangeMulti(data, i, dataItem, selector) {
        this.Rules.Criteria[i].values = [];
        if (selector == 'dropdownName') {
            dataItem.selectedValues.forEach((item) => {
                if (item.dropdownName != undefined)
                    this.Rules.Criteria[i].values.push(item.dropdownName);
            })
        } else if (selector == 'name') {
            dataItem.selectedValues.forEach((item) => {
                if (item.EMP_WWID != undefined)
                    this.Rules.Criteria[i].values.push(item.EMP_WWID);
            })
        } else if (selector == 'value') {
            if (dataItem.field == 'HOST_GEO' || dataItem.field == 'GEO_COMBINED') {
                dataItem.selectedValues.forEach((item) => {
                    this.Rules.Criteria[i].value = "";
                    this.Rules.Criteria[i].values.push(item);
                })
            } else
                dataItem.selectedValues.forEach((item) => {
                    this.Rules.Criteria[i].values.push(item.value);
                })
        } else if (selector == 'dropdown') {
            dataItem.selectedValues.forEach((item) => {
                this.Rules.Criteria[i].values.push(item.DROP_DOWN);
            })
        } else {
            dataItem.selectedValues.forEach((item) => {
                this.Rules.Criteria[i].values.push(item.CUST_SID);
            })
        }
    }

    dataChange(idx, dataItem, selector, data?) {
        if (selector == 'operator') {
            this.Rules.Criteria[idx].operator = data.operator;
        } else if (selector == 'numerictextbox') {
            this.Rules.Criteria[idx].value = dataItem.value
        } else if (selector == 'textbox') {
            this.Rules.Criteria[idx].value = dataItem.value
        } else if (selector == 'datePicker') {
            this.Rules.Criteria[idx].value = dataItem.value.toString()
        } else {
            this.Rules.Criteria[idx].value = data
            this.Rules.Criteria[idx].selectedValues = data;
        }
    }


    async GetRules(id, actionName) {
        this.adminRulesSvc.getPriceRules(id, actionName).subscribe((response) => {
            this.Rules = response[0];
            this.loadData();
        }, (error) => {
            this.isLoading = false;
            this.setBusy('', '', '', false);
            this.loggerSvc.error("Unable to get Price Rules", error);
        });
    }

    EditBlanketDiscountPercentage() {
        this.BlanketDiscountDollor = "";
    }

    EditBlanketDiscountDollor() {
        this.BlanketDiscountPercentage = "";
    };

    close() {
        this.dialogRef.close();
    }

    runSimulation() {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we Simulate the rule....', 'Info', true);
        let data = new Array();
        const dataRuleIds = [];
        dataRuleIds.push(parseInt(this.Rules.Id, 10))//10 is base 10 number system
        let dataDealsIds = [];

        data.push(dataRuleIds);
        data.push(dataDealsIds);
        this.adminRulesSvc.getRuleSimulationResults(data).subscribe((response) => {
            this.isLoading = false;
            if (response.length > 0) {
                let maxSize = 100;
                let matchedDealsList = response.slice(0, maxSize).map(function (data) { return " " + data["WIP_DEAL_SID"] });
                let ruleType = this.Rules.IsAutomationIncluded === true ? "Approve Deals Rule" : "Exclude Deals Rule";
                let postMessage = '<br/><br/><span class="alertHeader">' + response.length + " deals currently match this rule" + '</span>';
                if (response.length > maxSize) postMessage += '<span class="alertHeader">' + ", only the first " + maxSize + " are displayed</span>";
                this.isLoading = false;
                this.setBusy('', '', '', false);
                this.isAlertVal = true;
                this.isOk = true;
                this.submitRule = false;
                this.retryAction = false;
                this.isAlertText = '<span class="alertHeader">' + "Rule <b>" + this.Rules.Name + "</b> (" + ruleType + ") matches these deals: </span><br/><br/>" + matchedDealsList + "                " + postMessage;
            } else {
                this.isLoading = false;
                this.setBusy('', '', '', false);
                this.isAlertVal = true;
                this.submitRule = false;
                this.isOk = true;
                this.retryAction = false;
                this.isAlertText = '<b class="alertNoMatch">' + "There are no deals that currently match this rule</b>";
            }
        }, (error) => {
            this.isLoading = false;
            this.setBusy('', '', '', false);
            this.loggerSvc.error("Error: Unable to Simulate the rule due to system error", error);
        });
    }

    public toggleType(currentState, toggleButtonEvent) {
        if (currentState !== true) {
            this.BlanketDiscountDollor = "";
            this.BlanketDiscountPercentage = "";
            if (toggleButtonEvent) {

                this.Rules.RuleStage = true;
                this.Rules.IsActive = true;
            }
        }
        else {
            if (toggleButtonEvent) {
                this.Rules.RuleStage = false;
                this.Rules.IsActive = false;
            }
        }
    }

    UpdateRuleIndicator(ruleId, isTrue, strActionName, isApproved) {
        if (ruleId != null && ruleId >= 0 && isApproved) {
            let priceRuleCriteria = { Id: ruleId }
            switch (strActionName) {
                case "UPDATE_ACTV_IND": {
                    Object.assign(priceRuleCriteria, { IsActive: isTrue });
                } break;
                case "UPDATE_STAGE_IND": {
                    Object.assign(priceRuleCriteria, { RuleStage: isTrue });
                    Object.assign(priceRuleCriteria, { IsActive: isTrue });
                } break;
            }

            this.adminRulesSvc.updatePriceRule(priceRuleCriteria, strActionName).subscribe((response) => {
                if (response.Id > 0) {
                    this.Rules.ChangedBy = response.ChangedBy;
                    this.Rules.ChangeDateTime = response.ChangeDateTime;
                    this.Rules.ChangeDateTimeFormat = response.ChangeDateTimeFormat;
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            this.Rules.IsActive = isTrue;
                            this.Rules.RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            this.loggerSvc.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                        } break;
                        case "UPDATE_STAGE_IND": {
                            this.Rules.RuleStage = isTrue;
                            this.Rules.RuleStageLabel = isTrue ? "Approved" : "Pending Approval";
                            this.Rules.IsActive = isTrue;
                            this.Rules.RuleStatusLabel = isTrue ? "Active" : "Inactive";
                            this.loggerSvc.success("Rule has been updated successfully with the stage '" + (isTrue ? "Approved" : "Pending") + "'");
                        } break;
                    }
                }
                else {
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            this.Rules.IsActive = !isTrue;
                        } break;
                        case "UPDATE_STAGE_IND": {
                            this.Rules.RuleStage = !isTrue;
                            this.Rules.IsActive = !isTrue;
                        } break;
                    }
                    this.loggerSvc.error("Unable to update rule's indicator", '');
                }
            }, function (response) {
                switch (strActionName) {
                    case "UPDATE_ACTV_IND": {
                        this.Rules.IsActive = !isTrue;
                    } break;
                    case "UPDATE_STAGE_IND": {
                        this.Rules.RuleStage = !isTrue;
                        this.Rules.IsActive = !isTrue;
                    } break;
                }
                this.loggerSvc.error("Operation failed");
            });
        }
    }

    addRow(index) {
        this.Rules.Criteria.splice(index + 1, 0, {
            field: '',
            operator: "",
            subType: null,
            type: "",
            value: "",
            valueType: []
        });
    }
    async valueChange(dataItem, index, action?: any) {
        let ops = ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === dataItem.type).length > 0 ? ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === dataItem.type)[0].operator : ''
        let opvalues = [];
        for (let i = 0; i < ops.length; i++) {
            let val = this.operatorsList.filter(x => x.operator === ops[i])
            opvalues.push(val[0]);
        }
        let selectedOperator = opvalues[0]
        Object.assign(this.Rules.Criteria[index], {
            opvalues: opvalues,
            selectedOperator: selectedOperator
        })
        if (dataItem.lookups != undefined) {
            if (dataItem.field == "GEO_COMBINED" || dataItem.field == "HOST_GEO" || dataItem.field == "HAS_TRCK") {
                let vals = [];
                dataItem.lookups.forEach((item) => vals.push(item.Value));
                Object.assign(this.Rules.Criteria[index], { dropDown: vals })
            } else {
                let vals = [];
                dataItem.lookups.forEach((item) => vals.push(item.Value));
                Object.assign(this.Rules.Criteria[index], {
                    dropDown: vals
                })
            }
        } else {
            Object.assign(this.Rules.Criteria[index], {
                dropDown: this.dropdownresponses[dataItem.field]
            });
        }
        this.Rules.Criteria[index].field = dataItem.field;
        this.Rules.Criteria[index].operator = opvalues[0].operator;
        this.Rules.Criteria[index].subType = dataItem.subType != undefined ? dataItem.subType  : null;
        this.Rules.Criteria[index].type = dataItem.type;
        this.Rules.Criteria[index].value = "";
        this.Rules.Criteria[index].valueType = dataItem.valueType != undefined ? dataItem.valueType : null;
        this.Rules.Criteria[index].values = [];
        if (this.Rules.Criteria[index].selectedValues)
            this.Rules.Criteria[index].selectedValues = [];
        Object.assign(this.Rules.Criteria[index], {
            selectedField: dataItem,
            selectedOperator: selectedOperator
        });
    }

    async saveRule(strActionName, isProductValidationRequired) {
        if (this.Rules.IsActive && isProductValidationRequired) {
            this.submitRule = true
            this.isOk = false;
            this.isAlertVal = true; this.isAlertText = 'Saving these changes will require the rule to be re-approved. Are you sure that you wish to save the changes??';
        } else {
            await this.updateRuleDraft(strActionName, isProductValidationRequired);
        }
        this.isLoading = false; this.setBusy('', '', '', false);
    }

    async UpdatePriceRule(priceRuleCriteria, strActionName) {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we update the rule....', 'Info', true);
        let initialRuleId = priceRuleCriteria.Id;
        let response: any = await this.adminRulesSvc.updatePriceRule(priceRuleCriteria, strActionName).toPromise().catch((err) => {
            this.loggerSvc.error(("Unable to  " + (initialRuleId === 0 ? "add" : "update") + " the rule"), '');
        });
        if (response.Id > 0) {
            this.Rules = this.priceRuleCriteriaData
            this.loadData();
            this.Rules.ChangedBy = response.ChangedBy;
            this.Rules.ChangeDateTime = response.ChangeDateTime;
            this.Rules.ChangeDateTimeFormat = response.ChangeDateTimeFormat;
            this.Rules.OwnerName = this.RuleConfig.DA_Users.filter(x => x.EMP_WWID === this.Rules.OwnerId).length > 0 ? this.RuleConfig.DA_Users.filter(x => x.EMP_WWID === this.Rules.OwnerId)[0].NAME : (this.Rules.OwnerId === this.RuleConfig.CurrentUserWWID ? this.RuleConfig.CurrentUserName : "NA");
            this.Rules.RuleStage = response.IsActive
            this.Rules.RuleStatusLabel = response.IsActive ? "Active" : "Inactive";
            this.Rules.RuleStageLabel = response.RuleStage ? "Approved" : "Pending Approval";
            this.Rules.RuleAutomationLabel = response.IsAutomationIncluded ? "Auto Approval" : "Exclusion Rule";
            this.isLoading = false;
            this.setBusy('', '', '', false);
            this.loggerSvc.success("Rule has been " + (initialRuleId === 0 ? "added" : "updated"));
        } else {
            this.loadData();
            this.isLoading = false;
            this.setBusy('', '', '', false);
            this.loggerSvc.error("This rule name already exists in another rule.", '');
        }
    };

    generateProductCriteriaData() {
        this.ProductCriteriaData = [];
        let tempRange = this.ProductCriteria.filter(x => x.ProductName != null && x.ProductName != '');
        if (tempRange.length > 0) {
            for (let i = 0; i < tempRange.length; i++) {
                let newProduct = {
                    ProductName: null,
                    Price: null
                };
                newProduct.ProductName = tempRange[i].ProductName != null ? tempRange[i].ProductName : null;
                newProduct.Price = tempRange[i].Price != null ? tempRange[i].Price : null;
                this.ProductCriteriaData.push(newProduct);
            }
        }
    }


    async validateProduct(showPopup, isSave, strActionName) {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we validating the products..', 'Info', true);
        if (strActionName != "")
            this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        let cellComments = [];
        this.generateProductCriteriaData();
        this.strmsg = ''
        if (this.ProductCriteriaData.length > 0) {
            let LastValidatedProducts = [];
            this.invalidProducts = [];
            this.invalidPrice = [];
            this.duplicateProducts = [];
            for (let i = 0; i < this.ProductCriteriaData.length; i++) {
                if (!(this.ProductCriteriaData[i].Price > 0)) {
                    this.invalidPrice.push(this.ProductCriteriaData[i].ProductName);
                }
                for (let j = i + 1; j < this.ProductCriteriaData.length; j++) {
                    if (this.ProductCriteriaData[i].ProductName === this.ProductCriteriaData[j].ProductName) {
                        this.duplicateProducts.push(this.ProductCriteriaData[i].ProductName);
                    }
                }
            }
            for (let i = 0; i < this.ProductCriteriaData.length; i++) {
                LastValidatedProducts.push(this.ProductCriteriaData[i].ProductName.toLowerCase());
            }
            let response = await this.adminRulesSvc.validateProducts(LastValidatedProducts).toPromise().catch((err) => {
                this.loggerSvc.error("Operation failed", '', err);
            });
            if (response) {
                this.ValidProducts = response;
                if (LastValidatedProducts.length != this.ValidProducts) {
                    for (let i = 0; i < LastValidatedProducts.length; i++) {
                        if (!this.ValidProducts.includes(LastValidatedProducts[i]))
                            this.invalidProducts.push(LastValidatedProducts[i]);
                    }
                }
            }
            if (this.duplicateProducts.length > 0) {
                this.strmsg += '<br/><b>Duplicate product entries found and highlighted in orange.Please remove duplicates before publishing.</b><br/>';

                for (let i = 0; i < this.duplicateProducts.length; i++) {
                    this.strmsg += this.duplicateProducts[i] + '<br/>';
                    this.invalidValuesCellComments('ProductName', 'Duplicate product entries found and highlighted in orange.Please remove duplicates before publishing.', cellComments, 0, this.duplicateProducts[i]);
                    this.cellMessages = cellComments;
                    this.hotTable.updateSettings({
                        cell: this.cellMessages
                    })
                }

            }
            if (this.invalidPrice.length > 0) {
                this.strmsg += '<br/><br/><b>Below products has invalid price! Please enter valid Price for highlighted products in orange</b><br/>';
                this.invalidValuesCellComments('Price', '<b>Below products has invalid price! Please enter valid Price for highlighted products in orange</b><br/>', cellComments, 1, null);
                this.cellMessages = cellComments;
                this.hotTable.updateSettings({
                    cell: this.cellMessages
                })
                for (let i = 0; i < this.invalidPrice.length; i++) {
                    this.strmsg += this.invalidPrice[i] + '<br/>';
                }
            };
            if (this.invalidProducts.length > 0) {
                this.strmsg += '<br/><br/><b class="alertNoMatch">Invalid products exist, please fix:</b><br/>';

                for (let i = 0; i < this.invalidProducts.length; i++) {
                    this.strmsg += this.invalidProducts[i] + '<br/>';
                    this.invalidValuesCellComments('ProductName', 'Invalid products exist, please fix', cellComments, 0, this.invalidProducts[i]);
                    this.cellMessages = cellComments;
                    this.hotTable.updateSettings({
                        cell: this.cellMessages
                    })
                }
            }
            if (this.duplicateProducts.length == 0 && this.invalidPrice.length == 0 && this.invalidProducts.length == 0) {
                for (let i = 0; i < this.ValidProducts.length; i++) {
                    this.invalidValuesCellComments('ProductName', '', cellComments, 0, this.ValidProducts[i]);
                    this.cellMessages = cellComments;
                    this.hotTable.updateSettings({
                        cell: this.cellMessages
                    })
                }
                if (!(strActionName == '' || strActionName == 'SUBMIT')) {
                    this.isLoading = false;
                    this.setBusy('', '', '', false);
                    this.isAlertVal = true;
                    this.isOk = true;
                    this.submitRule = false;
                    this.retryAction = false;
                    this.isAlertText = 'All Products are valid'
                }
                if (isSave) {
                    this.saveRule(strActionName, false);
                }
            } else {
                this.isLoading = false;
                this.setBusy('', '', '', false);
                if (strActionName != "") {
                    this.isAlertVal = true;
                    this.isOk = true;
                    this.submitRule = false;
                    this.retryAction = false;
                    this.isAlertText = this.strmsg;
                }
            }

        }
        else {
            if (isSave) {
                this.saveRule(strActionName, false);
            }
            if (showPopup) {
                this.isAlertVal = true;
                this.isOk = true;
                this.submitRule = false;
                this.retryAction = false;
                this.isAlertText = "<b>There are no Products to Validate</b></br>";
            }
        }
        this.isLoading = false;
        this.setBusy('', '', '', false);
    }

    invalidValuesCellComments(colName, celMsg, comments, colNo, value) {
        this.ProductCriteria.forEach((row, rowInd) => {
            if (row[colName] != '' && row[colName] != null && this.duplicateProducts.length > 0) {
                if (colName === 'ProductName') {
                    if (row[colName] == value[colName])
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'warning-product error-cell'
                        });
                }
            }
            if (row[colName] != '' && row[colName] != null && celMsg.length > 1) {
                if (colName === 'ProductName') {
                    if (row[colName].toLowerCase() == value)
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'error-product error-cell'
                        });

                } else {
                    if (row[colName] != undefined && (row[colName] == value || row[colName] == 0)) {
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'error-product error-cell'
                        });
                        comments.push({
                            row: (rowInd),
                            col: 0,
                            comment: { value: '', readOnly: false },
                            className: 'warning-product'
                        });
                    }

                }
            } else if (this.invalidPrice.length > 0 && row.ProductName != undefined && row.ProductName != '' && (row[colName] == undefined || row[colName] == null || row[colName] == 0)) {
                comments.push({
                    row: (rowInd),
                    col: 0,
                    comment: { value: '', readOnly: false },
                    className: 'warning-product'
                });
                comments.push({
                    row: (rowInd),
                    col: colNo,
                    comment: { value: celMsg, readOnly: false },
                    className: 'error-product error-cell'
                });
                Object.assign(this.ProductCriteria[rowInd], { 'Price': 0 });
            } else {
                if (row[colName] != '' && row[colName] != null && row[colName].toLowerCase() == value)
                    comments.push({
                        row: (rowInd),
                        col: colNo,
                        comment: { value: '', readOnly: false },
                        className: 'success-product'
                    });

            }
        });
        return comments;
    }

    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";

            // if no change in state, simply update the text            
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    async closeAlertVal(str?) {
        this.isAlertVal = false;
        this.isOk = false;
        this.submitRule = false;

        this.retryAction = false;
        if (this.isAlertText == 'Saving these changes will require the rule to be re-approved. Are you sure that you wish to save the changes??') {
            if (str == 'yes') await this.updateRuleDraft('Submit', true);
            this.isElligibleForApproval = this.data.isEligible;
        }
        else {
            if (this.isAlertText.startsWith('Below')) {
                await this.UpdatePriceRule(this.priceRuleCriteriaData, 'Submit');
            }
        }
    }

    async updateRuleDraft(strActionName, isProductValidationRequired) {
        if (isProductValidationRequired && this.Rules.IsAutomationIncluded && (strActionName === "SUBMIT" || (this.Rules.IsActive && this.Rules.RuleStage)))
            await this.validateProduct(false, true, strActionName);
        else {
            this.isLoading = true;
            this.setBusy('Price Rules', 'Please wait while we Save the rule..', 'Info', true);
            if (strActionName === "SAVE_AS_DRAFT" && this.Rules.IsAutomationIncluded)
                this.generateProductCriteriaData();
            let requiredFields = [];
            if (this.Rules.Name == null || this.Rules.Name === "")
                requiredFields.push("Rule name");
            if (this.strtDate == null)
                requiredFields.push("Rule start date");
            if (this.endDt == null)
                requiredFields.push("Rule end date");
            if ((this.Rules.Criteria.filter(x => x.value === "").length > 0)) {
                let newset = this.Rules.Criteria.filter(x => x.value === "");
                if (newset.filter(x => x.values.length == 0 || x.values === '').length > 0)
                    requiredFields.push("Rule criteria is empty");
            }
            if (this.Rules.IsAutomationIncluded && this.ProductCriteria.filter(x => x.Price !== "" && x.Price > 0 && x.ProductName === "").length > 0)
                requiredFields.push("A price in product criteria needs a product added");

            let validationFields = [];
            if (this.strtDate != null && this.endDt != null) {
                let dtEffFrom = this.strtDate;
                let dtEffTo = this.endDt;
                if (dtEffFrom >= dtEffTo)
                    validationFields.push("Rule start date cannot be greater than Rule end date");
            }

            if (requiredFields.length > 0 || validationFields.length > 0 || (this.Rules.IsAutomationIncluded && ((strActionName === "SUBMIT" || (this.Rules.IsActive && this.Rules.RuleStage))) && (this.invalidPrice.length > 0 || this.duplicateProducts.length > 0 || this.invalidProducts.length > 0))) {
                let maxItemsSize = 10;
                let strAlertMessage = "";
                if (validationFields.length > 0) {
                    strAlertMessage = "<b>Following scenarios are failed!</b><br/>"
                    for (let i = 0; i < validationFields.length; i++) {
                        strAlertMessage += validationFields[i] + '<br/>';
                    }
                }

                if (requiredFields.length > 0) {
                    if (strAlertMessage !== "")
                        strAlertMessage += " ";
                    strAlertMessage += "<b>Please fill the following required fields!</b><br/>";
                    for (let i = 0; i < requiredFields.length; i++) {
                        strAlertMessage += requiredFields[i] + '<br/>';
                    }
                }

                if (this.Rules.IsAutomationIncluded && ((strActionName === "SUBMIT" || (this.Rules.IsActive && this.Rules.RuleStage)))) {
                    strAlertMessage += " ";
                    strAlertMessage += this.strmsg;
                }
                this.isLoading = false;
                this.setBusy('', '', '', false);
                this.isAlertVal = true;
                this.submitRule = false;
                this.isOk = true;
                this.retryAction = false;
                this.isAlertText = strAlertMessage

            } else {
                this.criteria = this.Rules.Criteria
                this.criteria.forEach((item) => {
                    delete item.dropDown;
                    delete item.opvalues;
                    delete item.selectedField;
                    delete item.selectedOperator;
                    delete item.selectedValues;
                    if (item.values.length > 0) {
                        item.value = '';
                    }
                });
                this.criteria[0].value = "ECAP"
                this.Rules.IsActive = false;
                this.Rules.RuleStage = false;
                this.generateProductCriteriaData();
                if (this.BlanketDiscountDollor == null) this.BlanketDiscountDollor = '';
                if (this.BlanketDiscountPercentage == null) this.BlanketDiscountPercentage = '';
                this.priceRuleCriteriaData = {
                    Id: this.Rules.Id,
                    Name: this.Rules.Name,
                    IsActive: this.Rules.IsActive == true ? false : true,
                    IsAutomationIncluded: this.Rules.IsAutomationIncluded,
                    StartDate: this.strtDate,
                    EndDate: this.endDt,
                    RuleStage: this.Rules.RuleStage == true ? false : true,
                    Notes: this.Rules.Notes,
                    Criterias: { Rules: this.criteria, BlanketDiscount: [{ value: this.Rules.IsAutomationIncluded ? this.BlanketDiscountPercentage : "", valueType: { value: "%" } }, { value: this.Rules.IsAutomationIncluded ? this.BlanketDiscountDollor : "", valueType: { value: "$" } }] },
                    ProductCriteria: this.Rules.IsAutomationIncluded && this.ProductCriteria.length > 0 ? this.ProductCriteriaData : [],
                    OwnerId: this.Rules.OwnerId
                }

                let duplicateListXml = [];
               this.priceRuleCriteriaData.Criterias.Rules.filter(x => x.type == "list" && x.subType == "xml").forEach((value) => {
                   let strTitle = this.availableAttrs.filter(x => x.field == value.field)[0].title;
                    if (duplicateListXml.indexOf(strTitle) < 0 && this.priceRuleCriteriaData.Criterias.Rules.filter(x => x.field == value.field).length > 1)
                        duplicateListXml.push(strTitle);
                });
                if (duplicateListXml.length == 0) {
                    await this.UpdatePriceRule(this.priceRuleCriteriaData, strActionName);
                }
                else {
                    this.isLoading = false;
                    this.setBusy('', '', '', false);
                    this.isAlertVal = true;
                    this.submitRule = false;
                    this.isAlertText = "<b>Below" + (duplicateListXml.length == 1 ? "attribute" : "attributes") + " cannot be duplicate, This will be merged into single attribute. Would you like to continue?</br></br></b>" + duplicateListXml.join("</br>");
                }
            }
        }
        this.isLoading = false;
        this.setBusy('', '', '', false);
    }

    removeRow(index) {
        if (index > -1) {
            this.Rules.Criteria.splice(index, 1);
        }
    }

    cancelAlert() {
        this.isAlert = false;
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.dataCollection, fieldName).map(item => item[fieldName]);
    }
}
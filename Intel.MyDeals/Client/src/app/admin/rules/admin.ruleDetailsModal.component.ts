import * as angular from 'angular';
import { Component, Inject, ViewEncapsulation } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
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
import { forEach } from 'angular';


@Component({
    providers: [adminRulesService],
    selector: "ruleDetailsModal",
    templateUrl: "Client/src/app/admin/rules/admin.ruleDetailsModal.component.html",
    styleUrls: ['Client/src/app/admin/rules/admin.rules.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class RuleDetailsModalComponent {
    strtDate: any;
    endDt: any;
    attribute: any;
    operator: any;
    idata: any;
    opvalues= [];
    intype: any;
    ProductCriteria: any;
    ValidProducts: any;
    invalidPrice: any = [];
    duplicateProducts: any=[];
    invalidProducts: any=[];
    ProductCriteriaData: any[];
    tempProductCriteria: any[];
    isAlertVal: boolean;
    public isAlertText: string;
    strmsg: string;
    cellMessages: any =[];
    spinnerMessageHeader: any;
    spinnerMessageDescription: any;
    msgType: any;
    isBusyShowFunFact: any;

    constructor(public dialogRef: MatDialogRef<RuleDetailsModalComponent>,
        private pteService: pricingTableEditorService,
        @Inject(MAT_DIALOG_DATA) public data, private adminRulesSvc: adminRulesService,
        private loggerSvc: logger) {

    }
    public dealsList = "";
    public selectedIds = [];
    public availAtrField = [];
    public Rules :any;
    public RuleConfig :any;
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
    public availableops = [];
    private hotId = "spreadsheet";
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
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
        licenseKey: "8cab5-12f1d-9a900-04238-a4819",
        
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
                if (!(changes[0][3] >= 1 || changes[0][3] == null)) {
                    this.isAlertVal = true;
                    this.isOk = false;
                    this.retryAction = true;
                    this.isAlertText = 'Format of the price is invalid. This should be greater than zero.'
                    if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)) {
                        this.hotTable.setDataAtCell(changes[0][0], 1, null);
                    }
                }
            }
        }
        if (this.cellMessages.length > 0) {
            this.cellMessages.map((cell) => {
                let colInd = (changes[0][1] == "ProductName") ? 0 : 1;
                if (cell.row === changes[0][0] && cell.col === colInd) {
                    if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)) {
                        this.hotTable.setCellMeta(cell.row, colInd, 'className', 'normal-product');

                    }

                }
            });
            this.hotTable.render();
        }
    }

    async ngOnInit() {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we Load the rule....', 'Info', true);
        this.RuleConfig = await this.adminRulesSvc.getPriceRulesConfig().toPromise().catch((error) => {
            this.loggerSvc.error("Unable to get Price Rules Config", error);
        });
        if (this.data.Id != 0 && this.data.Id != undefined) {
            await this.GetRules(this.data.Id, "GET_BY_RULE_ID");
        } else await this.GetRules(0, "GET_BY_RULE_ID");
        this.isLoading = false;
        this.setBusy('', '', '', false);
    }

    async GetRules(id, actionName) {
        this.adminRulesSvc.getPriceRules(id, actionName).subscribe((response) => {
            this.Rules = response[0];
            if (this.availableAttrs.length === 0) {
                for (let i = 0; i < ruleDetailsModalConfig.attributeSettings.length; i++) {
                    this.availableAttrs.push(ruleDetailsModalConfig.attributeSettings[i].title);
                    this.availAtrField.push(ruleDetailsModalConfig.attributeSettings[i].field);
                }
            }
            let Criteria: any = this.Rules.Criterias.Rules.filter(x => this.availAtrField.indexOf(x.field) > -1);
            Criteria.forEach((row) => {
                if (row.type == 'number' || row.type == 'money' || row.type == 'numericOrPercentage')
                    row.value = parseInt(row.value)
            });
            Object.assign(this.Rules, { Criteria: Criteria });
            for (let idx = 0; idx < this.Rules.Criteria.length; idx++) {
                if (this.Rules.Criteria[idx].type === "list" && this.Rules.Criteria[idx].operator !== "IN") {
                    this.Rules.Criteria[idx].value = this.Rules.Criteria[idx].values;
                }
                this.attribute = ruleDetailsModalConfig.attributeSettings.filter(x => x.field === this.Rules.Criterias.Rules[idx].field).length > 0 ? ruleDetailsModalConfig.attributeSettings.filter(x => x.field === this.Rules.Criterias.Rules[idx].field)[0].title : '';
                Object.assign(this.Rules.Criteria[idx], { title: this.attribute });
                this.operator = ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === this.Rules.Criterias.Rules[idx].operator).length > 0 ? ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === this.Rules.Criterias.Rules[idx].operator)[0].label : '';
                Object.assign(this.Rules.Criteria[idx], { operatorName: this.operator });
                if (ruleDetailsModalConfig.attributeSettings.filter(x => x.title === this.attribute)[0].lookups != undefined) {
                    let value: any = ruleDetailsModalConfig.attributeSettings.filter(x => x.title === this.attribute).length > 0 ? Object.values(ruleDetailsModalConfig.attributeSettings.filter(x => x.title === this.attribute)[0].lookups) : '';
                    for (let i = 0; i < value.length; i++) {
                        this.Rules.Criteria[idx].values.push(value[i].Value);
                    }
                }
            }
            this.strtDate = new Date(this.Rules.StartDate);
            this.intype = this.Rules.Criteria[0].type;
            this.endDt = new Date(this.Rules.EndDate);
            this.ProductCriteria = this.Rules.ProductCriteria;
            this.generateProductCriteriaData();
            this.validateProduct(false, false, '');
            this.BlanketDiscountPercentage = this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%").length > 0 ? this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%")[0].value : '';
            if (this.BlanketDiscountPercentage != '') {
                this.BlanketDiscountPercentage = parseInt(this.BlanketDiscountPercentage);
            }
            this.BlanketDiscountDollor = this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$").length > 0 ? this.Rules.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$")[0].value : '';
            if (this.BlanketDiscountDollor != '') {
                this.BlanketDiscountDollor = parseInt(this.BlanketDiscountDollor);
            }
            this.isLoading = false;
            this.setBusy('', '', '', false);
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

        data.push(dataRuleIds, dataDealsIds);
        this.adminRulesSvc.getRuleSimulationResults(data).subscribe((response) => {
            this.isLoading = false;
            if (response.length > 0) {
                let maxSize = 100;
                let matchedDealsList = response.slice(0, maxSize).map(function (data) { return " " + data["WIP_DEAL_SID"] });
                let ruleType = this.Rules.IsAutomationIncluded === true ? "Approve Deals Rule" : "Exclude Deals Rule";
                let postMessage = '<br/><br/><span class="alertHeader">'+ response.length + " deals currently match this rule"+ '</span>';
                if (response.length > maxSize) postMessage += '<span class="alertHeader">'+", only the first " + maxSize + " are displayed</span>";
                this.isLoading = false;
                this.setBusy('', '', '', false);
                this.isAlertVal = true;
                this.isOk = true;
                this.retryAction = false;
                this.isAlertText = '<span class="alertHeader">' + "Rule <b>" + this.Rules.Name +"</b> (" + ruleType + ") matches these deals: </span><br/><br/>"+ matchedDealsList + "                " + postMessage ;
            } else {
                this.isLoading = false;
                this.setBusy('', '', '', false);
                this.isAlertVal = true;
                this.isOk = true;
                this.retryAction = false;
                this.isAlertText = '<b class="alertNoMatch">'+"There are no deals that currently match this rule</b>";
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

            this.adminRulesSvc.updatePriceRule(priceRuleCriteria, strActionName).subscribe( (response)=> {
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
                    this.loggerSvc.error("Unable to update rule's indicator",'');
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
        this.attribute = ruleDetailsModalConfig.attributeSettings.filter(x => x.field === this.Rules.Criteria[index + 1].field).length > 0 ? ruleDetailsModalConfig.attributeSettings.filter(x => x.field === this.Rules.Criteria[index + 1].field)[0].title : '';
        Object.assign(this.Rules.Criteria[index + 1], { title: this.attribute });
        this.operator = ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === this.Rules.Criteria[index + 1].operator).length > 0 ? ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === this.Rules.Criteria[index + 1].operator)[0].label : '';
        Object.assign(this.Rules.Criteria[index + 1], { operatorName: this.operator });
    }
    async valueChange(title, index, action?: any) {
        if (action == 'combobox') {
            this.Rules.Criteria[index].value = title;
        } else {
            let values: any[]= [];
            this.intype = ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title).length > 0 ? ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title)[0].type : '';
            this.Rules.Criteria[index].type = this.intype;
            let ops = ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === this.intype).length > 0 ? ruleDetailsModalConfig.operatorSettings.types2operator.filter(x => x.type === this.intype)[0].operator : ''
            for (let i = 0; i < ops.length; i++) {
                let val = ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === ops[i]).length > 0 ? ruleDetailsModalConfig.operatorSettings.operators.filter(x => x.operator === ops[i])[0].label : '';
                if (i == 0) {
                    this.Rules.Criteria[index].operatorName = val;
                }
                this.opvalues.push(val);
            }
            if (ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title)[0].lookups != undefined) {
                let value: any = ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title).length > 0 ? Object.values(ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title)[0].lookups) : '';
                for (let i = 0; i < value.length; i++) {
                    values.push(value[i].Value);
                }
            } else {
                if (ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title)[0].lookupUrl != undefined) {
                    let value = await this.pteService.readDropdownEndpoint(ruleDetailsModalConfig.attributeSettings.filter(x => x.title === title)[0].lookupUrl)
                    let result = await forkJoin(value).toPromise().catch((err) => {
                        this.loggerSvc.error('pricingTableEditorComponent::getAllDrowdownValues::service', err);
                    });
                    if (result != undefined) {
                        result[0].forEach((row, rowInd) => {
                            if (title == "Bid Geo") {
                                values.push(row.dropdownName);
                            } else if (title == "Created/Modified By Name") {
                                values.push(row.NAME);
                            } else if (title == "Processor Number" || title == "Op Code" || title == "Product Division" || title == "Family" || title == "Product Verticals") {
                                values.push(row.value);
                            } else if (title == "Payout Based On" || title == "Market Segment" || title == "Server Deal Type") {
                                values.push(row.DROP_DOWN);
                            } else {
                                if (title == "Customer") {
                                    values.push(row.CUST_NM);
                                }
                            }
                        });
                    }
                }
            }
            Object.assign(this.Rules.Criteria[index], { values: values });
        }
    }

    async saveRule(strActionName, isProductValidationRequired) {
        if (this.Rules.RuleStage && isProductValidationRequired) {
            //To Avoid duplicate confirmation popup            
            this.loggerSvc.info('save', '');
            this.isAlertVal = true; this.isAlertText = 'Perform this action?';
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
            this.loggerSvc.error(("Unable to  " + (initialRuleId === 0 ? "add" : "update") + " the rule"),'');
        });
        if (response.Id > 0) {
            this.Rules = response;
            this.Rules.ChangedBy = response.ChangedBy;
            this.Rules.ChangeDateTime = response.ChangeDateTime;
            this.Rules.ChangeDateTimeFormat = response.ChangeDateTimeFormat;
            let Criteria = this.Rules.Criterias.Rules.filter(x => this.availAtrField.indexOf(x.field) > -1);
            Object.assign(this.Rules, { Criteria: Criteria });
            this.Rules.OwnerName = this.RuleConfig.DA_Users.filter(x => x.EMP_WWID === this.Rules.OwnerId).length > 0 ? this.RuleConfig.DA_Users.filter(x => x.EMP_WWID === this.Rules.OwnerId)[0].NAME : (this.Rules.OwnerId === this.RuleConfig.CurrentUserWWID ? this.RuleConfig.CurrentUserName : "NA");
            this.Rules.RuleStage = this.Rules.IsActive
            this.Rules.RuleStatusLabel = this.Rules.IsActive ? "Active" : "Inactive";
            this.Rules.RuleStageLabel = this.Rules.RuleStage ? "Approved" : "Pending Approval";
            this.Rules.RuleAutomationLabel = this.Rules.IsAutomationIncluded ? "Auto Approval" : "Exclusion Rule";
            this.isLoading = false;
            this.setBusy('', '', '', false);
            this.loggerSvc.success("Rule has been " + (initialRuleId === 0 ? "added" : "updated"));
        } else {
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
                    ProductName:null,
                    Price: null
                };
                newProduct.ProductName = tempRange[i].ProductName != null ? tempRange[i].ProductName : null;
                newProduct.Price = tempRange[i].Price != null ? tempRange[i].Price: null;
                this.ProductCriteriaData.push(newProduct);
            }
        }
    }

  
    async validateProduct(showPopup, isSave, strActionName) {
        this.isLoading = true;
        this.setBusy('Price Rules', 'Please wait while we validating the products..', 'Info', true);
        if (strActionName != "") 
            this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        let cellComments=[];
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
                this.loggerSvc.error("Operation failed",'',err);
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
                if (strActionName != '') {
                    this.isLoading = false;
                    this.setBusy('', '', '', false);
                    this.isAlertVal = true;
                    this.isOk = true;
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
                    this.retryAction = false;
                    this.isAlertText = this.strmsg;
                }
            }
           
        }
        else {
            if (isSave) {
                this.saveRule(strActionName, false);
            }
            if (showPopup)
                this.loggerSvc.error("<b>There are no Products to Validate</b></br>",'');
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
                    if (row[colName] != '' && row[colName] != null && (row[colName] == value || row[colName] == 0)) {
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

    async closeAlertVal() {
        this.isAlertVal = false;
        this.isOk = false;
        this.retryAction = false;
        if (this.isAlertText == 'Perform this action?') {
            await this.updateRuleDraft('Submit', true);
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
                if (this.Rules.StartDate == null)
                    requiredFields.push("Rule start date");
                if (this.Rules.EndDate == null)
                    requiredFields.push("Rule end date");
                if (this.Rules.Criteria.filter(x => x.value === "").length > 0)
                    requiredFields.push("Rule criteria is empty");
                if (this.Rules.IsAutomationIncluded && this.ProductCriteria.filter(x => x.Price !== "" && x.Price > 0 && x.ProductName === "").length > 0)
                    requiredFields.push("A price in product criteria needs a product added");

                let validationFields = [];
                if (this.Rules.StartDate != null && this.Rules.EndDate != null) {
                    let dtEffFrom = new Date(this.Rules.StartDate);
                    let dtEffTo = new Date(this.Rules.EndDate);
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
                    strAlertMessage += "<b>Please fill the following required fields!</b><br/>" ;
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
                this.isOk = true;
                this.retryAction = false;
                this.isAlertText = strAlertMessage
                
            } else {
                for (let idx = 0; idx < this.Rules.Criteria.length; idx++) {
                    if (this.Rules.Criteria[idx].type === "list" && this.Rules.Criteria[idx].operator !== "IN") {
                        this.Rules.Criteria[idx].values = this.Rules.Criteria[idx].value;
                        this.Rules.Criteria[idx].value = "";
                    } else {
                        this.Rules.Criteria[idx].values = [];
                    }
                }
                this.Rules.IsActive = false;
                this.Rules.RuleStage = false;
                this.priceRuleCriteriaData = {
                    Id: this.Rules.Id,
                    Name: this.Rules.Name,
                    IsActive: this.Rules.IsActive == true ? false : true,
                    IsAutomationIncluded: this.Rules.IsAutomationIncluded,
                    StartDate: this.Rules.StartDate,
                    EndDate: this.Rules.EndDate,
                    RuleStage: this.Rules.RuleStage == true ? false : true,
                    Notes: this.Rules.Notes,
                    Criterias: { Rules: this.Rules.Criteria.filter(x => x.value !== null), BlanketDiscount: [{ value: this.Rules.IsAutomationIncluded ? this.BlanketDiscountPercentage : "", valueType: { value: "%" } }, { value: this.Rules.IsAutomationIncluded ? this.BlanketDiscountDollor : "", valueType: { value: "$" } }] },
                    ProductCriteria: this.Rules.IsAutomationIncluded && this.ProductCriteria.length > 0 ? this.ProductCriteria.filter(x => x.ProductName !== "" && x.Price !== "") : [],
                    OwnerId: this.Rules.OwnerId
                }

                let duplicateListXml = [];
                $.each(this.priceRuleCriteriaData.Criterias.Rules.filter(x => x.type == "list" && x.subType == "xml"), function (index, value) {
                    let strTitle = this.attributeSettings.filter(x => x.field == value.field)[0].title;
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
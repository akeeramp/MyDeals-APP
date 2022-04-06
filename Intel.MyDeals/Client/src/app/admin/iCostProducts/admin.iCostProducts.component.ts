import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { iCostProductService } from "./admin.iCostProduct.service";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Injectable } from "@angular/core";

import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,

} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";


@Component({
    selector: "iCostProducts",
    templateUrl: "Client/src/app/admin/iCostProducts/admin.iCostProducts.component.html",
    styleUrls: ['Client/src/app/admin/iCostProducts/admin.iCostProducts.component.css']
})

@Injectable()
export class iCostProductsComponent {
    constructor(private iCostProductSvc: iCostProductService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    public validationMessage = "";
    public isRuleInvalid = false;
    public manageRules = false;
    public addNewRules = true;
    public isButtonDisabled = true;
    private isLoading = true;
    private isDeleteClick = false;
    private showQueryBuilder = false;
    private deleteItemData: any = {};
    private editItemData: any = {};
    private EditMode = false;

    public gridResult: Array<any>;
    public gridData: GridDataResult;

    public state: State = {
        skip: 0,
        take: 25,
        group: [{ field: "DEAL_PRD_TYPE" }, { field: "PRD_CAT_NM"}],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        }
    };

    public pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
    ];

    public form = { 'isValid': false };
    private gridPopulated = true;
    private ProductType: Array<any> = [];
    private distinctProductType: any = [];
    private origDistinctProductType: any = [];
    private ProductVertical: any = [];
    private origProductVertical: any = [];
    private selectedVertical = '';
    private defaultVertical = { VERTICAL: "", VERTICAL_SID: "" };
    private costTestProductType = [{ 'name': 'L1' }, { 'name': 'L2' }];
    private conditionCriteria = [{ 'name': 'Include' }, { 'name': 'Exclude' }];
    private pctRule =  {
        'CONDITION': '',
        'COST_TEST_TYPE': 'L1',
        'CRITERIA': 'Include',
        'DEAL_PRD_TYPE_SID': null,
        'PRD_CAT_NM_SID': null,
        'JSON_TXT': ''
    };
    private showCommentbar = false;
    private isAttributeLoaded: Promise<boolean> = Promise.resolve(false);
    public filter: any = { "group": { "operator": "AND", "rules": [] } };
    public leftValues: Array<any> = [];
    private operators: Array<any> = [{ name: 'AND' }, { name: 'OR' }];
    private initial: any = {}

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    loadLegalClassification() {
        if ((<any>window).usrRole != 'Legal' && (<any>window).usrRole != 'SA' && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.iCostProductSvc.getProductCostTestRules()
                .subscribe((result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
                },
                    function (error) {
                        this.loggerSvc.error(
                            "iCostProductsComponent::getProductCostTestRules::",
                            error
                        );
                    });
        }
    }

    savePCTRules() {
        if (this.ruleExists()) {
            this.validationMessage = "Product Cost Test Rule exists for selected Product Type, Vertical and Level"
            this.isRuleInvalid = false;
            return;
        }

        this.pctRule.JSON_TXT = JSON.stringify(this.filter);
        const conditionOutput = this.computed(this.filter.group)
        this.pctRule.CONDITION = conditionOutput == '()' ? "" : conditionOutput ;

        if (this.EditMode) {
            this.iCostProductSvc.updatePCTRule(this.pctRule)
                .subscribe(() => {
                    this.loggerSvc.success("iCostProductsComponent::updatePCTRules::Update successful.");
                    this.cancel();
                    this.loadLegalClassification();
                },
                    (error) => {
                        this.loggerSvc.error("iCostProductsComponent::updatePCTRules::Unable to Update product cost test rule::", error);
                    });
        }
        else {
            this.iCostProductSvc.createPCTRules(this.pctRule)
                .subscribe(() => {
                    this.loggerSvc.success("iCostProductsComponent::createPCTRules::Save successful.");
                    this.cancel();
                    this.loadLegalClassification();
                },
                    (error) => {
                        this.loggerSvc.error("iCostProductsComponent::createPCTRules::Unable to save product cost test rule::", error);
                    });
        }
    }

    ruleExists() {
        let count = 0;
        this.isRuleInvalid = false
        this.gridResult.filter(rows => {
            if (rows.DEAL_PRD_TYPE_SID == this.pctRule.DEAL_PRD_TYPE_SID && rows.PRD_CAT_NM_SID == this.pctRule.PRD_CAT_NM_SID && rows.COST_TEST_TYPE == this.pctRule.COST_TEST_TYPE) {
                count = count + 1;
            }
        })

        if (count == 0 || (this.EditMode && this.pctRule.DEAL_PRD_TYPE_SID == this.editItemData.DEAL_PRD_TYPE_SID
                                         && this.pctRule.PRD_CAT_NM_SID == this.editItemData.PRD_CAT_NM_SID
                                         && this.pctRule.COST_TEST_TYPE == this.editItemData.COST_TEST_TYPE))
        {
            this.isRuleInvalid = false;
        }
        else {
            this.isRuleInvalid = true;
        }

        return this.isRuleInvalid;
    }

    computed(group) {
        let str, i;
        if (!group) return "";
        for (str = "(", i = 0; i < group.rules.length; i++) {
            i > 0 && (str += " " + group.operator + " ");
            str += group.rules[i].group ?
                this.computed(group.rules[i].group) :
                group.rules[i].criteria + " " + group.rules[i].condition + " " + this.getFormatedValue(group.rules[i].condition, group.rules[i].data);
        }

        return str + ")";
    }

    getFormatedValue(condition, value) {
        if (value == "") return "";
        let formatedValue = "";
        if (condition == 'LIKE') {
            formatedValue = "\'%" + value + "%\'";
        } else {
            formatedValue = "\'" + value + "\'";
        }
        return formatedValue;
    }

    getProductTypeMapping() {

        if (this.EditMode) {
            this.origProductVertical = this.ProductVertical = this.ProductType.filter(obj => {
                if (obj.PRD_TYPE_SID == this.pctRule.DEAL_PRD_TYPE_SID) {
                    return obj.PRD_TYPE;
                }
            });
            this.getProductAttributeValues(this.pctRule.PRD_CAT_NM_SID);
        }
        this.manageRules = true; // hide the rules grid to replace with edit grid
        this.addNewRules = false;
    }

    initQueryBuilder(showQryBuilder) {
        this.filter = { "group": { "operator": "AND", "rules": [] } };
        this.showQueryBuilder = showQryBuilder;
    }

    prdTypeChange(value: any) {
        this.selectedVertical = '';
        this.origProductVertical=this.ProductVertical = this.ProductType.filter(obj => {
            if (obj.PRD_TYPE_SID == value) {
                return obj.PRD_TYPE;
            }
        });
        this.pctRule.PRD_CAT_NM_SID = this.ProductVertical.length == 1 ? this.ProductVertical[0].VERTICAL_SID : null;
        if (this.ProductVertical.length == 1) {
            this.getProductAttributeValues(this.ProductVertical[0].VERTICAL_SID)
        }
        this.form.isValid = false;
        this.initQueryBuilder(this.showQueryBuilder);
    }

    verticalChange(value: any) {
        this.selectedVertical = value;
        if (value) {
            this.getProductAttributeValues(value);
        }
    }

    dealPrdTypeNm() {
        const found = this.ProductType.filter(obj => {
            if (obj.PRD_TYPE_SID == this.pctRule.DEAL_PRD_TYPE_SID) {
                return obj.PRD_TYPE;
            }
        });
        if (found.length) {
            return found[0].PRD_TYPE;
        }
        return "unknown";
    }

    dealPrdVerticalNm() {
        this.showQueryBuilder = this.showCommentbar = Boolean(this.pctRule.DEAL_PRD_TYPE_SID && this.pctRule.PRD_CAT_NM_SID);
        this.form.isValid = Boolean(this.pctRule.DEAL_PRD_TYPE_SID
            && this.pctRule.PRD_CAT_NM_SID && this.gridPopulated);
        const found = this.ProductType.filter(obj => {
            if (obj.VERTICAL_SID == this.pctRule.PRD_CAT_NM_SID) {
                return obj.VERTICAL;
            }
        });
        if (found.length) {
            return found[0].VERTICAL;
        }
        return "unknown";
    }

    getProductAttributeValues(verticalId) {
        if (!this.EditMode) {
            this.filter = { "group": { "operator": "AND", "rules": [] } };
        }
        this.iCostProductSvc.getProductAttributeValues(verticalId)
            .subscribe(response => {
                for (let i = 0; i < response.length; i++) {
                    response[i]['idx'] = i;
                }
                this.leftValues = response;
                this.isAttributeLoaded = Promise.resolve(true);
        });
    }

    editHandler() {
        this.manageRules = true; // hide the rules grid to replace with edit grid
        this.addNewRules = false;
    }

    editClick({ dataItem }) {
        this.isButtonDisabled = false;
        Object.assign(this.editItemData, dataItem)
        Object.assign(this.deleteItemData, dataItem)
    }

    updateItem() {
        this.EditMode = true;
        Object.assign(this.pctRule, this.editItemData)
        this.filter = this.pctRule.JSON_TXT === "" ? this.filter : JSON.parse(this.pctRule.JSON_TXT);
        this.getProductTypeMapping();
    }

    addItem() {
        this.EditMode = false;
        this.getProductTypeMapping();
    }

    deleteItemConfirmation() {
        this.isDeleteClick = true;
    }

    deleteItem() {
        this.isDeleteClick = false;
        this.isLoading = true;

        this.iCostProductSvc.deletePCTRule(this.deleteItemData)
            .subscribe(() => {
                this.isButtonDisabled = true;
                this.loggerSvc.success("iCostProductsComponent::removeHandler::Delete successful.");
                this.loadLegalClassification();
            },
                (error) => {
                    this.loggerSvc.error("iCostProductsComponent::removeHandler::Unable to delete product cost test rule::", error);
                });
    }

    cancelDeleteRuleAction() {
        this.isDeleteClick = false;
    }

    cancel() {
        this.EditMode = false;
        this.manageRules = false;
        this.showCommentbar = false;
        this.addNewRules = true;
        this.showQueryBuilder = false;
        this.pctRule.DEAL_PRD_TYPE_SID = null;
        this.pctRule.PRD_CAT_NM_SID = null;
        this.pctRule.COST_TEST_TYPE = 'L1';
        this.pctRule.CRITERIA = 'Include';

        this.isButtonDisabled = true;
        this.validationMessage = "";
        this.filter = { "group": { "operator": "AND", "rules": [] } };
        this.isAttributeLoaded = Promise.resolve(false);
    }

    enableSaveHandler(event: boolean) {
        if (event["isSaveEnabled"] == true) {
            this.gridPopulated = true;
            this.isSaveEnabled(this.filter);
        }
        else {
            this.gridPopulated = event["flag"];
        }
    }

    isSaveEnabled(element) {
        for (const item of element.group.rules) {
            if (!(Object.hasOwnProperty.call(item,'group'))) {
                let isFormComplete = Object.values(item).some(itemElem => (!itemElem || (itemElem.toString()).length == 0))
                if (isFormComplete) {
                    isFormComplete = false;
                    this.gridPopulated = false
                    break;
                }
            }
            else {
                this.isSaveEnabled(item)
            }
        }
    }


    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadLegalClassification()
    }

    handleFilter(value, type) {
        if (type == "ProductType") {
            this.distinctProductType = this.origDistinctProductType.filter(
                item => (item['PRD_TYPE'].toLowerCase()).includes(value.toLowerCase())
            )
        }
        else if (type == "Vertical") {
            this.ProductVertical = this.origProductVertical.filter(
                item => (item['VERTICAL'].toLowerCase()).includes(value.toLowerCase())
            )
        }
    }

    ngOnInit() {
        this.loadLegalClassification();
        this.iCostProductSvc.getProductTypeMappings()
            .subscribe(response => {
                this.ProductType = response;
                this.origDistinctProductType = this.distinctProductType = distinct(response, 'PRD_TYPE');
            });
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "iCostProducts",
    downgradeComponent({
        component: iCostProductsComponent,
    })
);
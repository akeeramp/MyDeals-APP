import { Component, ViewEncapsulation, Input, OnInit, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { PricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service';
import { logger } from "../../shared/logger/logger";
import { userPreferencesService } from "../../shared/services/userPreferences.service";
import { List } from 'linqts';
import { forkJoin, Subject } from 'rxjs';
import { each, isArray } from 'underscore';
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "attribute-builder-angular",
    templateUrl: "Client/src/app/core/attributeBuilder/attributeBuilder.component.html",
    styleUrls: ['Client/src/app/core/attributeBuilder/attributeBuilder.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class AttributeBuilder implements OnInit, OnDestroy {
    @Input() attributeSource: any;
    @Input() operatorSource: any;
    @Input() types2operatorSource: any;
    @Input() private cat: any;
    @Input() private subcat: any;
    @Input() customSettings: any[];
    @Input() runSearch: boolean = false;
    @Output() invokeSearchDatasource = new EventEmitter();
    @Output() removeLoadingPanel = new EventEmitter();
    @Output() rulesemit = new EventEmitter();
    @Output() emitDeleteRule = new EventEmitter();
    @Output() clearSearchResult = new EventEmitter();//For Tender Dashboard, to clear search result if runrules action got triggered
    @Output() isDirty = new EventEmitter();
    public availableAttrs = [];
    public availAtrField = [];
    public attributes: any = [];
    public availableOperator = [];
    public availableType2Operator = [];
    public dropdownresponses: any;
    public currentRule = '';
    public myRules: any = [];
    public initialLoad = true;
    private isDialogVisible = false;
    private isKitDialog = false;
    private isDialogPopup = false;
    public title = '';
    public isDuplicateTitle = false;
    public resetRuleInitiated = false;
    private currentRuleColumns: any;
    public rules: any;
    private selectedRuleItem: any
    private attributeSettings: any;
    private defaultSelection: boolean = true;
    public disabledropdowns: boolean;
    public enableTextbox: boolean[];
    public ruleToRun: any;
    private isDefaultSelected: boolean = false;
    private isDefaultChange: boolean = false;
    private isDeleteRule: boolean = false;
    private runRuleReqd:boolean = false;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    @ViewChild("list") list;
    
    constructor(private pteService: PricingTableEditorService, private loggerSvc: logger, protected usrPrfrncssvc: userPreferencesService,) {}
    loadMyRules() {
        this.usrPrfrncssvc.getActions(this.cat, this.subcat).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            this.myRules = [];
            if (data.length > 0) {
                for (var r = 0; r < data.length; r++) {
                    if (data[r].PRFR_KEY === "Rules") {
                        this.myRules = JSON.parse(data[r].PRFR_VAL);
                        this.rules = this.myRules;
                    }
                }
                if (this.cat == 'TenderDealSearch') {//This checking req for Tender dashboard only
                    var isValuePresent = false;
                    if (!this.attributes) { this.loadDefaultAttributes(); }
                    for (var i = 0; i < this.attributes.length; i++) {
                        if (this.attributes[i].value.toString().length > 0) {
                            isValuePresent = true;
                        }
                        else {
                            isValuePresent = false;
                            break;
                        }
                    }

                    if (isValuePresent == false) {
                        if (this.rules && this.rules.length > 0) {
                            //Attribute Builder
                            var flag = false;
                            if (this.resetRuleInitiated == false && this.defaultSelection) {
                                for (var rulesCounter = 0; rulesCounter < this.rules.length; rulesCounter++) {
                                    //Calling RuleEngine Setter
                                    if (this.rules[rulesCounter].default == true) {
                                        this.sleepAndResetDDL(this.rules[rulesCounter].title);
                                        this.selectedRuleItem = this.rules[rulesCounter].title;
                                        flag = true;
                                        this.isDefaultSelected = true;
                                        this.updateRules(this.rules[rulesCounter].rule);
                                        this.ruleToRun = this.rules[rulesCounter];
                                        break;
                                    }
                                }
                            }                           
                        }
                        else {
                            this.resetRuleInitiated = false;
                        }
                        if (flag == false && this.defaultSelection) {
                            this.resetRuleInitiated = false;
                            this.sleepAndResetDDL();
                        }
                    } else {
                        this.sleepAndResetDDL();
                    }
                }
            }
            if (this.cat != "TenderDealSearch")
            this.rulesemit.emit(this.rules);
            this.removeLoadingPanel.emit();
        });
    }
    async onRuleSelect(dataItem) {
        this.isDirty.emit(true);
        if (dataItem && !this.isDefaultChange && !this.isDeleteRule) {
            await this.updateRules(dataItem.rule);
            this.runRule();
            this.currentRule = dataItem.title;
            this.currentRuleColumns = dataItem.columns;
        }
        else {
            this.currentRule = "";
            this.currentRuleColumns = "";
        }
        if (this.isDefaultChange || this.isDeleteRule) {
            if (this.currentRule == "")//if its default change or delete tule event we should not trigger rule selection
                this.ruleToRun = undefined;
            else {
                this.ruleToRun = this.rules.filter(x => x.title === this.currentRule)[0];
            }
            this.isDeleteRule = false;
            this.isDefaultChange = false;
        }
        if (this.cat == 'DealSearch') this.ruleToRun = this.rules.filter(x => x.title === this.currentRule)[0];
    }
    sleepAndResetDDL(title?) {
        if (title) {
            this.ruleToRun = this.rules.filter(x => x.title === title)[0];
            this.currentRule = "";
            this.currentRuleColumns = this.ruleToRun.columns;
        }
        else {
            this.ruleToRun = undefined;
            this.currentRule = '';
            this.currentRuleColumns = '';
        }
    }
    updateRules(rulesData) {
        this.attributes=[];
        each(rulesData, (customRule) => {
            let field = this.availableAttrs.filter(x => x.field == customRule.field)[0];
            let operators = this.getOperator(field);
            let selectedop = operators.filter(x => x.operator == customRule.operator)[0];
            let lookupval = [];
            let selectelookupval;
            if (field.lookups != undefined && field.lookups != null && field.lookups.length > 0) {
                lookupval = this.getlookupvalues(field);
                selectelookupval = customRule.value
            } else
                if (field.lookupUrl != undefined && field.lookupUrl != null && field.lookupUrl.length > 0) {
                    lookupval = this.dropdownresponses[field.field];
                if (field.feild == "Customer.CUST_NM") selectelookupval = lookupval.filter(x => x.CUST_SID == selectelookupval);
                }
            let customValue;
            if (field.type == "number") {
                if (Number.isNaN(parseInt(customRule.value)))
                    customValue = '';
                else
                    customValue = parseInt(customRule.value);
            }
            else if (field.type == "money" || field.type == "numericOrPercentage") {
                if (Number.isNaN(parseFloat(customRule.value)))
                    customValue = '';
                else
                    customValue = parseFloat(customRule.value);
            }
            else
                customValue = customRule.value;
            this.attributes.push({
                dropDown: lookupval.length == 0 ? [] : lookupval,
                field: customRule.field,
                operator: selectedop ? selectedop.operator : this.availableOperator[0].operator,
                opvalues: operators,
                selectedField: field,
                selectedOperator: selectedop ? selectedop : this.availableOperator[0],
                selectedValues: selectelookupval != undefined ? selectelookupval : customValue,
                subType: "",
                type: field.type,
                value: selectelookupval != undefined ? selectelookupval : customValue,
                valueType: "",
                values: customValue
            })
        })
    }
    async loadDefaultAttributes() {
        if (this.availableAttrs.length === 0) {
            this.availableAttrs = this.attributeSource.sort((a,b)=>a.title>b.title? 1:-1);
            this.availableOperator = this.operatorSource;
            this.availableType2Operator = this.types2operatorSource;
            for (let i = 0; i < this.attributeSource.length; i++) {
                this.availAtrField.push(this.attributeSource[i].field);
            }
        }
        if (this.cat == "DealSearch") {
            this.enableTextbox = [false];
            this.disabledropdowns = false;
            this.attributes = [{
                dropDown: [],
                field: '',
                operator: this.availableOperator[0].operator,
                opvalues: [],
                selectedField: {},
                selectedOperator: {},
                selectedValues: [],
                subType: "",
                type: this.availableAttrs[0].type,
                value: "",
                valueType:"",
                values: []
            }]
        }
        else
        {
            this.enableTextbox = [false, false, false];
            this.disabledropdowns = true;
            this.updateRules(this.customSettings);
        }
        if (this.initialLoad) {
            this.initialLoad = false;
            await this.getLookupVals();
            await this.loadMyRules();
            if (this.runSearch)
                this.runRule();
        }
    }

    getOperator(dataItem) {
        const ops = this.availableType2Operator.filter(x => x.type === dataItem.type).length > 0 ? this.availableType2Operator.filter(x => x.type === dataItem.type)[0].operator : ''
        const opvalues = [];
        for (let i = 0; i < ops.length; i++) {
            const val = this.availableOperator.filter(x => x.operator === ops[i])
            opvalues.push(val[0]);
        }
        
        return opvalues;
    }

    getlookupvalues(dataItem) {
        const vals = [];
        dataItem.lookups.forEach((item) => {
            vals.push(item)
        });
        return vals;
    }

    async getLookupVals() {
        let values: any = {};
        this.availableAttrs.forEach((row) => {
            if ((row.type == 'list' || row.type == 'singleselect') && row.lookupUrl != undefined) {
                values[`${row.field}`] = this.pteService.readDropdownEndpoint(row.lookupUrl);
            }
        });
        let result = await forkJoin(values).toPromise().catch((err) => {
            this.loggerSvc.error('PricingTableEditorComponent::getAllDrowdownValues::service', err);
        });

        if (result != undefined) {
            this.dropdownresponses = result;
        }

    }

    addRow(index) {
        this.attributes.splice(index + 1, 0, {
            field: '',
            operator: "",
            subType: null,
            type: "",
            value: "",
            valueType: []
        });
        this.enableTextbox.splice(index + 1, 0, false);
    }
    removeRow(dataItem, index) {
        if (index > 0) {
            this.attributes.splice(index, 1);
        }
        if (index == 0) {
            if (this.attributes.length > 1) this.attributes.splice(index, 1);
            else {
                dataItem.selectedField = [];
                dataItem.field = '';
                dataItem.type = '';
                dataItem.selectedValues = [];
                dataItem.value = ''
                this.valueChange(dataItem, index);
            }
        }
        this.enableTextbox.splice(index, 1);
    }

    enableSaveRules() {
        if (this.cat == 'TenderDealSearch') return true;
        else if (this.attributes[0].selectedValues != undefined && (this.attributes[0].selectedValues.length > 0 || (this.attributes[0].value != '' && this.attributes[0].value != null)))
            return true;
        else return false;
    }
    async valueChange(dataItem, index, action?: any) {
        this.isDirty.emit(true);
        this.enableTextbox[index] = false;
        let ops = this.availableType2Operator.filter(x => x.type === dataItem.type).length > 0 ? this.availableType2Operator.filter(x => x.type === dataItem.type)[0].operator : ''
        let opvalues = [];
        for (let i = 0; i < ops.length; i++) {
            let val = this.availableOperator.filter(x => x.operator === ops[i])
            opvalues.push(val[0]);
        }
        let selectedOperator = opvalues.filter(x => x.operator === "=")[0];
        Object.assign(this.attributes[index], {
            opvalues: opvalues,
            selectedOperator: selectedOperator
        })
        if (dataItem.type == 'list' || dataItem.type == 'singleselect') {
            if (dataItem.lookups != undefined) {
                if (dataItem.field == "GEO_COMBINED" || dataItem.field == "HOST_GEO") {
                    Object.assign(this.attributes[index], { dropDown: dataItem.lookups })
                }
                else {
                    let vals = [];
                    dataItem.lookups.forEach((item) => {
                        vals.push(item)
                    });
                    Object.assign(this.attributes[index], {
                        dropDown: vals
                    })
                }
            } else {
                Object.assign(this.attributes[index], {
                    dropDown: this.dropdownresponses[dataItem.field]
                });
            }
        }
        this.attributes[index].field = dataItem.field;
        this.attributes[index].operator = opvalues.length > 0 ? opvalues[0].operator: '';
        this.attributes[index].subType = null;
        this.attributes[index].type = dataItem.type;
        this.attributes[index].value = '';
        this.attributes[index].valueType = null;
        this.attributes[index].values = [];
        this.attributes[index].selectedValues = [];
        Object.assign(this.attributes[index], {
            selectedField: dataItem,
            seletedOperator: selectedOperator
        });
    }

    //clicking on enter on textbox/numeric textbox/date triggers search
    onEnter(i, dataItem, value) {
        this.dataChange(i, dataItem, value);
        this.runRule();
    }

    dataChange(idx, dataItem, selector, data?) {
        this.isDirty.emit(true);        
        if (selector == 'operator') {
            this.attributes[idx].operator = dataItem.selectedOperator.operator;
            //dataItem.value = ''
            //this.attributes[idx].values = [];
            this.enableTextbox[idx] = false;
            if (this.attributes[idx].operator == 'IN') {
                this.enableTextbox[idx] = true;
            }
        } else if (selector == 'numerictextbox') {
            data = dataItem.value;
        } else if (selector == 'textbox') {
            if (!this.enableTextbox[idx]) data = dataItem.value;
            else {
                data = [];
                if (!Array.isArray(dataItem.value) && !Number.isInteger(dataItem.value)) dataItem.value = dataItem.value.split(',');
                const index = dataItem.value.indexOf('');
                if (index > -1) {
                    dataItem.value.splice(index, 1);
                }
                data = dataItem.value
            }
        } else if (selector == 'datePicker') {
            data = new Date(dataItem.value).toISOString();
        } else {
            this.attributes[idx].value = data
        }
        if (data != undefined && data != null && data != '' && selector != 'operator') {
            this.attributes[idx].values = [];
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    this.attributes[idx].values.push(item);
                })
            }
            else this.attributes[idx].values.push(data);
        }
     }

    dataChangeMulti(data, i, dataItem, selector) {
        this.isDirty.emit(true);
        this.attributes[i].values = [];
        this.attributes[i].value = '';
        data.forEach((item) => {
            this.attributes[i].values.push(item);
        })
        this.attributes[i].value = this.attributes[i].values;
    }
    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };
    saveRule() {
        let rulesData = this.generateCurrentRule();
        if (!this.validateRules()) return;
        this.isDirty.emit(false);
        if (this.currentRule === "") {
            this.runRuleReqd = true;
            this.saveAsRule();
            return;
        }
        else {
            this.runRuleReqd = false;
            this.myRules.map(x => {
                if (x.title == this.currentRule) {
                    x.rule = rulesData;
                    x.columns = this.cat == 'TenderDealSearch' ? '' : '';
                    x.default = false;
                }
            })
        }
        this.usrPrfrncssvc.updateActions(this.cat, this.subcat, "Rules", this.myRules).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            this.loggerSvc.success("The search rule saved.");
            this.rules = this.myRules;
            this.rulesemit.emit(this.rules);
            this.sleepAndResetDDL(this.title);
            if (this.runRuleReqd)
                this.runRule();
            this.title = '';
        }, (error) => {
            this.loggerSvc.error("Unable to save Search Rule.", error);
        });

    }
    validateRules() {
        // global search check is allowed
        if (this.isGlobal()) return true;

        var invalidRows = this.attributes.filter(x => x.field === "" || x.operator === "" || x.value === "" || x.value.length == 0)
        if (invalidRows.length > 0) {
            this.isDialogVisible = true;
            return false;
        }

        return true;
    }
    isGlobal() {
        return (this.attributes.length === 1 &&
            this.attributes.field === undefined &&
            this.attributes.operator === undefined &&
            this.attributes.value === undefined);
    }
    saveAsRule() {
        if (!this.validateRules()) return;
        this.isKitDialog = true;     
    }
    closeKendoAlert() {
        this.isDialogVisible = false
    }
    saveAsRuleOkay() {
        if (this.title === "") {
            this.isDialogPopup = true;
            this.isKitDialog = false;

        } else {
            const duplicateTitle = this.myRules.filter(x => x.title.toUpperCase() === this.title.toUpperCase());
            if (duplicateTitle.length > 0) {
                this.isDuplicateTitle = true;
                this.isKitDialog = false;
            } else {
                this.myRules.push({
                    title: this.title,
                    rule: this.generateCurrentRule(),
                    columns: this.cat == 'TenderDealSearch' ? '' : '',
                    default: false
                });
                this.currentRule = this.title;
                this.saveRule();
                this.isKitDialog = false;
            }
        }

    }
    runRule() {
        let ruleslist = this.generateCurrentRule();     
        if (!this.validateRules()) {
            if (this.cat == "TenderDealSearch")// To Clear the Search Result in tender Dashboard if Run Rule got triggered without complete rule
                this.clearSearchResult.emit();
            return;
        }
        if (!this.enableSaveRules()) {
            this.loggerSvc.warn('Please provide proper search key', 'Warning');
            return;
        }
        this.usrPrfrncssvc.updateActions(this.cat, this.subcat, "CustomSearch", ruleslist).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response) {
                var runRule = {
                    rule: this.attributes
                }
                this.invokeSearchDatasource.emit(runRule)
            }
        }, (error) => {
            this.loggerSvc.error("Unable to save Custom Search Options.", error);
        });
    }
    setDefaultRule(dataItem) {
        var selectionType;
        this.isDefaultChange = true;
        for (var itmCnt = 0; itmCnt < this.rules.length; itmCnt++) {
            if (this.rules[itmCnt].title == dataItem.title) {
                this.rules[itmCnt]["default"] = !this.rules[itmCnt]["default"];
                selectionType = !this.rules[itmCnt]["default"];
                this.ruleToRun = '';
            }
            else {
                this.rules[itmCnt]["default"] = false;
            }
        }       
        this.usrPrfrncssvc.updateActions(this.cat, this.subcat, "Rules", this.rules)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) =>{
                if (selectionType == false) {
                    this.loggerSvc.success("The rule saved as Default", "Saved");
                }
                else if (selectionType == true) {
                    this.loggerSvc.success("Default selection was removed", "Saved");
                }

            },
            (error) => {
                this.loggerSvc.error("Unable to make Default Rule.", error);
            });
    }

    deleteSaveRule(dataItem?) {
        this.isDeleteRule = true;
        for (var itmCnt = 0; itmCnt < this.rules.length; itmCnt++) {
            if (dataItem != undefined && this.rules[itmCnt].title == dataItem.title) {
                this.rules.splice(itmCnt, 1);
                if (this.ruleToRun && this.ruleToRun.title && this.ruleToRun.title == dataItem.title) {
                    this.sleepAndResetDDL();
                    this.clearRule();
                }
            } else
                if (dataItem == undefined && this.rules[itmCnt].title == this.currentRule) {
                    this.rules.splice(itmCnt, 1);
                    if (this.ruleToRun && this.ruleToRun.title && this.ruleToRun.title == this.currentRule) {
                        this.sleepAndResetDDL();
                        this.clearRule();
                    }
                    this.rulesemit.emit(this.rules);
                    this.emitDeleteRule.emit(this.ruleToRun);
                }
        }

        this.usrPrfrncssvc.updateActions(this.cat, this.subcat, "Rules", this.rules)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                this.loggerSvc.success("Rule was removed", "Saved");
            },
                (error) => {
                    this.loggerSvc.error("Unable to make Delete Rule.", error);
                });
    }
    generateCurrentRule() {
        
        return new List<any>(this.attributes)
            .Select(x => {
                return {
                    type: x.type,
                    field: x.field,
                    operator: x.operator,
                    value: x.type !== "list" && isArray(x.values) ? x.values.join().toString() : x.values
                };
            }).ToArray();
    }
    saveAsRuleClose() {
        this.isKitDialog = false;
        this.title = "";
    }
    submitDialog() {
        this.isDialogPopup = false;
        this.isKitDialog = true;
    }
    closePopup() {
        this.isDialogPopup = false;
        this.isKitDialog = false
    }
    duplicateDataDialog() {
        this.isKitDialog = true;
        this.isDuplicateTitle = false;
    }
    duplicateDataDialogClose() {
        this.isDuplicateTitle = false;
    }
    async clearRule() {
        if (this.cat == 'TenderDealSearch') {
            this.attributes = [];
            await this.loadDefaultAttributes();
            this.resetRuleInitiated = true;
            this.sleepAndResetDDL();
        }
        else {
            this.attributes = [];
            this.attributes[0] = {
                dropDown: [],
                field: "",
                operator: "",
                opvalues: [],
                selectedField: {},
                selectedOperator: {},
                selectedValues: [],
                subType: "",
                type: "",
                value: "",
                valueType: "",
                values: []
            };
            this.currentRule = "";
            this.currentRuleColumns = [];
        }

    }

    ngOnInit() {
        if (this.runSearch)
            this.defaultSelection = false;
        this.loadDefaultAttributes();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
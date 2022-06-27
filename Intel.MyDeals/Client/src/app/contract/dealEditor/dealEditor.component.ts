import * as angular from 'angular';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { opGridTemplate } from "../../core/angular.constants"
import { SelectEvent } from "@progress/kendo-angular-layout";
import { ContractUtil } from '../contract.util';
import { GridUtil } from '../grid.util';
import { GridComponent, GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { TabCloseEvent, TabStripComponent } from "@progress/kendo-angular-layout";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'dealEditor',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditor.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorComponent {

    constructor(private pteService: pricingTableEditorService,
        private loggerService: logger, private decimalPipe: DecimalPipe, private currencyPipe: CurrencyPipe,
        private datePipe: DatePipe,
        protected dialog: MatDialog) {

    }

    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private wipTemplate: any = {};
    public groups: any;
    public columns: any = [];
    public templates: any;
    public selectedTab: any;
    private indxs: any = [];
    private isDealToolsChecked: boolean = false;
    private oldValue: any;

    @ViewChild("tabstrip", { static: true }) public tabstrip: TabStripComponent;

    private gridResult = [];
    private gridData: GridDataResult;
    public isLoading = false;
    private isTenderContract = false;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        },
        {
            text: "250",
            value: 100
        },
        {
            text: "500",
            value: 100
        }
    ];

    ngOnInit() {
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        this.groups = opGridTemplate.groups[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        var newArray = [];
        for (var i = 0; i < this.groups.length; i++) {
            newArray.push({ "name": this.groups[i].name, "order": this.groups[i].order, "isTabHidden": false, "rules": this.groups[i].rules })
        }
        this.groups = newArray;
        this.groups = this.groups.sort((a, b) => (a.order > b.order) ? 1 : -1);
        this.getWipColumns();
        this.assignColSettings();
        this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`] = this.wipTemplate;
        this.templates = opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        this.selectedTab = "Deal Info";
        this.filterColumnbyGroup(this.selectedTab);
    }

    getWipColumns() {
        // Get template for the selected WIP_DEAL
        this.wipTemplate = this.UItemplate["ModelTemplates"]["WIP_DEAL"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        this.getWipDealData();
        for (var i = this.wipTemplate.columns.length - 1; i >= 0; i--) {
            // For tender deals hide these columns
            if (typeof this.wipTemplate.columns[i] !== "undefined" &&
                opGridTemplate.hideForTender.indexOf(this.wipTemplate.columns[i].field) !== -1 && this.isTenderContract) {
                this.wipTemplate.columns.splice(i, 1);
            }
            // For non tender deals hide these columns
            if (typeof this.wipTemplate.columns[i] !== "undefined" && opGridTemplate.hideForNonTender.indexOf(this.wipTemplate.columns[i].field) !== -1 && !this.isTenderContract) {
                this.wipTemplate.columns.splice(i, 1);
            }
            // For standard deal editor hide these columns
            if (typeof this.wipTemplate.columns[i] !== "undefined" && opGridTemplate.hideForStandardDealEditor.indexOf(this.wipTemplate.columns[i].field) !== -1) {
                this.wipTemplate.columns.splice(i, 1);
            }
        }
        if (!this.isTenderContract) {
            for (var i = 0; i < opGridTemplate.hideForNonTender.length; i++) {
                delete this.wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
            }
        }
        else {
            for (var i = 0; i < opGridTemplate.hideForTender.length; i++) {
                delete this.wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
            }
        }

        for (var i = 0; i < opGridTemplate.hideForStandardDealEditor.length; i++) {
            delete this.wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
        }
    }

    assignColSettings() {
        var cnt = 0;
        var columnKeys = Object.keys(opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`]);
        for (var i = 0; i < columnKeys.length; i++) {
            this.indxs[columnKeys[i]] = cnt++;
        }
        for (var i = 0; i < this.wipTemplate.columns.length; i++) {
            this.wipTemplate.columns[i].indx = this.indxs[this.wipTemplate.columns[i].field] === undefined ? 0 : this.indxs[this.wipTemplate.columns[i].field];
            this.wipTemplate.columns[i].hidden = false;
        }
        this.wipTemplate.columns = this.wipTemplate.columns.sort((a, b) => (a.indx > b.indx) ? 1 : -1);
    }

    onTabSelect(e: SelectEvent) {
        this.selectedTab = e.title;
        this.filterColumnbyGroup(this.selectedTab);
    }

    onClose(e: TabCloseEvent) {
        for (var i = 0; i < this.groups.length; i++) {
            if (e.tab.title == this.groups[i].name) {
                this.groups[i].isTabHidden = true;
            }
        }
        for (var i = 0; i < this.groups.length; i++) {
            if (!this.groups[i].isTabHidden) {
                this.selectedTab = this.groups[i].name;
            }
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    filterColumnbyGroup(groupName: string) {
        var group = this.groups.filter(x => x.name == groupName);
        this.columns = [];
        if (group.length > 0) {
            for (var i = 0; i < this.wipTemplate.columns.length; i++) {
                var gptemplate = this.templates[this.wipTemplate.columns[i].field];
                if (groupName.toLowerCase() == "all") {
                    if (gptemplate === undefined && (this.wipTemplate.columns[i].width === undefined || this.wipTemplate.columns[i].width == '0')) {
                        this.wipTemplate.columns[i].width = 1;
                    }
                    this.columns.push(this.wipTemplate.columns[i]);
                }
                else {
                    if (gptemplate != undefined && gptemplate.Groups.includes(groupName)) {
                        this.columns.push(this.wipTemplate.columns[i]);
                    }
                }
            }
        }
    }

    async getWipDealData() {
        let response = await this.pteService.readPricingTable(this.in_Pt_Id).toPromise().catch((err) => {
            this.loggerService.error('dealEditorComponent::readPricingTable::readTemplates:: service', err);
        });
        if (response && response.WIP_DEAL && response.WIP_DEAL.length > 0) {
            this.gridResult = response.WIP_DEAL;
            this.gridData = process(this.gridResult, this.state);
            this.applyHideIfAllRules();
            this.isLoading = false;
        } else {
            this.gridResult = [];
        }
    }

    uiControlWrapper(passedData, field, format) {
        var data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "VOLUME" || field == "CONSUMPTION_LOOKBACK_PERIOD" || field == "FRCST_VOL" ||
            field == "CREDIT_VOLUME" || field == "DEBIT_VOLUME" || field == "REBATE_OA_MAX_VOL") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.decimalPipe.transform(data[field], "1.0-0");
        }
        if (field == "REBATE_OA_MAX_AMT" || field == "MAX_RPU" || field == "USER_MAX_RPU" ||
            field == "AVG_RPU" || field == "USER_AVG_RPU" || field == "TOTAL_DOLLAR_AMOUNT" || field == "MAX_PAYOUT"
            || field == "ADJ_ECAP_UNIT" || field == "CREDIT_AMT" || field == "DEBIT_AMT") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.currencyPipe.transform(parseInt(data[field]), 'USD', 'symbol', '1.2-2');
        }
        if (field == "BLLG_DT" || field == "LAST_TRKR_START_DT_CHK" || field == "ON_ADD_DT"
            || field == "REBATE_BILLING_START" || field == "REBATE_BILLING_END") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.datePipe.transform(data[field], "MM/dd/yyyy");
        }
        return GridUtil.uiControlWrapper(data, field, format);
    }

    uiControlDealWrapper(passedData, field) {
        return GridUtil.uiControlDealWrapper(passedData, field);
    }

    uiCustomerControlWrapper(passedData, field) {
        return GridUtil.uiCustomerControlWrapper(passedData, field);
    }

    uiDimControlWrapper(passedData, field) {
        var data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "ECAP_PRICE" && data.OBJ_SET_TYPE_CD == "ECAP") {
            if (data.ECAP_PRICE['20___0'] !== undefined && data.ECAP_PRICE['20___0'] !== null && data.ECAP_PRICE['20___0'] !== "")
                data.ECAP_PRICE['20___0'] = this.currencyPipe.transform(data.ECAP_PRICE['20___0'], 'USD', 'symbol', '1.2-2');
        }
        return GridUtil.uiDimControlWrapper(data, field, '20___0');
    }

    uiValidationErrorDetail(passedData) {
        return GridUtil.uiValidationErrorDetail(passedData);
    }

    isReadonlyCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field] != undefined)
            return true;
        return false;
    }
    isDirtyCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isDirty != undefined && passedData._behaviors.isDirty[field] != undefined)
            return true;
        return false;
    }
    isErrorCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            return true;
        return false;
    }

    cellClickHandler(args: CellClickEvent): void {
        if (args.dataItem != undefined) {
            if (args.column.field == "ECAP_PRICE")
                args.dataItem["ECAP_PRICE"]['20___0'] = parseInt(args.dataItem["ECAP_PRICE"]['20___0']);
            if (args.column.field == "VOLUME")
                args.dataItem[args.column.field] = parseInt(args.dataItem[args.column.field]);
            if (args.column.field == "REBATE_BILLING_START" || args.column.field == "REBATE_BILLING_END")
                args.dataItem[args.column.field] = new Date(args.dataItem[args.column.field]);
        }
        if (!args.isEdited) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex
            );
        }
    }
    updateDataItem(dataItem: any, field: string) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
        }
    }

    translateDimKey(key) {
        switch (key) {
            case "20_____1":
                return "Kit";
            case "20_____2":
                return "Sub-Kit";
            case "20___0":
                return "Primary";
            case "20___1":
                return "Secondary 1";
            case "20___2":
                return "Secondary 2";
            case "20___3":
                return "Secondary 3";
            case "20___4":
                return "Secondary 4";
            case "20___5":
                return "Secondary 5";
            case "20___6":
                return "Secondary 6";
            case "20___7":
                return "Secondary 7";
            case "20___8":
                return "Secondary 8";
            case "20___9":
                return "Secondary 9";
            default:
                return "";
        }
    }
    clkAllItems(): void {
        for (var i = 0; i < this.gridResult.length; i++) {
            if (!(this.gridResult[i].SALESFORCE_ID != "" && this.gridResult[i].WF_STG_CD == 'Offer'))
                this.gridResult[i].isLinked = this.isDealToolsChecked;
        }
        this.gridData = process(this.gridResult, this.state);
    }

    valueChange(dataItem: any, field: any): void {
        this.updateDataItem(dataItem, field);
    }

    applyHideIfAllRules(): void {
        var hideIfAll: any = [];
        if (this.groups != null && this.groups != undefined && this.groups.length > 0) {
            for (var g = 0; g < this.groups.length; g++) {
                var group = this.groups[g];
                if (group.rules != undefined) {
                    for (var r = 0; r < group.rules.length; r++) {
                        if (group.rules[r].logical === "HideIfAll") {
                            group.rules[r].name = group.name;
                            group.rules[r].show = false;
                            hideIfAll.push(group.rules[r]);
                        }
                    }
                }
            }
        }
        if (hideIfAll.length > 0) {
            for (r = 0; r < hideIfAll.length; r++) {
                var data = this.gridResult.filter(x => x[hideIfAll[r].atrb] != undefined && x[hideIfAll[r].atrb] == hideIfAll[r].value);
                if (this.gridResult.length == data.length) {
                    hideIfAll[r].show = true;
                }
            }

            for (var r = 0; r < hideIfAll.length; r++) {
                if (this.groups != undefined) {
                    for (g = 0; g < this.groups.length; g++) {
                        group = this.groups[g];
                        if (group != undefined && hideIfAll[r] && group.name === hideIfAll[r].name && hideIfAll[r].show == true) {
                            this.groups.splice(g, 1);;
                        }
                    }
                }
            }
        }
    }
}

angular.module("app").directive(
    "dealEditor",
    downgradeComponent({
        component: dealEditorComponent,
    })
);
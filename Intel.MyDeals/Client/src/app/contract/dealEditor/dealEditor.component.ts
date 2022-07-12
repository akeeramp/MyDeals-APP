import * as angular from 'angular';
import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { opGridTemplate } from "../../core/angular.constants"
import { SelectEvent, TabStripComponent } from "@progress/kendo-angular-layout";
import { ContractUtil } from '../contract.util';
import { GridComponent, GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { DatePipe } from '@angular/common';

@Component({
    selector: 'deal-editor',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditor.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorComponent {

    constructor(private pteService: pricingTableEditorService,
        private loggerService: logger, private datePipe: DatePipe,
        protected dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
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
    private numSoftWarn = 0;
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
    private tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
    private densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
    private kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];
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
        e.preventDefault();
        this.selectedTab = e.title;
        var group = this.groups.filter(x => x.name == this.selectedTab);
        if (group[0].isTabHidden) {
            var tabs = this.groups.filter(x => x.isTabHidden === false);
            this.selectedTab = tabs[0].name;
            this.filterColumnbyGroup(this.selectedTab);
        }
        else
            this.filterColumnbyGroup(this.selectedTab);
    }

    onClose(name: string) {
        for (var i = 0; i < this.groups.length; i++) {
            if (name == this.groups[i].name) {
                this.groups[i].isTabHidden = true;
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

    getWipDealData() {
        this.pteService.readPricingTable(this.in_Pt_Id).subscribe((response: any) => {
            if (response && response.WIP_DEAL && response.WIP_DEAL.length > 0) {
                this.gridResult = response.WIP_DEAL;
                this.setWarningFields(this.gridResult);
                this.checkSoftWarnings();
                this.gridData = process(this.gridResult, this.state);
                this.applyHideIfAllRules();
                this.isLoading = false;
            } else {
                this.gridResult = [];
            }
        }, error => {
            this.loggerService.error('dealEditorComponent::readPricingTable::readTemplates:: service', error);
        });

    }

    cellClickHandler(args: CellClickEvent): void {
        if (args.dataItem != undefined) {
            if (args.column.field == "ECAP_PRICE" && this.curPricingTable.OBJ_SET_TYPE_CD == "ECAP")
                args.dataItem["ECAP_PRICE"][this.ecapDimKey] = parseInt(args.dataItem["ECAP_PRICE"][this.ecapDimKey]);
            if (args.column.field == "KIT_ECAP")
                args.dataItem["ECAP_PRICE"][this.kitEcapdim] = parseInt(args.dataItem["ECAP_PRICE"][this.kitEcapdim]);
            if (args.column.field == "VOLUME" || args.column.field == "CONSUMPTION_LOOKBACK_PERIOD")
                args.dataItem[args.column.field] = parseInt(args.dataItem[args.column.field]);
            if (args.column.field == "REBATE_BILLING_START" || args.column.field == "REBATE_BILLING_END"
                || args.column.field == "START_DT" || args.column.field == "LAST_REDEAL_DT" || args.column.field == "END_DT"
                || args.column.field == "OEM_PLTFRM_LNCH_DT" || args.column.field == "OEM_PLTFRM_EOL_DT")
                args.dataItem[args.column.field] = new Date(args.dataItem[args.column.field]);
            if (args.column.field == "TIER_NBR") {
                var tiers = args.dataItem.TIER_NBR;
                for (var key in tiers) {
                    if (this.curPricingTable.OBJ_SET_TYPE_CD === 'VOL_TIER') {
                        if (args.dataItem["STRT_VOL"][key] != "Unlimited")
                            args.dataItem["STRT_VOL"][key] = parseInt(args.dataItem["STRT_VOL"][key]);
                        if (args.dataItem["END_VOL"][key] != "Unlimited")
                            args.dataItem["END_VOL"][key] = parseInt(args.dataItem["END_VOL"][key]);
                        args.dataItem["RATE"][key] = parseFloat(args.dataItem["RATE"][key]);
                    }
                    else if (this.curPricingTable.OBJ_SET_TYPE_CD === 'REV_TIER') {
                        if (args.dataItem["STRT_REV"][key] != "Unlimited")
                            args.dataItem["STRT_REV"][key] = parseFloat(args.dataItem["STRT_REV"][key]);
                        if (args.dataItem["END_REV"][key] != "Unlimited")
                            args.dataItem["END_REV"][key] = parseFloat(args.dataItem["END_REV"][key]);
                        args.dataItem["INCENTIVE_RATE"][key] = parseFloat(args.dataItem["INCENTIVE_RATE"][key]);
                    }
                    else if (this.curPricingTable.OBJ_SET_TYPE_CD === 'DENSITY') {
                        for (var i = 0; i < args.dataItem["NUM_OF_DENSITY"]; i++) {
                            args.dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key] = parseFloat(args.dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key]);
                        }
                        if (args.dataItem["STRT_PB"][key] != "Unlimited")
                            args.dataItem["STRT_PB"][key] = parseFloat(args.dataItem["STRT_PB"][key]);
                        if (args.dataItem["END_PB"][key] != "Unlimited")
                            args.dataItem["END_PB"][key] = parseFloat(args.dataItem["END_PB"][key]);
                    }
                }
            }
            if ((args.column.field == "ECAP_PRICE" || args.column.field == "DSCNT_PER_LN") && this.curPricingTable.OBJ_SET_TYPE_CD == "KIT") {
                var tiers = args.dataItem[args.column.field];
                for (var key in tiers) {
                    args.dataItem[args.column.field][key] = parseInt(args.dataItem[args.column.field][key]);
                }
            }
        }
        if (!args.isEdited && args.column.field !== "CUST_MBR_SID" && args.column.field !== "COMPETITIVE_PRICE" && args.column.field !== "COMP_SKU" &&
            !(args.dataItem._behaviors != undefined && args.dataItem._behaviors.isReadOnly != undefined && args.dataItem._behaviors.isReadOnly[args.column.field] != undefined && args.dataItem._behaviors.isReadOnly[args.column.field])) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex
            );
        }
    }
    cellCloseHandler(args: CellCloseEvent): void {
        if (args.dataItem != undefined) {
            if (args.column.field == "ECAP_PRICE" && this.curPricingTable.OBJ_SET_TYPE_CD == "ECAP")
                args.dataItem["ECAP_PRICE"][this.ecapDimKey] = args.dataItem["ECAP_PRICE"][this.ecapDimKey].toString();
            if (args.column.field == "KIT_ECAP")
                args.dataItem["ECAP_PRICE"][this.kitEcapdim] = args.dataItem["ECAP_PRICE"][this.kitEcapdim].toString();
            if (args.column.field == "VOLUME" || args.column.field == "CONSUMPTION_LOOKBACK_PERIOD")
                args.dataItem[args.column.field] = args.dataItem[args.column.field].toString();
            if (args.column.field == "REBATE_BILLING_START" || args.column.field == "REBATE_BILLING_END"
                || args.column.field == "START_DT" || args.column.field == "LAST_REDEAL_DT" || args.column.field == "END_DT"
                || args.column.field == "OEM_PLTFRM_LNCH_DT" || args.column.field == "OEM_PLTFRM_EOL_DT")
                args.dataItem[args.column.field] = this.datePipe.transform(args.dataItem[args.column.field], "MM/dd/yyyy");
            if (args.column.field == "TIER_NBR") {
                var tiers = args.dataItem.TIER_NBR;
                for (var key in tiers) {
                    if (this.curPricingTable.OBJ_SET_TYPE_CD === 'VOL_TIER') {
                        if (args.dataItem["STRT_VOL"][key] != "Unlimited")
                            args.dataItem["STRT_VOL"][key] = args.dataItem["STRT_VOL"][key].toString();
                        if (args.dataItem["END_VOL"][key] != "Unlimited")
                            args.dataItem["END_VOL"][key] = args.dataItem["END_VOL"][key].toString();
                        args.dataItem["RATE"][key] = args.dataItem["RATE"][key].toString();
                    }
                    else if (this.curPricingTable.OBJ_SET_TYPE_CD === 'REV_TIER') {
                        if (args.dataItem["STRT_REV"][key] != "Unlimited")
                            args.dataItem["STRT_REV"][key] = args.dataItem["STRT_REV"][key].toString();
                        if (args.dataItem["END_REV"][key] != "Unlimited")
                            args.dataItem["END_REV"][key] = args.dataItem["END_REV"][key].toString();
                        args.dataItem["INCENTIVE_RATE"][key] = args.dataItem["INCENTIVE_RATE"][key].toString();
                    }
                    else if (this.curPricingTable.OBJ_SET_TYPE_CD === 'DENSITY') {
                        for (var i = 0; i < args.dataItem["NUM_OF_DENSITY"]; i++) {
                            args.dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key] = args.dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key].toString();
                        }
                        if (args.dataItem["STRT_PB"][key] != "Unlimited")
                            args.dataItem["STRT_PB"][key] = args.dataItem["STRT_PB"][key].toString();
                        if (args.dataItem["END_PB"][key] != "Unlimited")
                            args.dataItem["END_PB"][key] = args.dataItem["END_PB"][key].toString();
                    }
                }
            }
            if ((args.column.field == "ECAP_PRICE" || args.column.field == "DSCNT_PER_LN") && this.curPricingTable.OBJ_SET_TYPE_CD == "KIT") {
                var tiers = args.dataItem[args.column.field];
                for (var key in tiers) {
                    args.dataItem[args.column.field][key] = args.dataItem[args.column.field][key].toString();
                }
            }
        }
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
    clearBadegCnt(): void {
        for (var g = 0; g < this.groups.length; g++) {
            this.groups[g].numErrors = 0;
        }
    }
    increaseBadgeCnt(key): void {
        if (this.templates[key] === undefined) return;
        for (var i = 0; i < this.templates[key].Groups.length; i++) {
            for (var g = 0; g < this.groups.length; g++) {
                if (this.groups[g].name === this.templates[key].Groups[i] || this.groups[g].name === "All") {
                    this.groups[g].numErrors++;
                }
            }
        }
    }
    checkSoftWarnings(): void {
        for (var w = 0; w < this.gridResult.length; w++) {
            if (!!this.gridResult[w]["CAP"] && this.curPricingTable.OBJ_SET_TYPE_CD == "ECAP") {
                if (this.gridResult[w]["CAP"][this.ecapDimKey] === "No CAP") {
                    this.numSoftWarn++;
                }
                var cap = parseFloat(this.gridResult[w]["CAP"][this.ecapDimKey]);
                var ecap = parseFloat(this.gridResult[w]["ECAP_PRICE"][this.ecapDimKey]);
                if (ecap > cap) {
                    this.numSoftWarn++;
                }
            }
            this.gridResult[w]._behaviors.isReadOnly["TOTAL_CR_DB_PERC"] = true;
        }
    }
    mapTieredWarnings(dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
        if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
            if (dataItem._behaviors.validMsg[atrbName] != null) {
                try {
                    // Parse the Dictionary json
                    var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                    if (this.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                        // KIT ECAP
                        if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                            dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                            dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                        }
                    }

                    if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                        // Set the validation message
                        if (atrbToSetErrorTo.contains("DENSITY_RATE")) {
                            if (dataToTieTo.dc_type == "WIP_DEAL") {
                                let densityRateCheck = Object.values(dataToTieTo.DENSITY_RATE).every(item => item <= 0);
                                if (densityRateCheck) {
                                    dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                                    dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                                }
                                else {
                                    delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                                    delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                                }
                            }
                            else if (dataToTieTo.DENSITY_RATE <= 0) {
                                dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                                dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                            }
                            else {
                                delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                                delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                            }
                        }
                        else {
                            dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                            dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                        }
                    } else {
                        // Delete the tier-specific validation if it doesn't tie to this specific tier
                        delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                        delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                    }
                } catch (e) {
                    // not Valid Json String
                }
            }
        }
    }
    setWarningFields(data) {
        var anyWarnings = false;
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;
            if (anyWarnings) {
                var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                var isKit = 0;
                var relevantAtrbs = this.curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY" ? this.densityTierAtrbs : this.tierAtrbs;
                var tierCount = dataItem.NUM_OF_TIERS;
                let curTier = 1, db = 1;
                if (this.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                    if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                    dimStr = "_20___";
                    isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                    relevantAtrbs = this.kitDimAtrbs;
                    tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                }
                // map tiered warnings
                if (this.curPricingTable['OBJ_SET_TYPE_CD'] != "DENSITY") {
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);    //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
                else {
                    var densityCount = dataItem.NUM_OF_DENSITY;
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        if (db > densityCount) {
                            db = 1;
                            curTier++;
                        }
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            dimStr = (relevantAtrbs[a] == "DENSITY_RATE") ? "_8___" : "_10___";
                            if (relevantAtrbs[a] == "DENSITY_RATE") {
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + db + "____10___" + curTier), curTier);
                                db++;
                            }
                            else
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t); //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }

                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
                this.SetBehavior(dataItem);                
            }
        }
    }
    SaveDeal() {
        //this.gridResult = this.ValidateEndCustomer(this.gridResult, 'SaveAndValidate'); // will uncomment once made columns editable
        if (this.curPricingTable.OBJ_SET_TYPE_CD == "ECAP") // sample validation to check Save call -- remove it once implemeted edit fumctionality for all columns
            this.ValidateEcapPrice(this.gridResult);
        this.clearBadegCnt();
        if (this.gridResult != null) {
            for (var i = 0; i < this.gridResult.length; i++) {
                this.SetBehavior(this.gridResult[i]);
            }
        }
        this.gridData = process(this.gridResult, this.state);
        console.log(this.gridData);
    }
    SetBehavior(dataItem) {
        var beh = dataItem._behaviors;
        if (beh === undefined) beh = {};
        if (beh.isError === undefined) beh.isError = {};
        if (beh.validMsg === undefined) beh.validMsg = {};

        if (dataItem != null) {
            var keys = Object.keys(beh.isError);
            var tempKey = "TIER_NBR";
            for (var key in keys) {
                if (this.tierAtrbs.includes(keys[key]) && dataItem.NUM_OF_TIERS != undefined && (dataItem._behaviors.isError[tempKey] == undefined || !dataItem._behaviors.isError[tempKey])) {
                    dataItem._behaviors.isError[tempKey] = true;
                    this.increaseBadgeCnt(tempKey);
                }
                this.increaseBadgeCnt(keys[key]);
            }
        }
    }
    ValidateEndCustomer(data: any, actionName: string) {
        if (actionName !== "OnLoad") {
            _.each(data, (item) => {
                if (item._behaviors && item._behaviors.validMsg && item._behaviors.validMsg["END_CUSTOMER_RETAIL"] != undefined) {
                    item = ContractUtil.clearEndCustomer(item);
                }
            });
        }
        if (this.curPricingStrategy.IS_HYBRID_PRC_STRAT === '1' && (this.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || this.curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP")) {
            var rebateType = data.filter(ob => ob.REBATE_TYPE.toLowerCase() == 'tender');
            if (rebateType && rebateType.length > 0) {
                if (data.length > 1) {
                    var endCustObj = ""
                    if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                        endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                    }
                    _.each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', this.curPricingTable);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    _.each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        _.each(data, (item) => {
                                            item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', this.curPricingTable);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', this.curPricingTable);
                                });
                            }
                        }
                    });
                }

            }
            else {
                if (data.length > 1) {
                    var endCustObj = ""
                    if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                        endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                    }
                    _.each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid ' + this.curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', this.curPricingTable);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    _.each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        _.each(data, (item) => {
                                            item = ContractUtil.setEndCustomer(item, 'Hybrid ' + this.curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', this.curPricingTable);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid ' + this.curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', this.curPricingTable);
                                });
                            }
                        }
                    });
                }
            }
        }

        return data;
    }
    ValidateEcapPrice(data) {
        _.each(data, (item) => {
            if (item._behaviors == undefined) {
                item._behaviors = {};
            }
            if (item._behaviors && item._behaviors.validMsg == undefined) {
                item._behaviors.validMsg = {};
            }
            if (item["ECAP_PRICE"][this.ecapDimKey] == "0") {
                item._behaviors.validMsg["ECAP_PRICE"] = "ECAP Price must be greater than 0";
                item._behaviors.isError["ECAP_PRICE"] = true;
                item.PASSED_VALIDATION = 'Dirty';
            }
            else if (item._behaviors.validMsg["ECAP_PRICE"] != undefined) {
                delete item._behaviors.validMsg["ECAP_PRICE"]
                delete item._behaviors.isError["ECAP_PRICE"];
                item.PASSED_VALIDATION = 'Complete';
            }
        });
    }
    clkAllItems(): void {
        for (var i = 0; i < this.gridResult.length; i++) {
            if (!(this.gridResult[i].SALESFORCE_ID != "" && this.gridResult[i].WF_STG_CD == 'Offer'))
                this.gridResult[i].isLinked = this.isDealToolsChecked;
        }
        this.gridData = process(this.gridResult, this.state);
    }
    ngOnInit() {
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        this.isTenderContract = this.contractData["IS_TENDER"] == "1" ? true : false;
        this.groups = opGridTemplate.groups[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        var newArray = [];
        for (var i = 0; i < this.groups.length; i++) {
            newArray.push({ "name": this.groups[i].name, "order": this.groups[i].order, "isTabHidden": false, "rules": this.groups[i].rules, "numErrors": 0 })
        }
        this.groups = newArray;
        this.groups = this.groups.sort((a, b) => (a.order > b.order) ? 1 : -1);
        this.getWipColumns();
        this.assignColSettings();
        this.templates = opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        this.selectedTab = "Deal Info";
        this.filterColumnbyGroup(this.selectedTab);
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "dealEditor",
    downgradeComponent({
        component: dealEditorComponent,
    })
);
import * as angular from 'angular';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { opGridTemplate } from "../../core/angular.constants"
import { SelectEvent } from "@progress/kendo-angular-layout";
import { ContractUtil } from '../contract.util';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { pricingTableEditorService } from '../../contract/pricingTableEditor/pricingTableEditor.service'
import { DatePipe } from '@angular/common';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { PTE_Load_Util } from '../PTEUtils/PTE_Load_util';
import { PTE_Save_Util } from '../PTEUtils/PTE_Save_util';

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
    private isDealToolsChecked: boolean = false;
    private numSoftWarn = 0;
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
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

    getGroupsAndTemplates() {
        //Get Groups for corresponding deal type
        this.groups = PTE_Load_Util.getRulesForDE(this.curPricingTable.OBJ_SET_TYPE_CD);
        // Get template for the selected WIP_DEAL
        this.wipTemplate = this.UItemplate["ModelTemplates"]["WIP_DEAL"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];

        PTE_Load_Util.wipTemplateColumnSettings(this.wipTemplate, this.isTenderContract, this.curPricingTable.OBJ_SET_TYPE_CD);
        this.templates = opGridTemplate.templates[`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        this.getWipDealData();
    }

    getWipDealData() {
        this.pteService.readPricingTable(this.in_Pt_Id).subscribe((response: any) => {
            if (response && response.WIP_DEAL && response.WIP_DEAL.length > 0) {
                this.gridResult = response.WIP_DEAL;
                PTE_Common_Util.setWarningFields(this.gridResult, this.curPricingTable);
                PTE_Common_Util.clearBadegCnt(this.groups);
                for (var i = 0; i < this.gridResult.length; i++) {
                    if (this.gridResult[i] != null) {
                        var keys = Object.keys(this.gridResult[i]._behaviors.isError);
                        for (var key in keys) {
                            PTE_Common_Util.increaseBadgeCnt(keys[key], this.groups, this.templates);
                        }
                    }
                }
                this.numSoftWarn = PTE_Common_Util.checkSoftWarnings(this.gridResult, this.curPricingTable.OBJ_SET_TYPE_CD);
                this.applyHideIfAllRules();
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
            } else {
                this.gridResult = [];
            }
        }, error => {
            this.loggerService.error('dealEditorComponent::readPricingTable::readTemplates:: service', error);
        });
    }

    clkAllItems(): void {
        for (var i = 0; i < this.gridResult.length; i++) {
            if (!(this.gridResult[i].SALESFORCE_ID != "" && this.gridResult[i].WF_STG_CD == 'Offer'))
                this.gridResult[i].isLinked = this.isDealToolsChecked;
        }
        this.gridData = process(this.gridResult, this.state);
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
        var hideIfAll = PTE_Load_Util.getHideIfAllrules(this.groups);
        if (hideIfAll.length > 0) {
            for (var r = 0; r < hideIfAll.length; r++) {
                if (this.groups != undefined) {
                    for (var g = 0; g < this.groups.length; g++) {
                        var group = this.groups[g];
                        if (group != undefined && hideIfAll[r] && group.name === hideIfAll[r].name) {
                            var data = this.gridResult.filter(x => x[hideIfAll[r].atrb] != undefined && x[hideIfAll[r].atrb] == hideIfAll[r].value);
                            if (this.gridResult.length == data.length) {
                                this.groups.splice(g, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    SaveDeal() {
        PTE_Save_Util.saveDeal(this.gridResult, this.curPricingTable, this.curPricingStrategy, this.groups, this.templates);
        this.gridData = process(this.gridResult, this.state);
        console.log(this.gridData);
    }

    ngOnInit() {
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        this.isTenderContract = this.contractData["IS_TENDER"] == "1" ? true : false;
        this.getGroupsAndTemplates();
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
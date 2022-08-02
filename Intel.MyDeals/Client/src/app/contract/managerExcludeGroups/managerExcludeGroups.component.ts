import * as angular from "angular";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, SelectAllCheckboxState, CellClickEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { managerExcludeGroupsService } from "./managerExcludeGroups.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { excludeDealGroupModalDialog } from "./excludeDealGroupModal.component"
@Component({
    selector: "manager-exclude-groups",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class managerExcludeGroupsComponent {
    constructor(private loggerSvc: logger, private managerExcludeGrpSvc: managerExcludeGroupsService, private lnavSvc: lnavService, private headerSvc: headerService, private formBuilder: FormBuilder, protected dialog: MatDialog) {

    }
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {};
    private usrRole;
    private isSuper = true;
    private superPrefix = "";
    private extraUserPrivsDetail: Array<string> = [];
    private contractType = "Contract";
    private context = {};
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";
    private gridResult;
    public pricingStrategyFilter;
    private loading = true;

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
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
        }
    ];
    public gridData: any;
    gridDataSet = {}; parentGridData = {};
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;

    getFormatedDim(dataItem, field, dim, format) {
        const item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
        if (format === "currency") {
            const isDataNumber = /^\d + $/.test(item[dim]);
            if (isDataNumber) return item[dim];
            return (item[dim].includes('No')) ? item[dim] : '$' + item[dim];
        }
        return item[dim];
    }

    loadExcludeGroups() {
        this.managerExcludeGrpSvc.readWipExclusionFromContract(this.contractData.DC_ID).subscribe((result: any) => {
            this.isLoading = false;
            this.gridResult = result.WIP_DEAL;
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.loggerSvc.error('Customer service', error);
        });

    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "DEAL_GRP_EXCLDS") {
            this.openExcludeDealGroupModal(args.dataItem);
        }
    }

    openExcludeDealGroupModal(dataItem) {
        const dialogRef = this.dialog.open(excludeDealGroupModalDialog, {
            width: "1900px",
            height: "600px",
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null && returnVal != "") {
                this.updateModalDataItem(dataItem, "DEAL_GRP_EXCLDS", returnVal);
            }
        });
    }

    updateModalDataItem(dataItem, field, returnVal) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            dataItem[field] = returnVal;
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
        }
    }

    showHelpTopicGroup() {
        const helpTopic = "Grouping+Exclusions";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    saveAndRunPct() {
        //kujoih
    }
    togglePctFilter() {
        //kujoih
    }
    exportToExcel() {
        //kujoih
    }
    exportToExcelCustomColumns() {
        //kujoih
    }
    openOverlappingDealCheck() {
        //kujoih
    }
    toggleWrap() {
        //kujoih
    }

    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.loadExcludeGroups();
    }


}
angular.module("app").directive(
    "managerExcludeGroups",
    downgradeComponent({
        component: managerExcludeGroupsComponent,
    })
);
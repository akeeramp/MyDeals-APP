import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { managerExcludeGroupsService } from './managerExcludeGroups.service';
import { logger } from "../../shared/logger/logger";
import { DomSanitizer } from '@angular/platform-browser';
import { DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from "@angular/material/core";

@Component({
    selector: "exclude-deal-group-modal-dialog",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/excludeDealGroupModal.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class excludeDealGroupModalDialog {
    constructor(public dialogRef: MatDialogRef<excludeDealGroupModalDialog>, @Inject(MAT_DIALOG_DATA) public dataItem: any, private managerExcludeGrpSvc: managerExcludeGroupsService, private loggerSvc: logger, private sanitized: DomSanitizer) {
    }

    private role = (<any>window).usrRole;
    private wwid = (<any>window).usrWwid;
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";
    private gridResult;
    private dealArray = [];
    private dealId;
    private childGridData;
    private childGridResult;
    private color: ThemePalette = 'primary';

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

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
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

    close(): void {
        this.dialogRef.close();
    }
    ok(): void {
        this.dialogRef.close();
    }
    cancel(): void {
        this.dialogRef.close();
    }
    filterData(IS_SELECTED) {
        //dfsgddg;
    }

    loadExcludeDealGroupModel() {
        this.dealId = this.dataItem.cellCurrValues.DC_ID;
        this.dealArray.push(this.dataItem.cellCurrValues);
        this.gridResult = this.dealArray;
        this.gridData = process(this.gridResult, this.state);
        this.managerExcludeGrpSvc.getExcludeGroupDetails(this.dealId).subscribe((result: any) => {
            this.childGridResult = result;
            this.childGridData = process(this.childGridResult, this.state);
        }, (error) => {
            this.loggerSvc.error('Customer service subgrid', error);
        })
    }

    ngOnInit() {
        this.loadExcludeDealGroupModel();
    }


}

angular.module("app").directive(
    "excludeDealGroupModalDialog",
    downgradeComponent({
        component: excludeDealGroupModalDialog,
    })
);
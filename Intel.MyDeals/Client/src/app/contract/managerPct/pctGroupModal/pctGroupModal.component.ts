import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component,Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DomSanitizer } from '@angular/platform-browser';
import { DataStateChangeEvent, GridDataResult, PageSizeItem } from "@progress/kendo-angular-grid";
import { logger } from "../../../shared/logger/logger";
import { managerPctservice } from "../managerPct.service";
import * as moment from "moment";
import { process, State } from "@progress/kendo-data-query";

@Component({
    selector: "pct-group-dialog",
    templateUrl: "Client/src/app/contract/managerPct/pctGroupModal/pctGroupModal.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/pctGroupModal/pctGroupModal.component.css'],
    
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class pctGroupModal {
    constructor(public dialogRef: MatDialogRef<pctGroupModal>, @Inject(MAT_DIALOG_DATA) public data, private managePctSvc: managerPctservice, private loggerSvc: logger, private sanitized: DomSanitizer) {
    }
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
    public gridData: GridDataResult; 
    public curData: any;
    public dataItem:any;
    public gridResult : any;
    public dealId: any;


    ngOnInit() {
        if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
            this.dataItem = this.data.cellCurrValues;
            this.dealId = this.dataItem.DEAL_ID;
            this.gridResult = this.dataItem;
            this.gridData = process(this.gridResult, this.state);
        }

    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    ok(){
        this.dialogRef.close();
    }

}

angular.module("app").directive(
    "pctGroupDialog",
    downgradeComponent({
        component: pctGroupModal,
    })
);
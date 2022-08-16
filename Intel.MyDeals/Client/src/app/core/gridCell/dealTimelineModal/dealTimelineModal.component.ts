import * as angular from "angular";
import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { dealToolsService } from "../dealTools/dealTools.service";

@Component({
    selector: "deal-timeline-modal",
    templateUrl: "Client/src/app/core/gridCell/dealTimelineModal/dealTimelineModal.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealTimelineModal/dealTimelineModal.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class dealTimelineComponent {
    constructor(private dealToolsSvc: dealToolsService,private loggerSvc: logger, public dialogRef: MatDialogRef<dealTimelineComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private dcId = this.data.dataItem.DC_ID;
    private isLoading = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    loadTimeline() {
        this.dealToolsSvc.getTimlelineDs(this.data.item).subscribe(response => {
            for (var d = 0; d < response.length; d++) {
                response[d]["user"] = response[d]["FRST_NM"] + " " + response[d]["LST_NM"];
                response[d]["ATRB_VAL"] = response[d]["ATRB_VAL"].replace(/; /g, '<br/>');
                var regex1 = /Created Deals:/gi;
                response[d]["ATRB_VAL"] = response[d]["ATRB_VAL"].replace(regex1, 'Created Deal(s) for product:');
            }
            this.gridResult = response;
            this.gridData = process(this.gridResult, this.state);
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
        }, (error) => {
            this.loggerSvc.error("Unable to load the Deal Timeline Data", error);
        });
    }
    close() {
        this.dialogRef.close();
    }
    exportToExcelTimeline() {
        //yet to migrate
    }
    ngOnInit() {
        this.loadTimeline();
    }
}
angular.module("app").directive(
    "dealTimelineModal",
    downgradeComponent({
        component: dealTimelineComponent,
    })
);
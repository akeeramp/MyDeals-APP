import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { opLogService } from "./admin.oplog.service";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";

@Component({
    selector: "opLog",
    templateUrl: "Client/src/app/admin/oplog/admin.oplog.component.html",
    styleUrls: ['Client/src/app/admin/oplog/admin.oplog.component.css']
})

export class OpLogComponent {
    constructor(private opLogSvc: opLogService, private loggerSvc: logger) {
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private title = "Opaque Log Watcher";
    public opLogData: Array<any> = [];
    public logDetails = '';
    public stDate: Date = new Date();
    public enDate: Date = new Date();
    private test: number = this.enDate.setDate(this.enDate.getDate() - 30);
    private startDate: Date = this.enDate;
    private endDate: Date = this.stDate;
    private dateRangeInvalid = false;

    //created for Angular loader
    public isLoading = 'true';
    public loadMessage = "Log Viewer is Loading ...";
    public moduleName = "Log Viewer Dashboard";


    getDateFormat(timestamp) {
        return new Date(timestamp);
    }

    getOpaqueLog(startDate, endDate) {
        this.isLoading = 'false';
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            
            const logDate = {
                'startDate': startDate,
                'endDate': endDate
            }
            this.opLogSvc.getOpaqueLog(logDate)
                .subscribe(response => {
                    this.opLogData = response;
                    this.logDetails = '';
                }, err => {
                    this.loggerSvc.error("Error in getting Opaque Log", err);
                });
        }
    }

    getDetailsOpaqueLog (data) {
        this.logDetails = '';
        this.opLogSvc.getDetailsOpaqueLog(data.fileName.substring(0, data.fileName.length - 4))
            .subscribe( response => {
                const entityMap = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': '&quot;',
                    "'": '&#39;',
                    "/": '&#x2F;'
                };
                response.data = String(response.data).replace(/[&<>"'\/]/g, function (s) {
                    return entityMap[s];
                });
                this.logDetails = response.data;
            }, err => {
                    this.loggerSvc.error("Error in getting Opaque Log.", err);
            });
    }

    ngOnInit() {
        this.getOpaqueLog(this.startDate, this.endDate);
    }

    refreshAllLog () {
        const one_day = 1000 * 60 * 60 * 24;
        const dateDifference = <any> new Date(this.endDate) - <any> new Date(this.startDate);
        const noOfDays = dateDifference / one_day;
        this.dateRangeInvalid = false;

        if (noOfDays <= 30 && noOfDays > 0) {
            this.opLogData = [];
            this.getOpaqueLog(this.startDate, this.endDate);
        }
        else {
            this.dateRangeInvalid = true;
        }            
    }

    close() {
        this.dateRangeInvalid = false;
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular.module("app").directive(
    "opLog",
    downgradeComponent({
        component: OpLogComponent,
    })
);

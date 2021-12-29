import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { opLogService } from "./oplog.service";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import * as _ from "underscore";

@Component({
    selector: "opLog",
    templateUrl: "Client/src/app/admin/oplog/oplog.html",
    styleUrls: ['Client/src/app/admin/oplog/oplog.css']
})

export class OpLogComponent {
    constructor(private opLogSvc: opLogService, private loggerSvc: logger) {
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private title: string = "Opaque Log Watcher";
    public opLogData: Array<any> = [];
    public logDetails: string = '';
    public stDate: Date = new Date();
    public enDate: Date = new Date();
    private test: number = this.enDate.setDate(this.enDate.getDate() - 30);
    private startDate: Date = this.enDate;
    private endDate: Date = this.stDate;


    getDateFormat(timestamp) {
        return new Date(timestamp);
    }

    getOpaqueLog(startDate, endDate) {
        let vm = this;
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            
            let logDate = {
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
                let entityMap = {
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

    refreshAllLog (mode) {
        let one_day = 1000 * 60 * 60 * 24;
        let dateDifference = <any> new Date(this.endDate) - <any> new Date(this.startDate);
        let noOfDays = dateDifference / one_day;
        if (noOfDays <= 30 && noOfDays > 0) {
            this.opLogData = [];
            this.getOpaqueLog(this.startDate, this.endDate);
        }
        else {
            alert('Please Check Dates. Log can be fetched for maximum 30 days...');
        }            
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

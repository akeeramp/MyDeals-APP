import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import * as _ from "underscore";
import { MatDialog } from "@angular/material/dialog";
import { notificationsModalDialog } from '../../admin/notifications/admin.notificationsModal.component';
import {
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent,
    PageSizeItem,
    SelectableSettings,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    GroupDescriptor,
    CompositeFilterDescriptor,
    distinct,
    filterBy,
} from "@progress/kendo-data-query";
import { notificationsService } from './admin.notifications.service';

@Component({
    selector: "adminNotifications",
    templateUrl: "Client/src/app/admin/notifications/admin.notifications.component.html",
    styleUrls: ['Client/src/app/admin/notifications/admin.notifications.component.css']
})

export class adminNotificationsComponent {
    constructor(private notificationsSvc: notificationsService, private loggerSvc: logger, public dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    public gridData: GridDataResult;
    //variable to hold the selected ID's (rows which are selected using check box)
    public mySelection: number[] = [];
    private isLoading: boolean = true;
    public gridResult: Array<any>;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
    ];


    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadNotifications() {
        let vm = this;
        this.mySelection = [];
        this.notificationsSvc.getNotification('SELECT ALL').subscribe(
            (response: Array<any>) => {
                //as we get the CRE_DTM value as string in the response, converting into date data type and assigning it to grid result so that date filter works properly
                var result = response.map(function (x) {
                    x.CRE_DTM = new Date(x.CRE_DTM);
                    return x;
                });
                vm.gridResult = result;
                vm.gridData = process(vm.gridResult, vm.state);
                vm.isLoading = false;
                // Below call is to update the notification count on the notification icon
                vm.notificationsSvc.refreshUnreadCount();
            },
            (error)=> {
                this.loggerSvc.error("adminNotificationsComponent::getNotification::Unable to get Notifications.", error);
            }
        );

    }

    markAsRead() {
        var ids = this.mySelection;
        var vm = this;
        this.notificationsSvc.manageNotifications("UPDATE", true, ids).subscribe(
            res=> {
                vm.loadNotifications();
            },
            (error) => {
                vm.loggerSvc.error("adminNotificationsComponent::manageNotifications::Unable to Update Notifications.", error);
            });
    }

    markAsUnRead() {
        var ids = this.mySelection;
        var vm = this;
        this.notificationsSvc.manageNotifications("UPDATE", false, ids).subscribe(
            res=> {
                vm.loadNotifications();
            },
            (error) => {
                this.loggerSvc.error("adminNotificationsComponent::manageNotifications::Unable to Update Notifications.", error);
            });
    }

    delete() {
        var ids = this.mySelection;
        var vm = this;
        this.notificationsSvc.manageNotifications("DELETE", false, ids).subscribe(
            res=> {
                vm.loadNotifications();
            });
    }

    //Open Notification Message Modal
    openMessage({ dataItem, column }) {
        if (column.field == "NOTIF_SHR_DSC") {
            const dialogRef = this.dialog.open(notificationsModalDialog, {
                width: "900px",
                data: dataItem
            }
            );
            dialogRef.afterClosed().subscribe(result => {
                dataItem.IS_READ_IND = true;
            });
        }
    }
    
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadNotifications()
    }

    ngOnInit() {
        this.loadNotifications();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "adminNotifications",
        downgradeComponent({ component: adminNotificationsComponent })
    );

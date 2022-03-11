import * as angular from 'angular';
import { Input, Output, Component, OnInit, EventEmitter, Inject } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { notificationsService } from './notificationDock.service';
import { logger } from "../../shared/logger/logger";
import * as _ from 'underscore';
import { notificationsSettingsDialog } from './notificationsSettings.component';
import { notificationsModalDialog } from './notificationsModal.component';
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'notification-dock-angular',
    templateUrl: 'Client/src/app/core/notification/notificationDock.component.html',
    styleUrls: ['Client/src/app/core/notification/notificationDock.component.css']
})

export class notificationDockComponent {
    constructor(private notificationSvc: notificationsService, private loggerSvc: logger, public dialog: MatDialog) { }

    public unreadMessages: number = 0;
    public notifications: Array<any>;

    //Notifications Settings Modal
    gotoNotificationSettings(dataItem) {
        /*this.dialog.openDialog();*/
        this.dialog.open(notificationsSettingsDialog, {
            width: "500px",
        });
    }

    //Open Message Modal
    openMessage(dataItem) {
        const dialogRef = this.dialog.open(notificationsModalDialog, {
            width: "500px",
        });
        dialogRef.afterClosed().subscribe(result => {
            dataItem.IS_READ_IND = true;
        });
    }

    //get Notification
    getNotification(mode) {
        this.notificationSvc.getNotification(mode).subscribe(
            (response: Array<any>) => {
                this.notifications = response;
            }, function (response) {
                //logger.loggerSvc.error("Unable to get Notifications.", response, response.statusText);
            })
    }

    //get Unread Notification Count
    getUnreadNotification() {
        this.notificationSvc.getUnreadNotificationCount().subscribe(
            (response: number) => {
                this.unreadMessages = response;
            }, function (response) {
                this.loggerSvc.error("Unable to get user unread messages.", response, response.statusText);
            })
    }

    //See All Notifications template will be visible once Notifications component migrated
    seeAllNotifications() {
        window.open('/Admin#/notifications', '_blank');
    }


    /*$scope.$on('refreshUnreadCount', function (event, data) {
        debugger;
        this.getUnreadNotification();
    });*/

    ngOnInit() {
        //this.isFunFactEnabled = this.isShowFunFact == 'true' ? true : false;
        this.getUnreadNotification();

        // Fix some sloopy bug when we are trying to engage an old easter egg

        if (window.location.href.indexOf('Snow') < 0) {
            this.getUnreadNotification();
        }

        //_refreshUnreadCount$ BehaviorSubject yet to implement in NotificationModal & Notification components
        /*this.notificationSvc._refreshUnreadCount$.subscribe(() => {
            this.getUnreadNotification();
        });*/

    }

}
angular
    .module('app')
    .directive("notificationDockAngular", downgradeComponent({
        component: notificationDockComponent,
    }));
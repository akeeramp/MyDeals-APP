import * as angular from 'angular';
import { Input, Output, Component, OnInit, EventEmitter } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { notificationsService } from '../../admin/notifications/admin.notifications.service';
import { logger } from "../../shared/logger/logger";
import * as _ from 'underscore';
import { notificationsSettingsDialog } from '../../admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../../admin/notifications/admin.notificationsModal.component';
import { MatDialog } from "@angular/material/dialog";
import { data } from 'jquery';
import { Subscription} from 'rxjs';

@Component({
    selector: 'notification-dock-angular',
    templateUrl: 'Client/src/app/core/notification/notificationDock.component.html',
    styleUrls: ['Client/src/app/core/notification/notificationDock.component.css']
})

export class notificationDockComponent {
    constructor(public notificationSvc: notificationsService, private loggerSvc: logger, public dialog: MatDialog) { }
    unreadMessagesCountSubscription: Subscription; 
    public notifications: Array<any>;
    unreadMessagesCount: number;

    //to open notification settings pop up
    gotoNotificationSettings() {
        this.dialog.open(notificationsSettingsDialog, {
            width: "800px"
        });
    }

    //Open Message Modal
    openMessage(dataItem) {
        const dialogRef = this.dialog.open(notificationsModalDialog, {
            width: "900px",
            data: dataItem
        }
        );
        dialogRef.afterClosed().subscribe(result => {
            dataItem.IS_READ_IND = true;
        });
    }

    //get Notifications
    getNotification(mode) {
        this.notificationSvc.getNotification(mode).subscribe(
            (response: Array<any>) => {
                this.notifications = response;
            }, error => {
                this.loggerSvc.error("notificationDockComponent::getNotification::Unable to get user unread messages.", error );
               })
    }

    //See All Notifications template will be visible once Notifications component migrated
    seeAllNotifications() {
        window.open('/Admin#/notifications', '_blank');
    }

    ngOnInit() {
        //this.isFunFactEnabled = this.isShowFunFact == 'true' ? true : false;
        this.notificationSvc.getUnreadNotification();
        // subscription to the observable which is used to update the unreadMessagesCount
        this.unreadMessagesCountSubscription = this.notificationSvc.getUnreadNotificationMsgsCount()
            .subscribe((count) => {
                this.unreadMessagesCount = count;
            });

        // Fix some sloopy bug when we are trying to engage an old easter egg
        //if (window.location.href.indexOf('Snow') < 0) {
            //this.getUnreadNotification();
        //}


    }
    ngOnDestroy() {
        this.unreadMessagesCountSubscription.unsubscribe();
    }
}
angular
    .module('app')
    .directive("notificationDockAngular", downgradeComponent({
        component: notificationDockComponent,
    }));
import { Component,OnDestroy} from "@angular/core";
import { notificationsService } from '../../admin/notifications/admin.notifications.service';
import { logger } from "../../shared/logger/logger";
import { notificationsSettingsDialog } from '../../admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../../admin/notifications/admin.notificationsModal.component';
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from 'rxjs';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'notification-dock-angular',
    templateUrl: 'Client/src/app/core/notification/notificationDock.component.html',
    styleUrls: ['Client/src/app/core/notification/notificationDock.component.css']
})

export class notificationDockComponent implements OnDestroy {
    constructor(public notificationSvc: notificationsService, private loggerSvc: logger, public dialog: MatDialog) { }
    unreadMessagesCountSubscription: Subscription; 
    public notifications: Array<any>;
    unreadMessagesCount: number;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    //to open notification settings pop up
    gotoNotificationSettings() {
        this.dialog.open(notificationsSettingsDialog, {
            width: "800px",
            panelClass: "notificationSetting-popup"
        });
    }

    //Open Message Modal
    openMessage(dataItem) {
        const dialogRef = this.dialog.open(notificationsModalDialog, {
            width: "900px",
            data: dataItem,
            panelClass: "mat-remove-space"
        }
        );
        dialogRef.afterClosed().subscribe(() => {
            dataItem.IS_READ_IND = true;
        });
    }

    //get Notifications
    getNotification(mode) {
        this.notificationSvc.getNotification(mode).pipe(takeUntil(this.destroy$)).subscribe(
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
            .pipe(takeUntil(this.destroy$))
            .subscribe((count) => {
                this.unreadMessagesCount = count;
            },(err)=>{
                this.loggerSvc.error("Unable to Fetch Notification Count Data","Error",err);
            });
    }
    ngOnDestroy() {
        this.unreadMessagesCountSubscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

//this is a shared service used by notifications,notificationModal and NotificationSettings components
export class notificationsService {
    public apiBaseUrl = "api/Notifications/";
    constructor(private httpClient: HttpClient) {
    }

    //behaviour subject to hold the unRead Notification Count
    private unReadNotificationCount = new BehaviorSubject<any>(0);
    //unReadNotificationCount$ will have the updated count which is used in notification dock component to display the count
    private unReadNotificationCount$: Observable<number> = this.unReadNotificationCount;

    public getUnreadNotificationMsgsCount(): Observable<number> {
        return this.unReadNotificationCount$;
    }

    private setUnreadNotificationMsgsCount(res) {
        this.unReadNotificationCount.next(res);
    }

    public getUnreadNotificationCount(): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'GetUnreadNotificationCount';
        return this.httpClient.get(apiUrl);
    }

    //get Unread Notification Count
    public getUnreadNotification() {
        this.getUnreadNotificationCount().subscribe(
            (response) => {
                //to set the next value of the unReadNotificationCount behaviour subject with the response count
                this.setUnreadNotificationMsgsCount(response);
            }, function (response) {
                this.loggerSvc.error("Unable to get user unread messages.", response, response.statusText);
            })
    }

    public refreshUnreadCount() {
        this.getUnreadNotification()
    }

    public getNotification(mode): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetNotification/' + mode;
        return this.httpClient.get(apiUrl);
    }


    public manageNotifications(mode, isRead, ids): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'manageNotifications/' + mode + '/' + isRead;
        return this.httpClient.post(apiUrl, ids);
    }

    public getUserSubscriptions() {
        const apiUrl: string = this.apiBaseUrl + 'GetUserSubscriptions';
        return this.httpClient.get(apiUrl);
    }

    public updateUserSubscriptions(subscriptions) {
        const apiUrl: string = this.apiBaseUrl + 'UpdateUserSubscriptions';
        return this.httpClient.post(apiUrl, subscriptions);
    }

    public getEmailBodyTemplateUI(id) {
        const apiUrl: string = this.apiBaseUrl + 'GetEmailBodyTemplateUI/' + id;
        return this.httpClient.get(apiUrl);
    }
}
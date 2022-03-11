import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class notificationsService {
    public apiBaseUrl: string = "api/Notifications/";

    constructor(private httpClient: HttpClient) {
    }

    public getUnreadNotificationCount(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetUnreadNotificationCount';
        return this.httpClient.get(apiUrl);
    }

    public getNotification(mode): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetNotification/' + mode;
        return this.httpClient.get(apiUrl);
    }

}
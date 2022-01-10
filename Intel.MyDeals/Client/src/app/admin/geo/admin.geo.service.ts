import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class geoService {
    public apiBaseUrl: string = "api/Geos/";

    constructor(private httpClient: HttpClient) {
    }

    public getGeos(): Observable<any> {
        // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
        let apiUrl: string = this.apiBaseUrl + 'GetGeos/false';
        return this.httpClient.get(apiUrl);
    }

}


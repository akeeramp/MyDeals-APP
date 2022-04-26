import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class templatesService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/Templates/v1/";

    public readTemplates(): Observable<any> {
        //var isGetViaAngularCache = true;
        //if (isForceReGet) { isGetViaAngularCache = false; }
        const apiUrl: string = this.apiBaseUrl + "GetUiTemplates" ;
        return this.httpClient.get(apiUrl);
    }

}
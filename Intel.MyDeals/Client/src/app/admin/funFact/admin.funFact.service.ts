import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class funFactService {
    public apiBaseUrl: string = "api/Funfact/";

    constructor(private httpClient: HttpClient) {
    }

    public getFunFactItems(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetFunfactItems';
        return this.httpClient.get(apiUrl);
    }

    public updateFunFact(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateFunfact';
        return this.httpClient.post(apiUrl, data);
    }
    public setFunfact(data:any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SetFunfact';
        return this.httpClient.post(apiUrl,data);

    }
    public getActiveFunfacts(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetActiveFunfacts';
        return this.httpClient.get(apiUrl);
    }

}


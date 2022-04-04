import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class funFactService {
    public apiBaseUrl = "api/Funfact/";

    constructor(private httpClient: HttpClient) {
    }

    public getFunFactItems(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetFunfactItems';
        return this.httpClient.get(apiUrl);
    }

    public updateFunFact(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateFunfact';
        return this.httpClient.post(apiUrl, data);
    }
    public setFunfact(data:any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SetFunfact';
        return this.httpClient.post(apiUrl,data);

    }
    public getActiveFunfacts(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetActiveFunfacts';
        return this.httpClient.get(apiUrl);
    }

}


import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class constantsService {
    public apiBaseUrl = "api/AdminConstants/v1/";

    constructor(private httpClient: HttpClient) { }

    public getConstants(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetConstants/false';
        return this.httpClient.get(apiUrl);
    }
    public updateConstants(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateConstant';
        return this.httpClient.post(apiUrl, data);
    }
    public insertConstants(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'CreateConstant';
        return this.httpClient.post(apiUrl, data);
    }
    public deleteConstants(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteConstant';
        return this.httpClient.post(apiUrl, data);
    }
    public getConstantsByName(name: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetConstantsByName/' + name;
        return this.httpClient.get(apiUrl);
    }
}

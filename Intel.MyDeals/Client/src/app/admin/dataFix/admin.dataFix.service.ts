import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class dataFixService {
    public apiBaseUrl = "api/dataFix/";
    public apiCustBaseUrl = "api/Customers/";
    public apiDropUrl = "api/Dropdown/";

    constructor(private httpClient: HttpClient) {

    }

    public getDataFixActions(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDataFixActions';
        return this.httpClient.get(apiUrl);
    }

    public getDataFixes(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDataFixes';
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomersNameInfo(): Observable<any> {
        const apiUrl: string = this.apiCustBaseUrl + 'GetMyCustomersNameInfo';
        return this.httpClient.get(apiUrl);
    }

    public getOpDataElements(): Observable<any> {
        const apiUrl: string = this.apiDropUrl + 'GetOpDataElements';
        return this.httpClient.get(apiUrl);
    }

    public updateDataFix(data, isExecute): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateDataFix/' + isExecute;
        return this.httpClient.post(apiUrl, data);
    }

}

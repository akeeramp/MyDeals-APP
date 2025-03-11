import {Injectable} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
 })

export class reportingService {
    public apiBaseUrl: string = "api/Reporting/";
    constructor(private httpClient: HttpClient) { }
    public getReportData():Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetReportDashboard';
        let param =new HttpParams();
        param.set('cache','false');
        return this.httpClient.get(apiUrl,{params:param});
    }

    public GetReportMissingCostData(): Observable<any> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'GetReportMissingCostData';
        return this.httpClient.post(apiUrl, { 'headers': headers });
    }

    public GetReportNewProductMissingCostData(): Observable<any> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'GetReportNewProductMissingCostData';
        return this.httpClient.post(apiUrl, { 'headers': headers });
    }

    public GetUCMReportData(): Observable<any> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'GetUCMReportData';
        return this.httpClient.post(apiUrl, { 'headers': headers });
    }

    
}


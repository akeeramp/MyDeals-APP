import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class dbAuditToolsService {

    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = "api/DbAuditTools/";

    public service: any = {
        getDbEnvs: this.getDbEnvs,
        getDbObjs: this.getDbObjs,
        GetAuditData: this.GetAuditData,
        GetObjText: this.GetObjText
    }

    public getDbEnvs(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDbEnvData';
        return this.httpClient.get(apiUrl);
    }

    public getDbObjs(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDbObjData';
        return this.httpClient.get(apiUrl);
    }

    public GetAuditData(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'FetchDbAuditData';
        return this.httpClient.post(apiUrl, data);
    }

    public GetObjText(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetObjText';
        return this.httpClient.post(apiUrl, data);
    }

}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { DbAuditDataPacket, DbAuditObjTextRequest } from "./admin.dbAuditTools.model";

@Injectable({
    providedIn: 'root'
})

export class dbAuditToolsService {

    constructor(private httpClient: HttpClient) { }
    public readonly apiBaseUrl = "api/DbAuditTools/";

    public service = {
        getDbEnvs: this.getDbEnvs,
        getDbObjs: this.getDbObjs,
        GetAuditData: this.GetAuditData,
        GetObjText: this.GetObjText
    }

    public getDbEnvs(): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'GetDbEnvData';
        return this.httpClient.get<string>(apiUrl);
    }

    public getDbObjs(): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'GetDbObjData';
        return this.httpClient.get<string>(apiUrl);
    }

    public GetAuditData(data: DbAuditDataPacket): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'FetchDbAuditData';
        return this.httpClient.post<string>(apiUrl, data);
    }

    public GetObjText(data: DbAuditObjTextRequest): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'GetObjText';
        return this.httpClient.post<string>(apiUrl, data);
    }

}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { logDate_Map, logFileObject } from "./admin.oplog.model";

@Injectable({
    providedIn: 'root'
})

export class opLogService {

    public readonly apiBaseUrl = "api/OpLog/";

    public service = {
        getOpaqueLog: this.getOpaqueLog,
        getDetailsOpaqueLog: this.getDetailsOpaqueLog
    }

    constructor(private httpClient: HttpClient) { }

    public getOpaqueLog(logDate: logDate_Map): Observable<logFileObject[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetOpaqueLog';
        return this.httpClient.post<logFileObject[]>(apiUrl, logDate); 
    }

    public getDetailsOpaqueLog(fileName: string): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'GetDetailsOpaqueLog/'+fileName;
        return this.httpClient.post<string>(apiUrl,{});
    }  
}


import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class opLogService {

    public readonly apiBaseUrl = "api/OpLog/";

    public service: any = {
        getOpaqueLog: this.getOpaqueLog,
        getDetailsOpaqueLog: this.getDetailsOpaqueLog
    }

    constructor(private httpClient: HttpClient) { }

    public getOpaqueLog(logDate: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetOpaqueLog';
        
        return this.httpClient.post(apiUrl, logDate); 
    }

    public getDetailsOpaqueLog(fileName: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDetailsOpaqueLog/'+fileName;
        return this.httpClient.post(apiUrl,{});
    }  
}


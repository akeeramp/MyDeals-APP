import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Cnst_Map } from "./admin.constants.model";
@Injectable({
    providedIn: 'root'
})
export class constantsService {
    public readonly apiBaseUrl = "api/AdminConstants/v1/";

    constructor(private httpClient: HttpClient) { }

    public getConstants(): Observable<Cnst_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetConstants/false';
        return this.httpClient.get<Cnst_Map[]>(apiUrl);
    }
    public updateConstants(data: Cnst_Map): Observable<Cnst_Map> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateConstant';
        return this.httpClient.post<Cnst_Map>(apiUrl, data);
    }
    public insertConstants(data: Cnst_Map): Observable<Cnst_Map> {
        const apiUrl: string = this.apiBaseUrl + 'CreateConstant';
        return this.httpClient.post<Cnst_Map>(apiUrl, data);
    }
    public deleteConstants(data: Cnst_Map): Observable<void> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteConstant';
        return this.httpClient.post<void>(apiUrl, data);
    }
    public getConstantsByName(name: string): Observable<Cnst_Map> {
        const apiUrl: string = this.apiBaseUrl + 'GetConstantsByName/' + name;
        return this.httpClient.get<Cnst_Map>(apiUrl);
    }
}
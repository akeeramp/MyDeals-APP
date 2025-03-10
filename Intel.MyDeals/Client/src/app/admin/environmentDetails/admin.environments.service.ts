import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Const_Map, Envir_Map, Svr_Map } from "./admin.environments.model";
@Injectable({
    providedIn: 'root'
})
export class AdminEnvironmentsService {
    public readonly apiBaseUrl = "api/AdminEnvironments/";

    constructor(private httpClient: HttpClient) { }

    // Start Environments

    public getEnvironments(): Observable<Envir_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetEnvDetails';
        return this.httpClient.get<Envir_Map[]>(apiUrl);
    }
    public updateEnvironments(data: Envir_Map): Observable<Envir_Map> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateEnvDetails';
        return this.httpClient.post<Envir_Map>(apiUrl, data);
    }
    public insertEnvironments(data: Envir_Map): Observable<Envir_Map> {
        const apiUrl: string = this.apiBaseUrl + 'CreateEnvDetails';
        return this.httpClient.post<Envir_Map>(apiUrl, data);
    }
    public deleteEnvironments(data: Envir_Map): Observable<Envir_Map> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteEnvDetails';
        return this.httpClient.post<Envir_Map>(apiUrl, data);
    }

    public getConstantDtl(): Observable<Const_Map[]> {
        const apiUrl: string = 'api/AdminConstants/V1/GetConstantsByName/DB_ENV_DTL_WRITE_ACCESS';
        return this.httpClient.get<Const_Map[]>(apiUrl);
    }

    // End Environments

    // Start Server

    public getSvrDetails(): Observable<Svr_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetServerDetails';
        return this.httpClient.get<Svr_Map[]>(apiUrl);
    }
    public updateSvrDetails(data: Svr_Map): Observable<Svr_Map> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateServerDetails';
        return this.httpClient.post<Svr_Map>(apiUrl, data);
    }
    public insertSvrDetails(data: Svr_Map): Observable<Svr_Map> {
        const apiUrl: string = this.apiBaseUrl + 'CreateServerDetails';
        return this.httpClient.post<Svr_Map>(apiUrl, data);
    }
    public deleteSvrDetails(data: Svr_Map): Observable<Svr_Map> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteServerDetails';
        return this.httpClient.post<Svr_Map>(apiUrl, data);
    }

    // End Server
}
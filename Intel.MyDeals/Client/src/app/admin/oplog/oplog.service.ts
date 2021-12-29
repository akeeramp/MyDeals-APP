import * as angular from 'angular';
import { Injectable } from "@angular/core";
import { downgradeInjectable } from '@angular/upgrade/static';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from "rxjs";
import 'rxjs/add/operator/toPromise';
import "rxjs/add/observable/of"

@Injectable({
    providedIn: 'root'
})

export class opLogService {

    public apiBaseUrl: string = "api/OpLog/";

    public service: any = {
        getOpaqueLog: this.getOpaqueLog,
        getDetailsOpaqueLog: this.getDetailsOpaqueLog
    }
    //return service;

    constructor(private httpClient: HttpClient) { }

    public getOpaqueLog(logDate: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetOpaqueLog';
        
        return this.httpClient.post(apiUrl, logDate); 
        
    }

    public getDetailsOpaqueLog(fileName: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetDetailsOpaqueLog/' ;
        return this.httpClient.post(apiUrl, fileName);
    }  
}

angular
    .module('app')
    .factory('opLogService', downgradeInjectable(opLogService));

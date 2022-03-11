import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class dsaService {
    public apiBaseUrl = "api/DSA/";
    public vistexApiBase = "api/VistexService/";
    public tenderApiBase = "api/Integration/";

    constructor(private httpClient: HttpClient) {
    }


    public sendVistexData(lstDealIds: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SendVistexData/false';
        return this.httpClient.post(apiUrl, lstDealIds);
    }

    public callAPI(apiName: any, runMode: any) {
        let apiUrl: string;
        if ((runMode == "D") || (runMode == "E")) {
            apiUrl = this.vistexApiBase + apiName + '/VISTEX_DEALS/';
        } else if ((runMode == "M")) {
            apiUrl = this.vistexApiBase + apiName + '/CNSMPTN_LD/';
        } else if (runMode == "R") {
            apiUrl = this.tenderApiBase + '/CNSMPTN_LD/';
        }
        else {
            apiUrl = this.vistexApiBase + apiName + '/';            
        }

        return this.httpClient.get(apiUrl + runMode);

    }
}

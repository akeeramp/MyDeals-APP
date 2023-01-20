import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
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


    public sendVistexData(lstDealIds): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SendVistexData';
        return this.httpClient.post(apiUrl, lstDealIds);
    }

    public callAPI(apiName, runMode) {
        let apiUrl: string;
        if ((runMode == "D") || (runMode == "E")) {
            apiUrl = this.vistexApiBase + apiName + '/VISTEX_DEALS/' + runMode;
        } else if (runMode == "M") {
            apiUrl = this.vistexApiBase + apiName + '/CNSMPTN_LD/' + runMode;
        } else if (runMode == "L") {
            apiUrl = this.vistexApiBase + apiName + '/IQR_CLM_DATA/' + runMode;
        } else if (runMode == "R" || runMode == "T") {
            apiUrl = this.tenderApiBase + apiName;
        }
        else {
            apiUrl = this.vistexApiBase + apiName + '/' + runMode;
        }

        return this.httpClient.get(apiUrl);

    }

    public getVistexLogs(postData):Observable<any> {
        const apiUrl = this.apiBaseUrl + 'GetVistexLogs';
        return this.httpClient.post(apiUrl, postData);
    }
    
    public getVistexStatuses():Observable<any> {
        const apiUrl = this.apiBaseUrl + 'GetVistexStatuses'
        return this.httpClient.get(apiUrl );
    }

    public updateVistexStatusNew(postData):Observable<any> {
        const apiUrl = this.apiBaseUrl + 'UpdateVistexStatusNew';
        return this.httpClient.post(apiUrl, postData );
    }
    
    public getRequestTypeList():Observable<any>{
        const apiUrl = this.apiBaseUrl + 'GetRequestTypeList';
        return this.httpClient.get(apiUrl); 
    }
}

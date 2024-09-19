import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'; 

@Injectable({
    providedIn: 'root'
})

export class adminlegalExceptionService {
    public readonly apiBaseUrl = "api/ProductCostTest/";
    
    constructor(private httpClient: HttpClient) {

    }

    public createLegalException(dto) {
        const apiUrl: string = this.apiBaseUrl + "CreateLegalException" ;
        return this.httpClient.post(apiUrl,dto);
    }

    public updateLegalException(dto) {
        const apiUrl: string = this.apiBaseUrl + "UpdateLegalException";
        return this.httpClient.post(apiUrl, dto);
    }

    public deleteLegalException(dto) {
        const apiUrl: string = this.apiBaseUrl + "DeleteLegalException";
        return this.httpClient.post(apiUrl, dto);
    }
 

    public getLegalExceptions() {
        const apiUrl: string = this.apiBaseUrl + 'GetLegalExceptions';
          return this.httpClient.get(apiUrl);
    }

    public getVersionDetailsPCTExceptions(id, excludeCurrVer) {
        const apiUrl: string = this.apiBaseUrl + 'GetVersionDetailsPCTExceptions' + "/" + id + "/" + excludeCurrVer;
        return this.httpClient.get(apiUrl);
    }

    public getDownloadLegalException(exceptionSid, chkPreviousVersion, chkDealList) {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'GetDownloadLegalException' + "/" + chkPreviousVersion + "/" + chkDealList;
        return this.httpClient.post(apiUrl,exceptionSid, { 'headers': headers });
    }

}
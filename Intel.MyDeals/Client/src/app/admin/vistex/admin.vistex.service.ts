import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestDetails, VistexLogFilters, VistexLogFiltersRequest, VistexLogFiltersResponse, VistexLogsInfo, VistexResponseUpdData } from "./admin.vistex.model";

@Injectable({
    providedIn: 'root'
})

export class dsaService {
    public readonly apiBaseUrl = "api/DSA/";
    public readonly vistexApiBase = "api/VistexService/";
    public readonly tenderApiBase = "api/Integration/";

    constructor(private httpClient: HttpClient) {
    }


    public sendVistexData(lstDealIds: any[]): Observable<VistexLogsInfo[]> {
        const apiUrl: string = this.apiBaseUrl + 'SendVistexData';
        return this.httpClient.post<VistexLogsInfo[]>(apiUrl, lstDealIds);
    }

    public callAPI(apiName: string, runMode: string): Observable<any> {
        let apiUrl: string;
        if ((runMode == "D") || (runMode == "E")) {
            apiUrl = this.vistexApiBase + apiName + '/VISTEX_DEALS/' + runMode;
        } else if (runMode == "F") {
            apiUrl = this.vistexApiBase + apiName + '/PROD_VERT_RULES/' + runMode;
        } else if (runMode == "M") {
            apiUrl = this.vistexApiBase + apiName + '/CNSMPTN_LD/' + runMode;
        } /*else if (runMode == "L") {
            apiUrl = this.vistexApiBase + apiName + '/IQR_CLM_DATA/' + runMode;
        }*/ else if (runMode == "R" || runMode == "T") {
            apiUrl = this.tenderApiBase + apiName;
        } else if (runMode == "N") {
            apiUrl = this.vistexApiBase + apiName + '/IQR_CONSUMPTION_DATA/' + runMode;
        }
        else {
            apiUrl = this.vistexApiBase + apiName + '/' + runMode;
        }

        return this.httpClient.get(apiUrl);

    }

    public getVistexLogs(postData: VistexLogFilters): Observable<VistexLogsInfo[]> {
        const apiUrl = this.apiBaseUrl + 'GetVistexLogs';
        return this.httpClient.post<VistexLogsInfo[]>(apiUrl, postData);
    }

    public getVistexLogsInfo(postData: VistexLogFiltersRequest): Observable<VistexLogFiltersResponse> {
        const apiUrl = this.apiBaseUrl + 'GetVistexLogsInfo';
        return this.httpClient.post<VistexLogFiltersResponse>(apiUrl, postData);
    }
    public getVistexFilterData(request: VistexLogFiltersRequest): Observable<string[]> {
        const apiUrl = this.apiBaseUrl + 'GetVistexFilterData';

        //let params = new HttpParams();
        //params = params.set('Dealmode', request.Dealmode);
        //params = params.set('StartDate', request.StartDate);
        //params = params.set('EndDate', request.EndDate);
        //params = params.set('DealId', request.DealId);
        //params = params.set('FilterName', request.FilterName);

        return this.httpClient.post<string[]>(apiUrl, request);
    }
    public getVistexStatuses(): Observable<string[]> {
        const apiUrl = this.apiBaseUrl + 'GetVistexStatuses'
        return this.httpClient.get<string[]>(apiUrl);
    }

    public updateVistexStatusNew(postData: VistexResponseUpdData): Observable<string> {
        let apiUrl: string;
        if (postData.archived) {
            apiUrl = this.apiBaseUrl + 'MoveArchivedToLog';
        } else {
            apiUrl = this.apiBaseUrl + 'UpdateVistexStatusNew';
        }
        return this.httpClient.post<string>(apiUrl, postData);
    }

    public getRequestTypeList(): Observable<RequestDetails[]> {
        const apiUrl = this.apiBaseUrl + 'GetRequestTypeList';
        return this.httpClient.get<RequestDetails[]>(apiUrl);
    }

    public callProfiseeApi(custNm: string, actv_ind: string): Observable<boolean> {
        const apiUrl = this.vistexApiBase + 'CallProfiseeApi/' + custNm + "/" + actv_ind;
        return this.httpClient.get<boolean>(apiUrl);
    }
}
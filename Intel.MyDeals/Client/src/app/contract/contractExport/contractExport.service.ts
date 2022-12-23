import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class contractExportService { 
    public apiExportContractUrl ='/api/Contracts/v1/getExportContract/';
    public timeLineApiUrl = "api/Timeline/";
    public apiBaseUrl= '/api/Contracts/v1/';


    constructor(private httpClient: HttpClient) {
      }

      public getExportContractData(cId):Observable<any> {
        const apiUrl: string = this.apiExportContractUrl + cId;
        return this.httpClient.get(apiUrl);
    }
    public GetObjTimelineDetails(contractDetailId,objTypeSId, objTypeIds): Observable<any> {
        const rbody = { 'objSid': contractDetailId, "objTypeSid": objTypeSId,  "objTypeIds": objTypeIds };
        const apiTimeLineUrl: string = this.timeLineApiUrl + "GetObjTimelineDetails";
        return this.httpClient.post(apiTimeLineUrl, rbody);
    }
    public exportAsPDF(body):Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'HtmlToPdf';
        return this.httpClient.post(apiUrl,body, { responseType: 'arraybuffer'});
    }
    

}

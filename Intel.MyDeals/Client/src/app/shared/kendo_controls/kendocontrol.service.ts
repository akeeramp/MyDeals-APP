
import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class kendoControlService { 
    public apiBaseUrl: string = "api/QuoteLetter/";

    constructor(private httpClient: HttpClient) {
      }


    public downloadFile():Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'GetDealQuoteLetterPreview';
        let data = {"BODY_INFO":"BODY_INFO",
        "HDR_INFO":"HDR_INFO",
        "MenuText":"ECAP-FRONTEND",
        "OBJ_SET_TYPE_CD":"ECAP",
        "PROGRAM_PAYMENT":"FRONTEND",
        "TMPLT_SID":1}
        return this.httpClient.post(apiUrl,data,{responseType:'blob', observe:"response"});
    }

}


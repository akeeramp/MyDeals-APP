
import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class kendoControlService { 
    public apiBaseUrl = "api/QuoteLetter/";

    constructor(private httpClient: HttpClient) {
      }


    public downloadFile():Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'GetDealQuoteLetterPreview';
        const data = {"BODY_INFO":"BODY_INFO",
        "HDR_INFO":"HDR_INFO",
        "MenuText":"ECAP-FRONTEND",
        "OBJ_SET_TYPE_CD":"ECAP",
        "PROGRAM_PAYMENT":"FRONTEND",
        "TMPLT_SID":1}
        return this.httpClient.post(apiUrl,data,{responseType:'blob', observe:"response"});
    }

}


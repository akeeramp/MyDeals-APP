import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class contractHistoryService { 
    public apiTimeLineUrl ='api/Timeline/';

    constructor(private httpClient: HttpClient) {
      }

      public getTimelineDetails(contractDetailId,objTypeIds,objTypeSId):Observable<any> {
        const rbody = { 'objSid': contractDetailId, "objTypeSid": objTypeSId,  "objTypeIds": objTypeIds};
        const apiUrl: string = this.apiTimeLineUrl + 'GetObjTimelineDetails';
        return this.httpClient.post(apiUrl, rbody);
    }
    

}


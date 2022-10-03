import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class meetCompContractService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "api/MeetComp/";

    public getMeetCompProductDetails(objSid,mcMode,objTypeId) {
        const apiUrl = this.apiBaseContractUrl + "GetMeetCompProductDetails/" + objSid + "/" + mcMode + "/" + objTypeId;
        return this.httpClient.get(apiUrl);
    }

    public updateMeetCompProductDetails(objSid,objTypeId,postData){
        const apiUrl = this.apiBaseContractUrl + "UpdateMeetCompProductDetails/" + objSid + "/" + objTypeId;
        return this.httpClient.post(apiUrl,postData);
    }

    public getDealDetails(dealObjSid,grpPrdSid,dealPrdType){
        const apiUrl = this.apiBaseContractUrl + "GetDealDetails/" + dealObjSid + "/" + grpPrdSid + "/" + dealPrdType;
        return this.httpClient.post(apiUrl,"");
    }
    public getContractIDDetails(id:any) {
        return this.httpClient.get("api/Search/GotoDeal/" + id);
    }

}
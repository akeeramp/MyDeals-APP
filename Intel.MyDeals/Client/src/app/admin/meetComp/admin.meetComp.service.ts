import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class meetCompService {
    constructor(private httpClient: HttpClient) {

    }
    public apiBaseUrl = "api/MeetComp/";
    public dropdownUrl = "api/Customers/";
    /*Open Bulk Upload Meet Comp Modal is yet to be implemented.*/
    public uploadMeetComp(lstMeetComps): Observable<any> { 
       const apiUrl = this.apiBaseUrl + 'UploadMeetComp';
       return this.httpClient.post(apiUrl, lstMeetComps);
    }
    public getCustomerDropdowns(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }
    public validateMeetComps(lstMeetComps): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'ValidateMeetComps';
        return this.httpClient.post(apiUrl, lstMeetComps);
    }
    public getMeetCompData(data): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'GetMeetCompData';
        return this.httpClient.post(apiUrl, data);
    }
    public getMeetCompDIMData(cid, mode): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'GetMeetCompDIMData' + "/" + cid + "/" + mode;
        return this.httpClient.get(apiUrl);
    }
    public activateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'ActivateDeactivateMeetComp/' + MEET_COMP_SID + "/" + ACTV_IND;
        return this.httpClient.post(apiUrl, MEET_COMP_SID, ACTV_IND);
    }
}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class TenderFolioService {

    public dropdownUrl = "api/Customers/";
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBaseCustomerCalenderUrl = "api/CustomerCalendar/";

    constructor(private httpClient: HttpClient) { }

    public getCustomerDropdowns(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }
    public getCustDivBySID(custSID): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerDivsByCustNmSid/' + custSID;
        return this.httpClient.get(apiUrl)
    }
    public isDuplicateContractTitle(dcId, title): Observable<any> {
        return this.httpClient.post(this.apiBaseContractUrl + 'IsDuplicateContractTitle/' + dcId, [title]);
    }
    public getCustomerCalendar(custMbrSid, dayInQuarter, quater, year) {
        const dto = { 'CustomerMemberSid': custMbrSid, "DayInQuarter": dayInQuarter, "QuarterNo": quater, "Year": year };
        const apiUrl: string = this.apiBaseCustomerCalenderUrl + 'GetCustomerQuarterDetails';
        return this.httpClient.post(apiUrl, dto);
    }

    public createTenderContract(custId, contractId, upperContractData): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'SaveTenderContract/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, upperContractData);
    }
    public copyTenderFolioContract(ct, dealIds) {
        ct[0].dealIds = dealIds;
        const apiUrl: string = this.apiBaseContractUrl + 'CopyTenderFolioContract';
        return this.httpClient.post(apiUrl, ct);
    }
}
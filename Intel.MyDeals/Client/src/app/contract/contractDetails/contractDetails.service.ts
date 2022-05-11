import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class contractDetailsService {
    public apiBaseUrl = "api/Customers/";
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBaseCustomerCalenderUrl = "api/CustomerCalendar/";
    public dropDownApiUrl = "/api/Dropdown/";

    constructor(private httpClient: HttpClient) { }

    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    public GetMyCustomerNames(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + "GetMyCustomerNames";
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomerDivsByCustNmSid(custId): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + "GetMyCustomerDivsByCustNmSid/" + custId;
        return this.httpClient.get(apiUrl);
    }

    public isDuplicateContractTitle(dcId, title) {
        const apiUrl: string = this.apiBaseContractUrl + 'IsDuplicateContractTitle/' + dcId;
        return this.httpClient.post(apiUrl, [title]);
    }

    public createContract(custId, contractId, contracts): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'SaveContract/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [contracts]);
    }

    getCustomerCalendar(custMbrSid, dayInQuarter, quater, year) {
        const dto = { 'CustomerMemberSid': custMbrSid, "DayInQuarter": dayInQuarter, "QuarterNo": quater, "Year": year };
        const apiUrl: string = this.apiBaseCustomerCalenderUrl + 'GetCustomerQuarterDetails';
        return this.httpClient.post(apiUrl, dto);
    }

    getVendorDropDown(atrbcd) {
        const apiUrl: string = this.dropDownApiUrl + 'GetDropdowns/' + atrbcd;
        return this.httpClient.get(apiUrl);
    }

    readCopyContract(id) {
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    copyContract(custId, contractId, srcContractId, ct) {
        const apiUrl : string = this.apiBaseContractUrl + 'CopyContract/' + custId + '/' + contractId + '/' + srcContractId;
        return this.httpClient.post(apiUrl, [ct]);
    }

}
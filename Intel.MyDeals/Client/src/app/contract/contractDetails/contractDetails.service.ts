import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

import { SecurityService } from "../../shared/services/security.service"

@Injectable({
    providedIn: 'root'
})
export class ContractDetailsService {

    private readonly API_URL_CUSTOMERS = "api/Customers/";
    private readonly API_URL_CONTRACTS = "/api/Contracts/v1/";
    private readonly API_URL_CUSTOMER_CALENDAR = "api/CustomerCalendar/";
    private readonly API_URL_DROPDOWN = "/api/Dropdown/";
    private readonly API_URL_TIMELINE = "api/Timeline/";
    private readonly API_URL_FILE_ATTACHMENTS = "/api/FileAttachments/";

    constructor(private httpClient: HttpClient,
                private securityService: SecurityService) { }

    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.API_URL_CONTRACTS + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomerNames(): Observable<any> {
        const apiUrl: string = this.API_URL_CUSTOMERS + "GetMyCustomerNames";
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomerDivsByCustNmSid(custId): Observable<any> {
        const apiUrl: string = this.API_URL_CUSTOMERS + "GetMyCustomerDivsByCustNmSid/" + custId;
        return this.httpClient.get(apiUrl);
    }

    public isDuplicateContractTitle(dcId, title) {
        const apiUrl: string = this.API_URL_CONTRACTS + 'IsDuplicateContractTitle/' + dcId;
        return this.httpClient.post(apiUrl, [title]);
    }

    public createContract(custId, contractId, contracts): Observable<any> {
        const apiUrl: string = this.API_URL_CONTRACTS + 'SaveContract/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [contracts]);
    }

    getCustomerCalendar(custMbrSid, dayInQuarter, quater, year) {
        const dto = { 'CustomerMemberSid': custMbrSid, "DayInQuarter": dayInQuarter, "QuarterNo": quater, "Year": year };
        const apiUrl: string = this.API_URL_CUSTOMER_CALENDAR + 'GetCustomerQuarterDetails';
        return this.httpClient.post(apiUrl, dto);
    }

    getVendorDropdown(atrbCd) {
        const apiUrl: string = this.API_URL_DROPDOWN + 'GetDropdowns/' + atrbCd;
        return this.httpClient.get(apiUrl);
    }

    getDropdownsWithCustomerId(atrbCd: string, custId: string | number) {
        const apiUrl = `${ this.API_URL_DROPDOWN }GetDropdownsWithCustomerId/${ atrbCd }/${ custId }`;
        return this.httpClient.get(apiUrl);
    }

    getDropdownOnlyAllCustomers(atrbCd: string) {
        const apiUrl = `${ this.API_URL_DROPDOWN }GetDropdownOnlyAllCustomers/${ atrbCd }`;
        return this.httpClient.get(apiUrl);
    }

    readCopyContract(id) {
        const apiUrl: string = this.API_URL_CONTRACTS + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    copyContract(custId, contractId, srcContractId, ct) {
        const apiUrl: string = this.API_URL_CONTRACTS + 'CopyContract/' + custId + '/' + contractId + '/' + srcContractId;
        return this.httpClient.post(apiUrl, [ct]);
    }

    public getObjTimelineDetails(contractDetailId, objTypeIds, objTypeSId): Observable<any> {
        const rbody = { 'objSid': contractDetailId, "objTypeIds": objTypeIds, "objTypeSid": objTypeSId };
        const apiTimeLineUrl: string = this.API_URL_TIMELINE + "GetObjTimelineDetails";
        return this.httpClient.post(apiTimeLineUrl, rbody);
    }

    deleteContract(custId, contractId) {
        const apiDeleteContractUrl = this.API_URL_CONTRACTS + 'DeleteContract/' + custId + '/' + contractId;
        return this.httpClient.get(apiDeleteContractUrl);
    }

    getFileAttachments(custId, ctrctId) {
        const url = this.API_URL_FILE_ATTACHMENTS + "Get/" + custId + "/1/" + ctrctId + "/CNTRCT";
        return this.httpClient.get(url);
    }

    deleteAttachment(custId, objTypeSid, objSid, fileSid) {
        const url = this.API_URL_FILE_ATTACHMENTS + "Delete/" + custId + "/" + objTypeSid + "/" + objSid + "/" + fileSid + "/CNTRCT";
        return this.httpClient.post(url, objTypeSid);
    }

    checkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }

}
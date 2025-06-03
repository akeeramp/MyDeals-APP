import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Countires, EndCustomer, PrimeCust_Map, RplStatusCode, UnPrimeAtrbs, UnPrimeDeals, UnifiedDealsSummary, UnifyDeal } from "../PrimeCustomers/admin.primeCustomers.model";
import { DynamicObj } from "../employee/admin.employee.model";
import { DealRecon, DealReconInvalidRecords, END_CUST_OBJ, ReprocessUCD_OBJ } from "./admin.unifiedDealRecon.model";

@Injectable({
    providedIn: 'root'
})
export class unifiedDealReconService {
    public readonly apiBaseUrl = "api/PrimeCustomers/";
    public readonly apiUnifyFileUrl = "/FileAttachments/";

    constructor(private httpClient: HttpClient) {

    }

    public GetPrimeCustomerDetails(): Observable<PrimeCust_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomerDetails';
        return this.httpClient.get<PrimeCust_Map[]>(apiUrl);
    }

    public UpdatePrimeCustomer(data: PrimeCust_Map): Observable<PrimeCust_Map> {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePrimeCustomer';
        return this.httpClient.post<PrimeCust_Map>(apiUrl, data);
    }

    public SetPrimeCustomers(data: PrimeCust_Map): Observable<PrimeCust_Map> {
        const apiUrl: string = this.apiBaseUrl + 'SetPrimeCustomers';
        return this.httpClient.post<PrimeCust_Map>(apiUrl, data);
    }

    public DeletePrimeCustomer(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeletePrimeCustomer';
        return this.httpClient.post(apiUrl, data);
    }

    public getCountries(): Observable<Countires[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetCountries';
        return this.httpClient.get<Countires[]>(apiUrl);
    }

    public getPrimeCustomers(): Observable<DynamicObj[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomers';
        return this.httpClient.get<DynamicObj[]>(apiUrl);
    }

    public getUnmappedPrimeCustomerDeals(): Observable<UnPrimeDeals[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetUnPrimeDeals';
        return this.httpClient.get<UnPrimeDeals[]>(apiUrl);
    }

    public getUnmappedPrimeCustomerDealsByFilter(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetUnPrimeDealsByFilter';
        return this.httpClient.post(apiUrl, data);
    }

    public getFilterValue(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetUnPrimeDealsFilterValue';
        return this.httpClient.post(apiUrl, data);
    }

    public UpdateUnPrimeDeals(dealId: number, endCustData: UnPrimeAtrbs): Observable<boolean> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateUnPrimeDeals/' + dealId;
        return this.httpClient.post<boolean>(apiUrl, Object.assign({}, endCustData));
    }
    public getEndCustomerData(endCustomerData): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetEndCustomerData';
        return this.httpClient.get(apiUrl, endCustomerData);
    }

    public validateEndCustomer(endCustomerData: string): Observable<EndCustomer[]> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateEndCustomer';
        return this.httpClient.post<EndCustomer[]>(apiUrl, endCustomerData);
    }

    public ValidateUnifyDeals(lstUnifyDeals: UnifyDeal[]): Observable<any> {
        const apiUrl: string = this.apiUnifyFileUrl + 'ValidateBulkUnifyDeals';
        return this.httpClient.post(apiUrl, lstUnifyDeals);
    }

    public updateBulkUnifyDeals(lstUnifyDeals: UnifyDeal[]): Observable<UnifiedDealsSummary[]> {
        const apiUrl: string = this.apiBaseUrl + 'UploadBulkUnifyDeals';
        return this.httpClient.post<UnifiedDealsSummary[]>(apiUrl, lstUnifyDeals);
    }

    public UnPrimeDealsLogs(dealId: string, endCustData: string): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'UnPrimeDealsLogs/' + dealId;
        return this.httpClient.post<string>(apiUrl, endCustData);
    }

    public getRplStatusCodes(): Observable<RplStatusCode[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetRplStatusCodes';
        return this.httpClient.get<RplStatusCode[]>(apiUrl);
    }
    public ValidateDealReconRecords(lstDealRecon: DealRecon[]): Observable<any> {
        const apiUrl: string = this.apiUnifyFileUrl + 'ValidateDealReconRecords';
        return this.httpClient.post(apiUrl, lstDealRecon);

    }
    public updateDealRecon(lstDealRecon: DealRecon[]): Observable<DealReconInvalidRecords[]> {
        const apiUrl: string = this.apiBaseUrl + 'updateDealRecon';
        return this.httpClient.post<DealReconInvalidRecords[]>(apiUrl, lstDealRecon);

    }
    public ResubmissionDeals(dealId: string, endCustomerData: END_CUST_OBJ): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'ResubmissionDeals/' + dealId;
        const headers = { 'content-type': 'application/json' };
        return this.httpClient.post<string>(apiUrl, JSON.stringify(endCustomerData), { 'headers': headers });
    }

    public ReprocessUCD(objReprocessUCD_OBJ: ReprocessUCD_OBJ): Observable<string> {
        const apiUrl: string = this.apiBaseUrl + 'ReprocessUCD';
        const headers = { 'content-type': 'application/json' };
        return this.httpClient.post<string>(apiUrl, JSON.stringify(objReprocessUCD_OBJ), { 'headers': headers });
    }

}
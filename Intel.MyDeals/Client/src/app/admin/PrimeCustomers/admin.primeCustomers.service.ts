import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Countires, EndCustomer, PrimeCust_Map, PrimeCustomerDetails, RplStatusCode, UnPrimeAtrbs, UnPrimeDeals, UnifiedDealsSummary, UnifyDeal } from "./admin.primeCustomers.model";
import { DynamicObj } from "../employee/admin.employee.model";

@Injectable({
    providedIn: 'root'
})

export class primeCustomerService {
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

    public DeletePrimeCustomer(data: any): Observable<any> {
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

    public getEndCustomerData(endCustomerData: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetEndCustomerData';
        return this.httpClient.get<any>(apiUrl, endCustomerData);
    }

    public UpdateUnPrimeDeals(dealId: number, endCustData: UnPrimeAtrbs): Observable<boolean> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateUnPrimeDeals/' + dealId;
        return this.httpClient.post<boolean>(apiUrl, endCustData);
    }

    public validateEndCustomer(endCustomerData: string): Observable<EndCustomer[]> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateEndCustomer';
        return this.httpClient.post<EndCustomer[]>(apiUrl, endCustomerData);
    }

    public ValidateUnifyDeals(lstUnifyDeals: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateBulkUnifyDeals';
        return this.httpClient.post<any>(apiUrl, lstUnifyDeals);
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

}

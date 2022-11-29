import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})
export class unifiedDealReconService {
    public apiBaseUrl = "api/PrimeCustomers/";

    constructor(private httpClient: HttpClient) {

    }

    public GetPrimeCustomerDetails(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomerDetails';
        return this.httpClient.get(apiUrl);
    }

    public UpdatePrimeCustomer(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePrimeCustomer';
        return this.httpClient.post(apiUrl, data);
    }

    public SetPrimeCustomers(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SetPrimeCustomers';
        return this.httpClient.post(apiUrl, data);
    }

    public DeletePrimeCustomer(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeletePrimeCustomer';
        return this.httpClient.post(apiUrl, data);
    }

    public getCountries(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCountries';
        return this.httpClient.get(apiUrl);
    }

    public getPrimeCustomers(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomers';
        return this.httpClient.get(apiUrl);
    }

    public getUnmappedPrimeCustomerDeals(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetUnPrimeDeals';
        return this.httpClient.get(apiUrl);
    }

    public UpdateUnPrimeDeals(dealId, endCustData) {
        const apiUrl: string = this.apiBaseUrl + 'UpdateUnPrimeDeals/' + dealId;
        return this.httpClient.post(apiUrl, Object.assign({}, endCustData));
    }
    public getEndCustomerData(endCustomerData): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetEndCustomerData';
        return this.httpClient.get(apiUrl, endCustomerData);
    }

    public validateEndCustomer(endCustomerData): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateEndCustomer';
        return this.httpClient.post(apiUrl, endCustomerData);
    }

    public ValidateUnifyDeals(lstUnifyDeals): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateBulkUnifyDeals';
        return this.httpClient.post(apiUrl, lstUnifyDeals);
    }

    public updateBulkUnifyDeals(lstUnifyDeals): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UploadBulkUnifyDeals';
        return this.httpClient.post(apiUrl, lstUnifyDeals);
    }

    public UnPrimeDealsLogs(dealId, endCustData): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UnPrimeDealsLogs/' + dealId;
        return this.httpClient.post(apiUrl, endCustData);
    }

    public getRplStatusCodes(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetRplStatusCodes';
        return this.httpClient.get(apiUrl);
    }

}

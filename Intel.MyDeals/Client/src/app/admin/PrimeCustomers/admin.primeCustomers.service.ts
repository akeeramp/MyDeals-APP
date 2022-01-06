import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class primeCustomerService {
    public apiBaseUrl: string = "api/PrimeCustomers/";
    public apiUnifyFileUrl = "/FileAttachments/";

    constructor(private httpClient: HttpClient) {

    }

    public GetPrimeCustomerDetails(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomerDetails';
        return this.httpClient.get(apiUrl);
    }

    public UpdatePrimeCustomer(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdatePrimeCustomer';
        return this.httpClient.post(apiUrl, data);
    }

    public SetPrimeCustomers(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SetPrimeCustomers';
        return this.httpClient.post(apiUrl, data);
    }

    public DeletePrimeCustomer(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DeletePrimeCustomer';
        return this.httpClient.post(apiUrl, data);
    }

    public getCountries(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCountries';
        return this.httpClient.get(apiUrl);
    }

    public getPrimeCustomers(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetPrimeCustomers';
        return this.httpClient.get(apiUrl);
    }

    public getUnmappedPrimeCustomerDeals(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetUnPrimeDeals';
        return this.httpClient.get(apiUrl);
    }

    public getEndCustomerData(endCustomerData): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetEndCustomerData';
        return this.httpClient.get(apiUrl, endCustomerData);
    }

    public UpdateUnPrimeDeals(dealId, endCustData): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateUnPrimeDeals/' + dealId;
        return this.httpClient.post(apiUrl, endCustData);
    }

    public validateEndCustomer(endCustomerData): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'ValidateEndCustomer';
        return this.httpClient.post(apiUrl, endCustomerData);
    }

    public ValidateUnifyDeals(lstUnifyDeals): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'ValidateBulkUnifyDeals';
        return this.httpClient.post(apiUrl, lstUnifyDeals);
    }

    public updateBulkUnifyDeals(lstUnifyDeals): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UploadBulkUnifyDeals';
        return this.httpClient.post(apiUrl, lstUnifyDeals);
    }

    public UnPrimeDealsLogs(dealId, endCustData): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UnPrimeDealsLogs/' + dealId;
        return this.httpClient.post(apiUrl, endCustData);
    }

    public getRplStatusCodes(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetRplStatusCodes';
        return this.httpClient.get(apiUrl);
    }

}

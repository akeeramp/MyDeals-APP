import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class consumptionCountryService {
    public apiBaseUrl: string = "api/ConsumptionCountry/";
    public ctryNmDropdownUrl: string = "api/PrimeCustomers/";
    public dropdownUrl: string = "api/Dropdown/";

    constructor(private httpClient: HttpClient) {

    }
    public getConsumptionCountry(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetConsumptionCountry/false';
        return this.httpClient.get(apiUrl);
    }
    public getCountryList(): Observable<any> {
        let apiUrl: string = this.ctryNmDropdownUrl + 'GetCountries';
        return this.httpClient.get(apiUrl);
    }

    public getDropdown(): Observable<any> {
        let apiUrl: string = this.dropdownUrl + 'GetGeosDropdowns';
        return this.httpClient.get(apiUrl);
    }

    public updateConsumptionCountry(dropdown): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateConsumptionCountry';
        return this.httpClient.put(apiUrl, dropdown);
    }
    public insertConsumptionCountry(dropdown): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'InsertConsumptionCountry';
        return this.httpClient.post(apiUrl, dropdown);
    }

}

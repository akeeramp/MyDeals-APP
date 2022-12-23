import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class consumptionCountryService {
    public apiBaseUrl = "api/ConsumptionCountry/";
    public ctryNmDropdownUrl = "api/PrimeCustomers/";
    public dropdownUrl = "api/Dropdown/";

    constructor(private httpClient: HttpClient) {

    }
    public getConsumptionCountry(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetConsumptionCountry/false';
        return this.httpClient.get(apiUrl);
    }
    public getCountryList(): Observable<any> {
        const apiUrl: string = this.ctryNmDropdownUrl + 'GetCountries';
        return this.httpClient.get(apiUrl);
    }

    public getDropdown(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetGeosDropdowns';
        return this.httpClient.get(apiUrl);
    }

    public updateConsumptionCountry(dropdown): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateConsumptionCountry';
        return this.httpClient.put(apiUrl, dropdown);
    }
    public insertConsumptionCountry(dropdown): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'InsertConsumptionCountry';
        return this.httpClient.post(apiUrl, dropdown);
    }

}

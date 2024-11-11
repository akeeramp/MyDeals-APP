import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class InActiveCustomerService {
    public dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public data$: Observable<any> = this.dataSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";

    private readonly apiBasePricingTableUrl = "/api/PricingTables/v1/";

    setData(value) {
        this.dataSubject.next(value);
    }


    public readInActiveCustContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetInActCustUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    public readInActivePricingTable(id): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'GetFullNestedDealDetails/' + id;
        return this.httpClient.get(apiUrl);
    }
}
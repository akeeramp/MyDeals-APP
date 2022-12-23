import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class pricingTableservice {
    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";

    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

}

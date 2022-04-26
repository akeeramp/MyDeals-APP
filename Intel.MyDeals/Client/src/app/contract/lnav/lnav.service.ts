import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class lnavService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl: string = "/api/Contracts/v1/";
    public apiBasePricingStrategyUrl: string = "/api/PricingStrategies/v1/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";

    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        let apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    // #### PRICING STRATEGY CRUD ####  
    public createPricingStrategy(custId, contractId, ps) {
        let apiUrl: string = this.apiBasePricingStrategyUrl + 'SavePricingStrategy/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [ps]);

    }

    // #### PRICING TABLE CRUD ####
    createPricingTable(custId, contractId, pt) {
        let apiUrl: string = this.apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [pt]);
    }

}



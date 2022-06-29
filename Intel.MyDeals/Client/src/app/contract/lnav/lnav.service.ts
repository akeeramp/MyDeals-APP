import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { SecurityService } from "../../shared/services/security.service"
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class lnavService {
    constructor(private httpClient: HttpClient, private securityService: SecurityService) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";
    public isLnavHidden = new BehaviorSubject({isLnavHid:false,source:'PT'});

    // #### PRICING STRATEGY CRUD ####  
    public createPricingStrategy(custId, contractId, ps) {
        const apiUrl: string = this.apiBasePricingStrategyUrl + 'SavePricingStrategy/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [ps]);

    }

    // #### PRICING TABLE CRUD ####
    public createPricingTable(custId, contractId, pt) {
        const apiUrl: string = this.apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [pt]);
    }

    public chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }
}



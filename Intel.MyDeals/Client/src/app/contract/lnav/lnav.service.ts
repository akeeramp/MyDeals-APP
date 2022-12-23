import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
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
    public isLnavHidden = new BehaviorSubject({ isLnavHid: false, source: 'PT' });
    public autoFillData = new BehaviorSubject({});
    public lnavHieight = new BehaviorSubject({ Model: 'PTE', C_ID: 0, ps_id: 0, pt_id: 0, contractData: {} });

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

    // #### DELETE PRICING STRATEGY/TABLE ####
    public deletePricingStrategy(custId, contractId, ps) {
        const apiUrl: string = this.apiBasePricingStrategyUrl + 'DeletePricingStrategy/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [ps]);
    }

    public deletePricingTable(custId, contractId, pt) {
        const apiUrl: string = this.apiBasePricingTableUrl + 'DeletePricingTable/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [pt]);
    }

    // #### COPY PRICING STRATEGY/TABLE  ####
    public copyPricingStrategy(custId, contractId, srcId, ps) {
        const apiUrl: string = this.apiBasePricingStrategyUrl + 'CopyPricingStrategy/' + custId + '/' + contractId + '/' + srcId;
        return this.httpClient.post(apiUrl, [ps]);
    }

    public copyPricingTable(custId, contractId, srcId, pt) {
        const apiUrl: string = this.apiBasePricingTableUrl + 'CopyPricingTable/' + custId + '/' + contractId + '/' + srcId;
        return this.httpClient.post(apiUrl, [pt]);

    }
}

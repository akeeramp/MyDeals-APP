import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { SecurityService } from "../../../shared/services/security.service";

@Injectable({
    providedIn: 'root'
})

export class dealToolsService {
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";

    constructor(private httpClient: HttpClient, private securityService: SecurityService) { }

    public chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }
    public readContract(id): Observable<any>  {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public copyPricingStrategy(custId, contractId, srcId, ps): Observable<any> {
        return this.httpClient.post(this.apiBasePricingStrategyUrl + 'CopyPricingStrategy/' + custId + '/' + contractId + '/' + srcId, [ps]);
    }
    public actionWipDeals(custId, contractId, data): Observable<any> {
        return this.httpClient.post(this.apiBasePricingTableUrl + 'actionWipDeals/' + custId + '/' + contractId, data);
    }
    public unGroupPricingTableRow(custId, contractId, ptrId) {
        const apiUrl: string = this.apiBasePricingTableUrl + 'UnGroupPricingTableRow/' + custId + '/' + contractId + '/' + ptrId
        return this.httpClient.get(apiUrl);
    }
}
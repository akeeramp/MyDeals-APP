import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { SecurityService } from "../../../shared/services/security.service";

@Injectable({
    providedIn: 'root'
})

export class dealToolsService {
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";

    constructor(private httpClient: HttpClient, private securityService: SecurityService) { }

    public chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }
    public actionWipDeal(custId, contractId, wip, actn): Observable<any> {
        return this.httpClient.post(this.apiBasePricingTableUrl + 'actionWipDeal/' + custId + '/' + contractId + '/' + actn, [wip]);
    }
    public unGroupPricingTableRow(custId, contractId, ptrId): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'UnGroupPricingTableRow/' + custId + '/' + contractId + '/' + ptrId
        return this.httpClient.get(apiUrl);
    }
    public deletePricingTableRow(custId, contractId, ptrId): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'DeletePricingTableRow/' + custId + '/' + contractId + '/' + ptrId
        return this.httpClient.get(apiUrl);
    }
    public rollbackPricingTableRow(custId, contractId, dcId): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'RollBackPricingTableRow/' + custId + '/' + contractId + '/' + dcId
        return this.httpClient.get(apiUrl);
    }
    public actionWipDeals(custId, contractId, data): Observable<any> {
        return this.httpClient.post(this.apiBasePricingTableUrl + 'actionWipDeals/' + custId + '/' + contractId, data);
    }
    public getTimlelineDs(dataObj): Observable<any> {
        return this.httpClient.post("api/Timeline/GetObjTimelineDetails", dataObj);
    }
}
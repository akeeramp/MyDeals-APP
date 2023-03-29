import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MomentService } from "../../shared/moment/moment.service";

@Injectable({
    providedIn: 'root'
})
export class tenderDashboardService {
    constructor(private httpClient: HttpClient, private momentService: MomentService) { }
    public apiBaseUrl = "/api/Search/GetTenderDashboardList/";
    private apiBaseTenderUrl = "/api/Tenders/v1/";
    private apiBaseCostTestUrl = "/api/CostTest/v1/";
    public getCustomerDetails(startDate, endDate, customerName): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + startDate + '/' + endDate + '/' + customerName+'?$top=999';
        return this.httpClient.get(apiUrl);
    }

    public searchTender(st, en, searchUrl) {
        const apiUrl: string = this.apiBaseUrl + this.momentService.moment(st).format("MM-DD-YYYY") + "/" + this.momentService.moment(en).format("MM-DD-YYYY") + "/" + searchUrl.replace(/\./g, '&per;');
        return this.httpClient.get(apiUrl);
    }

    public bulkTenderUpdate(data) {
        const apiUrl: string = this.apiBaseTenderUrl + "BulkTenderUpdate";
        return this.httpClient.post(apiUrl, data);
    }

    public getTendersByIds(ids) {
        const apiUrl: string = this.apiBaseTenderUrl + "GetTendersByIds/" + ids;
        return this.httpClient.get(apiUrl);
    }
    public actionTenderDeals(tenders, actn) {
        const apiUrl: string = this.apiBaseTenderUrl + "ActionTenders/" + actn;
        return this.httpClient.post(apiUrl, tenders);
    }
    public runBulkPctPricingStrategy(psIDS) {
        const apiUrl: string = this.apiBaseCostTestUrl + "RunBulkPctPricingStrategy";
        return this.httpClient.post(apiUrl, psIDS);
    }
}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";

@Injectable({
    providedIn: 'root'
})

export class managerExcludeGroupsService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiLookupUrl = "/api/Dropdown/GetDealGroupDropdown/";
    public loading: boolean;

    public readWipExclusionFromContract(id): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'GetWipExclusionFromContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public getExcludeGroupDetails(dealId): Observable<any> {
        const apiUrl: string = this.apiLookupUrl + dealId;
        return this.httpClient.get(apiUrl);
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ComplexStackingModalService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";

    public getComplexStackingGroup(ovlpObjs): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'getComplexStackingGroup';
        return this.httpClient.post(apiUrl, ovlpObjs);
    }

    public updateComplexStackingDealGroup(ovlpObjs): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'updateComplexStackingDealGroup';
        return this.httpClient.post(apiUrl, ovlpObjs);
    }
}
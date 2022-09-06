import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})
export class publishTenderService {

   constructor(private httpClient: HttpClient) { }
    private apiBaseContractUrl = "/api/Contracts/v1/";

   public publishTenderDeals(contractId:number, excludeList:any) {
        const apiUrl: string = this.apiBaseContractUrl + 'PublishTenderContract/' + contractId;
        return this.httpClient.post(apiUrl, excludeList);
    }
}
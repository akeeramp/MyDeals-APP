import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class pricingTableEditorService {

    constructor(private httpClient: HttpClient) { }
    public autoFillData = new BehaviorSubject({});
    private apiBasePricingTableUrl = "/api/PricingTables/v1/";
    private apiBaseContractUrl = "/api/Contracts/v1/";

    
    public readPricingTable(id): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id;
        return this.httpClient.get(apiUrl);
    }
    public readDropdownEndpoint(lookupUrl: string) {
        if (lookupUrl.toLowerCase().includes('api/Dropdown'.toLowerCase())) {
            const apiUrl: string = lookupUrl;
            return this.httpClient.get(apiUrl);    
        }
    }
    public getDropDownResult(lookupUrl: string){
        return this.httpClient.get(lookupUrl);    
    }
    public updateContractAndCurPricingTable(custId:number, contractId:number, data:any, forceValidation:boolean, forcePublish:boolean, delPtr:boolean){
        if (forceValidation && forcePublish) {
            return this.httpClient.post(this.apiBaseContractUrl + "SaveAndValidateAndPublishContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        } 
    }
}
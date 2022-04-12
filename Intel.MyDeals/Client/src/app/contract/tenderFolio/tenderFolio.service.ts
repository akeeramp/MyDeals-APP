import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class TenderFolioService {
    
    public dropdownUrl ="api/Customers/";

    constructor(private httpClient: HttpClient) {}

    public getCustomerDropdowns():Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }

    public getCustDivBySID(custSID): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerDivsByCustNmSid/' + custSID;
        return this.httpClient.get(apiUrl)
    }
}
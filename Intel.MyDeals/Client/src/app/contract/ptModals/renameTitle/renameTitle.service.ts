import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class renameTitleService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseContractUrl = "/api/Contracts/v1/";

    public updateAtrbValue(custId, contractId, data): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'UpdateAtrbValue/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, data);
    }
}
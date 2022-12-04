import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class SecurityEngineService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = '/api/SecurityAttributes/';

    public getSecurityDropdownData() {
        const apiUrl: string = this.apiBaseUrl + 'GetSecurityDropdownData/';
        return this.httpClient.get(apiUrl);
    }
    public getObjAtrbs() {
        const apiUrl: string = this.apiBaseUrl + 'GetObjAtrbs/';
        return this.httpClient.get(apiUrl);
    }
    public getMasks() {
        const apiUrl: string = this.apiBaseUrl + 'GetSecurityWrapper/';
        return this.httpClient.get(apiUrl);
    }
    public saveMapping(mappingList) {
        const apiUrl: string = this.apiBaseUrl + 'SaveSecurityMapping/';
        return this.httpClient.post(apiUrl, mappingList);
    }   
}

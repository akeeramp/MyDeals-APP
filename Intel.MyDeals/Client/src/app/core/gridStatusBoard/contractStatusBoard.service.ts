import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {SecurityService} from "../../shared/services/security.service"

@Injectable({
    providedIn: 'root'
})

export class ContractStatusBoardService {

    constructor(private httpClient: HttpClient,private securityService: SecurityService) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";

    public readContractStatus(id): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'GetContractStatus/' + id;
        return this.httpClient.get(apiUrl);
    }

    public chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }
}
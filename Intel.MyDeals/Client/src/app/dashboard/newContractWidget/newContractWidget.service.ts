import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {SecurityService} from "../../shared/services/security.service"
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class NewContractWidgetService {

    constructor(private httpClient: HttpClient,private securityService: SecurityService) { }

    public chkDealRules(action, role, itemType, itemSetType, stage): boolean {
        return this.securityService.chkDealRules(action, role, itemType, itemSetType, stage);
    }
}
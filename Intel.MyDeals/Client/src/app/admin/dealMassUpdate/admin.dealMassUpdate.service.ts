import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DealMassUpdateService {

    constructor(private httpClient: HttpClient) { }

    public readonly API_URL_DEAL_MASS_UPDATE = "api/DealMassUpdate/";

    public service: any = {
        UpdateDealsAttrbValue: this.UpdateDealsAttrbValue,
        GetUpdateAttributes: this.GetUpdateAttributes
    }

    public UpdateDealsAttrbValue(data): Observable<any> {
        const apiUrl: string = this.API_URL_DEAL_MASS_UPDATE + 'UpdateDealsAttrbValue';
        return this.httpClient.post(apiUrl,data);
    }

    public GetUpdateAttributes(atrbSID): Observable<any> {
        const apiUrl: string = this.API_URL_DEAL_MASS_UPDATE + 'GetUpdateAttributes/' + atrbSID;
        return this.httpClient.get(apiUrl);
    }

}
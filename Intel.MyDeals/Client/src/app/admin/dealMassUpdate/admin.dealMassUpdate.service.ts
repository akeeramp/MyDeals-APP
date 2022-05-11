import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class dealMassUpdateService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "api/DealMassUpdate/";
    public service: any = {
        UpdateDealsAttrbValue: this.UpdateDealsAttrbValue,
        GetUpdateAttributes: this.GetUpdateAttributes
    }

    public UpdateDealsAttrbValue(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateDealsAttrbValue';

        return this.httpClient.post(apiUrl,data);
    }

    public GetUpdateAttributes(atrbSID): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetUpdateAttributes/' + atrbSID;

        return this.httpClient.get(apiUrl);
    }
}
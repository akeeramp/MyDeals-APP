import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { AttributeFeildvalues, DealMassUpdateData, DealMassUpdateResults } from "./admin.dealMassUpdate.model";

interface DealMassUpdateServiceInterface {
    UpdateDealsAttrbValue: (arg: DealMassUpdateData) => Observable<DealMassUpdateResults[]>;
    GetUpdateAttributes: (arg: number) => Observable<AttributeFeildvalues[]>;
}

@Injectable({
    providedIn: 'root'
})
export class DealMassUpdateService {

    constructor(private httpClient: HttpClient) { }

    public readonly API_URL_DEAL_MASS_UPDATE = "api/DealMassUpdate/";

    public service: DealMassUpdateServiceInterface = {
        UpdateDealsAttrbValue: this.UpdateDealsAttrbValue,
        GetUpdateAttributes: this.GetUpdateAttributes
    }

    public UpdateDealsAttrbValue(data: DealMassUpdateData): Observable<DealMassUpdateResults[]> {
        const apiUrl: string = this.API_URL_DEAL_MASS_UPDATE + 'UpdateDealsAttrbValue';
        return this.httpClient.post<DealMassUpdateResults[]>(apiUrl,data);
    }

    public GetUpdateAttributes(atrbSID: number): Observable<AttributeFeildvalues[]> {
        const apiUrl: string = this.API_URL_DEAL_MASS_UPDATE + 'GetUpdateAttributes/' + atrbSID;
        return this.httpClient.get<AttributeFeildvalues[]>(apiUrl);
    }

}
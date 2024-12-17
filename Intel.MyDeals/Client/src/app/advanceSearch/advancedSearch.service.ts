import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AdvancedSearchService {

    public readonly API_URL_DEAL_LIST = "/api/Search/GetDealList/";

    constructor(private httpClient: HttpClient) { }

    public getSearchList(st, en, searchtext) {
        const apiUrl: string = this.API_URL_DEAL_LIST + st + "/" + en + "/" + searchtext;
        return this.httpClient.get(apiUrl);
    }

}
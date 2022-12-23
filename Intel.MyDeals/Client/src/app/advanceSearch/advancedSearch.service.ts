import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class advancedSearchService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = "/api/Search/GetDealList/";

    public getSearchList(st, en, searchtext) {
        const apiUrl: string = this.apiBaseUrl + st + "/" + en + "/" + searchtext;
        return this.httpClient.get(apiUrl);
    }
}
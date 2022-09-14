import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class dealEditorService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = '/api/UserPreferences/';

    public getActions(category, subCategory) {
        let apiUrl: string = this.apiBaseUrl + 'Get/' + category + '/' + subCategory;
        return this.httpClient.get(apiUrl);
    }

    public updateActions(category, subCategory, key, value) {
        var dto = {
            'value': value
        }

        const apiUrl: string = this.apiBaseUrl + 'Update/' + category + '/' + subCategory + '/' + key;
        return this.httpClient.post(apiUrl, dto);
    }

    public clearAction(category, subCategory) {
        let apiUrl: string = this.apiBaseUrl + 'Clear/' + category + '/' + subCategory;
        return this.httpClient.post(apiUrl, null);
    }
}

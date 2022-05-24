import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class userPreferencesService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = '/api/UserPreferences/';
    // Once Mydeals_migration branch moved to development branch, update API's with Actual API call under UserPreferences.controller.cs 'Get','Update'
    getActions(category, subCategory) {
        let apiUrl: string = this.apiBaseUrl + 'GetAngularUserPreferences/' + category + '/' + subCategory;
        return this.httpClient.get(apiUrl);
    }

    updateActions(category, subCategory, key, value) {
        var dto = {
            'value': JSON.stringify(value)
        }
        let apiUrl: string = this.apiBaseUrl + 'UpdateAngularUserPreferences/' + category + '/' + subCategory + '/' + key;
        return this.httpClient.post(apiUrl, dto);
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class userPreferencesService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = '/api/UserPreferences/';
    // Once Mydeals_migration branch moved to development branch, update API's with Actual API call under UserPreferences.controller.cs 'Get','Update'
    getActions(category, subCategory) {
        const apiUrl: string = this.apiBaseUrl + 'Get/' + category + '/' + subCategory;
        return this.httpClient.get(apiUrl);
    }

    updateActions(category, subCategory, key, value) {
        const dto = {
            'value': JSON.stringify(value)
        }
        const apiUrl: string = this.apiBaseUrl + 'Update/' + category + '/' + subCategory + '/' + key;
        return this.httpClient.post(apiUrl, dto);
    }
}
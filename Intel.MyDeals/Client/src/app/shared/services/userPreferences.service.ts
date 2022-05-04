import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class userPreferencesService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = '/api/UserPreferences/';

    getActions(category, subCategory) {
        let apiUrl: string = this.apiBaseUrl + 'Get/' + category + '/' + subCategory
        return this.httpClient.get(apiUrl);
    }
}
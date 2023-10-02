import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TemplatesService {

    constructor(private httpClient: HttpClient) { }

    public readonly API_URL_TEMPLATES = '/api/Templates/v1/';

    public readTemplates(): Observable<any> {
        const apiUrl: string = this.API_URL_TEMPLATES + 'GetUiTemplates' ;
        return this.httpClient.get(apiUrl);
    }

}
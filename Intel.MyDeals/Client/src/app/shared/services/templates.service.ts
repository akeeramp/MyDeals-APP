import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class templatesService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/Templates/v1/";

    public readTemplates(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + "GetUiTemplates" ;
        return this.httpClient.get(apiUrl);
    }

}
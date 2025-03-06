import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
//import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class logArchivalService {
    public readonly apiBaseUrl = "api/LogArchival/";

    constructor(private httpClient: HttpClient) { }

    public getLogArchivalDetails() {
        const apiUrl: string = this.apiBaseUrl + 'GetLogArchivalDetails';
        return this.httpClient.get(apiUrl);
    }

    public updateLogArchivalRecord(data, mode) {
        const apiUrl: string = this.apiBaseUrl + 'UpdateLogArchival/' + mode;
        return this.httpClient.post(apiUrl, data);
    }
}
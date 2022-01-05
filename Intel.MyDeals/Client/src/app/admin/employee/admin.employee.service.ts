import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class employeeService {
    public apiBaseUrl: string = "api/UserPreferences/";
    constructor(private httpClient: HttpClient) { }
    public setEmployees(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SetOpUserToken';
        return this.httpClient.post(apiUrl, data);
    }
}




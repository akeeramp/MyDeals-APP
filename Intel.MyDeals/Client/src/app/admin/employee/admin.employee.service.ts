import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { OpUserTokenParameters } from "./admin.employee.model";

@Injectable({
    providedIn: 'root'
})

export class employeeService {
    public readonly apiBaseUrl = "api/UserPreferences/";
    constructor(private httpClient: HttpClient) { }
    public setEmployees(data: OpUserTokenParameters): Observable<unknown> {
        const apiUrl: string = this.apiBaseUrl + 'SetOpUserToken';
        return this.httpClient.post(apiUrl, data);
    }
}



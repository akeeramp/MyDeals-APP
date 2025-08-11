import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class userRolePermissionService {

    public readonly API_URL = '/api/Employees/';
    constructor(private httpClient: HttpClient) { }


    public getUserRolePermissionByFilter(data: any): Observable<any> {
        const apiUrl: string = `${this.API_URL}GetUserRolePermissionSSP`;
        return this.httpClient.post(apiUrl, data);
    }

}
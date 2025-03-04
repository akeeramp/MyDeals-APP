import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class userRolePermissionService {
    public apiBaseUrl = '/api/Employees/';
    constructor(private httpClient: HttpClient) { }

    public getAllUserRolePermission (): Observable<any>{
        const apiURL: string = this.apiBaseUrl + 'GetUserRolePermission/';
        return this.httpClient.get(apiURL);
    }
    
    public postUserInfomation (userFormValues: any): Observable<any>{
        const apiURL: string = this.apiBaseUrl + 'PostUserRolePermission/';
        return this.httpClient.post(apiURL, userFormValues);
    }

    public fetchUserRolePermission (isFetchLatest : number): Observable<any>{
        const apiURL: string = this.apiBaseUrl + 'FetchUserRolePermission/?isFetchLatest='+isFetchLatest;
        return this.httpClient.get(apiURL);
    }
}
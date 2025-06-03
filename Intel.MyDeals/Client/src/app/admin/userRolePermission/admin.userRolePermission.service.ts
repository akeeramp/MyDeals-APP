import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class userRolePermissionService {

    public readonly API_URL = '/api/Employees/';
    constructor(private httpClient: HttpClient) { }

    public GetUserRolePermissionByFilter(skipRows: number, takeRows: number, group: string = '', filter: string = '', databaseUserName?: string, startDate?: string, endDate?: string): Observable<unknown> {
        if (group == null) {
            group = '';
        }

        if (filter == null) {
            filter = '';
        }

        let apiUrl: string = `${ this.API_URL }GetUserRolePermissionByFilter?skipRows=${ skipRows }&takeRows=${ takeRows }&group=${ group }&filter=${ filter }`;

        // For username search
        if ((databaseUserName && databaseUserName.length > 0) && (startDate && startDate.length > 0) && (endDate && endDate.length > 0)) {
            apiUrl += `&databaseUserName=${ databaseUserName }&startDate=${ startDate }&endDate=${ endDate }`;
        }

        return this.httpClient.get(apiUrl);
    }

    public fetchUserRolePermission(isFetchLatest: number): Observable<unknown> {
        const apiUrl: string = `${ this.API_URL }GetUserRolePermissionByFilter?isFetchLatest=${ isFetchLatest }`;
        return this.httpClient.get(apiUrl);
    }

}
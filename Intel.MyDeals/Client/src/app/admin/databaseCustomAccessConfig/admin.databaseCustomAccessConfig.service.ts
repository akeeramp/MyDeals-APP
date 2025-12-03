import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseCustomAccessConfigService {
    public readonly apiBaseUrl = "api/AdminConstants/v1/";
    constructor(private httpClient: HttpClient) { }

    public dbCustomAccess(data, mode:string): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDBCustomAccess/?mode=' + mode;
        return this.httpClient.post<any>(apiUrl, data);
    }
}
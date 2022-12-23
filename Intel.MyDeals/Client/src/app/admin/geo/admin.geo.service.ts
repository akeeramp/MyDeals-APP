import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class geoService {
    public apiBaseUrl = "api/Geos/";

    constructor(private httpClient: HttpClient) {
    }

    public getGeos(): Observable<any> {
        // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
        const apiUrl: string = this.apiBaseUrl + 'GetGeos/false';
        return this.httpClient.get(apiUrl);
    }

}


import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoDimension } from "./admin.geo.model";

@Injectable({
    providedIn: 'root'
})

export class geoService {
    public readonly apiBaseUrl = "api/Geos/";

    constructor(private httpClient: HttpClient) {
    }

    public getGeos(): Observable<GeoDimension[]> {
        // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
        const apiUrl: string = this.apiBaseUrl + 'GetGeos/false';
        return this.httpClient.get<GeoDimension[]>(apiUrl);
    }

}

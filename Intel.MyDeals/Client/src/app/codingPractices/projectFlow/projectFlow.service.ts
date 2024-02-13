import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ProjectFlowService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = "/api/HealthCheck/getDbStatus";

    public getTestApi() {
        return this.httpClient.get<any[]>(this.apiBaseUrl);
    }

}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class CodingToolsService {
    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = "/api/DevTests/NonExistent";

    public nonExistent() {
        return this.httpClient.get<any[]>(this.apiBaseUrl);
    }
}
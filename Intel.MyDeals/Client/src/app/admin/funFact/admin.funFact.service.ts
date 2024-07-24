import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funfact_Map } from "./admin.funFact.model";

@Injectable({
    providedIn: 'root'
})

export class funFactService {
    public readonly apiBaseUrl = "api/Funfact/";

    constructor(private httpClient: HttpClient) {
    }

    public getFunFactItems(): Observable<Funfact_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetFunfactItems';
        return this.httpClient.get<Funfact_Map[]>(apiUrl);
    }

    public updateFunFact(data: Funfact_Map): Observable<Funfact_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateFunfact';
        return this.httpClient.post<Funfact_Map[]>(apiUrl, data);
    }
    public setFunfact(data: Funfact_Map): Observable<Funfact_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'SetFunfact';
        return this.httpClient.post<Funfact_Map[]>(apiUrl, data);

    }
    public getActiveFunfacts(): Observable<Funfact_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetActiveFunfacts';
        return this.httpClient.get<Funfact_Map[]>(apiUrl);
    }

}

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class sdmService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = '/api/SDM/';
    public getSDMStageData(data) {
        const apiUrl: string = this.apiBaseUrl + 'GetSDMStageData';
        return this.httpClient.post(apiUrl, data);
    }
    public getSdmMstrData(data) {
        const apiUrl: string = this.apiBaseUrl + 'GetMstrPrdDtls';
        return this.httpClient.post(apiUrl, data);
    }
    public getSdmDropValues(data) {
        const apiUrl: string = this.apiBaseUrl + 'getSdmDropValues';
        return this.httpClient.post(apiUrl, data);
    }
    public updtSdmData(data) {
        const apiUrl: string = this.apiBaseUrl + 'UpdtSdmData';
        return this.httpClient.post(apiUrl, data);
    }
    
    public getFormattedTimestamp(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        return `${year}-${month}-${day}`;
    }
    public padZero(value: number): string {
        return value < 10 ? `0${value}` : value.toString();
    }
}
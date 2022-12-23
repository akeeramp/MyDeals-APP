import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class cacheService {
    public apiBaseUrl = "api/Cache/v1/";
    constructor(private httpClient: HttpClient) { }
    public getStaticCacheStatus(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheStatus';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearStaticCache(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public reloadAllStaticCache(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheReload';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public loadStaticCacheByName(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheLoad/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearStaticCacheByName(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheClear/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public viewStaticCacheByName(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCacheView/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getApiCacheStatus(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetApiCacheStatus';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCache(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetApiCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCacheByName(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ClearApiCache';
        const param = new HttpParams();
        param.set('cache', data);
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getSessionComparisonHash(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetSessionComparisonHash';
        const param = new HttpParams();
        param.set('cache','false' );
        return this.httpClient.get(apiUrl, { params: param });
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminCacheService {

    public readonly API_URL_CACHE = "api/Cache/v1/";

    constructor(private httpClient: HttpClient) { }

    public getStaticCacheStatus(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheStatus';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearStaticCache(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public reloadAllStaticCache(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheReload';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public loadStaticCacheByName(data): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheLoad/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param }) as Observable<boolean>;
    }

    public clearStaticCacheByName(data): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheClear/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public viewStaticCacheByName(data): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheView/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getApiCacheStatus(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetApiCacheStatus';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCache(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetApiCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCacheByName(data): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'ClearApiCache';
        const param = new HttpParams();
        param.set('cache', data);
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getSessionComparisonHash(): Observable<unknown> {
        const apiUrl: string = this.API_URL_CACHE + 'GetSessionComparisonHash';
        const param = new HttpParams();
        param.set('cache','false' );
        return this.httpClient.get(apiUrl, { params: param });
    }

}
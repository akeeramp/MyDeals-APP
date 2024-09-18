import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cache_Item_Map } from './admin.cache.model';

@Injectable({
    providedIn: 'root'
})
export class AdminCacheService {

    public readonly API_URL_CACHE = "api/Cache/v1/";

    constructor(private httpClient: HttpClient) { }

    public getStaticCacheStatus(): Observable<Cache_Item_Map[]> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheStatus';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get<Cache_Item_Map[]>(apiUrl, { params: param });
    }

    public clearStaticCache(): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get<boolean>(apiUrl, { params: param });
    }

    public reloadAllStaticCache(): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheReload';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get<boolean>(apiUrl, { params: param });
    }

    public loadStaticCacheByName(data: Cache_Item_Map): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheLoad/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param }) as Observable<boolean>;
    }

    public clearStaticCacheByName(data: Cache_Item_Map): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetCacheClear/' + data.CacheName;
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get<boolean>(apiUrl, { params: param });
    }

    public viewStaticCacheByName(data: Cache_Item_Map): Observable<unknown> {
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

    public clearApiCache(): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'GetApiCacheClear';
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get<boolean>(apiUrl, { params: param });
    }

    public clearApiCacheByName(data: any): Observable<boolean> {
        const apiUrl: string = this.API_URL_CACHE + 'ClearApiCache';
        const param = new HttpParams();
        param.set('cache', data);
        return this.httpClient.get<boolean>(apiUrl, { params: param });
    }

    public getSessionComparisonHash(): Observable<number> {
        const apiUrl: string = this.API_URL_CACHE + 'GetSessionComparisonHash';
        const param = new HttpParams();
        param.set('cache','false' );
        return this.httpClient.get<number>(apiUrl, { params: param });
    }

}
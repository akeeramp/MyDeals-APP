import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class cacheService {
    public apiBaseUrl: string = "api/Cache/v1/";
    constructor(private httpClient: HttpClient) { }
    public getStaticCacheStatus(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheStatus';
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearStaticCache(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheClear';
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public reloadAllStaticCache(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheReload';
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public loadStaticCacheByName(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheLoad/' + data.CacheName;
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearStaticCacheByName(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheClear/' + data.CacheName;
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public viewStaticCacheByName(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCacheView/' + data.CacheName;
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getApiCacheStatus(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetApiCacheStatus';
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCache(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetApiCacheClear';
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(apiUrl, { params: param });
    }

    public clearApiCacheByName(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'ClearApiCache';
        let param = new HttpParams();
        param.set('cache', data);
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getSessionComparisonHash(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetSessionComparisonHash';
        let param = new HttpParams();
        param.set('cache','false' );
        return this.httpClient.get(apiUrl, { params: param });
    }
}
import * as angular from 'angular';
import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import {downgradeInjectable} from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class loadingPanelService { 
    public apiBaseUrl: string = "api/Funfact/";

    constructor(private httpClient: HttpClient) {
      }

      public GetActiveFunfacts():Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetActiveFunfacts';
        return this.httpClient.get(apiUrl);
    }
}

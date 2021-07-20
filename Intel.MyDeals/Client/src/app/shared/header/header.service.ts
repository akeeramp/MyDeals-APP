import * as angular from "angular";
import {Injectable, Inject} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import "rxjs/add/operator/toPromise";
import {downgradeInjectable} from "@angular/upgrade/static";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class headerService {
  public apiBaseUrl: string = "api/Reporting/";

  constructor(private httpClient: HttpClient) {}

  public getAntiForgeryTokenToken(){
    let promise = new Promise((resolve, reject) => {
      let token='jfWpEuT70U7RGJyRTpV7Topmytw0yDOr-CDpD1TyEvK8s_II2NjrxFiaTr-ULMCIeYxNWnubSXJQ3wQeJYAp-ecTmtgmOvlR-kEDxQCMLa41:07jrfGbziLZg3ff-t3YUEAqd9BIP_ZQnYXl3RUQ-VcOs3NR3W0iQDe5dukLvhyDWv6MAujVh7ripyTQIqCr3UOnJlKGr2V_gIYMXn7bkEYBqoHGEGGxoPlXh5WAIdk6G0';
      localStorage.setItem('ReqVerToken',token);
      resolve('ReqVerToken success');
    });
    return promise;
  }
  public getUserDetails():Observable<any> {
    let apiUrl: string = this.apiBaseUrl + 'getAvm';
    let param =new HttpParams();
    param.set('cache','false');
    return this.httpClient.get(apiUrl,{params:param});
  } 
}

angular
  .module("app")
  .factory("headerService", downgradeInjectable(headerService));

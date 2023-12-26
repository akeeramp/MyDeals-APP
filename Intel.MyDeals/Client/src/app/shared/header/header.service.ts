import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {

  public readonly API_URL_SHARED_SERVICE = "api/SharedService/";

  constructor(private httpClient: HttpClient) {}

  public getAntiForgeryTokenToken(): Observable<any> {
    const token = 'jfWpEuT70U7RGJyRTpV7Topmytw0yDOr-CDpD1TyEvK8s_II2NjrxFiaTr-ULMCIeYxNWnubSXJQ3wQeJYAp-ecTmtgmOvlR-kEDxQCMLa41:07jrfGbziLZg3ff-t3YUEAqd9BIP_ZQnYXl3RUQ-VcOs3NR3W0iQDe5dukLvhyDWv6MAujVh7ripyTQIqCr3UOnJlKGr2V_gIYMXn7bkEYBqoHGEGGxoPlXh5WAIdk6G0';
    localStorage.setItem('ReqVerToken', token);
    return of('ReqVerToken success');
  }

  public getUserDetails(): Observable<any> {
    const apiUrl: string = this.API_URL_SHARED_SERVICE + 'getAvm';
    const param = new HttpParams();
    param.set('cache', 'false');
    return this.httpClient.get(apiUrl, { params: param });
  }
 
}
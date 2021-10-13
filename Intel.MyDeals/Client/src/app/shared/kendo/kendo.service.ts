import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { products,sampleProducts } from "./products";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
 })

export class kendoService {
    public apiBaseUrl: string = "api/CustomerVendor/";
    constructor(private httpClient: HttpClient) { }
    public getCustomerMapping():Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCustomerVendors/0';
            return this.httpClient.get(apiUrl);
         
    } 
    public insertCustomerVendor(data:any):Observable<any>{
        let apiUrl: string = this.apiBaseUrl + 'GetCustomerVendors/0';
        return this.httpClient.get(apiUrl);
    }
    public getKendo() {
        let promise = new Promise((resolve, reject) => {
                console.log("Async Work Complete");
                resolve(sampleProducts);
          });
      return promise;
    } 
}


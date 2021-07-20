import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { products,sampleProducts } from "./products";

@Injectable({
    providedIn: 'root'
 })

export class kendoService {
    public apiBaseUrl: string = "api/Reporting/";
    constructor(private httpClient: HttpClient) { }
    public getKendo() {
        let promise = new Promise((resolve, reject) => {
                console.log("Async Work Complete");
                resolve(products);
          });
          return promise;
    } 
}


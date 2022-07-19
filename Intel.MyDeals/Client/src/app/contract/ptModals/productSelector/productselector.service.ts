import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class productSelcorService { 
    public apiBaseUrl = "api/Products/";

    constructor(private httpClient: HttpClient) {
      }

      public GetProductSelectorWrapper(dto:any):Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductSelectorWrapper';
        return this.httpClient.post(apiUrl,dto);
    }
    public GetProductSelectionResults(prodSelectionLevels:any):Observable<any> {
      const apiUrl: string = this.apiBaseUrl + 'GetProductSelectionResults';
      return this.httpClient.post(apiUrl,prodSelectionLevels);
  }

}


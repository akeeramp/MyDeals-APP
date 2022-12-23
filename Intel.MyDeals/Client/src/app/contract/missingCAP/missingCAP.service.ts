import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class missingCAPService { 
    public apiGetDealsUrl ='/api/Products/GetDealProducts/';

    constructor(private httpClient: HttpClient) {
      }

      public getDealProducts(cId,sId):Observable<any> {
        const apiUrl: string = this.apiGetDealsUrl + cId + '/1/'+ sId;
        return this.httpClient.get(apiUrl);
    }
    

}


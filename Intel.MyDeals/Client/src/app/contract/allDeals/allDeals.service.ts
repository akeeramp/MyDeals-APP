import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class allDealsService { 
    public apiBaseContractUrl = "/api/Contracts/v1/";

    constructor(private httpClient: HttpClient) {
      }

      public readWipFromContract(id):Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'GetWipFromContract/' + + id;
        return this.httpClient.get(apiUrl);
    }
    

}


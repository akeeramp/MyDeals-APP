import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class allDealsService { 
    public apiBaseContractUrl = "/api/Contracts/v1/";

    constructor(private httpClient: HttpClient) {
      }
    public readWipExclusionFromContract(id): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'GetWipExclusionFromContract/' + id;
        return this.httpClient.get(apiUrl);
    }

    public readWipFromContract(id):Observable<any> {
      const apiUrl: string = this.apiBaseContractUrl + 'GetWipFromContract/' + + id;
      return this.httpClient.get(apiUrl);
  }
    

}

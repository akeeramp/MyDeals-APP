import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class autoFillService { 
    public apiBaseUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
      }

      public readDropdownEndpoint(lookupUrl: string) {
        if (lookupUrl.toLowerCase().includes('api/Dropdown'.toLowerCase())) {
            const apiUrl: string = lookupUrl;
            return this.httpClient.get(apiUrl);    
        }
    }
}


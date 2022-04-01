
import {Injectable} from "@angular/core";
import { HttpClient} from '@angular/common/http';
import * as _ from "underscore";

@Injectable({
    providedIn: 'root'
 })

export class globalSearchResultsService { 
    public apiBaseUrl = "/api/Search/GetGlobalSearchList/";

    constructor(private httpClient: HttpClient) {
      }
   
    public getObjectType(search:string,take:number,opType:string){
       return this.httpClient.get(this.apiBaseUrl + `${opType}/${take}/${search}`);
    }


}


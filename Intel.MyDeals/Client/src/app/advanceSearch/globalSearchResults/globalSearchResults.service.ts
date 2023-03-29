import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class globalSearchResultsService { 
    public apiBaseUrl = "/api/Search/GetGlobalSearchList/";
    apiUrl = "";

    constructor(private httpClient: HttpClient) { }
   
    public getObjectType(search:string,take:number,opType:string){
       return this.httpClient.get(this.apiBaseUrl + `${opType}/${take}/${search}`);
    }

    public getContractIDDetails(id, opType) {
        if (opType == "WIP_DEAL") this.apiUrl = "GotoDeal/";
        else if (opType == "PRC_ST") this.apiUrl = "GotoPS/";
        else this.apiUrl = "GotoPT/";
        return this.httpClient.get("api/Search/" + this.apiUrl + id);
    }
}
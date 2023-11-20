import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface FunFact {
  FACT_HDR: string,
  FACT_TXT: string,
  FACT_ICON: string
}

@Injectable({
  providedIn: "root",
})
export class LoadingPanelService {

  public readonly API_URL_FUN_FACT = "api/Funfact/";

  constructor(private httpClient: HttpClient) {}

  public GetActiveFunfacts(): Observable<FunFact[]> {
    const apiUrl: string = this.API_URL_FUN_FACT + "GetActiveFunfacts";
    return this.httpClient.get(apiUrl) as Observable<FunFact[]>;
  }

}
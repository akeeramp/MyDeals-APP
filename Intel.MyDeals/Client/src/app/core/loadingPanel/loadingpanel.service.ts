import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class loadingPanelService {
  public apiBaseUrl = "api/Funfact/";

  constructor(private httpClient: HttpClient) {}

  public GetActiveFunfacts(): Observable<any> {
    const apiUrl: string = this.apiBaseUrl + "GetActiveFunfacts";
    return this.httpClient.get(apiUrl);
  }
}

import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
 })

export class reportingService {
    public apiBaseUrl: string = "api/Reporting/";
    constructor(private httpClient: HttpClient) { }
    public getReportData() {
        let apiUrl: string = this.apiBaseUrl + 'GetReportDashboard';
        let param =new HttpParams();
        param.set('cache','false');
        return this.httpClient.get(apiUrl,{params:param}).toPromise();
    } 
}


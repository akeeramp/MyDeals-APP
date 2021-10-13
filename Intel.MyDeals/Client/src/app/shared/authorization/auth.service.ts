import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
 })

export class AuthService {
    public static getToken(): string {
        //in this method we will put the get Token API and store to local variable and if not exist will hit again and store it
        return localStorage.getItem('ReqVerToken');
      }
}


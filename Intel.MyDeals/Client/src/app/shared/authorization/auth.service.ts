import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
 })

export class AuthService {
    public static getToken(): string {
        return localStorage.getItem('ReqVerToken');
      }
}


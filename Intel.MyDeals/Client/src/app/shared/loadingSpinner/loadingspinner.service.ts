import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoadingSpinnerService {
    
    constructor(private httpClient: HttpClient) { }
    public isLoading = new BehaviorSubject(false);
  
}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingSpinnerService {
    constructor(private httpClient: HttpClient) { }

    public isLoading = new BehaviorSubject(false); 
}
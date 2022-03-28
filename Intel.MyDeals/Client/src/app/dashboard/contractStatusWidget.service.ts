import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class contractStatusWidgetService {

    constructor(private httpClient: HttpClient) { }
    public isRefresh = new BehaviorSubject(false);

}
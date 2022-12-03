import { Injectable } from "@angular/core";
import {  Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
  
// Used to store key value pairs 

export class AppEvent<T> {
    constructor(
        public type: string,
        public payload: T,
    ) { }
}
 
@Injectable()
export class broadCastService {
    private eventBrocker = new Subject<AppEvent<any>>();

    on(eventType: string): Observable<AppEvent<any>> {
        return this.eventBrocker.pipe(filter(event => event.type === eventType));
    }

    dispatch<T>(event: AppEvent<T>): void {
        this.eventBrocker.next(event);
    }
}
 
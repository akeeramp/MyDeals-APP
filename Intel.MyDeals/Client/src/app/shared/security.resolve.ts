import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SecurityService } from './services/security.service';



@Injectable()
export class SecurityResolver implements Resolve<Observable<any>> {
    constructor(private securitySvc: SecurityService) { }

    resolve(): Observable<any> {
        return this.securitySvc.getSecurityData().pipe(map(res => {
            this.securitySvc.getSecurityDataFromSession();
            sessionStorage.setItem('securityAttributes', JSON.stringify(res.SecurityAttributes));
            sessionStorage.setItem('securityMasks', JSON.stringify(res.SecurityMasks));
        }));
    }
}
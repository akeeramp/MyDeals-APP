import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs'; 
import { each } from 'underscore';
import { SecurityService } from './services/security.service';

@Injectable()
export class SecurityResolver implements Resolve<Observable<any>> {
    constructor(private securitySvc: SecurityService ,private router: Router) { }

    async resolve(): Promise<Observable<any>> {

        //this route code is temporary and it will be removed once move as a standalone application
        each(this.router.config, (route) => {
            const routeobj = route.data.BaseHref + '#/';
            if (route.path == '/' || route.path == '')
                route.path ='Dashboard#/'
            if (document.location.href.indexOf(route.path.split('/')[0]) > 0) {
                if (document.getElementById("baseHref"))
                document.getElementById("baseHref").setAttribute('href', routeobj);
              }
        }) 

      await  this.securitySvc.loadSecurityData(); 
        return of('true');
    }
}
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { guardConfig } from './guardConfig.util';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: "root" })
export class authGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        //getting role details
        let role = (<any>window).usrRole.toUpperCase();
        let bit = '';
        let prefix = '';

        if ((<any>window).isSuper)
            bit += 'Super';
        if ((<any>window).isTester)
            bit += 'T';
        if ((<any>window).isBulkPriceAdmin)
            bit += 'B';
        if ((<any>window).isDeveloper)
            bit += 'D';
        if ((<any>window).isCustomerAdmin && (<any>window).usrRole == 'SA')
            prefix = 'Account';

        role = bit.length > 0 ? (role + '-' + bit) : role;
        role = prefix.length > 0 ? prefix + ' ' + role : role;
        
        if (guardConfig.guardSettings[route.routeConfig.path][role] == undefined) {
            //checking for special conditions
            if (role.includes('T')) {
                if (guardConfig.guardSettings[route.routeConfig.path][(<any>window).usrRole.toUpperCase() + '-T']) return true;
            }
            if (role.includes('D')) {
                if (guardConfig.guardSettings[route.routeConfig.path][(<any>window).usrRole.toUpperCase() + '-D']) return true;
            }
            if (role.includes('B')) {
                if (guardConfig.guardSettings[route.routeConfig.path][(<any>window).usrRole.toUpperCase() + '-B']) return true;
            }
            if (role.includes('Super')) {
                if (guardConfig.guardSettings[route.routeConfig.path][(<any>window).usrRole.toUpperCase() + '-Super']) return true;
            }
            if (role.includes('Account')) {
                if (guardConfig.guardSettings[route.routeConfig.path]['Account ' + (<any>window).usrRole.toUpperCase()]) return true;
            }
            else window.location.href = window.location.origin + '/Dashboard#/portal';
        } else if (guardConfig.guardSettings[route.routeConfig.path][role] != undefined && guardConfig.guardSettings[route.routeConfig.path][role])
            return true;
        else
            window.location.href = window.location.origin + '/Dashboard#/portal';

    }

}
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
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

        let path = route.routeConfig.path;
        path = route.queryParams.manageType && route.queryParams.manageType == 'pctDiv' ? path + `?loadtype=${route.queryParams.loadtype}&manageType=${route.queryParams.manageType}` : path;

        if (guardConfig.guardSettings[path][role] == undefined) {
            //checking for special conditions
            if (role.includes('T')) {
                if (guardConfig.guardSettings[path][(<any>window).usrRole.toUpperCase() + '-T']) return true;
            }
            if (role.includes('D')) {
                if (guardConfig.guardSettings[path][(<any>window).usrRole.toUpperCase() + '-D']) return true;
            }
            if (role.includes('B')) {
                if (guardConfig.guardSettings[path][(<any>window).usrRole.toUpperCase() + '-B']) return true;
            }
            if (role.includes('Super')) {
                if (guardConfig.guardSettings[path][(<any>window).usrRole.toUpperCase() + '-Super']) return true;
            }
            if (role.includes('Account')) {
                if (guardConfig.guardSettings[path]['Account ' + (<any>window).usrRole.toUpperCase()]) return true;
            }
            else {
                window.alert("User does not have access. Press OK to redirect to Dashboard.");
                window.location.href = 'Dashboard#/portal';
            }
        } else if (guardConfig.guardSettings[path][role] != undefined && guardConfig.guardSettings[path][role])
            return true;
        else {
            window.alert("User does not have access. Press OK to redirect to Dashboard.");
            window.location.href = 'Dashboard#/portal';

        }

    }

}
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
        const userRole = (<any>window).usrRole.toUpperCase();
        const roleBits = {
            'Super': (<any>window).isSuper,
            'T': (<any>window).isTester,
            'B': (<any>window).isBulkPriceAdmin,
            'D': (<any>window).isDeveloper,
            'RPD': (<any>window).isSdmAdmin
        };
        const roleCombinations = this.getRoleCombinations(userRole, roleBits);

        let path = route.routeConfig.path;
        path = route.queryParams.manageType && route.queryParams.manageType == 'pctDiv' ? path + `?loadtype=${route.queryParams.loadtype}&manageType=${route.queryParams.manageType}` : path;
        
        for (const role of roleCombinations) {
            if (guardConfig.guardSettings[path] && guardConfig.guardSettings[path][role]) {
                return true;
            }
        }
        
        window.alert("User does not have access to the screen. Press OK to redirect to Dashboard.");
        window.location.href = 'Dashboard#/portal';
        return false;
    }

    private getRoleCombinations(baseRole: string, roleBits: { [key: string]: boolean }): string[] {
        const combinations = [baseRole];
        for (const [bit, hasBit] of Object.entries(roleBits)) {
            if (hasBit) {
                combinations.push(`${baseRole}-${bit}`);
            }
        }
        if ((<any>window).isCustomerAdmin && baseRole === 'SA') {
            combinations.push('Account SA');
        }
        return combinations;
    }
}
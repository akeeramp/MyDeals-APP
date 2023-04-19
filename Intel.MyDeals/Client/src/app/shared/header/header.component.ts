import { Component } from "@angular/core";
import { logger } from "../logger/logger";
import { isUndefined } from 'underscore';

@Component({
    selector: 'app-header',
    templateUrl: 'Client/src/app/shared/header/header.component.html',
    styleUrls: ['Client/src/app/shared/header/header.component.css']
})
export class HeaderComponent {
    constructor(private loggerSVC: logger) { }
    private environment: string = (<any> window).env;

    getSuperPrefix(): string {
        return (<any> window).superPrefix;
    }

    getUserRoleExtension(): string {
        return (<any> window).usrRoleExtension;
    }

    getUserRole(): string {
        return (<any> window).usrRole;
    }

    getUserRoleId(): number {
        return (<any> window).usrRoleId;
    }

    generateUserRole(): string {
        return `${ this.getSuperPrefix() } ${ this.getUserRoleExtension() } ${ this.getUserRole() }`;
    }

    getUserName(): string {
        return (<any> window).usrName;
    }

    getUserWwid(): string {
        return (<any> window).usrWwid;
    }

    getUserDupWwid(): string {
        return (<any> window).usrDupWwid;
    }

    getUserEmail(): string {
        return (<any> window).usrEmail;
    }

    getUserVerticals(): string {
        return (<any> window).usrVerticals;
    }

    getExtraUserPrivs(): Array<string> {
        const extraUserPrivs = (<any> window).extraUserPrivs;
        if (!isUndefined(extraUserPrivs)) {
            return extraUserPrivs;
        }
        return [];
    }

    getExtraUserPrivsDetail(): Array<string> {
        const extraUserPrivsDetail = (<any> window).extraUserPrivsDetail;
        if (!isUndefined(extraUserPrivsDetail)) {
            return extraUserPrivsDetail;
        }
        return [];
    }

    getExtraUserPrivsDetailAsString(): string {
        return this.getExtraUserPrivsDetail().join('\n');
    }

    isProduction(): boolean {
        return this.environment.includes('PROD');
    }

    isEnvironmentKnown(): boolean {
        return !this.environment.includes('UNKNOWN');
    }

    isDeveloper(): boolean {
        return (<any> window).isDeveloper;
    }

    isRealSA(): boolean {
        return (<any> window).isRealSA;
    }

    isReportingUser(): boolean {
        return (<any> window).isReportingUser;
    }

    isTester(): boolean {
        return (<any> window).isTester;
    }

    isSuper(): boolean {
        return (<any> window).isSuper;
    }

    isCustomerAdmin(): boolean {
        return (<any> window).isCustomerAdmin;
    }

    isBulkPriceAdmin(): boolean {
        return (<any> window).isBulkPriceAdmin;
    }

    isCustomerMenuEnabled(): boolean {
        const allowedUserRole = ['GA', 'FSE', 'RA'];    // All SA users allowed
        return (this.isRealSA() || this.isCustomerAdmin() || this.isDeveloper() || allowedUserRole.includes(this.getUserRole()))
    }

    isAdminMeetCompMenuItemEnabled(): boolean {
        const allowedUserRole = ['DA', 'Legal'];    // All SA users allowed
        return (this.isRealSA() || this.isDeveloper() || allowedUserRole.includes(this.getUserRole()) || (this.getUserRole() == 'GA' && this.isSuper()));
    }
}
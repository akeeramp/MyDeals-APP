import { Component } from "@angular/core";

import { logger } from "../logger/logger";

@Component({
    selector: 'app-header',
    templateUrl: 'Client/src/app/shared/header/header.component.html',
    styleUrls: ['Client/src/app/shared/header/header.component.css']
})
export class HeaderComponent {

    constructor(private loggerService: logger) { }

    private readonly ENVIRONMENT: string = (<any> window).env;
    browserName: string;

    ngOnInit() {
        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            this.browserName = 'OPERA';
        } else if (navigator.userAgent.indexOf("Edg") != -1) {
            this.browserName = 'EDGE';
        } else if (navigator.userAgent.indexOf("Chrome") != -1) {
            this.browserName = 'CHROME';
        } else if (navigator.userAgent.indexOf("Safari") != -1) {
            this.browserName = 'SAFARI';
        } else if (navigator.userAgent.indexOf("Firefox") != -1) {
            this.browserName = 'FIREFOX';
        } else {
            this.browserName = 'UNKNOWN';
        }
    }
    
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

    getUserBadge(): string {
        let ImgUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`;
        return ImgUrl;
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
        if (extraUserPrivs != undefined) {
            return extraUserPrivs;
        }
        return [];
    }

    getExtraUserPrivsDetail(): Array<string> {
        const extraUserPrivsDetail = (<any> window).extraUserPrivsDetail;
        if (extraUserPrivsDetail != undefined) {
            return extraUserPrivsDetail;
        }
        return [];
    }

    getExtraUserPrivsDetailAsString(): string {
        return this.getExtraUserPrivsDetail().join('\n');
    }

    isProduction(): boolean {
        return this.ENVIRONMENT.includes('PROD');
    }

    isEnvironmentKnown(): boolean {
        return !this.ENVIRONMENT.includes('UNKNOWN');
    }

    isDeveloper(): boolean {
        return (<any> window).isDeveloper;
    }

    // SA Role but not a Customer Admin (Middleteir logic)
    isRealSA(): boolean {
        return (<any> window).isRealSA;
    }

    // Different from isRealSA() because isAnySA() will return true for any type of SA while isRealSA() will only return true if is SA and NOT a Customer Admin
    isAnySA(): boolean {
        return this.isRealSA() || this.getUserRole() == 'SA';
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

    isSdmUser(): boolean {
        return ( this.isDeveloper() || ((<any> window).isSdmAdmin) );
    }

}
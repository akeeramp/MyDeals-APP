import * as angular from 'angular';
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { adminBannerService } from './adminBanner.service';
import { logger } from "../../shared/logger/logger";

@Component({
    selector: 'admin-banner-angular',
    templateUrl: 'Client/src/app/core/adminBanner/adminBanner.component.html'
})
export class AdminBannerComponent {
    constructor(private adminSvc: adminBannerService, private loggerSvc: logger) {
    }

    private adminBannerMessage = "";
    private adminMessage = "ADMIN_MESSAGE";
    private bannerValue;
    private userDismissed;
    private dontAddTheseInRecents = 'portal';
    private recents = [];
    private distinctURL = [];

    GetAdminMessage() {
        this.userDismissed = localStorage.getItem('userDismissed') == undefined ? 1 : localStorage.getItem('userDismissed');
        this.adminSvc.getConstantsByName(this.adminMessage).subscribe((result) => {
            if (result) {
                this.adminBannerMessage = result.CNST_VAL_TXT === 'NA'
                    ? "" : result.CNST_VAL_TXT;

            }
        }, (error) => {
            this.loggerSvc.error('Something Went Wrong', error.statusText);
        });


    }
    close() {
        if (this.userDismissed == 1) this.userDismissed = 0; else this.userDismissed = 1;
        localStorage.setItem('userDismissed', this.userDismissed);
    }

    ngOnInit() {
        this.GetAdminMessage();

    }
}
angular
    .module('app')
    .directive("adminBannerAngular", downgradeComponent({
        component: AdminBannerComponent,
    }));
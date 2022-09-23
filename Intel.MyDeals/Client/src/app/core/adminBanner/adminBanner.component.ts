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
    private userDismissed = false;
    private dontAddTheseInRecents = 'portal';
    private recents = [];
    private distinctURL = [];

    GetAdminMessage() {
        this.adminSvc.getConstantsByName(this.adminMessage).subscribe((result) => {
            if (result) {
                this.adminBannerMessage = result.CNST_VAL_TXT === 'NA'
                    ? "" : result.CNST_VAL_TXT;

            }
        }, (error) => {
            this.loggerSvc.error('Something Went Wrong', error.statusText);
        });


    }
    close(value) {
        this.userDismissed = value;
    }

    //----------------------------Recent Widget code-------------------------------------------------------------------
    // Admin banner is a global directory, we track url changes from here and add it to the recent visited links

    /*the logic doesn't work here as in angular we aren't reloading the application everytime, 
    moving the logic to loading spinner component which acts as an interceptor and we can track the url changes for every page*/

    //recentURL() {
    //    // store recents on a local storage,
    //    if (localStorage.recents === undefined) localStorage.setItem('recents', JSON.stringify(this.recents));
    //    // Get the recents on local variable
    //    this.recents = JSON.parse(localStorage.getItem('recents'));
    //    // Get the url from the state change event
    //    let url = window.location.href;
    //    if (!url.endsWith(this.dontAddTheseInRecents)) {
    //        // if there is already entry in recents, to make it appear in top remove and add
    //        this.recents.push(url);
    //        this.recents.unshift(url);
    //        this.distinctURL = _.uniq(this.recents);
    //        if (this.distinctURL.length > 10) {
    //            this.distinctURL.length = 10;
    //        }
    //        // replace recents on localstorage
    //        localStorage.setItem('recents', JSON.stringify(this.distinctURL));
    //    }

    //}


    ngOnInit() {
        this.GetAdminMessage();
        //this.recentURL();

    }
}
angular
    .module('app')
    .directive("adminBannerAngular", downgradeComponent({
        component: AdminBannerComponent,
    }));
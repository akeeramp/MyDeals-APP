import * as angular from "angular";
import { utils } from "../../shared/util/util";
import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { logger } from "../../shared/logger/logger";
//import { logger } from "src/app/shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { cacheService } from "./cache.service";
import { List } from "linqts";

@Component({
    selector: "cache",
    templateUrl: "Client/src/app/admin/cache/cache.html",
    styleUrls: ['Client/src/app/admin/cache/cache.css']
})

export class CacheComponent {
    constructor(private cacheSvc: cacheService,private loggerSvc:logger) { }

    private title: string = "Cache Manager";
    private cacheData: Array<any> = [];
    private currentCacheDetails: string = "";
    private divCacheListHt: any;
    private divViewResultHt: any;
    private divViewResultWidth: any;
    private apiCacheData: any;

    loadCache() {
        this.title = "Cache Manager";
        this.cacheSvc.getStaticCacheStatus().subscribe(res => {
            this.cacheData = res;
            this.defaultStatus();
        }, err => {
            this.loggerSvc.error("Error in getting cache status.", err)
        });
    }

    //load cache by name
    loadCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.cacheSvc.loadStaticCacheByName(data).subscribe(res => {
            this.loadCache();
        }, err => {
            this.loggerSvc.error("Unable to load cache.", err);
            data.loading = false;
        });
    }

    // Clear cache by name
    clearCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.cacheSvc.clearStaticCacheByName(data).subscribe(res => {
            this.loggerSvc.success("Deleted successfully", "Done")
            this.loadCache();
        }, err =>  {
            this.loggerSvc.error("Unable to clear cache.", err);
            data.loading = false;
        });
    }

    // View static cache by name
    viewCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.cacheSvc.viewStaticCacheByName(data).subscribe(res => {
            this.currentCacheDetails =utils.isNull(res) ? "<< no data found >>" : JSON.stringify(res);
            data.loading = false;
        }, function (e) {
            //op.notifyError(e.statusText, "Unable to retrieve cache details.");
            data.loading = false;
        });
    }

    // Clear all the cache
    clearAll() {
        console.log("clearall");
        this.resetCache();
        this.cacheSvc.clearStaticCache().subscribe(res => {
            this.loggerSvc.success("Deleted successfully.", "Done");
            this.loadCache();
        }, function (e) {
            this.loggerSvc.error("Unable to Clear Cache.", e);
        });
    }

    // Reload all the cache
    reloadAll() {
        console.log("reloadAll");
        this.resetCache();
        this.cacheSvc.reloadAllStaticCache().subscribe(res => {
            this.loadCache();
        }, function (e) {
                this.loggerSvc.error("Unable to Load Cache Status", e);
                this.defaultStatus();
        });
    }

    // Load the api cache details
    loadApiCache() {
        this.currentCacheDetails = "";
        this.cacheSvc.getApiCacheStatus().subscribe(res => {
            this.apiCacheData = res;
        }, err => {
                this.loggerSvc.error("Unable to Load Api Cache Status", err);
        });
    }

    // Clear api cache by name
    clearApiCacheByName(data) {
        this.currentCacheDetails = "";
        this.cacheSvc.clearApiCacheByName(data).subscribe(function () {
            this.loadApiCache();
        }, function (e) {
            this.loggerSvc.error("Unable to clear Api Cache Status", e);
        });
    }


    // Clear all api cache
    clearAllApiCache() {
        this.currentCacheDetails = "";
        this.cacheSvc.clearApiCache().subscribe(function () {
            this.loggerSvc.success("Api cache cleared successfully", "Done");
            this.loadApiCache();
        }, function (e) {
            this.loggerSvc.error("Unable to clear Cache Status.", e);
        });
    }

    defaultStatus() {
        for (var i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = false;
        }
    }

    loadingStatus() {
        for (var i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = true;
        }
    }

    resetCache() {
        this.loadingStatus();
        this.currentCacheDetails = "";
    }

    onResize() {
        var divCacheListWidth = document.getElementById("cacheList").clientWidth;
        this.divCacheListHt = window.innerHeight - 200;
        this.divViewResultHt = window.innerHeight - 200;
        this.divViewResultWidth = window.innerWidth - divCacheListWidth - 120;
    }

    ngOnInit() {
        this.loadCache();
        this.loadApiCache();
        this.onResize();
    }
}

angular.module("app").directive(
    "cache",
    downgradeComponent({
        component: CacheComponent,
    })
);



    



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
    constructor(private cacheSvc: cacheService) { }

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
            logger.error("Error in getting cache status.", err)
        });
    }

    //load cache by name
    loadCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.cacheSvc.loadStaticCacheByName(data).subscribe(res => {
            this.loadCache();
        }, err => {
            logger.error("Unable to load cache.", err);
            data.loading = false;
        });
    }

    // Clear cache by name
    clearCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.cacheSvc.clearStaticCacheByName(data).subscribe(res => {
            logger.success("Deleted successfully", "Done")
            this.loadCache();
        }, err =>  {
            logger.error("Unable to clear cache.", err);
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
            logger.success("Deleted successfully.", "Done");
            this.loadCache();
        }, function (e) {
            logger.error("Unable to Clear Cache.", e);
        });
    }

    // Reload all the cache
    reloadAll() {
        console.log("reloadAll");
        this.resetCache();
        this.cacheSvc.reloadAllStaticCache().subscribe(res => {
            this.loadCache();
        }, function (e) {
                logger.error("Unable to Load Cache Status", e);
                this.defaultStatus();
        });
    }

    // Load the api cache details
    loadApiCache() {
        this.currentCacheDetails = "";
        this.cacheSvc.getApiCacheStatus().subscribe(res => {
            this.apiCacheData = res;
        }, err => {
                logger.error("Unable to Load Api Cache Status", err);
        });
    }

    // Clear api cache by name
    clearApiCacheByName(data) {
        this.currentCacheDetails = "";
        this.cacheSvc.clearApiCacheByName(data).subscribe(function () {
            this.loadApiCache();
        }, function (e) {
            logger.error("Unable to clear Api Cache Status", e);
        });
    }


    // Clear all api cache
    clearAllApiCache() {
        this.currentCacheDetails = "";
        this.cacheSvc.clearApiCache().subscribe(function () {
            logger.success("Api cache cleared successfully", "Done");
            this.loadApiCache();
        }, function (e) {
            logger.error("Unable to clear Cache Status.", e);
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



    //angular
    //    .module('app')
    //    .controller('CacheController', CacheController)


    //// logger :Injected logger service to for logging to remote database or throwing error on the ui
    //// dataService :Application level service, to be used for common api calls, eg: user token, department etc
    //CacheController.$inject = ['dataService', 'cacheService', 'logger'];

    //function CacheController(dataService, cacheService, logger) {

    //    // Declare public variables, function at top followed by private functions
    //    var vm = this;
    //    //Developer can see the Screen..
    //    //Added By Bhuvaneswari for US932213
    //    //if (!window.isDeveloper) {
    //    //    document.location.href = "/Dashboard#/portal";
    //    //}
    //    vm.title = "Cache Manager";
    //    vm.cacheData = [];
    //    vm.apiCacheData = [];
    //    vm.currentCacheDetails = "";
    //    vm.loadCache = loadCache;
    //    vm.clearAll = clearAll;
    //    vm.reloadAll = reloadAll;
    //    vm.loadCacheByName = loadCacheByName;
    //    vm.clearCacheByName = clearCacheByName;
    //    vm.viewCacheByName = viewCacheByName;
    //    vm.loadApiCache = loadApiCache;
    //    vm.clearApiCacheByName = clearApiCacheByName
    //    vm.clearAllApiCache = clearAllApiCache;

    //    //Initial load functions to be called at the end
    //    vm.loadCache();
    //    vm.loadApiCache();

    //    //Get the cache Status
    //    function loadCache() {
    //        cacheService.getStaticCacheStatus().then(
    //            function (response) {
    //                vm.cacheData = response.data;
    //            }, function (e) {
    //                logger.error("Error in getting cache status.", e, e.statusText)
    //            });
    //    }

    //   

    //    
    //    

    //   

    //   




    //    
    //}



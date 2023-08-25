import { Component, OnInit } from '@angular/core';

import { utils } from '../../shared/util/util';
import { logger } from '../../shared/logger/logger';
import { AdminCacheService } from './admin.cache.service';

@Component({
    selector: 'cache',
    templateUrl: 'Client/src/app/admin/cache/admin.cache.component.html',
    styleUrls: ['Client/src/app/admin/cache/admin.cache.component.css']
})
export class AdminCacheComponent implements OnInit {

    constructor(private adminCacheService: AdminCacheService,
                private loggerService:logger) { }

    private readonly TITLE: string = 'Cache Manager';
    private cacheData = [];
    private currentCacheDetails = '';
    private divCacheListHt;
    private divViewResultHt;
    private divViewResultWidth;
    private apiCacheData;

    loadCache() {
        this.adminCacheService.getStaticCacheStatus().subscribe((res: unknown[]) => {
            this.cacheData = res;
            this.defaultStatus();
        }, (err) => {
            this.loggerService.error("Error in getting cache status.", err)
        });
    }

    loadCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.loadStaticCacheByName(data).subscribe((res) => {
            if (res === true) {
                this.loadCache();
            } else {
                this.loggerService.error("Unable to load cache. API: /GetCacheLoad/" + data.CacheName, null);
                data.loading = false;
            }
        }, (err) => {
            this.loggerService.error("Unable to load cache.", err);
            data.loading = false;
        });
    }

    clearCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.clearStaticCacheByName(data).subscribe(() => {
            this.loggerService.success("Deleted successfully", "Done")
            this.loadCache();
        }, (err) =>  {
            this.loggerService.error("Unable to clear cache.", err);
            data.loading = false;
        });
    }

    viewCacheByName(data) {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.viewStaticCacheByName(data).subscribe((res) => {
            this.currentCacheDetails = utils.isNull(res) ? "<< no data found >>" : JSON.stringify(res);
            data.loading = false;
        }, () => {
            data.loading = false;
        });
    }

    // Clear all the cache
    clearAll() {
        console.log("clearall");
        this.resetCache();
        this.adminCacheService.clearStaticCache().subscribe(() => {
            this.loggerService.success("Deleted successfully.", "Done");
            this.loadCache();
        }, (e) => {
            this.loggerService.error("Unable to Clear Cache.", e);
        });
    }

    // Reload all the cache
    reloadAll() {
        console.log("reloadAll");
        this.resetCache();
        this.adminCacheService.reloadAllStaticCache().subscribe(() => {
            this.loadCache();
        }, (e) => {
            this.loggerService.error("Unable to Load Cache Status", e);
            this.defaultStatus();
        });
    }

    // Load the api cache details
    loadApiCache() {
        this.currentCacheDetails = "";
        this.adminCacheService.getApiCacheStatus().subscribe((res) => {
            this.apiCacheData = res;
        }, (err) => {
                this.loggerService.error("Unable to Load Api Cache Status", err);
        });
    }

    // Clear api cache by name
    clearApiCacheByName(data) {
        this.currentCacheDetails = "";
        this.adminCacheService.clearApiCacheByName(data).subscribe(() => {
            this.loadApiCache();
        }, (e) => {
            this.loggerService.error("Unable to clear Api Cache Status", e);
        });
    }

    // Clear all api cache
    clearAllApiCache() {
        this.currentCacheDetails = "";
        this.adminCacheService.clearApiCache().subscribe(() => {
            this.loggerService.success("Api cache cleared successfully", "Done");
            this.loadApiCache();
        }, (e) => {
            this.loggerService.error("Unable to clear Cache Status.", e);
        });
    }

    defaultStatus() {
        for (let i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = false;
        }
    }

    loadingStatus() {
        for (let i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = true;
        }
    }

    resetCache() {
        this.loadingStatus();
        this.currentCacheDetails = "";
    }

    onResize() {
        const divCacheListWidth = document.getElementById("cacheList").clientWidth;
        this.divCacheListHt = window.innerHeight - 200;
        this.divViewResultHt = window.innerHeight - 200;
        this.divViewResultWidth = window.innerWidth - divCacheListWidth - 150;
    }

    ngOnInit() {
        this.loadCache();
        this.loadApiCache();
        this.onResize();
    }

}
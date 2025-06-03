import { Component, OnInit, OnDestroy } from '@angular/core';

import { utils } from '../../shared/util/util';
import { logger } from '../../shared/logger/logger';
import { AdminCacheService } from './admin.cache.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Cache_Item_Map } from './admin.cache.model';

@Component({
    selector: 'cache',
    templateUrl: 'Client/src/app/admin/cache/admin.cache.component.html',
    styleUrls: ['Client/src/app/admin/cache/admin.cache.component.css']
})
export class AdminCacheComponent implements OnInit, OnDestroy {

    constructor(private adminCacheService: AdminCacheService,
                private loggerService:logger) { }

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private readonly TITLE: string = 'Cache Manager';
    private cacheData = [];
    private currentCacheDetails = '';
    private divCacheListHt;
    private divViewResultHt;
    private divViewResultWidth;
    private apiCacheData;

    loadCache(): void {
        this.adminCacheService.getStaticCacheStatus().pipe(takeUntil(this.destroy$))
            .subscribe((res: Cache_Item_Map[]) => {
            this.cacheData = res;
            this.defaultStatus();
        }, (err) => {
            this.loggerService.error("Error in getting cache status.", err)
        });
    }

    loadCacheByName(data: Cache_Item_Map): void {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.loadStaticCacheByName(data).pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
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

    clearCacheByName(data: Cache_Item_Map): void {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.clearStaticCacheByName(data).pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loggerService.success("Deleted successfully", "Done")
            this.loadCache();
        }, (err) =>  {
            this.loggerService.error("Unable to clear cache.", err);
            data.loading = false;
        });
    }

    viewCacheByName(data: Cache_Item_Map): void {
        data.loading = true;
        this.currentCacheDetails = "";
        this.adminCacheService.viewStaticCacheByName(data).pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
            this.currentCacheDetails = utils.isNull(res) ? "<< no data found >>" : JSON.stringify(res);
            data.loading = false;
        }, () => {
            data.loading = false;
        });
    }

    // Clear all the cache
    clearAll(): void {
        this.resetCache();
        this.adminCacheService.clearStaticCache().pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loggerService.success("Deleted successfully.", "Done");
            this.loadCache();
        }, (e) => {
            this.loggerService.error("Unable to Clear Cache.", e);
        });
    }

    // Reload all the cache
    reloadAll(): void {
        console.log("reloadAll");
        this.resetCache();
        this.adminCacheService.reloadAllStaticCache().pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loadCache();
        }, (e) => {
            this.loggerService.error("Unable to Load Cache Status", e);
            this.defaultStatus();
        });
    }

    // Load the api cache details
    loadApiCache(): void {
        this.currentCacheDetails = "";
        this.adminCacheService.getApiCacheStatus().pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
            this.apiCacheData = res;
        }, (err) => {
                this.loggerService.error("Unable to Load Api Cache Status", err);
        });
    }

    // Clear api cache by name
    clearApiCacheByName(data: any): void {
        this.currentCacheDetails = "";
        this.adminCacheService.clearApiCacheByName(data).pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loadApiCache();
        }, (e) => {
            this.loggerService.error("Unable to clear Api Cache Status", e);
        });
    }

    // Clear all api cache
    clearAllApiCache(): void {
        this.currentCacheDetails = "";
        this.adminCacheService.clearApiCache().pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.loggerService.success("Api cache cleared successfully", "Done");
            this.loadApiCache();
        }, (e) => {
            this.loggerService.error("Unable to clear Cache Status.", e);
        });
    }

    defaultStatus(): void {
        for (let i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = false;
        }
    }

    loadingStatus(): void {
        for (let i = 0; i < this.cacheData.length; i++) {
            this.cacheData[i]["loading"] = true;
        }
    }

    resetCache(): void {
        this.loadingStatus();
        this.currentCacheDetails = "";
    }

    onResize(): void {
        const divCacheListWidth = document.getElementById("cacheList").clientWidth;
        this.divCacheListHt = window.innerHeight - 200;
        this.divViewResultHt = window.innerHeight - 200;
        this.divViewResultWidth = window.innerWidth - divCacheListWidth - 150;
    }

    ngOnInit(): void {
        this.loadCache();
        this.loadApiCache();
        this.onResize();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
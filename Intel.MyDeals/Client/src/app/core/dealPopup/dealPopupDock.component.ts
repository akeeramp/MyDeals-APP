import { Component, HostListener,OnDestroy } from "@angular/core"; 
import { isNull, isUndefined } from "underscore";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


import { AppEvent, broadCastService } from "./broadcast.service";
import { quickDealConstants } from "../angular.constants";

@Component({
    selector: 'deal-popup-dock-angular',
    templateUrl: 'Client/src/app/core/dealPopup/dealPopupDock.component.html', 
})
export class dealPopupDockComponent implements OnDestroy {
    ids: any= [];
    recent: any = []; 
    menuOrientation = 'horizontal'; 
    storage = localStorage;
    maxItems: any;
    maxRecent: any;
    isEnabled: any;
    screenHeight: number;
    screenWidth: number;
    errormsg = "";
    ismaxDealsOpened = false;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();

    constructor(private broadcastService: broadCastService) {
        this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth; 
    }

    intializedealpopupDock() {
        this.broadcastService.on("QuickDealToggleDeal").pipe(takeUntil(this.destroy$)).subscribe(event => {
            this.subscribeEvents(event.payload);
        });
        this.broadcastService.on("QuickDealWidgetClosed").pipe(takeUntil(this.destroy$)).subscribe(event => {
            this.subscribeEvents(event.payload);
        });

        this.maxItems = quickDealConstants.maxQuickDeals;
        this.maxRecent = quickDealConstants.maxRecent;
        this.isEnabled = quickDealConstants.enabled;

        if (window.navigator.userAgent.indexOf("Chrome") < 0) this.isEnabled = false;
        this.ids = JSON.parse(this.storage.getItem('dealPopupDockData'));

        if (this.ids == undefined || this.ids == null) {
            this.ids = [];
        }
        this.recent = JSON.parse(this.storage.getItem('dealPopupDockRecentData'));
        if (this.recent == undefined || this.recent == null) {
            this.recent = []
        }
    }
     
    save() {
        this.storage.setItem('dealPopupDockData', JSON.stringify(this.ids));
        this.storage.setItem('dealPopupDockRecentData', JSON.stringify(this.recent));
        const RECENT_DEALS = JSON.parse(this.storage.getItem('dealPopupDockRecentData'));
        if (RECENT_DEALS.length > this.maxRecent) {
            RECENT_DEALS.pop();
            this.storage.setItem('dealPopupDockRecentData', JSON.stringify(RECENT_DEALS));
        }
    } 

    addIdBase(id, top, left, isOpen) {
        if (isOpen == undefined) {
            isOpen = false
        }

        let found = false;
        for (let i = 0; i < this.ids.length; i++) {
            if (this.ids[i].id === id) {
                found = true;
                this.ids[i].top = top;
                this.ids[i].left = left;
            }
        }
        if (!found) {
            this.ids.push({
                id: id,
                top: top,
                left: left,
                isOpen: isOpen,
                position: {
                    x: 0,
                    y: 0
                }
            });
        }

        let foundRecent = false;
        for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].id === id) {
                foundRecent = true;
                this.recent[i].top = top;
                this.recent[i].left = left;
            }
        }

        if (!foundRecent) {
            this.recent.push({
                id: id,
                top: top,
                left: left,
                isOpen: false,
                position: {
                    x: 0,
                    y: 0
                }
            });
        }
        this.save();
    }

    addId(id, top, left) {
        this.addIdBase(id, top, left, undefined);
    }

    addToDockId(id, top, left) {
        this.addIdBase(id, top, left, true);
    }

    delId(id) {
        for (let i = this.ids.length - 1; i >= 0; --i) {
            if (this.ids[i].id === id) {
                this.ids.splice(i, 1);
            }
        }

        this.storage.setItem('dealPopupDockData', JSON.stringify(this.ids));
    }

    recentClicked(event, id) {
        const X = event.clientX + 90;
        const Y = event.clientY + 2; 
        this.quickDealToggle("QuickDealToggleDeal",id,Y,X);
    }

    quickDealToggle(event, id, y, x) {
        if (this.ids.length >= this.maxItems) {
            this.ismaxDealsOpened = true;
            this.errormsg = "Only " + this.maxItems + " Quick Deals can be opened at one time. Please close one before trying to open this deal.";
            return;
        }

        let found = false;
        for (let i = 0; i < this.ids.length; i++) {
            if (this.ids[i].id === id) {
                found = true;
            }
        }

        if (found) {
            this.delId(id);
        } else {
            this.addToDockId(id, y, x);
        }
    }

    subscribeEvents(result) {
        if (result.key == "QuickDealToggleDeal") {
            this.quickDealToggle(result.key, result.id, result.y, result.x);
        } else if (result.key == "QuickDealWidgetOpened") {
            this.addId(result.id, result.y, result.x);
        } else if (result.key == "QuickDealWidgetClosed") {
            this.delId(result.id);
        } else if (result.key == "QuickDealWidgetMoved") {
            this.addId(result.id, result.y, result.x);
        }
    }

    closeAll() {
        this.ids = [];
        this.storage.setItem('dealPopupDockData', JSON.stringify(this.ids));
    }

    closeAction() {
        this.ismaxDealsOpened = false;
    }

    cascadeAll() {
        const OFFSET = 25;
        const INIT_X = 75;
        const INIT_Y = 120;
        for (let i = 0; i < this.ids.length; i++) {
          const item = this.ids[i]; 
            const LEFT = INIT_X + (i * OFFSET);
            const TOP = INIT_Y + (i * OFFSET);
            item.left = LEFT;
            item.top = TOP;
            item.position = { x: LEFT, y: TOP }; 
        }      
        this.save();
        this.broadcastService.dispatch(new AppEvent("QuickDealShowPanel", "showpanel"));
    }

    lowerAll() {
        const INIT_X = 75;
        let initY = 0;
        if (this.screenHeight > 890) {
            initY = this.screenHeight - 800;
        } else {
            initY = this.screenHeight - 520;
        }

        const OFFSET_X = 100;
        for (let i = 0; i < this.ids.length; i++) {
            const ITEM = this.ids[i];
            const LEFT = INIT_X + (i * OFFSET_X);
            ITEM.left = LEFT;
            ITEM.top = initY;
            ITEM.position = { x: LEFT, y: initY }; 
        }

        this.broadcastService.dispatch(new AppEvent("QuickDealClosePanel", "hidepanel"));
    }

    tileAll() {
        const OFFSET_X = 300;
        const OFFSET_Y = 120;
        const INIT_X = 75;
        const INIT_Y = 90;
        const DOCUMENT_WIDTH = this.screenWidth - 800;
        let r = 0;
        let c = 0;

        for (let i = 0; i < this.ids.length; i++) {
            const ITEM = this.ids[i];
            const LEFT = INIT_X + (c * OFFSET_X);
            const TOP = INIT_Y + (r * OFFSET_Y);
            ITEM.left = LEFT;
            ITEM.top = TOP;
            c++;
            if (((c + 1) * OFFSET_X) > DOCUMENT_WIDTH) {
                c = 0;
                r++;
            }
            ITEM.position = { x: LEFT, y: TOP }; 
        }
        this.save();
        this.broadcastService.dispatch(new AppEvent("QuickDealShowPanel", "showpanel"));
    }

    ngOnInit() { 
        this.intializedealpopupDock();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
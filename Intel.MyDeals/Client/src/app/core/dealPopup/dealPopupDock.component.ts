import { Component, HostListener } from "@angular/core"; 
import { AppEvent, broadCastService } from "./broadcast.service";
import { quickDealConstants } from "../angular.constants";

@Component({
    selector: "deal-popup-dock-angular",
    templateUrl: "Client/src/app/core/dealPopup/dealPopupDock.component.html", 
})
export class dealPopupDockComponent  {
    ids: any= [];
    recent: any = []; 
    menuOrientation = "horizontal"; 
    storage = localStorage;
    maxItems: any;
    maxRecent: any;
    isEnabled: any;
    screenHeight: number;
    screenWidth: number;
    errormsg = "";
    ismaxDealsOpened= false;
    constructor(private brdcstservice: broadCastService) {
        this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth; 
    }
    intializedealpopupDock() {
        this.brdcstservice.on("QuickDealToggleDeal").subscribe(event => {
            this.subscribeEvents(event.payload);
        });
        this.brdcstservice.on("QuickDealWidgetClosed").subscribe(event => {
            this.subscribeEvents(event.payload);
        });

        this.maxItems = quickDealConstants.maxQuickDeals;
        this.maxRecent = quickDealConstants.maxRecent;
        this.isEnabled = quickDealConstants.enabled;

        if (window.navigator.userAgent.indexOf("Chrome") < 0) this.isEnabled = false;
        this.ids = JSON.parse(this.storage.getItem('dealPopupDockData'));

        if (this.ids === undefined || this.ids === null) {
            this.ids = [];
        }
        this.recent = JSON.parse(this.storage.getItem('dealPopupDockRecentData'));
        if (this.recent === undefined || this.recent === null) this.recent = [];
    }
     
    //save
    save() {
        this.storage.setItem('dealPopupDockData', JSON.stringify(this.ids));
        this.storage.setItem('dealPopupDockRecentData', JSON.stringify(this.recent));
        const recentdeals = JSON.parse(this.storage.getItem('dealPopupDockRecentData'));
        if (recentdeals.length > this.maxRecent) {
            recentdeals.pop();
            this.storage.setItem('dealPopupDockRecentData', JSON.stringify(recentdeals));
        }
    } 

    addIdBase(id, top, left, isOpen) {
         if (isOpen === undefined) isOpen = false;

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
        const x = event.clientX + 90;
        const y = event.clientY + 2; 
        this.QuickDealToggle("QuickDealToggleDeal",id,y,x);
    }

    QuickDealToggle(Event, id, y, x) {
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
            this.QuickDealToggle(result.key, result.id, result.y, result.x);
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
        const offset = 25;
        const initX =5;
        const initY = 20;
        for (let i = 0; i < this.ids.length; i++) {
          const item = this.ids[i]; 
            const l = initX + (i * offset);
            const t = initY + (i * offset);
            item.left = l;
            item.top = t;
            item.position = { x: l, y: t }; 
        }      
        this.save();
        this.brdcstservice.dispatch(new AppEvent("QuickDealShowPanel", "showpanel"));
    }

    lowerAll() {
       
        const initX = 5;
        let initY = 0;
        if (this.screenHeight > 890) {
            initY = this.screenHeight - 600;
        } else {
            initY = this.screenHeight - 480;

        }
        const offsetX = 100;
        for (let i = 0; i < this.ids.length; i++) {
            const item = this.ids[i];
             const l = initX + (i * offsetX);
            item.left = l;
            item.top = initY;
            item.position = { x: l, y: initY }; 
        }

        this.brdcstservice.dispatch(new AppEvent("QuickDealClosePanel", "hidepanel"));
    }
    tileAll() { 
        const offsetX = 300;
        const offsetY = 120;
        const initX = 5;
        const initY = 5;
        const docWidth = this.screenWidth-800;
        let r = 0;
        let c = 0;

        for (let i = 0; i < this.ids.length; i++) {
            const item = this.ids[i];
            const l = initX + (c * offsetX);
            const t = initY + (r * offsetY);
            item.left = l;
            item.top = t;
            c++;
            if (((c + 1) * offsetX) > docWidth) {
                c = 0;
                r++;
            }
            item.position = { x: l, y: t }; 
        }
        this.save();
        this.brdcstservice.dispatch(new AppEvent("QuickDealShowPanel", "showpanel"));
    }

    ngOnInit() { 
        this.intializedealpopupDock();
    }
}
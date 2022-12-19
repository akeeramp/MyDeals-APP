import { Component, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import * as _ from 'underscore';

@Component({
    selector: "floating-action",
    templateUrl: "Client/src/app/core/floatingAction/floatingAction.component.html",
    styleUrls: ['Client/src/app/core/floatingAction/floatingAction.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class floatingActioncomponent {
    constructor( ) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }    

    private menuList: any = [];
    private isdropped = false;
    @Output() onAction = new EventEmitter();

    toggle() { 
        _.each(this.menuList, (items) => {
            if (items.status == "open") {
               
                    items.status = "close";
            } else {
                if (items.actionName != "Action")
                    items.status = "open";
            }
        });

        if (this.isdropped) {
            _.each(this.menuList, (items) => {
                if (items.status == "open") {
                    items.status = "close";
                }
            });
            this.isdropped = false;
        } 
    }

    drop() {
        this.isdropped = true;
    }

    onActionClick(actionName) {
       this.onAction.emit(actionName);
    }

    AddItems() {
       this.menuList = [             
           {
               actionName: "Approve",
               color: "#24B9F1",
               status: "open"
           },
           {
               actionName: "Revise",
               color: "#4DC8F1s",
               status: "open"
           },
           {
               actionName: "Offer",
               color: "#6CCBF1",
               status: "open"
           },
           {
               actionName: "Won",
               color: "#89D4F1",
               status: "open"
           },
           {
               actionName: "Lost",
               color: "#A1DBF1",
               status: "open"
           },
        ]
    }
    start() {
        _.each(this.menuList, (items) => {
            if (items.status == "open") {
                items.status = "close";
            }
        });
    }

    ngOnInit() {
        this.AddItems();        
    }
}
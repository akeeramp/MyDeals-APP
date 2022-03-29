import * as angular from "angular";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, CompactType } from 'angular-gridster2';
import { downgradeComponent } from "@angular/upgrade/static";
import { MatDialog } from '@angular/material/dialog';
import { addWidgetComponent } from "../addWidget/addWidget.component";
import { widgetSettingsComponent } from "../widgetSettings/widgetSettings.component";
import { widgetConfig } from "../widget.config";
import * as _ from "underscore";
import * as moment from 'moment';
import { contractStatusWidgetService } from '../contractStatusWidget.service';

interface Item {
    text: string;
    value: number;
}
@Component({
    selector: 'app-dashboard',
    templateUrl: 'Client/src/app/dashboard/dashboard/dashboard.component.html',
    styleUrls: ['Client/src/app/dashboard/dashboard/dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    constructor(protected dialog: MatDialog, protected cntrctWdgtSvc: contractStatusWidgetService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    options: GridsterConfig;
    dashboard: GridsterItem[];
    resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

    @Output() refreshEvent = new EventEmitter<any>();

    private startDateValue: Date = new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(moment().add(6, 'months').format("MM/DD/YYYY"));
    
    public custNameList: Array<any> = [
        { text: "Apple", value: 5758 },
        { text: "Acer", value: 2348 },
        { text: "Lenovo", value: 4006 },
        { text: "Dell", value: 2 },
        { text: "HP", value: 1774 },
    ];
    public selectedCustNames: Item[];

    addItem(): void {
        this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
    }

    removeItem($event: MouseEvent | TouchEvent, item: any): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }

    openWidgetSettings(index) {
        const dialogRef = this.dialog.open(widgetSettingsComponent, {
            data: { 'renameItem': this.dashboard[index].name },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dashboard[index].name = result;
                this.options.api.optionsChanged();
            }
        });

    }

    openPopUp() {
        let vm = this;
        let widgets = this.dashboard;
        const dialogRef = this.dialog.open(addWidgetComponent, {
            width: '600px',
            data: { name: "Add a Widget", widgets: widgets },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let widget = _.findWhere(widgetConfig, { type: result });
                vm.dashboard.push({ cols: widget.position.col, rows: widget.position.row, y: widget.size.y, x: widget.size.x, type: widget.type, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, name: widget.name });
                vm.options.api.optionsChanged();
            }
        });
    }

    //get dashboard config details api
    public getWidgetConfig() {
    }

    //update api
    public saveWidgetConfig(type: string, config: any) {
        console.log("SaveWidgetConfig :", type, config);
    }

    refreshWidget(item: any) {
        //Refresh logic of gridstatusboard is migrated and handled here
        if (item.type === "contractstatus") {
            this.cntrctWdgtSvc.isRefresh.next(true);
        }
    }

    ngOnInit(): void {
        // this.options = {
        //   gridType: GridType.Fit,
        //   displayGrid: DisplayGrid.Always,
        //   disableWindowResize: false,
        //   scrollToNewItems: false,
        //   disableWarnings: false,
        //   ignoreMarginInRow: false,
        //   itemResizeCallback: (item) => {
        //     // update DB with new size
        //     // send the update to widgets
        //     this.resizeEvent.emit(item);
        //   }
        // };
        let dashboardItems = [];
        _.each(widgetConfig, item => {
            dashboardItems.push({ cols: item.position.col, rows: item.position.row, y: item.size.y, x: item.size.x, type: item.type, canRefresh: item.canRefresh, canSetting: item.canChangeSettings, isAdded: item.isAdded, name: item.name });
        });

        this.dashboard = dashboardItems;

        this.options = {
            gridType: GridType.Fit,
            compactType: CompactType.CompactLeftAndUp,
            displayGrid: DisplayGrid.Always,
            pushItems: false,
            swap: true,
            swapWhileDragging: false,
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true
            },
            itemResizeCallback: (item) => {
                // update DB with new size
                // send the update to widgets
                this.resizeEvent.emit(item);
            }
        };
    }
    ngAfterViewInit(){
      //this functionality will enable when dashboard landing to this page
     document.getElementsByClassName('loading-screen')[0].setAttribute('style','display:none');
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "appDashboard",
    downgradeComponent({
        component: DashboardComponent,
    })
);

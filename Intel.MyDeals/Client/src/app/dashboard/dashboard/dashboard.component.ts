import * as angular from "angular";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, CompactType } from 'angular-gridster2';
import { downgradeComponent } from "@angular/upgrade/static";
import { MatDialog } from '@angular/material/dialog';
import { addWidgetComponent } from "../addWidget/addWidget.component";
import { widgetSettingsComponent } from "../widgetSettings/widgetSettings.component";
import { widgetConfig } from "../widget.config";
import * as _ from "underscore";
import * as moment from 'moment';
import { contractStatusWidgetService } from '../contractStatusWidget.service';
import { GlobalSearchResultsComponent } from "../../advanceSearch/globalSearchResults/globalSearchResults.component";

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
    @ViewChild(GlobalSearchResultsComponent) GlobalSearchResults: GlobalSearchResultsComponent;
    @Output() refreshEvent = new EventEmitter<any>();

    private startDateValue: Date = new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(moment().add(6, 'months').format("MM/DD/YYYY"));
    //using for kendo-window  search option
    private searchText = "";
    private opType = "ALL";
    private windowOpened = false;
    private windowTop = 220; windowLeft = 370; windowWidth = 950; windowHeight = 500; windowMinWidth = 100;
    private searchDialogVisible = false;

    public custNameList: Array<any> = [
        { text: "Apple", value: 5758 },
        { text: "Acer", value: 2348 },
        { text: "Lenovo", value: 4006 },
        { text: "Dell", value: 2 },
        { text: "HP", value: 1774 },
    ];

    public custData: any;
    public selectedCustNames: Item[];
    public selectedCustomerIds = [];
    public includeTenders = true;


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
        const widgets = this.dashboard;
        const dialogRef = this.dialog.open(addWidgetComponent, {
            width: '600px',
            data: { name: "Add a Widget", widgets: widgets },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const widget = _.findWhere(widgetConfig, { type: result });
                this.dashboard.push({ cols: widget.position.col, rows: widget.position.row, y: widget.size.y, x: widget.size.x, type: widget.type, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, name: widget.name });
                this.options.api.optionsChanged();
            }
        });
    }

    //get dashboard config details api
    public getWidgetConfig() {
        //will be implemented once dashboard component ready 
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
    refreshAllWidgets() {
        this.refreshtoDashboardDefault();
        // Loop through all current (visible) widgets and if the widget has a canRefresh enabled, refresh it.
        for (var i = 0; i < this.dashboard.length; i++) {
            if (this.dashboard[i]["canRefresh"] == true)
                this.refreshWidget(this.dashboard[i]);
        }
    }

    refreshtoDashboardDefault() {
        this.startDateValue = new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
        this.endDateValue = new Date(moment().add(6, 'months').format("MM/DD/YYYY"));

        this.selectedCustomerIds = [];
        this.includeTenders = true;
    }

    defaultLayout() {
        //to be done during dashboard integration 
    }

    showHelpTopic() {
        const helpTopic = "Filtering+Dashboard";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }
    //********************* search widget functions*************************
    enterPressed(event: any, searchText: any) {
        this.searchText = searchText;
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13 && this.searchText != "") {
            //opening kendo window
            this.setWindowWidth();
            this.windowOpened = true;
        }
        if (event.keyCode === 13 && this.searchText == "") {
            this.searchDialogVisible = true;
        }
    }
    setWindowWidth() {
        if (this.opType == "ALL") {
            this.windowWidth = 1000;
        }
        else {
            this.windowWidth = 600;
        }
    }
    closeDialog() {
        this.searchDialogVisible = false;
    }
    windowClose() {
        this.windowOpened = false;
    }
    //these methond is an output method from globaslsearchresult component
    getWindowWidth($event: number) {
        this.windowWidth = $event;
    }
    isWindowOpen($event: boolean) {
        this.windowOpened = $event;
    }
    onOpChange(opType: string, searchText: string) {
        this.searchText = searchText;
        if (this.searchText != "") {
            //opening kendo window
            this.opType = opType;
            this.setWindowWidth();
            //this condition is required since this should work only id kendo window is open 
            if (this.GlobalSearchResults) {
                this.GlobalSearchResults.onOpTypeChange(this.opType);
                this.windowOpened = true;
            }

        }
    }
    //********************* search widget functions*************************
    ngOnInit(): void {
        const dashboardItems = [];
        _.each(widgetConfig, item => {
            dashboardItems.push({ cols: item.position.col, rows: item.position.row, y: item.size.y, x: item.size.x, type: item.type, canRefresh: item.canRefresh, canSetting: item.canChangeSettings, isAdded: item.isAdded, name: item.name });
        });

        this.dashboard = dashboardItems;

        this.options = {
            gridType: GridType.Fit,
            allowMultiLayer: true,
            compactType: CompactType.CompactLeftAndUp,
            displayGrid: DisplayGrid.Always,
            pushItems: false,
            swap: true,
            margin: 5,
            maxCols: 20,
            swapWhileDragging: false,
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true,

            },
            itemResizeCallback: (item) => {
                // update DB with new size
                // send the update to widgets
                this.resizeEvent.emit(item);
            }
        };

        this.cntrctWdgtSvc.getCustomerDropdowns()
            .subscribe((response: Array<any>) => {
                this.custData = response;
            }, function (error) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }

    ngAfterViewInit() {
        //this functionality will enable when dashboard landing to this page
        document.getElementsByClassName('loading-screen')[0].setAttribute('style', 'display:none');
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

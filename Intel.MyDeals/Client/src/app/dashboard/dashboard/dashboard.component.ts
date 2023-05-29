import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, CompactType } from 'angular-gridster2';
import { MatDialog } from '@angular/material/dialog';
import { addWidgetComponent } from "../addWidget/addWidget.component";
import { widgetSettingsComponent } from "../widgetSettings/widgetSettings.component";
import { configWidgets, configLayouts } from "../widget.config";
import { findWhere, each } from 'underscore';
import { MomentService } from "../../shared/moment/moment.service";
import { contractStatusWidgetService } from '../contractStatusWidget.service';
import { GlobalSearchResultsComponent } from "../../advanceSearch/globalSearchResults/globalSearchResults.component";
import { userPreferencesService } from "../../shared/services/userPreferences.service";
import { logger } from "../../shared/logger/logger";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { SecurityService } from "../../shared/services/security.service";

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
    constructor(protected dialog: MatDialog,
                protected cntrctWdgtSvc: contractStatusWidgetService,
                protected usrPrfrncssvc: userPreferencesService,
                protected loggerSvc: logger,
                private securitySVC: SecurityService,
                private momentService: MomentService) {}
    dashboard: GridsterItem[];
    resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
    @ViewChild(GlobalSearchResultsComponent) GlobalSearchResults: GlobalSearchResultsComponent;
    @Output() refreshEvent = new EventEmitter<any>();

    private startDateValue: Date = new Date(this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(this.momentService.moment().add(6, 'months').format("MM/DD/YYYY"));
    //using for kendo-window  search option
    private searchText = "";
    private opType = "ALL";
    private windowOpened = false;
    private windowTop = 130; windowLeft = 300; windowWidth = 950; windowHeight = 500; windowMinWidth = 100;
    private searchDialogVisible = false;
    private selectedDashboardId;
    private isLoading = false;

    public custData: any;
    public selectedCustNames: Item[];
    public selectedCustomerIds = [];
    public includeTenders = true;
    public savedWidgetSettings;
    options: GridsterConfig = {
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
            enabled: true,
            stop: (e, ui, $widget) => {
                this.saveWidgetPositions(ui, 'size');
            }

        },
        resizable: {
            enabled: true,
            stop: (e, ui, $widget) => {
                this.saveWidgetPositions(ui, 'position');
            }

        },
        itemResizeCallback: (item) => {
            // update DB with new size
            // send the update to widgets
            this.resizeEvent.emit(item);
        }
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    };

    addItem(): void {
        this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
    }

    removeItem($event: MouseEvent | TouchEvent, item: any): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
        this.saveLayout();
        this.gridValsMinus();
    }

    onCustomerChange(custData) {
        window.localStorage.selectedCustNames = JSON.stringify(custData);
    }

    onDateChange(value, dateChanged) {
        if (dateChanged == "startDateChange") {
            window.localStorage.startDateValue = value;
        }
        else if (dateChanged == "endDateChange") {
            window.localStorage.endDateValue = value;
        }
    }

    openWidgetSettings(index) {
        const dialogRef = this.dialog.open(widgetSettingsComponent, {
            data: { 'renameItem': this.dashboard[index].name },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.dashboard[index].name !== result) {
                    this.dashboard[index].name = result;
                    this.saveLayout();
                    this.options.api.optionsChanged();
                }
            }
        });

    }

    openPopUp() {
        const widgets = this.dashboard;
        const dialogRef = this.dialog.open(addWidgetComponent, {
            width: '600px',
            data: { name: "Add a Widget", widgets: widgets },
            panelClass: 'add-widget-box',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let widgetdet = findWhere(configWidgets, { type: result });
                if (widgetdet) {
                    const widget = JSON.parse(JSON.stringify(widgetdet))
                    if (widget.canAdd) {
                        // Don't set a position, so that the widget will be added "smartly" wherever space is available.
                        this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: null, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: null, rows: null, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                        this.saveLayout();
                        this.gridValsPlus();
                    }
                    this.options.api.optionsChanged();
                }
            }
        });
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
        for (let i = 0; i < this.dashboard.length; i++) {
            if (this.dashboard[i]["canRefresh"] == true)
                this.refreshWidget(this.dashboard[i]);
        }
    }


    refreshtoDashboardDefault() {
        window.localStorage.startDateValue = this.startDateValue;
        window.localStorage.endDateValue = this.endDateValue;
        window.localStorage.selectedDashboardId = this.selectedDashboardId;
    }

    async getSavedWidgetSettings(key, useSavedWidgetSettings) {
        let response:any = await this.usrPrfrncssvc.getActions("Dashboard", "Widgets").toPromise().catch((err) => {
            this.loggerSvc.error("Unable to get Widget Data","Error",err);
        });
        if (response && response.length > 0) {
            const savedWidgetSettingsForSpecifiedRole = findWhere(response, { PRFR_KEY: "1" });
            if (savedWidgetSettingsForSpecifiedRole) {
                this.savedWidgetSettings = JSON.parse(savedWidgetSettingsForSpecifiedRole.PRFR_VAL);
            }
            this.initDashboard(key, useSavedWidgetSettings);
        }
    }

    async saveLayout() {
        await this.usrPrfrncssvc.updateActions("Dashboard", "Widgets", this.selectedDashboardId,
            this.dashboard).toPromise().catch((error) => {
                    this.loggerSvc.error("Unable to update User Preferences.", error, error.statusText);
                });
    }
    // this function is triggered from gridStatusBoard.component.ts 'onFavChange'
    favContractChanged(favContractIds) {
        for (let i = 0; i < this.dashboard.length; i++) {
            if (!!this.dashboard[i].subConfig && this.dashboard[i].subConfig.favContractIds !== undefined) {
                this.dashboard[i].subConfig.favContractIds = favContractIds;
            }
        }
        this.saveLayout();
    }
    // this function is triggered from gridStatusBoard.Component.ts 'clkFilter()'
    gridFilterChanged(gridFilter) {
        for (let i = 0; i < this.dashboard.length; i++) {
            if (!!this.dashboard[i].subConfig && this.dashboard[i].subConfig.gridFilter !== undefined) {
                this.dashboard[i].subConfig.gridFilter = gridFilter;
            }
        }
        this.saveLayout();
    }

    initDashboard(key, useSavedWidgetSettings) {

        if (useSavedWidgetSettings && this.savedWidgetSettings.length > 0) {
            for (let i = 0; i < this.savedWidgetSettings.length; i++) {
                let widgetdet = findWhere(configWidgets, { id: this.savedWidgetSettings[i].id });
                if (widgetdet) {
                    const widget = JSON.parse(JSON.stringify(widgetdet))
                    widget.name = this.savedWidgetSettings[i].name;
                    widget.size = this.savedWidgetSettings[i].size;
                    widget.position = this.savedWidgetSettings[i].position;
                    if (widget.subConfig) {
                        widget.subConfig = this.savedWidgetSettings[i].subConfig;
                    }
                    if (widget.widgetConfig) {
                        widget.widgetConfig = this.savedWidgetSettings[i].widgetConfig;
                    }
                    if (widget.position == null) {
                        this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: null, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: null, rows: null, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                    }
                    else {
                        this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: { cols: widget.position.cols, rows: widget.position.cols }, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: widget.position.cols, rows: widget.position.rows, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                    }
                    this.options.api.optionsChanged();
                }
            }
        }
        else {
            let defaultLayout = findWhere(configLayouts, { id: key });
            if (defaultLayout) {
                const defLayout = JSON.parse(JSON.stringify(defaultLayout));
                const defWidget = defLayout.widgets;
                for (let i = 0; i < defWidget.length; i++) {
                    let widgetdet = findWhere(configWidgets, { id: defWidget[i].id });
                    if (widgetdet) {
                        const widget = JSON.parse(JSON.stringify(widgetdet))
                        if (widget.position == null) {
                            this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: null, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: null, rows: null, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                        }
                        else {
                            this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: { cols: widget.position.cols, rows: widget.position.cols }, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: widget.position.cols, rows: widget.position.rows, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                        }
                        this.options.api.optionsChanged();
                    }
                }
            }
        }
    }

    async defaultLayout() {
        this.isLoading = true;
        await this.addWidgetByKey('1', false);
        await this.saveLayout();
        this.isLoading = false;
    }

    showHelpTopic() {        
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Dashboard.aspx', '_blank');
    }
    //********************* search widget functions*************************
    enterPressed(event: any, searchText: any) {
        this.searchText = searchText;
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13 && this.searchText != "") {
            //opening kendo window
            this.onOpChange('ALL', searchText);
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
            //this condition is required since this should work only if global search modal is already open 
            if (this.GlobalSearchResults) {
                this.GlobalSearchResults.onOpTypeChange(this.opType);
                this.windowOpened = true;
            }else{
                this.windowOpened = true;
            }
        }else{
            this.searchDialogVisible = true;
        }
    }

    async addWidgetByKey(key, useSavedWidgetSettings) {
        this.dashboard = [];
        await this.getSavedWidgetSettings(key, useSavedWidgetSettings);
    }

    saveWidgetPositions(ui, field) {
        const grids = ui.gridster.grid;
        for (let i = 0; i < grids.length; i++) {
            const item = grids[i].$item;
            for (let j = 0; j < this.dashboard.length; j++) {
                if (this.dashboard[j].type == grids[i].item.type) {
                    if (field === 'position') {
                        this.dashboard[i].position = { cols: item.cols, rows: item.rows };
                        this.dashboard[i].cols = item.cols;
                        this.dashboard[i].rows = item.rows;
                    }
                    else if (field === 'size') {
                        this.dashboard[i].size = { x: item.x, y: item.y };
                        this.dashboard[i].x = item.x;
                        this.dashboard[i].y = item.y;
                    }
                }
            }
        }
        this.saveLayout();
    }

    //********************* search widget functions*************************
    ngOnInit(): void {
        document.title = "Dashboard - My Deals";
        this.selectedCustNames = window.localStorage.selectedCustNames ? JSON.parse(window.localStorage.selectedCustNames) : [];
        this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
        this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;
        this.addWidgetByKey('1', true);
        window.localStorage.selectedDashboardId = "1";
        this.selectedDashboardId = window.localStorage.selectedDashboardId ? window.localStorage.selectedDashboardId : "1";


        this.cntrctWdgtSvc.getCustomerDropdowns()
            .subscribe((response: Array<any>) => {
                if(response && response.length>0){
                    this.custData = response;
                }
                else{
                    this.loggerSvc.error("No result found.", 'Error');
                }
            }, function (error) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }

    navAddClass() {
        var zIndexZero = $("body");
        var textIndex = zIndexZero.hasClass("z-index-zero")
        if (textIndex) {
            zIndexZero.removeClass("z-index-zero");
        } else {
            zIndexZero.addClass("z-index-zero");
        } 
    }

    navRemoveClass() {
        $("body").removeClass("z-index-zero");
    }

    gridValsPlus() {
        var parent = document.getElementById("parentID");
        var nodesSameClass = parent.getElementsByClassName("few-grid-find");
        var testnodesSameClass = nodesSameClass.length + 1;
        if (testnodesSameClass > 3) {
            $("#height-grids").removeClass("sum-fixes");
            $("#height-grids").addClass("sum-fixes-plus");
        } else {
            $("#height-grids").addClass("sum-fixes");
            $("#height-grids").removeClass("sum-fixes-plus");
        }
    }

    gridValsMinus() {
        var parentMin = document.getElementById("parentID");
        var nodesSameClassMin = parentMin.getElementsByClassName("few-grid-find");
        var testnodesSameClassMin = nodesSameClassMin.length - 1;
        if (testnodesSameClassMin > 3) {
            $("#height-grids").removeClass("sum-fixes");
            $("#height-grids").addClass("sum-fixes-plus");
        } else {
            $("#height-grids").addClass("sum-fixes");
            $("#height-grids").removeClass("sum-fixes-plus");
        }
    }

    gridValsCheck() {
        var parentCheck = document.getElementById("parentID");
        var nodesSameClassCheck = parentCheck.getElementsByClassName("few-grid-find");
        var testnodesSameClassCheck = nodesSameClassCheck.length;
        if (testnodesSameClassCheck > 3) {
            $("#height-grids").removeClass("sum-fixes");
            $("#height-grids").addClass("sum-fixes-plus");
        } else {
            $("#height-grids").addClass("sum-fixes");
            $("#height-grids").removeClass("sum-fixes-plus");
        }
    }
}
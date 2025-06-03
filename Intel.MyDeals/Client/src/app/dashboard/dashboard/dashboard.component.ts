import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, CompactType } from 'angular-gridster2';
import { MatDialog } from '@angular/material/dialog';
import { findWhere } from 'underscore';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { addWidgetComponent } from "../addWidget/addWidget.component";
import { widgetSettingsComponent } from "../widgetSettings/widgetSettings.component";
import { GlobalSearchResultsComponent } from "../../advanceSearch/globalSearchResults/globalSearchResults.component";
import { configWidgets, configLayouts } from "../widget.config";
import { MomentService } from "../../shared/moment/moment.service";
import { contractStatusWidgetService } from '../contractStatusWidget.service';
import { userPreferencesService } from "../../shared/services/userPreferences.service";
import { logger } from "../../shared/logger/logger";
import { SecurityService } from "../../shared/services/security.service";

interface Item {
    text: string;
    value: number;
}

export const DASHBOARD_CONSTANTS = {
    CLASS_Z_INDEX_ZERO: 'z-index-zero',
    CLASS_FEW_GRID_FIND: 'few-grid-find',
    CLASS_SUM_FIXES: 'sum-fixes',
    CLASS_SIM_FIXES_PLUS: 'sum-fixes-plus',
    ID_HEIGHT_GRIDS: '#height-grids',
    ID_GRID_PARENT: 'parentID'
}

@Component({
    selector: 'app-dashboard',
    templateUrl: 'Client/src/app/dashboard/dashboard/dashboard.component.html',
    styleUrls: ['Client/src/app/dashboard/dashboard/dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

    constructor(protected dialog: MatDialog,
                protected contractWidgetService: contractStatusWidgetService,
                protected userPreferencesService: userPreferencesService,
                protected loggerService: logger,
                private securityService: SecurityService,
                private momentService: MomentService) {}
    dashboard: GridsterItem[];
    resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
    @ViewChild(GlobalSearchResultsComponent) GlobalSearchResults: GlobalSearchResultsComponent;
    @Output() refreshEvent = new EventEmitter<any>();

    private MIN_VALID_DATE: Date = new Date(1753, 1, 1);  // SQL Limit
    private MAX_VALID_DATE: Date = new Date(9999, 12, 31);  // SQL Limit
    private startDateValue: Date = new Date(this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(this.momentService.moment().add(6, 'months').format("MM/DD/YYYY"));
    //using for kendo-window  search option
    private searchText = "";
    private opType = "ALL";
    private windowOpened = false;
    private windowTop = 130;
    private windowLeft = 300;
    private windowWidth = 950;
    private windowHeight = 500;
    private windowMinWidth = 100;
    private searchDialogVisible = false;
    private selectedDashboardId;
    private isLoading = false;

    public custData: any;
    public selectedCustNames: Item[];
    public selectedCustomerIds = [];
    public includeTenders = true;
    public savedWidgetSettings;
    private readonly destroy$ = new Subject<void>();
    options: GridsterConfig;

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

    private isDateValid(dateToValidate: Date): boolean {
        if (dateToValidate == null || dateToValidate.toString().includes('Invalid') || dateToValidate < this.MIN_VALID_DATE || dateToValidate > this.MAX_VALID_DATE) {
            return false;
        } else {
            return true;
        }
    }

    @ViewChild('startDateTooltipTarget', { static: false }) startDateTooltip: NgbTooltip;
    @ViewChild('endDateTooltipTarget', { static: false }) endDateTooltip: NgbTooltip;
    private readonly TOOLTIP_MESSAGE_INVALID_DATE = 'Invalid Date';
    private readonly TOOLTIP_MESSAGE_END_DATE_BEFORE_START_DATE = 'The End Date cannot be before the Start Date';

    private openStartDateTooltip(message: string) {
        this.startDateTooltip.ngbTooltip = message;
        this.startDateTooltip.open();
    }

    private closeStartDateTooltip() {
        this.startDateTooltip.ngbTooltip = '';
        this.startDateTooltip.close();
    }

    private openEndDateTooltip(message: string) {
        this.endDateTooltip.ngbTooltip = message;
        this.endDateTooltip.open();
    }

    private closeEndDateTooltip() {
        this.endDateTooltip.ngbTooltip = '';
        this.endDateTooltip.close();
    }

    // Triggers a tooltip message if the End Date is before the Start Date (an invalid state)
    private endDateTooltipHandler() {
        if (this.isDateValid(this.startDateValue) && this.isDateValid(this.endDateValue)) {
            if (this.endDateValue < this.startDateValue) {
                this.openEndDateTooltip(this.TOOLTIP_MESSAGE_END_DATE_BEFORE_START_DATE)
            } else {    // Valid state
                if (this.endDateTooltip.ngbTooltip == this.TOOLTIP_MESSAGE_END_DATE_BEFORE_START_DATE) {
                    this.closeEndDateTooltip();
                }
            }
        }
    }

    onDateChange(value: Date, dateChanged: string) {
        // If valid date, then save to local storage
        if (this.isDateValid(value)) {
            if (dateChanged == "startDateChange") {
                window.localStorage.startDateValue = value; // To be persistent between sessions
                this.closeStartDateTooltip();
            } else if (dateChanged == "endDateChange") {
                window.localStorage.endDateValue = value; // To be persistent between sessions
                this.closeEndDateTooltip();
            }

            // In this order, other components that use the start/end date values where END < START could still hang, may need to reorder logic steps
            setTimeout(() => {
                this.endDateTooltipHandler();
            }, 500);
        } else {
            if (dateChanged == "startDateChange") {
                this.openStartDateTooltip(this.TOOLTIP_MESSAGE_INVALID_DATE);
            } else if (dateChanged == "endDateChange") {
                this.openEndDateTooltip(this.TOOLTIP_MESSAGE_INVALID_DATE);
            }
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
            this.contractWidgetService.isRefresh.next(true);
        }
    }

    refreshAllWidgets() {
        this.refreshtoDashboardDefault();
        // Loop through all current (visible) widgets and if the widget has a canRefresh enabled, refresh it.
        for (let i = 0; i < this.dashboard.length; i++) {
            if (this.dashboard[i]["canRefresh"] == true) {
                this.refreshWidget(this.dashboard[i]);
            }
        }
    }

    refreshtoDashboardDefault() {
        window.localStorage.startDateValue = this.startDateValue;
        window.localStorage.endDateValue = this.endDateValue;
        window.localStorage.selectedDashboardId = this.selectedDashboardId;
    }

    async getSavedWidgetSettings(key, useSavedWidgetSettings) {
        let response: any = await this.userPreferencesService.getActions("Dashboard", "Widgets").toPromise().catch((err) => {
            this.loggerService.error("Unable to get Widget Data","Error",err);
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
        await this.userPreferencesService.updateActions("Dashboard", "Widgets", this.selectedDashboardId, this.dashboard).toPromise().catch((error) => {
            this.loggerService.error("Unable to update User Preferences.", error, error.statusText);
        });
    }
    // this function is triggered from gridStatusBoard.component.ts 'onFavChange'
    favContractChanged(favContractIds) {
        for (let i = 0; i < this.dashboard.length; i++) {
            if (!!this.dashboard[i].subConfig && this.dashboard[i].subConfig.favContractIds != undefined) {
                this.dashboard[i].subConfig.favContractIds = favContractIds;
            }
        }
        this.saveLayout();
    }
    // this function is triggered from gridStatusBoard.Component.ts 'clkFilter()'
    gridFilterChanged(gridFilter) {
        for (let i = 0; i < this.dashboard.length; i++) {
            if (!!this.dashboard[i].subConfig && this.dashboard[i].subConfig.gridFilter != undefined) {
                this.dashboard[i].subConfig.gridFilter = gridFilter;
            }
        }
        this.saveLayout();
    }

    initDashboard(key, useSavedWidgetSettings) {
        if (useSavedWidgetSettings && this.savedWidgetSettings.length > 0) {
            for (let i = 0; i < this.savedWidgetSettings.length; i++) {
                let idWidgetSettings = findWhere(configWidgets, { id: this.savedWidgetSettings[i].id });
                if (idWidgetSettings) {
                    const widget = JSON.parse(JSON.stringify(idWidgetSettings))
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
                    } else {
                        this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: { cols: widget.position.cols, rows: widget.position.cols }, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: widget.position.cols, rows: widget.position.rows, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                    }

                    this.options.api.optionsChanged();
                }
            }
        } else {
            let defaultLayout = findWhere(configLayouts, { id: key });
            if (defaultLayout) {
                const defLayout = JSON.parse(JSON.stringify(defaultLayout));
                const defWidgets = defLayout.widgets;
                for (let i = 0; i < defWidgets.length; i++) {
                    let idWidgetSettings = findWhere(configWidgets, { id: defWidgets[i].id });
                    if (idWidgetSettings) {
                        const widget = JSON.parse(JSON.stringify(idWidgetSettings))
                        if (widget.position == null) {
                            this.dashboard.push({ id: widget.id, size: { x: widget.size.x, y: widget.size.y }, position: null, name: widget.name, desc: widget.desc, icon: widget.icon, type: widget.type, cols: null, rows: null, y: widget.size.y, x: widget.size.x, canRefresh: widget.canRefresh, canSetting: widget.canChangeSettings, isAdded: widget.isAdded, template: widget.template, subConfig: widget.subConfig, widgetConfig: widget.widgetConfig });
                        } else {
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
        if (event.keyCode === 13) {
            if (this.searchText == "") {
                this.searchDialogVisible = true;
            } else {
                //opening kendo window
                this.onOpChange('ALL', searchText);
                this.setWindowWidth();
                this.windowOpened = true;
            }
        }
    }
    setWindowWidth() {
        if (this.opType == "ALL") {
            this.windowWidth = 1000;
        } else {
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
            } else {
                this.windowOpened = true;
            }
        } else {
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
                    } else if (field === 'size') {
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
        // Angular-Gridster2 Config
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

        document.title = "Dashboard - My Deals";
        this.selectedCustNames = window.localStorage.selectedCustNames ? JSON.parse(window.localStorage.selectedCustNames) : [];
        this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
        this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;
        this.addWidgetByKey('1', true);
        window.localStorage.selectedDashboardId = "1";
        this.selectedDashboardId = window.localStorage.selectedDashboardId ? window.localStorage.selectedDashboardId : "1";

        this.contractWidgetService.getCustomerDropdowns()
        .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                if(response && response.length > 0){
                    this.custData = response;
                } else {
                    this.loggerService.error("No result found.", 'Error');
                }
            }, (error) => {
                this.loggerService.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }

    navAddClass() {
        const zIndexZeroComponent = $("body");
        const textIndex = zIndexZeroComponent.hasClass(DASHBOARD_CONSTANTS.CLASS_Z_INDEX_ZERO);
        if (textIndex) {
            zIndexZeroComponent.removeClass(DASHBOARD_CONSTANTS.CLASS_Z_INDEX_ZERO);
        } else {
            zIndexZeroComponent.addClass(DASHBOARD_CONSTANTS.CLASS_Z_INDEX_ZERO);
        } 
    }

    navRemoveClass() {
        $("body").removeClass(DASHBOARD_CONSTANTS.CLASS_Z_INDEX_ZERO);
    }

    gridValsPlus() {
        const parent = document.getElementById(DASHBOARD_CONSTANTS.ID_GRID_PARENT);
        const nodesSameClass = parent.getElementsByClassName(DASHBOARD_CONSTANTS.CLASS_FEW_GRID_FIND);
        const testnodesSameClass = nodesSameClass.length + 1;
        if (testnodesSameClass > 3) {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        } else {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        }
    }

    gridValsMinus() {
        const parentMin = document.getElementById(DASHBOARD_CONSTANTS.ID_GRID_PARENT);
        const nodesSameClassMin = parentMin.getElementsByClassName(DASHBOARD_CONSTANTS.CLASS_FEW_GRID_FIND);
        const testnodesSameClassMin = nodesSameClassMin.length - 1;
        if (testnodesSameClassMin > 3) {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        } else {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        }
    }

    gridValsCheck() {
        const parentCheck = document.getElementById(DASHBOARD_CONSTANTS.ID_GRID_PARENT);
        const nodesSameClassCheck = parentCheck.getElementsByClassName(DASHBOARD_CONSTANTS.CLASS_FEW_GRID_FIND);
        const testnodesSameClassCheck = nodesSameClassCheck.length;
        if (testnodesSameClassCheck > 3) {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        } else {
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).addClass(DASHBOARD_CONSTANTS.CLASS_SUM_FIXES);
            $(DASHBOARD_CONSTANTS.ID_HEIGHT_GRIDS).removeClass(DASHBOARD_CONSTANTS.CLASS_SIM_FIXES_PLUS);
        }
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
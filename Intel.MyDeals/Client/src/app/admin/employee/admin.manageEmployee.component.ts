import * as angular from 'angular';
import { Component, ViewEncapsulation } from "@angular/core"
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { manageEmployeeService } from "./admin.manageEmployee.service";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ManageEmployeeModalComponent } from './admin.manageEmployeeModal.component';

@Component({
    selector: "manageEmployee",
    templateUrl: "Client/src/app/admin/employee/admin.manageEmployee.component.html",
    styleUrls: ['Client/src/app/admin/employee/admin.manageEmployee.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class manageEmployeeComponent {
    constructor(private manageEmployeeSvc: manageEmployeeService, private loggerSvc: logger, private sanitizer: DomSanitizer, protected dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
        this.allData = this.allData.bind(this);
    }

    private Roles: Array<string> = ["CBA", "DA", "Finance", "FSE", "GA", "Legal", "RA", "SA", "MyDeals SA", "Net ASP SA", "Rebate Forecast SA", "WRAP SA"];
    private Geos: Array<string> = ["APAC", "ASMO", "EMEA", "IJKK", "PRC", "Worldwide"];

    private isLoading = true;
    public gridData: GridDataResult;
    private gridResult: Array<any>;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [
                {
                    field: "ACTV_IND",
                    operator: "eq",
                    value: true
                },
            ],
        }
    };
    public operator = "contains";
    private renderCust = { data: null, isCustClickable: false };
    private custData;
    private renderVert = { data: null, isVertClickable: false };
    private vertData;
    private showKendoAlert = false;

    private pageSizes: PageSizeItem[] = [
        {
            text: "25",
            value: 25,
        },
        {
            text: "100",
            value: 100,
        },
        {
            text: "500",
            value: 500,
        },
        {
            text: "All",
            value: "all",
        }
    ];
    private excelColumns = {
        "EMP_WWID": "WWID",
        "FULL_NAME": "Name",
        "USR_ROLE": "Roles",
        "USR_GEOS": "Geos",
        "USR_CUST": "Customers",
        "USR_VERTS": "Verticals",
        "ACTV_IND": "Active",
        "IS_SUPER": "Super",
        "IS_DEVELOPER": "Developer",
        "IS_TESTER": "Tester",
        "LST_MOD_BY": "Last Mod By",
        "LST_MOD_DT": "Last Mod Date",
        "NOTES": "Notes",
    }

    returnZero() {
        return 0
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    public cellOptions = {
        textAlign: "left",
        wrap: true
    };

    public headerCellOptions = {
        textAlign: "center",
        background: "#0071C5",
        color: "#ffffff",
        wrap: true
    };

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadEmployeeData();
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    closeKendoAlert() {
        this.showKendoAlert = false;
    }

    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    openEmployeeCustomers(dataItem) {
        const geosArray = dataItem["USR_GEOS"].split(', ');
        let modal_body;
        this.manageEmployeeSvc.getCustomersFromGeos(geosArray.join())
            .subscribe(response => {
                modal_body = response;
                const selectedIds = [];
                const selectedCustomers = dataItem["USR_CUST"].replace(/, /g, ",").split(",");
                for (let c = 0; c < response.length; c++) {
                    if (selectedCustomers.indexOf(response[c].CUST_NM) >= 0) {
                        selectedIds.push(response[c]);
                    }
                }
                //get data from API and pass it to mat dialog
                const dialogRef = this.dialog.open(ManageEmployeeModalComponent, {
                    width: '900px',
                    height: '600px',
                    disableClose: false,
                    data: { title: "Customer Selection", body: modal_body, dataItem: dataItem, selectedCust: selectedIds },
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        dataItem["USR_CUST"] = result;
                        dataItem["CUST_CONTENT"] = this.customersFormatting(dataItem, 'USR_CUST', 'USR_ROLE', 'USR_GEOS')['data'];
                        this.showKendoAlert = true;
                    }
                });
            }, (error) => {
                this.loggerSvc.error("Unable to get Customer from Geo Data.", '', 'openEmployeeCustomers::getCustomersFromGeos:: ' + JSON.stringify(error));
            });
    }
    openEmployeeVerticals(dataItem) {
        this.manageEmployeeSvc.getProductCategoriesWithAll()
            .subscribe(response => {
                const selectedIds = [];
                const modal_body = response;
                const selectedVerticals = dataItem["USR_VERTS"].replace(/, /g, ",").split(",");
                for (let c = 0; c < response.length; c++) {
                    if (selectedVerticals.indexOf(response[c].PRD_CAT_NM) >= 0) {
                        selectedIds.push(response[c]);
                    }
                }
                const dialogRef = this.dialog.open(ManageEmployeeModalComponent, {
                    width: '900px',
                    height: '600px',
                    disableClose: false,
                    data: { title: "Verticals Selection", body: modal_body, dataItem: dataItem, selectedVert: selectedIds },
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        dataItem.USR_VERTS = result;
                        dataItem["USR_VERTS"] = result;
                        dataItem["VERT_CONTENT"] = this.verticalsFormatting(dataItem, 'USR_VERTS', 'USR_ROLE', 'USR_GEOS')['data'];
                        this.showKendoAlert = true;
                    }
                });
            }, (error) => {
                this.loggerSvc.error("Unable to get Product Verticals Data.", '', 'openEmployeeVerticals::getProductCategoriesWithAll:: ' + JSON.stringify(error));
            });
    }

    customersFormatting(dataItem, usrCusts, usrRole, usrGeos) {
        this.custData = dataItem;
        const valCusts = dataItem[usrCusts];
        const valRoles = dataItem[usrRole];
        const valGeos = dataItem[usrGeos];
        // Pad en empty user with something to click from manage employee screen
        if (valCusts == "[Please Add Customers]") {
            if (valRoles !== "" && valGeos !== "") {
                this.renderCust['data'] = this.sanitizer.bypassSecurityTrustHtml(`<span class='cust-clickable' (click)='openEmployeeCustomers(dataItem)'>${dataItem.USR_CUST}</span>`); // Edit enabled
                this.renderCust['isCustClickable'] = true;
                return this.renderCust;
            }
            else {
                this.renderCust['data'] = `<span class='cust'>${dataItem.USR_CUST}</span>`; // Edit turned off
                this.renderCust['isCustClickable'] = false;
                return this.renderCust;
            }
        }
        // Don't allow edits on GEO or GLOBAL provisioned customers, they are role based
        else if (valCusts == "All Customers") {
            if (valRoles == "CBA" || valRoles == "FSE" || valRoles == "GA" || valRoles == "RA") // If customer based role, allow them to short cut to all cuatomers to default to geo filters
            {
                this.renderCust['data'] = this.sanitizer.bypassSecurityTrustHtml(`<span class='cust-clickable' (click)='openEmployeeCustomers(dataItem)'>${dataItem.USR_CUST}</span>`); // Edit enabled
                this.renderCust['isCustClickable'] = true;
                return this.renderCust;
            }
            else {
                this.renderCust['data'] = "All Customers"; // Edit turned off
                this.renderCust['isCustClickable'] = false;
                return this.renderCust;
            }
        }
        if (valRoles == "" || valGeos == "") {
            this.renderCust['data'] = `<span class='cust'>${dataItem.USR_CUST}</span>`; // Edit turned off
            this.renderCust['isCustClickable'] = false;
            return this.renderCust;
        }
        // All other people, just make their customers list clickable
        this.renderCust['data'] = this.sanitizer.bypassSecurityTrustHtml(`<span class='cust-clickable' (click)='openEmployeeCustomers(dataItem)'>${dataItem.USR_CUST}</span>`); // Edit enabled
        this.renderCust['isCustClickable'] = true;
        return this.renderCust;
    }

    verticalsFormatting(dataItem, usrVerts, usrRole, usrGeos) {
        this.vertData = dataItem;
        const valVerts = dataItem[usrVerts];
        const valRoles = dataItem[usrRole];
        const valGeos = dataItem[usrGeos];
        // Pad an empty user with something to click from manage employee screen
        if (valVerts == "[Please Add Products]") {
            if (valRoles !== "" && valGeos !== "") {
                this.renderVert['data'] = this.sanitizer.bypassSecurityTrustHtml(`<span class='vert-clickable' (click)='openEmployeeVerticals(dataItem)'>${dataItem.USR_VERTS}</span>`); //Edit enabled
                this.renderVert['isVertClickable'] = true;
                return this.renderVert;
            }
            else {
                this.renderVert['data'] = `<span class='vert'> ${dataItem.USR_VERTS}</span>`; // Edit turned off
                this.renderVert['isVertClickable'] = false;
                return this.renderVert;
            }
        }
        if (valRoles == "" || valGeos == "") {
            this.renderVert['data'] = `<span class='vert'>${dataItem.USR_VERTS}</span>`; // Edit turned off
            this.renderVert['isVertClickable'] = false;
            return this.renderVert;
        }
        // All other people, just make their customers list clickable
        this.renderVert['data'] = this.sanitizer.bypassSecurityTrustHtml(`<span class='vert-clickable' (click)='openEmployeeVerticals(dataItem)'>${dataItem.USR_VERTS}</span>`); // Edit enabled
        this.renderVert['isVertClickable'] = true;
        return this.renderVert;
    }

    loadEmployeeData() {
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != 'DA' && (<any>window).usrRole != 'SA' && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        this.manageEmployeeSvc.getEmployeeData()
            .subscribe((response: Array<any>) => {
                this.isLoading = false;
                this.gridResult = response;
                for (let i = 0; i < this.gridResult.length; i++) {
                    if (!this.gridResult[i].USR_CUST) {
                        this.gridResult[i].USR_CUST = "[Please Add Customers]"
                    }
                    if (!this.gridResult[i].USR_VERTS) {
                        this.gridResult[i].USR_VERTS = "[Please Add Products]"
                    }
                    this.gridResult[i].FULL_NAME = this.gridResult[i].LST_NM + ", " + this.gridResult[i].FRST_NM + " " + this.gridResult[i].MI;
                    this.gridResult[i].CUST_CONTENT = this.customersFormatting(this.gridResult[i], 'USR_CUST', 'USR_ROLE', 'USR_GEOS')['data'];
                    this.gridResult[i].CUST_CLICKABLE = this.customersFormatting(this.gridResult[i], 'USR_CUST', 'USR_ROLE', 'USR_GEOS')['isCustClickable'];
                    this.gridResult[i].VERT_CONTENT = this.verticalsFormatting(this.gridResult[i], 'USR_VERTS', 'USR_ROLE', 'USR_GEOS')['data'];
                    this.gridResult[i].VERT_CLICKABLE = this.verticalsFormatting(this.gridResult[i], 'USR_VERTS', 'USR_ROLE', 'USR_GEOS')['isVertClickable'];
                }
                this.gridData = process(this.gridResult, this.state);
            }, (error) => {
                this.loggerSvc.error('Unable to get User Data.', '', 'manageEmployeeComponent::loadEmployeeData::' + JSON.stringify(error));
            });
    }

    ngOnInit() {
        const url = (window.location.href).split("?");
        let wwid = "";
        if (url.length > 1) {
            const queryParam = url[1].split("&")
            queryParam.forEach(item => {
                const data = item.split("=")
                if (data[0] == 'id') {
                    wwid = (wwid == "" ? wwid.concat(data[1]) : wwid.concat(",", data[1]))
                }
            })
            this.state.filter.filters = [{ field: "EMP_WWID", operator: "eq", value: wwid }];
        }
        this.loadEmployeeData();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "manageEmployee",
    downgradeComponent({
        component: manageEmployeeComponent,
    })
);
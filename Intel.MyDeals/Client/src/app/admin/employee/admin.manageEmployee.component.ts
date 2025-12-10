import { Component, ViewEncapsulation, OnDestroy } from "@angular/core"
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { logger } from "../../shared/logger/logger";
import { manageEmployeeService } from "./admin.manageEmployee.service";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ManageEmployeeModalComponent } from './admin.manageEmployeeModal.component';
import { Observable } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DynamicObj, EmpHistory, ManageUsersInfo, Product } from "./admin.employee.model";
import { Cust_Div_Map } from "../customer/admin.customer.model";

@Component({
    selector: 'manage-employee',
    templateUrl: 'Client/src/app/admin/employee/admin.manageEmployee.component.html',
    styleUrls: ['Client/src/app/admin/employee/admin.manageEmployee.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class manageEmployeeComponent implements PendingChangesGuard,OnDestroy {

    constructor(private manageEmployeeSvc: manageEmployeeService, private loggerSvc: logger, private sanitizer: DomSanitizer, protected dialog: MatDialog) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    isDirty = false;
    private Roles: Array<string> = ["CBA", "DA", "Finance", "FSE", "GA", "Legal", "RA", "SA", "MyDeals SA", "Net ASP SA", "Rebate Forecast SA", "WRAP SA"];
    private Geos: Array<string> = ["APAC", "ASMO", "EMEA", "IJKK", "PRC", "Worldwide"];

    private isLoading = true;
    public gridData: GridDataResult;
    private gridResult: Array<ManageUsersInfo>;
    private gridHistResult: Array<EmpHistory>;
    public gridHistData: GridDataResult;
    private isEmpHistVisible = false;
    private windowTop = 80; windowLeft = 250; windowWidth = 1300; windowHeight = 550; windowMinWidth = 200; windowMinHeight = 200;
    private selectedEmpName;
    private selectedEmpWwid;
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
    private renderCust: DynamicObj = { data: null, isCustClickable: false };
    private custData;
    private renderVert: DynamicObj = { data: null, isVertClickable: false };
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
    private excelColumns = [
        { field: "EMP_WWID", title: "WWID" , width: 150 },
        { field: "FULL_NAME", title: "Name" , width: 200 },
        { field: "EMAIL_ADDR", title: "Email Address" , width: 280 },
        { field: "USR_ROLE", title: "Roles" , width: 150 },
        { field: "USR_GEOS", title: "Geos" , width: 150 },
        { field: "USR_CUST", title: "Customers" , width: 150 },
        { field: "USR_VERTS", title: "Verticals" , width: 150},
        { field: "SUPPLIER_DSC", title: "Supplier Description", width: 250 },
        { field: "ACTV_IND", title: "Active" , width: 120},
        { field: "IS_SUPER", title: "Super", width: 120 },
        { field: "IS_DEVELOPER", title: "Developer", width: 120 },
        { field: "IS_TESTER", title: "Tester" , width: 120},
        { field: "LST_MOD_BY", title: "Last Mod By", width: 150 },
        { field: "LST_MOD_DT", title: "Last Mod Date" , width: 150},
        { field: "NOTES", title: "Notes" , width: 150}
    ];

    returnZero(): number {
        return 0
    }

    empHistWindowClose() {
        this.isEmpHistVisible = false;
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

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid(): void {
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

    closeKendoAlert(): void {
        this.showKendoAlert = false;
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;
        excelState.skip = 0;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    openEmployeeCustomers(dataItem: ManageUsersInfo): void {
        this.isDirty=true;
        const geosArray = dataItem["USR_GEOS"].split(', ');
        let modal_body;
        this.manageEmployeeSvc.getCustomersFromGeos(geosArray.join())
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Cust_Div_Map[]) => {
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
                        this.isDirty=false
                        dataItem["USR_CUST"] = result;
                        dataItem["CUST_CONTENT"] = this.customersFormatting(dataItem, 'USR_CUST', 'USR_ROLE', 'USR_GEOS')['data'];
                        this.showKendoAlert = true;
                    }
                });
            }, (error) => {
                this.loggerSvc.error("Unable to get Customer from Geo Data.", '', 'openEmployeeCustomers::getCustomersFromGeos:: ' + JSON.stringify(error));
            });
    }
    openEmployeeVerticals(dataItem: ManageUsersInfo): void {
        this.isDirty=true;
        this.manageEmployeeSvc.getProductCategoriesWithAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Product[]) => {
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
                        this.isDirty=false;
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

    customersFormatting(dataItem: ManageUsersInfo, usrCusts: string, usrRole: string, usrGeos: string): DynamicObj {
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

    verticalsFormatting(dataItem: ManageUsersInfo, usrVerts: string, usrRole: string, usrGeos: string): DynamicObj {
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

    loadEmployeeData(): void {
        this.manageEmployeeSvc.getEmployeeData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<ManageUsersInfo>) => {
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
                this.isLoading = false;
            }, (error) => {
                this.loggerSvc.error('Unable to get User Data.', '', 'manageEmployeeComponent::loadEmployeeData::' + JSON.stringify(error));
            });
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    openEmployeeHistory(dataItem: any): void {
        this.selectedEmpWwid = dataItem.EMP_WWID;
        this.selectedEmpName = dataItem.FULL_NAME;
        this.isEmpHistVisible = false;
        this.isLoading = true;
        const histState: State = {
            skip: 0,
            take: 25
        };
        this.manageEmployeeSvc.getEmployeeHistory(this.selectedEmpWwid).pipe(takeUntil(this.destroy$)).subscribe((result: Array<EmpHistory>) => {
            this.gridHistResult = result;
            this.gridHistData = process(this.gridHistResult, histState);
            this.isEmpHistVisible = true;
            this.isLoading = false;
        },(err)=> {
            this.loggerSvc.error("Unable to get Employee History", err, err.statusText);
            this.isLoading = false;
        });
        
    }

    ngOnInit(): void { 
        this.loadEmployeeData();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
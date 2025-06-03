import { Component, OnInit } from "@angular/core";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { GroupDescriptor, process, State } from "@progress/kendo-data-query";
import { Observable, Subject } from "rxjs";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { takeUntil } from "rxjs/operators";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";

import { logger } from "../../shared/logger/logger";
import { userRolePermissionService } from "./admin.userRolePermission.service";
import { UserRolePermissionModel } from "./admin.userRolePermission.model";
import { MomentService } from "../../shared/moment/moment.service";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";

@Component({
    selector: 'user-role-permission',
    templateUrl: 'Client/src/app/admin/userRolePermission/admin.userRolePermission.component.html',
    styleUrls: ['Client/src/app/admin/userRolePermission/admin.userRolePermission.component.css']
})
export class userRolePermissionComponent implements OnInit {

    public minDate: Date;
    public maxDate: Date;
    public submitted = false;
    public range = { start: null, end: null };
    private readonly destroy$ = new Subject<void>();
    public gridData: GridDataResult;
    private isLoading = true;
    public gridResult: Array<UserRolePermissionModel>;
    userRolePermissionForm: FormGroup;
    public isFetchLatest = 0;

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {   // Initial filter descriptor
            logic: "and",
            filters: [],
        },
    };

    constructor(private userRolePermissionSvc : userRolePermissionService, 
                private loggerSvc: logger,
                private formBuilder: FormBuilder,
                private momentService: MomentService){
        this.allData = this.allData.bind(this);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;

        // Iterate through groupings, if missing direction, append ASC (default behaviour) to prevent issues w/ DB SP
        if (this.state.group && this.state.group.length > 0) {
            this.state.group.forEach((gd: GroupDescriptor) => {
                if (gd.dir == undefined || gd.dir == null) {
                    gd.dir = "asc";
                }
            });
        }

        if (this.currentUserSearch.username && this.currentUserSearch.username.length > 0) {    // Active User Search, continue pagination
            this.getUserRoleFromUserSearch(this.currentUserSearch.username, this.currentUserSearch.startDate, this.currentUserSearch.endDate);
        } else {
            this.loadUrp();
        }
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "User-Role-Permission-Export";
    }

    clearFilter(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.state.group = [];
        this.gridData = process(this.gridResult, this.state);

        if(Object.keys(this.userRolePermissionForm.value).length){
            this.isLoading = false;
            this.submitted = false;
            this.userRolePermissionForm.reset();
            this.loadUrp();
        }
    }

    public allData(): Observable<ExcelExportData> {
        this.isLoading = true;

        const EXCEL_DATA_SUBJECT = new Subject<ExcelExportData>();
        this.userRolePermissionSvc.GetUserRolePermissionByFilter(0, this.gridData.total, null)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<UserRolePermissionModel>) => {
                this.isLoading = false;

                const EXCEL_STATE = { ...this.state };  // Shallow copy
                EXCEL_STATE.take = this.gridData.total;
                EXCEL_STATE.skip = 0;

                EXCEL_DATA_SUBJECT.next({
                    data: process(result, EXCEL_STATE).data
                });
            }, (error) => {
                this.isLoading = false;

                this.loggerSvc.error('User Role Permission Service', error);
                EXCEL_DATA_SUBJECT.next({
                    data: undefined
                });
            });
        
        return EXCEL_DATA_SUBJECT.asObservable();
    }

    dateToString(date: Date): string {
        return ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
    }

    private getUserRoleFromUserSearch(databaseUsername: string, startDate: string, endDate: string): void {
        this.userRolePermissionSvc.GetUserRolePermissionByFilter(this.state.skip, this.state.take, null, null, databaseUsername, startDate, endDate)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<UserRolePermissionModel>) => {
                this.isLoading = false;
                this.gridResult = result;

                if (this.state.skip != 0) {
                    this.gridData.data = this.gridResult;
                } else {
                    this.gridData = process(this.gridResult, this.state);
                }

                if (result.length > 0) {
                    this.gridData.total = parseInt(result[0].TOTAL_ROWS);
                }

                this.currentUserSearch = {
                    username: databaseUsername,
                    startDate: startDate,
                    endDate: endDate
                };
            }, (error) => {
                this.isLoading = false;
                this.loggerSvc.error('User Role Permission Service', error);

                this.currentUserSearch = {
                    username: '',
                    startDate: '',
                    endDate: ''
                };
            });
    }

    private currentUserSearch = {
        username: '',
        startDate: '',
        endDate: ''
    };
    filterUserSearch(): void {
        this.submitted = true;
        if (this.userRolePermissionForm.invalid) {
            return;
        }

        const DB_USERNAME: string = this.userRolePermissionForm.value.DatabaseUserName;
        const START_DT: string = this.dateToString(this.userRolePermissionForm.value.StartDate);
        const END_DT: string = this.dateToString(this.userRolePermissionForm.value.EndDate);
        this.userRolePermissionForm.value.StartDate = START_DT;
        this.userRolePermissionForm.value.EndDate = END_DT;
        this.isLoading = true;
        this.state = {
            skip: 0,
            take: 25,
            group: [],
            filter: {
                logic: "and",
                filters: [],
            },
        };

        this.getUserRoleFromUserSearch(DB_USERNAME, START_DT, END_DT);
    }

    get f(): { [key: string]: AbstractControl } {
        return this.userRolePermissionForm.controls;
    }

    fetchTrigger(): void {
        this.isLoading = true;
        this.isFetchLatest = 1;
        this.userRolePermissionSvc.fetchUserRolePermission(this.isFetchLatest)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<UserRolePermissionModel>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.isLoading = false;
                this.loggerSvc.error('User Role Permission Service', error);
            });
    }

    refreshGrid(): void {
        this.isLoading = true;

        this.currentUserSearch = {
            username: '',
            startDate: '',
            endDate: ''
        };

        this.loadUrp();
    }

    loadUrp(): void {
        this.isLoading = true;

        const FILTER_STRING = (this.state.filter.filters && this.state.filter.filters.length > 0) ? FilterExpressBuilder.createSqlExpression(JSON.stringify(this.state.filter)) : null;
        const GROUP_STRING = (this.state.group && this.state.group.length > 0) ? JSON.stringify(this.state.group) : null;
        this.userRolePermissionSvc.GetUserRolePermissionByFilter(this.state.skip, this.state.take, GROUP_STRING, FILTER_STRING)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<UserRolePermissionModel>) => {
                this.isLoading = false;
                this.gridResult = result;

                if (this.gridData == undefined) {
                    this.gridData = process(this.gridResult, this.state);
                } else {
                    this.gridData.data = this.gridResult;
                }

                if (result.length > 0) {
                    this.gridData.total = parseInt(result[0].TOTAL_ROWS);
                }
            }, (error) => {
                this.isLoading = false;
                this.loggerSvc.error('User Role Permission Service', error);
            });
    }

    fixMinDate(e): void {
        this.minDate = new Date(e.getFullYear(), e.getMonth(), e.getDate())
    }

    ngOnInit(): void {
        this.userRolePermissionForm  = this.formBuilder.group(
            {
                DatabaseUserName: ['', Validators.required],
                StartDate: ['', Validators.required],
                EndDate: ['', Validators.required]
            }
        )
        const max = new Date();
        this.maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
        this.loadUrp();
    }
    
}
import { Component, OnInit } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor, GroupDescriptor, process, State } from "@progress/kendo-data-query";
import { Observable, Subject } from "rxjs";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { takeUntil } from "rxjs/operators";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";

import { logger } from "../../shared/logger/logger";
import { userRolePermissionService } from "./admin.userRolePermission.service";
import { MomentService } from "../../shared/moment/moment.service";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";
import { ExcelColumnsConfig } from "../ExcelColumnsconfig.util";
import { GridUtil } from "../../contract/grid.util";

@Component({
    selector: 'user-role-permission',
    templateUrl: 'Client/src/app/admin/userRolePermission/admin.userRolePermission.component.html',
    styleUrls: ['Client/src/app/admin/userRolePermission/admin.userRolePermission.component.css']
})
export class userRolePermissionComponent implements OnInit {

    public minDate: Date;
    public maxDate: Date;
    public filterParams: any;
    public submitted = false;
    public range = { start: null, end: null };
    private readonly destroy$ = new Subject<void>();
    public gridData: GridDataResult;
    private isLoading = true;
    public gridResult:any;
    userRolePermissionForm: FormGroup;
    public isFetchLatest = false;
    public isPageChange = false; // Flag to indicate if the page is changed
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {   // Initial filter descriptor
            logic: "and",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
            {
                text: "25",
                value: 25
            },
            {
                text: "50",
                value: 50
            },
            {
                text: "100",
                value: 100
            }
        ];

    constructor(private userRolePermissionSvc : userRolePermissionService, 
                private loggerSvc: logger,
                private formBuilder: FormBuilder,
        private momentService: MomentService) { }

    public groupChange(groups: GroupDescriptor[]): void {
        this.state.group = groups;
        const stateTest =  {
            skip: 0,
            take: 25,
            group: groups

        };
        const totalCount = this.gridData.total;
        this.gridData = process(this.gridResult, stateTest);
        this.gridData.total = totalCount; // Maintain the total count
    }


    public filterChange(filter: CompositeFilterDescriptor): void {
        this.state.filter = filter;
        this.state.skip = 0;
        this.isPageChange = false;
        this.loadUrp('load');
    }
    sortChange(state) {
        this.state["sort"] = state;
        this.loadUrp('load');
    }

    pageChange(state: DataStateChangeEvent) {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.loadUrp('load');
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "User-Role-Permission-Export";
    }

    clearFilter(): void {
        this.isLoading = true;
        this.isPageChange = false;
        this.state = {
            skip: 0,
            take: 25,
            group: [],
            filter: {   
                logic: "and",
                filters: [],
            },
        };

        if(Object.keys(this.userRolePermissionForm.value).length){
            this.submitted = false;
            this.userRolePermissionForm.reset();
            this.currentUserSearch = {
                username: '',
                startDate: '',
                endDate: ''
            };
        }
        this.loadUrp('load');
    }

    exportToExcel() {
        this.isLoading = true;
        const filterParams = this.buildFilterParamsForAPI(true);
        this.userRolePermissionSvc.getUserRolePermissionByFilter(filterParams)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                GridUtil.dsToExcelUsrRolePermissionData(ExcelColumnsConfig.GetUsrRolePermissionExcel, result.Items, "User-Role-Permission-Export");
                this.isLoading = false;
            }, (error) => {
                this.isLoading = false;
                this.loggerSvc.error('Unable to export data.', error);
            });
    }

    dateToString(date: Date): string {
        return ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
    }

    private getDataFromSearchInputs(databaseUsername: string, startDate: string, endDate: string): void {

        this.filterParams = {
            DatabaseUserName: databaseUsername,
            StartDate: startDate,
            EndDate: endDate,
            Skip: this.state.skip,
            Take: this.state.take,
            IsFetchLatest: this.isFetchLatest,
            Sort: '',
            Filter: '',
            PageChange: this.isPageChange
        }
        this.loadUrp('search');
    }

    public currentUserSearch = {
        username: '',
        startDate: '',
        endDate: ''
    };

    filterUserSearchOnSubmit(): void {
        this.submitted = true;
        if (this.userRolePermissionForm.invalid) {
            return;
        }

        const DB_USERNAME: string = this.userRolePermissionForm.value.DatabaseUserName;
        const START_DT: string = this.dateToString(this.userRolePermissionForm.value.StartDate);
        const END_DT: string = this.dateToString(this.userRolePermissionForm.value.EndDate);
        this.userRolePermissionForm.value.StartDate = START_DT;
        this.userRolePermissionForm.value.EndDate = END_DT;
        this.isPageChange = false;
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

        this.getDataFromSearchInputs(DB_USERNAME, START_DT, END_DT);
    }

    get f(): { [key: string]: AbstractControl } {
        return this.userRolePermissionForm.controls;
    }

    fetchLatestTrigger(): void {
        this.isLoading = true;
        this.isFetchLatest = true;
        if(Object.keys(this.userRolePermissionForm.value).length){
            this.submitted = false;
            this.userRolePermissionForm.reset();
            this.currentUserSearch = {
                username: '',
                startDate: '',
                endDate: ''
            };
        }

        this.loadUrp('load');
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.isPageChange = false;
        this.state = {
            skip: 0,
            take: 25,
            filter: this.state.filter,
            group: this.state.group,
            sort: this.state.sort
        };
        this.loadUrp('load');
    }

    buildFilterParamsForAPI(isExcelExport = false) {

        let filter = JSON.parse(JSON.stringify(this.state.filter));
        filter.filters.forEach((item: CompositeFilterDescriptor) => {
            if (item && item.filters && item.filters.length > 0)
                item.filters.forEach((filter: FilterDescriptor) => {
                    if (filter.field = 'Database_Name') filter.field = '[Database Name]'
                });
        });
        let sortString = '';
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.field == 'Database_Name') value.field = '[Database Name]';
                if (value.dir) {
                    sortString = ind == 0 ? `ORDER BY ${value.field} ${value.dir}` : `${sortString} , ${value.field} ${value.dir}`;
                }
            });
        }
        const filterString = (filter && filter.filters.length > 0) ? FilterExpressBuilder.createSqlExpression(JSON.stringify(filter)) : '';
        
        return {
            DatabaseUserName: this.currentUserSearch.username != '' ? this.currentUserSearch.username : '',
            StartDate: this.currentUserSearch.startDate != '' ? this.currentUserSearch.startDate : '',
            EndDate: this.currentUserSearch.endDate != '' ? this.currentUserSearch.endDate : '',
            Skip: isExcelExport ? 0 : this.state.skip,
            Take: isExcelExport ? -1 : this.state.take,
            IsFetchLatest: this.isFetchLatest,
            Sort: sortString,
            Filter: filterString,
            PageChange: this.isPageChange
        };
    }

    loadUrp(mode:string): void {
        this.isLoading = true;
        
        this.filterParams = mode == 'search' ? this.filterParams : this.buildFilterParamsForAPI(false);
        
        this.userRolePermissionSvc.getUserRolePermissionByFilter(this.filterParams)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.isLoading = false;
                this.isFetchLatest = false;
                this.isPageChange = true;
                this.gridResult = result.Items;
                const totalCount = result.TotalRows > 0 ? result.TotalRows : this.gridData.total;
                const stateTest =  {
                    skip: 0,
                    take: this.state.take,
                    group: this.state.group 
                };
                this.gridData = process(this.gridResult, stateTest);
                this.gridData.total = totalCount;
                if (mode == 'search') {
                    this.currentUserSearch = {
                        username: this.filterParams.DatabaseUserName,
                        startDate: this.filterParams.StartDate,
                        endDate: this.filterParams.EndDate
                    };
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
        this.loadUrp('load');
    }
    
}
import { Component, OnInit, OnDestroy } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { logger } from "../../shared/logger/logger";
import { Subject } from "rxjs";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { userRolePermissionService } from "./admin.userRolePermission.service";
import { takeUntil } from "rxjs/operators";
import { userRolePermissionModel } from "./admin.userRolePermission.model";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { MomentService } from "../../shared/moment/moment.service";
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
    private readonly destroy$ = new Subject();
    public gridData: GridDataResult;
    private isLoading = true;
    public gridResult: Array<userRolePermissionModel>;
    userRolePermissionForm: FormGroup;
    public isFetchLatest = 0;

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    constructor(
        private userRolePermissionSvc : userRolePermissionService, 
        private loggerSvc: logger,
        private formBuilder: FormBuilder,
        private momentService: MomentService,
    ){
      this.allData = this.allData.bind(this);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
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
        this.gridData = process(this.gridResult, this.state);

        if(Object.keys(this.userRolePermissionForm.value).length){
            this.isLoading = false;
            this.submitted = false;
            this.userRolePermissionForm.reset();
            this.loadURP();
        }
    }

    public allData(): ExcelExportData {
      const excelState: State = {};
      Object.assign(excelState, this.state)
      excelState.take = this.gridResult.length;

      const result: ExcelExportData = {
          data: process(this.gridResult, excelState).data,
      };

      return result;
  }

    dateConversion(date: any) { 
        let modifyDateFormat = 
            ("00" + (date.getMonth() + 1)).slice(-2) 
            + "/" + ("00" + date.getDate()).slice(-2) 
            + "/" + date.getFullYear() + " " 
            + ("00" + date.getHours()).slice(-2) + ":" 
            + ("00" + date.getMinutes()).slice(-2) 
            + ":" + ("00" + date.getSeconds()).slice(-2); 
                
        return modifyDateFormat;
    }

  customizeFilterSubmit(){
    this.submitted = true;
    if (this.userRolePermissionForm.invalid) {
      return;
    }
    let userFormValues = this.userRolePermissionForm.value;
    let startDate = this.dateConversion(this.userRolePermissionForm.value.StartDate);
    let endDate = this.dateConversion(this.userRolePermissionForm.value.EndDate);
    this.userRolePermissionForm.value.StartDate = startDate;
    this.userRolePermissionForm.value.EndDate = endDate;
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
    //this.loggerSvc.warn("Please wait user role permission data is loading", "");

    this.userRolePermissionSvc.postUserInfomation(userFormValues).pipe(takeUntil(this.destroy$))
    .subscribe((result: Array<userRolePermissionModel>) => {
        this.isLoading = false;
        this.gridResult = result;
        this.gridData = process(this.gridResult, this.state);
        this.loggerSvc.success("User Role Permission Data Updated successfully");
        this.submitted = false;
        this.userRolePermissionForm.reset();
    }, (error) => {
        this.loggerSvc.error('User Role Permission Service', error);
    });
  }

    get f(): { [key: string]: AbstractControl } {
        return this.userRolePermissionForm.controls;
    }

    fetchTrigger(){
        this.isLoading = true;
        this.isFetchLatest = 1
        this.userRolePermissionSvc.fetchUserRolePermission(this.isFetchLatest)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<userRolePermissionModel>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.loggerSvc.error('User Role Permission Service', error);
            });
    }

    refreshGrid() {
        this.isLoading = true;
        this.loadURP();
    }

    loadURP(){
      this.userRolePermissionSvc.getAllUserRolePermission()
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((result: Array<userRolePermissionModel>) => {
                      this.isLoading = false;
                      this.gridResult = result;
                      this.gridData = process(result, this.state);
                  }, (error) => {
                      this.loggerSvc.error('User Role Permission Service', error);
                  });
    }

    fixMinDate(e) {
        this.minDate = new Date(e.getFullYear(), e.getMonth(), e.getDate())
    }

    ngOnInit() {
        this.userRolePermissionForm  = this.formBuilder.group(
            {
                DatabaseUserName: ['', Validators.required],
                StartDate: ['', Validators.required],
                EndDate: ['', Validators.required]
            }
        )
        let max = new Date();
        this.maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
        this.loadURP();
    }
    
}
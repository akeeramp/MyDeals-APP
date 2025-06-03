import { Component, OnInit, OnDestroy } from "@angular/core";
import { contains } from "underscore";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, State, orderBy, process } from "@progress/kendo-data-query";
import { MatDialog } from "@angular/material/dialog";

import { AsyncProcedureJobsService } from "./admin.asyncProcedureJobs.service";
import { AsyncProcTrigger, CreateAsyncProcTriggerData } from "./admin.asyncProcedureJobs.models";
import { logger } from "../../shared/logger/logger";
import { CreateProcedureJobModalComponent } from "./createProcedureJobModal/createProcedureJobModal.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'async-procedure-jobs',
    templateUrl: 'Client/src/app/admin/asyncProcedureJobs/admin.asyncProcedureJobs.component.html',
    styleUrls: ['Client/src/app/admin/asyncProcedureJobs/admin.asyncProcedureJobs.component.css']
})
export class AsyncProcedureJobsComponent implements OnInit, OnDestroy {

    private readonly DEFAULT_STATE_CONFIG: State = {
        skip: 0,
        group: [],
        take: 20,
        sort: [{ field: 'ASYNC_SID', dir: 'desc' }]
    };

    constructor(private asyncProcedureJobsService: AsyncProcedureJobsService,
                private dialog: MatDialog,
                private loggerService: logger) { }

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private gridData: GridDataResult;
    private isLoading = false;
    private state: State = this.DEFAULT_STATE_CONFIG;

    sortChange(sort: SortDescriptor[]): void {
        this.state.sort = sort;
        this.gridData = {
            data: orderBy(this.gridData.data, this.state.sort),
            total: this.gridData.total
        };
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.getAsyncProcedureJobs();
    }

    updateGridData(data: AsyncProcTrigger[]): void {
        this.state = this.DEFAULT_STATE_CONFIG;
        this.gridData = process(data, this.state);
        this.isLoading = false;
    }

    getAsyncProcedureJobs(): void {
        this.asyncProcedureJobsService.getGetAsyncProcTriggers().pipe(takeUntil(this.destroy$))
            .subscribe((result: AsyncProcTrigger[]) => {
            this.updateGridData(result);
        }, (error) => {
            this.loggerService.error('Unable to load Async Procedure Jobs', '', `AsyncProcedureJobsComponent: getAsyncProcJobs(): ${ JSON.stringify(error) }`);
            this.isLoading = false;
        })
    }

    saveAsyncProcedureJobToQueue(data: CreateAsyncProcTriggerData): void {
        if (data && data.PROC_NAME != '' && data.PROC_DATA != '') {
            this.asyncProcedureJobsService.saveAsyncProcTrigger(data).pipe(takeUntil(this.destroy$))
                .subscribe((result: AsyncProcTrigger[]) => {
                this.loggerService.success('Added record, refreshing grid data...');
                this.updateGridData(result);
            }, (error) => {
                this.loggerService.error('Unable to save Procedure information, verify fields and try again', '', `AsyncProcedureJobsComponent: saveAsyncProcToQueue(): ${ JSON.stringify(error) }`);
                this.isLoading = false;
            })
        }
    }

    private accessAllowed = false; // Default to false to prevent unauthorized users
    checkPageAccess(): void {
        const ALLOWED_WWIDS = ['12078459', '10548414', '10682199'];
        this.accessAllowed = contains(ALLOWED_WWIDS, (<any>window).usrDupWwid as string);
    }

    createProcedureJob(): void {
        const DIALOG_REF = this.dialog.open(CreateProcedureJobModalComponent, {
            width: '60%',
            disableClose: false,
            panelClass: 'create-modal'
        });

        DIALOG_REF.componentInstance.emitService.subscribe((newProcedureJobData: CreateAsyncProcTriggerData) => {
            if (newProcedureJobData != null && newProcedureJobData != undefined) {
                this.saveAsyncProcedureJobToQueue(newProcedureJobData);
            }
        });
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.checkPageAccess();
        if (this.accessAllowed) {
            this.getAsyncProcedureJobs();
        }
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
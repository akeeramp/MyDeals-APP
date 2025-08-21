import { Component, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { logger } from "../../shared/logger/logger";
import { employeeService } from './admin.employee.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OpUserTokenParameters } from "./admin.employee.model";

@Component({
    selector: 'employee-dashboard',
    templateUrl: 'Client/src/app/admin/employee/admin.employee.component.html',
    styleUrls: ['Client/src/app/admin/employee/admin.employee.component.css']
})

export class EmployeeComponent implements PendingChangesGuard,OnDestroy {

    constructor(private employeeSvc: employeeService,private loggerSvc:logger) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    protected roleTypeId = (<any>window).usrRoleId;
    private isDeveloper = (<any>window).isDeveloper;
    private isTester = (<any>window).isTester;
    private isSuper = (<any>window).isSuper;
    private isLoading = false;
    private roles: Array<any>;
    isDirty = false;
    save(): void {
        this.isLoading = true;
        const data: OpUserTokenParameters = {
            "roleTypeId": this.roleTypeId,
            "isDeveloper": this.isDeveloper ? 1 : 0,
            "isTester": this.isTester ? 1 : 0,
            "isSuper": this.isSuper ? 1 : 0
        }
        this.employeeSvc.setEmployees(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isDirty=false;
                this.loggerSvc.success("Role was changed", "Done");
                (<any>window).clearSessionData('/error/ResetMyCache');
                document.location.href = "/error/ResetMyCache";
            }, err => {
                this.isLoading = false;
                this.loggerSvc.error("Unable to set User Roles.", err);
            });
    }

    
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.roles = [
            { value: 9, label: "SA" },
            { value: 3, label: "DA" },
            { value: 6, label: "GA" },
            { value: 5, label: "FSE" },
            { value: 4, label: "Finance" },
            { value: 7, label: "Legal" },
            { value: 2, label: "CBA" },
            { value: 8, label: "RA" }
        ]
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
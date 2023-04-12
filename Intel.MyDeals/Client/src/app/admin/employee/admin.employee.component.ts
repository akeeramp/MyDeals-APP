import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { employeeService } from './admin.employee.service';

@Component({
    selector: 'employee-dashboard',
    templateUrl: 'Client/src/app/admin/employee/admin.employee.component.html',
    styleUrls: ['Client/src/app/admin/employee/admin.employee.component.css']
})
export class EmployeeComponent {
    constructor(private employeeSvc: employeeService,private loggerSvc:logger) { }

    private roleTypeId = (<any>window).usrRoleId;
    private isDeveloper = (<any>window).isDeveloper;
    private isTester = (<any>window).isTester;
    private isSuper = (<any>window).isSuper;
    private roles: Array<any>;

    save() {
        const data = {
            "roleTypeId": this.roleTypeId,
            "isDeveloper": this.isDeveloper ? 1 : 0,
            "isTester": this.isTester ? 1 : 0,
            "isSuper": this.isSuper ? 1 : 0
        }
        this.employeeSvc.setEmployees(data)
            .subscribe(() => {
                this.loggerSvc.success("Role was changed", "Done");
                (<any>window).clearSessionData('/error/ResetMyCache');
                document.location.href = "/error/ResetMyCache";
            }, err => {
                this.loggerSvc.error("Unable to set User Roles.", err);
            });
    }

    onChange(roleId: any) {
        this.roleTypeId = roleId;
    }

    ngOnInit() {
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
}
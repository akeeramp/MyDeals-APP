import { Component, Inject, ViewEncapsulation, OnDestroy } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { manageEmployeeService } from "./admin.manageEmployee.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    providers: [manageEmployeeService],
    selector: "manageEmployeeModal",
    templateUrl: "Client/src/app/admin/employee/admin.manageEmployeeModal.component.html",
    styleUrls: ['Client/src/app/admin/employee/admin.manageEmployee.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ManageEmployeeModalComponent implements OnDestroy {

    constructor(public dialogRef: MatDialogRef<ManageEmployeeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, 
        private loggerSvc: logger, private manageEmployeeSvc: manageEmployeeService) {

    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private lastName = this.data.dataItem.LST_NM;
    private firstName = this.data.dataItem.FRST_NM;
    private title = this.data.title;
    private selectOptions;
    private selectedIds = this.data.selectedCust;
    private isCustModal = false;
    private category = "";

    private geoAllOptions = [
        { "id": "Worldwide" },
        { "id": "APAC" },
        { "id": "ASMO" },
        { "id": "EMEA" },
        { "id": "IJKK" },
        { "id": "PRC" },
    ];
    private geoData = [];
    private geosArray = this.data.dataItem["USR_GEOS"].split(', ');

    private showKendoAlert;

    isChecked(id: string): boolean { // Set which geos this user has checked at dialog open
        let match = false;
        for (let i = 0; i < this.geoData.length; i++) {
            if (this.geoData[i].id == id) {
                match = true;
            }
        }
        return match;
    }

    getCustomerOptions(): void {
        this.selectOptions = this.data.body;
        if (this.selectedIds.length > 0) { // Safety check for empty list
            const lastSelected = this.selectedIds[this.selectedIds.length - 1];
            if (lastSelected.CUST_NM === 'All Customers') // If they just selected All Custs, clear out their list and leave only this one.
            {
                this.selectedIds = [];
                this.selectedIds.push(lastSelected);
            }
            else if (this.selectedIds[0].CUST_NM === 'All Customers') {
                this.selectedIds = [];
                this.selectedIds.push(lastSelected);
            }
        }
    }

    getProductOptions(): void {
        this.selectOptions = this.data.body;
        if (this.selectedIds.length > 0) { // Safety check for empty list
            const lastSelected = this.selectedIds[this.selectedIds.length - 1];
            if (lastSelected.PRD_CAT_NM === 'All Products') // If they just selected All Custs, clear out their list and leave only this one.
            {
                this.selectedIds = [];
                this.selectedIds.push(lastSelected);
            }
            else if (this.selectedIds[0].PRD_CAT_NM === 'All Products') {
                this.selectedIds = [];
                this.selectedIds.push(lastSelected);
            }
        }
    }

    onCustVertChange(): void {
        if (this.isCustModal) {
            this.getCustomerOptions();
        }
        else {
            this.getProductOptions();
        }
    }


    cancel(): void {
        this.dialogRef.close();
    }

    ok(): void {
        // Save the selected customers list here.
        const saveIds = [];
        const saveNames = [];

        for (let i = 0; i < this.selectedIds.length; i++) {
            if (this.isCustModal) {
                saveIds.push(this.selectedIds[i].CUST_NM_SID);
                saveNames.push(this.selectedIds[i].CUST_NM);
            }
            else {
                saveIds.push(this.selectedIds[i].PRD_MBR_SID);
                saveNames.push(this.selectedIds[i].PRD_CAT_NM);
            }
        }

        const editData = {
            "empWWID": this.data.dataItem["EMP_WWID"],
            "custIds": this.isCustModal ? saveIds : [],
            "vertIds": this.isCustModal ? [] : saveIds
        }

        if (this.isCustModal) {
            this.manageEmployeeSvc.setEmployeeData(editData)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    if (saveNames.length === 0) {
                        saveNames.push("[Please Add Customers]");
                    }
                    this.dialogRef.close(saveNames.sort().join(", "));
                    this.loggerSvc.success("User's Customers list was saved", "Done");
                }, (error) => {
                    this.loggerSvc.error("Unable to save this User's Customer Data.", "", "manageEmployeeModalComponent::setEmployeeData:: " + JSON.stringify(error));
                });
        }
        else {
            this.manageEmployeeSvc.setEmployeeVerticalData(editData)
                .pipe(takeUntil(this.destroy$))
                .subscribe( () => {
                    if (saveNames.length === 0) {
                        saveNames.push("[Please Add Products]");
                    }
                    this.dialogRef.close(saveNames.sort().join(", ")); // Post back the results to parent screen.

                    this.loggerSvc.success("User's Verticals list was saved", "Done");
                }, (error) => {
                    this.loggerSvc.error("Unable to save this User's Verticals Data.", "", "manageEmployeeModalComponent::setEmployeeVerticalData:: " + JSON.stringify(error));
                });
        }
    }

    clear(): void {
        this.selectedIds = [];
    }

    ngOnInit(): void {
        this.isCustModal = (this.title == "Customer Selection") ? true : false;
        for (let i = 0; i < this.geosArray.length; i++) {
            this.geoData.push({ id: this.geosArray[i] });
        }
        if (this.isCustModal) {
            this.category = "customers";
            this.getCustomerOptions();
        }
        else {
            this.category = "verticals";
            this.selectedIds = this.data.selectedVert;
            this.getProductOptions();
        }
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    } 
}

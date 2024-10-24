import { logger } from "../../shared/logger/logger";
import { consumptionCountryService } from "./admin.consumptionCountry.service";
import { Component, ViewChild, OnDestroy } from "@angular/core";
import { consumption_Country_Map } from "./admin.consumptionCountry.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
    selector: "admin-consumption-country",
    templateUrl: "Client/src/app/admin/consumptionCountry/admin.consumptionCountry.component.html"
})
export class adminConsumptionCountryComponent implements OnDestroy {

    constructor(private consumptionCountrySvc: consumptionCountryService, private loggerSvc: logger) { }

    @ViewChild("CNSMPTN_CTRY_NM_DropDown") private CNSMPTN_CTRY_NM_Ddl;
    @ViewChild("GEO_NM_DropDown") private GEO_NM_DropDownDdl;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    private isLoading = true;
    private allowCustom = true;

    public gridResult: Array<any> = [];
    public type = "numeric";
    public info = true;
    public formGroup: FormGroup;
    public isFormChange = false;
    private isCombExists = false;
    private errorMsg: string[] = [];
    public Geo: Array<any> = [];
    public Countries: Array<any> = [];
    private editedRowIndex: number;
    public countriesData: Array<any> = [];
    public GeoData: Array<any> = [];

    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
    ];

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadConsumptionCountry() {
        this.consumptionCountrySvc.getConsumptionCountry()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
            (result: Array<any>) => {
                this.gridResult = result;
                this.gridData = process(this.gridResult, this.state);
                this.InitiateDropDowns(this.formGroup);
                this.isLoading = false;
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Consumption Countries/Regions.",
                    response,
                    response.statusText
                );
            }
        );
        
    }

    //get Dropdowns Data
    InitiateDropDowns(formGroup: any) {

        this.consumptionCountrySvc.getDropdown()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                this.Geo = response;
                this.GeoData = response.filter(x => x.dropdownName).map(item => item.dropdownName);
            }, function (response) {
                this.loggerSvc.error("Unable to get Geo.", response, response.statusText);
            });

        this.consumptionCountrySvc.getCountryList().pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                this.Countries = response;
                this.countriesData = response.filter(x => x.CTRY_NM).map(item => item.CTRY_NM);
            }, function (response) {
                this.loggerSvc.error("Unable to get Countries.", response, response.statusText);
            });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    IsValidConsumptionCountryMapping(model: any) {
        let retCond = false;

        if (model.GEO_NM == null || model.GEO_NM == '' || this.Geo.filter(x => x.dropdownName == model.GEO_NM).length == 0) {
            this.errorMsg.push("Please Select Valid <strong>Geo</strong>.");
            retCond = true;
        }
        if (model.CNSMPTN_CTRY_NM == null || model.CNSMPTN_CTRY_NM == '' || this.Countries.filter(x => x.CTRY_NM == model.CNSMPTN_CTRY_NM).length == 0) {
            this.errorMsg.push("Please Select Valid <strong>Consumption Country/Region</strong>.");
            retCond = true;
        }
        if (this.gridResult.filter(x => x.CNSMPTN_CTRY_NM == model.CNSMPTN_CTRY_NM && x.GEO_NM == model.GEO_NM).length != 0) {
            this.errorMsg.push("The Combination of" + " <strong>" + model.GEO_NM + "</strong> " + "and" + " <strong>" + model.CNSMPTN_CTRY_NM + "</strong> " + "already exists.");
            retCond = true;
        }
        if (this.gridResult.filter(x => x.CNSMPTN_CTRY_NM == model.CNSMPTN_CTRY_NM).length != 0) {
            this.errorMsg.push("<strong>" + model.CNSMPTN_CTRY_NM + "</strong> " + "already mapped.");
            retCond = true;
        }

        return retCond;
    }

    addHandler({ sender }) {
        this.isDirty=true;
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            GEO_NM: new FormControl("", Validators.required),
            CNSMPTN_CTRY_NM: new FormControl("", Validators.required)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.isDirty=true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            GEO_NM: new FormControl(dataItem.GEO_NM, Validators.required),
            CNSMPTN_CTRY_NM: new FormControl(dataItem.CNSMPTN_CTRY_NM, Validators.required)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    saveConfirmation() {
        this.isCombExists = false;
    }

    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        const consumption_Ctry_Map: consumption_Country_Map = formGroup.value;
        this.errorMsg = [];

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidConsumptionCountryMapping(consumption_Ctry_Map);
            if (!this.isCombExists) {
                if (isNew) {
                    this.isLoading = true;
                    this.consumptionCountrySvc.insertConsumptionCountry(consumption_Ctry_Map).subscribe(
                        () => {
                            this.gridResult.push(consumption_Ctry_Map);
                            this.loadConsumptionCountry();
                            this.loggerSvc.success("New Consumption Country/Region Added.");
                            sender.closeRow(rowIndex);
                        },
                        error => {
                            this.loggerSvc.error("Unable to insert Consumption Country/Region.", error);
                            this.isLoading = false;
                        }
                    );
                } else {
                    this.isLoading = true;
                    this.consumptionCountrySvc.updateConsumptionCountry(consumption_Ctry_Map).pipe(takeUntil(this.destroy$)).subscribe(
                        () => {
                            this.gridResult[rowIndex] = consumption_Ctry_Map;
                            this.gridResult.push(consumption_Ctry_Map);
                            this.loadConsumptionCountry();
                            this.loggerSvc.success("Consumption Country/Region updated.");
                            sender.closeRow(rowIndex);
                        },
                        error => {
                            this.loggerSvc.error("Unable to update Consumption Country/Region.", error);
                            this.isLoading = false;
                        }
                    );
                }
            }
            this.isDirty=false;
        }
        sender.closeRow(rowIndex);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadConsumptionCountry();
    }
    
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit() {
        this.loadConsumptionCountry();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
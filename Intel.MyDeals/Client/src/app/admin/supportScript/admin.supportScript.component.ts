import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { adminsupportScriptService } from "./admin.supportScript.service"
import { MomentService } from "../../shared/moment/moment.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
    selector: "admin-support-script",
    templateUrl: "Client/src/app/admin/supportScript/admin.supportScript.component.html",
    styles: [`.dateRangeLabelSupportScript { font-weight: bold; } .btnExecSupportScript { padding-left: 25px; } `]
})

export class adminsupportScriptComponent implements PendingChangesGuard, OnDestroy {

    constructor(private loggersvc: logger, private adminsupportscriptsvc: adminsupportScriptService, private formBuilder: FormBuilder, private momentService: MomentService) {
        this.intializesupportScriptDataForm();
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    isDirty = false;
    public titleErrorMsg: string;
    public errorNotes: string; 
    
    supportScriptDataForm = new FormGroup(
        {
            START_QTR: new FormControl(),
            START_YR: new FormControl(),
            END_QTR: new FormControl(),
            END_YR: new FormControl(),
            NOTES: new FormControl(),
            isFillNullSelected: new FormControl(),
            MinYear: new FormControl(),
            MaxYear: new FormControl(),
        }
    );
     

    intializesupportScriptDataForm(): void {
        this.supportScriptDataForm = this.formBuilder.group({
            START_QTR: this.momentService.moment().quarter(),
            START_YR: parseInt(this.momentService.moment().format("YYYY")) - 1,
            END_QTR: this.momentService.moment().quarter(),
            END_YR: parseInt(this.momentService.moment().format("YYYY")) + 3,
            NOTES: '',
            isFillNullSelected: false,
            MinYear : parseInt(this.momentService.moment().format("YYYY")) - 6,
            MaxYear : parseInt(this.momentService.moment().format("YYYY")) + 20,
        });
    }

    startYearChange(): void {
        if (this.supportScriptDataForm.get("START_YR").value > this.supportScriptDataForm.get("MaxYear").value) {
            this.supportScriptDataForm.get("START_YR").setValue(this.supportScriptDataForm.get("MaxYear").value);
        }
    }

    endYearChange(): void {
        if (this.supportScriptDataForm.get("END_YR").value > this.supportScriptDataForm.get("MaxYear").value) {
            this.supportScriptDataForm.get("END_YR").setValue(this.supportScriptDataForm.get("MaxYear").value);
        }
    }

    validate(): boolean {
        if (this.supportScriptDataForm.get("START_YR").value > this.supportScriptDataForm.get("END_YR").value) {
             this.titleErrorMsg = "Start year Quarter cannot be greater than end year quarter";
            this.supportScriptDataForm.controls["START_YR"].valid;
            return false;
        } else if (this.supportScriptDataForm.get("START_YR").value == this.supportScriptDataForm.get("END_YR").value) {
            if (this.supportScriptDataForm.get("START_QTR").value > this.supportScriptDataForm.get("END_QTR").value) {
                this.titleErrorMsg = "Start year Quarter cannot be greater than end year quarter";
                return false;
            }
            else
                this.titleErrorMsg = "";
        }
         if (this.supportScriptDataForm.get("NOTES").value == "" || this.supportScriptDataForm.get("NOTES").value != "") {
            const reg = new RegExp(/^[0-9,]+$/);
            const productIds = this.supportScriptDataForm.get("NOTES").value.replace(/,+/g, ',').trim(' ');
            const isValidProdIds = reg.test(productIds);
            if (!isValidProdIds) {
                this.errorNotes = "Please enter comma (,) separated L4 product ids only";
                return false;
            } else
                this.errorNotes = "";

        }
        else {
            this.titleErrorMsg = "";
            this.errorNotes = "";
        }
        return true;
    }

    executeCostFiller(): void {
        if (this.validate()) {
            let noteValues = this.supportScriptDataForm.get("NOTES").value.split(',');
            this.isDirty=false;
            const startYearQuarter = this.supportScriptDataForm.get("START_YR").value + "0" + this.supportScriptDataForm.get("START_QTR").value;
            const endYearQuarter = this.supportScriptDataForm.get("END_YR").value + "0" + this.supportScriptDataForm.get("END_QTR").value;
            this.adminsupportscriptsvc.ExecuteCostGapFiller(startYearQuarter, endYearQuarter,
                this.supportScriptDataForm.get("isFillNullSelected").value,
                noteValues).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
                     this.loggersvc.success("Cost Gap Filler executed succesfully");
        }), err => {
            this.loggersvc.error("Unable to delete contract", "Error", err);
        };
        }
    }
    
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }


    ngOnInit(): void {
        this.supportScriptDataForm.valueChanges.subscribe(x=>{
            this.isDirty=true;
        })
 
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
     
}
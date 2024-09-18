import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { CreateAsyncProcTriggerData } from "../admin.asyncProcedureJobs.models";
import { logger } from "../../../shared/logger/logger";

@Component({
    selector: 'create-procedure-modal',
    templateUrl: 'Client/src/app/admin/asyncProcedureJobs/createProcedureJobModal/createProcedureJobModal.component.html',
    styleUrls: ['Client/src/app/admin/asyncProcedureJobs/createProcedureJobModal/createProcedureJobModal.component.css'],
})
export class CreateProcedureJobModalComponent implements OnInit {

    // Match w/ fields in CreateAsyncProcTriggerData object
    private readonly FORM_GROUP_DEFINITION = {
        PROC_NAME: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
        PROC_DATA: new FormControl('', [Validators.required, Validators.minLength(1)])
    };

    private formData: FormGroup;
        
    @Output() emitService = new EventEmitter<CreateAsyncProcTriggerData>();

    constructor(private DIALOG_REF: MatDialogRef<CreateProcedureJobModalComponent>,
                private formBuilder: FormBuilder,
                private loggerService: logger) { }

    onSubmit(): void {
        if (this.formData.valid){
            console.log('this.formData');
            console.log(this.formData);
            this.emitService.emit(this.formData.value as CreateAsyncProcTriggerData);
            this.close();
        } else {
            this.loggerService.warn('Please fix validation errors', 'Validation error');
        }
    }

    close(): void {
        this.DIALOG_REF.close();
    }

    ngOnInit(): void {
        this.formData = this.formBuilder.group(this.FORM_GROUP_DEFINITION);
    }

}
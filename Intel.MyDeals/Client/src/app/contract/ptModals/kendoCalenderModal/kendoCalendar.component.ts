import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import * as _ from "underscore";


@Component({
    selector: "kendo-calendar-angular",
	template: `<div class="modal-header">
		<h3 class="modal-title" id="modal-title">Date picker</h3>
	</div>
	<div class="modal-body" id="modal-body">
		<div class="row">
			<div class="col-md-12">
				<p>
					Please click the box below to choose the date:
				</p>
				<kendo-datepicker
                  calendarType="classic"
                  [(ngModel)]="value"
				  (valueChange)="onChange(value)"
				  format="MM/dd/yyyy"
				  (keydown)="onKeyDown($event)"
				  calendarType="classic"
				  placeholder="Click to Select..."
				  class="inter-validate"
              ></kendo-datepicker>
				<p *ngIf="!isValidDate || isDateOverlap" class="err-Control" style="font-size:large">
					{{errorMsg }}
				</p>
				<p *ngIf="isConsumption" class="validation-Control" style="font-size:large">
					{{validMsg }}
				</p>
			</div>
		</div>
		<br />

		<div class="row">
			<div class="col-md-12">
				<div class="fr">
					<button class="btn btn-warning add-mar-five warn-custom" type="button" (click)="onNoClick()">Cancel</button>
					<button class="btn btn-primary prim-custom" type="button" (click)="onSave()" [disabled]="(!isValidDate)" [ngStyle]="{'opacity': isValidDate? 1 : .3}">Add to Grid</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">	</div>`,
	styles: [`
		.inter-validate{
			width: 100%;
			margin-bottom: 10px;
		}
		.add-mar-five {
			margin-right: 5px;
		}
	`]
  })


  export class kendoCalendarComponent {
   public value: Date;
    constructor(
      public dialogRef: MatDialogRef<kendoCalendarComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	private isValidDate: boolean;
	private isDateOverlap: boolean;
	private isConsumption: boolean;
	private validMsg: string;
	private errorMsg: string;

	private isStartDate: boolean;

	onChange(value) {
		this.isValidDate = true;
		this.isDateOverlap = false;
		this.isConsumption = this.data.isConsumption;
		this.validMsg = "";

		//check following validations are only for Start Date and End Date
		if (this.data.colName == "START_DT" || this.data.colName == "END_DT") {
			this.isStartDate = (this.data.colName === "START_DT");
			// date must overlapp contract range... not inside of the range - Tender contracts don't observe start/end date within contract.
			if (this.errorMsg != undefined) { // Put in to clear out old error messages
				this.errorMsg = undefined;
			}
			if (this.isStartDate && value > new Date(this.data.contractEndDate) && this.data.contractIsTender !== true) {
				this.errorMsg = "Dates must overlap contract's date range (" + this.data.contractStartDate.split(' ')[0] + " - " + this.data.contractEndDate.split(' ')[0] + ").";
				this.isValidDate = false;
			}
			if (!this.isStartDate && value < new Date(this.data.contractStartDate) && this.data.contractIsTender !== true) {
				this.errorMsg = "Dates must overlap contract's date range (" + this.data.contractStartDate.split(' ')[0] + " - " + this.data.contractEndDate.split(' ')[0] + ").";
				this.isValidDate = false;
			}
			if (((this.isStartDate && value < new Date(this.data.contractStartDate)) || (!this.isStartDate && value > new Date(this.data.contractEndDate))) && this.data.contractIsTender !== true) {
				this.errorMsg = "Extending Deal Dates will result in the extension of Contract Dates. Please click 'Add To Grid', if you want to proceed.";
				this.isDateOverlap = true;
			}
			if (this.isConsumption) {
				this.validMsg = "Changes to deal Start/End Dates for Consumption deals will change Billings Start/End Dates.  Validate Billings Start/End Dates with the Contract.";
			}
		}
		if (this.data.isOEM) {
			this.isValidDate = true;
		}
    }
	onKeyDown(event) {
		if (event.keyCode == 13) {
			this.onSave();
		}
	}
    onSave(){
      let date=moment(this.value).format('MM/DD/YYYY');
      this.dialogRef.close(date);
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
    ngOnInit() {
      if(this.data && this.data.cellCurrValues){
		  this.value = new Date(this.data.cellCurrValues);
		  this.onChange(this.value);
      }
    }
  }
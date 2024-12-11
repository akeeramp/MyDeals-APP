import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { List } from "linqts";
import { batchJobConstantsService } from "./admin.batchJobConstants.service";
import { constantsService } from "../constants/admin.constants.service";
import { logger } from "../../shared/logger/logger";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { MomentService } from "../../shared/moment/moment.service";


interface Item {
  text: string;
  value: number;
}
@Component({
    selector: 'batch-job-constants',
    templateUrl: 'Client/src/app/admin/batchJobConstants/admin.batchJobConstants.component.html',
    styleUrls: ['Client/src/app/admin/batchJobConstants/admin.batchJobConstants.component.css']
})

export class batchJobConstantsComponent implements OnInit,OnDestroy {

  constructor(
      private formBuilder: FormBuilder, 
      private batchJobCnstSrvc: batchJobConstantsService,
      private constantsService: constantsService,
      private momentService: MomentService,
      private loggerSvc: logger)
  { }

  public isFormValid = false;
  private readonly destroy$ = new Subject();
  public batchJobConstForm: FormGroup;
  isDirty = false;
  public secondRowCheckBox = false;
  private isLoading = true;
  public allData = true;
  public addData = false;
  public rowForm = false;
  public childGridResult: any;
  public childGridData: any;
  public arrayStepData: any = [];
  public childrenGridResult: any = [];
  public childrenGridData: any = [];
  public gridResult: Array<any>;
  public gridData: GridDataResult;
  public daysText: any = [];
  public isParentAdhocError = false;
  public isChildAdhocError = false;
  public parentAdhocError : string;
  public childAdhocError : string;
  public isRequiredMsg = "* field is required";
  public isDayError = false;
  public inputsDisable = false;
  private hasAccess = false;
  private validWWID: string;

  public weeklyDays: Array<{ text: string; value: number }> = [
    { text: "Sunday", value: 1 },
    { text: "Monday", value: 2 },
    { text: "Tuesday", value: 3 },
    { text: "Wednesday", value: 4 },
    { text: "Thursday", value: 5 },
    { text: "Friday", value: 6 },
    { text: "Saturday", value: 7 },
  ];
  public selectedItems: Item[] = [];

  public initialVal = {
    "BTCH_SID" :"0",
    "BTCH_NM" : "",
    "BTCH_DSC" : "",
    "RUN_SCHDL" : "",
    "ADHC_RUN" :  false,
    "ACTV_IND" : false,
    "STATUS" : "COMPLETED",
    "LST_RUN" : null,
    "TRGRD_BY" : ""
  }

  public runSchedule = {
    "D":"",
    "START":"",
    "END":"",
    "INTERVAL":""
  }

  public initialSteps = {
    "BTCH_STEP_SID" : "",
    "BTCH_SID" : "",
    "STEP_SRT_ORDR" : "",
    "STEP_NM" : "",
    "STEP_TYPE" : "",
    "ADHC_RUN" : false,
    "ACTV_IND": false,
    "TRGRD_BY":""
  }

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

  private childState: State = {
    skip: 0,
    take: 10,
    group: [],
    filter: {
        logic: "and",
        filters: [],
    }
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
    },
    {
        text: "All",
        value: "all",
    }
  ];

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.gridResult, this.state);
  }

  private createStepFormGroup(stepsArray: FormArray): FormGroup {
    return this.formBuilder.group({
      BTCH_STEP_SID : [],
      BTCH_SID : [],
      STEP_NM: ['', [Validators.required,this.uniqueStepNameValidator(stepsArray)]],
        STEP_SRT_ORDR: ['', [Validators.required, this.sortValidator.bind(this),this.uniqueSortOrderValidator(stepsArray)]],
      STEP_TYPE:['', Validators.required],
      ADHC_RUN:[true, Validators.required],
      ACTV_IND:[true, Validators.required],
      TRGRD_BY : []
    });
  }

  //Add step Fields on UI Dynamically
  addStepOnUI(): void {
    const newStepEntry = this.createStepFormGroup(this.stepsArray);
    this.stepsArray.push(newStepEntry);
  }

  get stepsArray(): FormArray {
    return this.batchJobConstForm.get('steps') as FormArray;
  }

  getStepsFormArr(index): FormGroup {
    const formGroup = this.stepsArray.at(index) as FormGroup;
    return formGroup;
  }

  convertToChildGridArray(parentDataItem) {
    const priceRuleObj = new List<any>(this.childrenGridResult);
    this.childGridResult = priceRuleObj
        .Where(function (x) {
            return (
                x.BTCH_SID == parentDataItem.BTCH_SID 
            );
        }).ToArray();
    this.childGridData = process(this.childGridResult, this.childState);
    return this.childGridData;
  }

  public onExcelExport(e: ExcelExportEvent): void {
    e.workbook.sheets[0].title = "Batch Job Constants Export";
  }

  getTimerNew(time) {
      const timer = time.split(":");
      const dateAdd = new Date(0, 0, 0, timer[0], timer[1], timer[2])
      return dateAdd;
  }

  editBatchJobData(dataItem) {
    this.allData = false;
    this.addData = true;
    const getBatchID = dataItem.BTCH_SID;
    this.arrayStepData = this.childrenGridResult.filter(x => x.BTCH_SID === getBatchID);
    let updateStart;
    let updateEnd;
    let intervalValues;

    if (dataItem.RUN_SCHDL == null) {
        updateStart = '';
        updateEnd = '';
        intervalValues = '';
    } else {
        this.gettingDaysForUpdate(dataItem);
        const startTime = this.getStart(dataItem.RUN_SCHDL);
        updateStart = this.getTimerNew(startTime)
        const endTime = this.getEnd(dataItem.RUN_SCHDL);
        updateEnd = this.getTimerNew(endTime)
        intervalValues = this.getInterval(dataItem.RUN_SCHDL);
    }

    this.batchJobConstForm = this.formBuilder.group({
      BTCH_SID:dataItem.BTCH_SID,
      BTCH_NM: [dataItem.BTCH_NM,{disabled:true}],
      BTCH_DSC: [dataItem.BTCH_DSC,Validators.required],
      START: [updateStart,Validators.required],
      END: [updateEnd,Validators.required],
      INTERVAL: [intervalValues,[Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      ADHC_RUN: [dataItem.ADHC_RUN, Validators.required],
      ACTV_IND: [dataItem.ACTV_IND, Validators.required],
      STATUS: dataItem.STATUS,
      TRGRD_BY : dataItem.TRGRD_BY,
      steps: this.formBuilder.array([]),
    });

    for (const stepIndVal of this.arrayStepData) {
      this.addStepDataForm(stepIndVal);
    }
    
    const arrLength = this.arrayStepData.length;
    if( arrLength > 0){
      this.rowForm = true;
      this.secondRowCheckBox = true;
    }else {
      this.rowForm = false;
      this.secondRowCheckBox = false;
    }

    if (dataItem.BTCH_NM === 'idfcdudeal301a' || dataItem.BTCH_NM === 'idfcdudealdsa301a' || dataItem.BTCH_NM == 'idfcdudealpic301a')
    {
      this.batchJobConstForm.controls['START'].disable();
      this.batchJobConstForm.controls['END'].disable();
      this.batchJobConstForm.controls['INTERVAL'].disable();
      this.inputsDisable = true;
    }
    else
    {
      this.inputsDisable = false;
    }
    
    this.batchJobConstForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isFormValid = this.checkFormValidity();
    });
  }

  gettingDaysForUpdate(dataItem){
    const valSeperate = JSON.parse(dataItem.RUN_SCHDL);
    if(valSeperate !== null){
      if(valSeperate == "Checking Schdl"){
          return "Checking Schdl"
      }else{
        const daysVal = valSeperate[0]['D'].split(',');
        this.selectedItems = [];
        for (const day of daysVal) {
          for (const weeklyDay of this.weeklyDays) {
              if (day == weeklyDay.value) {
                  this.selectedItems.push({ text: `${weeklyDay.text}`, value: weeklyDay.value });
              }
          }
        }
      }
    }
  }

  addStepDataForm(stepIndVal) {
    const stepsArray = this.stepsArray;
    const lessonForm = this.formBuilder.group({
      BTCH_STEP_SID : [''],
      BTCH_SID : [''],
      STEP_NM: ['', [Validators.required,this.uniqueStepNameValidator(stepsArray)]],
      STEP_SRT_ORDR: ['', [Validators.required, this.sortValidator,this.uniqueSortOrderValidator(stepsArray)]],
      STEP_TYPE: ['', Validators.required],
      ADHC_RUN: ['', Validators.required],
      ACTV_IND:['', Validators.required],
      TRGRD_BY:['']
    });

    lessonForm.patchValue(stepIndVal);
    this.stepsArray.push(lessonForm);
  }

  refreshGrid(){    
    this.isLoading = true;
    this.getAllBatchJobConstants();
  }

  timeZone(time){
    const hours = time.getHours();
    const min = time.getMinutes();
    const sec = time.getSeconds();
    const timeVal = hours+':'+min+':'+sec;
    return timeVal;
  }

  runScheduleVal(val){
    const dayVal = this.selectedItems.map(item => item.value).toString();
    const interval = val.INTERVAL;
    if (val.BTCH_NM == 'idfcdudeal301a' || val.BTCH_NM == 'idfcdudealpic301a' || val.BTCH_NM === 'idfcdudealdsa301a') {
        return null;
    } else {
        const startVal = this.timeZone(val.START);
        const endVal = this.timeZone(val.END);
        return '[{"D":"' + dayVal + '","START":"' + startVal + '","END":"' + endVal + '","INTERVAL":"' + interval + '"}]';
    }
  }

  checkAdhocValStepsTrue()
  {
    const batchJobConstVal = this.batchJobConstForm.value;
    let found = false;
    for (const step of batchJobConstVal.steps) {
      if (step.ADHC_RUN) {
          found = true;
          return found;
      }
    }
  }

  checkForAdhocConditionParent(e)
  {
    const tmp = e.checked;
    if(tmp)
    {
      const found = this.checkAdhocValStepsTrue();
      if(!found)
      {
        this.isChildAdhocError = true;
        this.isParentAdhocError = false;
        this.childAdhocError = 'Please make sure at least one Step is enabled for AdHoc as Job AdHoc is being enabled';
      }
      else
      {
        this.childAdhocError = this.parentAdhocError = '';
        this.isChildAdhocError= this.isParentAdhocError  = false;
      }
    }
    else
    {
      const found = this.checkAdhocValStepsTrue();
      if(found)
      {
       this.isChildAdhocError = true;
       this.childAdhocError = 'Please make sure all the Steps are disabled for AdHoc as Job AdHoc is being disabled';
       this.isParentAdhocError = false;
      }
      else
      {
        this.childAdhocError = this.parentAdhocError = '';
        this.isChildAdhocError= this.isParentAdhocError  = false;
      }
    }
    this.isFormValid = this.checkFormValidity();
  }

  checkForAdhocConditionChild(e)
  {
    const tmp = e.checked;
    const batchJobConstVal = this.batchJobConstForm.value;
    const adhocParent = batchJobConstVal.ADHC_RUN;
    if(tmp)
    {
      if(!adhocParent)
        { 
          this.isParentAdhocError = true;
          this.parentAdhocError = 'Please make sure the Job AdHoc is enabled as the Step AdHoc is being enabled';
        }
      else
      {
          this.childAdhocError = this.parentAdhocError = ''; 
          this.isChildAdhocError= this.isParentAdhocError  = false;
      }
    }
    else
    {
      if(!adhocParent)
      {
        const found = this.checkAdhocValStepsTrue();
        if(found)
        {
         this.isChildAdhocError = true;
         this.childAdhocError = 'Please make sure all the Steps should be disabled for AdHoc as Job AdHoc is disabled';
         this.isParentAdhocError = false;
        }
        else
        {
          this.childAdhocError = this.parentAdhocError = '';
          this.isChildAdhocError= this.isParentAdhocError  = false;
        }
      }
      else
      {
        const found = this.checkAdhocValStepsTrue();
        if(!found)
        {
         this.isChildAdhocError = true;
         this.childAdhocError = 'Please make sure at least one Step is enabled for AdHoc as Job AdHoc is enabled';
         this.isParentAdhocError = false;
        }
        else
        {
          this.childAdhocError = this.parentAdhocError = '';
          this.isChildAdhocError= this.isParentAdhocError  = false;
        }
      }
    }
    this.isFormValid = this.checkFormValidity();
  }
  checkForAdhocCondition()
  {
    const batchJobConstVal = this.batchJobConstForm.value;
    const adhocParent = batchJobConstVal.ADHC_RUN;
    if(adhocParent)
    {
      const found = this.checkAdhocValStepsTrue();
      if(!found)
      {
        this.isChildAdhocError = true;
      }
    }
    if(this.checkAdhocValStepsTrue() && adhocParent==false)
    {
      this.isParentAdhocError = true;
    }
  }

  fromDataArray<T>(klass: new () => T, data: any[]) {
    const obj = new klass();
    Object.keys(obj).forEach((k, i) => obj[k] = data[i]);

    return obj;
  }

  // Validator to check if the value is greater than 0
  sortValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value !== null && control.value <= 0) {
      return { 'sortOrder': true };
    }
    return null;
  }

  // Factory function to create a validator that checks for unique sort order
  uniqueSortOrderValidator(stepsArray: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const sortOrderValue = control.value;
      const otherSteps = stepsArray.controls.filter(c => c.get('STEP_SRT_ORDR') !== control);
      const isDuplicateSortOrder = otherSteps.some(step => step.value.STEP_SRT_ORDR === sortOrderValue);
      return isDuplicateSortOrder ? { 'uniqueSortOrder': true } : null;
    };
  }
  
  uniqueStepNameValidator(stepsArray: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const stepNameValue = control.value;
      const otherSteps = stepsArray.controls.filter(c => c.get('STEP_NM') !== control);
      const isDuplicate = otherSteps.some(step => step.value.STEP_NM === stepNameValue);
      return isDuplicate ? { 'uniqueStepName': true } : null;
    };
  }

  onDayChange() {
    this.isDayError = this.selectedItems.length === 0;
    this.isFormValid = this.checkFormValidity();
  }

  checkFormValidity() {
    const isFormDataValid = this.batchJobConstForm.valid && !this.isDayError && !this.isChildAdhocError && !this.isParentAdhocError;
    return isFormDataValid;
  }

  saveConstants() {
    const batchJobConstVal = this.batchJobConstForm.value;    
    this.checkForAdhocCondition();
    batchJobConstVal.RUN_SCHDL = this.runScheduleVal(batchJobConstVal);
    const batchJobStepConstantsVal = batchJobConstVal.steps;
  
    // Check if the form is valid before proceeding with the save operation

    if (this.isFormValid) {
      this.isLoading = true;
      this.batchJobCnstSrvc.updateBatchJobConstants(batchJobConstVal, 'UPDATE').pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.loggerSvc.success("Batch Job Constants Data Updated successfully");
        this.getAllBatchJobConstants();
      }, (error) => {
        const errMsg = error.error ? error.error : "Unable to Update Batch Job Constants Data";
        this.loggerSvc.error(errMsg, "Error");
        this.isLoading = false;
      });
  
      const serializedForm = JSON.stringify(batchJobStepConstantsVal);
      this.batchJobCnstSrvc.updateBatchJobStepConstants('UPDATE', batchJobConstVal.BTCH_SID, serializedForm).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.loggerSvc.success("Batch Job Steps Updated successfully");
      }, (error) => {
        const errMsg = error.error ? error.error : "Unable to Update Batch Job Steps";
        this.loggerSvc.error(errMsg, "Error");
        this.isLoading = false;
      });   

      this.cancel();

    } else {
      this.loggerSvc.warn("Please Enter Valid data","Invalid Form Data");
    }
  }

  cancel(){
    this.allData = true;
    this.addData = false;
    this.rowForm = false;   
    this.secondRowCheckBox = false; 
    this.batchJobConstForm.reset();
    this.selectedItems = [];
    this.isFormValid = false;
    this.isDayError = false;
    this.isParentAdhocError = false;
    this.isChildAdhocError = false;
  }

  secondRowEnable(e){
    const tmp = e.target.checked;
    if(tmp){
      this.rowForm = true;
      this.secondRowCheckBox = true;
    }else{
      this.rowForm = false;
      this.secondRowCheckBox = false;
    }
  }

  getAllBatchJobConstants(){
    this.isLoading = true;
    this.batchJobCnstSrvc.getAllBatchJobConstDetails('select').pipe(takeUntil(this.destroy$))
      .subscribe((result:Array<any>)=>{
        this.isLoading = false;
        this.gridResult = result;
        this.gridData = process(result, this.state);
      }, (error) => {
        const errMsg = error.error ? error.error : 'Unable to get Batch Job Constant data';
        this.loggerSvc.error(errMsg, "Error");
        this.isLoading = false;
    })

    this.batchJobCnstSrvc.updateBatchJobStepConstants('select',0,'').pipe(takeUntil(this.destroy$))
      .subscribe((result:Array<any>)=>{
        this.isLoading = false;
        this.childrenGridResult = result;
      }, (error) => {
        const errMsg = error.error ? error.error : 'Unable to get Batch Job Steps Data';
        this.loggerSvc.error(errMsg, "Error");
        this.isLoading = false;
    })
  }

  getDays(days){
    if(days !== null){
      if(days == "Checking Schdl"){
        return "Checking Schdl";
      }else{
        const daysVal = JSON.parse(days);
        const daysInt = daysVal[0]['D'].split(',');
        let daysTextString = [];
        for (const dayInt of daysInt) {
          for (const day of this.weeklyDays) {
            if (dayInt == day.value) {
              daysTextString.push(day.text);
            }
          }
        }
        const stringTextDay = daysTextString.toString()
        return stringTextDay;
      }
    }
  }

  padZero(value) {
    return value.toString().padStart(2, '0');
  }
  
  formatTime(time) {
    const [hours, minutes, seconds] = time.split(':');
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }
  
  getStart(start, isDisplay = false) {
    if (start !== null) {
      if (start === "Checking Schdl") {
        return "Checking Schdl";
      } else {
        const startVal = JSON.parse(start);
        const startValInt = startVal[0]['START'];
        return isDisplay ? this.formatTime(startValInt) : startValInt;
      }
    }
  }
  
  getEnd(end, isDisplay = false) {
    if (end !== null) {
      if (end === "Checking Schdl") {
        return "Checking Schdl";
      } else {
        const endVal = JSON.parse(end);
        const endValInt = endVal[0]['END'];
        return isDisplay ? this.formatTime(endValInt) : endValInt;
      }
    }
  }

  formatInterval(interval) {
    const hours = Math.floor(interval / 60);
    const minutes = interval % 60;
    let formattedInterval = '';
    if (hours > 0) {
      formattedInterval += `${hours} Hr`;
    }
    if (minutes > 0) {
      if (hours > 0) {
        formattedInterval += ' ';
      }
      formattedInterval += `${minutes} Min`;
    }
    return formattedInterval;
  }
  
  getInterval(interval, isDisplay = false) {
    if (interval !== null) {
      if (interval === "Checking Schdl") {
        return "Checking Schdl";
      } else {
        const intervalVal = JSON.parse(interval);
        const intervalVallInt = intervalVal[0]['INTERVAL'];
        return isDisplay ? this.formatInterval(intervalVallInt) : intervalVallInt;
      }
    }
  }

  getLastRun(lastRun,isDisplay = false) {
      const lastRunVal = this.momentService.moment(lastRun).format("MM/DD/YYYY,  HH:mm:ss");
      return isDisplay ? lastRunVal : lastRun;
  }

  private redirectInvalidAccess(){
    window.alert("User does not have access to the screen. Press OK to redirect to Dashboard.");
    document.location.href = "/Dashboard#/portal";
  }

  async checkPageAccess() {
    const response = await this.constantsService.getConstantsByName("SSIS_CNST_EMP_ID").toPromise().catch(error => {
        this.loggerSvc.error("Unable to fetch Employee Id",error,error.statusText);
    });

    if(response) {
      this.validWWID = response.CNST_VAL_TXT === "NA" ? "" : response.CNST_VAL_TXT;
      this.hasAccess = this.validWWID.indexOf((<any>window).usrDupWwid) > -1;
      if (this.hasAccess) {
        this.getAllBatchJobConstants();
      } else {
        this.redirectInvalidAccess();
      }
    }else {
      this.redirectInvalidAccess();
    }
  }

  ngOnInit() {
      this.isLoading = true;
      this.checkPageAccess();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
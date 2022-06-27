import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult,DataStateChangeEvent,PageSizeItem,SelectAllCheckboxState, CellClickEvent, CellCloseEvent} from "@progress/kendo-angular-grid";
import { distinct, process,State} from "@progress/kendo-data-query";
import {meetCompContractService} from "../meetComp/meetComp.component.service"
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Keys } from "@progress/kendo-angular-common";

@Component({
    selector: "meet-comp-contract",
    templateUrl: 'Client/src/app/contract/meetComp/meetComp.component.html',
    styleUrls: ['Client/src/app/contract/meetComp/meetComp.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class meetCompContractComponent implements OnInit,OnDestroy {
 
    @Input() private objSid;
    @Input() private isAdhoc;
    @Input() private objTypeId;
    @Input() private lastMeetCompRun;
    @Input() private pageNm;

    constructor(private loggerSvc: logger,private meetCompSvc: meetCompContractService,private formBuilder: FormBuilder ) {
         //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
         $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
         $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    public spinnerMessageHeader = "";
    public isLoading = false;
    public spinnerMessageDescription = "";
    public lastMetCompRunLocalTime = "local time"
    public hideViewMeetCompResult = (<any>window).usrRole === "FSE"; 
    public hideViewMeetCompOverride = !((<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal");
    public canUpdateMeetCompSKUPriceBench = ((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA");
    public columnIndex = {
        COMP_SKU: 7,
        COMP_PRC: 7,
        IA_BNCH: 9,
        COMP_BNCH: 10,
        COMP_OVRRD_FLG: 13,
        COMP_OVRRD_RSN: 13
    };
    
    public isDataAvaialable = true;
    public errorList = [];
    public validationMessage = "";
    public setUpdateFlag = false;
    public runIfStaleByHours = 3;
    public MC_MODE = "D";
    // public PAGE_NM = pageNm;
    public meetCompMasterdata = [];
    public isMeetCompRun = false;
    public isGridEditable = true;
    public isEditableGrid = 'True'; 
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";

    private gridData: GridDataResult;
    private childGridData: GridDataResult;
    private gridResult;
    public childGridResult;
    private state: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private childState: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private pageSizes: PageSizeItem[] = [
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
        }
    ];

    public onSelectedKeysChange(): void {
        const len = this.mySelection.length;
        if (len === 0) {
          this.selectAllState = "unchecked";
        } else if (len > 0 && len < this.gridResult.length) {
          this.selectAllState = "indeterminate";
        } else {
          this.selectAllState = "checked";
        }
        
    }
    
    public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
        if (checkedState === "checked") {
            this.selectAllState = "checked";
            this.mySelection = this.gridResult.map((val,index)=> index);
        } else {
            this.mySelection = [];
            this.selectAllState = "unchecked";
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    childDataStateChange(state: DataStateChangeEvent): void {
        this.childState = state;
        this.childGridData = process(this.childGridResult, this.childState);
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    distinctPrimitiveChild(fieldName: string): any {
        return distinct(this.childGridResult, fieldName).map(item => item[fieldName]);
    }

    ngOnInit(): void {
        console.log("MeetComp Loaded");
        this.loadMeetCompData();
    }

    convertToChildGridArray(parentDataItem){
        this.childGridResult = this.meetCompMasterdata.filter((x)=>(x.GRP_PRD_SID == parentDataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.DEFAULT_FLAG == "D"));
        this.childGridResult.sort((a,b)=>{
            const fa = a.MEET_COMP_STS.toLowerCase();
            const fb = b.MEET_COMP_STS.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
        this.childGridData = process(this.childGridResult,this.childState);
        return this.childGridData;
    }

    public cellClickHandler(args: CellClickEvent): void {
        if (!args.isEdited) {
          args.sender.editCell(
            args.rowIndex,
            args.columnIndex,
            this.createFormGroup(args.dataItem)
          );
        }
      }
    
      public cellCloseHandler(args: CellCloseEvent): void {
        const { formGroup, dataItem } = args;
    
        if (!formGroup.valid) {
          // prevent closing the edited cell if there are invalid values.
          args.preventDefault();
        } else if (formGroup.dirty) {
          if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
            return;
          }
        }
      }

    public createFormGroup(dataItem): FormGroup {
        return this.formBuilder.group({
        COMP_SKU: [dataItem.COMP_SKU],
        COMP_PRC: [dataItem.COMP_PRC]
        });
      }

    loadMeetCompData(){
        this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
        this.MC_MODE = 'A';
        this.meetCompSvc.getMeetCompProductDetails( this.objSid, this.MC_MODE ,this.objTypeId).subscribe((response : Array<any>)=> {
            this.meetCompMasterdata = response;
            this.gridResult = this.meetCompMasterdata.filter((x) => (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y"));
            this.gridResult.sort((a,b)=>{
                const fa = a.MEET_COMP_STS.toLowerCase();
                const fb = b.MEET_COMP_STS.toLowerCase();

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
            this.gridData = process(this.gridResult,this.state);
            this.isLoading = false;
        },(error) => {
            this.loggerSvc.error("Unable to get GetMeetCompProductDetails data", error);
        });
    }

    onCompSkuChange(val:any){
        console.log(val);
        
    }

    onCompPriceChange(val:any){
        console.log(val);
        
    }

    setBusy(msg, detail) {
        setTimeout( ()=> {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                return;
            }

            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
            } else {
                setTimeout( ()=> {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                }, 100);
            }
        });
    }

    lastMeetCompRunCalc() { 
        return "Meet Comp Last Run: 2 hrs ago";
    }

    saveAndRunMeetComp(){
        //kujoih
    }

    forceRunMeetComp(){
        //sjcvacv
    }
    
    showHelpTopic(){
        //kyhvkyuv
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "meetCompContract",
        downgradeComponent({ component: meetCompContractComponent  })
    );
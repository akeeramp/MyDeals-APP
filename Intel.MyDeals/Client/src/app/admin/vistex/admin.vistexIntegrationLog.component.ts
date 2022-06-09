import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { dsaService } from "./admin.vistex.service";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import * as moment from 'moment';
import { GridDataResult,DataStateChangeEvent,PageSizeItem} from "@progress/kendo-angular-grid";
import { process,State,distinct} from "@progress/kendo-data-query";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
    selector: "vistexIntegrationLog",
    templateUrl: 'Client/src/app/admin/vistex/admin.vistexIntegrationLog.component.html',
    styleUrls: ['Client/src/app/admin/vistex/admin.vistexIntegrationLog.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class adminVistexIntegrationLogComponent implements OnInit,OnDestroy {

    constructor(private loggerSvc: logger, private dsaService: dsaService) {
         //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
         $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
         $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private requestTypeList =  [];
    private selectedRequestType = {RQST_TYPE : "VISTEX_DEALS",
                            RQST_NAME: "VISTEX DEALS"};
    private spinnerMessageHeader = "Integration Logs"; 
    private spinnerMessageDescription = "Please wait while we loading integration logs..";
    private editedRowData;
    private VistexStatuses = [];
    private DealIds = "";
    private IsDealIdsValid = true;
    private startDate: Date = new Date(moment().subtract(30, 'days').format("MM/DD/YYYY"));
    private endDate: Date = new Date(moment().format("MM/DD/YYYY")); 
    private isLoading = true;
    private showKendoAlert = false;
    private kendoAlertMsg = "";
    private kendoBoldMsg = "";
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;

    private type = "numeric";
    private info = true;
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
    public gridResult: Array<any>;

    ngOnInit(){
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }

        this.dsaService.getRequestTypeList().subscribe(response => {
            this.requestTypeList = response;
        },function (err) {
            this.loggerSvc.error("Error in getting Request Types",err,err.statusText)
        });
        this.getData();
    }

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

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    getData(){
        this.startDate = new Date(moment(this.startDate).format("MM/DD/YYYY"));
        this.endDate = new Date(moment(this.endDate).format("MM/DD/YYYY"));            
                    
        if (moment(this.startDate, "MM/DD/YYYY", true).isValid() && moment(this.endDate, "MM/DD/YYYY", true).isValid() && moment(this.startDate).isBefore(this.endDate)) {
            if (this.selectedRequestType == undefined || this.selectedRequestType.RQST_TYPE == undefined || this.selectedRequestType.RQST_TYPE == "" || this.selectedRequestType.RQST_TYPE == null) {
                this.showKendoAlert = true;
                this.kendoAlertMsg = "Please Select Request Type";
                this.kendoBoldMsg = "";
                return;
            }
            this.isLoading = true;
            const postData = {
                "Dealmode": this.selectedRequestType.RQST_TYPE,
                "StartDate": moment(this.startDate).format("MM/DD/YYYY") ,
                "EndDate": moment(this.endDate).format("MM/DD/YYYY")
            }
            this.dsaService.getVistexLogs(postData).subscribe((response)=> {
                this.gridResult = response;
                this.gridData = process(this.gridResult,this.state);
                this.isLoading = false;
            }, function (err) {
                this.loggerSvc.error("Operation failed",err,err.statusText)
            });

            this.dsaService.getVistexStatuses().subscribe( (response)=> {
                this.VistexStatuses = response;
            }, function (err) {
                this.loggerSvc.error("Unable to get statuses of vistex",err,err.statusText);
            });
        }
        else {
            this.showKendoAlert = true;
            this.kendoAlertMsg = "Please provide valid";
            this.kendoBoldMsg =  " Start and End Date";
            this.startDate = new Date(moment().subtract(30, 'days').format("MM/DD/YYYY"));
            this.endDate = new Date(moment().format("MM/DD/YYYY"));
        }
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            RQST_SID: new FormControl({value: dataItem.RQST_SID,disabled: true}),
            BTCH_ID: new FormControl({ value: dataItem.BTCH_ID, disabled: true }),
            VISTEX_HYBRID_TYPE: new FormControl({ value: dataItem.VISTEX_HYBRID_TYPE, disabled: true }),
            DEAL_ID: new FormControl({ value: dataItem.DEAL_ID, disabled: true }),
            RQST_STS: new FormControl(dataItem.RQST_STS),
            ERR_MSG: new FormControl(dataItem.ERR_MSG),
            INTRFC_RQST_DTM: new FormControl({ value: dataItem.INTRFC_RQST_DTM, disabled: true }),
            INTRFC_RSPN_DTM: new FormControl({ value: dataItem.INTRFC_RSPN_DTM, disabled: true }),
            CRE_DTM: new FormControl({ value: dataItem.CRE_DTM, disabled: true }),    
        });
        this.formGroup.valueChanges.subscribe(() => {     
            this.isFormChange = true;
        });
        this.editedRowData = dataItem;
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    closeKendoAlert(){
        this.showKendoAlert = false;
    }

    SendVistexData(){
        const RegxDealIds = new RegExp(/^[0-9,]+$/);
        if (this.DealIds != undefined){
                this.DealIds = this.DealIds.replace(/ /g, "");
        }
        this.IsDealIdsValid = this.DealIds != undefined && this.DealIds != '' && RegxDealIds.test(this.DealIds);
        if (this.IsDealIdsValid) {
            let dealIdsArray = this.DealIds.trim().split(',');
            dealIdsArray = dealIdsArray.filter(x => x.trim() != "");
            if (dealIdsArray.length > 0) {
                this.isLoading = true;
                this.dsaService.sendVistexData(dealIdsArray).subscribe((response)=> {
                    if (response.data.length > 0) {
                        this.gridResult = response.data;
                        this.gridData = process(this.gridResult,this.state);
                        this.isLoading = false;
                        this.DealIds = "";
                        this.loggerSvc.success("Data has been sent!");
                    } else {
                        this.isLoading = false;
                        this.loggerSvc.error("Unable to send data!","Error");
                    }
                },  (err)=> {
                    this.isLoading = false;
                    this.loggerSvc.error("Unable to send data!",err.statusText);
                });
            } else {
                this.loggerSvc.warn("There is no Deal ID to send!","Warning");
            }
        }
    }

    saveHandler({ sender, rowIndex, formGroup}) {
        const selectedRow = formGroup.getRawValue();
        //check if row value is changed/updated
        if (selectedRow.RQST_STS != this.editedRowData.RQST_STS || selectedRow.ERR_MSG != this.editedRowData.ERR_MSG) { 
            this.UpdateVistexStatus(selectedRow.BTCH_ID,selectedRow.DEAL_ID,selectedRow.RQST_SID,selectedRow.RQST_STS,selectedRow.ERR_MSG);
        }
        sender.closeRow(rowIndex);
    }

    UpdateVistexStatus(strTransantionId, dealId, rqstSid,rqstStatus,errMsg) {
        if (errMsg == ''){
            errMsg = null;
        }
        this.spinnerMessageDescription = "Please wait while updating the status..";
        this.isLoading = true;
        //create object and pass - postDataObj
        const postDataObj = {
            "strTransantionId" : strTransantionId,
            "strVistexStage" : rqstStatus, 
            "dealId" : dealId, 
            "strErrorMessage" : errMsg,
            "rqstSid": rqstSid 
        }
        this.dsaService.updateVistexStatusNew(postDataObj).subscribe( (response)=> {
            if (response == strTransantionId) {
                angular.forEach(this.gridResult.filter(x => x.RQST_SID === rqstSid), function (dataItem) {
                    dataItem.ERR_MSG = errMsg == null ? '' : errMsg;
                    dataItem.RQST_STS = rqstStatus;
                    dataItem.BTCH_ID = rqstStatus.toLowerCase() == 'pending' ? '00000000-0000-0000-0000-000000000000': dataItem.BTCH_ID;
                }); 
                this.gridData = process(this.gridResult,this.state);                 
                this.isLoading = false;                  
                this.loggerSvc.success("Status has been updated with the message");
                this.getData();
            } else {
                this.isLoading = false;
                this.loggerSvc.error("Unable to update the status!","Error");
            }
        }, (response)=> {
            this.isLoading = false;
            this.loggerSvc.error("Unable to update the status!",response,response.statusText);
        });
    }

    onRequestTypeChange(value){
        if (value == undefined || value == null || value == ""){return;}
        this.selectedRequestType = value;
        this.getData();
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.getData();
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular
    .module("app")
    .directive(
        "vistexIntegrationLog",
        downgradeComponent({ component: adminVistexIntegrationLogComponent })
    );
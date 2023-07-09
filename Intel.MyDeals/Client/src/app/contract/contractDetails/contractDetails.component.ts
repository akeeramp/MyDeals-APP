import { Component, Input, Output, EventEmitter } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { contractDetailsService } from "./contractDetails.service";
import { FormGroup } from "@angular/forms";
import { templatesService } from "../../shared/services/templates.service";
import { MomentService } from "../../shared/moment/moment.service";
import { forkJoin } from "rxjs";
import { FileRestrictions, UploadEvent } from "@progress/kendo-angular-upload";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { GridUtil } from "../grid.util";
import { DatePipe } from '@angular/common';
import { NewContractWidgetService } from "../../dashboard/newContractWidget/newContractWidget.service"
import { each } from 'underscore';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'contract-details',
    templateUrl: 'Client/src/app/contract/contractDetails/contractDetails.component.html',
    styleUrls: ['Client/src/app/contract/contractDetails/contractDetails.component.css'],
})
export class contractDetailsComponent {
    contractType: string;
    disableCustomer: boolean = false;
    disableCustAccpt: boolean = false;
    disableSave:boolean=false;
    constructor(private templatesSvc: templatesService,
                private contractDetailsSvc: contractDetailsService,
                private datePipe: DatePipe,
                private loggerSvc: logger,
                private newContractWidgetSvc: NewContractWidgetService,
                private route: ActivatedRoute,
                private momentService: MomentService) { }
    @Input() C_ID: number;
    private Customer;
    CUST_NM_DIV: any = []; CUST_NM; TITLE = ""; files = []; START_DT; START_QTR; START_YR; END_DT; END_QTR; END_YR; NO_END_DT = false; NO_END_DT_RSN; isSubmitted = false; NOTES = "";
    BACK_DATE_RSN; CONTRACT_TYPE;
    public c_Id: number;
    public templateData;
    public Customers: Array<any>=[];
    public CustomersFilterData: Array<any>=[];
    public Customer_Divs: Array<any>;
    public CustomerFilter_Divs: Array<any>;
    public ContractDataForm: FormGroup;
    public contractData;
    private timeout = null;
    private C2A_DATA_C2A_ID = "";
    public uid = -100;
    public custId: number;
    public contractId: number;
    public renameMapping = {};
    public curPricingTable = {};
    public isCustomerSelected: boolean;
    public initialEndDateReadOnly = false;
    public initialStartDateReadOnly = false;
    public isTitleError = false; hasUnSavedFiles = false;
    public isCustomerDivHidden = true;
    public custAccptData; selectedFileCount = 0;
    public dropDownsData = {};
    public titleErrorMsg: string;
    public isTender = false;
    public today: string = this.momentService.moment().format("MM/DD/YYYY");
    public MinYear: number; public MaxYear: number; public MinDate: string;
    public MaxDate: string;
    public saveBtnName: string; isTenderContract = false;
    public format = "#"; public selectedCUST_ACCPT = "Pending"; uploadSuccess = false;
    public isendDTReasonReq = false; public isCopyContract = false; public isBackdatepopupopend = false; public isBackDate = false;
    isDivBlankPopupOpen = false; isMissingGrpCode = false; isValid = false;
    public stDate: Date; isRequiredMsg = "* field is required"; existingMinEndDate: Date = null;
    public copyContractData: any; public uploadSaveUrl = "/FileAttachments/Save";
    public TimeLineDetails: Array<any>;
    public showDeleteButton = false;
    public C_DELETE_ATTACHMENTS: boolean = false;
    public isDeleteAttachment: boolean = false;
    public isDeleteContract: boolean = false;
    private isNewContract = false;
    private attachmentCount = 0;
    private initComplete = false;
    private attachmentsDataSource: any = [];
    private gridData: GridDataResult;
    private btnText = "Show More";
    private isShowBtn = false;
    private maxCount = 5;
    private deleteAttachmentParams: any = {};
    private isLoading: boolean = false;
    private msgType: string = "";
    private spinnerMessageHeader: string = "Contract Details";
    private spinnerMessageDescription: string = "Contract Details Loading..";
    private isBusyShowFunFact: boolean = true;
    private backdatereasonsdropdownlist: any = null;
    @Output() openHistoryTab: EventEmitter<object> = new EventEmitter<object>();
    isNotesDisabled = (<any>window).usrRole === 'RA' || (<any>window).usrRole === 'Legal' || (<any>window).usrRole === 'CBA' || ((<any>window).isBulkPriceAdmin && (<any>window).usrRole === 'SA') || (<any>window).isCustomerAdmin ? false : true;
    isRoleDisabled = (<any>window).usrRole === 'CBA' || (<any>window).usrRole === 'RA';
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.attachmentsDataSource, this.state);
    }
    // Allowed extensions for the attachments field
    myRestrictions: FileRestrictions = {
        allowedExtensions: ["doc", "xls", "txt", "bmp", "jpg", "pdf", "ppt", "zip", "xlsx", "docx", "pptx", "odt", "ods", "ott", "sxw", "sxc", "png", "7z", "xps"],
    };

    uploadEventHandler(e: UploadEvent) {
        e.data = {
            custMbrSid: this.contractData.CUST_MBR_SID,
            objSid: this.contractData.DC_ID,
            objTypeSid: 1
        };
        this.contractData._behaviors.isRequired.C2A_DATA_C2A_ID = false;
        this.contractData["HAS_ATTACHED_FILES"] = "1";
    }

    onFileUploadComplete() {
        if (this.uploadSuccess) {
            this.loggerSvc.success("Successfully uploaded " + this.files.length + " attachment(s).", "Upload successful");

            this.isLoading = false;
            this.setBusy("", "", "", false);
            window.location.href = "Contract#/manager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0"; 
        }
    }

    uploadFile() {
        $(".k-upload-selected").click();
    }

    onFileSelect() {
        this.selectedFileCount++;
        // Hide default kendo upload and clear buttons, as contract is not generated at this point. Upload files after contract id is generated.
        setTimeout(() => {
            $(".k-clear-selected").parent().hide();
            $(".k-upload-selected").parent().hide();
        });
        this.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = this.contractData._behaviors.isError["C2A_DATA_C2A_ID"] = false;
        if (this.contractData.DC_ID < 0) this.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
        this.hasUnSavedFiles = true;
        this.contractData.AttachmentError = false;
    }

    onFileRemove() {
        this.selectedFileCount--;
        if (this.selectedFileCount <= 0 && !this.isTenderContract) {
            if (this.selectedCUST_ACCPT.toLowerCase() != "pending") { this.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = true; }
            this.hasUnSavedFiles = false;
        }
    }

    onFileUploadError() {
        this.loggerSvc.error("Unable to upload " + " attachment(s).", "Upload failed");
    }

    successEventHandler() {
        this.uploadSuccess = true;
    }
    updateDataOnCustomerChange(custObj){
        this.contractData["Customer"] = custObj;
        this.contractData["CUST_MBR_SID"] = custObj?.CUST_SID;
        this.contractData["CUST_ACCNT_DIV_UI"] = this.contractData["CUST_ACCNT_DIV"] = "";
        this.CUST_NM_DIV = [];
        this.NO_END_DT = this.contractData.NO_END_DT = false;
        this.noEndDate();
        this.updateCorpDivision(custObj.CUST_SID);
        this.getCurrentQuarterDetails();
        this.applyTodayDate();
        this.BACK_DATE_RSN = this.NO_END_DT_RSN = undefined;// on change of the contract customer clear the backdate/end date reason values present if any
    }

    onCustomerChange(evt: any) {
        if (evt != undefined) {
            this.updateDataOnCustomerChange(evt);
        }
    }

    loadContractDetails() {
        this.contractData["DC_ID"] = this.uid;
        // Set dates Max and Min Values for numeric text box
        // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
        this.contractData.MinYear = this.MinYear = parseInt(this.momentService.moment().format("YYYY")) - 6;
        this.contractData.MaxYear = this.MaxYear = parseInt(this.momentService.moment("2099").format("YYYY"));
        // Set the initial Max and Min date, actual dates will be updated as per the selected customer
        this.contractData.MinDate = this.MinDate = this.momentService.moment().subtract(6, "years").format("MM/DD/YYYY");
        this.contractData.MaxDate = this.MaxDate = this.momentService.moment("2099").format("MM/DD/YYYY");
        //loading initial values of Contract
        this.contractData["NO_END_DT"] = false;
        this.contractData["CUST_MBR_SID"] = "";
        this.contractData.CUST_ACCNT_DIV_UI = "";
        this.contractData["CONTRACT_TYPE"] = "Standard";
        this.contractData["CUST_ACCPT"] = "Pending";
        this.contractData["AttachmentError"] = false;
        this.contractData["CUST_ACCNT_DIV_UI"] = "";
        this.contractData["IsAttachmentRequired"] = false;
        this.contractData["HAS_ATTACHED_FILES"] = "0";
        this.contractData["C2A_DATA_C2A_ID"] = "";
        this.contractData["BACK_DATE_RSN"] = "";
        this.contractData["NOTES"] = "";
        this.contractData._behaviors.isDirty = {};
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = this.contractData.BACK_DATE_RSN !== "" && this.contractData.BACK_DATE_RSN !== undefined;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = !this.contractData._behaviors.isRequired["BACK_DATE_RSN"];
        this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
        this.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = false;
    }

    onKeySearch(event: any, inputField) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (inputField == "START_YR" || inputField == "END_YR") {
                this.getCurrentQuarterDetails(inputField);
            }
            else if (event.keyCode != 13 && event.keyCode != 9) {
                this.isDuplicateContractTitle(event.target.value);
            }
        }, 800);
    }

    // Contract name validation
    isDuplicateContractTitle(title: string) {
        if (title === "") return;
        this.disableSave = true;
        const dcID = this.contractData["DC_ID"] == -100 ? 0 : this.contractData["DC_ID"]
        this.contractDetailsSvc.isDuplicateContractTitle(dcID, title)
            .subscribe((response: Array<any>) => {
                if (response) {
                    this.disableSave=true;
                    this.isTitleError = true;
                    this.titleErrorMsg = "This contract name already exists in another contract.";
                } else {
                    this.disableSave=false;
                    this.isTitleError = false;
                    this.titleErrorMsg = "";
                }
            }, error => {
                this.loggerSvc.error("Unable to get the duplicate contract title", error);
            });
    }

    //Get Customer Divisions
    updateCorpDivision(custID) {
        if (custID === "" || custID == null) return;
        this.contractDetailsSvc.getMyCustomerDivsByCustNmSid(custID).subscribe(
            (response: Array<any>) => {
                this.Customer_Divs = response.filter(x => x.CUST_LVL_SID == 2003);
                //for filtering purpose
                this.CustomerFilter_Divs = response.filter(x => x.CUST_LVL_SID == 2003);
                if (this.isCopyContract && this.contractData.CUST_ACCNT_DIV_UI.length > 0) {
                    this.contractData.CUST_ACCNT_DIV_UI.forEach((cust) => {
                        const selectedCustDiv = this.Customer_Divs.filter(x => x.CUST_DIV_NM == cust)
                        if (selectedCustDiv.length > 0) this.CUST_NM_DIV.push(selectedCustDiv[0]);
                    })
                }
                //code to bind selected customer division on contract details load for existing contract 
                if (!this.isCopyContract && this.contractData && this.contractData.CUST_ACCNT_DIV && this.CustomerFilter_Divs && this.CustomerFilter_Divs.length>0){
                    //setting the customer division dropdown value ngModel
                    let selCustDiv= this.contractData.CUST_ACCNT_DIV.split('/');
                    if(selCustDiv && selCustDiv.length>0){
                        each(this.CustomerFilter_Divs,itm=>{
                           each(selCustDiv,selDiv=>{
                            if(itm.CUST_DIV_NM==selDiv){
                                this.CUST_NM_DIV.push(itm)
                            }
                           })
                        })
                    }
                }
     
                if ((this.Customer_Divs[0].PRC_GRP_CD == "")) {
                    this.isMissingGrpCode = true;
                }
                if (this.Customer_Divs.length <= 1) {
                    this.isCustomerDivHidden = true;
                    this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                    this.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                } else {
                    this.isCustomerDivHidden = false;
                    this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = false;
                    this.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                }
            },
            error => {
                this.loggerSvc.error("Unable to get Customer Divisions.", error);
            }
        );
    }

    onDateChange(evt) {//Below function is to show/hide the backdate reason based on the start date change
        const strtDate = new Date(this.stDate);
        const selectedDate = new Date(evt);
        if (strtDate > selectedDate) {
            this.isBackDate = true;
            this.isBackdatepopupopend = true;
            this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = false;
            this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = true;
        }
        else {
            this.isBackDate = false;
            this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
            this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
            this.contractData.BACK_DATE_RSN = "";
            this.BACK_DATE_RSN = undefined;
        }
        this.getCurrentQuarterDetails(); //update the Quarter slider and kendo numeric text box based on date change
    }

    pastDateConfirm(newDate) {
        if (this.momentService.moment(newDate).isBefore(this.today)) {
            this.isBackDate = true;
            this.isBackdatepopupopend = true;
        }
        else {
            this.isBackDate = false;
        }
    }

    pastDateFieldsenable() {
        this.isBackdatepopupopend = false;
        this.isBackDate = true;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = false;
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = true;
    }

    applyTodayDate() { //apply today's date on cancel click event of back date reason popup
        const today = this.momentService.moment().format("MM/DD/YYYY");
        this.START_DT = new Date(this.momentService.moment(this.contractData.START_DT).isBefore(today) ? today : this.contractData.START_DT);
        this.START_YR = new Date().getFullYear();
        this.isBackdatepopupopend = false;
        this.isBackDate = false;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
        this.contractData.BACK_DATE_RSN = "";
        this.BACK_DATE_RSN = undefined;
    }

    customContractValidate(ctrctFormData) {
        //marking the input elements as touched so that required validation messages will be shown on click of create/copy contract
        Object.keys(ctrctFormData.controls).forEach(key => {
            ctrctFormData.controls[key].markAsTouched();
            const currentControl = ctrctFormData.controls[key];
            if (!this.isCopyContract) {
                if (!this.contractData._behaviors.isDirty) this.contractData._behaviors.isDirty = {};
                this.contractData._behaviors.isDirty[key] = currentControl.dirty;
            }
        });
        this.isSubmitted = true;
        //setting the UI properties
        this.contractData["END_DT"] = this.momentService.moment(this.END_DT).format("MM/DD/YYYY");
        this.contractData["END_QTR"] = this.END_QTR;
        this.contractData["END_YR"] = this.END_YR;
        this.contractData["TITLE"] = this.TITLE;
        this.contractData["displayTitle"] = this.TITLE;
        this.contractData["START_DT"] = this.momentService.moment(this.START_DT).format("MM/DD/YYYY");
        this.contractData["START_QTR"] = this.START_QTR;
        this.contractData["START_YR"] = this.START_YR;
        this.contractData["C2A_DATA_C2A_ID"] = this.C2A_DATA_C2A_ID;
        this.contractData["BACK_DATE_RSN"] = (this.BACK_DATE_RSN?.DROP_DOWN != "" && this.BACK_DATE_RSN != undefined) ? this.BACK_DATE_RSN?.DROP_DOWN : "";
        this.contractData["CUST_ACCPT"] = this.selectedCUST_ACCPT;
        this.contractData["NOTES"] = this.NOTES;
        this.contractData["CUST_ACCNT_DIV_UI"] = [];
        this.contractData["CUST_ACCNT_DIV"] = ''
        if (this.CUST_NM_DIV.length > 0 && this.CUST_NM_DIV != undefined) {
            this.contractData["CUST_ACCNT_DIV_UI"] = this.CUST_NM_DIV.map((x) => (x.CUST_DIV_NM));
            this.contractData["CUST_ACCNT_DIV"] = this.contractData["CUST_ACCNT_DIV_UI"].join('/');
        }
        this.contractData["NO_END_DT_RSN"] = this.NO_END_DT_RSN?.DROP_DOWN;
        this.isValid = true;
        const ct = this.contractData;
        if (ct.TITLE && ct.TITLE.length > 250) {
            this.isTitleError = true;
            this.titleErrorMsg = "Title must be no more than 250 characters.";
            this.contractData._behaviors.isError["TITLE"] = true;
            this.isValid = false;
        }
        const maximumDate = this.momentService.moment(ct.START_DT).add(20, 'years').format("MM/DD/YYYY");
        if (!this.contractData._behaviors) this.contractData._behaviors = {};
        if (this.momentService.moment(ct.END_DT) > this.momentService.moment('2099/12/31').add(0, 'years')) {
            this.contractData._behaviors.validMsg["END_DT"] = "Please select a date before 12/31/2099";
            this.contractData._behaviors.isError["END_DT"] = true;
            this.isValid = false;
        }
        else if (this.momentService.moment(ct.END_DT).isBefore(ct.START_DT) || this.momentService.moment(ct.END_DT).isAfter(maximumDate)) {
            this.contractData._behaviors.validMsg['END_DT'] = this.momentService.moment(ct.END_DT).isAfter(maximumDate)
                ? "End date cannot be greater than - " + maximumDate
                : "End date cannot be less than Start Date";
            this.contractData._behaviors.isError["END_DT"] = true;
            this.isValid = false;
        }
        else {
            this.contractData._behaviors.validMsg["CUST_MBR_SID"] = "";
            this.contractData._behaviors.isError["CUST_MBR_SID"] = false;
            this.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
            this.contractData._behaviors.isError["C2A_DATA_C2A_ID"] = false;
        }
        Object.entries(this.contractData).forEach(([key]) => {
            if (ct._behaviors.validMsg[key] !== "" && ct._behaviors.validMsg[key] !== undefined) {
                this.isValid = false;
            }
        });
        this.contractData._behaviors.isError["CUST_ACCNT_DIV_UI"] = this.contractData._behaviors.isError["CUST_ACCNT_DIV"];
        this.contractData._behaviors.validMsg["CUST_ACCNT_DIV_UI"] = this.contractData._behaviors.validMsg["CUST_ACCNT_DIV"];
        //this code is to check for duplcate name exists no need to save
        if(this.disableSave==true){
            this.isValid=false;
        }
        if (this.isValid && ctrctFormData.valid) {
            if (this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] == false && this.contractData.CUST_ACCNT_DIV == "") {
                this.isDivBlankPopupOpen = true;
            }
            else {
                if (this.isCopyContract) this.copyContract();
                else this.saveContract();
            }
        }
    }

    public blankDivisionPopupClose(status: string): void {
        if (status == "yes") {
            if (this.isCopyContract) this.copyContract();
            else this.saveContract();
        }
        this.isDivBlankPopupOpen = false;
    }

    closeMissingGrpCodeAlert() {
        this.isMissingGrpCode = false;
    }

    saveContract() {
        try{
            // Contract Data
            this.isLoading = true;
            this.setBusy("Saving Contract", "Saving the Contract Information", "info", true);
            const ct = this.contractData;
            this.contractId = -100;
            if (this.contractData["DC_ID"]) {
                this.contractId = this.contractData["DC_ID"];
            }
            if (ct["DC_ID"] <= 0) ct["DC_ID"] = this.uid;
            this.contractDetailsSvc
                .createContract(this.contractData["CUST_MBR_SID"], this.contractId, ct)
                .subscribe((response: any) => {
                    //this condition is to handle fresh cration
                    if (response.CNTRCT && response.CNTRCT.length > 1) {
                        if(response.CNTRCT[1] && response.CNTRCT[1].DC_ID) {
                            // setting the DC ID received from response because to upload files/attachments valid DC_ID is required
                            this.contractData["DC_ID"] = response.CNTRCT[1].DC_ID;
                            this.isLoading = true;
                            this.setBusy("Save Successful", "Saved the contract", "Success", true);
                        }
                        else{
                            this.loggerSvc.error("Something went wrong",'Error');
                            this.isLoading = false;
                        }
                    }
                    //this condition is to handle update
                    else if (response.CNTRCT && response.CNTRCT.length == 1) {
                        this.contractData["DC_ID"] = response.CNTRCT[0].DC_ID;                        
                        
                    }
                    if (this.hasUnSavedFiles) {
                        this.uploadFile();
                    }
                    else {
                        this.isLoading = false;
                        this.setBusy("", "", "", false);
                        //this will redirect incase of newly added/edited
                        window.location.href = "Contract#/manager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0"; 
                    } 
                                   
                },(err)=>{
                    this.loggerSvc.error("Unable to create contract","Error",err);
                    this.isLoading = false;
                });
        }
        catch(ex){
            this.loggerSvc.error("Something went wrong",'Error');
            this.isLoading = false;
        }
      
    }

    isValidDate(type, newDate) {
        let isValid = false;
        if (this.momentService.moment(newDate, "l", true).isValid()) {
            if (this.contractData._behaviors.validMsg[type] == "Invalid date.") {
                this.contractData._behaviors.isError[type] = false;
                this.contractData._behaviors.validMsg[type] = "";
            }
            else if (this.contractData._behaviors.validMsg[type] == "" || this.isCopyContract) {
                if (type == "START_DT") {
                    isValid = newDate > new Date(this.contractData.MinDate) ? true : false;
                    if (!isValid) { this.validateDate("START_DT"); }
                } else if (type == "END_DT" && !this.isCopyContract) {
                    isValid = newDate < new Date(this.contractData.MaxDate) ? true : false;
                    if (!isValid) { this.validateDate("END_DT"); }
                }
                else if (type == 'END_DT' && this.isCopyContract) {
                    return true;
                }
            }
        }
        else {
            isValid = false;
            this.contractData._behaviors.isError[type] = true;
            this.contractData._behaviors.validMsg[type] = "Invalid date."
        }
        return isValid;
    }

    getTimeLineDetails() {
        let contractDetailId = null;
        const objTypeIds = [1, 2, 3];
        const objTypeSId = 1;
        if (this.C_ID) {
            contractDetailId = this.C_ID;

            this.contractDetailsSvc.GetObjTimelineDetails(contractDetailId, objTypeIds, objTypeSId).subscribe((response: Array<any>) => {
                this.TimeLineDetails = response;
                if (response.length > 5) {
                    this.isShowBtn = true;
                }

            }, error => {
                this.loggerSvc.error("Unable to get Details.", error);
            });
        }


    }
    getContractQuaterDetails(changeEvent) {
        let isValidDataPresent = false;
        let isDate, customerMemberSid = null;
        let yearValue = null;
        let qtrValue = null;
        isDate = this.contractData.START_DT;
        customerMemberSid = this.contractData.CUST_MBR_SID == "" ? null : this.contractData.CUST_MBR_SID;
        if (changeEvent == "START_DT") {
            isDate = this.contractData.START_DT;
            if (isDate != "" || isDate != null || isDate != undefined) {
                isValidDataPresent = true;
            }
        }
        if (changeEvent == "END_DT") {
            isDate = this.contractData.END_DT;
            if (isDate != "" || isDate != null || isDate != undefined) {
                isValidDataPresent = true;
            }
        }
        if (isValidDataPresent) {
            this.isLoading = true;
            this.contractDetailsSvc.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
                .subscribe((response: any) => {
                    if (changeEvent == "START_QTR" || changeEvent == "START_YR" || changeEvent == "START_DT") {
                        this.START_QTR = response?.QTR_NBR;
                        this.START_YR = response?.YR_NBR;
                        this.START_DT = (changeEvent == "START_DT") ? this.START_DT : new Date(this.momentService.moment(response["QTR_STRT"]).format("MM/DD/YYYY"));
                    }
                    if (changeEvent == "END_QTR" || changeEvent == "END_YR" || changeEvent == "END_DT") {
                        this.END_DT = (changeEvent == "END_DT") ? this.END_DT : new Date(this.momentService.moment(response["QTR_END"]).format("MM/DD/YYYY"));
                        this.END_QTR = response?.QTR_NBR;
                        this.END_YR = response?.YR_NBR;
                    }
                    this.isLoading = false;
                },(err)=>{
                    this.loggerSvc.error("Unable to get customer quarter data","Error",err);
                    this.isLoading = false;
                });
        }
    }

    getCurrentQuarterDetails(changeEvent = "", contract_DT = null) {
        let isValidDataPresent = true;
        let yearValue, qtrValue, isDate, customerMemberSid = null;
        customerMemberSid = this.contractData.CUST_MBR_SID == "" ? null : this.contractData.CUST_MBR_SID;
        if (this.END_DT != undefined && this.START_DT != undefined) {
            this.validateDate(changeEvent);
        }
        if (changeEvent == "") {
            isDate = this.isTender == true ? null : new Date();
            qtrValue = this.isTender == true ? "4" : null;
            yearValue = this.isTender == true ? new Date().getFullYear() : null;
        }
        else if (changeEvent == "START_DT") {
            isDate = this.START_DT;
            isValidDataPresent = this.isValidDate(changeEvent, isDate) && ((contract_DT != null && contract_DT.status != 'INVALID') || contract_DT == null) ? true : false;
        }
        else if (changeEvent == "END_DT") {
            isDate = this.END_DT;
            isValidDataPresent = this.isValidDate(changeEvent, isDate) && ((contract_DT != null && contract_DT.status != 'INVALID') || contract_DT == null) ? true : false;
        }
        else if (changeEvent == "START_YR" || changeEvent == "START_QTR") {
            qtrValue = this.START_QTR;
            yearValue = this.START_YR;
            isValidDataPresent = yearValue != null ? true : false;
        }
        else if (changeEvent == "END_YR" || changeEvent == "END_QTR") {
            qtrValue = this.END_QTR;
            yearValue = this.END_YR;
            isValidDataPresent = yearValue != null ? true : false;
        }
        if (isValidDataPresent) {
            this.isLoading = true;
            this.contractDetailsSvc.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
                .subscribe((response: any) => {
                    this.isLoading = false;
                    if (response != null) {
                        if (changeEvent == "") {
                            if (this.momentService.moment(response["QTR_END"]) < this.momentService.moment(new Date())) {
                                response["QTR_END"] = this.momentService.moment(response["QTR_END"]).add(365, "days").format("MM/DD/YYYY");
                            }
                            this.contractData.MinDate = this.momentService.moment(response["MIN_STRT"]).format("MM/DD/YYYY");
                            this.contractData.MaxDate = this.momentService.moment(response["MIN_END"]).format("MM/DD/YYYY");
                            // By default we dont want a contract to be backdated
                            this.contractData.START_DT = this.isTender == true ? this.momentService.moment().format("MM/DD/YYYY") : this.momentService.moment(response["QTR_STRT"]).isBefore(this.today)
                                ? this.today
                                : this.momentService.moment(response["QTR_STRT"]).format("MM/DD/YYYY");
                            this.START_DT = new Date(this.contractData.START_DT);
                            this.contractData.END_DT = this.momentService.moment(response["QTR_END"]).format("MM/DD/YYYY");
                            this.END_DT = new Date(this.contractData.END_DT);
                            this.START_QTR = this.END_QTR = this.contractData.START_QTR = this.contractData.END_QTR = response?.QTR_NBR;
                            this.END_YR = this.START_YR = this.contractData.START_YR = this.contractData.END_YR = response?.YR_NBR;
                        }
                        if (changeEvent == "START_QTR" || changeEvent == "START_YR" || changeEvent == "START_DT") {
                            this.START_QTR = response?.QTR_NBR;
                            this.START_YR = response?.YR_NBR;
                            this.contractData.MinDate = this.momentService.moment(response["MIN_STRT"]).format("MM/DD/YYYY");
                            this.contractData.MaxDate = this.momentService.moment(response["MIN_END"]).format("MM/DD/YYYY");
                            this.START_DT = (changeEvent == "START_DT") ? this.START_DT : new Date(this.momentService.moment(response["QTR_STRT"]).format("MM/DD/YYYY"));
                            const selectedDate = this.START_DT;
                            this.pastDateConfirm(selectedDate);
                        }
                        if (changeEvent == "END_QTR" || changeEvent == "END_YR" || changeEvent == "END_DT") {
                            this.END_DT = (changeEvent == "END_DT") ? this.END_DT : new Date(this.momentService.moment(response["QTR_END"]).format("MM/DD/YYYY"));
                            this.END_QTR = response?.QTR_NBR;
                            this.END_YR = response?.YR_NBR;
                        }
                        if (changeEvent !== 'START_DT' && changeEvent !== 'END_DT') {
                            this.validateDate(changeEvent);
                        }
                        if (changeEvent == 'END_DT' && this.isCopyContract) {
                            this.contractData._behaviors.isError[changeEvent] = false;
                            this.contractData._behaviors.validMsg[changeEvent] = "";
                            const startDate = this.START_DT;
                            const endDate = this.END_DT;
                            if (this.momentService.moment(startDate).isSameOrBefore(endDate) && this.momentService.moment(startDate).isAfter(this.contractData.MinDate)){
                                this.contractData._behaviors.isError['START_DT'] = false;
                                this.contractData._behaviors.validMsg['START_DT'] = ""
                            }
                            if (this.momentService.moment(endDate).isBefore(startDate) || this.momentService.moment(endDate).isAfter(this.contractData.MaxDate)) {
                                this.contractData._behaviors.isError['END_DT'] = true;
                                this.contractData._behaviors.validMsg['END_DT'] = this.momentService.moment(endDate).isAfter(this.contractData.MaxDate)
                                    ? "End date cannot be greater than - " + this.contractData.MaxDate
                                    : "End date cannot be less than Start Date";
                            }
                            if (this.existingMinEndDate !== null && this.contractData.PRC_ST != null && this.contractData.PRC_ST.length != 0) {
                                if (this.momentService.moment(endDate).isBefore(this.existingMinEndDate)) {
                                    this.contractData._behaviors.isError['END_DT'] = true;
                                    this.contractData._behaviors.validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + this.existingMinEndDate?.toLocaleDateString() + " - if you have already created pricing strategies. ";
                                }
                            }
                        }
                    }
                    if ((this.END_DT != undefined && !this.isCopyContract) && this.START_DT != undefined) {
                        this.validateDate(changeEvent);
                    }
                }, (err) => {
                    this.loggerSvc.error("Unable to get current quarter data", "Error", err);
                    this.isLoading = false;
                });
        } else if (changeEvent == "START_DT" && contract_DT != null && contract_DT.status != 'INVALID') {
                const selectedDate = this.START_DT;
                this.pastDateConfirm(selectedDate);
            }
        }

    validateDate(dateChange) {
        if (dateChange !== undefined && (dateChange == "START_DT" || dateChange == "END_DT")) {
            this.contractData._behaviors.isError[dateChange] = false;
            this.contractData._behaviors.validMsg[dateChange] = "";
        }
        else {
            this.contractData._behaviors.isError['START_DT'] = this.contractData._behaviors.isError['END_DT'] = false;
            this.contractData._behaviors.validMsg['START_DT'] = this.contractData._behaviors.validMsg['END_DT'] = "";
        }
        const startDate = this.START_DT;
        const endDate = this.END_DT;
        if (dateChange == 'START_DT' || dateChange == "START_YR" || dateChange == "START_QTR") {
            if (this.momentService.moment(endDate).isSameOrAfter(startDate) && this.momentService.moment(endDate).isBefore(this.contractData.MaxDate)){
                this.contractData._behaviors.isError['END_DT'] = false;
                this.contractData._behaviors.validMsg['END_DT'] = ""
            }
            if (this.momentService.moment(startDate).isAfter(endDate) || this.momentService.moment(startDate).isBefore(this.contractData.MinDate)) {
                this.contractData._behaviors.isError['START_DT'] = true;
                this.contractData._behaviors.validMsg['START_DT'] = this.momentService.moment(startDate).isBefore(this.contractData.MinDate)
                    ? "Start date cannot be less than - " + this.contractData.MinDate
                    : "Start date cannot be greater than End Date";
            }
        } else if (dateChange == 'END_YR' || dateChange == "END_QTR" || (dateChange == 'END_DT' && !this.isCopyContract)) {
            if (this.momentService.moment(startDate).isSameOrBefore(endDate) && this.momentService.moment(startDate).isAfter(this.contractData.MinDate)){
                this.contractData._behaviors.isError['START_DT'] = false;
                this.contractData._behaviors.validMsg['START_DT'] = ""
            }
            if (this.momentService.moment(endDate).isBefore(startDate) || this.momentService.moment(endDate).isAfter(this.contractData.MaxDate)) {
                this.contractData._behaviors.isError['END_DT'] = true;
                this.contractData._behaviors.validMsg['END_DT'] = this.momentService.moment(endDate).isAfter(this.contractData.MaxDate)
                    ? "End date cannot be greater than - " + this.contractData.MaxDate
                    : "End date cannot be less than Start Date";
            }
            if (this.existingMinEndDate !== null && this.contractData.PRC_ST != null && this.contractData.PRC_ST.length != 0) {
                if (this.momentService.moment(endDate).isBefore(this.existingMinEndDate)) {
                    this.contractData._behaviors.isError['END_DT'] = true;
                    this.contractData._behaviors.validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + this.existingMinEndDate?.toLocaleDateString() + " - if you have already created pricing strategies. ";
                }
            }
        }        
    }

    initContract() {
        // New contract template
        const c = this.templateData["ObjectTemplates"].CNTRCT.ALL_TYPES;
        // contract exists
        if (this.contractData !== null && this.contractData !== undefined) {
            if (this.contractData.data[0] !== undefined) { return this.contractData.data[0]; }
        }
        return c;
    }

    noEndDate() {
        this.END_DT = new Date(this.momentService.moment().add(20, 'years').format("MM/DD/YYYY"));
        this.contractData._behaviors.isReadOnly["END_DT"] = this.NO_END_DT;
        this.contractData._behaviors.isReadOnly["END_QTR"] = this.NO_END_DT;
        this.contractData._behaviors.isReadOnly["END_YR"] = this.NO_END_DT;
        this.contractData._behaviors.isHidden["NO_END_DT_RSN"] = !this.NO_END_DT;
        this.contractData._behaviors.isRequired["NO_END_DT_RSN"] = this.NO_END_DT;
        this.contractData.NO_END_DT_RSN = this.NO_END_DT ? this.contractData.NO_END_DT_RSN : "";
        this.NO_END_DT_RSN = undefined;
    }

    setSaveBtnName() {
        if (this.isCopyContract) {
            this.saveBtnName = "Copy Contract";
        } else {
            this.c_Id = this.C_ID;
            this.saveBtnName = this.c_Id > 0 ? "Save Contract" : "Create Contract";
        }
    }

    // Set customer acceptance rules
    setCustAcceptanceRules(newValue) {
        this.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: (newValue === 'Pending');
        this.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = (newValue !== 'Pending') && !this.isTenderContract && this.selectedFileCount == 0;
        if (this.contractData.DC_ID < 0) this.contractData.C2A_DATA_C2A_ID = (newValue === 'Pending') ? "" : this.contractData.C2A_DATA_C2A_ID;
        this.contractData.IsAttachmentRequired = !this.isTenderContract && this.contractData.C2A_DATA_C2A_ID === "" && newValue !== 'Pending';
        this.contractData.AttachmentError = this.contractData.AttachmentError && this.contractData.IsAttachmentRequired;

    }

    c2aIDchange(inputVal) {
        this.contractData.IsAttachmentRequired = inputVal.length > 0 ? false : true;
    }

    copyContract() {
        this.isLoading = true;
        this.setBusy("Copy Contract", "Copying the Contract Information","info",false);
        const ct = this.contractData;
        if (ct.DC_ID <= 0) ct.DC_ID = this.uid--; // check for NEW contract
        this.contractDetailsSvc.copyContract(this.contractData["CUST_MBR_SID"], this.contractData.DC_ID, this.copyContractData.DC_ID, ct)
            .subscribe((response: any) => {
                if (response.CNTRCT && response.CNTRCT.length > 0) {
                    let idCheck = response.CNTRCT.length == 2 ? response.CNTRCT[1]?.DC_ID : response.CNTRCT[0]?.DC_ID;
                    if (idCheck <= 0) {
                        this.isValid = false;
                        this.titleErrorMsg = "Title already exists in system";
                        this.isTitleError = true;
                        this.isLoading = false;
                    }
                    else {
                        this.setBusy("Copy Successful", "Copied the contract", "Success",false);
                      // setting the DC ID received from response because to upload files/attachments valid DC_ID is required
                      if (response.CNTRCT.length>0) {
                          this.contractData.DC_ID = response.CNTRCT.length == 2 ? response.CNTRCT[1]?.DC_ID : response.CNTRCT[0]?.DC_ID;
                        if (this.hasUnSavedFiles) {
                            this.uploadFile();
                        } else {
                            window.location.href = "Contract#/contractmanager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0";
                        }
                    }
                    }
                }
            }, error => {
                this.loggerSvc.error("Could not create the contract.", error);
                this.isLoading = false;
                this.setBusy("", "","",false);
            });
    }
    deleteContract() {
        this.isDeleteContract = true;
    }

    deleteContractActions(act: boolean) {
        if (act == true) {
            this.isDeleteContract = false;
            const custId = this.contractData.CUST_MBR_SID;
            const contractId = this.contractData.DC_ID;
            this.isLoading = true;
            this.setBusy("Deleting...", "Deleting the Contract", "Info", false);
            this.contractDetailsSvc.deleteContract(custId, contractId).subscribe((response: any) => {
                this.setBusy("Delete Successful", "Deleted the Contract","Success",false);
                window.location.href = '/Dashboard#/portal';
            }), err => {
                this.loggerSvc.error("Unable to delete contract","Error",err);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            };
        }
        else {
            this.isDeleteContract = false;
        }
    }
    loadContractDetailsData() {
        //setting the customer dropdown value ngModel
        this.Customer = this.contractData.Customer;
        if (this.Customer) {
            this.disableCustomer = true;
        }
        if (this.contractData.HAS_TRACKER === "1") {
            this.showDeleteButton = false;
        }
        else {
            this.showDeleteButton = true;
        }
        this.contractType = ' Contract';
        this.TITLE = this.contractData.TITLE;
        this.START_DT = this.momentService.moment(this.contractData.START_DT, "MM/DD/YYYY").toDate();
        this.END_DT = this.existingMinEndDate = this.momentService.moment(this.contractData.END_DT, "MM/DD/YYYY").toDate();
        this.selectedCUST_ACCPT = this.contractData.CUST_ACCPT;
        if (this.contractData.CUST_ACCPT) {
            this.disableCustAccpt = true;
        }
        this.C2A_DATA_C2A_ID = this.contractData.C2A_DATA_C2A_ID;
        this.NOTES = this.contractData.NOTES;
        this.getContractQuaterDetails('START_DT');
        this.getContractQuaterDetails('END_DT');
        this.contractData.CUST_ACCNT_DIV_UI = !this.contractData["CUST_ACCNT_DIV"] ? "" : this.contractData["CUST_ACCNT_DIV"].split("/");
        this.updateCorpDivision(this.contractData.CUST_MBR_SID);
    }
    stripMilliseconds(dateTime) {
        let date = this.datePipe.transform(new Date(GridUtil.stripMilliseconds(dateTime)), 'M/d/yyyy');
        return date;
    }
    showAll() {
        if (this.maxCount == 5 && this.TimeLineDetails.length > 5) {
            this.btnText = "Show Less";
            this.maxCount = this.TimeLineDetails.length;
        }
        else {
            this.btnText = "Show More";
            this.maxCount = 5;
        }
    }
   

    getFileAttachmentDetails(value) {
        if (value <= 0) {
            this.isNewContract = true;
        }
        else {
            this.isNewContract = false;
            this.contractDetailsSvc.getFileAttachments(this.contractData.CUST_MBR_SID, this.contractData.DC_ID).subscribe((response: any) => {
                if (response != undefined && response != null) {
                    this.attachmentsDataSource = response;
                    this.gridData = process(this.attachmentsDataSource, this.state);
                    this.contractData = this.contractData;
                    this.attachmentCount = response.length;
                    this.initComplete = true;
                    this.setCustAcceptanceRules(this.contractData.CUST_ACCPT)
                }
            }, error => {
                this.loggerSvc.error("Unable to get Files.", error);
                this.initComplete = true;
            });
        }
    }
    deleteFileAttachment(data) {
        this.deleteAttachmentParams = { custMbrSid: data.CUST_MBR_SID, objTypeSid: data.OBJ_TYPE_SID, objSid: data.OBJ_SID, fileDataSid: data.FILE_DATA_SID };
        this.isDeleteAttachment = true;
    }

    deleteAttachmentActions(act: boolean) {
        if (act == true) {
            this.contractDetailsSvc.deleteAttachment(this.deleteAttachmentParams.custMbrSid, this.deleteAttachmentParams.objTypeSid, this.deleteAttachmentParams.objSid,
                this.deleteAttachmentParams.fileDataSid).subscribe((response: any) => {
                    this.isDeleteAttachment = false;
                    this.loggerSvc.success("Successfully deleted attachment.", "Delete successful");
                    this.getFileAttachmentDetails(this.deleteAttachmentParams.objSid);
                }, error => {
                    this.loggerSvc.error("Unable to delete attachment.", "Delete failed",error);
                })
        }
        else {
            this.isDeleteAttachment = false;
        }
    }
    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }

            // if no change in state, simple update the text
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }
    customerFilter(value) {
        this.CustomersFilterData = this.Customers.filter(
          (s) => s.CUST_NM.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      }
      customerDivFilter(value) {
        this.CustomerFilter_Divs = this.Customer_Divs.filter(
          (s) => s.CUST_DIV_NM.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      }

    async updateQuarterByDates(dateType, value) {
        var customerMemberSid = this.contractData?.CUST_MBR_SID == "" ? null : this.contractData.CUST_MBR_SID;
        var qtrValue = this.isTender == true ? "4" : null;
        var yearValue = this.isTender == true ? new Date().getFullYear() : null;
        let response: any;
        response = await this.contractDetailsSvc.getCustomerCalendar(customerMemberSid, value, qtrValue, yearValue)
            .toPromise().catch((error)=> {
                    this.loggerSvc.error("Unable to get customer quarter data", "Error", error);
                    this.isLoading = false;
            });
        if (response) {
            if (this.momentService.moment(response['QTR_END']) < this.momentService.moment(new Date())) {
                response['QTR_END'] = this.momentService.moment(response['QTR_END']).add(365, 'days').format("MM/DD/YYYY");
            }
            this.contractData.MinDate = this.MinDate = this.momentService.moment(response['MIN_STRT']).format("MM/DD/YYYY");
            this.contractData.MaxDate = this.MaxDate = this.momentService.moment(response['MIN_END']).format("MM/DD/YYYY");
            if (dateType == 'START_DT') {
                this.contractData.START_QTR = this.START_QTR = response['QTR_NBR'];
                this.contractData.START_YR = this.START_YR = response.YR_NBR;
                this.validateDate('START_DT');
            } else {
                this.contractData.END_QTR = this.END_QTR = response.QTR_NBR;
                this.contractData.END_YR = this.END_YR = response.YR_NBR;
                this.validateDate('END_DT');
            }
            this.isLoading = false;
        }
        else
            this.isLoading = false;
    }

    isFooterFullWidth(): boolean {
        return document.getElementById('lnavContainerWrapper') == null;
    }

    ngOnInit() {
        try {
            this.isLoading=true;
            //loading customer data and dropdowns Data
            this.contractDetailsSvc.GetMyCustomerNames().subscribe((response: Array<any>) => {
                forkJoin({
                    NO_END_DT_RSN: this.contractDetailsSvc.getVendorDropDown('NO_END_DT_RSN'),
                    BACK_DATE_RSN: this.contractDetailsSvc.getVendorDropDown('BACK_DATE_RSN'),
                    CONTRACT_TYPE: this.contractDetailsSvc.getVendorDropDown('CONTRACT_TYPE'),
                    CUST_ACCPT: this.contractDetailsSvc.getVendorDropDown('CUST_ACCPT'),
                }).subscribe(({ NO_END_DT_RSN, BACK_DATE_RSN, CONTRACT_TYPE, CUST_ACCPT }) => {
                    this.Customers = response;
                    //setting for filtering purpose
                    this.CustomersFilterData= this.Customers;
                    this.dropDownsData['NO_END_DT_RSN'] = NO_END_DT_RSN;
                    this.dropDownsData['BACK_DATE_RSN'] = BACK_DATE_RSN;
                    this.dropDownsData['CONTRACT_TYPE'] = CONTRACT_TYPE;
                    this.dropDownsData['CUST_ACCPT'] = CUST_ACCPT;
                    this.backdatereasonsdropdownlist=BACK_DATE_RSN;
                    // below lines of code is to set default value for contract type dropdown.
                    this.CONTRACT_TYPE = CONTRACT_TYPE[0];
                    const conrtType = this.route.snapshot.url.find(x => x.path == 'copycid');
                    if (!!conrtType && conrtType.path =='copycid') {
                        this.c_Id = parseInt(this.route.snapshot.paramMap.get('cid'));
                        this.isCopyContract = true;
                        this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                            this.templateData = response;
                            this.contractData = this.initContract();
                            this.contractDetailsSvc
                                .readCopyContract(this.c_Id)
                                .subscribe(async (response: Array<any>) => {
                                    this.copyContractData = response[0];
                                    this.contractData.TITLE = this.TITLE = this.copyContractData.TITLE + " (copy)";
                                    this.contractData.CUST_MBR_SID = this.Customer = Number(this.copyContractData.CUST_MBR_SID);
                                    this.contractData.START_DT = this.START_DT = this.stDate = new Date(this.momentService.moment(this.copyContractData.START_DT).format("MM/DD/YYYY"));
                                    this.contractData.END_DT = this.END_DT = this.existingMinEndDate = new Date(this.momentService.moment(this.copyContractData.END_DT).format("MM/DD/YYYY"));
                                    this.Customer = this.copyContractData.Customer;
                                    this.contractData.MinYear = this.MinYear = parseInt(this.momentService.moment().format("YYYY")) - 6;
                                    this.contractData.MaxYear = this.MaxYear = parseInt(this.momentService.moment("2099").format("YYYY"));
                                    // Set the initial Max and Min date, actual dates will be updated as per the selected customer
                                    this.contractData.MinDate = this.MinDate = this.momentService.moment().subtract(6, "years").format("MM/DD/YYYY");
                                    this.contractData.MaxDate = this.MaxDate = this.momentService.moment("2099").format("MM/DD/YYYY");
                                    // NOTE: START_QTR,START_YR,END_YR,END_QTR are not present in copyContractData,, as they are undefined calling getCurrentQuarterDetails to get the data--Check
                                    if (this.momentService.moment(this.contractData.END_DT) > this.momentService.moment('2099/12/31').add(0, 'years')) {
                                        this.contractData.END_DT = this.momentService.moment('2099/12/31').format("MM/DD/YYYY");
                                        this.END_DT = this.existingMinEndDate = new Date(this.momentService.moment(this.contractData.END_DT).format("MM/DD/YYYY"));
                                    }
                                    this.contractData.START_QTR = this.START_QTR = this.copyContractData.START_QTR;
                                    this.contractData.START_YR = this.START_YR = this.copyContractData.START_YR;
                                    this.contractData.END_QTR = this.END_QTR = this.copyContractData.END_QTR;
                                    this.contractData.END_YR = this.END_YR = this.copyContractData.END_YR;
                                    this.contractData.CUST_ACCNT_DIV = this.copyContractData.CUST_ACCNT_DIV;
                                    this.contractData.IS_TENDER = this.copyContractData.IS_TENDER;
                                    this.contractData.CONTRACT_TYPE = this.copyContractData.CONTRACT_TYPE;
                                    this.contractData.CUST_ACCNT_DIV_UI = !this.contractData["CUST_ACCNT_DIV"] ? "" : this.contractData["CUST_ACCNT_DIV"].split("/");
                                    this.updateCorpDivision(this.copyContractData.CUST_MBR_SID);
                                    this.pastDateConfirm(this.contractData.START_DT);  // Check for Backdate Reason
                                    await this.updateQuarterByDates('START_DT', this.contractData.START_DT);
                                    await this.updateQuarterByDates('END_DT', this.contractData.END_DT);
                                    //loader disable
                                    this.isLoading=false;
                                },(err)=>{
                                    this.isLoading=false;
                                    this.loggerSvc.error("Unable to fetch contract data","Error",err);
                                });
                        },(err)=>{
                              //loader disable
                              this.isLoading=false;
                            this.loggerSvc.error("Unable to fetch template data","Error",err);
                        });
                    } else {
                        this.c_Id = parseInt(this.route.snapshot.paramMap.get('cid'));
                    }

                    if (this.isCopyContract == false) {
                        //conditions for new contract
                        if (this.c_Id <= 0) {
                            this.templatesSvc.readTemplates()
                                .subscribe((response: Array<any>) => {
                                    this.templateData = response;
                                    this.contractData = this.initContract();
                                    this.loadContractDetails();
                                    this.getCurrentQuarterDetails();
                                    const selectedDashboardCustomer = this.newContractWidgetSvc.selectedCustomer.getValue();
                                    if(selectedDashboardCustomer){
                                        this.Customer = selectedDashboardCustomer;
                                        this.updateDataOnCustomerChange(this.Customer);
                                    }
                                    //loader disable
                                    this.isLoading=false;                                 
                                },(err)=>{
                                    this.loggerSvc.error("Unable to fetch template data","Error",err);
                                    //loader disable
                                    this.isLoading=false;
                                });
                        }
                        else { //condition for existing contract
                            this.contractDetailsSvc
                                .readContract(this.C_ID)
                                .subscribe((response: Array<any>) => {
                                    this.contractData = response[0];
                                    this.C_DELETE_ATTACHMENTS = this.contractDetailsSvc.chkDealRules("C_DELETE_ATTACHMENTS", (<any>window).usrRole, null, null, this.contractData.WF_STG_CD);
                                    if(this.contractData["IS_TENDER"] == '0'){
                                        this.isTenderContract = false;
                                    } else {
                                        this.isTenderContract = this.contractData["IS_TENDER"];
                                    }
                                    this.contractData.MinDate = this.MinDate = this.momentService.moment().subtract(6, "years").format("MM/DD/YYYY");
                                    this.contractData.MaxDate = this.MaxDate = this.momentService.moment("2099").format("MM/DD/YYYY");
                                    this.contractData.MinYear = this.MinYear = parseInt(this.momentService.moment().format("YYYY")) - 6;
                                    this.contractData.MaxYear = this.MaxYear = parseInt(this.momentService.moment("2099").format("YYYY"));
                                    this.initialEndDateReadOnly = this.contractData?._behaviors && this.contractData?._behaviors?.isReadOnly && this.contractData?._behaviors?.isReadOnly["END_DT"] && this.contractData?._behaviors?.isReadOnly["END_DT"];
                                    this.initialStartDateReadOnly = this.contractData?._behaviors && this.contractData?._behaviors?.isReadOnly && this.contractData?._behaviors?.isReadOnly["START_DT"] && this.contractData?._behaviors?.isReadOnly["START_DT"];
                                    this.loadContractDetailsData();
                                    this.getTimeLineDetails();
                                    this.getFileAttachmentDetails(this.c_Id);
                                     //loader disable
                                     this.isLoading=false;
                                     this.checkbackdate();
                                },(err)=>{
                                    this.loggerSvc.error("unable to fetch contract data","Error",err);
                                     //loader disable
                                     this.isLoading=false;
                                });
                        }
                    }
                    this.setSaveBtnName();
                }, error => {
                    this.loggerSvc.error("Unable to getVendorDropDown.", error);
                });

            }, error => {
                this.loggerSvc.error("Unable to get Customers.", error);
            });
        } catch (ex) {
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('ContractDetails::ngOnInit::',ex);
        }
    }

    checkbackdate(){
        if (this.momentService.moment(this.contractData.START_DT).isBefore(this.today) &&  (this.contractData.BACK_DATE_RSN!='' || this.contractData.BACK_DATE_RSN!=undefined)) {
            this.isBackDate = true;
            this.dropDownsData['BACK_DATE_RSN']=this.backdatereasonsdropdownlist;
            this.BACK_DATE_RSN=this.backdatereasonsdropdownlist.find(x=>x.DROP_DOWN==this.contractData.BACK_DATE_RSN);
        }
    }

    goToHistory() {
        const contractDetails_Map = {
            Model: 'historyDiv',
            C_ID: this.C_ID
        };
        this.openHistoryTab.emit(contractDetails_Map);
    }

    ngAfterViewInit() {
        //this functionality will enable when dashboard landing to this page
        document.getElementsByClassName('loading-screen')[0]?.setAttribute('style', 'display:none');
        const divLoader = document.getElementsByClassName('jumbotron')
        if (divLoader && divLoader.length > 0) {
            each(divLoader, div => {
                div.setAttribute('style', 'display:none');
            })
        }
        //this functionality will disable anything of .net ifloading to stop when dashboard landing to this page
        document.getElementById('mainBody')?.setAttribute('style', 'display:none');
    }
}
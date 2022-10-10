import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../../shared/logger/logger";
import { contractDetailsService } from "./contractDetails.service";
import { FormGroup } from "@angular/forms";
import { templatesService } from "../../shared/services/templates.service";
import * as _moment from "moment";
import { forkJoin } from "rxjs";
import { FileRestrictions, UploadEvent } from "@progress/kendo-angular-upload";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { GridUtil } from "../grid.util";
import { DatePipe } from '@angular/common';
import * as _ from "underscore";
const moment = _moment;

@Component({
    selector: "contract-details",
    templateUrl: "Client/src/app/contract/contractDetails/contractDetails.component.html",
    styleUrls: ["Client/src/app/contract/contractDetails/contractDetails.component.css"],

})
export class contractDetailsComponent {
    contractType: string;
    disableCustomer: boolean = false;
    disableCustAccpt: boolean = false;
    constructor(private templatesSvc: templatesService,
        private contractDetailsSvc: contractDetailsService, private datePipe: DatePipe,
        private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
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
    public today: string = moment().format("l");
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
            window.location.href = "#contractmanager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0";
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

    onCustomerChange(evt: any) {
        if (evt != undefined) {
            this.contractData["Customer"] = evt;
            this.contractData["CUST_MBR_SID"] = evt?.CUST_SID;
            this.contractData["CUST_ACCNT_DIV_UI"] = this.contractData["CUST_ACCNT_DIV"] = "";
            this.CUST_NM_DIV = [];
            this.NO_END_DT = this.contractData.NO_END_DT = false;
            this.noEndDate();//this.isCustomerSelected = evt != undefined ? true : false;
            this.updateCorpDivision(evt.CUST_SID);
            this.getCurrentQuarterDetails();
            this.applyTodayDate();
            this.BACK_DATE_RSN = this.NO_END_DT_RSN = undefined;// on change of the contract customer clear the backdate/end date reason values present if any
        }
    }

    loadContractDetails() {
        this.contractData["DC_ID"] = this.uid;
        // Set dates Max and Min Values for numeric text box
        // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
        this.contractData.MinYear = this.MinYear = parseInt(moment().format("YYYY")) - 6;
        this.contractData.MaxYear = this.MaxYear = parseInt(moment("2099").format("YYYY"));
        // Set the initial Max and Min date, actual dates will be updated as per the selected customer
        this.contractData.MinDate = this.MinDate = moment().subtract(6, "years").format("l");
        this.contractData.MaxDate = this.MaxDate = moment("2099").format("l");
        //loading initial values of Contract
        this.contractData["NO_END_DT"] = false;
        this.contractData["CUST_MBR_SID"] = "";
        this.contractData.CUST_ACCNT_DIV_UI = "";
        //this.contractData["CUST_SID"] = "";
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
        //this.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = !this.isNewContract;
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
        const dcID = this.contractData["DC_ID"] == -100 ? 0 : this.contractData["DC_ID"]
        this.contractDetailsSvc.isDuplicateContractTitle(dcID, title)
            .subscribe((response: Array<any>) => {
                if (response) {
                    this.isTitleError = true;
                    this.titleErrorMsg = "This contract name already exists in another contract.";
                } else {
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
                if(this.contractData && this.contractData.CUST_ACCNT_DIV && this.CustomerFilter_Divs && this.CustomerFilter_Divs.length>0){
                    //setting the customer division dropdown value ngModel
                    let selCustDiv= this.contractData.CUST_ACCNT_DIV.split('/');
                    if(selCustDiv && selCustDiv.length>0){
                        _.each(this.CustomerFilter_Divs,itm=>{
                           _.each(selCustDiv,selDiv=>{
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
        if (moment(newDate).isBefore(this.today)) {
            this.isBackDate = true;
            this.isBackdatepopupopend = true;
        }
    }

    pastDateFieldsenable() {
        this.isBackdatepopupopend = false;
        this.isBackDate = true;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = false;
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = true;
    }

    applyTodayDate() { //apply today's date on cancel click event of back date reason popup
        const today = moment().format("l");
        this.START_DT = new Date(moment(this.contractData.START_DT).isBefore(today) ? today : this.contractData.START_DT);
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
        this.contractData["END_DT"] = moment(this.END_DT).format("l");
        this.contractData["END_QTR"] = this.END_QTR;
        this.contractData["END_YR"] = this.END_YR;
        this.contractData["TITLE"] = this.TITLE;
        this.contractData["displayTitle"] = this.TITLE;
        this.contractData["START_DT"] = moment(this.START_DT).format("l");
        this.contractData["START_QTR"] = 1;
        this.contractData["START_YR"] = this.START_YR;
        this.contractData["C2A_DATA_C2A_ID"] = this.C2A_DATA_C2A_ID;
        this.contractData["BACK_DATE_RSN"] = (this.BACK_DATE_RSN?.DROP_DOWN != "" && this.BACK_DATE_RSN != undefined) ? this.BACK_DATE_RSN?.DROP_DOWN : "";
        this.contractData["CUST_ACCPT"] = this.selectedCUST_ACCPT;
        this.contractData["NOTES"] = this.NOTES;
        if (this.CUST_NM_DIV.length > 0 && this.CUST_NM_DIV != undefined) {
            this.contractData["CUST_ACCNT_DIV_UI"] = this.CUST_NM_DIV.map((x) => (x.CUST_DIV_NM));
            this.contractData["CUST_ACCNT_DIV"] = this.contractData["CUST_ACCNT_DIV_UI"].join('/');
        }
        this.contractData["NO_END_DT_RSN"] = this.NO_END_DT_RSN?.DROP_DOWN;
        this.isValid = true;
        const ct = this.contractData;
        const maximumDate = moment(ct.START_DT).add(20, 'years').format('l');
        if (!this.contractData._behaviors) this.contractData._behaviors = {};
        if (moment(ct.END_DT) > moment('2099/12/31').add(0, 'years')) {
            this.contractData._behaviors.validMsg["END_DT"] = "Please select a date before 12/31/2099";
            this.contractData._behaviors.isError["END_DT"] = true;
            this.isValid = false;
        }
        else if (moment(ct.END_DT).isBefore(ct.START_DT) || moment(ct.END_DT).isAfter(maximumDate)) {
            this.contractData._behaviors.validMsg['END_DT'] = moment(ct.END_DT).isAfter(maximumDate)
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
        // Contract Data
        this.isLoading = true;
        this.setBusy("Saving Contract", "Saving the Contract Information", "info", true);
        const ct = this.contractData;
        //this.custId = this.contractData["CUST_SID"];
        this.contractId = -100;
        if (this.contractData["DC_ID"]) {
            this.contractId = this.contractData["DC_ID"];
        }
        if (ct["DC_ID"] <= 0) ct["DC_ID"] = this.uid;
        this.contractDetailsSvc
            .createContract(this.contractData["CUST_MBR_SID"], this.contractId, ct)
            .subscribe((response: any) => {
                if (response.CNTRCT && response.CNTRCT.length > 0) {
                    // setting the DC ID received from response because to upload files/attachments valid DC_ID is required
                    this.contractData["DC_ID"] = response.CNTRCT[1].DC_ID;
                    if (this.hasUnSavedFiles) {
                        this.uploadFile();
                    }
                    else {
                        window.location.href = "#contractmanager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0";
                    }
                    this.isLoading = true;
                    this.setBusy("Save Successful", "Saved the contract", "Success", true);
                } else {
                    if (this.hasUnSavedFiles) {
                        this.uploadFile();
                        //window.location.href = "#contractmanager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0";
                    } else {
                        window.location.href = '/Dashboard#/portal';
                    }
                }
                this.isLoading = false;
                this.setBusy("", "", "", false);
            },(err)=>{
                this.loggerSvc.error("Unable to create contract","Error",err);
                this.isLoading = false;
            });
    }

    isValidDate(type, newDate) {
        let isValid = false;
        if (moment(newDate, "l", true).isValid()) {
            if (this.contractData._behaviors.validMsg[type] == "Invalid date.") {
                this.contractData._behaviors.isError[type] = false;
                this.contractData._behaviors.validMsg[type] = "";
            }
            else if (this.contractData._behaviors.validMsg[type] == "" || this.isCopyContract) {
                if (type == "START_DT") {
                    isValid = newDate > new Date(this.contractData.MinDate) ? true : false;
                    if (!isValid) { this.validateDate("START_DT"); }
                } else if (type == "END_DT") {
                    isValid = newDate < new Date(this.contractData.MaxDate) ? true : false;
                    if (!isValid) { this.validateDate("END_DT"); }
                }
            }
        }
        else {
            isValid = false;
            this.contractData._behaviors.isError[type] = true;
            this.contractData._behaviors.validMsg[type] = "Invalid date."
        }
        return this.isCopyContract ? true : isValid;
    }

    backDateCheck(strtDate, selectedDate) {
        if (strtDate > selectedDate) {
            this.isBackDate = true;
            this.isBackdatepopupopend = true;
        }
        else {
            this.isBackDate = false;
        }
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
                        this.START_DT = (changeEvent == "START_DT") ? this.START_DT : new Date(moment(response["QTR_STRT"]).format("l"));
                    }
                    if (changeEvent == "END_QTR" || changeEvent == "END_YR" || changeEvent == "END_DT") {
                        this.END_DT = (changeEvent == "END_DT") ? this.END_DT : new Date(moment(response["QTR_END"]).format("l"));
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

    getCurrentQuarterDetails(changeEvent = "") {
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
            isValidDataPresent = this.isValidDate(changeEvent, isDate)
        }
        else if (changeEvent == "END_DT") {
            isDate = this.END_DT;
            isValidDataPresent = this.isValidDate(changeEvent, isDate)
        }
        else if (changeEvent == "START_YR" || changeEvent == "START_QTR") {
            qtrValue = this.START_QTR;
            yearValue = this.START_YR;
            isValidDataPresent = (yearValue != null && yearValue >= this.contractData.MinDate.split('/').at(-1)) ? true : false;
        }
        else if (changeEvent == "END_YR" || changeEvent == "END_QTR") {
            qtrValue = this.END_QTR;
            yearValue = this.END_YR;
            isValidDataPresent = (yearValue != null && yearValue <= this.contractData.MaxDate.split('/').at(-1)) ? true : false;
        }
        if (isValidDataPresent) {
            this.isLoading = true;
            this.contractDetailsSvc.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
                .subscribe((response: any) => {
                    this.isLoading = false;
                    if (response != null) {
                        if (changeEvent == "") {
                            if (moment(response["QTR_END"]) < moment(new Date())) {
                                response["QTR_END"] = moment(response["QTR_END"]).add(365, "days").format("l");
                            }
                            this.contractData.MinDate = moment(response["MIN_STRT"]).format("l");
                            this.contractData.MaxDate = moment(response["MIN_END"]).format("l");
                            // By default we dont want a contract to be backdated
                            this.contractData.START_DT = this.isTender == true ? moment().format("l") : moment(response["QTR_STRT"]).isBefore(this.today)
                                ? this.today
                                : moment(response["QTR_STRT"]).format("l");
                            this.START_DT = new Date(this.contractData.START_DT);
                            this.contractData.END_DT = moment(response["QTR_END"]).format("l");
                            this.END_DT = new Date(this.contractData.END_DT);
                            this.START_QTR = this.END_QTR = this.contractData.START_QTR = this.contractData.END_QTR = response?.QTR_NBR;
                            this.END_YR = this.START_YR = this.contractData.START_YR = this.contractData.END_YR = response?.YR_NBR;
                        }
                        if (changeEvent == "START_QTR" || changeEvent == "START_YR" || changeEvent == "START_DT") {
                            this.START_QTR = response?.QTR_NBR;
                            this.START_YR = response?.YR_NBR;
                            this.START_DT = (changeEvent == "START_DT") ? this.START_DT : new Date(moment(response["QTR_STRT"]).format("l"));
                            const strtDate = new Date(this.contractData.START_DT);
                            const selectedDate = this.START_DT;
                            this.backDateCheck(strtDate, selectedDate);
                        }
                        if (changeEvent == "END_QTR" || changeEvent == "END_YR" || changeEvent == "END_DT") {
                            this.END_DT = (changeEvent == "END_DT") ? this.END_DT : new Date(moment(response["QTR_END"]).format("l"));
                            this.END_QTR = response?.QTR_NBR;
                            this.END_YR = response?.YR_NBR;
                        }
                    }
                    if (this.END_DT != undefined && this.START_DT != undefined) {
                        this.validateDate(changeEvent);
                    }
                },(err)=>{
                    this.loggerSvc.error("Unable to get current quarter data","Error",err);
                    this.isLoading = false;
                });
        }
    }

    validateDate(dateChange) {
        this.contractData._behaviors.isError['START_DT'] = this.contractData._behaviors.isError['END_DT'] = false;
        this.contractData._behaviors.validMsg['START_DT'] = this.contractData._behaviors.validMsg['END_DT'] = "";
        const startDate = this.START_DT;
        const endDate = this.END_DT;
        if (dateChange == 'START_DT' || dateChange == "START_YR" || dateChange == "START_QTR") {
            if (moment(startDate).isAfter(endDate) || moment(startDate).isBefore(this.contractData.MinDate)) {
                this.contractData._behaviors.isError['START_DT'] = true;
                this.contractData._behaviors.validMsg['START_DT'] = moment(startDate).isBefore(this.contractData.MinDate)
                    ? "Start date cannot be less than - " + this.contractData.MinDate
                    : "Start date cannot be greater than End Date";
            }
        } else {
            if (moment(endDate).isBefore(startDate) || moment(endDate).isAfter(this.contractData.MaxDate)) {
                this.contractData._behaviors.isError['END_DT'] = true;
                this.contractData._behaviors.validMsg['END_DT'] = moment(endDate).isAfter(this.contractData.MaxDate)
                    ? "End date cannot be greater than - " + this.contractData.MaxDate
                    : "End date cannot be less than Start Date";
            }
            if (this.existingMinEndDate !== null && this.contractData.PRC_ST != null && this.contractData.PRC_ST.length != 0) {
                if (moment(endDate).isBefore(this.existingMinEndDate)) {
                    this.contractData._behaviors.isError['END_DT'] = true;
                    this.contractData._behaviors.validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + this.existingMinEndDate + " - if you have already created pricing strategies. ";
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
        this.END_DT = new Date(moment().add(20, 'years').format("l"));
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
                        this.contractData.DC_ID = response.CNTRCT[0].DC_ID;
                        if (this.hasUnSavedFiles) {
                            this.uploadFile();
                        } else {
                            window.location.href = "#contractmanager/CNTRCT/" + this.contractData["DC_ID"] + "/0/0/0";
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
        if (confirm("Are you sure that you want to delete this contract?")) {
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
    }
    loadContractDetailsData() {
        //setting the customer dropdown value ngModel
        this.Customer = this.contractData.Customer;
        if (this.Customer) {
            this.disableCustomer = true;
        }
        this.showDeleteButton = true;
        this.contractType = ' Contract';
        this.TITLE = this.contractData.TITLE;
        this.START_DT = new Date(moment(this.contractData.START_DT).format("l"));
        this.END_DT = new Date(moment(this.contractData.END_DT).format("l"));
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
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
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
                    // below lines of code is to set default value for contract type dropdown.
                    this.CONTRACT_TYPE = CONTRACT_TYPE[0];
                    const url = window.location.href.split("/");
                    const qString = url[url.length - 1];
                    if (qString.indexOf("=") != -1) {
                        const copyCid = qString.split("=");
                        this.c_Id = Number(copyCid[copyCid.length - 1]);
                        this.isCopyContract = true;
                        this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                            this.templateData = response;
                            this.contractData = this.initContract();
                            this.contractDetailsSvc
                                .readCopyContract(this.c_Id)
                                .subscribe((response: Array<any>) => {
                                    this.copyContractData = response[0];
                                    this.contractData.TITLE = this.TITLE = this.copyContractData.TITLE + " (copy)";
                                    this.contractData.CUST_MBR_SID = this.Customer = Number(this.copyContractData.CUST_MBR_SID);
                                    this.contractData.START_DT = this.START_DT = this.stDate = new Date(moment(this.copyContractData.START_DT).format("l"));
                                    this.contractData.END_DT = this.END_DT = this.existingMinEndDate = new Date(moment(this.copyContractData.END_DT).format("l"));
                                    this.Customer = this.copyContractData.Customer;
                                    this.contractData.MinDate = this.MinDate = moment().subtract(6, "years").format("l");
                                    this.contractData.MaxDate = this.MaxDate = moment("2099").format("l");
                                    this.contractData.MinYear = this.MinYear = parseInt(moment().format("YYYY")) - 6;
                                    this.contractData.MaxYear = this.MaxYear = parseInt(moment("2099").format("YYYY"));
                                    // NOTE: START_QTR,START_YR,END_YR,END_QTR are not present in copyContractData,, as they are undefined calling getCurrentQuarterDetails to get the data--Check
                                    this.getCurrentQuarterDetails('START_DT');
                                    this.getCurrentQuarterDetails('END_DT');
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
                        this.c_Id = Number(url[url.length - 1]);
                    }

                    if (this.isCopyContract == false) {
                        if (url.length > 6) {
                            this.c_Id = Number(url[6]);
                        }
                        //conditions for new contract
                        if (this.c_Id <= 0) {
                            this.templatesSvc.readTemplates()
                                .subscribe((response: Array<any>) => {
                                    this.templateData = response;
                                    this.contractData = this.initContract();
                                    this.loadContractDetails();
                                    this.getCurrentQuarterDetails();
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
                                    this.initialEndDateReadOnly = this.contractData?._behaviors && this.contractData?._behaviors?.isReadOnly && this.contractData?._behaviors?.isReadOnly["END_DT"] && this.contractData?._behaviors?.isReadOnly["END_DT"];
                                    this.initialStartDateReadOnly = this.contractData?._behaviors && this.contractData?._behaviors?.isReadOnly && this.contractData?._behaviors?.isReadOnly["START_DT"] && this.contractData?._behaviors?.isReadOnly["START_DT"];
                                    this.loadContractDetailsData();
                                    this.getTimeLineDetails();
                                    this.getFileAttachmentDetails(this.c_Id);
                                     //loader disable
                                     this.isLoading=false;
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
        } catch (e) {
            console.error("Unable to load the data", e);
        }
    }

}
angular.module("app").directive(
    "contractDetails",
    downgradeComponent({
        component: contractDetailsComponent,
    })
);

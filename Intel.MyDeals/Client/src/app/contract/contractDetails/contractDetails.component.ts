import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../../shared/logger/logger";
import { contractDetailsService } from "./contractDetails.service";
import { FormGroup } from "@angular/forms";
import { templatesService } from "../../shared/services/templates.service";
import * as _moment from "moment";
import { forkJoin } from "rxjs";
import {  FileRestrictions, RemoveEvent, UploadEvent } from "@progress/kendo-angular-upload";
import { error } from "jquery";
import { invalid } from "@angular/compiler/src/render3/view/util";
//import { debounceTime } from "rxjs/operators";
const moment = _moment;

@Component({
    selector: "contract-details",
    templateUrl: "Client/src/app/contract/contractDetails/contractDetails.component.html",
    styleUrls: ["Client/src/app/contract/contractDetails/contractDetails.component.css"],
})
export class contractDetailsComponent {
    constructor(private templatesSvc: templatesService,
        private contractDetailsSvc: contractDetailsService,
        private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private Customer;
    CUST_NM_DIV: any=[]; CUST_NM; TITLE = ""; START_DT; START_QTR; START_YR; END_DT; END_QTR; END_YR; NO_END_DT = false; NO_END_DT_RSN; isSubmitted = false; NOTES = "";
    BACK_DATE_RSN;CONTRACT_TYPE;
    public c_Id: number;
    public templateData;
    public Customers: Array<any>;
    public Customer_Divs: Array<any>;
    public ContractDataForm: FormGroup;
    public contractData;
    private timeout = null;
    private C2A_DATA_C2A_ID = "";
    public uid = -100;
    public custId: number;
    public contractId: number;
    public renameMapping = {};
    public curPricingTable = {};
    public isCustomerSelected:boolean;
    public initialEndDateReadOnly = false;
    public isTitleError = false;
    public isCustomerDivHidden = true;
    public custAccptData;
    public dropDownsData = {};
    public titleErrorMsg: string;
    public isTender = false;
    public today: string = moment().format("l");
    public MinYear: number;
    public MaxYear: number;
    public MinDate: string;
    public MaxDate: string;
    public saveBtnName: string;
    public format = "#";
    public selectedCUST_ACCPT = "Pending";
    public isendDTReasonReq = false; public isCopyContract = false; public isBackdatepopupopend = false;public isBackDate = false;
    isDivBlankPopupOpen = false; isMissingGrpCode = false; isValid = false;
    public stDate: Date; isRequiredMsg = "* field is required"; existingMinEndDate: Date = null;
    public copyContractData: any;
    public uploadSaveUrl = "/FileAttachments/Save";
    isTenderContract = false;
    // Allowed extensions for the attachments
    myRestrictions: FileRestrictions = {
        allowedExtensions: ["doc", "xls", "txt", "bmp", "jpg", "pdf", "ppt", "zip", "xlsx", "docx", "pptx", "odt", "ods", "ott", "sxw", "sxc", "png", "7z", "xps"],
    };
    
    //public fileAttachments: Array<FileInfo>;
    //formData = {
    //    "custMbrSid": 3136,
    //    "objSid": 26071,
    //    "objTypeSid": 1,
    //    "files": this.fileAttachments
    //}
    //existingMinEndDate = this.contractData.DC_ID > 0 ? this.contractData['END_DT'] : "";
   
    uploadEventHandler(e: UploadEvent) {
        e.data = {
            custMbrSid: 3136,
            objSid: 26071,
            objTypeSid: 1,
            files: e.files
        };
        this.contractData._behaviors.isRequired.C2A_DATA_C2A_ID = false;
    }

    uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint

    removeEventHandler(e: RemoveEvent) {
        console.log('Removing a file');
    }

    onCustomerChange(evt: any) {
        this.contractData["Customer"] = evt;
        this.contractData["CUST_MBR_SID"] = evt?.CUST_SID;
        this.contractData["CUST_ACCNT_DIV_UI"] = this.contractData["CUST_ACCNT_DIV"] = "";
        this.CUST_NM_DIV = [];

        this.NO_END_DT = this.contractData.NO_END_DT = false;
        this.noEndDate();
        this.isCustomerSelected = evt != undefined ? true : false;
        this.updateCorpDivision(evt.CUST_SID);
        this.getCurrentQuarterDetails();
        this.applyTodayDate();
        
        // on change of the contract customer clear the backdate/end date reason values present if any
        this.BACK_DATE_RSN = this.NO_END_DT_RSN = undefined;
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
        this.contractData["CUST_SID"] = "";
        this.contractData["CONTRACT_TYPE"] = "Standard";
        this.contractData["CUST_ACCPT"] = "Pending";
        this.contractData["AttachmentError"] = false;
        this.contractData["CUST_ACCNT_DIV_UI"] = "";
        this.contractData["VISTEX_CUST_FLAG"] = false;
        this.contractData["IsAttachmentRequired"] = false;
        this.contractData["HAS_ATTACHED_FILES"] = "0";
        this.contractData["C2A_DATA_C2A_ID"] = "";
        this.contractData["BACK_DATE_RSN"] = "";
        this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
        this.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = false;
        this.contractData["NOTES"] = "";
        //this.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = !this.isNewContract;
        // In case of existing contract back date reason and text is captured display them
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = this.contractData.BACK_DATE_RSN !== "" && this.contractData.BACK_DATE_RSN !== undefined;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = !this.contractData._behaviors.isRequired["BACK_DATE_RSN"];

    }

    getCustId() {
        return this.contractData["CUST_MBR_SID"];
    }

    onKeySearch(event: any) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (event.keyCode != 13 && event.keyCode != 9) {
                this.isDuplicateContractTitle(event.target.value);
            }
        }, 800);
    }

    // Contract name validation
    isDuplicateContractTitle(title: string) {
        if (title === "") return;
        this.contractDetailsSvc.isDuplicateContractTitle(this.contractData["DC_ID"], title)
            .subscribe((response: Array<any>) => {
                if (response) {
                    this.isTitleError = true;
                    this.titleErrorMsg ="This contract name already exists in another contract.";
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
                if ((this.Customer_Divs[0].PRC_GRP_CD == "")) {
                    //alert("Missing Price Group Code");
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

    //Below function is to show/hide the backdate reason based on the start date change
    onDateChange(evt) {
        //const strtDate = startDate != "" ? startDate : new Date(this.stDate);
        const strtDate =  new Date(this.stDate);
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
        //update the Quarter slider and kendo numeric text box based on date change
        this.getCurrentQuarterDetails();
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

    //apply today's date on cancel click event of back date reason popup
    applyTodayDate() {
        const today = moment().format("l");
        this.START_DT = new Date(moment(this.contractData.START_DT).isBefore(today)? today: this.contractData.START_DT);
        this.isBackdatepopupopend = false;
        this.isBackDate = false;
        this.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
        this.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
        this.contractData.BACK_DATE_RSN = "";
        this.BACK_DATE_RSN = undefined;
    }

   
    customContractValidate() {
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
        this.contractData["BACK_DATE_RSN"] = (this.BACK_DATE_RSN?.DROP_DOWN != "" && this.BACK_DATE_RSN!=undefined) ? this.BACK_DATE_RSN?.DROP_DOWN:"";
        this.contractData["CUST_ACCPT"] = this.selectedCUST_ACCPT;
        this.contractData["NOTES"] = this.NOTES;
        if (this.CUST_NM_DIV != [] && this.CUST_NM_DIV != undefined) {
            this.contractData["CUST_ACCNT_DIV_UI"] = this.CUST_NM_DIV.map((x) => (x.CUST_DIV_NM));
            this.contractData["CUST_ACCNT_DIV"] = this.contractData["CUST_ACCNT_DIV_UI"].join('/');
        }
        this.contractData["NO_END_DT_RSN"] = this.NO_END_DT_RSN?.DROP_DOWN;
        
        //this.contractData["CUST_ACCNT_DIV"]=CUST_ACCNT_DIV
        this.isValid = true;
        const ct = this.contractData;
        if (!this.TITLE) {
            this.isTitleError = true;
            this.titleErrorMsg = "* field is required";
        }
        if (!ct.CUST_MBR_SID) {
            this.isCustomerSelected = false;
        } else {
            this.isCustomerSelected = true;
        }
        if (this.NO_END_DT && (this.NO_END_DT_RSN == undefined)) {
            this.isendDTReasonReq = true;
            this.isValid = false;
        }
        else {
            this.contractData._behaviors.validMsg["NO_END_DT_RSN"] = "";
        }
        const maximumDate = moment(ct.START_DT).add(20, 'years').format('l');
        // If user has clicked on save, that means he has accepted the default contract name set, make it dirty to avoid any changes to dates making a change to contract name.
        if (!this.contractData._behaviors) this.contractData._behaviors = {};
        //this.contractData._behaviors.isDirty['TITLE'] = true;

        if (!this.contractData.CUST_MBR_SID) {
            this.contractData._behaviors.validMsg["CUST_MBR_SID"] = "Please select a valid customer";
            this.contractData._behaviors.isError["CUST_MBR_SID"] = true;
            this.isValid = false;
        } else if (moment(ct.END_DT) > moment('2099/12/31').add(0, 'years')) {
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

        // Clear all values
        Object.entries(this.contractData).forEach(([key, value]) => {
            // Do not clear the custom validations user has to correct them e.g contract name duplicate
            if (ct._behaviors.validMsg[key] === "" ||
                ct._behaviors.validMsg[key] === "* field is required" ||
                ct._behaviors.validMsg[key] === undefined) {
                ct._behaviors.validMsg[key] = "";
                ct._behaviors.isError[key] = false;
                if (ct[key] === null) ct[key] = "";
                // Special handling for CUST_MBR_SID only field where user can make it null by clearing combobox
            }
        });

        // Check required
        Object.entries(this.contractData).forEach(([key, value]) => {
            if (key[0] !== '_' &&
                value !== undefined &&
                value !== null &&
                !Array.isArray(value) &&
                typeof (value) !== "object" &&
                (typeof (value) === "string" && value.trim() === "") &&
                ct._behaviors.isRequired[key] === true &&
                ct._behaviors.validMsg[key] === "") {
                ct._behaviors.validMsg[key] = "* field is required";
                ct._behaviors.isError[key] = true;
                this.isValid = false;
            }
            if (ct._behaviors.validMsg[key] !== "") {
                this.isValid = false;
            }
        });

        this.contractData._behaviors.isError["CUST_ACCNT_DIV_UI"] = this.contractData._behaviors.isError["CUST_ACCNT_DIV"];
        this.contractData._behaviors.validMsg["CUST_ACCNT_DIV_UI"] = this.contractData._behaviors.validMsg["CUST_ACCNT_DIV"];
        //&& (!hasFiles && !hasUnSavedFiles)
        if (this.contractData.IsAttachmentRequired) {
            this.contractData.AttachmentError = true;
            this.isValid = false;
        }

        if (this.isBackDate == true && this.BACK_DATE_RSN == undefined) {
            this.isValid = false;
        }

        if (this.isValid) {
            if (this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] == false && this.contractData.CUST_ACCNT_DIV == "") {
                this.isDivBlankPopupOpen = true;
            }
            //implement kendo  dialog
            //kendo.confirm("The division is blank. Do you intend for this contract to apply to all divisions?").then(function () {
            //    if (this.isCopyContract) {
            //        this.copyContract();
            //    } else {
            //        this.saveContract();
            //    }
            //},
            //    function () {
            //        return;
            //    });
            //}
            else {
                if (this.isCopyContract) {
                    this.copyContract();
                } else {
                    this.saveContract();
                }
            }
        }
        //} else {
        //    //$timeout(function () {
        //    //    if (!!$("input.isError")[0]) $("input.isError")[0].focus();
        //    //},
        //    //    300);
        //}
    }

    public close(status: string): void {
        if (status == "yes") {
            if (this.isCopyContract) {
                this.copyContract();
            } else {
                this.saveContract();
            }
        }
        this.isDivBlankPopupOpen = false;
    }

    closeAlert() {
        this.isMissingGrpCode = false;
    }

    saveContract() {
        // Contract Data
        const ct = this.contractData;
        this.custId = this.contractData["CUST_SID"];
        this.contractId = -100;
        if (ct["DC_ID"] <= 0) ct["DC_ID"] = this.uid;

        this.contractDetailsSvc
            .createContract(this.getCustId(), this.contractId, ct)
            .subscribe((response: any) => {
                if (response.CNTRCT && response.CNTRCT.length > 0) {
                    window.location.href =
                        "#contractmanager/" + response.CNTRCT[1]["DC_ID"];
                }
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
                    if (!isValid) {
                        this.validateDate("START_DT");
                    }
                    //this.contractData._behaviors.validMsg[type] = isValid?"":"Please select start date greater than " + this.contractData.MinDate;
                } else if (type == "END_DT") {
                    isValid = newDate < new Date(this.contractData.MaxDate) ? true : false;
                    if (!isValid) {
                        this.validateDate("END_DT");
                    }
                    //this.contractData._behaviors.validMsg[type] = isValid ? "" :"Please select end date less than " + this.contractData.MaxDate;
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

    
    getCurrentQuarterDetails(changeEvent = "") {
        let isValidDataPresent = true;
        let yearValue, qtrValue, isDate, customerMemberSid = null;
        customerMemberSid = this.contractData.CUST_MBR_SID == "" ? null : this.contractData.CUST_MBR_SID;
        if (this.END_DT != undefined && this.START_DT != undefined) {
            this.validateDate(changeEvent);
        }
        //if (this.isCopyContract) {
        //    if (changeEvent = "START_DT") {
        //        isDate = new Date(this.contractData.START_DT);
        //    }
        //    else {
        //        isDate = new Date(this.contractData.END_DT);
        //    }
        //}
        //else
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
            //if (!isValidDataPresent && this.contractData._behaviors.validMsg['START_DT'] == "") {
            //    this.contractData._behaviors.validMsg['START_DT'] = ""
            //}
        }
        else if (changeEvent == "END_YR" || changeEvent == "END_QTR") {
            qtrValue = this.END_QTR;
            yearValue = this.END_YR;
            isValidDataPresent = (yearValue != null && yearValue <= this.contractData.MaxDate.split('/').at(-1)) ? true : false;
            //if (!isValidDataPresent && this.contractData._behaviors.validMsg['END_DT'] == "") {
            //    this.contractData._behaviors.validMsg['END_DT'] = "End date cannot be greater than - " + this.maximumDate
            //}
            
        }


        if (isValidDataPresent) {
            this.contractDetailsSvc.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
                //.pipe(debounceTime(300))
                .subscribe((response: Array<any>) => {
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
                            //const stDate = new Date(this.contractData.START_DT);
                            this.START_QTR = this.END_QTR = this.contractData.START_QTR = this.contractData.END_QTR = response["QTR_NBR"];
                            this.END_YR = this.START_YR = this.contractData.START_YR = this.contractData.END_YR = response["YR_NBR"];
                        }
                        if (changeEvent == "START_QTR" || changeEvent == "START_YR" || changeEvent == "START_DT") {
                            this.START_QTR = response["QTR_NBR"];
                            this.START_YR = response["YR_NBR"];
                            this.START_DT = (changeEvent == "START_DT") ? this.START_DT : new Date(moment(response["QTR_STRT"]).format("l"));
                            const strtDate = new Date(this.contractData.START_DT);
                            const selectedDate = this.START_DT;
                            this.backDateCheck(strtDate, selectedDate);
                        }
                        if (changeEvent == "END_QTR" || changeEvent == "END_YR" || changeEvent == "END_DT") {
                            this.END_DT = (changeEvent == "END_DT") ? this.END_DT : new Date(moment(response["QTR_END"]).format("l"));
                            this.END_QTR = response["QTR_NBR"];
                            this.END_YR = response["YR_NBR"];
                        }

                        
                    }

                    if (this.END_DT != undefined && this.START_DT != undefined) {
                        this.validateDate(changeEvent);
                    }

                });
        }

    }

    validateDate(dateChange) {
        this.contractData._behaviors.isError['START_DT'] =this.contractData._behaviors.isError['END_DT'] = false;
        this.contractData._behaviors.validMsg['START_DT'] =this.contractData._behaviors.validMsg['END_DT'] = "";
        const startDate = this.START_DT;
        const endDate = this.END_DT;
        if (dateChange == 'START_DT' || dateChange == "START_YR" || dateChange == "START_QTR") {
            if (moment(startDate).isAfter(endDate) || moment(startDate).isBefore(this.contractData.MinDate)) {
                this.contractData._behaviors.isError['START_DT'] = true;
                this.contractData._behaviors
                    .validMsg['START_DT'] = moment(startDate).isBefore(this.contractData.MinDate)
                        ? "Start date cannot be less than - " + this.contractData.MinDate
                        : "Start date cannot be greater than End Date";
            }
        } else {
            if (moment(endDate).isBefore(startDate) || moment(endDate).isAfter(this.contractData.MaxDate)) {
                this.contractData._behaviors.isError['END_DT'] = true;
                this.contractData._behaviors
                    .validMsg['END_DT'] = moment(endDate).isAfter(this.contractData.MaxDate)
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
            if (this.contractData.data[0] !== undefined) {
                //contractData.data[0]._behaviors = c._behaviors; // DE29422 - This was resetting passed behaviors with an override of what the new contract required should be.
                return this.contractData.data[0];
            }
        }
        return c;
    }

    

    

    noEndDate() {
        //if (this.NO_END_DT) {
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
            this.saveBtnName = this.c_Id > 0 ? "Save Contract" : "Create Contract";
        }
    }

    // Set customer acceptance rules
    setCustAcceptanceRules(newValue) {
        this.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: (newValue === 'Pending');
        //&& (!hasUnSavedFiles && !hasFiles)
        this.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = (newValue !== 'Pending') && !this.isTenderContract;
        if (this.contractData.DC_ID < 0) this.contractData.C2A_DATA_C2A_ID = (newValue === 'Pending') ? "" : this.contractData.C2A_DATA_C2A_ID;
        this.contractData.IsAttachmentRequired = !this.isTenderContract && this.contractData.C2A_DATA_C2A_ID === "" && newValue !== 'Pending';
        this.contractData.AttachmentError = this.contractData.AttachmentError && this.contractData.IsAttachmentRequired;

    }

    c2aIDchange(inputVal) {
        this.contractData.IsAttachmentRequired = inputVal.length > 0 ? false : true;
        //if (this.contractData.AttachmentError) {
        //    this.contractData.IsAttachmentRequired = false;
        //}
        
    }

    copyContract() {
        // Contract Data
        const ct = this.contractData;
        // check for NEW contract
        if (ct.DC_ID <= 0) ct.DC_ID = this.uid--;
        this.contractDetailsSvc.copyContract(this.getCustId(),this.contractData.DC_ID,this.copyContractData.DC_ID,ct)
            .subscribe((response: any) => {
                if (response.CNTRCT && response.CNTRCT.length > 0) {
                    window.location.href =
                        "#contractmanager/" + response.CNTRCT[1]["DC_ID"];
                }
            },
                error => {
                    this.loggerSvc.error("Could not create the contract.", error);
                }
            );
    }

   
    ngOnInit() {
        try {
            //loading customer data
            this.contractDetailsSvc.GetMyCustomerNames().subscribe((response: Array<any>) => {
                this.Customers = response;
                forkJoin({
                    NO_END_DT_RSN: this.contractDetailsSvc.getVendorDropDown('NO_END_DT_RSN'),
                    BACK_DATE_RSN: this.contractDetailsSvc.getVendorDropDown('BACK_DATE_RSN'),
                    CONTRACT_TYPE: this.contractDetailsSvc.getVendorDropDown('CONTRACT_TYPE'),
                    CUST_ACCPT: this.contractDetailsSvc.getVendorDropDown('CUST_ACCPT'),
                }).subscribe(({ NO_END_DT_RSN, BACK_DATE_RSN, CONTRACT_TYPE, CUST_ACCPT }) => {
                        this.dropDownsData['NO_END_DT_RSN'] = NO_END_DT_RSN;
                        this.dropDownsData['BACK_DATE_RSN'] = BACK_DATE_RSN;
                        this.dropDownsData['CONTRACT_TYPE'] = CONTRACT_TYPE;
                        this.dropDownsData['CUST_ACCPT'] = CUST_ACCPT;
                        // below line of code is to set default value for contract type dropdown.
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
                                        this.contractData.START_DT = this.START_DT = this.stDate = new Date(moment(this.copyContractData.START_DT).format("l") );
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
                                        this.contractData.CUST_ACCNT_DIV =this.copyContractData.CUST_ACCNT_DIV;
                                        this.contractData.IS_TENDER = this.copyContractData.IS_TENDER;
                                        this.contractData.CONTRACT_TYPE = this.copyContractData.CONTRACT_TYPE;
                                        this.contractData.CUST_ACCNT_DIV_UI = !this.contractData["CUST_ACCNT_DIV"] ? "" : this.contractData["CUST_ACCNT_DIV"].split("/");
                                        //let divisions= this.copyContract.CustomerDivisions
                                        //this.CUST_NM_DIV = this.contractData.CUST_ACCNT_DIV_UI.map((x,) => result1.filter(y => x == y.id))
                                        //this.contractData.CUST_ACCNT_DIV = !this.contractData["CUST_ACCNT_DIV_UI"] ? "" : this.contractData["CUST_ACCNT_DIV_UI"].filter(x=> );

                                        this.updateCorpDivision(this.copyContractData.CUST_MBR_SID);
                                        // Check for Backdate Reason
                                        this.pastDateConfirm(this.contractData.START_DT);
                                    });
                            });
                        } else {
                            this.c_Id = Number(url[url.length - 1]);
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
                                    });
                            }
                            //condition for existing contract
                            else {
                                this.contractDetailsSvc
                                    .readContract(this.c_Id)
                                    .subscribe((response: Array<any>) => {
                                        this.contractData = response[0];
                                        this.isTenderContract = this.contractData["IS_TENDER"];
                                    });
                            }
                        }
                        this.setSaveBtnName();

                    }, error=> {
                        this.loggerSvc.error("Unable to getVendorDropDown.", error);
                    });

            }, error=> {
                this.loggerSvc.error("Unable to get Customers.",error);
            });

        } catch (e) {
            console.error("***************************", e);
        }
    }
}

angular.module("app").directive(
    "contractDetails",
    downgradeComponent({
        component: contractDetailsComponent,
    })
);

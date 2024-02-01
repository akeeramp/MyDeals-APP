import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject, OnDestroy } from "@angular/core";
import { PricingTableEditorService } from "../../pricingTableEditor/pricingTableEditor.service"
import { each } from 'underscore';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'end-customer-retail',
    templateUrl: 'Client/src/app/contract/ptModals/dealEditorModals/endCustomerRetailModal.component.html',
    styleUrls: ['Client/src/app/contract/ptModals/dealEditorModals/dealEditorModals.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class endCustomerRetailModalComponent implements OnDestroy {
    constructor(private loggerSvc: logger, private dialogRef: MatDialogRef<endCustomerRetailModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private pteService: PricingTableEditorService) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    private isLoading = false;
    private isError = false;
    private changeErrorFlag = false;
    private endCustomerValues = []
    private countryValues = []
    private validateFlag = true;
    private ecOptionsFlag = true;
    private spinnerMessageHeader = "Loading...";
    private spinnerMessageDescription = "Loading the End Customer/Retail information.";
    private isBusyShowFunFact = true;
    private isAdmin: any;
    private endCustomer = "END_CUSTOMER_RETAIL"
    private endCustomerRetailPopUpModal = this.data.item;
    private END_CUST_OBJ: any;
    private isAny = false;
    private colName: any;
    private embValidationMsg = 'Intel is currently unable to approve deals with the selected End Customer Country/Region. Please verify the agreement.';
    private isEndCustomer: boolean;
    private isEmptyList = false;
    private endCustOptions: any;
    private endCustOptionsWithOutAny: any;
    private countries: any;
    private endCustData: any = [];
    private msg: any;
    private isWarning = false;
    private message: any;
    public virtual: any = { itemHeight: 28 };
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();

    addRow(e) {
        this.validateFlag = true;
        const index = this.END_CUST_OBJ.indexOf(e);
        if (index > -1) {
            this.END_CUST_OBJ.splice(index + 1, 0,
                {
                    "END_CUSTOMER_RETAIL": "",
                    "PRIMED_CUST_ID": "",
                    "PRIMED_CUST_NM": "",
                    "PRIMED_CUST_CNTRY": "",
                    "IS_PRIMED_CUST": 0,
                    "IS_EXCLUDE": 0,
                    "IS_RPL": 0,
                    "RPL_STS_CD": ""
                });
        }
    }

    removeRow(e) {
        this.validateFlag = true;
        if (this.END_CUST_OBJ.length === 1) {
            this.END_CUST_OBJ[0] = {
                "END_CUSTOMER_RETAIL": "",
                "PRIMED_CUST_ID": "",
                "PRIMED_CUST_NM": "",
                "PRIMED_CUST_CNTRY": "",
                "IS_PRIMED_CUST": 0,
                "IS_EXCLUDE": 0,
                "IS_RPL": 0,
                "RPL_STS_CD": ""
            }
            return;
        }
        const index = this.END_CUST_OBJ.indexOf(e);
        if (index > -1) {
            this.END_CUST_OBJ.splice(index, 1);
        }
    }

    getEndCustomerRetailDetails() {
        this.pteService.readDropdownEndpoint(this.data.item.retailLookUpUrl).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response != null && response != undefined) {
                this.endCustOptions = response;
                this.endCustOptionsWithOutAny = response.filter(x => x.Value.toUpperCase() !== "ANY");
                this.ecOptionsFlag = false;
                this.isLoading = false;
            }
        }, error => {
            this.loggerSvc.error('dealEditorComponent::readEndCustomerRetail::readDropdownEndpoint:: service', error);
        });
    }

    getCountry() {
        this.pteService.readDropdownEndpoint(this.data.item.countryLookUpUrl).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response != null && response != undefined)
                this.countries = response;
        }, error => {
            this.loggerSvc.error('dealEditorComponent::readCountry::readDropdownEndpoint:: service', error);
        });
    }

    ok() {
        this.isLoading = true;
        this.spinnerMessageHeader = "Validating...";
        this.spinnerMessageDescription = "Validating the End Customer/Retail information.";
        this.isError = false;
        var ecValues = this.END_CUST_OBJ.map(getEndcustvalues)

        function getEndcustvalues(item) {
            return [item.END_CUSTOMER_RETAIL].join(",");
        }
        var ctryValues = this.END_CUST_OBJ.map(getCtryvalues)
        function getCtryvalues(item) {
            return [item.PRIMED_CUST_CNTRY].join(",");
        }
        var patt = new RegExp("^[\\w .,:'\&+-]*$");
        var isExclude = 0;
        this.endCustomerValues = ecValues
        this.countryValues = ctryValues
        // Check to find whether first combination End customer is "any" , TO set IS_EXCLUDE to true 
        if (ecValues.length > 1) {
            if (ecValues[0].toUpperCase() == "ANY") {
                isExclude = 1;
            }
        }
        for (var i = 0; i < ecValues.length; i++) {
            var rowError = false;
            var endCustFieldParent = document.getElementById("ComboBoxSelect_" + i) as HTMLElement;
            var endCustField = endCustFieldParent.children[0] as HTMLElement;
            var ctryFieldParent = document.getElementById("DropdownSelections_" + i) as HTMLElement;
            var ctryField = ctryFieldParent.children[0] as HTMLElement;
            if (i > 0) {
                this.END_CUST_OBJ[i].IS_EXCLUDE = isExclude;
            }
            else {
                this.END_CUST_OBJ[i].IS_EXCLUDE = 0;
            }
            var ctryExists = this.countries.filter(x => x.CTRY_NM == ctryValues[i]).length > 0;
            if (ecValues[i] == "" && (ctryValues[i] == "" || (!ctryExists && !(ctryValues[i].toLowerCase() === "any" && i == 0)))) {
                this.isError = true;
                rowError = true;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "Please select End Customer/Retail and End Customer Country/Region");
                    let child = endCustField.children[endCustField.children.length-1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Please select End Customer/Retail and End Customer Country/Region");
                    }
                }
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.backgroundColor = "LightPink";
                    ctryFieldParent.style.backgroundColor = "LightPink";
                    ctryField.setAttribute("title", "Please select End Customer/Retail and End Customer Country/Region");
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Please select End Customer/Retail and End Customer Country/Region");
                    }
                }
            }
            else if (ecValues[i] == "") {
                rowError = true;
                this.isError = true;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "Please select End customer/Retail");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Please select End customer/Retail");
                    }
                }
            }
            else if (ecValues[i].length > 60 && this.endCustOptionsWithOutAny.filter(e => e.Value === ecValues[i]).length == 0) {
                // Length > 60 and not found in current dropdowns values list, i.e., user entered new value
                rowError = true;
                this.isError = true;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "End Customers must be 60 characters or less, Please Correct.");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "End Customers must be 60 characters or less, Please Correct.");
                    }
                }
            }
            else if (ctryValues[i] == "" || (!ctryExists && !(ctryValues[i].toLowerCase() === "any" && i == 0))) {
                this.isError = true;
                rowError = true;
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.backgroundColor = "LightPink";
                    ctryFieldParent.style.backgroundColor = "LightPink";
                    ctryField.setAttribute("title", "Please Select End Customer Country/Region from the dropdown");
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Please Select End Customer Country/Region from the dropdown");
                    }
                }
            }

            else {
                rowError = this.validateDuplicateEntry(i, ecValues[i], ctryValues[i])
            }

            //to check whether user entered End customer/retail value is valid or not
            var res = patt.test(ecValues[i]);

            var IsECSelected = (this.endCustOptions !== undefined && this.endCustOptions !== null) ? (this.endCustOptions.find(x => x.Value === ecValues[i])) : undefined;

            if (!res && IsECSelected === undefined) {
                this.isError = true;
                rowError = true;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.");
                    }
                }
            }

            if (ecValues[i].toUpperCase() == "ANY" && this.isAdmin == true) {
                this.isError = true;
                rowError = false;
                this.isWarning = true;
                this.message = "Any can not be selected from Deal reconciliation screen.";
            }
            else if (ecValues[i].toUpperCase() == "ANY") {
                if (i > 0) {
                    if (endCustField != undefined && endCustField != null) {
                        endCustFieldParent.style.backgroundColor = "LightPink";
                        endCustField.style.backgroundColor = "LightPink";
                        endCustField.setAttribute("title", "Any can be selected only in the First combination");
                        let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                        if (child != undefined && child != null) {
                            child.style.backgroundColor = "LightPink";
                            child.setAttribute("title", "Any can be selected only in the First combination");
                        }
                    }
                    this.isError = true;
                    rowError = true;
                }
            }
            if (!rowError) {
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.borderBottomColor = "#ced4da";
                    endCustField.style.borderBottomColor = "#ced4da";
                    endCustField.removeAttribute("title");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "white";
                        child.removeAttribute("title");
                    }
                }
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.borderBottomColor = "#ced4da";
                    ctryFieldParent.style.borderBottomColor = "#ced4da";
                    ctryField.removeAttribute("title");
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "white";
                        child.removeAttribute("title");
                    }
                }
            }
        }

        each(ctryValues, (item, i) => {
            //Embargo Country/Region validation alert.
            var embCtry = this.showEmbAlert(this.embValidationMsg, item, 'ok');
            if (embCtry) {
                this.isError = true;
                rowError = true;
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.backgroundColor = "LightPink";
                    ctryFieldParent.style.backgroundColor = "LightPink";
                    ctryField.setAttribute("title", this.embValidationMsg);
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", this.embValidationMsg);
                    }
                }
            }
        });

        if (!this.isError) {
            this.pteService.validateEndCustomer(JSON.stringify(this.END_CUST_OBJ)).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                this.END_CUST_OBJ = res;
                this.validateFlag = false;
                var i = 0;
                each(this.END_CUST_OBJ, (item) => {
                    var responsedata = this.END_CUST_OBJ.filter(x => x.PRIMED_CUST_ID != null && x.PRIMED_CUST_ID != "" && x.PRIMED_CUST_ID == item.PRIMED_CUST_ID && x.PRIMED_CUST_CNTRY == item.PRIMED_CUST_CNTRY);
                    if (responsedata.length > 1) {
                        this.validateFlag = true;
                        var endCustFieldParent = document.getElementById("ComboBoxSelect_" + i) as HTMLElement;
                        var endCustField = endCustFieldParent.children[0] as HTMLElement;
                        if (endCustField != undefined && endCustField != null) {
                            endCustFieldParent.style.backgroundColor = "LightPink";
                            endCustField.style.backgroundColor = "LightPink";
                            endCustField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                            let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                            if (child != undefined && child != null) {
                                child.style.backgroundColor = "LightPink";
                                child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                            }
                        }
                        var ctryFieldParent = document.getElementById("DropdownSelections_" + i).children[0] as HTMLElement;
                        var ctryField = ctryFieldParent.children[0] as HTMLElement;
                        if (ctryField != undefined && ctryField != null) {
                            ctryField.style.backgroundColor = "LightPink";
                            ctryFieldParent.style.backgroundColor = "LightPink";
                            ctryField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                            let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                            if (child != undefined && child != null) {
                                child.style.backgroundColor = "LightPink";
                                child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                            }
                        }
                    }
                    i++;
                });
                this.isLoading = false;
            }, error => {
                this.loggerSvc.error('dealEditorComponent::ValidateEndCustomerRetail::validateEndCustomer:: service', error);
                this.isLoading = false;
            });
        }
        else
            this.isLoading = false;
    }

    validateDuplicateEntry(i, ecVal, ctryVal) {
        var duplicateIndex = 0;
        var rowError = false;
        each(this.END_CUST_OBJ, (item) => {
            if (i != duplicateIndex && item.END_CUSTOMER_RETAIL.toUpperCase() == ecVal.toUpperCase() && item.PRIMED_CUST_CNTRY == ctryVal) {
                this.isError = true;
                this.validateFlag = true;
                rowError = true;
                var endCustFieldParent = document.getElementById("ComboBoxSelect_" + duplicateIndex) as HTMLElement;
                var endCustField = endCustFieldParent.children[0] as HTMLElement;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                    }
                }
                var ctryFieldParent = document.getElementById("DropdownSelections_" + duplicateIndex) as HTMLElement;
                var ctryField = ctryFieldParent.children[0] as HTMLElement;
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.backgroundColor = "LightPink";
                    ctryFieldParent.style.backgroundColor = "LightPink";
                    ctryField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                    }
                }
                endCustFieldParent = document.getElementById("ComboBoxSelect_" + i) as HTMLElement;
                endCustField = endCustFieldParent.children[0] as HTMLElement;
                if (endCustField != undefined && endCustField != null) {
                    endCustFieldParent.style.backgroundColor = "LightPink";
                    endCustField.style.backgroundColor = "LightPink";
                    endCustField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                    let child = endCustField.children[endCustField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique");
                    }
                }
                ctryFieldParent = document.getElementById("DropdownSelections_" + duplicateIndex) as HTMLElement;
                ctryField = ctryFieldParent.children[0] as HTMLElement;
                if (ctryField != undefined && ctryField != null) {
                    ctryField.style.backgroundColor = "LightPink";
                    ctryFieldParent.style.backgroundColor = "LightPink";
                    ctryField.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                    let child = ctryField.children[ctryField.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "End Customer/Retail and End Customer Country/Region Combination must be unique.");
                    }
                }
            }
            duplicateIndex++;
        });
        return rowError;
    }

    showEmbAlert(validationMsg, country, type) {
        if (this.countries != null) {
            var countryVal = this.countries.filter(x => x.CTRY_NM == country);
            if (countryVal != undefined && countryVal != null && countryVal.length > 0 && countryVal[0].CTRY_XPORT_CTRL_CD == 'EC') {
                if (type == 'ok') {
                    this.isWarning = true;
                    this.message = validationMsg;
                    return countryVal;
                }
                else {
                    this.isError = true;
                    this.msg = validationMsg;
                }
            }
        }
    }

    changeCountryField = function (index, endCust) {
        this.validateFlag = true;
        var dataElement = endCust;
        var dataItem = this.countries.filter(x => x.CTRY_NM == dataElement.PRIMED_CUST_CNTRY);
        dataElement.IS_PRIMED_CUST = 0;
        dataElement.IS_RPL = 0;
        dataElement.PRIMED_CUST_ID = "";
        dataElement.PRIMED_CUST_NM = "";
        dataElement.RPL_STS_CD = "";
        var embCountry = this.showEmbAlert(this.embValidationMsg, dataItem[0]?.CTRY_NM, 'ok');
        var fieldParent = document.getElementById("DropdownSelections_" + index) as HTMLElement;
        var field = fieldParent.children[0] as HTMLElement;
        if (dataItem === undefined || dataItem === null || dataItem.length <= 0) {
            if (field != undefined && field != null) {
                fieldParent.style.backgroundColor = "LightPink";
                field.style.backgroundColor = "LightPink";
                field.setAttribute("title", "Please Select End Customer Country/Region from the dropdown");
                let child = field.children[field.children.length - 1] as HTMLElement;
                if (child != undefined && child != null) {
                    child.style.backgroundColor = "LightPink";
                    child.setAttribute("title", "Please Select End Customer Country/Region from the dropdown");
                }
            }
        }
        else if (embCountry) {
            if (field != undefined && field != null) {
                fieldParent.style.backgroundColor = "LightPink";
                field.style.backgroundColor = "LightPink";
                field.setAttribute("title", this.embValidationMsg);
                let child = field.children[field.children.length - 1] as HTMLElement;
                if (child != undefined && child != null) {
                    child.style.backgroundColor = "LightPink";
                    child.setAttribute("title", this.embValidationMsg);
                }
            }
        }
        else {
            if (field != undefined && field != null) {
                fieldParent.style.borderBottomColor = "#ced4da";
                field.style.borderBottomColor = "#ced4da";
                field.removeAttribute("title");
                let child = field.children[field.children.length - 1] as HTMLElement;
                if (child != undefined && child != null) {
                    child.style.backgroundColor = "white";
                    child.removeAttribute("title");
                }
            }
        }
    }

    changeField = function (index, endCust) {
        this.isAny = this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != null && this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != undefined && this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL.toUpperCase() == 'ANY';
        var fieldParent = document.getElementById("ComboBoxSelect_" + index) as HTMLElement;
        var field = fieldParent as HTMLElement;
        this.validateFlag = true;
        var dataElement = endCust;
        var dataItem = this.endCustOptions.filter(x => x.Value == dataElement.END_CUSTOMER_RETAIL);
        var endCustomer = dataElement.END_CUSTOMER_RETAIL;
        //on change event Re-setting Unified Values(PRIMED_CUST_ID,IS_PRIMED_CUST and PRIMED_CUST_NM) to empty(initial) values
        dataElement.IS_PRIMED_CUST = 0;
        dataElement.IS_RPL = 0;
        dataElement.PRIMED_CUST_ID = "";
        dataElement.PRIMED_CUST_NM = "";
        dataElement.RPL_STS_CD = "";
        this.ChangeErrorFlag = false;
        var patt = new RegExp("^[\\w .,:'\&+-]*$");
        var isECUserText = false;
        //to get the user entered free text end customer value
        if (dataItem === undefined || dataItem === null || dataItem.length <= 0) {
            if (endCustomer != null && endCustomer != undefined && endCustomer != "") {
                endCustomer = endCustomer.trim();
                var ecIndex = index;
                //Added this line to make sure alignment of the popup data doesnt go off when user enters "any" in the first EC pair before EC dropdown data load
                this.isAny = (endCustomer.toUpperCase() == "ANY" && ecIndex == 0) ? true : this.isAny;
            }
            isECUserText = true;
            this.END_CUST_OBJ[index].END_CUSTOMER_RETAIL = endCustomer;
        };

        if (isECUserText) {
            var isEndCustomerValid = patt.test(endCustomer);
            if (isEndCustomerValid) {
                if (field != undefined && field != null) {
                    fieldParent.style.borderBottomColor = "#ced4da";
                    field.style.borderBottomColor = "#ced4da";
                    field.removeAttribute("title");
                    let child = field.children[field.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "white";
                        child.removeAttribute("title");
                    }
                }
                this.ChangeErrorFlag = false;
            }
            else {
                this.ChangeErrorFlag = true;
                this.validateFlag = true;
                if (field != undefined && field != null) {
                    fieldParent.style.backgroundColor = "LightPink";
                    field.style.backgroundColor = "LightPink";
                    field.setAttribute("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.");
                    let child = field.children[field.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "LightPink";
                        child.setAttribute("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.");
                    }
                }
            }
        }
        if (endCustomer && endCustomer.length > 60 && this.endCustOptionsWithOutAny.filter(e => e.Value === endCustomer).length == 0) {
            // Length > 60 and not found in current dropdowns values list, i.e., user entered new value
            this.ChangeErrorFlag = true;
            this.validateFlag = true;
            if (field != undefined && field != null) {
                fieldParent.style.backgroundColor = "LightPink";
                field.style.backgroundColor = "LightPink";
                field.setAttribute("title", "End Customers must be 60 characters or less, Please Correct.");
                let child = field.children[field.children.length - 1] as HTMLElement;
                if (child != undefined && child != null) {
                    child.style.backgroundColor = "LightPink";
                    child.setAttribute("title", "End Customers must be 60 characters or less, Please Correct.");
                }
            }
        }
        if ((endCustomer && endCustomer.toUpperCase()) == "ANY") {
            if (this.isAdmin == true) {
                this.ChangeErrorFlag = false;
                this.isWarning = true;
                this.message = "Any can not be selected from Deal reconciliation screen.";
            }
            else {
                if (parseInt(index) > 0) {
                    dataElement.PRIMED_CUST_CNTRY = "";
                    if (field != undefined && field != null) {
                        fieldParent.style.backgroundColor = "LightPink";
                        field.style.backgroundColor = "LightPink";
                        field.setAttribute("title", "Any can be selected only in the First combination");
                        let child = field.children[field.children.length - 1] as HTMLElement;
                        if (child != undefined && child != null) {
                            child.style.backgroundColor = "LightPink";
                            child.setAttribute("title", "Any can be selected only in the First combination");
                        }
                    }
                    this.ChangeErrorFlag = true
                    this.validateFlag = true;
                }
                else {
                    if (field != undefined && field != null) {
                        fieldParent.style.borderBottomColor = "#ced4da";
                        field.style.borderBottomColor = "#ced4da";
                        field.removeAttribute("title");
                        let child = field.children[field.children.length - 1] as HTMLElement;
                        if (child != undefined && child != null) {
                            child.style.backgroundColor = "white";
                            child.removeAttribute("title");
                        }
                    }
                    dataElement.PRIMED_CUST_CNTRY = "Any";
                }
            }
        }
        else if (endCustomer !== null && !this.ChangeErrorFlag) {
            if (field != undefined && field != null) {
                fieldParent.style.borderBottomColor = "#ced4da";
                field.style.borderBottomColor = "#ced4da";
                field.removeAttribute("title");
                let child = field.children[field.children.length - 1] as HTMLElement;
                if (child != undefined && child != null) {
                    child.style.backgroundColor = "white";
                    child.removeAttribute("title");
                }
            }
            var primeCustCountryValue = this.END_CUST_OBJ[0].PRIMED_CUST_CNTRY == null ? "" : this.END_CUST_OBJ[0].PRIMED_CUST_CNTRY;
            if (parseInt(index) == 0 && primeCustCountryValue.toUpperCase() == "ANY") {
                dataElement.PRIMED_CUST_CNTRY = "";
                var ctryfieldParent = document.getElementById("DropdownSelections_" + index) as HTMLElement;
                var ctryfield = ctryfieldParent.children[0] as HTMLElement;

                if (ctryfield != undefined && ctryfield != null) {
                    ctryfield.style.borderBottomColor = "#ced4da";
                    ctryfieldParent.style.borderBottomColor = "#ced4da";
                    ctryfield.removeAttribute("title");
                    let child = ctryfield.children[field.children.length - 1] as HTMLElement;
                    if (child != undefined && child != null) {
                        child.style.backgroundColor = "white";
                        child.removeAttribute("title");
                    }
                }
            }
            each(this.END_CUST_OBJ, (item) => {
                //Embargo Country/Region validation alert.
                if (item.END_CUSTOMER_RETAIL === endCustomer && item.PRIMED_CUST_CNTRY === dataElement.PRIMED_CUST_CNTRY) {
                    this.showEmbAlert(this.embValidationMsg, item, 'ok');
                }
            });

        }
        this.END_CUST_OBJ[index] = dataElement;
    }

    saveEndcustomerData() {
        if (this.isError == false && this.END_CUST_OBJ.length !== 0) {
            this.endCustData.PRIMED_CUST_NM = this.END_CUST_OBJ.map(this.getPrimeCustNames).join();

            this.endCustData.IS_PRIME = this.END_CUST_OBJ.filter(x => x.IS_PRIMED_CUST == 0).length > 0 ? 0 : 1;
            //RPL status of Excluded End Customer should not be Considered in determining the deal level IS_RPL attribute
            this.endCustData.IS_RPL = this.END_CUST_OBJ.filter(x => x.IS_RPL == 1 && x.IS_EXCLUDE != "1").length > 0 ? 1 : 0;

            var primeCustObjWithoutAny = this.END_CUST_OBJ.filter(x => x.PRIMED_CUST_NM.toUpperCase() != "ANY")
            var ecIdList = primeCustObjWithoutAny.map(this.getPrimeCustIds);


            this.endCustData.PRIMED_CUST_ID = ecIdList.join();
            this.endCustData.PRIMED_CUST_CNTRY = this.countryValues.join();
            this.endCustData.END_CUSTOMER_RETAIL = this.endCustomerValues.join();
            this.endCustData.END_CUST_OBJ = JSON.stringify(this.END_CUST_OBJ);
            this.dialogRef.close(this.endCustData);
        }
    }

    getPrimeCustNames(item) {
        if (item.IS_PRIMED_CUST == "0") {
            return ['n/a'].join(",");
        }
        else
            return [item.PRIMED_CUST_NM].join(",")
    }

    getPrimeCustIds(item) {
        if (item.IS_PRIMED_CUST == "0") {
            return ['n/a'].join(",");
        }
        else
            return [item.PRIMED_CUST_ID].join(",");
    }

    async saveAndClose() {
        this.isLoading = true;
        this.spinnerMessageHeader = "Saving.."
        this.spinnerMessageDescription = "Saving the End Customer/Retail information."
        let response = await this.pteService.unPrimeDealsLogs(this.data.item.dealId, JSON.stringify(this.END_CUST_OBJ.filter(x => x.PRIMED_CUST_NM.toUpperCase() != "ANY"))).toPromise().catch((error) => {
            this.loggerSvc.error('Unable to process UCD request.', error);
            this.saveEndcustomerData();
        });
        if (response == "true") {
            this.loggerSvc.success("Request successfully sent to UCD.");
        } else if (response == "false") {
            this.loggerSvc.error("Unable to sent UCD request.", response, "Error");
        } else {
            if (response == "Yes") {
                //"Yes" indicates one of the end customer which is not present in our master table gone through the UCD approval flow and got Unified
                //AS new record got unified in our table we need to re validate the selected End customer and save the End customer atrbs
                let result = await this.pteService.validateEndCustomer(JSON.stringify(this.END_CUST_OBJ)).toPromise().catch((error) => {
                    this.loggerSvc.error('dealEditorComponent::ValidateEndCustomerRetail::validateEndCustomer:: service', error);
                });
                this.END_CUST_OBJ = result;
                this.saveEndcustomerData();
                this.loggerSvc.success("Request successfully sent to UCD.");
            }
        }
        if (response !== "Yes") {
            this.saveEndcustomerData();
        }
        this.isLoading = false;

    }

    primeddata(action) {
        this.endCustData.END_CUST_OBJ = "";
        if (action == "remove") {
            this.endCustData.END_CUSTOMER_RETAIL = "";
        }
        this.endCustData.IS_PRIME = "";
        this.endCustData.PRIMED_CUST_NM = "";
        this.endCustData.PRIMED_CUST_ID = "";
        this.endCustData.PRIMED_CUST_CNTRY = "";
        this.endCustData.END_CUSTOMER_RETAIL = "";
        return this.endCustData;
    }

    remove() {
        if (this.data.cellCurrValues.END_CUST_OBJ.length > 0) {
            var PrimeData = this.primeddata("remove")
            this.dialogRef.close(PrimeData);
        }
        else {
            this.isWarning = true;
            this.message = "There is no end customer to remove";
        }
    };

    cancel() {
        this.dialogRef.close();
    };
    cancelWarning() {
        this.isWarning = false;
        this.message = "";
    }
    ngOnInit() {
        this.END_CUST_OBJ = [
            {
                "END_CUSTOMER_RETAIL": "",
                "PRIMED_CUST_ID": "",
                "PRIMED_CUST_NM": "",
                "PRIMED_CUST_CNTRY": "",
                "IS_PRIMED_CUST": 0,
                "IS_EXCLUDE": 0,
                "IS_RPL": 0,
                "RPL_STS_CD": ""
            }];
        if (this.data.cellCurrValues.END_CUST_OBJ !== "") {
            if (this.data.cellCurrValues.END_CUST_OBJ != undefined && this.data.cellCurrValues.END_CUST_OBJ != null) {
                this.data.cellCurrValues.END_CUST_OBJ = JSON.parse(this.data.cellCurrValues.END_CUST_OBJ)
                this.END_CUST_OBJ = (this.data.cellCurrValues.END_CUST_OBJ.length == 0) ? this.END_CUST_OBJ : this.data.cellCurrValues.END_CUST_OBJ
            }
        }
        this.isAdmin = this.data.item.isAdmin;
        this.isAny = this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != null && this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != undefined && this.END_CUST_OBJ[0].END_CUSTOMER_RETAIL.toUpperCase() == 'ANY';
        this.colName = this.data.item.colName;
        this.isEndCustomer = (this.colName === this.endCustomer);
        this.getEndCustomerRetailDetails();
        this.getCountry();
        this.isLoading = true;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

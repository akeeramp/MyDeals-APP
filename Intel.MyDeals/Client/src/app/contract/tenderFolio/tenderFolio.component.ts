import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TenderFolioService } from '../tenderFolio/tenderFolio.service';
import { templatesService } from "../../shared/services/templates.service";
import { logger } from '../../shared/logger/logger'
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import * as _moment from 'moment';
const moment = _moment;
import * as _ from 'underscore';

@Component({
    providers: [TenderFolioService],
    selector: "app-tender-folio",
    templateUrl: "Client/src/app/contract/tenderFolio/tenderFolio.component.html",
    styleUrls: ["Client/src/app/contract/tenderFolio/tenderFolio.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class TenderFolioComponent {

    constructor(
        public dialogRef: MatDialogRef<TenderFolioComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private dataService: TenderFolioService,
        private loggerSvc: logger,
        private templatesSvc: templatesService

    ) { }

    private isLoading = true;
    private showCustDivAlert = false;
    public templateData;
    private tenderName="";
    private contractType = "Tender Folio";
    private contractData;
    private selectedData = [];
    private isCustDiv = false;
    private isCustSelected = false;
    private custSIDObj;
    private CUST_NM_DIV: any;
    private showKendoAlert = false;
    private isTitleError = false;
    private titleErrorMsg: string;
    private timeout = null;
    public Customers;
    private uid = -100;
    private PtDealTypes;
    private newPricingTable;
    public spinnerMessageHeader = "Tender Folio";
    public spinnerMessageDescription = "Please wait while we load your Tender Folio.";
    private isCopyTender: boolean = false;
    private showCopyAlert: boolean = false;
    dismissPopup(): void {
        this.dialogRef.close();
    }
    selectPtTemplateIcon(dealType) {
        for (const deal of this.PtDealTypes) {
            if (deal.name == dealType.name) {
                deal._custom._active = true;
            } else {
                deal._custom._active = false;
            }
        }
        const title = this.newPricingTable["TITLE"];
        this.newPricingTable = this.templateData.ObjectTemplates.PRC_TBL[dealType.name];
        this.newPricingTable["TITLE"] = title;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = dealType.name;
        this.newPricingTable["_extraAtrbs"] = dealType.extraAtrbs;
        this.newPricingTable["_defaultAtrbs"] = dealType.defaultAtrbs;
        this.defaultAttribs();
    }
    filterDealTypes() {
        let result = {};
        const dealDisplayOrder = ["ECAP", "KIT"];
        const items = this.templateData["ModelTemplates"].PRC_TBL;
        _.each(items, function (value, key) {
            if (value.name !== 'ALL_TYPES') {
                value._custom = {
                    "ltr": value.name[0],
                    "_active": false
                };
                result[key] = value;
            }
        });
        result = dealDisplayOrder.map((object) => result[object]).filter(obj => obj !== undefined);
        this.PtDealTypes = result;
        //Selecting ECAP deal by default and setting corresponding values
        this.selectPtTemplateIcon(this.PtDealTypes[0]);
        //Eventually it will use contractdetail page for getting deal types,for now hardcoded with ecap and kit for tender folio  
        return this.PtDealTypes;
    }
    closeKendoAlert() {
        this.showKendoAlert = false;
    }
    onKeySearch(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (event.keyCode != 13 && event.keyCode != 9) {
                this.isDuplicateContractTitle(event.target.value);
            }
        }, 800);

    }
    // Contract name validation
    isDuplicateContractTitle(title: string) {
        title = title.trim();
        if (title === "") return;
        //passing -100 in place of this.contractData.DC_ID
        this.dataService.isDuplicateContractTitle(-100, title).subscribe((response) => {
            if (response) {
                this.isTitleError = true;
                this.titleErrorMsg = "This contract name already exists in another contract.";
            }
            else {
                this.isTitleError = false;
            }
        }, (err) => {
            this.loggerSvc.error("Unable to Validate duplicate contract title", "Error", err);
        });
    }
    getCustomerDivisions(){
        this.dataService.getCustDivBySID(this.custSIDObj.CUST_SID)
        .subscribe(res => {
            if (res) {
                res = res.filter(data => data.CUST_LVL_SID === 2003);
                if (res[0].PRC_GRP_CD == '') {
                    this.showKendoAlert = true;
                }
                if (res.length <= 1) {
                    this.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                    this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                    //US2444394: commented out below because we no longer want to save Customer Account Division names if there is only one possible option
                    //if (this.contractData.CUST_ACCNT_DIV_UI !== undefined) this.contractData.CUST_ACCNT_DIV_UI = res[0].CUST_DIV_NM.toString();
                } else {
                    this.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false; // never required... blank now mean ALL
                    this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = false;
                }
                this.selectedData = res;
                this.isCustDiv = this.selectedData.length <= 1 ? false : true;
            }
        }, error => {
            this.loggerSvc.error("Unable to get Customer Divisions.", '', "tenderFolioComponent::valueChange:: " + JSON.stringify(error));
        });
    }
    valueChange(value) {
        this.isCustDiv = false;
        if (value) {
            this.custSIDObj = value;
            this.getCustomerDivisions();
        }
    }
    getAllCustomers() {
        this.dataService.getCustomerDropdowns().subscribe(res => {
            if (res) {
                this.Customers = res;
                this.isCustDiv = false;
            }
        }, error => {
            this.loggerSvc.error("Unable to get Customers.", '', "tenderFolioComponent::valueChange:: " + JSON.stringify(error));
        })
    }
    saveContractTender() {
        this.spinnerMessageHeader = "Saving Tender Folio";
        this.spinnerMessageDescription = "Saving the Tender Folio Information.";
        this.contractData.Customer = this.custSIDObj;
        this.contractData.CUST_MBR_SID = this.custSIDObj.CUST_SID;
        this.contractData.TITLE = this.tenderName;
        this.contractData.displayTitle = this.tenderName;
        let selectedCustDivs = [];
        if (this.CUST_NM_DIV) {
            selectedCustDivs = this.CUST_NM_DIV.map(data => data.CUST_DIV_NM);
        }
        this.contractData.CUST_ACCNT_DIV = selectedCustDivs.length > 0 ? selectedCustDivs.toString().replace(/,/g, '/') : "";
        this.contractData.CUST_ACCNT_DIV_UI = selectedCustDivs.length > 0 ? selectedCustDivs : "";

        //Cloning PS
        const ps = this.templateData.ObjectTemplates.PRC_ST.ALL_TYPES;
        ps.DC_ID = this.uid--;
        ps.DC_PARENT_ID = this.contractData.DC_ID;
        ps.PRC_TBL = [];

        // Clone base model and populate changes
        const pt = this.templateData.ObjectTemplates.PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
        pt.DC_ID = this.uid--;
        pt.DC_PARENT_ID = undefined;
        pt.OBJ_SET_TYPE_CD = this.newPricingTable.OBJ_SET_TYPE_CD;

        for (const atrb in this.newPricingTable._extraAtrbs) {
            if (this.newPricingTable._extraAtrbs['atrb'] === undefined && pt['atrb'] === undefined) {
                //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                pt[atrb] = this.newPricingTable._extraAtrbs[atrb].value;
            }
        }
        for (const atrb in this.newPricingTable._defaultAtrbs) {
            if (this.newPricingTable._defaultAtrbs['atrb'] === undefined && pt['atrb'] === undefined) {
                //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                if (Array.isArray(this.newPricingTable._defaultAtrbs[atrb].value)) {
                    //Array, Middle Tier expects a comma separated string
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value.join();
                } else {
                    //String
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value;
                }
            }
        }
        this.createTenderContract(ps, pt);
    }

    createTenderContract(ps, pt) {
        const ct = this.contractData;
        const data = {
            "Contract": [ct],
            "PricingStrategy": [ps],
            "PricingTable": [pt],
            "PricingTableRow": [],
            "WipDeals": [],
            "EventSource": "",
            "Errors": {}
        }
        this.isLoading = true;
        this.dataService.createTenderContract(ct["CUST_MBR_SID"], ct["DC_ID"], data).subscribe((response) => {
            if (response.CNTRCT && response.CNTRCT.length > 0) {
                this.isLoading = false;
                //Redirecting to newContractWidget,handle & call saveContractTender() function of contractDetail page from there
                this.dialogRef.close(response.CNTRCT[1]["DC_ID"]);
            }
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('createTenderContract', '', "tenderFolioComponent::createTenderContract:: " + JSON.stringify(error));
        })
    }

    defaultAttribs() {
        const dealType = this.newPricingTable.OBJ_SET_TYPE_CD;
        const marketSegment = "Corp";

        if (this.newPricingTable["_defaultAtrbs"].REBATE_TYPE) this.newPricingTable["_defaultAtrbs"].REBATE_TYPE.value = "TENDER";
        if (this.newPricingTable["_defaultAtrbs"].MRKT_SEG) this.newPricingTable["_defaultAtrbs"].MRKT_SEG.value = marketSegment;
        if (this.newPricingTable["_defaultAtrbs"].GEO_COMBINED) this.newPricingTable["_defaultAtrbs"].GEO_COMBINED.value = ["Worldwide"];
        if (this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON) dealType == 'FLEX' || dealType == 'REV_TIER' || dealType == 'DENSITY' ? this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Billings" : this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Consumption";
        if (this.newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT) this.newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT.value = "Backend";
        if (this.newPricingTable["_defaultAtrbs"].PROD_INCLDS) this.newPricingTable["_defaultAtrbs"].PROD_INCLDS.value = "Tray";
        if (this.newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE) this.newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE.value = "Accrual";
        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        if (dealType != "KIT") {
            if (this.newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE && dealType != 'KIT') this.newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE.value = "";
        }
        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_TIERS) this.newPricingTable["_defaultAtrbs"].NUM_OF_TIERS.value = "1";
        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        // Tenders come in without a customer defined immediately
        // Tenders don't have a customer at this point, Default to blank for customer defaults and let pricingTable.Controller.js handle tender defaults
        if (this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE) this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE.value = "Yearly";
        if (this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL) this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL.value = ""; // Old value "Issue Credit to Billing Sold To"
        if (this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL) this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL.value = "";
        if (this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT) this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT.value = "";
    }

    ValidateTender() {
        if (!this.custSIDObj) {
            this.isCustSelected = true;
        } else {
            this.isCustSelected = false;
        }
        this.tenderName = this.tenderName.trim();
        if (this.tenderName === "" || !this.tenderName) {
            this.isTitleError = true;
            this.titleErrorMsg = "* field is required";
        }
        if (this.isCustSelected || this.isTitleError) {
            return;
        }
        let selectedCustDivs = [];
        if (this.CUST_NM_DIV) {
            selectedCustDivs = this.CUST_NM_DIV.map(data => data.CUST_DIV_NM);
        }
        const isCustDivsSelected = selectedCustDivs.length > 0 ? true : false;
        if (isCustDivsSelected) {
            if (!this.isCopyTender)
                this.saveContractTender();
            else
                this.copyTender()
        } else {
            //opens confirmation dialog to check for saving tender folio without any customer division selected
            if (this.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] == false && this.contractData.CUST_ACCNT_DIV == "") {
                this.showCustDivAlert = true;
            }
            else {
                if (!this.isCopyTender)
                    this.saveContractTender();
                else
                    this.copyTender()
            }
        }
    }

    saveWithoutCustDivs() {
        this.showCustDivAlert = false;
        if (!this.isCopyTender)
            this.saveContractTender();
        else
            this.copyTender()
    }

    copyTender() {
        //this.setBusy("Copy Tender Folio", "Copying the Contract Information");
        this.data.contractData.Customer = this.custSIDObj;
        this.data.contractData.CUST_MBR_SID = this.custSIDObj.CUST_SID;
        this.data.contractData.TITLE = this.tenderName;
        this.data.contractData.displayTitle = this.tenderName;
        let selectedCustDivs = [];
        if (this.CUST_NM_DIV) {
            selectedCustDivs = this.CUST_NM_DIV.map(data => data.CUST_DIV_NM);
        }
        this.data.contractData.CUST_ACCNT_DIV = selectedCustDivs.length > 0 ? selectedCustDivs.toString().replace(/,/g, '/') : "";
        this.data.contractData.CUST_ACCNT_DIV_UI = selectedCustDivs.length > 0 ? selectedCustDivs : "";

        var ct = [];
        ct.push(this.data.contractData);
        var objSetTypeCd = "";
        _.each(this.templateData.ModelTemplates.PRC_TBL,
            function (value, key) {
                if (value._custom._active === true) {
                    objSetTypeCd = key;
                }
            });

        this.data.contractData["OBJ_SET_TYPE_CD_target"] = objSetTypeCd;
        if (ct[0].DC_ID <= 0) ct[0].DC_ID = this.uid--;
        this.dataService.copyTenderFolioContract(ct, this.data.copyItems.join()).subscribe((data) => {
            if (data === undefined || data['CNTRCT'].length < 2) {
                this.showCopyAlert = true;
                    //this.setBusy("", "");
                    return;
                }
            var id = data['CNTRCT'][1].DC_ID;
            this.dialogRef.close(id);
                //this.setBusy("", "");
            },
            (error) => {
                this.loggerSvc.error("Could not create the contract.", error);
                //this.setBusy("", "");
            }
        );
    }
    closeCopyAlert() {
        this.showCopyAlert = false;
    }
    closeCustDivsAlert() {
        this.showCustDivAlert = false;
    }

    // Set customer acceptance rules
    setCustAcceptanceRules() {
        //US77403 wants it always shown -formerly: (newValue === 'Pending');
        if (this.contractData.DC_ID < 0) this.contractData.C2A_DATA_C2A_ID = (this.contractData.CUST_ACCPT === 'Pending') ? "" : this.contractData.C2A_DATA_C2A_ID;
        this.contractData.IsAttachmentRequired = false && this.contractData.C2A_DATA_C2A_ID === "" && this.contractData.CUST_ACCPT !== 'Pending';
        this.contractData.AttachmentError = this.contractData.AttachmentError && this.contractData.IsAttachmentRequired;
    }

    getCurrentQuarterDetails() {
        const customerMemberSid = this.contractData.CUST_MBR_SID == "" ? null : this.contractData.CUST_MBR_SID;
        const isDate = null;
        const qtrValue = "4";
        const yearValue = new Date().getFullYear();
        this.dataService.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue).subscribe((response: Array<any>) => {
            if (moment(response["QTR_END"]) < moment(new Date())) {
                response["QTR_END"] = moment(response["QTR_END"]).add(365, 'days').format('l');
            }
            this.contractData.MinDate = moment(response["MIN_STRT"]).format('l');
            this.contractData.MaxDate = moment(response["MIN_END"]).format('l');
            this.contractData.START_QTR = this.contractData.END_QTR = response["QTR_NBR"];
            this.contractData.START_YR = this.contractData.END_YR = response["YR_NBR"];
            // By default we dont want a contract to be backdated
            this.contractData.START_DT = moment().format('l');
            this.contractData.END_DT = moment(response["QTR_END"]).format('l');
        }, (err) => {
            this.loggerSvc.error("Unable to get customer calender data", "Error", err);
        });
    }

    initializeTenderData() {
        this.contractData.DC_ID = this.uid--;
        this.contractData.IS_TENDER = "1";
        this.contractData.TENDER_PUBLISHED = 0;
        // Set dates Max and Min Values for numeric text box
        // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
        this.contractData.MinYear = parseInt(moment().format("YYYY")) - 6;
        this.contractData.MaxYear = parseInt(moment("2099").format("YYYY"));
        // Set the initial Max and Min date, actual dates will be updated as per the selected customer
        this.contractData.MinDate = moment().subtract(6, "years").format("l");
        this.contractData.MaxDate = moment("2099").format("l");
        this.contractData.CUST_ACCNT_DIV_UI = "";
        this.contractData.CUST_ACCPT = this.contractData.CUST_ACCPT === "" ? "Pending" : this.contractData.CUST_ACCPT;
        this.contractData["NO_END_DT"] = (this.contractData.NO_END_DT_RSN !== "" && this.contractData.NO_END_DT_RSN !== undefined);
        this.contractData.CUST_ACCPT = "Acceptance Not Required in C2A";
        this.contractData.C2A_DATA_C2A_ID = "Tender Folio Auto";
        this.setCustAcceptanceRules()
        this.getCurrentQuarterDetails();
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    };
    addCustomToTemplates() {
        _.each(this.templateData['ModelTemplates']['PRC_TBL'], (value, key) => {
            value._custom = {
                "ltr": value.name[0],
                "_active": false
            };
        })
    }
    ngOnInit() {
        this.isLoading = true;
        this.getAllCustomers();
        this.isCopyTender = this.data.copyItems && this.data.copyItems.length > 0 ? true : false;
        this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
            this.templateData = response;
            this.contractData = this.templateData["ObjectTemplates"].CNTRCT.ALL_TYPES;
            this.newPricingTable = this.templateData.ObjectTemplates.PRC_TBL.ECAP;
            this.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type so it does not inherit from clone
            this.filterDealTypes();
            this.initializeTenderData();
            if(this.data.selectedCustomers && this.data.selectedCustomers.length > 0){
                this.custSIDObj = this.data.selectedCustomers[0];
                this.getCustomerDivisions();
            }
            if (this.isCopyTender)
                this.addCustomToTemplates();
            this.isLoading = false;
        }, (err) => {
            this.isLoading = false;
            this.loggerSvc.error("Unable to get Template Data", "Error", err);
        })
    }
}
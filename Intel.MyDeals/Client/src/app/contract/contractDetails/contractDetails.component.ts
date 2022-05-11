import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../../shared/logger/logger";
import { contractDetailsService } from "./contractDetails.service";
import { FormGroup } from "@angular/forms";
import { templatesService } from "../../shared/services/templates.service";
import * as _moment from "moment";
import { forkJoin } from "rxjs";
const moment = _moment;

@Component({
    selector: "contract-details",
    templateUrl:
        "Client/src/app/contract/contractDetails/contractDetails.component.html",
    styleUrls: [
        "Client/src/app/contract/contractDetails/contractDetails.component.css",
    ],
})
export class contractDetailsComponent {
    constructor(
        private templatesSvc: templatesService,
        private contractDetailsSvc: contractDetailsService,
        private loggerSvc: logger
    ) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private Customer;
    CUST_NM_DIV;
    CUST_NM;
    TITLE = "";
    START_DT;
    START_QTR;
    START_YR;
    END_DT;
    END_QTR;
    END_YR;
    NO_END_DT = false;
    NO_END_DT_RSN;
    BACK_DATE_RSN;
    CONTRACT_TYPE;
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
    public isCustomerSelected = false;
    public initialEndDateReadOnly = false;
    public isTitleError = false;
    public isCustomerDivHidden = false;
    public custAccptData;
    public dropDownsData = {};
    public titleErrorMsg: string;
    public isTender = false;
    public today: string = moment().format("l");
    public MinYear: number;
    public MaxYear: number;
    public MinDate: string;
    public MaxDate: string;
    public format = "#";
    public selectedCUST_ACCPT = "Pending";

    public copyContractData;
    public isCopyContract = false;
    public isBackdatepopupopend = false;
    public isBackDate = false;

    public saveBtnName: string;

    onCustomerChange(evt: any) {
        this.contractData["Customer"] = evt;
        this.contractData["CUST_MBR_SID"] = evt.CUST_SID;
        this.contractData["CUST_CHNL"] = evt.CUST_CHNL;
        this.contractData["CUST_DIV_NM"] = evt.CUST_DIV_NM;

        this.contractData["CUST_DIV_SID"] = evt.CUST_DIV_SID;
        this.contractData["CUST_LVL_SID"] = evt.CUST_LVL_SID;
        this.contractData["CUST_NM"] = evt.CUST_NM;
        this.contractData["CUST_SID"] = evt.CUST_SID;
        this.updateCorpDivision(evt.CUST_SID);
    }
    loadContractDetails() {
        this.contractData["DC_ID"] = this.uid;
        // Set dates Max and Min Values for numeric text box
        // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
        this.contractData.MinYear = this.MinYear =
            parseInt(moment().format("YYYY")) - 6;
        this.contractData.MaxYear = this.MaxYear = parseInt(
            moment("2099").format("YYYY")
        );

        // Set the initial Max and Min date, actual dates will be updated as per the selected customer
        this.contractData.MinDate = this.MinDate = moment()
            .subtract(6, "years")
            .format("l");
        this.contractData.MaxDate = this.MaxDate = moment("2099").format("l");
        //loading initial values of Contract
        this.contractData["NO_END_DT"] = false;
        this.contractData["CUST_MBR_SID"] = "";
        this.contractData["CUST_CHNL"] = "";
        this.contractData["CUST_DIV_NM"] = "";
        this.contractData["CUST_DIV_SID"] = "";
        this.contractData["CUST_LVL_SID"] = "";
        this.contractData["CUST_NM"] = "";
        this.contractData["CUST_SID"] = "";
        this.contractData["CONTRACT_TYPE"] = "Standard";
        this.contractData["CUST_ACCPT"] = "Pending";
        this.contractData["ACCESS_TYPE"] = true;
        this.contractData["ACTV_IND"] = true;
        //this.contractData["ACTV_IND"] = true;
        this.contractData["CUST_ACCNT_DIV_UI"] = "";
        //this.contractData["CUST_ACCNT_DIV_UI"] = "";
        this.contractData["DEAL_FLG"] = 0;
        this.contractData["DFLT_AR_SETL_LVL"] = null;
        this.contractData["DFLT_CUST_RPT_GEO"] = null;
        this.contractData["DFLT_DOUBLE_CONSUMPTION"] = false;
        this.contractData["DFLT_LOOKBACK_PERD"] = 0;
        this.contractData["DFLT_PERD_PRFL"] = null;
        this.contractData["DFLT_SETTLEMENT_PARTNER"] = null;
        this.contractData["DFLT_TNDR_AR_SETL_LVL"] = null;
        this.contractData["DISP_NM"] = null;
        this.contractData["HOST_GEO"] = "APAC";
        this.contractData["PRC_GRP_CD"] = null;
        this.contractData["VISTEX_CUST_FLAG"] = false;
        this.contractData["IsAttachmentRequired"] = false;
        this.contractData["HAS_ATTACHED_FILES"] = "0";
        //this.contractData["CUST_ACCNT_DIV_UI"] = "";
        this.contractData["C2A_DATA_C2A_ID"] = "";
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
        this.contractDetailsSvc
            .isDuplicateContractTitle(this.contractData["DC_ID"], title)
            .subscribe((response: Array<any>) => {
                if (response) {
                    this.isTitleError = true;
                    this.titleErrorMsg =
                        "This contract name already exists in another contract.";
                } else {
                    this.isTitleError = false;
                }
            });
    }

    //Get Customer Divisions
    updateCorpDivision(custID) {
        if (custID === "" || custID == null) return;
        this.contractDetailsSvc.getMyCustomerDivsByCustNmSid(custID).subscribe(
            (response: Array<any>) => {
                this.Customer_Divs = response.filter(x => x.CUST_LVL_SID == 2003);
                if ((this.Customer_Divs[0].PRC_GRP_CD == "")) {
                    alert("Missing Price Group Code");
                }
                if (this.Customer_Divs.length <= 1) {
                    this.isCustomerDivHidden = false;
                } else {
                    this.isCustomerDivHidden = true;
                }
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Customer Divisions.",
                    response,
                    response.statusText
                );
            }
        );
    }

    customContractValidate() {
        const isValid = true;
        const ct = this.contractData;
        if (!ct.TITLE) {
            this.isTitleError = true;
            this.titleErrorMsg = "* field is required";
        }
        if (!ct.CUST_MBR_SID) {
            this.isCustomerSelected = true;
        } else {
            this.isCustomerSelected = false;
        }

        //save/Copy/create contract
        if (this.isCopyContract) {
            this.copyContract();
        } else {
            this.saveContract();
        }
    }

    saveContract() {
        //setting the UI properties
        this.contractData["END_DT"] = moment(this.END_DT).format("l");
        this.contractData["END_QTR"] = this.END_QTR;
        this.contractData["END_YR"] = this.END_YR;

        this.contractData["TITLE"] = this.TITLE;
        this.contractData["displayTitle"] = this.TITLE;

        this.contractData["START_DT"] = moment(this.START_DT).format("l");
        this.contractData["START_QTR"] = 1;
        this.contractData["START_YR"] = this.START_YR;

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

    getCurrentQuarterDetails() {
        const customerMemberSid =
            this.contractData.CUST_MBR_SID == ""
                ? null
                : this.contractData.CUST_MBR_SID;
        const isDate = this.isTender == true ? null : new Date();
        const qtrValue = this.isTender == true ? "4" : null;
        const yearValue = this.isTender == true ? new Date().getFullYear() : null;
        this.contractDetailsSvc
            .getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
            .subscribe((response: Array<any>) => {
                if (moment(response["QTR_END"]) < moment(new Date())) {
                    response["QTR_END"] = moment(response["QTR_END"])
                        .add(365, "days")
                        .format("l");
                }
                this.contractData.MinDate = moment(response["MIN_STRT"]).format("l");
                this.contractData.MaxDate = moment(response["MIN_END"]).format("l");
                this.contractData.START_QTR = this.contractData.END_QTR =
                    response["QTR_NBR"];
                this.contractData.START_YR = this.contractData.END_YR =
                    response["YR_NBR"];

                // By default we dont want a contract to be backdated
                this.contractData.START_DT =
                    this.isTender == true
                        ? moment().format("l")
                        : moment(response["QTR_STRT"]).isBefore(this.today)
                            ? this.today
                            : moment(response["QTR_STRT"]).format("l");

                this.contractData.END_DT = moment(response["QTR_END"]).format("l");
                const enDate = new Date(this.contractData.END_DT);
                const stDate = new Date(this.contractData.START_DT);
                this.END_DT = enDate;
                this.START_QTR = response["QTR_NBR"];
                this.START_YR = response["YR_NBR"];
                this.END_QTR = response["QTR_NBR"];
                this.END_YR = response["YR_NBR"];
                this.START_DT = stDate;
            });
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

    pastDateConfirm = function (newDate, oldDate) {
        const today = moment().format("l");
        if (moment(newDate).isBefore(today)) {
            this.isBackdatepopupopend = true;
        } else {
            this.isBackdatepopupopend = false;
        }
    };

    pastDateFieldsenable = function () {
        this.isBackdatepopupopend = false;
        this.isBackDate = true;
    };

    applyTodayDate = function () {
        const today = moment().format("l");
        this.START_DT = new Date(
            moment(this.contractData.START_DT).isBefore(today)
                ? today
                : this.contractData.START_DT
        );
        this.isBackdatepopupopend = false;
    };

    setSaveBtnName() {
        if (this.isCopyContract) {
            this.saveBtnName = "Copy Contract";
        } else {
            this.saveBtnName = this.c_Id > 0 ? "Save Contract" : "Create Contract";
        }
    }

    copyContract() {
        // Contract Data
        const ct = this.contractData;
        // check for NEW contract
        if (ct.DC_ID <= 0) ct.DC_ID = this.uid--;
        this.contractDetailsSvc
            .copyContract(
                this.getCustId(),
                this.contractData.DC_ID,
                this.copyContractData.DC_ID,
                ct
            )
            .subscribe((response: any) => {
                if (response.CNTRCT && response.CNTRCT.length > 0) {
                    window.location.href =
                        "#contractmanager/" + response.CNTRCT[1]["DC_ID"];
                }
            });
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
                  })
                  .subscribe(({NO_END_DT_RSN, BACK_DATE_RSN, CONTRACT_TYPE,CUST_ACCPT}) => {
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
                                    this.contractData.TITLE = this.TITLE =
                                        this.copyContractData.TITLE + " (copy)";
                                    this.contractData.CUST_MBR_SID = this.Customer = Number(
                                        this.copyContractData.CUST_MBR_SID
                                    );
                                    this.contractData.START_DT = this.START_DT = new Date(
                                        moment(this.copyContractData.START_DT).format("l")
                                    );
                                    this.contractData.START_QTR = this.START_QTR =
                                        this.copyContractData.START_QTR;
                                    this.contractData.START_YR = this.START_YR =
                                        this.copyContractData.START_YR;
                                    this.contractData.END_DT = this.END_DT = new Date(
                                        moment(this.copyContractData.END_DT).format("l")
                                    );
                                    this.contractData.END_QTR = this.END_QTR =
                                        this.copyContractData.END_QTR;
                                    this.contractData.END_YR = this.END_YR =
                                        this.copyContractData.END_YR;
                                    this.contractData.CUST_ACCNT_DIV =
                                        this.copyContractData.CUST_ACCNT_DIV;
                                    this.contractData.IS_TENDER = this.copyContractData.IS_TENDER;
                                    this.contractData.CUST_ACCNT_DIV_UI = !this.contractData[
                                        "CUST_ACCNT_DIV"
                                    ]
                                        ? ""
                                        : this.contractData["CUST_ACCNT_DIV"].split("/");
                                    this.updateCorpDivision(this.copyContractData.CUST_MBR_SID);
                                    // Check for Backdate Reason
                                    this.pastDateConfirm(
                                        this.contractData.START_DT,
                                        this.contractData.START_DT
                                    );
                                });
                        });
                    } else {
                        this.c_Id = Number(url[url.length - 1]);
                    }
        
                    if (this.isCopyContract == false) {
                        //conditions for new contract
                        if (this.c_Id <= 0) {
                            this.templatesSvc
                                .readTemplates()
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
                                });
                        }
                    }
                    this.setSaveBtnName();

                  }, function (response) {
                    this.loggerSvc.error("Unable to getVendorDropDown.", response, response.statusText);
                });

            }, function (response) {
                this.loggerSvc.error("Unable to get Customers.", response, response.statusText);
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

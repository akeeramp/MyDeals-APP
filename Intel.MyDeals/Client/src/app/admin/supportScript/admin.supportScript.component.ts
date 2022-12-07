import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { adminsupportScriptService } from "./admin.supportScript.service"
import * as _moment from "moment";
import { downgradeComponent } from "@angular/upgrade/static";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
const moment = _moment;


@Component({
    selector: "admin-support-script",
    templateUrl: "Client/src/app/admin/supportScript/admin.supportScript.component.html"
})

export class adminsupportScriptComponent {
    constructor(private loggersvc: logger, private adminsupportscriptsvc: adminsupportScriptService,private formBuilder: FormBuilder) {
        //since both kendo makes issue in angular and angularjs dynamically removing angularjs
        $('link[rel=stylesheet][href="/content/kendo/2017.r1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
        this.intializesupportScriptDataForm();
    }
     
    public titleErrorMsg: string;
    public errorNotes: string; 
    
    supportScriptDataForm = new FormGroup(
        {
            START_QTR: new FormControl(),
            START_YR: new FormControl(),
            END_QTR: new FormControl(),
            END_YR: new FormControl(),
            NOTES: new FormControl(),
            isFillNullSelected: new FormControl(),
            MinYear: new FormControl(),
            MaxYear: new FormControl(),
        }
    );
     

    intializesupportScriptDataForm() {
        this.supportScriptDataForm = this.formBuilder.group({
            START_QTR: moment().quarter(),
            START_YR: parseInt(moment().format("YYYY")) - 1,
            END_QTR: moment().quarter(),
            END_YR: parseInt(moment().format("YYYY")) + 3,
            NOTES: '',
            isFillNullSelected: false,
            MinYear : parseInt(moment().format("YYYY")) - 6,
            MaxYear : parseInt(moment().format("YYYY")) + 20,
        });
    }

    startYearChange() {
        if (this.supportScriptDataForm.get("START_YR").value > this.supportScriptDataForm.get("MaxYear").value) {
            this.supportScriptDataForm.get("START_YR").setValue(this.supportScriptDataForm.get("MaxYear").value);
        }
    }

    endYearChange() {
        if (this.supportScriptDataForm.get("END_YR").value > this.supportScriptDataForm.get("MaxYear").value) {
            this.supportScriptDataForm.get("END_YR").setValue(this.supportScriptDataForm.get("MaxYear").value);
        }
    }

    validate() {
        if (this.supportScriptDataForm.get("START_YR").value > this.supportScriptDataForm.get("END_YR").value) {
             this.titleErrorMsg = "Start year Quarter cannot be greater than end year quarter";
            this.supportScriptDataForm.controls["START_YR"].valid;
            return false;
        } else if (this.supportScriptDataForm.get("START_YR").value == this.supportScriptDataForm.get("END_YR").value) {
            if (this.supportScriptDataForm.get("START_QTR").value > this.supportScriptDataForm.get("END_QTR").value) {
                this.titleErrorMsg = "Start year Quarter cannot be greater than end year quarter";
                return false;
            }
            else
                this.titleErrorMsg = "";
        }
         if (this.supportScriptDataForm.get("NOTES").value == "" || this.supportScriptDataForm.get("NOTES").value != "") {
            const reg = new RegExp(/^[0-9,]+$/);
            let productIds = this.supportScriptDataForm.get("NOTES").value.replace(/,+/g, ',').trim(' ');
            let isValidProdIds = reg.test(productIds);
            if (!isValidProdIds) {
                this.errorNotes = "Please enter comma (,) separated L4 product ids only";
                return false;
            } else
                this.errorNotes = "";

        }
        else {
            this.titleErrorMsg = "";
            this.errorNotes = "";
        }
        return true;
    }

    executeCostFiller() {
        if (this.validate()) {
            let startYearQuarter = this.supportScriptDataForm.get("START_YR").value + "0" + this.supportScriptDataForm.get("START_QTR").value;
            let endYearQuarter = this.supportScriptDataForm.get("END_YR").value + "0" + this.supportScriptDataForm.get("END_QTR").value;
            this.adminsupportscriptsvc.ExecuteCostGapFiller(startYearQuarter, endYearQuarter,
                this.supportScriptDataForm.get("isFillNullSelected").value,
                this.supportScriptDataForm.get("NOTES").value).subscribe((response: any) => {
                     this.loggersvc.success("Cost Gap Filler executed succesfully");
        }), err => {
            this.loggersvc.error("Unable to delete contract", "Error", err);
        };
        }
    }

    executePostTest() {
        const jsonDataPacket = "{\"header\": {\"source_system\": \"pricing_tenders\",\"target_system\": \"mydeals\",\"action\": \"create\",\"xid\": \"152547827hdhdh\"},\"recordDetails\": {\"SBQQ__Quote__c\": {\"Id\": \"50130000000X14c\",\"Name\": \"Q-02446\",\"Pricing_Folio_ID_Nm__c\": \"\",\"SBQQ__Account__c\": {\"Id\": \"50130000000X14c\",\"Name\": \"Dell\",\"Core_CIM_ID__c\": \"\"},\"Pricing_Deal_Type_Nm__c\": \"ECAP\",\"Pricing_Customer_Nm__c\": \"Facebook\",\"Pricing_Project_Name_Nm__c\": \"FMH\",\"Pricing_ShipmentStDate_Dt__c\": \"02/28/2019\",\"Pricing_ShipmentEndDate_Dt__c\": \"02/28/2019\",\"Pricing_Server_Deal_Type_Nm__c\": \"HPC\",\"Pricing_Region_Nm__c\": \"EMEA\",\"SBQQ__QuoteLine__c\": [{\"Id\": \"001i000001AWbWu\",\"Name\": \"QL-0200061\",\"Pricing_Deal_RFQ_Status_Nm__c\": \"\",\"Pricing_ECAP_Price__c\": \"100\",\"Pricing_Meet_Comp_Price_Amt__c\": \"90\",\"Pricing_Unit_Qty__c\": \"300\",\"Pricing_Deal_RFQ_Id__c\": \"543212\",\"Pricing_Status_Nm__c\": \"\",\"SBQQ__Product__c\": {\"Id\": \"001i000001AWbWu\",\"Name\": \"Intel® Xeon® Processor E7-8870 v4\",\"Core_Product_Name_EPM_ID__c\": \"192283\"},\"Pricing_Competetor_Product__c\": {\"Id\": \"\",\"Name\": \"\"},\"Pricing_Performance_Metric__c\": [{\"Id\": \"001i000001AWbWu\",\"Name\": \"PM-000010\",\"Pricing_Performance_Metric_Nm__c\": \"SpecInt\",\"Pricing_Intel_SKU_Performance_Nbr__c\": \"10\",\"Pricing_Comp_SKU_Performance_Nbr__c\": \"9\",\"Pricing_Weighting_Pct__c\": \"100\"}]}],\"Pricing_Comments__c\": [{\"Id\": \"\",\"Name\": \"\",\"Pricing_Question__c\": \"\",\"Pricing_Answer__c\": \"\"}]}}}";
        this.adminsupportscriptsvc.ExecutePostTest(jsonDataPacket).subscribe((response: any) => {
            this.loggersvc.success("Post Test executed succesfully");
        }), err => {
            this.loggersvc.error("Unable to delete contract", "Error", err);
            
        };
    }


    ngOnInit() {
 
    }
     

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "adminSupportScript",
    downgradeComponent({
        component: adminsupportScriptComponent,
    })
);
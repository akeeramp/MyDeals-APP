import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { DealMassUpdateService } from "./admin.dealMassUpdate.service";  
import { Observable } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AttributeFeildvalues, DealMassUpdateData, DealMassUpdateResults } from "./admin.dealMassUpdate.model";
import { DynamicObj } from "../employee/admin.employee.model";
enum ATRB_MSTR{
    GEO_COMBINED = 3620,
    CUST_ACCNT_DIV = 3591
}
@Component({
    selector: "deal-mass-update",
    templateUrl: "Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.html",
    styleUrls: ['Client/src/app/admin/dealMassUpdate/admin.dealMassUpdate.component.css'],
})
export class DealMassUpdateComponent implements PendingChangesGuard, OnDestroy {

    constructor(private dealMassUpdateService: DealMassUpdateService,
        private loggerService: logger) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    private color: ThemePalette = "primary";
    private attr: Array<AttributeFeildvalues> = [];
    private attrValues: Array<AttributeFeildvalues> = [];
    private gridResult: GridDataResult;
    private updateResponse: Array<DealMassUpdateResults>;
    private massUpdateData: DynamicObj = {};
    private resultCount: DynamicObj = {};
    private isError: DynamicObj = {};
    private errorMsg: DynamicObj = {};
    private showNumeric = false;
    private showTextBox = false;
    private showDropDown = false;
    private showMultiSelect = false;
    private showResults = false;
    private isDataValid = true;
    private MaxNumericValue: number;
    private readonly NumericAtrbIds = [3352, 3355, 3461, 3708];
    private readonly TextBoxAtrbIds = [3349, 3350, 3351, 3453, 3464, 3568];
    private readonly NumericIdTo1 = [3352, 3355, 3708];
    private readonly NumericIdTo24 = [3461];
    private readonly SingleValueDropdownAtrbIds = [57, 3009, 3717, 3719, 3465,ATRB_MSTR.GEO_COMBINED];

    public state: State = {
        skip: 0,
        group: []
    };
    public Customers:Array<any> =[];
    public CustomersFilterData:Array<any> = [];           
    public Customer_Divs: Array<any> = [];
    public GeoData:Array<any> = [];    
    public isVistextStgHidden: boolean = false;
    public isCustomerDropdownHidden: boolean = true;

    loadAttributes(): void {
        //Setting ngModel values to null initially
        this.massUpdateData.sendVistexFlag = false;
        this.massUpdateData.DealIds = null;
        this.massUpdateData.field = null;
        this.massUpdateData.textValue = null;

        this.dealMassUpdateService.GetUpdateAttributes(0).pipe(takeUntil(this.destroy$)).subscribe((result: Array<AttributeFeildvalues>) => {
            this.attr = result
        }, (error) => {
            this.loggerService.error('Unable to get Attribute List', '', 'DealMassUpdateComponent::GetUpdateAttributes::' + JSON.stringify(error));
        });
    }

    attributeChange(value: AttributeFeildvalues): void {
        this.isDirty = true;
        //Resetting error messages
        this.isError = {};
        this.errorMsg = {};
        this.isDataValid = true;
        this.isVistextStgHidden = false;
        this.isCustomerDropdownHidden = true;

        //Resetting ngModel values
        this.massUpdateData.textValue = null;
        this.massUpdateData.numericValue = null;
        this.massUpdateData.multiSelectValue = null;
        this.massUpdateData.dropdownValue = null;
        this.massUpdateData.CUST_SID = null;

        if (this.NumericAtrbIds.includes(value.ATRB_SID)) {
            this.showTextBox = this.showMultiSelect = this.showDropDown = false;
            this.showNumeric = true;

            if (this.NumericIdTo1.includes(value.ATRB_SID)) {
                this.MaxNumericValue = 1;
            } else if (this.NumericIdTo24.includes(value.ATRB_SID)) {
                this.MaxNumericValue = 24;
            } else {
                this.MaxNumericValue = 999999999;
            }
        } 
        else if(value.ATRB_SID == ATRB_MSTR.GEO_COMBINED)
        {
            this.getGeos();
            this.showNumeric = this.showDropDown = this.showTextBox = false;
            this.showMultiSelect = true; 
        }
        else if(value.ATRB_SID == ATRB_MSTR.CUST_ACCNT_DIV)
        {
            this.Customers = [];
            this.CustomersFilterData = [];
            this.showNumeric = this.showMultiSelect = this.showTextBox = this.showDropDown = false;
            this.isVistextStgHidden = true;
            this.dealMassUpdateService.getMyCustomerNames().pipe(takeUntil(this.destroy$)).subscribe((response:Array<any>) => {
                response.forEach((cust:any)=>{
                    var customer = {
                        CUST_NM : cust.CUST_NM,CUST_SID : cust.CUST_SID
                    }
                    this.CustomersFilterData.push(customer);
                });
                this.Customers = this.CustomersFilterData;                
                this.isCustomerDropdownHidden = false;                               
            },
            (error) => {
                this.loggerService.error("Unable to fetch Customer data","Error",error);
            });
        }
        else {
            this.dealMassUpdateService.GetUpdateAttributes(value.ATRB_SID)
                .pipe(takeUntil(this.destroy$))
                .subscribe((result: Array<AttributeFeildvalues>) => {
                    this.attrValues = result;
                }, (error) => {
                    this.loggerService.error('Unable to get Attribute List', '', 'DealMassUpdateComponent::attributeChange::' + JSON.stringify(error));
                });                
            if (this.TextBoxAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showDropDown = false;
                this.showTextBox = true;
            } else if (this.SingleValueDropdownAtrbIds.includes(value.ATRB_SID)) {
                this.showNumeric = this.showMultiSelect = this.showTextBox = false;                
                this.showDropDown = true;                
            } else {
                this.showNumeric = this.showDropDown = this.showTextBox = false;
                this.showMultiSelect = true;
            }
        }
    }

    updateValues(): void {
        //Resetting error messages
        this.isError = {};
        this.errorMsg = {};
        this.validateData();

        if (this.isDataValid) {
            const finalData: DealMassUpdateData = {
                "DEAL_IDS": this.massUpdateData.DealIds,
                "ATRB_SID": this.massUpdateData.field.ATRB_SID,
                "SEND_VSTX_FLG": this.massUpdateData.sendVistexFlag,
                "UPD_VAL": ""
            }
            if(this.showMultiSelect && !this.isCustomerDropdownHidden)
            {
                if(this.massUpdateData.multiSelectValue != null || this.massUpdateData.multiSelectValue)
                finalData["UPD_VAL"] = (this.massUpdateData.multiSelectValue).join("/");
                if(finalData["UPD_VAL"] == "") finalData["UPD_VAL"] = null;
                var custData = this.Customers.filter((cust) => cust.CUST_SID == this.massUpdateData.CUST_SID);                
                finalData["CUST_NM"] = custData[0]?.["CUST_NM"];
            }
            if (this.showMultiSelect && this.isCustomerDropdownHidden) {
                finalData["UPD_VAL"] = (this.massUpdateData.multiSelectValue).join(",")
            } else if (this.showDropDown) {
                finalData["UPD_VAL"] = this.massUpdateData.dropdownValue
            } else if (this.showNumeric) {
                finalData["UPD_VAL"] = this.massUpdateData.numericValue
            } else if (this.showTextBox) {
                finalData["UPD_VAL"] = this.massUpdateData.textValue
            }

            this.dealMassUpdateService.UpdateDealsAttrbValue(finalData).pipe(takeUntil(this.destroy$)).subscribe((result: Array<DealMassUpdateResults>) => {
                this.isDirty = false;
                this.updateResponse = result;
                this.gridResult = process(result, this.state);
                this.resultCount['all'] = result.length;
                this.resultCount['success'] = result.filter(i => i.ERR_FLAG == 0).length;
                this.resultCount['error'] = result.filter(i => i.ERR_FLAG == 1).length;

                this.showResults = true;

                this.loggerService.success("Please Check The Results.");
            }, (error) => {
                this.loggerService.error('Unable to Update deal(s)', '', 'DealMassUpdateComponent::updateValues::' + JSON.stringify(error));
            });
        } else {
            this.loggerService.warn('Please fix validation errors', 'Warning');
        }
    }

    validateData(): void {
        this.isDataValid = true;

        // Validate Deals IDs
        if (this.massUpdateData.DealIds != undefined) {
            this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/\s/g, "");
            if (this.massUpdateData.DealIds.slice(-1) == ',') {
                this.massUpdateData.DealIds = this.massUpdateData.DealIds.replace(/,+$/g, "");
            }
        }
        const REGEX_RULE_DEAL_ID = /^[0-9,]+$/;
        if (this.massUpdateData.DealIds == undefined || this.massUpdateData.DealIds == '' || !REGEX_RULE_DEAL_ID.test(this.massUpdateData.DealIds)) {
            this.isError["Deal_Ids"] = true;
            this.errorMsg["Deal_Ids"] = "Please enter valid Deal Ids";
            this.isDataValid = false;
        }

        // Validate "Field to Update"/Attribute list dropdown 
        if (!this.massUpdateData.field) {
            this.isError["field"] = true;
            this.errorMsg["field"] = "Please Select Valid Attribute";
            this.isDataValid = false;
        }

        // Validate dropdown Value
        if (this.showDropDown && !this.massUpdateData.dropdownValue) {
            this.isError["dropdownValue"] = true;
            this.errorMsg["dropdownValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        //validate customer value
        if(!this.isCustomerDropdownHidden && !this.massUpdateData['CUST_SID'])
        {
            this.isError["CUST_SID"] = true;
            this.errorMsg["CUST_SID"] = "Please Select Valid Customer";
            this.isDataValid = false;
        }

        // Validate multiselect Value
        if (this.showMultiSelect && !this.massUpdateData.multiSelectValue && this.isCustomerDropdownHidden) {
            this.isError["multiSelectValue"] = true;
            this.errorMsg["multiSelectValue"] = "Please Select Valid Values";
            this.isDataValid = false;
        }

        if (this.massUpdateData.textValue != undefined && this.massUpdateData.textValue != null && this.massUpdateData.textValue != "") {
            if (this.massUpdateData.field.ATRB_LBL == "System Price Point") {
                const value = this.massUpdateData.textValue;
                if (value && !(parseFloat(value) > 1000000.00)) {
                    if (parseFloat(value) <= 0.00) {
                        this.massUpdateData.textValue = 0.01;
                    }
                } else {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Valid Range: <=$0.01 - <=$1,000,000";
                    this.isDataValid = false;
                }
            }
    
            if (this.massUpdateData.field.ATRB_LBL == "Unified Customer ID") {
                const REGEX_RULE_UP_TO_TEN_DIGITS = /^[0-9]{10}$/;   // 10 digit number
                if (!REGEX_RULE_UP_TO_TEN_DIGITS.test(this.massUpdateData.textValue)) {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Customer IDs are a 10 digit value";
                    this.isDataValid = false;
                }
            }

            if (this.massUpdateData.field.ATRB_LBL == "Unified Customer Name") {
                const REGEX_RULE_ALPHANUMERIC = /^[a-zA-Z0-9\s]*$/;  // Alphanumeric only
                if (!REGEX_RULE_ALPHANUMERIC.test(this.massUpdateData.textValue)) {
                    this.isError["textValue"] = true;
                    this.errorMsg["textValue"] = "Please Enter Valid Value. Alphanumeric values only, no special characters";
                    this.isDataValid = false;
                }
            }
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridResult = process(this.updateResponse, this.state);
    }

    textchange(): void {
        this.isDirty=true;
    }

    customerFilter(value){
        this.Customers = this.CustomersFilterData.filter(s => s.CUST_NM.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }       
    onCustomerChange(CUST_SID: any) {
        if (CUST_SID != undefined) {            
            this.updateCorpDivision(CUST_SID);
            this.showMultiSelect = true;
        }
    }
    //Get Customer Divisions
    updateCorpDivision(custID) {
        if (custID === "" || custID == null) return;
        this.attrValues = [];
        this.massUpdateData.multiSelectValue = null;        
        this.dealMassUpdateService.getMyCustomerDivsByCustNmSid(custID).pipe(takeUntil(this.destroy$)).subscribe(
            (response: Array<any>) => {
                this.Customer_Divs = response.filter(x => x.CUST_LVL_SID == 2003);
                if(this.Customer_Divs != null && this.Customer_Divs.length > 0)                    
                       this.Customer_Divs.forEach((div : any) =>{
                            var Division_Dropdown ={
                                ATRB_SID:ATRB_MSTR.CUST_ACCNT_DIV,
                                ATRB_LBL:null,
                                ATRB_VAL_TXT : div['CUST_DIV_NM'].toString()                        
                            }
                            this.attrValues.push(Division_Dropdown);
                        });
            },
            error => {
                this.loggerService.error("Unable to get Customer Divisions.", error);
            }
        );
    }
    getGeos() {
        this.attrValues = [];
        this.isVistextStgHidden = true;
        this.dealMassUpdateService.getGeoDropdown()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                if(response != null && response.length > 0)
                this.GeoData = response;
                   this.GeoData.forEach((geo : any) =>{
                        var geoDropdown ={
                            ATRB_SID:ATRB_MSTR.GEO_COMBINED,
                            ATRB_LBL:null,
                            ATRB_VAL_TXT : geo['dropdownName'].toString()                        
                        }
                        this.attrValues.push(geoDropdown);
                    });
                      
            }, function (response) {
                this.loggerSvc.error("Unable to get Geo.", response, response.statusText);
            });                                                      
    } 

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadAttributes();        
    }
    ngOnDestroy():void {
        this.destroy$.next();
        this.destroy$.complete();
    }     
}
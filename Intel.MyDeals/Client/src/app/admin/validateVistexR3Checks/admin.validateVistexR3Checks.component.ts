import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { logger } from "../../shared/logger/logger";
import { ValidateVistexR3ChecksService } from './admin.validateVistexR3Checks.service';
import { any, pluck } from 'underscore';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";

@Component({
    selector: "validate-vistex-checks",
    templateUrl: "Client/src/app/admin/validateVistexR3Checks/admin.validateVistexR3Checks.component.html",
    styleUrls: ['Client/src/app/admin/validateVistexR3Checks/admin.validateVistexR3Checks.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ValidateVistexR3ChecksComponent implements OnInit {

    constructor(public vldtVstxR3ChkSvc: ValidateVistexR3ChecksService, private loggerSvc: logger) {
       this.allData = this.allData.bind(this);
    }

    private accessAllowed = true;
    private isLoading = true;
    private Results = [];
    private GoodToSendResults = [];
    public GoodToSendDealIds = "";

    private UpdCnt = { 'sent': 0, 'returned': 0 };
    private ShowResults = false;
    private VstxCustFlag = 1;
    private ShowColumns = [];

    private DealstoSend = "";
    private RegxDealIds = "[0-9,]+$";
    private ActiveCustomers;
    private isDealIdError = false;
    public gridData: GridDataResult;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    };

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
        },
    ];

    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.Results.length;
        const result: ExcelExportData = {
            data: process(this.Results, excelState).data,
        };
        return result; 
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.Results, fieldName).map(item => item[fieldName]);
    }

    clearFilters() {
        // Need to be done
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.Results, this.state);
    }

    loadValidateVistexPage() {
        this.vldtVstxR3ChkSvc.getActiveCustomers()
            .subscribe((response: Array<any>) => {
                this.ActiveCustomers = response;
            });
        console.log("Active Customers loaded!");
    }

    ngOnInit(): void {
        if (!((<any>window).isDeveloper)) {
            // Prevent invalid user access
            this.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
            return;
        }
        else {
            this.loadValidateVistexPage();
        }
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadValidateVistexPage();
    }

    ValidateDealIDs() {
        const reg = new RegExp(/^[0-9,]+$/);
        if (this.DealstoSend == "" || this.DealstoSend == undefined) {
            return false;
        } else if (!reg.test(this.DealstoSend)) {
            return false;
        }
        return true;
    }

    ValidateForVistexR3() {
        let sentDeals = 0;
        //removing extra spaces and commas from deal Ids(DealstoSend) string
        if (this.DealstoSend != undefined) {
            this.DealstoSend = this.DealstoSend.replace(/ |\n|\r/g, "");
             if (this.DealstoSend.slice(-1) == ',') {
                this.DealstoSend = this.DealstoSend.replace(/,+$/g, "");
            }
            //Finding total Deal Ids present in DealstoSend string
            //sentDeals = this.DealstoSend.split(',').length;
        }

        // Check that all fields have data before sending
        this.isDealIdError = !this.ValidateDealIDs();

        // All fields are populated, send the request
        if (!this.isDealIdError) {
            const data = {
                "DEAL_IDS": this.DealstoSend
             };
            this.vldtVstxR3ChkSvc.getVistexCustomersMapList(data).subscribe(response => {
                this.Results = response.R3CutoverResponses;
                sentDeals = this.Results.length;
                this.GoodToSendResults = response.R3CutoverResponsePassedDeals;
                let goodToSendDealIds = pluck(this.GoodToSendResults, 'Deal_Id');
                this.GoodToSendDealIds = goodToSendDealIds.toString();

                this.UpdCnt.sent = sentDeals;
                this.UpdCnt.returned = (this.UpdCnt.sent - goodToSendDealIds.length);;
                this.gridData = process(this.Results, this.state);
                this.ShowResults = true;
  
                this.GetActiveColumns();
                this.loggerSvc.success("Please Check The Results.");
            }, (error) => {
                this.loggerSvc.error('Unable to Send deal(s) to Vistex', '', 'validateVistexR3ChecksComponent::getVistexCustomersMapList::' + JSON.stringify(error));
            });
        } else {
            this.ShowResults = false;
            this.loggerSvc.warn("Please fix validation errors", "Warning");
        }
    }

    SendDealsToVistex() {
        window.open("#pushDealstoVistex?r3ValidDeals=" + this.GoodToSendDealIds, "_blank");
    }

    GetActiveColumns() {
        this.ShowColumns = ["Deal_Id"];
        this.ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Customer_Division", "Vertical", "Deal_Stage", "Pricing_Strategy_Stage", "Expire_Deal_Flag", "Deal_Start_Date", "Deal_End_Date", "Payout_Based_On", "Program_Payment", "Additive_Standalone", "End_Customer_Retailer", "Request_Date", "Requested_by", "Request_Quarter", "Division_Approved_Date", "Division_Approver", "Geo_Approver", "Market_Segment", "Deal_Description", "Ceiling_Limit_End_Volume_for_VT", "Limit", "Consumption_Reason", "Consumption_Reason_Comment", "Period_Profile", "AR_Settlement_Level", "Look_Back_Period_Months", "Consumption_Customer_Platform", "Consumption_Customer_Segment", "Consumption_Customer_Reported_Geo", "End_Customer", "End_Customer_Country", "Unified_Customer_ID", "Is_a_Unified_Cust", "Project_Name", "System_Price_Point", "System_Configuration", "Settlement_Partner", "Reset_Per_Period", "Send_To_Vistex", "COMMENTS"];
    }

    //To send data to DSA Outbound table 
    toggleType(currentState) {
        this.VstxCustFlag = currentState;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.Results, this.state);
    }

    private gridColumns = [
        {
            field: "Deal_Id",
            title: "Deal #",
            width: "120px",
            filterable: { multi: true, search: true }
        },
        {
            field: "COMMENTS",
            width: "500px",
            title: "Errors",
            template: "<span ng-model='dataItem' style='color:red;'>#= COMMENTS #</span>",
            headerTemplate: "<span style='color:red;'>Errors</span>"
        },
        {
            field: "Customer_Name",
            title: "Customer Name",
            width: "185px",
            filterable: { multi: true, search: true }
        },
        {
            field: "Geo",
            title: "Geo",
            width: "105px",
            filterable: { multi: true, search: true }
        },
        { field: "Deal_Type", title: "Deal Type", width: "120px", filterable: { multi: true, search: true } },
        { field: "Rebate_Type", title: "Rebate Type", width: "120px", filterable: { multi: true, search: true } },
        { field: "Customer_Division", title: "Customer Division", width: "160px", filterable: { multi: true, search: true } },
        { field: "Vertical", title: "Vertical", width: "100px", filterable: { multi: true, search: true } },
        { field: "Deal_Stage", title: "Deal Stage", width: "130px", filterable: { multi: true, search: true } },
        { field: "Pricing_Strategy_Stage", title: "PS Stage", width: "120px", filterable: { multi: true, search: true } },
        { field: "Expire_Deal_Flag", title: "Expire Deal Flag", width: "150px", filterable: { multi: true, search: true } },
        { field: "Deal_Start_Date", title: "Deal Start Date", width: "150px", filterable: { multi: true, search: true } },
        { field: "Deal_End_Date", title: "Deal End Date", width: "150px", filterable: { multi: true, search: true } },
        { field: "Payout_Based_On", title: "Payout Based On", width: "160px", filterable: { multi: true, search: true } },
        { field: "Program_Payment", title: "Program Payment", width: "150px", filterable: { multi: true, search: true } },
        { field: "Additive_Standalone", title: "Group Type", width: "100px", filterable: { multi: true, search: true } },
        { field: "Request_Date", title: "Request Date", width: "130px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Requested_by", title: "Requested by", width: "130px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Request_Quarter", title: "Request Quarter", width: "130px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Division_Approved_Date", title: "Division Approved Date", width: "170px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Division_Approver", title: "Division Approver", width: "150px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Geo_Approver", title: "Geo Approver", width: "150px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Market_Segment", title: "Market Segment", width: "150px", filterable: { multi: true, search: true } },
        { field: "Deal_Description", title: "Deal Description", width: "150px", filterable: { multi: true, search: true }, hidden: true },
        { field: "Ceiling_Limit_End_Volume_for_VT", title: "Ceiling Limit/End Volume (for VT)", width: "200px", filterable: { multi: true, search: true } },
        { field: "Limit", title: "$ Limit", width: "100px", filterable: { multi: true, search: true } },
        { field: "Consumption_Reason", title: "Consumption Reason", width: "150px", filterable: { multi: true, search: true } },
        { field: "Consumption_Reason_Comment", title: "Consumption Reason Comment", width: "170px", filterable: { multi: true, search: true } },
        { field: "Period_Profile", title: "Period Profile", width: "150px", filterable: { multi: true, search: true } },
        { field: "AR_Settlement_Level", title: "AR Settlement Level", width: "160px", filterable: { multi: true, search: true } },
        { field: "Look_Back_Period_Months", title: "Look Back Period (Months)", width: "190px", filterable: { multi: true, search: true } },
        { field: "Consumption_Customer_Platform", title: "Consumption Customer Platform", width: "200px", filterable: { multi: true, search: true } },
        { field: "Consumption_Customer_Segment", title: "Consumption Customer Segment", width: "200px", filterable: { multi: true, search: true } },
        { field: "Consumption_Customer_Reported_Geo", title: "Consumption Customer Reported Geo", width: "220px", filterable: { multi: true, search: true } },
        { field: "End_Customer_Retailer", title: "End Customer/Retailer", width: "160px", filterable: { multi: true, search: true } },
        { field: "End_Customer", title: "End Customer", width: "150px", filterable: { multi: true, search: true } },
        { field: "End_Customer_Country", title: "End Customer Country", width: "180px", filterable: { multi: true, search: true } },
        { field: "Unified_Customer_ID", title: "Unified Customer ID", width: "170px", filterable: { multi: true, search: true } },
        { field: "Is_a_Unified_Cust", title: "Is a Unified Cust", width: "150px", filterable: { multi: true, search: true } },
        { field: "Project_Name", title: "Project Name", width: "150px", filterable: { multi: true, search: true } },
        { field: "System_Price_Point", title: "System Price Point", width: "160px", filterable: { multi: true, search: true } },
        { field: "System_Configuration", title: "System Configuration", width: "180px", filterable: { multi: true, search: true } },
        { field: "Settlement_Partner", title: "Settlement Partner", width: "170px", filterable: { multi: true, search: true } },
        { field: "Reset_Per_Period", title: "Reset Per Period", width: "150px", filterable: { multi: true, search: true } },
        { field: "Send_To_Vistex", title: "Send To Vistex", width: "150px", filterable: { multi: true, search: true } }
    ]
}
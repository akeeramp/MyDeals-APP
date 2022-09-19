import * as _ from 'underscore';
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { publishTenderService } from './publishTender.service'
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { allDealsService } from "../allDeals/allDeals.service";
import { templatesService } from "../../shared/services/templates.service";
import { PTE_Config_Util } from "../PTEUtils/PTE_Config_util";
import { DataStateChangeEvent, GridDataResult, PageSizeItem } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
    selector: "publish-tender",
    templateUrl: "Client/src/app/contract/publishTender/publishTender.component.html",
    styleUrls: ["Client/src/app/contract/publishTender/publishTender.component.css"]
})

export class publishTenderComponent {
    constructor(private pricingTableSvc: pricingTableservice, private publishtenderService: publishTenderService,
        private allDealsSvc: allDealsService, private templatesSvc: templatesService, private loggerSvc: logger) {
      
    }
    @Input() private pricingTableData:any;//using in html
    public c_Id: any = '';
    public showMCTag = false;
    public spinnerMessageHeader: string;
    public spinnerMessageDescription: string;
    public msgType: string;
    public isDataLoading: boolean = false;
    public exlusionList = [];
    public contractData: any = {};
    private wipOptions = {};
    private wipData = [];
    private gridData: GridDataResult;
    private loading: boolean = false;
    private opGridTemplate = PTE_Config_Util.opGridTemplate;
    private templates: Array<any> = [];
    private OBJ_SET_TYPE_CD:string="Tender";

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.wipData, this.state);
    }

    publishTenderDeal() {
        this.isDataLoading=true;
        this.spinnerMessageHeader="Publishing deals";
        this.spinnerMessageDescription="Converting into individual deals. Then we will redirect you to Tender Dashboard.";
        this.exlusionList=_.pluck(_.where(this.gridData.data,{isExclSel:true}),'DC_ID');
        this.publishtenderService.publishTenderDeals(this.contractData[0].DC_ID, this.exlusionList).subscribe((response) => {
            if (response) {
                this.isDataLoading=false;
                window.location.href = "/advancedSearch#/tenderDashboard";
            }
            else {
                this.isDataLoading=false;
                this.loggerSvc.error("Error", "Publishing deals failed. Contact Administrator.");
            }
        },error => {
            this.isDataLoading=false;
            this.loggerSvc.error('publishTenderDeal::publishTenderDeals:: service', error);
        })
    }

    async loadContractData() {
        this.contractData = await this.pricingTableSvc.readContract(this.c_Id).toPromise().catch(error => {
            this.loggerSvc.error('getContractDetails::readContract:: service', error);
        });
    }

    async initTender() {
        await this.loadContractData();
        await this.loadPublishGrid();
    }

    async loadPublishGrid() {
        // Generates options that kendo's html directives will use
        this.wipData = [];
        this.isDataLoading = true;
        this.spinnerMessageHeader = "Loading Deals...", "Please wait we are fetching WIP Deals...";
        this.spinnerMessageDescription = "Loading Deals";

        // Get all WIP
        if (this.contractData && this.contractData[0] && this.contractData[0].DC_ID) {
            let response = await this.allDealsSvc.readWipFromContract(this.contractData[0].DC_ID).toPromise()
                .catch(
                    error => {
                        this.loggerSvc.error("Could not get deals.", error);
                    });
            if (response) {
                this.initGrid(response.WIP_DEAL);
                this.spinnerMessageDescription = "Drawing Grid";
            }
        }
    }

    initGrid(data) {

        setTimeout(() => {
            let order = 0;
            let dealTypes = [
                { dealType: this.contractData[0].PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD, name: this.contractData[0].PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD },

            ];
            let show = [
                "EXCLUDE_AUTOMATION", "DC_ID", "MEETCOMP_TEST_RESULT", "COST_TEST_RESULT", "MISSING_CAP_COST_INFO", "PASSED_VALIDATION", "CUST_MBR_SID", "END_CUSTOMER_RETAIL", "START_DT", "END_DT", "WF_STG_CD", "OBJ_SET_TYPE_CD",
                "PTR_USER_PRD", "PRODUCT_CATEGORIES", "PROD_INCLDS", "TITLE", "SERVER_DEAL_TYPE", "DEAL_COMB_TYPE", "DEAL_DESC", "TIER_NBR", "ECAP_PRICE",
                "KIT_ECAP", "CAP", "CAP_START_DT", "CAP_END_DT", "YCS2_PRC_IRBT", "YCS2_START_DT", "YCS2_END_DT", "VOLUME", "ON_ADD_DT", "MRKT_SEG", "GEO_COMBINED",
                "TRGT_RGN", "QLTR_BID_GEO", "QLTR_PROJECT", "QUOTE_LN_ID", "PERIOD_PROFILE", "AR_SETTLEMENT_LVL", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "TERMS", "REBATE_BILLING_START", "REBATE_BILLING_END", "CONSUMPTION_REASON", "CONSUMPTION_TYPE",
                "CONSUMPTION_REASON_CMNT", "CONSUMPTION_CUST_PLATFORM", "CONSUMPTION_CUST_SEGMENT", "CONSUMPTION_CUST_RPT_GEO", "CONSUMPTION_COUNTRY_REGION", "BACK_DATE_RSN", "REBATE_DEAL_ID", "CONTRACT_TYPE", "REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT", "REBATE_TYPE", "TERMS", "TOTAL_DOLLAR_AMOUNT", "NOTES", "PRC_ST_OBJ_SID"
            ];
            let usedCols = [];
            let excludeCols = ["details", "tools", "TRKR_NBR", "DC_PARENT_ID", "tender_actions", "CNTRCT_OBJ_SID"];

            if ((<any>window).usrRole == 'FSE') {
                excludeCols.push("MEETCOMP_TEST_RESULT");
            }

            this.wipOptions = {
                "isLayoutConfigurable": false,
                "isVisibleAdditionalDiscounts": false,

            };
            this.wipOptions['showMCPCT'] = true;
            this.wipOptions['isPinEnabled'] = false;
            this.wipOptions['default'] = {};
            this.wipOptions['default'].groups = this.opGridTemplate.groups[this.contractData[0].PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD];
            this.wipOptions['default'].groupColumns = this.opGridTemplate.templates[this.contractData[0].PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD];

            this.wipOptions['columns'] = [];
            this.wipOptions['model'] = { fields: {}, id: "DC_ID" };

            let hasDeals = [];
            for (let x = 0; x < data.length; x++) {
                if (hasDeals.indexOf(data[x].OBJ_SET_TYPE_CD) < 0) hasDeals.push(data[x].OBJ_SET_TYPE_CD);
                //Checking Exclude Automation Presence
                if (!data[x].EXCLUDE_AUTOMATION) {
                    data[x]["EXCLUDE_AUTOMATION"] = false;
                }
            }

            for (let d = 0; d < dealTypes.length; d++) {
                let dealType = dealTypes[d];
                if (hasDeals.indexOf(dealType.dealType) >= 0) {
                    var wipTemplate = this.templates['ModelTemplates'].WIP_DEAL[dealType.dealType];
                    if (wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION') > 0) {
                        wipTemplate.columns.splice(wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION'), 1);
                    }

                    if ((<any>window).usrRole === "GA") {
                        wipTemplate.columns.unshift({
                            field: "EXCLUDE_AUTOMATION",
                            title: "Exclude from Price Rules",
                            width: 150,
                            template: "<div class='dealTools'><div class='fl' ><input type='checkbox' [(ngModel)]='dataItem.EXCLUDE_AUTOMATION' class= 'grid-link-checkbox with-font lnkChk_{{dataItem.DC_PARENT_ID}}' id = 'lnkChk_{{dataItem.DC_PARENT_ID}}' /> <label for='lnkChk_{{dataItem.DC_PARENT_ID}}' style='margin: 10px 0 0 10px;' title='Exclude from Price Approval Rules' (click)='addExclusionList(dataItem)'></label></div ></div>",
                            bypassExport: true,
                            hidden: false,
                            uiType: "CheckBox",
                            isDimKey: false,
                            isRequired: false,
                            sortable: false,
                            filterable: false,
                            headerTemplate: "<input type='checkbox' (click)='excludeAllItems()' class='with-font' id='chkDealTools' title='Exclude from Price Approval Rules' /><label id='lblExclAutoHeader' for='chkDealTools' style='margin-left: 20px;margin-top: -70px; ' title='Exclude from Price Approval Rules'>Exclude from Price Rules</label>",
                            mjrMnrChg: "MINOR",
                            lookupUrl: "",
                            lookupText: "",
                            lookupValue: "",
                            locked: false,
                            lockable: false
                        });
                    }

                    wipTemplate.columns.push({
                        bypassExport: false,
                        field: "NOTES",
                        filterable: true,
                        sortable: true,
                        title: "Notes",
                        width: 150,
                        template:'empty'
                    });
                    for (var c = 0; c < wipTemplate.columns.length; c++) {
                        var col = wipTemplate.columns[c];

                        col.hidden = show.indexOf(col.field) < 0;
                        col.locked = false;


                        if (excludeCols.indexOf(col.field) < 0) {
                            // add to column
                            if (usedCols.indexOf(col.field) < 0) {
                                usedCols.push(col.field);
                                this.wipOptions['columns'].push(col);
                            }
                        }
                        if (col["field"] == "CUST_MBR_SID") {
                            col.filterable = {
                                multi: true,
                                search: true,
                                itemTemplate: function (e) {
                                    if (e.field == "all") {
                                        return '<li class="k-item"><label class="k-label"><input type="checkbox" class="k-check-all" value="Select All">Select All</label></li>';
                                    } else {
                                        return '<li class="k-item"><label class="k-label"><input type="checkbox" class="" value="#=data.CUST_MBR_SID#">#=Customer.CUST_NM#</label></li>'
                                    }
                                }
                            };
                        }
                    }
                    _.each(wipTemplate['model'], (key, index) => {
                        if (excludeCols.indexOf(key) < 0) {
                            if (this.wipOptions['model'].fields[key] === undefined)
                                this.wipOptions['model'].fields[key] = this[key];
                        }
                    });
                }
            }
            this.wipData = data;
            //maping the result with exlude deal
            _.each(this.wipData,itm=>{itm['isExclSel']=false});
            this.gridData = process(this.wipData, this.state);
        }, 10);
        setTimeout(() => {
            this.spinnerMessageDescription = "Done";
            this.loading = false;
            this.isDataLoading = false;
        }, 2000);
    }

    setBusy(msg, detail, msgType) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isDataLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                return;
            }
            this.isDataLoading = newState;
            if (this.isDataLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                }, 100);
            }
        });
    }

    ngOnInit() {
        const url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
        this.OBJ_SET_TYPE_CD= this.pricingTableData.PRC_TBL_ROW[0].OBJ_SET_TYPE_CD;
        //set templates data
        this.templatesSvc.readTemplates()
            .subscribe(response => {
                this.templates = response;
            });
        this.initTender();
    }

}
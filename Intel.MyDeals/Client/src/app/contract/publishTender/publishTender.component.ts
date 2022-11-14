import * as _ from 'underscore';
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { publishTenderService } from './publishTender.service'
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { allDealsService } from "../allDeals/allDeals.service";
import { templatesService } from "../../shared/services/templates.service";
import { PTE_Config_Util } from "../PTEUtils/PTE_Config_util";
import { DataStateChangeEvent, GridDataResult, PageSizeItem, CellClickEvent } from '@progress/kendo-angular-grid';
import { distinct, process, State } from '@progress/kendo-data-query';
import { MatDialog } from '@angular/material/dialog';
import { dealProductsModalComponent } from '../ptModals/dealProductsModal/dealProductsModal.component';
import { DE_Load_Util } from '../DEUtils/DE_Load_util';
import * as moment from "moment";

@Component({
    selector: "publish-tender",
    templateUrl: "Client/src/app/contract/publishTender/publishTender.component.html",
    styleUrls: ["Client/src/app/contract/publishTender/publishTender.component.css"]
})

export class publishTenderComponent {
    constructor(private pricingTableSvc: pricingTableservice, private publishtenderService: publishTenderService,
        private allDealsSvc: allDealsService, private templatesSvc: templatesService, private loggerSvc: logger, protected dialog: MatDialog) {
      
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
                this.isDataLoading = false;
                window.location.href = "/advancedSearch#/tenderDashboard?DealType=" + this.contractData[0].PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD + "&FolioId=" + this.contractData[0].DC_ID + "&search";
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

    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "PRD_BCKT" || args.column.field == "TITLE") {
            this.openDealProductModal(args.dataItem);
        }
    }

    openDealProductModal(dataItem) {
        const dialogRef = this.dialog.open(dealProductsModalComponent, {
            width: "1000px",
            panelClass: 'Publishten-grp-deal',
            data: {
                dataItem: dataItem
            }
        });
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
            let response = await this.allDealsSvc.readWipFromContract(this.contractData[0].DC_ID).toPromise().catch(error => {this.loggerSvc.error("Could not get deals.", error);});
            if (response && response.WIP_DEAL) {
                this.initGrid(response.WIP_DEAL);
                this.spinnerMessageDescription = "Drawing Grid";
            }
            else{
                this.loggerSvc.error("Error", "Publishing deals failed. Contact Administrator.");
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
                "EXCLUDE_AUTOMATION", "DC_ID", "PASSED_VALIDATION", "MEETCOMP_TEST_RESULT", "COST_TEST_RESULT", "MISSING_CAP_COST_INFO", "CUST_MBR_SID", "START_DT", "END_DT", "WF_STG_CD", "COMP_SKU", "COMPETITIVE_PRICE",
                "LAST_REDEAL_DT", "PTR_USER_PRD", "PRODUCT_CATEGORIES", "DEAL_GRP_NM",  "PRD_BCKT", "PRIMARY_OR_SECONDARY", "KIT_ECAP", "PROD_INCLDS", "TITLE", "SERVER_DEAL_TYPE", "DEAL_COMB_TYPE", "DEAL_DESC", "ECAP_PRICE", "KIT_REBATE_BUNDLE_DISCOUNT", "BACKEND_REBATE",
                "DSCNT_PER_LN", "QTY", "TOTAL_DSCNT_PR_LN", "KIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE", "CAP_INFO", "CAP_KIT", "YCS2_INFO",
                "VOLUME", "ON_ADD_DT", "DEAL_SOLD_TO_ID", "EXPIRE_YCS2", "REBATE_TYPE", "MRKT_SEG", "CONTRACT_TYPE", "GEO_COMBINED",
                "TRGT_RGN", "END_CUSTOMER_RETAIL", "PRIMED_CUST_CNTRY", "QLTR_BID_GEO", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "PERIOD_PROFILE", "RESET_VOLS_ON_PERIOD",
                "AR_SETTLEMENT_LVL", "SETTLEMENT_PARTNER", "TERMS", "QUOTE_LN_ID", "GEO_APPROVED_BY", "DIV_APPROVED_BY"
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
                    DE_Load_Util.assignColSettings(wipTemplate, this.OBJ_SET_TYPE_CD);
                    if (wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION') > 0) {
                        wipTemplate.columns.splice(wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION'), 1);
                    }
                    if (wipTemplate.columns.findIndex(e => e.field === 'CUST_MBR_SID') > 0) {
                        wipTemplate.columns[wipTemplate.columns.findIndex(e => e.field === 'CUST_MBR_SID')].filterable = true;
                    }

                    if ((<any>window).usrRole === "GA") {
                        wipTemplate.columns.unshift({
                            field: "EXCLUDE_AUTOMATION",
                            title: "Exclude from Price Rules",
                            width: 150,
                            template: "",
                            bypassExport: true,
                            hidden: false,
                            uiType: "CheckBox",
                            isDimKey: false,
                            isRequired: false,
                            sortable: false,
                            filterable: false,
                            headerTemplate: "",
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

                        if (this.OBJ_SET_TYPE_CD == 'KIT') {
                            if (excludeCols.indexOf(col.field) < 0) {
                                // add to column
                                if (usedCols.indexOf(col.field) < 0) {
                                    usedCols.push(col.field);
                                    this.wipOptions['columns'].push(col);
                                    if (col.field == "QUOTE_LN_ID" || col.field == "GEO_APPROVED_BY" || col.field == "DIV_APPROVED_BY") {
                                        this.wipOptions['columns'].pop();
                                    }
                                }
                            }
                        }
                        else {
                            if (excludeCols.indexOf(col.field) < 0) {
                                // add to column
                                if (usedCols.indexOf(col.field) < 0) {
                                    usedCols.push(col.field);
                                    this.wipOptions['columns'].push(col);
                                }
                            }
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
    distinctPrimitive(fieldName: string): any {
        return distinct(this.wipData, fieldName).map(item => {
            if (fieldName == 'WF_STG_CD') {
                let StgVal = item.WF_STG_CD === "Draft" ? item.PS_WF_STG_CD : item.WF_STG_CD;
                return { Text: StgVal, Value: item[fieldName] };
            }
            if (fieldName == 'CUST_MBR_SID') {
                return { Text: item.Customer.CUST_NM, Value: item[fieldName] };
            }
            if (moment(item[fieldName], "MM/DD/YYYY", true).isValid()) {
                return { Text: new Date(item[fieldName]).toUTCString(), Value: item[fieldName] };
            }
            else if (item[fieldName] != undefined && item[fieldName] != null)
                return { Text: item[fieldName].toString(), Value: item[fieldName] }
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
                this.initTender();
            },err=>{
                this.loggerSvc.error("Error", "Publishing deals Loading failed. Contact Administrator.",err);
            });
       
    }

}
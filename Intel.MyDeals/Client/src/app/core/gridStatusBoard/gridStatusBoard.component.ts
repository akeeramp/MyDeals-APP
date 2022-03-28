import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Input, Component, ViewChild, OnInit, OnChanges, OnDestroy, SimpleChanges, EventEmitter, Output } from "@angular/core"
import { GridComponent, GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { GridStatusBoardService } from "./gridStatusBoard.service";
import { process, State, distinct } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { logger } from "../../shared/logger/logger";
import { DatePipe } from "@angular/common";
import { DashboardComponent } from "../../dashboard/dashboard/dashboard.component";
import { contractStatusWidgetService } from '../../dashboard/contractStatusWidget.service';

@Component({
    providers: [GridStatusBoardService, DatePipe],
    selector: "grid-status-board-angular",
    templateUrl: "Client/src/app/core/gridStatusBoard/gridStatusBoard.component.html"
})

export class gridStatusBoardComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(GridComponent) grid: GridComponent;

    @Input() private custIds: string;
    @Input() private gridFilter: string;
    @Input() private favContractIds: string;
    @Input() private startDt: string;
    @Input() private endDt: string;

    @Output() public isGridLoading: EventEmitter<boolean> = new EventEmitter();

    constructor(private contractService: GridStatusBoardService, private loggerSvc: logger, public datepipe: DatePipe, private dashboardParent: DashboardComponent, private cntrctWdgtSvc: contractStatusWidgetService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();

        this.cntrctWdgtSvc.isRefresh.subscribe(res => {
            if (res) {
                this.loadContractData();
            }
        });
    }

    private DontIncludeTenders: boolean = false;
    private isLoaded: boolean = false;
    private dataforfilter: any; //holds filters for data fetch -during API call
    private gridResult: Array<any>;

    //Variable to hold the API response data and holding filter data
    private contractDs: GridDataResult;
    private gridresultFavorite: Array<any>;
    private gridresultAlert: Array<any>;
    private gridresultAllContract: Array<any>;
    private gridresultCompletedContract: Array<any>;
    private gridresultInCompleteContract: Array<any>
    private gridresultAllTenders: Array<any>;
    private gridresultCompletedTenders: Array<any>;
    private gridresultIncompleteTenders: Array<any>;
    private gridresultCancelledTenders: Array<any>;

    //Variables to store the counts
    private contractStageCnt: number = 0;
    private tenderStageCnt: number = 0;
    private allStageCnt: number = 0;
    private favCount: number = 0;
    private alertCount: number = 0;
    private contractComplete: number = 0;
    private contractIncomplete: number = 0;
    private tenderComplete: number = 0;
    private tenderIncomplete: number = 0;
    private tenderCancelled: number = 0;

    //to store the favContractIds in Array format
    private favContractsMap: Array<any> = [];
    private activekey: string = "all";

    private activeFilter: string = "";
    private toolTipOptions: string = "";

    //verifying the role
    private jumptoSummary = (<any>window).usrRole === "DA" ? "/summary" : "";

    private isInitialLoad: boolean = true;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    public pageSizes: PageSizeItem[] = [
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

    cntrctDtlLoadStatus(value: boolean) {
        if (this.isLoaded !== value) {
            this.isLoaded = value;
        }
    }

    public ngOnInit(): void {

        if (this.gridFilter == "" || this.gridFilter == undefined) {
            this.activeFilter = "fltr_All";
            this.activekey = "all";
        }
        else { this.activeFilter = this.gridFilter; }
        this.favContractsMap = this.favContractIds == "" ? this.favContractsMap : this.favContractIds.split(',');
        //Get the contract Data
        this.loadContractData();

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            return;
        }
        //update input values and call loadContractData();
        this.loadContractData();
    }

    loadContractData() {
        this.isGridLoading.emit(true);
        let rtnContract: Array<any> = [];
        let rtnTender: Array<any> = [];
        this.dataforfilter = {
            CustomerIds: JSON.parse(this.custIds),/*[]*/
            StartDate: this.datepipe.transform(new Date(this.startDt), 'MM/dd/yyyy'),
            EndDate: this.datepipe.transform(new Date(this.endDt), 'MM/dd/yyyy'),
            DontIncludeTenders: this.DontIncludeTenders
        };

        //calling API to fetch the contracts
        this.contractService.getContracts(this.dataforfilter)
            .subscribe((response) => {
                //Initialising all counts from 0
                this.contractStageCnt = 0;
                this.tenderStageCnt = 0;
                this.allStageCnt = 0;
                this.favCount = 0;
                this.alertCount = 0;
                this.contractComplete = 0;
                this.contractIncomplete = 0;
                this.tenderComplete = 0;
                this.tenderIncomplete = 0;
                this.tenderCancelled = 0;

                //adding a column IS_Favorite for setting the contract as favourite with the value coming from dashboard via directive Input
                for (var i = 0; i < response.length; i++) {
                    {
                        response[i]["IS_FAVORITE"] = false;
                        for (var j = 0; j < this.favContractsMap.length; j++) {
                            if (response[i].CNTRCT_OBJ_SID === this.favContractsMap[j]) {
                                response[i]["IS_FAVORITE"] = true;
                                this.favCount++;
                            }
                        }
                    }
                }
                this.gridResult = response;

                //binding the response to the kendogrid
                this.contractDs = process(this.gridResult, this.state);
                this.activekey = "all";

                //Storing the filter response in variable to be used while filter
                this.gridresultAlert = this.gridResult.filter(x => x.HAS_ALERT === "true");
                this.gridresultFavorite = this.gridResult.filter(x => x.IS_FAVORITE === "true");
                this.gridresultAllContract = this.gridResult.filter(x => x.IS_TENDER === 0);
                this.gridresultAllTenders = this.gridResult.filter(x => x.IS_TENDER === 1);
                this.gridresultCompletedContract = this.gridResult.filter(x => x.IS_TENDER === 0 && x.WF_STG_CD === "Complete");
                this.gridresultCompletedTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "Complete");
                this.gridresultInCompleteContract = this.gridResult.filter(x => x.IS_TENDER === 0 && x.WF_STG_CD === "InComplete");
                this.gridresultIncompleteTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "InComplete");
                this.gridresultCancelledTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "Cancelled");

                //Setting the counts
                this.allStageCnt = response.length;
                for (var i = 0; i < response.length; i++) {
                    if (response[i].IS_TENDER == "0") {
                        if (rtnContract[response[i].WF_STG_CD] === undefined) {
                            rtnContract[response[i].WF_STG_CD] = 0;
                        }
                        rtnContract[response[i].WF_STG_CD]++;
                        this.contractStageCnt++;

                        if (response[i].WF_STG_CD == "Complete") {
                            this.contractComplete++;
                        }
                        else {
                            this.contractIncomplete++;
                        }
                    }
                    else {
                        if (rtnTender[response[i].WF_STG_CD] === undefined) {
                            rtnTender[response[i].WF_STG_CD] = 0;
                        }
                        rtnTender[response[i].WF_STG_CD]++;
                        this.tenderStageCnt++;

                        if (response[i].WF_STG_CD == "Complete") {
                            this.tenderComplete++;
                        }
                        else if (response[i].WF_STG_CD == "InComplete") {
                            this.tenderIncomplete++;
                        }
                        else {
                            this.tenderCancelled++;
                        }
                    }

                    if (response[i].HAS_ALERT && response[i].WF_STG_CD !== "Complete") {
                        this.alertCount++;
                    } else {
                        response[i].HAS_ALERT = false;
                    }

                    this.toolTipOptions = "Created By : " + response[i].CRE_EMP_NM;
                }

                this.isGridLoading.emit(false);
            },
                function (response) {
                    this.loggerSvc.error("Unable to load the Contracts", response, response.statusText);
                });
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    //Changes to fav contract id will broadcast a change to dashboardController to SaveLayout changes
    onFavChange(dataItem) {
        dataItem.IS_FAVORITE = !dataItem.IS_FAVORITE;

        if (!dataItem.IS_FAVORITE) {
            delete this.favContractsMap[dataItem.CNTRCT_OBJ_SID];
            this.favCount--;
            dataItem.IS_FAVORITE = false;
            if (this.activeFilter === "Favorites")
                this.clkFilter("fltr_Favorites");
            this.gridresultFavorite.forEach((value, index) => {
                if (value.CNTRCT_OBJ_SID == dataItem.CNTRCT_OBJ_SID)
                    this.gridresultFavorite.splice(index, 1);
            });
            this.contractDs = process(this.gridresultFavorite, this.state);
        } else {
            this.favContractsMap.push(dataItem.CNTRCT_OBJ_SID);
            dataItem.IS_FAVORITE = true;
            this.favCount++;
            this.gridresultFavorite.push(dataItem);
        }
        this.favContractIds = this.favContractsMap.toString();
        let mySubConfig = {
            favContractIds: this.favContractIds
        }
        this.dashboardParent.saveWidgetConfig('contractStatusBoard', mySubConfig);

    }

    dataStateChange(state: DataStateChangeEvent): void {

        this.state = state;
        if (this.activekey == "fav") {
            this.contractDs = process(this.gridresultFavorite, this.state);
        }
        else if (this.activekey == "alert") {
            this.contractDs = process(this.gridresultAlert, this.state);
        }
        else if (this.activekey == "allC") {
            this.contractDs = process(this.gridresultAllContract, this.state);
        }
        else if (this.activekey == "CC") {
            this.contractDs = process(this.gridresultCompletedContract, this.state);
        }
        else if (this.activekey == "ICC") {
            this.contractDs = process(this.gridresultInCompleteContract, this.state);
        }
        else if (this.activekey == "allT") {
            this.contractDs = process(this.gridresultAllTenders, this.state);
        }
        else if (this.activekey == "CT") {
            this.contractDs = process(this.gridresultCompletedTenders, this.state);
        }
        else if (this.activekey = "ICT") {
            this.contractDs = process(this.gridresultIncompleteTenders, this.state);
        }
        else if (this.activekey == "CA") {
            this.contractDs = process(this.gridresultCancelledTenders, this.state);
        }
        else {
            this.contractDs = process(this.gridResult, this.state);
        }
    }

    clkFilter(filter) {

        if (filter === undefined || filter === "")
            filter = "fltr_All";

        this.state.skip = 0;
        switch (filter) {
            case "fltr_All":
                this.activekey = "all";
                this.contractDs = process(this.gridResult, this.state);
                break;
            case "fltr_Favorites":
                this.activekey = "fav";
                this.contractDs = process(this.gridresultFavorite, this.state);
                break;
            case "fltr_HasAlert":
                this.activekey = "alert";
                this.contractDs = process(this.gridresultAlert, this.state);
                break;
            case "fltr_All_Contract":
                this.activekey = "allC";
                this.contractDs = process(this.gridresultAllContract, this.state);
                break;
            case "fltr_Completed_Contract":
                this.activekey = "CC";
                this.contractDs = process(this.gridresultCompletedContract, this.state);
                break;
            case "fltr_InCompleted_Contract":
                this.activekey = "ICC";
                this.contractDs = process(this.gridresultInCompleteContract, this.state);
                break;
            case "fltr_All_Tender":
                this.activekey = "allT";
                this.contractDs = process(this.gridresultAllTenders, this.state);
                break;
            case "fltr_Complete_Tender":
                this.activekey = "CT";
                this.contractDs = process(this.gridresultCompletedTenders, this.state);
                break;
            case "fltr_InComplete_Tender":
                this.activekey = "ICT";
                this.contractDs = process(this.gridresultIncompleteTenders, this.state);
                break;
            case "fltr_Cancelled_Tender":
                this.activekey = "CA";
                this.contractDs = process(this.gridresultCancelledTenders, this.state);
        }

        // Save only if there is value change in the filters and not default value (fltr_All)
        if (this.activeFilter !== filter) {
            let mySubConfig = {
                gridFilter: filter
            }
            this.dashboardParent.saveWidgetConfig('contractStatusBoard', mySubConfig);
        }
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "gridStatusBoardAngular",
    downgradeComponent({
        component: gridStatusBoardComponent,
        inputs: ['custIds', 'gridFilter', 'favContractIds', 'startDt', 'endDt']
    })
);


import { Input, Component, ViewChild, OnInit, OnChanges, EventEmitter, Output } from "@angular/core"
import { GridComponent, GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { GridStatusBoardService } from "./gridStatusBoard.service";
import { process, State, distinct } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { logger } from "../../shared/logger/logger";
import { DatePipe } from "@angular/common";
import { DashboardComponent } from "../../dashboard/dashboard/dashboard.component";
import { contractStatusWidgetService } from '../../dashboard/contractStatusWidget.service';
import * as _ from "underscore";
import * as moment from 'moment';

@Component({
    providers: [GridStatusBoardService, DatePipe],
    selector: "grid-status-board-angular",
    templateUrl: "Client/src/app/core/gridStatusBoard/gridStatusBoard.component.html"
})
export class gridStatusBoardComponent implements OnInit, OnChanges {
    @ViewChild(GridComponent) grid: GridComponent;

    @Input() private custIds: string;
    @Input() private gridFilter: string;
    @Input() private favContractIds: string;
    @Input() private startDt: string;
    @Input() private endDt: string;

    @Output() public isGridLoading: EventEmitter<boolean> = new EventEmitter();

    constructor(private contractService: GridStatusBoardService, private loggerSvc: logger, public datepipe: DatePipe, private dashboardParent: DashboardComponent, private cntrctWdgtSvc: contractStatusWidgetService) {

        this.cntrctWdgtSvc.isRefresh.subscribe(res => {
            if (res) {
                this.activeFilter = "fltr_All";
                this.activekey = "all";
                this.isLoaded = false;
                this.state.skip = 0;
                this.loadContractData();
                this.collapseAll();
            }
        });
    }

    private DontIncludeTenders = false;
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
    private activekey: string = "";

    private activeFilter: string = "";
    
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
        sort: [{
            "field": "CNTRCT_OBJ_SID",
            "dir": "desc",
        }],
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
    collapseAll() {
        this.gridResult.forEach((item, idx) => {
            this.grid.collapseRow(idx);
        })
      }

    loadContractData() {
        this.isGridLoading.emit(true);
        this.custIds = this.custIds == undefined ? "[]" : this.custIds;
        if (this.startDt === undefined) {
            this.startDt = window.localStorage.startDateValue ? window.localStorage.startDateValue : new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
        }
        if (this.endDt === undefined) {
            this.endDt = window.localStorage.endDateValue ? window.localStorage.endDateValue : new Date(moment().add(6, 'months').format("MM/DD/YYYY"));
        }
        this.dataforfilter = {
            CustomerIds: JSON.parse(this.custIds),
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

                //setting the favourite & alert contracts
                for (let i = 0; i < response.length; i++) {
                    //adding a column IS_Favorite for setting the favourite contracts
                    response[i]["IS_FAVORITE"] = false;
                    for (let j = 0; j < this.favContractsMap.length; j++) {
                        if (response[i].CNTRCT_OBJ_SID === parseInt(this.favContractsMap[j])) {
                            response[i]["IS_FAVORITE"] = true;
                            this.favCount++;
                        }
                    }
                    //setting alert count & alerts
                    if (response[i].HAS_ALERT && response[i].WF_STG_CD !== "Complete") {
                        this.alertCount++;
                    } else {
                        response[i].HAS_ALERT = false;
                    }

                    //Adding a tooltip column for displaying "created by {{CRE_EMP_NM}}" as tooltip on UI
                    if (response[i].CRE_EMP_NM === undefined || response[i].CRE_EMP_NM === "") {
                        response[i]["TOOLTIP_CONTENT"] = "";
                    } else {
                        response[i]["TOOLTIP_CONTENT"] = "Created By : " + response[i].CRE_EMP_NM;
                    }
                }
                _.each(response, item => {
                    item['STRT_DTM'] = new Date(item['STRT_DTM']);
                    item['END_DTM'] = new Date(item['END_DTM']);
                })

                this.gridResult = response;
                //Storing the filter response in variable to be used while filter
                this.gridresultAlert = this.gridResult.filter(x => x.HAS_ALERT === true);
                this.gridresultFavorite = this.gridResult.filter(x => x.IS_FAVORITE === true);
                this.gridresultAllContract = this.gridResult.filter(x => x.IS_TENDER === 0);
                this.gridresultAllTenders = this.gridResult.filter(x => x.IS_TENDER === 1);
                this.gridresultCompletedContract = this.gridResult.filter(x => x.IS_TENDER === 0 && x.WF_STG_CD === "Complete");
                this.gridresultCompletedTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "Complete");
                this.gridresultInCompleteContract = this.gridResult.filter(x => x.IS_TENDER === 0 && x.WF_STG_CD === "InComplete");
                this.gridresultIncompleteTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "InComplete");
                this.gridresultCancelledTenders = this.gridResult.filter(x => x.IS_TENDER === 1 && x.WF_STG_CD === "Cancelled");

                switch (this.activekey) {
                    case "all":
                        this.gridResult = response;
                        break;
                    case "fav":
                        this.gridResult = this.gridresultFavorite;
                        break;
                    case "alert":
                        this.gridResult = this.gridresultAlert;
                        break;
                    case "allC":
                        this.gridResult = this.gridresultAllContract;
                        break;
                    case "CC":
                        this.gridResult = this.gridresultCompletedContract;
                        break;
                    case "ICC":
                        this.gridResult = this.gridresultInCompleteContract;
                        break;
                    case "allT":
                        this.gridResult = this.gridresultAllTenders;
                        break;
                    case "CT":
                        this.gridResult = this.gridresultCompletedTenders;
                        break;
                    case "ICT":
                        this.gridResult = this.gridresultIncompleteTenders;
                        break;
                    case "CA":
                        this.gridResult = this.gridresultCancelledTenders;
                        break;
                }

                //binding the response to the kendogrid
                this.contractDs = process(this.gridResult, this.state);

                //Setting the counts
                this.allStageCnt = response.length;
                this.contractStageCnt = this.gridresultAllContract.length;
                this.tenderStageCnt = this.gridresultAllTenders.length;
                this.contractComplete = this.gridresultCompletedContract.length;
                this.contractIncomplete = this.gridresultInCompleteContract.length;
                this.tenderComplete = this.gridresultCompletedTenders.length;
                this.tenderIncomplete = this.gridresultIncompleteTenders.length;
                this.tenderCancelled = this.gridresultCancelledTenders.length;

                this.isGridLoading.emit(false);
            },
                function (response) {
                    this.loggerSvc.error("Unable to load the Contracts", response, response.statusText);
                });
    }

    distinctPrimitive(fieldName: string): any {
        if (fieldName == 'CUST_NM') {
            return _.sortBy(_.uniq(_.pluck(this.gridResult, fieldName)));
        }
        return _.uniq(_.pluck(this.gridResult,fieldName));
    }

    //Changes to fav contract id will broadcast a change to dashboardController to SaveLayout changes
    onFavChange(dataItem) {
        dataItem.IS_FAVORITE = !dataItem.IS_FAVORITE;

        if (!dataItem.IS_FAVORITE) {
            const favIdIndex = this.favContractsMap.indexOf(dataItem.CNTRCT_OBJ_SID.toString());
            if (favIdIndex !== -1) {
                this.favContractsMap.splice(favIdIndex, 1);
            }
            this.favCount--;
            dataItem.IS_FAVORITE = false;
            this.gridresultFavorite.forEach((value, index) => {
                if (value.CNTRCT_OBJ_SID == dataItem.CNTRCT_OBJ_SID)
                    this.gridresultFavorite.splice(index, 1);
            });
            if (this.activeFilter === "Favorites"){
                this.clkFilter("fltr_Favorites");
            }
        } else {
            this.favContractsMap.push(dataItem.CNTRCT_OBJ_SID.toString());
            dataItem.IS_FAVORITE = true;
            this.favCount++;
            this.gridresultFavorite.push(dataItem);
        }
        this.favContractIds = this.favContractsMap.toString();
        const mySubConfig = {
            favContractIds: this.favContractIds
        }
        this.dashboardParent.favContractChanged(this.favContractIds);
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
        else if (this.activekey == "ICT") {
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
            this.activeFilter = filter;
            this.dashboardParent.gridFilterChanged(filter);
            const mySubConfig = {
                gridFilter: filter
            }
        }
    }
    public ngOnInit(): void {        
        for (let i = 0; i < this.dashboardParent.dashboard.length; i++) {
            if (this.dashboardParent.dashboard[i].subConfig) {
                if (this.dashboardParent.dashboard[i].subConfig.favContractIds !== undefined &&
                    this.dashboardParent.dashboard[i].subConfig.favContractIds != "") {
                    this.favContractsMap = this.dashboardParent.dashboard[i].subConfig.favContractIds.split(',');
                }
                if (this.dashboardParent.dashboard[i].subConfig.gridFilter !== undefined && this.dashboardParent.dashboard[i].subConfig.gridFilter != "") {
                    this.gridFilter = this.dashboardParent.dashboard[i].subConfig.gridFilter;
                }
            }
        }

        if (this.gridFilter == "" || this.gridFilter == undefined) {
            this.activeFilter = "fltr_All";
            this.activekey = "all";
        }
        else {
            this.activeFilter = this.gridFilter;
            switch (this.gridFilter) {
                case "fltr_All":
                    this.activekey = "all";
                    break;
                case "fltr_Favorites":
                    this.activekey = "fav";
                    break;
                case "fltr_HasAlert":
                    this.activekey = "alert";
                    break;
                case "fltr_All_Contract":
                    this.activekey = "allC";
                    break;
                case "fltr_Completed_Contract":
                    this.activekey = "CC";
                    break;
                case "fltr_InCompleted_Contract":
                    this.activekey = "ICC";
                    break;
                case "fltr_All_Tender":
                    this.activekey = "allT";
                    break;
                case "fltr_Complete_Tender":
                    this.activekey = "CT";
                    break;
                case "fltr_InComplete_Tender":
                    this.activekey = "ICT";
                    break;
                case "fltr_Cancelled_Tender":
                    this.activekey = "CA";
            }
        }
        this.favContractsMap = this.favContractIds == "" ? this.favContractsMap : this.favContractIds.split(',');
        //Get the contract Data
        this.loadContractData();

    }

    ngOnChanges() {
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            return;
        }
        //update input values and call loadContractData();
        this.loadContractData();
    }
}


import { Input, Component, ViewChild, OnInit, OnChanges, EventEmitter, Output, OnDestroy, ChangeDetectorRef } from "@angular/core"
import { GridComponent, GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query"; /*GroupDescriptor,*/
import { DatePipe } from "@angular/common";
import { sortBy, uniq, pluck, forEach } from 'underscore';
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GridStatusBoardService } from "./gridStatusBoard.service";
import { logger } from "../../shared/logger/logger";
import { DashboardComponent } from "../../dashboard/dashboard/dashboard.component";
import { contractStatusWidgetService } from '../../dashboard/contractStatusWidget.service';
import { DashboardConfig } from "../../dashboard/dashboardConfig.util";
import { MomentService } from "../../shared/moment/moment.service";

@Component({
    providers: [GridStatusBoardService, DatePipe],
    selector: "grid-status-board-angular",
    templateUrl: "Client/src/app/core/gridStatusBoard/gridStatusBoard.component.html"
})
export class gridStatusBoardComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild(GridComponent) grid: GridComponent;
    @Input() private custIds: string;
    @Input() private gridFilter: string;
    @Input() private favContractIds: string;
    @Input() private startDt: string;
    @Input() private endDt: string;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    @Output() public isGridLoading: EventEmitter<boolean> = new EventEmitter();

    constructor(private contractService: GridStatusBoardService,
        private loggerSvc: logger,
        public datepipe: DatePipe,
        private dashboardParent: DashboardComponent,
        private cntrctWdgtSvc: contractStatusWidgetService,
        private momentService: MomentService
    ) {
        this.cntrctWdgtSvc.isRefresh.pipe(takeUntil(this.destroy$)).subscribe(res => {
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
    private isLoaded = false;
    private dataSummary: object; //holds filters for data fetch -during API call
    private gridResult: Array<any>;
    public custData: string[] = [];

    //Variable to hold the API response data and holding filter data
    private contractDs: GridDataResult;
    private custFltr: any;
    private pageCount: any;
    
    //Variables to store the counts
    private contractStageCnt = 0;
    private tenderStageCnt = 0;
    private allStageCnt = 0;
    private favCount = 0;
    private alertCount = 0;
    private contractComplete = 0;
    private contractIncomplete = 0;
    private tenderComplete = 0;
    private tenderIncomplete = 0;
    private tenderCancelled = 0;
    private loadCount = true;
    private groupFltr = '';

    //to store the favContractIds in Array format
    private favContractsMap: Array<any> = [];
    private activekey = "";
    private filterComp: Array<any> = [];
    private sortData = "";
    private filterData = "";

    private activeFilter = "";

    private isInitialLoad = true;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        }
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
        });
    }

    public filterChange(filter: CompositeFilterDescriptor): void {
        this.state.filter = filter;
        this.loadCount = true;
        this.loadContractData();
    }

    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        this.groupFltr = "";
        this.filterComp = [];
        this.state.filter.filters.forEach((item: CompositeFilterDescriptor) => {
            if (item && item.filters && item.filters.length > 0)
                item.filters.forEach((filter: FilterDescriptor) => {
                    if (filter.field == 'CUST_NM') {
                        const ind = this.filterComp.findIndex(x => x.field == filter.field);
                        if (ind > -1) {
                            this.filterComp[ind].value = this.filterComp[ind].value.includes(filter.value) ? this.filterComp[ind].value : this.filterComp[ind].value.replace(")", `, '${filter.value}')`);
                        }
                        else {
                            this.filterComp.push({
                                field: filter.field,
                                operator: "IN",
                                value: `('${filter.value}')`
                            });
                        }
                    } else
                        this.filterComp.push(filter);
                });
        });
        if (this.activekey != "fav" && this.activekey != "all") {
            DashboardConfig.activeTabFilterComp[this.activekey].forEach((item) => {
                this.filterComp.push(item);
            });
        }
        if (this.activekey === "fav" && this.favContractsMap.length != 0) {
            this.filterComp.push({
                field: "pvt.OBJ_SID",
                operator: "IN",
                value: `(${this.favContractsMap.join(',')})`
            });
        } else {
            let ind = this.filterComp.findIndex(x => x.field == "CNTRCT_OBJ_SID" && x.operator == "IN");
            if (ind > -1) {
                this.filterComp.splice(ind, 1);
            }
        }
        if (this.activekey == 'alert') {
            this.groupFltr = `AND (ac.OBJ_SID IS NOT NULL AND WF_STG_CD != 'Complete')`
        }
        this.filterComp.forEach((item) => {
            if (item.field == "WF_STG_CD" || item.field == "IS_TENDER") {
                this.groupFltr = ` ${this.groupFltr} AND (${item.field} ${item.value == "InComplete" ? `= 'InComplete' OR WF_STG_CD IS NULL` : item.value == 0 ? `= 0 OR IS_TENDER IS NULL` : `= '${item.value}'`})`;
            } else {
                this.filterData = `${this.filterData} AND ${item.field == 'STRT_DTM' ? `TRY_CONVERT(DATETIME, pvt.START_DT)` : item.field == 'END_DTM' ? `TRY_CONVERT(DATETIME, pvt.END_DT)` : `${item.field}`} ${DashboardConfig.parseFilter[item.operator] ? DashboardConfig.parseFilter[item.operator] : item.operator} ${DashboardConfig.exceptionFields.includes(item.field) ? item.value : this.loadExpVal(item)}`;
            }
            
        });

        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `${value.field} ${value.dir}` : `${this.sortData} AND ${value.field} ${value.dir}`;
                }
            });
        }
    }

    loadExpVal(item) {
        if (item.field == "STRT_DTM" || item.field == "END_DTM") {
            return `'${item.value.toLocaleDateString("en-US")}'`
        }
        else if (item.operator == "contains") {
            return `'%${item.value}%'`;
        }
        else if (item.operator == "startswith") {
            return `'${item.value}%'`
        }
        else if (item.operator == "endswith") {
            return `'%${item.value}'`
        }
        else if (item.operator == "IN") {
            return `${item.value}`
        }
        else {
            return `'${item.value}'`
        }
    }

    filterLoad() {
        this.custData = [];
        this.settingFilter();
        let dataforfilter = {
            CustomerIds: JSON.parse(this.custIds),
            StartDate: this.datepipe.transform(new Date(this.startDt), 'MM/dd/yyyy'),
            EndDate: this.datepipe.transform(new Date(this.endDt), 'MM/dd/yyyy'),
            DontIncludeTenders: this.DontIncludeTenders,
            InFilters: this.filterData,
            grpFltr: this.groupFltr,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take
        };
        this.contractService.getContractsFltr(dataforfilter).subscribe(data => {
            this.custData = data;
        });
    }

    loadContractData() {
        this.isGridLoading.emit(true);
        this.custIds = this.custIds == undefined ? "[]" : this.custIds;
        if (this.startDt === undefined) {
            this.startDt = window.localStorage.startDateValue ? window.localStorage.startDateValue : new Date(this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY"));
        }
        if (this.endDt === undefined) {
            this.endDt = window.localStorage.endDateValue ? window.localStorage.endDateValue : new Date(this.momentService.moment().add(6, 'months').format("MM/DD/YYYY"));
        }
        //Initialising all counts from 0
        this.favCount = this.favContractsMap.length;

        this.settingFilter();
        this.dataSummary = {
            CustomerIds: JSON.parse(this.custIds),
            StartDate: this.datepipe.transform(new Date(this.startDt), 'MM/dd/yyyy'),
            EndDate: this.datepipe.transform(new Date(this.endDt), 'MM/dd/yyyy'),
            DontIncludeTenders: this.DontIncludeTenders,
            InFilters: this.filterData,
            grpFltr: this.groupFltr,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take
        };


        if (this.loadCount) {
            forkJoin({
                CntrctSum: this.contractService.getContracts(this.dataSummary),
                SumCount: this.contractService.getContractCount(this.dataSummary)
            }).pipe(takeUntil(this.destroy$))
                .subscribe(({ CntrctSum, SumCount }) => {
                    if (CntrctSum) {
                        this.loadSummaryData(CntrctSum);
                    }
                    if (SumCount) {
                        this.pageCount = {
                            "all": this.allStageCnt = SumCount[0].TOT_TENDER_COUNT + SumCount[0].TOT_CONTRACT_COUNT,
                            "fav": this.favCount,
                            "alert": this.alertCount = SumCount[0].TOT_ALERT_COUNT,
                            "allC": this.contractStageCnt = SumCount[0].TOT_CONTRACT_COUNT,
                            "CC": this.contractComplete = SumCount[0].TOT_COMPLETE_CONTRACT_COUNT,
                            "ICC": this.contractIncomplete = SumCount[0].TOT_CONTRACT_COUNT - SumCount[0].TOT_COMPLETE_CONTRACT_COUNT,
                            "allT": this.tenderStageCnt = SumCount[0].TOT_TENDER_COUNT,
                            "CT": this.tenderComplete = SumCount[0].TOT_COMPLETE_TENDER_COUNT,
                            "ICT": this.tenderIncomplete = SumCount[0].TOT_TENDER_COUNT - SumCount[0].TOT_COMPLETE_TENDER_COUNT - SumCount[0].TOT_CANCELLED_TENDER_COUNT,
                            "CA": this.tenderCancelled = SumCount[0].TOT_CANCELLED_TENDER_COUNT
                        }
                    }
                    //binding the response to the kendogrid
                    const state: State = {
                        skip: 0,
                        take: this.state.take,
                        group: [],
                        filter: {
                            logic: "and",
                            filters: [],
                        }
                    };
                    //setting gridData
                    this.contractDs = this.activekey == 'fav' && this.favContractsMap.length == 0 ? process([], state) : process(this.gridResult, state);
                    this.contractDs.total = this.pageCount[this.activekey];
                    this.loadCount = false;
                    this.isGridLoading.emit(false);
                }, (error) => {
                    if (error.status == 400) {
                        this.loggerSvc.error(`Unable to load the Contracts:: ${error.error}`, error, error.statusText);
                    } else {
                        this.loggerSvc.error("Unable to load the Contracts", error, error.statusText);
                    }

                });
        } else {
            this.contractService.getContracts(this.dataSummary).pipe(takeUntil(this.destroy$))
                .subscribe((data) => {
                    if (data) {
                        this.loadSummaryData(data);
                        //binding the response to the kendogrid
                        const state: State = {
                            skip: 0,
                            take: this.state.take,
                            group: [],
                            filter: {
                                logic: "and",
                                filters: [],
                            }
                        };
                        //setting gridData
                        this.contractDs = this.activekey == 'fav' && this.favContractsMap.length == 0 ? process([], state) : process(this.gridResult, state);
                        this.contractDs.total = this.pageCount[this.activekey];
                        this.isGridLoading.emit(false);
                    }
                }, (error) => {
                    if (error.status == 400) {
                        this.loggerSvc.error(`Unable to load the Contracts:: ${error.error}`, error, error.statusText);
                    } else {
                        this.loggerSvc.error("Unable to load the Contracts", error, error.statusText);
                    }

                });
        }
    }

    loadSummaryData(summary) {
        //setting the favourite & alert contracts
        forEach(summary, item => {
            //adding a column IS_Favorite for setting the favourite contracts
            item["IS_FAVORITE"] = false;
            forEach(this.favContractsMap, favItem => {
                item.IS_FAVORITE = item.CNTRCT_OBJ_SID === parseInt(favItem) ? true : item.IS_FAVORITE;
            });
            //Adding a tooltip column for displaying "created by {{CRE_EMP_NM}}" as tooltip on UI
            item.TOOLTIP_CONTENT = item.CRE_EMP_NM ? "Created By : " + item.CRE_EMP_NM : "";

            item.STRT_DTM = new Date(item.STRT_DTM);
            item.END_DTM = new Date(item.END_DTM);
        });

        this.gridResult = this.activekey === "fav" && this.favCount == 0 ? [] : summary;
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
            if (this.activeFilter === "Favorites") {
                this.clkFilter("fltr_Favorites");
            }
        } else {
            this.favContractsMap.push(dataItem.CNTRCT_OBJ_SID.toString());
            dataItem.IS_FAVORITE = true;
            this.favCount++;
        }
        this.favContractIds = this.favContractsMap.toString();
        this.dashboardParent.favContractChanged(this.favContractIds);
    }


    sortChange(state) {
        this.state["sort"] = state;
        this.loadContractData();
    }

    pageChange(state: DataStateChangeEvent) {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.loadContractData();
    }

    clkFilter(filter) {
        if (filter === undefined || filter === "")
            filter = "fltr_All";
        this.state.skip = 0;
        this.custData = [];
        this.activekey = DashboardConfig.activeTabs[filter];
        this.loadContractData();
        // Save only if there is value change in the filters and not default value (fltr_All)
        if (this.activeFilter !== filter) {
            this.activeFilter = filter;
            this.dashboardParent.gridFilterChanged(filter);
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
            this.activekey = DashboardConfig.activeTabs[this.gridFilter];
        }
        this.favContractsMap = this.favContractIds == "" ? this.favContractsMap : this.favContractIds.split(',');
        //Get the contract Data
        this.loadContractData();

    }

    ngOnChanges() {
        if (!this.isInitialLoad) {
            this.isInitialLoad = true;
            this.loadContractData();
        }
        //update input values and call loadContractData();

    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import * as moment from "moment";
import { contractStatusWidgetService } from "../dashboard/contractStatusWidget.service";
import { logger } from "../shared/logger/logger";
import { advancedSearchService } from "./advancedSearch.service";
import { globalSearchResultsService } from "../advanceSearch/globalSearchResults/globalSearchResults.service";
import { TenderDashboardConfig } from '../advanceSearch/tenderDashboard/tenderDashboard_config';
import { AttributeBuilder } from '../core/attributeBuilder/attributeBuilder.component';
import { process, State, FilterDescriptor, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { GridUtil } from '../contract/grid.util';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, FilterService } from "@progress/kendo-angular-grid";
import * as _ from "underscore";

@Component({
    selector: 'app-advanced-search',
    templateUrl: 'Client/src/app/advanceSearch/advancedSearch.component.html',
    styleUrls: ['Client/src/app/advanceSearch/advancedSearch.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AdvancedSearchComponent implements OnInit {
    private startDateValue: Date = new Date(moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(moment().add(6, 'months').format("MM/DD/YYYY"));
    private showSearchFilters: boolean = true;
    public isListExpanded = false;
    public fruits: Array<string> = ['Apple', 'Orange', 'Banana'];
    public custData: any; rules: any; ruleToRun: any;
    public selectedCustNames = [];
    public selectedCustomerIds = [];
    public gridData: GridDataResult;
    public UItemplate = null;
    public c_Id: number = 0;
    public ps_Id: number = 0;
    public pt_Id: number = 0;
    public searchText: string = "";
    public contractData: [];
    public title: string = "Search";
    public searchTitle = "Default filter is auto populated from the dashboard but you may overwrite at anytime. This will not change your dashboard filters.";
    public operatorList = TenderDashboardConfig.operatorSettings.operators;
    public attributeList = TenderDashboardConfig.advancedSearchAttributeSettings;
    public type2OperatorList = TenderDashboardConfig.operatorSettings.types2operator;
    public cat = 'DealSearch';
    public subcat = 'SearchRules';
    public ruleData = [];
    public wipOptions = {};
    private hiddenColumns: any = [];
    public columnsDisp: any;
    public selectedValue: any;
    public wipData = [];
    public columns: any = TenderDashboardConfig.advancedSearchColumnConfig;
    public startDt = window.localStorage.startDate;
    public endDt = window.localStorage.endDate;
    public customers = [];
    public maxRecordCount: any;
    public templates: any;
    public gridResult: any;
    public isLoading: boolean = true;
    public spinnerMessageHeader: any;
    public spinnerMessageDescription: any;
    public msgType: any;
    public isBusyShowFunFact: any;
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
            text: "25",
            value: 25
        },
        {
            text: "100",
            value: 100
        },
        {
            text: "250",
            value: 250
        }, {
            text: "All",
            value: 'all'
        }
    ];
    public dropdownResponses: any;
    @ViewChild(AttributeBuilder) attrBuilder: AttributeBuilder;
    public advancedSearchDropdownFilter: any;
    public custFilter: any[] = [];
    public totalCount: any;

    constructor(protected cntrctWdgtSvc: contractStatusWidgetService, protected loggerSvc: logger, protected globalSearchSVC: globalSearchResultsService,
        private advancedSearchSvc: advancedSearchService) { }

    onCustomerChange(custData) {
        window.localStorage.selectedCustNames = JSON.stringify(custData);
    }

    //wordWrap
    toggleWrap = function () {
        const elements = Array.from(
            document.getElementsByClassName('k-grid-table') as HTMLCollectionOf<HTMLElement>
        );
        this.wrapEnabled = !this.wrapEnabled;
        var newVal = this.wrapEnabled ? "normal" : "nowrap";
        var newH = this.wrapEnabled ? "100%" : "auto";
        elements.forEach((item) => {
            item.style.setProperty('white-space', newVal);
            item.style.setProperty("height", newH);
        });
        this.grid?.autoFitColumn(2);
    }

    //pagination - load searchDeals on next click, if records > 500
    dataStateChange(state: DataStateChangeEvent): void {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.state.filter = state.filter != undefined ? state.filter : this.state.filter;
        this.state.sort = state.sort != undefined ? state.sort : this.state.sort;
        this.state.group = state.group != undefined ? state.group : this.state.group;
        this.gridData = process(this.gridResult, this.state);
        this.gridData.total = this.totalCount;
    }


    //on filter change
    async filterChange(filter: any) {
        this.state.filter = filter;
        if (filter && filter.filters && filter.filters.length > 0) {
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                if (item && item.filters && item.filters.length > 0) {
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        let column = fltrItem.field.toString();
                        let arrayData: any;
                        if (column == 'Customer_NM') {
                            fltrItem.field = 'Customer/CUST_NM';
                        }
                        else if ((column == 'CAP_VAL' || column == 'ECAP_PRICE_VAL' || column == 'STRT_VOL_VAL' || column == 'END_VOL_VAL' || column == 'RATE_VAL' || column == 'TRKR_NBR_VAL')) {
                            let fiel: any = fltrItem.field
                            fltrItem.field = fiel.slice(0, -4);
                        }
                        else {
                            //converting kendo date into string - for filter
                            if ((column == 'START_DT' || column == 'END_DT' || column == 'OEM_PLTFRM_LNCH_DT' || column == 'OEM_PLTFRM_EOL_DT')) {
                                if (typeof fltrItem.value != 'string')
                                    fltrItem.value = moment(fltrItem.value.toLocaleDateString()).format('MM/DD/YYYY');
                            }
                        }
                    })
                }
            })
        }
        await this.searchDeals();
        //if Date assigned to string value - converting to kendo date format
        if (filter && filter.filters && filter.filters.length > 0) {
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                if (item && item.filters && item.filters.length > 0) {
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        let column = fltrItem.field.toString();
                        if ((column == 'START_DT' || column == 'END_DT' || column == 'OEM_PLTFRM_LNCH_DT' || column == 'OEM_PLTFRM_EOL_DT')) {
                            fltrItem.value = new Date(fltrItem.value);
                        }
                    })
                }
            })
        }
    }



    //multiselectfilter
    custChange(values: any[], filterService: FilterService): void {
        filterService.filter({
            filters: values.map(value => ({
                field: 'Customer_NM',
                operator: 'eq',
                value: value.CUST_NM
            })),
            logic: 'or'
        });
        this.custFilter = values;
    }

    //Column Options
    iscolumnchecked(field) {
        if (this.columns.filter(x => x.field == field).length > 0) {
            return true;
        } else {
            return false;
        }
    }
    onColumnChange(val) {
        var col = this.columnsDisp.filter(x => x.field == val.field);
        if (col == undefined || col == null || col.length == 0) {
            const index = this.hiddenColumns.indexOf(val.field);
            if (index > -1) {
                this.hiddenColumns.splice(index, 1);
            }
            this.columnsDisp = [];
            this.columns.forEach((row) => {
                if (!(this.hiddenColumns.includes(row.field))) {
                    this.columnsDisp.push(row);
                }
            });
        }
        else {
            this.hiddenColumns.push(col[0].field)
            this.columnsDisp = []
            this.columns.forEach((row) => {
                if (!(this.hiddenColumns.includes(row.field))) {
                    this.columnsDisp.push(row);
                }
            })
        }
    }

    //Help
    showHelpTopicGroup(helpTopic) {
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    //clear grid Sorting/Filtering
    clearSortingFiltering() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.state.skip = 0;
        this.searchDeals();
    }

    //Excel Export
    exportToExcel() {
        GridUtil.dsToExcel(this.columns, this.gridResult, "Search Export");
    }
    exportToExcelCustomColumns() {
        GridUtil.dsToExcel(this.columns, this.gridData.data, "Search Export");
    }
    pageChange(state) {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.searchDeals();
    }
    //deals search
    searchDeals() {
        this.isLoading = true;
        this.setBusy("Searching...", "Search speed depends on how specific your search options are.", "Info", true);
        var st = this.startDateValue.toLocaleDateString();
        let startDate = st.replace(/\//g, '-');
        var en = this.endDateValue.toLocaleDateString();
        let endDate = en.replace(/\//g, '-');
        let searchText = '';
        if (window.localStorage.selectedCustNames != undefined)
            this.getCustomerNames();
        searchText = this.selectedCustNames.length === 0 ? "null" : this.selectedCustNames.join(',');
        if (this.state.skip == 0) searchText += "?$inlinecount=allpages&$top=" + this.state.take;
        else if (this.state.skip >= 25) searchText += "?$inlinecount=allpages&$top=" + this.state.take + "&$skip=" + this.state.skip;
        let filter = this.state.filter;
        if (filter && filter.filters && filter.filters.length > 0) {
            searchText += '&$filter=';
            filter.filters.forEach((item: CompositeFilterDescriptor, ind) => {
                if (item && item.filters && item.filters.length > 0) {
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        searchText += ind == 0 && filter.filters.length > 1 ? '(' : '';
                        if (fltrItem.operator == 'contains') searchText += "substringof(" + "'" + fltrItem.value + "'," + fltrItem.field + ")";
                        else searchText += fltrItem.field + ' ' + fltrItem.operator + " '" + fltrItem.value + "'"
                        searchText += filter.filters.length != (ind + 1) && filter.filters.length > 1 ? ' and ' : '';
                        searchText += filter.filters.length == (ind + 1) && filter.filters.length > 1 ? ')' : '';
                    })
                }
            })
        }

        this.advancedSearchSvc.getSearchList(startDate, endDate, searchText).subscribe((result: any) => {
            this.isLoading = false;
            this.setBusy('', '');
            result.Items.forEach((row) => {
                Object.assign(row, {
                    Customer_NM: row.Customer.CUST_NM,
                    WF_STG_CD: row.WF_STG_CD === "Draft" ? row.PS_WF_STG_CD : row.WF_STG_CD,
                    TRKR_NBR_VAL: row.TRKR_NBR != undefined ? Object.values(row.TRKR_NBR)[0] : '',
                    CAP_VAL: row.CAP != undefined ? Object.values(row.CAP)[0] : '',
                    ECAP_PRICE_VAL: row.ECAP_PRICE != undefined ? Object.values(row.ECAP_PRICE)[0] : '',
                    STRT_VOL_VAL: row.STRT_VOL != undefined ? Object.values(row.STRT_VOL)[0] : '',
                    END_VOL_VAL: row.END_VOL != undefined ? Object.values(row.END_VOL)[0] : '',
                    RATE_VAL: row.RATE != undefined ? Object.values(row.RATE)[0] : ''
                })
            })
            this.totalCount = result.Count;
            if (this.state.skip == 0) this.gridResult = result.Items;
            else {
                this.gridResult = [];
                let obj = {};
                for (let i = 0; i < this.state.skip; i++) {
                    this.gridResult.push(obj);
                }
                this.gridResult = this.gridResult.concat(result.Items);
            }
            let newState = {
                skip: this.state.skip,
                take: this.state.take
            }
            this.gridData = process(this.gridResult, newState);
            this.gridData.total = result.Count;
        }, (err) => {
            this.isLoading = false;
            this.loggerSvc.error("Template Retrieval Failed", "Error", err);
            //loader disable
        });

    }
    //onclick of run rules button
    onSaveRule(data) {
        if (typeof data == 'object') {
            this.rules = data;
        }
        this.setBusy('', '');
    }

    //on dropdown rules click of 'Select saved Rules'
    onRuleSelect(data) {
        this.attrBuilder.onRuleSelect(data);
    }

    setBusy(msg, detail, msgType = "", showFunFact = false) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    onDateChange(value, dateChanged) {
        if (dateChanged == "startDateChange") {
            window.localStorage.startDateValue = value;
        }
        else if (dateChanged == "endDateChange") {
            window.localStorage.endDateValue = value;
        }
    }

    toggleFilters() {
        this.showSearchFilters = !this.showSearchFilters;
        if (this.showSearchFilters) {
            this.isListExpanded = false;
        } else {
            this.isListExpanded = true;
        }
    }

    //invoke search deals after Run Rules completed
    invokeSearchDatasource(args) {
        if (args.rule.length > 0) {
            this.ruleData = args.rule;
            this.searchDeals();
        }
    }

    //to get selected customers(Search options) from local storage
    getCustomerNames() {
        JSON.parse(window.localStorage.selectedCustNames).forEach((row) => {
            this.selectedCustNames.push(row.CUST_NM);
        })
    }

    removeLoadingPanel() {
        //after loading data in attributeBuilder - assigning dropdown responses
        this.dropdownResponses = this.attrBuilder.dropdownresponses;
        this.advancedSearchDropdownFilter = {
            "WF_STG_CD": this.columns.filter(x => x.field == "WF_STG_CD")[0].lookups,
            "OBJ_SET_TYPE_CD": this.columns.filter(x => x.field == "OBJ_SET_TYPE_CD")[0].lookups,
            "MRKT_SEG": this.dropdownResponses["MRKT_SEG"],
            "REBATE_TYPE": this.dropdownResponses["REBATE_TYPE"],
            "PROGRAM_PAYMENT": this.dropdownResponses["PROGRAM_PAYMENT"],
            "PAYOUT_BASED_ON": this.dropdownResponses["PAYOUT_BASED_ON"],
            "SERVER_DEAL_TYPE": this.dropdownResponses["SERVER_DEAL_TYPE"],
            "Customer_NM": this.dropdownResponses["Customer.CUST_NM"]
        };
        this.setBusy("", "");
    }

    goto(id, action: string) {
        //redirect to contractManager directly
        if (action == 'gotoContract') {
            const url = `Contract#/manager/${id}`;
            window.open(url, '_blank');
        }
        else {
            //routing function redirecting to goto component
            if (action == 'gotoPS') {
                const url = `advancedSearch#/gotoPs/${id}`;
                window.open(url, '_blank');
            }
            else {
                const url = `advancedSearch#/gotoDeal/${id}`;
                window.open(url, '_blank');
            }
        }
    }

    ngOnInit(): void {
        this.setBusy("Loading...", "Please wait while we are loading...", "info", true);
        this.showSearchFilters = true;
        this.isListExpanded = false;
        window.localStorage.selectedCustNames != undefined ? this.getCustomerNames() : this.selectedCustNames = [];
        this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
        this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;
        this.columnsDisp = this.columns;
        this.cntrctWdgtSvc.getCustomerDropdowns()
            .subscribe((response: Array<any>) => {
                if (response && response.length > 0) {
                    this.custData = response;
                }
                else {
                    this.loggerSvc.error("No result found.", 'Error');
                }
            }, function (error) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
    }
}
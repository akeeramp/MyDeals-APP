import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MomentService } from "../shared/moment/moment.service";
import { contractStatusWidgetService } from "../dashboard/contractStatusWidget.service";
import { logger } from "../shared/logger/logger";
import { advancedSearchService } from "./advancedSearch.service";
import { globalSearchResultsService } from "../advanceSearch/globalSearchResults/globalSearchResults.service";
import { TenderDashboardConfig } from '../advanceSearch/tenderDashboard/tenderDashboard_config';
import { AttributeBuilder } from '../core/attributeBuilder/attributeBuilder.component';
import { process, State, FilterDescriptor, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { GridUtil } from '../contract/grid.util';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, FilterService } from "@progress/kendo-angular-grid";

import { PTE_Common_Util } from "../contract/PTEUtils/PTE_Common_util";
import { PendingChangesGuard } from "../shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";

import { each } from 'underscore';
@Component({
    selector: 'app-advanced-search',
    templateUrl: 'Client/src/app/advanceSearch/advancedSearch.component.html',
    styleUrls: ['Client/src/app/advanceSearch/advancedSearch.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchComponent implements OnInit{
    private startDateValue: Date = new Date(this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY"));
    private endDateValue: Date = new Date(this.momentService.moment().add(6, 'months').format("MM/DD/YYYY"));
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
    public customers = [];
    public maxRecordCount: any;
    public templates: any;
    public gridResult: any;
    public isLoading: boolean = true;
    public spinnerMessageHeader: any;
    public spinnerMessageDescription: any;
    public msgType: any;
    public isBusyShowFunFact: any;
    public columnSearchFilter: string = '';
    private isDirty=false;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
        sort: [],
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
    public exportAll: boolean = false;
    public exportData: any;
    public exportRows: boolean = false;

    constructor(protected cntrctWdgtSvc: contractStatusWidgetService,
                protected loggerSvc: logger,
                protected globalSearchSVC: globalSearchResultsService,
                private advancedSearchSvc: advancedSearchService,
                private momentService: MomentService) { }

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
        var newBrk = this.wrapEnabled ? "break-word" : "nowrap";
        var newH = this.wrapEnabled ? "100%" : "auto";
        elements.forEach((item) => { 
            item.style.setProperty('white-space', newVal);
            item.style.setProperty("height", newH);
            item.style.setProperty('word-break', newBrk);
        });
        this.grid?.autoFitColumn(2);
    }

    //pagination - load searchDeals on next click, if records > 500
    dataStateChange(state: DataStateChangeEvent): void {
        let isFilter = true
        if (state.filter && state.filter.filters && state.filter.filters.length > 0) { isFilter = false }
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.state.filter = state.filter != undefined ? state.filter : this.state.filter;
        this.state.sort = state.sort != undefined ? state.sort : this.state.sort;
        this.state.group = state.group != undefined ? state.group : this.state.group;
        if ((this.state.sort && this.state.sort.length > 0) || (this.state.group && this.state.group.length > 0)) {
            let sort = {
                take: 25,
                skip: 0,
                sort: this.state.sort,
                group: this.state.group
            }
            let data = process(this.gridData.data, sort);
            this.gridData.data = data.data;
            this.gridData.total = this.totalCount;
        }
        if (isFilter)
        this.searchDeals();
    }


    //on filter change
    async filterChange(filter: any) {
        this.state.filter = filter;
        if (filter && filter.filters && filter.filters.length > 0) {
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                if (item && item.filters && item.filters.length > 0) {
                    let filtersarr: any[] = item.filters;
                    this.custFilter = filtersarr.findIndex(x => x.field == 'Customer_NM') > -1 ? this.custFilter : [];
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
                                    fltrItem.value = this.momentService.moment(fltrItem.value.toLocaleDateString()).format('MM/DD/YYYY');
                            }
                        }
                    })
                }
            })
        } else this.custFilter = [];
        await this.searchDeals();
        //if Date assigned to string value - converting to kendo date format
        if (filter && filter.filters && filter.filters.length > 0) {
            filter.filters.forEach((item: CompositeFilterDescriptor) => {
                if (item && item.filters && item.filters.length > 0) {
                    item.filters.forEach((fltrItem: FilterDescriptor) => {
                        let column = fltrItem.field.toString();
                        if ((column == 'START_DT' || column == 'END_DT' || column == 'OEM_PLTFRM_LNCH_DT' || column == 'OEM_PLTFRM_EOL_DT')) {
                            fltrItem.value = new Date(fltrItem.value);
                        } else if ((column == 'CAP' || column == 'ECAP_PRICE' || column == 'STRT_VOL' || column == 'END_VOL' || column == 'RATE' || column == 'TRKR_NBR')) {
                            //let fiel: any = fltrItem.field
                            fltrItem.field = fltrItem.field + '_VAL';
                        } else {
                            if (column == 'Customer/CUST_NM') {
                                fltrItem.field = 'Customer_NM';
                            }
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

    columnOptionsFilter() {
        if (this.columnSearchFilter == '')
            return this.columns;
        else return this.columns.filter(x => x.title.toLowerCase().includes(this.columnSearchFilter.toLowerCase()));
    }
    //Help
    showHelpTopicGroup(helpTopic) {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Dashboard.aspx', '_blank');
    }

    //clear grid Sorting/Filtering
    clearSortingFiltering() {
        if (this.gridResult != undefined) {
            this.state.filter = {
                logic: "and",
                filters: [],
            };
            this.state.sort = [];
            this.state.group = [];
            this.state.skip = 0;
            this.custFilter = [];
            this.searchDeals();
        } else {
            this.state.filter = {
                logic: "and",
                filters: [],
            };
            this.state.sort = [];
            this.state.group = [];
            this.state.skip = 0;
            this.custFilter = [];
        }
    }

    //Excel Export
    async exportToExcel() {
        if (this.gridResult != undefined) {
            if (this.totalCount > 2000) this.exportAll = true;
            else {
                this.exportRows = true;
                await this.searchDeals();
                if (this.exportData && this.exportData.length > 0)
                    GridUtil.dsToExcel(this.columns, this.exportData, "Search Export");
            }
        } else
            this.loggerSvc.warn("No Records Found", "");

    }

    async exportAllOk() {
        await this.searchDeals();
        if (this.exportData && this.exportData.length > 0)
            GridUtil.dsToExcel(this.columns, this.exportData, "Search Export");
        else
            this.loggerSvc.warn("No Records Found", "");
        
    }
    close() {
        this.exportAll = false;
    }
    exportToExcelCustomColumns() {
        this.columnsDisp = []
        this.columns.forEach((row) => {
            if (!(this.hiddenColumns.includes(row.field))) {
                this.columnsDisp.push(row);
            }
        })
        if (this.gridData && this.gridData.data && this.gridData.data.length > 0)
            GridUtil.dsToExcel(this.columnsDisp, this.gridData.data, "Search Export");
        else
            this.loggerSvc.warn("No Records Found", "");
    }
    pageChange(state) {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.searchDeals();
    }
    //deals search
    async searchDeals() {
        this.isLoading = true;
        let exportVal = false;
        this.setBusy("Searching...", "Search speed depends on how specific your search options are.", "Info", true);
        this.startDateValue = window.localStorage.startDateValue ? new Date(window.localStorage.startDateValue) : this.startDateValue;
        this.endDateValue = window.localStorage.endDateValue ? new Date(window.localStorage.endDateValue) : this.endDateValue;
        var st = this.startDateValue.toLocaleDateString();
        let startDate = st.replace(/\//g, '-');
        var en = this.endDateValue.toLocaleDateString();
        let endDate = en.replace(/\//g, '-');
        let searchText = '';
        this.selectedCustNames = [];
        if (window.localStorage.selectedCustNames != undefined) this.getCustomerNames();
        searchText = this.selectedCustNames.length === 0 ? "null" : this.selectedCustNames.join(',');
        if (this.exportAll) {
            exportVal = true;
            this.exportAll = false;
            searchText += "?$inlinecount=allpages&$top=" + '1999';
        } else if (this.exportRows) {
            exportVal = true;
            this.exportRows = false;
            searchText += "?$inlinecount=allpages&$top=" + this.totalCount;
        } else {
            if (this.state.skip == 0) searchText += "?$inlinecount=allpages&$top=" + this.state.take;
            else if (this.state.skip >= 25) searchText += "?$inlinecount=allpages&$top=" + this.state.take + "&$skip=" + this.state.skip;
        }
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
        let sortby = this.state.sort;
        if( sortby && sortby.sort && sortby.sort.length>0){
            each(sortby,(sortitem)=>{
                if (sortitem.field != null) {
                    let column = sortitem.field;
                    let validCol = column.substr(column.length - 4)
                    if (validCol == '_VAL') {
                        searchText += '&$orderby=' + column.slice(0, -4);
                    }
                    else if (sortitem.field == 'Customer_NM') {
                        column = sortitem.field
                        column = 'CUST_NM'
                        searchText += '&$orderby=' + column
                    }
                    else
                        searchText += '&$orderby=' + sortitem.field;

                }
                if(sortitem.dir==undefined || sortitem.dir==null){
                    searchText += ' asc';
                }else{
                    searchText += ' '+sortitem.dir; 
                }
            })
        }
        

        let result: any = await this.advancedSearchSvc.getSearchList(startDate, endDate, searchText).toPromise().catch((err) => {
            this.isLoading = false;
            this.loggerSvc.error("Template Retrieval Failed", "Error", err);
        });
        this.isLoading = false;
        this.setBusy('', '');
        if (result != undefined) {
            result.Items.forEach((row) => {
                let crtAmt, dbtAmt = 0
                crtAmt = (Number(row.CREDIT_AMT) > 0) ? Number(row.CREDIT_AMT) : 0;
                dbtAmt = (Number(row.DEBIT_AMT) > 0) ? Number(row.DEBIT_AMT) : 0;
                Object.assign(row, {
                    Customer_NM: row.Customer.CUST_NM,
                    WF_STG_CD: row.WF_STG_CD === "Draft" ? row.PS_WF_STG_CD : row.WF_STG_CD,
                    TRKR_NBR_VAL: row.TRKR_NBR != undefined ? Object.values(row.TRKR_NBR)[0] : '',
                    CAP_VAL: row.CAP != undefined ? Object.values(row.CAP)[0] : '',
                    ECAP_PRICE_VAL: row.ECAP_PRICE != undefined ? Object.values(row.ECAP_PRICE)[0] : '',
                    STRT_VOL_VAL: row.STRT_VOL != undefined ? Object.values(row.STRT_VOL)[0] : '',
                    END_VOL_VAL: row.END_VOL != undefined ? Object.values(row.END_VOL)[0] : '',
                    RATE_VAL: row.RATE != undefined ? Object.values(row.RATE)[0] : '',
                    TOT_QTY_PAID: ((crtAmt + dbtAmt) > 0) ? (crtAmt + dbtAmt) : ''
                })
            })
            this.totalCount = result.Count;
             if (exportVal) {
                exportVal = false;
                this.exportData = result.Items;
            } else {
                this.gridResult = result.Items
                let data: any;
                let newState = {
                    skip: this.state.skip,
                    take: this.state.take
                }
                this.gridData = process(this.gridResult, newState);
                if (this.state.skip > 0) {
                    let state = {
                        take: this.state.take,
                        skip: 0
                    }
                    data = process(this.gridResult, state);
                    this.gridData.data = data.data;
                }
                this.gridData.total = result.Count;
            }
        }
    }
    //onclick of run rules button
    onSaveRule(data) {
        if (typeof data == 'object') {
            this.rules = data;
        }
        this.setBusy('', '');
    }

    //on click of delete button of current rule
    onDeleteRule(data) {
        this.ruleToRun = data;
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
        this.state.skip = 0;
        this.state.group = [];
        this.state.filter = {
            logic: "and",
            filters: [],
        };
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
                const url = `Contract#/gotoPs/${id}`;
                window.open(url, '_blank');
            }
            else {
                const url = `Contract#/gotoDeal/${id}`;
                window.open(url, '_blank');
            }
        }
    }

    isSearchDirty(data){
        if(!!data)
        this.isDirty=data;
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
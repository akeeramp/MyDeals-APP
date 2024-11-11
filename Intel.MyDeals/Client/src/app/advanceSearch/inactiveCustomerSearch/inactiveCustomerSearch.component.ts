import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from "@angular/core";
import { globalSearchResultsService } from "../globalSearchResults/globalSearchResults.service";
import { logger } from "../../shared/logger/logger";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TemplatesService } from "../../shared/services/templates.service";
import { DataStateChangeEvent, PageSizeItem, GridComponent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { GridUtil } from '../../contract/grid.util';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { InActiveCustomerService } from "./inactiveCustomerSearch.service";

@Component({
    selector: 'inactivecustomer-search-angular',
    templateUrl: 'Client/src/app/advanceSearch/inactiveCustomerSearch/inactiveCustomerSearch.component.html',
    styleUrls: ['Client/src/app/advanceSearch/inactiveCustomerSearch/inactiveCustomerSearch.component.css']
})
export class InActiveCustomerSearchComponent implements OnDestroy {
    
    constructor(protected globalSearchService: globalSearchResultsService,
        private loggerService: logger,
        private ref: ChangeDetectorRef,
        private templatesSvc: TemplatesService,
        private inactSvc: InActiveCustomerService
    ) {
        this.allData = this.allData.bind(this);
        this.data$ = this.inactSvc.dataSubject
    }
    @ViewChild('dealEditor', { static: false }) dealEditor: GridComponent;
    @ViewChild('excelExport', { static: false }) excelExport: ExcelExportComponent;

    public data$

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    public searchText = "";
    public opType = 'ALL';
    public columns = [];
    public gridResult = [];
    public gridData;
    public headerMsg = 'Searching...'
    //these are input coming from gloablsearch component
    private resultTake = 5;
    private viewMoreVisible = true;
    public isLoading: boolean;
    private readonly opTypes: Array<any> = [
        { value: "ALL", label: "All" },
        { value: "CNTRCT", label: "Contract" },
        { value: "PRC_ST", label: "Pricing Strategy" },
        { value: "PRC_TBL", label: "Pricing Table" },
        { value: "WIP_DEAL", label: "Deals" }
    ];
    private objTypes: any = {
        'CNTRCT': { result: [], loading: false, viewMore: false },
        'PRC_ST': { result: [], loading: false, viewMore: false },
        'PRC_TBL': { result: [], loading: false, viewMore: false },
        'WIP_DEAL': { result: [], loading: false, viewMore: false }
    };
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 }
    ];

    // Fields to be added
    private ColFieldsToAdd = [
        {
            "field": "PS_OBJ_SID",
            "title": "PS ID",
            "width": 90,
            "template": "#=gridUtils.uiControlWrapper(data, 'PS_OBJ_SID')#",
            "bypassExport": false,
            "hidden": false,
            "isDimKey": false,
            "isRequired": false,
            "sortable": true,
            "filterable": true,
            "mjrMnrChg": null,
            "lookupUrl": "",
            "lookupText": "",
            "lookupValue": "",
            "locked": false,
            "lockable": false
        },
        {
            "field": "PT_OBJ_SID",
            "title": "Prc Table ID",
            "width": 90,
            "template": "#=gridUtils.uiControlWrapper(data, 'PT_OBJ_SID')#",
            "bypassExport": false,
            "hidden": false,
            "isDimKey": false,
            "isRequired": false,
            "sortable": true,
            "filterable": true,
            "mjrMnrChg": null,
            "lookupUrl": "",
            "lookupText": "",
            "lookupValue": "",
            "locked": false,
            "lockable": false
        }
    ];

    dataStateChange(state: DataStateChangeEvent): void {
        this.setLoading(true);
        this.gridData.data = [];
        setTimeout(() => {
            this.state = state;
            this.gridData = process(this.gridResult, this.state);
            this.setLoading(false);
        });
    }

    getObjectOnly(type: string) {
        this.objTypes[type].loading = true;
        this.objTypes[type].viewMore = false;
        const inactCust = true
        const sanitizedSearchText: string = this.searchText.replace(/[^a-zA-Z0-9\(\)\-\_\@ ]/g, '');  // Allow rule: alphanumeric, space, -, _, @, (, )
        this.globalSearchService.getObjectType(sanitizedSearchText, this.resultTake, type, inactCust).pipe(takeUntil(this.destroy$)).subscribe((result) => {
            this.objTypes[type].result = result;
            this.objTypes[type].loading = false;
            //this method is added for UI to render proper. without this line the UI databinding is not happening from dashboard search screen but it will work fine for header search
            this.ref.detectChanges();
            if (this.objTypes[type].result.length == 5) {
                this.objTypes[type].viewMore = true;
            }
        }, (err) => {
            this.loggerService.error("Something went wrong.", "Error", err);
        });
    }

    getObjectTypeResult(opType: string) {
        this.gridResult = [];
        //setting loading to default true
        if (opType == "ALL") {
            this.getObjectOnly('CNTRCT');
            this.getObjectOnly('PRC_ST');
            this.getObjectOnly('PRC_TBL');
            this.getObjectOnly('WIP_DEAL');
        } else if (opType == "CNTRCT") {
            this.getObjectOnly('CNTRCT');
        } else if (opType == "PRC_ST") {
            this.getObjectOnly('PRC_ST');
        } else if (opType == "PRC_TBL") {
            this.getObjectOnly('PRC_TBL');
        } else {
            this.getObjectOnly('WIP_DEAL');
        }
    }

    txtEnterPressed(event: any) {
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13 && this.searchText != "") {
            //opening kendo window
            this.getObjectTypeResult(this.opType);
        }
    }
    
    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;
        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };
        return result;
    }
    
    onOpTypeChange(opType: string) {
        if (this.searchText != "") {
            this.opType = opType;
            this.resultTake = 5;
            this.getObjectTypeResult(this.opType);
        } else {
            this.loggerService.warn("Please Enter: (1) Contract/ Pricing Strategy / Pricing Table Name or Number OR (2) Deal Number.", "");
        }
    }

    async gotoObject(item: any, opType: string) {
        $("body").removeClass("z-index-zero");
        
        this.setLoading(true);
        this.gridResult = [];

        if (opType == 'CNTRCT') {
            const dcId = item.DC_ID;
            if (dcId <= 0) {
                this.loggerService.error("Unable to locate the Contract Details", "error");
                this.setLoading(false);
                return;
            }
            await this.fetchDetails(dcId)

        } else if (opType == 'PRC_ST') {
            const dcId = item.DC_PARENT_ID;
            if (dcId <= 0) {
                this.loggerService.error("Unable to locate the Pricing Strategy.", "error");
                this.setLoading(false);
                return;
            }
            await this.fetchDetails(dcId)

        } else if (opType == 'PRC_TBL') {
            const dcId = item.DC_ID;
            this.fetchTableData(dcId);

        } else {
            const dcId = item.DC_ID;
            //this.fetchTableData(dcId);
            //calling this function because to navigate to the PS we need contract data,PS ID and PT ID -- in the item we dont have PT ID for opType ->PS so hitting API to get data
            //in case of WIp deal click on the global search results we need contract id ,PS and PT ID to navigate to respective deal so calling this function to hit the api to get the details
            //in case of PT ID click on the global search results we need contract ID which is not present in item so calling API to get the data
            this.getIds(dcId, opType);
        }
    }

    viewMore(opType: string) {
        this.resultTake = 50;
        this.getObjectTypeResult(opType);
    }

    async fetchDetails(dcId) {
        this.setLoading(true);
        try {
            const response: any = await this.inactSvc.readInActiveCustContract(dcId).toPromise();
            let pt_ids = [];
            response[0].PRC_ST.forEach((item) => {
                item.PRC_TBL.forEach((pt) => {
                    pt_ids.push(pt.DC_ID);
                });
            });
            // Use Promise.all to fetch data for all pt_ids API in parallel
            await Promise.all(pt_ids.map(id => this.fetchTableData(id, false)));

        } catch (err) {
            this.loggerService.error("Error", "not able to load contract/PS details", err);
        } finally {
            this.setLoading(false);
        }
    }

    fetchTableData(pt_id, manageLoading = true): Promise<void> {
        if (manageLoading) {
            this.setLoading(true);
        }
        return new Promise((resolve, reject) => {
            this.inactSvc.readInActivePricingTable(pt_id).subscribe((response) => {
                response.WIP_DEAL.forEach((row) => {
                    const objHash = JSON.parse(row.OBJ_PATH_HASH);
                    row.CNTRCT_OBJ_SID = objHash.C;
                    row.PS_OBJ_SID = objHash.PS;
                    row.PT_OBJ_SID = objHash.PT;
                    row.Customer = row.CustomerDivisions[0];
                    row.CUST_MBR_SID = row.Customer.CUST_MBR_SID;
                    this.gridResult.push(row);
                });
                this.gridData = process(this.gridResult, this.state);
                if (manageLoading) {
                    this.setLoading(false);
                }
                resolve();
            }, (err) => {
                this.loggerService.error("Unable to fetch Pricing Table Details",'InactiveCutomerSearchComponent::readPricingTable::readTemplates:: service', err);
                if (manageLoading) {
                    this.setLoading(false);
                }
                reject(new Error(err));
            });
        });
    }
    
    getIds(dcId, opType = "") {
        this.setLoading(true);
        this.globalSearchService.getInActContractIDDetails(dcId, opType).pipe(takeUntil(this.destroy$)).subscribe((res) => {
            if (res) {
                const response:any = res;
                this.fetchTableData(response.PricingTableId);
            }
        }, (error) => {
            this.loggerService.error("InActiveCustomerSearchComponent::getContractIDDetails::Unable to get Contract Data", error);
            this.setLoading(false);
        });
    }

    //yet to migrate Advance Search Screen
    gotoAdvanced() {
        window.location.href = "AdvancedSearch#/advanceSearch";
    }

    public exportToExcel(): void {
        this.inactSvc.setData(true);
        GridUtil.dsToExcel(this.columns, this.gridResult, "Deal Editor Export", "InactiveCustomerSearchResult", this.inactSvc);
        this.loggerService.info("Please wait while the Excel Export completes.", "Inactive Customer Search Excel Export");    
        this.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (data) {
                this.headerMsg = 'Exporting...';
            } else {
                this.headerMsg = 'Searching...';
            }
            this.isLoading = data;
        });
    }

    private combineColumns(response: any): any[] {
        const sections = Object.keys(response);
        let combinedColumns: any[] = [];
    
        sections.forEach((section) => {
            const columns = response[section]?.columns;
            if (columns) {
                combinedColumns = combinedColumns.concat(columns);
            }
        });
        return combinedColumns;
    }

    private removeDuplicateColumns(columns: any[]): any[] {
        const uniqueColumns = [];
        const columnFields = new Set();
        columns.forEach((column) => {
          if (!columnFields.has(column.field)) {
            columnFields.add(column.field);
            uniqueColumns.push(column);
          }
        });
        return uniqueColumns;
    }

    private modifyAndOrderColumnDetails(inputCols: any[]): any[] {

        const fieldsToRemove = ['tools', 'tender_actions', 'EXCLUDE_AUTOMATION', 'PRD_BCKT'];
        // 1)Remove specified fields
        inputCols = inputCols.filter(column => !fieldsToRemove.includes(column.field));

        // 2)Add specified fields
        inputCols = inputCols.concat(this.ColFieldsToAdd);

        //3) Rename the title of the field 'CNTRCT_OBJ_SID'
        inputCols = inputCols.map(column => {
            if (column.field === 'CNTRCT_OBJ_SID') {
                return {
                    ...column,
                    title: 'Contract Id'
                };
            }
            return column;
        });

        // 4) Reorder columns
        const desiredOrder = [
            'CNTRCT_OBJ_SID', 'PS_OBJ_SID', 'PT_OBJ_SID', 'DC_PARENT_ID', 'DC_ID', 'REBATE_TYPE', 'OBJ_SET_TYPE_CD'
        ];
        const orderedColumns = [];
        const remainingColumns = [];
        inputCols.forEach(column => {
            if (desiredOrder.includes(column.field)) {
                orderedColumns.push(column);
            } else {
                remainingColumns.push(column);
            }
        });
        orderedColumns.sort((a, b) => desiredOrder.indexOf(a.field) - desiredOrder.indexOf(b.field));
        // Combine ordered columns with the remaining columns
        return orderedColumns.concat(remainingColumns);
    }

    ngOnInit() {
        this.setLoading(true);
        this.templatesSvc.readTemplates()
           .pipe(takeUntil(this.destroy$))
           .subscribe((response: any) => {
               const columnsApiResponse = response.ModelTemplates.WIP_DEAL;
               const combinedColumns = this.combineColumns(columnsApiResponse);
               const nonDuplicateColumns = this.removeDuplicateColumns(combinedColumns);
               this.columns = this.modifyAndOrderColumnDetails(nonDuplicateColumns)
               this.setLoading(false);
        }, (error) => {
               this.loggerService.error("Error Fetching Column Templates for Deal Level Details",'loadAllContractDetails::readTemplates:: service', error);
               this.setLoading(false);
        });
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    

    private setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
        //this.ref.detectChanges();
    }    
}

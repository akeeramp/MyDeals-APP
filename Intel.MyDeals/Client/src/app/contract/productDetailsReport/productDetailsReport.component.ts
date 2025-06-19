import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, SelectAllCheckboxState, ExcelExportEvent } from '@progress/kendo-angular-grid';
import { distinct, process, State } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-treeview';
import { each, uniq, filter, map, where, findWhere, unique } from 'underscore';
import { MomentService } from "../../shared/moment/moment.service";
import { orderBy } from 'lodash-es';
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import List from 'linqts/dist/src/list';
import { ProductDetailsReportService } from '../../contract/productDetailsReport/productDetailsReport.service';
import { logger } from '../../shared/logger/logger';
import { gridCol, ProdSel_Util } from './prodSel_Util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from '@progress/kendo-angular-charts/common/collection.service';
import { contractStatusWidgetService } from "../../dashboard/contractStatusWidget.service";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ExcelColumnsConfig } from '../../admin/ExcelColumnsconfig.util';
import { GridUtil } from '../grid.util';
import { Button } from '@progress/kendo-angular-buttons';

@Component({
    selector: 'product-details-report',
    templateUrl: 'Client/src/app/contract/productDetailsReport/productDetailsReport.component.html',
    styleUrls: ['Client/src/app/contract/productDetailsReport/productDetailsReport.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ProductDetailsReportComponent implements OnDestroy {

    constructor(private prodSelService: ProductDetailsReportService,
        private loggerService: logger,
        popoverConfig: NgbPopoverConfig,
        private momentService: MomentService) {
        this.allData = this.allData.bind(this);

    }

    private custDataReport: any;
    private selectedCustNamesReport:any;
    private selectedFamilyReport: Item[];
    private isDirty: boolean = false;
    private selectedCustomerIds = [];
    private selectedCUST_ACCPT: number = 0
    private productSelectionLevelList: Array<any> = [];
    private productSelectionLevelsAttributesList: Array<any> = [];
    private readonly destroy$ = new Subject();
    private gridResult: any;
    private gridData: GridDataResult;
    private isLoading = false;
    private userEnteredData: string = "";
    private trimmedUserSearch: any;
    private gridAllResult: Array<any>;
    private ProductSelReport = ExcelColumnsConfig.ProductSelReport;
    private showProcessorColumn: boolean = true;
    private showL4Column: boolean = false;
    private showMaterialIDColumn: boolean = false;
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
        {
            text: "250",
            value: 250
        },
        {
            text: "All",
            value: "all",
        }
    ];
    getProductSelection() {
        this.prodSelService.GetProductSelectorFamilyDtl()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                let response = result.ProductSelectionLevels;
                if (response) {
                    let FMLY_NM = [];
                    Object.keys(response).forEach(function (index) {
                        if (response[index].FMLY_NM != "") {
                            if (FMLY_NM.indexOf(response[index].FMLY_NM) === -1) {
                                FMLY_NM.push(response[index].FMLY_NM);
                            }
                        }
                    });

                    let familyList = [];
                    FMLY_NM.forEach(value => {
                        let objFMLY_NM = {
                            "FMLY_NM": value
                        }
                        familyList.push(objFMLY_NM);

                    });
                    this.productSelectionLevelList = familyList;
                }
            }, (error) => {
                this.loggerService.error('ProductSelectorComponent::getProductSelection::', error);
            });
    }

    onCustomerChange(selectedCustId) {
        this.isDirty = true;
        let selectedCustomersObj; 
        const selectedCustomer = this.custDataReport.find(customer => customer.CUST_SID === selectedCustId);
        if (selectedCustomer) { 
            selectedCustomersObj = [];
           selectedCustomersObj = {
                CUST_SID: selectedCustomer.CUST_SID,
                CUST_NM: selectedCustomer.CUST_NM
            };
            window.localStorage.setItem('prdReportSelectedCustNames', JSON.stringify(selectedCustomersObj));
        }
    }

    onfamilyddlChange(family) {
        this.isDirty = true;
        window.localStorage.prdReportselectedFamilyNames = JSON.stringify(family);
    }

    bntSearchProjectSelectorRpt(buttonId: string) {
        let selectedCustNamesString = window.localStorage.getItem('prdReportSelectedCustNames');
        let selectedCustomerData: any;
        let CUST_ID = "";

        try {
            if (selectedCustNamesString && selectedCustNamesString !== 'undefined') {
                selectedCustomerData = JSON.parse(selectedCustNamesString);
  
            } else {
                console.warn('CustomerName is not set or is "undefined".');
            }
        }catch (error) {
            console.error('Error parsing JSON:', error);
        }

        if (selectedCustomerData) {
            CUST_ID = selectedCustomerData.CUST_SID;
        }
        let selectedFamilyString = window.localStorage.getItem('prdReportselectedFamilyNames');
        let selectedFamily_report = [];
        let FMLY_NM = "";
        try {
            if (selectedFamilyString && selectedFamilyString !== 'undefined') {
                selectedFamily_report = JSON.parse(selectedFamilyString);
            } else {
                console.warn('selectedFamily is not set or is "undefined".');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        if (Array.isArray(selectedFamily_report) && selectedFamily_report.length > 0) {
            selectedFamily_report.forEach(function (item, index) {
                if (item && item.FMLY_NM) {
                    if (index === 0) {
                        FMLY_NM = item.FMLY_NM + ',';
                    } else {
                        FMLY_NM += item.FMLY_NM + ',';
                    }
                } else {
                    console.warn(`Item at index ${index} does not have a valid FMLY_NM.`);
                }
            });
        }
        let isValid = true;
        let InputParams: any;
        if (buttonId === 'searchReport') {
            this.userEnteredData = "";
            if (!CUST_ID) {
                this.loggerService.error("Please select Customer", "");
                isValid = false;
            }
            if (!FMLY_NM) {
                selectedFamily_report = [];
                this.loggerService.error("Please select atleast One Family Name", "");
                isValid = false;
            }
            if (this.selectedCUST_ACCPT === 0) {
                this.loggerService.error("Please select Product level", "");
                isValid = false;
            }

            InputParams = {
                CUST_ID: CUST_ID,
                FMLY_NM: FMLY_NM,
                PRD_ATRB_SID: this.selectedCUST_ACCPT,
                USER_SEARCH: '',
            };
        }
        else if (buttonId === 'searchText') {
            window.localStorage.prdReportselectedFamilyNames = null;
            if (!CUST_ID) {
                this.loggerService.error("Please select Customer", "");
                isValid = false;
            }
            if (this.selectedCUST_ACCPT === 0) {
                this.selectedFamilyReport = [];
                this.loggerService.error("Please select Product level", "");
                isValid = false;
            }
            if (CUST_ID && FMLY_NM && this.selectedCUST_ACCPT !== 0 && this.userEnteredData) {
                this.selectedFamilyReport = [];
                isValid = true;
            }
            if ((CUST_ID && FMLY_NM && this.selectedCUST_ACCPT !== 0 && !this.userEnteredData) || !this.userEnteredData) {
                this.selectedFamilyReport = [];
                this.loggerService.error("Please search by Processor number or L4 or Material ID", "");
                isValid = false;
            }
            if (this.userEnteredData) {
                this.trimmedUserSearch = this.userEnteredData.trim().replace(/\s+/g, ' ');
            }
            
            InputParams = {
                CUST_ID: CUST_ID,
                FMLY_NM: '',
                PRD_ATRB_SID: this.selectedCUST_ACCPT,
                USER_SEARCH: this.trimmedUserSearch,
            };
        }
        if (isValid) {
            this.loggerService.warn("Please wait", "");
            this.isLoading = true;

            this.prodSelService.GetProductSelectorDtl(InputParams)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (result: any) => {
                        this.isLoading = false;
                        this.gridResult = result;
                        this.gridAllResult = result;
                        this.gridData = process(this.gridResult, this.state);
                        this.gridData.data = result;
                    },
                    (error) => {
                        this.loggerService.error('ProductSelectorComponent::getProductSelection::', error);
                        this.isLoading = false;
                    }
                );
        }
        if (this.selectedCUST_ACCPT === 7006) { //PCSR_NBR column
            this.showProcessorColumn = true;
            this.showL4Column =false;
            this.showMaterialIDColumn = false;
        }
        if (this.selectedCUST_ACCPT === 7007)  { //DEAL_PRD_NM column
            this.showProcessorColumn =true;
            this.showL4Column = true;
            this.showMaterialIDColumn = false;
        }
        if (this.selectedCUST_ACCPT === 7008) { //MTRL_ID column
            this.showProcessorColumn = true;
            this.showL4Column = true;
            this.showMaterialIDColumn = true;
        }
        this.clearFilter();
    }

    bntReset() {
        this.selectedCustNamesReport = null;
        window.localStorage.prdReportSelectedCustNames = null
        this.selectedFamilyReport = [];
        window.localStorage.prdReportselectedFamilyNames = null;
        this.selectedCUST_ACCPT = 0;
        this.gridResult = [];
        this.gridData = process(this.gridResult, this.state);
        this.userEnteredData = null;
        this.showL4Column = false;
        this.showMaterialIDColumn = false;
        this.clearFilter();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.gridResult) {
            this.gridData = process(this.gridResult, this.state);
        }
    }

    clearFilter(): void {
        this.state.skip = 0;
        this.state.take = 25;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        if (this.gridResult) {
            this.gridData = process(this.gridResult, this.state);
        }
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        let newstate = {
            take: 25,
            skip: 0,
            sort: this.state.sort,
            group: this.state.group
        }
        Object.assign(excelState, newstate)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    exportToExcel() {
        if (this.gridResult) {
            this.isLoading = true;
            // Determine if "DEAL_PRD_NM" and "MTRL_ID" have non-empty values
            const hasDealPrdNm = this.gridAllResult.some(row => row["DEAL_PRD_NM"] && row["DEAL_PRD_NM"].trim() !== '');
            const hasMtrlId = this.gridAllResult.some(row => row["MTRL_ID"] && row["MTRL_ID"].trim() !== '');
            const filteredColumns = this.ProductSelReport.filter(header => {
                if (header.data === 'DEAL_PRD_NM') {
                    return hasDealPrdNm;
                }
                if (header.data === 'MTRL_ID') {
                    return hasMtrlId;
                }
                return true;
            });
            const dataToExport = this.gridAllResult.map(row => {
                const filteredRow = {};
                filteredColumns.forEach(header => {
                    filteredRow[header.data] = row[header.data];
                });
                return filteredRow;
            });
            GridUtil.dsToExcelProductDetailsReport(filteredColumns, dataToExport, "MyDealsProductDetailsReport");

            this.isLoading = false;
        }
    }

    distinctPrimitive(fieldName: string): any {
        if (!this.gridResult || !Array.isArray(this.gridResult)) {
            return [];
        }
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    ngOnInit() {
        this.getProductSelection();
        this.prodSelService.getCustomerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                if (response && response.length > 0) {
                    this.custDataReport = response;
                }
                else {
                    this.loggerService.error("No result found.", 'Error');
                }
            }, function (error) {
                this.loggerSvc.error("Unable to get Dropdown Customers.", error, error.statusText);
            });
        localStorage.clear();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next(null);
        this.destroy$.complete();
    }
}

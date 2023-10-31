import { Component, ViewEncapsulation } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { where, pluck, each, isEmpty, isNull, isUndefined } from 'underscore';
import { ThemePalette } from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { MatDialog } from '@angular/material/dialog';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { logger } from "../../shared/logger/logger";
import { meetCompService } from './admin.meetComp.service';
import { BulkUploadMeetCompModalComponent } from './admin.bulkUploadMeetCompModal.component';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: 'admin-meetcomp',
    templateUrl: 'Client/src/app/admin/meetComp/admin.meetComp.component.html',
    styleUrls: ['Client/src/app/admin/meetComp/admin.meetComp.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MeetCompComponent {
    constructor(private meetCompService: meetCompService,
                private loggerService: logger,
                public datepipe: DatePipe,
        protected dialog: MatDialog) {
        this.allData = this.allData.bind(this);
    }
    private HasBulkUploadAccess = (<any>window).usrRole == "DA";
    private isAccess = true;
    private isAccessMessage: string;
    private customers;
    private selectedCustomerID:any = -1;
    private meetCompDIMMasterData = [];
    private prodCats;
    private selectedProdCatName:any = '';
    private brands;
    private selectedBrandName:any = '';
    private disabled = false;
    private products;
    private selectedProdName:any = '';
    private meetCompMasterData = [];
    private isCustomerMissing = false;
    private isCatMissing = false;
    private filteredData = {};
    private isBrandMissing = false;
    private isBusy = false;
    private gridData: GridDataResult;
    private gridResult: Array<any> = [];
    private color: ThemePalette = "primary";
    private bulkUploadModal: boolean = false;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private readonly pageSizes: PageSizeItem[] = [
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "1000", value: 1000 }
    ];

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    };

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    distinctPrimitive(fieldName: string): any {
        if (this.gridResult.length > 0 && this.filteredData[fieldName]) {
            return this.filteredData[fieldName];
        }
        return this.gridResult;
    }

    loadMeetCompPage() {
        //Developer can see the Screen..
        if ((<any>window).usrRole != 'SA' && !(<any>window).isDeveloper && (<any>window).usrRole != 'DA' && (<any>window).usrRole != 'Legal' && ((<any>window).usrRole != 'GA' && !(<any>window).isSuper)) {
            document.location.href = "/Dashboard#/portal";
        }

        if (!((<any>window).usrRole == 'SA' || (<any>window).usrRole == 'DA' || (<any>window).usrRole == 'Legal' || ((<any>window).usrRole == 'GA' && (<any>window).isSuper))) {
            this.isAccess = false;
            this.isAccessMessage = 'You don\'t have access to view this page. Only SuperGA, DA, Legal, or SA users are allowed.';
        }
    }

    OpenBulkUploadMeetCompModal() {
        this.dialog.open(BulkUploadMeetCompModalComponent, {
            width: '797px',
            disableClose: false,
            panelClass: 'meetcomp-custom',
        });
    }

    custDropdowns() {
        this.meetCompService.getCustomerDropdowns().subscribe(res => {
            if (res) {
                const obj = {
                    'CUST_NM': 'ALL CUSTOMER',
                    'CUST_SID': -1
                }
                res.unshift(obj);
                this.customers = res;
                this.getCustomerDIMData(-1);
            }
        }, (response) => {
            this.loggerService.error("Unable to get Meet Comp Data [Customers].", response, response.statusText);
        });
    }

    getCustomerDIMData(val) {
        const CID = val;
        this.isBusy = true;
        this.meetCompService.getMeetCompDIMData(CID, 'DIM').subscribe(res => {
            this.meetCompDIMMasterData = res;
            if (this.meetCompDIMMasterData.length > 0) {
                this.prodCats = this.meetCompProdCatName();
            }
            this.isBusy = false;
        }, (response) => {
            this.loggerService.error("Unable to get Meet Comp Data [DIM Data].", response, response.statusText);
        });
    }

    custValueChange(value) {
        if ((value > 0) || (value == -1)) {
            this.selectedCustomerID = value;
            this.getCustomerDIMData(this.selectedCustomerID);
        } else {
            this.selectedCustomerID = '';
        }
        this.reset();
    }

    meetCompProdCatName() {
        if (this.selectedCustomerID > -1) {
            const RESULT = where(this.meetCompDIMMasterData, x => { x.CUST_MBR_SID == this.selectedCustomerID });
            const res = pluck(RESULT, 'PRD_CAT_NM');
            return distinct(res);
        } else if (this.selectedCustomerID == -1) {
            const res = pluck(this.meetCompDIMMasterData, 'PRD_CAT_NM')
            return distinct(res);
        }
    }

    prodCatValueChange(value) {
        if (value) {
            this.selectedProdCatName = value;
            this.brands = this.meetCompBrandName();
        } else {
            this.selectedProdCatName = '';
        }
    }

    meetCompBrandName() {
        if (this.selectedCustomerID > -1) {
            const RES = this.meetCompDIMMasterData.filter(x=>
                (x.PRD_CAT_NM == this.selectedProdCatName && x.CUST_MBR_SID == this.selectedCustomerID)
            );
            const BRANDS = pluck(RES, 'BRND_NM');
            const BRAND_NAME = distinct(BRANDS);
            if (BRAND_NAME.length == 1 && BRAND_NAME[0] == 'NA') {
                this.disabled = true;
                this.selectedBrandName = BRAND_NAME[0];
                this.products = this.meetCompProdName();
            } else {
                this.selectedBrandName = '';
                this.disabled = false;
            }
            return BRAND_NAME;
        } else if (this.selectedCustomerID == -1) {
            const RES = this.meetCompDIMMasterData.filter(x =>
                (x.PRD_CAT_NM == this.selectedProdCatName)
            );
            const BRANDS = pluck(RES, 'BRND_NM');
            const BRAND_NAME = distinct(BRANDS);
            if (BRAND_NAME.length == 1 && BRAND_NAME[0]== 'NA') {
                this.disabled = true;
                this.selectedBrandName = BRAND_NAME[0];
                this.products = this.meetCompProdName();
            } else {
                this.selectedBrandName = '';
                this.disabled = false;
            }
            return BRAND_NAME;
        }
    }

    brandNameValueChange(value) {
        if (value) {
            this.selectedBrandName = value;
            this.products=this.meetCompProdName();
        } else {
            this.selectedBrandName = '';
        }
    }

    meetCompProdName() {
        if (this.selectedCustomerID > -1) {
            const res = this.meetCompDIMMasterData.filter(x =>
                (x.PRD_CAT_NM == this.selectedProdCatName && x.CUST_MBR_SID == this.selectedCustomerID && x.BRND_NM == this.selectedBrandName));
            const prodName = pluck(res, 'HIER_VAL_NM');
            this.selectedProdName = '';
            return distinct(prodName);
        } else if (this.selectedCustomerID == -1) {
            const res = this.meetCompDIMMasterData.filter(x =>
                    (x.PRD_CAT_NM == this.selectedProdCatName && x.BRND_NM == this.selectedBrandName));
            const prodName = pluck(res, 'HIER_VAL_NM');
            this.selectedProdName = '';
            return distinct(prodName);
        }
    }

    prodNameValueChange(value) {
        if (value) {
            this.selectedProdName = value;
        }
    }

    fetchMeetCompData() {
        if (this.selectedCustomerID > 0 || this.selectedCustomerID == -1) {
            this.isCustomerMissing = false;
        }
        if (this.selectedProdCatName) {
            this.isCatMissing = false;
        }
        if (this.selectedBrandName) {
            this.isBrandMissing = false;
        }

        if (this.selectedCustomerID == '' || this.selectedCustomerID == null || this.selectedCustomerID == undefined) {
            this.resetGrid();
            this.loggerService.warn('Not a valid Customer', '');
            this.isCustomerMissing = true;
        } else if (this.selectedProdCatName == '' || this.selectedProdCatName == null || this.selectedProdCatName == undefined) {
            this.resetGrid();
            this.loggerService.warn('Not a valid Product Vertical', '');
            this.isCatMissing = true;
        } else if (this.selectedBrandName == '' || this.selectedBrandName == null || this.selectedBrandName == undefined) {
            this.resetGrid();
            this.loggerService.warn('Not a valid Brand Name', '');
            this.isBrandMissing = true;
        } else {
            this.isBusy = true;//grid data doesn't showup while landing the page, so no need of loader.
            let value = this.selectedProdName;
            if (value.length == 0) {
                value = -1;
            }
            const MEET_COMP_SEARCH = {
                "cid": this.selectedCustomerID,
                "PRD_CAT_NM": this.selectedProdCatName,
                "BRND_NM": this.selectedBrandName,
                "HIER_VAL_NM": value.toString()
            };
            this.meetCompService.getMeetCompData(MEET_COMP_SEARCH).subscribe((response: Array<any>) => {
                each(response, (item) => {
                    item['CHG_DTM'] = this.datepipe.transform(new Date(item['CHG_DTM']), 'M/d/yyyy');
                    item['CRE_DTM'] = this.datepipe.transform(new Date(item['CRE_DTM']), 'M/d/yyyy');
                    item['CHG_DTM'] = new Date(item['CHG_DTM']);
                    item['CRE_DTM'] = new Date(item['CRE_DTM']);
                });
                this.gridResult = response;
                //setting filterdata
                this.filteredData['CUST_NM'] = distinct(this.gridResult, 'CUST_NM').map(item => item['CUST_NM']);
                this.filteredData['HIER_VAL_NM'] = distinct(this.gridResult, 'HIER_VAL_NM').map(item => item['HIER_VAL_NM']);
                this.filteredData['MEET_COMP_PRD'] = distinct(this.gridResult, 'MEET_COMP_PRD').map(item => item['MEET_COMP_PRD']);
                this.filteredData['CRE_EMP_NM'] = distinct(this.gridResult, 'CRE_EMP_NM').map(item => item['CRE_EMP_NM']);
                this.filteredData['CHG_EMP_NM'] = distinct(this.gridResult, 'CHG_EMP_NM').map(item => item['CHG_EMP_NM']);
                this.filteredData['PRD_CAT_NM'] = distinct(this.gridResult, 'PRD_CAT_NM').map(item => item['PRD_CAT_NM']);
                this.isBusy = false;
                this.gridData = process(this.gridResult, this.state);
            }, (error) => {
                this.loggerService.error("Unable to get Meet Comp Data [MC Data].", '', 'meetCompComponent::fetchMeetCompData::' + JSON.stringify(error));
            });
        }
    }

    resetGrid() {
        this.gridResult = [];
        this.gridData = process(this.gridResult, this.state);
    }

    reset() {
        this.selectedProdCatName = '';
        this.selectedBrandName = '';
        this.selectedProdName = '';
        this.gridResult = [];
        this.gridData = process(this.gridResult, this.state);
    }

    //Activate/Deactivate Meet Comp Record
    gridSelectItem(dataItem, event) {
        this.isBusy = true;
        this.meetCompService.activateDeactivateMeetComp(dataItem.MEET_COMP_SID, dataItem.ACTV_IND).subscribe(res => {
            if (res[0].MEET_COMP_SID > 0) {
                this.fetchMeetCompData();
            } else {
                this.isBusy = false;
                this.loggerService.error("Activate Deactivate Meet Comp failed.",'');
            }
        }, (response) => {
            this.isBusy = false;
            this.loggerService.error("Activate Deactivate Meet Comp failed.", response, response.statusText);
        });
    }

    ngOnInit() {
        this.loadMeetCompPage();
        this.custDropdowns();
    }
}
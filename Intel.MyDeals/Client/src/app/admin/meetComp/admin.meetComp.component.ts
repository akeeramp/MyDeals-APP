import * as angular from 'angular';
import { Component, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { downgradeComponent } from "@angular/upgrade/static";
import { meetCompService } from './admin.meetComp.service';
import * as _ from "underscore";
import { ThemePalette } from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { BulkUploadMeetCompModalComponent } from './admin.bulkUploadMeetCompModal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: "admin-meetcomp",
    templateUrl: "Client/src/app/admin/meetComp/admin.meetComp.component.html",
    styleUrls: ['Client/src/app/admin/meetComp/admin.meetComp.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class meetCompComponent {
    constructor(private meetCompSvc: meetCompService, public datepipe: DatePipe, private loggerSvc: logger, protected dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
        
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
    private isBrandMissing = false;
    private isBusy = false;
    private gridData: GridDataResult;
    private gridResult: Array<any> = [];
    private color: ThemePalette = "primary";
    private bulkUploadModal: boolean = false;
    private state: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    private pageSizes: PageSizeItem[] = [
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
        }
    ];

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
        this.fetchMeetCompData();
    }
    distinctPrimitive(fieldName: string): any {
        if (this.gridResult.length > 0) {
            return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
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
            width: '770px',
            disableClose: false,
            panelClass: 'meetcomp-custom',
    
        });
    }
    custDropdowns() {
        this.meetCompSvc.getCustomerDropdowns().subscribe(res => {
            if (res) {
                const obj = {
                    'CUST_NM': 'ALL CUSTOMER',
                    'CUST_SID': -1
                }
                res.unshift(obj);
                this.customers = res;
                this.getCustomerDIMData(-1);
            }
        }, function (response) {
            this.loggerSvc.error("Unable to get Meet Comp Data [Customers].", response, response.statusText);
        });
    }
    getCustomerDIMData(val) {
        const cid = val;
        this.isBusy = true;
        this.meetCompSvc.getMeetCompDIMData(cid, 'DIM').subscribe(res => {
            this.meetCompDIMMasterData = res;
            if (this.meetCompDIMMasterData.length > 0) {
                this.prodCats = this.meetCompProdCatName();
            }
            this.isBusy = false;
        }, function (response) {
            this.loggerSvc.error("Unable to get Meet Comp Data [DIM Data].", response, response.statusText);
        });
    }
    custValueChange(value) {
        if ((value > 0) || (value == -1)) {
            this.selectedCustomerID = value;
            this.getCustomerDIMData(this.selectedCustomerID);
        }
        else {
            this.selectedCustomerID = '';
        }
        this.reset();
    }
    meetCompProdCatName() {
        if (this.selectedCustomerID > -1) {
            const result = _.where(this.meetCompDIMMasterData, x => { x.CUST_MBR_SID == this.selectedCustomerID });
            const res = _.pluck(result, 'PRD_CAT_NM' )
            return distinct(res);
        }
        else if (this.selectedCustomerID == -1) {
            const res = _.pluck(this.meetCompDIMMasterData, 'PRD_CAT_NM')
            return distinct(res);
        }
    }
    prodCatValueChange(value) {
        if (value) {
            this.selectedProdCatName = value;
            this.brands = this.meetCompBrandName();
        }
        else {
            this.selectedProdCatName = '';
        }
    }
    meetCompBrandName() {
        if (this.selectedCustomerID > -1) {
            const res = this.meetCompDIMMasterData.filter(x=>
                (x.PRD_CAT_NM == this.selectedProdCatName && x.CUST_MBR_SID == this.selectedCustomerID)
            );
            const brandsArr = _.pluck(res, 'BRND_NM');
            const brandName = distinct(brandsArr);
            if (brandName.length == 1 && brandName[0] == 'NA') {
                this.disabled = true;
                this.selectedBrandName = brandName[0];
                this.products = this.meetCompProdName();
            }
            else {
                this.selectedBrandName = '';
                this.disabled = false;
            }
            return brandName;
        }
        else if (this.selectedCustomerID == -1) {
            const res = this.meetCompDIMMasterData.filter(x =>
                (x.PRD_CAT_NM == this.selectedProdCatName)
            );
            const brandsArr = _.pluck(res, 'BRND_NM');
            const brandName = distinct(brandsArr);
            if (brandName.length == 1 && brandName[0]== 'NA') {
                this.disabled = true;
                this.selectedBrandName = brandName[0];
                this.products = this.meetCompProdName();
            }
            else {
                this.selectedBrandName = '';
                this.disabled = false;
            }
            return brandName;
        }
    }
    brandNameValueChange(value) {
        if (value) {
            this.selectedBrandName = value;
            this.products=this.meetCompProdName();
        }
        else {
            this.selectedBrandName = '';
        }
    }
    meetCompProdName() {
        if (this.selectedCustomerID > -1) {
            const res = this.meetCompDIMMasterData.filter(x =>
            (x.PRD_CAT_NM == this.selectedProdCatName && x.CUST_MBR_SID == this.selectedCustomerID &&
                x.BRND_NM == this.selectedBrandName)
            );
            const prodName = _.pluck(res, 'HIER_VAL_NM');
            this.selectedProdName = '';
            return distinct(prodName);
        }
        else if (this.selectedCustomerID == -1) {
            const res = this.meetCompDIMMasterData.filter(x =>
                (x.PRD_CAT_NM == this.selectedProdCatName && x.BRND_NM == this.selectedBrandName)
            );
            const prodName = _.pluck(res, 'HIER_VAL_NM');
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
            this.loggerSvc.warn('Not a valid Customer', '');
            this.isCustomerMissing = true;
        }
        else if (this.selectedProdCatName == '' || this.selectedProdCatName == null || this.selectedProdCatName == undefined) {
            this.resetGrid();
            this.loggerSvc.warn('Not a valid Product Vertical', '');
            this.isCatMissing = true;
        }
        else if (this.selectedBrandName == '' || this.selectedBrandName == null || this.selectedBrandName == undefined) {
            this.resetGrid();
            this.loggerSvc.warn('Not a valid Brand Name', '');
            this.isBrandMissing = true;
        }
        else {
            this.isBusy = true;//grid data doesn't showup while landing the page, so no need of loader.
            let value = this.selectedProdName;
            if (value.length == 0) {
                value = -1;
            }
            const meetCompSearch = {
                "cid": this.selectedCustomerID,
                "PRD_CAT_NM": this.selectedProdCatName,
                "BRND_NM": this.selectedBrandName,
                "HIER_VAL_NM": value.toString()
            };
            this.meetCompSvc.getMeetCompData(meetCompSearch).subscribe((response: Array<any>) => {
                this.isBusy = false;
                _.each(response, item => {
                    item['CHG_DTM'] = this.datepipe.transform(new Date(item['CHG_DTM']), 'M/d/yyyy');
                    item['CRE_DTM'] = this.datepipe.transform(new Date(item['CRE_DTM']), 'M/d/yyyy');
                    item['CHG_DTM'] = new Date(item['CHG_DTM']);
                    item['CRE_DTM'] = new Date(item['CRE_DTM']);
                })
                this.gridResult = response;
                this.gridData = process(this.gridResult, this.state);
            }, (error) => {
                this.loggerSvc.error("Unable to get Meet Comp Data [MC Data].", '', 'meetCompComponent::fetchMeetCompData::' + JSON.stringify(error));
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
        this.meetCompSvc.activateDeactivateMeetComp(dataItem.MEET_COMP_SID, dataItem.ACTV_IND).subscribe(res => {
            if (res[0].MEET_COMP_SID > 0) {
                this.fetchMeetCompData();
            }
            else {
                this.isBusy = false;
                this.loggerSvc.error("Activate Deactivate Meet Comp failed.",'');
            }
        }, function (response) {
            this.isBusy = false;
            this.loggerSvc.error("Activate Deactivate Meet Comp failed.", response, response.statusText);
        });
    }
    ngOnInit() {
        this.loadMeetCompPage();
        this.custDropdowns();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "adminMeetcomp",
    downgradeComponent({
        component: meetCompComponent,
    })
);
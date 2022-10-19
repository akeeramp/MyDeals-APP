import * as angular from "angular";
import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { dealProductsService } from "../dealProductsModal/dealProductsModal.service";
import * as _ from 'underscore';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: "deal-products",
    templateUrl: "Client/src/app/contract/ptModals/dealProductsModal/dealProductsModal.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/dealProductsModal/dealProductsModal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealProductsModalComponent {
    constructor(private loggerSvc: logger, public dialogRef: MatDialogRef<dealProductsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private dpService: dealProductsService, private clipboard: Clipboard) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    private showDealProducts: boolean = false;
    private isLoading: boolean = false;
    private gridResult = [];
    private gridData: GridDataResult;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private prdData: any;
    private prdIds: any[]= [];
    private prods = this.data.dataItem.PRODUCT_FILTER;
    private copyOfData: any;
    private excelFileName: string;
    getProductDetailsFromDealId() {
        this.dpService.getProductDetailsFromDealId(this.data.dataItem.DC_ID, this.data.dataItem.CUST_MBR_SID).subscribe((response: any) => {
            this.copyOfData = response;
            this.gridResult = response;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        }, error => {
            this.loggerSvc.error('dealProductsModalComponent::getProductDetailsFromDealId:: service', error);
            this.isLoading = false;
        });
    }
    getProductDetailsFromProductId() {
        this.dpService.getProductDetailsFromProductId(this.prdData).subscribe((response: any) => {
            this.gridResult = response;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        }, error => {
            this.loggerSvc.error('dealProductsModalComponent::getProductDetailsFromProductId:: service', error);
            this.isLoading = false;
        });
    }
    copyNoCAPProudcts (columnValue) {
        if (this.copyOfData.length == 0) {
            this.clipboard.copy("");
            return;
        }
        let noCAPProducts = this.copyOfData.filter(function (x) {
            return x.CAP === null || x.CAP == "No CAP" || x.CAP === "";
        });
        if (noCAPProducts.length == 0) {
            this.clipboard.copy("No prodcuts were found without CAP");
            return;
        }
        noCAPProducts = noCAPProducts.filter(
            (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
        );
        let noCAPProdNames = noCAPProducts.map(function (x) {
            return x[columnValue];
        }).join(',');
        this.clipboard.copy(noCAPProdNames);
        return;
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    ok() {
        this.dialogRef.close();
    }
    ngOnInit() {
        try{
            this.isLoading = true;
            this.showDealProducts = this.data.dataItem.OBJ_SET_TYPE_CD == 'VOL_TIER' || this.data.dataItem.OBJ_SET_TYPE_CD == 'PROGRAM' || this.data.dataItem.OBJ_SET_TYPE_CD == 'FLEX' ||
                this.data.dataItem.OBJ_SET_TYPE_CD == 'REV_TIER' || this.data.dataItem.OBJ_SET_TYPE_CD == 'DENSITY';
            if (this.data.dataItem._contractPublished !== undefined && this.data.dataItem._contractPublished == 1) {
                this.prods = this.data.dataItem.products;
                if(this.prods && this.prods.length>0){
                    _.each(this.prods, (value) => {
                        this.prdIds.push(parseInt(value.PRD_MBR_SID));
                    });
                }
            } else {
                if(this.prods && this.prods.length>0){
                    _.each(this.prods, (value) => {
                        this.prdIds.push(parseInt(value));
                    });
                }
            }
            if(this.data.dataItem.OBJ_SET_TYPE_CD == 'ECAP' && !this.showDealProducts){
                this.prods = this.data.dataItem.products;
                this.prdIds =[];
                if(this.prods && this.prods.length>0){ 
                    for(let i=0;i< this.prods.length; i++){
                        this.prdIds.push(this.prods[i].PCSR_NBR);
                    }     
                }
            }
            this.prdData = {
                "PrdIds": this.prdIds
            }
            this.excelFileName = "Deal " + this.data.dataItem.DC_ID + " Product Export.xlsx";
            if (this.showDealProducts) {
                this.getProductDetailsFromDealId();
            } else {
                this.getProductDetailsFromProductId();
            }
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('DealProductsModal::ngOnInit::',ex);
        }
     
    }
}
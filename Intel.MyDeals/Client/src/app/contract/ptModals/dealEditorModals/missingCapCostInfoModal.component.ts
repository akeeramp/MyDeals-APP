import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"; 
import { State, process } from "@progress/kendo-data-query";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid"; 
import { pricingTableEditorService } from "../../pricingTableEditor/pricingTableEditor.service";
import { logger } from "../../../shared/logger/logger";
@Component({
    selector: "missing-cap-cost-info",
    templateUrl: "Client/src/app/contract/ptModals/dealEditorModals/missingCapCostInfoModal.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/dealEditorModals/dealEditorModals.component.css'],
 })
export class missingCapCostInfoModalComponent {
    constructor(public dialogRef: MatDialogRef<missingCapCostInfoModalComponent>, private loggerSvc: logger,
        @Inject(MAT_DIALOG_DATA) public data, private pteService: pricingTableEditorService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    hasPermissionPrice: boolean;
    public fileName: string; 
    isLoading: boolean;
    private gridResult = [];
    private gridData: GridDataResult; 
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
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loaddata();

    }

    loaddata() {
        this.hasPermissionPrice = (<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal" || ((<any>window).usrRole === "SA" && (<any>window).isSuper);
        this.isLoading = true;
        const userVerticals = (<any>window).usrVerticals.split(",");
        this.fileName = "Deal " + this.data.DC_ID + " Missing CAP / Cost Products.xlsx";
        this.pteService.GetDealProducts(this.data.DC_ID, this.data.CUST_MBR_SID).subscribe((response: any) => {
            if (response != null && response != undefined) {
                this.gridResult = response;
                this.isLoading = false;
                if (!this.hasPermissionPrice) {
                    for (let d = 0; d < this.gridResult.length; d++) {
                        if (this.gridResult[d].PRD_COST !== "No Cost" && this.gridResult[d].PRD_COST !== "NA") {
                            this.gridResult[d].PRD_COST = "No access";
                        }
                    }
                }
                if (this.hasPermissionPrice && userVerticals.length > 0) {
                    for (let d = 0; d < this.gridResult.length; d++) {
                        if (userVerticals.indexOf(this.gridResult[d].PRD_CAT_NM) === -1 && (this.gridResult[d].PRD_COST !== "No Cost" && this.gridResult[d].PRD_COST !== "NA")) {
                            this.gridResult[d].PRD_COST = "No access";
                        }
                    }
                }
                this.gridData = process(this.gridResult, this.state);
            }
        }, error => {
            this.loggerSvc.error('Error in retriving product details', error);
        });
    }

    cancel() {
        this.dialogRef.close();
    }

    ngOnInit() {
       this.loaddata();
    }
}
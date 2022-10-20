import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { overLappingDealsService } from "./overLapping.service";
import { OverlappingCheckComponent } from "../ptModals/overlappingCheckDeals/overlappingCheckDeals.component";
import { MatDialog } from "@angular/material/dialog";


@Component({
    selector: "overlapping-deals",
    templateUrl :"Client/src/app/contract/overLappingDeals/overLapping.component.html",
    styleUrls: ['Client/src/app/contract/overLappingDeals/overLapping.component.css']
})

export class overLappingDealsComponent {
    S_ID: any;
    constructor(private overLappingDealsSvc: overLappingDealsService, protected dialog: MatDialog, private loggerSvc: logger) {
        //pls dont remove this even it its not as part of the route this is to handle condtions when we traverse between contract details with in manage tab
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    private isLoading = true;
    private loadMessage = "Looking for Overlapping Deals";
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    private state: State = {
        skip: 0,
        take: 50,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];
    public contractId: number;
    public contractDetails: any;
    filterOverLapData(data){
        let hasResolved = false;
        let cnt = 0;
        let isSelected = false;
        // data.forEach((element) => {
        // });
    }
    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    getOverlapDetails() {
        this.contractId = this.contractData.DC_ID;
        this.overLappingDealsSvc.getOverLappingDealsDetails(this.contractId).subscribe((result: any) => {
            console.log(result.Data);
            this.isLoading = false;
            this.gridResult = result.Data;
            let groups = [{ field: "PROGRAM_PAYMENT" },
                {field: "WIP_DEAL_OBJ_SID" }];
            // this.filterOverLapData(this.gridResult);
            this.state.group = groups;
            console.log(this.state);
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('OverLapDeals service', error);
        });
        this.overLappingDealsSvc.readContract(this.contractId).subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        },(err)=>{
            this.loggerSvc.error("Unable to get contract data","Error",err);
        });
        this.S_ID = this.contractData.CUST_MBR_SID;

        this.overLappingDealsSvc.getCustomerVendors(this.S_ID).subscribe(
            (result: Array<any>) => {
                console.log(result);
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Customer Vendors.",
                    response,
                    response.statusText
                );
            }
        );

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
    openOverLappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.contractData,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            data: data,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    ngOnInit() {
        this.getOverlapDetails();
    }


}

angular.module("app").directive(
    "overLappingDeals",
    downgradeComponent({
        component: overLappingDealsComponent,
    })
);

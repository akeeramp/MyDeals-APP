import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
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
    private isNoDealsFound: boolean = false;
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
    }
    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    getOverlapDetails() {
        this.contractId = this.contractData.DC_ID;
        this.overLappingDealsSvc.getOverLappingDealsDetails(this.contractId).subscribe((result: any) => {
            this.loadMessage = "Done";
            this.gridResult = result.Data;
            if (this.gridResult.length == 0) {
                this.isNoDealsFound = true;
            }
            else {
                this.isNoDealsFound = false;
            }
            let groups = [{ field: "PROGRAM_PAYMENT" },
                {field: "WIP_DEAL_OBJ_SID" }];
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
            setTimeout(()=>{
                this.isLoading = false;
            }, 500);
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
            panelClass: 'overlapping_fix'

        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    ngOnInit() {
        this.getOverlapDetails();
    }


}


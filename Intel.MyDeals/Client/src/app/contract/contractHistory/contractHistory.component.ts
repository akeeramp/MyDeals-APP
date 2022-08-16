import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { contractHistoryService } from "./contractHistory.service";


@Component({
    selector: "contract-history",
    templateUrl :"Client/src/app/contract/contractHistory/contractHistory.component.html",
})

export class contractHistoryComponent {
    constructor(private contractHistorySvc: contractHistoryService, private loggerSvc: logger) {
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    private isLoading = true;
    private loadMessage = "Loading Contract History";
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
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

    loadContractHistory() {
        let objTypeSid = 1;
        let contractId = this.contractData.DC_ID;
        let objTypeIds = [1, 2, 3, 4, 5];
        this.contractHistorySvc.getTimelineDetails(contractId,objTypeIds, objTypeSid).subscribe((result: Array<any>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('contract History service', error);
        });
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
    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    ngOnInit() {
        this.loadContractHistory();
    }

}

angular.module("app").directive(
    "contractHistory",
    downgradeComponent({
        component: contractHistoryComponent,
    })
);

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { logger } from "../../shared/logger/logger";
import { complexStackingservice } from "./complexStacking.service";


@Component({
    selector: 'complex-stacking',
    templateUrl: 'Client/src/app/contract/complexStacking/complexStacking.component.html',
    styleUrls: ['Client/src/app/contract/complexStacking/complexStacking.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ComplexStackingComponent implements OnInit, OnDestroy {

    contractId: string;
    refreshPage: boolean;
    isComplexStackingLoading = false;
    userRole = "";
    isPSExpanded = [];
    pricingStrategyFilter;
    constructor(private loggerSvc: logger,
        protected dialog: MatDialog,
        private complexStackingSvc: complexStackingservice,
    ) { }

    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() PS_ID: any;
    @Input() WIP_ID: any;
    @Output() refreshedContractData = new EventEmitter<any>();
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() isDirty = new EventEmitter<any>();

    private readonly destroy$ = new Subject<void>();
    private spinnerMessageHeader = "Loading Complex Stacking";
    private spinnerMessageDescription = "Please wait while we load Complex Stacking details.";

    refreshGrid() {
        this.refreshPage = true;
        this.isPSExpanded = []; 
    }
    async loadContractDetails() {
        this.isComplexStackingLoading = true;
        const response: any = await this.complexStackingSvc.readContract(this.contractId).toPromise().catch((error) => {
            this.isComplexStackingLoading = false;
            this.loggerSvc.error('Get Upper Contract service', error);
        });
        if (response && response.length > 0) {
            this.contractData = response[0];
            if ( this.contractData.PRC_ST && this.PS_ID)
                this.contractData.PRC_ST = this.contractData.PRC_ST.filter(x => x.DC_ID == this.PS_ID);
            this.refreshedContractData.emit({ contractData: this.contractData });
            this.refreshGrid();
            this.contractId = this.contractData.DC_ID;
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = false;
            });
        }
        this.isComplexStackingLoading = false;
        this.pricingStrategyFilter = this.contractData?.PRC_ST;
    }

    IsCSReviewed(cmplxReviewedBy) {
        const USER_ROLE = (<any>window).usrRole;
        if (USER_ROLE === "DA" && cmplxReviewedBy === "2") {
            return true;
        }
        if (USER_ROLE !== "DA" && (cmplxReviewedBy === "1" || cmplxReviewedBy === "2")) {
            return true;
        }
        return false;
    }
    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.contractId = this.contractData.DC_ID;
        this.pricingStrategyFilter = this.contractData?.PRC_ST;
        this.loadContractDetails();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
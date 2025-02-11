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

    constructor(private loggerSvc: logger,
        protected dialog: MatDialog,
        private complexStackingSvc: complexStackingservice,
    ) { }

    public isLoading: boolean;
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() isTenderDashboard: boolean = false;//will recieve true when PCT Used in Tender Dashboard Screen
    @Input() PS_ID: any;
    @Input() WIP_ID: any;
    @Output() refreshedContractData = new EventEmitter<any>();
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() isDirty = new EventEmitter<any>();
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    public isPctLoading = false;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {};
    private pctFilter = "";
    public pricingStrategyFilter;
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;


    refreshGrid() {
        this.refreshPage = true;
        this.isAllCollapsed = true;
        this.isPSExpanded = []; this.isPTExpanded = {};
    }
    async loadPctDetails() {
        this.isPctLoading = true;
        const response: any = await this.complexStackingSvc.readContract(this.contractId).toPromise().catch((error) => {
            this.isPctLoading = false;
            this.loggerSvc.error('Get Upper Contract service', error);
        });
        if (response && response.length > 0) {
            this.contractData = response[0];
            if (this.isTenderDashboard && this.contractData.PRC_ST && this.PS_ID)//PCT screen of Tender Dashboard displays only particular PS not all
                this.contractData.PRC_ST = this.contractData.PRC_ST.filter(x => x.DC_ID == this.PS_ID);
            this.refreshedContractData.emit({ contractData: this.contractData });
            this.refreshGrid();
            this.contractId = this.contractData.DC_ID;
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = false;
                if (this.isTenderDashboard)//PCT screen of Tender Dashboard data needs to be expanded on load
                    this.isPSExpanded[i] = true;
                if (x.PRC_TBL != undefined) {
                    x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
                    if (this.isTenderDashboard) {//PCT screen of Tender Dashboard data needs to be expanded on load
                        x.PRC_TBL.forEach((y) => { this.isPTExpanded[y.DC_ID] = true;  });
                    }
                }
            });
        }
        this.isPctLoading = false;
        if (this.pctFilter != "") {
            this.pricingStrategyFilter = this.contractData?.PRC_ST.filter(x => x.COST_TEST_RESULT == this.pctFilter);
        }
        else {
            this.pricingStrategyFilter = this.contractData?.PRC_ST;
        }
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
        if (this.isTenderDashboard) {//If PCT screen triggered from Tender Dashboard, all datas needs to be expanded
            this.isAllCollapsed = false;
        }
        this.loadPctDetails();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
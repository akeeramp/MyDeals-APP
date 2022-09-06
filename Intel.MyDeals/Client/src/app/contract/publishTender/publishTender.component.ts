import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { publishTenderService } from './publishTender.service'
import { pricingTableservice } from "../pricingTable/pricingTable.service";

@Component({
    selector: "publish-tender",
    templateUrl: "Client/src/app/contract/publishTender/publishTender.component.html",
    styleUrls: ["Client/src/app/contract/publishTender/publishTender.component.css"]
})

export class publishTenderComponent {
    constructor(private pricingTableSvc: pricingTableservice, private publishtenderService: publishTenderService, private loggerSvc: logger ) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    public c_Id: any = '';
    public showMCTag = false;
    public spinnerMessageHeader: string;
    public spinnerMessageDescription: string;
    public msgType: string;
    public isDataLoading: boolean = false;
    public exlusionList = [];
    public contractData: any = {};

    publishTenderDeal() {
        this.setBusy("Publishing deals", "Converting into individual deals. Then we will redirect you to Tender Dashboard.", 'Publishing');
        this.publishtenderService.publishTenderDeals(this.contractData.DC_ID, this.exlusionList).subscribe((response) => {
            if (response) {
                this.setBusy("Published deals Successfully", "Redirecting to Tender Dashboard", "Success");
                window.location.href = "/advancedSearch#/tenderDashboard";
                return;
            }
            else {
                this.loggerSvc.error("Error", "Publishing deals failed. Contact Administrator.");
            }
        })
    }

    getContract() {
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            this.contractData = response[0];
        }, (error) => {
            this.loggerSvc.error('getContractDetails::readContract:: service', error);
        })
    }
    setBusy(msg, detail, msgType) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isDataLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                return;
            }
            this.isDataLoading = newState;
            if (this.isDataLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                }, 100);
            }
        });
    }

    ngOnInit() {
        const url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
        this.getContract();
    }

}
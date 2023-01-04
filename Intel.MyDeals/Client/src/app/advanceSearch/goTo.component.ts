import { Component } from "@angular/core";
import { logger } from "../shared/logger/logger";
import * as _ from "underscore";
import { globalSearchResultsService } from "../advanceSearch/globalSearchResults/globalSearchResults.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "goto-route",
    template: `<loading-panel-angular id="gotoLoading" style="z-index:500;" [show]="isLoading" [header]="spinnerMessageHeader"
    [description] = "spinnerMessageDescription"[isShowFunFact] = "isBusyShowFunFact"[msgType] = "msgType" > </loading-panel-angular>`
})

export class goToComponent {
    public isLoading: boolean = true;
    public spinnerMessageHeader: any;
    public spinnerMessageDescription: any;
    public msgType: any;
    public isBusyShowFunFact: any;
    constructor(private loggerSVC: logger, protected globalSearchSVC: globalSearchResultsService, private route: ActivatedRoute) { }
    async redirecttoroute() {
         const id = this.route.snapshot.paramMap.get('cid');
        const path = this.route.snapshot.url.filter(x => x.path == 'gotoDeal' || x.path == 'gotoPs')[0].path;
        const msg = 'Searching Deal' + id + '....';
        this.isLoading = true;
        this.setBusy('Searching', msg);
        //goto Pricing Strategy
        if (path == 'gotoPs') {
            let response: any = await this.globalSearchSVC.getContractIDDetails(id, 'PRC_ST').toPromise().catch((error) => {
                this.isLoading = false;
                this.setBusy('', '');
                this.loggerSVC.error("GlobalSearchResultsComponent::getContractIDDetails::Unable to get Contract Data", error);
            });
            if (response) {
                this.isLoading = false;
                this.setBusy('', '');
                window.location.href = "#/contractmanager/PS/" + response.ContractId + '/' + response.PricingStrategyId + '/' + response.PricingTableId + '/0'; 
            }
        } else {
            //goto Deal
            let response: any = await this.globalSearchSVC.getContractIDDetails(id, 'WIP_DEAL').toPromise().catch((error) => {
                this.isLoading = false;
                this.setBusy('', '');
                this.loggerSVC.error("GlobalSearchResultsComponent::getContractIDDetails::Unable to get Contract Data", error);
            });
            this.isLoading = false;
            this.setBusy('', '');
            window.location.href = "#/contractmanager/WIP/" + response.ContractId + "/" + response.PricingStrategyId + "/" + response.PricingTableId + "/" + response.WipDealId + "?searchTxt=" + response.WipDealId;
        }
    }

    setBusy(msg, detail, msgType = "", showFunFact = false) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    ngOnInit() {
        this.redirecttoroute();
    }
}
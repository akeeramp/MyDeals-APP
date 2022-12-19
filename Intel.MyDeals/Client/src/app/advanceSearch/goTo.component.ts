import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from "../shared/logger/logger";
import * as _ from "underscore";
import { globalSearchResultsService } from "../advanceSearch/globalSearchResults/globalSearchResults.service";

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
    constructor(private loggerSVC: logger, protected globalSearchSVC: globalSearchResultsService) { }
    async redirecttoroute() {
        const url = window.location.href.split('/');
        let index = url.includes('gotoPS') ? url.indexOf('gotoPS') : url.indexOf('gotoDeal');
        let id = parseInt(url[index + 1]);
        let msg = 'Searching Deal' + id + '....';
        this.isLoading = true;
        this.setBusy('Searching', msg);
        let response: any = await this.globalSearchSVC.getContractIDDetails(id, 'WIP_DEAL').toPromise().catch((error) => {
            this.isLoading = false;
            this.setBusy('', '');
            this.loggerSVC.error("GlobalSearchResultsComponent::getContractIDDetails::Unable to get Contract Data", error);
        });
        this.isLoading = false;
        this.setBusy('', '');
        //goto Pricing Strategy
        if (url[index] == 'gotoPS') {
            window.location.href = "#/contractmanager/PT/" + response.ContractId + '/' + response.PricingStrategyId + '/' + response.PricingTableId + '/' + response.WipDealId;
        } else {
            //goto Deal
            window.location.href = "#/contractmanager/WIP/" + response.ContractId + '/' + response.PricingStrategyId + '/' + response.PricingTableId + '/' + response.WipDealId;
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
angular.module("app").directive(
    "gotoRoute",
    downgradeComponent({
        component: goToComponent,
    })
);
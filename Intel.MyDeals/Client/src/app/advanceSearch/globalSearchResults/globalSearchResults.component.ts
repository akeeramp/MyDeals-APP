/* eslint-disable no-useless-escape */
import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { globalSearchResultsService } from "./globalSearchResults.service";
import { logger } from "../../shared/logger/logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'global-search-results-angular',
  templateUrl: 'Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.html',
  styleUrls:['Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.css']
})
export class GlobalSearchResultsComponent implements OnDestroy {

    constructor(protected globalSearchService: globalSearchResultsService,
                private loggerService: logger,
                private ref: ChangeDetectorRef) {}
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    //these are input coming from gloablsearch component
    @Input() searchText = "";
    response: any
    @Input() opType = "ALL";
    @Output() getWindowWidth = new EventEmitter;
    @Output() isWindowOpen = new EventEmitter;
    private resultTake = 5;
    private viewMoreVisible = true;
    public isLoading: boolean;
    private readonly opTypes: Array<any> = [
        { value: "ALL", label: "All" },
        { value: "CNTRCT", label: "Contract" },
        { value: "PRC_ST", label: "Pricing Strategy" },
        { value: "PRC_TBL", label: "Pricing Table" },
        { value: "WIP_DEAL", label: "Deals" }
    ];
    private objTypes: any = {
        'CNTRCT': { result:[], loading:true, viewMore:false },
        'PRC_ST': { result:[], loading:true, viewMore:false },
        'PRC_TBL': { result:[], loading:true, viewMore:false },
        'WIP_DEAL': { result:[], loading:true, viewMore:false }
    };

    getObjectOnly(type: string) {
        this.objTypes[type].loading = true;
        this.objTypes[type].viewMore = false;

        const sanitizedSearchText: string = this.searchText.replace(/[^a-zA-Z0-9\(\)\-\_\@ ]/g, '');  // Allow rule: alphanumeric, space, -, _, @, (, )
        this.globalSearchService.getObjectType(sanitizedSearchText, this.resultTake, type).pipe(takeUntil(this.destroy$)).subscribe((result) => {
            this.objTypes[type].result = result;
            this.objTypes[type].loading = false;
            //this method is added for UI to render proper. without this line the UI databinding is not happening from dashboard search screen but it will work fine for header search
            this.ref.detectChanges();
            if (this.objTypes[type].result.length == 5) {
                this.objTypes[type].viewMore = true;
            }
        }, (err) => {
            this.loggerService.error("Something went wrong.", "Error", err);
        });
    }

    getObjectTypeResult(opType: string) {
        //setting loading to default true
        if (opType == "ALL") {
            this.getObjectOnly('CNTRCT');
            this.getObjectOnly('PRC_ST');
            this.getObjectOnly('PRC_TBL');
            this.getObjectOnly('WIP_DEAL');
        } else if (opType == "CNTRCT") {
            this.getObjectOnly('CNTRCT');
        } else if (opType == "PRC_ST") {
            this.getObjectOnly('PRC_ST');
        } else if (opType == "PRC_TBL") {
            this.getObjectOnly('PRC_TBL');
        } else {
            this.getObjectOnly('WIP_DEAL');
        }
    }

    txtEnterPressed(event: any) {
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13 && this.searchText != "") {
            //opening kendo window
            this.getObjectTypeResult(this.opType);
        }
    }

    windowResize() {
        if (this.opType == "ALL") {
            this.getWindowWidth.emit(950);
        } else {
            this.getWindowWidth.emit(565);
        }
    }

    onOpTypeChange(opType: string) {
        if (this.searchText != "") {
            this.opType = opType;
            this.resultTake = 5;
            this.windowResize();
            this.getObjectTypeResult(this.opType);
        } else {
            this.loggerService.warn("Please Enter: (1) Contract/ Pricing Strategy / Pricing Table Name or Number OR (2) Deal Number.", "");
        }
    }

    gotoObject(item: any, opType: string) {
        $("body").removeClass("z-index-zero");
        let dcId = item.DC_ID
        this.isWindowOpen.emit(false);

        if (dcId <= 0) {
            this.loggerService.error("Unable to locate the Pricing Strategy.", "error")
            return;
        }

        if (opType == 'CNTRCT') {
            window.location.href = "Contract#/manager/CNTRCT/" + dcId + "/0/0/0";
        } else if (opType == 'PRC_ST' || opType == 'PRC_TBL' || opType == 'WIP_DEAL') {
            //calling this function because to navigate to the PS we need contract data,PS ID and PT ID -- in the item we dont have PT ID for opType ->PS so hitting API to get data
            //in case of WIp deal click on the global search results we need contract id ,PS and PT ID to navigate to respective deal so calling this function to hit the api to get the details
            //in case of PT ID click on the global search results we need contract ID which is not present in item so calling API to get the data
            this.getIds(dcId, item.DC_PARENT_ID, opType)
        }
    }

    viewMore(opType: string) {
        this.resultTake = 50;
        this.getObjectTypeResult(opType);
    }

    getIds(dcId, parentDcId, opType = "") {
        this.isLoading = true;
        this.globalSearchService.getContractIDDetails(dcId, opType).pipe(takeUntil(this.destroy$)).subscribe((res) => {
                this.isLoading = false;
                if (res) {
                    this.response = res;
                    if (opType == "WIP_DEAL")
                        window.location.href = "Contract#/gotoDeal/" + dcId;
                    else if (opType == "PRC_ST")
                        window.location.href = "Contract#/gotoPs/" + this.response.PricingStrategyId;
                    else window.location.href = "Contract#/manager/PT/" + this.response.ContractId + "/" + parentDcId + "/" + dcId + "/0";
                }
            }, (error) => {
                this.loggerService.error("GlobalSearchResultsComponent::getContractIDDetails::Unable to get Contract Data", error);
                this.isLoading = false;
            }
        );
    }

    //yet to migrate Advance Search Screen
    gotoAdvanced() {
        this.isWindowOpen.emit(false);
        window.location.href = "AdvancedSearch#/advanceSearch";
    }

    ngOnInit() {
        this.getObjectTypeResult(this.opType);
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

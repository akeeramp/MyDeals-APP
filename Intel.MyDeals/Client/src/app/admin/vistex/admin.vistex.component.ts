import { logger } from "../../shared/logger/logger";
import { dsaService } from "./admin.vistex.service";
import { Component, OnDestroy } from "@angular/core";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { MomentService } from "../../shared/moment/moment.service";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "admin-vistex",
    templateUrl: "Client/src/app/admin/vistex/admin.vistex.component.html",
    styleUrls: ['Client/src/app/admin/vistex/admin.vistex.component.css']
})

export class adminVistexComponent implements PendingChangesGuard, OnDestroy {

    constructor(private loggerSvc: logger, private dsaService: dsaService, private momentService: MomentService) { }

    //Declaration Part
    isDirty = false;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private spinnerMessageHeader = "Test your API";
    private spinnerMessageDescription = "Please wait while we are running your API..";
    private isBusyShowFunFact = true;
    private isLoading = false;
    private selectedApiID = 1;
    private selectedApiCD = "";
    private apiList = [
       // { API_ID: 1, API_NM: "Customer ", API_CD: "C" },              //Disabling the customer dropdown, later it would be enabled for IAO testing.
        { API_ID: 2, API_NM: "Deal ", API_CD: "D" },
        { API_ID: 3, API_NM: "Product ", API_CD: "P" },
        { API_ID: 4, API_NM: "Product Vertical", API_CD: "V" },
        { API_ID: 5, API_NM: "Tender Return", API_CD: "R" },
        { API_ID: 6, API_NM: "Deal Failed", API_CD: "E" },
        { API_ID: 7, API_NM: "Prod Vertical Failed", API_CD: "F" },
        { API_ID: 7, API_NM: "Consumption Data", API_CD: "M" },
        //{ API_ID: 8, API_NM: "Claim Data", API_CD: "L" },
        { API_ID: 9, API_NM: "Tender Deals", API_CD: "T" },
        { API_ID: 10, API_NM: "IQR Consumption Data", API_CD: "N" }
    ];

    public defaultItem = { API_ID: null, API_NM: "Select an API..." };

    public itemDisabled(itemArgs: { dataItem: any, index: number }) {
        return itemArgs.dataItem.API_ID === null;
    }

    private apiSelectedCD = "";
    private responseData = [];
    private numberOfRecrods = 10;
    private btnText = 'Show more ';

    //API KEY Value Pair
    private apiPair = {
        // "C": 'GetVistexDFStageData',          //Disabling the customer dropdown, later it would be enabled for IAO testing.
        "D": 'GetVistexDealOutBoundData',
        "P": 'GetVistexDFStageData',
        "V": 'GetVistexDFStageData',
        "R": 'ReturnSalesForceTenderResults',
        "E": 'GetVistexDealOutBoundData',
        "F": 'GetVistexDealOutBoundData',
        "M": 'GetVistexDealOutBoundData',
        //"L": 'GetVistexDealOutBoundData',
        "T": 'ExecuteSalesForceTenderData',
        "N": 'GetVistexDealOutBoundData'
    };

    vistexApiNameChange(value: string): void {
        this.apiSelectedCD = value;
    }

    //run API
    runApi(): void {
        if (this.selectedApiCD == "") {
            this.loggerSvc.info('Please select an API to run Simulator...', "");
        }
        else {
            this.callAPI(this.selectedApiCD);
        }
    }

    //Call the API
    callAPI(mode: string): void {
        this.isLoading = true;
        const startTime = this.momentService.moment(new Date()).format('YYYY-MM-DD HH:mm:ss UTC');

        this.dsaService.callAPI(this.apiPair[this.selectedApiCD], mode).pipe(takeUntil(this.destroy$)).subscribe((result) => {
            this.isLoading = false;
            this.isDirty = false;
            if (this.selectedApiCD == "R" || this.selectedApiCD == "T") {
                if (result) {
                    this.loggerSvc.success('Transaction was successful...');
                } else {
                    this.loggerSvc.error('DANG!! Something went wrong...', '');
                }
            } else {
                const endTime = this.momentService.moment(new Date()).format('YYYY-MM-DD HH:mm:ss UTC');
                result["START_TIME"] = startTime;
                result["END_TIME"] = endTime;
                this.responseData.unshift(result);
                this.loggerSvc.success('Transaction was successful...');
            }
        }, (error) => {
            this.loggerSvc.error('Unable to run API', error);
            this.isLoading = false;
        });
    }


    valuechange(): void {
        this.isDirty = true;
    }
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
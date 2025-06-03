import { logger } from "../../shared/logger/logger";
import { dsaService } from "./admin.vistex.service";
import { constantsService } from "../constants/admin.constants.service";
import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Cnst_Map } from "../constants/admin.constants.model";

@Component({
    selector: "admin-vistex-profisee-api",
    templateUrl: "Client/src/app/admin/vistex/admin.vistexProfiseeAPI.component.html",
    styleUrls: ['Client/src/app/admin/vistex/admin.vistex.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class adminVistexProfiseeApiComponent implements OnDestroy {
    constructor(private loggerSvc: logger, private dsaService: dsaService, private constantsService: constantsService) { }

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private customerToSend = '';
    private selectedApiID = '';
    private vistexApiNames = [
        { API_ID: 1, API_NM: "Yes", API_CD: "1" },
        { API_ID: 2, API_NM: "No", API_CD: "0" }
    ];
    private hasAccess = false;
    private validWWID: string;

    checkAcess(): void {
        this.constantsService.getConstantsByName("PRF_MRG_EMP_ID").pipe(takeUntil(this.destroy$)).subscribe((data: Cnst_Map) => {
            if (data) {
                this.validWWID = data.CNST_VAL_TXT === "NA" ? "" : data.CNST_VAL_TXT;
                this.hasAccess = this.validWWID.indexOf((<any>window).usrDupWwid) > -1 ? true : false;
                if (this.hasAccess == false) {
                    window.alert("User does not have access to the screen. Press OK to redirect to Dashboard.");
                    document.location.href = "/Dashboard#/portal";
                }
            }
        }, (error) => {
            this.loggerSvc.error("Unable to get Eomployee Id", error)
        });
    }
    runProfiseeAPI(): void {
        if (this.customerToSend != "" && this.customerToSend != null) {
            this.dsaService.callProfiseeApi(this.customerToSend, this.selectedApiID).pipe(takeUntil(this.destroy$)).subscribe((response: boolean) => {
                if (response == true) {
                    this.loggerSvc.success("Customer Migrated to profisee");
                } else {
                    this.loggerSvc.warn("Something went wrong...", "");
                }
            }, () => {
                this.loggerSvc.warn("Something went wrong...", "");
            });
        } else {
            this.loggerSvc.warn("Please select Customer name", "");
        }
    }

    ngOnInit(): void {
        this.checkAcess();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
import { Component, Input, Output, EventEmitter,OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "linqts";
import { Subject } from "rxjs";
import { constantsService } from "../../admin/constants/admin.constants.service";
import { ExcelColumnsConfig } from "../../admin/ExcelColumnsconfig.util";
import { GridUtil } from "../../contract/grid.util";
import { logger } from "../../shared/logger/logger";
import { reportingService } from "../reporting.service";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-power-bi-search",
    templateUrl: "Client/src/app/reporting/powerBISearch/powerBISearch.component.html",
    styleUrls: ['Client/src/app/reporting/reporting.component.css']
})
export class PowerBISearchComponent implements OnInit {
    private isLoading: string;
    private ReportName: Array<any> = [];
    private getReportCatagory: any;
    private masterData: any;
    private readonly destroy$ = new Subject<void>();
    private getReportSubCatagory: any;
    public checkUsrEmail = false;
    public isEligibleToViewPrdDtl = false;
    private GetReportMissingCostDataColumn = ExcelColumnsConfig.GetReportMissingCostDataExcel;
    private GetReportNewProductMissingCostDataColumn = ExcelColumnsConfig.GetReportNewProductMissingCostDataExcel;
    private GetGetUCMReportDataColumn = ExcelColumnsConfig.GetUCMReportDataDataExcel;

    constructor(private reportingSvc: reportingService, private loggerSvc: logger, private constantsSvc: constantsService, private router: Router) { }

    loadPowerBI() {
        this.isLoading = 'true';
        this.reportingSvc.getReportData()
            .pipe(takeUntil(this.destroy$)).subscribe(response => {
                this.masterData = response; // changing to see all values
                this.ReportName = this.masterData["ReportName"]
                //Only RA, SA will have access to Unified Customer Management Report
                if ((<any>window).usrRole != "SA" &&
                    (<any>window).usrRole != "RA" &&
                    !((<any>window).isSuper || (<any>window).isDeveloper)
                ) {
                    this.ReportName = this.ReportName.filter(
                        x => x.RPT_UNIQ_NM != "Unified Customer Management Report"
                    );
                }
                //Only RA, SA will have access to Unified Customer Management Report
                if ((<any>window).usrRole != "SA" &&
                    !((<any>window).isSuper || (<any>window).isDeveloper)
                ) {
                    this.ReportName = this.ReportName.filter(
                        x => x.RPT_UNIQ_NM != "iCost report"
                    );
                }

                //Only RA, SA will have access to Unified Customer Management Report
                if ((<any>window).usrRole != "SA" &&
                    !((<any>window).isSuper || (<any>window).isDeveloper)
                ) {
                    this.ReportName = this.ReportName.filter(
                        x => x.RPT_UNIQ_NM != "New Product Missing Cost Report"
                    );
                }
                let reportName = new List<any>(this.ReportName);
                //Report Name Group
                this.getReportCatagory = reportName
                    .Select(x => ({ CTGR_NM: x.CTGR_NM }))
                    .Distinct()
                    .ToArray();

                //Report SUb Catagory
                this.getReportSubCatagory = reportName
                    .Select(x => ({ CTGR_NM: x.CTGR_NM, SUB_CTGR_NM: x.SUB_CTGR_NM }))
                    .Distinct()
                    .ToArray();
                this.isLoading = 'false';
            });
        this.checkAccess();
    }
    downloadICostReport() {
        this.loggerSvc.warn("Please wait downloading inprogress", "");
        this.reportingSvc.GetReportMissingCostData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response && response.length > 0) {
                    GridUtil.dsToExcelReport(this.GetReportMissingCostDataColumn, response, "missingCostData");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data", "");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }
    downloadGetReportNewProductMissingCostData() {
        this.reportingSvc.GetReportNewProductMissingCostData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response) {
                    GridUtil.dsToExcelReportNewProductMissingCostData(this.GetReportNewProductMissingCostDataColumn, response, "New Product Missing Cost Report");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data", "");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }
    downloadUCMReportData() {
        this.loggerSvc.warn("Please wait downloading inprogress", "");
        this.reportingSvc.GetUCMReportData().pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response) {
                    GridUtil.dsToExcelGetUCMReportData(this.GetGetUCMReportDataColumn, response, "UCMReport");
                    this.loggerSvc.success("Successfully downloaded the report data");
                } else {
                    this.loggerSvc.error("Unable to Download Report Data", "");
                }
            }, (error) => {
                this.loggerSvc.error("Unable to Download Report Data", error);
            })
    }
    checkAccess() {
        //only whose email is added under NEW_ACCOUNT_REVIEWER_Worldwide & with Developer Bit can acccess the screen
        this.constantsSvc.getConstantsByName("NEW_ACCOUNT_REVIEWER_Worldwide").pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                const adminEmailIDs = response.CNST_VAL_TXT === "NA" ? "" : response.CNST_VAL_TXT;
                this.checkUsrEmail = adminEmailIDs.indexOf((<any>window).usrEmail) > -1 ? true : false;
                if ((this.checkUsrEmail && (<any>window).isDeveloper) || (this.checkUsrEmail && !(<any>window).isDeveloper) || (!this.checkUsrEmail && (<any>window).isDeveloper)) {
                    this.isEligibleToViewPrdDtl = true;
                    this.ReportName = this.ReportName.filter(x => x.RPT_UNIQ_NM == "Product Details Report");
                }
                else {
                    this.isEligibleToViewPrdDtl = false;
                }
            });

    }
    ngOnInit() {
        this.loadPowerBI();
    }
}    
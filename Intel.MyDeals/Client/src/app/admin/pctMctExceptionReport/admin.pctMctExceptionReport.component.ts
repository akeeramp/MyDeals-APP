import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { takeUntil, map, catchError } from "rxjs/operators";
import { utils, writeFileXLSX, WritingOptions } from "xlsx";
import { pingService } from '../../core/core.shared.service';
import { logger } from "../../shared/logger/logger";
import { PctMctExceptionReportService } from "./admin.pctMctExceptionReport.service";
import { constantsService } from "../constants/admin.constants.service";
import { MomentService } from "../../shared/moment/moment.service";
import { PctMctFailureException } from "./pctMctFailureException.model";

@Component({
    selector: 'pct-mct-exception-report',
    templateUrl: "Client/src/app/admin/pctMctExceptionReport/admin.pctMctExceptionReport.component.html",
    styleUrls: ["Client/src/app/admin/pctMctExceptionReport/admin.pctMctExceptionReport.component.css"]
})
export class PctMctExceptionReportComponent implements OnInit, OnDestroy {

    private readonly destroy$ = new Subject();
    private readonly CUR_YEAR = new Date().getFullYear();
    private readonly MIN_YEAR = this.CUR_YEAR - 5;
    private readonly MAX_YEAR = this.CUR_YEAR + 5;
    public batchInProgress = false;
    private currentReportResults: Array<PctMctFailureException> = undefined;
    private readonly bDestroy$ = new Subject<void>();
    constructor(private pctMctExceptionReportService: PctMctExceptionReportService,
                private constantsService: constantsService,
                private loggerService: logger,
                private pingSvc: pingService,
                private momentService: MomentService,
                private changeDetectorRef: ChangeDetectorRef) { }

    private isLoading: boolean = false;

    private startYearValue = this.CUR_YEAR - 1;
    private startQuarterValue = 1;
    private endYearValue = this.CUR_YEAR;
    private endQuarterValue = 1;
    private includeCurrentResult = false;
    private hasAccess = false;
    private validWWID: string;
    private executePCTMCT = false;
    private calculatedQuarters: string = '';
    private isYearQuarterSelectionInvalid = false;
    private isDeveloperFlag = (<any>window).isDeveloper;

    private calculateQuarters(startYear: number, startQuarter: number, endYear: number, endQuarter: number): string {
        let builtResponse: string = '';

        for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
            const startQ = (currentYear === startYear) ? startQuarter : 1;
            const endQ = (currentYear === endYear) ? endQuarter : 4;
    
            for (let currentQuarter = startQ; currentQuarter <= endQ; currentQuarter++) {
                builtResponse += `${currentYear}Q${currentQuarter}, `;
            }
        }

        return builtResponse.slice(0, -2); // Remove the trailing comma and space
    }

    private updateSelectedQuarters(): void {
        this.calculatedQuarters = '';

        if (this.endYearValue < this.startYearValue) {
            this.calculatedQuarters = 'The END year cannot be before the START year';
            this.isYearQuarterSelectionInvalid = true;
        } else if (this.endYearValue == this.startYearValue) {
            if (this.endQuarterValue < this.startQuarterValue) {
                this.calculatedQuarters = 'The END quarter cannot be before the START quarter';
                this.isYearQuarterSelectionInvalid = true;
            } else if (this.endQuarterValue != this.startQuarterValue && this.includeCurrentResult) {
                this.calculatedQuarters = 'To get current PCT/MCT result select only one quarter';
                this.isYearQuarterSelectionInvalid = true;
            } else {
                this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
                this.isYearQuarterSelectionInvalid = false;
            }
        } else if (this.endYearValue != this.startYearValue && this.includeCurrentResult) {
            this.calculatedQuarters = 'To get current PCT/MCT result select only one quarter';
            this.isYearQuarterSelectionInvalid = true;
        } else {
            this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
            this.isYearQuarterSelectionInvalid = false;
        }
    }

    getUserRole(): string {
        return (<any>window).usrRole;
    }

    async checkAccess() {
        const allowedUserRole = ['Legal'];
        if (allowedUserRole.includes(this.getUserRole()) || this.isDeveloperFlag) {
            this.executePCTMCT = true;
        } else {
            const response = await this.constantsService.getConstantsByName("RERUN_PCT_MCT_RPT_CNST_EMP_ID").toPromise().catch(error => {
                this.loggerService.error("Unable to fetch Employee Id", error, error.statusText);
            });
            if (response) {
                this.validWWID = response.CNST_VAL_TXT === "NA" ? "" : response.CNST_VAL_TXT;
                this.hasAccess = this.validWWID.indexOf((<any>window).usrDupWwid) > -1;
                if (this.hasAccess) {
                    this.executePCTMCT = true;
                }
            } 
        }
    }

    private hasExecuteRun: boolean = false;
    private executeReportLookup(): void {
        this.hasExecuteRun = true;
        this.isLoading = true;
        this.changeDetectorRef.detectChanges();

        const START_YEAR_QUARTER: string = `${ this.startYearValue }0${ this.startQuarterValue }`;
        const END_YEAR_QUARTER: string = `${this.endYearValue}0${this.endQuarterValue}`;

        this.checkBatch().subscribe(batchStatus => {
            if (batchStatus && this.includeCurrentResult) {
                this.includeCurrentResult = false;
                this.batchInProgress = true;
                this.loggerService.error('Batch jobs are running, please try again later. Meanwhile you can download report without PCT/MCT run check', "PCT/MCT Exception");
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
            } else {
                this.pctMctExceptionReportService.GetPctMctFailureData(START_YEAR_QUARTER, END_YEAR_QUARTER, this.includeCurrentResult)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((result: Array<PctMctFailureException>) => {
                        if (this.includeCurrentResult) {
                            this.currentReportResults = result;
                        } else {
                            this.currentReportResults = result.map(item => {
                                const filteredItem = { ...item };
                                delete filteredItem.Current_Product_Cost;
                                delete filteredItem.Current_CAP;
                                delete filteredItem.Current_YCS2;
                                delete filteredItem.Current_MAX_RPU;
                                delete filteredItem.Current_Lowest_Net_Price;
                                delete filteredItem.Current_Price_Cost_Test_Result;
                                delete filteredItem.Current_Average_Net_Price;
                                delete filteredItem.Current_Meet_Comp_Test_Result;
                                return filteredItem;
                            });
                        }
                        this.exportDataToExcel();

                        setTimeout(() => {
                            this.isLoading = false;
                            this.changeDetectorRef.detectChanges();
                        }, 250);
                    }, (error) => {
                        this.loggerService.error('PCT/MCT Exception Service', error);
                        this.isLoading = false;
                        this.changeDetectorRef.detectChanges();
                    });
            }
        });
    }

    validateQtr(e) {
        const tmp = e.target.checked;
        if (tmp && this.calculatedQuarters.split(',').length > 1) {
            this.calculatedQuarters = 'To get current PCT/MCT result select only one quarter';
            this.isYearQuarterSelectionInvalid = true;
        } else {
            this.updateSelectedQuarters();
        }
    }

    private get generateReportFilename(): string {
        return `MyDeals_PCT-MCT_Failed_Report_${ this.startYearValue }Q${ this.startQuarterValue }-${ this.endYearValue }Q${ this.endQuarterValue }_${ this.momentService.moment().format('MMDDYYYY_HHmm') }.xlsx`;
    }

    // Using 'XLSX / SheetJS' dependency
    private exportDataToExcel(): void {
        if (this.currentReportResults != undefined && this.currentReportResults.length > 0) {
            // This is to handle NULL values in Excel document
            // For specific fields (date and user fields), we want empty strings instead of "#NULL!"
            const NULL_CLEANUP_REPORT_RESULTS = JSON.parse(JSON.stringify(this.currentReportResults)
                                                        .replace(/"PCT_MCT_Skip_User":null/g, `"PCT_MCT_Skip_User":""`)
                                                        .replace(/"PCT_MCT_Skip_Date":null/g, `"PCT_MCT_Skip_Date":""`)
                                                        .replace(/"Geo_Approved_Date":null/g, `"Geo_Approved_Date":""`)
                                                        .replace(/"Division_Approved_Date":null/g, `"Division_Approved_Date":""`)
                                                        .replace(/""/g, `""`)
                                                        .replace(/null/g, `"#NULL!"`));
           
            const SORTED_HEADER = ['Contract_ID', 'Deal_ID', 'Deal_Type', 'Deal_Stage', 'Deal_Start_Date', 'Deal_End_Date', 'Forcast_Alt_Id', 'Deal_Product_Processor_Number', 'Product_Bucket', 'Market_Segment', 'Geo', 'Payout_Based_On', 'Program_Payment', 'Cost_Type', 'Rebate_Type', 'Group_type', 'CAP', 'MAX_RPU', 'YCS2', 'ECAP_Price', 'Retail_Pull_Dollar', 'Product_Cost', 'Lowest_Net_Price', 'Price_Cost_Test_Result', 'Meet_Comp_Price', 'Average_Net_Price', 'Meet_Comp_Test_Result', 'Division_Approver', 'Division_Approved_Date', 'Geo_Approver', 'Geo_Approved_Date', 'Deal_Created_By', 'Deal_Created_Date', 'Customer', 'Ceiling_Volume', 'PCT_MCT_Skip', 'PCT_MCT_Skip_Date', 'PCT_MCT_Skip_User'];
            const FINAL_HEADER_TEXT = ['Contract_ID', 'Deal_ID', 'Deal_Type', 'Deal_Stage', 'Deal_Start_Date', 'Deal_End_Date', 'Forcast_Alt_Id', 'Deal_Product_Processor_Number', 'Product_Bucket', 'Market_Segment', 'Geo', 'Payout_Based_On', 'Program_Payment', 'Cost_Type', 'Rebate_Type', 'Group_type', 'CAP', 'MAX_RPU', 'YCS2', 'ECAP_Price', 'Retail_Pull_Dollar', 'Product_Cost', 'Lowest_Net_Price', 'Price_Cost_Test_Result', 'Meet_Comp_Price', 'Average_Net_Price', 'Meet_Comp_Test_Result', 'Division_Approver', 'Division_Approved_Date', 'Geo_Approver', 'Geo_Approved_Date', 'Deal_Created_By', 'Deal_Created_Date', 'Customer', 'Ceiling_Volume', 'PCT_MCT_Skip', 'PCT_MCT_Skip_Date', 'PCT_MCT_Skip_User'];

            if (this.includeCurrentResult) {
                SORTED_HEADER.push('Current_Product_Cost', 'Current_CAP', 'Current_YCS2', 'Current_MAX_RPU', 'Current_Lowest_Net_Price', 'Current_Price_Cost_Test_Result', 'Current_Average_Net_Price', 'Current_Meet_Comp_Test_Result');
                FINAL_HEADER_TEXT.push('Current_Product_Cost', 'Current_CAP', 'Current_YCS2', 'Current_MAX_RPU', 'Current_Lowest_Net_Price', 'Current_Price_Cost_Test_Result', 'Current_Average_Net_Price', 'Current_Meet_Comp_Test_Result');
            }
            //const COLUMN_WIDTHS = [{ wch: 10 },{ wch: 20 },{ wch: 16 },{ wch: 14 },{ wch: 28 },{ wch: 12 },{ wch: 14 },{ wch: 12 },{ wch: 16 },{ wch: 14 },{ wch: 10 },{ wch: 16 },{ wch: 12 },{ wch: 30 },{ wch: 16 },{ wch: 20 },{ wch: 16 },{ wch: 20 },{ wch: 16 },{ wch: 16 },{ wch: 16 },{ wch: 16 }];

            const SHEET = utils.aoa_to_sheet([[]]);
            utils.sheet_add_aoa(SHEET, [FINAL_HEADER_TEXT], { origin: 'A1' });
            utils.sheet_add_json(SHEET, NULL_CLEANUP_REPORT_RESULTS, { origin: 'A2', header: SORTED_HEADER, skipHeader: true });
            //SHEET["!cols"] = COLUMN_WIDTHS;

            const WB = utils.book_new(SHEET);
            const WB_OPTIONS: WritingOptions = {
                compression: true,
            };

            writeFileXLSX(WB, this.generateReportFilename, WB_OPTIONS);
        } else {
            this.loggerService.warn('', 'No data to export');
        }
    }

    checkBatch(): Observable<boolean> {
        return this.pingSvc.getBatchStatus().pipe(
            takeUntil(this.bDestroy$),
            map(output => {
                return output.CNST_VAL_TXT !== undefined &&
                    output.CNST_VAL_TXT.toUpperCase() !== "COMPLETED";
            }),
            catchError((err) => {
                this.loggerService.error("checkBatch Error", "Error", err);
                return of(false);
            })
        );
    }

    ngOnInit(): void {
        this.checkBatch().subscribe(batchStatus => {
            if (batchStatus) {
                this.batchInProgress = true;
            } else {
                this.batchInProgress = false;
            }
        });
        this.checkAccess();
        this.updateSelectedQuarters();
    }

    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

}
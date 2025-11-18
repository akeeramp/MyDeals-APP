import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { utils, writeFileXLSX, WritingOptions } from "xlsx";

import { logger } from "../../shared/logger/logger";
import { PctMctExceptionReportService } from "./admin.pctMctExceptionReport.service";
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

    private currentReportResults: Array<PctMctFailureException> = undefined;

    constructor(private pctMctExceptionReportService: PctMctExceptionReportService,
                private loggerService: logger,
                private momentService: MomentService,
                private changeDetectorRef: ChangeDetectorRef) { }

    private isLoading: boolean = false;

    private startYearValue = this.CUR_YEAR - 1;
    private startQuarterValue = 1;
    private endYearValue = this.CUR_YEAR;
    private endQuarterValue = 1;
    private calculatedQuarters: string = '';
    private isYearQuarterSelectionInvalid = false;

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
            } else {
                this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
                this.isYearQuarterSelectionInvalid = false;
            }
        } else {
            this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
            this.isYearQuarterSelectionInvalid = false;
        }
    }

    private hasExecuteRun: boolean = false;
    private executeReportLookup(): void {
        this.hasExecuteRun = true;
        this.isLoading = true;
        this.changeDetectorRef.detectChanges();

        const START_YEAR_QUARTER: string = `${ this.startYearValue }0${ this.startQuarterValue }`;
        const END_YEAR_QUARTER: string = `${ this.endYearValue }0${ this.endQuarterValue }`;

        this.pctMctExceptionReportService.GetPctMctFailureData(START_YEAR_QUARTER, END_YEAR_QUARTER)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<PctMctFailureException>) => {
                this.currentReportResults = result;
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

            const SORTED_HEADER = ['Contract_ID', 'Deal_ID', 'Deal_Type', 'Deal_Stage', 'Deal_Start_Date', 'Deal_End_Date', 'Forcast_Alt_Id', 'Deal_Product_Processor_Number', 'Product_Bucket', 'Market_Segment', 'Geo', 'Payout_Based_On', 'Program_Payment', 'Cost_Type', 'Rebate_Type', 'Group_type', 'CAP', 'MAX_RPU', 'YCS2', 'ECAP_Price', 'Retail_Pull_Dollar', 'Product_Cost', 'Lowest_Net_Price', 'Price_Cost_Test_Result', 'Meet_Comp_Price', 'Avrrage_Net_Price', 'Meet_Comp_Test_Result', 'Division_Approver', 'Division_Approved_Date', 'Geo_Approver', 'Geo_Approved_Date', 'Deal_Created_By', 'Deal_Created_Date', 'Customer', 'Ceiling_Volume', 'PCT_MCT_Skip', 'PCT_MCT_Skip_Date','PCT_MCT_Skip_User'];
            const FINAL_HEADER_TEXT = ['Contract_ID', 'Deal_ID', 'Deal_Type', 'Deal_Stage', 'Deal_Start_Date', 'Deal_End_Date', 'Forcast_Alt_Id', 'Deal_Product_Processor_Number', 'Product_Bucket', 'Market_Segment', 'Geo', 'Payout_Based_On', 'Program_Payment', 'Cost_Type', 'Rebate_Type', 'Group_type', 'CAP', 'MAX_RPU', 'YCS2', 'ECAP_Price', 'Retail_Pull_Dollar', 'Product_Cost', 'Lowest_Net_Price', 'Price_Cost_Test_Result', 'Meet_Comp_Price', 'Avrrage_Net_Price', 'Meet_Comp_Test_Result', 'Division_Approver', 'Division_Approved_Date', 'Geo_Approver', 'Geo_Approved_Date', 'Deal_Created_By', 'Deal_Created_Date', 'Customer', 'Ceiling_Volume', 'PCT_MCT_Skip', 'PCT_MCT_Skip_Date', 'PCT_MCT_Skip_User'];
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

    ngOnInit(): void {
        this.updateSelectedQuarters();
    }

    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

}
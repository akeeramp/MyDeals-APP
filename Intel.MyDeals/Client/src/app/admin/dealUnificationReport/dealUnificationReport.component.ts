/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AfterViewInit, ChangeDetectorRef, Component } from "@angular/core";
import Handsontable from "handsontable";
import { HotTableRegisterer } from "@handsontable/angular";
import { ColumnSettings, GridSettings } from "handsontable/settings";
import { utils, WorkBook, WorkSheet, writeFileXLSX, WritingOptions } from "xlsx";

import { DealUnificationReportService } from "./dealUnificationReport.service";
import { logger } from "../../shared/logger/logger";
import { HandsonLicenseKey } from "../../shared/config/handsontable.licenseKey.config";
import { MomentService } from "../../shared/moment/moment.service";

@Component({
    selector: 'deal-unification-report',
    templateUrl: 'Client/src/app/admin/dealUnificationReport/dealUnificationReport.component.html',
    styleUrls: ['Client/src/app/admin/dealUnificationReport/dealUnificationReport.component.css']
})
export class DealUnificationReportComponent implements AfterViewInit {

    private currentUcdReportResults: Array<unknown> = undefined;

    // Handsontable - Uncomment to Enable
    // private readonly HOT_ID = 'bulkUploadValueTable';
    // private hotRegisterer = new HotTableRegisterer();
    // private hotTable: Handsontable;
    // private hotTableData: Array<unknown> = [];
    // private initializeHandsontableInstance(): void {
    //     this.hotTable = this.hotRegisterer.getInstance(this.HOT_ID);
    // }
    // private hotSettings: GridSettings = {
    //     licenseKey: HandsonLicenseKey.license,
    //     height: '70vh',
    //     stretchH: 'last',
    //     comments: false,
    //     wordWrap: true,
    //     preventOverflow: 'horizontal',
    //     rowHeaders: true,
    //     readOnly: true,
    //     afterInit: () => {
    //         if (!this.hotTable || this.hotTable === null || this.hotTable === undefined) {
    //             this.initializeHandsontableInstance();
    //         }
    //     }
    // };

    private isLoading: boolean = false;

    constructor(private dealUnificationReportService: DealUnificationReportService,
                private loggerService: logger,
                private momentService: MomentService,
                private changeDetectorRef: ChangeDetectorRef) {}

    private getDealUnificationReport(): void {
        this.isLoading = true;
        this.changeDetectorRef.detectChanges();

        this.dealUnificationReportService.getUnificationDealReport().subscribe((result: Array<any>) => {
            this.currentUcdReportResults = result;

            this.exportDataToExcel();

            // this.updateHotGridData(this.currentUcdReportResults);    // To enable Handsontable grid

            setTimeout(() => {
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
            }, 250);
        }, (error) => {
            this.loggerService.error('', 'Issue getting UCD Report');
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    // Uncomment to Enable Handsontable grid
    // private updateHotGridData(newGridData: Array<unknown>): void {
    //     // Update Column Config
    //     const HEADER_SPLIT: Array<ColumnSettings> = Object.keys(this.currentUcdReportResults[0]).map((fieldName: string) => {
    //         const SPLIT_FIELD_NAME = fieldName.split('_').join(' ');

    //         return {
    //             data: fieldName,
    //             title: SPLIT_FIELD_NAME
    //         }
    //     });

    //     this.hotTable.batch(() => {
    //         this.hotTable.updateSettings({
    //             columns: HEADER_SPLIT
    //         });
    //         this.hotTable.loadData(newGridData);
    //     });
    // }

    private get generateReportFilename(): string {
        // Example: `MyDeals_IQR_ Deals Unified Data_08212024_1004PST.xlsx`
        return `MyDeals_IQR_Deals Unified Data_${ this.momentService.moment().format('MMDDYYYY_HHmm') }.xlsx`;
    }

    // Using 'XLSX / SheetJS' dependency
    private exportDataToExcel(): void {
        if (this.currentUcdReportResults != undefined && this.currentUcdReportResults.length > 0) {
            const SORTED_HEADER = ['Customer_Name','Deal_Id','Quote_Line_Id','Deal_Type','Rebate_Type','Deal_Created_Date','Deal_Start_Date','Deal_End_Date','Payout_Based_On','Program_Payment','Group_Type','Deal_Geo','Deal_Stage','Is_Unified','RPL_Status_Code','End_Customer_Retail','End_Customer_Country_Region','Unified_Global_Customer_ID','Unified_Customer_Name','Unified_Customer_Country_ID','GEO_APPROVED_BY'];
            const FINAL_HEADER_TEXT = ['Customer Name','Deal Id','Quote Line Id','Deal Type','Rebate Type','Deal Created Date','Deal Start Date','Deal End Date','Payout Based On','Program Payment','Group Type','Deal Geo','Deal Stage','Is Unified','RPL Status Code','End Customer Retail','End Customer Country Region','Unified Global Customer ID','Unified Customer Name','Unified Customer Country ID','Geo Approved By'];
            const COLUMN_WIDTHS = [{ wch: 16 },{ wch: 8 },{ wch: 18 },{ wch: 10 },{ wch: 12 },{ wch: 24 },{ wch: 16 },{ wch: 16 },{ wch: 16 },{ wch: 16 },{ wch: 20 },{ wch: 10 },{ wch: 12 },{ wch: 10 },{ wch: 38 },{ wch: 100 },{ wch: 28 },{ wch: 26 },{ wch: 100 },{ wch: 28 },{ wch: 16 }];

            const SHEET = utils.aoa_to_sheet([[]]);
            utils.sheet_add_aoa(SHEET, [FINAL_HEADER_TEXT], { origin: 'A1' });
            utils.sheet_add_json(SHEET, this.currentUcdReportResults, { origin: 'A2', header: SORTED_HEADER, skipHeader: true });
            SHEET["!cols"] = COLUMN_WIDTHS;

            const WB = utils.book_new(SHEET);
            const WB_OPTIONS: WritingOptions = {
                compression: true,
            };

            writeFileXLSX(WB, this.generateReportFilename, WB_OPTIONS);
        } else {
            this.loggerService.warn('', 'No data to export');
        }
    }

    private get showResults(): boolean {
        return (this.currentUcdReportResults != undefined && this.currentUcdReportResults.length > 0);
    }

    ngAfterViewInit(): void {
        // this.getDealUnificationReport(); // To enable Handsontable grid
    }

}
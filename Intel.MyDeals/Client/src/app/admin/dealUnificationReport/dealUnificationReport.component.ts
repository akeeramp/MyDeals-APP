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

    // Handsontable POC
    private readonly HOT_ID = 'bulkUploadValueTable';
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
    private hotTableData: Array<unknown> = [];
    private initializeHandsontableInstance(): void {
        this.hotTable = this.hotRegisterer.getInstance(this.HOT_ID);
    }
    private hotSettings: GridSettings = {
        licenseKey: HandsonLicenseKey.license,
        height: '70vh',
        stretchH: 'last',
        comments: false,
        wordWrap: true,
        preventOverflow: 'horizontal',
        rowHeaders: true,
        readOnly: true,
        afterInit: () => {
            if (!this.hotTable || this.hotTable === null || this.hotTable === undefined) {
                this.initializeHandsontableInstance();
            }
        }
    };

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

    private updateHotGridData(newGridData: Array<unknown>): void {
        // Update Column Config
        const HEADER_SPLIT: Array<ColumnSettings> = Object.keys(this.currentUcdReportResults[0]).map((fieldName: string) => {
            const SPLIT_FIELD_NAME = fieldName.split('_').join(' ');

            return {
                data: fieldName,
                title: SPLIT_FIELD_NAME
            }
        });

        this.hotTable.batch(() => {
            this.hotTable.updateSettings({
                columns: HEADER_SPLIT
            });
            this.hotTable.loadData(newGridData);
        });
    }

    private get generateReportFilename(): string {
        // Example: `MyDeals_IQR_ Deals Unified Data_08212024_1004PST.xlsx`
        return `MyDeals_IQR_Deals Unified Data_${ this.momentService.moment().format('MMDDYYYY_HHmm') }.xlsx`;
    }

    // Using 'XLSX / SheetJS' dependency
    private exportDataToExcel(): void {
        if (this.currentUcdReportResults != undefined && this.currentUcdReportResults.length > 0) {
            const WORKSHEET: WorkSheet = utils.json_to_sheet(this.currentUcdReportResults);

            // Create Human Readable Column Titles
            const HEADER_SPLIT: string[] = Object.keys(this.currentUcdReportResults[0]).map((fieldName: string) => {
                return fieldName.split('_').join(' ');
            });

            // Update Header Row
            utils.sheet_add_aoa(WORKSHEET, [HEADER_SPLIT], { origin: "A1" });

            // Calculate Column Widths
            const COLUMN_WIDTHS: Array<unknown> = [];
            for (const FIELD of Object.keys(this.currentUcdReportResults[0])) {
                const COLUMN_MAX_WIDTH: number = this.currentUcdReportResults.reduce((previousValue: number, currentValue: any) => {
                    if (currentValue[FIELD] == undefined || currentValue[FIELD] == null || typeof currentValue[FIELD] == 'number') {
                        return 10;
                    } else {
                        return Math.max(previousValue, currentValue[FIELD].length);
                    }
                }, 10) as number;

                COLUMN_WIDTHS.push({ wch: COLUMN_MAX_WIDTH });
            }
            WORKSHEET["!cols"] = COLUMN_WIDTHS;

            const WORKBOOK: WorkBook = utils.book_new(WORKSHEET);
            const WB_OPTIONS: WritingOptions = {
                compression: true,
            };

            writeFileXLSX(WORKBOOK, this.generateReportFilename, WB_OPTIONS);
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
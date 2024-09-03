import { Component, OnDestroy } from "@angular/core";
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { Subject } from "rxjs";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { ExcelColumnsConfig } from "../../admin/ExcelColumnsconfig.util";
import { logger } from "../../shared/logger/logger";
import { MatDialog } from "@angular/material/dialog";
import { SdmMasterDataModalComponent } from "../sdmMasterDataModal/sdmMasterDataModal.component";
import { HandsonLicenseKey } from '../../shared/config/handsontable.licenseKey.config';
import {sdmService} from '../sdm.service'
import { GridUtil } from "../../contract/grid.util";
@Component({
    selector: "sdm-bulkupload",
    templateUrl: "Client/src/app/sdm/sdmBulkUpload/sdmBulkUpload.component.html",
    styleUrls: ["Client/src/app/sdm/sdmBulkUpload/sdmBulkUpload.component.css"]
})

export class sdmBulkUploadComponent implements OnDestroy {

    constructor(private loggerSvc: logger,
        protected dialog: MatDialog,
        private sdmService: sdmService) { }

    private hotRegisterer = new HotTableRegisterer();
    private hotEnable = false;
    private isDownloadData = false;
    private showWarningDialog = false;
    private isDownload = false;
    private columnProperties = ExcelColumnsConfig.SDMBulkCopyColumns;
    private readonly destroy$ = new Subject();
    private hotId = "spreadsheet";
    private hotTable: Handsontable;
    private uploadSaveUrl: any = "/FileAttachments/ExtractBulkSDMFile";
    private SDMErrorData: any;
    private isError = false;
    private isBusy = false;
    private files: any = [];
    public fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/RPDCycleTemplate";
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        colHeaders: this.getColHeaders(),
        autoWrapCol: true,
        minRows: 1,
        maxRows: 50,
        rowHeaderWidth: 20,
        width: '97vw',
        height: '60vh',
        stretchH: 'all',
        columns: this.getColumns(),
        rowHeaders: true,
        copyPaste: true,
        comments: true,
        manualColumnResize: true,
        cells: (row, col, prop) => {
            if (col == ExcelColumnsConfig.SDMBulkCopyColHeaders.length - 1) {
                return { className: 'error-cell-rpd' };
            }
        },
        afterGetColHeader: (col, TH) => {
            TH.style.fontWeight = 'bold';
            if (col === ExcelColumnsConfig.SDMBulkCopyColHeaders.length - 1) {
                TH.style.border = 'solid red 1px';
                TH.style.color = 'red';
            }
        },
        licenseKey: HandsonLicenseKey.license,
    };

    getColHeaders() {// for getting column headers from config file
        return ExcelColumnsConfig.SDMBulkCopyColHeaders;
    }

    getColumns() {// for getting column meta-data from config file
        return ExcelColumnsConfig.SDMBulkCopyColumns;
    }

    onFileUploadComplete() {
        //removing the uploaded doc on error
        if (this.isError) {
            let element = document.getElementsByClassName('k-file') as HTMLCollectionOf<HTMLElement>;
            if (element.length > 0) {
                this.files = [];
                element[0].remove();
            }
        }
        this.isError = false;
    }
    onFileUploadError(e) {
        this.isBusy = false;
        this.files = [];
        this.loggerSvc.error("Unable to upload attachment.", "Upload failed");
    }

    myRestrictions: FileRestrictions = {
        allowedExtensions: ["xlsx"],
    };

    successEventHandler(e) {
        this.isBusy = false;
        this.SDMErrorData = e.response.body;
        this.hotEnable = false;
        if (this.SDMErrorData == 'SUCCESS') {
            this.hotEnable = false;
            this.loggerSvc.success("Successfully uploaded attachment.", "Upload successful");
        } else if (this.SDMErrorData == 'Fail') {
            this.isError = true;
            this.loggerSvc.error("Invalid file. Please upload valid data.", "Upload Failed");
        } else if (this.SDMErrorData.ParamName && this.SDMErrorData.ParamName == "Limit Exceeded") {
            this.isError = true;
            this.loggerSvc.error("Limit Exceeded. Please upload only 2000 records.", "Upload Failed");
        } else {
            this.isError = true;
            this.SDMErrorData.forEach(element => {
                element.CURR_STRT_DT = element.CURR_STRT_DT && new Date(Number(element.CURR_STRT_DT.split('(')[1].split(')')[0])).toLocaleDateString() == '1/1/1' ? "" : new Date(Number(element.CURR_STRT_DT.split('(')[1].split(')')[0])).toLocaleDateString();
                element.CURR_END_DT = element.CURR_END_DT && new Date(Number(element.CURR_END_DT.split('(')[1].split(')')[0])).toLocaleDateString() == '1/1/1' ? "" : new Date(Number(element.CURR_END_DT.split('(')[1].split(')')[0])).toLocaleDateString();
            })
            this.loggerSvc.error("One or more records have invalid/empty data.", "Upload Failed");
            setTimeout(() => {
                this.generateTableData();
                this.isDownloadData = true;
            })
            
        }
    }    

    setErrorCell(rowInd, colInd) {//setting error cell
        this.hotTable.setCellMetaObject(rowInd, colInd, { 'className': 'error-cell-rpd', comment: { value: '' } });
    }

    //generate handson table
    generateTableData() {
        this.hotSettings.colHeaders = this.getColHeaders();
        this.hotSettings.columns = this.getColumns();
        this.hotSettings.data = this.SDMErrorData;
        this.hotEnable = true;
        setTimeout(() => {
            this.hotTable = this.hotRegisterer.getInstance(this.hotId);
            this.identifyErrorCell();
        }, 100);
    }

    identifyErrorCell() {
        this.SDMErrorData.forEach((row, i) => {
            let errInfo = "";
            row.ERROR.forEach(err => {
                errInfo += `${Object.keys(err)[0]} : ${Object.values(err)[0]}  `;
                this.setErrorCell(i, this.hotTable.propToCol(Object.keys(err)[0]));
            });
            row.ERROR = errInfo;
            this.setErrorCell(i, this.hotTable.propToCol('ERROR'));
        });
        this.hotTable.render();
    }

    //created for Angular loader
    validateData() {
        const element = document.getElementsByClassName('k-upload-selected') as HTMLCollectionOf<HTMLElement>;
        if (element && element.length > 0){
            this.isBusy = true;
            element[0].click();
        }
    }

    openMasterDataModal() {
        this.dialog.open(SdmMasterDataModalComponent, {
            width: "1350px",
            panelClass: "sdmMasterDataModal"
        });
    }    

    close() {
        this.showWarningDialog = false;
    }

    public downloadExcel(): void {
        const timestamp = this.sdmService.getFormattedTimestamp();
        const fileName = `RPD_Upload_Error_Data_${timestamp}`;        
        GridUtil.dsToExcelSdm(this.SDMErrorData, 'RPD_Error_Data' ,fileName);
    }
    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

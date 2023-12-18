import { Component, ViewEncapsulation,OnDestroy } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import  Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { MatDialog } from '@angular/material/dialog';
import { BulkPricingUpdateModalComponent } from './admin.bulkPricingUpdateModal.component';
import {sheetObj} from '../../contract/pricingTableEditor/handsontable.interface'
import { bulkPricingUpdatesService } from './admin.bulkPricingUpdates.service';
import { MomentService } from "../../shared/moment/moment.service";
import { ContextMenu } from 'handsontable/plugins';
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'admin-bulk-pricing-updates',
  templateUrl: '/Client/src/app/admin/bulkPricingUpdates/admin.bulkPricingUpdates.component.html',
  styleUrls: ['Client/src/app/admin/bulkPricingUpdates/admin.bulkPricingUpdates.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BulkPricingUpdatesComponent implements PendingChangesGuard, OnDestroy {
  constructor(private loggerSvc: logger,
              protected dialog: MatDialog,
              private bulkPrcSvc: bulkPricingUpdatesService,
              private momentService: MomentService) {}
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
    private hotId = "prcSpreadsheet";
    alertTitle: string = '';
    showFunFact = true;
    spinnerMessageHeader = "";
    spinnerMessageDescription = "";
    uploadedData:any = [];
    isLoading = false;
    isAlert: boolean = false;
    alertMsg: string = '';
    isDisAlert = false;
    priceObj = {DealId : '',
    DealDesc: '',
    EcapPrice: '',
    Volume: '',
    DealStartDate : '',
    DealEndDate : '',
    BillingsStartDate : '',
    BillingsEndDate : '',
    ProjectName : '',
    TrackerEffectiveStartDate : '',
    AdditionalTermsAndConditions : '',
    DealStage : '',
    UpdateStatus : '',
    ValidationMessages : ''}
    validBulkPriceUpdates: any = [];
    basedate = this.momentService.moment("12/30/1899").format("MM/DD/YYYY");
    cellComments = [];
    nestedHeaders: [string[], string[]] = [[], []];
    cxtPaste: boolean = false;
    isDirty=false;

    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        minRows: 100,
        colHeaders: true,
        rowHeaders: true,
        copyPaste: true,
        comments: true,
        data: this.validBulkPriceUpdates,
        manualColumnResize: true,
        licenseKey: "ad331-b00d1-50514-e403f-15422",
        columns: ExcelColumnsConfig.bulkPriceUpdateColumnData,
        nestedHeaders: this.nestedHeaders,
        readOnlyCellClassName: 'readonly-cell',
        hiddenColumns: {
            indicators: true
        },
        hiddenRows: {
            indicators: true
        },
        bindRowsWithHeaders: true,
        contextMenu: {
            items: {
                'cut': {
                    callback: () => {
                        let cols = {
                            sCol: this.hotTable.getSelectedRange()[0].from.col,
                            eCol: this.hotTable.getSelectedRange()[0].to.col
                        }
                        this.errOnDsbRowPst(cols, true)
                        this.hotTable.render()
                    }
                },
                'copy': {},
                'paste': {
                    name: 'Paste',
                    callback: () => {
                        this.cxtPaste = true;
                        let cols = {
                            sCol: this.hotTable.getSelectedRange()[0].from.col,
                            eCol: this.hotTable.getSelectedRange()[0].to.col
                        }
                        this.errOnDsbRowPst(cols, false);
                        this.hotTable.render();
                    },

                },
                'separator': ContextMenu.SEPARATOR,
                'delete': {
                    name: 'Delete',
                    hidden: () => {
                        return ((this.hotTable.getSelectedLast()[0] >=-1 && this.hotTable.getSelectedLast()[1] !=-1));
                    }

                },
                'hide': {
                    name: 'Hide',
                    callback: () => {
                        if (this.hotTable.getSelectedRange()[0].from.col < 0) {
                            this.hotTable.getPlugin('hiddenRows').hideRow(this.hotTable.getSelectedLast()[0])
                        }
                        if (this.hotTable.getSelectedRange()[0].from.row < 0) {
                            this.hotTable.getPlugin('hiddenColumns').hideColumn(this.hotTable.getSelectedLast()[1])
                        }
                        this.hotTable.render();
                    },
                    hidden: () => {
                        return ((this.hotTable.getSelectedLast()[0] >=-1 && this.hotTable.getSelectedLast()[1] !=-1));
                    }
                },
            }
        },
        height: '430',
        width: '100%',
        afterPaste: (data, coords) => {
            let cols = {
                sCol: coords[0].startCol,
                eCol: coords[0].endCol
            }
            this.errOnDsbRowPst(cols, false);
        },
        afterContextMenuHide: (context) => {}
    }

    errOnDsbRowPst(cols,isCut){
        if (this.cxtPaste) {
            this.isDisAlert = true;
            this.alertTitle = 'Copying and pasting';
            this.alertMsg = 'These actions cannot be invoked through the menu. Please use the keyboard shortcuts instead: </br> Ctrl+C for copy </br> Ctrl+X for cut </br> Ctrl+V for paste';
            this.cxtPaste = false;
        } else {
            let readOnlyCols = [];
            ExcelColumnsConfig.bulkPriceUpdateColumnData.forEach( (col, ind) => {
                if (col.readOnly == true) {
                    readOnlyCols.push(ind);
                }}
            );
            if ( readOnlyCols.includes(cols.sCol) || readOnlyCols.includes(cols.eCol)){
                this.isDisAlert = true;
                this.alertTitle = 'Error';
                this.alertMsg = 'Cannot modify disabled cells.';
            } else if (isCut) {
                this.hotTable.getPlugin('copyPaste').cut();
            }
            this.hotTable.render();
        }
    }

    closeDisAlert(){
        this.isDisAlert = false;
    }

    openBulkPriceUpdateModal(){
        const dialogRef = this.dialog.open(BulkPricingUpdateModalComponent, {
            width: '750px',
            disableClose: false,
            position: { top: '100px' },
            panelClass: 'bulk-price-update-custom'
        });

        dialogRef.afterClosed().subscribe((data) => {
            this.cellComments = [];
            this.isDirty = true;
        if (data.length > 0) {
            if (data.length > 100) {
                this.loggerSvc.warn("The excel contains more than 100 records.Only first 100 records will be processed.", "");
                this.uploadedData = data.slice(0, 100);
            }
            else {
                this.uploadedData = data;
            }
        this.validBulkPriceUpdates = this.ValidateDateColumns(this.uploadedData);
        this.cellComments = this.validateTableData(this.validBulkPriceUpdates);
        this.hotTable.updateSettings({
                data:this.validBulkPriceUpdates, 
                cell: this.cellComments,
            })
        this.hotTable.render();
        } });
    }

    closeAlert(){
        this.isAlert = false;
    }

    ValidateDateColumns (priceData) {
        var DealDate;
        this.isDirty=true;
            priceData.forEach( (pdata) => {
            DealDate = this.momentService.moment(pdata.DealStartDate).format("MM/DD/YYYY");
            if (this.momentService.moment(DealDate, "MM/DD/YYYY", true).isValid())
                pdata.DealStartDate = DealDate;
            DealDate = this.momentService.moment(pdata.DealEndDate).format("MM/DD/YYYY");
            if (this.momentService.moment(DealDate, "MM/DD/YYYY", true).isValid())
                pdata.DealEndDate = DealDate;
            DealDate = this.momentService.moment(pdata.BillingsStartDate).format("MM/DD/YYYY");
            if (this.momentService.moment(DealDate, "MM/DD/YYYY", true).isValid())
                pdata.BillingsStartDate = DealDate;
            DealDate = this.momentService.moment(pdata.BillingsEndDate).format("MM/DD/YYYY");
            if (this.momentService.moment(DealDate, "MM/DD/YYYY", true).isValid())
                pdata.BillingsEndDate = DealDate;
            DealDate = this.momentService.moment(pdata.TrackerEffectiveStartDate).format("MM/DD/YYYY");
            if (this.momentService.moment(DealDate, "MM/DD/YYYY", true).isValid())
                pdata.TrackerEffectiveStartDate = DealDate;
        });
        return priceData;
    }

    processData(){
        this.isLoading = true;
        let dataArr = this.cellComments  = [];
        this.spinnerMessageDescription = "Processing deal Updates... ";
        this.spinnerMessageHeader = 'Processing...';
        this.validBulkPriceUpdates = this.hotTable.getData();
        dataArr =  this.getDataFromTable() ;
        if (dataArr.length > 0) {
            this.cellComments = this.validateTableData(dataArr);
            if (this.cellComments.length > 0){
                this.hotTable.updateSettings({
                    cell: this.cellComments,
                    data: dataArr
                });
                this.hotTable.render();
                this.isLoading = false;
                return;
            }
            let tempData = [];
            dataArr.forEach((prcData) => {
                let dataObj = {};
                if (prcData.DealId > 0 && prcData.DealId != undefined && prcData.DealId != null) {
                dataObj["DealId"] =  prcData.DealId
                }
                if (prcData.DealDesc !== "" && prcData.DealDesc !== undefined &&prcData.DealDesc !== null) {
                    dataObj["DealDesc"] = prcData.DealDesc
                }
                if (prcData.EcapPrice !== "" && prcData.EcapPrice > 0 && prcData.EcapPrice !== undefined && prcData.EcapPrice !== null) {
                    dataObj["EcapPrice"] =  prcData.EcapPrice
                }
                if (prcData.Volume !== "" && prcData.Volume !== undefined && prcData.Volume !== null) {
                    dataObj["Volume"] = prcData.Volume
                }
                if (prcData.DealStartDate !== "" && prcData.DealStartDate !== undefined && prcData.DealStartDate !== null) {
                    dataObj["DealStartDate"] =  this.momentService.moment(prcData.DealStartDate).format("MM/DD/YYYY") 
                }
                if (prcData.DealEndDate !== "" && prcData.DealEndDate !== undefined && prcData.DealEndDate !== null) {
                    dataObj["DealEndDate"] = this.momentService.moment(prcData.DealEndDate).format("MM/DD/YYYY")
                }
                if (prcData.ProjectName !== "" && prcData.ProjectName !== undefined && prcData.ProjectName !== null) {
                    dataObj["ProjectName"] = prcData.ProjectName
                }
                if (prcData.BillingsStartDate !== "" && prcData.BillingsStartDate !== undefined && prcData.BillingsStartDate !== null) {
                    dataObj["BillingsStartDate"] = this.momentService.moment(prcData.BillingsStartDate).format("MM/DD/YYYY")
                }
                if (prcData.BillingsEndDate !== "" && prcData.BillingsEndDate !== undefined && prcData.BillingsEndDate !== null) {
                    dataObj["BillingsEndDate"] = this.momentService.moment(prcData.BillingsEndDate).format("MM/DD/YYYY")
                }
                if (prcData.TrackerEffectiveStartDate !== "" && prcData.TrackerEffectiveStartDate !== undefined && prcData.TrackerEffectiveStartDate !== null) {
                    dataObj["TrackerEffectiveStartDate"] = this.momentService.moment(prcData.TrackerEffectiveStartDate).format("MM/DD/YYYY") 
                }
                if (prcData.AdditionalTermsAndConditions !== "" && prcData.AdditionalTermsAndConditions !== undefined && prcData.AdditionalTermsAndConditions !== null) {
                    dataObj["AdditionalTermsAndConditions"] = prcData.AdditionalTermsAndConditions
                }
                tempData.push(dataObj);
            });
            
            let data = { "BulkPriceUpdateRecord" : tempData};
            this.bulkPrcSvc.UpdatePriceRecord(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe( (response) => {
                    this.isLoading = false;
                    this.cellComments = [];
                        this.validBulkPriceUpdates = this.ValidateDateColumns(response.BulkPriceUpdateRecord);
                        this.validBulkPriceUpdates.forEach( (prc,i) => {
                            if (prc.UpdateStatus !== undefined && prc.UpdateStatus !== null && prc.UpdateStatus !== "") {
                                this.cellComments.push({ row: i, col: 12, className:'deal-status'})
                            }
                            if (prc.ValidationMessages !== null && prc.ValidationMessages !== undefined && prc.ValidationMessages !== ""){
                                this.cellComments.push({ row: i, col: 13, className:'error-product'})
                            }
                        })
                        this.hotTable.updateSettings({
                            data: this.validBulkPriceUpdates,
                            cell: this.cellComments
                        })
                        this.hotTable.render();  
                },  (err) => {
                    this.isLoading = false;
                    this.loggerSvc.error("Unable to execute Price Record Updates.", err, err.statusText);
                });
        } else {
            this.isLoading = false;
            this.isAlert = true;
            this.alertMsg = "There is no data to Process";
            this.validBulkPriceUpdates = [];
            this.hotTable.loadData([]);
        }
    }

    getDataFromTable(){
        let newArr = [];
        let tempData = this.validBulkPriceUpdates.filter(row =>  !(( row[0] == null || row[0] == "") &&
            (row[1] == null || row[1] == "") &&
        (row[2] == null || row[2] == "") &&
        (row[3] == null || row[3] == "") &&
        (row[4] == null || row[4] == "") &&
        (row[5] == null || row[5] == "") &&
        (row[6] == null || row[6] == "") &&
        (row[7] == null || row[7] == "") &&
        (row[8] == null || row[8] == "") &&
        (row[9] == null || row[9] == "") &&
        (row[10] == null || row[10] == "")));
        if (tempData.length > 0) {

            for (var i = 0; i < tempData.length; i++) {
                var newDeals = {};
                newDeals['DealId'] =  ((!(isNaN(tempData[i][0]))) ? tempData[i][0] : 0);
                newDeals['DealDesc'] = tempData[i][1] != null ? tempData[i][1] : "";
                newDeals['EcapPrice'] = tempData[i][2] != null ? tempData[i][2] : "";
                newDeals['Volume'] = tempData[i][3] != null ? tempData[i][3] : "";
                if (tempData[i][4] != null && tempData[i][4] != "") {
                    newDeals['DealStartDate'] = Number(tempData[i][4]).toString() == 'NaN' ? tempData[i][4] : this.momentService.moment(this.basedate).add(parseInt(tempData[i][4]), 'days').format("MM/DD/YYYY");
                } else {
                    newDeals['DealStartDate'] = "";
                }

                if (tempData[i][5] != null && tempData[i][5] != "") {
                    newDeals['DealEndDate'] = Number(tempData[i][5]).toString() == 'NaN' ? tempData[i][5] : this.momentService.moment(this.basedate).add(parseInt(tempData[i][5]), 'days').format("MM/DD/YYYY");
                } else {
                    newDeals['DealEndDate'] = "";
                }

                if (tempData[i][6] != null && tempData[i][6] != "") {
                    newDeals['BillingsStartDate'] = Number(tempData[i][6]).toString() == 'NaN' ? tempData[i][6] : this.momentService.moment(this.basedate).add(parseInt(tempData[i][6]), 'days').format("MM/DD/YYYY");
                } else {
                    newDeals['BillingsStartDate'] = "";
                }


                if (tempData[i][7] != null && tempData[i][7] != "") {
                    newDeals['BillingsEndDate'] = Number(tempData[i][7]).toString() == 'NaN' ? tempData[i][7] : this.momentService.moment(this.basedate).add(parseInt(tempData[i][7]), 'days').format("MM/DD/YYYY");
                } else {
                    newDeals['BillingsEndDate'] = "";
                }
                newDeals['ProjectName'] = tempData[i][8] != null ? tempData[i][8].trimEnd() : "";

                if (tempData[i][9] != null && tempData[i][9] != "") {
                    newDeals['TrackerEffectiveStartDate'] = Number(tempData[i][9]).toString() == 'NaN' ? tempData[i][9] : this.momentService.moment(this.basedate).add(parseInt(tempData[i][9]), 'days').format("MM/DD/YYYY");
                } else {
                    newDeals['TrackerEffectiveStartDate'] = "";
                }
                newDeals['AdditionalTermsAndConditions'] = tempData[i][10] != null ? tempData[i][10].trimEnd() : "";
                newArr.push(newDeals);
            }
        }
        return newArr;
    }

    validateTableData(dataArr){
        let messages = [];
        let errMsg = '';
        let validationMessages = [];
        dataArr.forEach((row,i) => {
            errMsg = '',
            messages = [];
            if (row.DealId == "0" || row.DealId == "" || row.DealId == null || row.DealId == undefined) {
                messages.push("Deal ID");
                validationMessages.push({ row: i, col: 0, comment: { value: 'Deal ID is a mandatory field', readOnly: true } ,className:'error-product'})
            }
            if ((row.DealDesc == null || row.DealDesc == ""  || row.DealDesc == undefined) &&
                (row.EcapPrice == null || row.EcapPrice == ""  || row.EcapPrice == undefined) &&
                (row.Volume == null || row.Volume == ""  || row.Volume == undefined) &&
                (row.ProjectName == null || row.ProjectName == ""  || row.ProjectName == undefined) &&
                (row.DealStartDate == null || row.DealStartDate == ""  || row.DealStartDate == undefined) &&
                (row.DealEndDate == null || row.DealEndDate == ""  || row.DealEndDate == undefined) &&
                (row.BillingsStartDate == null || row.BillingsStartDate == ""  || row.BillingsStartDate == undefined) &&
                (row.BillingsEndDate == null || row.BillingsEndDate == ""  || row.BillingsEndDate == undefined) &&
                (row.TrackerEffectiveStartDate == null || row.TrackerEffectiveStartDate == ""  || row.TrackerEffectiveStartDate == undefined) &&
                (row.AdditionalTermsAndConditions == null || row.AdditionalTermsAndConditions == ""  || row.AdditionalTermsAndConditions == undefined)) {
                messages.push("One of the Deal");
                for( let ind = 1; ind<11; ind++){
                    validationMessages.push({ row: i, col: ind, comment: { value: " ", readOnly: true } ,className:'error-product'})
                }
            }
            if (messages.length > 0) {
                errMsg = errMsg + messages.join(", ") + " is a mandatory field|";
            }
            if (row.DealId !== "0" || row.DealId !== "" || row.DealId !== null ) {
                if (Number(row.DealId).toString() == 'NaN') {
                    errMsg = errMsg + "Deal ID must be a valid number|";
                    validationMessages.push({ row: i, col: 0, comment: { value: 'Deal ID must be a valid number', readOnly: true } ,className:'error-product'})
                }
                else if (!Number.isInteger(Number(row.DealId))) {
                    errMsg = errMsg + "Deal ID must be a valid number|";
                    validationMessages.push({ row: i, col: 0, comment: { value: 'Deal ID must be a valid number', readOnly: true } ,className:'error-product'})
                    }
                }
            if (row.EcapPrice && row.EcapPrice !== "0" && row.EcapPrice !== '' && row.EcapPrice !== null ) {
                if (Number(row.EcapPrice).toString() == 'NaN') {
                    errMsg = errMsg + "ECAP Price must be valid number|";
                    validationMessages.push({ row: i, col: 2, comment: { value: 'ECAP Price must be valid number', readOnly: true } ,className:'error-product'})
                }
            }
            if (row.Volume &&row.Volume !== "0" && row.Volume !== '' && row.Volume !== null) {
                if (Number(row.Volume).toString() == 'NaN') {
                    errMsg = errMsg + "Ceiling Volume must be a valid non-decimal number. |";
                    validationMessages.push({ row: i, col: 3, comment: { value: 'Ceiling Volume must be a valid non-decimal number.', readOnly: true } ,className:'error-product'})
                }
                else if (!Number.isInteger(Number(row.Volume))) {
                    errMsg = errMsg + "Ceiling Volume must be a valid non-decimal number. |";
                    validationMessages.push({ row: i, col: 3, comment: { value: 'Ceiling Volume must be a valid non-decimal number.', readOnly: true } ,className:'error-product'})
                }
                }
            if (row.DealStartDate && row.DealStartDate !== '' && row.DealStartDate !== null && !this.momentService.moment(row.DealStartDate, "MM/DD/YYYY", true).isValid()) {
                    errMsg = errMsg + "Deal Start Date must be in ''MM/DD/YYYY'' format|";
                    validationMessages.push({ row: i, col: 4, comment: { value: 'Deal Start Date must be in "MM/DD/YYYY" format', readOnly: true } ,className:'error-product'})
            }
            if ( row.DealEndDate && row.DealEndDate !== '' && row.DealEndDate !== null && !this.momentService.moment(row.DealEndDate, "MM/DD/YYYY", true).isValid()) {
                    errMsg = errMsg + "Deal End Date must be in ''MM/DD/YYYY'' format|";
                    validationMessages.push({ row: i, col: 5, comment: { value: 'Deal End Date must be in "MM/DD/YYYY" format', readOnly: true } ,className:'error-product'})
            }
            if (row.BillingsStartDate && row.BillingsStartDate !== '' && row.BillingsStartDate !== null && !this.momentService.moment(row.BillingsStartDate, "MM/DD/YYYY", true).isValid()) {
                errMsg = errMsg + "Billing StartDate must be in ''MM/DD/YYYY'' format|";
                validationMessages.push({ row: i, col: 6, comment: { value: 'Billing StartDate must be in "MM/DD/YYYY" format', readOnly: true } ,className:'error-product'})
            }
            if (row.BillingsEndDate && row.BillingsEndDate !== '' && row.BillingsEndDate !== null && !this.momentService.moment(row.BillingsEndDate, "MM/DD/YYYY", true).isValid()) {
                errMsg = errMsg + "Billing End Date must be in ''MM/DD/YYYY'' format|";
                validationMessages.push({ row: i, col: 7, comment: { value: 'Billing End Date must be in "MM/DD/YYYY" format', readOnly: true } ,className:'error-product'})
            }
            if (row.TrackerEffectiveStartDate && row.TrackerEffectiveStartDate !== '' && row.TrackerEffectiveStartDate !== '' && !this.momentService.moment(row.TrackerEffectiveStartDate, "MM/DD/YYYY", true).isValid()) {
                errMsg = errMsg + "Tracker Effective Start Date must be in ''MM/DD/YYYY'' format|";
                validationMessages.push({ row: i, col: 9, comment: { value: 'Tracker Effective Start Date must be in "MM/DD/YYYY" format', readOnly: true } ,className:'error-product'})
            }
            
            if (errMsg != '') {
                var rowMsg = errMsg.slice(0, -1);
                var arr = rowMsg.split('|');
                var index = 1;
                var msg = "";
                arr.forEach(row => {
                    msg = msg + (index++) + ". " + row + "\n";
                });
                row['ValidationMessages'] = msg;
                validationMessages.push({ row: i, col: 13, className:'error-product'})
            } else {
                row['ValidationMessages'] = '';
            }
        });
        return validationMessages;
    }

    ngAfterViewInit() {
        this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        setTimeout (()=>{
        this.hotTable.render();
        },1000)
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

ngOnInit(){
    ExcelColumnsConfig.bulkPriceUpdatesColHeaders.forEach ( (header,ind) => {
        this.nestedHeaders[0].push(`<span style="font-family: 'Intel Clear';
        font-weight: 400;
        font-size: 11px;
        color: #0071c5;
        ;">${sheetObj[ind]}</span>`);
        this.nestedHeaders[1].push(`<span style="font-size: 13px;
        color: rgb(0, 16, 113);
        font-weight: bold;
        font-family: 'Intel Clear'; opacity: .7">${header}</span>`);
   
    })
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
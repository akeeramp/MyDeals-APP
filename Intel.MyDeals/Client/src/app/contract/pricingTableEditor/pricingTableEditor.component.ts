import { Component, Input, Output, EventEmitter, NgZone, OnInit, AfterViewInit } from '@angular/core';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { each, uniq, filter, map, where, pluck, findWhere, findIndex, findLastIndex, reject, contains, find, values, keys, unique, includes, isUndefined, isNull } from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { distinct } from '@progress/kendo-data-query';

import { logger } from '../../shared/logger/logger';
import { PricingTableEditorService } from './pricingTableEditor.service'
import { lnavService } from '../lnav/lnav.service';
import { productSelectorService } from '../../shared/services/productSelector.service';
import { flexoverLappingcheckDealService } from '../ptModals/flexOverlappingDealsCheck/flexOverlappingDealsCheck.service'
import { ContractDetailsService } from "../contractDetails/contractDetails.service"
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field, sheetObj } from './handsontable.interface';
import { PTEUtil } from '../PTEUtils/PTE.util';
import { ProductSelectorComponent } from '../ptModals/productSelector/productselector.component';
import { ProductCorrectorComponent } from '../ptModals/productCorrector/productcorrector.component';
import { GeoSelectorComponent } from '../ptModals/geo/geo.component';
import { multiSelectModalComponent } from '../ptModals/multiSelectModal/multiSelectModal.component';
import { kendoCalendarComponent } from '../ptModals/kendoCalenderModal/kendoCalendar.component';
import { PTE_CellChange_Util } from '../PTEUtils/PTE_CellChange_util';
import { AutoFillComponent } from '../ptModals/autofillsettings/autofillsettings.component';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
import { PTE_Load_Util } from '../PTEUtils/PTE_Load_util';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { PTE_Helper_Util } from '../PTEUtils/PTE_Helper_util';
import { PTE_Save_Util } from '../PTEUtils/PTE_Save_util';
import { lnavUtil } from '../lnav.util';
import { Tender_Util } from '../PTEUtils/Tender_util';
import { PTE_Validation_Util } from '../PTEUtils/PTE_Validation_util';
import { OverlappingCheckComponent } from '../ptModals/overlappingCheckDeals/overlappingCheckDeals.component';
import { FlexOverlappingCheckComponent } from '../ptModals/flexOverlappingDealsCheck/flexOverlappingDealsCheck.component';
import { dropDownModalComponent } from '../ptModals/dropDownModal/dropDownModal.component';

@Component({
    selector: 'pricing-table-editor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html'
})
export class pricingTableEditorComponent implements OnInit, AfterViewInit {

    constructor(private pteService: PricingTableEditorService,
                private productSelectorService: productSelectorService,
                private loggerService: logger,
                private lnavService: lnavService,
                private flexoverLappingCheckDealsService: flexoverLappingcheckDealService,
                private contractDetailsService: ContractDetailsService, private ngZone: NgZone,
                protected dialog: MatDialog) {
        /*  custom cell editor logic starts here*/
        let VM = this;
        this.custCellEditor = class custSelectEditor extends Handsontable.editors.TextEditor {
            public TEXTAREA: any;
            public BUTTON: HTMLButtonElement;
            public TEXTAREA_PARENT: any;
            public textareaStyle: any
            public textareaParentStyle: any
            public selectOptions: any;
            private selRow = 0;
            private selCol = 0;
            private field: any = '';
            private source: any = '';
            private allOperations = [];

            constructor(hotInstance: any) {
                super(hotInstance);
            }

            prepare(row: number, col: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties): void {
                super.prepare(row, col, prop, TD, originalValue, cellProperties);
                this.selCol = col;
                this.selRow = row;
                this.field = prop;
                this.source = cellProperties.source ? cellProperties.source : '';

                this.setButtonIconType();
            }

            createElements() {
                super.createElements();
                this.createCellButton();
                this.TEXTAREA.className = 'htCustTxt';
                this.TEXTAREA_PARENT.appendChild(this.BUTTON);
            }

            private createCellButton() {
                this.BUTTON = document.createElement('button');
                this.BUTTON.id = 'btnCustSelctor';
                this.BUTTON.className = 'btn btn-sm btn-primary py-0 htCustCellEditor';

                this.BUTTON.addEventListener('mousedown', (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.openPopUp();
                });
            }

            private setButtonIconType() {
                const DATE_BUTTON_FIELDS = ['START_DT', 'END_DT', 'OEM_PLTFRM_LNCH_DT', 'OEM_PLTFRM_EOL_DT'];
                const SEARCH_BUTTON_FIELDS = ['PTR_USER_PRD'];

                if (includes(SEARCH_BUTTON_FIELDS, this.field)) {
                    this.BUTTON.innerHTML = '<i class="intelicon-search"></i>';
                } else if (includes(DATE_BUTTON_FIELDS, this.field)) {
                    this.BUTTON.innerHTML = '<i class="intelicon-calendar"></i>';
                } else {
                    this.BUTTON.innerHTML = '<i class="intelicon-check"></i>';
                }
            }

            async openPopUp() {
                VM.curRow = [];
                let selVal = this.instance.getDataAtCell(this.selRow, this.selCol);

                const FIELDS_RESET_SELECTED_VALUE = ['PAYOUT_BASED_ON', 'PERIOD_PROFILE', 'RESET_VOLS_ON_PERIOD', 'AR_SETTLEMENT_LVL', 'REBATE_TYPE', 'PROD_INCLDS', 'SETTLEMENT_PARTNER', 'SERVER_DEAL_TYPE', 'PROGRAM_PAYMENT'];
                if (includes(FIELDS_RESET_SELECTED_VALUE, this.field) && !this.source.includes(selVal)) {
                    selVal = '';
                }

                let modalComponent: any = null,
                    name: string = '',
                    height: string = '',
                    width: string = '650px',
                    data = {},
                    panelClass: string = '';

                if (this.field && this.field == 'PTR_USER_PRD') {
                    modalComponent = ProductSelectorComponent;
                    name = 'Product Selector';
                    width = '5500px';
                    panelClass = 'product-selector-dialog';
                    let obj = {};
                    each(this.instance.getCellMetaAtRow(this.selRow), (val) => {
                        if (val.prop) {
                            obj[val.prop] = this.instance.getDataAtRowProp(this.selRow, val.prop.toString()) != null ? this.instance.getDataAtRowProp(this.selRow, val.prop.toString()) : null;
                        }
                    });
                    VM.curRow.push(obj);
        
                    if (VM.curRow[0]['PTR_SYS_PRD'] == '' || VM.isExcludePrdChange) {
                        await VM.validateOnlyProducts('onOpenSelector', VM.curRow);
                        if (VM.curRow[0].isOpenCorrector) {
                            delete VM.curRow[0].isOpenCorrector;
        
                            if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                                VM.curRow[0]['PTR_SYS_PRD'] = ""
                                this.instance.setDataAtRowProp(this.selRow, 'PTR_SYS_PRD', '', 'no-edit');
                                delete VM.curRow[0].delPTR_SYS_PRD;
                            }
                            VM.curRow = [];
                            return;
                        }
                    }
                    data = { name: name, source: this.source, selVal: selVal, contractData: VM.contractData, curPricingTable: VM.curPricingTable, curRow: VM.curRow };
                } else if (this.field && this.field == 'PAYOUT_BASED_ON') {
                    modalComponent = dropDownModalComponent
                    name = "Select Payout Based On *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'PERIOD_PROFILE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Period Profile";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'RESET_VOLS_ON_PERIOD') {
                    modalComponent = dropDownModalComponent
                    name = "Select Reset Per Period";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'AR_SETTLEMENT_LVL') {
                    modalComponent = dropDownModalComponent
                    name = "Select Settlement Level";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'REBATE_TYPE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Rebate Type *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'PROD_INCLDS') {
                    modalComponent = dropDownModalComponent
                    name = "Select Media *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'SETTLEMENT_PARTNER') {
                    modalComponent = dropDownModalComponent
                    name = "Select Settlement Partner";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'SERVER_DEAL_TYPE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Server Deal Type";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'PROGRAM_PAYMENT') {
                    modalComponent = dropDownModalComponent
                    name = "Select Program Payment *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'GEO_COMBINED') {
                    modalComponent = GeoSelectorComponent
                    panelClass = 'multi_select_style'
                    name = "Select Geo *";
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'CUST_ACCNT_DIV') {
                    modalComponent = GeoSelectorComponent
                    panelClass = 'multi_select_style'
                    name = "Customer Account Divisions";
                    data = { name: name, source: this.source, selVal: selVal };
                } else if (this.field && this.field == 'QLTR_BID_GEO') {
                    modalComponent = GeoSelectorComponent;
                    panelClass = 'geo_multi_style',
                        name = "Select Bid Geo";
                    data = { name: name, source: this.source, selVal: selVal };
                } else if(this.field && this.field == 'MRKT_SEG'){
                    modalComponent = multiSelectModalComponent;
                    panelClass = 'multi-select-pte',
                    height = "auto"
                    width = "700px";
                    name = this.field;
                    data = { colName: name, items: { 'data': this.source }, cellCurrValues: selVal };
                } else {
                    const CONTRACT_START_DATE = VM.contractData["START_DT"];
                    const CONTRACT_END_DATE = VM.contractData["END_DT"];
                    const IS_CONSUMPTION = this.instance.getDataAtRowProp(this.selRow, "PAYOUT_BASED_ON") === "Consumption";
                    const IS_OEM = this.field === "OEM_PLTFRM_LNCH_DT" || this.field === "OEM_PLTFRM_EOL_DT";
                    modalComponent = kendoCalendarComponent;
                    height = 'auto';
                    width = '600px';
                    name = this.field;
                    data = { colName: name, items: { data: this.source }, cellCurrValues: selVal, contractStartDate: CONTRACT_START_DATE, contractEndDate: CONTRACT_END_DATE, isConsumption: IS_CONSUMPTION, isOEM: IS_OEM, contractIsTender: VM.isTenderContract };
                    panelClass = 'date-calendar-pop-up';
                }
                VM.editorOpened = true;

                //this zone is implemented for pte dialogs double click event problem
                ngZone.run(async () => {
                    const DIALOG_REF = dialog.open(modalComponent, {
                        height: height,
                        width: width,
                        data: data,
                        panelClass: panelClass
                    });
                    await DIALOG_REF.afterClosed().toPromise().then((result) => {
                        if (result != undefined) {
                            if (this.field && this.field == 'PTR_USER_PRD') {//here there is no handonstable source specify bcz we need to do autofill
                                VM.isLoading = true;
                                let contractProduct = [];
                                let excludeProduct = [];
                                let sysPrd = {};
                                this.allOperations = [];
                                if (result.splitProducts) { 
                                     let PTR = [];
                                    each(result.validateSelectedProducts, (item, idx) => {
                                        if (!item[0].EXCLUDE) {
                                            contractProduct = [];
                                            sysPrd = {};
                                            contractProduct.push(item[0].HIER_VAL_NM);
                                            sysPrd[item[0].DERIVED_USR_INPUT] = item;
                                            if (VM.curPricingTable.OBJ_SET_TYPE_CD && VM.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                                                if (idx != 0) {
                                                    result.validateSelectedProducts[idx].indx = result.validateSelectedProducts[idx - 1].indx + result.validateSelectedProducts[idx - 1].items.length;
                                                }
                                            }                                      
                                            VM.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                                            let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludeProduct.toString() };
                                            PTR.push({ row: this.selRow, prop: 'PTR_USER_PRD', old: this.instance.getDataAtRowProp(this.selRow, 'PTR_USER_PRD'), new: contractProduct.toString() ,operation:operation});
                                            this.selRow = this.selRow + (VM.curPricingTable.NUM_OF_TIERS?VM.curPricingTable.NUM_OF_TIERS:1);
                                            this.allOperations.push(operation);
                                        }
                                    });
                                    PTE_CellChange_Util.autoFillCellOnProd(PTR, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns);
                                } else {
                                    each(result.validateSelectedProducts, (item) => {
                                        if (!item[0].EXCLUDE) {
                                            contractProduct.push(item[0].HIER_VAL_NM)
                                        } else if (item[0].EXCLUDE && !result.splitProducts) {
                                            excludeProduct.push(item[0].HIER_VAL_NM);
                                        }

                                        sysPrd[item[0].DERIVED_USR_INPUT] = item;
                                    });
                                    let ptRows = [];
                                    VM.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                                    ptRows.push({ row: this.selRow, prop: 'PTR_USER_PRD', old: this.instance.getDataAtRowProp(this.selRow, 'PTR_USER_PRD'), new: contractProduct.toString() });
                                    let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludeProduct.toString() };
                                    this.allOperations.push(operation);
                                    PTE_CellChange_Util.autoFillCellOnProd(ptRows, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns, operation);
                                }
                            } else {
                                VM.dirty = true;
                                if (this.field && selVal != result?.toString && result !== '' && result !== null &&
                                    (this.field == 'CUST_ACCNT_DIV' || this.field == "GEO_COMBINED" || this.field == 'START_DT' || this.field == 'END_DT' || this.field == 'PAYOUT_BASED_ON' || this.field == 'PERIOD_PROFILE' || this.field == 'RESET_VOLS_ON_PERIOD' || this.field == 'AR_SETTLEMENT_LVL'
                                        || this.field == 'REBATE_TYPE' || this.field == 'PROD_INCLDS' || this.field == 'SETTLEMENT_PARTNER' || this.field == 'MRKT_SEG' || this.field == 'PROGRAM_PAYMENT' || this.field === "OEM_PLTFRM_LNCH_DT" || this.field === "OEM_PLTFRM_EOL_DT")) {
                                    //VM.dirty = true;
                                    VM.removeCellComments(this.selRow, this.field);
                                    let PTR = [];
                                    if (this.field == 'PROGRAM_PAYMENT') {
                                        PTR.push({ row: this.selRow, prop: this.field, old: this.instance.getDataAtRowProp(this.selRow, this.field), new: result?.toString() });
                                        VM.createNewPrcObt(VM.curPricingTable);
                                        PTE_CellChange_Util.pgChgfn(PTR, VM.columns, VM.curPricingTable, VM.contractData, VM.custCellEditor, VM.newPricingTable);
                                    }
                                    if ((this.field == 'RESET_VOLS_ON_PERIOD' || this.field == 'AR_SETTLEMENT_LVL' || this.field == 'PERIOD_PROFILE')) {
                                        VM.createNewPrcObt(VM.curPricingTable);
                                        let ptRowCount = this.instance.countRows();
                                        if (this.field == 'AR_SETTLEMENT_LVL') {
                                            let ptRow = [];
                                            ptRow.push({ row: this.selRow, prop: this.field, old: this.instance.getDataAtRowProp(this.selRow, this.field), new: result?.toString() });
                                            PTE_CellChange_Util.autoFillARSet(ptRow, VM.contractData, VM.curPricingTable, VM.custCellEditor);
                                            for (let i = 0; i < ptRowCount; i++) {
                                                if (!this.instance.isEmptyRow(i)) {
                                                    let ptRows = [];
                                                    ptRows.push({ row: i, prop: this.field, old: this.instance.getDataAtRowProp(i, this.field), new: result?.toString() });
                                                    if (this.instance.getDataAtRowProp(i, 'PERIOD_PROFILE') == '' && this.instance.getDataAtRowProp(this.selRow, 'RESET_VOLS_ON_PERIOD') == '') {
                                                        PTE_CellChange_Util.checkfn(ptRows[0], VM.curPricingTable, VM.columns, '', VM.contractData, VM.custCellEditor, VM.newPricingTable)
                                                    }
                                                } else {
                                                    break;
                                                }
                                            }
                                        }

                                        if (this.field == 'PERIOD_PROFILE' && this.instance.getDataAtRowProp(this.selRow, 'AR_SETTLEMENT_LVL') == '' && this.instance.getDataAtRowProp(this.selRow, 'RESET_VOLS_ON_PERIOD') == '') {
                                            for (let i = 0; i < ptRowCount; i++) {
                                                if (!this.instance.isEmptyRow(i)) {
                                                    let ptRows = [];
                                                    ptRows.push({ row: i, prop: this.field, old: this.instance.getDataAtRowProp(i, this.field), new: result?.toString() });
                                                    PTE_CellChange_Util.checkfn(ptRows[0], VM.curPricingTable, VM.columns, '', VM.contractData, VM.custCellEditor, VM.newPricingTable);
                                                } else {
                                                    break;
                                                }
                                            }
                                        }

                                        if (this.field == 'RESET_VOLS_ON_PERIOD' && this.instance.getDataAtRowProp(this.selRow, 'AR_SETTLEMENT_LVL') == '' && this.instance.getDataAtRowProp(this.selRow, 'PERIOD_PROFILE') == '') {
                                            for (let i = 0; i < ptRowCount; i++) {
                                                if (!this.instance.isEmptyRow(i)) {
                                                    let ptrows = [];
                                                    ptrows.push({ row: i, prop: this.field, old: this.instance.getDataAtRowProp(i, this.field), new: result?.toString() });
                                                    PTE_CellChange_Util.checkfn(ptrows[0], VM.curPricingTable, VM.columns, '', VM.contractData, VM.custCellEditor, VM.newPricingTable)
                                                } else {
                                                    break;
                                                }
                                            }
                                        }
                                    }
    
                                    if (this.field == 'REBATE_TYPE') {
                                        let ptrow = { row: this.selRow, prop: this.field, old: this.instance.getDataAtRowProp(this.selRow, this.field), new: result?.toString() };
                                        PTE_CellChange_Util.checkfn(ptrow, VM.curPricingTable, VM.columns, '', VM.contractData, VM.custCellEditor, VM.newPricingTable);
                                    }
    
                                    if(this.field == 'GEO_COMBINED'){
                                        const col = findIndex(VM.columns, { data: this.field });
                                        this.instance.setCellMetaObject(this.selRow,col,{ 'className': '', comment: { value: '' } });
                                        this.instance.render();
                                    }
                                }

                                this.instance.setDataAtCell(this.selRow, this.selCol, result?.toString(), 'no-edit');
                            }

                            VM.editorOpened = false;
                            setTimeout(() => {
                                VM.isLoading = false;
                                if (VM.curPricingTable.OBJ_SET_TYPE_CD && VM.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                                    if (this.allOperations.length > 0) {
                                        for (let i = 0; i < this.allOperations.length; i++) {
                                            let densityBandData = PTE_CellChange_Util.validateDensityBand(this.selRow, VM.columns, VM.curPricingTable, this.allOperations[i], '', false, VM.validMisProd);
                                            VM.validMisProd = densityBandData.validMisProds;
                                            VM.generateHandsonTable(densityBandData.finalPTR);
                                        }
                                    }
                                }
                            }, 2000);
    
                            if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                                delete VM.curRow[0].delPTR_SYS_PRD
                            }
                        } else {
                            let curRow = PTE_CellChange_Util.returnEmptyRow();
                            let prd = this.instance.getDataAtRowProp(this.selRow, 'PTR_USER_PRD')
                            if (this.field && this.field == 'PTR_USER_PRD' && (curRow == 0 || this.selRow == 0) && (prd == null || prd == '' || prd == undefined) ) {
                                VM.enableDeTab.emit({ isEnableDeTab: false, enableDeTabInfmIcon: false });
                                return [];
                            }
                        }
                    });
                });

                if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                    VM.curRow[0]['PTR_SYS_PRD'] = "";
                    this.instance.setDataAtRowProp(this.selRow, 'PTR_SYS_PRD', '', 'no-edit');
                    delete VM.curRow[0].delPTR_SYS_PRD;
                }
                VM.curRow = [];
            }
        }
        /*  custom cell editor logic ends here*/
    }

    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    @Output() tmDirec = new EventEmitter();
    @Output() enableDeTab = new EventEmitter();
    @Output() refreshedContractData = new EventEmitter;
    private isDeTabInfmIconReqd: boolean = false;
    private savedResponseWarning: any[] = [];
    public fontData: any[] = [
        { text: "(inherited size)", size: "inherit" },
        { text: "1 (8pt)", size: "8" },
        { text: "2 (10pt)", size: "10" },
        { text: "3 (12pt)", size: "12" },
        { text: "4 (14pt)", size: "14" },
        { text: "5 (18pt)", size: "18" },
        { text: "6 (24pt)", size: "24" },
    ];
    private kitMergeDeleteDCIDs = [];
    private isDialogOpen: boolean = false;
    private isCustDivNull: boolean = false;
    private validationMessage: boolean = false;
    private curRow = [];
    /*For loading variable */
    private isLoading: boolean = false;
    private msgType: string = "";
    private spinnerMessageHeader: string = "";
    private spinnerMessageDescription: string = "";
    private isBusyShowFunFact: boolean = true;
    private timeout: any = null;
    /*For loading variable */
    public showDiscount: string = "0%";
    public dirty = false;
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    public pricingTableDet: Array<any> = [];
    private pricingTableTemplates: any = {}; // Contains templates for All Deal Types
    private autoFillData: any = null;
    private ColumnConfig: Array<Handsontable.ColumnSettings> = [];
    private overlapFlexResult: any;
    cellComments: any = [];
    private transformResults: any = [];
    private lastEditedKitName: any;
    private prdPastObj: any = [];
    private isPRDPaste = false;
    // To get the selected row and col for product selector
    private multiRowDelete: Array<any> = [];
    // Handsontable Variables basic hottable structure
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: false,
        minRows: PTE_Config_Util.gridMinRows,
        maxRows: PTE_Config_Util.girdMaxRows,
        colHeaders: false,
        rowHeaders: true,
        rowHeaderWidth: 0,
        fixedColumnsLeft: 1,
        fixedRowsTop: 0,
        copyPaste: true,
        comments: true,
        height: 540,
        width: 1402,
        manualColumnResize: true,
        beforePaste: (data, coords) => {
            //Correct the object while copy pasting the data
            if (this.isPRDPaste && data && data.length > 0) {
                this.prdPastObj = this.getcpdata(data, coords);
            }
            else {
                this.prdPastObj = [];
            }
        },
        afterSelectionEndByProp: (row, prop, row2, pro2, selectionLayerLevel) => {
            if (prop && pro2 && prop == pro2 && (pro2 == 'PTR_USER_PRD' || pro2 == 'PRD_EXCLDS')) {
                this.selectedProperty = pro2;
                this.isPRDPaste = true;
            }
            else {
                this.isPRDPaste = null;
            }
        },
        afterChange: (changes, source) => {
            try {
                //the data is coing as null in case of source is loadData 
                if (changes) {
                    //using => operator to-call-parent-function-from-callback-function
                    //loading screen changes are moved to the top to  make better performance
                    if (this.isPRDPaste && this.prdPastObj.length > 0 && source == 'CopyPaste.paste') {
                        changes = this.prdPastObj;
                    }
                    this.pteLoaderPopUp(changes, source);
                    setTimeout(() => {
                        this.afterCellChange(changes, source);
                    }, 0);
                }
            }
            catch (ex) {
                this.loggerService.error('Something went wrong', 'Error');
                console.error('PTE::afterChange::', ex);
            }
        },
        // afterValidate: (isValid, value, row, prop, source) => {
        //     this.currencyValidatorMessageHandler(isValid, row, prop);
        //     // // TWC3119-682 - Currency cells have a max numeric value
        //     // const COLUMN_DEFINITION: PRC_TBL_Model_Field = this.pricingTableTemplates.model.fields[prop];
        //     // if (!(COLUMN_DEFINITION.type == undefined && COLUMN_DEFINITION.format == undefined)) {
        //     //     const CELL_TYPE: string = COLUMN_DEFINITION.type;
        //     //     const CELL_FORMAT: string = COLUMN_DEFINITION.format;

        //     //     if (CELL_TYPE === 'number' && CELL_FORMAT.toLowerCase().includes('0:c')) {
        //     //         const COLUMN = this.hotTable.propToCol(prop);

        //     //         const COMMENT_PLUGIN = this.hotTable.getPlugin('comments'); // WIP: Can probably call this outside to make more efficient

        //     //         if (!isValid) {
        //     //             COMMENT_PLUGIN.updateCommentMeta(row, COLUMN, {
        //     //                 value: 'Not a valid number (too large).',
        //     //                 readOnly: true
        //     //             });
        //     //             COMMENT_PLUGIN.showAtCell(row, COLUMN);
        //     //         } else {
        //     //             COMMENT_PLUGIN.removeCommentAtCell(row, COLUMN, true);
        //     //         }
        //     //     }
        //     // }
        // },
        afterDocumentKeyDown: (event) => {
            this.afterDocumentKeyDown(event);
        },
        licenseKey: "ad331-b00d1-50514-e403f-15422",
    };

    private columns: Array<Handsontable.ColumnSettings> = [];
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
    private dataset: Array<any> = [];
    private custCellEditor: any;
    private hotId = "spreadsheet";
    // Cached Dropdown API Responses (that do not usually change)
    private dropdownResponseLocalStorageKey = 'pricingTableEditor_DropdownApiResponses';
    private dropdownResponses: any = {};
    private psTitle = "Pricing Strategy";
    private ptTitle = "Pricing Table";
    private ptTitleLbl = "Enter " + this.ptTitle + " Name";
    private pageTitle = this.ptTitle + " Editor";
    private saveDesc = "Save your " + this.ptTitle + ", validate the products, and stay in your " + this.ptTitle + " Editor";
    public C_EDIT_PRODUCT: boolean = false;
    public C_ADD_PRICING_TABLE: boolean = false;
    private productValidationDependencies = PTE_Config_Util.productValidationDependencies;
    private kitDimAtrbs: Array<string> = PTE_Config_Util.kitDimAtrbs;
    private kitNameObj: any = null;
    private kitNameObjArr: any[] = [];
    private isKitDialog: boolean = false;
    private isTenderContract = false;
    private maxKITproducts: number = PTE_Config_Util.maxKITproducts;
    private showErrorMsg;
    private editorOpened: boolean = false;

    //this will help to have a custom cell validation which allow only alphabets
    private newPricingTable: any = {};
    private VendorDropDownResult: any = {};
    private isDeletePTR: boolean = false;
    private newPTR: any;
    public dirtyItems: boolean;
    public warnings: boolean = false;
    public validMisProd: any = [];
    public isExcludePrdChange: boolean = false;
    public trackTranslationprod: any = [];
    public undoEnable: boolean = false;
    public undoCount = 0;
    public redoEnable: boolean = false;
    public redoCount = 0;
    public selectedProperty = '';
    getcpdata(data, coords) {
        let startindex = coords[0].startRow;
        let numOfTiers;
        let property = this.selectedProperty;
        let uniqcpchanges = [];
        let oldvalue = "";
        let currindex = 0;
        let kitNextIndex = 0;
        let PTR=[];
        var dealType = this.curPricingTable['OBJ_SET_TYPE_CD'];
        kitNextIndex = startindex;
        //logic to accomodate empty cell copy with less number of source record and paste with more number of records selected in PTE
        let selectLength = coords[0].endRow - coords[0].startRow;
        if (data.length <= selectLength) {
            const dcid = this.hotTable.getDataAtRowProp(startindex, "DC_ID");
            if (dcid == null) {
                let len = selectLength - data.length;
                for (let index = 0; index <= len; index++) {
                    data.push(data[index]);
                }
            }
        }
        if (dealType == 'FLEX') {
            PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        }
        each(data, (item) => {
            if (currindex == 0) {
                currindex = startindex;
            }
            if (dealType == "KIT") {
                oldvalue = this.hotTable.getDataAtRowProp(kitNextIndex, "PTR_USER_PRD");
                numOfTiers = oldvalue ? oldvalue.toString().split(',').length : 1;
                if (oldvalue != null && oldvalue != '') {
                    kitNextIndex = kitNextIndex + oldvalue.split(',').length;
                }
            }
            else if (dealType == "ECAP" || dealType == "PROGRAM") {
                numOfTiers = 1;
            }
            else {
                let dcid = this.hotTable.getDataAtRowProp(currindex, "DC_ID");
                if (dcid == null) {
                    numOfTiers = 1;
                }
                else if (dealType == "DENSITY") {
                    let DenNUM_OF_TIERS = 0;
                    let DenpivotDensity = 0;
                    if (dcid > 0) {
                        numOfTiers = parseInt(this.hotTable.getDataAtRowProp(currindex, "NUM_OF_TIERS"));
                    } else {
                        DenNUM_OF_TIERS = parseInt(this.hotTable.getDataAtRowProp(currindex, "NUM_OF_TIERS"));
                        if (isNaN(DenNUM_OF_TIERS)) {
                            DenNUM_OF_TIERS = this.curPricingTable.NUM_OF_TIERS;
                        }
                        DenpivotDensity = parseInt(this.hotTable.getDataAtRowProp(currindex, "NUM_OF_DENSITY"));
                        if (isNaN(DenpivotDensity)) {
                            DenpivotDensity = this.curPricingTable.NUM_OF_DENSITY;
                        }
                        numOfTiers = DenNUM_OF_TIERS * DenpivotDensity;
                    }
                }
                else {
                    numOfTiers = parseInt(this.hotTable.getDataAtRowProp(currindex, "NUM_OF_TIERS"))
                    if (isNaN(numOfTiers)) {
                        if (dealType == "FLEX") {
                            if (dcid < 0) {
                                numOfTiers = PTR.find(x => x.DC_ID == dcid).NUM_OF_TIERS
                            }
                        }
                    }
                }
            }
            oldvalue = this.hotTable.getDataAtRowProp(currindex, property);
            let obj = [currindex, property, oldvalue, item.toString()];
            uniqcpchanges.push(obj);
            currindex = currindex + numOfTiers;
        })
        return uniqcpchanges;
    }

    pteLoaderPopUp(changes, source) {
        if (!this.isLoading && changes && changes.length > 1 && source && (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill')) {
            this.spinnerMessageHeader = 'Loading...';
            this.spinnerMessageDescription = 'Loading the Table Editor';
            this.isLoading = true;
        }
        if (this.isLoading && source && source == 'stop-loader') {
            this.isLoading = false;
        }
         //exclusivly for KIT incase of edit existing its give more time for operation to complete so adding extra loadin time
         if(!this.isLoading && source=='no-edit' && this.curPricingTable['OBJ_SET_TYPE_CD'] && this.curPricingTable['OBJ_SET_TYPE_CD']=='KIT'){
            this.spinnerMessageHeader = 'Loading...';
            this.spinnerMessageDescription = 'Loading the Table Editor';
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
            }, 0);
        }
    }
    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";

            // if no change in state, simple update the text            
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    afterDocumentKeyDown(evt: any) {
        //befor change hook afterDocumentKeyDown triggers so we can double confirm delete based on values equal to empty and explicity clicking delete
        if (evt.key && evt.key == 'Delete') {
            this.isDeletePTR = true;
        }
    }
    async closeDialog(act: string) {
        if (act == 'No') {
            //setting back the values back to handsonetables
            each(this.multiRowDelete, item => {
                this.hotTable.setDataAtRowProp(item.row, 'PTR_USER_PRD', item.old, 'no-edit');
            });
            this.isDialogOpen = false;
        }
        else {
            this.isDialogOpen = false;
            await this.deletePTR();
        }
        this.multiRowDelete = [];
        this.isDeletePTR = false;
    }
    toggleShowHideDiscount() {
        this.showDiscount = this.showDiscount == '0%' ? '45%' : '0%';
    }
    chgTerms() {
        //function must trigger only after stop typing
        let objThis = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            objThis.saveTerms();
        }, 800);
    }

    saveTerms() {
        const dataItem = this.curPricingStrategy;
        if (this.curPricingStrategy != undefined) {
            const data = {
                objSetType: "PRC_ST",
                ids: [dataItem["DC_ID"]],
                attribute: "TERMS",
                value: dataItem["TERMS"]
            };
            this.pteService.updateAtrbValue(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data).toPromise().catch((err) => {
                this.loggerService.error("Error", "Could not save the value.", err);
            });
        }
    }
    getTemplateDetails() {
        // Get the Contract and Current Pricing Strategy Data
        this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        // Get template for the selected PT
        this.pricingTableTemplates = this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        //Get Refined columns based on contract/Tender
        PTE_Load_Util.PTEColumnSettings(this.pricingTableTemplates, this.isTenderContract, this.curPricingTable);
        this.C_EDIT_PRODUCT = this.curPricingStrategy._settings.C_EDIT_PRODUCT != undefined ? this.curPricingStrategy._settings.C_EDIT_PRODUCT : false;
        this.C_ADD_PRICING_TABLE = this.curPricingStrategy._settings.C_ADD_PRICING_TABLE != undefined ? this.curPricingStrategy._settings.C_ADD_PRICING_TABLE : false;
    }
    async getPTRDetails() {
        let response = await this.pteService.readPricingTable(this.in_Pt_Id).toPromise().catch((err) => {
            this.loggerService.error('Something went wrong.', 'error');
            console.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service::', err);
        });

        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0) {
            // The thing about Tender contract, they can be created from a copy which will NOT create WIP deals and
            // Cleans out the PTR_SYS_PRD value forcing a product reconciliation because the customer might have changed.
            //  So... we need a check to see if the value on load is blank and if so... set the dirty flag
            this.dirtyItems = response.PRC_TBL_ROW.find(x => x.warningMessages.length > 0) ? true : false;
            Tender_Util.getTenderDetails(response.PRC_TBL_ROW, this.isTenderContract);
            this.pricingTableDet = response.PRC_TBL_ROW;
            if (response.PRC_TBL_ROW.length > 0 && response.WIP_DEAL.length == 0)
                this.dirty = true;
            this.isDeTabInfmIconReqd = PTE_Common_Util.dealEditorTabValidationIssue(response, false);
            this.enableDeTab.emit({ isEnableDeTab: true, enableDeTabInfmIcon: this.isDeTabInfmIconReqd });
            return response.PRC_TBL_ROW;
        } else {
            this.enableDeTab.emit({ isEnableDeTab: false, enableDeTabInfmIcon: false });
            return [];
        }
    }
    getMergeCellsOnDelete() {
        const PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        const mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, this.curPricingTable);
        this.hotTable.updateSettings({ mergeCells: mergCells });
    }
    generateHandsonTable(PTR: any) {
        //this is the code which is create columns according to Handson from API
        let nestedHeaders: [string[], string[]] = [[], []];
        let hiddenColumns: number[] = [];
        this.columns = [];
        /* From the Pricing Table Template */
        const columnTemplates: PRC_TBL_Model_Column[] = this.pricingTableTemplates.columns;
        const columnFields: PRC_TBL_Model_Field[] = this.pricingTableTemplates.model.fields;
        const columnAttributes: PRC_TBL_Model_Attributes[] = this.pricingTableTemplates.defaultAtrbs;
        // Iterate through each column from the Pricing Table Template
        each(columnTemplates, (item: PRC_TBL_Model_Column, index) => {
            let currentColumnConfig = PTEUtil.generateHandsontableColumn(this.isTenderContract, this.dropdownResponses, columnFields, item);
            //adding for cell management in cell this can move to seperate function later
            this.ColumnConfig.push(currentColumnConfig);
            if (item.field == 'PTR_USER_PRD' || item.field == 'GEO_COMBINED' || item.field == 'MRKT_SEG' || item.field == 'QLTR_BID_GEO' || item.field == 'CUST_ACCNT_DIV'
                || item.field == 'PAYOUT_BASED_ON' || item.field == 'PERIOD_PROFILE' || item.field == 'RESET_VOLS_ON_PERIOD' || item.field == 'AR_SETTLEMENT_LVL'
                || item.field == 'REBATE_TYPE' || item.field == 'PROD_INCLDS' || item.field == 'SETTLEMENT_PARTNER' || item.field == 'SERVER_DEAL_TYPE' || item.field == 'PROGRAM_PAYMENT') {
                currentColumnConfig.editor = this.custCellEditor;
            }
            if (currentColumnConfig && currentColumnConfig.type == 'date') {
                currentColumnConfig.editor = this.custCellEditor;
            }
            this.columns.push(currentColumnConfig);
            nestedHeaders[0].push(sheetObj[index]);
            nestedHeaders[1].push(`<span style="color: rgb(0, 60, 113);font-family:'Intel Clear';font-weight: bold;font-size: 13px;opacity: .7;">${item.title}</span>`);
        });
        /* Hidden Columns */
        hiddenColumns = PTE_Load_Util.getHiddenColumns(columnTemplates, this.contractData.CustomerDivisions);
        let mergCells = [];
        this.cellComments = PTE_Load_Util.getCellComments(PTR, this.pricingTableTemplates.columns);
        // This logic will add for all tier deals. 
        mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, this.curPricingTable);
        // Set the values for hotTable
        PTR = PTR && PTR.length > 0 ? PTR : Handsontable.helper.createEmptySpreadsheetData(5, this.columns.length);
        // Loading new data
        this.newPTR = PTR;
        //In some redirection scenario the code is showing error so must make sure the binding is happening only if there is and instance
        if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)) {
            this.hotTable.loadData(PTR);
            // Update settings  with new commented cells and erge cells
            this.hotTable.updateSettings({
                columns: this.columns,
                hiddenColumns: {
                    columns: hiddenColumns,
                    indicators: false
                },
                mergeCells: mergCells,
                cells: (row: number, col: number, prop: string) => {
                    return PTE_Load_Util.disableCells(this.hotTable, row, col, prop, this.ColumnConfig, this.curPricingTable, this.isTenderContract, this.curPricingStrategy.IS_HYBRID_PRC_STRAT);
                },
                cell: this.cellComments,
                readOnlyCellClassName: 'readonly-cell',
                nestedHeaders: nestedHeaders
            });
            this.hoverPTE();
        }
    }
    //functions to identify cell change
    identfyUniqChanges(changes: Array<any>, source: any): Array<any> {
        //for tier when drag/paste PTR_USER_PRD changes are based on num of tier and those many rows will come as changes but we need that as uniq change
        if (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            let uniqchanges = [];
            each(changes, (item) => {

                if (item[1] == 'PTR_USER_PRD') {
                    if (item[3] != null && item[3] != '') {
                        const obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
                        uniqchanges.push(obj);
                    }
                    else {
                        // in case of copy paste and Autofill the empty rows based on tier will come but that doesnt mean they are to delete
                        if (source == 'edit' && item[2] != null) {
                            //if no value in PTR_USER_PRD its to delete since its looping for tier logic adding in to an array and finally deleting
                            this.isDeletePTR = true;
                            this.multiRowDelete.push({ row: item[0], old: item[2] })
                        }
                    }
                }
                else {
                    const obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
                    uniqchanges.push(obj);
                }

            });
            return uniqchanges;
        }
        else {
            return [];
        }
    }
    isSaveEnabled() {
        if (this.dirty == true || this.dirtyItems == true) return true;
        else return false;
    }
    afterCellChange(changes: Array<any>, source: any) { // Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
        if (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            // Changes will track all the cells changing if we are doing copy paste of multiple cells
            // PTE loading in handsone takes more loading time than Kendo so putting a loader
            changes = this.identfyUniqChanges(changes, source);
            if (changes.length > 0 && changes[0].old != changes[0].new) {
                this.dirty = true;
                this.undoEnable = true;
                this.undoCount += 1;
            }
            // Show error message on mandatory fields deletion
            if (changes.length > 0 && !this.editorOpened && changes[0].prop != 'PTR_USER_PRD' && changes[0].prop != 'START_DT' && changes[0].prop != 'END_DT' && changes[0].prop != 'OEM_PLTFRM_LNCH_DT' && changes[0].prop != 'OEM_PLTFRM_EOL_DT') {
                this.errorOnMdtFdDeletion(changes);
            }
            const PTR = where(changes, { prop: 'PTR_USER_PRD' });
            const PTR_EXLDS = where(changes, { prop: 'PRD_EXCLDS' });
            const AR = where(changes, { prop: 'AR_SETTLEMENT_LVL' });
            const startVol = where(changes, { prop: 'STRT_VOL' });
            const rebateType = where(changes, { prop: 'REBATE_TYPE' });
            //KIT On change events
            const KIT_ECAP = filter(changes, item => { return item.prop == 'ECAP_PRICE_____20_____1' || item.prop == 'ECAP_PRICE' });
            const KIT_DSCNT = filter(changes, item => { return item.prop == 'DSCNT_PER_LN' || item.prop == 'QTY' });
            const KIT_name = where(changes, { prop: 'DEAL_GRP_NM' })
            //Voltier Changes
            const tierChg = filter(changes, item => { return item.prop == 'END_PB' || item.prop == 'STRT_PB' || item.prop == 'END_REV' || item.prop == 'STRT_REV' || item.prop == 'END_VOL' || item.prop == 'STRT_VOL' });
            const rateChg = filter(changes, item => { return item.prop == 'DENSITY_RATE' || item.prop == 'ECAP_PRICE' || item.prop == 'TOTAL_DOLLAR_AMOUNT' || item.prop == 'RATE' || item.prop == 'VOLUME' || item.prop == 'FRCST_VOL' || item.prop == 'ADJ_ECAP_UNIT' || item.prop == 'MAX_PAYOUT' || item.prop == 'INCENTIVE_RATE' });
            const pgChg = filter(changes, item => { return item.prop == 'PROGRAM_PAYMENT' });
            // settlement level and period profile set to default value on delete
            const perPro = where(changes, { prop: 'PERIOD_PROFILE' });
            const restprd = where(changes, { prop: 'RESET_VOLS_ON_PERIOD' });
            const geo=where(changes, { prop: 'GEO_COMBINED' });
            const bidgeo=where(changes, { prop: 'QLTR_BID_GEO' });
            const mrktseg=where(changes, { prop: 'MRKT_SEG' });
            const media=where(changes, { prop: 'PROD_INCLDS' });
            const payoutbasedon=where(changes, { prop: 'PAYOUT_BASED_ON' });
            const forcast=where(changes, { prop: 'FRCST_VOL' });
            //here we are using if conditions because at a time multiple changes can happen 
            if (PTR && PTR.length > 0) {
                this.undoEnable = false;
                this.undoCount -= 1;
                let failure = PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns);
                if (failure) {
                    this.loggerService.error('Something went wrong please upload with lesser number of records', "Some opertation failure");
                    this.isLoading = false;
                }
            }
            if (perPro && perPro.length > 0) {
                if (this.hotTable.getDataAtRowProp(perPro[0].row, 'AR_SETTLEMENT_LVL') != '' && this.hotTable.getDataAtRowProp(perPro[0].row, 'RESET_VOLS_ON_PERIOD') != '') {
                    PTE_CellChange_Util.perProfDefault(perPro, this.curPricingTable);
                } else {
                    this.setDeafultARSettlementAndRestPeriod(perPro);
                }
            }
            if (AR && AR.length > 0 && AR[0].new != AR[0].old) {
                if (this.hotTable.getDataAtRowProp(AR[0].row, 'PERIOD_PROFILE') != '' && this.hotTable.getDataAtRowProp(AR[0].row, 'RESET_VOLS_ON_PERIOD') != '') {
                    PTE_CellChange_Util.autoFillARSet(AR, this.contractData, this.curPricingTable, this.custCellEditor);
                } else {
                    this.setDeafultARSettlementAndRestPeriod(AR);
                }
            }
            if (geo && geo.length > 0) {
                let isvalidGeo = true
                let geolist = geo[0].new && geo[0].new != null ? geo[0].new.split(',') : '';
                const col = findIndex(this.columns, { data: geo[0].prop });
                each(geolist, geoname => {
                    geoname = geoname.replace(/[\[\]']+/g, '');
                    const geoprest = this.dropdownResponses.GEO_COMBINED.find(x => x.dropdownName == geoname);
                    if (geoprest == undefined) {
                        isvalidGeo = false;
                        const invalidname = geoname + ' is not valid Geo'
                        this.hotTable.setCellMetaObject(geo[0].row, col, { 'className': 'error-product', comment: { value: invalidname } });
                        this.hotTable.render();
                    }
                });

                if (!isvalidGeo) {
                    this.hotTable.setDataAtRowProp(geo[0].row, geo[0].prop, '', 'no-edit');
                } else {
                    if (geolist != '') {
                        this.hotTable.setCellMetaObject(geo[0].row, col, { 'className': '', comment: { value: '' } });
                        this.hotTable.render();
                    }
                }
            }
            if (restprd && restprd.length > 0) {
                this.setDeafultARSettlementAndRestPeriod(restprd);
            }
            if (bidgeo.length>0 ||mrktseg.length>0 ||payoutbasedon.length>0 || media.length>0) {
                PTE_CellChange_Util.checkinputvalueisvalid(changes,this.columns,this.dropdownResponses);
            }
            //KIT on change events
            if (KIT_ECAP && KIT_ECAP.length > 0) {
                PTE_CellChange_Util.kitEcapPriceChange(KIT_ECAP, this.columns, this.curPricingTable);
            }
            if (KIT_DSCNT && KIT_DSCNT.length > 0) {
                PTE_CellChange_Util.kitDSCNTChange(KIT_DSCNT, this.columns, this.curPricingTable);
            }
            if (KIT_name && KIT_name.length > 0) {
                this.lastEditedKitName = KIT_name;
                this.kitNameObjArr = PTE_CellChange_Util.kitNameExists(KIT_name, this.columns, this.curPricingTable);
                //open KIT confirmation message if the same name exists
                if (this.kitNameObjArr && this.kitNameObjArr.length > 0) {
                    //and the object will assign the first one
                    this.kitNameObj = this.kitNameObjArr[0];
                    this.isKitDialog = true;
                }
            }
            if (tierChg && tierChg.length > 0) {
                PTE_CellChange_Util.tierChange(tierChg, this.columns, this.curPricingTable);
            }
            if (rateChg && rateChg.length > 0) {
                PTE_CellChange_Util.RateChgfn(rateChg, this.columns, this.curPricingTable);
            }
            if (pgChg && pgChg.length > 0) {
                if (changes.length > 0) {
                    this.createNewPrcObt(this.curPricingTable);
                    PTE_CellChange_Util.pgChgfn(pgChg, this.columns, this.curPricingTable, this.contractData, this.custCellEditor, this.newPricingTable);
                }
            }
            if (pgChg.length == 0) {
                if (changes.length > 0 && changes[0].old != changes[0].new) {
                    this.createNewPrcObt(this.curPricingTable);
                    PTE_CellChange_Util.checkfn(changes[0], this.curPricingTable, this.columns, '', this.contractData, this.custCellEditor, this.newPricingTable);
                }
            }
            //for multi tier there can be more tiers to delete so moving the logic after all change 
            if (this.multiRowDelete && this.multiRowDelete.length > 0 && this.isDeletePTR) {
                this.deleteRow(this.multiRowDelete);
            }

            if (forcast && forcast.length > 0) {
                //making the start vol val to zero incase empty
                PTE_CellChange_Util.forcastevaluechange(forcast, this.columns);
            }

            if (startVol && startVol.length > 0) {
                //making the start vol val to zero incase empty
                PTE_CellChange_Util.defaultVolVal(startVol, this.columns, this.curPricingTable);
            }
            let startDt = where(changes, { prop: 'START_DT' });
            if (startDt) {
                PTE_CellChange_Util.dateChange(startDt, 'START_DT', this.contractData);
            }
            let endDt = where(changes, { prop: 'END_DT' });
            if (endDt) {
                PTE_CellChange_Util.dateChange(endDt, 'END_DT', this.contractData);
            }
            let OEMlunchDt = where(changes, { prop: 'OEM_PLTFRM_LNCH_DT' });
            if (OEMlunchDt) {
                PTE_CellChange_Util.dateChange(OEMlunchDt, 'OEM_PLTFRM_LNCH_DT', this.contractData);
            }
            let OEMEOLDt = where(changes, { prop: 'OEM_PLTFRM_EOL_DT' });
            if (OEMEOLDt) {
                PTE_CellChange_Util.dateChange(OEMEOLDt, 'OEM_PLTFRM_EOL_DT', this.contractData);
            }
            if ((PTR_EXLDS && PTR_EXLDS.length > 0)) {
                this.isExcludePrdChange = true;
                PTE_CellChange_Util.excludeProdChanges(PTR_EXLDS,this.columns)
            }
            //to make sure to trigger translate API call.(Product validation)
            PTE_CellChange_Util.setPTRSYStoEmpty(changes);

            const isEnable = this.hotTable.isEmptyRow(0);
            this.enableDeTab.emit({ isEnableDeTab: !isEnable, enableDeTabInfmIcon: this.isDeTabInfmIconReqd });
        //to stop loader
        this.pteLoaderPopUp(changes,'stop-loader');
        }
    }

    setDeafultARSettlementAndRestPeriod(obj){
                let field= obj[0].prop;
                let selrow=obj[0].row;
        if (obj[0].new != '' ) {
             this.createNewPrcObt(this.curPricingTable);
             let PTRCount = this.hotTable.countRows();
            
             if (field == 'AR_SETTLEMENT_LVL') {

                for (let i = 0; i < PTRCount; i++) {
                    if (!this.hotTable.isEmptyRow(i)) {
                        let ptrows = [];
                        ptrows.push({ row: i, prop: field, old: this.hotTable.getDataAtRowProp(i, field), new: obj[0].new });
                        PTE_CellChange_Util.autoFillARSet(ptrows, this.contractData, this.curPricingTable, this.custCellEditor);
                        if (this.hotTable.getDataAtRowProp(i, 'PERIOD_PROFILE') == '' && (this.hotTable.getDataAtRowProp(selrow, 'RESET_VOLS_ON_PERIOD') == '' || this.hotTable.getDataAtRowProp(selrow, 'RESET_VOLS_ON_PERIOD') == null)) {
                            PTE_CellChange_Util.checkfn(ptrows[0], this.curPricingTable, this.columns, '', this.contractData, this.custCellEditor, this.newPricingTable)
                        }
                    } else {
                        break;
                    }
                }
            }
            if (field == 'PERIOD_PROFILE' && this.hotTable.getDataAtRowProp(selrow, 'AR_SETTLEMENT_LVL') == '' && this.hotTable.getDataAtRowProp(selrow, 'RESET_VOLS_ON_PERIOD') == '') {
                for (let i = 0; i < PTRCount; i++) {
                    if (!this.hotTable.isEmptyRow(i)) {
                        let ptrows = [];
                        ptrows.push({ row: i, prop: field, old: this.hotTable.getDataAtRowProp(i, field), new: '' });
                        PTE_CellChange_Util.checkfn(ptrows[0], this.curPricingTable, this.columns, '', this.contractData, this.custCellEditor, this.newPricingTable);

                    } else {
                        break;
                    }
                }
            }
            if (field == 'RESET_VOLS_ON_PERIOD' && this.hotTable.getDataAtRowProp(selrow, 'AR_SETTLEMENT_LVL') == '' && this.hotTable.getDataAtRowProp(selrow, 'PERIOD_PROFILE') == '') {
                for (let i = 0; i < PTRCount; i++) {
                    if (!this.hotTable.isEmptyRow(i)) {
                        let ptrows = [];
                        ptrows.push({ row: i, prop: field, old: this.hotTable.getDataAtRowProp(i, field), new: '' });
                        PTE_CellChange_Util.checkfn(ptrows[0], this.curPricingTable, this.columns, '', this.contractData, this.custCellEditor, this.newPricingTable)
                    } else {
                        break;
                    }
                }
            }
        }
    }

    errorOnMdtFdDeletion(changes) {
        let isRequired = false;
        //to check whether modified column is requirede column or not
        const behaviors = this.hotTable.getDataAtRowProp(changes[0].row, '_behaviors');
        if ((behaviors && behaviors.isRequired && behaviors.isRequired[changes[0].prop]) || this.productValidationDependencies.includes(changes[0].prop))
            isRequired = true;
        if ((changes[0].new == null || changes[0].new == '' || changes[0].new == undefined) && this.pricingTableTemplates['model']['fields'][changes[0].prop].nullable == false && isRequired) {
            const colSPIdx = findIndex(this.columns, { data: changes[0].prop });
            this.hotTable.setCellMetaObject(changes[0].row, colSPIdx, { 'className': 'error-border', comment: { value: 'This field is required' } });
            this.hotTable.render();
        } else {
            this.removeCellComments(changes[0].row, changes[0].prop)
        }
    }

    removeCellComments(row,prop){
        const col = findIndex(this.columns, { data: prop });
        const cellMeta = this.hotTable.getCellMeta(row, col);
        this.cellComments.find( (cmnt,ind) => {
            if (ind < this.cellComments.length){
            if (cmnt.row == row && cmnt.col == col ) {
                this.cellComments.splice(ind,1)
                }
            }
        })
        if (cellMeta && cellMeta.className && cellMeta.className.toString().match('error-border')) {
            
            this.hotTable.setCellMetaObject(row,col,{ 'className': '', comment: { value: '' } });
            this.hotTable.render();
        }
    }
    async deletePTR() {
        this.isLoading = true;
        this.setBusy("Deleting...", "Deleting the Table row", "Info", true);

        let delDCIDs = [];
        each(this.multiRowDelete, item => {
            delDCIDs.push(this.hotTable.getDataAtRowProp(item.row, 'DC_ID'));
        });
        //calling the below method to validate the non-deleted records and if no client side validations then it will proceed for deletion
        this.validatePricingTableProducts(delDCIDs);
    }
    showHelpTopic() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Pricing-Table-Editor.aspx', '_blank');
    }
    closeKitDialog() {
        //close kitdialog closes the kendo dialog and clear the kit name cell
        PTE_CellChange_Util.closeKitDialog(this.kitNameObj, this.columns, this.curPricingTable,this.lastEditedKitName);
        this.isKitDialog = false;
        //Once the first dialog is closed will splice the first record and see anyother result and will constinue till last one
        this.kitNameObjArr.splice(0, 1);
        if (this.kitNameObjArr && this.kitNameObjArr.length > 0) {
            this.kitNameObj = this.kitNameObjArr[0]
            this.isKitDialog = true;
        }
    }
    mergeKitDeal() {
        this.setBusy("Reloading...", "Table Editor Reloading please wait", "Info", true);
        this.isKitDialog = false;
        setTimeout(() => {
            let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
            PTR = map(PTR, (x) => { return { DEAL_GRP_NM: x['DEAL_GRP_NM'].toUpperCase() } });
            let firstRow = findIndex(PTR, { DEAL_GRP_NM: this.kitNameObj.name.toUpperCase() });
            let products = this.hotTable.getDataAtRowProp(firstRow, 'PTR_USER_PRD').split(',');
            PTE_CellChange_Util.mergeKitDeal(this.kitNameObj, this.columns, this.curPricingTable, this.contractData, this.pricingTableTemplates);
            // Delete after merging, since Products, ECAP_Price, Kit Rebate, Discount Perline, Quantity, Total discount per line needs to be updated after merge 
            each(this.kitNameObj.PTR, (itm) => {
                let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
                PTR = map(PTR, (x) => { return { DEAL_GRP_NM: x['DEAL_GRP_NM'].toUpperCase() } });
                let PTRlen = filter(PTR, (x) => { return x.DEAL_GRP_NM.toUpperCase() == this.kitNameObj.name.toUpperCase() }).length;
                let lastRow = findLastIndex(PTR, { DEAL_GRP_NM: this.kitNameObj.name.toUpperCase() });
                if (PTRlen > 1) {
                    let prdlen = this.hotTable.getDataAtRowProp(lastRow, 'PTR_USER_PRD').split(',').length;
                    let DC_ID = this.hotTable.getDataAtRowProp(lastRow, 'DC_ID');
                    let count = 0;
                    for (let index = lastRow; index < (lastRow + prdlen); index++) {
                        let i = firstRow + products.length + count;
                        if (!products.includes(this.hotTable.getDataAtRowProp(index, 'PRD_BCKT'))) {
                            let ecapPrice = this.hotTable.getDataAtRowProp(index, 'ECAP_PRICE');
                            PTE_CellChange_Util.updatePrdColumns(i, 'ECAP_PRICE', ecapPrice);
                            let dcntPerLine = this.hotTable.getDataAtRowProp(index, 'DSCNT_PER_LN');
                            PTE_CellChange_Util.updatePrdColumns(i, 'DSCNT_PER_LN', dcntPerLine);
                            let qty = this.hotTable.getDataAtRowProp(index, 'QTY');
                            PTE_CellChange_Util.updatePrdColumns(i, 'QTY', qty);
                            let totdcntPerLine = this.hotTable.getDataAtRowProp(index, 'TEMP_TOTAL_DSCNT_PER_LN');
                            PTE_CellChange_Util.updatePrdColumns(i, 'TEMP_TOTAL_DSCNT_PER_LN', totdcntPerLine);
                        }
                        count++;
                    }
                    if (DC_ID > 0) {
                        this.kitMergeDeleteDCIDs.push(DC_ID);
                    }
                    setTimeout(() => {
                        //to calculate the merged row KIT Rebate value
                        PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
                        let DCID = this.hotTable.getDataAtRowProp(firstRow, 'DC_ID');
                        let numOfTiers = where(PTR, { DC_ID: DCID }).length;
                        let firstTierRowInd = findIndex(PTR, x => { return x.DC_ID == DCID })
                        let val = PTE_Load_Util.calculateKitRebate(PTR, firstTierRowInd, numOfTiers, false)
                        this.hotTable.setDataAtRowProp(firstTierRowInd, 'TEMP_KIT_REBATE', val, 'no-edit');
                        //to remove the merged row
                        this.hotTable.alter('remove_row', lastRow, prdlen, 'no-edit');
                    },100);
                }
            });
            this.kitNameObjArr.splice(0, 1);
            if (this.kitNameObjArr && this.kitNameObjArr.length > 0) {
                this.kitNameObj = this.kitNameObjArr[0];
                this.isKitDialog = true;
            }
            this.setBusy("", "", "", false);
        }, 0);
    }
    deleteRow(rows: Array<any>, isProdCorrectorDeletion?): void {
        try {
            let delRows = [];
            const PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
            //delete can be either simple row delete for PTR not saved or can be PTR which are saved
            each(PTR, (PTRow, ind) => {
                each(rows, row => {
                    const DCID = this.hotTable.getDataAtRowProp(row.row, 'DC_ID');
                    if (PTRow.DC_ID == DCID) {
                        delRows.push({ row: ind, DC_ID: PTRow.DC_ID });
                    }
                })
            });
            //delete the row data from transformResults Object if any
            if (this.transformResults && this.transformResults['Data'] && Object.keys(this.transformResults['Data']).length > 0) {
                each(delRows, (delRow) => {
                    if (this.transformResults['Data'].DuplicateProducts && this.transformResults['Data'].DuplicateProducts[delRow.DC_ID]) {
                        delete this.transformResults['Data'].DuplicateProducts[delRow.DC_ID];
                        if (Object.keys(this.transformResults['Data'].DuplicateProducts).length == 0)
                            delete this.transformResults['Data'].DuplicateProducts;
                    }
                    if (this.transformResults['Data'].InValidProducts && this.transformResults['Data'].InValidProducts[delRow.DC_ID]) {
                        delete this.transformResults['Data'].InValidProducts[delRow.DC_ID];
                        if (Object.keys(this.transformResults['Data'].InValidProducts).length == 0)
                            delete this.transformResults['Data'].InValidProducts;
                    }
                    if (this.transformResults['Data'].ProdctTransformResults && this.transformResults['Data'].ProdctTransformResults[delRow.DC_ID]) {
                        delete this.transformResults['Data'].ProdctTransformResults[delRow.DC_ID];
                        if (Object.keys(this.transformResults['Data'].ProdctTransformResults).length == 0)
                            delete this.transformResults['Data'].ProdctTransformResults;
                    }
                    if (this.transformResults['Data'].ValidProducts && this.transformResults['Data'].ValidProducts[delRow.DC_ID]) {
                        delete this.transformResults['Data'].ValidProducts[delRow.DC_ID];
                        if (Object.keys(this.transformResults['Data'].ValidProducts).length == 0)
                            delete this.transformResults['Data'].ValidProducts;
                    }
                })
            }
            const savedRows = filter(delRows, row => { return row.DC_ID > 0 });
            const nonSavedRows = filter(delRows, row => { return row.DC_ID < 0 });
            //this condition means all rows are non DC_ID rows so that no need to hit API
            if (nonSavedRows.length > 0 && nonSavedRows.length == delRows.length) {
                //multiple delete at the sametime this will avoid issues of deleting one by one
                //making as unique rows to avoid multiple deletions happens
                const rowstoDel=  unique(delRows, 'row');
                this.hotTable.alter('remove_row', delRows[0].row, rowstoDel.length, 'no-edit');
                this.getMergeCellsOnDelete();
                this.multiRowDelete = [];
                this.isDeletePTR = false;
                //setting the value to empty to avoid extra delete
            }
            //this condition for all rows are saved DC_ID rows so hit API
            if (savedRows.length > 0 && delRows.length == savedRows.length && !isProdCorrectorDeletion) {//if product deleted through product corrector, no need of api call
                //this will openup dialog box and call closeDialog function
                this.isDialogOpen = true;
            }
            //this condition for both case
            if (nonSavedRows.length > 0 && savedRows.length > 0 && !isProdCorrectorDeletion) {//if product deleted through product corrector, no need of api call
                this.hotTable.alter('remove_row', nonSavedRows[0].row, nonSavedRows.length, 'no-edit');
                this.getMergeCellsOnDelete();
                //this step will move all the deleted records which matched nonSavedRows records
                this.multiRowDelete = reject(this.multiRowDelete, itm => { return contains(pluck(nonSavedRows, 'row'), itm.row) });
                this.isDialogOpen = true;
            }
            if (savedRows.length > 0 && nonSavedRows.length > 0 && isProdCorrectorDeletion) {//if product deleted through product corrector, delete from UI before save action
                each(nonSavedRows, (nonSavedRow) => {
                    this.hotTable.alter('remove_row', nonSavedRow.row, 1, 'no-edit');
                    this.getMergeCellsOnDelete();
                    //this step will move all the deleted records which matched nonSavedRows records
                    this.multiRowDelete = reject(this.multiRowDelete, itm => { return contains(pluck(nonSavedRow, 'row'), itm.row) });
                })
            }
            if (savedRows.length > 0 && isProdCorrectorDeletion) {//if product deleted through product corrector, delete from UI before save action
                each(savedRows, (savedRow) => {
                    this.hotTable.alter('remove_row', savedRow.row, 1, 'no-edit');
                    this.getMergeCellsOnDelete();
                    //this step will move all the deleted records which matched nonSavedRows records
                    this.multiRowDelete = reject(this.multiRowDelete, itm => { return contains(pluck(savedRow, 'row'), itm.row) });
                })
            }
        }
        catch (ex) {
            this.loggerService.error('deleteRow::', ex);
        }
    }
    async getAllDrowdownValues() {
        let dropObjs = {};
        each(this.pricingTableTemplates.defaultAtrbs, (val, key) => {
            if (key == "REBATE_TYPE") {
                val.opLookupUrl = val.opLookupUrl.replace('GetDropdowns/REBATE_TYPE', 'GetFilteredRebateTypes/false');
            }
            dropObjs[`${key}`] = this.pteService.readDropdownEndpoint(val.opLookupUrl);
        });
        if (this.isTenderContract) {
            let key = "QLTR_BID_GEO";
            let val = this.pricingTableTemplates.columns.filter(x => x.field == "QLTR_BID_GEO");
            if (val != undefined && val != null && val.length > 0) {
                dropObjs[`${key}`] = this.pteService.readDropdownEndpoint(val[0].lookupUrl);
            }
        }
        each(this.pricingTableTemplates.model.fields, (item, key) => {
            if (item && item.uiType && (item.uiType == 'DROPDOWN' || item.uiType == 'MULTISELECT') && item.opLookupUrl && item.opLookupUrl != '' && (dropObjs[`${key}`] == null || dropObjs[`${key}`] == undefined)) {
                if (key == 'SETTLEMENT_PARTNER') {
                    //calling  settlement partner seperatly
                    dropObjs['SETTLEMENT_PARTNER'] = this.pteService.readDropdownEndpoint(item.opLookupUrl + '/' + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'PERIOD_PROFILE') {
                    //calling  PERIOD_PROFILE 
                    dropObjs['PERIOD_PROFILE'] = this.pteService.readDropdownEndpoint(item.opLookupUrl + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'CUST_ACCNT_DIV') {
                    //calling  Customer Divisions
                    dropObjs['CUST_ACCNT_DIV'] = this.pteService.readDropdownEndpoint(item.opLookupUrl + '/' + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'ORIG_ECAP_TRKR_NBR') {
                    console.log('no valid URL Need to check');
                }
                else {
                    dropObjs[`${key}`] = this.pteService.readDropdownEndpoint(item.opLookupUrl);
                }
            }
        })

        let result = await forkJoin(dropObjs).toPromise().catch((err) => {
            this.loggerService.error('Something went wrong', 'Error');
            console.error('pricingTableEditorComponent::getAllDrowdownValues::service', err)
        });
        return result;
    }
    async loadPTE() {
        try {
            this.isLoading = true;
            this.overlapFlexResult = [];
            if (this.savedResponseWarning.length > 0){
                this.setBusy("Saved with warnings", "Didn't pass Validation", "Warning", true);
            } else {
                this.setBusy("Loading...", "Loading the Table Editor", "Info", true);
            }
            
            let PTR = await this.getPTRDetails();
            //to avoid losing warning details which comes only during save action
            if (this.savedResponseWarning && this.savedResponseWarning.length > 0) {
                PTE_Load_Util.bindWarningDetails(PTR, this.savedResponseWarning);
                this.dirty = PTR.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0 ? true : false;
            }
            //this is to make sure the saved record prod color are success by default
            PTR = PTE_Load_Util.setPrdColor(PTR);
            this.getTemplateDetails();
            if (Object.keys(this.dropdownResponses).length ==0) {
                this.dropdownResponses = await this.getAllDrowdownValues();
            }
            if (this.dropdownResponses["SETTLEMENT_PARTNER"] != undefined) {
                this.VendorDropDownResult = this.dropdownResponses["SETTLEMENT_PARTNER"];
            }
            //this is only while loading we need , need to modify as progress
            PTR = PTE_Load_Util.pivotData(PTR, this.isTenderContract, this.curPricingTable, this.kitDimAtrbs);
            this.generateHandsonTable(PTR);
            this.isLoading = false;
        }
        catch (ex) {
            this.loggerService.error('Something went wrong.', 'Error');
            console.error('DEAL_EDITOR::ngOnInit::', ex);
        }

    }
    custDivNull(act: boolean) {
        if (act == true) {
            this.isCustDivNull = false;
            this.ValidateAndSavePTE(true);
        } else {
            this.isCustDivNull = false;
        }
    }
    undoPTE() {
        this.hotTable.undo();
        this.redoEnable = true;
        this.undoCount -= 1
        this.redoCount += 1;
        if (this.undoCount == 0) this.undoEnable = false;
    }
    redoPTE() {
        this.hotTable.redo();
        this.redoCount -= 1;
        this.undoCount += 1;
        if (this.redoCount == 0) this.redoEnable = false;
        if (this.undoCount > 0) this.undoEnable = true;
    }
    async ValidateAndSavePTE(isValidProd, deleteDCIDs?) {
        if (isValidProd) {
            //Handsonetable loading taking some time so putting this logic for loader
            let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
            //removing the deleted records from PTR
            if (deleteDCIDs && deleteDCIDs.length > 0) {
                each(deleteDCIDs, (delId) => {
                    PTR = PTR.filter(x => x.DC_ID != delId);
                })
            }
            let error = false;
            let finalPTR: any;
            //if not all the records got deleted, it will do validation for non-deleted records
            if (PTR && PTR.length > 0) {
                let flexReqData = PTE_Common_Util.getOverlapFlexProducts(this.curPricingTable, PTR);
                if (flexReqData != undefined) {
                    this.overlapFlexResult = await this.flexoverLappingCheckDealsService.GetProductOVLPValidation(flexReqData).toPromise();
                }
                //Checking for UI errors
                finalPTR = PTE_Save_Util.validatePTE(PTR, this.curPricingStrategy, this.curPricingTable, this.contractData, this.overlapFlexResult, this.validMisProd);
                //if there is any error bind the result to handsone table
                error = PTE_Save_Util.isPTEError(finalPTR, this.curPricingTable);
            }
            //if non-deleted records having any validation error, it will stop deletion action as well
            if (error) {
                this.generateHandsonTable(finalPTR);
                this.loggerService.warn('Mandatory validations failure.', 'Warning');
                this.setBusy("", "", "", false);
            }
            else {
                //it will update cashObj for non-deleted records
                if (finalPTR && finalPTR.length > 0) {
                    const cashObj = finalPTR.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
                    if (cashObj && cashObj.length > 0) {
                        if (this.VendorDropDownResult != null && this.VendorDropDownResult != undefined && this.VendorDropDownResult.length > 0) {
                            const customerVendor = this.VendorDropDownResult;
                            each(finalPTR, (item) => {
                                const partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
                                if (partnerID && partnerID.length == 1) {
                                    item.SETTLEMENT_PARTNER = partnerID[0].DROP_DOWN;
                                }
                            });
                        }
                    }
                }
                this.dirty = false;
                this.undoEnable = false;
                await this.saveEntireContractRoot(finalPTR, deleteDCIDs);
            }
        }
        else {
            if (this.showErrorMsg != false) {
                this.loggerService.error('All products are not valid', 'Products are not valid');
            }
        }
    }
    async saveEntireContractRoot(finalPTR: Array<any>, deleteDCIDs?) {
        if (finalPTR && finalPTR.length > 0) {//to check is there any records exists in PTE(not all records got deleted) 
            //this logic is mainly for tier dealtypes to convert the PTR to savbale JSON
            finalPTR = PTE_Helper_Util.deNormalizeData(finalPTR, this.curPricingTable);
            //This method will remove all the unwanted property since there are keys with undefined values
            finalPTR = PTE_Common_Util.deepClone(finalPTR);
            //settment partner change for taking only the ID the API will send back us the both
            finalPTR = PTE_Save_Util.settlementPartnerValUpdate(finalPTR);
            //sanitize Data before save this will make sure all neccessary attributes are avaialbel
            finalPTR = PTE_Save_Util.sanitizePTR(finalPTR, this.contractData);
            //Adding missed fields in SaveAPI payload
            PTE_Save_Util.fillingPayLoad(finalPTR, this.curPricingTable,this.pricingTableDet);
        }
        let data;
        if (deleteDCIDs && deleteDCIDs.length > 0) {//If records got deleted, need to send deleted DCID's to the save API call
            data = {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [this.curPricingTable],
                "PricingTableRow": finalPTR && finalPTR.length > 0 ? finalPTR : [],
                "WipDeals": [],
                "EventSource": 'PRC_TBL',
                "Errors": {},
                "PtrDelIds": deleteDCIDs
            }
        }
        else {//If action is only save not deletion
            data = {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [this.curPricingTable],
                "PricingTableRow": finalPTR,
                "WipDeals": [],
                "EventSource": 'PRC_TBL',
                "Errors": {}
            }
        }
        this.isLoading = true;
        if (deleteDCIDs && deleteDCIDs.length > 0)
            this.setBusy("Deleting...", "Deleting the Table row", "Info", true);
        else
            this.setBusy("Saving your data...", "Please wait as we save your information", "Info", true);
        let result = await this.pteService.updateContractAndCurrentPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, false).toPromise().catch((error) => {
            this.loggerService.error("Something went wrong", 'Error');
            console.error("pricingTableEditorComponent::saveUpdatePTEAPI::", error);
        });
        this.undoEnable = false;
        if (result) {
            this.savedResponseWarning = [];
            await this.refreshContractData(this.in_Ps_Id, this.in_Pt_Id);
            if (this.isTenderContract && deleteDCIDs && deleteDCIDs.length > 0) {
                //Refresh TTE data after Delete
                this.tmDirec.emit('Delete');
            }
            //to avoid losing warning details which comes only during save action
            if (result["Data"]["PRC_TBL_ROW"] && result["Data"]["PRC_TBL_ROW"].length > 0) {
                let data = result["Data"]["PRC_TBL_ROW"];
                if (data.filter(x => x.warningMessages !== undefined && x.warningMessages.length > 0).length > 0)
                    PTE_Save_Util.saveWarningDetails(data, this.savedResponseWarning);
            }
            //making as empty after save deletion logic will work 
            this.transformResults['Data']=null;
            //this will help to reload the page with errors when we update
            await this.loadPTE();
            if (deleteDCIDs == undefined) {
                each(this.newPTR, (item) => {
                    if (item.warningMessages !== undefined && item.warningMessages.length > 0) {
                        this.warnings = true;
                    }
                })
                if ((!this.warnings) && this.isTenderContract) {
                    this.tmDirec.emit('DE');
                } else if (this.warnings && this.isTenderContract) {
                    this.tmDirec.emit('');
                }
                this.warnings = false;
            }
        }
        else {
            this.loggerService.error("Something went wrong", 'Error');
            console.error("pricingTableEditorComponent::saveUpdatePTEAPI::", 'error');
        }
        this.isLoading = false;

    }
    async validatePricingTableProducts(deleteDCIDs?) {
        let currentPricingTableRowData = this.newPTR.filter(x => x.DC_ID != null);
        let hasProductDependencyErr = false;
        if (currentPricingTableRowData && currentPricingTableRowData.length > 0) {
            hasProductDependencyErr = PTEUtil.hasProductDependency(currentPricingTableRowData, this.productValidationDependencies, hasProductDependencyErr);
            if (hasProductDependencyErr) {
                // if errors are present this will terminate and save will not go forward
                this.isLoading = true;
                this.setBusy("Not saved. Please fix errors.", "Please fix the errors so we can properly validate your products", "Error", true);
                setTimeout(() => {
                    this.isLoading = false;
                    this.setBusy("", "", "", false);
                }, 5000);
                this.loggerService.warn('Mandatory validations failure.', 'Warning');
                return;
            }
            if (this.kitMergeDeleteDCIDs && this.kitMergeDeleteDCIDs.length > 0) {// if any rows got deleted because while merging the rows
                if (!deleteDCIDs)
                    deleteDCIDs = this.kitMergeDeleteDCIDs;
                else {
                    each(this.kitMergeDeleteDCIDs, (delId) => {
                        deleteDCIDs.push(delId);
                    })
                }
                this.kitMergeDeleteDCIDs = [];
            }
            //validate Products for non-deleted records, if any product is invalid it will stop deletion as well
            const isValidProd = await this.validateOnlyProducts('onSave', undefined, deleteDCIDs);
            if (isValidProd != undefined)
                await this.saveAndValidate(isValidProd, deleteDCIDs);
        }
    }
    async saveAndValidate(isValidProd, deleteDCIDs?) {
        //Handsonetable loading taking some time so putting this logic for loader
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        //removing the deleted record from PTR
        if (deleteDCIDs && deleteDCIDs.length > 0) {
            each(deleteDCIDs, (delId) => {
                PTR = PTR.filter(x => x.DC_ID != delId);
            })
        }
        const multiGeoWithoutBlend = PTE_Validation_Util.validateMultiGeoForHybrid(PTR, this.curPricingStrategy.IS_HYBRID_PRC_STRAT);
        if (multiGeoWithoutBlend != "0") {
            if (multiGeoWithoutBlend == "1") {
                this.loggerService.error('Multiple GEO Selection not allowed without BLEND', 'error');
                isValidProd = false;
            }
            else if (multiGeoWithoutBlend == "2") {
                this.loggerService.error('Duplicate Product(s) are not allowed in same PS.', 'error');
                isValidProd = false;
            }
        }
        else {
            this.isCustDivNull = this.contractData.CUST_ACCNT_DIV == '' ? false : PTE_Helper_Util.isCustDivisonNull(PTR);
            if (!this.isCustDivNull) {
                await this.ValidateAndSavePTE(isValidProd, deleteDCIDs);
            }
        }
    }
    async validateOnlyProducts(action: string, curRow?, deleteDCIDs?) {
        let isPrdValid: any = null;
        //generate PTE
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let oldPTR=JSON.parse(JSON.stringify(PTR));
        //removed because of products getting shuffled in deal editor
        // if (deleteDCIDs && deleteDCIDs.length > 0) {
        //     each(deleteDCIDs, (delId) => {
        //         PTR = PTR.filter(x => x.DC_ID != delId);
        //     })
        // }
        let translateResult = await this.validateProducts(PTR, false, true, null);
        let updatedPTRObj: any = null;
        if (translateResult && translateResult['Data']) {
            let prdValResult = PTEUtil.isValidForProdCorrector(translateResult['Data']);
            updatedPTRObj = PTEUtil.cookProducts(translateResult['Data'], PTR);
            //code to bind the cook result of success or failure
            let PTR_col_ind = findIndex(this.columns, { data: 'PTR_USER_PRD' });
            let PTR_EXCL_col_ind = findIndex(this.columns, { data: 'PRD_EXCLDS' });
            each(updatedPTRObj.rowData, (data, idx) => {
                this.hotTable.setDataAtRowProp(idx, 'PTR_SYS_PRD', data.PTR_SYS_PRD, 'no-edit');
                if (curRow && data.DC_ID == curRow[0]['DC_ID']) {
                    curRow[0]['PTR_SYS_PRD'] = data.PTR_SYS_PRD;

                    if (curRow && (data['PTR_USER_PRD'] && curRow[0]['PTR_USER_PRD'] && !PTEUtil.isEqual(data['PTR_USER_PRD'], curRow[0]['PTR_USER_PRD']) ||
                        (data['PRD_EXCLDS'] && curRow[0]['PRD_EXCLDS'] && !PTEUtil.isEqual(data['PRD_EXCLDS'], curRow[0]['PRD_EXCLDS'])))) {
                        curRow[0].delPTR_SYS_PRD = true;
                    }
                }

                if (data && data._behaviors && data._behaviors.isError) {
                    if (!data._behaviors.isError['PTR_USER_PRD'] && data.PTR_SYS_INVLD_PRD == "" && data.PTR_SYS_PRD != "") {
                        this.hotTable.setCellMeta(idx, PTR_col_ind, 'className', 'success-product');
                    }
                    else {
                        this.hotTable.setCellMeta(idx, PTR_col_ind, 'className', 'error-product');
                    }
                    this.hotTable.render();
                }

                // Do not update the cell value if exclude product is invalid/NULL
                if (this.curPricingTable.OBJ_SET_TYPE_CD != 'KIT' && this.curPricingTable.OBJ_SET_TYPE_CD != 'ECAP'
                    && data.PRD_EXCLDS != null && data.PRD_EXCLDS != "") {

                    if (data && data._behaviors && data._behaviors.isError) {
                        if (!data._behaviors.isError['PRD_EXCLDS'] && data.PTR_SYS_INVLD_PRD == "" && data.PTR_SYS_PRD != "") {
                            this.hotTable.setCellMeta(idx, PTR_EXCL_col_ind, 'className', 'success-product');
                        }
                        else {
                            this.hotTable.setCellMeta(idx, PTR_col_ind, 'className', 'error-product');
                            this.hotTable.setCellMeta(idx, PTR_EXCL_col_ind, 'className', 'error-product');
                        }
                        //setcellmeta will not render the color by default either you should make some proprty change of render
                        this.hotTable.render();
                    }
                }
            })

            if (contains(prdValResult, '1')) {
                // Product corrector if invalid products
                this.isLoading=false;
                if ((action == 'onOpenSelector' && translateResult['Data'] &&
                    ((translateResult['Data'].DuplicateProducts && translateResult['Data'].DuplicateProducts[curRow[0].DC_ID]) ||
                        (translateResult['Data'].InValidProducts && translateResult['Data'].InValidProducts[curRow[0].DC_ID]))) ||
                    action != 'onOpenSelector') {
                    await this.openProductCorrector(translateResult['Data'], action, deleteDCIDs);
                    if (curRow) {
                        curRow[0].isOpenCorrector = true;
                    }
                }
                if (action == 'onSave') {
                    this.showErrorMsg = false;
                    if (deleteDCIDs && deleteDCIDs.length > 0) {
                        //setting PTR_SYS_INVLD_PRD while deleting of products
                        for (let key in this.transformResults.Data.ProdctTransformResults) {
                        if (this.transformResults.Data.InValidProducts[key]["I"].length !== 0 || this.transformResults.Data.InValidProducts[key]["E"].length !== 0 || !!this.transformResults.Data.DuplicateProducts[key]) {
                            let invalidJSON = {
                                'ProdctTransformResults': this.transformResults.Data.ProdctTransformResults[key],
                                'InValidProducts': this.transformResults.Data.InValidProducts[key], 'DuplicateProducts': this.transformResults.Data.DuplicateProducts[key]
                            }
                            oldPTR.forEach((itm,indx) => {
                                if(itm.DC_ID==key){
                                 PTE_CellChange_Util.updatePrdColumns(indx, 'PTR_SYS_INVLD_PRD', JSON.stringify(invalidJSON));
                                }
                            });
                        } 
                    }
                     return true;
                    }
                }
            }
            else {
                if (this.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                    each(updatedPTRObj.rowData, (data, idx) => {
                        this.hotTable.setDataAtRowProp(idx, 'PTR_USER_PRD', data.PTR_USER_PRD, 'no-edit')

                    });
                    let denBandData = PTE_CellChange_Util.validateDensityBand(0, this.columns, this.curPricingTable, '', translateResult['Data'], false, this.validMisProd);
                    this.validMisProd = denBandData.validMisProds;
                    this.generateHandsonTable(denBandData.finalPTR);
                }
                if (action == 'onSave') {
                    await this.productOrdering();
                    //since the errors are binding from cook products check for any error
                    isPrdValid = find(updatedPTRObj.rowData, (x) => {
                        if (x._behaviors && x._behaviors.isError) {
                            return contains(values(x._behaviors.isError), true)
                        }
                    });
                    this.isLoading = false;
                    //the result can have both valid and invalid so any failure it should fail to save
                    return isPrdValid != null ? false : true;
                }
                else {
                    if (action != 'onOpenSelector') {
                        this.validationMessage = true;
                    }
                    this.isLoading = false;
                }
                await this.productOrdering();
            }
        }
        else {
            if (action != 'onSave' && action != 'onOpenSelector') {
                this.validationMessage = true;
            }
            this.isLoading = false;
            return true;
        }
    }

    async resetValidationMessage() {
        this.validationMessage = false;
    }
    async validateProducts(currentPricingTableRowData, publishWipDeals, saveOnContinue, currentRowNumber) {
        let hasProductDependencyErr = false;
        hasProductDependencyErr = PTEUtil.hasProductDependency(currentPricingTableRowData, this.productValidationDependencies, hasProductDependencyErr);
        if (hasProductDependencyErr) {
            // if errors are present this will terminate and save will not go forward
            this.isLoading = true;
            this.setBusy("Not saved. Please fix errors.", "Please fix the errors so we can properly validate your products", "Error", true);
            setTimeout(() => {
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, 1300);
            this.loggerService.warn('Mandatory validations failure.', 'Warning');
            return;
        }
        let translationInput = PTEUtil.translationToSendObj(this.curPricingTable, currentPricingTableRowData, this.contractData, this.isExcludePrdChange);
        let translationInputToSend = translationInput.filter(function (x) {
            // If we already have the invalid JSON don't translate the products again
            return x.SendToTranslation == true;
        });

        let pricingTableRowData = currentPricingTableRowData.filter((x) => {

            return ((x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true))
                || (this.curPricingTable.OBJ_SET_TYPE_CD == "KIT") || (this.isExcludePrdChange);
        });

        // Products invalid JSON data present in the row
        let invalidProductJSONRows = pricingTableRowData.filter((x) => {
            return (x.PTR_SYS_INVLD_PRD != null && x.PTR_SYS_INVLD_PRD != "");
        });

        // Products that needs server side attention
        if (translationInputToSend.length > 0) {
            // Validate products
            this.isLoading = true;
            this.setBusy("Validating your data...", "Please wait while we validate your information!", "Info", true);
            let resultdata = await this.productSelectorService.TranslateProducts(translationInputToSend, this.contractData.CUST_MBR_SID, this.curPricingTable.OBJ_SET_TYPE_CD, this.contractData.DC_ID, this.contractData.IS_TENDER) //Once the database is fixed remove the hard coded geo_mbr_sid
                .toPromise()
                .catch(error => {
                    this.loggerService.error("Product Translator failure::", error);
                })
            if (resultdata) {
                this.transformResults['Data'] = PTE_Validation_Util.buildTranslatorOutputObjectproductCorroctor(invalidProductJSONRows, resultdata['Data'], currentPricingTableRowData);
            }
        }
        else if (invalidProductJSONRows && invalidProductJSONRows.length > 0) {
            this.transformResults['Data'] = PTE_Validation_Util.buildTranslatorOutputObjectproductCorroctor(invalidProductJSONRows, this.transformResults['Data'], currentPricingTableRowData);
        }
        this.isLoading = false;
        return this.transformResults;
    }
    openProductSelector() {
        let modalComponent: any = null,
            name: string = '',
            height: string = '',
            width: string = '650px',
            data = {};
         modalComponent = ProductSelectorComponent;
        name = "Product Selector";
        width = "5500px";
        let VM = this;
        let allOperations = [];
        let emptyRow;
        data = { name: name, source: '', selVal: '', contractData: this.contractData, curPricingTable: this.curPricingTable, curRow: '' };
        const dialogRef = this.dialog.open(modalComponent, {
            height: height,
            width: width,
            data: data,
            panelClass: ['dialog-side-panel', 'product-selector-dialog'],
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isLoading = true;
                let cntrctPrdct = [];
                let excludedPrdct = [];
                let sysPrd = {};
                if (result.splitProducts) {
                    let PTR = [];
                    each(result.validateSelectedProducts, (item, idx) => {
                        if (!item[0].EXCLUDE) {
                            cntrctPrdct = [];
                            sysPrd = {};
                            cntrctPrdct.push(item[0].HIER_VAL_NM);
                            sysPrd[item[0].DERIVED_USR_INPUT] = item;
                            if (this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                                if (idx != 0) {
                                    result.validateSelectedProducts[idx].indx = result.validateSelectedProducts[idx - 1].indx
                                        + result.validateSelectedProducts[idx - 1].items.length;
                                }
                            }                           
                            this.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                            let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct.toString() };
                            PTR.push({ row: PTE_CellChange_Util.returnEmptyRow(), prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(result.validateSelectedProducts[idx].indx, 'PTR_USER_PRD'), new: cntrctPrdct.toString() ,operation:operation});
                        }
                    });
                    PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns);
                }
                else {
                    each(result.validateSelectedProducts, (item) => {
                        if (!item[0].EXCLUDE) {
                            cntrctPrdct.push(item[0].HIER_VAL_NM)
                        }
                        else if (item[0].EXCLUDE && !result.splitProducts) {
                            excludedPrdct.push(item[0].HIER_VAL_NM);
                        }
                        sysPrd[item[0].DERIVED_USR_INPUT] = item;
                    });
                    let PTR = [];
                    emptyRow = PTE_CellChange_Util.returnEmptyRow();
                    this.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                    PTR.push({ row: PTE_CellChange_Util.returnEmptyRow(), prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(PTE_CellChange_Util.returnEmptyRow(), 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                    emptyRow = emptyRow + VM.curPricingTable.NUM_OF_TIERS;
                    let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct.toString() };
                    allOperations.push(operation);
                    PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, operation);
                }

                setTimeout(() => {
                    VM.isLoading = false;
                    if (VM.curPricingTable.OBJ_SET_TYPE_CD && VM.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                        if (allOperations.length > 0) {
                            for (let i = 0; i < allOperations.length; i++) {
                                let denBandData = PTE_CellChange_Util.validateDensityBand(emptyRow, VM.columns, VM.curPricingTable, allOperations[i], '', false, VM.validMisProd);
                                VM.validMisProd = denBandData.validMisProds;
                                VM.generateHandsonTable(denBandData.finalPTR);
                            }
                        }
                    }
                    this.isLoading = false;
                }, 2000);
            }
        });
    }
    async openProductCorrector(products: any, action: string, deletedDCID?) {        
        this.kitMergeDeleteDCIDs = []
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let selRow: any;
        let rowProdCorrectordat: any;
        let selRows = []
        each(products.DuplicateProducts, (val, key) => {
            let res = findWhere(PTR, { DC_ID: parseInt(key) });
            let idx = findIndex(PTR, { DC_ID: parseInt(key) });
            selRows.push({ DC_ID: res.DC_ID, name: keys(val).toString(), row: res, indx: idx });
        });
        each(products.InValidProducts, (val, key) => {
            let res = findWhere(PTR, { DC_ID: parseInt(key) });
            let idx = findIndex(PTR, { DC_ID: parseInt(key) });
            if ((selRows.find(a => a.DC_ID == parseInt(key)) != undefined)
                && (selRows.find(a => a.DC_ID == parseInt(key))?.DC_ID != 0))
                return;
            if (values(val) != undefined && values(val) != null)
                selRows.push({ DC_ID: res.DC_ID, name: uniq(values(val)[1]).toString(), row: res, indx: idx });
        });
        let data = { ProductCorrectorData: products, contractData: this.contractData, curPricingTable: this.curPricingTable, selRows: selRows };
        this.isLoading=true;
        this.setBusy("Updating Products", "Please wait while processing.", "info", true);
        const dialogRef = this.dialog.open(ProductCorrectorComponent, {
            height: 'auto',
            maxWidth: "90vw",
            width: '6500px',
            data: data, 
            panelClass: ['dialog-side-panel', 'product-corrector-dialog'],
        });
        await dialogRef.afterClosed().toPromise().then (async(savedResult: any) => {
            if (savedResult) {
                let transformResult = savedResult.ProductCorrectorData;
                this.transformResults["Data"] = transformResult
                let curRowIndx;                

                if (!!transformResult && !!transformResult.ProdctTransformResults) {
                    for (let key in transformResult.ProdctTransformResults) {
                        let r = parseInt(key);
                        let allIssuesDone = false;

                        //Trimming unwanted Property to make JSON light
                        if (!!transformResult.ValidProducts[key]) {
                            transformResult = PTEUtil.massagingObjectsForJSON(key, transformResult);
                        }
                        let index = findWhere(selRows,
                            {
                                DC_ID: r
                            }).indx
                        // Save Valid and InValid JSO into spreadsheet hidden columns
                        if (transformResult.InValidProducts[key]["I"].length !== 0 || transformResult.InValidProducts[key]["E"].length !== 0 || !!transformResult.DuplicateProducts[key]) {
                            let invalidJSON = {
                                'ProdctTransformResults': transformResult.ProdctTransformResults[key],
                                'InValidProducts': transformResult.InValidProducts[key], 'DuplicateProducts': transformResult.DuplicateProducts[key]
                            }
                            PTE_CellChange_Util.updatePrdColumns(index, 'PTR_SYS_INVLD_PRD', JSON.stringify(invalidJSON));
                        } else {
                            PTE_CellChange_Util.updatePrdColumns(index, 'PTR_SYS_INVLD_PRD', '');
                            allIssuesDone = true;
                        }
                        let prdData = !!transformResult.ValidProducts[key] ? JSON.stringify(transformResult.ValidProducts[key]) : "";
                        PTE_CellChange_Util.updatePrdColumns(index, 'PTR_SYS_PRD', prdData);
                        if (allIssuesDone) {
                            if (transformResult.ProdctTransformResults[key]['I'].length == 0) {
                                this.multiRowDelete.push({ row: index, old: this.hotTable.getDataAtRowProp(index, 'PTR_USER_PRD') });
                                if (r > 0) {
                                    if (!deletedDCID)
                                        deletedDCID = [];
                                    deletedDCID.push(r)
                                }
                            }
                            else {
                                let selProd = savedResult.selectedProducts.filter(x => x.DCID == key)[0];
                                let deletedProds = savedResult.deletedProducts;
                                if (selProd) {
                                    if (this.curRow[0]) {
                                        curRowIndx = selProd.DCID == this.curRow[0]['DC_ID'] ? selProd.indx : null;
                                    }
                                    // sometime not all prod corrector rows are slected and user click save in that case we dont need to do any action
                                    if (selProd.items && selProd.items.length > 0) {
                                        selRow = selProd.indx;
                                        let deletedProd = undefined;
                                        if (deletedProds && deletedProds.length > 0) {
                                            deletedProd = deletedProds.filter(x => x.DC_ID == selProd.DCID);
                                        }

                                        //Until all the invalid products are selected from product corrector , don’t update the handson table
                                        rowProdCorrectordat = PTE_CellChange_Util.getOperationProdCorr(selProd, deletedProd, products);
                                        PTE_CellChange_Util.autoFillCellOnProd(rowProdCorrectordat[0], this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, rowProdCorrectordat[1]);
                                    }
                                    if (this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                                        let operation = rowProdCorrectordat[1];
                                        let response = JSON.parse(operation.PTR_SYS_PRD);
                                        let ValidProducts = PTE_Helper_Util.splitProductForDensity(response);
                                        let finalPTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
                                        each(ValidProducts, (val, DCID) => {
                                            const userInput = PTEUtil.updateUserInput(ValidProducts[DCID]);
                                            const contractProducts = userInput['contractProducts'].toString().replace(/(\r\n|\n|\r)/gm, "");
                                            each(finalPTR, (data, idx) => {
                                                if (selProd.DCID == data.DC_ID) {
                                                    if (data.TIER_NBR == 1) {
                                                        data.PTR_USER_PRD = contractProducts;
                                                        data.PTR_SYS_PRD = JSON.stringify(val)
                                                        this.hotTable.setDataAtRowProp(idx, 'PTR_USER_PRD', data.PTR_USER_PRD, 'no-edit')
                                                    }
                                                }
                                            })
                                        });
                                        let denBandData = PTE_CellChange_Util.validateDensityBand(selRow, this.columns, this.curPricingTable, operation, '', false, this.validMisProd);
                                        this.validMisProd = denBandData.validMisProds;
                                        this.generateHandsonTable(denBandData.finalPTR);
                                    }
                                    //handonsontable takes time to bind the data to the so putting this logic.
                                    // setTimeout(() => {
                                    //     this.isLoading = false;
                                    //     this.setBusy("", "", "", false);
                                    // }, 2000);

                                }
                                else if (deletedProds && deletedProds.length > 0) {
                                    let deletedRowIdList = distinct(deletedProds, 'DC_ID').map(item => item['DC_ID']);
                                    each(deletedRowIdList, (rowId) => {
                                        let deletedProd = deletedProds.filter(x => x.DC_ID == rowId);
                                        rowProdCorrectordat = PTE_CellChange_Util.getOperationProdCorr(undefined, deletedProd, products);
                                        PTE_CellChange_Util.autoFillCellOnProd(rowProdCorrectordat[0], this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, rowProdCorrectordat[1]);
                                    })
                                }
                                if (this.curRow[0]) {
                                    curRowIndx = findWhere(selRows,
                                        {
                                            DC_ID: this.curRow[0]['DC_ID']
                                        }).indx;
                                    let includeIndx = findIndex(this.columns, { data: 'PTR_USER_PRD' });
                                    let excludeIndx = findIndex(this.columns, { data: 'PRD_EXCLDS' });
                                    let includeClass = this.hotTable.getCellMetaAtRow(curRowIndx).filter((col) => {
                                        return (col['col'] == includeIndx)
                                    }).map((obj) => {
                                        return obj['className'];
                                    });

                                    let excludeClass = this.hotTable.getCellMetaAtRow(curRowIndx).filter((col) => {
                                        return (col['col'] == excludeIndx)
                                    }).map((obj) => {
                                        return obj['className'];
                                    });


                                    if (this.curRow[0].delPTR_SYS_PRD &&
                                        (includeClass[0] != 'error-product' && excludeClass[0] != 'error-product')) {
                                        delete this.curRow[0].delPTR_SYS_PRD
                                    }
                                }
                            }
                        }
                        else
                        {
                            let deletedProds = savedResult.deletedProducts;
                            if (deletedProds && deletedProds.length > 0) {
                                let deletedRowIdList = distinct(deletedProds, 'DC_ID').map(item => item['DC_ID']);
                                each(deletedRowIdList, (rowId) => {
                                    let deletedProd = deletedProds.filter(x => x.DC_ID == rowId);
                                    rowProdCorrectordat = PTE_CellChange_Util.getOperationProdCorr(undefined, deletedProd, products);
                                    PTE_CellChange_Util.autoFillCellOnProd(rowProdCorrectordat[0], this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, rowProdCorrectordat[1]);
                                })
                            }
                        }
                    }

                }
                if (this.multiRowDelete.length > 0) {
                    this.deleteRow(this.multiRowDelete, true);
                }
                let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
                if (PTR.length === 0) {
                    this.setBusy("No Products Found", "Please add products.", "Warning", false);
                    setTimeout(() => {
                        this.setBusy("", "", "", false);
                    }, 100);
                }
                else {
                    this.setBusy("Updating Products", "Please wait while processing.", "info", true);
                    setTimeout(async () => {//wait until PTE updation completes
                        await this.productOrdering();
                        if (action == 'onSave')
                            await this.saveAndValidate(true, deletedDCID);
                    }, 100);
                    this.setBusy("", "", "", false);
                }
            }else{
                this.isLoading=false;    
                this.setBusy("", "", "", false);
            }
        });
    }

    openOverlapDealCheck() {
        const DATA = {
            contractData: this.contractData,
            currPt: this.curPricingTable,
        }

        const DIALOG_REF = this.dialog.open(OverlappingCheckComponent, {
            data: DATA,
            panelClass: 'pteDealsOvrLap',
            disableClose: true
        });

        DIALOG_REF.afterClosed().subscribe(result => { 
            //
        });
    }

    flexOverlappingDealCheck() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let data = {
            "pricingTableData": this.curPricingTable,
            "PTR": PTR,
            "overlapFlexResult": this.overlapFlexResult
        }
        const dialogRef = this.dialog.open(FlexOverlappingCheckComponent, {
            data: data
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    createNewPrcObt(pt) { 
        if (pt != null) {
            this.newPricingTable = pt;
            const  ptTemplate  = this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            const customer = this.contractData.Customer;
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            this.newPricingTable["_defaultAtrbs"] = lnavUtil.updateNPTDefaultValues(pt, ptTemplate.defaultAtrbs, customer);
        }
    }
    openAutofill() {
        let custId, isVistex
        let pt = this.curPricingTable;
        this.createNewPrcObt(pt);
        if (this.contractData != null && this.contractData.Customer.VISTEX_CUST_FLAG != null && this.contractData.Customer.VISTEX_CUST_FLAG != undefined
            && this.contractData.Customer.VISTEX_CUST_FLAG != '') { // Moved down due to normal items missing customer level fields in some cases.

            isVistex = this.contractData.Customer.VISTEX_CUST_FLAG
        }
        if (this.contractData != null) {
            custId = this.contractData.CUST_MBR_SID;
        }
        let isVistexHybrid = (this.curPricingStrategy.IS_HYBRID_PRC_STRAT === "1" ? true : false);
        let autofillData = {
            "ISTENDER": this.isTenderContract,
            "isVistexHybrid": isVistexHybrid,
            "DEFAULT": lnavUtil.getTenderBasedDefaults(this.newPricingTable, this.isTenderContract),
            "ISVISTEX": isVistex,
            "contractData": this.contractData,
            "currPt": pt,
            "currPs": this.curPricingStrategy,
            "newPt": this.newPricingTable,
            "ptTemplate": this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD]
        };

        const dialogRef = this.dialog.open(AutoFillComponent, {
            height: 'auto',
            width: '1500px',
            data: autofillData,
            panelClass: ['dialog-side-panel', 'autofiller-pop-ups'],
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //the scuscriber to this in Lnav ngonint code and this fill help autofill setting from lnav screen
                this.autoFillData = result;
                this.curPricingTable["_defaultAtrbs"] = this.autoFillData.newPt["_defaultAtrbs"];
                //PTE_Load_Util.updateResults(this.newPricingTable, pt, this.curPricingTable) //Not Needed for now?
                //Following is for pushing PTE autofillsettings changes  to Lnav pricing table level
                this.lnavService.autoFillData.next(this.autoFillData);
            }
        });
    }
    async refreshContractData(id, ptId) {
        let response: any = await this.contractDetailsService
            .readContract(this.contractData.DC_ID)
            .toPromise().catch((err) => {
                this.loggerService.error('contract data read error.....', err);
                this.isLoading = false;
            });
        this.contractData = PTE_Common_Util.initContract(this.UItemplate, response[0]);
        this.contractData.CUST_ACCNT_DIV_UI = "";
        // if the current strategy was changed, update it
        if (id != undefined && this.in_Ps_Id === id) {
            this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], id);
            if (id != undefined && this.in_Pt_Id === ptId && this.curPricingStrategy != undefined) {
                this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], ptId);
            }
        }
        this.refreshedContractData.emit({ contractData: this.contractData, PS_Passed_validation: this.curPricingStrategy.PASSED_VALIDATION, PT_Passed_validation: this.curPricingTable.PASSED_VALIDATION });
    }
    async productOrdering() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let isProductOrderChanged = PTEUtil.updateProductOrdering(PTR, this.transformResults, this.curPricingTable);
        //To wait until hot table data rendered properly, since product order got changed
        if (isProductOrderChanged) {
            await new Promise(resolve => {
                setTimeout(resolve, 100);
            });
        }
    }

    // TWC3119-682 - Currency cells have a max numeric value
    private currencyValidatorMessageHandler(isValid: boolean, rowNumber: number, field: string | number) {
        const COLUMN_DEFINITION: PRC_TBL_Model_Field = this.pricingTableTemplates.model.fields[field];
        if (COLUMN_DEFINITION.type != undefined && COLUMN_DEFINITION.format != undefined) {
            const CELL_TYPE: string = COLUMN_DEFINITION.type;
            const CELL_FORMAT: string = COLUMN_DEFINITION.format;

            if (CELL_TYPE === 'number' && CELL_FORMAT.toLowerCase().includes('0:c')) {
                const COLUMN_NUMBER = this.hotTable.propToCol(field);

                const COMMENT_PLUGIN = this.hotTable.getPlugin('comments'); // WIP: Can probably call this outside to make more efficient

                if (!isValid) {
                    COMMENT_PLUGIN.updateCommentMeta(rowNumber, COLUMN_NUMBER, {
                        value: 'Not a valid number (too large).',
                        readOnly: true
                    });
                    COMMENT_PLUGIN.showAtCell(rowNumber, COLUMN_NUMBER);
                } else {
                    COMMENT_PLUGIN.removeCommentAtCell(rowNumber, COLUMN_NUMBER, true);
                }
            }
        }
    }

    hoverPTE() {
        $(".pricing_table_celltext .handsontable .ht_clone_inline_start .wtHolder table.htCore tr td.error-cell").hover(function () {
            $(".htCommentsContainer .htComments").toggleClass("commentHover");
        });
    }

    ngOnInit() {
        this.isTenderContract = Tender_Util.tenderTableLoad(this.contractData);
        //code for autofill change to accordingly change values
        let res: any = this.pteService.autoFillData.toPromise().catch((err) => {
            this.loggerService.error('pteService::isAutoFillChange**********', err);
        });
        this.autoFillData = res;
        this.loadPTE();
        if (this.contractData) {
            if (this.contractData["CUST_ACCNT_DIV"] != undefined && this.contractData["CUST_ACCNT_DIV"] != null) {
                let divisonArray = [];
                divisonArray = this.contractData["CUST_ACCNT_DIV"].split("/");
                divisonArray = divisonArray.sort();
                this.contractData["CUST_ACCNT_DIV"] = divisonArray.join("/");
            }
        }
    }

    ngAfterViewInit() {
        //loading after the View init from there onwards we can reuse the hotTable instance
        this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        // loading PTE cell util  with hotTable instance for direct use of hotTable within the class
        new PTE_CellChange_Util(this.hotTable);
        new PTE_Common_Util(this.hotTable);
        new PTE_Load_Util(this.hotTable);
    }

}
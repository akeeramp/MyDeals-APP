/* eslint-disable prefer-const */
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { pricingTableEditorService } from './pricingTableEditor.service'
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import * as _ from 'underscore';
import { templatesService } from '../../shared/services/templates.service';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field, sheetObj, ProdCorrectObj } from './handsontable.interface';
import { PTEUtil } from '../PTEUtils/PTE.util';
import { MatDialog } from '@angular/material/dialog';
import { ProductSelectorComponent } from '../ptModals/productSelector/productselector.component';
import { ProductCorrectorComponent } from '../ptModals/productCorrector/productcorrector.component';
import { GeoSelectorComponent } from '../ptModals/geo/geo.component';
import { multiSelectModalComponent } from '../ptModals/multiSelectModal/multiSelectModal.component';
import { SelectEditor } from './custSelectEditor.class';
import { forkJoin } from 'rxjs';
import { CellMeta, CellSettings, GridSettings } from 'handsontable/settings';
import { PTE_CellChange_Util } from '../PTEUtils/PTE_CellChange_util';
import { AutoFillComponent } from '../ptModals/autofillsettings/autofillsettings.component';
import { lnavService } from '../lnav/lnav.service';
import * as moment from 'moment';
import { productSelectorService } from '../../shared/services/productSelector.service';
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
import { flexoverLappingcheckDealService } from '../ptModals/flexOverlappingDealsCheck/flexOverlappingDealsCheck.service'

@Component({
    selector: 'pricing-table-editor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html'
})
export class pricingTableEditorComponent implements OnChanges {

    constructor(private pteService: pricingTableEditorService,
        private templateService: templatesService,
        private pricingTableSvc: pricingTableEditorService,
        private productSelectorSvc: productSelectorService,
        private loggerService: logger,
        private lnavSVC: lnavService,
        private flexoverLappingCheckDealsSvc: flexoverLappingcheckDealService,
        protected dialog: MatDialog) {
        /*  custom cell editot logic starts here*/
        let VM = this;
        this.custCellEditor = class custSelectEditor extends Handsontable.editors.TextEditor {
            public TEXTAREA: any;
            public BUTTON: any;
            public buttonStyle: any;
            public TEXTAREA_PARENT: any;
            public textareaStyle: any
            public textareaParentStyle: any
            public hot: Handsontable.Core;    
            public instance: any;
            public selectOptions: any;
            private selRow = 0;
            private selCol = 0;
            private field: any = '';
            private source: any = '';
            constructor(hotInstance: any) {
                super(hotInstance);
            }
            prepare(row: number, col: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties): void {
                super.prepare(row, col, prop, TD, originalValue, cellProperties);
                this.selCol = col;
                this.selRow = row;
                this.field = prop;
                this.source = cellProperties.source ? cellProperties.source : '';
            }
            createElements() {
                super.createElements();
                this.createCellButton();
                this.TEXTAREA.className = 'htCustTxt';
                this.TEXTAREA_PARENT.appendChild(this.BUTTON);
            }
            createCellButton() {
                this.BUTTON = document.createElement('button');
                this.BUTTON.id = "btnCustSelctor";
                this.buttonStyle = this.BUTTON.style;
                this.BUTTON.className = 'btn btn-sm btn-primary py-0 htCustCellEditor';
                this.BUTTON.innerHTML = '🔍';
                this.BUTTON.addEventListener('mousedown', (event: any) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.openPopUp();
                });
            }
            async openPopUp() {
                const selVal = this.hot.getDataAtCell(this.selRow, this.selCol);
                // let modalComponent: any = null, name: string = '', height: string = "250px", width: string = '650px', data = {}, panelClass: string = "";
                let modalComponent: any = null,
                    name: string = '',
                    height: string = '',
                    width: string = '650px',
                    data = {},
                    panelClass: string = "";
                if (this.field && this.field == 'PTR_USER_PRD') {
                    modalComponent = ProductSelectorComponent;
                    name = "Product Selector";
                    // height = "80vh"; // ISSUE: Adds a blank block at the bottom of the grid taking 20% of the view
                    width = "5500px";
                    panelClass = "product-selector-dialog";
                    let obj = {}, curRow = [];
                    _.each(this.hot.getCellMetaAtRow(this.selRow), (val) => {
                        if (val.prop) {
                            obj[val.prop] = this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) != null ? this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) : null;
                        }
                    });
                    curRow.push(obj);
                    if (curRow[0]['PTR_SYS_PRD'] == "") {
                        await VM.validateOnlyProducts('onLoad');
                        return;
                    }
                    data = { name: name, source: this.source, selVal: selVal, contractData: VM.contractData, curPricingTable: VM.curPricingTable, curRow: curRow };
                }
                else if (this.field && this.field == 'GEO_COMBINED') {
                    modalComponent = GeoSelectorComponent
                    name = "Geo Selector";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'CUST_ACCNT_DIV') {
                    modalComponent = GeoSelectorComponent
                    name = "Customer Account Divisions";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'QLTR_BID_GEO') {
                    modalComponent = GeoSelectorComponent
                    name = "Select Bid Geo";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else {
                    modalComponent = multiSelectModalComponent;
                    height = "500px"
                    width = "700px";
                    name = this.field;
                    data = { colName: name, items: { 'data': this.source }, cellCurrValues: selVal };
                }
                const dialogRef = dialog.open(modalComponent, {
                    height: height,
                    width: width,
                    data: data,
                    panelClass: panelClass
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        if (this.field && this.field == 'PTR_USER_PRD') {//here there is no handonstable source specify bcz we need to do autofill
                            VM.isLoading = true;
                            let cntrctPrdct = [];
                            let excludedPrdct = [];
                            let sysPrd = {};
                            if (result.splitProducts) {
                                _.each(result.validateSelectedProducts, (item, idx) => {
                                    if (!item[0].EXCLUDE) {
                                        cntrctPrdct = [];
                                        sysPrd = {};
                                        cntrctPrdct.push(item[0].HIER_VAL_NM);
                                        sysPrd[item[0].DERIVED_USR_INPUT] = item;
                                        if (VM.curPricingTable.OBJ_SET_TYPE_CD && VM.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                                            if (idx != 0) {
                                                result.validateSelectedProducts[idx].indx = result.validateSelectedProducts[idx - 1].indx
                                                    + result.validateSelectedProducts[idx - 1].items.length;
                                            }
                                        }
                                        let PTR = [];
                                        PTR.push({ row: result.validateSelectedProducts[idx].indx, prop: 'PTR_USER_PRD', old: this.hot.getDataAtRowProp(result.validateSelectedProducts[idx].indx, 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                                        let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct };
                                        PTE_CellChange_Util.autoFillCellOnProd(PTR, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns, operation);
                                    }
                                });
                            }
                            else {
                                _.each(result.validateSelectedProducts, function (item) {
                                    if (!item[0].EXCLUDE) {
                                        cntrctPrdct.push(item[0].HIER_VAL_NM)
                                    }
                                    else if (item[0].EXCLUDE && !result.splitProducts) {
                                        excludedPrdct.push(item[0].HIER_VAL_NM);
                                    }
                                    sysPrd[item[0].DERIVED_USR_INPUT] = item;
                                });
                                let PTR = [];
                                PTR.push({ row: this.selRow, prop: 'PTR_USER_PRD', old: this.hot.getDataAtRowProp(this.selRow, 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                                let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct };
                                PTE_CellChange_Util.autoFillCellOnProd(PTR, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns, operation);
                            }
                        }
                        else {
                            this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString(), 'no-edit');
                        }
                        setTimeout(() => {
                            VM.isLoading = false;
                        }, 2000);
                    }
                });
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
    private isDialogOpen: boolean = false;
    private isCustDivNull: boolean = false;
    /*For loading variable */
    private isLoading: boolean = false;
    private msgType: string = "";
    private spinnerMessageHeader: string = "";
    private spinnerMessageDescription: string = "";
    private isBusyShowFunFact: boolean = true;
    private timeout:any = null;
    /*For loading variable */
    public showDiscount:string = "0%";
    public dirty = false;
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private pricingTableDet: Array<any> = [];
    private pricingTableTemplates: any = {}; // Contains templates for All Deal Types
    private autoFillData: any = null;
    private ColumnConfig: Array<Handsontable.ColumnSettings> = [];
    private overlapFlexResult: any;
    // To get the selected row and col for product selector
    private multiRowDelete: Array<any> = [];
    // Handsontable Variables basic hottable structure
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: false,
        minRows: 100,
        maxRows: 150,
        colHeaders: false,
        rowHeaders: true,
        rowHeaderWidth: 0,
        fixedColumnsLeft: 1,
        fixedRowsTop: 0,
        copyPaste: true,
        comments: true,
        height: 540,
        width: 1402,
        afterChange: (changes, source) => {
            //using => operator to-call-parent-function-from-callback-function
            this.afterCellChange(changes, source);
        },
        afterDocumentKeyDown: (event) => {
            this.afterDocumentKeyDown(event);
        },
        licenseKey: "8cab5-12f1d-9a900-04238-a4819",
    };
    private columns: Array<Handsontable.ColumnSettings> = [];
    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;
    private dataset: Array<any> = [];
    private custCellEditor: any;
    private hotId = "spreadsheet";
    // Cached Dropdown API Responses (that do not usually change)
    private dropdownResponseLocalStorageKey = 'pricingTableEditor_DropdownApiResponses';
    private dropdownResponses: any = null;
    private psTitle = "Pricing Strategy";
    private ptTitle = "Pricing Table";
    private ptTitleLbl = "Enter " + this.ptTitle + " Name";
    private pageTitle = this.ptTitle + " Editor";
    private saveDesc = "Save your " + this.ptTitle + ", validate the products, and stay in your " + this.ptTitle + " Editor";
    public C_EDIT_PRODUCT: boolean = false;
    public C_ADD_PRICING_TABLE: boolean = false;
    private productValidationDependencies = PTE_Config_Util.productValidationDependencies;
    private kitDimAtrbs: Array<string> = PTE_Config_Util.kitDimAtrbs;
    private isTenderContract = false;
    private maxKITproducts: number = PTE_Config_Util.maxKITproducts;

    //this will help to have a custom cell validation which allow only alphabets
    private newPricingTable: any = {};
    private VendorDropDownResult: any = {};
    private isDeletePTR: boolean = false;
    private newPTR: any;
    public warnings: boolean = false;


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
            _.each(this.multiRowDelete, item => {
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
        this.showDiscount = this.showDiscount=='0%'?'30%':'0%';
    }
    chgTerms() {
        //function must trigger only after stop typing
        let vm=this;
        clearTimeout(vm.timeout);
        vm.timeout = setTimeout(function () {
            vm.isLoading = true;
            vm.setBusy("Saving...", "Saving your data", "Info", true);
            var dataItem = vm.curPricingStrategy;
            var data = {
                objSetType: "PRC_ST",
                ids: [dataItem["DC_ID"]],
                attribute: "TERMS",
                value: dataItem["TERMS"]
            };
    
            vm.pteService.updateAtrbValue(vm.contractData.CUST_MBR_SID, vm.contractData.DC_ID, data).toPromise().catch((err) => {
                vm.loggerService.error("Error", "Could not save the value.", err);
                vm.isLoading = false;
                vm.setBusy("", "", "", false);
            });
            vm.loggerService.success("Done", "Save Complete.");
            vm.isLoading = false;
            vm.setBusy("", "", "", false);

        }, 700);
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
        let vm = this;
        let response = await vm.pteService.readPricingTable(vm.in_Pt_Id).toPromise().catch((err) => {
            this.loggerService.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
        });

        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0) {
            // The thing about Tender contract, they can be created from a copy which will NOT create WIP deals and
            // Cleans out the PTR_SYS_PRD value forcing a product reconciliation because the customer might have changed.
            //  So... we need a check to see if the value on load is blank and if so... set the dirty flag
            Tender_Util.getTenderDetails(response.PRC_TBL_ROW, this.isTenderContract);
            vm.pricingTableDet = response;
            return response.PRC_TBL_ROW;
        } else {
            return [];
        }
    }
    getMergeCellsOnDelete() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, this.curPricingTable);
        this.hotTable.updateSettings({ mergeCells: mergCells });
    }
    generateHandsonTable(PTR: any) {
        let vm = this;
        //this is the code which is create columns according to Handson from API
        let nestedHeaders: [string[], string[]] = [[], []];
        let hiddenColumns: number[] = [];
        this.columns = [];
        /* From the Pricing Table Template */
        const columnTemplates: PRC_TBL_Model_Column[] = this.pricingTableTemplates.columns;
        const columnFields: PRC_TBL_Model_Field[] = this.pricingTableTemplates.model.fields;
        const columnAttributes: PRC_TBL_Model_Attributes[] = this.pricingTableTemplates.defaultAtrbs;
        // Iterate through each column from the Pricing Table Template
        _.each(columnTemplates, (item: PRC_TBL_Model_Column, index) => {
            let currentColumnConfig = PTEUtil.generateHandsontableColumn(this.isTenderContract,this.pteService, this.loggerService, this.dropdownResponses, columnFields, columnAttributes, item, index);
            //adding for cell management in cell this can move to seperate function later
            this.ColumnConfig.push(currentColumnConfig);
            if (item.field == 'PTR_USER_PRD' || item.field == 'GEO_COMBINED' || item.field == 'MRKT_SEG' || item.field == 'QLTR_BID_GEO' || item.field == 'CUST_ACCNT_DIV') {
                currentColumnConfig.editor = this.custCellEditor;
            }
            this.columns.push(currentColumnConfig);
            nestedHeaders[0].push(sheetObj[index]);
            nestedHeaders[1].push(`<span style="color:blue;font-style: italic;">${item.title}</span>`);
        });
        /* Hidden Columns */
        hiddenColumns = PTE_Load_Util.getHiddenColumns(columnTemplates, this.contractData.CustomerDivisions);
        let mergCells = [];
        let cellComments = PTE_Load_Util.getCellComments(PTR, this.pricingTableTemplates.columns);
        // This logic will add for all tier deals. 
        mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, this.curPricingTable);
        // Set the values for hotTable
        PTR = PTR.length > 0 ? PTR : Handsontable.helper.createEmptySpreadsheetData(5, this.columns.length);
        // Loading new data
        this.newPTR = PTR;
        this.hotTable.loadData(PTR);
        // Update settings  with new commented cells and erge cells
        this.hotTable.updateSettings({
            columns: this.columns,
            hiddenColumns: {
                columns: hiddenColumns,
                indicators: true
            },
            mergeCells: mergCells,
            cells: (row: number, col: number, prop: string) => {
                return PTE_Load_Util.disableCells(this.hotTable, row, col, prop, this.ColumnConfig, this.curPricingTable,this.isTenderContract)
            },
            cell: cellComments,
            readOnlyCellClassName: 'readonly-cell',
            nestedHeaders: nestedHeaders
        });
    }

    //functions to identify cell change
    identfyUniqChanges(changes: Array<any>, source: any): Array<any> {
        //for tier when drag/paste PTR_USER_PRD changes are based on num of tier and those many rows will come as changes but we need that as uniq change
        if (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            let uniqchanges = [];
            _.each(changes, (item) => {
                if (item[2] != undefined && item[3] != undefined) {
                    if (item[1] == 'PTR_USER_PRD') {
                        if (item[3] != null && item[3] != '') {
                            let obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
                            uniqchanges.push(obj);
                        }
                        else {
                            // in case of copy paste and Autofill the empty rows based on tier will come but that doesnt mean they are to delete
                            if (source == 'edit') {
                                //if no value in PTR_USER_PRD its to delete since its looping for tier logic adding in to an array and finally deleting
                                this.isDeletePTR = true;
                                this.multiRowDelete.push({ row: item[0], old: item[2] })
                            }
                        }
                    }
                    else {
                        let obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
                        uniqchanges.push(obj);
                    }
                }
            });
            return uniqchanges;
        }
        else {
            return [];
        }

    }
    afterCellChange(changes: Array<any>, source: any) { // Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
        if (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            // Changes will track all the cells changing if we are doing copy paste of multiple cells
            this.dirty = true;
            this.isLoading = true;
            
            this.setBusy("PTE Reloading...", "PTE Reloading please wait", "Info", true);
            // PTE loading in handsone takes more loading time than Kendo so putting a loader
            setTimeout(() => {
                changes = this.identfyUniqChanges(changes, source);
                let PTR = _.where(changes, { prop: 'PTR_USER_PRD' });
                let AR = _.where(changes, { prop: 'AR_SETTLEMENT_LVL' });
                //KIT On change events
                let KIT_ECAP = _.filter(changes, item => { return item.prop == 'ECAP_PRICE_____20_____1' || item.prop == 'ECAP_PRICE' });
                let KIT_DSCNT = _.filter(changes, item => { return item.prop == 'DSCNT_PER_LN' || item.prop == 'QTY' });
                //Voltier Changes
                let tierChg = _.filter(changes, item => { return item.prop == 'END_PB' || item.prop == 'STRT_PB' || item.prop == 'END_REV' || item.prop == 'STRT_REV' || item.prop == 'END_VOL' || item.prop == 'STRT_VOL' });
                let rateChg = _.filter(changes, item => { return item.prop == 'DENSITY_RATE' || item.prop == 'ECAP_PRICE' || item.prop == 'TOTAL_DOLLAR_AMOUNT' || item.prop == 'RATE' || item.prop == 'VOLUME' || item.prop == 'FRCST_VOL' || item.prop == 'ADJ_ECAP_UNIT' || item.prop == 'MAX_PAYOUT' || item.prop == 'INCENTIVE_RATE' });
                let pgChg = _.filter(changes, item => { return item.prop == 'PROGRAM_PAYMENT' });
                //here we are using if conditions because at a time multiple changes can happen
                if (PTR && PTR.length > 0) {
                    PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns);
                }
                if (AR && AR.length > 0) {
                    PTE_CellChange_Util.autoFillARSet(AR, this.contractData);
                }
                if (KIT_ECAP && KIT_ECAP.length > 0) {
                    PTE_CellChange_Util.kitEcapPriceChange(KIT_ECAP, this.columns, this.curPricingTable);
                }
                if (KIT_DSCNT && KIT_DSCNT.length > 0) {
                    PTE_CellChange_Util.kitDSCNTChange(KIT_DSCNT, this.columns, this.curPricingTable);
                }
                if (tierChg && tierChg.length > 0) {
                    PTE_CellChange_Util.tierChange(tierChg, this.columns, this.curPricingTable);
                }
                if (rateChg && rateChg.length > 0) {
                    PTE_CellChange_Util.RateChgfn(rateChg, this.columns, this.curPricingTable);
                }
                if (pgChg && pgChg.length > 0) {
                    PTE_CellChange_Util.pgChgfn(pgChg, this.columns, this.curPricingTable);
                }
                //for multi tier there can be more tiers to delete so moving the logic after all change 
                if (this.multiRowDelete && this.multiRowDelete.length > 0 && this.isDeletePTR) {
                    this.deleteRow(this.multiRowDelete);
                }
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, 0);
        }
    }
    async deletePTR() {
        this.isLoading = true;
        this.setBusy("Deleting...", "Deleting the Pricing table row", "Info", true);

        let delDCIDs = [];
        _.each(this.multiRowDelete, item => {
            delDCIDs.push(this.hotTable.getDataAtRowProp(item.row, 'DC_ID'));
        });
        let data = {
            "Contract": [],
            "PricingStrategy": [],
            "PricingTable": [this.curPricingTable],
            "PricingTableRow": [],
            "WipDeals": [],
            "EventSource": 'PRC_TBL',
            "Errors": {},
            "PtrDelIds": delDCIDs
        }
        let result = await this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, true).toPromise().catch((error) => {
            this.loggerService.error("pricingTableEditorComponent::saveUpdatePTEAPI::deletePTR", error);
        });
        if (result) {
            this.isLoading = false;
            this.loadPTE();
        }
        else {
            this.loggerService.error("pricingTableEditorComponent::deletePTR::", 'error');
        }
    }
    deleteRow(rows: Array<any>): void {
        try {
            let delRows = [];
            //delete can be either simple row delete for PTR not saved or can be PTR which are saved
            _.each(rows, row => {
                let DCID = this.hotTable.getDataAtRowProp(row.row, 'DC_ID');
                if (DCID) {
                    delRows.push({ row: row.row, DC_ID: this.hotTable.getDataAtRowProp(row.row, 'DC_ID') });
                }
            })
            let savedRows = _.filter(delRows, row => { return row.DC_ID > 0 });
            let nonSavedRows = _.filter(delRows, row => { return row.DC_ID < 0 });
            //this condition means all rows are non DC_ID rows so that no need to hit API
            if (nonSavedRows.length > 0 && nonSavedRows.length == delRows.length) {
                //multiple delete at the sametime this will avoid issues of deleting one by one
                this.hotTable.alter('remove_row', delRows[0].row, delRows.length, 'no-edit');
                this.getMergeCellsOnDelete();
                this.multiRowDelete = [];
                this.isDeletePTR = false;
                //setting the value to empty to avoid extra delete
            }
            //this condition for all rows are saved DC_ID rows so hit API
            if (savedRows.length > 0 && delRows.length == savedRows.length) {
                //this will openup dialog box and call closeDialog function
                this.isDialogOpen = true;
            }
            //this condition for both case
            if (nonSavedRows.length > 0 && savedRows.length > 0) {
                this.hotTable.alter('remove_row', nonSavedRows[0].row, nonSavedRows.length, 'no-edit');
                this.getMergeCellsOnDelete();
                //this step will move all the deleted records which matched nonSavedRows records
                this.multiRowDelete = _.reject(this.multiRowDelete, itm => { return _.contains(_.pluck(nonSavedRows, 'row'), itm.row) });
                this.isDialogOpen = true;
            }
        }
        catch (ex) {
            this.loggerService.error('deleteRow::', ex);
        }
    }
    async getAllDrowdownValues() {
        let dropObjs = {};
        _.each(this.pricingTableTemplates.defaultAtrbs, (val, key) => {
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
        _.each(this.pricingTableTemplates.model.fields, (item, key) => {
            if (item && item.uiType && (item.uiType == 'DROPDOWN' || item.uiType == 'MULTISELECT') && item.opLookupUrl && item.opLookupUrl != '' && (dropObjs[`${key}`] == null || dropObjs[`${key}`] == undefined)) {
                if (key == 'SETTLEMENT_PARTNER') {
                    //calling  settlement partner seperatly
                    dropObjs['SETTLEMENT_PARTNER'] = this.pteService.getDropDownResult(item.opLookupUrl + '/' + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'PERIOD_PROFILE') {
                    //calling  PERIOD_PROFILE 
                    dropObjs['PERIOD_PROFILE'] = this.pteService.getDropDownResult(item.opLookupUrl + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'CUST_ACCNT_DIV') {
                    //calling  Customer Divisions
                    dropObjs['CUST_ACCNT_DIV'] = this.pteService.getDropDownResult(item.opLookupUrl + '/' + this.contractData.Customer.CUST_SID);
                }
                else if (key == 'ORIG_ECAP_TRKR_NBR') {
                    console.log('no valid URL Need to check');
                }
                else {
                    dropObjs[`${key}`] = this.pteService.getDropDownResult(item.opLookupUrl);
                }
            }
        })

        let result = await forkJoin(dropObjs).toPromise().catch((err) => {
            this.loggerService.error('pricingTableEditorComponent::getAllDrowdownValues::service', err);
        });
        return result;
    }
    async loadPTE() {
        this.isLoading = true;
        this.overlapFlexResult = [];
        this.setBusy("Loading ...", "Loading the Pricing Table Editor", "Info", true);
        let PTR = await this.getPTRDetails();
        //this is to make sure the saved record prod color are success by default
        PTR=PTE_Load_Util.setPrdColor(PTR);
        this.getTemplateDetails();
        this.dropdownResponses = await this.getAllDrowdownValues();
        if (this.dropdownResponses["SETTLEMENT_PARTNER"] != undefined) {
            this.VendorDropDownResult = this.dropdownResponses["SETTLEMENT_PARTNER"];
        }
        //this is only while loading we need , need to modify as progress
        PTR = PTE_Load_Util.pivotData(PTR, false, this.curPricingTable, this.kitDimAtrbs);
        this.generateHandsonTable(PTR);
        this.isLoading = false;
    }
    custdivnull(act: boolean) {
        if (act == true) {
            this.isCustDivNull = false;
            this.ValidateAndSavePTE(true);
        }
        else {
            this.isCustDivNull = false;
        }
    }
    undoPTE() {
        this.hotTable.undo();
    }
    redoPTE() {
        this.hotTable.redo();
    }
    async ValidateAndSavePTE(isValidProd) {
        if (isValidProd) {            
            //Handsonetable loading taking some time so putting this logic for loader
            let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
            let flexReqData = PTE_Common_Util.getOverlapFLexProducts(this.curPricingTable, PTR);
            if (flexReqData != undefined) {
                this.overlapFlexResult = await this.flexoverLappingCheckDealsSvc.GetProductOVLPValidation(flexReqData).toPromise();
            }
            //Checking for UI errors
            let finalPTR = PTE_Save_Util.validatePTE(PTR, this.curPricingStrategy, this.curPricingTable, this.contractData, this.VendorDropDownResult, this.overlapFlexResult);
            //if there is any error bind the result to handsone table
            let error = PTE_Save_Util.isPTEError(finalPTR, this.curPricingTable);
            if (error) {
                this.generateHandsonTable(finalPTR);
                this.loggerService.error('Mandatory validations failure.', 'error');
            }
            else {
                //this.generateHandsonTable(finalPTR);
                this.dirty = false;
                await this.saveEntireContractRoot(finalPTR);
            }
        }
        else {
            this.loggerService.error('All products are not valid', 'Products are not valid');
        }
    }
    async saveEntireContractRoot(finalPTR: Array<any>) {
        //this logic is mainly for tier dealtypes to convert the PTR to savbale JSON
        finalPTR = PTE_Helper_Util.deNormalizeData(finalPTR, this.curPricingTable);
        //This method will remove all the unwanted property since there are keys with undefined values
        finalPTR = PTE_Common_Util.deepClone(finalPTR);        
        //settment partner change for taking only the ID the API will send back us the both
        finalPTR = PTE_Save_Util.settlementPartnerValUpdate(finalPTR);
        //sanitize Data before save this will make sure all neccessary attributes are avaialbel
        finalPTR = PTE_Save_Util.sanitizePTR(finalPTR, this.contractData);
        let data = {
            "Contract": [],
            "PricingStrategy": [],
            "PricingTable": [this.curPricingTable],
            "PricingTableRow": finalPTR,
            "WipDeals": [],
            "EventSource": 'PRC_TBL',
            "Errors": {}
        }
        this.isLoading = true;
        this.setBusy("Saving your Data...", "Please wait as we save your information", "Info", true);
        let result = await this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, false).toPromise().catch((error) => {
            this.loggerService.error("pricingTableEditorComponent::saveUpdatePTEAPI::", error);
        });
        if (result) {
            //this logic is mainly for add
            let genPTR = PTE_Save_Util.generatePTRAfterSave(result);
            if (genPTR && genPTR.length > 0) {
                genPTR = PTE_Load_Util.pivotData(genPTR, false, this.curPricingTable, this.kitDimAtrbs);
                //setting the color of product to success after API
                genPTR=PTE_Load_Util.setPrdColor(genPTR);
                this.generateHandsonTable(genPTR);
            }
            else {
                //this will help to reload the page with errors when we update
                await this.loadPTE();
            }
            _.each(this.newPTR, (item) => {
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
        else {
            this.loggerService.error("pricingTableEditorComponent::saveUpdatePTEAPI::", 'error');
        }
        this.isLoading = false;

    }
    async validatePricingTableProducts() {
        let isValidProd = await this.validateOnlyProducts('onSave');
        //Handsonetable loading taking some time so putting this logic for loader
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        var multiGeoWithoutBlend = PTE_Validation_Util.validateMultiGeoForHybrid(PTR);
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
            this.isCustDivNull = PTE_Helper_Util.isCustDivisonNull(PTR, this.contractData.CUST_ACCNT_DIV);
            if (!this.isCustDivNull) {
                await this.ValidateAndSavePTE(isValidProd);
            }
        }

    }
    async validateOnlyProducts(action: string) {
        //loader
        let isPrdValid: any = null;
        //generate PTE
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let translateResult = await this.ValidateProducts(PTR, false, true, null);
        let updatedPTRObj: any = null;
        if (translateResult) {
            updatedPTRObj = PTEUtil.cookProducts(translateResult['Data'], PTR);          
            //code to bind the cook result of success or failure
            let PTR_col_ind=_.findIndex(this.columns,{data:'PTR_USER_PRD'});
            _.each(updatedPTRObj.rowData, (data, idx) => {
                this.hotTable.setDataAtRowProp(idx, 'PTR_SYS_PRD', data.PTR_SYS_PRD, 'no-edit')
                if(data && data._behaviors && data._behaviors.isError){
                   if(data._behaviors.isError['PTR_USER_PRD']==false){
                    this.hotTable.setCellMeta(idx,PTR_col_ind,'className','success-product');
                   }
                    else{
                        this.hotTable.setCellMeta(idx,PTR_col_ind,'className','error-product');
                    }
                    //setcellmeta will not render the color by default either you should make some proprty change of render
                    this.hotTable.render();
                }
            })
            let prdValResult=PTEUtil.isValidForProdCorrector(translateResult['Data']);
            if (_.contains(prdValResult,'1')) {
                // Product corrector if invalid products
                this.isLoading = false;
                this.openProductCorrector(translateResult['Data'])
            }
            else if(_.contains(prdValResult,'2')){
                this.loggerService.warn('Please use product selector to choose a valid product',"Use Product Selector");
            }
            else {
                if (action == 'onSave') {
                    //since the errors are binding from cook products check for any error
                    isPrdValid = _.find(updatedPTRObj.rowData, (x) => {
                        if (x._behaviors && x._behaviors.isError) {
                            return _.contains(_.values(x._behaviors.isError), true)
                        }
                    });
                    this.isLoading = false;
                    //the result can have both valid and invalid so any failure it should fail to save
                    return isPrdValid != null ? false : true;
                }
                else {
                    this.isLoading = false;
                }
            }
        }
        else {

            //this.loggerService.error("validateOnlyProducts:failed","Translate API failure");
            //this.isLoading = false;
            this.isLoading = false;
            return true;
        }
    }
    async ValidateProducts(currentPricingTableRowData, publishWipDeals, saveOnContinue, currentRowNumber) {
        let hasProductDependencyErr = false;
        hasProductDependencyErr = PTEUtil.hasProductDependency(currentPricingTableRowData, this.productValidationDependencies, hasProductDependencyErr);
        if (hasProductDependencyErr) {
            // Sync to show errors
            //root.syncCellValidationsOnAllRows(currentPricingTableRowData);
            // Tell user to fix errors
            this.isLoading = true;
            this.setBusy("Not saved. Please fix errors.", "Please fix the errors so we can properly validate your products", "Error", true);
            setTimeout(() => {
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, 1300);
            return;
        }


        let translationInputToSend = PTEUtil.translationToSendObj(this.curPricingTable, currentPricingTableRowData, this.contractData);
        let transformResults: any = null;
        // Products that needs server side attention
        if (translationInputToSend.length > 0) {
            // Validate products
            // Note: When changing the message here, also change the condition in $scope.saveEntireContractBase method in contract.controller.js
            // root.setBusy("Validating your data...", "Please wait as we find your products!", "Info", true);
            // var pcMt = new perfCacheBlock("Translate Products (DB not logged)", "MT");
            this.isLoading = true;
            this.setBusy("Validating your data...", "Please wait while we validate your information!", "Info", true);
            transformResults = await this.productSelectorSvc.TranslateProducts(translationInputToSend, this.contractData.CUST_MBR_SID, this.curPricingTable.OBJ_SET_TYPE_CD, this.contractData.DC_ID, this.contractData.IS_TENDER) //Once the database is fixed remove the hard coded geo_mbr_sid
                .toPromise()
                .catch(error => {
                    this.loggerService.error("Product Translator failure::", error);
                })
        }
        this.isLoading = false;
        return transformResults;
    }
    openProductCorrector(products: any) {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let selRows = []
        _.each(products.DuplicateProducts, (val, key) => {
            let res = _.findWhere(PTR, { DC_ID: parseInt(key) });
            let idx = _.findIndex(PTR, { DC_ID: parseInt(key) });
            selRows.push({DC_ID:res.DC_ID,name: _.keys(val).toString(), row: res, indx: idx });
        });
        let data = { ProductCorrectorData: products, contractData: this.contractData, curPricingTable: this.curPricingTable, selRows: selRows };
        const dialogRef = this.dialog.open(ProductCorrectorComponent, {
            height: '550px',
            width: '1650px',
            data: data,
        });
        dialogRef.afterClosed().subscribe((selProds: Array<ProdCorrectObj>) => {
            if (selProds) {
                this.isLoading = true;
                this.setBusy("PTE Reloading", "PTE Reloading please wait", "Info", true);
                //logic to bind the selected product and PTR_SYS_PRD to PTR
                //For some reason when KIT is binding for more than 2 records its breaking so for now calling the function directly. 
                _.each(selProds, (selProd, idx) => {
                    // sometime not all prod corrector rows are slected and user click save in that case we dont need to do any action
                    if(selProd.items &&selProd.items.length>0 ){
                        //logic to bind the selected product and PTR_SYS_PRD to PTR
                        if (this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                            if (idx != 0) {
                                //this is to map the current index of prod from last selected prod length
                                selProds[idx].indx = selProds[idx - 1].indx + this.hotTable.getDataAtRowProp(selProds[idx - 1].indx,'PTR_USER_PRD').split(',').length;
                            }
                        }
                        //there can be valid invalid prod so we need to bind prod corrector result to the success
                        let Curr_PTR=PTE_CellChange_Util.getPTRObjOnProdCorr(selProd,selProds,idx);
                        let operation =PTE_CellChange_Util.getOperationProdCorr(selProd);
                        PTE_CellChange_Util.autoFillCellOnProd(Curr_PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, operation);
                    }
                    if (idx == selProds.length - 1) {
                        //handonsontable takes time to bind the data to the so putting this logic.
                        setTimeout(() => {
                            this.isLoading = false;
                            this.setBusy("", "", "", false);
                        }, 2000);
                    }
                });
            }
        });
    }
    openOverLappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.curPricingTable,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            height: '530px',
            width: '800px',
            data: data,
        });
        dialogRef.afterClosed().subscribe(result => {});
    }
    

    flexOverlappingDealCheck() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let data = {
            "pricingTableData": this.curPricingTable,
            "PTR": PTR,
            "overlapFlexResult": this.overlapFlexResult
        }
         const dialogRef = this.dialog.open(FlexOverlappingCheckComponent, {
             height: '300px',
             width: '800px',
             data:data,
             
            });
        dialogRef.afterClosed().subscribe(result => { });
    }
    openAutoFill() {
        let ptTemplate, custId, isVistex
        let pt = this.curPricingTable;
        if (pt != null) {
            this.newPricingTable = pt;
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            this.newPricingTable["_defaultAtrbs"] = lnavUtil.updateNPTDefaultValues(pt, ptTemplate.defaultAtrbs);
        }
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
            "ptTemplate": ptTemplate
        };

        const dialogRef = this.dialog.open(AutoFillComponent, {
            height: '750px',
            width: '1500px',
            data: autofillData,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //the scuscriber to this in Lnav ngonint code and this fill help autofill setting from lnav screen
                this.autoFillData = result;
                this.curPricingTable["_defaultAtrbs"] = this.autoFillData.newPt["_defaultAtrbs"];
                //PTE_Load_Util.updateResults(this.newPricingTable, pt, this.curPricingTable) //Not Needed for now?
                //Following is for pushing PTE autofillsettings changes  to Lnav pricing table level
                this.lnavSVC.autoFillData.next(this.autoFillData);
            }
        });
    }

    ngOnInit() {
        this.isTenderContract = Tender_Util.tenderTableLoad(this.contractData);
        //code for autofill change to accordingly change values
        let res: any = this.pteService.autoFillData.toPromise().catch((err) => {
            this.loggerService.error('pteService::isAutoFillChange**********', err);
        });
        this.autoFillData = res;
    }
    ngOnChanges(): void {
        this.loadPTE();
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

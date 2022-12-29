import { Component, Input, Output, EventEmitter } from '@angular/core';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { logger } from '../../shared/logger/logger';
import { pricingTableEditorService } from './pricingTableEditor.service'
import { lnavService } from '../lnav/lnav.service';
import { productSelectorService } from '../../shared/services/productSelector.service';
import { flexoverLappingcheckDealService } from '../ptModals/flexOverlappingDealsCheck/flexOverlappingDealsCheck.service'
import { contractDetailsService } from "../contractDetails/contractDetails.service"
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field, sheetObj, ProdCorrectObj } from './handsontable.interface';
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
import { distinct } from '@progress/kendo-data-query';
import { dropDownModalComponent } from '../ptModals/dropDownModal/dropDownModal.component';

@Component({
    selector: 'pricing-table-editor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html'
})
export class pricingTableEditorComponent {

    constructor(private pteService: pricingTableEditorService,
        private productSelectorService: productSelectorService,
        private loggerService: logger,
        private lnavService: lnavService,
        private flexoverLappingCheckDealsService: flexoverLappingcheckDealService,
        private contractDetailsService: contractDetailsService,
        protected dialog: MatDialog) {
        /*  custom cell editor logic starts here*/
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
                this.BUTTON.innerHTML = '<i class="intelicon-search fs-search"></i>';
                this.BUTTON.addEventListener('mousedown', (event: any) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.openPopUp();
                });
            }
            async openPopUp() {
                VM.curRow = [];
                const selVal = this.hot.getDataAtCell(this.selRow, this.selCol);
                let modalComponent: any = null,
                    name: string = '',
                    height: string = '',
                    width: string = '650px',
                    data = {},
                    panelClass: string = "";
                if (this.field && this.field == 'PTR_USER_PRD') {
                    modalComponent = ProductSelectorComponent;
                    name = "Product Selector";
                    width = "5500px";
                    panelClass = "product-selector-dialog";
                    let obj = {};
                    _.each(this.hot.getCellMetaAtRow(this.selRow), (val) => {
                        if (val.prop) {
                            obj[val.prop] = this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) != null ? this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) : null;
                        }
                    });
                    VM.curRow.push(obj);

                    if (VM.curRow[0]['PTR_SYS_PRD'] == "" || VM.isExcludePrdChange) {
                        await VM.validateOnlyProducts('onOpenSelector', VM.curRow);
                        if (VM.curRow[0].isOpenCorrector) {
                            delete VM.curRow[0].isOpenCorrector;

                            if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                                VM.curRow[0]['PTR_SYS_PRD'] = ""
                                this.hot.setDataAtRowProp(this.selRow, 'PTR_SYS_PRD', '', 'no-edit');
                                delete VM.curRow[0].delPTR_SYS_PRD;
                            }
                            VM.curRow = [];
                            return;
                        }
                    }
                    data = { name: name, source: this.source, selVal: selVal, contractData: VM.contractData, curPricingTable: VM.curPricingTable, curRow: VM.curRow };
                }
                else if (this.field && this.field == 'PAYOUT_BASED_ON') {
                    modalComponent = dropDownModalComponent
                    name = "Select Payout Based On *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'PERIOD_PROFILE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Period Profile";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'RESET_VOLS_ON_PERIOD') {
                    modalComponent = dropDownModalComponent
                    name = "Select Reset Per Period";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'AR_SETTLEMENT_LVL') {
                    modalComponent = dropDownModalComponent
                    name = "Select Settlement Level";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'REBATE_TYPE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Rebate Type *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'PROD_INCLDS') {
                    modalComponent = dropDownModalComponent
                    name = "Select Media *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'SETTLEMENT_PARTNER') {
                    modalComponent = dropDownModalComponent
                    name = "Select Settlement Partner";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'SERVER_DEAL_TYPE') {
                    modalComponent = dropDownModalComponent
                    name = "Select Server Deal Type";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'PROGRAM_PAYMENT') {
                    modalComponent = dropDownModalComponent
                    name = "Select Program Payment *";
                    width = '600px';
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'GEO_COMBINED') {
                    modalComponent = GeoSelectorComponent
                    name = "Select Geo *";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'CUST_ACCNT_DIV') {
                    modalComponent = GeoSelectorComponent
                    name = "Customer Account Divisions";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if (this.field && this.field == 'QLTR_BID_GEO') {
                    modalComponent = GeoSelectorComponent;
                    panelClass = 'geo_multi_style',
                        name = "Select Bid Geo";
                    data = { name: name, source: this.source, selVal: selVal };
                }
                else if(this.field && this.field == 'MRKT_SEG'){
                    modalComponent = multiSelectModalComponent;
                    panelClass = 'multi-select-pte',
                        height = "500px"
                    width = "700px";
                    name = this.field;
                    data = { colName: name, items: { 'data': this.source }, cellCurrValues: selVal };
                }
                else {
                    const contractStartDate = VM.contractData["START_DT"];
                    const contractEndDate = VM.contractData["END_DT"];
                    const isConsumption = this.hot.getDataAtRowProp(this.selRow, "PAYOUT_BASED_ON") === "Consumption";
                    const isOEM = this.field === "OEM_PLTFRM_LNCH_DT" || this.field === "OEM_PLTFRM_EOL_DT";
                    modalComponent = kendoCalendarComponent;
                    height = "auto"
                    width = "600px";
                    name = this.field;
                    data = { colName: name, items: { 'data': this.source }, cellCurrValues: selVal, contractStartDate: contractStartDate, contractEndDate: contractEndDate, isConsumption: isConsumption, isOEM: isOEM, contractIsTender: VM.isTenderContract };
                    panelClass = "date-calendar-pop-up";
                }
                VM.editorOpened = true;
                const dialogRef = dialog.open(modalComponent, {
                    height: height,
                    width: width,
                    data: data,
                    panelClass: panelClass
                });
                await dialogRef.afterClosed().toPromise().then(result => {
                    if (result) {
                        if (this.field && this.field == 'PTR_USER_PRD') {//here there is no handonstable source specify bcz we need to do autofill
                            VM.isLoading = true;
                            let cntrctPrdct = [];
                            let excludedPrdct = [];
                            let sysPrd = {};
                            this.allOperations = [];
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
                                        VM.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                                        PTR.push({ row: this.selRow, prop: 'PTR_USER_PRD', old: this.hot.getDataAtRowProp(this.selRow, 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                                        this.selRow = this.selRow + VM.curPricingTable.NUM_OF_TIERS;
                                        let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct.toString() };
                                        this.allOperations.push(operation);
                                        PTE_CellChange_Util.autoFillCellOnProd(PTR, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns, operation);
                                    }
                                });
                            }
                            else {
                                _.each(result.validateSelectedProducts, (item) => {
                                    if (!item[0].EXCLUDE) {
                                        cntrctPrdct.push(item[0].HIER_VAL_NM)
                                    }
                                    else if (item[0].EXCLUDE && !result.splitProducts) {
                                        excludedPrdct.push(item[0].HIER_VAL_NM);
                                    }
                                    sysPrd[item[0].DERIVED_USR_INPUT] = item;
                                });
                                let PTR = [];
                                VM.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                                PTR.push({ row: this.selRow, prop: 'PTR_USER_PRD', old: this.hot.getDataAtRowProp(this.selRow, 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                                let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct.toString() };
                                this.allOperations.push(operation);
                                PTE_CellChange_Util.autoFillCellOnProd(PTR, VM.curPricingTable, VM.contractData, VM.pricingTableTemplates, VM.columns, operation);
                            }
                        }
                        else {
                            if (this.field && selVal != result?.toString &&
                                (this.field == 'CUST_ACCNT_DIV' || this.field == "GEO_COMBINED" || this.field == 'START_DT' || this.field == 'END_DT' || this.field == 'PAYOUT_BASED_ON' || this.field == 'PERIOD_PROFILE' || this.field == 'RESET_VOLS_ON_PERIOD' || this.field == 'AR_SETTLEMENT_LVL'
                                || this.field == 'REBATE_TYPE' || this.field == 'PROD_INCLDS' || this.field == 'SETTLEMENT_PARTNER' || this.field == 'MRKT_SEG'  )) {
                                VM.dirty = true;
                                VM.removeCellComments(this.selRow,this.field);
                            }
                            this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString(), 'no-edit');
                        }
                        VM.editorOpened = false;
                        setTimeout(() => {
                            VM.isLoading = false;
                            if (VM.curPricingTable.OBJ_SET_TYPE_CD && VM.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                                if (this.allOperations.length > 0) {
                                    for (let i = 0; i < this.allOperations.length; i++) {
                                        let denBandData = PTE_CellChange_Util.validateDensityBand(this.selRow, VM.columns, VM.curPricingTable, this.allOperations[i], '', false, VM.validMisProd);
                                        VM.validMisProd = denBandData.validMisProds;
                                        VM.generateHandsonTable(denBandData.finalPTR);
                                    }
                                }
                            }
                        }, 2000);

                        if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                            delete VM.curRow[0].delPTR_SYS_PRD
                        }
                    } else {
                        let curRow = PTE_CellChange_Util.returnEmptyRow();
                        let prd = this.hot.getDataAtRowProp(this.selRow, 'PTR_USER_PRD')
                        if (this.field && this.field == 'PTR_USER_PRD' && (curRow == 0 || this.selRow == 0) && (prd == null || prd == '' || prd == undefined) ) {
                            VM.enableDeTab.emit({ isEnableDeTab: false, enableDeTabInfmIcon: false });
                            return [];
                        }
                    }
                });

                if (VM.curRow[0] && VM.curRow[0].delPTR_SYS_PRD) {
                    VM.curRow[0]['PTR_SYS_PRD'] = ""
                    this.hot.setDataAtRowProp(this.selRow, 'PTR_SYS_PRD', '', 'no-edit');
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
    public fontData:any[] = [
        { text: "(inherited size)", size: "inherit" },
        { text: "1 (8pt)", size: "8" },
        { text: "2 (10pt)", size: "10" },
        { text: "3 (12pt)", size: "12" },
        { text: "4 (14pt)", size: "14" },
        { text: "5 (18pt)", size: "18" },
        { text: "6 (24pt)", size: "24" },
    ];
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
    private timeout:any = null;
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
        afterChange: (changes, source) => {
            try{
                //the data is coing as null in case of source is loadData 
                if(changes){
                    //using => operator to-call-parent-function-from-callback-function
                    //loading screen changes are moved to the top to  make better performance
                    this.spinnerMessageHeader = 'Loading...';
                    this.spinnerMessageDescription = 'Loading the Table Editor';
                    this.isLoading=true;
                    setTimeout(()=>{
                        this.afterCellChange(changes, source);
                        this.isLoading=false;
                    },0)
                }
            }
            catch(ex){
                this.loggerService.error('Something went wrong', 'Error');
                console.error('PTE::afterChange::',ex);
            }

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
    private kitNameObj:any=null;
    private kitNameObjArr:any[]=[];
    private isKitDialog:boolean=false;
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
            console.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service::',err);
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
            this.enableDeTab.emit({ isEnableDeTab: true, enableDeTabInfmIcon: this.isDeTabInfmIconReqd});
            return response.PRC_TBL_ROW;
        } else {
            this.enableDeTab.emit({ isEnableDeTab: false, enableDeTabInfmIcon: false });
            return [];
        }
    }
    getMergeCellsOnDelete() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, this.curPricingTable);
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
        _.each(columnTemplates, (item: PRC_TBL_Model_Column, index) => {
            let currentColumnConfig = PTEUtil.generateHandsontableColumn(this.isTenderContract,this.pteService, this.loggerService, this.dropdownResponses, columnFields, columnAttributes, item, index);
            //adding for cell management in cell this can move to seperate function later
            this.ColumnConfig.push(currentColumnConfig);
            if (item.field == 'PTR_USER_PRD' || item.field == 'GEO_COMBINED' || item.field == 'MRKT_SEG' || item.field == 'QLTR_BID_GEO' || item.field == 'CUST_ACCNT_DIV'
                || item.field == 'PAYOUT_BASED_ON' || item.field == 'PERIOD_PROFILE' || item.field == 'RESET_VOLS_ON_PERIOD' || item.field == 'AR_SETTLEMENT_LVL'
                || item.field == 'REBATE_TYPE' || item.field == 'PROD_INCLDS' || item.field == 'SETTLEMENT_PARTNER' || item.field == 'SERVER_DEAL_TYPE' || item.field == 'PROGRAM_PAYMENT') {
                currentColumnConfig.editor = this.custCellEditor;
            }
            if (currentColumnConfig && currentColumnConfig.type=='date'){
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
        if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)){
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
            _.each(changes, (item) => {

                if (item[1] == 'PTR_USER_PRD') {
                    if (item[3] != null && item[3] != '') {
                        let obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
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
                    let obj = { row: item[0], prop: item[1], old: item[2], new: item[3] };
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
            //to make sure to trigger translate API call.(Product validation)
            _.each(PTE_Config_Util.flushSysPrdFields, (item) => {
                let modifiedDetails = _.where(changes, { prop: item });
                if (modifiedDetails && modifiedDetails.length > 0)
                    _.each(modifiedDetails, (modItem) => {
                        this.hotTable.setDataAtRowProp(modItem.row, 'PTR_SYS_PRD', '', 'no-edit');
                    })
            })
            // Show error message on mandatory fields deletion
            if (changes.length > 0 && !this.editorOpened && changes[0].prop != 'PTR_USER_PRD' && changes[0].prop != 'START_DT' && changes[0].prop != 'END_DT' && changes[0].prop != 'OEM_PLTFRM_LNCH_DT' && changes[0].prop != 'OEM_PLTFRM_EOL_DT')  {
               this.errorOnMdtFdDeletion(changes);
            }
            let PTR = _.where(changes, { prop: 'PTR_USER_PRD' });
            let PTR_EXLDS = _.where(changes, { prop: 'PRD_EXCLDS' });
            let AR = _.where(changes, { prop: 'AR_SETTLEMENT_LVL' });
            let startVol = _.where(changes, { prop: 'STRT_VOL' });
            let rebateType = _.where(changes, { prop: 'REBATE_TYPE' });
            //KIT On change events
            let KIT_ECAP = _.filter(changes, item => { return item.prop == 'ECAP_PRICE_____20_____1' || item.prop == 'ECAP_PRICE' });
            let KIT_DSCNT = _.filter(changes, item => { return item.prop == 'DSCNT_PER_LN' || item.prop == 'QTY' });
            let KIT_name = _.where(changes, { prop: 'DEAL_GRP_NM' })
            //Voltier Changes
            let tierChg = _.filter(changes, item => { return item.prop == 'END_PB' || item.prop == 'STRT_PB' || item.prop == 'END_REV' || item.prop == 'STRT_REV' || item.prop == 'END_VOL' || item.prop == 'STRT_VOL' });
            let rateChg = _.filter(changes, item => { return item.prop == 'DENSITY_RATE' || item.prop == 'ECAP_PRICE' || item.prop == 'TOTAL_DOLLAR_AMOUNT' || item.prop == 'RATE' || item.prop == 'VOLUME' || item.prop == 'FRCST_VOL' || item.prop == 'ADJ_ECAP_UNIT' || item.prop == 'MAX_PAYOUT' || item.prop == 'INCENTIVE_RATE' });
            let pgChg = _.filter(changes, item => { return item.prop == 'PROGRAM_PAYMENT' });
            // settlement level and period profile set to default value on delete
            let perPro = _.where(changes, { prop: 'PERIOD_PROFILE' });
            //here we are using if conditions because at a time multiple changes can happen
            if (PTR && PTR.length > 0) {
                this.undoEnable = false;
                this.undoCount -= 1;
                PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns);
            }
            if (perPro && perPro.length > 0) {
                PTE_CellChange_Util.perProfDefault(perPro, this.contractData, this.curPricingTable);
            }
            if (AR && AR.length > 0) {
                PTE_CellChange_Util.autoFillARSet(AR, this.contractData, this.curPricingTable);
            }
            //KIT on change events
            if (KIT_ECAP && KIT_ECAP.length > 0) {
                PTE_CellChange_Util.kitEcapPriceChange(KIT_ECAP, this.columns, this.curPricingTable);
            }
            if (KIT_DSCNT && KIT_DSCNT.length > 0) {
                PTE_CellChange_Util.kitDSCNTChange(KIT_DSCNT, this.columns, this.curPricingTable);
            }
            if (KIT_name && KIT_name.length > 0) {
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
                PTE_CellChange_Util.pgChgfn(pgChg, this.columns, this.curPricingTable);
            }
            if (pgChg.length == 0) {
                PTE_CellChange_Util.checkfn(changes, this.curPricingTable, this.columns);
            }
            //for multi tier there can be more tiers to delete so moving the logic after all change 
            if (this.multiRowDelete && this.multiRowDelete.length > 0 && this.isDeletePTR) {
                this.deleteRow(this.multiRowDelete);
            }
            if (startVol && startVol.length > 0) {
                //making the start vol val to zero incase empty
                PTE_CellChange_Util.defaultVolVal(startVol, this.columns, this.curPricingTable);
            }
            let startDt = _.where(changes, { prop: 'START_DT' });
            if (startDt) {
                PTE_CellChange_Util.dateChange(startDt, 'START_DT', this.contractData);
            }
            let endDt = _.where(changes, { prop: 'END_DT' });
            if (endDt) {
                PTE_CellChange_Util.dateChange(endDt, 'END_DT', this.contractData);
            }
            let OEMlunchDt = _.where(changes, { prop: 'OEM_PLTFRM_LNCH_DT' });
            if (OEMlunchDt) {
                PTE_CellChange_Util.dateChange(OEMlunchDt, 'OEM_PLTFRM_LNCH_DT', this.contractData);
            }
            let OEMEOLDt = _.where(changes, { prop: 'OEM_PLTFRM_EOL_DT' });
            if (OEMEOLDt) {
                PTE_CellChange_Util.dateChange(OEMEOLDt, 'OEM_PLTFRM_EOL_DT', this.contractData);
            }
            if ((PTR_EXLDS && PTR_EXLDS.length > 0)) {
                let selrow = PTR_EXLDS[0].row;
                let PTR_Exccol_ind = _.findIndex(this.columns, { data: 'PRD_EXCLDS' });
                this.hotTable.setCellMeta(selrow, PTR_Exccol_ind, 'className', 'normal-product');
                this.hotTable.render();
                this.isExcludePrdChange = true;
                this.hotTable.setDataAtRowProp(selrow, 'PTR_SYS_INVLD_PRD', '', 'no-edit');
            }
            let isEnable = this.hotTable.isEmptyRow(0);
            this.enableDeTab.emit({ isEnableDeTab: !isEnable, enableDeTabInfmIcon: this.isDeTabInfmIconReqd });
        }
    }

    errorOnMdtFdDeletion(changes){
        if ( (changes[0].new == null || changes[0].new == '' || changes[0].new == undefined) && this.pricingTableTemplates['model']['fields'][changes[0].prop].nullable == false ){
            let colSPIdx = _.findIndex(this.columns, { data: changes[0].prop });
            this.cellComments.push({ row: changes[0].row, col: colSPIdx, comment: { value: 'This field is required', readOnly: true }, className: 'error-border' });
            this.hotTable.updateSettings({
                cell: this.cellComments
            });
            this.hotTable.render();
        } else {
            this.removeCellComments(changes[0].row,changes[0].prop)
        }
    }

    removeCellComments(row,prop){
        let col = _.findIndex(this.columns, { data: prop });
        let cellMeta = this.hotTable.getCellMeta(row, col);
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
        _.each(this.multiRowDelete, item => {
            delDCIDs.push(this.hotTable.getDataAtRowProp(item.row, 'DC_ID'));
        });
        //calling the below method to validate the non-deleted records and if no client side validations then it will proceed for deletion
        this.validatePricingTableProducts(delDCIDs);
    }
    showHelpTopic() {
        window.open('https://wiki.ith.intel.com/display/Handbook/Pricing+Table+Editor+Features', '_blank');
    }
    closeKitDialog() {
        //close kitdialog closes the kendo dialog and clear the kit name cell
        PTE_CellChange_Util.closeKitDialog(this.kitNameObj, this.columns, this.curPricingTable);
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
            //will delete the rows first this must be first step
            _.each(this.kitNameObj.PTR, (itm) => {
                let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
                PTR = _.map(PTR, (x) => { return { DEAL_GRP_NM: x['DEAL_GRP_NM'].toUpperCase() } });
                let PTRlen = _.filter(PTR, (x) => { return x.DEAL_GRP_NM.toUpperCase() == this.kitNameObj.name.toUpperCase() }).length;
                let lastRow = _.findLastIndex(PTR, { DEAL_GRP_NM: this.kitNameObj.name.toUpperCase() });
                if (PTRlen > 1) {
                    let prdlen = this.hotTable.getDataAtRowProp(lastRow, 'PTR_USER_PRD').split(',').length;
                    this.hotTable.alter('remove_row', lastRow, prdlen, 'no-edit');
                }
            });
            //After delete will merge the rows
            PTE_CellChange_Util.mergeKitDeal(this.kitNameObj, this.columns, this.curPricingTable, this.contractData, this.pricingTableTemplates);
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
            let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
            //delete can be either simple row delete for PTR not saved or can be PTR which are saved
            _.each(PTR, (PTRow, ind) => {
                _.each(rows, row => {
                    let DCID = this.hotTable.getDataAtRowProp(row.row, 'DC_ID');
                    if (PTRow.DC_ID == DCID) {
                        delRows.push({ row: ind, DC_ID: PTRow.DC_ID });
                    }
                })
            });
            //delete the row data from transformResults Object if any
            if (this.transformResults && this.transformResults['Data'] && Object.keys(this.transformResults['Data']).length > 0) {
                _.each(delRows, (delRow) => {
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
            if (savedRows.length > 0 && delRows.length == savedRows.length && !isProdCorrectorDeletion) {//if product deleted through product corrector, no need of api call
                //this will openup dialog box and call closeDialog function
                this.isDialogOpen = true;
            }
            //this condition for both case
            if (nonSavedRows.length > 0 && savedRows.length > 0 && !isProdCorrectorDeletion) {//if product deleted through product corrector, no need of api call
                this.hotTable.alter('remove_row', nonSavedRows[0].row, nonSavedRows.length, 'no-edit');
                this.getMergeCellsOnDelete();
                //this step will move all the deleted records which matched nonSavedRows records
                this.multiRowDelete = _.reject(this.multiRowDelete, itm => { return _.contains(_.pluck(nonSavedRows, 'row'), itm.row) });
                this.isDialogOpen = true;
            }
            if (savedRows.length > 0 && nonSavedRows.length > 0 && isProdCorrectorDeletion) {//if product deleted through product corrector, delete from UI before save action
                _.each(nonSavedRows, (nonSavedRow) => {
                    this.hotTable.alter('remove_row', nonSavedRow.row, 1, 'no-edit');
                    this.getMergeCellsOnDelete();
                    //this step will move all the deleted records which matched nonSavedRows records
                    this.multiRowDelete = _.reject(this.multiRowDelete, itm => { return _.contains(_.pluck(nonSavedRow, 'row'), itm.row) });
                })
            }
            if (savedRows.length > 0 && isProdCorrectorDeletion) {//if product deleted through product corrector, delete from UI before save action
                _.each(savedRows, (savedRow) => {
                    this.hotTable.alter('remove_row', savedRow.row, 1, 'no-edit');
                    this.getMergeCellsOnDelete();
                    //this step will move all the deleted records which matched nonSavedRows records
                    this.multiRowDelete = _.reject(this.multiRowDelete, itm => { return _.contains(_.pluck(savedRow, 'row'), itm.row) });
                })
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
            this.loggerService.error('Something went wrong', 'Error');
            console.error('pricingTableEditorComponent::getAllDrowdownValues::service', err)
        });
        return result;
    }
    async loadPTE() {
        try {
            this.isLoading = true;
            this.overlapFlexResult = [];
            this.setBusy("Loading...", "Loading the Table Editor", "Info", true);
            let PTR = await this.getPTRDetails();
            //to avoid losing warning details which comes only during save action
            if (this.savedResponseWarning && this.savedResponseWarning.length > 0)
                PTE_Load_Util.bindWarningDetails(PTR, this.savedResponseWarning);
            //this is to make sure the saved record prod color are success by default
            PTR = PTE_Load_Util.setPrdColor(PTR);
            this.getTemplateDetails();
            this.dropdownResponses = await this.getAllDrowdownValues();
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
                _.each(deleteDCIDs, (delId) => {
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
                    var cashObj = finalPTR.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
                    if (cashObj && cashObj.length > 0) {
                        if (this.VendorDropDownResult != null && this.VendorDropDownResult != undefined && this.VendorDropDownResult.length > 0) {
                            var customerVendor = this.VendorDropDownResult;
                            _.each(finalPTR, (item) => {
                                var partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
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
            PTE_Save_Util.fillingPayLoad(finalPTR, this.curPricingTable);
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
        let result = await this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data, true, true, false).toPromise().catch((error) => {
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
            //this will help to reload the page with errors when we update
            await this.loadPTE();
            if (deleteDCIDs == undefined) {
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
        }
        else {
            this.loggerService.error("Something went wrong", 'Error');
            console.error("pricingTableEditorComponent::saveUpdatePTEAPI::", 'error');
        }
        this.isLoading = false;

    }
    async validatePricingTableProducts(deleteDCIDs?) {
        //validate Products for non-deleted records, if any product is invalid it will stop deletion as well
        let isValidProd = await this.validateOnlyProducts('onSave', undefined, deleteDCIDs);
        if (isValidProd != undefined)
            await this.saveandValidate(isValidProd, deleteDCIDs);
    }
    async saveandValidate(isValidProd, deleteDCIDs?) {
        //Handsonetable loading taking some time so putting this logic for loader
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        //removing the deleted record from PTR
        if (deleteDCIDs && deleteDCIDs.length > 0) {
            _.each(deleteDCIDs, (delId) => {
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
            this.isCustDivNull = PTE_Helper_Util.isCustDivisonNull(PTR, this.contractData.CUST_ACCNT_DIV);
            if (!this.isCustDivNull) {
                await this.ValidateAndSavePTE(isValidProd, deleteDCIDs);
            }
        }
    }
    async validateOnlyProducts(action: string, curRow?, deleteDCIDs?) {
        //loader
        let isPrdValid: any = null;
        //generate PTE
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        //removing the deleted record from PTR
        if (deleteDCIDs && deleteDCIDs.length > 0) {
            _.each(deleteDCIDs, (delId) => {
                PTR = PTR.filter(x => x.DC_ID != delId);
            })
        }
        let translateResult = await this.ValidateProducts(PTR, false, true, null);
        let updatedPTRObj: any = null;
        if (translateResult && translateResult['Data']) {
            let prdValResult = PTEUtil.isValidForProdCorrector(translateResult['Data']);
            updatedPTRObj = PTEUtil.cookProducts(translateResult['Data'], PTR);
            //code to bind the cook result of success or failure
            let PTR_col_ind = _.findIndex(this.columns, { data: 'PTR_USER_PRD' });
            let PTR_EXCL_col_ind = _.findIndex(this.columns, { data: 'PRD_EXCLDS' });
            _.each(updatedPTRObj.rowData, (data, idx) => {
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

            if (_.contains(prdValResult, '1')) {
                // Product corrector if invalid products
                this.isLoading = false;
                if ((action == 'onOpenSelector' && translateResult['Data'] &&
                    ((translateResult['Data'].DuplicateProducts && translateResult['Data'].DuplicateProducts[curRow[0].DC_ID]) ||
                        (translateResult['Data'].InValidProducts && translateResult['Data'].InValidProducts[curRow[0].DC_ID]))) ||
                    action != 'onOpenSelector') {
                    await this.openProductCorrector(translateResult['Data'], action, deleteDCIDs)
                    if (curRow) {
                        curRow[0].isOpenCorrector = true;
                    }
                }
                if (action == 'onSave') {
                    this.showErrorMsg = false;
                }
            }
            else {
                if (this.curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                    _.each(updatedPTRObj.rowData, (data, idx) => {
                        this.hotTable.setDataAtRowProp(idx, 'PTR_USER_PRD', data.PTR_USER_PRD, 'no-edit')

                    });
                    let denBandData = PTE_CellChange_Util.validateDensityBand(0, this.columns, this.curPricingTable, '', translateResult['Data'], false, this.validMisProd);
                    this.validMisProd = denBandData.validMisProds;
                    this.generateHandsonTable(denBandData.finalPTR);
                }
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
                    if (action != 'onOpenSelector') {
                        this.validationMessage = true;
                    }
                    this.isLoading = false;
                }
            }
        }
        else {
            if (action != 'onSave') {
                this.validationMessage = true;
            }
            this.isLoading = false;
            return true;
        }
    }

    async resetValidationMessage() {
        this.validationMessage = false;
    }
    async ValidateProducts(currentPricingTableRowData, publishWipDeals, saveOnContinue, currentRowNumber) {
        let hasProductDependencyErr = false;
        hasProductDependencyErr = PTEUtil.hasProductDependency(currentPricingTableRowData, this.productValidationDependencies, hasProductDependencyErr);
        if (hasProductDependencyErr) {
            // Tell user to fix errors
            this.isLoading = true;
            this.setBusy("Not saved. Please fix errors.", "Please fix the errors so we can properly validate your products", "Error", true);
            setTimeout(() => {
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, 1300);
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
        let invalidProductJSONRows = pricingTableRowData.filter(function (x) {

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
                this.transformResults['Data'] = PTE_Validation_Util.buildTranslatorOutputObjectproductCorroctor(invalidProductJSONRows, resultdata['Data']);
            }
        }
        this.isLoading = false;
        return this.transformResults;
    }
    openProductSelector() {
        let modalComponent: any = null,
            name: string = '',
            height: string = '',
            width: string = '650px',
            data = {},
            panelClass: string = "";
        modalComponent = ProductSelectorComponent;
        name = "Product Selector";
        width = "5500px";
        panelClass = "product-selector-dialog";
        let VM = this;
        let allOperations = [];
        let emptyRow;
        data = { name: name, source: '', selVal: '', contractData: this.contractData, curPricingTable: this.curPricingTable, curRow: '' };
        const dialogRef = this.dialog.open(modalComponent, {
            height: height,
            width: width,
            data: data,
            panelClass: panelClass
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isLoading = true;
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
                            if (this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                                if (idx != 0) {
                                    result.validateSelectedProducts[idx].indx = result.validateSelectedProducts[idx - 1].indx
                                        + result.validateSelectedProducts[idx - 1].items.length;
                                }
                            }
                            let PTR = [];
                            this.dirty = true;//for enabling save&Validate button when a product is added from productSelector
                            PTR.push({ row: PTE_CellChange_Util.returnEmptyRow(), prop: 'PTR_USER_PRD', old: this.hotTable.getDataAtRowProp(result.validateSelectedProducts[idx].indx, 'PTR_USER_PRD'), new: cntrctPrdct.toString() });
                            let operation = { operation: 'prodsel', PTR_SYS_PRD: JSON.stringify(sysPrd), PRD_EXCLDS: excludedPrdct.toString() };
                            PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, operation);
                        }
                    });
                }
                else {
                    _.each(result.validateSelectedProducts, (item) => {
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
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let selRow: any;
        let rowProdCorrectordat: any;
        let selRows = []
        _.each(products.DuplicateProducts, (val, key) => {
            let res = _.findWhere(PTR, { DC_ID: parseInt(key) });
            let idx = _.findIndex(PTR, { DC_ID: parseInt(key) });
            selRows.push({ DC_ID: res.DC_ID, name: _.keys(val).toString(), row: res, indx: idx });
        });
        _.each(products.InValidProducts, (val, key) => {
            let res = _.findWhere(PTR, { DC_ID: parseInt(key) });
            let idx = _.findIndex(PTR, { DC_ID: parseInt(key) });
            if ((selRows.find(a => a.DC_ID == parseInt(key)) != undefined)
                && (selRows.find(a => a.DC_ID == parseInt(key))?.DC_ID != 0))
                return;
            if (_.values(val) != undefined && _.values(val) != null)
                selRows.push({ DC_ID: res.DC_ID, name: _.uniq(_.values(val)[1]).toString(), row: res, indx: idx });
        });
        let data = { ProductCorrectorData: products, contractData: this.contractData, curPricingTable: this.curPricingTable, selRows: selRows };
        const dialogRef = this.dialog.open(ProductCorrectorComponent, {
            height: '90vh',
            maxWidth: "90vw",
            width: '6500px',
            data: data,
            panelClass: "product-corrector-dialog",
        });
        await dialogRef.afterClosed().toPromise().then (async(savedResult: any) => {
            if (savedResult) {
                let transformResult = savedResult.ProductCorrectorData;
                this.transformResults["Data"] = transformResult
                let curRowIndx;
                let publishWipDeals = false;
                if (Object.keys(transformResult.DuplicateProducts).length > 0 || Object.keys(transformResult.InValidProducts).length > 0) {
                    publishWipDeals = false;
                }

                if (!!transformResult && !!transformResult.ProdctTransformResults) {
                    for (var key in transformResult.ProdctTransformResults) {
                        let r = parseInt(key);
                        let allIssuesDone = false;

                        //Trimming unwanted Property to make JSON light
                        if (!!transformResult.ValidProducts[key]) {
                            transformResult = PTEUtil.massagingObjectsForJSON(key, transformResult);
                        }
                        let index = _.findWhere(selRows,
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
                                let idx = selProd.indx;
                                let deletedProds = savedResult.deletedProducts;
                                if (selProd) {
                                    if (this.curRow[0]) {
                                        curRowIndx = selProd.DCID == this.curRow[0]['DC_ID'] ? selProd.indx : null;
                                    }
                                    // sometime not all prod corrector rows are slected and user click save in that case we dont need to do any action
                                    if (selProd.items && selProd.items.length > 0) {
                                        //logic to bind the selected product and PTR_SYS_PRD to PTR
                                        if (this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                                            if (idx != 0) {
                                                //this is to map the current index of prod from last selected prod length
                                                savedResult.selectedProducts[idx].indx = savedResult.selectedProducts[idx - 1].indx + this.hotTable.getDataAtRowProp(savedResult.selectedProducts[idx - 1].indx, 'PTR_USER_PRD').split(',').length;
                                            }
                                        }
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
                                        _.each(ValidProducts, (val, DCID) => {
                                            const userInput = PTEUtil.updateUserInput(ValidProducts[DCID]);
                                            const contractProducts = userInput['contractProducts'].toString().replace(/(\r\n|\n|\r)/gm, "");
                                            _.each(finalPTR, (data, idx) => {
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
                                    setTimeout(() => {
                                        this.isLoading = false;
                                        this.setBusy("", "", "", false);
                                    }, 2000);

                                }
                                else if (deletedProds && deletedProds.length > 0) {
                                    let deletedRowIdList = distinct(deletedProds, 'DC_ID').map(item => item['DC_ID']);
                                    _.each(deletedRowIdList, (rowId) => {
                                        let deletedProd = deletedProds.filter(x => x.DC_ID == rowId);
                                        rowProdCorrectordat = PTE_CellChange_Util.getOperationProdCorr(undefined, deletedProd, products);
                                        PTE_CellChange_Util.autoFillCellOnProd(rowProdCorrectordat[0], this.curPricingTable, this.contractData, this.pricingTableTemplates, this.columns, rowProdCorrectordat[1]);
                                    })
                                }
                                if (this.curRow[0]) {
                                    let includeIndx = _.findIndex(this.columns, { data: 'PTR_USER_PRD' });
                                    let excludeIndx = _.findIndex(this.columns, { data: 'PRD_EXCLDS' });
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
                    }, 2000);
                }
                else if (action == 'onSave') {
                   await this.saveandValidate(true, deletedDCID);
                }
            }
        });
    }

    openOverLappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.curPricingTable,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            data: data,
            panelClass: 'oo-lapping-style'
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

    flexOverlappingDealCheck() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns, this.curPricingTable);
        let data = {
            "pricingTableData": this.curPricingTable,
            "PTR": PTR,
            "overlapFlexResult": this.overlapFlexResult
        }
        const dialogRef = this.dialog.open(FlexOverlappingCheckComponent, {
            data: data,
            panelClass: 'flex-overlapping-deals',
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    openAutoFill() {
        let ptTemplate, custId, isVistex
        let pt = this.curPricingTable;
        if (pt != null) {
            this.newPricingTable = pt;
            let customer = this.contractData.Customer;
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            this.newPricingTable["_defaultAtrbs"] = lnavUtil.updateNPTDefaultValues(pt, ptTemplate.defaultAtrbs, customer);
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
            height: 'auto',
            width: '1500px',
            data: autofillData,
            panelClass: "autofiller-pop-ups"
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
    ngOnInit() {
        this.isTenderContract = Tender_Util.tenderTableLoad(this.contractData);
        //code for autofill change to accordingly change values
        let res: any = this.pteService.autoFillData.toPromise().catch((err) => {
            this.loggerService.error('pteService::isAutoFillChange**********', err);
        });
        this.autoFillData = res;
        this.loadPTE();
    }
    hoverPTE() {
        $(".pricing_table_celltext .handsontable .ht_clone_inline_start .wtHolder table.htCore tr td.error-cell").hover(function () {
            $(".htCommentsContainer .htComments").toggleClass("commentHover");
        });
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

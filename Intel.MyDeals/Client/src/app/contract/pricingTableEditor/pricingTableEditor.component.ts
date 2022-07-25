/* eslint-disable prefer-const */
import * as angular from 'angular';
import { Component, Input, OnChanges } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import { pricingTableEditorService } from './pricingTableEditor.service'
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import * as _ from 'underscore';
import { templatesService } from '../../shared/services/templates.service';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field, sheetObj } from './handsontable.interface';
import { PTEUtil } from '../PTEUtils/PTE.util';
import { MatDialog } from '@angular/material/dialog';
import { ProductSelectorComponent } from '../ptModals/productSelector/productselector.component';
import { GeoSelectorComponent } from '../ptModals/geo/geo.component';
import { marketSegComponent } from '../ptModals/marketSegment/marketSeg.component';
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
        protected dialog: MatDialog) {
        /*  custom cell editot logic starts here*/
        let VM=this;
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
                this.BUTTON.innerText = '🔍';
                this.BUTTON.addEventListener('mousedown', (event: any) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.openPopUp();
                });
            }
            openPopUp() {
                const selVal = this.hot.getDataAtCell(this.selRow, this.selCol);
                let modalComponent: any = null, name: string = '', height: string = "250px", width: string = '650px',data={};
                if (this.field && this.field == 'PTR_USER_PRD') {
                    modalComponent = ProductSelectorComponent;
                    name = "Product Selector";
                    height = "850px"
                    width = "1700px";
                    let obj={},curRow=[];
                    _.each(this.hot.getCellMetaAtRow(this.selRow), (val) => {
                        if (val.prop) {
                            obj[val.prop] = this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) != null ? this.hot.getDataAtRowProp(this.selRow, val.prop.toString()) : null;
                        }
                    });
                    curRow.push(obj);
                    data={ name: name, source: this.source, selVal: selVal,contractData:VM.contractData,curPricingTable:VM.curPricingTable,curRow:curRow};
                }
                else if (this.field && this.field == 'GEO_COMBINED') {
                    modalComponent = GeoSelectorComponent
                    name = "Geo Selector";
                    data={ name: name, source: this.source, selVal: selVal};
                }
                else {
                    modalComponent = marketSegComponent;
                    name = "Market Segment Selector";
                    data={ name: name, source: this.source, selVal: selVal};
                }
                const dialogRef = dialog.open(modalComponent, {
                    height: height,
                    width: width,
                    data: data,
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        if (this.field && this.field == 'PTR_USER_PRD')//here there is no handonstable source specify bcz we need to do autofill
                            this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString());
                        else
                            this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString(), 'no-edit');
                    }
                });
            }
        }
        /*  custom cell editot logic ends here*/
    }
    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    /*For loading variable */
    private isLoading: boolean = false;
    private spinnerMessageHeader: string = "PTE Loading";
    private spinnerMessageDescription: string = "PTE loading please wait";
    private isBusyShowFunFact: string = 'false'
    /*For loading variable */
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private pricingTableDet: Array<any> = [];
    private pricingTableTemplates: any = {}; // Contains templates for All Deal Types
    private autoFillData: any = null;
    private ColumnConfig: Array<Handsontable.ColumnSettings> = [];
    // To get the selected row and col for product selector
    private multiRowDelete: Array<number> = [];
    // Handsontable Variables basic hottable structure
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: false,
        minRows: 100,
        maxRows: 100,
        colHeaders: false,
        rowHeaders: true,
        rowHeaderWidth: 0,
        fixedColumnsLeft: 1,
        fixedRowsTop: 0,
        copyPaste: true,
        comments: true,
        height: 690,
        width: 1550,
        afterChange: (changes, source) => {
            //using => operator to-call-parent-function-from-callback-function
            this.afterCellChange(changes, source);
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

    private productValidationDependencies = PTE_Config_Util.productValidationDependencies;
    private kitDimAtrbs:Array<string> = PTE_Config_Util.kitDimAtrbs;
    private isTenderContract = false;
    private maxKITproducts:number = PTE_Config_Util.maxKITproducts;

    //this will help to have a custom cell validation which allow only alphabets
    private newPricingTable: any = {};
    getTemplateDetails() {
        // Get the Contract and Current Pricing Strategy Data
        this.curPricingStrategy = PTE_Common_Util.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = PTE_Common_Util.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        // Get template for the selected PT
        this.pricingTableTemplates = this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
        //Get Refined columns based on contract/Tender
        PTE_Load_Util.PTEColumnSettings(this.pricingTableTemplates, this.isTenderContract, this.curPricingTable);
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
            if (this.isTenderContract) {
                for (var p = 0; p < response.PRC_TBL_ROW.length; p++) {
                    var item = response.PRC_TBL_ROW[p];
                    if (item !== undefined && item.PTR_SYS_PRD === "") {
                        item.dirty = true;
                    }
                }
            }
            vm.pricingTableDet = response;
            return response.PRC_TBL_ROW;
        } else {
            return [];
        }
    }
    getMergeCellsOnDelete() {
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns,this.curPricingTable);
        let mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, PTE_Load_Util.numOfPivot(PTR, this.curPricingTable));
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
            let currentColumnConfig = PTEUtil.generateHandsontableColumn(this.pteService, this.loggerService, this.dropdownResponses, columnFields, columnAttributes, item, index);
            //adding for cell management in cell this can move to seperate function later
            this.ColumnConfig.push(currentColumnConfig);
            if (item.field == 'PTR_USER_PRD' || item.field == 'GEO_COMBINED' || item.field == 'MRKT_SEG') {
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
        // This logic will add for all tier deals
        mergCells = PTE_Load_Util.getMergeCells(PTR, this.pricingTableTemplates.columns, PTE_Load_Util.numOfPivot(PTR, this.curPricingTable));
        // Set the values for hotTable
        PTR = PTR.length > 0 ? PTR : Handsontable.helper.createEmptySpreadsheetData(5, this.columns.length);
        // Loading new data
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
                return this.disableCells(this.hotTable, row, col, prop)
            },
            cell: cellComments,
            readOnlyCellClassName: 'readonly-cell',
            nestedHeaders: nestedHeaders
        });
    }
    disableCells(hotTable: Handsontable, row: number, col: number, prop: any) {
        //logic for making by defaul all the cell except PTR_USER_PRD readonly
        const cellProperties = {};
        //if(hotTable.isEmptyRow(row)){ //this.hotTable.getDataAtRowProp(i,'DC_ID') ==undefined || this.hotTable.getDataAtRowProp(i,'DC_ID') ==null
        if (this.hotTable.getDataAtRowProp(row, 'DC_ID') == undefined || this.hotTable.getDataAtRowProp(row, 'DC_ID') == null || this.hotTable.getDataAtRowProp(row, 'DC_ID') == '') {
            if (prop != 'PTR_USER_PRD') {
                cellProperties['readOnly'] = true;
            }
        }
        if (this.hotTable.getDataAtRowProp(row, 'DC_ID') !== undefined && this.hotTable.getDataAtRowProp(row, 'DC_ID') !== null && this.hotTable.getDataAtRowProp(row, 'DC_ID') !== '' && this.hotTable.getDataAtRowProp(row, 'DC_ID') < 0) {
            //column config hasr eadonly property for certain column persisting that assigning for other
            if (_.findWhere(this.ColumnConfig, { data: prop }).readOnly) {
                cellProperties['readOnly'] = true;
            }
            else {
                cellProperties['readOnly'] = false;
            }
        }
        if (this.hotTable.getDataAtRowProp(row, '_behaviors') != undefined && this.hotTable.getDataAtRowProp(row, '_behaviors') != null) {
            var behaviors = this.hotTable.getDataAtRowProp(row, '_behaviors');
            if (behaviors.isReadOnly != undefined && behaviors.isReadOnly != null) {
                if (behaviors.isReadOnly[prop] != undefined && behaviors.isReadOnly[prop] != null && prop == "ECAP_PRICE_____20_____1" && behaviors.isReadOnly["ECAP_PRICE"] == true) {
                    cellProperties['readOnly'] = true;
                }
                if (behaviors.isReadOnly[prop] != undefined && behaviors.isReadOnly[prop] != null && behaviors.isReadOnly[prop] == true) {
                    cellProperties['readOnly'] = true;
                }
            }
        }
        if (this.hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') == undefined || this.hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') == null || this.hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL').toLowerCase() !== 'cash') {
            if (prop == 'SETTLEMENT_PARTNER') {
                cellProperties['readOnly'] = true;
            }
        }        
        return cellProperties;
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
                        if (source == 'edit') {
                            //if no value in PTR_USER_PRD its to delete since its looping for tier logic adding in to an array and finally deleting
                            this.multiRowDelete.push(item[0])
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
    afterCellChange(changes: Array<any>, source: any) { // Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
        if (source == 'edit' || source == 'CopyPaste.paste' || source == 'Autofill.fill') {
            // Changes will track all the cells changing if we are doing copy paste of multiple cells
            this.isLoading = true;
            this.spinnerMessageHeader = 'PTE Reloading';
            this.spinnerMessageDescription = 'PTE Reloading please wait';
            // PTE loading in handsone takes more loading time than Kendo so putting a loader
            setTimeout(() => {
                changes = this.identfyUniqChanges(changes, source);
                let PTR = _.where(changes, { prop: 'PTR_USER_PRD' });
                let AR = _.where(changes, { prop: 'AR_SETTLEMENT_LVL' });
                if (PTR && PTR.length > 0) {
                    PTE_CellChange_Util.autoFillCellOnProd(PTR, this.curPricingTable, this.contractData, this.pricingTableTemplates);
                }
                if (AR && AR.length > 0) {
                    PTE_CellChange_Util.autoFillARSet(AR, this.contractData);
                }
                //for multi tier there can be more tiers to delete so moving the logc after all change
                if (this.multiRowDelete && this.multiRowDelete.length > 0) {
                    this.deleteRow(this.multiRowDelete);
                }
                this.isLoading = false;
            }, 0);
        }
    }
    deleteRow(rows: Array<number>): void {
        //multiple delete at the sametime this will avoid issues of deleting one by one
        this.hotTable.alter('remove_row', rows[0], rows.length, 'no-edit');
        this.getMergeCellsOnDelete();
        //setting the value to empty to avoid extra delete
        this.multiRowDelete = [];
    }
    async getAllDrowdownValues() {
        let dropObjs = {};
        _.each(this.pricingTableTemplates.defaultAtrbs, (val, key) => {
            dropObjs[`${key}`] = this.pteService.readDropdownEndpoint(val.opLookupUrl);
         });
         _.each(this.pricingTableTemplates.model.fields,(item,key)=>{
            if(item && item.uiType && item.uiType=='DROPDOWN' && item.opLookupUrl && item.opLookupUrl !='' && (dropObjs[`${key}`] ==null || dropObjs[`${key}`]==undefined)){
               if(key=='SETTLEMENT_PARTNER'){
                //calling  settlement partner seperatly
                dropObjs['SETTLEMENT_PARTNER'] = this.pteService.getDropDownResult(item.opLookupUrl+'/'+this.contractData.Customer.CUST_SID);
               }
               else if(key=='PERIOD_PROFILE'){
                 //calling  PERIOD_PROFILE 
                dropObjs['PERIOD_PROFILE'] = this.pteService.getDropDownResult(item.opLookupUrl+this.contractData.Customer.CUST_SID);
               }
               else{
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
        this.spinnerMessageHeader = 'PTE loading';
        this.spinnerMessageDescription = 'PTE loading please wait';
        this.isLoading = true;
        let PTR = await this.getPTRDetails();
        this.getTemplateDetails();
        this.dropdownResponses =  await this.getAllDrowdownValues();
        //this is only while loading we need , need to modify as progress
        PTR = PTE_Load_Util.pivotData(PTR, false, this.curPricingTable, this.kitDimAtrbs);
        this.generateHandsonTable(PTR);
        this.isLoading = false;
    }
    undoPTE() {
        this.hotTable.undo();
    }
    redoPTE() {
        this.hotTable.redo();
    }

    async saveEntireContractRoot(finalPTR:Array<any>){
        //this logic is mainly for tier dealtypes to convert the PTR to savbale JSON
        finalPTR=PTE_Helper_Util.deNormalizeData(finalPTR,this.curPricingTable,this.kitDimAtrbs,this.maxKITproducts);
        //This method will remove all the unwanted property since there are keys with undefined values
        finalPTR = PTE_Common_Util.deepClone(finalPTR);
        //settment partner change for taking only the ID the API will send back us the both
        finalPTR = PTE_Save_Util.settlementPartnerValUpdate(finalPTR);
        //sanitize Data before save this will make sure all neccessary attributes are avaialbel
        finalPTR = PTE_Save_Util.sanitizePTR(finalPTR,this.contractData);
        let data={
            "Contract": [],
            "PricingStrategy": [],
            "PricingTable": [this.curPricingTable],
            "PricingTableRow": finalPTR,
            "WipDeals": [],
            "EventSource": 'PRC_TBL',
            "Errors": {}
        }
        let result= await this.pteService.updateContractAndCurPricingTable(this.contractData.CUST_MBR_SID,this.contractData.DC_ID,data,true,true,false).toPromise().catch((error)=>{
            this.loggerService.error("pricingTableEditorComponent::saveUpdatePTEAPI::", error);
        });
        let genPTR=PTE_Save_Util.generatePTRAfterSave(result);
        if(genPTR && genPTR.length>0){
         genPTR = PTE_Load_Util.pivotData(genPTR, false, this.curPricingTable, this.kitDimAtrbs);
         this.generateHandsonTable(genPTR);
        }
        else{
         this.loggerService.error("pricingTableEditorComponent::saveUpdatePTEAPI::",'error');
        }
    }
    async validatePricingTableProducts() {
    this.isLoading = true;
    this.spinnerMessageHeader = 'PTE Save';
    this.spinnerMessageDescription = 'PTE Saving please wait';
    //Handsonetable loading taking some time so putting this logic for loader
  
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns,this.curPricingTable);
        //Checking for UI errors
        let finalPTR = PTE_Save_Util.validatePTE(PTR, this.curPricingStrategy, this.curPricingTable,this.contractData);
        //if there is any error bind the result to handsone table
        let error=_.find(finalPTR,(x)=>{return _.keys(x._behaviors.isError).length>0});
        if(error && error.length>0){
            this.generateHandsonTable(finalPTR);
        }
        else{
            await this.saveEntireContractRoot(finalPTR);
        }
        this.isLoading = false;
    }
    async validateOnlyProducts() {
        //loader
        this.isLoading = true;
        this.spinnerMessageHeader = 'Validating your data...';
        this.spinnerMessageDescription = 'Please wait wile we validate your information!';
        //generate PTE
        let PTR = PTE_Common_Util.getPTEGenerate(this.columns,this.curPricingTable);
        let translateResult = await this.ValidateProducts(PTR, false, true, null);
        let updatedPTR = PTR;
        if (translateResult) {
            updatedPTR = PTEUtil.cookProducts(translateResult['Data'], PTR);
        }
        //let data = PTEUtil.validatePTE(PTR, this.curPricingTable.OBJ_SET_TYPE_CD);
        //the below generate table will get called for error binding later
        this.generateHandsonTable(updatedPTR);
        this.isLoading = false;

    }
    async ValidateProducts(currentPricingTableRowData, publishWipDeals, saveOnContinue, currentRowNumber) {
        let hasProductDependencyErr = false;
        hasProductDependencyErr = PTEUtil.hasProductDependency(currentPricingTableRowData, this.productValidationDependencies, hasProductDependencyErr);

        if (hasProductDependencyErr) {
            // Sync to show errors
            //root.syncCellValidationsOnAllRows(currentPricingTableRowData);

            // Tell user to fix errors
            this.isLoading = true;
            this.spinnerMessageHeader = 'Not saved. Please fix errors.';
            this.spinnerMessageDescription = 'Please fix the errors so we can properly validate your products';
            setTimeout(() => {
                this.isLoading = false;
                this.spinnerMessageHeader = '';
                this.spinnerMessageDescription = '';
            }, 1300);
            return;
        }

        //Getting deal type
        let dealType = this.curPricingTable.OBJ_SET_TYPE_CD;

        // Pricing table rows products to be translated
        let pricingTableRowData = currentPricingTableRowData.filter((x) => {
            console.log(x);
            return ((x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true))
                || (dealType == "KIT"); //|| ($scope.isExcludePrdChange);
        });

        //find uniq records incase of tier logic
        pricingTableRowData=_.uniq(pricingTableRowData,'DC_ID');
        // Convert into format accepted by translator API
        // ROW_NUMBER, CUST_MBR_SID, IS_HYBRID_PRC_STRAT - Remove hard coded values
        let translationInput = pricingTableRowData.map((row, index) =>{
            return {
                ROW_NUMBER: row.DC_ID,
                USR_INPUT: row.PTR_USER_PRD,
                EXCLUDE: false,
                FILTER: row.PROD_INCLDS,
                START_DATE: moment(row.START_DT).format("l"),
                END_DATE: moment(row.END_DT).format("l"),
                GEO_COMBINED: row.GEO_COMBINED,
                PROGRAM_PAYMENT: row.PROGRAM_PAYMENT,
                PAYOUT_BASED_ON: row.PAYOUT_BASED_ON,
                CUST_MBR_SID: this.contractData.CUST_MBR_SID,
                IS_HYBRID_PRC_STRAT: this.curPricingTable.IS_HYBRID_PRC_STRAT,
                SendToTranslation: (dealType == "KIT") || !(row.PTR_SYS_INVLD_PRD != null && row.PTR_SYS_INVLD_PRD != "")
            }
        });

        let translationInputToSend = translationInput.filter(function (x) {
            // If we already have the invalid JSON don't translate the products again
            return x.SendToTranslation == true;
        });

        // Products invalid JSON data present in the row
        let invalidProductJSONRows = pricingTableRowData.filter(function (x) {
            return (x.PTR_SYS_INVLD_PRD != null && x.PTR_SYS_INVLD_PRD != "");
        });

        let transformResults;

        // Products that needs server side attention
        if (translationInputToSend.length > 0) {
            // Validate products
            // Note: When changing the message here, also change the condition in $scope.saveEntireContractBase method in contract.controller.js
            // root.setBusy("Validating your data...", "Please wait as we find your products!", "Info", true);
            // var pcMt = new perfCacheBlock("Translate Products (DB not logged)", "MT");
            transformResults = await this.productSelectorSvc.TranslateProducts(translationInputToSend, this.contractData.CUST_MBR_SID, dealType, this.contractData.DC_ID, this.contractData.IS_TENDER) //Once the database is fixed remove the hard coded geo_mbr_sid
                .toPromise()
                .catch(error => {
                    this.loggerService.error("Product Trans::", error);
                })

            console.log("Transform : ", transformResults);
        }

        return transformResults;
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
        //code for autofill change to accordingly change values
        this.pteService.autoFillData.subscribe(res => {
            this.autoFillData = res;
        }, err => {
            this.loggerService.error("pteService::isAutoFillChange**********", err);
        }
        );
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
    }
}

angular.module("app").directive(
    "pricingTableEditor",
    downgradeComponent({
        component: pricingTableEditorComponent,
    })
);

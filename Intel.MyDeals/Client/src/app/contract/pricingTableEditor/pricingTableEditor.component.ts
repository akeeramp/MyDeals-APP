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
import { ContractUtil } from '../contract.util';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field, sheetObj } from './handsontable.interface';
import { PTEUtil } from '../PTE.util';
import { MatDialog } from '@angular/material/dialog';
import { ProductSelectorComponent } from '../productSelector/productselector.component';
import { SelectEditor } from './custSelectEditor.class';
import { forkJoin } from 'rxjs';
import { CellMeta, CellSettings, GridSettings } from 'handsontable/settings';
/**
 * http://localhost:55490/Dashboard#/contractmanager/26006
 */

@Component({
    selector: 'pricingTableEditor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html'
})
export class pricingTableEditorComponent implements OnChanges {

    constructor(private pteService: pricingTableEditorService,
                private templateService: templatesService,
                private pricingTableSvc: pricingTableEditorService,
                private loggerService: logger,
                protected dialog: MatDialog) {
      //this.dropdownResponseInitialization();

      this.custProdSelEditor = class custSelectEditor extends Handsontable.editors.TextEditor {
        public TEXTAREA: any;
        public BUTTON: any;
        public buttonStyle: any;
        public TEXTAREA_PARENT: any;
        public textareaStyle: any
        public textareaParentStyle: any
        public instance: any;
        public selectOptions: any;
        private hotId = "spreadsheet";
        private hotRegisterer = new HotTableRegisterer();
        private selRow = 0;
        private selCol = 0;

        constructor(hotInstance:any) {
          super(hotInstance);
        }

        prepare(row: number, col: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties): void {
          super.prepare(row, col, prop, TD, originalValue, cellProperties);
          this.selCol = col;
          this.selRow = row;
        }

        createElements() {
          super.createElements();
          this.TEXTAREA.style.float = 'left';
          this.createProductCellButton();
          this.TEXTAREA_PARENT.appendChild(this.BUTTON);
        }

        createProductCellButton() {
          this.BUTTON = document.createElement('button');
          this.BUTTON.setAttribute('style', `position: absolute; float: right; margin-left: 0%; height: ` + 25 + `px; font-size: 0.8em;`); // Float Right and Position Absolute allow the button to be next to the Cell
          this.buttonStyle = this.BUTTON.style;
          this.BUTTON.className = 'btn btn-sm btn-primary py-0';
          this.BUTTON.innerText = '🔍';
          this.BUTTON.addEventListener('mousedown', (event: any) => {
            event.preventDefault();
            this.openProdPopUp();
          });
        }

        openProdPopUp() {
          const hotTable: any = this.hotRegisterer.getInstance(this.hotId);
          if (this.selCol && this.selCol == 4) {
            const selVal = this.hotRegisterer.getInstance(this.hotId).getDataAtCell(this.selRow, this.selCol);
            const dialogRef = dialog.open(ProductSelectorComponent, {
              width: '500px',
              data: { name: "User", animal: selVal },
            });

            dialogRef.afterClosed().subscribe(result => {
              //this is to focus the cell selected
              hotTable.selectCell(this.selRow, this.selCol);
              if (result) {
                console.log('The dialog was closed:: result::', result);
                hotTable.setDataAtCell(this.selRow, this.selCol, result?.animal);
              }
            });
          }
        }
      }
      
    }

    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};

    /*For loading variable */
    private isLoading:string='false';
    private spinnerMessageHeader:string="PTE Loading";
    private spinnerMessageDescription:string="PTE loading please wait";
    private isBusyShowFunFact:string='false'
    /*For loading variable */
    private curPricingStrategy: any = {};
    private curPricingTable: any = {};
    private pricingTableDet: Array<any> = [];
    private pricingTableTemplates: any = {}; // Contains templates for All Deal Types
    private ColumnConfig :Array<Handsontable.ColumnSettings>=[];
    // To get the selected row and col for product selector
    private selRow = 0;
    private selCol = 0;
    //
    private multiRowDelete:Array<number>=[];
    // Handsontable Variables basic hottable structure
    private hotSettings: Handsontable.GridSettings = {
        minRows:50,
        maxRows: 50,
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
    private custProdSelEditor: any;
    private hotId = "spreadsheet";
    // Cached Dropdown API Responses (that do not usually change)
    private dropdownResponseLocalStorageKey = 'pricingTableEditor_DropdownApiResponses';
    private dropdownResponses:any = null;
   
    getTemplateDetails() {
        // Get the Contract and Current Pricing Strategy Data
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        // Get template for the selected PT
        this.pricingTableTemplates = this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];
    }
    async getPTRDetails() {
        let vm = this;
        let response = await vm.pteService.readPricingTable(vm.in_Pt_Id).toPromise().catch((err) => {
          this.loggerService.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);
        });

        if (response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length > 0) {
          vm.pricingTableDet = response;
          return response.PRC_TBL_ROW;
        } else {
          return [];
        }
    }
    getMergeCells(PTR: any):Array<any> {
      let mergCells = [];
      //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
      let distDCID = _.uniq(PTR, 'DC_ID');
      _.each(distDCID, (item) => {
        let curPTR = _.findWhere(PTR, { DC_ID: item.DC_ID });

        //get NUM_OF_TIERS acoording this will be the row_span for handson
        let NUM_OF_TIERS = parseInt(curPTR.NUM_OF_TIERS) ? parseInt(curPTR.NUM_OF_TIERS) :parseInt(this.curPricingTable.NUM_OF_TIERS);
        _.each(this.pricingTableTemplates.columns, (colItem, ind) => {
          if (!colItem.isDimKey && !colItem.hidden) {
            let rowIndex = _.findIndex(PTR, { DC_ID: item.DC_ID });
            mergCells.push({ row: rowIndex, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
          }
        })
      });

      return mergCells;
    }
    getMergeCellsOnDelete(){
      let PTR=this.getPTEGenerate();
      let mergCells= this.getMergeCells(PTR);
      this.hotTable.updateSettings({mergeCells:mergCells});
    }
    getMergeCellsOnEdit(empRow:number,NUM_OF_TIERS:number): void {
        let mergCells:any=null;
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
          //get NUM_OF_TIERS acoording this will be the row_span for handson
           mergCells=this.hotTable.getSettings().mergeCells;
          _.each(this.pricingTableTemplates.columns, (colItem, ind) => {
            if (!colItem.isDimKey && !colItem.hidden) {
              mergCells.push({ row: empRow, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
            }
          })
        this.hotTable.updateSettings({mergeCells:mergCells});
      
    }
    getCellComments(PTR: any): any {
      let cellComments = [];
      _.each(PTR, (item, rowInd) => {
        if (item._behaviors.validMsg) {
          _.each(item._behaviors.validMsg, (val, key) => {
            let colInd = _.findIndex(this.pricingTableTemplates.columns, { field: key });
            cellComments.push({ row: rowInd, col: colInd, comment: { value: val }, className: 'custom-border' });
            if (_.findWhere(cellComments, { row: rowInd, col: 0 }) == undefined) {
              cellComments.push({ row: rowInd, col: 0, className: 'custom-cell' });
            }
          });
        }
      });
      return cellComments;
    }
    generateHandsonTable(PTR: any) {
      let vm=this;
      //this is the code which is create columns according to Handson from API
      let nestedHeaders: [string[], string[]]= [[],[]];
      let hiddenColumns: number[] = [];
      this.columns = [];

      /* From the Pricing Table Template */
      const columnTemplates: PRC_TBL_Model_Column[] = this.pricingTableTemplates.columns;
      const columnFields: PRC_TBL_Model_Field[] = this.pricingTableTemplates.model.fields;
      const columnAttributes: PRC_TBL_Model_Attributes[] = this.pricingTableTemplates.defaultAtrbs;

      // Iterate through each column from the Pricing Table Template
      _.each(columnTemplates, (item: PRC_TBL_Model_Column, index) => {
        /* Hidden Columns */
        if (item.hidden) {
          hiddenColumns.push(index);
        }

        let currentColumnConfig = PTEUtil.generateHandsontableColumn(this.pteService, this.loggerService, this.dropdownResponses, columnFields, columnAttributes, item, index);
        //adding for cell management in cell
        this.ColumnConfig.push(currentColumnConfig);
        if (item.field == 'PTR_USER_PRD') {
          currentColumnConfig.editor = this.custProdSelEditor;
        }
        if (item.field == 'GEO') {
          currentColumnConfig.editor = this.custProdSelEditor;
        }
        this.columns.push(currentColumnConfig);
        nestedHeaders[0].push(sheetObj[index]);
        nestedHeaders[1].push(`<span style="color:blue;font-style: italic;">${ item.title }</span>`);
      });

      PTR = this.generatePTR(PTR);
      let mergCells = [];
      let cellComments = this.getCellComments(PTR);

      // This logic will add for all tier deals
      if (this.curPricingTable.OBJ_SET_TYPE_CD != 'ECAP') {
        mergCells = this.getMergeCells(PTR);
      }
      // Set the values for hotTable
      PTR = PTR.length > 0 ? PTR : Handsontable.helper.createEmptySpreadsheetData(5, this.columns.length);
      //let hotTable = this.hotRegisterer.getInstance(this.hotId);

      // Loading new data
      this.hotTable.loadData(PTR);

      // Update settings 
      this.hotTable.updateSettings({
        columns: this.columns,
        hiddenColumns: {
          columns: hiddenColumns,
          indicators: true
        },
        mergeCells: mergCells,
        cells:(row:number, col:number, prop:string)=>{
          return this.disableCells(this.hotTable,row,col,prop)
        },
        cell: cellComments,
        readOnlyCellClassName:'readonly-cell',
        nestedHeaders: nestedHeaders
      });
    }
    disableCells(hotTable:Handsontable,row:number,col:number,prop:any){
     //logic for making by defaul all the cell except PTR_USER_PRD readonly
     const cellProperties = {};
     if(hotTable.isEmptyRow(row) ){
       if(prop != 'PTR_USER_PRD'){
        cellProperties['readOnly'] = true;
       }
     }
     else {
       //column config hasr eadonly property for certain column persisting that assigning for other
        if(_.findWhere(this.ColumnConfig,{data:prop}).readOnly){
          cellProperties['readOnly'] = true;
        }
        else{
          cellProperties['readOnly'] = false;
        }
     }
     return cellProperties;
    }
    generatePTR(PTR: any) {
      return PTEUtil.pivotData(PTR, this.curPricingTable);
    }
    autoFillCol(changes: any) {
      console.log(changes);
    }
    afterCellChange(changes: Array<any>, source: any) { // Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
      if (source == 'edit' || source == 'CopyPaste.paste') {
        // Changes will track all the cells changing if we are doing copy paste of multiple cells
        _.each(changes, (item) => {
          // Refer https://handsontable.com/docs/api/hooks/#afterchange
        /*PTR_USER_PRD change starts here */
          if (item[1] == 'PTR_USER_PRD') {
            if (item[3] != null && item[3] != '') {
              this.autoFillCellOnProd(item);
            } else {
              //if no value in PTR_USER_PRD its to delete since its looping for tier logic adding in to an array and finally deleting
              this.multiRowDelete.push(item[0])
            }
          }
           /*PTR_USER_PRD change ends here */
           else if(item[1] == 'AR_SETTLEMENT_LVL'){
              this.autoFillARSet(item);
           }
        });

        if(this.multiRowDelete && this.multiRowDelete.length>0){
          this.deleteRow(this.multiRowDelete);
        }
      }
    }
    autoFillARSet(item:any){
      let colSPIdx=_.findWhere(this.hotTable.getCellMetaAtRow(item[0]),{prop:'SETTLEMENT_PARTNER'}).col;
      let selCell:CellSettings= {row:item[0],col:colSPIdx,editor:'text',className:'',comment:{value:'',readOnly:true}};
      let cells=this.hotTable.getSettings().cell;
      if(item[3] !='' && item[3].toLowerCase() !='cash'){
        this.hotTable.setDataAtRowProp(item[0],'SETTLEMENT_PARTNER', '','no-edit');
        //check object present 
        let obj=_.findWhere(cells,{row:item[0],col:colSPIdx})
        if(obj){
          obj.editor=false;
          obj.className='readonly-cell';
          obj.comment.value='Only for AR_SETTLEMENT Cash SETTLEMENT_PARTNER will be enabled';
        }
        else{
          selCell.editor=false;
          selCell.className='readonly-cell';
          selCell.comment.value='Only for AR_SETTLEMENT Cash SETTLEMENT_PARTNER will be enabled';
          cells.push(selCell);
        }
        this.hotTable.updateSettings({cell:cells});
      }
      else{
        this.hotTable.setDataAtRowProp(item[0],'SETTLEMENT_PARTNER', 'Default','no-edit');
        //check object present 
        let obj=_.findWhere(cells,{row:item[0],col:colSPIdx})
        if(obj){
          obj.editor='text';
          obj.className='';
          obj.comment.value='';
        }
        else{
          cells.push(selCell);
        }
        this.hotTable.updateSettings({cell:cells});
      }
    }
    returnEmptyRow(selRow:number):number{
      let PTRCount = this.hotTable.countRows();
      let row=0;
      for(let i=0;i<PTRCount;i++){
        //checking for the row doesnt have a DC_ID
        if(this.hotTable.getDataAtRowProp(i,'DC_ID') ==undefined || this.hotTable.getDataAtRowProp(i,'DC_ID') ==null ){
          row=i;
          break; 
        }
      }
      return row;
    }
    addUpdateRowOnchange(hotTable:Handsontable,row:number,cellItem:any,empRowVal:number,selRow:number,ROW_ID:number,tier?:number){
      let updateRows=[];
        //make the selected row PTR_USER_PRD empty if its not the empty row
        if(empRowVal !=selRow){
          hotTable.setDataAtRowProp(selRow,'PTR_USER_PRD', '','no-edit');
        }
      _.each(hotTable.getCellMetaAtRow(0),(val,key)=>{
        let currentstring='';
        if(val.prop=='PTR_USER_PRD'){
          //update PTR_USER_PRD with entered value
          currentstring =row+','+val.prop+','+cellItem[3]+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if(val.prop=='DC_ID'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
          currentstring =row+','+val.prop+','+ROW_ID+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if(val.prop=='TIER_NBR'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
          currentstring =row+','+val.prop+','+tier+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if(val.prop){
          //this will be autofill defaults value
          let cellVal=this.curPricingTable[`${val.prop}`] ? this.curPricingTable[`${val.prop}`]:'';
         currentstring =row+','+val.prop+','+cellVal+','+'no-edit';
         updateRows.push(currentstring.split(','));
        }
        else{
          console.log('invalid Prop')
        }
      });
       //appending everything togather
      hotTable.setDataAtRowProp(updateRows,'no-edit');
    }
    deleteRow(rows:Array<number>):void{
       //multiple delete at the sametime this will avoid issues of deleting one by one
      this.hotTable.alter('remove_row',rows[0],rows.length,'no-edit');
      if(this.curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
        this.getMergeCellsOnDelete();
      }
      //setting the value to empty to avoid extra delete
      this.multiRowDelete=[];
    }
    isAlreadyChange(selRow:number):boolean{
      let sel_DC_ID=this.hotTable.getDataAtRowProp(selRow,'DC_ID');
      let condition=false;
        if(sel_DC_ID){
          condition=true;
        }
        else{
          condition =false;
        }
      return condition;
    }
    autoFillCellOnProd(cellItem: any) {
      let selrow = cellItem[0];
       //check if there is already a merge avaialble
      if(!this.isAlreadyChange(selrow)){
        //identify the empty row and add it there
        let empRow=this.returnEmptyRow(selrow);
        let ROW_ID=_.random(250);
        if(this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
              //add num of tier rows the logic will be based on autofill value
              let tier=1;
              for (let i=empRow;i<parseInt(this.curPricingTable.NUM_OF_TIERS)+empRow;i++){
                this.addUpdateRowOnchange(this.hotTable,i,cellItem,empRow,selrow,ROW_ID,tier);
                tier++;
              }
              //calling the merge cells option
              this.getMergeCellsOnEdit(empRow,parseInt(this.curPricingTable.NUM_OF_TIERS));
        }
        else {
          this.addUpdateRowOnchange(this.hotTable,empRow,cellItem,empRow,selrow,ROW_ID);
        }
      }
    }
    async getAllDrowdownValues(){
    let dropObjs={};
    _.each(this.pricingTableTemplates.defaultAtrbs,(val,key)=>{
          dropObjs[`${key}`]=this.pteService.readDropdownEndpoint(val.opLookupUrl);
      });
      let result= await forkJoin(dropObjs).toPromise().catch((err) => {
        this.loggerService.error('pricingTableEditorComponent::getAllDrowdownValues::service', err);
      });
      return result;

    }
    async loadPTE() {
      this.isLoading='true';
      let PTR = await this.getPTRDetails();
      this.getTemplateDetails();
      this.dropdownResponses= await this.getAllDrowdownValues();
      this.generateHandsonTable(PTR);
      this.isLoading='false';
    }
    getPTEGenerate():Array<any>{
      let hotTable = this.hotRegisterer.getInstance(this.hotId);
      let PTRCount = hotTable.countRows();
      let PTRResult:Array<any> =[];
      for(let i=0;i<PTRCount;i++){
        let obj={};
        if(!hotTable.isEmptyRow(i)){
          _.each(hotTable.getCellMetaAtRow(i),(val)=>{
            obj[val.prop]=hotTable.getDataAtRowProp(i,val.prop.toString())?hotTable.getDataAtRowProp(i,val.prop.toString()):null;
          });
          PTRResult.push(obj);
        }
      }
      return PTRResult;
    }
    savePTE(){
     let result=this.getPTEGenerate();
      console.log(result);
    }
    ngOnChanges(): void {
      this.loadPTE();
    }
    ngAfterViewInit(){
      //loading after the View init from there onwards we can reuse the hotTable instance
      this.hotTable= this.hotRegisterer.getInstance(this.hotId);
    }
}

angular.module("app").directive(
    "pricingTableEditor",
    downgradeComponent({
        component: pricingTableEditorComponent,
    })
);

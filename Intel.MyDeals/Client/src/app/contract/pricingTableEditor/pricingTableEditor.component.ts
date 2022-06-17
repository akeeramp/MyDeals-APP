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
import { ProductSelectorComponent } from '../ptModals/productSelector/productselector.component';
import { GeoSelectorComponent } from '../ptModals/geo/geo.component';
import { marketSegComponent } from '../ptModals/marketSegment/marketSeg.component';
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
        private field:any = '';
        private source:any = '';
        constructor(hotInstance:any) {
          super(hotInstance);
        }
        prepare(row: number, col: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties): void {
          super.prepare(row, col, prop, TD, originalValue, cellProperties);
          this.selCol = col;
          this.selRow = row;
          this.field = prop;
          this.source = cellProperties.source? cellProperties.source: '';
        }
        createElements() {
          super.createElements();
          this.createCellButton();
          this.TEXTAREA.className='htCustTxt';
          this.TEXTAREA_PARENT.appendChild(this.BUTTON);
        }
        createCellButton() {
          this.BUTTON = document.createElement('button');
          this.BUTTON.id="btnCustSelctor";
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
          let modalComponent:any=null,name:string='';
          if (this.field &&  this.field== 'PTR_USER_PRD') {
            modalComponent=ProductSelectorComponent;
            name="Product Selector";
          }
          else if (this.field &&  this.field== 'GEO_COMBINED'){
            modalComponent=GeoSelectorComponent
            name="Geo Selector";
          }
          else{
            modalComponent=marketSegComponent;
            name="Market Segment Selector";
          }
          const dialogRef = dialog.open(modalComponent, {
            width: '500px',
            data: { name: name, source: this.source,selVal:selVal },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              if(this.field &&  this.field== 'PTR_USER_PRD')//here there is no handonstable source specify bcz we need to do autofill
                this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString());
              else
              this.hot.setDataAtCell(this.selRow, this.selCol, result?.toString(),'no-edit');
            }
          });
        }
      }
    }
    @Input() in_Cid: any = '';
    @Input() in_Ps_Id: any = '';
    @Input() in_Pt_Id: any = '';
    @Input() contractData: any = {};
    @Input() UItemplate: any = {};
    /*For loading variable */
    private isLoading:boolean=false;
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
    private custCellEditor: any;
    private hotId = "spreadsheet";
    // Cached Dropdown API Responses (that do not usually change)
    private dropdownResponseLocalStorageKey = 'pricingTableEditor_DropdownApiResponses';
    private dropdownResponses:any = null;

    //this will help to have a custom cell validation which allow only alphabets
    projectValidator(value, callback){
      if (/^[a-zA-Z ]{2,30}$/.test(value)) {
        callback(true);
  
      } else {
        callback(false);
      }
    }
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
    getMergeCellsOnDelete(){
      let PTR=this.getPTEGenerate();
      let mergCells= PTEUtil.getMergeCells(PTR,this.pricingTableTemplates.columns,this.curPricingTable.NUM_OF_TIERS);
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
        //adding for cell management in cell this can move to seperate function later
        this.ColumnConfig.push(currentColumnConfig);
        if (item.field == 'PTR_USER_PRD' || item.field == 'GEO_COMBINED' || item.field == 'MRKT_SEG') {
          currentColumnConfig.editor = this.custCellEditor;
        }
        if(item.field=='QLTR_PROJECT'){
          currentColumnConfig.validator=this.projectValidator;
        }
        this.columns.push(currentColumnConfig);
        nestedHeaders[0].push(sheetObj[index]);
        nestedHeaders[1].push(`<span style="color:blue;font-style: italic;">${ item.title }</span>`);
      });
     
      let mergCells = [];
      let cellComments = PTEUtil.getCellComments(PTR,this.pricingTableTemplates.columns);
      // This logic will add for all tier deals
      if (this.curPricingTable.OBJ_SET_TYPE_CD == 'VOL_TIER') {
        mergCells = PTEUtil.getMergeCells(PTR,this.pricingTableTemplates.columns,this.curPricingTable.NUM_OF_TIERS);
      }
      // Set the values for hotTable
      PTR = PTR.length > 0 ? PTR : Handsontable.helper.createEmptySpreadsheetData(5,this.columns.length);
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
     //if(hotTable.isEmptyRow(row)){ //this.hotTable.getDataAtRowProp(i,'DC_ID') ==undefined || this.hotTable.getDataAtRowProp(i,'DC_ID') ==null
     if(this.hotTable.getDataAtRowProp(row,'DC_ID') ==undefined || this.hotTable.getDataAtRowProp(row,'DC_ID') ==null || this.hotTable.getDataAtRowProp(row,'DC_ID') ==''){
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
    //functions to identify cell change
    identfyUniqChanges(changes: Array<any>, source: any): Array<any>{
      //for tier when drag/paste PTR_USER_PRD changes are based on num of tier and those many rows will come as changes but we need that as uniq change
      if(source == 'edit' || source == 'CopyPaste.paste' || source=='Autofill.fill'){
        let uniqchanges=[];
        _.each(changes, (item) => {
          if (item[1] == 'PTR_USER_PRD') {
            if (item[3] != null && item[3] != ''){
              let obj={row:item[0],prop:item[1],old:item[2],new:item[3]};
              uniqchanges.push(obj);
            }
            else {
              // in case of copy paste and Autofill the empty rows based on tier will come but that doesnt mean they are to delete
              if(source=='edit'){
                //if no value in PTR_USER_PRD its to delete since its looping for tier logic adding in to an array and finally deleting
                this.multiRowDelete.push(item[0])
              }
            } 
          }
          else{
            let obj={row:item[0],prop:item[1],old:item[2],new:item[3]};
            uniqchanges.push(obj);
          }
        });
        return uniqchanges;
      }
      else{
        return [];
      }

    }
    afterCellChange(changes: Array<any>, source: any) { // Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
      if (source == 'edit' || source == 'CopyPaste.paste' || source=='Autofill.fill') {
        // Changes will track all the cells changing if we are doing copy paste of multiple cells
        this.isLoading=true;
        this.spinnerMessageHeader='PTE Reloading';
        this.spinnerMessageDescription='PTE Reloading please wait';
        // PTE loading in handsone takes more loading time than Kendo so putting a loader
        setTimeout(()=>{  
        changes=this.identfyUniqChanges(changes,source);
        let PTR=_.where(changes,{prop:'PTR_USER_PRD'});
        let AR=_.where(changes,{prop:'AR_SETTLEMENT_LVL'});
        if(PTR && PTR.length>0){
          this.autoFillCellOnProd(PTR);
        }
        if(AR && AR.length>0){
          this.autoFillARSet(AR);
        }
        //for multi tier there can be more tiers to delete so moving the logc after all change
        if(this.multiRowDelete && this.multiRowDelete.length>0){
          this.deleteRow(this.multiRowDelete);
        }
        this.isLoading=false;
        },0);
      }
    }
    autoFillARSet(items:Array<any>){
      _.each(items,(item) =>{
        let colSPIdx=_.findWhere(this.hotTable.getCellMetaAtRow(item.row),{prop:'SETTLEMENT_PARTNER'}).col;
        let selCell:CellSettings= {row:item.row,col:colSPIdx,editor:'text',className:'',comment:{value:'',readOnly:true}};
        let cells=this.hotTable.getSettings().cell;
        if(item.new && item.new !='' && item.new.toLowerCase() !='cash'){
          this.hotTable.setDataAtRowProp(item.row,'SETTLEMENT_PARTNER', '','no-edit');
          //check object present 
          let obj=_.findWhere(cells,{row:item.row,col:colSPIdx})
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
          this.hotTable.setDataAtRowProp(item.row,'SETTLEMENT_PARTNER', this.contractData.Customer.DFLT_SETTLEMENT_PARTNER,'no-edit');
          //check object present 
          let obj=_.findWhere(cells,{row:item.row,col:colSPIdx})
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
      });
  
    }
    returnEmptyRow():number{
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
    autoFillCellOnProd(items:Array<any>) {
      let updateRows=[];
      //The effort for autofill for one change and mulitple changes are little different
      if(items && items.length==1){
        let selrow = items[0].row;
        //check if there is already a merge/change avaialble
        if(!this.isAlreadyChange(selrow)){
          //identify the empty row and add it there
          let empRow=this.returnEmptyRow();
          let ROW_ID=_.random(250); // will be replace with some other logic
          //first deleting the row this will help if the empty row and selected roe doest match
          this.hotTable.alter('remove_row',selrow,1,'no-edit');
          if(this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
                //add num of tier rows the logic will be based on autofill value
                let tier=1;
                for (let i=empRow;i<parseInt(this.curPricingTable.NUM_OF_TIERS)+empRow;i++){
                  this.addUpdateRowOnchange(this.hotTable,i,items[0],empRow,selrow,ROW_ID,updateRows,tier);
                  tier++;
                }
                //calling the merge cells option only where tier
                this.getMergeCellsOnEdit(empRow,parseInt(this.curPricingTable.NUM_OF_TIERS));
          }
          else {
            this.addUpdateRowOnchange(this.hotTable,empRow,items[0],empRow,selrow,ROW_ID,updateRows,1);
          }
        }
      }
      else{
          //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
          if(this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
            this.hotTable.alter('remove_row',items[0].row,items.length * parseInt(this.curPricingTable.NUM_OF_TIERS),'no-edit');
          }
          else{
            this.hotTable.alter('remove_row',items[0].row,items.length,'no-edit');
          }
        
        //identify the empty row and the next empty row will be the consecutive one
        let empRow=this.returnEmptyRow();
        _.each(items,(cellItem)=>{
            let selrow = cellItem.row;
            let ROW_ID=_.random(250); // will be replace with some other logic
            if(this.curPricingTable.OBJ_SET_TYPE_CD && this.curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
                  //add num of tier rows the logic will be based on autofill value
                  let tier=1;
                  for (let i=empRow;i<parseInt(this.curPricingTable.NUM_OF_TIERS)+empRow;i++){
                    this.addUpdateRowOnchange(this.hotTable,i,cellItem,empRow,selrow,ROW_ID,updateRows,tier);
                    tier++;
                  }
                  //calling the merge cells optionfor tier 
                  this.getMergeCellsOnEdit(empRow,parseInt(this.curPricingTable.NUM_OF_TIERS));
                 //the next empty row will be previus empty row + num of tiers;
                  empRow=empRow+parseInt(this.curPricingTable.NUM_OF_TIERS);
            }
            else {
              this.addUpdateRowOnchange(this.hotTable,empRow,cellItem,empRow,selrow,ROW_ID,updateRows,1);
              empRow++;
            }
       });
      }
      //appending everything togather
      this.hotTable.setDataAtRowProp(updateRows,'no-edit');
    }
    addUpdateRowOnchange(hotTable:Handsontable,row:number,cellItem:any,empRowVal:number,selRow:number,ROW_ID:number,updateRows:Array<any>,tier?:number,){
        //make the selected row PTR_USER_PRD empty if its not the empty row
      _.each(hotTable.getCellMetaAtRow(0),(val,key)=>{
        let currentstring='';
        if(val.prop=='PTR_USER_PRD'){
          //update PTR_USER_PRD with entered value
           currentstring =row+','+val.prop+','+cellItem.new+','+'no-edit';
          updateRows.push(currentstring.split(','));
          //hotTable.setDataAtRowProp(row,'PTR_USER_PRD', cellItem[3],'no-edit');
        }
        else if(val.prop=='DC_ID'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
          // currentstring =row+','+val.prop+','+ROW_ID+','+'no-edit';
          // updateRows.push(currentstring.split(','));
          hotTable.setDataAtRowProp(row,val.prop, ROW_ID,'no-edit');
        }
        else if(val.prop=='TIER_NBR'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
           currentstring =row+','+val.prop+','+tier+','+'no-edit';
           updateRows.push(currentstring.split(','));
          //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
        }
        else if(val.prop=='SETTLEMENT_PARTNER'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
           if(this.curPricingTable[`AR_SETTLEMENT_LVL`] && this.curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase()=='cash'){
            currentstring =row+','+val.prop+','+this.contractData.Customer.DFLT_SETTLEMENT_PARTNER+','+'no-edit';
           }
           else{
            currentstring =row+','+val.prop+','+' '+','+'no-edit';
           }
           updateRows.push(currentstring.split(','));
          //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
        }
        else if(val.prop){
          //this will be autofill defaults value 
          let cellVal=this.curPricingTable[`${val.prop}`] ? this.curPricingTable[`${val.prop}`]:'';
          currentstring =row+','+val.prop+','+cellVal+','+'no-edit';
          updateRows.push(currentstring.split(','));
          //hotTable.setDataAtRowProp(row,val.prop.toString(), cellVal,'no-edit');
        }
        else{
          console.log('invalid Prop')
        }
      });
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
      this.spinnerMessageHeader='PTE loading';
      this.spinnerMessageDescription='PTE loading please wait';
      this.isLoading=true;
      let PTR = await this.getPTRDetails();
      this.getTemplateDetails();
      this.dropdownResponses= await this.getAllDrowdownValues();
      //this is only while loading we need , need to modify as progress
      PTR= this.generatePTR(PTR);
      this.generateHandsonTable(PTR);
      this.isLoading=false;
    }
    getPTEGenerate():Array<any>{
      let PTRCount = this.hotTable.countRows();
      let PTRResult:Array<any> =[];
      for(let i=0;i<PTRCount;i++){
        let obj={};
        if(!this.hotTable.isEmptyRow(i)){
          _.each(this.hotTable.getCellMetaAtRow(i),(val)=>{
            if(val.prop){
              obj[val.prop]=this.hotTable.getDataAtRowProp(i,val.prop.toString()) !=null ?this.hotTable.getDataAtRowProp(i,val.prop.toString()):null;
            }
          });
          PTRResult.push(obj);
        }
      }
      return PTRResult;
    }
    undoPTE(){
      this.hotTable.undo();
    }
    redoPTE(){
      this.hotTable.redo();
    }
    savePTE(){
    this.isLoading=true;
    this.spinnerMessageHeader='PTE Validate';
    this.spinnerMessageDescription='PTE Validating please wait';
    //Handsonetable loading taking some time so putting this logic for loader
    setTimeout(()=>{     
      let PTR=this.getPTEGenerate();
      let finalPTR=PTEUtil.validatePTE(PTR,this.curPricingTable.OBJ_SET_TYPE_CD);;
      this.generateHandsonTable(finalPTR);
      this.isLoading=false;
      console.log(PTR);
    },0);
  
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

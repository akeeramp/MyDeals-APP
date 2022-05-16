import * as angular from 'angular';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import { pricingTableEditorService } from './pricingTableEditor.service'
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import * as _ from 'underscore';
import { templatesService } from '../../shared/services/templates.service';
import { ContractUtil } from '../contract.util';
import {handsoneColumn,sheetObj} from './handsontable.interface';
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { PTEUtil } from '../PTE.util';
import {MatDialog} from '@angular/material/dialog';
import { ProductSelectorComponent } from '../productSelector/productselector.component';
import { ignoreElements } from 'rxjs/operators';


/**
 * http://localhost:55490/Dashboard#/contractmanager/26006
 */

@Component({
    selector: 'pricingTableEditor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html',
    styleUrls: ['Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.css']
})
export class pricingTableEditorComponent {

    constructor(private pteService: pricingTableEditorService,
                private templateService: templatesService,
                private pricingTableSvc: pricingTableservice,
                private loggerService: logger,protected dialog: MatDialog) {
                this.custProdSelEditor= class custSelectEditor extends Handsontable.editors.TextEditor {
                    public TEXTAREA:any;
                    public BUTTON:any;
                    public buttonStyle:any;
                    public TEXTAREA_PARENT:any;
                    public textareaStyle:any
                    public textareaParentStyle:any
                    public instance:any;
                    public selectOptions:any;
                    private hotId:string = "spreadsheet";
                    private hotRegisterer = new HotTableRegisterer();
                    private selRow:number=0;
                    private selCol:number=0;

                    constructor(hotInstance:any, row:any, col: number, prop: string | number, TD: HTMLTableCellElement, cellProperties:any){
                        super(hotInstance,row,col,prop,TD,cellProperties);
                    }
                    prepare(row: number, col: number, prop: string | number, TD: HTMLTableCellElement, originalValue: any, cellProperties: Handsontable.CellProperties): void {
                      super.prepare(row, col, prop, TD, originalValue,cellProperties);
                      this.selCol=col;
                      this.selRow=row;
                    }
                    createElements(){
                        super.createElements();
                        this.TEXTAREA.style.float = 'left'; 
                        this.createProductCellButton();
                        this.TEXTAREA_PARENT.appendChild(this.BUTTON);
                    }
                
                    createProductCellButton() {
                      this.BUTTON = document.createElement('button');
                      this.BUTTON.setAttribute('style', `position: absolute; float: right; margin-left: 0%; height: ` + 25 + `px; font-size: 0.8em;`);  // Float Right and Position Absolute allow the button to be next to the Cell
                      this.buttonStyle = this.BUTTON.style;
                      this.BUTTON.className = 'btn btn-sm btn-primary py-0';
                      this.BUTTON.innerText = '🔍';
                      this.BUTTON.addEventListener('mousedown', (event:any) => {
                        event.preventDefault();
                        this.openProdPopUp();
                      });
                    }
                   
                    openProdPopUp(){
                      const hotTable:any=this.hotRegisterer.getInstance(this.hotId);
                      if(this.selCol && this.selCol==4){
                        const selVal= this.hotRegisterer.getInstance(this.hotId).getDataAtCell(this.selRow,this.selCol);
                        const dialogRef = dialog.open(ProductSelectorComponent, {
                          width: '500px',
                          data: {name: "User", animal:selVal },
                        });
                                          
                        dialogRef.afterClosed().subscribe(result => {
                          //this is to focus the cell selected
                          hotTable.selectCell(this.selRow,this.selCol);
                          if(result){
                            console.log('The dialog was closed:: result::',result);
                            hotTable.setDataAtCell(this.selRow,this.selCol,result?.animal);
                          }
                        });
                      }
                    }
                
                }

     }

    @Input() in_Cid: any='';
    @Input() in_Ps_Id: any='';
    @Input() in_Pt_Id: any='';
    @Input() contractData: any={};
    @Input() UItemplate: any={};

    private curPricingStrategy: any = {};
    private curPricingTable:any={};
    private pricingTableDet:Array<any> = [];
    private pricingTableTemplates: any = {};  // Contains templates for All Deal Types
    //to get the selected row and col for product selector
    private selRow:number=0;
    private selCol:number=0;
    // Handsontable Variables basic hottable structure
    private hotSettings: Handsontable.GridSettings ={
        minRows:250,
        maxRows:250,
        colHeaders: false,
        rowHeaders: true,
        rowHeaderWidth : 0,
        fixedColumnsLeft: 1,
        fixedRowsTop: 0,
        copyPaste:true,
        comments: true,
        height:690,
        width:1550,
        afterChange:(changes,source)=>{
          //using => operator to-call-parent-function-from-callback-function
          this.afterCellChange(changes,source);
        },
        afterRemoveCol:this.afterRemoveCol,
        licenseKey: "8cab5-12f1d-9a900-04238-a4819",
    };
    private columns: Array<handsoneColumn>=[];
    private hotRegisterer = new HotTableRegisterer();
    private hotTable:Handsontable;
    private dataset: Array<any>=[];
    private custProdSelEditor:any;
    // private columnTuples: ColumnTuple[];
    private hotId:string = "spreadsheet";


    getTemplateDetails(){
        // Get the Contract and Current Pricing Strategy Data
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        // Get template for the selected PT
        this.pricingTableTemplates = this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];

    }
    async getPTRDetails(){
        let vm= this;
        let response= await vm.pteService.readPricingTable(vm.in_Pt_Id).toPromise().catch((err)=>{ this.loggerService.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', err);});
        if(response && response.PRC_TBL_ROW && response.PRC_TBL_ROW.length>0){
          vm.pricingTableDet = response;
          return response.PRC_TBL_ROW;
        }
        else{
          return [];
        }
    }
    getMergeCells(PTR:any):any{
      let mergCells=[];
      //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
      let distDCID=_.uniq(PTR,'DC_ID');
      _.each(distDCID,(item)=>{
        let curPTR=_.findWhere(PTR,{DC_ID:item.DC_ID});
        //get NUM_OF_TIERS acoording this will be the row_span for handson
        let NUM_OF_TIERS=parseInt(curPTR.NUM_OF_TIERS);
        _.each(this.pricingTableTemplates.columns,(colItem,ind)=>{
           if(!colItem.isDimKey && !colItem.hidden){
             let rowIndex=_.findIndex(PTR,{DC_ID:item.DC_ID});
            mergCells.push({ row: rowIndex, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
           }
         })
      });
      return mergCells;
    }
    getCellComments(PTR:any):any{
      let cellComments=[];
      _.each(PTR,(item,rowInd)=>{
        if(item._behaviors.validMsg){
          _.each(item._behaviors.validMsg,(val,key)=>{
            let colInd=_.findIndex(this.pricingTableTemplates.columns,{field:key});
            cellComments.push({row:rowInd,col:colInd,comment:{value:val},className: 'custom-border'});
           if(_.findWhere(cellComments,{row:rowInd,col:0}) == undefined ){
             cellComments.push({row:rowInd,col:0,className:'custom-cell'});
           }
          });
        }
      });
      return cellComments;
    }
    generateHandsonTable(PTR:any){
      //this is the code which is create columns according to Handson from API
      let nestedHeaders=[[],[]];
      let hiddenColumns=[];
      this.columns=[];
      _.each(this.pricingTableTemplates.columns,(item,ind)=>{
        if(item.hidden){
          hiddenColumns.push(ind);
        }
        if(item.field =='PTR_USER_PRD'){
          this.columns.push({data:item.field,width:item.width,editor:this.custProdSelEditor});
        }
        else{
          this.columns.push({data:item.field,width:item.width});
        }
        nestedHeaders[0].push(sheetObj[ind]);
        nestedHeaders[1].push( `<span style="color:blue;font-style: italic;">${item.title}</span>`);
     })

     PTR= this.generatePTR(PTR);
     let mergCells=[];
     let cellComments= this.getCellComments(PTR);
     //this logic will add for all tier deals
     if(this.curPricingTable.OBJ_SET_TYPE_CD !='ECAP'){
      mergCells=this.getMergeCells(PTR);
     }
     //setting the values for hottable
     PTR=PTR.length>0?PTR:Handsontable.helper.createEmptySpreadsheetData(5,this.columns.length);
     let hotTable=this.hotRegisterer.getInstance(this.hotId);
      //loading new data
      hotTable.loadData(PTR);
      //update settings 
      hotTable.updateSettings({columns:this.columns,hiddenColumns: { columns:hiddenColumns, indicators: true },
        mergeCells:mergCells,cell:cellComments,nestedHeaders:nestedHeaders});
    
    }
    generatePTR(PTR:any){
     return PTEUtil.pivotData(PTR,this.curPricingTable);
    }
    autoFillCol(changes:any){
      console.log(changes);
    }
    afterRemoveCol(index:number, amount:number, physicalColumns:number[], source?:any){
      console.log('afterRemoveCol**************',index,amount,physicalColumns,source);
    }

    afterCellChange(changes:Array<any>,source:any){ //Fired after one or more cells has been changed. The changes are triggered in any situation when the value is entered using an editor or changed using API (e.q setDataAtCell).so we are calling only if there is a change in cell
     if(source =='edit' || source =='CopyPaste.paste'){
       //changes will track all the cells changing if we are doing copy paste of multiple cells
       _.each(changes,(item)=>{
         //Refer https://handsontable.com/docs/api/hooks/#afterchange
         if(item[1]=='PTR_USER_PRD'){
            if(item[3] !=null && item[3] !=''){
              this.autoFillCellOnProd(item,'Edit');
            }
            else{
              this.autoFillCellOnProd(item,'Del');
            }
         }
       });
     }
    }
    autoFillCellOnProd(cellItem:any,action:string){
      let hotTable=this.hotRegisterer.getInstance(this.hotId);
      let row=cellItem[0];
      if(action=='Del'){
        hotTable.alter('remove_row',row);
      }
      else{
        _.each(this.curPricingTable,(val,key)=>{
          _.each(this.columns,(col,ColInd)=>{
            if(col.data==key && col.data!='PTR_USER_PRD'){
                hotTable.setDataAtCell(row,ColInd,val);
            }
          });
        });
      }
    }
    async loadPTE(){
      let PTR = await this.getPTRDetails();
      this.getTemplateDetails();
      this.generateHandsonTable(PTR);
    }
   
    ngOnChanges(): void {
        this.loadPTE();
    }
}

angular.module("app").directive(
    "pricingTableEditor",
    downgradeComponent({
        component: pricingTableEditorComponent,
    })
);

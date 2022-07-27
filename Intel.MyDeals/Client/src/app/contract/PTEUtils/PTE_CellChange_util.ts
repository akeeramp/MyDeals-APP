/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../../shared/logger/logger';
import Handsontable from 'handsontable';
import { CellSettings } from 'handsontable/settings';
import { PTE_Common_Util } from './PTE_Common_util';

export class PTE_CellChange_Util {
    constructor(hotTable:Handsontable){
        PTE_CellChange_Util.hotTable=hotTable;
    }
    private static hotTable:Handsontable
    /* Prod selector autofill changes functions starts here */
    static returnEmptyRow():number{
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
     static isAlreadyChange(selRow:number):boolean{
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
      static addUpdateRowOnchangeCommon(row:number,val:any,updateRows:Array<any>,curPricingTable:any,contractData:any){
        //make the selected row PTR_USER_PRD empty if its not the empty row
          let currentstring='';
          if(val.prop=='SETTLEMENT_PARTNER'){
            //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
            if(curPricingTable[`AR_SETTLEMENT_LVL`] && curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase()=='cash'){
              currentstring =row+','+val.prop+','+contractData.Customer.DFLT_SETTLEMENT_PARTNER+','+'no-edit';
            }
            else{
              currentstring =row+','+val.prop+','+' '+','+'no-edit';
            }
            updateRows.push(currentstring.split(','));
            //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
          }
          else if(val.prop=='START_DT'){
            //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
            currentstring =row+','+val.prop+','+contractData.START_DT+','+'no-edit';
            updateRows.push(currentstring.split(','));
            //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
          }
          else if(val.prop=='END_DT'){
            //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
            currentstring =row+','+val.prop+','+contractData.END_DT+','+'no-edit';
            updateRows.push(currentstring.split(','));
            //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
          }
          else if(val.prop=='RESET_VOLS_ON_PERIOD'){
            //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
            currentstring =row+','+val.prop+','+'No'+','+'no-edit';
            updateRows.push(currentstring.split(','));
            //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
          }
          else if(val.prop){
            //this will be autofill defaults value 
            let cellVal=curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`]:'';
            currentstring =row+','+val.prop+','+cellVal+','+'no-edit';
            updateRows.push(currentstring.split(','));
            //hotTable.setDataAtRowProp(row,val.prop.toString(), cellVal,'no-edit');
          }
          else{
            console.log('invalid Prop')
          }
      }
      static addUpdateRowOnchange(hotTable:Handsontable,row:number,cellItem:any,empRowVal:number,selRow:number,ROW_ID:number,updateRows:Array<any>,curPricingTable:any,contractData:any,tier?:number,){
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
        else{
          this.addUpdateRowOnchangeCommon(row,val,updateRows,curPricingTable,contractData);
        }
       
      });
      }
 
    static getMergeCellsOnEdit(empRow:number,NUM_OF_TIERS:number,pricingTableTemplates:any): void {
        let mergCells:any=null;
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
          //get NUM_OF_TIERS acoording this will be the row_span for handson
           mergCells=this.hotTable.getSettings().mergeCells;
          _.each(pricingTableTemplates.columns, (colItem, ind) => {
            if (!colItem.isDimKey && !colItem.hidden) {
              mergCells.push({ row: empRow, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
            }
          })
        this.hotTable.updateSettings({mergeCells:mergCells});
      
    }
    static  addUpdateRowOnchangeKIT(hotTable:Handsontable,row:number,cellItem:any,ROW_ID:number,updateRows:Array<any>,curPricingTable:any,contractData:any,product:number,){
      //make the selected row PTR_USER_PRD empty if its not the empty row
    _.each(hotTable.getCellMetaAtRow(0),(val,key)=>{
      let currentstring='';
      if(val.prop=='PTR_USER_PRD'){
        //update PTR_USER_PRD with entered value
         currentstring =row+','+val.prop+','+cellItem.new+','+'no-edit';
        //updateRows.push(currentstring.split(','));
        //this exclussivlt because for KIT there can be product with comma seperate
        hotTable.setDataAtRowProp(row,'PTR_USER_PRD', cellItem.new,'no-edit');
      }
      else if(val.prop=='DC_ID'){
        //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
        // currentstring =row+','+val.prop+','+ROW_ID+','+'no-edit';
        // updateRows.push(currentstring.split(','));
        hotTable.setDataAtRowProp(row,val.prop, ROW_ID,'no-edit');
      }
      else if(val.prop=='PRD_BCKT'){
        //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
         currentstring =row+','+val.prop+','+product+','+'no-edit';
         updateRows.push(currentstring.split(','));
        //hotTable.setDataAtRowProp(row,val.prop, tier,'no-edit');
      }
      else{
        this.addUpdateRowOnchangeCommon(row,val,updateRows,curPricingTable,contractData);
      }
    });
    }
    static getMergeCellsOnEditKit(isExist:boolean,empRow:number,prodLen:number,pricingTableTemplates:any,itrObj?:any): any {
      let mergCells:any=null;
      if(!isExist){
         mergCells=this.hotTable.getSettings().mergeCells;
        _.each(pricingTableTemplates.columns, (colItem, ind) => {
          if (!colItem.isDimKey && !colItem.hidden) {
            mergCells.push({ row: empRow, col: ind, rowspan: prodLen, colspan: 1 });
          }
        });
        this.hotTable.updateSettings({mergeCells:mergCells});
      }
      else{
        //for existing rows its only updting the row span
         mergCells=[];
        _.each(itrObj,item=>{
          _.each(pricingTableTemplates.columns, (colItem, ind) => {
            if (!colItem.isDimKey && !colItem.hidden) {
              mergCells.push({ row: item.indx, col: ind, rowspan: item.leng, colspan: 1 });
            }
          });
        })
        this.hotTable.updateSettings({mergeCells:mergCells});
      
      }
    }
    static autoFillCellonProdKit(items:Array<any>,curPricingTable:any,contractData:any,pricingTableTemplates:any,columns:any[]){
      let updateRows=[];
      if(items && items.length==1){
        const selrow = items[0].row;
        let prods=items[0].new.split(',');
        if(!this.isAlreadyChange(selrow)){
          //identify the empty row and add it there
          let empRow=this.returnEmptyRow();
          let ROW_ID=this.rowDCID();
          this.hotTable.alter('remove_row',selrow,1,'no-edit');
          //based on the number of products listed we have to iterate the 
          let prodIndex=0;
          for (let i=empRow;i<parseInt(prods.length)+empRow;i++){
            this.addUpdateRowOnchangeKIT(this.hotTable,i,items[0],ROW_ID,updateRows,curPricingTable,contractData,prods[prodIndex]);
            prodIndex++;
          }
            //calling the merge cells option based of numb of products
            this.getMergeCellsOnEditKit(false,empRow,prods.length,pricingTableTemplates);
        }
        else{
          //get the DC_ID of selected row
          let ROW_ID=this.hotTable.getDataAtRowProp(selrow,'DC_ID');
          //the row can be insert or delete to get that we are removing and adding the rows
          this.hotTable.alter('remove_row',selrow, items[0].old.split(',').length,'no-edit');
          this.hotTable.alter('insert_row',selrow, items[0].new.split(',').length,'no-edit');
          let prodIndex=0;
          for (let i=selrow;i<parseInt(prods.length)+selrow;i++){
            this.addUpdateRowOnchangeKIT(this.hotTable,i,items[0],ROW_ID,updateRows,curPricingTable,contractData,prods[prodIndex]);
            prodIndex++;
          }
          let PTR=PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
          let DCIDS=_.pluck(PTR,'DC_ID');
          let countOfDCID=_.countBy(_.pluck(PTR,'DC_ID'))
          let iterObj=[];
          //calling the merge cells options numb of products ans setting mergcells to null first since we are doing all togather
          _.each(_.uniq(DCIDS),DCID=>{
            iterObj.push({DCID:DCID,leng:countOfDCID[`${DCID}`],indx:_.indexOf(DCIDS,DCID)})
          });
          this.getMergeCellsOnEditKit(true,1,1,pricingTableTemplates,iterObj);
        }
      }
      //appending everything togather
      this.hotTable.setDataAtRowProp(updateRows,'no-edit');
    }
    static autoFillCellonProdVol(items:Array<any>,curPricingTable:any,contractData:any,pricingTableTemplates:any){
      let updateRows=[];
      //the numbe of tiers has to take from autofill for now taken from PT
      let NUM_OF_TIERS=curPricingTable.NUM_OF_TIERS;
      //The effort for autofill for one change and mulitple changes are little different
      if(items && items.length==1){
        let selrow = items[0].row;
        //check if there is already a merge/change avaialble
        if(!this.isAlreadyChange(selrow)){
          //identify the empty row and add it there
          let empRow=this.returnEmptyRow();
          let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
          //first deleting the row this will help if the empty row and selected row doest match
          this.hotTable.alter('remove_row',selrow,1,'no-edit');
          //add num of tier rows the logic will be based on autofill value
          let tier=1;
          for (let i=empRow;i<parseInt(NUM_OF_TIERS)+empRow;i++){
            this.addUpdateRowOnchange(this.hotTable,i,items[0],empRow,selrow,ROW_ID,updateRows,curPricingTable,contractData,tier);
            tier++;
          }
          //calling the merge cells option only where tier
          this.getMergeCellsOnEdit(empRow,parseInt(curPricingTable.NUM_OF_TIERS),pricingTableTemplates);
         
        }
      }
      else{
          //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
          this.hotTable.alter('remove_row',items[0].row,items.length * parseInt(curPricingTable.NUM_OF_TIERS),'no-edit');
        //identify the empty row and the next empty row will be the consecutive one
        let empRow=this.returnEmptyRow();
        _.each(items,(cellItem)=>{
            let selrow = cellItem.row;
            let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
            //add num of tier rows the logic will be based on autofill value
            let tier=1;
            for (let i=empRow;i<parseInt(curPricingTable.NUM_OF_TIERS)+empRow;i++){
              this.addUpdateRowOnchange(this.hotTable,i,cellItem,empRow,selrow,ROW_ID,updateRows,curPricingTable,contractData,tier);
              tier++;
            }
            //calling the merge cells optionfor tier 
            this.getMergeCellsOnEdit(empRow,parseInt(curPricingTable.NUM_OF_TIERS),pricingTableTemplates);
            //the next empty row will be previus empty row + num of tiers;
            empRow=empRow+parseInt(curPricingTable.NUM_OF_TIERS);
            
        });
      }
       //appending everything togather
      this.hotTable.setDataAtRowProp(updateRows,'no-edit');
    }
    static autoFillCellOnProd(items:Array<any>,curPricingTable:any,contractData:any,pricingTableTemplates:any,columns:any[]) {
     
      let OBJ_SET_TYPE_CD=curPricingTable.OBJ_SET_TYPE_CD;
      if(OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD=='KIT'){
        this.autoFillCellonProdKit(items,curPricingTable,contractData,pricingTableTemplates,columns);
      }
      else if(OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD=='VOL_TIER'){ 
        this.autoFillCellonProdVol(items,curPricingTable,contractData,pricingTableTemplates);
      }
      else{
        let updateRows=[];
        //the numbe of tiers has to take from autofill for now taken from PT
        let NUM_OF_TIERS=curPricingTable.NUM_OF_TIERS;
        //The effort for autofill for one change and mulitple changes are little different
        if(items && items.length==1){
          let selrow = items[0].row;
          //check if there is already a merge/change avaialble
          if(!this.isAlreadyChange(selrow)){
            //identify the empty row and add it there
            let empRow=this.returnEmptyRow();
            let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
            //first deleting the row this will help if the empty row and selected row doest match
            this.hotTable.alter('remove_row',selrow,1,'no-edit');
            this.addUpdateRowOnchange(this.hotTable,empRow,items[0],empRow,selrow,ROW_ID,updateRows,curPricingTable,contractData,1);
          }
        }
        else{
            //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
            if(curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER'){
              this.hotTable.alter('remove_row',items[0].row,items.length * parseInt(curPricingTable.NUM_OF_TIERS),'no-edit');
            }
            else{
              this.hotTable.alter('remove_row',items[0].row,items.length,'no-edit');
            }
          
          //identify the empty row and the next empty row will be the consecutive one
          let empRow=this.returnEmptyRow();
          _.each(items,(cellItem)=>{
              let selrow = cellItem.row;
              let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
              this.addUpdateRowOnchange(this.hotTable,empRow,cellItem,empRow,selrow,ROW_ID,updateRows,curPricingTable,contractData,1);
              empRow++;
          });
        }
         //appending everything togather
        this.hotTable.setDataAtRowProp(updateRows,'no-edit');
      }
     }
   /* Prod selector autofill changes functions ends here */

   /* AR settlement change where functions starts here */
    static autoFillARSet(items:Array<any>,contractData:any){
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
            this.hotTable.setDataAtRowProp(item.row,'SETTLEMENT_PARTNER', contractData.Customer.DFLT_SETTLEMENT_PARTNER,'no-edit');
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
    /* AR settlement change ends here */
    static rowDCID():number {
      let ROWID=-100;
      let PTRCount = this.hotTable.countRows();
      if(PTRCount>0){
        let distDCIDs=[];
        for (let i = 0; i < PTRCount; i++) {
          if (!this.hotTable.isEmptyRow(i)) {
              //the PTR must generate based on the columns we have there are certain hidden columns which can also has some values
              distDCIDs.push(this.hotTable.getDataAtRowProp(i, 'DC_ID'));
          }
          else{
            //this means after empty row nothing to be added
              break;
          }
        }
        //the sort by resulting is coming is the ascending order so negative will be first
        let rowId=_.first(_.sortBy(distDCIDs));
        //the result can have both existing and empty result so considering both
        if(rowId<0){
          return rowId - 1;
        }
        else{
          return ROWID;
        }
        
      }
      else{
        return ROWID;
      }
    }
}
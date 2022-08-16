/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../../shared/logger/logger';
import Handsontable from 'handsontable';
import { CellSettings } from 'handsontable/settings';
import { PTE_Common_Util } from './PTE_Common_util';
import { PTE_Load_Util } from './PTE_Load_util';

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
  
      static addUpdateRowOnchange(hotTable:Handsontable,row:number,cellItem:any,ROW_ID:number,updateRows:Array<any>,curPricingTable:any,contractData:any,numoftier:number,tier?:number,){
        //make the selected row PTR_USER_PRD empty if its not the empty row
      _.each(hotTable.getCellMetaAtRow(0),(val,key)=>{
        let currentstring='';
        if(val.prop=='PTR_USER_PRD'){
          //update PTR_USER_PRD with entered value
         //  currentstring =row+','+val.prop+','+cellItem.new+','+'no-edit';
         // updateRows.push(currentstring.split(','));
         //this exclussivlt because for  products can be with comma seperate values
          hotTable.setDataAtRowProp(row,'PTR_USER_PRD', cellItem.new,'no-edit');
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
        else if(val.prop=='STRT_VOL'){
          if(tier==1){
            currentstring =row+','+val.prop+','+1+','+'no-edit';
            updateRows.push(currentstring.split(','));
          }
          else{
            currentstring =row+','+val.prop+','+0+','+'no-edit';
            updateRows.push(currentstring.split(','));
          }
        }
        else if(val.prop=='END_VOL'){
          if(tier==numoftier){
            currentstring =row+','+val.prop+','+'Unlimited'+','+'no-edit';
            updateRows.push(currentstring.split(','));
          }
          else{
            currentstring =row+','+val.prop+','+0+','+'no-edit';
            updateRows.push(currentstring.split(','));
          }
        }
        else if(val.prop=='RATE'){
           currentstring =row+','+val.prop+','+0+','+'no-edit';
           updateRows.push(currentstring.split(','));
        }
        else{
          this.addUpdateRowOnchangeCommon(row,val,updateRows,curPricingTable,contractData);
        }
       
      });
      }
      static addUpdateRowOnchangeCommon(row:number,val:any,updateRows:Array<any>,curPricingTable:any,contractData:any,rowData?:any){
        //make the selected row PTR_USER_PRD empty if its not the empty row
          let currentstring='';
          //rowdata scenario is for KIT and except kit rebate we can assign all other values
          if(rowData){
            currentstring =row+','+val.prop+','+rowData[`${val.prop}`]+','+'no-edit';
            updateRows.push(currentstring.split(','));
          }
          else{
            if(val.prop=='SETTLEMENT_PARTNER'){
              //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
                if ((curPricingTable[`AR_SETTLEMENT_LVL`] && curPricingTable[`AR_SETTLEMENT_LVL`].toLowerCase() == 'cash')
                    || (contractData.IS_TENDER == "1" && contractData.Customer.DFLT_TNDR_AR_SETL_LVL.toLowerCase() == 'cash')) {
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
                if (val.prop == 'AR_SETTLEMENT_LVL' && contractData.IS_TENDER == "1") {
                    currentstring = row + ',' + val.prop + ',' + contractData.Customer.DFLT_TNDR_AR_SETL_LVL + ',' + 'no-edit';
                    updateRows.push(currentstring.split(','));
                } else {
                    let cellVal = curPricingTable[`${val.prop}`] ? curPricingTable[`${val.prop}`] : '';
                    currentstring = row + ',' + val.prop + ',' + cellVal + ',' + 'no-edit';
                    updateRows.push(currentstring.split(','));
                }
              //hotTable.setDataAtRowProp(row,val.prop.toString(), cellVal,'no-edit');
            }
            else{
              console.log('invalid Prop')
            }
          }
         
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
    static  addUpdateRowOnchangeKIT(hotTable:Handsontable,row:number,cellItem:any,ROW_ID:number,updateRows:Array<any>,curPricingTable:any,contractData:any,product:number,rowData?:any){
      //make the selected row PTR_USER_PRD empty if its not the empty row
      _.each(hotTable.getCellMetaAtRow(0),(val,key)=>{
        let currentstring='';
        //this will makesure to hit translate API
        if(val.prop=='PTR_SYS_PRD'){
          hotTable.setDataAtRowProp(row,'PTR_SYS_PRD','','no-edit');
        }
        else if(val.prop=='PTR_USER_PRD'){
          hotTable.setDataAtRowProp(row,'PTR_USER_PRD', cellItem.new,'no-edit');
        }
        else if(val.prop=='DC_ID'){
          hotTable.setDataAtRowProp(row,val.prop, ROW_ID,'no-edit');
        }
        else if(val.prop=='PRD_BCKT'){
          currentstring =row+','+val.prop+','+product+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if(val.prop=='PRD_BCKT'){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
          currentstring =row+','+val.prop+','+product+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if(val.prop=='QTY' && rowData ==null){
          //update PTR_USER_PRD with random value if we use row index values while adding after dlete can give duplicate index
          currentstring =row+','+val.prop+','+'1'+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else if((val.prop=='ECAP_PRICE' || val.prop=='ECAP_PRICE_____20_____1' || val.prop=='TEMP_KIT_REBATE' || val.prop=='DSCNT_PER_LN' || val.prop=='TEMP_TOTAL_DSCNT_PER_LN') && rowData ==null){
          currentstring =row+','+val.prop+','+'0'+','+'no-edit';
          updateRows.push(currentstring.split(','));
        }
        else{
          this.addUpdateRowOnchangeCommon(row,val,updateRows,curPricingTable,contractData,rowData);
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
          let DataOfRow=_.filter(PTE_Common_Util.getPTEGenerate(columns,curPricingTable),itm=>{return itm.DC_ID==ROW_ID});
           //logic to calculate rebate price on product change in KIT and assign to DataROw so that it will assign in addUpdateRowOnchangeKIT
          DataOfRow[0]['TEMP_KIT_REBATE']=this.kitEcapChangeOnProd(items[0],DataOfRow.slice(0,items[0].new.split(',').length));
          this.hotTable.alter('remove_row',selrow, items[0].old.split(',').length,'no-edit');
          this.hotTable.alter('insert_row',selrow, items[0].new.split(',').length,'no-edit');
          let prodIndex=0;
          for (let i=selrow;i<parseInt(prods.length)+selrow;i++){
            this.addUpdateRowOnchangeKIT(this.hotTable,i,items[0],ROW_ID,updateRows,curPricingTable,contractData,prods[prodIndex],DataOfRow[prodIndex]);
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
      //in case of copy paste or autofill
      else{
         //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds since its prod the length can be predicted so deleting full
         this.hotTable.alter('remove_row',items[0].row,150,'no-edit');
         //identify the empty row and the next empty row will be the consecutive one
         let empRow=this.returnEmptyRow();
         _.each(items,(cellItem)=>{
             let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
             //add num of tier rows the logic will be based on autofill value
             let prods=cellItem.new.split(','),prodIndex=0;
             for (let i=empRow;i<parseInt(prods.length)+empRow;i++){
              this.addUpdateRowOnchangeKIT(this.hotTable,i,cellItem,ROW_ID,updateRows,curPricingTable,contractData,prods[prodIndex]);
              prodIndex++;
             }
             //calling the merge cells optionfor tier 
             this.getMergeCellsOnEdit(empRow,parseInt(prods.length),pricingTableTemplates);
             //the next empty row will be previus empty row + num of tiers;
             empRow=empRow+parseInt(prods.length);
         });
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
            this.addUpdateRowOnchange(this.hotTable,i,items[0],ROW_ID,updateRows,curPricingTable,contractData,NUM_OF_TIERS,tier);
            tier++;
          }
          //calling the merge cells option only where tier
          this.getMergeCellsOnEdit(empRow,parseInt(curPricingTable.NUM_OF_TIERS),pricingTableTemplates);
        }
        else{
          //This will make sure to hit translate API
          this.hotTable.setDataAtRowProp(selrow,'PTR_SYS_PRD', '','no-edit');
        }
      }
      else{
          //for length greater than 1 it will eithr copy or autofill so first cleaning those recorsds
          this.hotTable.alter('remove_row',items[0].row,items.length * parseInt(curPricingTable.NUM_OF_TIERS),'no-edit');
        //identify the empty row and the next empty row will be the consecutive one
        let empRow=this.returnEmptyRow();
        _.each(items,(cellItem)=>{
            let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
            //add num of tier rows the logic will be based on autofill value
            let tier=1;
            for (let i=empRow;i<parseInt(curPricingTable.NUM_OF_TIERS)+empRow;i++){
              this.addUpdateRowOnchange(this.hotTable,i,cellItem,ROW_ID,updateRows,curPricingTable,contractData,NUM_OF_TIERS,tier);
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
            this.addUpdateRowOnchange(this.hotTable,empRow,items[0],ROW_ID,updateRows,curPricingTable,contractData,0,1);
          }
          else{
            //This will make sure to hit translate API
            this.hotTable.setDataAtRowProp(selrow,'PTR_SYS_PRD', '','no-edit');
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
              let ROW_ID=this.rowDCID();//_.random(250); // will be replace with some other logic
              this.addUpdateRowOnchange(this.hotTable,empRow,cellItem,ROW_ID,updateRows,curPricingTable,contractData,0,1);
              empRow++;
          });
        }
         //appending everything togather
        this.hotTable.setDataAtRowProp(updateRows,'no-edit');
      }
     }
   /* Prod selector autofill changes functions ends here */
   static kitEcapChangeOnProd(item:any,PTR:any[]):number {
        let DCID=this.hotTable.getDataAtRowProp(item.row,'DC_ID');
        let numOfTiers= _.where(PTR,{DC_ID:DCID}).length;
        let firstTierRowInd=_.findIndex(PTR,x=>{return x.DC_ID==DCID})
        let val=PTE_Load_Util.calculateKitRebate(PTR,firstTierRowInd,numOfTiers,false)
        return val
   }
   static kitEcapPriceChange(items:Array<any>,columns:any[],curPricingTable:any) {
    let OBJ_SET_TYPE_CD=curPricingTable.OBJ_SET_TYPE_CD;
    if(OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD=='KIT'){
      let PTR =PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
      _.each(items,item=>{
        let DCID=this.hotTable.getDataAtRowProp(item.row,'DC_ID');
        let numOfTiers= _.where(PTR,{DC_ID:DCID}).length;
        let firstTierRowInd=_.findIndex(PTR,x=>{return x.DC_ID==DCID})
        let val=PTE_Load_Util.calculateKitRebate(PTR,firstTierRowInd,numOfTiers,false)
        this.hotTable.setDataAtRowProp(firstTierRowInd,'TEMP_KIT_REBATE',val,'no-edit');
      });
    }
   }
   static kitDSCNTChange(items:Array<any>,columns:any[],curPricingTable:any) {
    let OBJ_SET_TYPE_CD=curPricingTable.OBJ_SET_TYPE_CD;
    if(OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD=='KIT'){
      _.each(items,item=>{
        let val=PTE_Load_Util.calculateTotalDsctPerLine(this.hotTable.getDataAtRowProp(item.row,'DSCNT_PER_LN'),this.hotTable.getDataAtRowProp(item.row,'QTY'))
        this.hotTable.setDataAtRowProp(item.row,'TEMP_TOTAL_DSCNT_PER_LN',val,'no-edit');
        if(item.prop && item.prop=='QTY'){
          this.kitEcapPriceChange([item],columns,curPricingTable);
        }
      })
    }
   }
   static endVolChange(items:Array<any>,columns:any[],curPricingTable:any) {
    let OBJ_SET_TYPE_CD=curPricingTable.OBJ_SET_TYPE_CD;
    if(OBJ_SET_TYPE_CD && OBJ_SET_TYPE_CD=='VOL_TIER'){
      let PTR =PTE_Common_Util.getPTEGenerate(columns,curPricingTable);
      _.each(items,item=>{
        let DCID=this.hotTable.getDataAtRowProp(item.row,'DC_ID');
        let Tier=this.hotTable.getDataAtRowProp(item.row,'TIER_NBR');
        let numOfTiers= _.where(PTR,{DC_ID:DCID}).length;
        //only in this case we need to update the start vol
        if(Tier !=numOfTiers){
          this.hotTable.setDataAtRowProp(item.row+1,'STRT_VOL',parseInt(item.new)+1,'no-edit');
        }
      })
    }
   }
   /* AR settlement change where functions starts here */
    static autoFillARSet(items:Array<any>,contractData:any){
        _.each(items,(item) =>{
        let colSPIdx=_.findWhere(this.hotTable.getCellMetaAtRow(item.row),{prop:'SETTLEMENT_PARTNER'}).col;
        let selCell:CellSettings= {row:item.row,col:colSPIdx,editor:'dropdown',className:'',comment:{value:'',readOnly:true}};
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
            obj.editor='dropdown';
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
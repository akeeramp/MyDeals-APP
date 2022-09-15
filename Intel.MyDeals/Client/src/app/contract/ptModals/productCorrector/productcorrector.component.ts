import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { logger } from "../../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import * as _ from "underscore";
import { ProductSelectorComponent } from "../productSelector/productselector.component";
import { MatDialog } from '@angular/material/dialog';
import { SelectableSettings } from '@progress/kendo-angular-treeview';


@Component({
  selector: "product-corrector",
  templateUrl: "Client/src/app/contract/ptModals/productCorrector/productcorrector.component.html",
  styleUrls:['Client/src/app/contract/ptModals/productCorrector/productcorrector.component.css']
})

export class ProductCorrectorComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductCorrectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    private loggerSvc: logger,
    private dialog:MatDialog
  ) { }
  private ProductCorrectorData:any=null;
  private contractData:any=null;
  private curPricingTable:any=null;
  private selRows:any=null;
  private isLoading:boolean = false;
  private type = "numeric";
  private info = true;
  private gridResult:any[] =[];
  private gridData: any[]=[];
  private selGridResult:any[] =[];
  private selGridData:GridDataResult=null;
  private color: ThemePalette = 'primary';
  private state: State = {
      skip: 0,
      take: 25,
      group: [{ field: "USR_INPUT" }],
      // Initial filter descriptor
      filter: {
          logic: "or",
          filters: [],
      },
  };
  private pageSizes: PageSizeItem[] = [
      {
          text: "10",
          value: 10
      },
      {
          text: "25",
          value: 25
      },
      {
          text: "50",
          value: 50
      },
      {
          text: "100",
          value: 100
      }
  ];
  private rowDCId:string='';
  private curRowIndx:number=0;
  private numIssueRows:number=0;
  private totRows:number=0;
  private curRowIssues:any[]=[];
  private curRowLvl:any[]=[];
  private curRowCategories:any[]=[];
  private selRowLvl:any[]=[];
  private selRowCategories:any[]=[];
  private selRowIssues:any[]=[];
  private curProd:string='';
  private selectedProducts:any[]=[];
  private curSelProducts:any[]=[];
  private selection: SelectableSettings = { mode: "multiple" };
  private selPrdLvlKeys:any[]=[];
  private selPrdVerKeys:any[]=[];

  prdLvlDecoder(indx:any) {
    if (indx === 7003) return "Product Vertical";
    if (indx === 7004) return "Brand";
    if (indx === 7005) return "Family";
    if (indx === 7006) return "Processor #";
    if (indx === 7007) return "L4";
    if (indx === 7008) return "Material Id";
    return indx;
  }
  loadGrid(){
    if(this.ProductCorrectorData.DuplicateProducts)
    _.each(this.ProductCorrectorData.DuplicateProducts,(val,key)=>{
      this.curRowIssues.push({DCID:parseInt(key),name:_.keys(val).toString(),len:_.flatten(_.values(val)).length});
      this.curRowLvl.push({DCID:parseInt(key),name:_.keys(val).toString(),items:_.uniq(_.pluck(_.flatten(_.values(val)),'PRD_ATRB_SID'))});
      this.curRowCategories.push({DCID:parseInt(key),name:_.keys(val).toString(),items:_.uniq(_.pluck(_.flatten(_.values(val)),'PRD_CAT_NM'))});
      this.gridResult.push({DCID:parseInt(key),name:_.keys(val).toString(),data:_.flatten(_.values(val))});
      this.gridData.push({DCID:parseInt(key),name:_.keys(val).toString(),data:process(_.flatten(_.values(val)), this.state)});
      this.selectedProducts.push({DCID:parseInt(key),name:_.keys(val).toString(),items:[],indx:_.findWhere(this.selRows,{DC_ID:parseInt(key)}).indx});
    });
    //sorting the data based on DCID, since its negative we need to reverse
    this.selectedProducts=_.sortBy(this.selectedProducts,'DCID').reverse();
    this.curRowIssues=_.sortBy(this.curRowIssues,'DCID').reverse();
    this.curRowLvl=_.sortBy(this.curRowLvl,'DCID').reverse();
    this.curRowCategories=_.sortBy(this.curRowCategories,'DCID').reverse();
    this.gridResult=_.sortBy(this.gridResult,'DCID').reverse();
    this.gridData=_.sortBy(this.gridData,'DCID').reverse();
    //default selecting to first row
    this.curSelProducts=this.selectedProducts[0];
    this.curProd=this.curRowIssues[0].name;
    this.rowDCId=this.curRowIssues[0].DCID;
    this.numIssueRows=this.curRowIssues.length;
    this.selGridResult=this.gridResult[0].data;
    this.selGridData=this.gridData[0].data;
    this.selRowLvl=this.getSelRowTree(this.curRowLvl[0].items);
    this.selRowCategories=this.getSelRowTree(this.curRowCategories[0].items);
    this.selRowIssues=[this.curRowIssues[0]];
    this.totRows=_.keys(this.ProductCorrectorData.ProdctTransformResults).length;
  }
  getSelRowTree(items:any[]){
    let curLvl=[];
    _.each(items,(val,key)=>{
      curLvl.push({
        id:key,
        name:this.prdLvlDecoder(val),
        value:val,
        selected:false
      })
    })
    return curLvl;
  }
  selectRow(DCID:string){
    //clearing the gid and prod filter incase if we searched any
    this.state.filter.filters=[];
    this.selPrdLvlKeys=[];
    this.selPrdVerKeys=[];

    let selItem=_.findWhere(this.curRowIssues,{DCID:DCID});
    this.curProd=selItem.name;
    this.selRowIssues=[selItem];
    this.rowDCId=selItem.DCID;
    this.selGridResult=_.findWhere(this.gridResult,{DCID:DCID}).data;
    this.selGridData=_.findWhere(this.gridData,{DCID:DCID}).data;
    this.selRowLvl=this.getSelRowTree(_.findWhere(this.curRowLvl,{DCID:DCID}).items);
    this.selRowCategories=this.getSelRowTree(_.findWhere(this.curRowCategories,{DCID:DCID}).items);
    this.curSelProducts=_.findWhere(this.selectedProducts,{DCID:DCID});
  }
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.selGridData = process(this.selGridResult, this.state);
  }
  //ignore openProdSel functiion will revist later
  openProdSel(key:string){
    this.dialogRef.close();
    let data={ name: 'Product Selector', source: '', selVal: key,contractData:this.contractData,curPricingTable:this.curPricingTable,curRow:[_.findWhere(this.selRows,{name:key}).row]};
    const dialogRefe = this.dialog.open(ProductSelectorComponent, {
      height: "80vh",
      width: "5500px",
      data: data,
      panelClass: 'product-selector-dialog'
    })
    dialogRefe.afterClosed().subscribe(result => {
        if (result) {
           console.log(result);
        }
    });
  }
  nextRow() {
    this.curRowIndx = this.curRowIndx + 1;
    this.selectRow(this.curRowIssues[this.curRowIndx ].DCID);
  }
  prevRow() {
     this.curRowIndx = this.curRowIndx - 1;
     this.selectRow(this.curRowIssues[this.curRowIndx].DCID);
  }
  prodSelect(item:any,evt:any){
    item['IS_SEL']=evt.target.checked;
    if(evt.target.checked){
      let prd={prod:item.HIER_VAL_NM,prodObj:item};
      this.curSelProducts['items'].push(prd);
    }
    else{
      let idx=_.findIndex( this.selectedProducts, item.HIER_VAL_NM);
      this.curSelProducts['items'].splice(idx,1);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.dialogRef.close(this.selectedProducts);
  }
  onPrdChange(evt:any,field:string){
    this.state.filter.filters=[];
    if(evt && evt.length && evt.length >0 && field){
      _.each(evt,itm=>{
        this.state.filter.filters.push({
          field: field,
          operator: 'eq',
          value: itm
        })
      });
    }
    this.selGridData = process(this.selGridResult, this.state);
  }
  ngOnInit() {
    this.ProductCorrectorData=this.data.ProductCorrectorData;
    this.contractData=this.data.contractData;
    this.curPricingTable=this.data.curPricingTable;
    this.selRows=this.data.selRows;
    this.selectedProducts=[];
    this.curSelProducts=null;
    this.loadGrid()
  }
}
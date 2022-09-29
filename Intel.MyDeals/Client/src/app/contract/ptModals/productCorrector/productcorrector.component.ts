import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { logger } from "../../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import * as _ from "underscore";
import * as lodash from "lodash";
import { ProductSelectorComponent } from "../productSelector/productselector.component";
import { MatDialog } from '@angular/material/dialog';
import { SelectableSettings } from '@progress/kendo-angular-treeview';
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { ProdSel_Util } from '../productSelector/prodSel_Util'
import { PTE_Common_Util } from "../../PTEUtils/PTE_Common_util";
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
    private dialog:MatDialog,
    popoverConfig: NgbPopoverConfig) {
        popoverConfig.placement = 'auto';
        popoverConfig.container = 'body';
        popoverConfig.autoClose = 'outside';
        popoverConfig.animation = false;    // Fixes issue with `.fade` css element setting improper opacity making the popover not show up
      // popoverConfig.triggers = 'mouseenter:mouseenter';   // Disabled to use default click behaviour to prevent multiple popover windows from appearing
  }
  private pricingTableRow: any = {};
  private ProductCorrectorData:any=null;
  private contractData:any=null;
  private curPricingTable:any=null;
  private selRows:any=null;
  private isLoading:boolean = false;
  private type = "numeric";
  private info = true;
  private gridResult:any[] =[];
  private gridData: any[] = [];
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
  private curProd:string='';
  private selectedProducts:any[]=[];
  private curSelProducts:any[]=[];
  private selection: SelectableSettings = { mode: "multiple" };
  private selPrdLvlKeys:any[]=[];
  private selPrdVerKeys: any[] = [];
  private selRowIssues: any[] = [];
  private selRowIssuesKeys: any[] = [];
  private userEnteredProduct: any[] = [];
  private currentPTERow: any[] = [];
  private isGA = false;//window.usrRole == "GA"; Commeneted this stop showing L1/L2 columns till legal approves
  private DEAL_TYPE;
  private isDuplicate = false;
  private duplicateMsg = "";
  private duplicateData: any[] = [];
  private hidden = {};
  private crossVertical = {
    'productCombination1': ["DT", "Mb", "SvrWS", "EIA CPU"],
    'productCombination2': ["CS", "EIA CS"],
    'message': "The product combination is not valid. You can combine (DT, Mb, SvrWS, EIA CPU) or (CS, EIA CS) verticals. For NON IA, you can combine as many products within same verticals for PROGRAM, VOLTIER and REV TIER deals."
  }

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
      this.curRowIssues.push({ DCID: parseInt(key), name: _.keys(val).toString(), len: _.flatten(_.values(val)).length, items: _.uniq(_.pluck(_.flatten(_.values(val)), 'USR_INPUT'))});
      this.curRowLvl.push({DCID:parseInt(key),name:_.keys(val).toString(),items:_.uniq(_.pluck(_.flatten(_.values(val)),'PRD_ATRB_SID'))});
      this.curRowCategories.push({DCID:parseInt(key),name:_.keys(val).toString(),items:_.uniq(_.pluck(_.flatten(_.values(val)),'PRD_CAT_NM'))});
      this.gridResult.push({DCID:parseInt(key),name:_.keys(val).toString(),data:_.flatten(_.values(val))});
      this.gridData.push({DCID:parseInt(key),name:_.keys(val).toString(),data:process(_.flatten(_.values(val)), this.state)});
      this.selectedProducts.push({ DCID: parseInt(key), name: _.keys(val).toString(), items: [], indx: _.findWhere(this.selRows, { name: _.keys(val).toString(), DC_ID: parseInt(key) }).indx });
    _.each(val, (arr, product) => {
        this.userEnteredProduct.push({ name: product, length: arr.length, DCID: arr[0].ROW_NM });
    });      
    });
    //sorting the data based on DCID, since its negative we need to reverse
    this.selectedProducts = _.sortBy(this.selectedProducts, 'DCID').reverse();
    this.curRowIssues = _.sortBy(this.curRowIssues, 'DCID').reverse();
    this.curRowLvl = _.sortBy(this.curRowLvl, 'DCID').reverse();
    this.curRowCategories = _.sortBy(this.curRowCategories, 'DCID').reverse();
    this.gridResult = _.sortBy(this.gridResult, 'DCID').reverse();
    this.gridData = _.sortBy(this.gridData, 'DCID').reverse();
    //this.userEnteredProduct = _.sortBy(this.userEnteredProduct, 'DCID').reverse();
    //default selecting to first row
    this.curSelProducts=this.selectedProducts[0];
    this.curProd=this.curRowIssues[0].name;
    this.rowDCId=this.curRowIssues[0].DCID;
    this.numIssueRows=this.curRowIssues.length;
    this.selGridResult=this.gridResult[0].data;
    this.selGridData=this.gridData[0].data;
    this.selRowLvl=this.getSelRowTree(this.curRowLvl[0].items);
    this.selRowCategories=this.getSelRowTree(this.curRowCategories[0].items);
    //this.selRowIssues=[this.curRowIssues[0]];
      this.selRowIssues = this.getselRowIssues(this.curRowIssues[0].items);
      for (let i = 0; i < this.selRowIssues.length; i++) {
          for (let j = 0; j < this.userEnteredProduct.length; j++) {
              if (this.userEnteredProduct[j].name == this.selRowIssues[i].name) {
                  this.selRowIssues[i].len = this.userEnteredProduct[j].length;
                  this.selRowIssues[i].name = this.selRowIssues[i].name;
              }
          }
      }
    this.totRows=_.keys(this.ProductCorrectorData.ProdctTransformResults).length;
    this.showColumns();
    this.getcurPTERowData();
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
    getselRowIssues(items: any[]) {
        let curIssue = [];
        _.each(items, (val, key) => {
            curIssue.push({
                id: key,
                name: val,
                value: val,
                selected: false,
            })
        })
        return curIssue;
    }

  selectRow(key:string,DCID){
    //clearing the gid and prod filter incase if we searched any
    this.state.filter.filters=[];
    this.selPrdLvlKeys=[];
    this.selPrdVerKeys = [];
    this.selRowIssuesKeys = [];    
    this.curRowIndx = _.findIndex(this.curRowIssues, { name: key, DCID:DCID });
    let selItem = _.findWhere(this.curRowIssues, { name: key, DCID: DCID});
    this.curProd=selItem.name;
    //this.selRowIssues=[selItem];
    this.rowDCId=selItem.DCID; 
    this.selRowIssues = this.getselRowIssues(_.findWhere(this.curRowIssues, { name: key, DCID: DCID}).items);    
      for (let i = 0; i < this.selRowIssues.length; i++) {
          for (let j = 0; j < this.userEnteredProduct.length; j++) {
              if (this.userEnteredProduct[j].name == this.selRowIssues[i].name) {
                  this.selRowIssues[i].len = this.userEnteredProduct[j].length;
                  this.selRowIssues[i].name = this.selRowIssues[i].name;
              }
          }
      }
    this.selGridResult = _.findWhere(this.gridResult, { name: key, DCID: DCID}).data;
    this.selGridData = _.findWhere(this.gridData, { name: key, DCID: DCID}).data;
    this.selRowLvl = this.getSelRowTree(_.findWhere(this.curRowLvl, { name: key, DCID: DCID}).items);
    this.selRowCategories = this.getSelRowTree(_.findWhere(this.curRowCategories, { name: key, DCID: DCID}).items);
    this.curSelProducts = _.findWhere(this.selectedProducts, { name: key, DCID: DCID });
    this.showColumns();
    this.getcurPTERowData();
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
      let index = this.curRowIndx + 1;
      if (index > this.numIssueRows)
          return false;
      this.selectRow(this.curRowIssues[index].name, this.curRowIssues[index].DCID);
      return true;
  }
  prevRow() {
      let index = this.curRowIndx - 1;
      if (index < 0)
          return false;
      this.selectRow(this.curRowIssues[index].name, this.curRowIssues[index].DCID);
      return true;
  }
    prodSelect(item: any, evt: any) {

        if (evt.target.checked == true && this.DEAL_TYPE !== "ECAP" && this.DEAL_TYPE !== "KIT") {
            // Get unique product types
            let existingProdTypes = lodash.uniqBy(this.curSelProducts['items'], 'prodObj.PRD_CAT_NM')
            existingProdTypes = existingProdTypes.map(function (elem) {
                return elem['prodObj']['PRD_CAT_NM'];
            });

            // Check if valid combination
            let isCrossVerticalError = this.isValidProductCombination(existingProdTypes, item.PRD_CAT_NM)
            if (!isCrossVerticalError) {
                this.loggerSvc.error(this.crossVertical['message'], '', '');
                evt.target.checked = false;
                return false;
            }
        }

        if (evt.target.checked == true && this.checkForDuplicateProducts(item)) {
            evt.target.checked = false;
            return;
        }

        item['IS_SEL'] = evt.target.checked;
        item['DERIVED_USR_INPUT'] = PTE_Common_Util.fullNameProdCorrector(item)
        if (evt.target.checked) {
            let prd = { prod: item.DERIVED_USR_INPUT, prodObj: item };
            this.curSelProducts['items'].push(prd);
        }
        else {
            let idx = _.findIndex(this.selectedProducts, item.DERIVED_USR_INPUT);
            this.curSelProducts['items'].splice(idx, 1);
        }
    }
    isValidProductCombination(existingProdTypes, newProductType) {
        let isValid = true;
        if (this.DEAL_TYPE == 'FLEX') {
            return true;
        }
        let selfCheck = newProductType == undefined;
        for (let i = 0; i < existingProdTypes.length; i++) {
            if (i == existingProdTypes.length - 1 && selfCheck) break;
            newProductType = selfCheck ? existingProdTypes[i + 1] : newProductType;
            if (ProdSel_Util.arrayContainsString(this.crossVertical.productCombination1, existingProdTypes[i])) {
                isValid = ProdSel_Util.arrayContainsString(this.crossVertical.productCombination1, newProductType);
                if (!isValid) break;
            }
            else if (ProdSel_Util.arrayContainsString(this.crossVertical.productCombination2, existingProdTypes[i])) {
                isValid = ProdSel_Util.arrayContainsString(this.crossVertical.productCombination2, newProductType);
                if (!isValid) break;
            } else {
                isValid = existingProdTypes[i] == newProductType;
                if (!isValid) break;
            }
        };
        return isValid
    }
    checkForDuplicateProducts(item) {
  
        let duplicateProducts = (this.curSelProducts['items']).filter((items) => {
            return (items['prodObj']['PRD_MBR_SID'] == item['PRD_MBR_SID'])
        })

        this.isDuplicate = Boolean(duplicateProducts.length);
        if (this.isDuplicate) {
            this.duplicateMsg = 'Found duplicate product for ' + item.HIER_VAL_NM + ', would you like to remove one ?';
            this.duplicateData = item;
        }
        return this.isDuplicate;
    }
    closeKendoDialog(optionSelected) {
        if (optionSelected == 'yes') {

            let filteredResult= (this.selGridResult).filter(val => {
                return val['PRD_MBR_SID'] != this.duplicateData['PRD_MBR_SID'] || val['USR_INPUT'] != this.duplicateData['USR_INPUT'];
            });
            this.selGridResult = filteredResult;
            this.selGridData = process(this.selGridResult, this.state);
            }
            this.isDuplicate = false;
            this.duplicateData = [];
    }
   getcurPTERowData() {
    //curating object to send to grid-popover directive each time
    this.currentPTERow = (this.data.selRows).filter(obj => {
        return obj['row']['DC_ID'] === this.rowDCId;
    });

    this.pricingTableRow.START_DT = this.currentPTERow[0]['row'].START_DT;
    this.pricingTableRow.END_DT = this.currentPTERow[0]['row'].END_DT;
    this.pricingTableRow.CUST_MBR_SID = this.data.contractData.CUST_MBR_SID;
    this.pricingTableRow.IS_HYBRID_PRC_STRAT = this.currentPTERow[0]['row'].IS_HYBRID_PRC_STRAT;
    this.pricingTableRow.GEO_COMBINED = ProdSel_Util.getFormatedGeos(this.currentPTERow[0]['row'].GEO_COMBINED);
    this.pricingTableRow.PTR_SYS_PRD = this.currentPTERow[0]['row'].PTR_SYS_PRD;
    this.pricingTableRow.PROGRAM_PAYMENT = this.currentPTERow[0]['row'].PROGRAM_PAYMENT;
    this.pricingTableRow.PROD_INCLDS = this.currentPTERow[0]['row'].PROD_INCLDS;
    this.pricingTableRow.OBJ_SET_TYPE_CD = this.data.curPricingTable.OBJ_SET_TYPE_CD;
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
  isValidCapDetails(productJson, showErrorMesssage?) {
    if (this.DEAL_TYPE !== 'ECAP' && this.DEAL_TYPE !== 'KIT') {
        return !showErrorMesssage ? false : productJson.HIER_NM_HASH;
    }
    let errorMessage = "";
    const cap = productJson.CAP.toString();
    if (cap.toUpperCase() == "NO CAP") {
        errorMessage = "Product entered does not have CAP within the Deal's start date and end date.";
    }
    if (cap.indexOf('-') > -1) {
        errorMessage = "CAP price " + cap + " cannot be a range.";
    }
    if (!showErrorMesssage) {
        return errorMessage == "" ? false : true;
    } else {
        return errorMessage == "" ? productJson.HIER_NM_HASH : errorMessage;
    }
    }
    showColumns() {
        let columns = [
            "EXCLUDE",
            "USR_INPUT",
            "IS_SEL",
            "DISP_HIER_VAL_NM",
            "PRD_CAT_NM",
            "BRND_NM",
            "FMLY_NM",
            "PRD_STRT_DTM",
            "CAP",
            "HAS_L1",
            "MM_MEDIA_CD",
            "YCS2",
            "GDM_FMLY_NM",
            "HIER_NM_HASH",
            "CPU_PROCESSOR_NUMBER",
            "MM_CUST_CUSTOMER",
            "FMLY_NM_MM",
            "EPM_NM",
            "SKU_NM",
            "NAND_FAMILY",
            "NAND_Density",
            "CPU_CACHE",
            "CPU_PACKAGE",
            "CPU_WATTAGE",
            "CPU_VOLTAGE_SEGMENT",
            "PRICE_SEGMENT",
            "SBS_NM"
        ]
        //always show these fields
        let showAlways = ["EXCLUDE", "IS_SEL", "USR_INPUT", "CAP", "YCS2"]
        if (this.selGridResult) {
            columns.forEach((colVal) => {
                let columnData = lodash.uniqBy(this.selGridResult, colVal)
                //setting default hidden values to false
                this.hidden[colVal] = false;
                if (columnData.length == 1 && colVal !== undefined
                    && !showAlways.includes(colVal)
                    && (columnData[0][colVal] === "" || columnData[0][colVal] == null || columnData[0][colVal] == 'NA')) {
                    this.hidden[colVal] = true;
                }
            })
        }
}
  distinctPrimitive(fieldName: string): any {
    return distinct(this.selGridResult, fieldName).map(item => item[fieldName]);
  }
  ngOnInit() {
    this.ProductCorrectorData=this.data.ProductCorrectorData;
    this.contractData=this.data.contractData;
    this.curPricingTable=this.data.curPricingTable;
    this.selRows=this.data.selRows;
    this.DEAL_TYPE = this.data.curPricingTable['OBJ_SET_TYPE_CD'];
    this.curSelProducts=null;
    this.loadGrid()
  }
}
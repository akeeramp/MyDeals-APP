
import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { productSelcorService } from "./productselector.service";
import { PTE_Load_Util } from "../../PTEUtils/PTE_Load_util";
import { logger } from "../../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem,SelectAllCheckboxState } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import * as _ from "underscore";
import * as moment from 'moment'; 
import {gridCol,ProdSel_Util} from './prodSel_Util';



@Component({
  selector: "product-selector",
  templateUrl: "Client/src/app/contract/ptModals/productSelector/productselector.component.html"
})

export class ProductSelectorComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductSelectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    private prodSelSVC: productSelcorService,
    private loggerSvc: logger
  ) { }

  private productSelectionLevels: any = {};
  private pricingTableRow: any = {};
  private isLoading: boolean = false;
  private isGirdLoading: boolean = false;
  private spinnerMessageHeader: string = "PTE Loading";
  private spinnerMessageDescription: string = "PTE loading please wait";
  private enableSplitProducts:boolean=false;
  private isTender:boolean=false;
  private dealType: string = '';
  private drillDownPrd:string = "Select";
  private verticalsWithGDMFamlyAsDrillLevel5:Array<string> = ["CS", "EIA CS", "EIA CPU", "EIA MISC"];
  private verticalsWithDrillDownLevel4:Array<string> = ["EIA CPU", "EIA MISC"];
  private verticalsWithFamilyLevelSelectionECAP:Array<string> = ["Nand (SSD)", "DCG Client SSD", "DCG DC SSD"];
  private selectedPathParts:Array<any> = [];
  private prdSelLvlAtrbsForCategory:Array<any> = [];
  private productSelectionLevelsAttributes :Array<any> = [];
  private items:Array<any> = [];
  private gridResult:Array<any> = [];
  private state: State = {
    skip: 0,
    take: 25,
    group: [],
    // Initial filter descriptor
    filter: {
        logic: "and",
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
  private gridData: GridDataResult;
  private type:string = "numeric";
  private selectedItems:Array<any> = [];
  private addedProducts:Array<any> = [];
  private excludedProducts:Array<any> = [];
  private enableMultipleSelection:boolean=false;
  private excludeMode:boolean=false;
  private suggestedProduct:any = {'mode': 'manual','prodname': ""};
  private showTree:boolean=false;
  private gridColumnsSuggestion:Array<gridCol>= ProdSel_Util.gridColsSuggestion;
  private gridColumnsProduct:Array<gridCol>= ProdSel_Util.gridColProduct;
  private selectAllState: SelectAllCheckboxState = 'unchecked';
  private prdSelection:Array<any> = [];
  private prdSelectionDisp:string = '';
  private prdSelectionkey:string = 'DEAL_PRD_NM';

  onNoClick(): void {
    this.dialogRef.close();
  }
  getProductSelection() {
    this.spinnerMessageHeader = 'Product selector loading';
    this.spinnerMessageDescription = 'Product selector loading please wait';
    this.isLoading = true;
    let dtoDateRange = {
      startDate: this.pricingTableRow.START_DT, endDate: this.pricingTableRow.END_DT,
      mediaCode: this.pricingTableRow.PROD_INCLDS, dealType: this.pricingTableRow.OBJ_SET_TYPE_CD
    };
    this.prodSelSVC.GetProductSelectorWrapper(dtoDateRange).subscribe((result:any) => {
      this.isLoading = false;
      this.productSelectionLevels = result.ProductSelectionLevels;
      this.productSelectionLevelsAttributes= result.ProductSelectionLevelsAttributes;
      this.getItems(null);
  }, (error) => {
      this.loggerSvc.error('ProductSelectorComponent::getProductSelection::', error);
  });

  }
  loadPTSelctor(){
    //setting up to a dealtype variable since using in multiple places
    this.dealType=this.data.curPricingTable.OBJ_SET_TYPE_CD
    //condition for empty row, directly clicking prodselector
    if(this.data && this.data.curRow && this.data.curRow[0].DCI_ID==null){
      this.pricingTableRow.START_DT = this.data.contractData.START_DT;
      this.pricingTableRow.END_DT = this.data.contractData.END_DT;
      this.pricingTableRow.CUST_MBR_SID = this.data.contractData.CUST_MBR_SID;
      this.pricingTableRow.IS_HYBRID_PRC_STRAT = this.data.curPricingTable.IS_HYBRID_PRC_STRAT;
      this.pricingTableRow.GEO_COMBINED = ProdSel_Util.getFormatedGeos(this.data.curPricingTable.GEO_COMBINED);
      this.pricingTableRow.PTR_SYS_PRD = "";
      this.pricingTableRow.PTR_SYS_INVLD_PRD = "";
      this.pricingTableRow.PROGRAM_PAYMENT = this.data.curPricingTable.PROGRAM_PAYMENT;
      this.pricingTableRow.PROD_INCLDS =this.data.curPricingTable.PROD_INCLDS;
      this.pricingTableRow.OBJ_SET_TYPE_CD=this.data.curPricingTable.OBJ_SET_TYPE_CD
    }
     //condition for non-empty row
    else{
      this.pricingTableRow.START_DT = this.data.curRow[0].START_DT;
      this.pricingTableRow.END_DT = this.data.curRow[0].END_DT;
      this.pricingTableRow.CUST_MBR_SID = this.data.contractData.CUST_MBR_SID;
      this.pricingTableRow.IS_HYBRID_PRC_STRAT = this.data.curRow[0].IS_HYBRID_PRC_STRAT;
      this.pricingTableRow.GEO_COMBINED = ProdSel_Util.getFormatedGeos(this.data.curRow[0].GEO_COMBINED);
      this.pricingTableRow.PTR_SYS_PRD = this.data.curRow[0].PTR_SYS_PRD;
      this.pricingTableRow.PROGRAM_PAYMENT = this.data.curRow[0].PROGRAM_PAYMENT;
      this.pricingTableRow.PROD_INCLDS = this.data.curRow[0].PROD_INCLDS;
      this.pricingTableRow.OBJ_SET_TYPE_CD=this.data.curPricingTable.OBJ_SET_TYPE_CD
    }
    this.enableMultipleSelection = this.dealType == 'VOL_TIER' || this.dealType == 'FLEX' || this.dealType == 'PROGRAM' || this.dealType == 'REV_TIER' || this.dealType == 'DENSITY';
    this.excludeMode = this.suggestedProduct.isExcludeProduct ? this.suggestedProduct.isExcludeProduct && (this.dealType == 'VOL_TIER' || this.dealType == 'FLEX' || this.dealType == 'PROGRAM' || this.dealType == 'REV_TIER' || this.dealType == 'DENSITY') : false;
  }
  getItems(item:any){
    this.selectedItems = []; // Clear the selected items, when user moves around drill levels

    if (this.selectedPathParts.length===0) {
      this.showTree=false;
      let markLevel1 = _.uniq(this.productSelectionLevels, 'MRK_LVL1');
      //filter the items to remove emty level
      markLevel1=  _.filter(markLevel1,(i)=> {return i.MRK_LVL1 != null
        && i.MRK_LVL1 != ""
        && i.PRD_MRK_MBR_SID != null;})
      this.items=_.map(markLevel1,(i)=>{
          return {
            name:i.MRK_LVL1,
            allowMultiple: this.enableMultipleSelection && !(ProdSel_Util.getVerticalSelection(i.MRK_LVL1,this.selectedPathParts,this.productSelectionLevels).length > 1),
            parentSelected: false,
            path: '',
            id: ProdSel_Util.getVerticalSelection(i.MRK_LVL1,this.selectedPathParts,this.productSelectionLevels)[0].PRD_MBR_SID,
            selected: ProdSel_Util.productExists(item, ProdSel_Util.getVerticalSelection(i.MRK_LVL1,this.selectedPathParts,this.productSelectionLevels).length > 1 ? undefined : ProdSel_Util.getVerticalSelection(i.MRK_LVL1,this.selectedPathParts,this.productSelectionLevels)[0].PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection)
          };})
      return;
    }

    if (this.selectedPathParts.length === 1) {
      this.showTree=false;
      let markLevel2 = _.uniq(this.productSelectionLevels, 'MRK_LVL2');
      markLevel2 = _.filter(markLevel2, (i)=> {
          return i.MRK_LVL2 != null
              && i.MRK_LVL2 != ""
              && i.MRK_LVL1 == item.name
              && i.PRD_MRK_MBR_SID != null;
      });
      this.items= _.map(markLevel2, (i) =>{
          return {
              name: i.MRK_LVL2,
              path: '',
              allowMultiple: this.enableMultipleSelection && !(ProdSel_Util.getVerticalSelection(i.MRK_LVL2,this.selectedPathParts,this.productSelectionLevels).length > 1),
              id: (ProdSel_Util.getVerticalSelection(i.MRK_LVL2,this.selectedPathParts,this.productSelectionLevels).length > 1) ? i.PRD_MRK_MBR_SID : ProdSel_Util.getVerticalSelection(i.MRK_LVL2,this.selectedPathParts,this.productSelectionLevels)[0].PRD_MBR_SID,
              parentSelected: item.selected,
              selected: ProdSel_Util.productExists(item, ProdSel_Util.getVerticalSelection(i.MRK_LVL2,this.selectedPathParts,this.productSelectionLevels).length > 1 ? undefined : ProdSel_Util.getVerticalSelection(i.MRK_LVL2,this.selectedPathParts,this.productSelectionLevels)[0].PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection)
          }
      });
      //in case of certain selection there will be one child in that case we are hitting the next level to get products
      if (this.items.length == 1) {
        this.selectItem(this.items[0]);
      }
      return;
    }

    if (this.selectedPathParts.length === 2) {
      this.showTree=false;
      var markLevel2 =_.where(this.productSelectionLevels, {
          'MRK_LVL1': this.selectedPathParts[0].name,
          'MRK_LVL2': item.name,
          'PRD_ATRB_SID': 7003
      });
      markLevel2 = _.uniq(markLevel2, 'PRD_CAT_NM');
      this.items = _.map(markLevel2, (i)=> {
          return {
              name: i.PRD_CAT_NM,
              path: i.HIER_NM_HASH, // From this level we get hierarchy to get deal products
              allowMultiple: this.enableMultipleSelection,
              id: i.PRD_MBR_SID,
              parentSelected: item.selected,
              selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection)
          }
      });
       //in case of certain selection there will be one child in that case we are hitting the next level to get products
      if (this.items.length == 1) {
        this.selectItem(this.items[0]);
      }
      return;
    }
    if (this.selectedPathParts.length === 3) {
      this.showTree=false;
      let brandName = this.productSelectionLevels.filter((i) =>{
          return i.PRD_CAT_NM == item.name && i.PRD_ATRB_SID == 7004;
      });
      brandName =  _.uniq(brandName, 'BRND_NM');
      this.items = _.map(brandName,(i) =>{
          return {
              name: i.BRND_NM,
              path: i.HIER_NM_HASH,
              allowMultiple: this.enableMultipleSelection,
              id: i.PRD_MBR_SID,
              parentSelected: item.selected,
              selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection)
          }
      });

      // For non CPU products check for GDM columns
      // All this special handling would go if GDM attributes are populated at hierarchical columns
      if (this.items.length == 1 && this.items[0].name == 'NA') {
          this.prdSelLvlAtrbsForCategory = this.productSelectionLevelsAttributes.filter(function (x) {
              return x.PRD_CAT_NM == item.name
          });
          if (ProdSel_Util.arrayContainsString(this.verticalsWithDrillDownLevel4, item.name)) {
              this.items = _.uniq(this.prdSelLvlAtrbsForCategory, 'GDM_BRND_NM');
              this.items = _.map(this.items,(i) => {
                  return {
                      name: i.GDM_BRND_NM,
                      path: item.path,
                      drillDownFilter4: i.GDM_BRND_NM == "" ? 'Blank_GDM' : i.GDM_BRND_NM,
                      allowMultiple: false,
                      parentSelected: item.selected,
                      selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection),
                      id: i.PRD_MRK_MBR_SID
                  }
              });
              if (this.items.length == 1) {
                  this.selectItem(this.items[0])
              }
          } else {
              this.selectItem(this.items[0]);
          }
      }
      return;
    }
    if (this.selectedPathParts.length === 4) {
      this.showTree=false;
      var familyName = this.productSelectionLevels.filter((i)=> {
          return i.HIER_NM_HASH.startsWith(item.path) && i.PRD_ATRB_SID == 7005;
      });

      familyName = _.uniq(familyName, 'FMLY_NM');
      this.items = _.map( familyName,(i)=> {
          return {
              name: i.FMLY_NM,
              path: i.HIER_NM_HASH,
              allowMultiple: (ProdSel_Util.arrayContainsString(this.verticalsWithFamilyLevelSelectionECAP, familyName[0].PRD_CAT_NM) && (this.dealType == 'ECAP' || this.dealType == 'KIT')) ? true : this.enableMultipleSelection,
              id: i.PRD_MBR_SID,
              parentSelected: item.selected,
              selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection)
          }
      });

      if (this.items.length == 1 && this.items[0].name == 'NA') {
          var drillLevel5 = _.uniq(this.prdSelLvlAtrbsForCategory, 'PRD_FMLY_TXT');
          // Check if we have prd_fmly_txt

          if ((drillLevel5.length == 1 && drillLevel5[0].PRD_FMLY_TXT == "") ||
              ProdSel_Util.arrayContainsString(this.verticalsWithGDMFamlyAsDrillLevel5, drillLevel5[0].PRD_CAT_NM)) {
              // If null or empty fall back to GDM_FMLY_NM
              drillLevel5 = _.uniq(this.prdSelLvlAtrbsForCategory, 'GDM_FMLY_NM');
              if (this.selectedPathParts[3].drillDownFilter4 != undefined && this.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                  drillLevel5 = drillLevel5.filter((x)=> {
                      return x.GDM_BRND_NM == this.selectedPathParts[3].drillDownFilter4;
                  })
              }
              this.items = _.map(drillLevel5, (i) =>{
                  return {
                      name: i.GDM_FMLY_NM, //TODO Chane these values in db
                      path: this.items[0].path,
                      drillDownFilter5: i.GDM_FMLY_NM == "" ? 'Blank' : i.GDM_FMLY_NM,
                      drillDownFilter4: this.selectedPathParts[3].drillDownFilter4,
                      parentSelected: item.parentSelected,
                      selected: item.selected
                  }
              });
          } else {
              if (this.selectedPathParts[3].drillDownFilter4 != undefined && this.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                  drillLevel5 = drillLevel5.filter((x)=> {
                      return x.PRD_FMLY_TXT == this.selectedPathParts[3].drillDownFilter4;
                  })
              }
              this.items = _.map(drillLevel5,(i)=>{
                  return {
                      name: i.PRD_FMLY_TXT,
                      path: this.items[0].path,
                      drillDownFilter5: i.PRD_FMLY_TXT == "" ? 'Blank_PRD' : i.PRD_FMLY_TXT,
                      drillDownFilter4: this.selectedPathParts[3].drillDownFilter4,
                      parentSelected: item.parentSelected,
                      selected: item.selected
                  }
              });
          }

          if (this.items.length == 1) {
              this.selectItem(this.items[0]);
          }
      }
      return;
    }
    if (this.selectedPathParts.length === 5) {
      this.getProductSelectionResults(item, 7006);
      return;
    }
    if (this.selectedPathParts.length === 6) {
      this.getProductSelectionResults(item, 7007);
      return;
    }
    if (this.selectedPathParts.length === 7) {
        this.getProductSelectionResults(item, 7008);
        return;
    }
  }
  getProductSelectionResults (item:any, selectionLevel:number) {
    this.isGirdLoading = true;
    this.showTree=true;
    this.items = [];
    //setting empty grid first
    this.gridResult = [];
    this.gridData=process(this.gridResult, this.state);

    var data = {
        "searchHash": item.path,
        "startDate": moment(this.pricingTableRow.START_DT).format("l"),
        "endDate": moment(this.pricingTableRow.END_DT).format("l"),
        "selectionLevel": selectionLevel,
        "drillDownFilter4": null,
        "drillDownFilter5": null,
        "custSid": this.pricingTableRow.CUST_MBR_SID,
        "geoSid": this.pricingTableRow.GEO_COMBINED.toString(),
        "mediaCd": this.pricingTableRow.PROD_INCLDS,
        "dealType": this.dealType
    }

    // We need to send two special attributes for getting the data for non CPU products
    // drillDownFilter4 = GDM_BRND_NM/EDW Product Family/GDM_FMLY depends upon vertical
    // drillDownFilter5 = GDM_FMLY/NAND Family depends upon vertical
    if (selectionLevel == 7007) {
        data.drillDownFilter4 = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4,
            data.drillDownFilter5 = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5
    }
    this.prodSelSVC.GetProductSelectionResults(data).subscribe((response)=> {
      this.isGirdLoading = false;
      if (response.length == 1 && response[0].HIER_VAL_NM == 'NA') {
          //if the processor number is NA, send GDM values to filter out L4 data
          response[0]['selected'] = ProdSel_Util.productExists(item, response[0].PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection);
          response[0]['parentSelected'] = item.parentSelected;
          response[0]['drillDownFilter4'] = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4;
          response[0]['drillDownFilter5'] = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5;
          this.gridSelectItem(response[0]);
        } else {
            this.gridResult = response.map((x) =>{
                x['selected'] = ProdSel_Util.productExists(item, x.PRD_MBR_SID,this.excludeMode,this.excludedProducts,this.addedProducts,this.enableMultipleSelection);
                x['parentSelected'] = item.selected;
                return x;
            });
            this.gridResult = ProdSel_Util.sortBySelectionLevelColumn(this.gridResult, selectionLevel);
            this.toggleColumnsWhenEmpty(this.gridResult, 'prodGrid');
            this.gridData = process(this.gridResult, this.state);
        }
    }, (error) => {
        this.loggerSvc.error('ProductSelectorComponent::GetProductSelectionResults::', error);
    });
  }
  toggleColumnsWhenEmpty(data:any, prodGrid:any) {
        _.each(this.gridColumnsProduct, (item, key) =>{
            var columnValue = _.uniq(data, item.field);
            if (columnValue.length == 1 && item.field !== undefined && item.field != "CheckBox" && item.field != 'MM_MEDIA_CD'
                && item.field != 'CAP' && item.field != 'YCS2' && (columnValue[0][item.field] === "" || columnValue[0][item.field] == null
                    || columnValue[0][item.field] == 'NA')) {
               item.hidden=true;
            }
            else if (item.field !== 'HAS_L1') {
              item.hidden=false;
            }
        });
        //setting the prdSelectionkey based on which column is visible
        if(_.findWhere(this.gridColumnsProduct,{field:'DEAL_PRD_NM',hidden:true})){
          this.prdSelectionkey='PCSR_NBR';
        }
    
  }
  gridSelectItem(dataItem:any) {
    if (dataItem['noDrillDown'] === true) return;
    var item = ProdSel_Util.newItem();

    item.name = dataItem.HIER_VAL_NM;
    item.path = dataItem.HIER_NM_HASH,
    item.drillDownFilter4 = dataItem.drillDownFilter4,
    item.drillDownFilter5 = dataItem.drillDownFilter5,
    item.selected = dataItem.selected,
    item.parentSelected = dataItem.selected,
    this.selectedPathParts.push(item);

    this.getItems(item);
  }
  checkForBlank(val:string) {
    if (val == "") {
        return "Blank";
    }
    return val;
  }
  selectItem(item:any, isDrilldown?:boolean) {
    
    this.selectedPathParts.push(item);
    this.selectedPathParts=[...this.selectedPathParts];
    this.getItems(item);
    // // When toggle is level 4 show l4's under the high level products
    // if (!this.showDefault && (item.allowMultiple !== undefined && item.allowMultiple) && this.enableMultipleSelection && isDrilldown) {
    //     var products = this.productSelectionLevels.filter(function (x) {
    //         return x.PRD_MBR_SID == item.id;
    //     })[0];
    //     var product = angular.copy(products);
    //     product['selected'] = item.selected;
    //     product['parentSelected'] = item.parentSelected;
    //     this.items = [];
    //     this.gridResult = [];
    //     showLevle4(product);
    //     dataSourceProduct.read();
    // } else {
    //     this.getItems(item);
    // }
  }
  // When user clicks on the breadcrumb
  selectPath(index:number) {
      if (index === 0) {
        this.updateDrillDownPrd();
      }
      this.selectedPathParts.splice(index, this.selectedPathParts.length);
      this.selectedPathParts=[...this.selectedPathParts];
      let itm = this.selectedPathParts.length > 0 ? this.selectedPathParts[this.selectedPathParts.length - 1]
      : ProdSel_Util.newItem();
      this.getItems(itm);
  }
  updateDrillDownPrd() {
    if (this.drillDownPrd !== "Select") {
        this.drillDownPrd = "Select";
    }
  }
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.gridResult, this.state);
  }
  onSelectedKeysChange(): void {
    const len = this.prdSelection.length;
    this.prdSelectionDisp=this.prdSelection.toString();
    if (len === 0) {
        this.selectAllState = 'unchecked';
    } else if (len > 0 && len < this.items.length) {
        this.selectAllState = 'indeterminate';
    } else {
        this.selectAllState = 'checked';
    }
  }
  onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (checkedState === 'checked') {
        this.prdSelection = this.gridData.data.map((item) => item.DEAL_PRD_NM);
        this.selectAllState = 'checked';
    } else {
        this.prdSelection = [];
        this.selectAllState = 'unchecked';
    }
  }
  ngOnInit() {
    this.loadPTSelctor();
    this.getProductSelection();
  }
}

angular.module("app").directive(
  "productSelector",
  downgradeComponent({
    component: ProductSelectorComponent,
  })
);


import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { logger } from "../../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import * as _ from "underscore";



@Component({
  selector: "product-corrector",
  templateUrl: "Client/src/app/contract/ptModals/productCorrector/productcorrector.component.html",
  styleUrls:['Client/src/app/contract/ptModals/productCorrector/productcorrector.component.css']
})

export class ProductCorrectorComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductCorrectorComponent>,
      @Inject(MAT_DIALOG_DATA) public ProductCorrectorData: any,
    private loggerSvc: logger
  ) { }

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
  private curRowIssues:any[]=[];
  private curRowLvl:any[]=[];
  private curRowCategories:any[]=[];
  private selRowLvl:any[]=[];
  private selRowCategories:any[]=[];
  private selRowIssues:any[]=[];

  onNoClick(): void {
    this.dialogRef.close();
  }
  loadGrid(){
    if(this.ProductCorrectorData.DuplicateProducts)
    _.each(this.ProductCorrectorData.DuplicateProducts,(val,key)=>{
      this.curRowIssues.push({name:_.keys(val)[0],len:_.values(val)[0].length});
      this.curRowLvl.push({name:_.keys(val)[0],items:_.uniq(_.pluck(_.values(val)[0],'PRD_ATRB_SID'))});
      this.curRowCategories.push({name:_.keys(val)[0],items:_.uniq(_.pluck(_.values(val)[0],'PRD_CAT_NM'))});
      this.gridResult.push({name:_.keys(val)[0],data:_.values(val)[0]});
      this.gridData.push({name:_.keys(val)[0],data:process(_.values(val)[0], this.state)});
    });
    //default selecting to first row
    this.selGridResult=this.gridResult[0].data;
    this.selGridData=this.gridData[0].data;
    this.selRowLvl=this.curRowLvl[0].items;
    this.selRowCategories=this.curRowCategories[0].items;
    this.selRowIssues=[this.curRowIssues[0]];
  }
  selectRow(key:string){
    this.selGridResult=_.findWhere(this.gridResult,{name:key}).data;
    this.selGridData=_.findWhere(this.gridData,{name:key}).data;
    this.selRowLvl=_.findWhere(this.curRowLvl,{name:key}).items;
    this.selRowCategories=_.findWhere(this.curRowCategories,{name:key}).items
    this.selRowIssues=[_.findWhere(this.curRowIssues,{name:key})];
  }
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.selGridData = process(this.selGridResult, this.state);
}
  ngOnInit() {
    this.loadGrid()
  }
}

angular.module("app").directive(
  "productCorrector",
  downgradeComponent({
    component: ProductCorrectorComponent,
  })
);

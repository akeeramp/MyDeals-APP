import * as angular from "angular";
import * as $ from 'jquery';
import { Component } from "@angular/core";
import { products,sampleProducts } from "./products";
import { customers,sampleCustomers } from "./customer";
import {downgradeComponent} from "@angular/upgrade/static";
import { GridDataResult, PageChangeEvent,DataStateChangeEvent } from "@progress/kendo-angular-grid";
import {kendoService} from './kendo.service';
import { process, State,GroupDescriptor } from "@progress/kendo-data-query";


@Component({
  selector: "myKendo",
  templateUrl:'Client/src/app/shared/kendo/kendo.component.html'

})
export class KendoComponent {
  constructor(private kendoSvc:kendoService) {
    //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
    $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
    $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
  }

  public pageSize = 5;
  public skip = 0;
  private isLoading:boolean=true;
  // private gridData:Array<any>=products;
  public state: State = {
    skip: 0,
    take: 5,
    group: [],
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  // public gridData: GridDataResult = process(sampleProducts, this.state);
  public gridData: GridDataResult;
  //public groups: GroupDescriptor[] = [{ field: "Category.CategoryName" }];
  private columns: any[] = [
    { field: "ProductID",filterable:false, },
    { field: "ProductName",filterable:true,filter:"string" },
    { field: "QuantityPerUnit",filterable:true,filter:"string" },
    {field:'UnitPrice',filterable:true,filter:"numeric"},
    {field:"Discontinued",filterable:true,filter:"boolean"}
  ];

  loadItems(){
    this.gridData = process(sampleProducts,this.state);
    // this.kendoSvc.getKendo().then((result:Array<any>) =>{
    //   this.isLoading=false;
    //   this.gridData = {
    //     data: result.slice(this.skip, this.skip + this.pageSize),
    //     total: result.length,
    //   };
    // }); 
  }
  ngOnInit() {
   this.loadItems();
  }
  pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
   dataStateChange(state: DataStateChangeEvent): void {
    console.log('****************---state Change');
    this.state = state;

    this.loadItems();
  }
   groupChange(groups: GroupDescriptor[]): void {
     console.log('****************---group Change');
    this.state.group = groups;
    this.loadItems();
  }
}

angular.module("app").directive(
  "myKendo",
  downgradeComponent({
    component: KendoComponent,
  })
);

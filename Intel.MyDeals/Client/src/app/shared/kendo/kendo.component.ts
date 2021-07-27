import * as angular from "angular";
import * as $ from "jquery";
import {Component,ViewChild} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {
  GridDataResult,
  PageChangeEvent,
  DataStateChangeEvent,
  PageSizeItem,
} from "@progress/kendo-angular-grid";
import {kendoService} from "./kendo.service";
import {
  process,
  State,
  GroupDescriptor,
  CompositeFilterDescriptor,
  distinct,
  filterBy,
} from "@progress/kendo-data-query";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Cust_Map} from "./cust_map.model";
import {logger} from "../logger/logger";
import { Observable } from "rxjs";

@Component({
  selector: "myKendo",
  templateUrl: "Client/src/app/shared/kendo/kendo.component.html"
})
export class KendoComponent {
  constructor(private kendoSvc: kendoService) {
    //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
    $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
    $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
  }
  @ViewChild('catDropDown') private catDdl;
  @ViewChild('custDropDown') private custDdl;
  @ViewChild('countDropDown') private countDdl;
  @ViewChild('partDropDown') private partDdl;
  private itemToSave:boolean=false;
  public type: string = "numeric";
  public info: boolean = true;
  private isLoading: boolean = true;
  public state: State = {
    skip: 0,
    take: 10,
    group: [],
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public gridResult: Array<any>;
  public pageSizes: PageSizeItem[] = [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
    // {
    //   text: "All",
    //   value: "all",
    // },
  ];
  public gridData:GridDataResult;
  public distinctPartner:Array<any>;
  public distinctCust:Array<any>;
  public distinctCountry:Array<any>;
  public distinctPartId:Array<any>;
  public filter: CompositeFilterDescriptor;
  public formGroup: FormGroup;
  private editedRowIndex: number;

  loadResult(){
    this.distinctPartner = distinct(this.gridResult,'BUSNS_ORG_NM').map(item => item.BUSNS_ORG_NM);
    this.distinctPartId = distinct(this.gridResult,'DROP_DOWN').map(item => item.DROP_DOWN);
    this.distinctCountry = distinct(this.gridResult,'CTRY_CD').map(item => item.CTRY_CD);
    this.distinctCust = distinct(this.gridResult,'CUST_NM').map(item => item.CUST_NM);
    this.gridData = process(this.gridResult, this.state);
  }
  loadItems() {
    this.kendoSvc.getCustomerMapping().subscribe(
      (result: Array<any>) => {
        this.gridResult = result;
        this.loadResult();
        this.isLoading = false;
      },
      err => {
        logger.error("Unable to get customer mapping data.", err);
      }
    );
  }
  ngOnInit() {
    this.loadItems();
  }
  closeEditor(grid, rowIndex = this.editedRowIndex) {
    console.log("******************closeEditor*****************");
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  addHandler({sender}) {
    console.log("******************addHandler*****************");
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      ATRB_LKUP_SID: new FormControl(123),
      ACTV_IND: new FormControl(true,Validators.required),
      BUSNS_ORG_NM: new FormControl("",Validators.required),
      CUST_NM:new FormControl("",Validators.required),
      DROP_DOWN: new FormControl("",Validators.required),
      CTRY_CD: new FormControl("", Validators.required),
    });

    sender.addRow(this.formGroup);
  }
  editHandler({sender, rowIndex, dataItem}) {
    console.log("******************editHandler*****************");
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      ATRB_LKUP_SID: new FormControl(dataItem.ATRB_LKUP_SID),
      ACTV_IND: new FormControl(dataItem.ACTV_IND,Validators.required),
      BUSNS_ORG_NM: new FormControl(dataItem.BUSNS_ORG_NM,Validators.required),
      CUST_NM:new FormControl(dataItem.CUST_NM,Validators.required),
      DROP_DOWN: new FormControl(dataItem.DROP_DOWN,Validators.required),
      CTRY_CD: new FormControl(dataItem.CTRY_CD,Validators.required),
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
    
  }
  cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    console.log("******************cancelHandler*****************");
  }

  saveHandler({sender, rowIndex, formGroup, isNew}) {
    console.log("******************saveHandler*****************");
    //this.itemToSave=true;
    this.isLoading = true;
    const cust_map: Cust_Map = formGroup.value;
    console.log("******************cust_map*****************",cust_map,rowIndex);
    this.kendoSvc.insertCustomerVendor(cust_map).subscribe(result => {
      if(isNew){
        this.gridResult.push(cust_map);
      }
      else{
        this.gridResult[rowIndex]=cust_map;
      }
      
      this.loadResult();
      this.isLoading = false;
      sender.closeRow(rowIndex);
    },error=>{
      logger.error("Unable to save customer vendor data.", error);
    });
   
  }
  removeHandler({dataItem}) {
    console.log("******************removeHandler*****************");
  }
  distinctPrimitive(fieldName: string): any {
    return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
  }
  dataStateChange(state: DataStateChangeEvent): void {
    console.log("******************dataStateChange******************");
    this.state = state;
    this.gridData = process(this.gridResult, this.state);
  }
  saveConfirmation(status:boolean){
    console.log("******************saveConfirmation******************");
    this.itemToSave = status;
  }
}

angular.module("app").directive(
  "myKendo",
  downgradeComponent({
    component: KendoComponent,
  })
);

import * as angular from 'angular';  
import {logger} from '../../shared/logger/logger';
import {gridUtils} from '../../shared/util/gridUtils';
import {customerVendorService} from './customerVendors.service';
import {Component,ViewChild} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {Cust_Map} from "./cust_map.model";
import * as _ from 'underscore';
import {
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent,
    PageSizeItem,
  } from "@progress/kendo-angular-grid";
  import {
    process,
    State,
    GroupDescriptor,
    CompositeFilterDescriptor,
    distinct,
    filterBy,
  } from "@progress/kendo-data-query";
  import {FormGroup, FormControl, Validators} from "@angular/forms";

  @Component({
    selector: "adminVendorsCustomer",
    templateUrl: "Client/src/app/admin/CustomerVendors/customerVendors.html"
  })

export class adminCustomerVendorsComponent {
    constructor(private customerVendSvc:customerVendorService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @ViewChild('catDropDown') private catDdl;
    @ViewChild('custDropDown') private custDdl;
    @ViewChild('countDropDown') private countDdl;
    @ViewChild('partDropDown') private partDdl;

    private isLoading: boolean = true;
    private errorMsg:string='';
    private isCombExists:boolean=false;
    private custsDataSource:any[] = [];
    private vendorsNamesinfo:any[] = [];
    private vendorsNamesId:any[] = [];
    private selectedCUST_MBR_SID:number = 1;
    private selectedVENDOR_SID:number = 0;
    private getCustomersData :any;
    private OnlyActv_ind_chg:boolean = true;
    private dataSource:any;
    private CustvendorsData:any;
    private customers:any;
    private vendorsNamesOptions:any;
    private vendorsIdsOptions:any;
    private gridOptions:any;
    private allowCustom:boolean=true;

    
    public gridResult: Array<any>;
    public type:string="numeric";
    public info:boolean = true;
    public distinctPartner:Array<any>;
    public distinctCust:Array<any>;
    public distinctCountry:Array<any>;
    public distinctPartId:Array<any>;
    public formGroup: FormGroup;
    private editedRowIndex: number;
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
    public pageSizes: PageSizeItem[] = [
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
  
    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
      }

    clearFilter(){
        this.state.filter={
          logic: "and",
          filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
      }
    
    loadCustomerVendors(){
        let vm=this;
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != 'SA' && (<any>window).usrRole != 'RA' && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else{
            vm.customerVendSvc.getCustomerVendors()
            .subscribe( (result: Array<any>) =>  {
                vm.gridResult = result;
                vm.distinctPartner = distinct(vm.gridResult,'BUSNS_ORG_NM').map(item => item.BUSNS_ORG_NM);
                vm.distinctPartId = distinct(vm.gridResult,'DROP_DOWN').map(item => item.DROP_DOWN);
                vm.distinctCountry = distinct(vm.gridResult,'CTRY_CD').map(item => item.CTRY_CD);
                vm.distinctCust = distinct(vm.gridResult,'CUST_NM').map(item => item.CUST_NM);
                vm.gridData = process(vm.gridResult, this.state);
                vm.isLoading=false;
            }, function (response) {
                logger.error("Unable to get Customer Vendors.", response, response.statusText);
            });
        }
      }

      IsValidCustomerVendorMapping(model:any,isNew:boolean) {
        let retCond=false;
        let cond=_.findWhere(this.gridResult, {BUSNS_ORG_NM:model.BUSNS_ORG_NM,CUST_NM:model.CUST_NM,DROP_DOWN:model.DROP_DOWN,CTRY_CD:model.CTRY_CD})
        if(cond !=null) {
          this.errorMsg='This combination already exists';
          retCond=true;
        }
        else{
         if( _.indexOf(this.distinctPartner,model.BUSNS_ORG_NM) ==-1){
          this.errorMsg='Please Select Valid Settlement Partner.';
          retCond=true;
         }
         if( _.indexOf(this.distinctPartId,model.DROP_DOWN) ==-1){
          this.errorMsg='Please Select Valid Settlement Partner ID.';
          retCond=true;
         }
         if( _.indexOf(this.distinctCountry,model.CTRY_CD) ==-1){
          this.errorMsg='Please Select Valid Country Code';
          retCond=true;
         }
         if( _.indexOf(this.distinctCust,model.CUST_NM) ==-1){
          this.errorMsg='Please Select Valid Customer Name';
          retCond=true;
         }
        }
        return retCond
        
     }
     saveConfirmation(){
      this.isCombExists = false;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        console.log("******************dataStateChange******************");
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
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
            DROP_DOWN: new FormControl("",Validators.compose([
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              Validators.minLength(8)
            ])),
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
            DROP_DOWN: new FormControl(dataItem.DROP_DOWN,Validators.compose([
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              Validators.minLength(8)
            ])),  
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
            const cust_map: Cust_Map = formGroup.value;
            console.log("******************cust_map*****************",cust_map,rowIndex);
            //check the combination exists
            this.isCombExists=this.IsValidCustomerVendorMapping(cust_map,isNew);
           if(!this.isCombExists) {
              if(isNew ){
                this.isLoading=true;
                this.customerVendSvc.insertCustomerVendor(cust_map).subscribe(result => {
                  this.gridResult.push(cust_map);
                  this.loadCustomerVendors();
                  sender.closeRow(rowIndex);
                },error=>{
                  logger.error("Unable to save customer vendor data.", error);
                  this.isLoading=false;
                });
            }
            else{
              this.isLoading=true;
                this.customerVendSvc.updateCustomerVendor(cust_map).subscribe(result => {
                  this.gridResult[rowIndex]=cust_map;
                  this.gridResult.push(cust_map);
                  this.loadCustomerVendors();
                  sender.closeRow(rowIndex);
                },error=>{
                  logger.error("Unable to update customer vendor data.", error);
                  this.isLoading=false;
                });
              }
           }
          
      }

    ngOnInit() {
     this.loadCustomerVendors();
    }
}

angular
    .module('app')
    .directive('adminVendorsCustomer',downgradeComponent({component:adminCustomerVendorsComponent}));
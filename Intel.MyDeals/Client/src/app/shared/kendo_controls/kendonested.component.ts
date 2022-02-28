import * as angular from 'angular';
import { Input,Output, Component, OnInit,EventEmitter } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { NgIf } from '@angular/common';

@Component({
  selector: 'nested-loader',
  templateUrl:'Client/src/app/shared/kendo_controls/kendonested.component.html' 
})
export class nestedLoaderComponent  {
  constructor() {

   }
   @Input() private items: any;
   @Output() getId = new EventEmitter<any>();
   
   onAdd(id:any,index:any){
     //here item is the parent to which this child is going to add
    this.items.groups[index].groups.push({id:id+"_"+index,groups:[]});
    this.getId.emit({id:this.items.id,item:this.items,act:"Add"});
   }  
   onRemove(id:any,index:any){
     //here item is the parent to which this child is going to remove
    this.items.groups.splice(index,1);
    this.getId.emit({id:this.items.id,item:this.items,act:"Add"});
   }
   //
   getElem(id:any){
    this.getId.emit(id);
   }
      
 }
angular
.module('app')
.directive("nestedLoader", downgradeComponent({
  component: nestedLoaderComponent,
    inputs: ['items']
}));
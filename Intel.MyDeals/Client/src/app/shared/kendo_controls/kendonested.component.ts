import { Input,Output, Component,EventEmitter } from "@angular/core";

@Component({
  selector: 'nested-loader',
  templateUrl:'Client/src/app/shared/kendo_controls/kendonested.component.html' 
})
export class nestedLoaderComponent  {
  
   @Input() private items: any;
   @Output() getId = new EventEmitter<any>();
   
   onAdd(id:any,index:any){
     //here item is the parent to which this child is going to add
    this.items.groups[index].groups.push({id:id+"_"+index,groups:[],conditions:[]});
    this.getId.emit({id:this.items.id,item:this.items,act:"Add"});
   }  
   onRemove(index:any){
     //here item is the parent to which this child is going to remove
    this.items.groups.splice(index,1);
    this.getId.emit({id:this.items.id,item:this.items,act:"remove"});
   }
   onAddCond(id:any,index:any){
   this.items.groups[index].conditions.push({name: "And", operator: "+,>"});
   this.getId.emit({id:this.items.id,item:this.items,act:"Add"});
  } 
  onRemoveCond(indGrp:any,indCond:any){
    //here item is the parent to which this child is going to remove
   this.items.groups[indGrp].conditions.splice(indCond,1);
   this.getId.emit({id:this.items.id,item:this.items,act:"remove"});
  }
   //
   getElem(id:any){
    this.getId.emit(id);
   }
      
 }
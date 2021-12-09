import Handsontable from 'handsontable-pro'
import {HotTableRegisterer} from "@handsontable/angular";
import {MatDialog} from '@angular/material/dialog';
import {DialogOverviewExampleDialog} from '../../shared/modalPopUp/modal.component';


export class custEditor {

    constructor(protected dialog: MatDialog,public id:string){
        this.initCustomEditor();
    }
    public CustomEditor:any 
    public hotRegisterer = new HotTableRegisterer();

    initCustomEditor(){
        let vm=this;
        this.CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();
     
        this.CustomEditor.prototype.open = function () {
           let anim=vm.hotRegisterer.getInstance(vm.id).getDataAtCell(this.row,this.col);
           const dialogRef = vm.dialog.open(DialogOverviewExampleDialog, {
             width: '500px',
             data: {name: "User", animal: anim},
           });
          
           dialogRef.afterClosed().subscribe(result => {
             if(result){
               console.log('The dialog was closed:: result::',result);
               vm.hotRegisterer.getInstance(vm.id).setDataAtCell(this.row,this.col,result?.animal);
             }
            });
         };
         this.CustomEditor.prototype.getValue = function () {
            return vm.hotRegisterer.getInstance(vm.id).getDataAtCell(this.row,this.col)
          }
          this.CustomEditor.prototype.setValue = function () {
    
          }
          this.CustomEditor.prototype.focus = function () {
            
          }
          this.CustomEditor.prototype.close = function () {
            
          }
    }
}






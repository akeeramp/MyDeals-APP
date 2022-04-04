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
        this.CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();
     
        this.CustomEditor.prototype.open = function () {
           const anim=this.hotRegisterer.getInstance(this.id).getDataAtCell(this.row,this.col);
           const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
             width: '500px',
             data: {name: "User", animal: anim},
           });
          
           dialogRef.afterClosed().subscribe(result => {
             if(result){
               console.log('The dialog was closed:: result::',result);
               this.hotRegisterer.getInstance(this.id).setDataAtCell(this.row,this.col,result?.animal);
             }
            });
         };
         this.CustomEditor.prototype.getValue = function () {
            return this.hotRegisterer.getInstance(this.id).getDataAtCell(this.row,this.col)
          }
    }
}






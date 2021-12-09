import * as angular from "angular";
import {Component, ViewChild, ElementRef, AfterViewInit, inject} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import Handsontable from 'handsontable-pro'
import {HotTableRegisterer} from "@handsontable/angular";
import {MatDialog} from '@angular/material/dialog';
import {custEditor} from '../modalPopUp/custEditor';
import {DialogOverviewExampleDialog} from '../../shared/modalPopUp/modal.component';

@Component({
  selector: "myHandonse",
  templateUrl: "Client/src/app/shared/handsone/spread.component.handson.html",
  styleUrls:['Client/src/app/shared/handsone/spreadsheet.style.css']
})

export class SpreadComponent {
  constructor(protected dialog: MatDialog) {
    let cstEdt = new custEditor(dialog,this.id);
    this.CustomEditor=cstEdt.CustomEditor;
  }

  private hotRegisterer = new HotTableRegisterer();
  private dataset: any[];
  private columns: any[];
  private id:string = "hotInstance";
  private hot:any;
  private hotSettings: Handsontable.GridSettings;
  private hotSettings_1: Handsontable.GridSettings;
  private selectedName:string;
  private CustomEditor:any 
  private custEditorVal:any;

  private TEXTAREA:any;
  private TEXTAREA_PARENT:any;
  private button:any;
  private custTD:any;
  private textareaStyle:any
  private selRow:number=0;
  private selCol:number=0;

  openPopUp(){
    let hotTable:any=this.hotRegisterer.getInstance(this.id);
    if(hotTable.selCol && hotTable.selCol==2){
      let selVal= this.hotRegisterer.getInstance(this.id).getDataAtCell(hotTable.selRow,hotTable.selCol)
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '500px',
        data: {name: "User", animal:selVal },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed:: result::',result);
        this.hotRegisterer.getInstance(this.id).setDataAtCell(hotTable.selRow,hotTable.selCol,result?.animal);
      });
    }
  
  
  }

  afterCellChange(changes:any,source:any){
    console.log("on cell change**************",changes,'%%%%%%%%%%%%%%%%%%%%%%%%',source);
  }
  onSelectName(){
   this.hotRegisterer.getInstance(this.id).setDataAtCell(
   parseInt(localStorage.getItem('selRow')),
   parseInt(localStorage.getItem('selCol')),
   this.selectedName);
  }
  onAddRow(){
    let hot= this.hotRegisterer.getInstance(this.id);
    let row=hot.countRows();
    hot.alter('insert_row', row);
    hot.setDataAtCell(row,0,row+1);
  }
  onAddRowMerge(){
    let hot= this.hotRegisterer.getInstance(this.id);
    let row=hot.countRows();
    //first row
    hot.alter('insert_row', row);
    hot.setDataAtCell(row,0,row+1);
   //second row 
   hot.alter('insert_row', row);
   hot.setDataAtCell(row+1,0,row);

   let mergeCells:Handsontable.GridSettings=hot.getSettings().mergeCells;
   mergeCells.push({row:row,col:0,rowspan:2,colspan:1});
   mergeCells.push({row:row,col:1,rowspan:2,colspan:1});
   //update the hot table for mergecells
   hot.updateSettings({mergeCells:mergeCells});
  }
  onSubmit(){
    let hotData= this.hotRegisterer.getInstance(this.id).getData();
  }
  afterOnCellMouseDown(event, coords, TD){
    this.selRow=coords.row;
    this.selCol=coords.col;
   if(coords.col==1){
     console.log('afterOnCellMouseDown******************',TD);
     localStorage.setItem('selCol',coords.col);
     localStorage.setItem('selRow',coords.row);
    }
   }
  nameValidator(value, callback){
    if (/^[a-zA-Z ]{2,30}$/.test(value)) {
      callback(true);

    } else {
      callback(false);
    }
  }
  ngOnInit() {
    this.columns=[
      {
        data: 'id',
        type: 'numeric',
        width: 50,
        readOnly: true,
      },
      {
        data: 'name',
        type: 'text',
        width: 100,
        allowEmpty: false,
        validator:this.nameValidator,
        allowInvalid: false
      },
      {
        data: 'address',
        type: 'text',
        width: 200,
        allowEmpty: false,

       },
      {
        data: 'mobile',
        type: 'numeric',
        width: 100
      },
      {
        data: 'amount',
        type: 'numeric',
        numericFormat: {
          pattern: '$0,0.00',
          culture: 'en-US' // this is the default culture, set up for USD
        },
        allowEmpty: false
      },
      {
        data: 'location',
        type: 'dropdown',
        source: ['HF', 'FM', 'IN', 'OR'],
        allowInvalid: false
      },
      {
        data: 'geo',
      },
      {
        data: 'Date',
        type: 'date',
        defaultDate: '01/01/2020',
        dateFormat: 'MM/DD/YYYY',
        correctFormat: true,
        allowInvalid: false,
        datePickerConfig: {
          // First day of the week (0: Sunday, 1: Monday, etc)
          firstDay: 1,
          showWeekNumber: true,
          numberOfMonths: 1,
          licenseKey: 'non-commercial-and-evaluation',
          // disableDayFn(date) {
          //   // Disable Sunday and Saturday
          //   return date.getDay() === 0 || date.getDay() === 6;
          // }
        }
      }
    ];
    this.dataset = [
      {
        id: 1,
        name: "Ted Right",
        address: "Wall Street",
        mobile: "123",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 2,
        name: "Frank Honest",
        address: "Pennsylvania Avenue",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "LAR",
        Date: "01/01/2020",
      },
      {
        id: 3,
        name: "Joan Well",
        address: "Broadway",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 3,
        name: "Joan Well",
        address: "Banglore",
        mobile: "489",
        amount: "222",
        location: "OR",
        geo: "NAR",
        Date: "02/02/2020",
      },
      {
        id: 4,
        name: "Gail Polite",
        address: "Bourbon Street",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 5,
        name: "Michael Fair",
        address: "Lombard Street",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 6,
        name: "Mia Fair",
        address: "Rodeo Drive",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 7,
        name: "Cora Fair",
        address: "Sunset Boulevard",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 8,
        name: "Jack Right",
        address: "Michigan Avenue",
        mobile: "456",
        amount: "1111",
        location: "HF",
        geo: "NAR",
        Date: "01/01/2020",
      },
      {
        id: 10,
        name: "Jon Mil",
        address: "Kan Avenue",
        mobile: "456",
        amount: "4856",
        location: "OR",
        geo: "NAR",
        Date: "01/01/2020",
      }
     

    ];
    this.hotSettings={
      colHeaders: false,
      rowHeaders: true,
      rowHeaderWidth : 0,
      fixedColumnsLeft: 1,
      fixedRowsTop: 0,
      height: 350,
      width:350,
      maxRows:20,
      maxCols:20,
      comments: true,
      columns:this.columns,
      copyPaste: true,
      cell: [
        { row: 1, col: 2, comment: { value: 'Error meesage',readOnly:true }, 
        className: 'custom-border' },
        { row: 1, col: 0, className: 'custom-cell' }
      ],
      mergeCells: [
        { row: 2, col: 0, rowspan: 2, colspan: 1 },
        { row: 2, col: 1, rowspan: 2, colspan: 1 }
      ],
      hiddenColumns: {
        columns: [3],
        indicators: true
      },
      nestedHeaders:[
        ['A','B','C','D','E','F','G','H'],
        [`<span style="color:blue;font-style: italic;">ID</span>`,
        `<span style="color:blue;font-style: italic;">Name*</span>`,
        `<span style="color:blue;font-style: italic;">Address*</span>`,
        `<span style="color:blue;font-style: italic;">mobile</span>`,
        `<span style="color:blue;font-style: italic;">Amount</span>`,
        `<span style="color:blue;font-style: italic;">location</span>`,
        `<span style="color:blue;font-style: italic;">Geo</span>`,
        `<span style="color:blue;font-style: italic;">Date</span>`],
      ],
      afterOnCellMouseDown:this.afterOnCellMouseDown,
      afterChange:this.afterCellChange,
      licenseKey: "non-commercial-and-evaluation",
    }
    this.hotSettings_1={
      startRows: 50,
      startCols: 7,
      colHeaders: false,
      rowHeaders: true,
      rowHeaderWidth : 0,
      fixedColumnsLeft: 1,
      fixedRowsTop: 0,   
      comments: true,
      copyPaste: true,
      nestedHeaders:[
        ['A','B','C','D','E','F','G'],
        [`<span style="color:blue;font-style: italic;">ID</span>`,
        `<span style="color:blue;font-style: italic;">Name*</span>`,
        `<span style="color:blue;font-style: italic;">Address*</span>`,
        `<span style="color:blue;font-style: italic;">mobile</span>`,
        `<span style="color:blue;font-style: italic;">Amount</span>`,
        `<span style="color:blue;font-style: italic;">location</span>`,
        `<span style="color:blue;font-style: italic;">Date</span>`],
      ],
      licenseKey: "non-commercial-and-evaluation",
   
    }
  }
}

angular.module("app").directive(
  "myHandonse",
  downgradeComponent({
    component: SpreadComponent,
  })
);

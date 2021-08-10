import * as angular from "angular";
import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import * as Handsontable from "handsontable-pro";
import {HotTableRegisterer} from "@handsontable/angular";

@Component({
  selector: "mySpread",
  templateUrl: "Client/src/app/shared/kendo/spread.component.html",
  styleUrls:['Client/src/app/shared/kendo/spreadsheet.style.css']
})
export class SpreadComponent {
  private hotRegisterer = new HotTableRegisterer();
  private dataset: any[];
  private columns: any[];
  private id:string = "hotInstance";
  private hotSettings: Handsontable.GridSettings;
  private selectedName:string;

  onSelectName(){
   this.hotRegisterer.getInstance(this.id).setDataAtCell(
   parseInt(localStorage.getItem('selRow')),
   parseInt(localStorage.getItem('selCol')),
   this.selectedName)
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
   if(coords.col==1){
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
        width: 100,
        allowEmpty: false
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
        Date: "01/01/2020",
      },
      {
        id: 2,
        name: "Frank Honest",
        address: "Pennsylvania Avenue",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 3,
        name: "Joan Well",
        address: "Broadway",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 3,
        name: "Joan Well",
        address: "Banglore",
        mobile: "489",
        amount: "222",
        location: "OR",
        Date: "02/02/2020",
      },
      {
        id: 4,
        name: "Gail Polite",
        address: "Bourbon Street",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 5,
        name: "Michael Fair",
        address: "Lombard Street",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 6,
        name: "Mia Fair",
        address: "Rodeo Drive",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 7,
        name: "Cora Fair",
        address: "Sunset Boulevard",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 8,
        name: "Jack Right",
        address: "Michigan Avenue",
        mobile: "456",
        amount: "1111",
        location: "HF",
        Date: "01/01/2020",
      },
      {
        id: 10,
        name: "Jon Mil",
        address: "Kan  Avenue",
        mobile: "456",
        amount: "4856",
        location: "OR",
        Date: "01/01/2020",
      },
      {
        id: 11,
        name: "Mil Gil",
        address: "Kaas  Avenue",
        mobile: "8956",
        amount: "4785",
        location: "IN",
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
        ['A','B','C','D','E','F','G'],
        [`<span style="color:blue;font-style: italic;">ID</span>`,
        `<span style="color:blue;font-style: italic;">Name*</span>`,
        `<span style="color:blue;font-style: italic;">Address*</span>`,
        `<span style="color:blue;font-style: italic;">mobile</span>`,
        `<span style="color:blue;font-style: italic;">Amount</span>`,
        `<span style="color:blue;font-style: italic;">location</span>`,
        `<span style="color:blue;font-style: italic;">Date</span>`],
      ],
      afterOnCellMouseDown:this.afterOnCellMouseDown,
      licenseKey: "non-commercial-and-evaluation",
    }
  }
}

angular.module("app").directive(
  "mySpread",
  downgradeComponent({
    component: SpreadComponent,
  })
);

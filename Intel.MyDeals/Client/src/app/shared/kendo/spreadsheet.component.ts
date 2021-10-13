import * as angular from "angular";
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {downgradeComponent} from "@angular/upgrade/static";
import { products } from './products';

declare var kendo: any;
declare var $: any;

@Component({
  selector: "mySpread",
  templateUrl: "Client/src/app/shared/kendo/spread.component.html"
})
export class SpreadComponent implements AfterViewInit {
    @ViewChild('datePicker') datePickerEl: ElementRef;
    @ViewChild('spreadSheet') spreadSheetEl: ElementRef;
    @ViewChild('pivot',{static:false}) pivotEl;

    private selectedDate: Date = new Date();
    public pivotGrid;
    ngAfterViewInit() {
          // Using a template reference variable
          kendo.jQuery(this.datePickerEl.nativeElement).kendoDatePicker({
            change: (e) => {
                this.selectedDate = e.sender.value();
            }
        });
        $(this.spreadSheetEl.nativeElement).kendoSpreadsheet({});
        // this.pivotGrid = $(this.pivotEl.nativeElement).kendoPivotGrid({
        //   filterable: true,
        //   columnWidth: 120,
        //   height: 570,
        //   dataSource: {
        //       data: products,
        //       schema: {
        //           model: {
        //               fields: {
        //                   ProductName: { type: 'string' },
        //                   UnitPrice: { type: 'number' },
        //                   UnitsInStock: { type: 'number' },
        //                   Discontinued: { type: 'boolean' },
        //                   CategoryName: { field: 'Category.CategoryName' }
        //               }
        //           },
        //           cube: {
        //               dimensions: {
        //                   ProductName: { caption: 'All Products' },
        //                   CategoryName: { caption: 'All Categories' },
        //                   Discontinued: { caption: 'Discontinued' }
        //               },
        //               measures: {
        //                   Sum: { field: 'UnitPrice', format: '{0:c}', aggregate: 'sum' },
        //                   Average: { field: 'UnitPrice', format: '{0:c}', aggregate: 'average' }
        //               }
        //           }
        //       },
        //       columns: [{ name: 'CategoryName', expand: true }, { name: 'ProductName' }],
        //       rows: [{ name: 'Discontinued', expand: true }],
        //       measures: ['Sum']
        //   }
        // }).data('kendoPivotGrid');
      }

}

angular.module("app").directive(
  "mySpread",
  downgradeComponent({
    component: SpreadComponent,
  })
);

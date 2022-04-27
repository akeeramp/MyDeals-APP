import * as angular from 'angular';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import { pricingTableEditorService } from './pricingTableEditor.service'
import Handsontable from 'handsontable';
import * as _ from 'underscore';
import { templatesService } from '../../shared/services/templates.service';
import { ContractUtil } from '../contract.util';

/**
 * http://localhost:55490/Dashboard#/contractmanager/26006
 */

@Component({
    selector: 'pricingTableEditor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html',
    styleUrls: ['Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.css']
})
export class pricingTableEditorComponent implements OnInit {

    constructor(private pteService: pricingTableEditorService,
                private templateService: templatesService,
                private loggerService: logger) { }

    @Input() in_Cid: any;
    @Input() in_Ps_Id: any;
    @Input() in_Pt_Id: any;
    @Input() contractData: any;
    @Input() UItemplate: any;

    private curPricingStrategy: any = {};
    private curPricingTable:any={};
    private pricingTableData: any = {};
    private pricingTableTemplates: any = {};  // Contains templates for All Deal Types

    // Handsontable Variables
    private hotSettings: Handsontable.GridSettings;
    private dataset: any[]=null;
    private columns: Array<any>=null;
    private columnTitles: string[];
    // private columnTuples: ColumnTuple[];
    private id = "pricingTableInstance";


    getTemplateDetails(){
        // Get the Contract and Current Pricing Strategy Data
        this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.in_Ps_Id);
        // Get the Current Pricing Table data
        this.curPricingTable = ContractUtil.findInArray(this.curPricingStrategy["PRC_TBL"], this.in_Pt_Id);
        // Get template for the selected PT
        this.pricingTableTemplates = this.UItemplate["ModelTemplates"]["PRC_TBL_ROW"][`${this.curPricingTable.OBJ_SET_TYPE_CD}`];

    }
    getPTRDetails(){
        let vm= this;
        vm.pteService.readPricingTable(vm.in_Pt_Id).subscribe((response) => {
            vm.pricingTableData = response;
            vm.getTemplateDetails();
        }, (error) => {
            this.loggerService.error('pricingTableEditorComponent::readPricingTable::readTemplates:: service', error);
        });
    }
  
     
    ngOnInit(): void {
        this.getPTRDetails();
        // vm.hotSettings.colHeaders = vm.columnTitles;
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
              licenseKey: '8cab5-12f1d-9a900-04238-a4819',
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
            id: 9,
            name: "Jon Mil",
            address: "Kan Avenue",
            mobile: "456",
            amount: "4856",
            location: "OR",
            geo: "NAR",
            Date: "01/01/2020",
          },
          {
            id: 10,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
          },
          {
            id: 11,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
          },
          {
            id: 12,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
          },
          {
            id: 13,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
          },
          {
            id: 14,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
          },
          {
            id: 15,
            name: "",
            address: "",
            mobile: "",
            amount: "",
            location: "",
            geo: "",
            Date: "",
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
          licenseKey: "8cab5-12f1d-9a900-04238-a4819",
        }
  }

}

angular.module("app").directive(
    "pricingTableEditor",
    downgradeComponent({
        component: pricingTableEditorComponent,
    })
);

// class ColumnTuple {
//     public letter: string;
//     public title: string;

//     constructor(letterOrder: number, title: string) {
//         this.setLetter(letterOrder);
//         this.setTitle(title);
//     }

//     public setLetter(order: number) {
//         if (order >= 0) {


//             // this.letter = letter;
//         }
//     }

//     public setTitle(title: string) {
//         this.title = title;
//     }
// }
import * as angular from 'angular';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';
import { pricingTableEditorService } from './pricingTableEditor.service'
import Handsontable from 'handsontable';
import * as _ from 'underscore';
import { templatesService } from '../../shared/services/templates.service';

/**
 * http://localhost:55490/Dashboard#/contractmanager/26006
 */

@Component({
    selector: 'pricingTableEditor',
    templateUrl: 'Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.html',
    styleUrls: ['Client/src/app/contract/pricingTableEditor/pricingTableEditor.component.css']
})
export class pricingTableEditorComponent implements OnChanges, OnInit {

    constructor(private pteService: pricingTableEditorService,
                private templateService: templatesService,
                private loggerService: logger) { }

    @Input() in_Cid: any;
    @Input() in_Ps_Id: any;
    @Input() in_Pt_Id: any;
    public contractData: Array<any>;
    public curPricingStrategy: any = {};
    public pricingTableData: any = {};
    public pricingTableTemplates: any = {};  // Contains templates for All Deal Types

    // Handsontable Variables
    private hotSettings: Handsontable.GridSettings;
    private dataset: unknown[];
    private columnTitles: string[];
    // private columnTuples: ColumnTuple[];
    private id = "pricingTableInstance";

    ngOnChanges() {
        let vm= this;
        // Get the Contract and Current Pricing Strategy Data
        vm.pteService.readContract(vm.in_Cid).subscribe((response) => {
            vm.contractData = response[0];
            vm.curPricingStrategy = vm.findInArray(vm.contractData["PRC_ST"], vm.in_Ps_Id);
               // Get the Current Pricing Table data
                vm.pteService.readPricingTable(vm.in_Pt_Id).subscribe((response) => {
                    vm.pricingTableData = response;
                    // Get Pricing Table Templates
                    vm.templateService.readTemplates().subscribe((response) => {
                        vm.pricingTableTemplates = (response["ModelTemplates"])["PRC_TBL"];
                          // Set columns from Pricing Table Template
                        vm.columnTitles = vm.getColumns(vm.getCurrentPricingTableTemplate());
                        // vm.hotSettings.colHeaders = vm.columnTitles;
                        vm.hotSettings = {
                            licenseKey: 'non-commercial-and-evaluation',
                            colHeaders: vm.columnTitles,
                            data: Handsontable.helper.createSpreadsheetData()
                        }
                    }, (error) => {
                        this.loggerService.error('pricingTableEditorComponent::getPricingTableTemplates::readTemplates:: service', error);
                    });

                  
                });
        });
     
    }

    ngOnInit(): void {
        // this.hotSettings = {
        //     licenseKey: 'non-commercial-and-evaluation',
        //     colHeaders: true,
        //     data: Handsontable.helper.createSpreadsheetData()
        // }
    }

    private findInArray(input, id) {
        const len = input.length;
        for (let i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
    }

    private getPricingTableTemplates() {
        if (_.isEmpty(this.pricingTableTemplates)) {
            // For PTE Column Templates
            // PTR Template: PRC_TBL > use `columns` in deal type
            // Possibly add Caching since this response shouldn't change 
            this.templateService.readTemplates().subscribe((response) => {
                this.pricingTableTemplates = (response["ModelTemplates"])["PRC_TBL"];
            }, (error) => {
                this.loggerService.error('pricingTableEditorComponent::getPricingTableTemplates::readTemplates:: service', error);
            });
        }
    }

    private getCurrentPricingTableTemplate() {
        if (!_.isEmpty(this.curPricingStrategy)) {
            const pricingStrategyType = (this.curPricingStrategy.PRC_TBL[0].OBJ_SET_TYPE_CD);
            const pricingStrategyTemplate = this.pricingTableTemplates[pricingStrategyType];
            console.log(pricingStrategyTemplate);

            return pricingStrategyTemplate;
        }
    }

    getColumns(pricingStrategyTemplate) {
        let columns: string[] = [];
        // let columns: ColumnTuple[] = [];
        // let columnLetterCounter = 0;

        if (!_.isEmpty(pricingStrategyTemplate) && pricingStrategyTemplate) {
            pricingStrategyTemplate.columns.forEach(currentColumn => {
                columns.push(currentColumn.title);
                // columns.push(new ColumnTuple(columnLetterCounter, currentColumn.title));
                // columnLetterCounter += 1;
            });
        }

        return columns;
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
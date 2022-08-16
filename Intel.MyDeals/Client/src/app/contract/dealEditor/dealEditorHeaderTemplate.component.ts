import * as angular from 'angular';
import { Component, Input, ViewEncapsulation} from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
    selector: 'deal-editor-header',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorHeaderTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorHeaderTemplateComponent{

    constructor() {}
    @Input() in_Field_Name: string = '';
    @Input() in_Header_Template: string = '';
    @Input() in_Title: string = '';
    @Input() grid_Result;

    selectAllIDs(event) {
        const isDealToolsChecked = event.target.checked;
        for (var i = 0; i < this.grid_Result.length; i++) {
            if (!(this.grid_Result[i].SALESFORCE_ID != "" && this.grid_Result[i].WF_STG_CD == 'Offer'))
                this.grid_Result[i].isLinked = isDealToolsChecked;
        }        
    }
}
angular.module("app").directive(
    "dealEditorHeader",
    downgradeComponent({
        component: dealEditorHeaderTemplateComponent,
    })
);
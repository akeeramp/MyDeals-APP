import * as angular from 'angular';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import * as _ from 'underscore';

@Component({
    selector: 'deal-editor-header',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorHeaderTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorHeaderTemplateComponent implements OnInit{

    constructor() {}
    @Input() in_Field_Name: string = '';
    @Input() in_Header_Template: string = '';
    @Input() in_Title: string = '';
    @Input() grid_Result;
    public is_Deal_Tools_Checked: boolean;
    
    selectAllIDs(event) {
        this.is_Deal_Tools_Checked = event.target.checked;
        for (let i = 0; i < this.grid_Result.length; i++) {
            if (!(this.grid_Result[i].SALESFORCE_ID !== "" && this.grid_Result[i].WF_STG_CD === 'Offer'))
                this.grid_Result[i].isLinked = this.is_Deal_Tools_Checked;
        }
    }
    checkAllSelected() {
        let gridData = this.grid_Result.filter(item => {
            return !(item.SALESFORCE_ID !== "" && item.WF_STG_CD === 'Offer')
            
        })
        if (gridData.length == 0) {
            return false;
        }
        for (let i = 0; i < gridData.length; i++) {
            if (gridData[i].isLinked === undefined || gridData[i].isLinked === false)
                return false;
        }
        return true;
    }
    ngOnInit() {
        this.is_Deal_Tools_Checked = this.checkAllSelected();
    }
}
angular.module("app").directive(
    "dealEditorHeader",
    downgradeComponent({
        component: dealEditorHeaderTemplateComponent,
    })
);
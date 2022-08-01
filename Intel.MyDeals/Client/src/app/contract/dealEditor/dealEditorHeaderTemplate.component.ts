import * as angular from 'angular';
import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
    selector: 'deal-editor-header',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorHeaderTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorHeaderTemplateComponent {

    constructor() {}
    @Input() in_Field_Name: string = '';
    @Input() in_Header_Template: string = '';
    @Input() in_Title: string = '';
    private isDealToolsChecked: boolean = false;
    @Output() public selectAllData: EventEmitter<void> = new EventEmitter()
    clkAllItems(): void {
        this.selectAllData.emit();
    }
}

angular.module("app").directive(
    "dealEditorHeader",
    downgradeComponent({
        component: dealEditorHeaderTemplateComponent,
    })
);
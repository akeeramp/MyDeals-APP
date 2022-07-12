import * as angular from 'angular';
import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { logger } from '../../shared/logger/logger';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
    selector: 'deal-editor-header',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorHeaderTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorHeaderTemplateComponent {

    constructor(private loggerService: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @Input() in_Field_Name: string = '';
    @Input() in_Header_Template: string = '';
    @Input() in_Title: string = '';
    private isDealToolsChecked: boolean = false;
    @Output() public selectAllData: EventEmitter<void> = new EventEmitter()
    clkAllItems(): void {
        this.selectAllData.emit();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
    ngOnInit() { }
}

angular.module("app").directive(
    "dealEditorHeader",
    downgradeComponent({
        component: dealEditorHeaderTemplateComponent,
    })
);
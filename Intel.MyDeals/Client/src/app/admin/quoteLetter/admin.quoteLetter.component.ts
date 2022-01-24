import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { quoteLetterService } from "./admin.quoteLetter.service";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { saveAs } from 'file-saver';
import * as _ from "underscore";

@Component({
    selector: "quoteLetter",
    templateUrl: "Client/src/app/admin/quoteLetter/admin.quoteLetter.component.html",
    styleUrls: ['Client/src/app/admin/quoteLetter/admin.quoteLetter.component.css']
})

export class QuoteLetterComponent {
    constructor(private quoteLetterSvc: quoteLetterService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    //created for Angular loader
    public isLoading: string = 'true';
    public loadMessage: string = "Quote Letter is Loading ...";
    public moduleName: string = "Quote Letter Dashboard";

    private menuItems: Array<any> = [];
    private menuItemsTemplate: Array<any> = [];
    private isDropdownsLoaded: boolean = false;
    private selectedTemplate: any = null;
    private headerInfo: string = "";
    private bodyInfo: string = "";

    loadAdminTemplate() {
        let vm = this;
        //loader stops
        vm.isLoading = 'false';
        if ((<any>window).usrRole != "Legal" && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            vm.quoteLetterSvc.adminGetTemplates()
                .subscribe(response => {
                    vm.menuItems = [];
                    for (let d = 0; d < response.length; d++) {
                        if (response[d]["OBJ_SET_TYPE_CD"] !== "KIT" || response[d]["PROGRAM_PAYMENT"] !== "FRONTEND") {
                            vm.menuItems.push(response[d]);
                        }
                    }

                    // For all menu items, set MenuText by concat OBJ_SET_TYPE_CD and PROGRAM_PAYMEN .
                    for (var i = 0; i < vm.menuItems.length; i++) {
                        vm.menuItems[i].MenuText = vm.menuItems[i].OBJ_SET_TYPE_CD + "-" + vm.menuItems[i].PROGRAM_PAYMENT;
                        vm.menuItemsTemplate.push(vm.menuItems[i].MenuText);
                    }
                    vm.isDropdownsLoaded = true;

                }, function (response) {
                    this.loggerSvc.error("Unable to get template data.", response, response.statusText);
                });
            
        }
    }

    onTemplateChange(selectedItem) {
        this.headerInfo = selectedItem.HDR_INFO;
        this.bodyInfo = selectedItem.BODY_INFO;
    }

    onSaveChangesClick() {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminSaveTemplate(this.selectedTemplate)
            .subscribe(response => {
                let selectedItemIndex;
                // Sync vm.menuItems w/ the changes that were just saved, then rebind the templates combobox.
                for (var i = 0; i < this.menuItems.length; i++) {
                    if (this.menuItems[i].TMPLT_SID == this.selectedTemplate.TMPLT_SID) {
                        this.menuItems[i] = this.selectedTemplate;
                        selectedItemIndex = i;
                    }
                }

                this.loggerSvc.success("Saved " + this.menuItems[selectedItemIndex].MenuText + " content.");
            }, function (response) {
                    this.loggerSvc.error("Unable to save changes.", response, response.statusText);
            });
    };

    onGeneratePreviewClick() {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminPreviewQuoteLetterTemplate(this.selectedTemplate)
            .subscribe(response => {
                let contentDisposition = response.headers.get('content-disposition');
                let filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                saveAs(response.body, filename);

                this.loggerSvc.success("Successfully generated quote letter preview.");
                
            }, function (response) {
                this.loggerSvc.error("Unable to generate quote letter preview.", response, response.statusText);
            });
           
    };  

    ngOnInit() {
        this.loadAdminTemplate();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular
    .module("app")
    .directive("quoteLetter",
        downgradeComponent({ component: QuoteLetterComponent })
    );

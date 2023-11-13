import { logger } from "../../shared/logger/logger";
import { quoteLetterService } from "./admin.quoteLetter.service";
import { Component } from "@angular/core";
import { saveAs } from 'file-saver';
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";

@Component({
    selector: "quote-letter",
    templateUrl: "Client/src/app/admin/quoteLetter/admin.quoteLetter.component.html",
    styleUrls: ['Client/src/app/admin/quoteLetter/admin.quoteLetter.component.css']
})

export class QuoteLetterComponent implements PendingChangesGuard{

    constructor(private quoteLetterSvc: quoteLetterService, private loggerSvc: logger) { }

    //created for Angular loader
    isDirty = false;
    public isLoading = 'true';
    public loadMessage = "Quote Letter is Loading ...";
    public moduleName = "Quote Letter Dashboard";

    private menuItems: Array<any> = [];
    private menuItemsTemplate: Array<any> = [];
    private isDropdownsLoaded = false;
    private selectedTemplate: any = null;
    private headerInfo = "";
    private bodyInfo = "";

    loadAdminTemplate() {
        this.isLoading = 'false';
        if ((<any>window).usrRole != "Legal" && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.quoteLetterSvc.adminGetTemplates()
                .subscribe(response => {
                    this.menuItems = [];
                    for (let d = 0; d < response.length; d++) {
                        if (response[d]["OBJ_SET_TYPE_CD"] !== "KIT" || response[d]["PROGRAM_PAYMENT"] !== "FRONTEND") {
                            this.menuItems.push(response[d]);
                        }
                    }

                    // For all menu items, set MenuText by concat OBJ_SET_TYPE_CD and PROGRAM_PAYMEN .
                    for (let i = 0; i < this.menuItems.length; i++) {
                        this.menuItems[i].MenuText = this.menuItems[i].OBJ_SET_TYPE_CD + "-" + this.menuItems[i].PROGRAM_PAYMENT;
                        this.menuItemsTemplate.push(this.menuItems[i].MenuText);
                    }
                    this.isDropdownsLoaded = true;

                }, function (response) {
                    this.loggerSvc.error("Unable to get template data.", response, response.statusText);
                });
            
        }
    }

    onTemplateChange(selectedItem) {
        this.isDirty=true;
        this.headerInfo = selectedItem.HDR_INFO;
        this.bodyInfo = selectedItem.BODY_INFO;
    }

    onSaveChangesClick() {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminSaveTemplate(this.selectedTemplate)
            .subscribe(() => {
                let selectedItemIndex;
                // Sync this.menuItems w/ the changes that were just saved, then rebind the templates combobox.
                for (let i = 0; i < this.menuItems.length; i++) {
                    if (this.menuItems[i].TMPLT_SID == this.selectedTemplate.TMPLT_SID) {
                        this.menuItems[i] = this.selectedTemplate;
                        selectedItemIndex = i;
                    }
                }

                this.loggerSvc.success("Saved " + this.menuItems[selectedItemIndex].MenuText + " content.");
            }, function (response) {
                    this.loggerSvc.error("Unable to save changes.", response, response.statusText);
            });
    }

    onGeneratePreviewClick() {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminPreviewQuoteLetterTemplate(this.selectedTemplate)
            .subscribe(response => {
                const contentDisposition = response.headers.get('content-disposition');
                const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                saveAs(response.body, filename);

                this.loggerSvc.success("Successfully generated quote letter preview.");
                
            }, function (response) {
                this.loggerSvc.error("Unable to generate quote letter preview.", response, response.statusText);
            });
           
    }  

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }
    
    ngOnInit() {
        this.loadAdminTemplate();
    }
}
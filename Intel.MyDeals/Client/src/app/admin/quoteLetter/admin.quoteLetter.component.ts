import { logger } from "../../shared/logger/logger";
import { quoteLetterService } from "./admin.quoteLetter.service";
import { Component, OnDestroy } from "@angular/core";
import { saveAs } from 'file-saver';
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminQuoteLetter } from "./admin.quoteLetter.model";

@Component({
    selector: "quote-letter",
    templateUrl: "Client/src/app/admin/quoteLetter/admin.quoteLetter.component.html",
    styleUrls: ['Client/src/app/admin/quoteLetter/admin.quoteLetter.component.css']
})

export class QuoteLetterComponent implements PendingChangesGuard, OnDestroy {

    constructor(private quoteLetterSvc: quoteLetterService, private loggerSvc: logger) { }

    //created for Angular loader
    isDirty = false;
    public isLoading = 'true';
    public loadMessage = "Quote Letter is Loading ...";
    public moduleName = "Quote Letter Dashboard";

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private menuItems: Array<AdminQuoteLetter> = [];
    private menuItemsTemplate: Array<string> = [];
    private isDropdownsLoaded = false;
    private selectedTemplate: AdminQuoteLetter = null;
    private headerInfo = "";
    private bodyInfo = "";

    loadAdminTemplate(): void {
        this.isLoading = 'false';
        this.quoteLetterSvc.adminGetTemplates()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: AdminQuoteLetter[]) => {
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

    onTemplateChange(selectedItem: AdminQuoteLetter): void {
        this.isDirty = true;
        this.headerInfo = selectedItem.HDR_INFO;
        this.bodyInfo = selectedItem.BODY_INFO;
    }

    onSaveChangesClick(): void {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminSaveTemplate(this.selectedTemplate)
            .pipe(takeUntil(this.destroy$))
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

    onGeneratePreviewClick(): void {
        this.selectedTemplate.HDR_INFO = this.headerInfo;
        this.selectedTemplate.BODY_INFO = this.bodyInfo;
        this.quoteLetterSvc.adminPreviewQuoteLetterTemplate(this.selectedTemplate)
            .pipe(takeUntil(this.destroy$))
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

    ngOnInit(): void {
        this.loadAdminTemplate();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
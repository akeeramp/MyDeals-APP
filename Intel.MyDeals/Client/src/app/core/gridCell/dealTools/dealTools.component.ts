import { Component, Input, ViewEncapsulation, Output, EventEmitter,OnDestroy } from "@angular/core";
import { logger } from '../../../shared/logger/logger';
import { GridUtil } from "../../../contract/grid.util";
import { DE_Load_Util } from "../../../contract/DEUtils/DE_Load_util";
import { dealToolsService } from '../dealTools/dealTools.service';
import { countBy, each } from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { dealTimelineComponent } from '../dealTimelineModal/dealTimelineModal.component';
import { fileAttachmentComponent } from '../fileAttachmentModal/fileAttachmentModal.component';
import { distinct } from "@progress/kendo-data-query";
import { PricingTableEditorService } from "../../../contract/pricingTableEditor/pricingTableEditor.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    providers: [dealToolsService],
    selector: "deal-tools-angular",
    templateUrl: "Client/src/app/core/gridCell/dealTools/dealTools.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealTools/dealTools.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealToolsComponent implements OnDestroy {
    
    constructor(private dataService: dealToolsService, private loggerSvc: logger, protected dialog: MatDialog, private pteService: PricingTableEditorService) {}
    @Input() dataItem;
    @Input() gridData;
    @Input() contractData;
    @Input() isSplitEnabled;
    @Input() isFileAttachmentEnabled;
    @Input() isHistoryEnabled;
    @Input() isCommentEnabled;
    @Input() isEditable;
    @Input() isQuoteLetterEnabled;
    @Input() isDeleteEnabled;
    @Input() isManageTab;
    @Input() in_Is_Tender_Dashboard: boolean = false;//this will passed as true if its used in Tender Dashboard Screen
    @Input() gridResult: any = '';
    @Input() IsExpiredDealHighlighted: boolean = false;
    @Input() NumberOfDaysToExpireDeal: number;
    @Output() iconSaveUpdate: EventEmitter<any> = new EventEmitter<any>();
    @Output() refreshContract: EventEmitter<any> = new EventEmitter<any>();
    @Output() reloadFn = new EventEmitter<any>();
    @Output() removeDeletedRow = new EventEmitter<any>();
    public isSalesForceDeal;
    public isPublishable;
    public isDaUser;  
    public editable: boolean;
    public C_VIEW_ATTACHMENTS: boolean= this.dataService.chkDealRules('C_VIEW_ATTACHMENTS', (<any>window).usrRole, null, null, null);
    private isTenderContract = false;
    public openSplitDialog: boolean = false;
    public isBusy = false;
    public isBusyMsgTitle = "";
    public isBusyMsgDetail = "";
    public isBusyType = "";
    public isBusyShowFunFact = "";
    public openNotesDialog: boolean = false;
    public alertDelete: boolean = false;
    public confirmDelete: boolean = false;
    public alertCancel: boolean = false;
    public confirmCancel: boolean = false;
    public alertRollback: boolean = false;
    public confirmRollback: boolean = false;
    public openHoldDialog: boolean = false;
    public openUnHoldDialog: boolean = false;
    private isValidationMessage: boolean = false;
    public validationMsg: string = '';
    public gridDataTmp: any = [];
    public dealTxt;
    public notes;
    public isModified: boolean = false;
    private objTypeSid;
    private windowOpened = false;
    private windowTop = 320; windowLeft = 670; windowWidth = 620; windowHeight = 500; windowMinWidth = 100;
    messages: any;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private fileItems = {
        "NoPerm": {
            "icon": "intelicon-attach",
            "title": "You do not have permission to view attachments",
            "style": { color: "#e7e7e8" }
        },
        "CantAdd": {
            "icon": "intelicon-attach",
            "title": "Cancelled, cannot add an attachment",
            "style": { color: "#e7e7e8" }
        },
        "AddFile": {
            "icon": "intelicon-attach",
            "title": "Click to add an attachment",
            "style": { color: "#00AEEF", cursor: "pointer" }
        },
        "HasFile": {
            "icon": "intelicon-attach",
            "title": "Click to view or add attachments",
            "style": { color: "#003C71", cursor: "pointer" }
        }
    }
    private holdItems = {
        "NoShowHold": { // The rest of this item don't really matter since it is bypassing drawing all together, but....
            "icon": "fa fa-hand-paper-o",
            "title": "Unable to place a hold on the deal at this stage",
            "style": { color: "#e7e7e8" }
        },
        "NoHold": {
            "icon": "fa fa-hand-paper-o",
            "title": "Unable to place a hold on the deal at this stage",
            "style": { color: "#e7e7e8" }
        },
        "TakeOffHold": {
            "icon": "fa fa-thumbs-o-up",
            "title": "Click to take the deal off hold",
            "style": { color: "#FC4C02", cursor: "pointer" }
        },
        "CantRemoveHold": {
            "icon": "fa fa-thumbs-o-up",
            "title": "Unable to take the deal off of hold at this stage",
            "style": { color: "#e7e7e8" }
        },
        "CanHold": {
            "icon": "fa fa-hand-paper-o",
            "title": "Click to place the deal on hold",
            "style": { cursor: "pointer" }
        }
    }

    loadDealTools() {
        let distinctData;
        if (this.dataItem.DC_ID != undefined) {
            distinctData = distinct(this.gridData, 'DC_ID');
        }
        else {
            distinctData = distinct(this.gridData, 'DEAL_ID');//contract manage tab
        }
        let childParent = countBy(distinctData, 'DC_PARENT_ID');
        each(this.gridData, item => {
            item['_parentCnt'] = childParent[`${item.DC_PARENT_ID}`]
        });

        this.objTypeSid = 5; //WIP deals
        if (!this.in_Is_Tender_Dashboard)// If not Tender Dashboard Screen, check deal is tende ror not from contract data 
            this.isTenderContract = this.contractData["IS_TENDER"] == "1" ? true : false;
        else// Tender Dashboard always have tender deals only
            this.isTenderContract = true;
        if(typeof this.isTenderContract !== 'undefined') {
            this.isTenderContract = (this.isTenderContract == true);
        }        
        if (this.dataItem.PS_WF_STG_CD === undefined && this.dataItem.items !== undefined) {
            this.dataItem = this.dataItem.items[0];
        }
        if (!this.isEditable || this.isEditable === "false" || this.isEditable === false || this.dataItem.PS_WF_STG_CD == "Cancelled") {
            this.editable = false;
        }
        else {
            this.editable = true;
        }
        if (this.dataItem?.SALESFORCE_ID === undefined || this.dataItem?.SALESFORCE_ID === "") {
            this.isSalesForceDeal = false;
        }
        else {
            this.isSalesForceDeal = true;
        }
        if (this.dataItem._dirty || this.dataItem.isDirtyFile) this.isModified = true;
        else this.isModified = false;
                
        // Swap IF statement to prevent IQR from having access to quote letters
        if (this.dataItem?.OBJ_SET_TYPE_CD !== 'ECAP' && this.dataItem?.OBJ_SET_TYPE_CD !== 'KIT')
            this.isQuoteLetterEnabled = false;
        
        this.isDaUser = ((<any>window).usrRole === "DA");//SalesForce Checkbox Disabled icon except for DA users
        if (this.dataItem && !this.dataItem._settings) {
            this.dataItem._settings = {};
        }
        this.dataItem._settings.C_HOLD_DEALS = ((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA" || (<any>window).usrRole === "DA");
        this.dataItem._settings.C_DEL_DEALS = (((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA") && (this.dataItem?.SALESFORCE_ID === undefined || this.dataItem?.SALESFORCE_ID === ""));

        if (this.dataItem?._settings.C_DEL_DEALS === undefined || this.dataItem?._settings.C_DEL_DEALS === false) {
            // In tenders screen for DA user, this is undefined but skipping over
            this.isDeleteEnabled = false;
        }
        //PS object is holding the Pricing Strategy ID with Pricing Strategy Status
        this.dataItem.PS = {};
        if (this.contractData.PRC_ST) {
            each(this.contractData.PRC_ST, item => {
                this.dataItem.PS[item.DC_ID] = item.IS_HYBRID_PRC_STRAT;
            });
        }
        this.dealTxt = this.getLinkedHoldIds(this.dataItem).length > 1 ? "deals" : "deal";
    }

    setBusy(msg, detail, msgType, isShowFunFact) {
        setTimeout(() => {
            let newState = msg != undefined && msg !== "";
            if (isShowFunFact == null) {
                isShowFunFact = false;
            }
            // if no change in state, simple update the text
            if (this.isBusy === newState) {
                this.isBusyMsgTitle = msg;
                this.isBusyMsgDetail = !detail ? "" : detail;
                this.isBusyType = msgType;
                this.isBusyShowFunFact = isShowFunFact;
                return;
            }
            this.isBusy = newState;
            if (this.isBusy) {
                this.isBusyMsgTitle = msg;
                this.isBusyMsgDetail = !detail ? "" : detail;
                this.isBusyType = msgType;
                this.isBusyShowFunFact = isShowFunFact;
            }
            else {
                setTimeout(() => {
                    this.isBusyMsgTitle = msg;
                    this.isBusyMsgDetail = !detail ? "" : detail;
                    this.isBusyType = msgType;
                    this.isBusyShowFunFact = isShowFunFact;
                }, 500);
            }
        });
    }
    stgFullTitleChar() {

    return this.IsExpiredDealHighlighted && this.isDealExpired(this.dataItem.END_DT)
        ? 'This deal is Expired'
        : GridUtil.stgFullTitleChar(this.dataItem);
    }
    stgOneChar() {
        return this.IsExpiredDealHighlighted && this.isDealExpired(this.dataItem.END_DT)
            ? 'X'
            : GridUtil.stgOneChar(this.dataItem);
    }
    getStageBgColorStyle = function (c) {
        return { backgroundColor: DE_Load_Util.getColorStage(c) };
    }
   
    private isDealExpired(endDate: string): boolean {
        const today = new Date();
        const dealEndDate = new Date(endDate);
        const expirationDate = new Date(dealEndDate.setDate(dealEndDate.getDate() + this.NumberOfDaysToExpireDeal));
        return today >= expirationDate;
    }
    getDealStageStyle(): { [key: string]: string } {
        return this.IsExpiredDealHighlighted && this.isDealExpired(this.dataItem.END_DT)
            ? { 'background-color': 'red' }
            : this.getStageBgColorStyle(this.stgFullTitleChar());
    }
    closeDialogs() {
        this.openSplitDialog = false;
        this.openNotesDialog = false;
        this.alertDelete = false;
        this.confirmDelete = false;
        this.alertCancel = false;
        this.confirmCancel = false;
        this.alertRollback = false;
        this.confirmRollback = false;
        this.openHoldDialog = false;
        this.openUnHoldDialog = false;
        //TWC3179-4696: refresh DE post click on alert message 
        if (this.isValidationMessage) {
            this.refreshContract.emit(true);
            this.isValidationMessage = false;
        }
    }
    //split items    
    openSplit() {
        this.openSplitDialog = true;        
    }
    split() {
        this.closeDialogs();
        this.setBusy("Splitting Deals...", "Splitting the Grouped Pricing Table Row into separate deals", "","");
        this.dataItem._dirty = false;
        // Remove from DB first... then remove from screen
        this.dataService.unGroupPricingTableRow(this.dataItem.CUST_MBR_SID, this.contractData.DC_ID, this.dataItem.DC_PARENT_ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (!!response.Messages[0].MsgType && response.Messages[0].MsgType !== 1) {
                    this.setBusy("Splitting Failed", "Unable to Split the Pricing Table Row", "","");
                    setTimeout(() => {
                        this.setBusy("", "", "","");
                    }, 4000);
                    return;
                }
                // update local data with new ids to prevent the need to refresh the screen
                if (!!response.Messages) {
                    each(response.Messages, item => {
                        var dcId = item.KeyIdentifiers[0];
                        var dcParentId = item.KeyIdentifiers[1];
                        var dcPrdTitle = item.ExtraDetails[0];
                        var dcKitName = item.ExtraDetails[1];

                        if (this.gridData !== undefined) {
                            each(this.gridData, row => {
                                if (row.DC_ID === dcId) {
                                    row.DC_PARENT_ID = dcParentId;
                                    row._parentCnt = 1;
                                    row.PTR_USER_PRD = dcPrdTitle;
                                    if (dcKitName !== "") {
                                        row.DEAL_GRP_NM = dcKitName;
                                    }
                                }
                            })
                        }
                    });
                }
                this.refreshContract.emit(true);
                this.setBusy("Split Successful", "Split the Pricing Table Row into single Deals", "Success","");
                setTimeout(() => {
                    this.setBusy("", "", "","");
                }, 4000);
            }, (response)=> {
                this.loggerSvc.error("Could not split the Pricing Table Row.", response, response.statusText);
            });
    }
    //notes items
    openNotes() {
        this.openNotesDialog = true;
        this.notes = this.dataItem?.NOTES;
    }
    saveCell(newField) {
        if (this.dataItem?._behaviors === undefined)
            this.dataItem._behaviors = {};
        if (this.dataItem?._behaviors.isDirty === undefined)
            this.dataItem._behaviors.isDirty = {};
        this.dataItem._behaviors.isDirty[newField] = true;
        this.dataItem._dirty = true;
    }
    saveFileCell(newField) {
        if (this.dataItem?._behaviors === undefined)
            this.dataItem._behaviors = {};
        if (this.dataItem?._behaviors.isDirtyFile === undefined)
            this.dataItem._behaviors.isDirtyFile = {};
        this.dataItem._behaviors.isDirtyFile[newField] = true;
        this.dataItem.isDirtyFile = true;
    }
    saveNotes() {
        if (this.dataItem?.NOTES !== this.notes) {
            this.dataItem.NOTES = this.notes;
            this.saveCell("NOTES");
            /* Storing the deal note value for the particular deal */
            for (let i = 0; i < this.gridDataTmp.length; i++) {
                if (this.gridDataTmp[i].DC_ID == this.dataItem.DC_ID) {
                    this.gridDataTmp[i]['isdirty'] = true;
                    this.gridDataTmp[i].NOTES = this.dataItem.NOTES
                }
            }

            if (this.isManageTab) {
                this.setBusy("Saving", "Please wait while your information is being saved.", "", "");

                const data = {
                    objSetType: "WIP_DEAL",
                    ids: [this.dataItem["DC_ID"]],
                    attribute: "NOTES",
                    value: this.dataItem["NOTES"]
                };
                let custId, dcId;
                if (!this.in_Is_Tender_Dashboard) {// If not Tender Dashboard Screen, take cust ID and contract ID from contract data 
                    custId = this.contractData.CUST_MBR_SID;
                    dcId = this.contractData.DC_ID;
                }
                else {//If Tender Dashboard, take cust ID and contract ID from dataItem
                    custId = this.dataItem.CUST_MBR_SID;
                    dcId = this.dataItem._contractId;
                }
                this.pteService.updateAtrbValue(custId, dcId, data).toPromise()
                        .then((output) => {
                            this.setBusy("Done", "Save Complete.", "", "");
                            setTimeout(() => {
                                this.isBusy = false;
                                }, 2000);
                            
                        })
                        .catch((err) => {
                        this.setBusy("Error", "Could not save the value.", "Error", "");
                        this.loggerSvc.error("Error", "Could not save the Notes value.", err);
                        setTimeout(() => {
                            this.isBusy = false;
                        }, 2000);
                        });              
            }
            this.iconSaveUpdate.emit(this.dataItem._dirty);
        }
        this.closeDialogs();
    }

    //deal timeline
    clkHistoryIcon(dataItem) {
        if (this.dataItem.DC_ID != undefined) {
            const dialogRef = this.dialog.open(dealTimelineComponent, {
                data: {
                    dataItem: dataItem,
                    item: {
                        objSid: this.dataItem.DC_ID,
                        objTypeSid: 5,
                        objTypeIds: [5]
                    }
                },
                minWidth: '750px',
                panelClass: 'historyModal'
            });
        }
        else {
            const dialogRef = this.dialog.open(dealTimelineComponent, {
                data: {
                    dataItem: dataItem,
                    item: {
                        objSid: this.dataItem.DEAL_ID,
                        objTypeSid: 5,
                        objTypeIds: [5]
                    }
                },
                minWidth: '750px',
                panelClass: 'historyModal'
            });
        }
    }
    // FILES Items
    getFileValue(dataItem) {
        if (!this.dataItem?._settings.C_VIEW_ATTACHMENTS)
            return "NoPerm";
        if (this.isFileAttachmentEnabled) {
            if (!this.dataItem?.HAS_ATTACHED_FILES || this.dataItem?.HAS_ATTACHED_FILES === '0') {
                if (this.dataItem?.PS_WF_STG_CD === 'Cancelled') return "CantAdd";
                if (this.dataItem?.PS_WF_STG_CD !== 'Cancelled') return "AddFile";
            }            
            return "HasFile";
        }
        return "NoPerm";
    }    
    getFileIcon(dataItem) {
        return this.fileItems[this.getFileValue(this.dataItem)].icon;
    }
    getFileStyle(dataItem) {
        return this.fileItems[this.getFileValue(this.dataItem)].style;
    }
    getFileTitle(dataItem) {
        return this.fileItems[this.getFileValue(this.dataItem)].title;
    }
    clkFileIcon(dataItem) {
        let fVal = this.getFileValue(dataItem);
        if (fVal === "HasFile" || fVal === "AddFile") {
            this.openAttachments();
        }
    }
    openAttachments(){
        const dialogRef = this.dialog.open(fileAttachmentComponent, {
            maxWidth: '900px',
            height: '620px',
            panelClass: 'attach-style',
            data: {
                dataItem: this.dataItem
            }
        });
        this.saveFileCell("HAS_ATTACHED_FILES");
    }
    //Quotes Item
    showQuote(dataItem) {
        let excludeStages = ['Cancelled', 'Lost'];
        let includeStages = ['Active', 'Pending', 'Offer', 'Won'];
        return excludeStages.indexOf(this.dataItem?.WF_STG_CD) < 0 && (includeStages.indexOf(this.dataItem?.WF_STG_CD) >= 0 || this.dataItem?.HAS_TRACKER === '1');
    }
    downloadQuoteLetter() {
        let downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + this.dataItem.CUST_MBR_SID + "/" + this.objTypeSid + "/" + this.dataItem.DC_ID + "/0";
        window.open(downloadPath, '_blank', '');
    }
    //Delete/Rollback/Cancel Item
    getLinkedIds(){
        let ids = [];
        if (this.dataItem?.isLinked !== undefined && this.dataItem?.isLinked) {
            each(this.gridResult, row => {
                if (row.isLinked !== undefined && row.isLinked) {
                    ids.push(row["DC_ID"]);
                }
            });
        }
        return ids;
    }
    openDeleteDialog() {
        if (this.getLinkedIds().length > 1) {
            this.alertDelete = true;
            return;
        }
        this.confirmDelete = true;
    }
    async deletePricingTableRow() {
        if (!this.in_Is_Tender_Dashboard) {// If not Tender Dashboard Screen, delete Pricing table row
            this.closeDialogs();
            this.setBusy("Deleting...", "Deleting the Pricing Table Row and Deal", "", "");
            this.dataItem._dirty = false;
            let ptrId = this.dataItem.DC_PARENT_ID;
            // Remove from DB first... then remove from UI
            let response = await this.dataService.deletePricingTableRow(this.dataItem.CUST_MBR_SID, this.contractData.DC_ID, ptrId).toPromise().catch((response) => {
                //TWC3179-4696: added user failure alert for deal deletion
                this.validationMsg = 'The Deal is not deleted correctly, Please click "OK" and reload the page.';
                this.isValidationMessage = true; //User alert flag 
                this.loggerSvc.error("Could not delete the Pricing Table " + ptrId, response, response.statusText);
                this.setBusy("", "", "", "");
            })
            if (response.MsgType !== 1) {
                this.setBusy("Delete Failed", "Unable to Delete the Pricing Table", "Error", "");
                setTimeout(() => {
                    this.setBusy("", "", "", "");
                }, 4000);
                return;
            }
            let row = null;
            each(this.gridData, (item, ind) => {
                if (item && item.DC_PARENT_ID && item.DC_PARENT_ID === ptrId)
                    row = this.gridData.splice(ind, 1);
            });
            this.refreshContract.emit(true);
            this.isBusy = false
            this.loggerSvc.success("Delete Successful", "Deleted the Pricing Table Row and Deal");
            //return to pte screen...call loadPTE() from pte component
            if (this.gridData.length == 0) {
                this.reloadFn.emit('');
            }
        }
        else {// If Tender Dashboard Screen, delete Pricing Strategy Id
            this.closeDialogs();
            this.setBusy("Deleting...", "Deleting Tender Deal " + this.dataItem.DC_ID + " information", "", "");
            this.dataItem._dirty = false;
            let psId = this.dataItem._parentIdPS;
            let response = await this.dataService.deletePricingStrategyById(this.dataItem.CUST_MBR_SID, this.dataItem._contractId, psId).toPromise().catch((response) => {
                this.loggerSvc.error("Could not delete the Tender Deal " + psId, response, response.statusText);
                this.setBusy("", "", "", "");
            })
            if (response) {
                if (response.MsgType !== 1) {
                    this.setBusy("Delete Failed", "Unable to Delete the Pricing Table", "Error", "");
                    setTimeout(() => {
                        this.setBusy("", "", "", "");
                    }, 4000);
                    return;
                }
            }
            each(this.gridData, (item, ind) => {
                if (item && item._parentIdPS && item._parentIdPS === psId)
                    this.gridData.splice(ind, 1);
            });
            this.removeDeletedRow.emit(psId);
            this.isBusy = false
            this.loggerSvc.success("Delete Successful", "Deleted the tender Deal");
            if (this.gridData.length == 0) {
                this.reloadFn.emit('');
            }
        }
    }
    openCancelDialog() {
        if (this.getLinkedIds().length > 1) {
            this.alertCancel = true;
            return;
        }
        this.confirmCancel = true;
    }
    actionWipDeal() {
        this.closeDialogs();
        this.setBusy("Cancelling Deal...", "Please wait as we cancel the Deal!", "Info", true);
        let custId, dcId;
        if (!this.in_Is_Tender_Dashboard) {// If not Tender Dashboard Screen, take cust ID and contract ID from contract data 
            custId = this.contractData.CUST_MBR_SID;
            dcId = this.contractData.DC_ID;
        }
        else {// If Tender Dashboard Screen, take cust ID and contract ID from dataItem
            custId = this.dataItem.CUST_MBR_SID;
            dcId = this.dataItem._contractId;
        }
        this.dataService.actionWipDeal(custId, dcId, this.dataItem, 'Cancel')
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                setTimeout(() => {
                    this.setBusy("Cancel Successful", "Reloading the Deal", "Success",true);
                    //After migrating tender dashboard, one condition needs to be added to not show message board for tender deals
                    if (!this.in_Is_Tender_Dashboard) {
                        this.windowOpened = true;
                        this.messages = response.Messages;
                    }
                    else {
                        this.refreshContract.emit(true);
                    }
                    this.setBusy("", "", "", "");
                }, 50);
            }, (response)=> {
                this.loggerSvc.error("Unable to cancel Wip Deal","Error",response);
                this.setBusy("", "","","");
            });
    }
    openRollBackDialog() {
        if (this.getLinkedIds().length > 1) {
            this.alertRollback = true;
            return;
        }
        this.confirmRollback = true;
    }
    rollbackPricingTableRow() {
        this.closeDialogs();
        this.setBusy("Rolling Back...", "Rolling Back the Pricing Table Row and Deal", "","");
        this.dataItem._dirty = false;
        let dcId;
        if (!this.in_Is_Tender_Dashboard) {// If not Tender Dashboard Screen, take contract ID from contract data 
            dcId = this.contractData.DC_ID;
        }
        else {// If Tender Dashboard Screen, take contract ID from dataItem
            dcId = this.dataItem._contractId
        }
        // Remove from DB first... then remove from screen
        this.dataService.rollbackPricingTableRow(this.dataItem.CUST_MBR_SID, dcId, this.dataItem.DC_PARENT_ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response.MsgType !== 1) {
                    this.setBusy("Rollback Failed", "Unable to Rollback the Pricing Table", "Error","");
                    setTimeout(() => {
                        this.setBusy("", "","","");
                    }, 4000);
                    return;
                }
                this.setBusy("Rollback Successful", "Rollback of the Pricing Table Row and Deal", "Success","");
                setTimeout(() => {
                    this.isBusy = false;
                }, 4000);
                setTimeout(() => {
                    this.refreshContract.emit(true);
                }, 4000);
                
            }, (response)=> {
                this.loggerSvc.error("Could not Rollback the Pricing Table " + dcId, response, response.statusText);
                this.setBusy("", "", "","");
            });                
    }
    //Hold Items
    //All of hold is broken for Tender dashboard because it is undefined since it has a scoping issue, but for tender deals, we SHOULD NOT HAVE HOLD anyhow..  It is 1:1 with PS.
    getHoldValue(dataItem) {
        if (this.dataItem?.WF_STG_CD === 'Active' || this.dataItem?.WF_STG_CD === 'Won')
            return 'NoShowHold';
        if (this.dataItem?._actionsPS === undefined)
            this.dataItem._actionsPS = {};
        if (this.dataItem?.WF_STG_CD === 'Hold') {
            if (!!this.dataItem?._actionsPS.Hold)
                return 'TakeOffHold'; // !! = If it exists - If deal is on hold and I can hold from hold stage...
            else
                return 'CantRemoveHold';
        }
        else {
            if ((!!this.dataItem?._actionsPS.Hold && this.dataItem?._actionsPS.Hold === true) && this.dataItem?.WF_STG_CD !== 'Cancelled')
                return 'CanHold';
            else
                return 'NoHold';
        }
    }
    // This will return Pricing Strategy enabled or not to show hold icon
    getHoldVisibility(dataItem) {
        let isPSEnabled = {};
        if (this.dataItem.OBJ_PATH_HASH !== undefined && this.dataItem.OBJ_PATH_HASH != "") {
            isPSEnabled = JSON.parse(this.dataItem.OBJ_PATH_HASH);
            if (this.dataItem.PS[isPSEnabled["PS"]] === "1")
                return true; // this.$parent.$parent.$parent.PS = 0 if isPSEnabled is undefined.
        }
        else { // Remove the else block, just using this in case we need to ID what objects are causing problems
            if(dataItem.DC_ID != undefined)
                console.log("Object hash that is breaking: " + dataItem.OBJ_PATH_HASH + ', DataItem: ' + dataItem.dc_type + '-' + dataItem.DC_ID);
            else
                console.log("Object hash that is breaking: " + dataItem.OBJ_PATH_HASH + ', DataItem: ' + dataItem.dc_type + '-' + dataItem.DEAL_ID);
        }
        return false;
    }
    getHoldIcon() {
        return this.holdItems[this.getHoldValue(this.dataItem)].icon;
    }
    getHoldStyle() {
        if (!this.dataItem._settings.C_HOLD_DEALS) {
            return { color: "#dddddd" };
        }
        else {
            return this.holdItems[this.getHoldValue(this.dataItem)].style;
        }
    }
    getHoldTitle() {
        if (!this.dataItem._settings.C_HOLD_DEALS) {
            return "";
        }
        else {
            return this.holdItems[this.getHoldValue(this.dataItem)].title;
        }
    }

    getLinkedHoldIds(model){
        let ids = [];
        if (model.isLinked !== undefined && model.isLinked) {
            let curHoldStatus = model._actionsPS.Hold === undefined ? false : model._actionsPS.Hold;
            /* checking that all grid result values are on hold and linked */
            each(this.gridResult, dataItem => {
                if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                    if (dataItem?._actionsPS === undefined)
                        dataItem._actionsPS = {};
                    if (dataItem?._actionsPS.Hold !== undefined && dataItem?._actionsPS.Hold === curHoldStatus && (dataItem.WF_STG_CD === model.WF_STG_CD)) {
                        if (model["DC_ID"] != undefined) {
                            ids.push({
                                DC_ID: dataItem["DC_ID"],
                                WF_STG_CD: dataItem["WF_STG_CD"]
                            });
                        }
                        else {
                            ids.push({
                                DC_ID: dataItem["DEAL_ID"],
                                WF_STG_CD: dataItem["WF_STG_CD"]
                            });
                        }
                    }
                }
            });
        }
        else {
            if (model["DC_ID"] != undefined) {
                ids.push({
                    DC_ID: model["DC_ID"],
                    WF_STG_CD: model["WF_STG_CD"]
                });
            }
            else {
                ids.push({
                    DC_ID: model["DEAL_ID"],
                    WF_STG_CD: model["WF_STG_CD"]
                });
            }
        }
        return ids;
    }
    clkHoldIcon() {
        if (!this.dataItem._settings.C_HOLD_DEALS)
            return;
        let hVal = this.getHoldValue(this.dataItem);
        if (hVal === "CanHold")
            this.openHoldDialog = true;
        if (hVal === "TakeOffHold")
            this.openUnHoldDialog = true;
    }
    actionHoldWipDeals(dataItem, stage: string) {
        const selectedDealIds = this.getLinkedHoldIds(dataItem);
        let dealIdsObj = {}
        dealIdsObj[stage] = selectedDealIds;
        this.openHoldDialog = false;
        this.openUnHoldDialog = false;
        this.setBusy("Updating Deals", "Updating hold status of Deals.", "", "");
        this.dataService.actionWipDeals(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, dealIdsObj).pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                
                if (response) {
                    this.windowOpened = true;
                    this.messages = response.Messages;
                }
                this.setBusy("", "", "", "");
                //removing timeout as the popup should be manually closed 
                /*if (response.Messages[0].ShortMessage != 'Hold') {
                    setTimeout(() => {
                        this.windowOpened = false;
                    }, 4000);
                }*/
               
            }, (response) => {
                //TWC3179-4696: added user failure alert for deal hold/unhold
                this.validationMsg = 'The Deal is not kept on/off hold correctly, Please click "OK" and reload the page.';
                this.isValidationMessage = true; //User alert flag 
                this.loggerSvc.error("Unable to update hold status of deals","Error",response);
                this.setBusy("", "", "", "");
            });
    }
    windowClose() {
        this.windowOpened = false;
        this.refreshContract.emit(true);
        document.body.classList.remove('conManages');
    }
    singleClick() {
        document.body.classList.add('conManages');
    }
    ngOnChanges() {
        this.loadDealTools();
        /* After deleting other deals, if the remaining deal notes have value, they should remain */
        for (let i = 0; i < this.gridDataTmp.length; i++) {
            if (this.gridDataTmp[i]['isdirty'] == true) {
                this.dataItem.NOTES = this.gridDataTmp[i].NOTES
            }
        }
    }
    ngOnInit() {
        this.gridDataTmp = JSON.parse(JSON.stringify(this.gridData));
        for (let i = 0; i < this.gridDataTmp.length; i++) {
            this.gridDataTmp[i]['isdirty'] = false;
        }
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

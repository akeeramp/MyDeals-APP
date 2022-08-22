import * as angular from "angular";
import { Component, Input, ViewEncapsulation} from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from '../../../shared/logger/logger';
import { GridUtil } from "../../../contract/grid.util";
import { DE_Load_Util } from "../../../contract/DEUtils/DE_Load_util";
import { dealToolsService } from '../dealTools/dealTools.service';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { dealTimelineComponent } from '../dealTimelineModal/dealTimelineModal.component';

@Component({
    providers: [dealToolsService],
    selector: "deal-tools-angular",
    templateUrl: "Client/src/app/core/gridCell/dealTools/dealTools.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealTools/dealTools.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class dealToolsComponent{
    constructor(private dataService: dealToolsService, private loggerSvc: logger, protected dialog: MatDialog) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
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
    public dealTxt;
    public notes;
    private objTypeSid;
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
            "style": { color: "#00AEEF", cursor: "pointer" },
            "onClick": this.openAttachments()
        },
        "HasFile": {
            "icon": "intelicon-attach",
            "title": "Click to view or add attachments",
            "style": { color: "#003C71", cursor: "pointer" },
            "onClick": this.openAttachments()
        }
    }
    private holdItems = {
        "NoShowHold": { // The rest of this item don't really matter since it is bypassing drawing all together, but....
            "icon": "fa fa-hand-paper-o",
            "title": "Unable to place a hold on the deal at this stageXX",
            "style": { color: "#e7e7e8" }
        },
        "NoHold": {
            "icon": "fa fa-hand-paper-o",
            "title": "Unable to place a hold on the deal at this stageXX",
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
        let childParent = _.countBy(this.gridData, 'DC_PARENT_ID');
        _.each(this.gridData, item => {
            item['_parentCnt'] = childParent[`${item.DC_PARENT_ID}`]
        });

        this.objTypeSid = 5; //WIP deals
        
        this.isTenderContract = this.contractData["IS_TENDER"] == "1" ? true : false;
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
        if (this.dataItem.SALESFORCE_ID === undefined || this.dataItem.SALESFORCE_ID === "") {
            this.isSalesForceDeal = false;
        }
        else {
            this.isSalesForceDeal = true;
        }
        if (!!this.isEditable)
            this.isEditable = false;
                
        // Swap IF statement to prevent IQR from having access to quote letters
        if (this.dataItem.OBJ_SET_TYPE_CD !== 'ECAP' && this.dataItem.OBJ_SET_TYPE_CD !== 'KIT')
            this.isQuoteLetterEnabled = false;
        
        this.isDaUser = ((<any>window).usrRole === "DA");//SalesForce Checkbox Disabled icon except for DA users

        this.dataItem._settings.C_HOLD_DEALS = ((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA" || (<any>window).usrRole === "DA");
        this.dataItem._settings.C_DEL_DEALS = (((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA") && (this.dataItem.SALESFORCE_ID === undefined || this.dataItem.SALESFORCE_ID === ""));

        if (this.dataItem._settings.C_DEL_DEALS === undefined || this.dataItem._settings.C_DEL_DEALS === false) {
            // In tenders screen for DA user, this is undefined but skipping over
            this.isDeleteEnabled = false;
        }
        //PS object is holding the Pricing Strategy ID with Pricing Strategy Status
        this.dataItem.PS = {};
        if (this.contractData.PRC_ST) {
            for (let i = 0; i < this.contractData.PRC_ST.length; i++) {
                this.dataItem.PS[this.contractData.PRC_ST[i].DC_ID] = this.contractData.PRC_ST[i].IS_HYBRID_PRC_STRAT;
            }
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
        return GridUtil.stgFullTitleChar(this.dataItem);
    }
    stgOneChar() {
        return GridUtil.stgOneChar(this.dataItem);
    }
    getStageBgColorStyle = function (c) {
        return { backgroundColor: DE_Load_Util.getColorStage(c) };
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
                    for (var m = 0; m < response.Messages.length; m++) {
                        var dcId = response.Messages[m].KeyIdentifiers[0];
                        var dcParentId = response.Messages[m].KeyIdentifiers[1];
                        var dcPrdTitle = response.Messages[m].ExtraDetails[0];
                        var dcKitName = response.Messages[m].ExtraDetails[1];

                        if (this.gridData !== undefined) {
                            for (var d = 0; d < this.gridData.length; d++) {
                                if (this.gridData[d].DC_ID === dcId) {
                                    this.gridData[d].DC_PARENT_ID = dcParentId;
                                    this.gridData[d]._parentCnt = 1;
                                    this.gridData[d].PTR_USER_PRD = dcPrdTitle;
                                    if (dcKitName !== "") {
                                        this.gridData[d].DEAL_GRP_NM = dcKitName;
                                    }
                                }
                            }
                        }
                    }
                }

                //$scope.$broadcast('updateGroup', data.data.Messages);
                // refresh upper contract
                //if (wip !== undefined) $scope.refreshContractData(wip.DC_ID);

                this.setBusy("Split Successful", "Split the Pricing Table Row into single Deals", "Success","");
                setTimeout(() => {
                    this.setBusy("", "", "","");
                }, 4000);
            }, function (response) {
                this.loggerSvc.error("Could not split the Pricing Table Row.", response, response.statusText);
            });
    }
    //notes items
    openNotes() {
        this.openNotesDialog = true;
        this.notes = this.dataItem.NOTES;
    }
    saveCell(newField) {
        if (this.dataItem._behaviors === undefined)
            this.dataItem._behaviors = {};
        if (this.dataItem._behaviors.isDirty === undefined)
            this.dataItem._behaviors.isDirty = {};
        this.dataItem._behaviors.isDirty[newField] = true;
        this.dataItem._dirty = true;
        //broadcast
    }
    saveNotes() {
        if (this.dataItem.NOTES !== this.notes) {
            this.dataItem.NOTES = this.notes;
            this.saveCell("NOTES");
        }
        this.closeDialogs();
    }
    clkHistoryIcon(dataItem) {
        const dialogRef = this.dialog.open(dealTimelineComponent, {
            data: {
                dataItem: dataItem,
                item: {
                    objSid: this.dataItem.DC_ID,
                    objTypeSid: 5,
                    objTypeIds: [5]
                }
            }            
        });
    }
    // FILES Items
    getFileValue(dataItem) {
        if (!this.dataItem._settings.C_VIEW_ATTACHMENTS)
            return "NoPerm";
        if (this.isFileAttachmentEnabled) {
            if (!this.dataItem.HAS_ATTACHED_FILES || this.dataItem.HAS_ATTACHED_FILES === '0') {
                if (this.dataItem.PS_WF_STG_CD === 'Cancelled') return "CantAdd";
                if (this.dataItem.PS_WF_STG_CD !== 'Cancelled') return "AddFile";
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
        //const dialogRef = this.dialog.open(FileAttachmentComponent, {
        //    width: '900px',
        //    height: '620px',
        //    disableClose: false,
        //    });
        //dialogRef.afterClosed().subscribe(result => {
            
        //});
    }
    //Quotes Item
    showQuote(dataItem) {
        let excludeStages = ['Cancelled', 'Lost'];
        let includeStages = ['Active', 'Pending', 'Offer', 'Won'];
        return excludeStages.indexOf(this.dataItem.WF_STG_CD) < 0 && (includeStages.indexOf(this.dataItem.WF_STG_CD) >= 0 || this.dataItem.HAS_TRACKER === '1');
    }
    downloadQuoteLetter() {
        let downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + this.dataItem.CUST_MBR_SID + "/" + this.objTypeSid + "/" + this.dataItem.DC_ID + "/0";
        window.open(downloadPath, '_blank', '');
    }
    //Delete/Rollback/Cancel Item
    getLinkedIds(){
        let ids = [];
        if (this.dataItem.isLinked !== undefined && this.dataItem.isLinked) {
            for (let i = 0; i < this.gridData.length; i++) {
                if (this.gridData[i].isLinked !== undefined && this.gridData[i].isLinked) {
                    ids.push(this.gridData[i]["DC_ID"]);
                }
            }
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
    deletePricingTableRow() {
        this.closeDialogs();
        this.setBusy("Deleting...", "Deleting the Pricing Table Row and Deal", "","");
        this.dataItem._dirty = false;
        let ptrId = this.dataItem.DC_PARENT_ID;
        // Remove from DB first... then remove from screen
        this.dataService.deletePricingTableRow(this.dataItem.CUST_MBR_SID, this.contractData.DC_ID, ptrId)
            .subscribe((response: any) => {
                if (response.MsgType !== 1) {
                    this.setBusy("Delete Failed", "Unable to Delete the Pricing Table", "Error","");
                    setTimeout(() => {
                        this.setBusy("", "", "","");
                    }, 4000);
                    return;
                }
                let row = null;
                for (var d = 0; d < this.gridData.length; d++) {
                    if (this.gridData[d].DC_PARENT_ID === ptrId)
                        row = this.gridData.splice(d, 1);
                }
                this.setBusy("Delete Successful", "Deleted the Pricing Table Row and Deal", "Success","");
                setTimeout(() => {
                    this.setBusy("", "", "","");
                }, 4000);
            }, function (response) {
                this.loggerSvc.error("Could not delete the Pricing Table " + ptrId , response, response.statusText);
                this.setBusy("", "", "","");
            });
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
        this.setBusy("Updating Wip Deal...", "Please wait as we update the Wip Deal!", "Info", true);
        this.dataService.actionWipDeal(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, this.dataItem, 'Cancel')
            .subscribe((response: any) => {
                //this.syncHoldItems(response, { Cancel: [this.dataItem] });
                //$scope.$broadcast('refreshStage', { Cancel: [this.dataItem] });
                
            }, function (response) {
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
        // Remove from DB first... then remove from screen
        this.dataService.rollbackPricingTableRow(this.dataItem.CUST_MBR_SID, this.contractData.DC_ID, this.dataItem.DC_PARENT_ID)
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
                    this.setBusy("", "", "","");
                }, 4000);

                //$scope.reloadPage();$state.reload();

            }, function (response) {
                this.loggerSvc.error("Could not Rollback the Pricing Table " + this.contractData.DC_ID, response, response.statusText);
                this.setBusy("", "", "","");
            });                
    }
    //Hold Items
    //All of hold is broken for Tender dashboard because it is undefined since it has a scoping issue, but for tender deals, we SHOULD NOT HAVE HOLD anyhow..  It is 1:1 with PS.
    getHoldValue(dataItem) {
        if (this.dataItem.WF_STG_CD === 'Active' || this.dataItem.WF_STG_CD === 'Won')
            return 'NoShowHold';
        if (this.dataItem._actionsPS === undefined)
            this.dataItem._actionsPS = {};
        if (this.dataItem.WF_STG_CD === 'Hold') {
            if (!!this.dataItem._actionsPS.Hold)
                return 'TakeOffHold'; // !! = If it exists - If deal is on hold and I can hold from hold stage...
            else
                return 'CantRemoveHold';
        }
        else {
            if ((!!this.dataItem._actionsPS.Hold && this.dataItem._actionsPS.Hold === true) && this.dataItem.WF_STG_CD !== 'Cancelled')
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
            console.log("Object hash that is breaking: " + dataItem.OBJ_PATH_HASH + ', DataItem: ' + dataItem.dc_type + '-' + dataItem.DC_ID);
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
    getLinkedHoldIds(dataItem){
        let ids = [];
        if (dataItem.isLinked !== undefined && dataItem.isLinked) {
            let curHoldStatus = dataItem._actionsPS.Hold === undefined ? false : dataItem._actionsPS.Hold;
            for (let v = 0; v < this.gridData.length; v++) {
                if (this.gridData[v].isLinked !== undefined && this.gridData[v].isLinked) {
                    if (this.gridData[v]._actionsPS === undefined)
                        this.gridData[v]._actionsPS = {};
                    if (this.gridData[v]._actionsPS.Hold !== undefined && this.gridData[v]._actionsPS.Hold === curHoldStatus && (this.gridData[v].WF_STG_CD === dataItem.WF_STG_CD)) {
                        ids.push({
                            DC_ID: dataItem["DC_ID"],
                            WF_STG_CD: dataItem["WF_STG_CD"]
                        });
                    }
                }
            }
        }
        else {
            ids.push({
                DC_ID: dataItem["DC_ID"],
                WF_STG_CD: dataItem["WF_STG_CD"]
            });
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
    actionHoldWipDeals(data) {
        this.openHoldDialog = false;
        this.openUnHoldDialog = false;
        this.setBusy("Updating Deals", "Updating hold status of Deals.", "", "");
        this.dataService.actionWipDeals(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, data)
            .subscribe((response: any) => {
                //this.syncHoldItems(response, data);
                this.setBusy("", "", "", "");
            }, function (response) {
                this.setBusy("", "", "", "");
            });
    }

    ngOnChanges(){
        this.loadDealTools();
    }
}
angular.module("app").directive(
    "dealToolsAngular",
    downgradeComponent({
        component: dealToolsComponent,
    })
);
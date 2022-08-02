import * as angular from "angular";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { logger } from '../../../shared/logger/logger';
import { GridUtil } from "../../../contract/grid.util";
import { DE_Load_Util } from "../../../contract/DEUtils/DE_Load_util";
import { dealToolsService } from '../dealTools/dealTools.service';
import * as _ from 'underscore';

@Component({
    providers: [dealToolsService],
    selector: "deal-tools-angular",
    templateUrl: "Client/src/app/core/gridCell/dealTools/dealTools.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealTools/dealTools.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class dealToolsComponent {
    constructor(private dataService: dealToolsService, private loggerService: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @Input() dataItem;
    @Input() gridData;
    @Input() isSplitEnabled;
    @Input() isFileAttachmentEnabled;
    @Input() isHistoryEnabled;
    @Input() isCommentEnabled;
    @Input() isEditable;
    @Input() isQuoteLetterEnabled;
    @Input() isDeleteEnabled;
        
    private isSalesForceDeal;
    private isPublishable;
    private isDaUser;  
    private editable: boolean;
    private C_VIEW_ATTACHMENTS: boolean= this.dataService.chkDealRules('C_VIEW_ATTACHMENTS', (<any>window).usrRole, null, null, null);
    private isTenderContract = false;
    private openSplitDialog = false;
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

        this.isTenderContract = this.dataItem["IS_TENDER"] == "1" ? true : false;
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
        if (this.dataItem.PRC_ST) {
            for (let i = 0; i < this.dataItem.PRC_ST.length; i++) {
                this.dataItem.PS[this.dataItem.PRC_ST[i].DC_ID] = this.dataItem.PRC_ST[i].IS_HYBRID_PRC_STRAT;
            }
        }        
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
    closeSplit() {
        this.openSplitDialog = false;
    }
    openSplit() {
        this.openSplitDialog = true;        
    }
    doSplit(dataItem) {
        //migrate unGroupPricingTableRow() from contract controller with dataItem as parameter
    }
    openNotes() {
        //yet to migrate
    }
    clkHistoryIcon(dataItem) {
        //yet to migrate
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
        var fVal = this.getFileValue(dataItem);
        if (fVal === "HasFile" || fVal === "AddFile") {
            this.openAttachments();
        }
    }
    openAttachments(){
        //yet to migrate
    }
    //Quotes Item
    showQuote(dataItem) {
        let excludeStages = ['Cancelled', 'Lost'];
        let includeStages = ['Active', 'Pending', 'Offer', 'Won'];
        return excludeStages.indexOf(this.dataItem.WF_STG_CD) < 0 && (includeStages.indexOf(this.dataItem.WF_STG_CD) >= 0 || this.dataItem.HAS_TRACKER === '1');
    }
    downloadQuoteLetter(customerSid, objTypeSid, objSid) {
        //yet to migrate
    }
    //Delete/Rollback/Cancel Item
    openDeleteDialog() {
        //yet to migrate
    }
    openCancelDialog() {
        //yet to migrate
    }
    openRollBackDialog() {
        //yet to migrate
    }
    //Hold Item
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
    getHoldIcon(dataItem) {
        return this.holdItems[this.getHoldValue(this.dataItem)].icon;
    }
    getHoldStyle(dataItem) {
        if (!this.dataItem._settings.C_HOLD_DEALS) {
            return { color: "#dddddd" };
        }
        else {
            return this.holdItems[this.getHoldValue(this.dataItem)].style;
        }
    }
    getHoldTitle(dataItem) {
        if (!this.dataItem._settings.C_HOLD_DEALS) {
            return "";
        }
        else {
            return this.holdItems[this.getHoldValue(this.dataItem)].title;
        }
    }
    clkHoldIcon(dataItem) {
        //yet to migrate
    }


    ngOnInit() {
        this.loadDealTools();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "deal-tools-angular",
    downgradeComponent({
        component: dealToolsComponent,
    })
);
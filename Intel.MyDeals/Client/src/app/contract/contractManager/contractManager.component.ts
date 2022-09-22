import * as angular from "angular";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { contractManagerservice } from "./contractManager.service";
import * as moment from "moment";
import { colorDictionary } from "../../core/angular.constants";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { GridUtil } from "../grid.util";
import { MatDialog } from "@angular/material/dialog";
import { actionSummaryModal } from "./actionSummaryModal/actionSummaryModal.component";
import { messageBoardModal } from "./messageBoard/messageBoard.component";
import { emailModal } from "./emailModal/emailModal.component";
import { FileRestrictions, UploadEvent } from "@progress/kendo-angular-upload";

export interface contractIds {
    Model: string;
    C_ID: number;
    ps_id: number;
    pt_id: number;
    ps_index: number;
    pt_index: number;
    contractData: any;
}

@Component({
    selector: "contract-manager",
    templateUrl: "Client/src/app/contract/contractManager/contractManager.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/contractManager.component.css']
})

export class contractManagerComponent {
    runIfStaleByHours = 3;
    forceRunValue = true;
    enabledPCT = false;
    contractId: any;
    lastRun: any;
    needToRunPct: boolean;
    text: string;
    isPending: boolean = false;
    curDataItems = [];
    canBypassEmptyActions: boolean = true;
    needToRunOverlaps = [];
    isRunning: boolean = false;
    messages: any;
    marks: any=[];
    hideIfNotPending: boolean;
    pendingWarningActions= false;
    custAccptButton: any ='';
    showPendingInfo: boolean= true;
    showPendingFile: boolean= false;
    showPendingC2A: boolean= false;
    showPendingWarning: boolean = false;
    showData: boolean = false;
    requestBody: any ={};
    showMeetCompDetails: boolean= false;
    public uploadSaveUrl = "/FileAttachments/Save";
    is_Deal_Tools_Checked: any = false;
    grid_Result: any =[];
    showMultipleDialog: boolean= false;
    pteTableData: any;
    files = [];
    psId = 0;
    ptId = 0;
    parent_dcId: any;
    constructor(protected dialog: MatDialog,private loggerSvc: logger, private contractManagerSvc:contractManagerservice, private lnavSvc: lnavService) {
        //pls dont remove this even it its not as part of the route this is to handle condtions when we traverse between contract details with in manage tab
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail

    private color: ThemePalette = 'primary';
    PCTResultView = false;
    public submitModal = false;
    OtherType = []; isECAP = []; isKIT = []
    @Input() public contractData:any;
    @Input() UItemplate:any;
    @Output() refreshedContractData = new EventEmitter;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    private spinnerMessageHeader = "Complete"; 
    private spinnerMessageDescription = "Reloading the page now.";
    public isLoading = false;
    private dirty = false;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {}; TrackerNbr = {}; emailCheck = {}; reviseCheck = {}; apprvCheck = {};
    private isCustAcptReadOnly: boolean = false;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    grid = { isECAPGrid: false, KITGrid: false, OtherGrid:false}
    public gridData: GridDataResult;
    gridDataSet = {}; approveCheckBox = false; emailCheckBox = false; reviseCheckBox = false;
    titleFilter = ""; canActionIcon = true; public isAllCollapsed = false; canEdit = true;
    title='';
    category='';
    type="block";
    start = moment();
    end=null;
    executionMs= 0;
    timeFormat="MM/DD/YYYY HH:mm:ss:SSS";
    lapse=0;
    private windowOpened= false;
    private windowTop = 200;windowLeft = 350;windowWidth = 620;windowHeight = 500;windowMinWidth = 100;
    public filteredData: any;
    uploadSuccess = false;
    // Allowed extensions for the attachments field
    myRestrictions: FileRestrictions = {
        allowedExtensions: ["doc", "xls", "txt", "bmp", "jpg", "pdf", "ppt", "zip", "xlsx", "docx", "pptx", "odt", "ods", "ott", "sxw", "sxc", "png", "7z", "xps"],
    };
    successEventHandler() {
        this.uploadSuccess = true;
    }
    onFileUploadError() {
        this.loggerSvc.error("Unable to upload " + " attachment(s).", "Upload failed");
    }
    uploadEventHandler(e: UploadEvent) {
        e.data = {
            custMbrSid: this.contractData.CUST_MBR_SID,
            objSid: this.contractData.DC_ID,
            objTypeSid: 1
        };
        this.contractData._behaviors.isRequired.C2A_DATA_C2A_ID = false;
        this.contractData["HAS_ATTACHED_FILES"] = "1";
    }
    selectAllIDs(event) {
        this.is_Deal_Tools_Checked = event.target.checked;
        for (let i = 0; i < this.grid_Result.length; i++) {
            if (!(this.grid_Result[i].SALESFORCE_ID !== "" && this.grid_Result[i].WF_STG_CD === 'Offer'))
                this.grid_Result[i].isLinked = this.is_Deal_Tools_Checked;
        }
    }
    checkAllSelected() {
        let grid_Data = this.grid_Result.filter(item => {
            return !(item.SALESFORCE_ID !== "" && item.WF_STG_CD === 'Offer')
            
        })
        if (grid_Data.length == 0) {
            return false;
        }
        for (let i = 0; i < grid_Data.length; i++) {
            if (grid_Data[i].isLinked === undefined || grid_Data[i].isLinked === false)
                return false;
        }
        return true;
    }
    updateSaveIcon(eventData: boolean) {
        this.dirty = eventData;
    }
    gridReload(eventData: boolean) {
        if (eventData){}
            // this.ngOnInit();
    }
    windowClose() {
        this.windowOpened = false;
      }
    toggleSum() {
        if (this.isAllCollapsed == true) {
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = true;
            });
        }
        if (this.isAllCollapsed == false) {
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = false;
            });
        }
        this.isAllCollapsed = !this.isAllCollapsed;
    }

    actionReason (actn, dataItem) {
        let rtn = "";
        if (!!dataItem._actionReasons && !!dataItem._actionReasons[actn]) {
            rtn = dataItem._actionReasons[actn];
        }
        return rtn;
    }

    getStageBgColorStyle = function (c) {
        return { backgroundColor: this.getColorStage(c) };
    }
    getColorStage  (d) {
        if (!d) d = "Draft";
        return this.getColor('stage', d);
    }
   getColor (k, c) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }

    getFormatedDim  (dataItem, field, dim, format) {
        const item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
        if (format === "currency") {
            const isDataNumber = /^\d + $/.test(item[dim]);
            if (isDataNumber) return item[dim];
            return (item[dim].includes('No')) ? item[dim]:'$' + item[dim];
        }
        return item[dim];
    }

    getmissingCapCostTitle (item) {
        let ret = "";
        if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1") {
            ret = "Missing CAP";
        }
        if (item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
            ret = "Missing Cost";
        }
        if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1" && item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
            ret = "Missing Cost and CAP";
        }
        return ret;
    }

    onCheckboxChange(checkBoxType, event, data) {
        if (!event.currentTarget.checked) {
            this[checkBoxType] = false;
        }
        let checkedList = [];
        if (event.target.id.indexOf("email") > 0) {
            var anyEmailChecked = false;
            const isItemChecked = event.target.checked;
            if (checkBoxType == "approveCheckBox" && this.canAction('Approve', data, false) && this.canAction('Approve', data, true) && this.canActionIcon) {
                this.apprvCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
            } else if (checkBoxType == "reviseCheckBox" && this.canAction('Revise', data, false) && this.canAction('Revise', data, true) && this.canActionIcon) {
                this.reviseCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : '';
            } else if (checkBoxType == "emailCheckBox" && this.canEmailIcon) {
                this.emailCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : '';
            }

            if (event.target.checked || anyEmailChecked) {
                this.canActionIcon = false;
                this.canEmailIcon = true;
            } else {
                this.canActionIcon = true;
                this.canEmailIcon = true;
            }
    
        }
        else {
            var anyActionChecked = false;
            const isItemChecked = event.target.checked;
            if (checkBoxType == "approveCheckBox" && this.canAction('Approve', data, false) && this.canAction('Approve', data, true) && this.canActionIcon) {
                this.apprvCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : '';
                if (this.reviseCheck[data.DC_ID])
                    this.reviseCheck[data.DC_ID] = false;
            } else if (checkBoxType == "reviseCheckBox" && this.canAction('Revise', data, false) && this.canAction('Revise', data, true) && this.canActionIcon) {
                this.reviseCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : '';
                if (this.apprvCheck[data.DC_ID])
                    this.apprvCheck[data.DC_ID] = false;
            } else if (checkBoxType == "emailCheckBox" && this.canEmailIcon) {
            this.emailCheck[data.DC_ID] = isItemChecked ? anyActionChecked = true : '';
            }
            if (event.target.checked || anyActionChecked) {
                this.canActionIcon = true;
                this.canEmailIcon = false;
            } else {
                this.canActionIcon = true;
                this.canEmailIcon = true;
            }
        }
    
        // clear global check
        this.approveCheckBox = false;
        this.reviseCheckBox = false;
        this.emailCheckBox = false;
    }
    pendingChange() {
        let fromToggle = true;
        this.togglePending(true);
    }
    togglePending(runActions) {
        if (!this.isPending) {
            this.isPending = true;
            this.contractData.CUST_ACCPT = "Pending";
            if (runActions) this.actionItems(true, false);
        } else {
            this.isPending = false;
            this.contractData.CUST_ACCPT = "Accepted";
            if (runActions) this.actionItems(true, true);
        }
    }
    closeDialog(){
        this.showPendingWarning = false;
        if(this.pendingWarningActions == true){
            this.isPending = !this.isPending;
            if(this.isPending){
                this.contractData.CUST_ACCPT = "Pending";
            } else {
                this.contractData.CUST_ACCPT = "Accepted";
            }
        }
    }
    showPending(page) {
        this.showPendingInfo = false;
        this.showPendingFile = false;
        this.showPendingC2A = false;
        if (page === "showPendingInfo") {
            this.showPendingInfo = true;
        } else if (page === "showPendingFile") {
            this.showPendingFile = true;
        } else if (page === "showPendingC2A") {
            this.showPendingC2A = true;
        }

    }


    actionItems(fromToggle, checkForRequirements) {
        if (fromToggle == undefined && checkForRequirements == undefined) {
            var ids = [];
            var anyEmailChecked = false;   
            let items = document.getElementsByClassName('psCheck-Email');
            for (var i = 0; i < items.length; i++)
                if ((items[i]  as HTMLInputElement).checked) {
                    let selectedIdarray = items[i].getAttribute('id').split('_');
                    ids.push(parseInt(selectedIdarray[2]));
                    anyEmailChecked = true;
                }

            if (anyEmailChecked) {
                this.openEmailMsg(ids);
                return;
            }         
        }

        if (fromToggle === undefined || fromToggle === null) fromToggle = false;
        if (checkForRequirements === undefined || checkForRequirements === null) checkForRequirements = false;

        let ps = this.contractData.PRC_ST;


        // look for checked ending
        if (ps !== undefined) {
            for (let p = 0; p < ps.length; p++) {
                if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0] != null && ($("#rad_approve_" + ps[p].DC_ID)[0] as HTMLInputElement).checked) {
                    this.isPending = true;
                    this.contractData.CUST_ACCPT = "Accepted";
                    checkForRequirements = true;
                }
            }
        }

        if (this.isPending === false && this.contractData.CUST_ACCPT !== "Pending" && (this.contractData.C2A_DATA_C2A_ID === "" && this.contractData.HAS_ATTACHED_FILES === "0")) {
            this.pendingWarningActions = true;
            this.showPendingWarning = true
            // this.dialogPendingWarning.open();
        } else if (this.isPending === false && this.contractData.CUST_ACCPT !== "Pending") {
            this.continueAction(fromToggle, false);
        } else if (this.isPending === true && this.contractData.CUST_ACCPT !== "Accepted") {
            this.continueAction(fromToggle, checkForRequirements);
        } else {
            this.actionItemsBase(null, true);
        };
    }
    openEmailMsg(ids) {
        let rootUrl = window.location.protocol + "//" + window.location.host;
        let items = [];

        // Check unique stages as per role
        var stageToCheck = "";
        if ((<any>window).usrRole == "DA") {
            stageToCheck = "Approved"
        } else if ((<any>window).usrRole == "GA") {
            stageToCheck = "Submitted"
        }

        // set this flag to false when stages are not unique as per role
        let stagesOK = true;

        for (let a = 0; a < this.contractData.PRC_ST.length; a++) {
            let stItem = this.contractData.PRC_ST[a];
            if (!!stItem && ids.indexOf(stItem.DC_ID) >= 0) {
                var item = {
                    "CUST_NM": this.contractData.Customer.CUST_NM,
                    "VERTICAL_ROLLUP": stItem.VERTICAL_ROLLUP,
                    "CNTRCT": "#" + this.contractData.DC_ID + " " + this.contractData.TITLE,
                    "C2A_ID": this.contractData.C2A_DATA_C2A_ID,
                    "DC_ID": stItem.DC_ID,
                    "NEW_STG": stItem.WF_STG_CD,
                    "TITLE": stItem.TITLE,
                    "url": rootUrl + "/advancedSearch#/gotoPs/" + stItem.DC_ID,
                    "contractUrl": rootUrl + "/Contract#/manager/" + this.contractData.DC_ID
                };

                if (stageToCheck != "" && stageToCheck != item.NEW_STG) {
                    stagesOK = false;
                }

                items.push(item);
            }
        }

        if (items.length === 0) {
            alert("No items were selected to email.");
            return;
        }

        let custNames = [];
        for (var x = 0; x < items.length; x++) {
            if (custNames.indexOf(items[x].CUST_NM) < 0)
                custNames.push(items[x].CUST_NM);
        }

        let subject = "";
        let eBodyHeader = "";

        if (stagesOK && (<any>window).usrRole === "DA") {
            subject = "My Deals Deals Approved for ";
            eBodyHeader = "My Deals Deals Approved!";
        } else if (stagesOK && (<any>window).usrRole === "GA") {
            subject = "My Deals Approval Required for "
            eBodyHeader = "My Deals Approval Required!";
        } else {
            subject = "My Deals Action Required for ";
            eBodyHeader = "My Deals Action Required!";
        }

        subject = subject + custNames.join(', ') + "!";

        let data = {
            from: (<any>window).usrEmail,
            items: items,
            eBodyHeader: eBodyHeader
        }

        var itemListRowString=``;
        for(let i=0; i<data.items.length; i++){
                itemListRowString =itemListRowString+ `<tr>
                <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span>`+data.items[i].CNTRCT+`</span> </td>
                <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span>`+ data.items[i].C2A_ID+`</span> </td>
                <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'><a href='${data.items[i].url}'>`+ data.items[i].DC_ID+`</a>*</span> </td>
                <td style='width:160px; font-size: 12px; font-family: sans-serif;'><span>`+ data.items[i].TITLE+`</span> </td>
                <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'>`+ data.items[i].VERTICAL_ROLLUP+`</span> </td>
                <td style='width:200px; font-size: 12px; font-family: sans-serif;'><span style='color:#767171;'>Moved to the `+ data.items[i].NEW_STG+` </span> </td>
                <td style='width:200px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'><a href='${data.items[i].url}'>View Pricing Strategy</a>*</span> </td>
            </tr>`
        }
        let valuemsg = `
        <div style='font-family:sans-serif;'>
        <p><span style='font-size:20px; color:#00AEEF; font-weight: 600'>My Deals Action Required!</span></p>
        <p><span style='font-size:18px;'>Pricing Strategies</span></p>
        <p><span style='font-size: 12px;'>The following list of Pricing Strategies have changed.  Click <strong style='color:#00AEEF;'>View Pricing Strategy</strong> in order to view details in My Deals.</span></p>
        <table>
            <thead>
                <tr>
                    <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Contract</strong></th>
                    <th style='text-align: left; width:80px; font-size: 12px; font-family: sans-serif;'><strong>C2A #</strong></th>
                    <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Strategy #</strong></th>
                    <th style='text-align: left; width:160px; font-size: 12px; font-family: sans-serif;'><strong>Strategy Name</strong></th>
                    <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Verticals</strong></th>
                    <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>New Stage</strong></th>
                    <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Action</strong></th>
                </tr>
            </thead>
            <tbody>`+itemListRowString+`
            </tbody>
        </table>
        <br />
        <p><span style='font-size: 11px; color: black; font-weight: bold;'>*Links are optimized for Google Chrome</span></p>
        <p><span style='font-size: 14px;'><b>Please respond to: </b> <a href='mailto:${data.from}'>`+data.from+`</a>.</span></p>
        <br />
        <p><span style='font-size: 14px; color: red;'><i>**This email was sent from a notification-only address that cannot accept incoming email.  Please do not reply to this message.</i></span></p>
        </div>
    `;
        var dataItem = {
            from: "mydeals.notification@intel.com",
            to: "",
            subject: subject,
            body: valuemsg
        };
        const dialogRef = this.dialog.open(emailModal, {
            width: "900px",
            height: "611px",
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
        });
    }

    getItem(items, actn) {
        var allPs = this.contractData.PRC_ST;
        let fullId = items.getAttribute('id')
        let idStringArray = fullId.split('_');
        let idString:string = idStringArray[2];
        var id = parseInt(idString);

        var result:any = $.grep(allPs, function (e: any) { return e.DC_ID === id; });
        var stage = result.length > 0 ? result[0].WF_STG_CD : "";
        var title = result.length > 0 ? result[0].TITLE : "";
        var hasL1 = result.length > 0 ? result[0].HAS_L1 !== "0" : false;

        return { "DC_ID": id, "WF_STG_CD": stage, "TITLE": title, "ACTN": actn, "HAS_L1": hasL1 };
    }

    getActionItems(data, dataItem, actn, actnText) {
        let ids = [];
        let items = $(".psCheck-" + actn);
        this.requestBody = data;
        for (var i = 0; i < items.length; i++) {
            if ((items[i] as HTMLInputElement).checked) {
                var item = this.getItem(items[i], actnText);
                ids.push(item);
                dataItem.push(item);
                if (item.WF_STG_CD === "Requested" && actn === "Approve") {
                    this.needToRunOverlaps.push(item.DC_ID);
                }
            }
        }

        if (ids.length > 0) data[actn] = ids;
    }


    clkAllRow(e, checkBoxType) {
        const isItemChecked = e.currentTarget.checked;
        // In the UI based on sone conditions checkboxes will be shown on hidden, so while checking the check boxes on click of All check box we have to check the conditions and then select the check box
        if (this.contractData.PRC_ST !== undefined) {
            this.contractData.PRC_ST.map((x) => {
                if (this.hasVertical(x)) {
                    if (checkBoxType == "Approve" && this.canAction('Approve', x, false) && this.canAction('Approve', x, true) && this.canActionIcon) { 
                        this.reviseCheck[x.DC_ID] = false;
                        this.emailCheck[x.DC_ID] =  false;
                        this.apprvCheck[x.DC_ID] = isItemChecked ? true : false;
                        this.approveCheckBox = true;
                        this.reviseCheckBox = false;
                        this.emailCheckBox = false;
                      }
                    else if (checkBoxType == "Revise" && this.canAction('Revise', x, false) && this.canAction('Revise', x, true) && this.canActionIcon) {
                        this.apprvCheck[x.DC_ID] = false;
                        this.emailCheck[x.DC_ID] = false;
                        this.reviseCheck[x.DC_ID] = isItemChecked ? true : false;
                        this.approveCheckBox = false;
                        this.reviseCheckBox = true;
                        this.emailCheckBox = false;
                        }
                    else if (checkBoxType == "Email" && this.canEmailIcon) {
                        this.apprvCheck[x.DC_ID] = false;
                        this.reviseCheck[x.DC_ID] = false;
                        this.emailCheck[x.DC_ID] = isItemChecked ? true : false;                         this.approveCheckBox = false;
                        this.reviseCheckBox = false;
                        this.emailCheckBox = true; 
                     }
                }

            });
        }
        
    }

    canAction(actn, dataItem, isExists) {
        return dataItem._actions[actn] !== undefined && (isExists || dataItem._actions[actn] === true);
    }

    hasVertical(dataItem) {
        let psHasUserVerticals = true;
        if ((<any>window).usrRole === "DA") {
            if ((<any>window).usrVerticals.length > 0) {
                const userVerticals = (<any>window).usrVerticals.split(",");
                const dataVerticals = dataItem.VERTICAL_ROLLUP.split(",");
                psHasUserVerticals =  userVerticals.some((v) => dataVerticals.indexOf(v) >= 0);
            }
            return psHasUserVerticals;
            // else, DA is All Verticals and gets a free pass
        }
        return psHasUserVerticals;
    }

  
    concatDimElements (passedData, field) {
        const data = [];
        const checkField=!!passedData[field];
        if (checkField) {
            Object.keys(passedData[field]).forEach(function (key, index) {
                if (key.indexOf("___") >= 0) {
                    data.push(passedData[field][key]);
                }
            });
        }
        this.TrackerNbr[passedData.DC_ID]= data.join(", ");
        const tmplt = '<span class="ng-binding">' + this.TrackerNbr[passedData.DC_ID] + '</span>';
        return tmplt;
    }


    togglePt(pt) {
        const ptDcId = pt.DC_ID;
        //check whether arrow icon is expanded/collapsed ,only if it is expanded then call API to get the data
        if (this.isPTExpanded[ptDcId]) {
            this.contractManagerSvc.getWipSummary(pt.DC_ID).subscribe((response) => {
                if (response !== undefined) {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].WF_STG_CD === "Draft") response[i].WF_STG_CD = response[i].PS_WF_STG_CD;
                        if (response[i].WF_STG_CD === "Hold") response[i].PASSED_VALIDATION = "Complete";
                        if (response[i].OBJ_SET_TYPE_CD == "ECAP") {
                            this.isECAP[ptDcId] = true; this.OtherType[ptDcId] = false; this.isKIT[ptDcId] = false
                        }
                        else if (response[i].OBJ_SET_TYPE_CD == "KIT") { this.isECAP[ptDcId] = false; this.OtherType[ptDcId] = false; this.isKIT[ptDcId] = true }
                        else { this.OtherType[ptDcId] = true; this.isECAP[ptDcId] = false; this.isKIT[ptDcId] = false }
                    }

                    this.gridData = response;
                    this.gridDataSet[pt.DC_ID] = this.gridData;
                    this.grid_Result= this.gridDataSet[pt.DC_ID];
                }
            }, (error) => {
                this.loggerSvc.error('Get WIP Summary service', error);
            })
        }
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
    }
    needMct() {
        if (!this.contractData.PRC_ST || this.contractData.PRC_ST.length === 0) return false;

        for (var m = 0; m < this.contractData.PRC_ST.length; m++) {
            var item = this.contractData.PRC_ST[m].COMP_MISSING_FLG;
            if (item !== "" && (item === "1" || item === 1)) {
                return true;
            }
        }
        return false;
    }
    showingHelpTopicContract() {
        const helpTopic = "Features";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    public close(status: string): void {
        this.submitModal = false;
    }
    submitContract(): void {
        this.actionItems(null, null);
    }
    executePctViaBtn() {
        this.isLoading = true;
        this.executePct();
    }
    executePct() {
        this.isRunning = true;
        this.contractManagerSvc.runPctContract(this.contractData.DC_ID).subscribe((res) => {
            this.isRunning = false;
            this.loadContractDetails();
            this.isLoading = false;

        }, (err) => {
            this.isRunning = false;
            this.isLoading = false;
            this.loggerSvc.error("Could not run Cost Test for contract " + this.contractId, err);
        });
        
    }
    lastRunDisplay(value) {
        this.text = value;
        if (this.isRunning) {
            return "Running " + this.text;
        }
        
        if (!this.enabledPCT && this.lastRun) {

            // Get local time in UTC
            var currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            // currentTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            var localTime = moment(currentTime).format("MM/DD/YY HH:mm:ss");
            // Get server time from a PST time string... manually convert it to UTC
            var lastruntime = moment(this.lastRun);

            var serverPstTime = lastruntime.format("MM/DD/YY HH:mm:ss");
            //var serverPstTime = moment(this.lastRun).add(moment.duration("08:00:00")).format('YYYY-MM-DD HH:mm:ss');

            var timeDiff = moment.duration(moment(serverPstTime).diff(moment(localTime)));
            var hh = Math.abs(timeDiff.asHours());
            var mm = Math.abs(timeDiff.asMinutes());
            var ss = Math.abs(timeDiff.asSeconds());

            var dsplNum = hh;
            var dsplMsg = " hours ago";
            this.needToRunPct = this.forceRun() || (this.runIfStaleByHours > 0 && dsplNum >= this.runIfStaleByHours) ? true : false;
            
            if (dsplNum < 1) {
                dsplNum = mm;
                dsplMsg = " mins ago";
                if (!this.forceRun()) this.needToRunPct = false;
            }
            if (dsplNum < 1) {
                dsplNum = ss;
                dsplMsg = " secs ago";
                if (!this.forceRun()) this.needToRunPct = false;
            }

            return "Last Run: " + Math.round(dsplNum) + dsplMsg;

        } else {
            // never ran
            this.needToRunPct = this.runIfStaleByHours > 0;
            return "Last Run: Never";
        }
    }

    forceRun() {
        var data = this.contractData.PRC_ST;
        if (data !== undefined) {
            for (var d = 0; d < data.length; d++) {
                if (data[d].MEETCOMP_TEST_RESULT === "" || data[d].MEETCOMP_TEST_RESULT === "Not Run Yet") return true;
                if (data[d].COST_TEST_RESULT === "" || data[d].COST_TEST_RESULT === "Not Run Yet") return true;
            }
        }
        return false;
    }
    loadContractDetails(){
        this.contractData ={};
        this.contractManagerSvc.readContract(this.contractId).subscribe((response: any) => {
            this.contractData = response[0];
            this.contractId= this.contractData.DC_ID;
            this.lastRun = this.contractData.LAST_COST_TEST_RUN;
            this.contractData?.PRC_ST.map((x, i) => {
                //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
                this.isPSExpanded[i] = false;
                if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
            })
            if(this.contractData.CUST_ACCPT === "Pending"){
                this.isPending = true;
            } else if(this.contractData.CUST_ACCPT === "Accepted"){
                this.isPending = false;
            }
            this.filteredData = this.contractData?.PRC_ST; 
            this.showData = true;
            this.isCustAcptReadOnly = (this.contractData != undefined && this.contractData._behaviors != undefined && this.contractData._behaviors.isReadOnly != undefined && this.contractData._behaviors.isReadOnly.CUST_ACCPT == true) ? true : false;            
        }, (error) => {
            this.loggerSvc.error('Get Upper Contract service', error);
        });
        
    }
    openPTEeditor(value){
        this.parent_dcId = value.DC_PARENT_ID
        this.psId = value.DC_ID;
        let prc_tbl= value?.PRC_TBL;
        if(prc_tbl.length>1){
            this.showMultipleDialog = true;
            this.pteTableData = prc_tbl;
        } else {
            this.showMultipleDialog = false;
            this.ptId = prc_tbl[0].DC_ID;
            window.location.href = "/Dashboard#/contractmanager/PT/" + this.parent_dcId + "/" + this.psId + "/" + this.ptId + "/0";

        }
    }
    pickPt(pte){
        this.ptId = pte.DC_ID;
        window.location.href = "/Dashboard#/contractmanager/PT/" + this.parent_dcId + "/" + this.psId + "/" + this.ptId + "/0";
    }
    closeMultiple(){
        this.showMultipleDialog = false;
    }
    loadModel(model: string) {
        const contractId_Map: contractIds = {
            Model: model,
            ps_id: 0,
            pt_id: 0,
            ps_index: 0,
            pt_index: 0,
            C_ID: this.contractId,
            contractData: this.contractData
        };
        this.modelChange.emit(contractId_Map);
    }

    actionItemsBase(approvePending, saveCustAcceptance) {
        var data = {};
        var dataItems = [];

        if ((approvePending === true) && this.canBypassEmptyActions) {
            var ps = this.contractData.PRC_ST;
            if (ps !== undefined) {
                for (var p = 0; p < ps.length; p++) {
                    if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0] != null) {
                        ($("#rad_approve_" + ps[p].DC_ID)[0] as HTMLInputElement).checked = true;
                    }
                }
            }
        }

        this.needToRunOverlaps = [];
        this.getActionItems(data, dataItems, "Approve", "Send for Approval");
        this.getActionItems(data, dataItems, "Revise", "Send for Revision");
        this.getActionItems(data, dataItems, "Cancel", "Send for Cancelling");
        this.getActionItems(data, dataItems, "Hold", "Send for Holding");

        if (Object.keys(data).length === 0) {
            if (!this.canBypassEmptyActions) {
                this.submitModal = true;
            }
            this.canBypassEmptyActions = false;
            if (saveCustAcceptance === true) {
                this.isLoading = true;
                this.quickSaveContract('Save');
            }
        }

    this.curDataItems = dataItems;
    if(this.curDataItems.length > 0){
        const dialogRef = this.dialog.open(actionSummaryModal, {
            width: "600px",
            data: {
                cellCurrValues: dataItems,
                showErrMsg: this.needMct()
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal == 'success') {
                if (saveCustAcceptance === true) {
                    this.isLoading = true;
                    this.quickSaveContractFromDialog(this.requestBody);
                } 
                this.canBypassEmptyActions = false;
            }
        });
    }
            return;



      }
    hasFilter() {
        let tempData = this.contractData.PRC_ST.filter(x=>x.filtered == true).map(item=>item.WF_STG_CD).join(',');
        if(tempData.length > 0){
            this.filteredData= this.contractData.PRC_ST.filter(x=> tempData.includes(x.WF_STG_CD));
        } else {
            this.filteredData = this.contractData.PRC_ST;
        }
    }
    clearFilter() {
        let tempData = this.contractData.PRC_ST.filter(x=>x.filtered == false);
        this.filteredData = this.contractData.PRC_ST;
    }
    quickSaveContractFromDialog(value){
        if(value){
            this.isLoading= true;
            this.contractManagerSvc.actionPricingStrategies(this.contractData["CUST_MBR_SID"],this.contractData["DC_ID"],this.requestBody, this.contractData.CUST_ACCPT).subscribe((response: any) => {
            this.messages = response.Data.Messages;
            this.quickSaveContract('SaveAndLoad');
            }, (error) => {
                this.loggerSvc.error('Pricing Stratergy service', error);
            });  
        }
     
        this.canActionIcon = true;
    }


    quickSaveContract(action){
        const ct = this.contractData;
        this.custAccptButton = this.contractData.CUST_ACCPT;
        this.contractManagerSvc.createContract(this.contractData["CUST_MBR_SID"],this.contractData["DC_ID"],ct).subscribe((response: Array<any>) => {
              this.isLoading = false;
        },  (error) => {
            this.loggerSvc.error('Save Contract service', error);
        });
        if(action=== 'SaveAndLoad'){
            this.windowOpened = true;
            this.loadContractDetails();
        }
    }

    continueAction(fromToggle, checkForRequirements) {
        if (this.isPending === true && this.contractData.CUST_ACCPT === "Accepted" && this.contractData.HAS_ATTACHED_FILES === "0" && this.contractData.C2A_DATA_C2A_ID.trim() === "") return;
        // this.dialogPendingWarning.close();
        this.pendingWarningActions = false;
        this.showPendingWarning = false;

        if (!checkForRequirements) {
            this.canBypassEmptyActions = fromToggle && this.contractData.CUST_ACCPT === "Accepted";
            this.actionItemsBase(true, true);
        } else {
            this.actionItemsBase(true,null);
        }
        this.refreshedContractData.emit({ contractData: this.contractData });
    }
    ngOnInit() {
        this.is_Deal_Tools_Checked= false;
        this.contractId= this.contractData.DC_ID;
        window.location.href = "#contractmanager/CNTRCT/" + this.contractId + "/0/0/0";
        this.lastRun = this.contractData.LAST_COST_TEST_RUN;
        this.custAccptButton = this.contractData.CUST_ACCPT;        
        this.loadContractDetails();
        if(this.contractData.CUST_ACCPT === "Pending"){
            this.isPending = true;
        } else {
            this.isPending = false;
        }
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        setTimeout(() => {
            var isPCForceReq = this.contractData?.PRC_ST?.filter(x => x.COST_TEST_RESULT == 'Not Run Yet' || x.COST_TEST_RESULT == 'InComplete' || x.DC_ID <= 0).length > 0 ? true : false;
            var isMCForceReq = this.contractData?.PRC_ST?.filter(x => x.MEETCOMP_TEST_RESULT == 'Not Run Yet' || x.MEETCOMP_TEST_RESULT == 'InComplete' || x.DC_ID <= 0).length > 0 ? true : false;
            if (isMCForceReq || isPCForceReq)
                this.executePct();
        }, 2000);
    }  


}
angular.module("app").directive(
    "contractManager",
    downgradeComponent({
        component: contractManagerComponent,
    })
);
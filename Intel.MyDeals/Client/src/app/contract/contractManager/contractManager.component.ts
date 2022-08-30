import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { contractManagerservice } from "./contractManager.service";
import * as moment from "moment";
import { colorDictionary } from "../../core/angular.constants";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { GridUtil } from "../grid.util";
import { MatDialog } from "@angular/material/dialog";
import { actionSummaryModal } from "./actionSummaryModal/actionSummaryModal.component";


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
    contractDetails: any;
    isPending: boolean = false;
    showApproveCheckBox = true;
    showReviseCheckBox = true;
    showEmailCheckBox = true;
    curDataItems = [];
    canBypassEmptyActions: boolean = true;
    needToRunOverlaps = [];
    constructor(protected dialog: MatDialog,private loggerSvc: logger, private contractManagerSvc:contractManagerservice, private lnavSvc: lnavService) {
  
    }
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail

    private color: ThemePalette = 'primary';
    PCTResultView = false;
    public submitModal = false;
    OtherType = []; isECAP = []; isKIT = []
    @Input() contractData:any;
    @Input() UItemplate:any;
    private spinnerMessageHeader = "Complete"; 
    private spinnerMessageDescription = "Reloading the page now.";
    public isLoading = false;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {}; TrackerNbr = {}; emailCheck = {}; reviseCheck = {}; apprvCheck = {};
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
            if (event.target.checked){

        }
            if (event.target.id.indexOf("email") > 0) {
                var anyEmailChecked = false;
                const isItemChecked = event.target.checked;
                let currentItems =   this.contractData.PRC_ST.map((x) => {
                    if (checkBoxType == "Approve" && this.canAction('Approve', x, false) && this.canAction('Approve', x, true) && this.canActionIcon) {
                         this.apprvCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                    } else if (checkBoxType == "Revise" && this.canAction('Revise', x, false) && this.canAction('Revise', x, true) && this.canActionIcon) {
                         this.reviseCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                    } else if (checkBoxType == "Email" && this.canEmailIcon) {
                       this.emailCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                    }
            });
                   
                if (event.target.checked || anyEmailChecked) {
                    this.canActionIcon = false;
                    this.canEmailIcon = true;
                } else {
                    this.canActionIcon = true;
                    this.canEmailIcon = true;
                }
    
            } else {
                var anyActionChecked = false;
                const isItemChecked = event.target.checked;
                let currentItems =   this.contractData.PRC_ST.map((x) => {
                            if (checkBoxType == "Approve" && this.canAction('Approve', x, false) && this.canAction('Approve', x, true) && this.canActionIcon) {
                                 this.apprvCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                            } else if (checkBoxType == "Revise" && this.canAction('Revise', x, false) && this.canAction('Revise', x, true) && this.canActionIcon) {
                                 this.reviseCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                            } else if (checkBoxType == "Email" && this.canEmailIcon) {
                               this.emailCheck[x.DC_ID] = isItemChecked ? anyActionChecked = true : ''; 
                            }
                    });
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
    pendingChange(e) {
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

    actionItems(fromToggle, checkForRequirements) {

        if (fromToggle === undefined && checkForRequirements === undefined) {
            var ids = [];
            var anyEmailChecked = false;            
        }

        if (fromToggle === undefined || fromToggle === null) fromToggle = false;
        if (checkForRequirements === undefined || checkForRequirements === null) checkForRequirements = false;

        var ps = this.contractData.PRC_ST;


        // look for checked ending
        if (ps !== undefined) {
            for (var p = 0; p < ps.length; p++) {
                if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0] != null && ($("#rad_approve_" + ps[p].DC_ID)[0] as HTMLInputElement).checked) {
                    this.isPending = true;
                    this.contractData.CUST_ACCPT = "Accepted";
                    checkForRequirements = true;
                }
            }
        }

        if (this.isPending === false && this.contractData.CUST_ACCPT !== "Pending" && (this.contractData.C2A_DATA_C2A_ID === "" && this.contractData.HAS_ATTACHED_FILES === "0")) {
            // this.dialogPendingWarning.open();
        } else if (this.isPending === false && this.contractData.CUST_ACCPT !== "Pending") {
            this.continueAction(fromToggle, false);
        } else if (this.isPending === true && this.contractData.CUST_ACCPT !== "Accepted") {
            this.continueAction(fromToggle, checkForRequirements);
        } else {
            this.actionItemsBase(null, null);
        };
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
        var ids = [];
        var items = $(".psCheck-" + actn);

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
                    if (checkBoxType == "Approve" && this.canAction('Approve', x, false) && this.canAction('Approve', x, true) && this.canActionIcon) { this.apprvCheck[x.DC_ID] = isItemChecked ? true : false;  }
                    else if (checkBoxType == "Revise" && this.canAction('Revise', x, false) && this.canAction('Revise', x, true) && this.canActionIcon) { this.reviseCheck[x.DC_ID] = isItemChecked ? true : false; }
                    else if (checkBoxType == "Email" && this.canEmailIcon) { this.emailCheck[x.DC_ID] = isItemChecked ? true : false;  }
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
                }
            })
        }
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
        $(".iconRunPct").addClass("fa-spin grn");
        this.contractManagerSvc.runPctContract(this.contractData.DC_ID).subscribe((res) => {
            $(".iconRunPct").removeClass("fa-spin grn");
            this.loadContractDetails();
            this.isLoading = false;

        }, (err) => {
            $(".iconRunPct").removeClass("fa-spin grn");
            this.isLoading = false;
            this.loggerSvc.error("Could not run Cost Test for contract " + this.contractId, err);
        });
        
    }
    lastRunDisplay(value) {
        this.text = value;
        if ($(".iconRunPct").hasClass("fa-spin grn")) {
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
        this.contractManagerSvc.readContract(this.contractId).subscribe((response: Array<any>) => {
            this.contractData = response[0];
        });
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
                this.isLoading =true;
                this.quickSaveContract();
            }
            return;
        }

        this.curDataItems = dataItems;
        const dialogRef = this.dialog.open(actionSummaryModal, {
            width: "600px",
            height: "500px",
            data: {
                cellCurrValues: dataItems
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal == 'success') {
                // this.quickSaveContract();
                if (saveCustAcceptance === true) {
                    this.isLoading = true;
                    this.quickSaveContractFromDialog(this.curDataItems, returnVal);
                } 
                // else {
                //     $scope.checkPriorToActioning(data, result);
                // }
                this.canBypassEmptyActions = false;
            }
        });
      }
    quickSaveContractFromDialog(data, result){
        let rbody:any = {Revise: data};
        this.contractManagerSvc.actionPricingStrategies(this.contractData["CUST_MBR_SID"],this.contractData["DC_ID"],rbody, this.contractData.CUST_ACCPT).subscribe((response: any) => {
            // this.contractData = response[0];
            console.log(response);
            this.quickSaveContract();
        });       
        this.canActionIcon = true;
    }

    quickSaveContract(){
        const ct = this.contractData;
        this.contractManagerSvc.createContract(this.contractData["CUST_MBR_SID"],this.contractData["DC_ID"],ct).subscribe((response: Array<any>) => {
              this.isLoading = false;
        });
        this.loadContractDetails();
    }

    continueAction(fromToggle, checkForRequirements) {
        // if (this.isPending === true && this.contractData.CUST_ACCPT === "Accepted" && this.contractData.HAS_ATTACHED_FILES === "0" && this.contractData.C2A_DATA_C2A_ID.trim() === "") return;
        // this.dialogPendingWarning.close();

        if (!checkForRequirements) {
            this.canBypassEmptyActions = fromToggle && this.contractData.CUST_ACCPT === "Accepted";
            this.actionItemsBase(true, true);
        } else {
            this.actionItemsBase(true,null);
        }
    }
    ngOnInit() {
        this.contractId= this.contractData.DC_ID;
        this.lastRun = this.contractData.LAST_COST_TEST_RUN;
        this.loadContractDetails();
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
    }  
}
angular.module("app").directive(
    "contractManager",
    downgradeComponent({
        component: contractManagerComponent,
    })
);
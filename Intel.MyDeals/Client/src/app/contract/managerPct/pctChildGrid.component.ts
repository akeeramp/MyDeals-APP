import { Component, Input, Output, EventEmitter } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, SelectAllCheckboxState, CellClickEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { managerPctservice } from "./managerPct.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { pctOverrideReasonModal } from "./pctOverrideReasonModal/pctOverrideReasonModal.component";
import { pctGroupModal } from "./pctGroupModal/pctGroupModal.component";

@Component({
    selector: "pct-child-grid",
    templateUrl: "Client/src/app/contract/managerPct/pctChildGrid.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/managerPct.component.css']
})

export class pctChildGridComponent {
    constructor(private loggerSvc: logger,protected dialog: MatDialog,  private managerPctSvc: managerPctservice, private lnavSvc: lnavService) {

    }
    //public view: Observable<GridDataResult>;
    public isLoading: boolean;
    public skip = 0;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() parent: any;
    @Input() child: any;
    @Input() UItemplate: any;
    @Input() dealType: any;
    @Input() DC_PARENT_ID: any
    @Input() psDC_ID: any;
    @Input() ptDC_ID: any;
    @Input() CostTestGroupDetails: any;
    @Output() refreshParent: EventEmitter<any> = new EventEmitter<any>();
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {};
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail
    private CAN_VIEW_EXPORT = true;
    private CAN_VIEW_ALL_DEALS = true;
    private usrRole;
    private isSuper = true;
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";
    private childGridData: GridDataResult;
    private gridResult;
    public childGridResult;
    public pctMasterdata = [];

    private CAN_EDIT_COST_TEST = this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper); // Can go to cost test screen and make changes
    private hasNoPermission = !(this.CAN_EDIT_COST_TEST == undefined ? this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper) : this.CAN_EDIT_COST_TEST);
    private hasNoPermissionOvr = this.hasNoPermission && (<any>window).usrRole !== "Legal";
    private hasPermissionPrice = (<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal" || ((<any>window).usrRole === "SA" && (<any>window).isSuper);
    // This variable gives Super GA to see RTL_PULL_DLR and CAP (CAP column only for ECAP deals)
    private hasSpecialPricePermission = (this.hasPermissionPrice || ((<any>window).usrRole === "GA" && (<any>window).isSuper));

    public gridData: any;
    gridDataSet = {}; childGridDataSet = new Observable<GridDataResult>();
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;

    private ECAP_KIT_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'CAP', 'ECAP_PRC', 'ECAP_FLR', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']
    private VOL_REV_FLEX_DNSTY_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'MAX_RPU', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']
    private PGM_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'OEM_PLTFRM_LNCH_DT', 'OEM_PLTFRM_EOL_DT', 'MAX_RPU', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']

    private childState: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    onOff(val) {
        return val ? "Yes" : "No";
    }
    changeReasonFlg(dataItem) {
    if (dataItem.COST_TEST_OVRRD_FLG === false) {
        var newItem = {
            "CUST_NM_SID": dataItem.CUST_NM_SID,
            "DEAL_OBJ_TYPE_SID": 5,
            "DEAL_OBJ_SID": dataItem.DEAL_ID,
            "PRD_MBR_SIDS": dataItem.PRD_MBR_SIDS,
            "CST_OVRRD_FLG": 0,
            "CST_OVRRD_RSN": ""
        };
    this.managerPctSvc.setPctOverride(newItem).subscribe(
        (response) => {
            dataItem.saved = true;
            setTimeout(()=>{
                dataItem.saved = false;
            }, 3000);
        },
        function (response) {
            this.loggerSvc.error("Could not override Data.", response, response.statusText);
        }
    )
        }
    }

    openReason(dataItem) {
        const dialogRef = this.dialog.open(pctOverrideReasonModal, {
            panelClass: 'pct-override-style',
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if(returnVal){
                dataItem.saved = true;
                setTimeout(()=>{
                    dataItem.saved = false;
                }, 3000);
            }
        });
    }
    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "GRP_DEALS") {
            let dealId= args.dataItem.DEAL_ID;
            let data = this.CostTestGroupDetails.filter(x => x.DEAL_PRD_RNK == args.dataItem.DEAL_PRD_RNK)
            this.openPctGroupModal(data, dealId);
        }
    }
    openPctGroupModal(dataItem, dealId) {
        const dialogRef = this.dialog.open(pctGroupModal, {
            width: "90%",
            panelClass: 'post-dialog-container',
            maxWidth: "auto",
            data: {
                cellCurrValues: dataItem,
                dealId: dealId
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
        });
    }

    isErrorOrWarning(dataItem, field) {
        if (dataItem.COST_TEST_OVRRD_FLG !== "Yes" && dataItem.PRC_CST_TST_STS !== "NA") {
            if (field != "LOW_NET_PRC" && field != "RTL_CYC_NM") {
                if (!dataItem[field] || dataItem[field] === "" || dataItem[field] < 0)
                    return true;
            }
            else if (field == "RTL_CYC_NM" && (!dataItem.RTL_CYC_NM || dataItem.RTL_CYC_NM === "")) {
                return true;
            }
            else {
                let validNet = false;
                if (!dataItem[field] || dataItem[field] === "" || dataItem[field] < dataItem.PRD_COST)
                    return true;
                else
                    validNet = true;
                if (!(!dataItem.PRD_COST || dataItem.PRD_COST === "" || dataItem.PRD_COST < 0) && validNet && dataItem.LOW_NET_PRC <= 0)
                    return true;
            }
        }
        return false;
    }

    isInformation(dataItem, field) {
        if (!(dataItem.COST_TEST_OVRRD_FLG !== "Yes" && dataItem.PRC_CST_TST_STS !== "NA")) {
            if (field != "LOW_NET_PRC" && field !== "RTL_CYC_NM") {
                if (!dataItem[field] || dataItem[field] === "" || dataItem[field] < 0)
                    return true;
            }
            else if (field == "RTL_CYC_NM" && (!dataItem.RTL_CYC_NM || dataItem.RTL_CYC_NM === "")) {
                return true;
            }
            else {
                let validNet = false;
                if (!dataItem[field] || dataItem[field] === "" || dataItem[field] < dataItem.PRD_COST)
                    return true;
                else
                    validNet = true;
                if (!(!dataItem.PRD_COST || dataItem.PRD_COST === "" || dataItem.PRD_COST < 0) && validNet && dataItem.LOW_NET_PRC <= 0)
                    return true;
            }
        }
        return false;
    }
    isHidden(fieldName) {
        if ((this.dealType == 'ECAP' || this.dealType == 'KIT') && !this.ECAP_KIT_Col.includes(fieldName)) {
            return true;
        }
        else if ((this.dealType == 'VOL_TIER' || this.dealType == 'REV_TIER' || this.dealType == 'DENSITY' || this.dealType == 'FLEX') && !this.VOL_REV_FLEX_DNSTY_Col.includes(fieldName)) {
            return true;
        }
        else if (this.dealType == 'PROGRAM' && !this.PGM_Col.includes(fieldName)) {
            return true;
        }
        return false;
    }
    refreshContractData(eventData) {
        if (eventData) {
            this.refreshParent.emit(eventData);
        }
    }
    getTitle(dataItem){
        let title ="";
        if(dataItem.PRC_CST_TST_STS == 'InComplete'){
            title = dataItem.PRC_CST_TST_STS + ':'+ dataItem.INCMPL_COST_TEST_RSN;
        } else {
            title = dataItem.PRC_CST_TST_STS;
        }
        return title;
    }
    goToNavManagePCTChild(DC_PARENT_ID, DC_ID, ptDC_ID, DEAL_ID) {
        window.open(`/Contract#/manager/WIP/${DC_PARENT_ID}/${DC_ID}/${ptDC_ID}/${DEAL_ID}`, '_blank')
    }
    ngOnChanges() {
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.contractData?.PRC_ST.map((x, i) => {
            //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
            this.isPSExpanded[i] = false;
            if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
        })
        this.gridResult = this.parent.filter(x => x.DEAL_ID == this.child.DEAL_ID);
        this.gridData = process(this.gridResult, this.childState);
    }
}

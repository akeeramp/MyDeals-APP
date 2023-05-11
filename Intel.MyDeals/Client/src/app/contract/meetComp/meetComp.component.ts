import { logger } from "../../shared/logger/logger";
import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, SelectAllCheckboxState, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { meetCompContractService } from "./meetComp.service";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Keys } from "@progress/kendo-angular-common";
import { List } from "linqts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GridUtil } from "../grid.util"
import { MeetCompContractUtil } from "./meetComp_util"
import { MomentService } from "../../shared/moment/moment.service";
import { MatDialog } from "@angular/material/dialog";
import { meetCompDealDetailModalComponent } from "./meetCompDealDetailModal.component"
import { pricingTableservice } from "../pricingTable/pricingTable.service";
import { sortBy } from 'underscore';

@Component({
    selector: "meet-comp-contract",
    templateUrl: "Client/src/app/contract/meetComp/meetComp.component.html",
    styleUrls: ["Client/src/app/contract/meetComp/meetComp.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class meetCompContractComponent implements OnInit {
    @Input() private isTender;
    @Input() private objSid;
    @Input() private isAdhoc;
    @Input() private objTypeId;
    @Input() private cId;;
    @Input() private pageNm;
    @Input() private meetCompRefresh;
    @Output() tmDirec = new EventEmitter();
    @Output() contractRefresh = new EventEmitter();
    @Output() refreshMCTData = new EventEmitter();
    constructor(private loggerSvc: logger,
                private meetCompSvc: meetCompContractService,
                private formBuilder: FormBuilder,
                private dialog: MatDialog,
                private pricingTableSvc: pricingTableservice,
                private momentService: MomentService) {}

    public spinnerMessageHeader = "";
    public isLoading = false;
    public spinnerMessageDescription = "";
    public lastMetCompRunLocalTime = "local time";
    public hideViewMeetCompResult = (<any>window).usrRole === "FSE";
    public hideViewMeetCompOverride = !((<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal");
    public canUpdateMeetCompSKUPriceBench = ((<any>window).usrRole === "FSE" || (<any>window).usrRole === "GA");
    public usrRole = (<any>window).usrRole;
    public columnIndex = {
        COMP_SKU: 7,
        COMP_PRC: 7,
        IA_BNCH: 9,
        COMP_BNCH: 10,
        COMP_OVRRD_FLG: 13,
        COMP_OVRRD_RSN: 13
    };

    public tempUpdatedList = [];
    public isDataAvaialable = true;
    public errorList = [];
    public validationMessage = "";
    public setUpdateFlag = false;
    public runIfStaleByHours = 3;
    public MC_MODE = "D";
    public PAGE_NM;
    meetCompMasterResult: any[];
    public meetCompMasterdata;
    public meetCompUnchangedData;
    public meetCompUpdatedList = [];
    public meetCompSkuDropdownData = [];
    public meetCompPrcDropdownData = [];
    public compOverrideDropdownData = [
        {
            "COMP_OVRRD_FLG": "Yes"
        },
        {
            "COMP_OVRRD_FLG": "No"
        }
    ];
    public defaultCompOverrideItem = { "COMP_OVRRD_FLG": "Select Override" }
    public totalApiEntries = 0;
    public isMeetCompRun = false;
    public isGridEditable = true;
    public isEditableGrid = "True";
    public selectAllState: SelectAllCheckboxState = "unchecked";
    public showPopup = false;
    public lastMeetCompRunValue = "";
    public popUpMessage = "";
    public showEmptyDataAlert = false;
    public emptyDataAlertMsg = "";
    public selectedCust = '';
    public selectedCustomerText = '';
    public curentRow;
    private contractData;
    private gridData: GridDataResult;
    private childGridData: GridDataResult;
    public showPrice: boolean = true;
    public showAlert: boolean = false;
    public dispMsg: string = ""
    public expandedDetailKeys: number[] = [];
    public expandDetailsBy = (dataItem: any): number => {
        return dataItem;
    };
    private gridResult;
    public childGridResult;
    public selectedMeetCompPrc: any;
    public selectedMeetCompSku: any;
    public initialLoad = true;
    private state: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    };
    private childState: State = {
        skip: 0,
        take: 10,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    };
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        }
    ];

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    childDataStateChange(state: DataStateChangeEvent): void {
        this.childState = state;
        this.childGridData = process(this.childGridResult, this.childState);
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    distinctPrimitiveChild(fieldName: string, dataItem): any {
        const meetCompListObj = new List<any>(this.meetCompMasterResult);
        let result = meetCompListObj
            .Where(function (x) {
                return (
                    x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                    x.GRP == "DEAL" &&
                    x.DEFAULT_FLAG == "D"
                );
            })
            .OrderBy(function (x) {
                return x.MEET_COMP_STS;
            })
            .ToArray();
        return distinct(result, fieldName).map(
            item => item[fieldName]
        );
    }

    convertToChildGridArray(parentDataItem) {
        const meetCompListObj = new List<any>(this.meetCompMasterResult);
        this.childGridResult = meetCompListObj
            .Where(function (x) {
                return (
                    x.GRP_PRD_SID == parentDataItem.GRP_PRD_SID &&
                    x.GRP == "DEAL" &&
                    x.DEFAULT_FLAG == "D"
                );
            })
            .OrderBy(function (x) {
                return x.MEET_COMP_STS;
            })
            .ToArray();
        this.childState.take = this.childGridResult.length;
        this.childGridData = process(this.childGridResult, this.childState);
        return this.childGridData;
    }

    isModelValid(data) {
        this.errorList = [];
        return MeetCompContractUtil.isModelValid(data, this.errorList, this.canUpdateMeetCompSKUPriceBench, this.usrRole);
    }

    public cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "COMP_SKU") {
            this.generateMeetCompSkuDropdownData(args.dataItem);
        } else if (args.column.field == "COMP_PRC") {
            if (!isNaN(args.dataItem.COMP_PRC)) {
                this.showPrice = true;
                this.generateMeetCompPrcDropdownData(args.dataItem);
            }
            else {
                this.showPrice = false;
            }
        } else if (args.column.field == "COMP_OVRRD_FLG") {
            if (!(args.dataItem.MEET_COMP_STS.toLowerCase() == 'pass' || (args.dataItem.MEET_COMP_STS.toLowerCase() == 'overridden' && args.dataItem.COMP_OVRRD_FLG.toLowerCase() == 'yes')) && !((this.usrRole == 'DA') && args.dataItem.MEET_COMP_OVERRIDE_UPD_FLG.toLowerCase() === 'y')) {
                if (this.usrRole == "DA") {
                    this.loggerSvc.warn("Cannot Override Meet Comp since the deals could be in Active Stage or the Meet Comp Result is already Passed or you do not have access to for this stage.", "Warning");
                }
                else {
                    this.loggerSvc.warn("Cannot edit the Comp SKU since the Deal could be Active OR Pricing Strategy could be in Pending/Approved/Hold Status", "Warning");
                }
                return;
            }
        }
        if (!args.isEdited) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex,
                this.createFormGroup(args.dataItem)
            );
        }
    }

    public cellCloseHandler(args: CellCloseEvent): void {
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
                return;
            }
        }
    }

    public createFormGroup(dataItem): FormGroup {
        return this.formBuilder.group({
            COMP_SKU: [dataItem.COMP_SKU],
            COMP_PRC: [dataItem.COMP_PRC]
        });
    }

    public generateMeetCompSkuDropdownData(dataItem) {
        if (!(this.canUpdateMeetCompSKUPriceBench && dataItem.MEET_COMP_UPD_FLG == "Y")) {
            //Not Editable hence no data for dropdown
            this.meetCompSkuDropdownData = [];
        }
        else {
            let resultObj;
            const meetCompListObj = new List<any>(this.meetCompMasterResult);
            if (dataItem.GRP != "PRD") {
                resultObj = meetCompListObj
                    .Where((x) => {
                        return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID);
                    }).GroupBy((x) => {
                        return (x.COMP_SKU);
                    })
            } else {
                resultObj = meetCompListObj.Where((x) => {
                    return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == dataItem.GRP);
                }).GroupBy((x) => {
                    return (x.COMP_SKU);
                });
            }
            const resultMeetCompSkuArray = [];
            for (const key in resultObj) {
                const newEntry = {
                    'COMP_SKU': key,
                    'key': resultObj[key][0].RW_NM,
                    'RW_NM': resultObj[key][0].RW_NM
                }
                resultMeetCompSkuArray.push(newEntry);
            }
            this.meetCompSkuDropdownData = resultMeetCompSkuArray;
            let sku_ind = this.meetCompSkuDropdownData.findIndex(ind => ind['COMP_SKU'] == dataItem.COMP_SKU);
            this.selectedMeetCompSku = sku_ind > -1 ? this.meetCompSkuDropdownData[sku_ind] : {};
        }
    }

    public generateMeetCompPrcDropdownData(dataItem) {
        if (!(this.canUpdateMeetCompSKUPriceBench && dataItem.MEET_COMP_UPD_FLG == "Y" && dataItem.COMP_SKU.length !== 0)) {
            //Not Editable hence no data for dropdown
            this.meetCompPrcDropdownData = [];
        }
        else {
            let resultObj;
            const meetCompListObj = new List<any>(this.meetCompMasterResult);
            if (dataItem.GRP != "PRD") {
                resultObj = meetCompListObj
                    .Where((x) => {
                        return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.COMP_PRC != null);
                    })
                    .GroupBy((x) => {
                        return (x.COMP_PRC);
                    })
            } else {
                resultObj = meetCompListObj
                    .Where((x) => {
                        return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.COMP_PRC != null &&
                            x.GRP == dataItem.GRP);
                    })
                    .GroupBy((x) => {
                        return (x.COMP_PRC);
                    })
            }
            const resultMeetCompPrcArray = [];
            for (const key in resultObj) {
                const newEntry = {
                    'COMP_PRC': key,
                    'key': resultObj[key][0].RW_NM,
                    'RW_NM': resultObj[key][0].RW_NM
                }
                resultMeetCompPrcArray.push(newEntry);
            }
            this.meetCompPrcDropdownData = resultMeetCompPrcArray;
            var prc_ind = this.meetCompPrcDropdownData.findIndex(ind => ind['COMP_PRC'] == dataItem.COMP_PRC);
            this.selectedMeetCompPrc = this.meetCompPrcDropdownData[prc_ind];
        }
    }

    //Triggered on click of checkbox on grid
    selectProdIDS(selectedID, event) {
        const isSelected = event.target.checked;
        if (this.state.filter.filters.length > 0) {
            //UPDATE Selected Filter ROWS
            const filterData = this.gridData.data;
            if (selectedID == 'all') {
                if (isSelected) {
                    for (let i = 0; i < filterData.length; i++) {
                        if (filterData[i].MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                            this.meetCompMasterdata._elements[filterData[i].RW_NM - 1].IS_SELECTED = true;
                        }
                    }
                }
                else {
                    for (let i = 0; i < filterData.length; i++) {
                        if (filterData[i].MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                            this.meetCompMasterdata._elements[filterData[i].RW_NM - 1].IS_SELECTED = false;
                        }
                    }
                }
            }
            else {
                this.meetCompMasterdata._elements[selectedID - 1].IS_SELECTED = isSelected;
                const filterList = new List<any>(filterData);
                this.resetDealItems(this.meetCompMasterdata._elements[selectedID - 1].GRP_PRD_SID, filterList, isSelected); // Reset All the Deals not copied from Peers
            }
        }
        else {
            if (selectedID == 'all') {
                if (isSelected) {
                    this.meetCompMasterdata._elements.forEach(function (obj) {
                        if (obj.MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                            obj.IS_SELECTED = true;
                        }
                    });
                }
                else {
                    this.meetCompMasterdata._elements.forEach(function (obj) {
                        if (obj.MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                            obj.IS_SELECTED = false;
                        }
                    });
                }
            }
            else {
                this.meetCompMasterdata._elements[selectedID - 1].IS_SELECTED = isSelected;
                this.resetDealItems(this.meetCompMasterdata._elements[selectedID - 1].GRP_PRD_SID, this.meetCompMasterdata, isSelected); // Reset All the Deals not copied from Peers
            }
        }
    }

    resetDealItems(GRP_PRD_SID, data, isSelected) {
        //Getting all Child Item
        const tempDealData = data
            .Where(function (x) {
                return (x.GRP_PRD_SID == GRP_PRD_SID);
            })
            .ToArray();
        for (let i = 0; i < tempDealData.length; i++) {
            this.meetCompMasterdata._elements[tempDealData[i].RW_NM - 1].IS_SELECTED = isSelected;
        }
    }

    addToUpdateList(dataItem) {
        let indx = -1;
        this.meetCompUpdatedList.some(function (e, i) {
            if (e.RW_NM == dataItem.RW_NM) {
                indx = i;
                return true;
            }
        });
        if (indx > -1) {
            this.meetCompUpdatedList.splice(indx, 1);
        }
        this.meetCompUpdatedList.push(dataItem);
        this.setUpdateFlag = true;
    }

    //Returns all selected rows from grid
    getProductLineData() {
        return MeetCompContractUtil.getProductLineData(this.state, this.gridData, this.meetCompMasterdata);
    }

    addSKUForCustomer(mode, isSelected) {
        if (this.selectedCustomerText.trim().length > 0) {
            this.meetCompMasterdata._elements[this.curentRow - 1].COMP_SKU = this.selectedCustomerText;
            if (mode == "0" || mode == 0) {
                this.meetCompMasterdata._elements[this.curentRow - 1].CUST_NM_SID = this.selectedCust;
            }
            else {
                this.meetCompMasterdata._elements[this.curentRow - 1].CUST_NM_SID = 1;
            }
            this.addToUpdateList(this.meetCompMasterdata._elements[this.curentRow - 1]);
            //Update child
            if (this.meetCompMasterdata._elements[this.curentRow - 1].GRP == "PRD") {
                let selData = [];
                if (isSelected) {
                    selData = this.getProductLineData();
                }
                if (selData.length > 0) {
                    for (let cntData = 0; selData.length > cntData; cntData++) {
                        const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                        //Updating Product Line
                        if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                            this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_SKU = this.selectedCustomerText;
                            this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                        }
                        //Updating Deal line
                        const tempData = this.meetCompUnchangedData
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                            }).ToArray();
                        for (let i = 0; i < tempData.length; i++) {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_SKU = this.selectedCustomerText;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }
                    }
                }
                else {
                    const tempData = this.meetCompUnchangedData
                        .Where((x) => {
                            return (
                                x.GRP_PRD_SID == this.meetCompMasterdata._elements[this.curentRow - 1].GRP_PRD_SID &&
                                x.GRP == "DEAL" &&
                                x.MC_NULL == true &&
                                x.MEET_COMP_UPD_FLG == "Y");
                        }).ToArray();
                    for (let i = 0; i < tempData.length; i++) {
                        this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_SKU = this.selectedCustomerText;
                        this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                    }
                }
            }
        }
    }

    async loadMeetCompData() {
        let response: any = await this.meetCompSvc.getMeetCompProductDetails(this.objSid, this.MC_MODE, this.objTypeId).toPromise().catch((err) => {
            this.loggerSvc.error("Unable to get GetMeetCompProductDetails data", err, err.statusText);
            this.isLoading = false;
        });
        if (response && response.length > 0) {
            response.forEach((obj) => {
                obj.IS_SELECTED = false;
                //Setting COMP_PRC to null. Its nullable Int
                if (obj.COMP_PRC == 0) {
                    obj.COMP_PRC = null;
                }
                //Setting IA_BNCH to null. Its nullable Int
                if (obj.IA_BNCH == 0) {
                    obj.IA_BNCH = null;
                }
                //Setting COMP_BNCH to null. Its nullable Int
                if (obj.COMP_BNCH == 0) {
                    obj.COMP_BNCH = null;
                }
                this.generateMeetCompSkuDropdownData(obj);
                this.generateMeetCompPrcDropdownData(obj);
            });
            this.meetCompMasterResult = response;
            this.totalApiEntries = this.meetCompMasterResult.length;
            this.meetCompMasterdata = new List<any>(this.meetCompMasterResult);
            const tempCopy = JSON.parse(JSON.stringify(this.meetCompMasterResult));
            this.meetCompUnchangedData = new List<any>(tempCopy);
            if (this.usrRole == "GA" || (this.usrRole == "FSE" && this.isAdhoc == 1)) {
                this.isModelValid(this.meetCompMasterdata._elements);
            }
            this.reBindGridData();
            //Refreshing data in tender
            if (this.isTender == "1") await this.tmDirec.emit('');
            this.isLoading = false;
        } else {
            this.isDataAvaialable = false;
            this.isLoading = false;
            if (this.isTender == "1" || this.PAGE_NM == 'MCTPOPUP') {
                //to change compMissingFlag status to complete (COMP_MISSING_FLG == "1" to COMP_MISSING_FLG == "0")
                await this.meetCompSvc.updateMeetCompProductDetails(this.objSid, this.objTypeId, this.tempUpdatedList).toPromise().catch((err) => {
                    this.loggerSvc.error("Unable to save UpdateMeetCompProductDetails data", err, err.statusText);
                    this.isLoading = false;
                });
                //alert for tender with No MeetComp
                this.emptyDataAlertMsg = "Meet comp is not applicable for the Products selected in the Tender Table editor";
                this.showEmptyDataAlert = true;
            } else {
                //alert for contract with No MeetComp
                this.emptyDataAlertMsg = "No Meet Comp data available for product(s) in this Contract";
                this.showEmptyDataAlert = true;
            }
            return;
        }
    }
    closeEmptyDataPopup() {
        this.showEmptyDataAlert = false;
        //to refresh Pricing Table data
        this.tmDirec.emit('')
    }
    onCompSkuChange(val: any, dataItem: any) {
        if (val != undefined && val.RW_NM != undefined) {
            const selectedIndx = val.RW_NM;
            this.selectedCustomerText = (val.COMP_SKU).trim();
            this.selectedCust = dataItem.CUST_NM_SID;
            this.curentRow = dataItem.RW_NM;
            if (selectedIndx == -1 && this.selectedCustomerText.trim().length > 0) {
                this.addSKUForCustomer("0", dataItem.IS_SELECTED);
                dataItem.COMP_SKU = this.selectedCustomerText.trim();
            }
            else if (selectedIndx > -1 && this.selectedCustomerText.trim().length > 0) {
                const selectedValue = val.RW_NM;
                dataItem.COMP_SKU = this.selectedCustomerText.trim();
                let tempprcData = [];
                dataItem.COMP_PRC = parseFloat(this.meetCompMasterdata._elements[selectedValue - 1].COMP_PRC).toFixed(2);
                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    this.addSKUForCustomer("0", dataItem.IS_SELECTED);
                    if (selData.length > 0) {
                        for (let cntData = 0; selData.length > cntData; cntData++) {
                            const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                            //Updating Product Line
                            if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                                this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                                this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                            }
                            //Updating Deal line
                            tempprcData = this.meetCompUnchangedData
                                .Where(function (x) {
                                    return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                })
                                .ToArray();

                            for (let i = 0; i < tempprcData.length; i++) {
                                if (dataItem.COMP_PRC) {
                                    this.meetCompMasterdata._elements[tempprcData[i].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                                }
                                this.addToUpdateList(this.meetCompMasterdata._elements[tempprcData[i].RW_NM - 1]);
                            }
                        }
                    }
                    else {
                        tempprcData = this.meetCompUnchangedData
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                            }).ToArray();

                        for (let i = 0; i < tempprcData.length; i++) {
                            if (dataItem.COMP_PRC) {
                                this.meetCompMasterdata._elements[tempprcData[i].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                            }
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempprcData[i].RW_NM - 1]);
                        }
                    }
                }
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_SKU = (val.COMP_SKU).trim();
                // Setting COMP PRC based on Comp SKU if available
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_PRC = parseFloat(this.meetCompMasterdata._elements[selectedValue - 1].COMP_PRC).toFixed(2);
                this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
                var sku_ind = this.meetCompSkuDropdownData.findIndex(ind => ind['COMP_SKU'] == dataItem.COMP_SKU)
                this.selectedMeetCompSku = this.meetCompSkuDropdownData[sku_ind];
                var prc_ind = this.meetCompPrcDropdownData.findIndex(ind => ind['COMP_PRC'] == dataItem.COMP_PRC)
                this.selectedMeetCompPrc = this.meetCompPrcDropdownData[prc_ind];

            }
        }
    }

    onCompPriceChange(val: any, dataItem: any) {
        if (!isNaN(val.COMP_PRC) && (parseFloat(val.COMP_PRC) >= 0)) {
            this.showPrice = true;
            dataItem.COMP_PRC = val.COMP_PRC == "" ? null : val.COMP_PRC;
            const objItem = this.meetCompUnchangedData
                .Where(function (x) {
                    return (
                        x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                        x.COMP_SKU == dataItem.COMP_SKU
                    );
                }).ToArray();
            //Set AMT
            let itm_amt = 0;
            if (objItem.length > 0) {
                itm_amt = objItem[0].COMP_PRC;
            }
            if (itm_amt !== dataItem.COMP_PRC && dataItem.COMP_PRC != null) {
                if (isNaN(dataItem.COMP_PRC) || dataItem.COMP_PRC == null) {
                    if (val.COMP_PRC) {
                        dataItem.COMP_PRC = val.COMP_PRC;
                    } else {
                        dataItem.COMP_PRC = null;
                    }
                }
                if (dataItem.COMP_PRC > 0) {
                    let tempData = [];
                    if (dataItem.GRP == "PRD") {
                        let selData = [];
                        if (dataItem.IS_SELECTED) {
                            selData = this.getProductLineData();
                        }
                        if (selData.length > 0) {
                            for (let cntData = 0; selData.length > cntData; cntData++) {
                                const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                                //Updating Product Line
                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                                    this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                                    this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                                }
                                //Updating Deal line
                                tempData = this.meetCompUnchangedData
                                    .Where(function (x) {
                                        return (
                                            x.GRP_PRD_SID == temp_grp_prd &&
                                            x.GRP == "DEAL" &&
                                            x.MC_NULL == true &&
                                            x.MEET_COMP_UPD_FLG == "Y"
                                        );
                                    }).ToArray();

                                for (let i = 0; i < tempData.length; i++) {
                                    this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                                    this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                                }
                            }
                        } else {
                            tempData = this.meetCompUnchangedData.Where(function (x) {
                                return (
                                    x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                                    x.GRP == "DEAL" &&
                                    x.MC_NULL == true &&
                                    x.MEET_COMP_UPD_FLG == "Y"
                                );
                            }).ToArray();

                            for (let i = 0; i < tempData.length; i++) {
                                this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                                this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                            }
                        }
                    }
                    this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                    this.addToUpdateList(dataItem);
                    var prc_ind = this.meetCompPrcDropdownData.findIndex(ind => ind['COMP_PRC'] == dataItem.COMP_PRC)
                    this.selectedMeetCompPrc = this.meetCompPrcDropdownData[prc_ind];

                } else {
                    return false;
                }
            }
        }
        else {
            if (!isNaN(val.COMP_PRC)) val.COMP_PRC = dataItem.COMP_PRC != null ? dataItem.COMP_PRC : '0';
            else val.COMP_PRC = '0';
            this.onCompPriceChange(val, dataItem);
        }
    }

    onIaBnchChange(val: any, dataItem: any) {
        if (this.meetCompMasterdata._elements[dataItem.RW_NM - 1].IA_BNCH != val) {
            dataItem.IA_BNCH = val;
            if (val > 0) {
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    if (selData.length > 0) {
                        for (let cntData = 0; selData.length > cntData; cntData++) {
                            const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                            //Updating Product Line
                            if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && selData[cntData].PRD_CAT_NM.toLowerCase() == "svrws") {
                                this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                                this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                            }
                            //Updating Deal line
                            const tempData = this.meetCompUnchangedData
                                .Where(function (x) {
                                    return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                })
                                .ToArray();

                            for (let i = 0; i < tempData.length; i++) {
                                this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                                this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                            }
                        }
                    } else {
                        const tempData = this.meetCompUnchangedData
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                            })
                            .ToArray();

                        for (let i = 0; i < tempData.length; i++) {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }
                    }
                }
            }
            else {
                return false;
            }
        }
    }

    onCompBnchChange(val: any, dataItem: any) {
        if (this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_BNCH != val) {
            dataItem.COMP_BNCH = val;
            if (val > 0) {
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    if (selData.length > 0) {
                        for (let cntData = 0; selData.length > cntData; cntData++) {
                            const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                            //Updating Product Line
                            if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && selData[cntData].PRD_CAT_NM.toLowerCase() == "svrws") {
                                this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                                this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                            }
                            //Updating Deal line
                            const tempData = this.meetCompUnchangedData
                                .Where(function (x) {
                                    return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                })
                                .ToArray();

                            for (let i = 0; i < tempData.length; i++) {
                                this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                                this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                            }
                        }
                    }
                    else {
                        const tempData = this.meetCompUnchangedData
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                            })
                            .ToArray();

                        for (let i = 0; i < tempData.length; i++) {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }
                    }
                }
            }
            else {
                return false;
            }
        }
    }

    onCompOverrideFlagChange(val: any, dataItem: any) {
        if (val == "Select Override") {
            val = "Yes";
        }
        this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_OVRRD_FLG = val.trim();
        this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
        if (dataItem.GRP == "PRD") {
            let selData = [];
            if (dataItem.IS_SELECTED) {
                selData = this.getProductLineData();
            }
            if (selData.length > 0) {
                for (let cntData = 0; selData.length > cntData; cntData++) {
                    const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                    //Updating Product Line
                    if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && (selData[cntData].MEET_COMP_STS.toLowerCase() == "fail" || selData[cntData].MEET_COMP_STS.toLowerCase() == "incomplete")) {
                        this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_OVRRD_FLG = dataItem.COMP_OVRRD_FLG;
                        this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                    }
                    //Updating Deal line
                    const tempData = this.meetCompUnchangedData
                        .Where(function (x) {
                            return (
                                x.GRP_PRD_SID == temp_grp_prd &&
                                x.GRP == "DEAL" &&
                                x.MEET_COMP_UPD_FLG == "Y" &&
                                x.MEET_COMP_STS.toLowerCase() != "pass");
                        })
                        .ToArray();

                    for (let i = 0; i < tempData.length; i++) {
                        if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_OVRRD_FLG = dataItem.COMP_OVRRD_FLG;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }
                    }
                }
            }
            else {
                //Updating Deal line
                const tempData = this.meetCompUnchangedData
                    .Where(function (x) {
                        return (
                            x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.GRP == "DEAL" &&
                            x.MEET_COMP_UPD_FLG == "Y" &&
                            x.MEET_COMP_STS.toLowerCase() != "pass");
                    })
                    .ToArray();

                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                        this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_OVRRD_FLG = dataItem.COMP_OVRRD_FLG;
                        this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                    }
                }
            }
        }
    }

    onCompOverrideCommentChange(value: any, dataItem: any) {
        dataItem.COMP_OVRRD_RSN = value.trim();
        this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_OVRRD_RSN = value.trim();
        this.addToUpdateList(dataItem);
        if (dataItem.GRP == "PRD") {
            let selData = [];
            if (dataItem.IS_SELECTED) {
                selData = this.getProductLineData();
            }
            if (selData.length > 0) {
                for (let cntData = 0; selData.length > cntData; cntData++) {
                    const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                    //Updating Product Line
                    if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && (selData[cntData].MEET_COMP_STS.toLowerCase() == "fail" || selData[cntData].MEET_COMP_STS.toLowerCase() == "incomplete")) {
                        this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_OVRRD_RSN = dataItem.COMP_OVRRD_RSN;
                        this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                    }
                    //Updating Deal line
                    const tempData = this.meetCompUnchangedData
                        .Where(function (x) {
                            return (
                                x.GRP_PRD_SID == temp_grp_prd &&
                                x.GRP == "DEAL" &&
                                x.MEET_COMP_UPD_FLG == "Y" &&
                                x.MEET_COMP_STS.toLowerCase() != "pass"
                            );
                        })
                        .ToArray();

                    for (let i = 0; i < tempData.length; i++) {
                        if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_OVRRD_RSN = dataItem.COMP_OVRRD_RSN;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }
                    }
                }
            }
            else {
                const tempData = this.meetCompUnchangedData
                    .Where(function (x) {
                        return (
                            x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.GRP == "DEAL" &&
                            x.MEET_COMP_UPD_FLG == "Y" &&
                            x.MEET_COMP_STS.toLowerCase() != "pass"
                        );
                    })
                    .ToArray();

                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                        this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].COMP_OVRRD_RSN = dataItem.COMP_OVRRD_RSN;
                        this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                    }
                }
            }
        }
    }

    setBusy(msg, detail) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";
            // if no change in state, simple update the text
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                }, 100);
            }
        });
    }

    async lastMeetCompRunCalc(forceRun?: boolean) {
        let response = await this.pricingTableSvc.readContract(this.cId).toPromise().catch((err) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', err);
        })
        if (response && Array.isArray(response) && response.length > 0) {
            this.contractData = response[0];
        }
        this.contractRefresh.emit(this.contractData);
        const LAST_MEET_COMP_RUN = this.contractData.LAST_COST_TEST_RUN;
        let dsplNum;
        let dsplMsg;
        if (!!LAST_MEET_COMP_RUN) {
            const localTime = GridUtil.convertLocalToPST(new Date());
            const lastruntime = this.momentService.moment(LAST_MEET_COMP_RUN);
            const serverMeetCompPSTTime = lastruntime.format("MM/DD/YY HH:mm:ss");
            const timeDiff = this.momentService.moment.duration(this.momentService.moment(serverMeetCompPSTTime).diff(this.momentService.moment(localTime)));
            const hh = Math.abs(timeDiff.asHours());
            const mm = Math.abs(timeDiff.asMinutes());
            const ss = Math.abs(timeDiff.asSeconds());
            const zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
            this.lastMetCompRunLocalTime = this.momentService.moment(new Date()).subtract(-timeDiff).format("MM/DD/YYYY hh:mm A z") + "(" + zone + ")";
            dsplNum = hh;
            dsplMsg = " hours ago";
            const childForceRun = forceRun != undefined ? forceRun : true;
            let needToRunPct = childForceRun || (this.runIfStaleByHours > 0 && dsplNum >= this.runIfStaleByHours) ? true : false;
            if (dsplNum < 1) {
                dsplNum = mm;
                dsplMsg = " mins ago";
                if (!childForceRun) {
                    needToRunPct = false;
                }
            }
            if (dsplNum < 1) {
                dsplNum = ss;
                dsplMsg = " secs ago";
                if (!childForceRun) {
                    needToRunPct = false;
                }
            }
            if (needToRunPct) {
                this.MC_MODE = "A";
            }
        } else {
            this.MC_MODE = "A";
        }
        if (Math.round(dsplNum) > 0) {
            this.lastMeetCompRunValue = "Meet Comp Last Run: " + Math.round(dsplNum) + dsplMsg;
        }
        else {
            this.lastMeetCompRunValue = "";
        }

        if (this.initialLoad) {
            this.initialLoad = false;
            await this.loadMeetCompData();
        }
    }

    getMeetCompPopupMessage() {
        return MeetCompContractUtil.getMeetCompPopupMessage(this.tempUpdatedList, this.meetCompUnchangedData);
    }

    reBindGridData() {
        this.addErrorClasses(this.meetCompMasterResult);
        this.gridResult = this.meetCompMasterdata
            .Where(function (x) {
                return x.GRP == "PRD" && x.DEFAULT_FLAG == "Y";
            })
            .OrderBy(function (x) {
                return x.MEET_COMP_STS;
            })
            .ToArray();
        this.gridData = process(this.gridResult, this.state);
    }

    async savePopupAction() {
        this.showPopup = false;
        await this.updateMeetComp();
    }

    closePopup() {
        this.showPopup = false;
        const unChangedMeetComp = this.meetCompUnchangedData;
        this.tempUpdatedList = [];
        this.meetCompUpdatedList = [];
        this.meetCompMasterdata = unChangedMeetComp;
        const tempCopy = JSON.parse(JSON.stringify(unChangedMeetComp._elements));
        this.meetCompUnchangedData = new List<any>(tempCopy);
        this.reBindGridData();
    }

    addErrorClasses(dataItems) {
        MeetCompContractUtil.addErrorClasses(dataItems, this.errorList);
    }

    async saveAndRunMeetComp() {
        this.tempUpdatedList = [];
        const isValid = this.isModelValid(this.meetCompUpdatedList);
        if (isValid) {
            this.tempUpdatedList = this.meetCompUpdatedList.map(function (x) {
                return {
                    GRP: x.GRP,
                    CUST_NM_SID: x.CUST_NM_SID,
                    DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                    PRD_CAT_NM: x.PRD_CAT_NM,
                    GRP_PRD_NM: x.GRP_PRD_NM,
                    GRP_PRD_SID: x.GRP_PRD_SID,
                    DEAL_OBJ_SID: x.DEAL_OBJ_SID,
                    DEAL_DESC: x.DEAL_DESC,
                    COMP_SKU: x.COMP_SKU,
                    COMP_PRC: x.COMP_PRC,
                    COMP_BNCH: x.COMP_BNCH,
                    IA_BNCH: x.IA_BNCH,
                    COMP_OVRRD_RSN: x.COMP_OVRRD_RSN,
                    COMP_OVRRD_FLG: x.COMP_OVRRD_FLG == 'Yes' ? true : false,
                    MEET_COMP_UPD_FLG: x.MEET_COMP_UPD_FLG,
                    MEET_COMP_OVERRIDE_UPD_FLG: x.MEET_COMP_OVERRIDE_UPD_FLG
                }
            });
            if (this.tempUpdatedList.length > 0) {
                this.popUpMessage = this.getMeetCompPopupMessage();
                if (this.popUpMessage != null) {
                    this.showPopup = true;
                }
                else {
                    await this.updateMeetComp();
                }
            }
            else if (this.tempUpdatedList.length == 0 && this.isAdhoc == 1) {
                await this.forceRunMeetComp();
            }
        }
        else {
            this.showAlert = true;
            if (this.usrRole == "DA") {
                this.dispMsg = "Analysis Override Status OR Analysis Override Comments can't be Blank.";
            }
            else {
                this.dispMsg = "Meet comp data is missing for some product(s).Please enter the data and save the changes.";
            }
            this.reBindGridData();
        }
    }

    async forceRunMeetComp() {
        this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
        let response: any = await this.meetCompSvc.getMeetCompProductDetails(this.objSid, 'A', this.objTypeId).toPromise().catch((err) => {
            this.loggerSvc.error("Unable to get GetMeetCompProductDetails data", err, err.statusText);
            this.isLoading = false;
        });
        this.meetCompMasterResult = response;
        this.meetCompMasterdata = new List<any>(this.meetCompMasterResult);
        const tempCopy = JSON.parse(JSON.stringify(this.meetCompMasterResult));
        this.meetCompUnchangedData = new List<any>(tempCopy);
        if (this.usrRole == "GA" || (this.usrRole == "FSE" && this.isAdhoc == 1)) {
            this.isModelValid(this.meetCompMasterdata._elements);
        }
        this.reBindGridData();
        this.isLoading = false;
        this.tempUpdatedList = [];
        this.meetCompUpdatedList = [];
        if (this.isAdhoc == 1 && this.PAGE_NM == 'MCTPOPUP') {
            let data = this.meetCompMasterdata._elements.filter(x => x.GRP == 'PRD' && x.DEFAULT_FLAG == "Y");
            if (data && data.length > 0)
                data = sortBy(data, 'MEET_COMP_STS');
            this.refreshMCTData.emit(data)
        }
    }

    async updateMeetComp() {
        this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
        let response: any = await this.meetCompSvc.updateMeetCompProductDetails(this.objSid, this.objTypeId, this.tempUpdatedList).toPromise().catch((err) => {
            this.loggerSvc.error("Unable to save UpdateMeetCompProductDetails data", err, err.statusText);
            this.isLoading = false;
        });
        if (response && response.length > 0) {
            this.meetCompMasterResult = response;
            this.meetCompMasterdata = new List<any>(this.meetCompMasterResult);
            const tempCopy = JSON.parse(JSON.stringify(this.meetCompMasterResult));
            this.meetCompUnchangedData = new List<any>(tempCopy);
            if (this.usrRole == "GA" || (this.usrRole == "FSE" && this.isAdhoc == 1)) {
                this.isModelValid(this.meetCompMasterdata._elements);
            }
            this.reBindGridData();
            await this.lastMeetCompRunCalc();
            if (this.isTender == "1" && ((this.gridData.data[0].MEET_COMP_STS == 'Pass' || this.gridData.data[0].MEET_COMP_STS == 'Fail') || this.gridData.data[0].CAP == 0)) {
                this.tmDirec.emit('PD');
            }
            if (this.isAdhoc == 1 && this.PAGE_NM == 'MCTPOPUP') {
                let data = this.meetCompMasterdata._elements.filter(x => x.GRP == 'PRD' && x.DEFAULT_FLAG == "Y");
                if (data && data.length > 0)
                    data = sortBy(data, 'MEET_COMP_STS');
                this.refreshMCTData.emit(data)
            }            
            this.isLoading = false;
            this.tempUpdatedList = [];
            this.meetCompUpdatedList = [];
        }
    }

    showHelpTopic() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Meet-Comp.aspx', '_blank');
    }

    getDealDeatils(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE) {
        const deal_properties = {
            "DEAL_OBJ_SID": DEAL_OBJ_SID,
            "GRP_PRD_SID": GRP_PRD_SID,
            "DEAL_PRD_TYPE": DEAL_PRD_TYPE
        }
        const dialogRef = this.dialog.open(meetCompDealDetailModalComponent, {
            width: "1350px",
            data: deal_properties,
            panelClass: "groupDealers"
        });
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    };

    public valueNormalizerCompSku = (text: Observable<string>) =>
        text.pipe(
            map((content: string) => {
                return {
                    COMP_SKU: content,
                    RW_NM: -1,
                    key: -1
                };
            })
        );

    public valueNormalizerCompPrc = (text: Observable<number>) =>
        text.pipe(
            map((content: number) => {
                return {
                    COMP_PRC: content,
                    RW_NM: -1,
                    key: -1
                };
            })
        );

    gotoDeal(DealId: any): void {
        //Tender redirect to DE when clicked on Deal_id in Step MC
        if (this.isTender == "1") {
            this.tmDirec.emit('DE');
        } else {
            //Contract redirect to DE when clicked on Deal_id in Meetcomp
            const url = `Contract#/gotoDeal/${DealId}`;
            window.open(url, '_self');
        }
    }

    closeShowAlert() {
        this.showAlert = false;
    }
    ngOnChanges() {
        if (!!this.objSid) {
            this.initialLoad = true;
            this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
            this.lastMeetCompRunCalc();
        }
    }

    ngOnInit() {
        try {
            this.PAGE_NM = this.pageNm;
            if (!!this.objSid) {
                this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                this.lastMeetCompRunCalc();
            }
        }
        catch (ex) {
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('MeetComp::ngOnInit::', ex);
        }
    }
}
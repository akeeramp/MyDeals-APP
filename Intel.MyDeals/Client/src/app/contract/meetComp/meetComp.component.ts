import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, SelectAllCheckboxState, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { meetCompContractService } from "../meetComp/meetComp.component.service";
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Keys } from "@progress/kendo-angular-common";
import { List } from "linqts";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "meet-comp-contract",
    templateUrl: "Client/src/app/contract/meetComp/meetComp.component.html",
    styleUrls: ["Client/src/app/contract/meetComp/meetComp.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class meetCompContractComponent implements OnInit, OnDestroy {

    @Input() private objSid;
    @Input() private isAdhoc;
    @Input() private objTypeId;
    @Input() private lastMeetCompRun;
    @Input() private pageNm;

    constructor(
        private loggerSvc: logger,
        private meetCompSvc: meetCompContractService,
        private formBuilder: FormBuilder
    ) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

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

    public isDataAvaialable = true;
    public errorList = [];
    public validationMessage = "";
    public setUpdateFlag = false;
    public runIfStaleByHours = 3;
    public MC_MODE = "D";
    // public PAGE_NM = pageNm;
    meetCompMasterResult: any[];
    public meetCompMasterdata;
    public meetCompUnchangedData;
    public meetCompUpdatedList = [];
    public meetCompSkuDropdownData = [];
    public meetCompPrcDropdownData = [];
    public totalApiEntries = 0;
    public isMeetCompRun = false;
    public isGridEditable = true;
    public isEditableGrid = "True";
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";

    public selectedCust = '';
    public selectedCustomerText = '';
    public curentRow;

    private gridData: GridDataResult;
    private childGridData: GridDataResult;
    private gridResult;
    public childGridResult;
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

    distinctPrimitiveChild(fieldName: string): any {
        return distinct(this.childGridResult, fieldName).map(
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
        this.childGridData = process(this.childGridResult, this.childState);
        return this.childGridData;
    }

    public cellClickHandler(args: CellClickEvent): void {
        if(args.column.field == "COMP_SKU") {
            this.generateMeetCompSkuDropdownData(args.dataItem);
        }else if (args.column.field == "COMP_PRC"){
            this.generateMeetCompPrcDropdownData(args.dataItem);
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
                    }).GroupBy( (x)=> {
                        return (x.COMP_SKU);
                    })
            } else {
                resultObj = meetCompListObj.Where((x) => {
                    return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == dataItem.GRP);
                }).GroupBy( (x)=> {
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
        }
    }

    public generateMeetCompPrcDropdownData(dataItem){
        if (!(this.canUpdateMeetCompSKUPriceBench && dataItem.MEET_COMP_UPD_FLG == "Y" && dataItem.COMP_SKU.length !== 0)) {
             //Not Editable hence no data for dropdown
             this.meetCompPrcDropdownData = [];
        }
        else {
            let resultObj;
            const meetCompListObj = new List<any>(this.meetCompMasterResult);
            if (dataItem.GRP != "PRD") {
                resultObj = meetCompListObj
                    .Where( (x)=> {
                        return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.COMP_PRC != null );
                    })
                    .GroupBy( (x)=> {
                        return (x.COMP_PRC);
                    })
            } else {
               resultObj = meetCompListObj
                    .Where( (x) =>{
                        return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID &&
                            x.COMP_PRC != null &&
                            x.GRP == dataItem.GRP);
                    })
                    .GroupBy( (x) =>{
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
                this.resetDealItems(this.meetCompMasterdata._elements[selectedID - 1].GRP_PRD_SID, filterList,isSelected); // Reset All the Deals not copied from Peers
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
                this.resetDealItems(this.meetCompMasterdata._elements[selectedID - 1].GRP_PRD_SID, this.meetCompMasterdata,isSelected); // Reset All the Deals not copied from Peers
            }
        }
        //Holding expanded column
        if (selectedID == 'all') {
            // expandSelected();
        }
    }

    resetDealItems(GRP_PRD_SID, data,isSelected) {
        //Getting all Child Item
        const tempDealData =data
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
        let filterData;
        if (this.state.filter.filters.length > 0) {
            filterData = this.gridData.data;
        }
        else {
            filterData = this.meetCompMasterdata.ToArray();
        }
        //UPDATE Selected Product ROWS
        const selectedData = filterData
            .filter( (x)=> {
                return (x.IS_SELECTED == true);
            })
        return selectedData;
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
            let isUpdated = false;
            //Update child
            if (this.meetCompMasterdata._elements[this.curentRow - 1].GRP == "PRD") {
                let selData = [];
                if (isSelected) {
                    selData = this.getProductLineData();
                }
                if (selData.length > 0) {
                    isUpdated = true;
                    for (let cntData = 0; selData.length > cntData; cntData++) {
                        const temp_grp_prd = selData[cntData].GRP_PRD_SID;
                        //Updating Product Line
                        if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                            this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_SKU = this.selectedCustomerText;
                            this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                        }
                        //Updating Deal line
                        const tempData =this.meetCompUnchangedData
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
                        .Where( (x)=> {
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
                    if (tempData.length > 0) {
                        isUpdated = true;
                    }
                }
                if (isUpdated) {
                    // expandSelected("COMP_SKU", $scope.curentRow);
                }
            }
        }
    }

    loadMeetCompData() {
        this.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
        this.MC_MODE = "A";
        this.meetCompSvc.getMeetCompProductDetails(this.objSid, this.MC_MODE, this.objTypeId).subscribe(
            (response: Array<any>) => {
                response.forEach( (obj) => {
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
                });
                this.meetCompMasterResult = response;
                this.totalApiEntries = this.meetCompMasterResult.length;
                this.meetCompMasterdata = new List<any>(this.meetCompMasterResult);
                const tempCopy = JSON.parse(JSON.stringify(this.meetCompMasterResult));
                this.meetCompUnchangedData = new List<any>(tempCopy);
                this.gridResult = this.meetCompMasterdata
                    .Where(function (x) {
                        return x.GRP == "PRD" && x.DEFAULT_FLAG == "Y";
                    })
                    .OrderBy(function (x) {
                        return x.MEET_COMP_STS;
                    })
                    .ToArray();
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;
            },
            error => {
                this.loggerSvc.error(
                    "Unable to get GetMeetCompProductDetails data",
                    error
                );
            }
        );
    }

    onCompSkuChange(val: any,dataItem:any) {
        const selectedIndx = val.RW_NM;
        this.selectedCustomerText = (val.COMP_SKU).trim();
        this.selectedCust =dataItem.CUST_NM_SID;
        this.curentRow =dataItem.RW_NM;
        if (selectedIndx == -1 && this.selectedCustomerText.trim().length > 0) {
            this.addSKUForCustomer("0",dataItem.IS_SELECTED);
            dataItem.COMP_SKU = this.selectedCustomerText.trim();
        }
        else if (selectedIndx > -1 && this.selectedCustomerText.trim().length > 0) {
            const selectedValue = val.RW_NM;
            dataItem.COMP_SKU = this.selectedCustomerText.trim();

            let tempprcData = [];
            dataItem.COMP_PRC = parseFloat(this.meetCompMasterdata._elements[selectedValue - 1].COMP_PRC).toFixed(2);
            let isUpdated = false;
            if (dataItem.GRP == "PRD") {
                let selData = [];
                if (dataItem.IS_SELECTED) {
                    selData = this.getProductLineData();
                }
                this.addSKUForCustomer("0", dataItem.IS_SELECTED);
                if (selData.length > 0) {
                    isUpdated = true;
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
                    if (tempprcData.length > 0) {
                        isUpdated = true;
                    }
                }
            }
            this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_SKU = (val.COMP_SKU).trim();
            // Setting COMP PRC based on Comp SKU if available
            this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_PRC = parseFloat(this.meetCompMasterdata._elements[selectedValue - 1].COMP_PRC).toFixed(2);
            this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);

            //Retaining the same expand
            if (isUpdated) {
                // expandSelected("COMP_SKU", options.model.RW_NM);
            }
        }
    }

    onCompPriceChange(val: any,dataItem:any) {
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
                let isUpdated = false;
                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    if (selData.length > 0) {
                        isUpdated = true;
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

                        if (tempData.length > 0) {
                        isUpdated = true;
                        }
                    }
                }
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_PRC = dataItem.COMP_PRC;
                this.addToUpdateList(dataItem);

                //Retaining the same expand
                if (isUpdated) {
                // expandSelected("COMP_PRC", options.model.RW_NM);
                }
            } else {
                return false;
            }
        }
    }

    onIaBnchChange(val:any,dataItem:any){
        if (this.meetCompMasterdata._elements[dataItem.RW_NM - 1].IA_BNCH != val) {
            dataItem.IA_BNCH = val;
            if (val > 0) {
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
                let isUpdated = false;
                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    if (selData.length > 0) {
                        isUpdated = true;
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
                    }else {
                        const tempData = this.meetCompUnchangedData
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                            })
                            .ToArray();

                        for (let i = 0; i < tempData.length; i++) {
                            this.meetCompMasterdata._elements[tempData[i].RW_NM - 1].IA_BNCH = dataItem.IA_BNCH;
                            this.addToUpdateList(this.meetCompMasterdata._elements[tempData[i].RW_NM - 1]);
                        }

                        if (tempData.length > 0) {
                            isUpdated = true;
                        }
                    }
                    //Retaining the same expand
                    if (isUpdated) {
                        // expandSelected("IA_BNCH", options.model.RW_NM);
                    }
                }
            }
            else {
                return false;
            }

        }
    }

    onCompBnchChange(val:any,dataItem:any){
        if (this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_BNCH != val) {
            dataItem.COMP_BNCH = val;
            if (val > 0) {
                this.meetCompMasterdata._elements[dataItem.RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                this.addToUpdateList(this.meetCompMasterdata._elements[dataItem.RW_NM - 1]);
                let isUpdated = false;

                if (dataItem.GRP == "PRD") {
                    let selData = [];
                    if (dataItem.IS_SELECTED) {
                        selData = this.getProductLineData();
                    }
                    if (selData.length > 0) {
                        isUpdated = true;
                        for (let cntData = 0; selData.length > cntData; cntData++) {
                            const temp_grp_prd = selData[cntData].GRP_PRD_SID;

                            //Updating Product Line
                            if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && selData[cntData].PRD_CAT_NM.toLowerCase() == "svrws") {
                                this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1].COMP_BNCH = dataItem.COMP_BNCH;
                                this.addToUpdateList(this.meetCompMasterdata._elements[selData[cntData].RW_NM - 1]);
                            }

                            //Updating Deal line
                            const tempData =this.meetCompUnchangedData
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

                        if (tempData.length > 0) {
                            isUpdated = true;
                        }
                    }

                    //Retaining the same expand
                    if (isUpdated) {
                        // expandSelected("COMP_BNCH", options.model.RW_NM);
                    }

                }
            }
            else {
                return false;
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

    lastMeetCompRunCalc() {
        return "Meet Comp Last Run: 2 hrs ago";
    }

    saveAndRunMeetComp() {
        //kujoih
    }

    forceRunMeetComp() {
        //sjcvacv
    }

    showHelpTopic() {
        //kyhvkyuv
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "startsWith",
    };

    public valueNormalizerCompSku =(text: Observable<string>)=>
        text.pipe(
          map((content: string) => {
            return {
              COMP_SKU : content,
              RW_NM: -1,
              key: -1
            };
          })
        );

    public valueNormalizerCompPrc = (text: Observable<number>)=>
        text.pipe(
          map((content: number) => {
            return {
              COMP_PRC : content,
              RW_NM: -1,
              key: -1
            };
          })
        );

    ngOnInit(): void {
        this.loadMeetCompData();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "meetCompContract",
        downgradeComponent({ component: meetCompContractComponent })
    );

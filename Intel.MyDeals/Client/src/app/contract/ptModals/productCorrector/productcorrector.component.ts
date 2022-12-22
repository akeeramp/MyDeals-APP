import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, GridComponent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import * as _ from "underscore";
import { MatDialog } from '@angular/material/dialog';
import { SelectableSettings } from '@progress/kendo-angular-treeview';
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";

import { logger } from "../../../shared/logger/logger";

import { ProductSelectorComponent } from "../productSelector/productselector.component";
import { PTE_Common_Util } from "../../PTEUtils/PTE_Common_util";
import { List } from 'linqts';
import { PTEUtil } from '../../PTEUtils/PTE.util';
import * as moment from 'moment';
import { ProductBreakoutComponent } from '../productSelector/productBreakout/productBreakout.component';

@Component({
    selector: 'product-corrector',
    templateUrl: 'Client/src/app/contract/ptModals/productCorrector/productcorrector.component.html',
    styleUrls: ['Client/src/app/contract/ptModals/productCorrector/productcorrector.component.css']
})
export class ProductCorrectorComponent {
    constructor(public dialogRef: MatDialogRef<ProductCorrectorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loggerService: logger,
        private dialogService: MatDialog,
        popoverConfig: NgbPopoverConfig) {
        popoverConfig.placement = 'auto';
        popoverConfig.container = 'body';
        popoverConfig.autoClose = 'outside';
        popoverConfig.animation = false;
        popoverConfig.triggers = 'mouseenter:mouseleave';   // Disabled to use default click behaviour to prevent multiple popover windows from appearing
        popoverConfig.openDelay = 500;   // milliseconds
        popoverConfig.closeDelay = 500;
    }
    @ViewChild('pdtCrtGrid') grid: GridComponent;
    private totRows = 0;
    public curRowIndx = 0;
    public numIssueRows = 0;
    private curRow = {};
    private issueRowKeys = [];
    private rowDCId = "";
    private curRowProds = [];
    private curRowData = [];
    private curRowIssues = [];
    private isPrdCollapsed = false;
    private isExcludePrdCollapsed = false;
    private isCalCollapsed = false;
    private isLvlCollapsed = false;
    private invalidProdName = '';
    private ProductCorrectorData: any;
    private allDone = false;
    private curRowDone = false;
    private isIncludeProd = false;
    private isExcludeProd = false;
    private DEAL_TYPE: string="";
    private showIncludeExcludeLabel = false;
    private selectedItms = [];
    private curRowCategories = [];
    private curRowLvl = [];
    private curRowPrdCnt = 0;
    private  isGA = false;//window.usrRole == "GA"; Commeneted this stop showing L1/L2 columns till legal approves
    private isTender = "";
    private curRowId: any;
    private lookUp: any;
    private prodType: any = 'I';
    private isLoading = true;
    private prdNm = "";
    private prodRemoveConfirm = false;
    private removeExclude: any;
    private selGridResult: any[] = [];
    private selGridData: GridDataResult;
    private dataFilter = [];
    private curRowIncProd: any[];
    private curRowExcludeProd: any[];
    private deletedProductDetails: any[] = [];
    public selection: SelectableSettings = { mode: "multiple" };
    public rowCallback = (args) => ({
        'hide-row': (args.dataItem.PRD_MBR_SID == 0)
    });
    private crossVertical = {
        'productCombination1': ["DT", "Mb", "SvrWS", "EIA CPU"],
        'productCombination2': ["CS", "EIA CS"],
        'message': "The product combination is not valid. You can combine (DT, Mb, SvrWS, EIA CPU) or (CS, EIA CS) verticals. For NON IA, you can combine as many products within same verticals for PROGRAM, VOLTIER and REV TIER deals."
    }
    private duplicateMsg: string = "";
    private duplicateData: any;
    private isDuplicate = false;
    selectedProducts: any = [];

    private state: State = {
        skip: 0,
        take: 25,
        group: [{ field: "USR_INPUT" }],
        // Initial filter descriptor
        filter: {
            logic: "or",
            filters: [],
        },
    };
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];
    
   
    distinctPrimitive(fieldName: string): any {
        return distinct(this.selGridResult, fieldName).map(item => item[fieldName]);
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.selGridData = process(this.selGridResult, this.state);
    }
    isValidCapDetails(productJson, showErrorMesssage) {
        if (this.DEAL_TYPE !== 'ECAP' && this.DEAL_TYPE !== 'KIT') {
            return !showErrorMesssage ? false : productJson.HIER_NM_HASH;
        }
        var errorMessage = "";
        var cap = productJson.CAP.toString();
        if (cap.toUpperCase() == "NO CAP") {
            errorMessage = "Product entered does not have CAP within the Deal's start date and end date.";
        }
        if (cap.indexOf('-') > -1) {
            errorMessage = "CAP price " + cap + " cannot be a range.";
        }
        if (!showErrorMesssage) {
            return errorMessage == "" ? false : true;
        } else {
            return errorMessage == "" ? productJson.HIER_NM_HASH : errorMessage;
        }
    }
    replaceString(item) {
        return "prdChk" + item.PRD_MBR_SID + item.USR_INPUT.toLowerCase().replace(/\s/g, "_").trim();
    }
    prdLvlDecoder(indx) {
        if (indx === 7003) return "Product Vertical";
        if (indx === 7004) return "Brand";
        if (indx === 7005) return "Family";
        if (indx === 7006) return "Processor #";
        if (indx === 7007) return "L4";
        if (indx === 7008) return "Material Id";
        return "";
    }

    updateRowDcId() {
        setTimeout(() => {
            if (this.data.selRows.length > 1) {
                this.rowDCId = this.data.selRows.filter(x => x.DC_ID == this.issueRowKeys[this.curRowIndx - 1])[0].DC_ID;               
            } else {
                this.rowDCId = this.data.selRows[0].DC_ID;
            }
        });
    }
    initProducts(){
        this.totRows = 0;
        this.numIssueRows = 0;
        this.issueRowKeys = [];
        this.curRow = {};
        this.curRowIndx = 0;
        this.curRowProds = [];
        this.curRowData = [];
        this.curRowIssues = [];
        var key;
        let correctorData = this.data.ProductCorrectorData;
        var issueRowIds = [];

        if (!!correctorData.DuplicateProducts) {
            for (key in correctorData.DuplicateProducts) {
                if (correctorData.DuplicateProducts.hasOwnProperty(key)) {
                    if (issueRowIds.indexOf(key) < 0) issueRowIds.push(key);
                    if (this.issueRowKeys.indexOf(key) < 0) this.issueRowKeys.push(key);
                }
            }
        }

        if (!!correctorData.InValidProducts) {
            for (key in correctorData.InValidProducts) {
                if (correctorData.InValidProducts.hasOwnProperty(key) && (correctorData.InValidProducts[key]["E"].length > 0
                    || correctorData.InValidProducts[key]["I"].length > 0)) {
                    if (issueRowIds.indexOf(key) < 0) issueRowIds.push(key);
                    if (this.issueRowKeys.indexOf(key) < 0) this.issueRowKeys.push(key);
                }
            }
        }

        this.numIssueRows = issueRowIds.length;
        this.totRows = Object.keys(correctorData.ProdctTransformResults).length;
    }
    getFullNameOfProduct(item) {
        // When a product belongs to two different family, get the full path
        if (item.PRD_ATRB_SID == 7006) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR)).trim();
        }
        if (item.PRD_ATRB_SID == 7007) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR) + " " + item.DEAL_PRD_NM).trim();
        }
        if (item.PRD_ATRB_SID == 7008) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR) + " " + item.DEAL_PRD_NM
                + " " + item.MTRL_ID).trim();
        }
        if (item.PRD_ATRB_SID > 7005) return item.HIER_VAL_NM;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }

    validCrossVerticals(item) {
        if (this.DEAL_TYPE === 'ECAP' || this.DEAL_TYPE === 'KIT') return true;
        const existingProductTypes = [];
        for (const key in this.ProductCorrectorData.ValidProducts[this.curRowId]) {
            _.each(this.ProductCorrectorData.ValidProducts[this.curRowId][key], (product) =>{
                existingProductTypes.push(product.PRD_CAT_NM);
            });
        }

        const existingProdTypes = _.uniq(existingProductTypes, 'PRD_CAT_NM');

        const isValid = this.isValidProductCombination(existingProdTypes, item.PRD_CAT_NM);
        // Check if valid combination
        if (!isValid) {
            this.loggerService.error(this.crossVertical.message,"")
         }
        return isValid;
    }
    isValidProductCombination(existingProdTypes, newProductType) {
        var isValid = true;
        if (this.DEAL_TYPE == 'FLEX') {
            return true;
        }
        var selfCheck = newProductType == undefined;
        for (var i = 0; i < existingProdTypes.length; i++) {
            if (i == existingProdTypes.length - 1 && selfCheck) break;
            newProductType = selfCheck ? existingProdTypes[i + 1] : newProductType;
            if (this.crossVertical.productCombination1.includes(existingProdTypes[i])) {
                isValid = this.crossVertical.productCombination1.includes(newProductType);
                if (!isValid) break;
            }
            else if (this.crossVertical.productCombination2.includes(existingProdTypes[i])) {
                isValid = this.crossVertical.productCombination2.includes(newProductType);
                if (!isValid) break;
            } else {
                isValid = existingProdTypes[i] == newProductType;
                if (!isValid) break;
            }
        };
        return isValid
    }
    validateNoOfKITProducts() {
        var noOfValidItem = (this.isTender == '1' && this.DEAL_TYPE.toLowerCase() == 'ecap') ? 1 : 10; //Added Tender ECAP Rules
        var validProducts = this.curRowProds.filter(x => x.status === 'Good').length;

        var resolvedProducts = this.curRowProds.reduce((accumulator, current) => {
            if (current.status === 'Issue')
                return accumulator + current.matchName.length;
        },0);
        if (parseInt(resolvedProducts) + validProducts >= noOfValidItem) {
            this.loggerService.error("You have too many products! You may have up to " + noOfValidItem + " product(s).","");
            return false;
        }
        return true;
    }
    selectRow(indx, bypassFilter?) {
        let x;
        let isDirty = false;

        this.curRowDone = false;
        this.curRowIndx = indx;
        this.curRowId = this.issueRowKeys[this.curRowIndx - 1];
        this.updateRowDcId();
        this.curRow = !!this.ProductCorrectorData.DuplicateProducts[this.curRowId]
            ? this.ProductCorrectorData.DuplicateProducts[this.curRowId]
            : this.ProductCorrectorData.InValidProducts[this.curRowId];
        this.curRowProds = [];

        // Manage all products entered for the row's cell
        for (const ptr in this.ProductCorrectorData.ProdctTransformResults[this.curRowId]) {
            if (this.ProductCorrectorData.ProdctTransformResults[this.curRowId].hasOwnProperty(ptr)) {
                for (let p = 0; p < this.ProductCorrectorData.ProdctTransformResults[this.curRowId][ptr].length; p++) {
                    const item = this.ProductCorrectorData.ProdctTransformResults[this.curRowId][ptr][p];
                    let reason = "Found the Product";
                    let status = "Good";
                    let exclude = "";
                    const matchName = [];
                    let cnt = 0;

                    if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId] && !!this.ProductCorrectorData.DuplicateProducts[this.curRowId][item]) {
                        reason = "Found multiple matches";
                        status = "Issue";
                        if (this.ProductCorrectorData.DuplicateProducts[this.curRowId][item].length > 0) {
                            cnt += new List<any>(this.ProductCorrectorData.DuplicateProducts[this.curRowId][item])
                                .Where((x) => {
                                    return (x.EXCLUDE == (ptr == "E"));
                                }).ToArray().length;
                        }
                    }
                    if (!!this.ProductCorrectorData.InValidProducts[this.curRowId][ptr] && this.ProductCorrectorData.InValidProducts[this.curRowId][ptr].indexOf(item) >= 0) {
                        reason = "Unable to locate the product";
                        status = "Issue";
                        exclude = ptr;
                    }

                    // Look for valid products with soft warnings
                    if (!!this.ProductCorrectorData.ValidProducts[this.curRowId] && !!this.ProductCorrectorData.ValidProducts[this.curRowId][item] && !!this.ProductCorrectorData.ValidProducts[this.curRowId][item][0]) {
                        // recently fixed item
                        if (status === "Issue") {
                            const name = [];
                            const pItem = this.ProductCorrectorData.ValidProducts[this.curRowId][item];
                            for (let n = 0; n < pItem.length; n++) {
                                name.push(pItem[n].HIER_VAL_NM);
                            }
                            for (let ii = 0; ii < name.length; ii++) {
                                matchName.push(name[ii]);
                            }

                        }
                    }

                    this.curRowProds.push({
                        "id": p,
                        "name": item,
                        "anchorName": item,
                        "status": status,
                        "reason": reason,
                        "cnt": cnt,
                        "matchName": matchName,
                        "exclude": ptr
                    });

                    if (matchName.length === 0 && status === "Issue") isDirty = true;
                }
            }
        }

        //Build Datasource
        this.curRowData = [];
        this.curRowCategories = [];
        this.curRowLvl = [];
        this.curRowIssues = [];
        const curRowCategories1 = [];
        const curRowLvl = [];
        this.curRowPrdCnt = 0;
        if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) {
            let flag = false;
            let dataitem = this.ProductCorrectorData.DuplicateProducts[this.curRowId];
            let validDataItem = this.ProductCorrectorData.ValidProducts[this.curRowId];
            for (let k in dataitem) {
                if (dataitem.hasOwnProperty(k)) {
                    this.curRowPrdCnt++;
                    if (!!dataitem[k]) {
                        for (let r = 0; r < dataitem[k].length; r++) {
                            if (dataitem[k][r]['DISP_HIER_VAL_NM'] == undefined) {
                                dataitem[k][r]['DISP_HIER_VAL_NM'] = dataitem[k][r]["HIER_VAL_NM"];
                            }
                            if (!!this.ProductCorrectorData.ValidProducts[this.curRowId]) {

                                if (!!this.ProductCorrectorData.ValidProducts[this.curRowId][k] && this.ProductCorrectorData.ValidProducts[this.curRowId][k].length > 0) {
                                    let result = [];
                                    result = validDataItem[k].filter((value) =>{
                                        return value.PRD_MBR_SID == dataitem[k][r].PRD_MBR_SID && value.USR_INPUT == dataitem[k][r].USR_INPUT;
                                    });
                                    if (result.length > 0) {
                                        let flag = true;
                                        dataitem[k][r]["IS_SEL"] = true;
                                    }
                                }
                            }
                            if (flag == false) {
                                dataitem[k][r]["IS_SEL"] = false;
                            }
                            this.curRowData.push(dataitem[k][r]);
                            flag = false;
                            if (curRowCategories1.indexOf(dataitem[k][r].PRD_CAT_NM) < 0)
                                curRowCategories1.push(dataitem[k][r].PRD_CAT_NM);
                            if (curRowLvl.indexOf(dataitem[k][r].PRD_ATRB_SID) < 0)
                                curRowLvl.push(dataitem[k][r].PRD_ATRB_SID);
                        }
                    }
                }
            }
        }

        //Remove Search Header
        this.isIncludeProd = new List<any>(this.curRowProds)
            .Where((x) =>{
                return (x.exclude == "I");
            }).ToArray().length > 0;

        this.isExcludeProd = new List<any>(this.curRowProds)
            .Where((x)=> {
                return (x.exclude == "E");
            }).ToArray().length > 0;

        // Build filters
        for (x = 0; x < this.curRowProds.length; x++) {
            if (this.curRowProds[x].status === "Issue") {
                this.curRowIssues.push({
                    "id": x,
                    "name": this.curRowProds[x].name,
                    "anchorName": this.curRowProds[x].anchorName,
                    "value": this.curRowProds[x].name,
                    "selected": false,
                    "status": this.curRowProds[x].status,
                    "cnt": this.curRowProds[x].cnt,
                    "exclude": this.curRowProds[x].exclude
                });
            }
        }
        for (x = 0; x < curRowCategories1.length; x++) {
            this.curRowCategories.push({
                "id": x,
                "name": curRowCategories1[x],
                "value": curRowCategories1[x],
                "selected": false
            });
        }
        for (x = 0; x < curRowLvl.length; x++) {
            this.curRowLvl.push({
                "id": x,
                "name": this.prdLvlDecoder(curRowLvl[x]),
                "value": curRowLvl[x],
                "selected": false
            });
        }

        this.curRowDone = !isDirty;

        for (const key in this.curRowIssues) {
            if (this.curRowIssues.hasOwnProperty(key) && this.curRowIssues[key].cnt == 0) {
                const emptyData = {
                    BRND_NM: "",
                    CAP: "",
                    CAP_END: "01/01/1900",
                    CAP_START: "01/01/1900",
                    DEAL_PRD_NM: "",
                    DEAL_PRD_TYPE: "",
                    FMLY_NM: "",
                    HAS_L1: "",
                    HAS_L2: "",
                    HIER_NM_HASH: "",
                    DISP_HIER_VAL_NM: "",
                    HIER_VAL_NM: "",
                    MM_MEDIA_CD: "",
                    MTRL_ID: "",
                    PCSR_NBR: "",
                    PRD_ATRB_SID: "",
                    PRD_CAT_NM: "",
                    PRD_END_DTM: "01/01/1900",
                    PRD_MBR_SID: 0,
                    PRD_STRT_DTM: "01/01/1900",
                    USR_INPUT: this.curRowIssues[key].name,
                    YCS2: "",
                    YCS2_END: "",
                    YCS2_START: "",
                    EXCLUDE: false
                }
                this.curRowData.push(emptyData);
            }
        }

        _.each(this.selectedItms, (selectItem) => {
            _.each(this.curRowData, (rowDataItem) => {
                if (rowDataItem.PRD_MBR_SID != 0 && rowDataItem.PRD_MBR_SID == selectItem.PRD_MBR_SID)
                    rowDataItem.IS_SEL = true;
            })
        })
        if (this.curRowProds && this.curRowProds.length > 0) {
            this.curRowIncProd = this.curRowProds.filter(x => x.exclude == 'I');
            this.curRowExcludeProd = this.curRowProds.filter(x => x.exclude == 'E');
        }
        else {
            this.curRowIncProd = [];
            this.curRowExcludeProd = [];
        }
        this.selGridResult = this.curRowData;
        this.selGridData = process(this.curRowData, this.state);
        if (!bypassFilter) this.applyFilterAndGrouping();
        setTimeout(() => {
            this.toggleColumnsWhenEmptyConflictGrid(this.curRowData);
        }, 1000);
    }
    toggleColumnsWhenEmptyConflictGrid(data) {
        if (!!this.grid) {
            this.grid.columns.forEach(item => {
                let columnValue = _.uniq(data, item['field']);
                if (columnValue.length == 1 && item['field'] !== undefined && item['field'] != "CheckBox" && item['field'] != "IS_SEL" && item['field'] != "USR_INPUT" && item['field'] != 'CAP' && item['field'] != 'YCS2' &&
                    (columnValue[0][item['field']] === "" || columnValue[0][item['field']] == null || columnValue[0][item['field']] == 'NA')) {
                    item.hidden = true;
                } else if (item['field'] !== 'HAS_L1') {
                    item.hidden = false;
                }
            })
        }
    }
    checkForDuplicateProducts(item, lookup) {
        let validProducts = [];
        for (var key in this.data.ProductCorrectorData.ValidProducts[this.curRowId]) {
            if (this.data.ProductCorrectorData.ValidProducts[this.curRowId].hasOwnProperty(key)) {
                _.each(this.data.ProductCorrectorData.ValidProducts[this.curRowId][key], (item)=> {
                    validProducts.push(item);
                });
            }
        }

        let duplicateProducts = validProducts.filter(x => x.PRD_MBR_SID == item.PRD_MBR_SID && x.EXCLUDE == item.EXCLUDE);
        this.isDuplicate = duplicateProducts.length > 0;
        if (this.isDuplicate) {
            this.prodType = item.EXCLUDE ? 'E' : 'I';
            this.duplicateMsg = 'Found duplicate product for ' + item.HIER_VAL_NM + ', would you like to remove one ?';
            this.duplicateData = item;
            this.lookUp = lookup;
        }
        return this.isDuplicate;
    }
    closeKendoDialog(optionSelected) {
        if (optionSelected == 'yes') {

            this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.lookUp] = this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.lookUp].filter((prod) => prod.PRD_MBR_SID !== this.duplicateData.PRD_MBR_SID);
            this.curRowData = this.curRowData.filter((prod) => !(prod.PRD_MBR_SID == this.duplicateData.PRD_MBR_SID && prod.USR_INPUT == this.duplicateData.USR_INPUT));
            for (var aa = 0; aa < this.curRowIssues.length; aa++) {
                if (this.curRowIssues[aa].anchorName === this.duplicateData.USR_INPUT) {
                    this.curRowIssues[aa].cnt = this.curRowData.filter(x => x.USR_INPUT == this.duplicateData.USR_INPUT).length;
                }
            }
                   
            var delProduct = false;
            if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) {
                if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.lookUp]) {
                    if (this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.lookUp].length == 0) {
                        var transItem = this.ProductCorrectorData.ProdctTransformResults[this.curRowId][this.prodType];
                        for (var t = 0; t < transItem.length; t++) {
                            if (transItem[t] === this.lookUp) {
                                transItem.splice(t, 1);
                                delProduct = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (delProduct) {
                // Delete from Issue Key
                for (var r = 0; r < this.curRowProds.length; r++) {
                    if (!!this.curRowProds[r] && this.curRowProds[r].name === this.lookUp && (this.curRowProds[r].exclude === this.prodType)) {
                        this.curRowProds.splice(r, 1);
                        break;
                    }
                }
            }
        }
        if (this.curRowProds && this.curRowProds.length > 0) {
            this.curRowIncProd = this.curRowProds.filter(x => x.exclude == 'I');
            this.curRowExcludeProd = this.curRowProds.filter(x => x.exclude == 'E');
        }
        else {
            this.curRowIncProd = [];
            this.curRowExcludeProd = [];
        }
        this.isDuplicate = false;
        this.duplicateData = [];
    }
    clickProd (id, lookup, name, event) {
        let item = PTEUtil.findInArrayWhere(this.curRowProds, "name", lookup);
        if (!item) return;
        const allMatched = true;
        const isChecked = event.target.checked;
        if (isChecked) {
            let foundItem = PTEUtil.findInArrayWhere(this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name], "PRD_MBR_SID", id);
            if (!this.validCrossVerticals(foundItem)) {
                event.target.checked = false;
                return;
            }
            if (((this.DEAL_TYPE === "KIT" || (this.isTender == '1' && this.DEAL_TYPE.toLowerCase() == 'ecap')) && !this.validateNoOfKITProducts())) { //Added Tender ECAP Rules
                event.target.checked = false;
                return;
            }

            if (!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) return;
            if (!this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name]) return;

            foundItem = PTEUtil.findInArrayWhere(this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name], "PRD_MBR_SID", id);
            if (!foundItem) return;

            if (this.checkForDuplicateProducts(foundItem, lookup)) {
                event.target.checked = false;
                return;
            }

            //Item added from the selected List
            item.matchName.push(this.getFullNameOfProduct(foundItem));
            //Added to check Uncheck Checkbox
            let addSelIndex = -1;
            this.selectedItms.some((e, i)=> {
                if (e.PRD_MBR_SID == id && e.ROW_NM == this.curRowId) {
                    addSelIndex = i;
                    return true;
                }
            });
            if (addSelIndex == -1) {
                this.selectedItms.push({
                    "PRD_MBR_SID": foundItem.PRD_MBR_SID,
                    "ROW_NM": foundItem.ROW_NM,
                    "HIER_NM_HASH": foundItem.HIER_NM_HASH,
                    'USR_INPUT': foundItem.USR_INPUT
                });
            }

            if (!this.ProductCorrectorData.ValidProducts[this.curRowId]) this.ProductCorrectorData.ValidProducts[this.curRowId] = {};
            if (!this.ProductCorrectorData.ValidProducts[this.curRowId][item.name]) this.ProductCorrectorData.ValidProducts[this.curRowId][item.name] = [];
            foundItem.HIER_VAL_NM = this.getFullNameOfProduct(foundItem);
            foundItem.DERIVED_USR_INPUT = this.getFullNameOfProduct(foundItem);
            this.ProductCorrectorData.ValidProducts[this.curRowId][item.name].push(foundItem);

            this.curRowData.forEach((item) =>{
                if (item.PRD_MBR_SID == foundItem.PRD_MBR_SID) {
                    item.IS_SEL = true;
                }
            });

            if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) {
                if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId][lookup]) {
                    if (this.ProductCorrectorData.DuplicateProducts[this.curRowId][lookup].length == 1) {
                        this.removeAndFilter(item.name);
                    }
                }
            }
        }
        else {
            //Item deleted from the selected List
            let foundItem = PTEUtil.findInArrayWhere(this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name], "PRD_MBR_SID", id);
            let delIndex = -1;
            item.matchName.some((e, i)=> {
                if (e == this.getFullNameOfProduct(foundItem)) {
                    delIndex = i;
                    return true;
                }
            });
            if (delIndex > -1) {
                item.matchName.splice(delIndex, 1);
            }

            let delSelIndex = -1;
            this.selectedItms.some((e, i) =>{
                if (e.PRD_MBR_SID == id && e.ROW_NM == this.curRowId) {
                    delSelIndex = i;
                    return true;
                }
            });
            if (delSelIndex > -1) {
                this.selectedItms.splice(delSelIndex, 1);
            }

            if (!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) return;
            if (!this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name]) return;

            foundItem = PTEUtil.findInArrayWhere(this.ProductCorrectorData.DuplicateProducts[this.curRowId][item.name], "PRD_MBR_SID", id);
            if (!foundItem) return;

            if (!this.ProductCorrectorData.ValidProducts[this.curRowId]) this.ProductCorrectorData.ValidProducts[this.curRowId] = {};
            if (!this.ProductCorrectorData.ValidProducts[this.curRowId][item.name]) this.ProductCorrectorData.ValidProducts[this.curRowId][item.name] = [];

            this.ProductCorrectorData.ValidProducts[this.curRowId][item.name] = this.ProductCorrectorData.ValidProducts[this.curRowId][item.name].filter( (obj)=> {
                return obj.PRD_MBR_SID != foundItem.PRD_MBR_SID;
            });
            if (this.ProductCorrectorData.ValidProducts[this.curRowId][item.name].length === 0) delete this.ProductCorrectorData.ValidProducts[this.curRowId][item.name];
            this.curRowData.forEach((item)=> {
                if (item.PRD_MBR_SID == foundItem.PRD_MBR_SID) {
                    item.IS_SEL = false;
                }
            });
        }
    }
    removeAndFilter(prdName) {
        // remove
        if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId]) {
            delete this.ProductCorrectorData.DuplicateProducts[this.curRowId][prdName];
            this.ProductCorrectorData.DuplicateProducts[this.curRowId][prdName] = {};
        }

        let isEmpty = true;
        for (let r = 0; r < this.curRowIssues.length; r++) {
            if (this.curRowIssues[r].name === prdName) this.curRowIssues[r].cnt = NaN;
            if (!isNaN(this.curRowIssues[r].cnt) && this.curRowIssues[r].cnt > 0) isEmpty = false;
        }

        // let's purge the local storage if all products are matched
        if (isEmpty) {
            this.curRowData = [];
        }

        this.applyFilterAndGrouping();

        this.selectRow(this.curRowIndx);

        let allMatched = true;
        for (let m = 0; m < this.curRowProds.length; m++) {
            if (this.curRowProds[m].matchName.length == 0 && this.curRowProds[m].status === "Issue") allMatched = false;
        }

        if (allMatched && this.curRowIndx <= this.numIssueRows) {
            if (!this.nextAvailRow()) {
                // no more work to do
                this.allDone = true;
            }
        }
    }
    clkPrdUsrNm(dataItem) {
        if (dataItem.status === "Good") return;
        if (dataItem.matchName.length == 0) {
            if (!!dataItem && dataItem.cnt <= 0) {
                this.openProdSelector(dataItem.name);
                return;
            }
            this.dataFilter = [];
            // clear filters
            _.each(this.curRowIssues, (value, key)=> {
                value.selected = false;
                if (dataItem.name == value.name && value.cnt > 0) {
                    value.selected = true;
                    if (this.dataFilter.filter(x => x.field == 'USR_INPUT').length == 0)
                        this.dataFilter.push({
                            field: 'USR_INPUT',
                            operator: "eq",
                            value: dataItem.name
                        })
                    else
                        _.each(this.dataFilter, (x) => {
                            if (x.field == 'USR_INPUT')
                                x.value = dataItem.name;
                        });
                }
            });

            // perform filter
            this.applyFilterAndGrouping();

        } else {
            // remove matched settings
            dataItem.matchName = [];

            this.allDone = false;

            this.ProductCorrectorData.ValidProducts[this.curRowId][dataItem.name] = [];
            delete this.ProductCorrectorData.ValidProducts[this.curRowId][dataItem.name]

            if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId])
                this.ProductCorrectorData.DuplicateProducts[this.curRowId][dataItem.name] = this.data.ProductCorrectorData.DuplicateProducts[this.curRowId][dataItem.name];

            this.selectRow(this.curRowIndx);
        }
    }

    getFormatedDate(datVal) {
        var date = moment(new Date(datVal)).format('M/d/yyyy');
        if (date === '1/1/1900') {
            return '';
        }
        return date;
    }

    openProdSelector(dataItem) {
        let currentPricingTableRow = new List<any>();
        if (this.data.selRows.length > 1) {
            currentPricingTableRow = new List<any>(this.data.selRows)
                .Where((x)=> {
                    return (x.DC_ID == this.rowDCId);
                }).ToArray()[0];
        }
        else {
            currentPricingTableRow = this.data.selRows[0];
        }

        const pricingTableRow = {
            'START_DT': currentPricingTableRow['row']['START_DT'],
            'END_DT': currentPricingTableRow['row']['END_DT'],
            'CUST_MBR_SID': this.data.contractData.CUST_MBR_SID,
            'GEO_COMBINED': currentPricingTableRow['row']['GEO_COMBINED'],
            'PTR_SYS_PRD': "",
            'PTR_SYS_INVLD_PRD': "",
            'PROGRAM_PAYMENT': currentPricingTableRow['row']['PROGRAM_PAYMENT'],
            'PROD_INCLDS': currentPricingTableRow['row']['PROD_INCLDS']
        };

        if (!dataItem) {
            this.invalidProdName = "";
        }
        else {
            this.invalidProdName = dataItem;
        }

        // If the product name has mbr_sid as 0, it is invalid product
        const isProductExists = this.curRowData.filter((x) => {
            return x.USR_INPUT === dataItem && x.PRD_MBR_SID == 0
        }).length === 0;

        // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
        let indx = -1;
        this.curRowProds.some((e, i) => {
            if (e.name == dataItem) {
                indx = i;
                return true;
            }
        });
        const isExcludeProduct = this.curRowProds[indx].exclude == "I" ? false : true;

        const suggestedProduct = {
            'mode': 'auto',
            'prodname': dataItem,
            'productExists': isProductExists,
            'isExcludeProduct': isExcludeProduct
        };
        const data = { name: 'Product Selector', source: '', selVal: dataItem, contractData: this.data.contractData, curPricingTable: this.data.curPricingTable, curRow: [pricingTableRow] };
        const dialogRefe = this.dialogService.open(ProductSelectorComponent, {
            height: "85vh",
            maxWidth: "90vw",
            width: "6000px",
            data: data,
            panelClass: 'product-selector-dialog'
        })

        dialogRefe.afterOpened().subscribe(a => { this.isLoading = false; })
        dialogRefe.afterClosed().subscribe(result => {
            if (!!result)
            {
              const validateSelectedProducts = result.validateSelectedProducts;
                for (let key in validateSelectedProducts) {
                    if (!this.ProductCorrectorData.ValidProducts[this.curRowId])
                        this.ProductCorrectorData.ValidProducts[this.curRowId] = {};
                    if (!this.ProductCorrectorData.ValidProducts[this.curRowId][this.invalidProdName])
                        this.ProductCorrectorData.ValidProducts[this.curRowId][this.invalidProdName] = [];
                    _.each(validateSelectedProducts[key], (product) => {
                        const isValid = this.validCrossVerticals(product);
                        if (isValid) {
                            let isExclude = this.ProductCorrectorData.ProdctTransformResults[this.curRowId].E && this.ProductCorrectorData.ProdctTransformResults[this.curRowId].E.length > 0
                                && this.ProductCorrectorData.ProdctTransformResults[this.curRowId].E.includes(this.invalidProdName) ? true : false;
                            product.EXCLUDE = isExclude;
                            this.ProductCorrectorData.ValidProducts[this.curRowId][this.invalidProdName].push(product);
                        }
                    });
                }
                this.removeAndFilter(this.invalidProdName);
                this.invalidProdName = '';
            }
        })
    }
    removeProd(prdNm, exclude?) {
        if (exclude == 'E')
            this.removeExclude = true;
        else
            this.removeExclude = false;
        this.prdNm = prdNm.toString();
        this.prodRemoveConfirm = true;        
    }
    closePrdRemoveDialogs(){
        this.prodRemoveConfirm = false;
    }
    OKremoveProd() {
        if (!!this.ProductCorrectorData.DuplicateProducts[this.curRowId]
            && !!this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.prdNm]) {
            delete this.ProductCorrectorData.DuplicateProducts[this.curRowId][this.prdNm];
        }

        // delete from valid if exists
        if (!!this.ProductCorrectorData.ValidProducts[this.curRowId] && !!this.ProductCorrectorData.ValidProducts[this.curRowId][this.prdNm]) {
            delete this.ProductCorrectorData.ValidProducts[this.curRowId][this.prdNm];
        }

        // delete from invalid if exists
        // For exclude product repeat the loop to fetch exclude product also
        var cnt = 0;
        if (!exclude) {
            cnt = 1;
        }
        for (var m = 0; m <= cnt; m++) {
            var exclude = m == 0 ? "I" : "E";
            let isExclude = exclude == "I" ? false : true;
            this.deletedProductDetails.push({
                DC_ID: this.curRowId,
                deletedUserInput: this.prdNm,
                exclude: isExclude,
                indx: _.findWhere(this.data.selRows,
                    {
                        DC_ID: parseInt(this.curRowId)
                    }).indx
            });
            var delItem = this.ProductCorrectorData.InValidProducts[this.curRowId][exclude];
            if (!!delItem) {
                for (var i = 0; i < delItem.length; i++) {
                    if (delItem[i] === this.prdNm) {
                        delItem.splice(i, 1);
                    }
                }
            }

            //Delete fromProdctTransformResults
            if (!!this.ProductCorrectorData.ProdctTransformResults[this.curRowId][exclude]
                && !!this.ProductCorrectorData.ProdctTransformResults[this.curRowId][exclude][this.prdNm]) {
                delete this.ProductCorrectorData.ProdctTransformResults[this.curRowId][exclude][this.prdNm];
            }
            var transItem = this.ProductCorrectorData.ProdctTransformResults[this.curRowId][exclude];
            for (var t = 0; t < transItem.length; t++) {
                if (transItem[t] === this.prdNm) {
                    transItem.splice(t, 1);
                }
            }

            // Delete from Issue Key
            for (var r = 0; r < this.curRowProds.length; r++) {
                if (!!this.curRowProds[r] && this.curRowProds[r].name === this.prdNm && this.curRowProds[r].exclude === exclude) {
                    this.curRowProds.splice(r, 1);
                }
            }
        }
        if (this.curRowProds && this.curRowProds.length > 0) {
            this.curRowIncProd = this.curRowProds.filter(x => x.exclude == 'I');
            this.curRowExcludeProd = this.curRowProds.filter(x => x.exclude == 'E');
        }
        else {
            this.curRowIncProd = [];
            this.curRowExcludeProd = [];
        }
        //Remove Search Header
        this.isIncludeProd = this.curRowProds.filter(x => x.exclude == "I").length > 0;

        this.isExcludeProd = this.curRowProds.filter(x => x.exclude == "E").length > 0;
        this.selectRow(this.curRowIndx);
        this.closePrdRemoveDialogs();
    }

    nextAvailRow() {
        for (var r = 0; r < this.issueRowKeys.length; r++) {
            this.selectRow(r + 1);
            if (!this.curRowDone) {
                return true;
            }
        }
        return false;
    }

    nextRow() {
        const indx = this.curRowIndx + 1;
        if (indx > this.numIssueRows) return false;
        this.selectRow(indx);
        return true;
    }

    prevRow() {
        const indx = this.curRowIndx - 1;
        if (indx < 1) return false;
        this.selectRow(indx);
        return true;
    }
    cancel() {
        this.curRowData = [];
        this.curRowProds = [];
        this.data.ProductCorrectorData.AutoValidatedProducts = PTE_Common_Util.deepClone(this.data.ProductCorrectorData.ValidProducts);
        this.data.ProductCorrectorData['AbortProgration'] = true;

        this.dialogRef.close(this.data.ProductCorrectorData);
    }
    saveProducts() {
        for (let r = 0; r < this.numIssueRows; r++) {
            const key = this.issueRowKeys[r];
            let invalidCopy = [];
            if (!!this.ProductCorrectorData.InValidProducts[key] && this.ProductCorrectorData.InValidProducts[key].length === 0) {
                delete this.ProductCorrectorData.InValidProducts[key];
            }

            if (!!this.ProductCorrectorData.DuplicateProducts[key]) {
                if (Object.keys(this.ProductCorrectorData.DuplicateProducts[key]).length === 0) {
                    delete this.ProductCorrectorData.DuplicateProducts[key];
                } else {
                    let foundItems = false;
                    for (const k in this.ProductCorrectorData.DuplicateProducts[key]) {
                        //If any Item present in Valid List Delete from Duplicate
                        if (!!this.ProductCorrectorData.ValidProducts[key]) {
                            if (!!this.ProductCorrectorData.ValidProducts[key][k]) {
                                if (this.ProductCorrectorData.ValidProducts[key][k].length > 0) {
                                    delete this.ProductCorrectorData.DuplicateProducts[key][k];
                                }
                            }
                        }
                        const item = this.ProductCorrectorData.DuplicateProducts[key][k];
                        if (Array.isArray(item) && item.length > 0) foundItems = true;
                    }
                    if (!foundItems)
                        delete this.ProductCorrectorData.DuplicateProducts[key];
                }
            }
            if (!!this.ProductCorrectorData.InValidProducts[key]) {
                let exclude = "";
                for (let m = 0; m <= 1; m++) {
                    exclude = (m == 0) ? "I" : "E";
                    if (this.ProductCorrectorData.InValidProducts[key][exclude]) {
                        invalidCopy = PTE_Common_Util.deepClone(this.ProductCorrectorData.InValidProducts[key][exclude]);
                        for (let j = 0; j < this.ProductCorrectorData.InValidProducts[key][exclude].length; j++) {
                            let foundItems = false;
                            let prodName = this.ProductCorrectorData.InValidProducts[key][exclude][j];
                            if (!!this.ProductCorrectorData.ValidProducts[key]) {
                                let item = this.ProductCorrectorData.ValidProducts[key][prodName];
                                if (Array.isArray(item) && item.length > 0) foundItems = true;
                                if (foundItems) {
                                    // delete from invalid if exists
                                    const delItem = invalidCopy;
                                    for (let i = 0; i < delItem.length; i++) {
                                        if (delItem[i] === prodName) {
                                            invalidCopy.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }

                    }
                    this.ProductCorrectorData.InValidProducts[key][exclude] = invalidCopy;
                }
            }
        }

         _.each(this.ProductCorrectorData.ValidProducts, (product, key) => {
            _.each(product, (selprod, keyq) => {
                if (!!this.selectedProducts && this.selectedProducts.length == 0) {
                    this.selectedProducts.push({
                        DCID: parseInt(key),
                        name: keyq.toString()
                        , items: [],
                        indx: _.findWhere(this.data.selRows,
                            {
                                DC_ID: parseInt(key)
                            }).indx
                    });
                } else {
                    if (this.selectedProducts.filter(x => x.DCID == key).length==0) {
                        this.selectedProducts.push({
                            DCID: parseInt(key),
                            name: keyq.toString()
                            , items: [],
                            indx: _.findWhere(this.data.selRows,
                                {
                                    DC_ID: parseInt(key)
                                }).indx
                        });
                    }
                }



                _.each(selprod, celprod => {
                    const prd = { prod: celprod['DERIVED_USR_INPUT'], prodObj: celprod };
                    prd.prodObj['USR_INPUT'] = keyq;
                    prd.prodObj['IS_SEL'] = true;
                    _.each(this.selectedProducts, (selproditem) => {
                        if (selproditem.DCID == key)
                            selproditem.items.push(prd);
                    })
                })
            })
         });

        let savedDetails = {
            selectedProducts: this.selectedProducts,
            deletedProducts: this.deletedProductDetails,
            ProductCorrectorData: this.ProductCorrectorData
        }

        this.dialogRef.close(savedDetails);
    }

    
    
    openCAPBreakOut (dataItem, priceCondition) {
        let currentPricingTableRow = [];
        if (this.data.selRows.length > 1) {
            currentPricingTableRow = this.data.selRows.filter((x)=> (x.DC_ID == this.issueRowKeys[this.curRowIndx - 1]))[0];
        }
        else {
            currentPricingTableRow = this.data.selRows[0];
        }

        let productData = [{
            'CUST_MBR_SID': this.data.contractData.CUST_MBR_SID,
            'PRD_MBR_SID': dataItem.PRD_MBR_SID,
            'GEO_MBR_SID': currentPricingTableRow['row']['GEO_COMBINED'],
            'DEAL_STRT_DT': currentPricingTableRow['row']['START_DT'],
            'DEAL_END_DT': currentPricingTableRow['row']['END_DT'],
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }]

        this.dialogService.open(ProductBreakoutComponent, {
            data: {
                columnTypes: priceCondition,
                productData: productData
            },
            panelClass: 'product-breakout-modal'
        });
    }

    onNoClick() {
        this.dialogRef.close();
    }
    applyFilterAndGrouping() {
        this.state.filter.filters = this.dataFilter;
        this.state.group = [];
        this.state.group.push({ field: "USR_INPUT", dir: "asc" });
        this.selGridData = process(this.selGridResult, this.state);
    }
    clickFilter(event, field) {
        this.dataFilter = [];
            this.dataFilter.push({
                field: field,
                operator: "eq",
                value: event.dataItem.value
            })
        this.state.filter.filters = this.dataFilter;
        this.applyFilterAndGrouping();        
    }
    ngOnInit() {
        this.isLoading = true;
        if (this.data.contractData.IS_TENDER) {
            this.isTender = this.data.contractData.IS_TENDER;
        }
        this.ProductCorrectorData = PTE_Common_Util.deepClone(this.data.ProductCorrectorData);
        this.ProductCorrectorData['AutoValidatedProducts'] = PTE_Common_Util.deepClone(this.data.ProductCorrectorData.ValidProducts);
        this.DEAL_TYPE = this.data.curPricingTable.OBJ_SET_TYPE_CD;
        //Deal type checking: make it false if you don't want to show the label in Product(s) not found area.
        if (this.DEAL_TYPE == "VOL_TIER" || this.DEAL_TYPE == "FLEX" || this.DEAL_TYPE == "PROGRAM" || this.DEAL_TYPE == "REV_TIER" || this.DEAL_TYPE == "DENSITY") {
            this.showIncludeExcludeLabel = true;
        }
        this.initProducts();
        this.selectRow(1);
        this.isLoading = false;

    }
}
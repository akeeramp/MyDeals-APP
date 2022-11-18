/* eslint-disable @typescript-eslint/no-inferrable-types */
import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult, DataStateChangeEvent, PageSizeItem, SelectAllCheckboxState } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import * as _ from "underscore";
import * as moment from 'moment';
import * as lodash from "lodash";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import List from "linqts/dist/src/list";

import { productSelectorService } from "./productselector.service";
import { logger } from "../../../shared/logger/logger";

import { gridCol, ProdSel_Util } from './prodSel_Util';
import { PTE_Common_Util } from "../../PTEUtils/PTE_Common_util";

@Component({
    selector: 'product-selector',
    templateUrl: 'Client/src/app/contract/ptModals/productSelector/productselector.component.html',
    styleUrls: ['Client/src/app/contract/ptModals/productSelector/productSelector.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ProductSelectorComponent {

    constructor(public dialogRef: MatDialogRef<ProductSelectorComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            public dialogService: MatDialog,
            private prodSelService: productSelectorService,
            private loggerService: logger,
            popoverConfig: NgbPopoverConfig) {
        popoverConfig.placement = 'auto';
        popoverConfig.container = 'body';
        popoverConfig.autoClose = 'outside';
        popoverConfig.animation = false;    // Fixes issue with `.fade` css element setting improper opacity making the popover not show up
        popoverConfig.openDelay = 500;   // milliseconds
        popoverConfig.closeDelay = 500; // milliseconds
    }

    private productSelectionLevels: any = {};
    private pricingTableRow: any = {};
    private isLoading: boolean = false;
    private isLoadingSearchProducts: boolean = false;
    private isfilteredGridLoading: boolean = false;
    private isGridLoading: boolean = false;
    private spinnerMessageHeader: string = "PTE Loading";
    private spinnerMessageDescription: string = "PTE loading please wait";
    private enableSplitProducts: boolean = false;
    private animateInclude: boolean = false;
    private animateExclude: boolean = false;
    private isTender: boolean = false;
    private showDefault = true;
    private isGA = false; //window.usrRole == "GA"; Commeneted this stop showing L1/L2 columns till legal approves
    private dealType: string = '';
    private splitProducts;
    private drillDownPrd: string = "Select";
    private verticalsWithGDMFamlyAsDrillLevel5: Array<string> = ["CS", "EIA CS", "EIA CPU", "EIA MISC"];
    private verticalsWithDrillDownLevel4: Array<string> = ["EIA CPU", "EIA MISC"];
    private verticalsWithNoMMSelection: Array<string> = ["CS", "WC"];
    private verticalsWithFamilyLevelSelectionECAP: Array<string> = ["Nand (SSD)", "DCG Client SSD", "DCG DC SSD"];
    private selectedPathParts: Array<any> = [];
    private prdSelLvlAtrbsForCategory: Array<any> = [];
    private productSelectionLevelsAttributes: Array<any> = [];
    private items: Array<any> = [];
    private gridResult: Array<any> = [];
    private productDetails: any;
    private crossVertical = {
        'productCombination1': ["DT", "Mb", "SvrWS", "EIA CPU"],
        'productCombination2': ["CS", "EIA CS"],
        'message': "The product combination is not valid. You can combine (DT, Mb, SvrWS, EIA CPU) or (CS, EIA CS) verticals. For NON IA, you can combine as many products within same verticals for PROGRAM, VOLTIER and REV TIER deals."
    }
    private hideSelection: boolean = false;
    private errorMessage = "";
    private disableSelection: boolean = false;
    private productSearchValues = [];
    private showSearchResults: boolean = false;
    private searchItems = [];
    private searchProcessed = false;
    private excludeProductMessage = "";
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private filteredState: State = {
        skip: 0,
        take: 25,
        group: [{field:'USR_INPUT'}],
        // Initial filter descriptor
        filter: {
            logic: "and",
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
    private gridData: GridDataResult;
    private type: string = "numeric";
    private selectedItems: Array<any> = [];
    private addedProducts: Array<any> = [];
    private excludedProducts: Array<any> = [];
    private enableMultipleSelection: boolean = false;
    private excludeMode: boolean = false;
    private suggestedProduct: any = { 'mode': 'manual', 'prodname': "" };
    private showTree: boolean = false;
    private gridColumnsSuggestion: Array<gridCol> = ProdSel_Util.gridColsSuggestion(this.isGA);
    private gridColumnsProduct: Array<gridCol> = ProdSel_Util.gridColProduct(this.isGA);
    private selectAllState: SelectAllCheckboxState = 'unchecked';
    private prdSelection: Array<any> = [];
    private prdSelectionDisp: string = '';
    private prdSelectionkey: string = 'DEAL_PRD_NM';
    private userInput: string = "";
    private showSuggestions = false;
    private suggestionText = "";
    private suggestedProducts: Array<any> = [];
    private filteredGridData: GridDataResult;
    private productOptions;
    private curRowIssues = [];
    private curRowCategories = [];
    private curRowLvl = [];


    distinctPrimitive(fieldName: string, operation?): any {
        if (operation == 'filter') {
            return distinct(this.suggestedProducts, fieldName).map(item => item[fieldName]);
        }
        else {
            return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
    getProductSelection() {
        this.spinnerMessageHeader = 'Product selector loading';
        this.spinnerMessageDescription = 'Product selector loading please wait';
        this.isLoading = true;
        const dtoDateRange = {
            startDate: this.pricingTableRow.START_DT, endDate: this.pricingTableRow.END_DT,
            mediaCode: this.pricingTableRow.PROD_INCLDS, dealType: this.pricingTableRow.OBJ_SET_TYPE_CD
        };
        this.prodSelService.GetProductSelectorWrapper(dtoDateRange).subscribe((result: any) => {
            if (this.pricingTableRow.OBJ_SET_TYPE_CD == "DENSITY") {
                let res = [];
                for (let i = 0; i < result.ProductSelectionLevels.length; i++) {
                    if (result.ProductSelectionLevels[i].DEAL_PRD_TYPE.indexOf('NAND') > -1 || result.ProductSelectionLevels[i].DEAL_PRD_TYPE.indexOf('SSD') > -1) {
                        res.push(result.ProductSelectionLevels[i]);
                    }
                }
                result.ProductSelectionLevels = res;
            }
            this.productSelectionLevels = result.ProductSelectionLevels;
            this.productSelectionLevelsAttributes = result.ProductSelectionLevelsAttributes;
            this.getItems(null);
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this.loggerService.error('ProductSelectorComponent::getProductSelection::', error);
        });
    }
    loadPTSelctor() {
        //setting up to a dealtype variable since using in multiple places
        this.dealType = this.data.curPricingTable.OBJ_SET_TYPE_CD;
        this.isTender = this.data.contractData.IS_TENDER;
        this.splitProducts = (this.isTender == true && this.dealType === "ECAP") ? true : false;
        this.enableSplitProducts = (this.dealType != "KIT");
        //condition for empty row, directly clicking prodselector
        if ((this.data && this.data.curRow && this.data.curRow[0].DC_ID == null) || (this.data.curRow == '' && this.data.selVal == '' && this.data.source == '')) {
            this.pricingTableRow.START_DT = this.data.contractData.START_DT;
            this.pricingTableRow.END_DT = this.data.contractData.END_DT;
            this.pricingTableRow.CUST_MBR_SID = this.data.contractData.CUST_MBR_SID;
            this.pricingTableRow.IS_HYBRID_PRC_STRAT = this.data.curPricingTable.IS_HYBRID_PRC_STRAT;
            this.pricingTableRow.GEO_COMBINED = ProdSel_Util.getFormatedGeos(this.data.curPricingTable.GEO_COMBINED);
            this.pricingTableRow.PTR_SYS_PRD = "";
            this.pricingTableRow.PTR_SYS_INVLD_PRD = "";
            this.pricingTableRow.PROGRAM_PAYMENT = this.data.curPricingTable.PROGRAM_PAYMENT;
            this.pricingTableRow.PROD_INCLDS = this.data.curPricingTable.PROD_INCLDS;
            this.pricingTableRow.OBJ_SET_TYPE_CD = this.data.curPricingTable.OBJ_SET_TYPE_CD
        }
        //condition for non-empty row
        else {
            this.pricingTableRow.START_DT = this.data.curRow[0].START_DT;
            this.pricingTableRow.END_DT = this.data.curRow[0].END_DT;
            this.pricingTableRow.CUST_MBR_SID = this.data.contractData.CUST_MBR_SID;
            this.pricingTableRow.IS_HYBRID_PRC_STRAT = this.data.curRow[0].IS_HYBRID_PRC_STRAT;
            this.pricingTableRow.GEO_COMBINED = ProdSel_Util.getFormatedGeos(this.data.curRow[0].GEO_COMBINED);
            this.pricingTableRow.PTR_SYS_PRD = this.data.curRow[0].PTR_SYS_PRD;
            this.pricingTableRow.PROGRAM_PAYMENT = this.data.curRow[0].PROGRAM_PAYMENT;
            this.pricingTableRow.PROD_INCLDS = this.data.curRow[0].PROD_INCLDS;
            this.pricingTableRow.OBJ_SET_TYPE_CD = this.data.curPricingTable.OBJ_SET_TYPE_CD;
            let productArray = (this.data.curRow[0].PTR_SYS_PRD).length > 0 ? JSON.parse(this.data.curRow[0].PTR_SYS_PRD) : this.data.curRow[0].PTR_SYS_PRD;
            _.each(productArray, pdt => {
                _.each(pdt, item => {
                    if (!item.EXCLUDE) {
                        this.addedProducts.push(item);
                    }
                    else {
                        this.excludedProducts.push(item);
                    }
                })
            })
        }
        this.enableMultipleSelection = this.dealType == 'VOL_TIER' || this.dealType == 'FLEX' || this.dealType == 'PROGRAM' || this.dealType == 'REV_TIER' || this.dealType == 'DENSITY';
        this.excludeMode = this.suggestedProduct.isExcludeProduct ? this.suggestedProduct.isExcludeProduct && (this.dealType == 'VOL_TIER' || this.dealType == 'FLEX' || this.dealType == 'PROGRAM' || this.dealType == 'REV_TIER' || this.dealType == 'DENSITY') : false;
    }
    getItems(item: any) {
        this.selectedItems = []; // Clear the selected items, when user moves around drill levels
        if (this.selectedPathParts.length === 0) {
            this.showTree = false;
            let markLevel1 = _.uniq(this.productSelectionLevels, 'MRK_LVL1');
            //filter the items to remove empty level
            markLevel1 = _.filter(markLevel1, (i) => {
                return i.MRK_LVL1 != null
                    && i.MRK_LVL1 != ""
                    && i.PRD_MRK_MBR_SID != null;
            })
            this.items = _.map(markLevel1, (i) => {
                return {
                    name: i.MRK_LVL1,
                    allowMultiple: this.enableMultipleSelection && !(ProdSel_Util.getVerticalSelection(i.MRK_LVL1, this.selectedPathParts, this.productSelectionLevels).length > 1),
                    parentSelected: false,
                    path: '',
                    id: ProdSel_Util.getVerticalSelection(i.MRK_LVL1, this.selectedPathParts, this.productSelectionLevels)[0].PRD_MBR_SID,
                    selected: ProdSel_Util.productExists(item, ProdSel_Util.getVerticalSelection(i.MRK_LVL1, this.selectedPathParts, this.productSelectionLevels).length > 1 ? undefined : ProdSel_Util.getVerticalSelection(i.MRK_LVL1, this.selectedPathParts, this.productSelectionLevels)[0].PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection)
                };
            }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
            return;
        }

        if (this.selectedPathParts.length === 1) {
            this.showTree = false;
            let markLevel2 = _.uniq(this.productSelectionLevels, 'MRK_LVL2');
            markLevel2 = _.filter(markLevel2, (i) => {
                return i.MRK_LVL2 != null
                    && i.MRK_LVL2 != ""
                    && i.MRK_LVL1 == item.name
                    && i.PRD_MRK_MBR_SID != null;
            });
            this.items = _.map(markLevel2, (i) => {
                return {
                    name: i.MRK_LVL2,
                    path: '',
                    allowMultiple: this.enableMultipleSelection && !(ProdSel_Util.getVerticalSelection(i.MRK_LVL2, this.selectedPathParts, this.productSelectionLevels).length > 1),
                    id: (ProdSel_Util.getVerticalSelection(i.MRK_LVL2, this.selectedPathParts, this.productSelectionLevels).length > 1) ? i.PRD_MRK_MBR_SID : ProdSel_Util.getVerticalSelection(i.MRK_LVL2, this.selectedPathParts, this.productSelectionLevels)[0].PRD_MBR_SID,
                    parentSelected: item.selected,
                    selected: ProdSel_Util.productExists(item, ProdSel_Util.getVerticalSelection(i.MRK_LVL2, this.selectedPathParts, this.productSelectionLevels).length > 1 ? undefined : ProdSel_Util.getVerticalSelection(i.MRK_LVL2, this.selectedPathParts, this.productSelectionLevels)[0].PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection)
                }
            }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
            //in case of certain selection there will be one child in that case we are hitting the next level to get products
            if (this.items.length == 1) {
                this.selectItem(this.items[0]);
            }
            return;
        }

        if (this.selectedPathParts.length === 2) {
            this.showTree = false;
            let markLevel2 = _.where(this.productSelectionLevels, {
                'MRK_LVL1': this.selectedPathParts[0].name,
                'MRK_LVL2': item.name,
                'PRD_ATRB_SID': 7003
            });
            markLevel2 = _.uniq(markLevel2, 'PRD_CAT_NM');
            this.items = _.map(markLevel2, (i) => {
                return {
                    name: i.PRD_CAT_NM,
                    path: i.HIER_NM_HASH, // From this level we get hierarchy to get deal products
                    allowMultiple: this.enableMultipleSelection,
                    id: i.PRD_MBR_SID,
                    parentSelected: item.selected,
                    selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection)
                }
            }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
            //in case of certain selection there will be one child in that case we are hitting the next level to get products
            if (this.items.length == 1) {
                this.selectItem(this.items[0]);
            }
            return;
        }
        if (this.selectedPathParts.length === 3) {
            this.showTree = false;
            let brandName = this.productSelectionLevels.filter((i) => {
                return i.PRD_CAT_NM == item.name && i.PRD_ATRB_SID == 7004;
            });
            brandName = _.uniq(brandName, 'BRND_NM');
            this.items = _.map(brandName, (i) => {
                return {
                    name: i.BRND_NM,
                    path: i.HIER_NM_HASH,
                    allowMultiple: this.enableMultipleSelection,
                    id: i.PRD_MBR_SID,
                    parentSelected: item.selected,
                    selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection)
                }
            }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);

            // For non CPU products check for GDM columns
            // All this special handling would go if GDM attributes are populated at hierarchical columns
            if (this.items.length == 1 && this.items[0].name == 'NA') {
                this.prdSelLvlAtrbsForCategory = this.productSelectionLevelsAttributes.filter((x) => {
                    return x.PRD_CAT_NM == item.name
                });
                if (ProdSel_Util.arrayContainsString(this.verticalsWithDrillDownLevel4, item.name)) {
                    this.items = _.uniq(this.prdSelLvlAtrbsForCategory, 'GDM_BRND_NM');
                    this.items = _.map(this.items, (i) => {
                        return {
                            name: i.GDM_BRND_NM,
                            path: item.path,
                            drillDownFilter4: i.GDM_BRND_NM == "" ? 'Blank_GDM' : i.GDM_BRND_NM,
                            allowMultiple: false,
                            parentSelected: item.selected,
                            selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection),
                            id: i.PRD_MRK_MBR_SID
                        }
                    }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
                    if (this.items.length == 1) {
                        this.selectItem(this.items[0])
                    }
                } else {
                    this.selectItem(this.items[0]);
                }
            }
            return;
        }
        if (this.selectedPathParts.length === 4) {
            this.showTree = false;
            let familyName = this.productSelectionLevels.filter((i) => {
                return i.HIER_NM_HASH.startsWith(item.path) && i.PRD_ATRB_SID == 7005;
            });

            familyName = _.uniq(familyName, 'FMLY_NM');
            this.items = _.map(familyName, (i) => {
                return {
                    name: i.FMLY_NM,
                    path: i.HIER_NM_HASH,
                    allowMultiple: (ProdSel_Util.arrayContainsString(this.verticalsWithFamilyLevelSelectionECAP, familyName[0].PRD_CAT_NM) && (this.dealType == 'ECAP' || this.dealType == 'KIT')) ? true : this.enableMultipleSelection,
                    id: i.PRD_MBR_SID,
                    parentSelected: item.selected,
                    selected: ProdSel_Util.productExists(item, i.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection)
                }
            }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);

            if (this.items.length == 1 && this.items[0].name == 'NA' && this.items[0].path.startsWith('CPU SvrWS NA')) { return } // Forced breakout for CPU Q-Spec items forced into products load

            if (this.items.length == 1 && this.items[0].name == 'NA') {
                let drillLevel5 = _.uniq(this.prdSelLvlAtrbsForCategory, 'PRD_FMLY_TXT');
                // Check if we have prd_fmly_txt

                if ((drillLevel5.length == 1 && drillLevel5[0].PRD_FMLY_TXT == "") ||
                    ProdSel_Util.arrayContainsString(this.verticalsWithGDMFamlyAsDrillLevel5, drillLevel5[0].PRD_CAT_NM)) {
                    // If null or empty fall back to GDM_FMLY_NM
                    drillLevel5 = _.uniq(this.prdSelLvlAtrbsForCategory, 'GDM_FMLY_NM');
                    if (this.selectedPathParts[3].drillDownFilter4 != undefined && this.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                        drillLevel5 = drillLevel5.filter((x) => {
                            return x.GDM_BRND_NM == this.selectedPathParts[3].drillDownFilter4;
                        })
                    }
                    this.items = _.map(drillLevel5, (i) => {
                        return {
                            name: i.GDM_FMLY_NM, //TODO Chane these values in db
                            path: this.items[0].path,
                            drillDownFilter5: i.GDM_FMLY_NM == "" ? 'Blank' : i.GDM_FMLY_NM,
                            drillDownFilter4: this.selectedPathParts[3].drillDownFilter4,
                            parentSelected: item.parentSelected,
                            selected: item.selected
                        }
                    }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
                } else {
                    if (this.selectedPathParts[3].drillDownFilter4 != undefined && this.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                        drillLevel5 = drillLevel5.filter((x) => {
                            return x.PRD_FMLY_TXT == this.selectedPathParts[3].drillDownFilter4;
                        })
                    }
                    this.items = _.map(drillLevel5, (i) => {
                        return {
                            name: i.PRD_FMLY_TXT,
                            path: this.items[0].path,
                            drillDownFilter5: i.PRD_FMLY_TXT == "" ? 'Blank_PRD' : i.PRD_FMLY_TXT,
                            drillDownFilter4: this.selectedPathParts[3].drillDownFilter4,
                            parentSelected: item.parentSelected,
                            selected: item.selected
                        }
                    }).sort((a, b) => a['name'].toUpperCase() > b['name'].toUpperCase() ? 1 : a['name'].toUpperCase() === b['name'].toUpperCase() ? 0 : -1);
                }
                if (this.items.length == 1) {
                    this.selectItem(this.items[0]);
                }
            }
            return;
        }
        if (this.selectedPathParts.length === 5) {
            this.getProductSelectionResults(item, 7006);
            return;
        }
        if (this.selectedPathParts.length === 6) {
            this.getProductSelectionResults(item, 7007);
            return;
        }
        if (this.selectedPathParts.length === 7) {
            this.getProductSelectionResults(item, 7008);
            return;
        }
    }
    getProductSelectionResults(item: any, selectionLevel: number) {
        this.isGridLoading = true;
        this.showTree = true;
        this.items = [];
        //setting empty grid first
        this.gridResult = [];
        this.gridData = process(this.gridResult, this.state);

        let data = {
            "searchHash": item.path,
            "startDate": moment(this.pricingTableRow.START_DT).format("l"),
            "endDate": moment(this.pricingTableRow.END_DT).format("l"),
            "selectionLevel": selectionLevel,
            "drillDownFilter4": null,
            "drillDownFilter5": null,
            "custSid": this.pricingTableRow.CUST_MBR_SID,
            "geoSid": this.pricingTableRow.GEO_COMBINED.toString(),
            "mediaCd": this.pricingTableRow.PROD_INCLDS,
            "dealType": this.dealType
        }

        // We need to send two special attributes for getting the data for non CPU products
        // drillDownFilter4 = GDM_BRND_NM/EDW Product Family/GDM_FMLY depends upon vertical
        // drillDownFilter5 = GDM_FMLY/NAND Family depends upon vertical
        if (selectionLevel == 7007) {
            data.drillDownFilter4 = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4,
                data.drillDownFilter5 = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5
        }
        this.prodSelService.GetProductSelectionResults(data).subscribe((response) => {
            this.isGridLoading = false;
            if (response.length == 1 && response[0].HIER_VAL_NM == 'NA') {
                //if the processor number is NA, send GDM values to filter out L4 data
                response[0]['selected'] = ProdSel_Util.productExists(item, response[0].PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection);
                response[0]['parentSelected'] = item.parentSelected;
                response[0]['drillDownFilter4'] = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4;
                response[0]['drillDownFilter5'] = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5;
                this.gridSelectItem(response[0]);
            } else {
                this.gridResult = response.map((x) => {
                    x['selected'] = ProdSel_Util.productExists(item, x.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection);
                    x['parentSelected'] = item.selected;
                    return x;
                });
                this.gridResult = ProdSel_Util.sortBySelectionLevelColumn(this.gridResult, selectionLevel);
                this.toggleColumnsWhenEmpty(this.gridResult, 'prodGrid');
                this.gridData = process(this.gridResult, this.state);
            }
        }, (error) => {
            this.loggerService.error('ProductSelectorComponent::GetProductSelectionResults::', error);
        });
    }
    toggleColumnsWhenEmpty(data: any, prodGrid: any) {
        _.each(this.gridColumnsProduct, (item, key) => {
            let columnValue = _.uniq(data, item.field);
            if (columnValue.length == 1 && item.field !== undefined && item.field != "CheckBox" && item.field != 'MM_MEDIA_CD'
                && item.field != 'CAP' && item.field != 'YCS2' && (columnValue[0][item.field] === "" || columnValue[0][item.field] == null
                    || columnValue[0][item.field] == 'NA')) {
                item.hidden = true;
            }
            else if (item.field !== 'HAS_L1') {
                item.hidden = false;
            }
        });
        //setting the prdSelectionkey based on which column is visible
        if (_.findWhere(this.gridColumnsProduct, { field: 'DEAL_PRD_NM', hidden: true })) {
            this.prdSelectionkey = 'PCSR_NBR';
        }

    }
    gridSelectItem(dataItem: any) {
        if (dataItem['noDrillDown'] === true) return;
        let item = ProdSel_Util.newItem();

        item.name = dataItem.HIER_VAL_NM;
        item.path = dataItem.HIER_NM_HASH,
            item.drillDownFilter4 = dataItem.drillDownFilter4,
            item.drillDownFilter5 = dataItem.drillDownFilter5,
            item.selected = dataItem.selected,
            item.parentSelected = dataItem.selected,
            this.selectedPathParts.push(item);

        this.getItems(item);
    }
    allowMMSelection(dataItem) {
        if (dataItem.PRD_ATRB_SID == 7007) {
            return !ProdSel_Util.arrayContainsString(this.verticalsWithNoMMSelection, dataItem.PRD_CAT_NM);
        }
        return false;
    }
    getDisplayTemplate() {
        let displayTemplateType = this.items.length == 0 ? "prodGrid" : (this.items.length < 8 ? "btnGroup" : "btnGrid");
        return displayTemplateType;
    }
    //For NAND (SSD)
    addWithCapForFamily(item) {
        let data = {
            "searchHash": item.path,
            "startDate": moment(this.pricingTableRow.START_DT).format("l"),
            "endDate": moment(this.pricingTableRow.END_DT).format("l"),
            "selectionLevel": 7005,
            "drillDownFilter4": null,
            "drillDownFilter5": null,
            "custSid": this.pricingTableRow.CUST_MBR_SID,
            "geoSid": this.pricingTableRow.GEO_COMBINED.toString(),
            "mediaCd": this.pricingTableRow.PROD_INCLDS,
            "dealType": this.dealType
        }
        this.prodSelService.GetProductSelectionResults(data).subscribe(response => {
            let rst = response.map((x) => {
                x['selected'] = ProdSel_Util.productExists(item, x.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection);
                x['parentSelected'] = item.selected;
                return x;
            });

            item["CAP"] = rst[0].CAP;
            item["CAP_START"] = rst[0].CAP_START;
            item["CAP_END"] = rst[0].CAP_END;
            item["YCS2"] = rst[0].YCS2;
            item["YCS2_START"] = rst[0].YCS2_START;
            item["YCS2_END"] = rst[0].YCS2_END;

            this.manageSelectedProducts('include', item);
        },(err)=>{
            this.loggerService.error("Unable to get product selection results","Error",err);
        });
    }
    isValidProductCombination(existingProdTypes, newProductType) {
        let isValid = true;
        if (this.dealType == 'FLEX') {
            return true;
        }
        let selfCheck = newProductType == undefined;
        for (let i = 0; i < existingProdTypes.length; i++) {
            if (i == existingProdTypes.length - 1 && selfCheck) break;
            newProductType = selfCheck ? existingProdTypes[i + 1] : newProductType;
            if (ProdSel_Util.arrayContainsString(this.crossVertical.productCombination1, existingProdTypes[i])) {
                isValid = ProdSel_Util.arrayContainsString(this.crossVertical.productCombination1, newProductType);
                if (!isValid) break;
            }
            else if (ProdSel_Util.arrayContainsString(this.crossVertical.productCombination2, existingProdTypes[i])) {
                isValid = ProdSel_Util.arrayContainsString(this.crossVertical.productCombination2, newProductType);
                if (!isValid) break;
            } else {
                isValid = existingProdTypes[i] == newProductType;
                if (!isValid) break;
            }
        };
        return isValid
    }

    // These validation rules are taken from MT CAP Validations. Both the places rules should be in sync
    isValidCapDetails(productJson, showErrorMesssage?) {
        if (this.enableMultipleSelection) {
            return !showErrorMesssage ? false : productJson.HIER_NM_HASH;
        }
        let errorMessage = "";
        let cap = (productJson.CAP != null) ? productJson.CAP.toString() : 'NO CAP';
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
    selectProduct(product) {
        let item = angular.copy(product);
        item.selected = event.target['checked'];
        if (item.id !== undefined && item.id != "") {
            let products = this.productSelectionLevels.filter((x) => {
                return x.PRD_MBR_SID == item.id;
            })[0];
            item = $.extend({}, item, products);
            item.selected = event.target['checked'];
        }
        if (this.excludeMode) {
            this.manageSelectedProducts('exclude', item, true);
            return;
        }
        if (item.parentSelected && this.enableMultipleSelection) {
            this.manageSelectedProducts('exclude', item);
        } else {
            if (this.dealType !== "ECAP" && this.dealType !== "KIT") {
                // Get unique product types
                let existingProdTypes = _.uniq(this.addedProducts, 'PRD_CAT_NM');
                existingProdTypes = existingProdTypes.map((elem) => {
                    return elem.PRD_CAT_NM;
                });

                // Check if valid combination
                const isCrossVerticalError = this.isValidProductCombination(existingProdTypes, item.PRD_CAT_NM)
                if (!isCrossVerticalError) {
                    this.loggerService.error(this.crossVertical['message'], '', '');
                    product.selected = false;
                    return false;
                }
            }
            //Bring CAP and YCS2 for Family..
            if (item.DEAL_PRD_TYPE === 'NAND (SSD)' && (this.dealType == "ECAP" || this.dealType == "KIT")) {
                this.addWithCapForFamily(item);
                return;
            }
            else {
                this.manageSelectedProducts('include', item);
            }
        }
    }
    async searchProduct(isSuggestProduct?) {
        if (this.userInput == "") return [];
        this.isLoadingSearchProducts = true;
        this.isfilteredGridLoading = true;
        let columnType;
        if (isSuggestProduct) {
            this.drillDownPrd = this.userInput;
            this.userInput = this.userInput;
        }
        if (this.userInput.indexOf('"') >= 0) {
            columnType = "EPM_NM";
            this.userInput = this.userInput.replace(/["]/g, "");
        }

        let data = [{
            ROW_NUMBER: 1, // By default pass one as user will select only one value from popup
            USR_INPUT: this.userInput.replace(/\s\s+/g, ' '),
            EXCLUDE: "",
            FILTER: this.pricingTableRow.PROD_INCLDS,
            START_DATE: this.pricingTableRow.START_DT,
            END_DATE: this.pricingTableRow.END_DT,
            GEO_COMBINED: this.pricingTableRow.GEO_COMBINED,
            PROGRAM_PAYMENT: this.pricingTableRow.PROGRAM_PAYMENT,
            COLUMN_TYPE: !!columnType ? (columnType == "EPM_NM" ? 1 : 0) : 0,
            // Send 1 if EPM_NM
        }];

        await this.prodSelService.GetProductDetails(data, this.pricingTableRow.CUST_MBR_SID, this.dealType)
            .subscribe(response => {
                this.selectPath(0, true);
                this.disableSelection = (!!response[0] && !!response[0].WITHOUT_FILTER) ? response[0].WITHOUT_FILTER : false; //"Nand (SSD)", "DCG Client SSD", "DCG DC SSD"
                if (this.enableMultipleSelection || (((response[0].PRD_CAT_NM == 'NAND (SSD)'
                    || response[0].PRD_CAT_NM == 'DCG Client SSD' || response[0].PRD_CAT_NM == 'DCG DC SSD')
                    && response.filter(obj => obj.FMLY_NM !== 'NA').length > 0 && response[0].PRD_ATRB_SID == 7005)
                    && (this.dealType == 'ECAP' || this.dealType == 'KIT'))) {
                    this.suggestionText = response.length === 0 ? "No products found." : "Product(s) found for \"" + this.userInput + "\"";
                    this.suggestedProducts = response;
                    this.filteredGridData = process(this.suggestedProducts, this.filteredState);
                    this.showSuggestions = true;
                    this.initSuggestionGrid();
                    this.isLoadingSearchProducts = false;
                    this.isfilteredGridLoading = false;
                    return;
                }
                if (this.disableSelection) {
                    this.suggestionText = "No product found for \"" + this.userInput + "\". Search resulted following products:"
                    this.suggestedProducts = response;
                    this.filteredGridData = process(this.suggestedProducts, this.filteredState);
                    this.showSuggestions = true;
                    this.initSuggestionGrid();
                } else {
                    this.showSuggestions = false;
                    this.processProducts(response);
                }
                this.isLoadingSearchProducts = false;
                this.isfilteredGridLoading = false;
            }, (error) => {
                this.loggerService.error("Unable to get products.", error);
                this.isLoadingSearchProducts = false;
            });
        return this.filteredGridData;
    }
    showSingleProductHierarchy(product) {
        let data = {
            "searchHash": product.HIER_NM_HASH,
            "startDate": moment(this.pricingTableRow.START_DT).format("l"),
            "endDate": moment(this.pricingTableRow.END_DT).format("l"),
            "selectionLevel": product.PRD_ATRB_SID,
            "drillDownFilter4": null,
            "drillDownFilter5": null,
            "custSid": this.pricingTableRow.CUST_MBR_SID,
            "geoSid": this.pricingTableRow.GEO_COMBINED.toString(),
            "mediaCd": this.pricingTableRow.PROD_INCLDS,
            "dealType": this.dealType
        }

        this.prodSelService.GetProductSelectionResults(data).subscribe(response => {
            this.processProducts(response);
        }, error => {
            this.loggerService.error("Unable to get products.", error);
        });
    }

    processProducts(data) {
        this.hideSelection = true;
        this.errorMessage = "";
        this.showSuggestions = false;
        this.disableSelection = false;

        this.productSearchValues = [];
        this.selectedPathParts = []; // Reset the breadcrumb
        this.showSearchResults = false; // Hide the grid
        this.searchItems = []; // store conflict hierarchical levels, for user selection

        this.productSearchValues = data;

        this.errorMessage = this.productSearchValues.length == 0 ? "Unable to find this product. The product does not match the global filter criteria (Media Code in Autofill defaults for instance) or is not active within the deal date range." : "";
        if (this.errorMessage != "") {
            this.showSuggestions = true;
        }
        let productCategories = _.uniq(this.productSearchValues, 'PRD_CAT_NM');

        this.searchItems = productCategories.map((i) => {
            return {
                name: i.PRD_CAT_NM,
                level: "VERTICAL",
                path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " "
            }
        });
        if (this.searchItems.length == 1) {
            this.selectsearchItem(this.searchItems[0]);
        }
        return;
    }
    changeProductOption(userInput) {
        this.isLoadingSearchProducts = true;
        if (userInput === "") {
            this.isLoadingSearchProducts = false;
            return [];
        } else {
            this.userInput = userInput.replace(/["]/g, "");
            const dto = {
                filter: this.userInput,
                mediaCode: this.pricingTableRow.PROD_INCLDS,
                startDate: this.pricingTableRow.START_DT,
                endDate: this.pricingTableRow.END_DT,
                getWithFilters: true
            };
            this.prodSelService.GetSearchString(dto).subscribe(response => {
                this.productOptions = response;
                this.isLoadingSearchProducts = false;
            }, error => {
                this.loggerService.error("Unable to get product suggestions.", '', error);
                this.isLoadingSearchProducts = false;
            });
        }
    }
    selectsearchItem(item) {
        if (item.level == "VERTICAL") {
            let markLevel = _.where(this.productSelectionLevels, {
                PRD_CAT_NM: item.name,
                PRD_ATRB_SID: 7003,
            });
            let markLvl2s = _.uniq(markLevel, 'MRK_LVL2');
            this.searchItems = markLvl2s.map((i) => {
                return {
                    name: i.MRK_LVL2,
                    vertical: item.name,
                    verticalPath: item.path,
                    path: '',
                    level: "MARKLEVEL2"
                }
            });
            if (this.searchItems.length == 1) {
                this.selectsearchItem(this.searchItems[0]);
            }
            return;
        }
        if (item.level == "MARKLEVEL2") {
            let markLevel1s = _.where(this.productSelectionLevels, {
                PRD_CAT_NM: item.vertical,
                PRD_ATRB_SID: 7003,
                MRK_LVL2: item.name
            });

            let markLevel1 = markLevel1s[0].MRK_LVL1;

            this.selectedPathParts = [{ name: markLevel1 },
            { name: item.name },
            { name: item.vertical, path: item.verticalPath }];

            let brandNames = _.where(this.productSearchValues, { 'PRD_CAT_NM': item.vertical });
            if (brandNames.length == 1 && brandNames[0].PRD_ATRB_SID == 7003) {
                this.selectedPathParts[this.selectedPathParts.length - 1]['selected'] = true;
                this.selectPath(this.selectedPathParts.length + 1);
                return;
            }
            brandNames = _.uniq(brandNames, 'BRND_NM');
            this.searchItems = brandNames.map((i) => {
                return {
                    name: i.BRND_NM,
                    level: "Brand",
                    vertical: item.vertical,
                    path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " " + i.BRND_NM + " ",
                    selected: i.PRD_ATRB_SID == 7004
                }
            });
            if (this.searchItems.length == 1) {
                this.selectsearchItem(this.searchItems[0]);
            }
            return;
        }
        if (item.level == "Brand") {
            this.selectedPathParts.push(item);

            let familyNames = _.where(this.productSearchValues, {
                'PRD_CAT_NM': item.vertical,
                'BRND_NM': item.name
            });

            if (familyNames.length == 1 && familyNames[0].PRD_ATRB_SID == 7004) {
                this.selectPath(this.selectedPathParts.length + 1);
                return;
            }

            familyNames = _.uniq(familyNames, 'FMLY_NM');
            this.searchItems = familyNames.map((i) => {
                return {
                    name: i.FMLY_NM,
                    path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " " + i.BRND_NM + " " + i.FMLY_NM + " ",
                    brand: i.BRND_NM,
                    vertical: i.PRD_CAT_NM,
                    level: 'Family',
                    selected: i.PRD_ATRB_SID == 7005
                }
            });
            if (this.searchItems.length == 1) {
                this.selectsearchItem(this.searchItems[0]);
            }
            return;
        }
        if (item.level == "Family") {
            this.selectedPathParts.push(item);
            // Filter the search results based on the hierarchy
            let products = _.where(this.productSearchValues, {
                'PRD_CAT_NM': item.vertical,
                'FMLY_NM': item.name,
                'BRND_NM': item.brand
            });

            if (products.length == 1 && products[0].PRD_ATRB_SID == 7005) {
                this.selectPath(this.selectedPathParts.length + 1);
                return;
            }

            if (products.length == 1 && products[0].PRD_ATRB_SID > 7006) {
                this.selectedPathParts.push({
                    name: products[0].PCSR_NBR, path: products[0].DEAL_PRD_TYPE + " "
                        + products[0].PRD_CAT_NM + " " + products[0].BRND_NM + " " + products[0].FMLY_NM + " " + products[0].PCSR_NBR + " ",
                });
            }

            if (products.length == 1 && products[0].PRD_ATRB_SID > 7007) {
                this.selectedPathParts.push({
                    name: products[0].DEAL_PRD_NM, path: products[0].DEAL_PRD_TYPE + " "
                        + products[0].PRD_CAT_NM + " " + products[0].BRND_NM + " " + products[0].FMLY_NM + " "
                        + products[0].PCSR_NBR + " " + products[0].DEAL_PRD_NM + " "
                });
            }

            products[0]['selected'] = ProdSel_Util.productExists(this.selectedPathParts[this.selectedPathParts.length - 1], products[0].PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection);

            this.gridResult = products;
            this.gridData = process(this.gridResult, this.state);
            this.searchProcessed = true;
            this.searchItems = [];
            this.showSearchResults = true;
            setTimeout(() => {
                this.toggleColumnsWhenEmpty(this.gridData, 'prodGrid');
            });
        }
    }
    manageSelectedProducts(mode, item, onlyExclude?) {
        item.HIER_VAL_NM = PTE_Common_Util.getFullNameOfProduct(item, item.HIER_VAL_NM);
        item['USR_INPUT'] = item.HIER_VAL_NM;
        item['DERIVED_USR_INPUT'] = item.HIER_VAL_NM;

        if (onlyExclude) {
            if (item.selected) {
                item['EXCLUDE'] = true;
                this.excludedProducts.push(item);
                this.excludedProducts = _.uniq(this.excludedProducts, 'PRD_MBR_SID');
            } else {
                this.excludedProducts = this.excludedProducts.filter((x) => {
                    return x.PRD_MBR_SID != item.PRD_MBR_SID;
                });
            }
            return;
        }

        if (mode == 'include') {
            if (item.selected) {
                item['EXCLUDE'] = false;
                this.addedProducts.push(item);
                this.addedProducts = _.uniq(this.addedProducts, 'PRD_MBR_SID');
            } else {
                this.addedProducts = this.addedProducts.filter((x) => {
                    return x.PRD_MBR_SID != item.PRD_MBR_SID;
                });
            }
        } else {
            if (!item.selected) {
                item['EXCLUDE'] = true;
                this.excludedProducts.push(item);
                this.excludedProducts = _.uniq(this.excludedProducts, 'PRD_MBR_SID');
            } else {
                this.excludedProducts = this.excludedProducts.filter((x) => {
                    return x.PRD_MBR_SID != item.PRD_MBR_SID;
                });
            }
        }
    }
    removeProduct(item, mode) {
        if (mode == 'add') {
            this.addedProducts = this.addedProducts.filter(product => product.HIER_VAL_NM != item.HIER_VAL_NM);
        }
        else if (mode == 'exclude') {
            this.excludedProducts = this.excludedProducts.filter(product => product.HIER_VAL_NM != item.HIER_VAL_NM);
        }
    }
    checkForBlank(val: string) {
        if (val == "") {
            return "Blank";
        }
        return val;
    }
    clearProducts(type?) {
        if (type != 'E') {
            if (this.addedProducts.length == 0) return;
            // Paper toss animation..
            this.animateInclude = true;
            setTimeout(() => {
                this.animateInclude = false
            }, 500);
            this.addedProducts = [];
        } else {
            if (this.excludedProducts.length == 0) return;
            this.animateExclude = true;
            setTimeout(() => {
                this.animateExclude = false;
            }, 500);
            this.excludedProducts = [];
        }
    }
    selectItem(item: any, isDrilldown?: boolean) {
        this.selectedPathParts.push(item);
        this.selectedPathParts = [...this.selectedPathParts];
        //this.getItems(item);
        // // When toggle is level 4 show l4's under the high level products
        if (!this.showDefault && (item.allowMultiple !== undefined && item.allowMultiple) && this.enableMultipleSelection && isDrilldown) {
            let products = this.productSelectionLevels.filter((x) => {
                return x.PRD_MBR_SID == item.id;
            })[0];
            let product = angular.copy(products);
            product['selected'] = item.selected;
            product['parentSelected'] = item.parentSelected;
            this.items = [];
            this.gridResult = [];
            this.showLevel4(product);
        } else {
            this.getItems(item);
        }
    }
    initSuggestionGrid() {
        this.curRowIssues = [];
        this.curRowCategories = [];
        this.curRowLvl = [];
        let suggestions = _.unique(this.suggestedProducts, 'USR_INPUT');
        for (let x = 0; x < suggestions.length; x++) {
            let prods = _.where(this.suggestedProducts, { 'USR_INPUT': suggestions[x].USR_INPUT });
            let cnt = prods.length;
            this.curRowIssues.push({
                "id": x,
                "name": suggestions[x].USR_INPUT,
                "value": suggestions[x].USR_INPUT,
                "selected": false,
                "status": 'Issue',
                "cnt": cnt
            });
        }
        let curRowCategories = _.unique(this.suggestedProducts, 'PRD_CAT_NM');
        for (let x = 0; x < curRowCategories.length; x++) {
            this.curRowCategories.push({
                "id": x,
                "name": curRowCategories[x].PRD_CAT_NM,
                "value": curRowCategories[x].PRD_CAT_NM,
                "selected": false
            });
        }
        let curRowLvl = _.unique(this.suggestedProducts, 'PRD_ATRB_SID');
        for (let x = 0; x < curRowLvl.length; x++) {
            this.curRowLvl.push({
                "id": x,
                "name": this.prdLvlDecoder(curRowLvl[x].PRD_ATRB_SID),
                "value": curRowLvl[x].PRD_ATRB_SID,
                "selected": false
            });
        }
        this.applyFilterAndGrouping();
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
    applyFilterAndGrouping() {
        // Now apply grouping
        let group = [];
        group.push({ field: "USR_INPUT", dir: "asc" });

        // Now apply filtering
        let filters = [];
        this.buildFilterGroup("USR_INPUT", filters, this.curRowIssues);
        this.buildFilterGroup("PRD_CAT_NM", filters, this.curRowCategories);
        this.buildFilterGroup("PRD_ATRB_SID", filters, this.curRowLvl);

        setTimeout(() => {
            this.toggleColumnsWhenEmpty(this.suggestedProducts, 'prodSuggestions');
        });
    }
    buildFilterGroup(field, masterFilters, data) {
        let filters = [];
        const dataList = new List<any>(data);
        let filterItem = dataList.Where(x => { return (x.selected); }).ToArray();
        for (let f = 0; f < filterItem.length; f++) {
            filters.push({ field: field, operator: "eq", value: filterItem[f].value });
        }
        if (filters.length === 0) return;

        masterFilters.push({
            logic: "or",
            filters: filters
        });
    }
    clickFilter() {
        this.applyFilterAndGrouping();
    }
    clearSearch() {
        this.selectPath(0, false);
    }
    // When user clicks on the breadcrumb
    selectPath(index: number, dontClearSearch?) {
        this.hideSelection = false;
        this.showSuggestions = false;
        this.disableSelection = false;
        if (dontClearSearch !== undefined && !dontClearSearch) {
            this.userInput = "";
        }
        if (index === 0) {
            this.updateDrillDownPrd();
        }
        this.selectedPathParts.splice(index, this.selectedPathParts.length);
        this.selectedPathParts = [...this.selectedPathParts];
        let itm = this.selectedPathParts.length > 0 ? this.selectedPathParts[this.selectedPathParts.length - 1]
            : ProdSel_Util.newItem();
        this.getItems(itm);
    }
    updateDrillDownPrd() {
        if (this.drillDownPrd !== "Select") {
            this.drillDownPrd = "Select";
            this.showSuggestions = true;
            this.hideSelection = true;
        }
    }

    // Toggle the show Tree
    toggleShowTree(showSelectMenu) {
        this.selectPath(0);
        if (showSelectMenu) {
            this.showTree = false;
            return;
        }
        this.showTree = !this.showTree;
        this.gridResult = [];
        this.resetexcludeProductMessage();
    }
    resetexcludeProductMessage() {
        this.excludeProductMessage = "< click on selected products to see Deal Products (L4's) >"
    }
    showLevel4(product) {
        // To get all the L4's under a higher product hierarchy for a program or voltier deal treat it as Front END YCS2 deal
        let data = [{
            ROW_NUMBER: 1, // By default pass one as user will select only one value from popup
            USR_INPUT: product.HIER_NM_HASH.replace(/\s\s+/g, ' '),
            EXCLUDE: "",
            FILTER: this.pricingTableRow.PROD_INCLDS,
            START_DATE: this.pricingTableRow.START_DT,
            END_DATE: this.pricingTableRow.END_DT,
            GEO_COMBINED: this.pricingTableRow.GEO_COMBINED,
            PROGRAM_PAYMENT: "Frontend YCS2",
            COLUMN_TYPE: 0,
            // Send 1 if EPM_NM
        }];

        this.prodSelService.GetProductDetails(data, this.pricingTableRow.CUST_MBR_SID, "ECAP").subscribe((response) => {
            this.productDetails = response;
            let data = this.productDetails.filter((item, pos) => {
                return data.findIndex((val) => val['PRD_MBR_SID'] === item.PRD_MBR_SID) == pos
            })
            this.gridData = data.map((x) => {
                x['selected'] = ProdSel_Util.productExists(product, x.PRD_MBR_SID, this.excludeMode, this.excludedProducts, this.addedProducts, this.enableMultipleSelection);
                x['parentSelected'] = product.selected;
                x['noDrillDown'] = true;
                return x;
            });
            //this.searchProcessed = true;
            setTimeout(() => {
                this.toggleColumnsWhenEmpty(this.gridData, 'prodGrid');
            });
        }, function (response) {
            console.error("Unable to get products.", response);
        });
    }
    save() {
        const numberOfValidItem = (this.isTender == true && this.dealType === "ECAP" && this.splitProducts != true) ? 1 : 10; //Added Tender ECAP Rules
        if (this.dealType !== "ECAP" && this.dealType !== "KIT") {
            // Get unique product types
            let existingProdTypes = _.uniq(this.addedProducts, 'PRD_CAT_NM');
            existingProdTypes = existingProdTypes.map((elem) => {
                return elem.PRD_CAT_NM;
            });

            // Check if valid combination
            if (!this.isValidProductCombination(existingProdTypes, undefined)) {
                this.loggerService.error(this.crossVertical.message, '');
                return;
            }
        }
        if (((this.dealType === "KIT") || (this.isTender == true && this.dealType === "ECAP" && this.splitProducts != true))
            && this.addedProducts.length > numberOfValidItem) {
            this.loggerService.error("You have too many products! You may have up to " + numberOfValidItem
                + ". Please remove " + (this.addedProducts.length - numberOfValidItem) + " products from this row.", '');
            return;
        }

        this.addedProducts = this.addedProducts.map((x) => {
            return {
                BRND_NM: x.BRND_NM,
                CAP: x.CAP,
                CAP_END: x.CAP_END,
                CAP_START: x.CAP_START,
                DEAL_PRD_NM: x.DEAL_PRD_NM,
                DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                DERIVED_USR_INPUT: x.DERIVED_USR_INPUT,
                FMLY_NM: x.FMLY_NM,
                HAS_L1: x.HAS_L1,
                HAS_L2: x.HAS_L2,
                HIER_NM_HASH: x.HIER_NM_HASH,
                HIER_VAL_NM: x.HIER_VAL_NM,
                MM_MEDIA_CD: x.MM_MEDIA_CD,
                MTRL_ID: x.MTRL_ID,
                PCSR_NBR: x.PCSR_NBR,
                PRD_ATRB_SID: x.PRD_ATRB_SID,
                PRD_CAT_NM: x.PRD_CAT_NM,
                PRD_END_DTM: x.PRD_END_DTM,
                PRD_MBR_SID: x.PRD_MBR_SID,
                PRD_STRT_DTM: x.PRD_STRT_DTM,
                USR_INPUT: x.DERIVED_USR_INPUT, // When products are validated from corrector user opens and closes Selector update derived user input
                YCS2: x.YCS2,
                YCS2_END: x.YCS2_END,
                YCS2_START: x.YCS2_START,
                EXCLUDE: false,
                NAND_TRUE_DENSITY: x.NAND_TRUE_DENSITY ? x.NAND_TRUE_DENSITY : ''
            }
        });

        this.excludedProducts = this.excludedProducts.map((x) => {
            return {
                BRND_NM: x.BRND_NM,
                CAP: x.CAP,
                CAP_END: x.CAP_END,
                CAP_START: x.CAP_START,
                DEAL_PRD_NM: x.DEAL_PRD_NM,
                DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                DERIVED_USR_INPUT: x.DERIVED_USR_INPUT,
                FMLY_NM: x.FMLY_NM,
                HAS_L1: x.HAS_L1,
                HAS_L2: x.HAS_L2,
                HIER_NM_HASH: x.HIER_NM_HASH,
                HIER_VAL_NM: x.HIER_VAL_NM,
                MM_MEDIA_CD: x.MM_MEDIA_CD,
                MTRL_ID: x.MTRL_ID,
                PCSR_NBR: x.PCSR_NBR,
                PRD_ATRB_SID: x.PRD_ATRB_SID,
                PRD_CAT_NM: x.PRD_CAT_NM,
                PRD_END_DTM: x.PRD_END_DTM,
                PRD_MBR_SID: x.PRD_MBR_SID,
                PRD_STRT_DTM: x.PRD_STRT_DTM,
                USR_INPUT: x.DERIVED_USR_INPUT, // When products are validated from corrector user opens and closes Selector update derived user input
                YCS2: x.YCS2,
                YCS2_END: x.YCS2_END,
                YCS2_START: x.YCS2_START,
                EXCLUDE: true,
                NAND_TRUE_DENSITY: x.NAND_TRUE_DENSITY ? x.NAND_TRUE_DENSITY : ''
            }
        });

        // For kit deals re arrange the products primary secondary
        let prdDrawingOrd = "";
        let contractProduct = "";
        if (this.dealType === "KIT") {
            this.addedProducts = this.filterProducts(this.addedProducts, 'DEAL_PRD_TYPE') // $filter('kitProducts')(vm.addedProducts, 'DEAL_PRD_TYPE');
            prdDrawingOrd = this.addedProducts.map((p) => {
                return p.PRD_MBR_SID;
            }).join(',');
        }

        let pricingTableSysProducts = {};

        _.each(this.addedProducts, function (item, key) {
            if (!Object.hasOwnProperty.call(pricingTableSysProducts, item.USR_INPUT)) {
                pricingTableSysProducts[item.USR_INPUT] = [item];
            } else if (this.dealType === "KIT") {
                //  KIT cannot really have duplicate product name, if we find such update full path
                item.USR_INPUT = this.getFullPathOfProduct(item);
                item.DERIVED_USR_INPUT = item.USR_INPUT;
                pricingTableSysProducts[item.USR_INPUT] = [item];
            } else {
                pricingTableSysProducts[item.USR_INPUT].push(item);
            }
        });

        _.each(this.excludedProducts, function (item, key) {
            if (!Object.hasOwnProperty.call(pricingTableSysProducts, item.USR_INPUT)) {
                pricingTableSysProducts[item.USR_INPUT] = [item];
            } else {
                pricingTableSysProducts[item.USR_INPUT].push(item);
            }
        });

        if (this.dealType === "KIT") {
            contractProduct = this.addedProducts.map((x) => {
                return x.DERIVED_USR_INPUT;
            }).join(',');
        }

        //Only for kit prdDrawingOrd will be populated
        let productSelectorOutput = {
            'splitProducts': this.splitProducts, 'validateSelectedProducts': pricingTableSysProducts,
            'prdDrawingOrd': prdDrawingOrd, 'contractProduct': contractProduct
        };
        this.dialogRef.close(productSelectorOutput);
    }

    private getFullPathOfProduct(item) {
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

    filterProducts(item, field) {
        // If CPU or CS present it will take least precedence. If CPU has less CAP and CS has highest CAP, CS will be primary.
        let items = item.sort((a, b) => {
            return (this.customOrder(a[field]) > this.customOrder(b[field]) ? 1 : -1);
        });

        let filtered = items;
        // L1 products will be primary irrespective of CAP and CPU/CS. Within L1 products with highest CAP will be primary. This applies to L2 as well.
        filtered = lodash.orderBy(filtered, ['-HAS_L1', '-HAS_L2', parseFloat(items)]);
        return filtered;
    }
    parseFloat(product) {
        return isNaN(product.CAP) ? -0 : -parseInt(product.CAP);
    };
    customOrder(item) {
        switch (item) {
            case 'CPU':
                return 1; // CPU is priority without additional properties
            case 'CS':
                return 2; // CS is priority if CPU is not around.
            default:
                return 3; // Additional properties determines who is the boss, product with L1 status goes first, if multiple L1's then one with fat pocket(CAP) gets in first. These rules apply at every level.
        }
    }

    dataStateChange(state: DataStateChangeEvent,operation?): void {
        if (operation == 'filter') {
            this.filteredState = state;
            this.filteredGridData = process(this.suggestedProducts, this.filteredState);
        }
        else {
            this.state = state;
            this.gridData = process(this.gridResult, this.state);
        }
    }

    toggleSelectAll($event, searchGrid) {
        if (!this.disableSelection && searchGrid && searchGrid.length>0) {
            searchGrid.forEach(dataItem => {
                dataItem.selected = $event.target.checked;
                this.selectProduct(dataItem);
            })
        }
    }
    ngOnInit() {
        this.loadPTSelctor();
        this.getProductSelection();
    }
}

angular.module("app").directive(
    "productSelector",
    downgradeComponent({
        component: ProductSelectorComponent,
    })
);
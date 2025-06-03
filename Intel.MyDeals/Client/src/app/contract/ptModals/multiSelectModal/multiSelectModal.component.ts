import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { each, indexOf, map, clone } from 'underscore';
import { Observable, of, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { logger } from "../../../shared/logger/logger";
import { CheckedState, CheckableSettings } from "@progress/kendo-angular-treeview";
import { PricingTableEditorService } from "../../pricingTableEditor/pricingTableEditor.service";


@Component({
    selector: "multi-select-modal",
    templateUrl: "Client/src/app/contract/ptModals/multiSelectModal/multiSelectModal.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/multiSelectModal/multiSelectModal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class multiSelectModalComponent implements OnDestroy {

    constructor(private loggerSvc: logger,
        public dialogRef: MatDialogRef<multiSelectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public modalData, private pteService: PricingTableEditorService
    ) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG  
    }
    private disTitle: string = 'Select Market Segment *';
    private checkedKeys: any[] = [];
    private key = "DROP_DOWN";
    private mrktSeg = "MRKT_SEG";
    private filterableFields = ["CONSUMPTION_CUST_PLATFORM", "CONSUMPTION_CUST_SEGMENT", "CONSUMPTION_CUST_RPT_GEO", "CONSUMPTION_COUNTRY_REGION", "CONSUMPTION_SYS_CONFIG", "DFLT_CUST_RPT_GEO", "DEAL_SOLD_TO_ID"];
    private selectedChildCount: number;
    private multiSelectPopUpModal: any;
    private nonCorpMarketSeg: any;
    private colName: any;
    private placeholderText: any;
    private isTgrRgn: boolean;
    private ismrktSeg: boolean;
    private isEmptyList = false;
    private isEmptySoldToId = false;
    private isFilterEnabled; boolean;
    private isLoading = false;
    private spinnerMessageHeader: any;
    private spinnerMessageDescription: any;
    private multiSelectData: any;
    private parentKeys: any = [];
    private checkChildren: boolean;
    private checkParents: boolean;
    private mode: any;
    private multiCheckedKeys: any[] = [];
    private mkgvalues: Array<string> = [];
    private multSlctMkgValues: Array<string> = [];
    private multiSelectMkgArr: Array<string> = [];
    private multiSelectMkgArrChange: Array<string> = [];
    private marketSeglist: any = [];
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    fetchChildren(node: any): Observable<any[]> {
        // returns the items collection of the parent node as children
        return of(node.items);
    }
    get checkableSettings(): CheckableSettings {
        return {
            checkChildren: this.checkChildren,
            checkParents: this.checkParents,
            mode: this.mode,
        };
    }
    private isChecked = (dataItem: any, index: string): CheckedState => {
        if (this.containsItem(dataItem)) { return 'checked'; }
        if (!this.isTgrRgn && dataItem.items != undefined && dataItem.items != null && dataItem.items.length > 0 && this.isIndeterminate(dataItem.items)) {
            if (this.selectedChildCount === dataItem.items.length)
                return 'checked';
            else
                return 'indeterminate';
        }
        return 'none';
    };

    private containsItem(item: any): boolean {
        if (this.checkedKeys != undefined && this.checkedKeys != null && this.checkedKeys.length > 0) {
            return this.checkedKeys.indexOf(item[this.modalData.items.opLookupText]) > -1;
        }
        else
            return false;
    }

    private isIndeterminate(items: any[] = []): boolean {
        if (items != undefined && items != null) {
            this.selectedChildCount = 0;
            for (let item in items) {
                if (this.containsItem(items[item])) {
                    this.selectedChildCount++;
                }
            }
        }
        if (this.selectedChildCount > 0)
            return true;
        return false;
    }
    getModalData() {
        this.pteService.readDropdownEndpoint(this.multiSelectPopUpModal.opLookupUrl).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response != null && response != undefined && response.length > 0) {
                this.multiSelectData = response;
                each(this.multiSelectData, row => {
                    row.DROP_DOWN = row.DROP_DOWN.trim();
                })
                if (this.colName == "DEAL_SOLD_TO_ID") {
                    this.checkedKeys = [];
                    each(this.modalData.cellCurrValues, (item) => {
                        const selecteddata = this.multiSelectData.filter(x => x[this.multiSelectPopUpModal.opLookupValue] == item);
                        if (selecteddata != undefined && selecteddata != null && selecteddata.length > 0) {
                            this.checkedKeys.push(selecteddata[0][this.multiSelectPopUpModal.opLookupText]);
                        }
                    });
                }
            }
            else {
                if (this.colName == "DEAL_SOLD_TO_ID")
                    this.isEmptySoldToId = true;
                else
                    this.isEmptyList = true;
            }
            this.isLoading = false;
        }, error => {
            this.loggerSvc.error('dealEditorComponent::readMultiSelectModal::getDropDownResult:: service', error);
            this.isLoading = false;
        });
    }

    onSelectionChange() {
        if (this.checkedKeys != undefined && this.checkedKeys.length > 0) {
            if (this.ismrktSeg) {
                const selectedList = this.checkedKeys.join(",");
                //In Market Segment Modal, selected 'All Direct Market Segments' then checkedKey is only 'All Direct Market Segments'
                if ((indexOf(this.checkedKeys, 'All Direct Market Segments') > 0) || (indexOf(this.checkedKeys, 'All Direct Market Segments') == 0 && this.checkedKeys.length == 1)) {
                    this.checkedKeys = ['All Direct Market Segments'];
                }
                else {
                    //Selected other than 'All Direct Market Segments', then 'All Direct Market Segments' must be removed from checkedkeys
                    if (indexOf(this.checkedKeys, 'All Direct Market Segments') == 0) {
                        this.checkedKeys.splice(0, 1);
                    }
                    //Selected parent Node which has child (like 'Embedded'), checkedKey will be the first childNode of the parent
                    each(this.checkedKeys, (key) => {
                        const selectedData = this.multiSelectData.filter(x => x.DROP_DOWN == key);
                        if (selectedData != undefined && selectedData != null && selectedData.length > 0 && selectedData[0].items != undefined && selectedData[0].items != null && selectedData[0].items.length > 0) {
                            this.checkedKeys = [selectedData[0].items[0].DROP_DOWN];
                        }
                    });
                    //Selected any child Node under parent ('Embedded'), checkedKey will be the last selected childNode of the parent
                    each(this.parentKeys, (key) => {
                        if (selectedList.includes(key)) {
                            this.checkedKeys = [this.checkedKeys[this.checkedKeys.length - 1]];
                        }
                    });
                    if (indexOf(this.checkedKeys, "NON Corp") >= 0) {
                        let nonCorpIdx = indexOf(this.checkedKeys, "NON Corp");
                        this.checkedKeys.splice(nonCorpIdx, 1);
                        let corpMarkSeg = map(this.nonCorpMarketSeg, (x) => { return x.DROP_DOWN })
                        each(corpMarkSeg, (val) => {
                            if ((indexOf(this.checkedKeys, val) < 0)) {
                                this.checkedKeys.push(val);
                            }
                        })
                    }
                }
                this.checkedKeys.sort();
            }
        }
    }
    getNonCorpData() {
        let opLookUpURL = "/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP";
        this.pteService.readDropdownEndpoint(opLookUpURL).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response != null && response != undefined && response.length > 0) {
                this.nonCorpMarketSeg = response;
            }
        })
    }

    private isMkgChecked = (dataItem: any, index: string): CheckedState => {
        if (this.MkgcontainsItem(dataItem)) { return 'checked'; }
        else if (this.MkgisIndeterminate(dataItem.items)) { return 'indeterminate'; }
        else { return 'none'; }

    };

    private MkgcontainsItem(item: any): boolean {
        if (this.mkgvalues != undefined && this.mkgvalues != null && this.mkgvalues.length > 0) {
            return this.mkgvalues.indexOf(item['DROP_DOWN']) > -1;
        }
        else
            return false;
    }

    private MkgisIndeterminate(items: any[] = []): boolean {
        if (items != undefined && items != null) {
            let idx = 0;
            let item;
            while (item = items[idx]) {
                if (this.MkgisIndeterminate(item.items) || this.MkgcontainsItem(item)) {
                    return true;
                }
                idx += 1;
            }
        }
        return false;
    }

    onMarkSegChange(event: any) {
        this.mkgvalues = this.multSlctMkgValues;
    }

    onMktgValueChange(event: any) {
        var index;
        each(this.marketSeglist, (key) => {
            if (key.items != null) {
                index = indexOf(this.marketSeglist, key);
            }
        })
        if (indexOf(event, this.marketSeglist[index].DROP_DOWN) > 0 && event.length - 1 == this.marketSeglist[index].items.length) {
            this.mkgvalues = null;
            this.multSlctMkgValues = this.mkgvalues;
        }
        else if (event && event.length > 0) {
            var selectedList = event.join(",");
            if (indexOf(event, 'All Direct Market Segments') > 0 || (event.length == 1 && indexOf(event, 'All Direct Market Segments') == 0)) {
                this.mkgvalues = ['All Direct Market Segments'];
                this.multSlctMkgValues = this.mkgvalues;
            }
            else {
                if (indexOf(event, 'All Direct Market Segments') == 0) {
                    this.mkgvalues.splice(0, 1);
                }
                each(this.mkgvalues, (key) => {
                    var selectedData = this.marketSeglist.filter(x => x.DROP_DOWN == key);
                    if (selectedData != undefined && selectedData != null && selectedData.length > 0 && selectedData[0].items != undefined && selectedData[0].items != null && selectedData[0].items.length > 0) {
                        this.mkgvalues = [selectedData[0].items[0].DROP_DOWN];
                    }
                });
                each(this.parentKeys, (key) => {
                    if (selectedList.includes(key)) {
                        this.mkgvalues = [this.mkgvalues[this.mkgvalues.length - 1]];
                    }
                });
                if (indexOf(this.mkgvalues, "NON Corp") >= 0) {
                    let corpMarkSeg = map(this.nonCorpMarketSeg, (x) => { return x.DROP_DOWN })
                    const uncheckSMB = this.mkgvalues.filter(x => x != "SMB")
                    if (uncheckSMB.length > 0) {
                        const uncheckNonCorp = uncheckSMB.filter(x => x != "NON Corp")
                        if (uncheckNonCorp.length > 0) {
                            const UncheckSMB = corpMarkSeg.filter(x => x != "SMB");
                            corpMarkSeg = UncheckSMB;
                        }
                    }
                    each(corpMarkSeg, (val) => {
                        if ((indexOf(this.mkgvalues, val) < 0)) {
                            this.mkgvalues.push(val);
                        }
                    })
                }
                this.multSlctMkgValues = clone(this.mkgvalues);
                let cellMarketVal = this.multSlctMkgValues;
                let tmps = this.modalData.items.data;
                this.multiSelectMkgArrChange = [];
                for (var i = 0; i < cellMarketVal.length; i++) {
                    let cellMarket = cellMarketVal[i];
                    for (var tmp of tmps) {
                        let tmpDropDown = tmp.DROP_DOWN;
                        if (tmpDropDown == cellMarket) {
                            let tmpCellMarket = cellMarket;
                            this.multiSelectMkgArrChange.push(tmpCellMarket);
                            this.multSlctMkgValues = this.multiSelectMkgArrChange;
                        }
                        if (tmp.items != null) {
                            let valueAssign = tmp.items;
                            for (var values of valueAssign) {
                                let tmpDropDownVal = values.DROP_DOWN;
                                if (tmpDropDownVal == cellMarket) {
                                    let tmpCellMarket = cellMarket;
                                    this.multiSelectMkgArrChange.push(tmpCellMarket);
                                    this.multSlctMkgValues = this.multiSelectMkgArrChange;
                                }
                            }
                        }
                    }
                }
                let nonCorpIdx = indexOf(this.multSlctMkgValues, "NON Corp");
                if (nonCorpIdx != -1) {
                    this.multSlctMkgValues.splice(nonCorpIdx, 1);
                }
            }
            this.multSlctMkgValues.sort();
        }
        else {
            this.multSlctMkgValues = this.mkgvalues;
        }
    }

    hasChildren(node: any): boolean {
        return node.items && node.items.length > 0;
    }
    selectAllCustomerReportedGeos() {
        this.checkedKeys = [];
        each(this.multiSelectData, (parent) => {
            this.checkedKeys.push(parent[this.multiSelectPopUpModal.opLookupText]);
            if (parent.items != undefined && parent.items != null && parent.items.length > 0) {
                each(parent.items, (child) => {
                    this.checkedKeys.push(child[this.multiSelectPopUpModal.opLookupText]);
                });
            }
        });
    }
    deSelectAllCustomerReportedGeos() {
        this.checkedKeys = [];
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onSave(): void {
        if (this.colName == "CONSUMPTION_COUNTRY_REGION") {
            let index = 0;
            each(this.checkedKeys, (key) => {
                const dataExists = this.multiSelectData.filter(x => x.DROP_DOWN == key).length > 0;
                if (dataExists) {
                    this.checkedKeys.splice(index, 1);
                }
                index++;
            });
            this.dialogRef.close(this.checkedKeys.join("|"));
        }
        else if (this.colName == "DEAL_SOLD_TO_ID") {
            let selectedValue = [];
            each(this.checkedKeys, (key) => {
                const selecteddata = this.multiSelectData.filter(x => x[this.multiSelectPopUpModal.opLookupText] == key);
                if (selecteddata != undefined && selecteddata != null && selecteddata.length > 0) {
                    selectedValue.push(selecteddata[0][this.multiSelectPopUpModal.opLookupValue]);
                }
            });
            this.dialogRef.close(selectedValue.toString());
        }
        else if (this.colName == "MRKT_SEG") {
            this.dialogRef.close(this.multSlctMkgValues.toString());
        }
        else
            this.dialogRef.close(this.checkedKeys.toString());
    }

    ngOnInit() {
        if (this.modalData && this.modalData.items && this.modalData.items.label) {
            this.disTitle = `Select ${this.modalData.items.label}`;
        }
        this.multiSelectPopUpModal = this.modalData.items;
        this.colName = this.modalData.colName;
        this.placeholderText = "Click to Select...";
        this.checkChildren = true;
        this.checkParents = true;
        this.mode = 'multiple';
        this.ismrktSeg = (this.colName == this.mrktSeg);
        this.isTgrRgn = (this.colName == "TRGT_RGN");
        if (this.isTgrRgn) {
            let elt = Array.from(document.getElementsByTagName("mat-dialog-container") as HTMLCollectionOf<HTMLElement>);
            if (elt != undefined && elt != null) {
                each(elt, (item) => {
                    item.style.backgroundColor = "#1a3e6f";
                });
            }
            this.checkParents = false;
            this.checkChildren = false;
            this.mode = 'single';
        }
        this.isFilterEnabled = this.filterableFields.indexOf(this.colName) > -1;
        this.isLoading = true;
        this.spinnerMessageHeader = "Loading...";
        this.spinnerMessageDescription = "Loading the " + this.multiSelectPopUpModal.label + " information.";
        if (this.ismrktSeg) {
            this.getNonCorpData();
            this.marketSeglist = this.multiSelectPopUpModal.data != undefined ? this.multiSelectPopUpModal.data : [];
            this.multiSelectPopUpModal.opLookupText = "DROP_DOWN";
            if (this.modalData.cellCurrValues != null && this.modalData.cellCurrValues != undefined && this.modalData.cellCurrValues != "") {
                if (typeof this.modalData.cellCurrValues == "string") {
                    this.mkgvalues = this.modalData.cellCurrValues.split(",").map(function (item) {
                        return item.trim();
                    });
                } else {
                    this.mkgvalues = this.modalData.cellCurrValues.map(function (item) {
                        return item.trim();
                    });
                }
            }
            
            let cellMarketVal = this.mkgvalues;
            let tmps = this.modalData.items.data;

            for (var i = 0; i < cellMarketVal.length; i++) {
                let cellMarket = cellMarketVal[i];
                for (var tmp of tmps) {
                    let tmpDropDown = tmp.DROP_DOWN;
                    if (tmpDropDown == cellMarket) {
                        this.multiSelectMkgArr.push(cellMarket);
                        this.multSlctMkgValues = this.multiSelectMkgArr;
                    }
                    if (tmp.items != null) {
                        let valueAssign = tmp.items;
                        for (var values of valueAssign) {
                            let tmpDropDownVal = values.DROP_DOWN;
                            if (tmpDropDownVal == cellMarket) {
                                this.multiSelectMkgArr.push(cellMarket);
                                this.multSlctMkgValues = this.multiSelectMkgArr;
                            }
                        }
                    }
                }
            }
            

            //this.multSlctMkgValues = this.mkgvalues;

            each(this.marketSeglist, (key) => {
                if (key.items != undefined && key.items != null && key.items.length > 0) {
                    this.parentKeys.push(key.DROP_DOWN);
                }
            });
            this.isLoading = false;
        }
        else {
            this.checkedKeys = (this.modalData.cellCurrValues !== null && this.modalData.cellCurrValues.length > 0) ? this.modalData.cellCurrValues : [];
            this.getModalData();
        }
        this.key = this.multiSelectPopUpModal.opLookupText;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}


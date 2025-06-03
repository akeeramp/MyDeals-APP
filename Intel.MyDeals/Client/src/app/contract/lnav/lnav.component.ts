/* eslint-disable @typescript-eslint/no-inferrable-types */
import { each } from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, ViewChild, OnInit, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { lnavService } from "../lnav/lnav.service";
import { logger } from "../../shared/logger/logger";
import { lnavUtil } from '../lnav.util';
import { HeaderService } from "../../shared/header/header.service";
import { AutoFillComponent } from "../ptModals/autofillsettings/autofillsettings.component";
import { RenameTitleComponent } from "../ptModals/renameTitle/renameTitle.component";
import { ContractDetailsService } from "../contractDetails/contractDetails.service";

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
    selector: 'lnavView',
    templateUrl: 'Client/src/app/contract/lnav/lnav.component.html',
    styleUrls: ['Client/src/app/contract/lnav/lnav.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LnavComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    constructor(private loggerService: logger,
                private lnavService: lnavService,
                private headerService: HeaderService,
                private contractDetailsService: ContractDetailsService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private changeDetectorRef: ChangeDetectorRef) {}

    @Input() contractId: number;
    @Input() contractData;
    @Input() UItemplate;
    @Input() changedTab: number = 0;
    @Input() selectNavMenu: any;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

    private readonly ORIG_USR_ROLE = (<any>window).usrRole;
    private usrRole = (<any>window).usrRole;

    public query = "";
    public newStrategy: any = {};
    public PtDealTypes;
    public ptTITLE = "";
    public newPricingTable: any = {};;
    public isTenderContract = false;
    public currentPricingTable: any = {};
    public isAddStrategyHidden = true;
    public isAddPricingTableHidden = true;
    public isLnavHidden: any = { isLnavHid: false, source: 'PT' };
    public renameMapping = {};
    public container: any;
    public strategyTreeCollapseAll = true; isCollapsed = false; isSearchHidden = false; isSummaryHidden = true;
    isAddStrategyBtnHidden = true;
    private CAN_VIEW_COST_TEST: boolean = this.lnavService.chkDealRules('CAN_VIEW_COST_TEST', this.ORIG_USR_ROLE, null, null, null) || (this.ORIG_USR_ROLE === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavService.chkDealRules('CAN_VIEW_MEET_COMP', this.ORIG_USR_ROLE, null, null, null) && (this.ORIG_USR_ROLE !== "FSE"); // Can view meetcomp pass fail
    private CAN_VIEW_EXPORT = true;
    private CAN_VIEW_ALL_DEALS = true;
    private C_ADD_PRICING_STRATEGY: boolean = this.lnavService.chkDealRules('C_ADD_PRICING_STRATEGY', this.ORIG_USR_ROLE, null, null, null);
    private isSuper = true;
    private superPrefix = "";
    private extraUserPrivsDetail: Array<string> = [];
    private contractType = "Contract";
    private selectedTab: number = 0;
    private selectedModel;
    private contractId_Map: contractIds = { Model: 'PTE', C_ID: 0, ps_id: 0, pt_id: 0, ps_index: 0, pt_index: 0, contractData: {} };
    public flowMode = "Deal Entry";
    private autoFillData: any = null;
    // Initialize current strategy and pricing table variables
    public curPricingTable: any = {}; curPricingTableId = 0;
    curPricingStrategyId = 0; curPricingStrategy: any = {}; spreadNeedsInitialization = true;
    public isPtr = false; isWip = false; isPSExpanded = [];
    public custId: any;
    public objTypeCdMessage;
    public uid: number = -100;
    private ptDelId: number = 0;

    private isLoading: boolean = false;
    private msgType: string = "";
    private spinnerMessageHeader: string = "";
    private spinnerMessageDescription: string = "";
    private isBusyShowFunFact: boolean = true;
    private lnavSelectedPT: any = {};
    private lnavSelectedPS: any = {};
    private isDeletePT: boolean = false;
    private isDeletePs: boolean = false;
    private readonly destroy$ = new Subject<void>();

    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";

            // if no change in state, simple update the text            
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                this.isBusyShowFunFact = showFunFact;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                    this.isBusyShowFunFact = showFunFact;
                }, 100);
            }
        });
    }

    //Output Emitter to load the Pricing table data
    loadPte(psId, ptId, ps_index: number, pt_index: number) {
        const contractId_Map: contractIds = {
            Model: 'PTE',
            ps_id: psId,
            pt_id: ptId,
            ps_index,
            pt_index,
            C_ID: this.contractId,
            contractData: this.contractData
        };

        let curPs = this.contractData?.PRC_ST?.filter(x => x.DC_ID == psId);
        if (curPs && curPs.length == 1) {
            this.curPricingStrategy = curPs[0];
        }

        let curPt = this.curPricingStrategy?.PRC_TBL?.filter(x => x.DC_ID == ptId);
        if (curPt && curPt.length == 1) {
            this.curPricingTable = curPt[0];
        }

        this.curPricingStrategyId = psId;
        this.curPricingTableId = ptId;
        //its just update the URl when we reload  it will land on same page last selected pricing strategies 
        const urlTree = this.router.createUrlTree(['/contractmanager', this.route.snapshot.paramMap.get('type'), this.route.snapshot.paramMap.get('cid'), psId, ptId, 0]);
        this.router.navigateByUrl(urlTree);
        setTimeout(() => {
            this.modelChange.emit(contractId_Map);
        }, 100);
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
        this.selectedModel = model;

        //it will update the url on page reload persist the selected state
        if (this.route.snapshot.queryParams.loadtype == 'Manage') {
            const type = this.route.snapshot.paramMap.get('type');
            const cId = this.route.snapshot.paramMap.get('cid');
            const psId = this.route.snapshot.paramMap.get('PSID');
            const ptId = this.route.snapshot.paramMap.get('PTID');
            const dealId = this.route.snapshot.paramMap.get('DealID');
            const urlTree = this.router.createUrlTree(['/contractmanager', type, cId, psId, ptId, dealId]);
            this.router.navigateByUrl(urlTree + '?loadtype=Manage&&manageType=' + model);
        }

        setTimeout(() => {
            this.modelChange.emit(contractId_Map);
        }, 100);
    }

    // **** PRICING STRATEGY Methods ****
    toggleAddStrategy() {
        this.isAddStrategyHidden = !this.isAddStrategyHidden;
        this.isAddStrategyBtnHidden = !this.isAddStrategyBtnHidden;
        this.isSearchHidden = false;

        if (this.isAddStrategyHidden == false) {
            this.isAddPricingTableHidden = true;
        }
    }

    customAddPsValidate() {
        let isvalid = true;
        this.isAddStrategyBtnHidden = true;

        const values = this.newStrategy;
        // Clear all values
        each(values, (value, key) => {
            values._behaviors.validMsg[key] = "";
            values._behaviors.isError[key] = false;
        });

        // Check required
        each(values, (value, key) => {
            if (key[0] !== '_' &&
                !Array.isArray(value) &&
                (value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                values._behaviors.isRequired[key] === true) {
                values._behaviors.validMsg[key] = "* field is required";
                values._behaviors.isError[key] = true;
                isvalid = false;
            }
        });

        // Check unique name
        if (this.contractData.PRC_ST === undefined) {
            this.contractData.PRC_ST = [];
        }

        var isUnique = lnavUtil.IsUniqueInList(this.contractData.PRC_ST, this.newStrategy["TITLE"], "TITLE", false);
        if (!isUnique) {
            this.newStrategy._behaviors.validMsg["TITLE"] = "* must have unique name within contract";
            this.newStrategy._behaviors.isError["TITLE"] = true;
            isvalid = false;
        }

        // Check name length
        if (this.newStrategy["TITLE"].length > 80) {
            this.newStrategy._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
            this.newStrategy._behaviors.isError["TITLE"] = true;
            isvalid = false;
        }

        if (isvalid) {
            this.addPricingStrategy();
        } else {
            this.isAddStrategyBtnHidden = false;
        }
    }

    addPricingStrategy() {
        this.isLoading = true;
        this.setBusy("Saving...", "Saving the Pricing Strategy", "Info", true);
        const ct = this.contractData;
        const custId = this.contractData.CUST_MBR_SID;
        const contractId = this.contractData.DC_ID
        const ps = this.UItemplate["ObjectTemplates"].PRC_ST.ALL_TYPES;
        ps.DC_ID = -100;
        ps.DC_PARENT_ID = ct.DC_ID;
        ps.PRC_TBL = [];
        ps.TITLE = this.newStrategy.TITLE;

        if (this.newStrategy.IS_HYBRID_PRC_STRAT) {
            ps.IS_HYBRID_PRC_STRAT = "1";
        }
        else {
            ps.IS_HYBRID_PRC_STRAT = "0";
            this.newStrategy.IS_HYBRID_PRC_STRAT = ps.IS_HYBRID_PRC_STRAT == "1" ? true : false;
        }

        this.lnavService.createPricingStrategy(custId, contractId, ps).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (this.contractData.PRC_ST === undefined) this.contractData.PRC_ST = [];
            ps.DC_ID = response.PRC_ST[1].DC_ID;
            this.contractData.PRC_ST.push(ps);
            this.showAddPricingTable(ps);
            this.loggerService.success("Save Successful", "Added Pricing Strategy");
            this.newStrategy.TITLE = "";
            //this condition need to revisit will check later
            this.newStrategy.IS_HYBRID_PRC_STRAT = ps.IS_HYBRID_PRC_STRAT == "1" ? true : false;
            this.curPricingStrategy = ps;
            this.curPricingStrategyId = ps.DC_ID;
            this.contractDetailsService.readContract(contractId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                this.contractData = response[0];
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, (err) => {
                this.loggerService.error("Unable to get contract data", "Error", err);
            });
            this.isLoading = false;
            this.setBusy("", "", "", false);
        }, (err) => {
            this.loggerService.error("Unable to create pricing strategy", "Error", err);
            this.isLoading = false;
        });

        //expand pricing strategy after creation.
        if (this.contractData && this.contractData.PRC_ST && this.contractData.PRC_ST.length > 0) {
            this.isPSExpanded[this.contractData.PRC_ST.length] = true;
        }
    }

    refreshContractData(cId) {
        this.contractDetailsService
            .readContract(cId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: Array<any>) => {
                this.contractData = response[0];
            }, (err) => {
                this.loggerService.error("Unable to get contract data", "Error", err);
            });
    }

    // **** PRICING TABLE Methods ****
    clearPtTemplateIcons() {
        each(this.PtDealTypes, (value) => {
            value._custom._active = false;
        });
    }

    customAddPtValidate() {
        let isValid = true;
        this.newPricingTable["TITLE"] = this.ptTITLE;
        const values = this.newPricingTable;

        isValid = this.isValidPt(values);
        if (isValid) {
            this.openAutoFill(null, null);
        }
    }

    isValidPt(values) {
        let isValid = true;
        // Clear all values
        each(values, (value, key) => {
            if (values._behaviors.validMsg[key]) {
                values._behaviors.validMsg[key] = "";
                values._behaviors.isError[key] = false;
            }
        });

        //// Check required
        each(values, (value, key) => {
            if (key[0] !== '_' &&
                !Array.isArray(value) &&
                (!isNaN(value) || value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                values._behaviors.isRequired[key] === true) {
                values._behaviors.validMsg[key] = "* field is required";
                values._behaviors.isError[key] = true;
                isValid = false;
            }
        });

        // Check unique name within ps
        if (!!this.curPricingStrategy) {
            if (this.curPricingStrategy.PRC_TBL === undefined) {
                this.curPricingStrategy.PRC_TBL = [];
            }

            var isUnique = lnavUtil.IsUniqueInList(this.curPricingStrategy.PRC_TBL, this.newPricingTable["TITLE"], "TITLE", false);
            if (!isUnique) {
                this.newPricingTable._behaviors.validMsg["TITLE"] = "* must have unique name within strategy";
                this.newPricingTable._behaviors.isError["TITLE"] = true;
                isValid = false;
            }
        }

        // Check name length
        if (this.newPricingTable["TITLE"].length > 80) {
            this.newPricingTable._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
            this.newPricingTable._behaviors.isError["TITLE"] = true;
            isValid = false;
        }

        // Check if there is a selected deal type
        if (this.newPricingTable.OBJ_SET_TYPE_CD == "") {
            this.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "* please select a deal type";
            this.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = true;
            isValid = false;
        }

        return isValid;
    }

    addPricingTable() {
        this.isLoading = true;
        this.setBusy("Adding...", "Adding the Pricing Table", "Info", true);

        const pt = this.UItemplate["ObjectTemplates"].PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
        if (!pt) {
            this.loggerService.error("Could not create the Pricing Table.", "Error");
            this.isLoading = false;
            this.setBusy("", "", "", false);
            return;
        }

        pt.DC_ID = -100;
        pt.DC_PARENT_ID = this.curPricingStrategy.DC_ID;
        pt.OBJ_SET_TYPE_CD = this.newPricingTable.OBJ_SET_TYPE_CD;
        pt.TITLE = this.newPricingTable.TITLE;
        pt.IS_HYBRID_PRC_STRAT = pt.IS_HYBRID_PRC_STRAT !== undefined ? this.curPricingStrategy.IS_HYBRID_PRC_STRAT : "";

        for (const atrb in this.newPricingTable._defaultAtrbs) {
            if (this.newPricingTable._defaultAtrbs['atrb'] === undefined &&
                pt['atrb'] === undefined) {
                //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                if (Array.isArray(this.newPricingTable._defaultAtrbs[atrb].value)) {
                    //Array, Middle Tier expects a comma separated string
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value.join();
                } else {
                    //String
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value;
                }
            }
        }

        this.lnavService.createPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, pt).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            pt.DC_ID = response.PRC_TBL[1].DC_ID;
            this.contractDetailsService.readContract(this.contractData.DC_ID).pipe(takeUntil(this.destroy$)).subscribe((response: Array<any>) => {
                this.contractData = response[0];
                this.loadPte(pt.DC_PARENT_ID, pt.DC_ID, 0, 0);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, (err) => {
                this.loggerService.error("Unable to get contract data", "Error", err);
            });
            this.isLoading = false;
            this.setBusy("", "", "", false);
        }, (err) => {
            this.loggerService.error("Unable to create pricing table", "Error", err);
            this.isLoading = false;
        })
    }

    clearNptTemplate() {
        this.currentPricingTable = null;
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL.ECAP;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = "";
    }

    unmarkCurPricingStrategyId = function (id) {
        if (this.curPricingStrategyId === id) {
            this.curPricingStrategy = {};
            this.curPricingStrategyId = 0;
            this.openDealEntryTab("PTE");
        }
    }

    unmarkCurPricingTableId = function (id) {
        if (this.curPricingTableId > 0 &&
            this.curPricingTable !== null &&
            this.curPricingStrategy.DC_ID === id) {
            if (this.curPricingStrategyId != 0 && this.ptDelId && this.ptDelId > 0 && this.ptDelId === this.curPricingTableId) {
                this.ptDelId = 0;
                this.openDealEntryTab("PTE");
            }
            this.curPricingTable = {
            };
            this.curPricingTableId = 0;
        }
    }

    /* Ps and Pt Tree*/
    showAddPricingTable(ps) {
        this.isAddPricingTableHidden = false;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;
        this.PtDealTypes = null;
        this.clearNptTemplate();
        this.curPricingStrategy = ps;

        if (this.curPricingStrategy["TITLE"] && this.curPricingStrategy["TITLE"] != "" && !this.curPricingStrategy['PRC_TBL'] || this.curPricingStrategy['PRC_TBL'].length == 0) {
            this.ptTITLE = this.curPricingStrategy["TITLE"];
        } else {
            this.ptTITLE = "";
        }

        let isHybridDeal = (Number(this.curPricingStrategy.IS_HYBRID_PRC_STRAT) == 1 ? true : false);
        this.PtDealTypes = lnavUtil.filterDealTypes(this.UItemplate, isHybridDeal);

        if (!!this.curPricingStrategy && !this.curPricingStrategy.PRC_TBL) {
            // default Pricing Table title to Pricing Strategy title
            this.newPricingTable.TITLE = this.curPricingStrategy.TITLE;
        } else {
            // look for the title in existing titles
            let defTitle = this.curPricingStrategy.TITLE;
            for (let t = 0; t < this.curPricingStrategy.PRC_TBL.length; t++) {
                if (this.curPricingStrategy.PRC_TBL[t].TITLE === defTitle) {
                    defTitle = "";
                }
            }
            this.newPricingTable.TITLE = defTitle;
        }
    }

    copyPricingStrategy(ps) {
        this.copyObj("Pricing Strategy", this.contractData.PRC_ST, ps.DC_ID, true);
        if (this.contractData && this.contractData.PRC_ST && this.contractData.PRC_ST.length > 0) {
            this.isPSExpanded[this.contractData.PRC_ST.length] = true;
        }
    }

    copyPricingTable = function (ps, pt) {
        this.copyObj("Pricing Table", ps.PRC_TBL, pt.DC_ID, false);
    }

    copyObj(objType, objTypes, id, isPs) {
        this.isLoading = true;
        this.setBusy("Copying...", "Copying the " + objType, "Info", true);

        var selectedItems = objTypes.filter(x => x.DC_ID === id);
        var titles = objTypes.map(x => x.TITLE);
        if (selectedItems.length === 0) {
            alert("Unable to locate the " + objType);
            this.isLoading = false;
            this.setBusy("", "", "", false);
            return;
        }
        if (selectedItems.length > 0) {
            var item = selectedItems[0];
        }
        if (!item) {
            alert("Unable to copy the " + objType);
            this.isLoading = false;
            this.setBusy("", "", "", false);
            return;
        }

        item.DC_ID = this.uid--;
        item.HAS_TRACKER = "0";
        item.COST_TEST_RESULT = "Not Run Yet";
        item.MEETCOMP_TEST_RESULT = "Not Run Yet";
        const custId = this.contractData.CUST_MBR_SID;
        const contractId = this.contractData.DC_ID;
        if (isPs == true) {
            const pctObject = item.PRC_TBL;
            const slectedProg = pctObject.filter(x => x.OBJ_SET_TYPE_CD == 'PROGRAM');
            if (slectedProg.length == pctObject.length) {
                alert('Copy for Program Deal is Prevented. Instead use Lump Sum Deal');
                this.isLoading = false;
                this.setBusy("", "", "", false);
                return;
            }
            if (slectedProg.length > 0) {
                alert('Copy for Program Deal is Prevented. Instead use Lump Sum Deal');
            }
        }

        // define new TITLE
        while (titles.indexOf(item.TITLE) >= 0) {
            item.TITLE += " (copy)";
        }

        if (isPs == true) {
            this.lnavService.copyPricingStrategy(custId, contractId, id, item).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
                this.loggerService.success("Copied the " + objType + ".", "Copy Successful");
                this.refreshContractData(contractId);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, (err) => {
                this.loggerService.error("Could not copy the " + objType + ".", err, err.statusText);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            });
        } else {
            this.lnavService.copyPricingTable(custId, contractId, id, item).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
                this.loggerService.success("Copied the " + objType + ".", "Copy Successful");
                this.refreshContractData(contractId);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            }, (err) => {
                this.loggerService.error("Could not copy the " + objType + ".", err, err.statusText);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            });
        }
    }

    editPricingTableName(pt) {
        this.openRenameTitle(pt, "Pricing Table");
    }

    editPricingStrategyName(ps) {
        this.openRenameTitle(ps, "Pricing Strategy");
    }

    openRenameTitle(data, title) {
        let renameData = {
            "contractData": this.contractData,
            "data": data,
            "mode": title
        };

        const dialogRef = this.dialog.open(RenameTitleComponent, {
            height: 'auto',
            width: '600px',
            data: renameData,
            panelClass: 'rename-pte-comp'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                data.TITLE = result;
            }
        });
    }

    deletePricingStrategy(ps) {
        this.lnavSelectedPS = ps;
        this.isDeletePs = true;
    }

    isDeletePricingStrategy(isDelPS: boolean) {
        if (isDelPS) {
            this.isDeletePs = false;
            this.isLoading = true;
            this.setBusy("Deleting...", "Deleting the Pricing Strategy", "Info", false);
            const custId = this.contractData.CUST_MBR_SID;
            const contractId = this.contractData.DC_ID
            this.lnavService.deletePricingStrategy(custId, contractId, this.lnavSelectedPS).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
                this.unmarkCurPricingStrategyId(this.lnavSelectedPS.DC_ID);
                this.unmarkCurPricingTableId(this.lnavSelectedPS.DC_ID);
                this.contractData.PRC_ST.splice(this.contractData.PRC_ST.indexOf(this.lnavSelectedPS), 1);
                this.loggerService.success("Delete Successful", "Deleted the Pricing Strategy");
                this.isLoading = false;
                this.setBusy("", "", "", false);
                this.lnavSelectedPS = {};

                this.pricingStrategyInputHandler();
            }, (err) => {
                this.loggerService.error("Could not delete Pricing Strategy" + this.lnavSelectedPS.DC_ID, err, err.statusText);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            });
        } else {
            this.isDeletePs = false;
        }
    }

    isDeletePricingTable(isDelPT: boolean) {
        if (isDelPT) {
            this.isDeletePT = false;
            this.isLoading = true;
            this.setBusy("Deleting...", "Deleting the Pricing Table", "Info", false);
            const custId = this.contractData.CUST_MBR_SID;
            const contractId = this.contractData.DC_ID;
            this.lnavService.deletePricingTable(custId, contractId, this.lnavSelectedPT).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
                this.ptDelId = this.lnavSelectedPT.DC_ID;
                this.unmarkCurPricingTableId(this.lnavSelectedPS.DC_ID);
                this.lnavSelectedPS.PRC_TBL.splice(this.lnavSelectedPS.PRC_TBL.indexOf(this.lnavSelectedPT), 1);
                this.loggerService.success("Delete Successful", "Deleted the Pricing Table");
                this.isLoading = false;
                this.setBusy("", "", "", false);
                this.lnavSelectedPS = {};
                this.lnavSelectedPT = {};
            }), (err) => {
                this.loggerService.error("Could not delete Pricing Table" + this.lnavSelectedPT.DC_ID, err, err.statusText);
                this.isLoading = false;
                this.setBusy("", "", "", false);
            };
        } else {
            this.isDeletePT = false;
        }
    }

    deletePricingTable(ps, pt) {
        this.lnavSelectedPS = ps;
        this.lnavSelectedPT = pt;
        this.isDeletePT = true;
    }

    onSelectPtMenu(event: any, ps: any, pt: any): void {
        //Number eventIndex = parseInt(event.index);
        switch (event.item?.text) {
            case "Add Pricing Strategy":
                this.toggleAddStrategy();
                break;
            case "Add Pricing Table":
                this.showAddPricingTable(ps);
                break;
            case "Copy Pricing Table":
                this.copyPricingTable(ps, pt);
                break;
            case "Edit Pricing Table Name":
                this.editPricingTableName(pt);
                break;
            case "Edit Autofill Defaults":
                this.openAutoFill(ps, pt);
                break;
            case "Delete Pricing Table":
                this.deletePricingTable(ps, pt);
                break;
            default:
                break;
        }
    }

    onSelectPsMenu(event: any, ps: any): void {
        switch (event.item?.text) {
            case "Add Pricing Strategy":
                this.toggleAddStrategy();
                break;
            case "Copy Pricing Strategy":
                this.copyPricingStrategy(ps);
                break;
            case "Add Pricing Table":
                this.showAddPricingTable(ps);
                break;
            case "Edit Pricing Strategy Name":
                this.editPricingStrategyName(ps);
                break;
            case "Delete Pricing Strategy":
                this.deletePricingStrategy(ps);
                break;
            default:
                break;
        }
    }

    openAutoFill(ps, pt) {
        let ptTemplate;
        let isVistexHybrid;
        if (ps != null) {
            this.curPricingStrategy = ps;
        }

        if (pt != null) {
            this.curPricingTable = pt;
            this.newPricingTable = pt;
            let customer = this.contractData.Customer;
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            this.newPricingTable["_defaultAtrbs"] = lnavUtil.updateNPTDefaultValues(pt, ptTemplate.defaultAtrbs, customer);
        } else {
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable = lnavUtil.setDefaultAttributes(this.newPricingTable, this.isTenderContract, pt, this.contractData);
        }

        if (this.contractData != null) { // Moved down due to normal items missing customer level fields in some cases.
            this.custId = this.contractData.CUST_MBR_SID;
        }

        if (ps == null) {
            if (this.curPricingStrategy.IS_HYBRID_PRC_STRAT === true) {
                isVistexHybrid = this.curPricingStrategy.IS_HYBRID_PRC_STRAT
            } else {
                isVistexHybrid = (this.curPricingStrategy.IS_HYBRID_PRC_STRAT === "1" ? true : false);
            }
        } else {
            isVistexHybrid = (ps.IS_HYBRID_PRC_STRAT === "1" ? true : false);
        }

        let autofillData = {
            "ISTENDER": this.isTenderContract,
            "isVistexHybrid": isVistexHybrid,
            "DEFAULT": lnavUtil.getTenderBasedDefaults(this.newPricingTable, this.isTenderContract),
            "ISVISTEX": false,
            "contractData": this.contractData,
            "currPt": pt,
            "currPs": this.curPricingStrategy,
            "newPt": this.newPricingTable,
            "ptTemplate": ptTemplate
        };
        this.autoFillData = autofillData;
        const dialogRef = this.dialog.open(AutoFillComponent, {
            height: 'auto',
            width: '1500px',
            data: autofillData,
            panelClass: ['dialog-side-panel', 'autofiller-pop-ups'],
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //the scuscriber to this in PTE ngonint code and this fill help autofill setting from PTE screen
                this.autoFillData = result;
                if (pt == null) {
                    this.newPricingTable = this.autoFillData["newPt"];
                    this.contractDetailsService.readContract(this.contractData.DC_ID).pipe(takeUntil(this.destroy$)).subscribe((response: Array<any>) => {
                        this.contractData = response[0];
                        this.loadPte(this.newPricingTable.DC_PARENT_ID, this.newPricingTable.DC_ID, 0, 0);
                    }, (err) => {
                        this.loggerService.error("Unable to get contract data", "Error", err);
                    });
                    this.hideAddPricingTable();
                }
                this.newStrategy.IS_HYBRID_PRC_STRAT = false;
            }
        });
    }

    selectPtTemplateIcon(DealType) {
        let isValid = true;
        this.clearPtTemplateIcons();
        const Title = this.ptTITLE;
        DealType._custom._active = true;
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL[DealType.name];
        this.newPricingTable["TITLE"] = Title;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = DealType.name;
        this.newPricingTable["_extraAtrbs"] = DealType.extraAtrbs;
        this.newPricingTable["_defaultAtrbs"] = DealType.defaultAtrbs
        if (DealType.name !== "" && !!this.newPricingTable._behaviors && !!this.newPricingTable._behaviors.isError) {
            this.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = false;
            this.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "";
        }
        const values = this.newPricingTable;
        isValid = this.isValidPt(values);
        if (isValid) {
            this.openAutoFill(null, null);
        } else {
            this.clearPtTemplateIcons();
        }
    }

    hideAddPricingTable() {
        this.isAddPricingTableHidden = true;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;
        this.clearPtTemplateIcons();
    }

    //Help navigation
    showHelpTopicMeetComp() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Meet-Comp.aspx', '_blank'); 
    }
    showHelpTopicCostTest() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Price-Cost-Test.aspx', '_blank');
    }
    showHelpTopicContract() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Deal-Manager.aspx', '_blank'); 
    }

    onTabSelect(event: any) {
        this.selectedTab = event.index;
        const type=this.route.snapshot.paramMap.get('type');
        const cId=this.route.snapshot.paramMap.get('cid');
        const psId=this.route.snapshot.paramMap.get('PSID');
        const ptId=this.route.snapshot.paramMap.get('PTID');
        const dealId=this.route.snapshot.paramMap.get('DealID');

        this.headerService.getUserDetails().pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.usrRole = res.UserToken.Role.RoleTypeCd;
            (<any>window).usrRole = this.usrRole;

            if (this.isSuper) {
                this.superPrefix = "Super";
                this.extraUserPrivsDetail.push("Super User");
            }
        }, (err) => {
            this.loggerService.error("Unable to get user role data", "Error", err);
        });

        if (event.title == "Deal Entry") {
            //it will update the url on page reload persist the selected state
            const urlTree = this.router.createUrlTree(['/contractmanager', type, cId, psId, ptId, dealId]);
            this.router.navigateByUrl(urlTree);
            setTimeout(() => {
                this.loadModel('PTE');
            }, 100);
        } else if (event.title == "Meet Comp") {
            //it will update the url on page reload persist the selected state
            const urlTree = this.router.createUrlTree(['/contractmanager', type, cId, psId, ptId, dealId]);
            this.router.navigateByUrl(urlTree + '?loadtype=MeetComp');
            setTimeout(() => {
                this.loadModel('MeetComp');
            }, 100);
        } else if (event.title == "Manage") {
            //it will update the url on page reload persist the selected state
            const urlTree = this.router.createUrlTree(['/contractmanager', type, cId, psId, ptId, dealId]);
            this.router.navigateByUrl(urlTree + '?loadtype=Manage');
            setTimeout(() => {
                this.loadModel('Manage');
            }, 100);
        }
    }

    openDealEntryTab(model: string) {
        this.selectedTab = 0;
        this.loadContractDetails(model);
    }

    openMeetCompTab() {
        this.selectedTab = 1;
        this.loadModel('MeetComp');
    }

    // **** LEFT NAVIGATION Methods ****    
    toggleLnav(src: string) {
        this.isLnavHidden['isLnavHid'] = !this.isLnavHidden['isLnavHid'];
        this.isLnavHidden['source'] = src;
        this.lnavService.isLnavHidden.next(this.isLnavHidden);

        this.changeDetectorRef.markForCheck();
    }

    toggleStrategyTree() {
        if (this.strategyTreeCollapseAll == true) {
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = false;
            });
        } else {
            this.contractData?.PRC_ST.map((x, i) => {
                this.isPSExpanded[i] = true;
            });
        }
        this.strategyTreeCollapseAll = !this.strategyTreeCollapseAll;
    }

    isExistingContract() {
        return this.contractData.DC_ID > 0;
    }

    toggleSearch() {
        this.isSearchHidden = !this.isSearchHidden;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isAddPricingTableHidden = true;
    }

    //LNAv flow Mini
    gotoDealEntry() {
        //we reset any PS/PT/WIP specific information to remove unnecessary highlights or headers - perhaps this should be kept in the $scope.goto function instead?
        this.curPricingStrategyId = 0;
        this.curPricingStrategy = {};
        this.curPricingTable = {};
        this.curPricingTableId = 0;
        this.isPtr = false;
        this.isWip = false;
        this.selectedTab = 0;
        this.goto('Deal Entry', 'PTE');
    }

    gotoCompliance() {
        if (!lnavUtil.enableFlowBtn(this.contractData)) return;
        this.selectedTab = 1;
        this.goto('Compliance', 'MeetComp');
    }

    gotoManage() {
        if (!lnavUtil.enableFlowBtn(this.contractData)) return;
        this.isAddPricingTableHidden = true;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;
        this.goto('Manage', 'contract.summary');
    }

    goto(mode, val) {
        this.flowMode = mode;
        this.loadModel(val);
    }

    removeBlanks(val) {
        return val.replace(/_/g, '');
    }

    loadContractDetails(model: string) {
        this.selectedTab = 0;
        const contractDetails_Map: contractIds = {
            Model: model,
            ps_id: 0,
            pt_id: 0,
            ps_index: 0,
            pt_index: 0,
            C_ID: this.contractId,
            contractData: this.contractData
        };
        this.modelChange.emit(contractDetails_Map);
    }

    enableFlowBtn() {
        return (lnavUtil.enableFlowBtn(this.contractData) == false) ? true : false;
    }

    needMct = function () {
        if (!this.contractData.PRC_ST || this.contractData.PRC_ST.length === 0) return false;
        let isNeedMct = false;
        each(this.contractData.PRC_ST, (item) => {
            if (item.COMP_MISSING_FLG !== "" && (item.COMP_MISSING_FLG === "1" || item.COMP_MISSING_FLG === 1)) {
                isNeedMct = true;
            }
        });
        return isNeedMct;
    }

    private isPricingStrategyEmpty(): boolean {
        // Can return 'false' if contractData variable is empty
        return (this.contractData && (this.contractData.PRC_ST == undefined || this.contractData.PRC_ST == null || this.contractData.PRC_ST.length == 0));
    }
    private isAddPricingStrategyState(): boolean {
        return (this.isPricingStrategyEmpty() && this.C_ADD_PRICING_STRATEGY);
    }

    @ViewChild('pricingStrategyTooltipTarget', { static: false }) pricingStrategyStartTooltip: NgbTooltip;
    private isPricingStrategyTooltipEnabled = false;
    private updatePricingStrategyEnabledFlag() {
        this.isPricingStrategyTooltipEnabled = this.isAddPricingStrategyState();

        if (this.isPricingStrategyTooltipEnabled && this.pricingStrategyStartTooltip == undefined) {
            this.changeDetectorRef.detectChanges();
        }
    }
    private showPricingStrategyTooltip() {
        if (this.isPricingStrategyTooltipEnabled) {
            this.pricingStrategyStartTooltip.open();
        }
    }

    private readonly ID_DEAL_ENTRY_TAB: number = 0;
    private triggerAddStrategyToggle() {
        if (this.selectedTab == this.ID_DEAL_ENTRY_TAB && this.isAddPricingStrategyState()) {
            this.toggleAddStrategy();
        }
    }

    private pricingStrategyInputHandler() {
        this.updatePricingStrategyEnabledFlag();
        this.triggerAddStrategyToggle();
        this.showPricingStrategyTooltip();
    }

    private get isPsTitleBehaviorErrorState(): boolean {
        if (this.newStrategy != undefined && this.newStrategy._behaviors != undefined && this.newStrategy._behaviors.isError != undefined && this.newStrategy._behaviors.isError.TITLE != undefined) {
            return this.newStrategy._behaviors.isError.TITLE as boolean;
        }

        return false;
    }

    private get getPsTitleBehaviorValidMessage(): string {
        if (this.newStrategy != undefined && this.newStrategy._behaviors != undefined && this.newStrategy._behaviors.validMsg != undefined && this.newStrategy._behaviors.validMsg.TITLE  != undefined) {
            return this.newStrategy._behaviors.validMsg.TITLE as string;
        }

        return '';
    }

    private get getPtTitleBehaviorValidMessage(): string {
        if (this.newPricingTable != undefined && this.newPricingTable._behaviors != undefined && this.newPricingTable._behaviors.validMsg != undefined && this.newPricingTable._behaviors.validMsg.TITLE  != undefined) {
            return this.newPricingTable._behaviors.validMsg.TITLE as string;
        }

        return '';
    }

    private get getPtObjectSetTypeCodeBehaviorValidMessage(): string {
        if (this.newPricingTable != undefined && this.newPricingTable._behaviors != undefined && this.newPricingTable._behaviors.validMsg != undefined && this.newPricingTable._behaviors.validMsg.OBJ_SET_TYPE_CD  != undefined) {
            return this.newPricingTable._behaviors.validMsg.OBJ_SET_TYPE_CD as string;
        }

        return '';
    }

    ngOnInit() {
        try {
            this.newStrategy = this.UItemplate.ObjectTemplates?.PRC_ST.ALL_TYPES;
            this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL.ECAP;
            this.newStrategy.IS_HYBRID_PRC_STRAT = false;
            this.contractData?.PRC_ST?.map((x, i) => {
                this.isPSExpanded[i] = true
            });

            this.pricingStrategyInputHandler();

            //code for autofill change to accordingly change values
            this.lnavService.autoFillData.pipe(takeUntil(this.destroy$)).subscribe((res) => {
                this.autoFillData = res;
            }, (err) => {
                this.loggerService.error("lnavSvc::isAutoFillChange**********", err);
            });

            if (this.route.snapshot.queryParams.loadtype == 'Manage') {
               this.selectedModel= this.route.snapshot.queryParams.manageType;
            }
        } catch (ex) {
            this.loggerService.error('Something went wrong', 'Error');
            console.error('LNAV::ngOnInit::', ex);
        }
    }

    ngOnChanges() {
        this.selectedTab = this.changedTab;

        this.pricingStrategyInputHandler();

        if (!!this.selectNavMenu && this.selectNavMenu != '') {
            this.selectedModel = this.selectNavMenu;

            //it will update the url on page reload persist the selected state
            if (this.route.snapshot.queryParams.loadtype == 'Manage') {
                const type = this.route.snapshot.paramMap.get('type');
                const cId = this.route.snapshot.paramMap.get('cid');
                const psId = this.route.snapshot.paramMap.get('PSID');
                const ptId = this.route.snapshot.paramMap.get('PTID');
                const dealId = this.route.snapshot.paramMap.get('DealID');
                const urlTree = this.router.createUrlTree(['/contractmanager', type, cId, psId, ptId, dealId]);

                this.router.navigateByUrl(urlTree + '?loadtype=Manage&&manageType=' + this.selectNavMenu);
            }
        }
    }

    ngAfterViewInit() {
        this.pricingStrategyInputHandler();

        //This will help to highlight the selected Pricing Table incase of search result landing directly to PT. The logic can apply only once the page is rendered
        this.lnavService.lnavHighlight.pipe(takeUntil(this.destroy$)).subscribe(res => {
            this.contractId_Map = { ...res, ps_index: 0, pt_index: 0 };
            (<any> $(`#sumPSdata_${ this.contractId_Map.ps_id }`)).collapse('show');
            this.changeDetectorRef.detectChanges();
        }, err => {
            this.loggerService.error("lnavService::lnavHighlight**********", err);
        });
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, SelectAllCheckboxState, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { managerPctservice } from "./managerPct.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
    selector: "pct-child-grid",
    templateUrl: "Client/src/app/contract/managerPct/pctChildGrid.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/managerPct.component.css']
})

export class pctChildGridComponent {
    constructor(private loggerSvc: logger, private managerPctSvc: managerPctservice, private lnavSvc: lnavService, private headerSvc: headerService, private formBuilder: FormBuilder) {

    }
    //public view: Observable<GridDataResult>;
    public isLoading = true;
    public skip = 0;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() parent: any;
    @Input() child: any;
    @Input() UItemplate: any;
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

    private childState: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    public pageChange({ skip, take }: PageChangeEvent): void {
        this.skip = skip;
        this.managerPctSvc.queryForCategory(this.parent.DEAL_ID, { skip, take });
    }

    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.contractData?.PRC_ST.map((x, i) => {
            //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
            this.isPSExpanded[i] = false;
            if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
        })
        this.gridResult = this.parent.filter(x => x.DEAL_ID == this.child.DEAL_ID);
        this.gridData = process(this.gridResult, this.childState);
        this.isLoading = false;
    }
}
angular.module("app").directive(
    "pct-child-grid",
    downgradeComponent({
        component: pctChildGridComponent,
    })
);
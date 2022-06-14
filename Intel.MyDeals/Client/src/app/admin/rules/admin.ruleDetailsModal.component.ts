import * as angular from 'angular';
import { Component, Inject, ViewEncapsulation } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { adminRulesService } from "./admin.rules.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";

import {
    GridDataResult,
    DataStateChangeEvent
} from "@progress/kendo-angular-grid";

@Component({
    providers: [adminRulesService],
    selector: "ruleDetailsModal",
    templateUrl: "Client/src/app/admin/rules/admin.ruleDetailsModal.component.html",
    styleUrls: ['Client/src/app/admin/rules/admin.rules.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class RuleDetailsModalComponent {

    constructor(public dialogRef: MatDialogRef<RuleDetailsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private adminRulesSvc: adminRulesService,
        private loggerSvc: logger) {

    }
    public dealsList = "";
    public selectedIds = [];

    public Rules = [];
    public RuleConfig = [];
    public dataCollection = [];
    public isLoading = true;
    public gridData: GridDataResult;
    public isAlert = false;
    public message = "";

    public state: State = {
        skip: 0,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };

    ngOnInit() {
        this.adminRulesSvc.getPriceRulesConfig().subscribe((response) => {
            if (response.data) {
                this.RuleConfig = response.data;
            }
        }, (error) => {
            this.loggerSvc.error("Unable to get Price Rules Config", error);
        });
        this.GetRules(0, "GET_RULES");
        this.gridData = process(this.dataCollection, this.state);
    }

    GetRules(id, actionName) {
        this.adminRulesSvc.getPriceRules(id, actionName).subscribe((response) => {
            this.Rules = response;
            this.isLoading = false;
        }, (error) => {
            this.loggerSvc.error("Unable to get Price Rules", error);
        });
    }

    close() {
        this.dialogRef.close();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.dataCollection, this.state);
    }

    runSimulation() {
        this.gridData = process([], this.state);
        this.isLoading = true;
        var data = new Array();

        var dataRuleIds = this.selectedIds;

        var dataDealsIds = [];
        var deals = this.dealsList !== undefined ? this.dealsList.split(",") : [];
        for (var j = 0; j < deals.length; j++) {
            var dealId = parseInt(deals[j], 10) || 0;
            if (dealId > 0) {
                dataDealsIds.push(parseInt(deals[j], 10));
            }
        }

        data.push(dataRuleIds, dataDealsIds);
        this.adminRulesSvc.getRuleSimulationResults(data).subscribe((response) => {
            this.isLoading = false;
            if (response.length > 0) {
                this.dataCollection = response;
                this.gridData = process(this.dataCollection, this.state);
            } else {
                this.isAlert = true;
                this.message = "This simulation returned no matching rule/deal matches";
            }
        }, (error) => {
            this.loggerSvc.error("Error: Unable to Simulate the rule due to system error", error);
        });
    }

    cancelAlert() {
        this.isAlert = false;
    }

    distinctPrimitive(fieldName: string): any {
        return distinct(this.dataCollection, fieldName).map(item => item[fieldName]);
    }
}
angular.module("app").directive(
    "ruleDetailsModal",
    downgradeComponent({
        component: RuleDetailsModalComponent,
    })
);
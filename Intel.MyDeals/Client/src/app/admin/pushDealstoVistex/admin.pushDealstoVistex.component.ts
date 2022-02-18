import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import * as _ from "underscore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pushDealsToVistexService } from "./admin.pushDealstoVistex.service";
import { GridDataResult, DataStateChangeEvent} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: "adminPushDealstoVistex",
    templateUrl: "Client/src/app/admin/pushDealstoVistex/admin.pushDealstoVistex.component.html",
    styleUrls: ['Client/src/app/admin/pushDealstoVistex/admin.pushDealstoVistex.component.css']
})

export class adminPushDealsToVistexComponent {
    constructor(private loggerSvc: logger, private pushDealstoVistexSvc: pushDealsToVistexService, private formBuilder: FormBuilder,) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private color: ThemePalette = 'primary';
    private pushDealsToVistexForm: FormGroup;
    private loadMessage: string = "Admin Customer Loading..";
    private Results = [];
    private UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
    private showResults: boolean = false;
    public gridData: GridDataResult;
    public state: State = {
        group: [],
        sort: []
        // Initial filter descriptor
    };

    securityCheck() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        } 
    }

    //get method for easy access to the form fields.
    get formData() { return this.pushDealsToVistexForm.controls; }

    ValidateAndSendDeals () {
        this.pushDealsToVistexForm.patchValue({
            //below line of code removes if any whitespaces or consecutives commas present in the user input
            DEAL_IDS: this.pushDealsToVistexForm.value.DEAL_IDS.replace(/\s/g, '').split(',').filter(x => x).join(',')
               
        });
        if (this.pushDealsToVistexForm.invalid) {
            this.showResults = false;
            this.loggerSvc.warn("Please fix validation errors","Validation error");
            return;
        }
        this.pushDealstoVistexSvc.PushDealstoVistex(this.pushDealsToVistexForm.value).subscribe(result => {
            this.Results = result;
            this.showResults = true;
            this.UpdCnt.all = this.Results.length;
            this.UpdCnt.error = this.Results.filter(x => x.ERR_FLAG === 1).length;
            this.UpdCnt.success = this.Results.filter(x => x.ERR_FLAG === 0).length;
            this.gridData = process(this.Results, this.state);
            this.loggerSvc.success("Please Check The Results.");
        },
            error => {
                this.loggerSvc.error("adminPushDealsToVistexComponent::PushDealstoVistex::Unable to push deals to vistex", error);
            }
        );
          
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.Results, this.state);
    }
    ngOnInit() {
        this.securityCheck();
        this.pushDealsToVistexForm = this.formBuilder.group({
            DEAL_IDS: ['', Validators.required],
            VSTX_CUST_FLAG:true
        });
    }
}

angular.module("app").directive(
    "adminPushDealstoVistex",
    downgradeComponent({
        component: adminPushDealsToVistexComponent
    })
);




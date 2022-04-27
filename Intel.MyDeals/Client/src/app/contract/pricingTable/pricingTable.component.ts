import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { pricingTableservice } from "./pricingTable.service";
import { SelectEvent } from "@progress/kendo-angular-layout";
import { ContractUtil } from "../contract.util";
import { templatesService } from "../../shared/services/templates.service";

export interface contractIds {
    Model: string;
    C_ID: number;
    ps_id: number;
    pt_id: number;
}

@Component({
    selector: "pricingTable",
    templateUrl: "Client/src/app/contract/pricingTable/pricingTable.component.html",
    styleUrls: ['Client/src/app/contract/pricingTable/pricingTable.component.css']
})

export class pricingTableComponent {
    constructor(private loggerSvc: logger, private pricingTableSvc: pricingTableservice,private templatesSvc: templatesService) { }

    public curPricingStrategy: any = {};
    public pricingTableData: any = {};
    public c_Id: number;
    public ps_Id: number;
    public pt_Id: number;
    private isPTETab: boolean = true;
    private isDETab: boolean = false;
    private selLnav: string = 'PTE';
    private isPTEEnable: boolean = false;
    private isLNavEnable: boolean = false;
    public contractData:any=null;
    public UItemplate:any=null

    loadModel(contractModel: contractIds) {
        this.selLnav = contractModel.Model
        if (this.selLnav == 'PTE') {
            if (contractModel.ps_id != 0 && contractModel.pt_id != 0) {
                this.isPTEEnable = true;
                this.ps_Id = contractModel.ps_id;
                this.pt_Id = contractModel.pt_id;
                this.c_Id = contractModel.C_ID;
            }
            //defaulting the PTE page to load the images
            else {
                this.isPTEEnable = false;
            }

        }
        else if (this.selLnav == 'MeetComp') {
            console.log('Enable Meetcomp');
        }
        else {
            console.log('Manage');
        }

        //this.curPricingStrategy = ContractUtil.findInArray(this.contractData["PRC_ST"], this.ps_Id)
    }
    onTabSelect(e: SelectEvent) {
        console.log("onTabSelect  ***********", e);
    }
    loadAllContractDetails() {
        this.pricingTableSvc.readContract(this.c_Id).subscribe((response: Array<any>) => {
            this.contractData = response[0];
            this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
                this.UItemplate = response;
                this.isLNavEnable=true;
            },(error) => {
                this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
            })
        },(error) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', error);
        })
     
    }
    ngOnInit() {
        let url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
        this.loadAllContractDetails();
    }
}
angular.module("app").directive(
    "pricingTable",
    downgradeComponent({
        component: pricingTableComponent,
    })
);
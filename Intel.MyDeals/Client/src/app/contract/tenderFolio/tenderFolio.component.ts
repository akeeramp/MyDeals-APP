import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "underscore";
import { TenderFolioService } from '../tenderFolio/tenderFolio.service';
import {logger} from '../../shared/logger/logger'

@Component({
    providers: [TenderFolioService],
    selector: "app-tender-folio",
    templateUrl: "Client/src/app/contract/tenderFolio/tenderFolio.component.html",
    styleUrls: ["Client/src/app/contract/tenderFolio/tenderFolio.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class TenderFolioComponent {
    
    constructor(
        public dialogRef: MatDialogRef<TenderFolioComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private dataService: TenderFolioService,
        private loggerSvc: logger

    ) { }

    private isLoading = true;
    private tenderName;
    private contractType = "Tender Folio";
    private contractData: any;
    private selectedData: any;
    private isCustDiv = false;
    private isCustSelected = false;
    private custSIDObj: any;
    private CUST_NM_DIV: any;
    private showKendoAlert = false;
    private isTitleError = false;
    private  titleErrorMsg: string;
    private timeout = null;
    private selectedDealType = "KIT";
    private dealTypes = [{name: "ECAP",
    _custom: {ltr: 'E', _active: true}},{name: "KIT",
    _custom: {ltr: 'K', _active: false}}];

    dismissPopup(): void {
        this.dialogRef.close();
    }
    selectPtTemplateIcon(name : string){
        this.selectedDealType = name;
        for(const deal of this.dealTypes){
            if(deal.name===name){
                deal._custom._active = true;
            }else{
                deal._custom._active = false;
            }
        }
    }
    filterDealTypes() {
        //Eventually it will use contractdetail page for getting deal types,for now hardcoded with ecap and kit for tender folio  
        return this.dealTypes;
    }
    closeKendoAlert(){
        this.showKendoAlert = false;
    }   
    onKeySearch(event) {
        clearTimeout(this.timeout);
        const vm = this;
        this.timeout = setTimeout(function () {
          if (event.keyCode != 13 && event.keyCode != 9) {
           vm.isDuplicateContractTitle(event.target.value);
          }
        }, 800);  
    }
    // Contract name validation
    isDuplicateContractTitle(title:string) {
        if (title === "") return;
        //passing -100 in place of this.contractData.DC_ID
        this.dataService.isDuplicateContractTitle(-100, title).subscribe((response) => {
            if (response) {
                this.isTitleError = true;
                this.titleErrorMsg = "This contract name already exists in another contract.";
            }
            else {
                this.isTitleError = false;
            }
        });
    } 
    valueChange(value) {
        this.isCustDiv = false;
        if (value) {
            this.custSIDObj = value;
            this.dataService.getCustDivBySID(this.custSIDObj.CUST_SID)
                .subscribe(res => {
                    if (res) {
                        res = res.filter(data => data.CUST_LVL_SID === 2003);
                        if (res[0].PRC_GRP_CD == '') {
                           this.showKendoAlert = true;
                        }
                        this.selectedData = res;
                        this.isCustDiv = this.selectedData.length <= 1 ? false : true;                        
                    }
                }, function (response) {
                    this.loggerSvc.error("Unable to get Customer Divisions.", response, response.statusText);
                });
        }
    }
    getAllCustomers() {
        this.dataService.getCustomerDropdowns().subscribe(res => {
            if (res) {
                this.contractData = res;
                this.isLoading = false;
                this.isCustDiv = false;
            }
        }, function (response) {
            this.loggerSvc.error("Unable to get Customers.", response, response.statusText);
        })
    }
    saveContractTender(){
        let selectedCustDivs = [];
        if(this.CUST_NM_DIV){
           selectedCustDivs = this.CUST_NM_DIV.map(data => data.CUST_DIV_SID);
        }
        const createTndrFolioObj = {
            dealType : this.selectedDealType,
            tenderName : this.tenderName,
            custDivisons : selectedCustDivs,
            cust_sid : this.custSIDObj?.CUST_SID
        }
        //Redirecting to newContractWidget,handle & call saveContractTender() function of contractDetail page from there
        this.dialogRef.close(createTndrFolioObj);
    }
    ValidateTender() {
        if(!this.custSIDObj){
            this.isCustSelected = true;
        }else{
            this.isCustSelected = false;
        }
        if(this.tenderName === "" || !this.tenderName){
            this.isTitleError = true;
            this.titleErrorMsg = "* field is required";
        }
        if(this.isCustSelected || this.isTitleError){  
            return;
        }
        this.saveContractTender();
    }
    ngOnInit() {
        this.getAllCustomers();
    }
}
import { Component, Input, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { contractExportService } from "./contractExport.service";
import { lnavService } from "../lnav/lnav.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CurrencyPipe, DecimalPipe } from "@angular/common";

@Component({
    selector: "contract-export",
    templateUrl :"Client/src/app/contract/contractExport/contractExport.component.html",
    styleUrls: ["Client/src/app/contract/contractExport/contractExport.component.css"]
})

export class contractExportComponent implements OnDestroy{
    constructor(private contractExportSvc: contractExportService, private loggerSvc: logger, private lnavSvc: lnavService, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe ) {
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    timelineData =[];
    tableHeaderData: any;
    private netKitPrice: number = 0;
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    private loadMessage = "Loading Contract Data";    
    public exportData : any;

    loadContractExportData() {
        const cId = this.contractData.DC_ID;

        this.contractExportSvc.getExportContractData(cId).pipe(takeUntil(this.destroy$)).subscribe((result: Array<any>) => {
            this.loadMessage = "Done";
            this.exportData = result[0];
            setTimeout(()=>{
                this.isLoading = false;
            }, 500);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('Contract Export service', error);
        });
    }
    showObjType(objType) {
        const type = {
            "KIT": "Kit",
            "ECAP": "Ecap",
            "PROGRAM": "Program",
            "VOL_TIER": "Volume Tier",
            "REV_TIER": "Rev Tier",
            "LUMP_SUM": "Lump Sum",
            "FLEX": "Flex Accruals"
        }
        if (objType === "KIT" || objType === "ECAP" || objType === "PROGRAM" || objType === "VOL_TIER" || objType === "REV_TIER" || objType === "LUMP_SUM" || objType === "FLEX")
            return type[objType];
        return "";
    }

    showField(data, field, tmplt, objType) {
        const val = data[field];
        let ptrProds = JSON.parse(data['PTR_SYS_PRD']);
        
        if (val === undefined || val === null || val == "") {
            if(objType != "KIT") {
                let obj;
                let tier = [];
                let startVol = [];
                let endVol = [];
                let rate = [];
                if(data.OBJ_SET_TYPE_CD == "ECAP"){
                    obj = JSON.parse(data['PTR_SYS_PRD']);
                } else if(data.OBJ_SET_TYPE_CD == "VOL_TIER" || data.OBJ_SET_TYPE_CD == "REV_TIER" || data.OBJ_SET_TYPE_CD == "LUMP_SUM" || data.OBJ_SET_TYPE_CD == "FLEX"){
                    obj = data._MultiDim;

                    if(field == 'TIER_NBR' || field == 'STRT_VOL' || field == 'END_VOL' || field == 'RATE' || field == 'STRT_REV' || field == 'END_REV' || field == 'INCENTIVE_RATE'){
                        for(let i=0; i < obj.length; i++){
                            let obj1 = obj[i];
                            tier.push(obj1['TIER_NBR']);
                            if(data.OBJ_SET_TYPE_CD == "REV_TIER"){
                                startVol.push(obj1['STRT_REV']);
                                endVol.push(obj1['END_REV']);
                                rate.push(obj1['INCENTIVE_RATE']);
                            } else {
                                startVol.push(obj1['STRT_VOL']);
                                endVol.push(obj1['END_VOL']);
                                rate.push(obj1['RATE']);
                            }
                        }
                    }
                    
                }
                
                for (const key in obj) {
                    let obj1 = obj[key];
                    for (const key1 in obj1) {
                        if(data.OBJ_SET_TYPE_CD == "ECAP"){
                            if(obj1[key1][field] !== undefined && obj1[key1][field] !== null && obj1[key1][field] != ""){
                                return obj1[key1][field];
                            } else {
                                return "";
                            }
                        } else if(data.OBJ_SET_TYPE_CD == "VOL_TIER" || data.OBJ_SET_TYPE_CD == "REV_TIER" || data.OBJ_SET_TYPE_CD == "LUMP_SUM" || data.OBJ_SET_TYPE_CD == "FLEX"){
                            if(obj1[field] !== undefined && obj1[field] !== null && obj1[field] != ""){
                                if(field == 'TIER_NBR') {
                                    return tier.join('\n');
                                } else if(field == 'STRT_VOL' || field == 'STRT_REV') {
                                    return startVol.join('\n');
                                } else if(field == 'END_VOL' || field == 'END_REV') {
                                    return endVol.join('\n');
                                } else if(field == 'RATE' || field == 'INCENTIVE_RATE') {
                                    return rate.join('\n');
                                } else {
                                    return obj1[field];
                                }
                                //return obj1[field];
                            } else {
                                return "";
                            }
                        }

                    }
                }
            } else {
                let obj = JSON.parse(data['PTR_SYS_PRD']);
                let objArrVal = data._MultiDim
                for (const key in obj) {
                    let obj1 = obj[key];
                    for (const key1 in obj1) {
                        if(obj1[key1][field] !== undefined && obj1[key1][field] !== null && obj1[key1][field] != ""){
                            return obj1[key1][field];
                        } else {
                            for (const arrKey in objArrVal) {
                                let objArrVal1 = objArrVal[arrKey];
                                if(objArrVal1[field] !== undefined && objArrVal1[field] !== null && objArrVal1[field] != ""){
                                    this.netKitPrice = parseInt(objArrVal1[field])
                                    return this.currencyPipe.transform(objArrVal1[field]);
                                } else {
                                    if(field == "ECAP_PRICE_____20_____1" || field == "PRD_BCKT" || field == "DSCNT_PER_LN" || field == "QTY" || field == "TEMP_TOTAL_DSCNT_PER_LN" || field == "TEMP_KIT_REBATE") {
                                        let allEcapValues = [];
                                        let allDiscountVal = [];
                                        let allQtyVal = [];
                                        let prodBckt = [] ;
                                        for(let i=0; i<objArrVal.length; i++){
                                            let arrVal = objArrVal[i];
                                            if(arrVal['PIVOT'] != "20:-1"){
                                                allEcapValues.push(arrVal['ECAP_PRICE']);
                                                allDiscountVal.push(arrVal['DSCNT_PER_LN']);
                                                allQtyVal.push(arrVal['QTY']);
                                                prodBckt.push(arrVal['PRD_BCKT']);
                                            }
                                        }
                                        if(field == "ECAP_PRICE_____20_____1"){
                                            return this.assignDollorSign(allEcapValues);
                                        }
                                        if(field == "DSCNT_PER_LN"){
                                            return this.assignDollorSign(allDiscountVal);
                                        }
                                        if(field == "TEMP_TOTAL_DSCNT_PER_LN") {
                                            let sum = []; // Initialize a sum variable
                                            for (let i = 0; i < allDiscountVal.length; i++) {
                                                sum.push(parseInt(allDiscountVal[i]) * parseInt(allQtyVal[i])); // Add each element to the sum
                                            }
                                            return this.assignDollorSign(sum);
                                        }
                                        if(field == "QTY"){
                                            return allQtyVal.join('\n');
                                        }
                                        if(field == "PRD_BCKT"){
                                            return prodBckt.join('\n');
                                        }
                                        if(field == "TEMP_KIT_REBATE") {
                                            let kitRebate = 0;
                                            let sum = 0; // Initialize a sum variable
                                            let totalDisount = 0;
                                            
                                            for (let i = 0; i < allEcapValues.length; i++) {
                                                sum += parseInt(allEcapValues[i]) * parseInt(allQtyVal[i]); // Add each element to the sum
                                                kitRebate = this.netKitPrice - sum;
                                            }
                                            return this.currencyPipe.transform(Math.abs(kitRebate));
                                        }
                                    } else {
                                        return "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (this.UItemplate["ModelTemplates"].PRC_TBL_ROW[objType].model.fields[field].type === 'number') {
            let format = this.UItemplate.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].format;
            if (format === "{0:c}") format = "c";
            else if (format === "{0:n}") format = "n";
            else if (format === "{0:d}") format = "d";

            const obj = {
                "c": this.currencyPipe.transform(val),
                "n": this.decimalPipe.transform(val, '1.0-0'),
                "d": this.decimalPipe.transform(val, '1.2-2')
            }
            return obj[format];
        }
        else if (typeof val === 'string') return val.replace(/,/g, ', ');
        return val;
    }

    assignDollorSign(value){
        let arr = [];
        for(let i=0; i<value.length; i++){
            arr.push(this.currencyPipe.transform(value[i]));
        }
        return arr.join('\n');
    }

    showTitle(title) {
        return title.replace(/\*/g, '');
    }
    loadTimeLineData(){
        let contractDetailId = null;
        const objTypeIds = [1, 2, 3];
        const objTypeSId = 1;
        if(this.contractData.DC_ID){
            contractDetailId = this.contractData.DC_ID;

        this.contractExportSvc.GetObjTimelineDetails(contractDetailId,objTypeSId, objTypeIds).pipe(takeUntil(this.destroy$)).subscribe((response: Array<any>) => {
            this.timelineData = response;

        }, error => {
            this.loggerSvc.error("Unable to get Contract Export Timeline Details.", error);
        });
    }
    
    
    }
    exportToPDF(){
        let htmlBody = [];
        let fname ='#'+this.exportData.DC_ID+"-"+ this.exportData.TITLE + ".pdf";
        htmlBody.push(document.getElementById('pdfContent').innerHTML); 
        this.isLoading = true;
        let blah = this.contractExportSvc.exportAsPDF(htmlBody).pipe(takeUntil(this.destroy$)).subscribe(response => {
            this.isLoading = false;
            let file = new Blob([response], { type: 'application/pdf' });
            let fileURL = URL.createObjectURL(file);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = fileURL;
            a.download = fname; //"Test.pdf";
            a.click();
        }, error => {
            this.loggerSvc.error("Unable to generate contract PDF.", error);
            this.isLoading = false;
        });


    }
showHelpTopic() {
    window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Contract-Manager-Tab.aspx', '_blank');
}
    ngOnInit() {
        try{
            this.tableHeaderData = this.UItemplate.ModelTemplates;
            this.loadContractExportData();
            this.loadTimeLineData();
        }
        catch(ex){
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('Contract_Export::ngOnInit::',ex);
        }
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


}



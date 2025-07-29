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
        if (val === undefined || val === null || val == "") return "";
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



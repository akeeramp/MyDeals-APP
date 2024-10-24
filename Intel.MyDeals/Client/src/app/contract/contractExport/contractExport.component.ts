import { Component, Input, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { contractExportService } from "./contractExport.service";
import { lnavService } from "../lnav/lnav.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";


@Component({
    selector: "contract-export",
    templateUrl :"Client/src/app/contract/contractExport/contractExport.component.html",
    styleUrls: ["Client/src/app/contract/contractExport/contractExport.component.css"]
})

export class contractExportComponent implements OnDestroy{
    constructor(private contractExportSvc: contractExportService, private loggerSvc: logger, private lnavSvc: lnavService) {
    }
    @Input() contractData: any;
    @Input() UItemplate: any;
    timelineData =[];
    tableHeaderData: any;
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
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
        if (objType === "KIT") return "Kit";
        if (objType === "ECAP") return "ECAP";
        if (objType === "PROGRAM") return "Program";
        if (objType === "VOL_TIER") return "Volume Tier";
        if (objType === "REV_TIER") return "Rev Tier";
        if (objType === "DENSITY") return "Density Based";
        if (objType === "FLEX") return "Flex Accruals";
        return "";
    }
    showField(data, field, tmplt, objType) {
        let val = data[field];
        if (val === undefined || val === null) val = "";
        if (typeof val === 'string') val = val.replace(/,/g, ', ');

        if (this.UItemplate["ModelTemplates"].PRC_TBL_ROW[objType].model.fields[field].type === 'number') {
            let format = this.UItemplate.ModelTemplates.PRC_TBL_ROW[objType].model.fields[field].format;
            if (format === "{0:c}") format = "c";
            if (format === "{0:n}") format = "n";
            if (format === "{0:d}") format = "d";
            if (val !== "" && !isNaN(val)) {
                // val = kendo.toString(parseFloat(val), format);
            }
        }

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



import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridDataResult } from "@progress/kendo-angular-grid";
import { emailModal } from "../emailModal/emailModal.component";

@Component({
    selector: "message-board-dialog",
    templateUrl: "Client/src/app/contract/contractManager/messageBoard/messageBoard.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/messageBoard/messageBoard.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class messageBoardModal {
    constructor(protected dialog: MatDialog) {
    }
    @Input() data:any;
    @Input() contractData:any;
    @Input() isDealTools;
    @Output() isWindowOpened = new EventEmitter;

    public gridData: GridDataResult;        

            
        infoCnt = 0;
        warnCnt = 0;
        infoMsg = "";
        warnMsg = "";
        showDetails = false;
        title ='';
        ngOnInit() {
            this.loadMessageBoardDetails();
        }
        showHideTable(value){
            this.showDetails= value;
        }

        disableEmail() {
            return false;
        }
    openEmailMsg() {
        this.isWindowOpened.emit(false);
        document.body.classList.remove('conManages');
            let rootUrl = window.location.protocol + "//" + window.location.host;
            let items = [];
    
            // Check unique stages as per role
            var stageToCheck = "";
            if ((<any>window).usrRole == "DA") {
                stageToCheck = "Approved"
            } else if ((<any>window).usrRole == "GA") {
                stageToCheck = "Submitted"
            }
    
            // set this flag to false when stages are not unique as per role
            let stagesOK = true;
            let ids =[];
            this.data.forEach((item) => {
                ids.push(item.KeyIdentifiers[0])
            });
            for (let a = 0; a < this.contractData.PRC_ST.length; a++) {
                let stItem = this.contractData.PRC_ST[a];
                if (!!stItem && ids.indexOf(stItem.DC_ID) >= 0) {
                    var item = {
                        "CUST_NM": this.contractData.Customer.CUST_NM,
                        "VERTICAL_ROLLUP": stItem.VERTICAL_ROLLUP,
                        "CNTRCT": "#" + this.contractData.DC_ID + " " + this.contractData.TITLE,
                        "C2A_ID": this.contractData.C2A_DATA_C2A_ID,
                        "DC_ID": stItem.DC_ID,
                        "NEW_STG": stItem.WF_STG_CD,
                        "TITLE": stItem.TITLE,
                        "url": rootUrl + "/Contract#/gotoPs/" + stItem.DC_ID,
                        "contractUrl": rootUrl + "/Dashboard#/contractmanager/CNTRCT/" + this.contractData.DC_ID+ "/0/0/0"
                    };
    
                    if (stageToCheck != "" && stageToCheck != item.NEW_STG) {
                        stagesOK = false;
                    }
    
                    items.push(item);
                }
            }
    
            if (items.length === 0 && !this.isDealTools) {
                alert("No items were selected to email.");
                return;
            }
            if (items.length === 0 && this.isDealTools) {
                alert("No items were approved.");
                return;
            }
            let custNames = [];
            for (var x = 0; x < items.length; x++) {
                if (custNames.indexOf(items[x].CUST_NM) < 0)
                    custNames.push(items[x].CUST_NM);
            }
    
            let subject = "";
            let eBodyHeader = "";
    
            if (stagesOK && (<any>window).usrRole === "DA") {
                subject = "My Deals Deals Approved for ";
                eBodyHeader = "My Deals Deals Approved!";
            } else if (stagesOK && (<any>window).usrRole === "GA") {
                subject = "My Deals Approval Required for "
                eBodyHeader = "My Deals Approval Required!";
            } else {
                subject = "My Deals Action Required for ";
                eBodyHeader = "My Deals Action Required!";
            }
    
            subject = subject + custNames.join(', ') + "!";
    
            let data = {
                from: (<any>window).usrEmail,
                items: items,
                eBodyHeader: eBodyHeader
            }
    
            var itemListRowString=``;
            for(let i=0; i<data.items.length; i++){
                    itemListRowString =itemListRowString+ `<tr>
                    <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span>`+data.items[i].CNTRCT+`</span> </td>
                    <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span>`+ data.items[i].C2A_ID+`</span> </td>
                    <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'><a href='${data.items[i].url}'>`+ data.items[i].DC_ID+`</a>*</span> </td>
                    <td style='width:160px; font-size: 12px; font-family: sans-serif;'><span>`+ data.items[i].TITLE+`</span> </td>
                    <td style='width:100px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'>`+ data.items[i].VERTICAL_ROLLUP+`</span> </td>
                    <td style='width:200px; font-size: 12px; font-family: sans-serif;'><span style='color:#767171;'>Moved to the `+ data.items[i].NEW_STG+` </span> </td>
                    <td style='width:200px; font-size: 12px; font-family: sans-serif;'><span style='color:#1f4e79;'><a href='${data.items[i].url}'>View Pricing Strategy</a>*</span> </td>
                </tr>`
            }
            let valuemsg = `
            <div style='font-family:sans-serif;'>
            <p><span style='font-size:20px; color:#00AEEF; font-weight: 600'>My Deals Action Required!</span></p>
            <p><span style='font-size:18px;'>Pricing Strategies</span></p>
            <p><span style='font-size: 12px;'>The following list of Pricing Strategies have changed.  Click <strong><span style='color:#00AEEF;font-size: 12px;'>View Pricing Strategy</span></strong> <span style='font-size:12px'>in order to view details in My Deals.</span></span></p>
            <table style='width:auto; border-collapse: collapse;table-layout: fixed;overflow: auto;'>
                <thead>
                    <tr>
                        <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Contract</strong></th>
                        <th style='text-align: left; width:80px; font-size: 12px; font-family: sans-serif;'><strong>C2A #</strong></th>
                        <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Strategy #</strong></th>
                        <th style='text-align: left; width:160px; font-size: 12px; font-family: sans-serif;'><strong>Strategy Name</strong></th>
                        <th style='text-align: left; width:100px; font-size: 12px; font-family: sans-serif;'><strong>Verticals</strong></th>
                        <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>New Stage</strong></th>
                        <th style='text-align: left; width:200px; font-size: 12px; font-family: sans-serif;'><strong>Action</strong></th>
                    </tr>
                </thead>
                <tbody>`+itemListRowString+`
                </tbody>
            </table>
           
            <p><span style='font-size: 11px; color: black; font-weight: bold;'>*Links are optimized for Google Chrome</span></p>
            <p><span style='font-size: 14px;'><b>Please respond to: </b> <a href='mailto:${data.from}'>`+data.from+`</a>.</span></p>
         
            <p><span style='font-size: 14px; color: red;'><i>**This email was sent from a notification-only address that cannot accept incoming email.  Please do not reply to this message.</i></span></p>
            </div>
        `;
            var dataItem = {
                from: "mydeals.notification@intel.com",
                to: "",
                subject: subject,
                body: valuemsg
            };
            const dialogRef = this.dialog.open(emailModal, {
                panelClass: 'messageboard-email-dialog',
                width: "900px",
                height: "611px",
                data: {
                    cellCurrValues: dataItem
                }
            });
            dialogRef.afterClosed().subscribe((returnVal) => {
            });
        }
        loadMessageBoardDetails() {
                this.infoCnt = 0;
                this.warnCnt = 0;
                this.infoMsg = "";
                this.warnMsg = "";
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].MsgType === 1) this.infoCnt += 1;
                    if (this.data[i].MsgType === 2) this.warnCnt += 1;
                }
                this.infoMsg = this.infoCnt + (this.infoCnt === 1 ? " stage was successfully changed" : " stages were successfully changed");
                this.warnMsg = this.warnCnt + (this.warnCnt === 1 ? " stage was unable to change" : " stages were unable to change");

                this.title = "Stage was Changed";
                if (this.infoCnt === 0) this.title = "No Stages were Changed";
                this.gridData = this.data;

            };
}

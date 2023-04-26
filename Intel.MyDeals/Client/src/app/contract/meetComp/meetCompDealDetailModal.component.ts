import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Component, ViewEncapsulation, OnInit, Inject} from "@angular/core";
import {GridDataResult,DataStateChangeEvent,PageSizeItem} from "@progress/kendo-angular-grid";
import {process, State} from "@progress/kendo-data-query";
import {logger} from "../../shared/logger/logger";
import { meetCompContractService } from "./meetComp.service";
import { each } from 'underscore';
import { DatePipe } from "@angular/common";

@Component({
  selector: "end-customer-retail",
  templateUrl: "Client/src/app/contract/meetComp/meetCompDealDetailModal.component.html",
  styleUrls: [ "Client/src/app/contract/meetComp/meetCompDealDetailModal.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class meetCompDealDetailModalComponent implements OnInit {

    private gridData: GridDataResult;
    private gridResult;
    private state: State = {
    skip: 0,
    take: 10,
    group: [],
    filter: {
      logic: "and",
      filters: [],
    },
    };
    private pageSizes: PageSizeItem[] = [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
    ];
    private isLoading = true;

    constructor(
        private dialogRef: MatDialogRef<meetCompDealDetailModalComponent>,
        @Inject(MAT_DIALOG_DATA) public deal_properties,
        private meetCompSvc: meetCompContractService, public datepipe: DatePipe,
        private loggerSvc: logger
    ){
        dialogRef.disableClose = true; // prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    close() {
        this.dialogRef.close();
    }

    getDealDetails(DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE){
        this.isLoading = true;
        this.meetCompSvc.getDealDetails(DEAL_OBJ_SID,GRP_PRD_SID,DEAL_PRD_TYPE).subscribe( (response:Array<any>)=> {
            this.isLoading = false;
            if (response && response.length > 0) {
                each(response, item => {
                    item['STRT_DT'] = this.datepipe.transform(new Date(item['STRT_DT']), 'M/d/yyyy');
                    item['END_DT'] = this.datepipe.transform(new Date(item['END_DT']), 'M/d/yyyy');
                    item['STRT_DT'] = new Date(item['STRT_DT']);
                    item['END_DT'] = new Date(item['END_DT']);
                })
                this.gridResult = response;
                this.gridData = process(this.gridResult, this.state);
            }
            else {
                this.loggerSvc.warn('No overlapping deals found',"Warning");
                this.close();
            }
        },(response) =>{
                this.loggerSvc.error("Unable to Get Deal Details", response, response.statusText);
                this.isLoading = false;
                this.close();
        });
    }

    ngOnInit(): void {
        this.getDealDetails(this.deal_properties.DEAL_OBJ_SID,this.deal_properties.GRP_PRD_SID,this.deal_properties.DEAL_PRD_TYPE);
    } 
}

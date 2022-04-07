import { Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GridsterItem} from 'angular-gridster2';
import {NewContractWidgetService} from "./newContractWidget.service"

@Component({
  selector: 'app-widget-newcontract',
  templateUrl: "Client/src/app/dashboard/newContractWidget/newContractWidget.component.html",
  styleUrls: ["Client/src/app/dashboard/newContractWidget/newContractWidget.component.css"]
})
export class NewContractWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;

    resizeSub: Subscription;
    isTender = false;
    C_CREATE_CONTRACT = this.newContractWidgetService.chkDealRules('C_CREATE_CONTRACT',(<any>window).usrRole, null, null, null); //this create contract will be implemented after header component is ready

    //Need to change these text fields on resize event when width increases & decreases
    createContractText = 'Create Contract';
    copyContractText = 'Copy Contract';
    createTenderFolioText = 'Create Tender Folio';
    
    constructor(private newContractWidgetService : NewContractWidgetService){}

  ngOnInit(): void {

    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        console.log('WidgetComponent**********',widget);
      }
    });
    }

  openTenderFolioDialog() {
    //Tender folio component needs to be called and opened from here as a modal
  }
  openCopyCntrctDlg() {
    //copy contract component needs to be called and opened from here as a modal
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {GridsterItem} from 'angular-gridster2';
import { AppEvent, broadCastService } from '../../core/dealPopup/broadcast.service';


@Component({
  selector: 'app-widget-searchcontract',
  templateUrl: 'Client/src/app/dashboard/searchContract/searchContractWidget.component.html',
  styleUrls:['Client/src/app/dashboard/searchContract/searchContractWidget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SearchContractWidgetComponent implements OnInit, OnDestroy {
    constructor(private brdcstservice: broadCastService){
}
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;
  private searchText = "";
  private opType = "ALL";
  private opTypes:Array<any> = [
    {
        value: "ALL",
        label: "All"
    },
    {
        value: "CNTRCT",
        label: "Contract"
    },
    {
        value: "PRC_ST",
        label: "Pricing Strategy"
    },
    {
        value: "PRC_TBL",
        label: "Pricing Table"
    },
    {
        value: "WIP_DEAL",
        label: "Deals"
    }
  ]

    onOpChange(type: string) {
        this.opType = type; 
        if (!!this.searchText && this.searchText != "" && this.searchText != null)
        {
            const sendObj = {
                event: "selectedValue",
                searchText: this.searchText,
                opType: this.opType
            }
            this.brdcstservice.dispatch(new AppEvent("contractSearch", sendObj));
        }
  }

  enterPressed(event:any) {
     const sendObj={
         event: event,
         searchText: this.searchText,
         opType: this.opType
      }
      this.brdcstservice.dispatch(new AppEvent("contractSearch", sendObj));
  }
 

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }
}

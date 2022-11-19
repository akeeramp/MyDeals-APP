import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {GridsterItem} from 'angular-gridster2';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-widget-searchcontract',
  templateUrl: 'Client/src/app/dashboard/searchContract/searchContractWidget.component.html',
  styleUrls:['Client/src/app/dashboard/searchContract/searchContractWidget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SearchContractWidgetComponent implements OnInit, OnDestroy {
constructor(private DashboardComp:DashboardComponent){

}
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;
  private searchText="";
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

  onOpChange(type:string){
    this.DashboardComp.onOpChange(type,this.searchText);
  }

  enterPressed(event:any) {
    this.DashboardComp.enterPressed(event,this.searchText);
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

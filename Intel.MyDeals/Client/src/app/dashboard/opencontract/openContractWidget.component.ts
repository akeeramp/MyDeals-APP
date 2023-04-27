import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation,ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {GridsterItem} from 'angular-gridster2';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-widget-opencontract',
  templateUrl: 'Client/src/app/dashboard/opencontract/openContractWidget.component.html',
  styleUrls: ['Client/src/app/dashboard/opencontract/openContractWidget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class openContractWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;

  resizeSub: Subscription;
  private contractId='';
@ViewChild('txtToolTip', {static: false}) contractToolTip: NgbTooltip;

  openContract(){
    if(this.contractId==''){
      this.contractToolTip.open();
    }
    else{
      this.contractToolTip.close();
      if(!isNaN(parseInt(this.contractId)))
      document.location.href = "/Contract#/manager/" + this.contractId;
    }
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

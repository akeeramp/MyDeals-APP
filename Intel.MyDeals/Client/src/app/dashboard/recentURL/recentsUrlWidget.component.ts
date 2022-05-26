import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {GridsterItem} from 'angular-gridster2';


@Component({
  selector: 'app-widget-recents',
  templateUrl:'Client/src/app/dashboard/recentURL/recentsUrlWidget.component.html',
  styleUrls:['Client/src/app/dashboard/recentURL/recentsUrlWidget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RecentsUrlWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;

  resizeSub: Subscription;
  private recentURLs:Array<any>=[];

  getRecentUrls(){
    const recents= localStorage.getItem('recentsURLs');
    if(recents !=null && recents !=undefined){
      this.recentURLs=recents.split(',');
    }
  }

  ngOnInit(): void {
    this.getRecentUrls();
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

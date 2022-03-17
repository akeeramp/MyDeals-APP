import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'app-dashboard-widget',
  templateUrl: 'Client/src/app/dashboard/dashboardWidget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DashboardWidgetComponent {
  @Input()
  widget;
  @Input()
  resizeEvent;
}

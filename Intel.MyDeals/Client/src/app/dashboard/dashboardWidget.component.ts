import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-widget',
    templateUrl: 'Client/src/app/dashboard/dashboardWidget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DashboardWidgetComponent implements OnInit {

    @Input() widget;
    @Input() resizeEvent;

    @Input() private custIds: string;
    @Input() private startDt: string;
    @Input() private endDt: string;

    ngOnInit(): void {

    }
}

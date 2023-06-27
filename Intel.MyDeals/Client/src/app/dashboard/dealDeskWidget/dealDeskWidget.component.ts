import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { MomentService } from "../../shared/moment/moment.service";

@Component({
    selector: 'app-widget-dealdesk',
    templateUrl: "Client/src/app/dashboard/dealDeskWidget/dealDeskWidget.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DealDeskWidgetComponent implements OnInit, OnDestroy, OnChanges {
    @Input() widget;
    @Input() resizeEvent: EventEmitter<GridsterItem>;

    @Input() private custIds: string;
    @Input() private startDt: string;
    @Input() private endDt: string;

    constructor(private momentService: MomentService) {}

    startDate = this.momentService.moment().subtract(6, 'months').format("MM/DD/YYYY");
    endDate = this.momentService.moment().add(6, 'months').format("MM/DD/YYYY");
    selectedCustomerIds = '[]';
    favCntrctIds = "";
    gridFltr = "";

    public isLoading = true;
    resizeSub: Subscription;

    ngOnChanges(changes: SimpleChanges): void {
        if (!!changes.startDt && changes.startDt.currentValue !== undefined) {
            this.startDate = this.momentService.moment(changes.startDt.currentValue).format("MM/DD/YYYY");
            this.isLoading = true
        }
        if (!!changes.endDt && changes.endDt.currentValue !== undefined) {
            this.endDate = this.momentService.moment(changes.endDt.currentValue).format("MM/DD/YYYY");
            this.isLoading = true;
        }
        if (!!changes.custIds && changes.custIds.currentValue !== undefined) {
            const myCustIds = changes.custIds.currentValue.map(function (obj) {
                return obj.CUST_SID;
            });
            this.selectedCustomerIds = JSON.stringify(myCustIds);
            this.isLoading = true;
        }
    }

    public changeLoadingStatus(value: boolean) {
        if (this.isLoading !== value) {
            this.isLoading = value;
        }
    }

    ngOnInit(): void {
        this.resizeSub = this.resizeEvent.subscribe((widget) => {
            if (widget === this.widget) { // or check id , type or whatever you have there
                // resize your widget, chart, map , etc.
                this.gridValsCheck();
            }
        });
    }

    gridValsCheck() {
        const parentCheck = document.getElementById("parentID");
        const nodesSameClassCheck = parentCheck.getElementsByClassName("few-grid-find");
        const testnodesSameClassCheck = nodesSameClassCheck.length;
        if (testnodesSameClassCheck > 3) {
            $("#height-grids").removeClass("sum-fixes");
            $("#height-grids").addClass("sum-fixes-plus");
        } else {
            $("#height-grids").addClass("sum-fixes");
            $("#height-grids").removeClass("sum-fixes-plus");
        }
    }

    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
    }
}
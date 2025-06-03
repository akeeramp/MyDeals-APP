import { Component, OnDestroy } from "@angular/core";
import { adminBannerService } from './adminBanner.service';
import { logger } from "../../shared/logger/logger";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'admin-banner-angular',
    templateUrl: 'Client/src/app/core/adminBanner/adminBanner.component.html',
    styleUrls: ['Client/src/app/core/adminBanner/adminBanner.component.css']
})
export class AdminBannerComponent implements OnDestroy {
    constructor(private adminSvc: adminBannerService, private loggerSvc: logger) {}

    private adminBannerMessage = "";
    private adminMessage = "ADMIN_MESSAGE";
    private userDismissed;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    GetAdminMessage() {
        this.userDismissed = localStorage.getItem('userDismissed') == undefined ? 1 : localStorage.getItem('userDismissed');
        this.adminSvc.getConstantsByName(this.adminMessage).pipe(takeUntil(this.destroy$)).subscribe((result) => {
            if (result) {
                this.adminBannerMessage = result.CNST_VAL_TXT === 'NA'
                    ? "" : result.CNST_VAL_TXT;

            }
        }, (error) => {
            this.loggerSvc.error('Something Went Wrong', error.statusText);
        });


    }
    close() {
        if (this.userDismissed == 1) this.userDismissed = 0; else this.userDismissed = 1;
        localStorage.setItem('userDismissed', this.userDismissed);
    }

    ngOnInit() {
        this.GetAdminMessage();

    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

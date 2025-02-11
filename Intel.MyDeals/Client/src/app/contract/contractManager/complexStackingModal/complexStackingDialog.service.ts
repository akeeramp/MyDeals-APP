import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { DynamicObj } from "../../../admin/employee/admin.employee.model";
import { ComplexStackingModalComponent } from "./complexStackingModal.component";
import { logger } from "../../../shared/logger/logger";
import { ComplexStackingModalService } from "./complexStackingModal.service";

@Injectable({
    providedIn: 'root'
})
export class ComplexStackingDialogService {

    constructor(protected dialog: MatDialog, private complexStackingModalsvc: ComplexStackingModalService,private loggerSvc: logger,) { }

    public fetchAndShowComplexStakingOverlappingDeals(ovlpObjs, fromSubmit = false, fromToggle = false, checkForRequirements = false): Observable<ComplexStakingStatusInfo> {
        const subject = new Subject<ComplexStakingStatusInfo>();

        this.complexStackingModalsvc.getComplexStackingGroup(ovlpObjs).toPromise()
            .then((ovlpResponse) => {
                if (ovlpResponse.GroupItems && ovlpResponse.GroupItems.length > 0) {
                    subject.next({ isLoading: false, GroupingCount: ovlpResponse.GroupItems.length });
                    const DIALOG_REF = this.dialog.open(ComplexStackingModalComponent, {
                        maxWidth: '80%',
                        panelClass: 'complex-stacking-dialog',
                        data: {
                            ovlpObjs: ovlpResponse
                        }
                    });
                    DIALOG_REF.afterClosed().subscribe(async (inputData: DynamicObj[]) => {
                        if (inputData.length > 0) {
                            subject.next({ isLoading: true, isUpdatingDetails: true, isAccepted: true });
                            const response = await this.complexStackingModalsvc.updateComplexStackingDealGroup(inputData).toPromise().catch((error) => {
                                subject.next({ isLoading: false,isUpdatingDetails: false, isAccepted: true });
                                this.loggerSvc.error('Get Update Complex Stacking Deal Group', error);
                            });
                            if (response) {
                                subject.next({ isLoading: false, isUpdatingDetails: true, isAccepted: true });
                                if (fromSubmit) {
                                    this.loggerSvc.success('Will continue with submitting state.', 'Accepted Complex Stacking')
                                    subject.next({ GroupingCount: ovlpResponse.GroupItems.length, isFormSubmit: true });

                                } else if (fromToggle) {
                                    this.loggerSvc.success('Will continue with submitting state.', 'Accepted Complex Stacking')
                                    subject.next({ isFormToggle: true });
                                } else {
                                    this.loggerSvc.success('Complex Stacking was reviewed.', 'Accepted Complex Stacking')
                                    subject.next({ GroupingCount: ovlpResponse.GroupItems.length, isAccepted: true });
                                }
                            }
                        } else {
                            this.loggerSvc.warn('Must accept Complex Stacking to continue with submitting for Approval.', 'Submission Cancelled')
                        }
                    });
                } else {
                    subject.next({ isLoading: false, GroupingCount: ovlpResponse.GroupItems.length });
                    this.loggerSvc.success('No complex grouping available.', 'Complex Stacking');
                    if (fromSubmit) {
                        subject.next({ GroupingCount: ovlpResponse.GroupItems.length, isFormSubmit: true });
                    } else {
                        subject.next({ GroupingCount: ovlpResponse.GroupItems.length, isAccepted: false });
                    }
                }
            })
            .catch((error) => {
                subject.next({ isLoading: false});
                this.loggerSvc.error('Get Complex Stacking Deal Group', error);
            });
        return subject.asObservable();
    }
}

interface ComplexStakingStatusInfo {
    isLoading?: boolean;
    isUpdatingDetails?: boolean;
    GroupingCount?: number;
    isAccepted?: boolean;
    isFormSubmit?: boolean;
    isFormToggle?: boolean;
}
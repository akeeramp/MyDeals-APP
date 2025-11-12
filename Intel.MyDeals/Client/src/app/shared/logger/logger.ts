import { ToastrService, ActiveToast } from 'ngx-toastr';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class logger {
    constructor(private toastr: ToastrService) { }

    info(message: string, title: string): void {

        this.toastr.info(message, title, {
            closeButton: true,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        });
    }
    error(message: string, title: string, error?: any): void {
        console.error(message, title, error);
        this.toastr.error(message, title, {
            closeButton: true,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        });
    }
    success(message: string, title?: string): void {
        this.toastr.success(message, title, {
            closeButton: true,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        });
    }
    warn(message: string, title: string): void {
        this.toastr.warning(message, title, {
            closeButton: true,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        });
    }
    warnPersistent(message: string, title: string): ActiveToast<any> {
        return this.toastr.warning(message, title, {
            closeButton: true,
            disableTimeOut: true,
            positionClass: 'toast-bottom-right'
        });
    }
    dismissLogger(toast: ActiveToast<any>): void {
        if (toast && toast.toastId) {
            this.toastr.remove(toast.toastId);
        }
    }
}
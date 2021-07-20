import * as toastr from 'toastr';

export class logger {
    constructor() {

    }
  static info( message : string ,title:string ) :void {
    toastr.options = {
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    };
    toastr.info(message,title);
  }
  static error(message : string ,title:string ) :void {
    toastr.options = {
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    };
    toastr.error(message,title);
  }
    static success(message: string, title: string): void {

        toastr.options = {
            closeButton: false,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        };
        toastr.success(message, title);
    }

    static warn(message: string, title: string): void {

        toastr.options = {
            closeButton: false,
            extendedTimeOut: 4000,
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        };
        toastr.console.warn(message, title);
    }
}
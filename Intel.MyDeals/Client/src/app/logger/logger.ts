import * as toastr from 'toastr';

export class logger {
    constructor() {
    }
  static info( message : string ,title:string ) :void {
    toastr.options = {
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000
    };
    toastr.info(message,title);
  }
  static error(message : string ,title:string ) :void {
    toastr.options = {
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000
    };
    toastr.error(message,title);
  }
}
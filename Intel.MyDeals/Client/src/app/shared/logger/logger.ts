import { ToastrService } from 'ngx-toastr';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
 })

export class logger {
    constructor(private toastr: ToastrService) {}

   info( message : string ,title:string ) :void {
   
    this.toastr.info(message, title,{
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    });
  }
   error(message : string ,title:string,data?:string ) :void {
    this.toastr.error(message, title,{
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    });
  }
   success(message: string, title?: string): void {
    this.toastr.success(message, title,{
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    });
  }
  warn(message: string, title: string): void { 
    this.toastr.warning(message, title,{
        closeButton: false,
        extendedTimeOut: 4000,
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
    });
}
  
   
}
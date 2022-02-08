import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { finalize } from "rxjs/operators";
import { LoadingSpinnerService } from '../loadingSpinner/loadingspinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(protected loadingSVC:LoadingSpinnerService){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingSVC.isLoading.next(true);
    req = req.clone({
      setHeaders: {
        'ReqVerToken': `${AuthService.getToken()}`
      },
    });
 
    return next.handle(req).pipe(finalize(() =>{
      this.loadingSVC.isLoading.next(false);
    }));
  }
}
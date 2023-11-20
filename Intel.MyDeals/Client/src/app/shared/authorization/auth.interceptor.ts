import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { AuthService } from './auth.service';
import { LoadingSpinnerService } from '../loadingSpinner/loadingSpinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(protected loadingSpinnerService:LoadingSpinnerService){ }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingSpinnerService.isLoading.next(true);
    req = req.clone({
      setHeaders: {
        'ReqVerToken': `${AuthService.getToken()}`
      },
    });
 
    return next.handle(req).pipe(finalize(() =>{
      this.loadingSpinnerService.isLoading.next(false);
    }));
  }

}
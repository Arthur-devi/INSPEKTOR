import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpXsrfTokenExtractor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenExtractor.getToken() as string;
    if (token && !req.headers.has('X-XSRF-TOKEN')) {
      const authReq = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', token)
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

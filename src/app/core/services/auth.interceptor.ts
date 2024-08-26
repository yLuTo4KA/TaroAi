import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const tokenType = 'Bearer';

    if (!token) return next.handle(request);

    request = request.clone({
      headers: request.headers.set('authorization', `${token}`),
    });

    return next.handle(request);
  }
}

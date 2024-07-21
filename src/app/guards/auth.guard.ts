import { CanActivateFn } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthGuard: CanActivateFn = (route, state) => {
   return inject(AuthService).isLoggin() ? true : inject(Router).createUrlTree(['/notAuth']);
}
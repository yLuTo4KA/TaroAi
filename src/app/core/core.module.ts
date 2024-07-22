import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAuthComponent } from './components/not-auth/not-auth.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  imports: [CommonModule,RouterModule,SharedModule],
  declarations: [ShellComponent, NotAuthComponent, FooterComponent],
  exports: [ShellComponent, NotAuthComponent, FooterComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}

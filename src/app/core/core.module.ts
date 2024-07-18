import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAuthComponent } from './components/not-auth/not-auth.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [CommonModule,RouterModule],
  declarations: [ShellComponent, NotAuthComponent, FooterComponent],
  exports: [ShellComponent, NotAuthComponent, FooterComponent],
})
export class CoreModule {}

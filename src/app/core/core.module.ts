import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAuthComponent } from './components/not-auth/not-auth.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TarotComponent } from './pages/tarot/tarot.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShopComponent } from './pages/shop/shop.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ProfileInfoComponent } from './pages/profile/children/profile-info/profile-info.component';
import { ProfileSpreadsComponent } from './pages/profile/children/profile-spreads/profile-spreads.component';
import { ProfileSettingsComponent } from './pages/profile/children/profile-settings/profile-settings.component';



@NgModule({
  imports: [CommonModule,RouterModule,SharedModule, MatIconModule],
  declarations: [ShellComponent, NotAuthComponent, FooterComponent, TarotComponent, ProfileComponent, ShopComponent, FriendsComponent, TasksComponent, ProfileInfoComponent, ProfileSpreadsComponent, ProfileSettingsComponent],
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthComponent } from './core/components/not-auth/not-auth.component';
import { TarotComponent } from './core/pages/tarot/tarot.component';
import { ProfileComponent } from './core/pages/profile/profile.component';
import { FriendsComponent } from './core/pages/friends/friends.component';
import { TasksComponent } from './core/pages/tasks/tasks.component';
import { ShopComponent } from './core/pages/shop/shop.component';
import { ProfileInfoComponent } from './core/pages/profile/children/profile-info/profile-info.component';
import { ProfileSpreadsComponent } from './core/pages/profile/children/profile-spreads/profile-spreads.component';
import { ProfileSettingsComponent } from './core/pages/profile/children/profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tarot',
    pathMatch: 'full',
  },
  {
    path: 'notAuth',
    component: NotAuthComponent,
  },

  {
    path: 'tarot',
    component: TarotComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/profile/info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: ProfileInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'spreads',
        component: ProfileSpreadsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: '/profile/info',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/tarot',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

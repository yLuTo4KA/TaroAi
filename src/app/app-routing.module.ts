import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthComponent } from './core/components/not-auth/not-auth.component';
import { TarotComponent } from './core/pages/tarot/tarot.component';
import { ProfileComponent } from './core/pages/profile/profile.component';
import { FriendsComponent } from './core/pages/friends/friends.component';
import { TasksComponent } from './core/pages/tasks/tasks.component';
import { ShopComponent } from './core/pages/shop/shop.component';

const routes: Routes = [
  // path: 'authentication',
  // loadChildren: () =>
  // import('./').then(((m => m.Module)))
  {
    path: '',
    redirectTo: '/tarot',
    pathMatch: 'full'
  },
  {
    path: 'notAuth',
    component: NotAuthComponent,
  },
  // {
  //   path: 'ranking',
  //   loadChildren: () =>
  //     import('./features/ranking/ranking.module').then((m) => m.RankingModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'tarot',
    component: TarotComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
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

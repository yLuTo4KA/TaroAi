import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthComponent } from './core/components/not-auth/not-auth.component';

const routes: Routes = [
  // path: 'authentication',
  // loadChildren: () =>
  // import('./').then(((m => m.Module)))
  {
    path: '',
    redirectTo: '/ranking',
    pathMatch: 'full'
  },
  {
    path: 'notAuth',
    component: NotAuthComponent,
  },
  {
    path: 'ranking',
    loadChildren: () =>
      import('./features/ranking/ranking.module').then((m) => m.RankingModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/ranking',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

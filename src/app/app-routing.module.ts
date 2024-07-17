import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // path: 'authentication',
    // loadChildren: () =>
    // import('./').then(((m => m.Module)))
  {
    path: 'ranking',
    loadChildren: () =>
      import('./features/ranking/ranking.module').then((m) => m.RankingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

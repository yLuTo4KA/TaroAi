import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankingPageComponent } from './pages/ranking-page/ranking-page.component';


const routes: Routes = [
  { path: '', component: RankingPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RankingRoutes {};

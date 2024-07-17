import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RankingRoutes } from './ranking.routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RankingRoutes
  ],
  declarations: []
})
export class RankingModule { }

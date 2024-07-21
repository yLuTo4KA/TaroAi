import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RankingRoutes } from './ranking.routing.module';
import { RankingListComponent } from './components/ranking-list/ranking-list.component';
import { RankingPageComponent } from './pages/ranking-page/ranking-page.component';
import { RankingTopComponent } from './components/ranking-top/ranking-top.component';
import { RankingItemComponent } from './components/ranking-item/ranking-item.component';
import { RankingPaymentComponent } from './components/ranking-payment/ranking-payment.component';

@NgModule({
  imports: [CommonModule, SharedModule, RankingRoutes],
  declarations: [
    RankingListComponent,
    RankingPageComponent,
    RankingTopComponent,
    RankingPaymentComponent,
    RankingItemComponent
  ],
})
export class RankingModule {}

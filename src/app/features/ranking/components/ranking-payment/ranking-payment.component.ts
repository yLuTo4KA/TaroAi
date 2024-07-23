import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-ranking-payment',
  templateUrl: './ranking-payment.component.html',
  styleUrls: ['./ranking-payment.component.scss']
})
export class RankingPaymentComponent {
  @Output() buyEmit = new EventEmitter<number>();

  public prices = [
    {
      count: 500,
      price: 500
    },
    {
      count: 2500,
      price: 2500
    },
    {
      count: 10000,
      price: 10000
    },
    {
      count: 30000,
      price: 30000
    },
    {
      count: 50000,
      price: 50000
    },
  ]

  public action: number | null = null; // count x 2 (count 5000 = count 10000) 

  public currentPrice: number = this.prices[1].price;
  constructor() { }

  formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  onBuy(): void {
    this.buyEmit.emit(this.currentPrice);
  }

}

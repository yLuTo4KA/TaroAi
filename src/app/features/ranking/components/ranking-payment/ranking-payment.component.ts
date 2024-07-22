import { Component } from '@angular/core';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-ranking-payment',
  templateUrl: './ranking-payment.component.html',
  styleUrls: ['./ranking-payment.component.scss']
})
export class RankingPaymentComponent {
  public prices = [
    {
      count: 250,
      price: 500
    },
    {
      count: 1250,
      price: 2500
    },
    {
      count: 5000,
      price: 10000
    },
    {
      count: 15000,
      price: 30000
    },
    {
      count: 25000,
      price: 50000
    },
  ]

  public action: number | null = null; // count x 2 (count 5000 = count 10000) 

  public currentPrice: number = this.prices[1].price;
  constructor(private paymentService: PaymentService) { }

  formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  buy(currentPrice: number) {
    this.paymentService.paymentRequest(currentPrice).subscribe(() => {
      console.log(123);
    });
  }
}

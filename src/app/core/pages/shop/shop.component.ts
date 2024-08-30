import { Component, inject } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { initInvoice } from '@telegram-apps/sdk';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);

  viewTokenModal: boolean = false;
  public prices = [
    {
      count: 10,
      price: 20
    },
    {
      count: 50,
      price: 100
    },
    {
      count: 100,
      price: 150
    },
    {
      count: 200,
      price: 250
    },
    {
      count: 500,
      price: 400
    },
  ]
  public currentPrice = this.prices[1];

  closeTokenModal(): void {
    this.viewTokenModal = false;
  }
  openTokenModal(): void {
    this.viewTokenModal = true;
  }

  pickPrice(price: any) {
    this.currentPrice = price;
  }

  handlePaymentRequest(star_amount: number, div_amount: number): void {
    this.paymentService.paymentRequest(star_amount, div_amount).subscribe(response => {
      if(response && response.url) {
        const invoice = initInvoice();
        invoice.open(response.url, 'url').then((status) => {
          if(status === 'paid') {
            this.authService.getProfile().subscribe(response => {
              if(response) {
                this.closeTokenModal();
              }
            });
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    
  }

}

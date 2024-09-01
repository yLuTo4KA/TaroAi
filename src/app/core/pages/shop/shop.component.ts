import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { initInvoice } from '@telegram-apps/sdk';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { ShopItem } from '../../models/shop-item.model';
import { Subscription } from 'rxjs';
import { PurchaseItem } from '../../models/purhcase-item.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private shopService = inject(ShopService);

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

  public purchaseItem: PurchaseItem[] | null = null;
  public shopItems: ShopItem[] | null = null;
  private shopItemsSub: Subscription | undefined;


  ngOnInit(): void {
    this.authService.userPurchases$.subscribe(response => {
      this.purchaseItem = response;
    })
    this.shopItemsSub = this.shopService.getItems().subscribe(response => {
      this.shopItems = response;
    });
  }

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
      if(response && response.link) {
        const invoice = initInvoice();
        invoice.open(response.link, 'url').then((status) => {
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

  getCurrentLevel(itemId: string): number {
    if(this.purchaseItem) {
      const currentItem = this.purchaseItem.find((item) => item.item_id === itemId);

      if(currentItem) {
        return currentItem.level;
      }
      return 0;
    }
    return 0;
  }

  ngOnDestroy(): void {
    if(this.shopItemsSub) {
      this.shopItemsSub.unsubscribe();
    }
  }

}

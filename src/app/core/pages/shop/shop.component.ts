import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { initInvoice } from '@telegram-apps/sdk';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { ShopItem } from '../../models/shop-item.model';
import { Subscription } from 'rxjs';
import { PurchaseItem } from '../../models/purhcase-item.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { UserData } from '../../models/userData.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private shopService = inject(ShopService);

  viewTokenModal: boolean = false;
  viewUpgradeModal: boolean = false;

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


  public userData: UserData | null = null;
  private userDataSubscription: Subscription | undefined;
  public purchaseItem: PurchaseItem[] | null = null;
  public shopItems: ShopItem[] | null = null;
  private shopItemsSub: Subscription | undefined;

  public loadingUpgrade: boolean = false;

  public selectItem: ShopItem | null = null;

  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.userDataSubscription = this.authService.userData$.subscribe(response => {
      this.userData = response;
    })
    this.authService.userPurchases$.subscribe(response => {
      this.purchaseItem = response;
    })
    this.loadShopItems();
  }

  loadShopItems(): void {
    this.shopItemsSub = this.shopService.getItems().subscribe(response => {
      this.shopItems = response;
    })
  }

  changeViewTokenModal(): void {
    this.viewTokenModal = !this.viewTokenModal;
  }
  changeViewUpgeadeModal(selectShopItem: ShopItem | null = null): void {
    if (selectShopItem) {
      this.selectItem = selectShopItem;
    }
    this.viewUpgradeModal = !this.viewUpgradeModal;
  }

  pickPrice(price: any) {
    this.currentPrice = price;
  }

  handlePaymentRequest(star_amount: number, div_amount: number): void {
    this.paymentService.paymentRequest(star_amount, div_amount).subscribe(response => {
      if (response && response.link) {
        const invoice = initInvoice();
        invoice.open(response.link, 'url').then((status) => {
          if (status === 'paid') {
            this.authService.getProfile().subscribe(response => {
              if (response) {
                this.changeViewTokenModal();
              }
            });
          }
        })
      }
    })
  }

  getCurrentLevel(itemId: string, maxLevel: number): number {
    if (this.purchaseItem) {
      const currentItem = this.purchaseItem.find((item) => item.item_id === itemId);

      if (currentItem) {
        return currentItem.level >= maxLevel ? maxLevel : currentItem.level;
      }
      return 0;
    }
    return 0;
  }

  itsMax(currentItem: ShopItem): boolean {
    const currentLevel = this.getCurrentLevel(currentItem._id, currentItem.max_level);
    if (currentLevel >= currentItem.max_level) {
      return true
    }
    return false
  }

  getLevelInfo(currentItem: ShopItem): SafeHtml {
    const currentLevel = this.getCurrentLevel(currentItem._id, currentItem.max_level);
    const itsMax = this.itsMax(currentItem);
    let htmlContent;

    if (itsMax) {
      htmlContent = `<p class="shop-page__item-level-num">${currentLevel} Lvl</p> <p class="shop-page__item-level-max">MAX</p>`
    } else {
      htmlContent = `<p class="shop-page__item-level-num">${currentLevel} Lvl -> ${currentLevel + 1} Lvl</p>`
    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  upgradeItem(currentItem: ShopItem): void {
    if (this.userData && !this.loadingUpgrade) {
      if (this.userData?.DIV_balance >= currentItem.price) {
        this.loadingUpgrade = true;
        this.shopService.upgradeItem(currentItem._id).subscribe({
          next: (response) => {
            this.authService.getProfile().subscribe();
            this.authService.getPurchases().subscribe(response => {
              this.loadingUpgrade = false;
              this.loadShopItems();
              this.changeViewUpgeadeModal();
            });
          },
          error: (error) => {
            this.loadingUpgrade = false;
          }
        })
      } else {
        this.changeViewUpgeadeModal();
        this.changeViewTokenModal();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.shopItemsSub) {
      this.shopItemsSub.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

}

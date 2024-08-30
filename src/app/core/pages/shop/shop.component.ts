import { Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  viewTokenModal: boolean = false;

  closeTokenModal(): void {
    this.viewTokenModal = false;
  }
  openTokenModal(): void {
    this.viewTokenModal = true;
  }

}

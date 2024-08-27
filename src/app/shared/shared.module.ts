import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorComponent } from './components/sector/sector.component';
import { ButtonComponent } from './components/button/button.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoltLightning, faClock, faStar, faUserGroup, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from './components/modal/modal.component';
import { IconBlockComponent } from './components/icon-block/icon-block.component';
import { ProductBlockComponent } from './components/product-block/product-block.component';
import { BalanceComponent } from './components/balance/balance.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FontAwesomeModule
  ],
  declarations: [SectorComponent, ButtonComponent, AvatarComponent, ModalComponent, IconBlockComponent, ProductBlockComponent, IconBlockComponent, ProductBlockComponent, BalanceComponent],
  exports: [    
    SectorComponent,
    ButtonComponent,
    AvatarComponent,
    ModalComponent,
    IconBlockComponent,
    ProductBlockComponent,
    FontAwesomeModule,
    BalanceComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faWallet,
      faBoltLightning,
      faUserGroup,
      faStar,
      faClock
    );
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorComponent } from './components/sector/sector.component';
import { ButtonComponent } from './components/button/button.component';
import { AvatarComponent } from './components/avatar/avatar.component';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoltLightning, faClock, faStar, faUserGroup, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [SectorComponent, ButtonComponent, AvatarComponent, ModalComponent],
  exports: [    
    SectorComponent,
    ButtonComponent,
    AvatarComponent,
    ModalComponent,
    FontAwesomeModule
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

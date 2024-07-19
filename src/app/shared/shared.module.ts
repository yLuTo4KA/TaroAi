import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorComponent } from './components/sector/sector.component';
import { ButtonComponent } from './components/button/button.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [SectorComponent, ButtonComponent, AvatarComponent, StatCardComponent],
  exports: [    
    SectorComponent,
    ButtonComponent,
    AvatarComponent,
    StatCardComponent,
    FontAwesomeModule
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faWallet
    );
  }
}

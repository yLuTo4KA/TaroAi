import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorComponent } from './components/sector/sector.component';
import { ButtonComponent } from './components/button/button.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [SectorComponent, ButtonComponent, AvatarComponent, StatCardComponent],
  exports: [    
    SectorComponent,
    ButtonComponent,
    AvatarComponent,
    StatCardComponent
  ]
})
export class SharedModule { }

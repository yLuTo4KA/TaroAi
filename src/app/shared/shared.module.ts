import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorComponent } from './components/sector/sector.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [SectorComponent, ButtonComponent],
  exports: [    
    SectorComponent,
    ButtonComponent
  ]
})
export class SharedModule { }

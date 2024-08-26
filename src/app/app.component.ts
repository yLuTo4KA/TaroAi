import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon(
      'icon_cards',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cards.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_tasks',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/tasks.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_friends',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/friends.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_shop',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/shop.svg")
    );
  }
}
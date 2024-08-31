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
    this.matIconRegistry.addSvgIcon(
      'icon_profile',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/profile.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_settings',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/settings.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_token',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/token.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_close',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/close.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_ruFlag',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/ruFlag.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_usaFlag',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/usaFlag.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'icon_libra',
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/libra.svg")
    );


    
  }
}
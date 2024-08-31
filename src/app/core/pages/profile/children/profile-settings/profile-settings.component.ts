import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
interface Lang {
  lang: string,
  title: string,
  icon: string
}

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent{
  public currentLang: string;
  public viewChangeLangModal: boolean = false;
  public availableLang: Lang[] = [
    {
      lang: "ru",
      title: "Русский",
      icon: "icon_ruFlag"
    },
    {
      lang: "en",
      title: "English",
      icon: "icon_usaFlag"
    }
  ]
  public selectLang;
 
  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang;
    this.selectLang = this.currentLang === 'en' ? this.availableLang[1] : this.availableLang[0]
  }
  
  
  changeViewLangModal(): void {
    this.viewChangeLangModal = !this.viewChangeLangModal;
  }

  changeLanguage(langItem: Lang): void {
    this.translate.use(langItem.lang);
    this.selectLang = langItem;
    localStorage.setItem("lang", langItem.lang);
  }
}

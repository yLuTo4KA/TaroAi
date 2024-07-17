import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
    window;
    tg;
  constructor(@Inject(DOCUMENT) private _document: any) {
    this.window = this._document.defaultView;
    this.tg = this.window!.Telegram.WebApp;
  }

  log(){
    console.log(this.tg);
    
  }



}

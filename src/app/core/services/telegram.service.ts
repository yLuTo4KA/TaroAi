import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
    private window;
    tg;
    dummyResponse = true; 

  constructor(@Inject(DOCUMENT) private _document: any) {
    this.window = this._document.defaultView;
    this.tg = this.window!.Telegram.WebApp;
  }

  initData(): string {
    return this.tg.initData;
  }
  expand(): void {
    this.tg.expand();
  }
}

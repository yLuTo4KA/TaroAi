import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { initUtils } from '@telegram-apps/sdk';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
    private window;
    tg;
    dummyResponse = true; 
    private utils = initUtils();

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

  shareRefLink(refKey: string): void {
    this.utils.shareURL(refKey);
  }
}
